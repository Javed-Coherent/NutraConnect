'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { testimonials } from '@/lib/data/testimonials';

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const displayCount = 3;

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev + displayCount >= testimonials.length ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? testimonials.length - displayCount : prev - 1
    );
  };

  const visibleTestimonials = testimonials.slice(
    currentIndex,
    currentIndex + displayCount
  );

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trusted by Industry Leaders
          </h2>
          <p className="text-lg text-gray-600">
            See what our customers say about finding business partners on NutraConnect
          </p>
        </div>

        {/* Testimonials */}
        <div className="relative">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleTestimonials.map((testimonial) => (
              <Card key={testimonial.id} className="bg-white">
                <CardContent className="p-6">
                  <Quote className="h-8 w-8 text-teal-100 mb-4" />

                  {/* Stars */}
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < testimonial.rating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-200'
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-gray-600 mb-6 italic">
                    &ldquo;{testimonial.content}&rdquo;
                  </p>

                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarFallback className="bg-gradient-to-br from-teal-500 to-emerald-500 text-white">
                        {testimonial.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {testimonial.role}, {testimonial.company}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-center mt-8 gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={prevSlide}
              className="rounded-full"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextSlide}
              className="rounded-full"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
