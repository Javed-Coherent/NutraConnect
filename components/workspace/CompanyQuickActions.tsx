'use client';

import { useState } from 'react';
import { Phone, Mail, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmailComposer } from '@/components/workspace/email/EmailComposer';
import { VoipDialerDialog } from '@/components/workspace/calls/VoipDialerDialog';

interface CompanyQuickActionsProps {
  companyId: number;
  companyName: string;
  phone?: string | null;
  email?: string | null;
  size?: 'sm' | 'default' | 'lg';
  showLabels?: boolean;
  className?: string;
}

export function CompanyQuickActions({
  companyId,
  companyName,
  phone,
  email,
  size = 'sm',
  showLabels = false,
  className = '',
}: CompanyQuickActionsProps) {
  const [emailComposerOpen, setEmailComposerOpen] = useState(false);
  const [voipDialerOpen, setVoipDialerOpen] = useState(false);

  const handleEmailClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (email) {
      setEmailComposerOpen(true);
    }
  };

  const handleCallClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (phone) {
      setVoipDialerOpen(true);
    }
  };

  return (
    <>
      <div className={`flex items-center gap-2 ${className}`}>
        {phone && (
          <Button
            size={size}
            variant="outline"
            className="border-green-200 dark:border-green-700 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30"
            onClick={handleCallClick}
          >
            <Phone className={`${size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'} ${showLabels ? 'mr-2' : ''}`} />
            {showLabels && 'Call'}
          </Button>
        )}
        {email && (
          <Button
            size={size}
            variant="outline"
            className="border-blue-200 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30"
            onClick={handleEmailClick}
          >
            {showLabels ? (
              <>
                <Send className={`${size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'} mr-2`} />
                Email
              </>
            ) : (
              <Mail className={`${size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'}`} />
            )}
          </Button>
        )}
      </div>

      {/* Email Composer Modal */}
      <EmailComposer
        open={emailComposerOpen}
        onOpenChange={setEmailComposerOpen}
        prefill={{
          toEmail: email || undefined,
          toName: companyName,
          companyId: companyId,
        }}
      />

      {/* VoIP Dialer Modal */}
      <VoipDialerDialog
        open={voipDialerOpen}
        onOpenChange={setVoipDialerOpen}
        prefillNumber={phone || undefined}
        prefillName={companyName}
        companyId={companyId}
      />
    </>
  );
}
