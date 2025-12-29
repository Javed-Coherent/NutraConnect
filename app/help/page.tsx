import { Metadata } from 'next';
import { HelpCircle, Mail } from 'lucide-react';
import { HelpPageChat } from '@/components/help/HelpPageChat';

export const metadata: Metadata = {
  title: 'Help Centre',
  description:
    'Get help with NutraConnect. Chat with our AI assistant to get answers about our platform.',
};

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 mb-3">
              <HelpCircle className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Help Centre
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Chat with our AI assistant to get answers about NutraConnect
            </p>
          </div>
        </div>
      </section>

      {/* Chat Section */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <HelpPageChat />

            {/* Contact Support */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2">
                <Mail className="h-4 w-4" />
                Need more help? Email us at{' '}
                <a
                  href="mailto:support@nutraconnect.in"
                  className="text-teal-600 dark:text-teal-400 font-medium hover:underline"
                >
                  support@nutraconnect.in
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
