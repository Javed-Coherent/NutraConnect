'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Device, Call } from '@twilio/voice-sdk';

export type CallStatus =
  | 'idle'
  | 'connecting'
  | 'ringing'
  | 'in-progress'
  | 'disconnected'
  | 'error';

interface UseTwilioVoiceReturn {
  // State
  isReady: boolean;
  isConfigured: boolean;
  status: CallStatus;
  activeCall: Call | null;
  callDuration: number;
  error: string | null;

  // Actions
  initializeDevice: () => Promise<boolean>;
  makeCall: (params: { to: string; toName?: string }) => Promise<boolean>;
  hangUp: () => void;
  toggleMute: () => void;
  isMuted: boolean;
}

export function useTwilioVoice(): UseTwilioVoiceReturn {
  const [device, setDevice] = useState<Device | null>(null);
  const [activeCall, setActiveCall] = useState<Call | null>(null);
  const [status, setStatus] = useState<CallStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isConfigured, setIsConfigured] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Start call duration timer
  const startDurationTimer = useCallback(() => {
    setCallDuration(0);
    durationIntervalRef.current = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
  }, []);

  // Stop call duration timer
  const stopDurationTimer = useCallback(() => {
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
      durationIntervalRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopDurationTimer();
      if (device) {
        device.destroy();
      }
    };
  }, [device, stopDurationTimer]);

  // Initialize the Twilio Device
  const initializeDevice = useCallback(async (): Promise<boolean> => {
    try {
      setError(null);

      // Fetch access token from our API
      const response = await fetch('/api/workspace/calls/token');
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 503) {
          setIsConfigured(false);
          setError('VoIP calling is not configured');
        } else {
          setError(data.error || 'Failed to get access token');
        }
        return false;
      }

      // Create new Device
      const newDevice = new Device(data.token, {
        codecPreferences: [Call.Codec.Opus, Call.Codec.PCMU],
        enableRingingState: true,
      });

      // Set up device event handlers
      newDevice.on('registered', () => {
        console.log('[Twilio] Device registered');
        setIsReady(true);
      });

      newDevice.on('error', (error) => {
        console.error('[Twilio] Device error:', error);
        setError(error.message);
        setStatus('error');
      });

      newDevice.on('incoming', (call) => {
        console.log('[Twilio] Incoming call from:', call.parameters.From);
        // Handle incoming calls if needed
      });

      // Register the device
      await newDevice.register();
      setDevice(newDevice);

      return true;
    } catch (err) {
      console.error('[Twilio] Error initializing device:', err);
      setError('Failed to initialize voice device');
      return false;
    }
  }, []);

  // Make an outgoing call
  const makeCall = useCallback(
    async (params: { to: string; toName?: string }): Promise<boolean> => {
      if (!device || !isReady) {
        setError('Device not ready');
        return false;
      }

      try {
        setError(null);
        setStatus('connecting');

        // Make the call
        const call = await device.connect({
          params: {
            To: params.to,
          },
        });

        // Set up call event handlers
        call.on('ringing', () => {
          console.log('[Twilio] Call ringing');
          setStatus('ringing');
        });

        call.on('accept', () => {
          console.log('[Twilio] Call accepted');
          setStatus('in-progress');
          startDurationTimer();
        });

        call.on('disconnect', () => {
          console.log('[Twilio] Call disconnected');
          setStatus('disconnected');
          setActiveCall(null);
          stopDurationTimer();
          setTimeout(() => setStatus('idle'), 2000);
        });

        call.on('cancel', () => {
          console.log('[Twilio] Call cancelled');
          setStatus('idle');
          setActiveCall(null);
          stopDurationTimer();
        });

        call.on('error', (error) => {
          console.error('[Twilio] Call error:', error);
          setError(error.message);
          setStatus('error');
          setActiveCall(null);
          stopDurationTimer();
        });

        setActiveCall(call);
        return true;
      } catch (err) {
        console.error('[Twilio] Error making call:', err);
        setError('Failed to initiate call');
        setStatus('error');
        return false;
      }
    },
    [device, isReady, startDurationTimer, stopDurationTimer]
  );

  // Hang up the current call
  const hangUp = useCallback(() => {
    if (activeCall) {
      activeCall.disconnect();
      setActiveCall(null);
      stopDurationTimer();
      setStatus('idle');
    }
  }, [activeCall, stopDurationTimer]);

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (activeCall) {
      const newMuteState = !isMuted;
      activeCall.mute(newMuteState);
      setIsMuted(newMuteState);
    }
  }, [activeCall, isMuted]);

  return {
    isReady,
    isConfigured,
    status,
    activeCall,
    callDuration,
    error,
    initializeDevice,
    makeCall,
    hangUp,
    toggleMute,
    isMuted,
  };
}
