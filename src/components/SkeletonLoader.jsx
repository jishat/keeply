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
    <div className="min-h-screen bg-background flex">
      {/* Sidebar skeleton */}
      <div className="w-60 bg-sidebar border-r border-r-gray-500/20 flex flex-col h-screen">
        <div className="p-4 flex items-center gap-2">
          <Skeleton className="h-6 w-20" />
        </div>
        <div className="p-4 flex-1">
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
        <div className="p-4">
          <Skeleton className="h-10 w-full" />
        </div>
      </div>

      {/* Main content skeleton */}
      <div className="flex-1 flex flex-col">
        {/* Topbar skeleton */}
        <div className="flex items-center justify-between p-4 border-b border-b-gray-500/20">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-5 w-24" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded" />
          </div>
        </div>

        {/* Content area skeleton */}
        <div className="flex">
          <div className="w-full">
            {/* Toolbar skeleton */}
            <div className="h-16 bg-background flex items-center justify-between px-6">
              <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-80" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-32" />
              </div>
            </div>

            {/* Main content skeleton */}
            <div className="flex-1 p-6 bg-background">
              <Skeleton className="h-48 w-full" />
            </div>
          </div>

          {/* Tabs sidebar skeleton */}
          <div className="w-85 bg-sidebar border-l border-l-gray-500/20 flex flex-col h-screen">
            <div className="p-4 border-b border-b-gray-500/20">
              <div className="flex items-center justify-between mb-0">
                <Skeleton className="h-6 w-20" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
              <Skeleton className="h-4 w-16 mt-2" />
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const LinksSkeletonLoader = () => {
  return (
    <div className="flex">
      <div className="w-full">
        {/* Toolbar skeleton */}
        <div className="h-16 bg-background flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-80" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-32" />
          </div>
        </div>

        {/* Collections skeleton */}
        <div className="flex-1 p-6 bg-background">
          <div className="mb-4">
            <div className="border rounded-lg px-4 py-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-20" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="bg-gray-50 border border-border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <Skeleton className="h-10 w-10 rounded-lg" />
                        <Skeleton className="h-8 w-8" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-4 w-4" />
                        </div>
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-3/4" />
                        <div className="flex items-center justify-between">
                          <Skeleton className="h-3 w-16" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <TabsSkeletonLoader />
    </div>
  );
};

export const NotesSkeletonLoader = () => {
  return (
    <div className="flex">
      <div className="w-full">
        {/* Toolbar skeleton */}
        <div className="h-16 bg-background flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-80" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-32" />
          </div>
        </div>

        {/* Notes content skeleton */}
        <div className="flex-1 p-6 bg-background">
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-4" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <div className="flex items-center justify-between mt-4">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <TabsSkeletonLoader />
    </div>
  );
};

export const CollectionSkeletonLoader = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="bg-gray-50 border border-border rounded-lg p-4">
          <div className="flex items-start justify-between mb-3">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <Skeleton className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </div>
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-3/4" />
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const TabsSkeletonLoader = () => {
  return (
    <div className="w-85 bg-sidebar border-l border-l-gray-500/20 flex flex-col h-screen">
      <div className="p-4 border-b border-b-gray-500/20">
        <div className="flex items-center justify-between mb-0">
          <Skeleton className="h-6 w-20" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
        <Skeleton className="h-4 w-16 mt-2" />
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-lg p-3">
              <div className="flex items-start gap-3">
                <Skeleton className="h-4 w-4 rounded" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
                <Skeleton className="h-4 w-4" />
              </div>
            </div>
          ))}
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
