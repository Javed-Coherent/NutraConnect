import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CTA() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-600 to-emerald-600 p-8 md:p-16">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-grid-white/10 opacity-20" />

          <div className="relative text-center">
            <div className="inline-flex items-center rounded-full bg-white/10 px-4 py-1.5 text-sm text-white mb-6">
              <Sparkles className="h-4 w-4 mr-2" />
              Start for Free - No Credit Card Required
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Find Your Next Business Partner?
            </h2>

            <p className="text-lg md:text-xl text-teal-100 mb-8 max-w-2xl mx-auto">
              Join 10,000+ nutraceutical businesses already using NutraConnect to grow their network
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-teal-600 hover:bg-teal-50 text-lg px-8"
                asChild
              >
                <Link href="/auth/signup">
                  Get Started Free
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
            </div>

            <p className="text-sm text-teal-200 mt-6">
              Free tier includes 10 searches/day and 2 profile views
            </p>
          </div>

          {/* Decorative elements */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        </div>
      </div>
    </section>
  );
}
