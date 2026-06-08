/**
 * NewsletterSignup Component (Organism)
 * @description Newsletter subscription form with email validation
 */

import { useState, useEffect, useMemo, type FormEvent } from 'react';
import { CheckCircle2, Mail, Send } from 'lucide-react';
import { cn } from '../../infrastructure/utils';
import { randomIntegerInRange } from '../../infrastructure/calculation/randomIntegerInRange';
import { validateEmail } from '../../infrastructure/security/validators/emailAddressValidator';
import { TIMING } from '../../infrastructure/constants/timing.constants';
import type { BaseProps } from '../../domain/types';

const DEFAULT_SUBSCRIBER_COUNT_MIN = 1000;
const DEFAULT_SUBSCRIBER_COUNT_MAX = 6000;
const SUCCESS_MESSAGE_DURATION_MS = 5000;

export interface NewsletterSignupProps extends BaseProps {
  onSubscribe?: (email: string) => Promise<void>;
  subscriberCountMin?: number;
  subscriberCountMax?: number;
}

export const NewsletterSignup = ({
  onSubscribe,
  subscriberCountMin = DEFAULT_SUBSCRIBER_COUNT_MIN,
  subscriberCountMax = DEFAULT_SUBSCRIBER_COUNT_MAX,
  className,
}: NewsletterSignupProps) => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Sample a per-instance count once. Recomputed only if bounds change.
  const subscriberCount = useMemo(
    () => randomIntegerInRange(subscriberCountMin, subscriberCountMax),
    [subscriberCountMin, subscriberCountMax]
  );

  // Auto-clear the success banner after a window
  useEffect(() => {
    if (!isSubscribed) return;
    const timeout = setTimeout(() => setIsSubscribed(false), SUCCESS_MESSAGE_DURATION_MS);
    return () => clearTimeout(timeout);
  }, [isSubscribed]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      setError(emailValidation.error ?? 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      if (onSubscribe) {
        await onSubscribe(email);
      } else {
        // Simulated round-trip for demo / preview
        await new Promise((resolve) => setTimeout(resolve, TIMING.NEWSLETTER_SUBMIT_DELAY_MS));
      }
      setIsLoading(false);
      setIsSubscribed(true);
      setEmail('');
    } catch {
      setIsLoading(false);
      setError('Failed to subscribe. Please try again.');
    }
  };

  if (isSubscribed) {
    return (
      <div className={cn('rounded-xl border border-border bg-card p-4', className)}>
        <div className="flex items-center gap-3 text-success">
          <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
          <div>
            <div className="text-sm font-semibold text-foreground">Thanks for subscribing!</div>
            <div className="text-xs text-muted-foreground">
              Check your inbox to confirm your subscription
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('rounded-xl border border-border bg-card p-4', className)}>
      <div className="mb-3 flex items-center gap-2">
        <Mail className="h-5 w-5 text-primary" aria-hidden="true" />
        <h3 className="text-sm font-semibold text-foreground">Newsletter</h3>
      </div>
      <p className="mb-3 text-xs text-muted-foreground">
        Get the latest articles delivered straight to your inbox. No spam, ever.
      </p>
      <form onSubmit={handleSubmit} className="space-y-2" noValidate>
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          aria-invalid={!!error}
          aria-describedby={error ? 'newsletter-error' : undefined}
          className="w-full rounded-lg border border-input bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
        />
        {error && (
          <p id="newsletter-error" role="alert" className="text-xs text-destructive">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <>Subscribing…</>
          ) : (
            <>
              <Send className="h-4 w-4" aria-hidden="true" />
              Subscribe
            </>
          )}
        </button>
      </form>
      <p className="mt-2 text-xs text-muted-foreground">
        Join {subscriberCount.toLocaleString()}+ subscribers
      </p>
    </div>
  );
};

NewsletterSignup.displayName = 'NewsletterSignup';
