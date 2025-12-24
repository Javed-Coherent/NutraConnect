'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { VoipDialer } from './VoipDialer';

interface VoipDialerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prefillNumber?: string;
  prefillName?: string;
  companyId?: number;
}

export function VoipDialerDialog({
  open,
  onOpenChange,
  prefillNumber,
  prefillName,
  companyId,
}: VoipDialerDialogProps) {
  const handleCallEnd = (duration: number) => {
    // Optionally close dialog after call ends
    // We keep it open so user can see call ended status
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Make a Call</DialogTitle>
        </DialogHeader>
        <VoipDialer
          prefillNumber={prefillNumber}
          prefillName={prefillName}
          companyId={companyId}
          onCallEnd={handleCallEnd}
        />
      </DialogContent>
    </Dialog>
  );
}
