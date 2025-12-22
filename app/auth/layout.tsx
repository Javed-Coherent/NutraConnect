import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | NutraConnect',
    default: 'Authentication | NutraConnect',
  },
  description: 'Sign in or create an account on NutraConnect',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50">
      {children}
    </div>
  );
}
