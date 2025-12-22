import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Industry Expert | NutraConnect',
  description: 'AI-powered nutraceutical industry knowledge assistant. Get expert answers about regulations, supply chain, CDMOs, and business strategies.',
};

export default function KnowledgeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This layout removes the default footer for a cleaner chat experience
  return <>{children}</>;
}
