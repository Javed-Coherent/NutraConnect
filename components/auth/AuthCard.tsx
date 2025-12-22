import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface AuthCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
  showBackLink?: boolean;
}

export function AuthCard({ title, description, children, showBackLink = true }: AuthCardProps) {
  return (
    <div className="flex items-center justify-center p-4 min-h-screen">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          {showBackLink && (
            <Link href="/" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Home
            </Link>
          )}
          <Link href="/" className="flex items-center justify-center space-x-2 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-teal-600 to-emerald-600 shadow-lg">
              <span className="text-xl font-bold text-white">N</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
              NutraConnect
            </span>
          </Link>
        </div>

        <Card className="border-2 border-gray-100 shadow-xl">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-bold text-gray-900">{title}</CardTitle>
            <CardDescription className="text-gray-600">
              {description}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {children}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
