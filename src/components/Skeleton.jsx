import React from 'react';
import { cn } from '@/lib/utils';

const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted",
        className
      )}
      {...props}
    />
  );
};

export const SkeletonLoader = () => {
  return (
    <div className="w-80 min-h-48 p-4 bg-background text-foreground rounded-lg shadow-lg">
      {/* Header skeleton */}
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-9 w-9 rounded-md" />
      </div>
      
      {/* Content skeleton */}
      <div className="space-y-3">
        {/* Text skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-16" />
        </div>
        
        {/* Buttons skeleton */}
        <div className="flex gap-2">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 flex-1" />
        </div>
        
        {/* Card skeleton */}
        <div className="mt-4 p-3 bg-muted rounded border-l-4 border-primary">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-3/4 mt-1" />
        </div>
        
        {/* Divider and demo section skeleton */}
        <div className="mt-6 pt-4 border-t border-border">
          <Skeleton className="h-5 w-32 mb-4" />
          <div className="flex flex-wrap gap-2 mb-4">
            <Skeleton className="h-9 w-16" />
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-16" />
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-16" />
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            <Skeleton className="h-8 w-12" />
            <Skeleton className="h-10 w-16" />
            <Skeleton className="h-11 w-20" />
            <Skeleton className="h-10 w-10" />
          </div>
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-28" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const OptionsSkeletonLoader = () => {
  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
          {/* Header skeleton */}
          <Skeleton className="h-8 w-48 mb-8" />
          
          <div className="space-y-6">
            {/* Checkbox skeleton */}
            <div className="flex items-center space-x-3">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-4 w-32" />
            </div>

            {/* Theme selector skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-12" />
              <div className="flex gap-2">
                <Skeleton className="h-9 w-16" />
                <Skeleton className="h-9 w-16" />
                <Skeleton className="h-9 w-20" />
              </div>
            </div>

            {/* Input skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>

            {/* Button skeleton */}
            <Skeleton className="h-12 w-32" />
          </div>
        </div>
      </div>
    </div>
  );
};

export { Skeleton };
