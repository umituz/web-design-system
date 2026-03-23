/**
 * ProjectSkeleton Template Component
 * @description Loading skeleton for project cards
 */

import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../infrastructure/utils/cn';
import type { BaseProps } from '../../domain/types';

export interface ProjectSkeletonProps extends HTMLAttributes<HTMLDivElement>, BaseProps {}

export const ProjectSkeleton = forwardRef<HTMLDivElement, ProjectSkeletonProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('bg-bg-card rounded-xl overflow-hidden border border-border transition-theme', className)}
        {...props}
      >
        <div className="h-28 bg-bg-tertiary animate-pulse" />
        <div className="p-5">
          <div className="flex gap-2 mb-3">
            <div className="w-16 h-6 bg-bg-tertiary rounded-full animate-pulse" />
            <div className="w-20 h-6 bg-bg-tertiary rounded-full animate-pulse" />
          </div>
          <div className="w-3/4 h-5 bg-bg-tertiary rounded mb-2 animate-pulse" />
          <div className="w-full h-4 bg-bg-tertiary rounded mb-4 animate-pulse" />
          <div className="w-1/2 h-4 bg-bg-tertiary rounded animate-pulse" />
        </div>
      </div>
    );
  }
);

ProjectSkeleton.displayName = 'ProjectSkeleton';
