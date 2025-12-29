'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

const footerLinks = {
  platform: [
    { label: 'Search Companies', href: '/search' },
    { label: 'Industry Expert', href: '/knowledge' },
    { label: 'Pricing', href: '/pricing' },
  ],
  resources: [
    { label: 'Industry News', href: '/news' },
    { label: 'Market Insights', href: '/insights' },
    { label: 'Help Center', href: '/help' },
  ],
  company: [
    { label: 'About & Contact', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Blog', href: '/blog' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
  ],
};

const socialLinks = [
  { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
  { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
];

export function Footer() {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/dashboard');
  const isWorkspace = pathname?.startsWith('/workspace');

  // Hide footer on workspace pages (workspace has its own layout)
  if (isWorkspace) {
    return null;
  }

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div
        className={cn(
          'mx-auto px-4 py-12 transition-all duration-300',
          isDashboard ? 'lg:ml-64 lg:pl-6 lg:pr-6' : 'container'
        )}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-teal-600 to-emerald-600">
                <span className="text-lg font-bold text-white">N</span>
              </div>
              <span className="text-xl font-bold text-white">NutraConnect</span>
            </Link>
            <p className="text-sm text-gray-400 mb-4 max-w-md">
              AI-Powered Supplier & Customer Intelligence for the Nutraceutical Industry.
              Connect with verified businesses across India&apos;s health supplement supply chain.
            </p>

            {/* Contact Info */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-teal-400" />
                <span>contact@nutraconnect.in</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-teal-400" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-teal-400" />
                <span>Pune, India</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Platform</h3>
            <ul className="space-y-2">
              {footerLinks.platform.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <h3 className="text-white font-semibold mb-4 mt-6">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} NutraConnect. All rights reserved.
          </p>
          <p className="text-sm text-gray-500 mt-2 md:mt-0">
            Made with care for the Indian Nutraceutical Industry
          </p>
        </div>
      </div>
    </footer>
  );
}
