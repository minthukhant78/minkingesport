
"use client";

import { useEffect, useState } from 'react';
import { useNotification } from '@/hooks/use-notification';
import { cn } from '@/lib/utils';
import { Bell } from 'lucide-react';

export function DynamicIsland() {
  const { notification } = useNotification();
  const [isMounted, setIsMounted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (notification) {
      setIsExpanded(true);
      const timer = setTimeout(() => {
        setIsExpanded(false);
      }, 3500); // Start collapsing before it disappears
      return () => clearTimeout(timer);
    } else {
      setIsExpanded(false);
    }
  }, [notification]);

  if (!isMounted) {
    return null;
  }
  
  const defaultIcon = <Bell size={28}/>;
  const icon = notification?.icon || defaultIcon;
  const hasContent = !!notification;

  return (
    <div
      className={cn(
        "fixed top-4 left-1/2 -translate-x-1/2 z-50",
        "bg-black rounded-full shadow-2xl text-white",
        "flex items-center justify-between px-4 overflow-hidden",
        "transition-all duration-500 ease-[cubic-bezier(0.68,-0.55,0.27,1.55)]",
        "cursor-default",
        // States: hidden, compact, expanded
        !hasContent
          ? "w-0 h-0 p-0 opacity-0"
          : isExpanded
          ? "w-80 h-20"
          : "w-16 h-12"
      )}
    >
      {hasContent && (
        isExpanded ? (
          <div className="w-full h-full flex items-center justify-start gap-4 p-2 animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center shrink-0">
              {icon}
            </div>
            <div>
              <p className="font-semibold text-sm">{notification.message}</p>
              {notification.description && (
                  <p className="text-xs text-muted-foreground">{notification.description}</p>
              )}
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center animate-fade-in">
            <Bell size={20}/>
          </div>
        )
      )}
    </div>
  );
}
