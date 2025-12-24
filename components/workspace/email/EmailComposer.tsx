'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Send, FileText, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { sendWorkspaceEmailAction } from '@/lib/actions/workspace';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  type: string;
}

interface EmailComposerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  templates?: EmailTemplate[];
  prefill?: {
    toEmail?: string;
    toName?: string;
    companyId?: number;
  };
  /** When true, hides the email address input (for company emails where email should be hidden) */
  hideRecipientEmail?: boolean;
}

export function EmailComposer({
  open,
  onOpenChange,
  templates = [],
  prefill,
  hideRecipientEmail = false,
}: EmailComposerProps) {
  // Auto-hide email when prefill has companyId (sending to a company)
  const shouldHideEmail = hideRecipientEmail || (prefill?.companyId && prefill?.toEmail);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  const [formData, setFormData] = useState({
    toEmail: '',
    toName: '',
    subject: '',
    body: '',
  });

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      setFormData({
        toEmail: prefill?.toEmail || '',
        toName: prefill?.toName || '',
        subject: '',
        body: '',
      });
      setError(null);
      setSuccess(false);
      setShowTemplates(false);
    }
  }, [open, prefill]);

  const handleTemplateSelect = (template: EmailTemplate) => {
    setFormData((prev) => ({
      ...prev,
      subject: template.subject,
      body: template.body,
    }));
    setShowTemplates(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await sendWorkspaceEmailAction({
        toEmail: formData.toEmail,
        toName: formData.toName || undefined,
        subject: formData.subject,
        body: formData.body,
        companyId: prefill?.companyId,
      });

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          onOpenChange(false);
          router.refresh();
        }, 1500);
      } else {
        setError(result.error || 'Failed to send email');
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Validation: email is valid if provided directly OR if hidden (using prefill)
  const hasValidEmail = shouldHideEmail
    ? !!prefill?.toEmail
    : formData.toEmail.includes('@');

  const isValid =
    hasValidEmail &&
    formData.subject.trim() &&
    formData.body.trim();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center">
              <Mail className="h-4 w-4 text-teal-600 dark:text-teal-400" />
            </div>
            Compose Email
          </DialogTitle>
        </DialogHeader>

        {success ? (
          <div className="py-12 text-center">
            <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center mx-auto mb-4">
              <Send className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Email Sent!
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Your email has been sent successfully.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Template Selector */}
            {templates.length > 0 && (
              <div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowTemplates(!showTemplates)}
                  className="text-sm"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  {showTemplates ? 'Hide Templates' : 'Use Template'}
                </Button>

                {showTemplates && (
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                    {templates.map((template) => (
                      <button
                        key={template.id}
                        type="button"
                        onClick={() => handleTemplateSelect(template)}
                        className="text-left p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:hover:border-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors"
                      >
                        <p className="font-medium text-gray-900 dark:text-white text-sm">
                          {template.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                          {template.subject}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* To Field */}
            {shouldHideEmail ? (
              /* When sending to a company, show recipient name only (email hidden) */
              <div className="p-4 rounded-lg bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800">
                <Label className="text-teal-700 dark:text-teal-300">Sending to</Label>
                <p className="mt-1 font-medium text-gray-900 dark:text-white">
                  {formData.toName || prefill?.toName || 'Company'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  Email will be sent directly to the company&apos;s registered email address
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="toEmail">To (Email) *</Label>
                  <Input
                    id="toEmail"
                    type="email"
                    placeholder="email@example.com"
                    value={formData.toEmail}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, toEmail: e.target.value }))
                    }
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="toName">Recipient Name</Label>
                  <Input
                    id="toName"
                    type="text"
                    placeholder="John Doe"
                    value={formData.toName}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, toName: e.target.value }))
                    }
                    className="mt-1"
                  />
                </div>
              </div>
            )}

            {/* Subject */}
            <div>
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                type="text"
                placeholder="Enter email subject"
                value={formData.subject}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, subject: e.target.value }))
                }
                required
                className="mt-1"
              />
            </div>

            {/* Body */}
            <div>
              <Label htmlFor="body">Message *</Label>
              <Textarea
                id="body"
                placeholder="Write your message here..."
                value={formData.body}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, body: e.target.value }))
                }
                required
                rows={10}
                className="mt-1 resize-none"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!isValid || isLoading}
                className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Email
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
