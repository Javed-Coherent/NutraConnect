'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Plus, Send, Clock, AlertCircle } from 'lucide-react';
import { EmailComposer } from './EmailComposer';
import { CompanySelector } from './CompanySelector';
import { Company } from '@/lib/types';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  type: string;
}

interface Email {
  id: string;
  toEmail: string;
  toName: string | null;
  subject: string;
  status: string;
  sentAt: Date | null;
  createdAt: Date;
}

interface SavedCompanyData {
  savedId: string;
  savedAt: Date;
  company: Company;
}

interface EmailsPageClientProps {
  emails: Email[];
  templates: EmailTemplate[];
  savedCompanies: SavedCompanyData[];
}

export function EmailsPageClient({ emails, templates, savedCompanies }: EmailsPageClientProps) {
  const [companySelectorOpen, setCompanySelectorOpen] = useState(false);
  const [composerOpen, setComposerOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const handleCompanySelect = (company: Company) => {
    setSelectedCompany(company);
    setComposerOpen(true);
  };

  const handleComposerClose = (open: boolean) => {
    setComposerOpen(open);
    if (!open) {
      setSelectedCompany(null);
    }
  };

  const statusCounts = {
    sent: emails.filter(e => e.status === 'sent' || e.status === 'delivered').length,
    draft: emails.filter(e => e.status === 'draft').length,
    failed: emails.filter(e => e.status === 'failed').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Emails</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Compose and track your email communications
          </p>
        </div>
        <Button className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700" onClick={() => setCompanySelectorOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Compose Email
        </Button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border border-emerald-200 dark:border-emerald-800 dark:bg-gray-800">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
              <Send className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{statusCounts.sent}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Sent</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-yellow-200 dark:border-yellow-800 dark:bg-gray-800">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/50 flex items-center justify-center">
              <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{statusCounts.draft}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Drafts</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-red-200 dark:border-red-800 dark:bg-gray-800">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{statusCounts.failed}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Failed</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Templates Section */}
      {templates.length > 0 && (
        <Card className="border border-gray-200 dark:border-gray-700 dark:bg-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Email Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-3">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setCompanySelectorOpen(true)}
                  className="text-left p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:hover:border-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors"
                >
                  <p className="font-medium text-gray-900 dark:text-white">{template.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                    {template.subject}
                  </p>
                  <span className="inline-block mt-2 text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                    {template.type}
                  </span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Email History */}
      <Card className="border border-gray-200 dark:border-gray-700 dark:bg-gray-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Email History</CardTitle>
        </CardHeader>
        <CardContent>
          {emails.length === 0 ? (
            <div className="text-center py-12">
              <Mail className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No emails yet</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Start connecting with suppliers by sending your first email
              </p>
              <Button className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700" onClick={() => setCompanySelectorOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Compose Email
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Recipient</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Subject</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {emails.map((email) => (
                    <tr key={email.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="py-3 px-4">
                        <p className="font-medium text-gray-900 dark:text-white">{email.toName || 'Company'}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">via NutraConnect</p>
                      </td>
                      <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{email.subject}</td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          email.status === 'sent' || email.status === 'delivered'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400'
                            : email.status === 'failed'
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400'
                            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-400'
                        }`}>
                          {email.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500 dark:text-gray-400">
                        {new Date(email.sentAt || email.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Company Selector Modal */}
      <CompanySelector
        open={companySelectorOpen}
        onOpenChange={setCompanySelectorOpen}
        companies={savedCompanies}
        onSelect={handleCompanySelect}
      />

      {/* Email Composer Modal */}
      <EmailComposer
        open={composerOpen}
        onOpenChange={handleComposerClose}
        templates={templates}
        prefill={selectedCompany ? {
          toEmail: selectedCompany.email || undefined,
          toName: selectedCompany.name,
          companyId: parseInt(selectedCompany.id),
        } : undefined}
      />
    </div>
  );
}
