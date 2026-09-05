'use client';

import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';

// Utility function for class names
const cn = (...classes: (string | boolean | undefined)[]): string => {
  return classes.filter(Boolean).join(' ');
};

// Componente Tabs base
const Tabs = TabsPrimitive.Root;

// Componente TabsList - contenedor para los triggers de tabs
const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "flex flex-wrap md:inline-flex h-auto items-center justify-center rounded-sm bg-[#1E1813] p-1 text-[#C9BBA5]",
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

// Componente TabsTrigger - botón para cambiar entre tabs
const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex w-full items-center justify-center whitespace-nowrap rounded-sm px-3 py-2 text-sm font-medium ring-offset-[#161210] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3C56B] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-[#E0A83A] data-[state=active]:text-[#161210] data-[state=active]:shadow-sm",
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

// Componente TabsContent - contenido de cada tab
const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-[#161210] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3C56B] focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
