'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  ExternalLink,
  Clock,
  Tag,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Sparkles,
  Newspaper,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { summarizeArticleAction } from '@/lib/actions/news';

function NewsSummaryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const url = searchParams.get('url') || '';
  const title = searchParams.get('title') || '';
  const source = searchParams.get('source') || '';
  const category = searchParams.get('category') || 'industry';
  const originalSummary = searchParams.get('summary') || '';

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<string>('');
  const [keyPoints, setKeyPoints] = useState<string[]>([]);
  const [industry, setIndustry] = useState<string>('');
  const [sentiment, setSentiment] = useState<'positive' | 'negative' | 'neutral'>('neutral');
  const [readingTime, setReadingTime] = useState<string>('');

  useEffect(() => {
    if (!url || !title) {
      setError('Missing article information');
      setLoading(false);
      return;
    }

    const fetchSummary = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await summarizeArticleAction(url, title, originalSummary);

        if (result.success) {
          setSummary(result.summary || '');
          setKeyPoints(result.keyPoints || []);
          setIndustry(result.industry || '');
          setSentiment(result.sentiment || 'neutral');
          setReadingTime(result.readingTime || '');
        } else {
          setError(result.error || 'Failed to generate summary');
        }
      } catch (err) {
        console.error('Error fetching summary:', err);
        setError('An error occurred while generating the summary');
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [url, title, originalSummary]);

  const getSentimentIcon = () => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'negative':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSentimentColor = () => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700';
      case 'negative':
        return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-700';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600';
    }
  };

  const getCategoryColor = () => {
    switch (category) {
      case 'regulatory':
        return 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300';
      case 'company':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300';
      default:
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-emerald-600 py-8">
        <div className="container mx-auto px-4">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </button>
          <div className="flex items-center gap-3 mb-4">
            <Badge className={getCategoryColor()}>
              {category === 'regulatory' ? 'Regulatory' : category === 'company' ? 'Company News' : 'Industry'}
            </Badge>
            {source && (
              <span className="text-white/80 text-sm">
                Source: {source}
              </span>
            )}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white max-w-4xl">
            {title || 'Article Summary'}
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Loading State */}
          {loading && (
            <Card className="border-2 border-teal-200 dark:border-teal-700">
              <CardContent className="py-16">
                <div className="flex flex-col items-center justify-center">
                  <div className="relative mb-6">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center">
                      <Sparkles className="h-8 w-8 text-white" />
                    </div>
                    <Loader2 className="h-20 w-20 text-teal-500 animate-spin absolute -top-2 -left-2" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Generating AI Summary
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
                    Our AI is analyzing the article and creating a comprehensive summary with key insights for the nutraceutical industry...
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Error State */}
          {error && !loading && (
            <Card className="border-2 border-red-200 dark:border-red-700">
              <CardContent className="py-12">
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center mb-4">
                    <AlertCircle className="h-8 w-8 text-red-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Unable to Generate Summary
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
                    {error}
                  </p>
                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      onClick={() => window.location.reload()}
                      className="border-teal-500 text-teal-700 hover:bg-teal-50"
                    >
                      Try Again
                    </Button>
                    <Button asChild className="bg-teal-600 hover:bg-teal-700">
                      <a href={url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Read Original Article
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Summary Content */}
          {!loading && !error && summary && (
            <div className="space-y-6">
              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4">
                {readingTime && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {readingTime}
                  </Badge>
                )}
                {industry && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    {industry}
                  </Badge>
                )}
                <Badge variant="outline" className={`flex items-center gap-1 ${getSentimentColor()}`}>
                  {getSentimentIcon()}
                  {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)} for Industry
                </Badge>
              </div>

              {/* AI Summary Card */}
              <Card className="border-2 border-teal-200 dark:border-teal-700 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-gray-800 dark:to-gray-800 border-b border-teal-100 dark:border-teal-700">
                  <CardTitle className="flex items-center text-gray-900 dark:text-white">
                    <Sparkles className="h-5 w-5 mr-2 text-teal-600 dark:text-teal-400" />
                    AI-Generated Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="prose prose-gray dark:prose-invert max-w-none">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                      {summary}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Key Points */}
              {keyPoints.length > 0 && (
                <Card className="border-2 border-emerald-200 dark:border-emerald-700">
                  <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-gray-800 dark:to-gray-800 border-b border-emerald-100 dark:border-emerald-700">
                    <CardTitle className="flex items-center text-gray-900 dark:text-white">
                      <CheckCircle2 className="h-5 w-5 mr-2 text-emerald-600 dark:text-emerald-400" />
                      Key Takeaways
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ul className="space-y-3">
                      {keyPoints.map((point, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="h-6 w-6 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                              {index + 1}
                            </span>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300">{point}</p>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Read Original Button */}
              <Card className="border-2 border-gray-200 dark:border-gray-700">
                <CardContent className="py-6">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        <Newspaper className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Want more details?</p>
                        <p className="font-medium text-gray-900 dark:text-white">Read the full original article</p>
                      </div>
                    </div>
                    <Button asChild size="lg" className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700">
                      <a href={url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open Original Article
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function NewsSummaryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-teal-500 animate-spin" />
      </div>
    }>
      <NewsSummaryContent />
    </Suspense>
  );
}
