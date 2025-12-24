'use client';

import { useState } from 'react';
import { Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmailComposer } from './email/EmailComposer';

interface WorkspaceQuickActionsProps {
  companyId: number;
  companyName: string;
  email?: string | null;
  phone?: string | null;
  variant?: 'icon' | 'button';
  className?: string;
}

export function WorkspaceQuickActions({
  companyId,
  companyName,
  email,
  phone,
  variant = 'icon',
  className = '',
}: WorkspaceQuickActionsProps) {
  const [emailComposerOpen, setEmailComposerOpen] = useState(false);

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
      // For now, use tel: link. VoIP integration will come in Phase 3
      window.location.href = `tel:${phone}`;
    }
  };

  if (variant === 'button') {
    return (
      <>
        <div className={`flex gap-2 ${className}`}>
          {email && (
            <Button
              onClick={handleEmailClick}
              className="bg-blue-600 hover:bg-blue-700 flex-1"
            >
              <Mail className="h-4 w-4 mr-2" />
              Send Email
            </Button>
          )}
          {phone && (
            <Button
              onClick={handleCallClick}
              variant="outline"
              className="border-green-200 text-green-700 hover:bg-green-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-900/30 flex-1"
            >
              <Phone className="h-4 w-4 mr-2" />
              Call
            </Button>
          )}
        </div>

        <EmailComposer
          open={emailComposerOpen}
          onOpenChange={setEmailComposerOpen}
          prefill={{
            toEmail: email || undefined,
            toName: companyName,
            companyId,
          }}
        />
      </>
    );
  }

  return (
    <>
      <div className={`flex items-center gap-1 ${className}`}>
        {email && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEmailClick}
            className="h-8 w-8 p-0 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30"
            title="Send Email via Workspace"
          >
            <Mail className="h-4 w-4" />
          </Button>
        )}
        {phone && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCallClick}
            className="h-8 w-8 p-0 text-gray-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30"
            title="Call"
          >
            <Phone className="h-4 w-4" />
          </Button>
        )}
      </div>

      <EmailComposer
        open={emailComposerOpen}
        onOpenChange={setEmailComposerOpen}
        prefill={{
          toEmail: email || undefined,
          toName: companyName,
          companyId,
        }}
      />
    </>
  );
}
