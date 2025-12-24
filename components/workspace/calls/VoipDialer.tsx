'use client';

import { useState, useEffect } from 'react';
import { Phone, PhoneOff, Mic, MicOff, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTwilioVoice, CallStatus } from '@/lib/hooks/useTwilioVoice';

interface VoipDialerProps {
  prefillNumber?: string;
  prefillName?: string;
  companyId?: number;
  onCallStart?: (callData: { toNumber: string; toName?: string }) => void;
  onCallEnd?: (duration: number) => void;
}

export function VoipDialer({
  prefillNumber = '',
  prefillName = '',
  onCallStart,
  onCallEnd,
}: VoipDialerProps) {
  const [phoneNumber, setPhoneNumber] = useState(prefillNumber);
  const [contactName, setContactName] = useState(prefillName);
  const [initialized, setInitialized] = useState(false);

  const {
    isReady,
    isConfigured,
    status,
    callDuration,
    error,
    initializeDevice,
    makeCall,
    hangUp,
    toggleMute,
    isMuted,
  } = useTwilioVoice();

  // Initialize device on mount
  useEffect(() => {
    if (!initialized) {
      initializeDevice().then((success) => {
        setInitialized(true);
      });
    }
  }, [initialized, initializeDevice]);

  // Update prefill values
  useEffect(() => {
    if (prefillNumber) setPhoneNumber(prefillNumber);
    if (prefillName) setContactName(prefillName);
  }, [prefillNumber, prefillName]);

  // Handle call end
  useEffect(() => {
    if (status === 'disconnected' && onCallEnd) {
      onCallEnd(callDuration);
    }
  }, [status, callDuration, onCallEnd]);

  const handleCall = async () => {
    if (!phoneNumber.trim()) return;

    const success = await makeCall({
      to: phoneNumber,
      toName: contactName || undefined,
    });

    if (success && onCallStart) {
      onCallStart({ toNumber: phoneNumber, toName: contactName || undefined });
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusText = (status: CallStatus): string => {
    switch (status) {
      case 'connecting':
        return 'Connecting...';
      case 'ringing':
        return 'Ringing...';
      case 'in-progress':
        return formatDuration(callDuration);
      case 'disconnected':
        return 'Call ended';
      case 'error':
        return 'Call failed';
      default:
        return '';
    }
  };

  const isInCall = ['connecting', 'ringing', 'in-progress'].includes(status);

  // Not configured state
  if (!isConfigured) {
    return (
      <Card className="border border-yellow-200 dark:border-yellow-800 dark:bg-gray-800">
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-12 w-12 mx-auto text-yellow-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            VoIP Not Configured
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Browser-based calling requires Twilio configuration.
            Contact your administrator to set up VoIP calling.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-gray-200 dark:border-gray-700 dark:bg-gray-800">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <Phone className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" />
          {isInCall ? 'Active Call' : 'Quick Dial'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isInCall ? (
          // Active call UI
          <div className="text-center py-6">
            <div className={`h-20 w-20 rounded-full mx-auto mb-4 flex items-center justify-center ${
              status === 'in-progress'
                ? 'bg-green-100 dark:bg-green-900/50 animate-pulse'
                : 'bg-gray-100 dark:bg-gray-700'
            }`}>
              <Phone className={`h-10 w-10 ${
                status === 'in-progress'
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-gray-400'
              }`} />
            </div>

            <p className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
              {contactName || phoneNumber}
            </p>
            {contactName && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                {phoneNumber}
              </p>
            )}

            <p className={`text-lg mb-6 ${
              status === 'in-progress'
                ? 'text-green-600 dark:text-green-400 font-mono'
                : 'text-gray-500 dark:text-gray-400'
            }`}>
              {getStatusText(status)}
            </p>

            {/* Call controls */}
            <div className="flex justify-center gap-4">
              {status === 'in-progress' && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={toggleMute}
                  className={`rounded-full h-14 w-14 p-0 ${
                    isMuted
                      ? 'bg-red-100 border-red-300 text-red-600 dark:bg-red-900/50 dark:border-red-700 dark:text-red-400'
                      : ''
                  }`}
                >
                  {isMuted ? (
                    <MicOff className="h-6 w-6" />
                  ) : (
                    <Mic className="h-6 w-6" />
                  )}
                </Button>
              )}
              <Button
                size="lg"
                onClick={hangUp}
                className="rounded-full h-14 w-14 p-0 bg-red-600 hover:bg-red-700"
              >
                <PhoneOff className="h-6 w-6" />
              </Button>
            </div>
          </div>
        ) : (
          // Dialer UI
          <div className="space-y-4">
            {!isReady && (
              <div className="flex items-center justify-center py-4 text-gray-500 dark:text-gray-400">
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Initializing voice...
              </div>
            )}

            {error && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            <div>
              <Input
                type="tel"
                placeholder="+91 XXXXXXXXXX"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="text-center text-lg font-mono"
                disabled={!isReady}
              />
            </div>

            <div>
              <Input
                type="text"
                placeholder="Contact name (optional)"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="text-center"
                disabled={!isReady}
              />
            </div>

            <Button
              onClick={handleCall}
              disabled={!isReady || !phoneNumber.trim()}
              className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg"
            >
              <Phone className="h-5 w-5 mr-2" />
              Call
            </Button>

            <p className="text-xs text-center text-gray-400 dark:text-gray-500">
              Calls are made via browser using VoIP technology
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
