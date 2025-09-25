import React from 'react';
import { Button } from '@/components/ui/button';
import { X, ExternalLink } from 'lucide-react';

export function TabCard({ tab, onClose, onActivate }) {
  const getFaviconUrl = (url) => {
    if(url) return url;

    return 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" strokeLinecap="round" strokeLinejoin="round"><line x1="2" x2="22" y1="2" y2="22"/><path d="M10.41 10.41a2 2 0 1 1-2.83-2.83"/><line x1="13.5" x2="6" y1="13.5" y2="21"/><line x1="18" x2="21" y1="12" y2="15"/><path d="M3.59 3.59A1.99 1.99 0 0 0 3 5v14a2 2 0 0 0 2 2h14c.55 0 1.052-.22 1.41-.59"/><path d="M21 15V5a2 2 0 0 0-2-2H9"/></svg>';
  };

  const getDomainName = (url) => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return 'Unknown';
    }
  };

  const truncateTitle = (title, maxLength = 15) => {
    if (!title) return '';
    return title.length > maxLength ? title.substring(0, maxLength) + '...' : title;
  };

  return (
    <div 
      className="bg-gray-50 border border-border rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer group"
      onClick={() => onActivate(tab.id)}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded flex items-center justify-center bg-muted">
            <img
                src={getFaviconUrl(tab?.favIconUrl)}
                alt=""
                className="w-5 h-5"
                onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
                }}
            />
            </div>

            <h4 className="font-medium text-sm text-card-foreground line-clamp-2 mb-1">
                {truncateTitle(tab.title)}
            </h4>
        </div>

        {/* Close button */}
        <Button
          variant="ghost"
          size="sm"
          className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 hover:bg-destructive/10 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onClose(tab.id);
          }}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}
