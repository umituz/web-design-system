/**
 * NewsletterSignup Component (Organism)
 * @description Newsletter subscription form with email validation
 */

import { useState, useEffect, useMemo } from 'react';
import { cn } from '../../infrastructure/utils';
import type { BaseProps } from '../../domain/types';
import { Icon } from '../atoms/Icon';

const SUBSCRIBER_COUNT_MIN = 1000;
const SUBSCRIBER_COUNT_MAX = 6000;

export interface NewsletterSignupProps extends BaseProps {
  onSubscribe?: (email: string) => Promise<void>;
  subscriberCountMin?: number;
  subscriberCountMax?: number;
}

export const NewsletterSignup = ({
  onSubscribe,
  subscriberCountMin = SUBSCRIBER_COUNT_MIN,
  subscriberCountMax = SUBSCRIBER_COUNT_MAX,
  className,
}: NewsletterSignupProps) => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // FIXED: Generate random count per component instance, not at module load
  const subscriberCount = useMemo(
    () => Math.floor(Math.random() * (subscriberCountMax - subscriberCountMin + 1)) + subscriberCountMin,
    [subscriberCountMin, subscriberCountMax]
  );

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Reset success message after 5 seconds with cleanup
  useEffect(() => {
    if (isSubscribed) {
      const timeout = setTimeout(() => {
        setIsSubscribed(false);
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [isSubscribed]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate email
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      // Call the subscribe function if provided
      if (onSubscribe) {
        await onSubscribe(email);
      } else {
        // Simulate API call for demo purposes
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      setIsLoading(false);
      setIsSubscribed(true);
      setEmail('');
    } catch (err) {
      setIsLoading(false);
      setError('Failed to subscribe. Please try again.');
    }
  };

  if (isSubscribed) {
    return (
      <div className={cn('bg-bg-card rounded-xl p-4 border border-border', className)}>
        <div className="flex items-center gap-3 text-green-600">
          <Icon className="text-green-600" size="lg">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </Icon>
          <div>
            <div className="font-semibold text-sm">Thanks for subscribing!</div>
            <div className="text-xs text-text-secondary">Check your inbox to confirm your subscription</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('bg-bg-card rounded-xl p-4 border border-border', className)}>
      <div className="flex items-center gap-2 mb-3">
        <Icon className="text-primary-light" size="lg">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 5.26a2 2 0 002.22 0l7.89-5.26a2 2 0 002.22 0L21 8V5a2 2 0 00-2-2H5a2 2 0 00-2 2v3a2 2 0 002.22 0z"
          />
        </Icon>
        <h3 className="text-sm font-semibold text-text-primary">Newsletter</h3>
      </div>
      <p className="text-xs text-text-secondary mb-3">
        Get the latest articles delivered straight to your inbox. No spam, ever.
      </p>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 bg-bg-secondary text-text-primary rounded-lg border border-border focus:border-primary-light focus:outline-none placeholder-text-secondary/50 transition-theme text-sm"
          disabled={isLoading}
        />
        {error && (
          <p className="text-xs text-red-500">{error}</p>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary-gradient text-text-primary rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          {isLoading ? (
            <>Subscribing...</>
          ) : (
            <>
              <Icon size="sm">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M22 2L11 13M22 2l-7 20M2 2l15 15L2 2l15-15"
                />
              </Icon>
              Subscribe
            </>
          )}
        </button>
      </form>
      <p className="text-xs text-text-secondary mt-2">
        Join {subscriberCount.toLocaleString()}+ subscribers
      </p>
    </div>
  );
};

NewsletterSignup.displayName = 'NewsletterSignup';
