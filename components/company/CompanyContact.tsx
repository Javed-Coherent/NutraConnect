'use client';

import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Navigation,
  Copy,
  Check,
  ExternalLink,
} from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Company } from '@/lib/types';

interface CompanyContactProps {
  company: Company;
}

export function CompanyContact({ company }: CompanyContactProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const fullAddress = [
    company.address,
    company.city,
    company.state,
    company.pincode,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <section id="contact" className="mt-12 scroll-mt-20">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Contact Card */}
        <div className="lg:col-span-2">
          <Card className="border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden dark:bg-gray-800">
            <CardHeader className="py-4 px-5 bg-gradient-to-r from-blue-50 to-indigo-50/50 dark:from-gray-800 dark:to-gray-800 border-b dark:border-gray-700">
              <CardTitle className="text-lg flex items-center text-gray-900 dark:text-white">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center mr-3">
                  <Phone className="h-4 w-4 text-white" />
                </div>
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Address */}
                {company.address && (
                  <div className="md:col-span-2">
                    <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                          Address
                        </p>
                        <p className="text-gray-900 dark:text-white font-medium">
                          {company.address}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          {company.city}, {company.state} {company.pincode}
                        </p>
                        <div className="flex gap-2 mt-3">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs h-8"
                            onClick={() => copyToClipboard(fullAddress, 'address')}
                          >
                            {copiedField === 'address' ? (
                              <>
                                <Check className="h-3 w-3 mr-1 text-green-500" />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3 mr-1" />
                                Copy
                              </>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs h-8"
                            asChild
                          >
                            <a
                              href={`https://maps.google.com/?q=${encodeURIComponent(fullAddress)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Navigation className="h-3 w-3 mr-1" />
                              Get Directions
                            </a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Phone */}
                {company.phone && (
                  <div className="flex items-center gap-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-800">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 flex items-center justify-center flex-shrink-0">
                      <Phone className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                        Phone
                      </p>
                      <a
                        href={`tel:${company.phone}`}
                        className="text-green-600 dark:text-green-400 font-semibold text-lg hover:underline"
                      >
                        {company.phone}
                      </a>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => copyToClipboard(company.phone!, 'phone')}
                    >
                      {copiedField === 'phone' ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                )}

                {/* Email */}
                {company.email && (
                  <div className="flex items-center gap-4 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-100 dark:border-orange-800">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/50 dark:to-amber-900/50 flex items-center justify-center flex-shrink-0">
                      <Mail className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                        Email
                      </p>
                      <p className="text-orange-600 dark:text-orange-400 font-medium">
                        Available - Use &quot;Send Email&quot; button above
                      </p>
                    </div>
                  </div>
                )}

                {/* Website */}
                {company.website && (
                  <div className="flex items-center gap-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-100 dark:border-purple-800">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 flex items-center justify-center flex-shrink-0">
                      <Globe className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                        Website
                      </p>
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 dark:text-purple-400 font-medium hover:underline flex items-center gap-1"
                      >
                        {company.website.replace(/^https?:\/\//, '')}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div>
          {/* Quick Actions */}
          <Card className="border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden dark:bg-gray-800">
            <CardContent className="p-4">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Quick Actions
              </p>
              <div className="space-y-2">
                {company.phone && (
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    asChild
                  >
                    <a href={`tel:${company.phone}`}>
                      <Phone className="h-4 w-4 mr-2" />
                      Call Now
                    </a>
                  </Button>
                )}
                {company.email && (
                  <Button
                    variant="outline"
                    className="w-full border-teal-200 dark:border-teal-700 text-teal-700 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/30"
                    onClick={() => {
                      // Scroll to header where the email button is located
                      const header = document.querySelector('#company-header');
                      if (header) {
                        header.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
