/* Primitivas de sobreposição e disclosure no padrão shadcn/ui: Dialog, Sheet, AlertDialog, Popover, Accordion, Tabs. */
import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cva, type VariantProps } from 'class-variance-authority';
import { ChevronDown, X } from 'lucide-react';
import { cn, focusRing } from '../lib/utils';
import { buttonVariants } from './button';

const overlayCls = 'fixed inset-0 z-50 bg-overlay data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out motion-reduce:animate-none';
const closeCls = cn(
  'absolute right-xnano top-xnano grid size-touch place-items-center rounded-full text-icon-secondary transition-colors',
  'hover:bg-interactive-fill-quiet-hover active:bg-interactive-fill-quiet-active',
  focusRing,
);

/* --------------------------------------------------------------- Dialog */

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogPortal = DialogPrimitive.Portal;
export const DialogClose = DialogPrimitive.Close;

export const DialogOverlay = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Overlay>, React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>>(
  function DialogOverlay({ className, ...props }, ref) {
    return <DialogPrimitive.Overlay ref={ref} className={cn(overlayCls, className)} {...props} />;
  },
);

export interface DialogContentProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  /** Mostra o X de fechar (44px) no canto. */
  showClose?: boolean;
}
export const DialogContent = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Content>, DialogContentProps>(function DialogContent(
  { className, children, showClose = true, ...props },
  ref,
) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          'fixed left-1/2 top-1/2 z-50 grid max-h-[calc(100dvh-48px)] w-[calc(100%-48px)] max-w-[340px] -translate-x-1/2 -translate-y-1/2 gap-mini overflow-y-auto rounded-lg bg-popover p-mini pt-medium text-popover-foreground',
          'data-[state=open]:animate-zoom-in data-[state=closed]:animate-zoom-out motion-reduce:animate-none outline-none',
          className,
        )}
        {...props}
      >
        {children}
        {showClose && (
          <DialogPrimitive.Close className={closeCls} aria-label="Fechar">
            <X className="size-icon" aria-hidden />
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
});
export function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('grid gap-nano text-center', className)} {...props} />;
}
export function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col-reverse gap-nano', className)} {...props} />;
}
export const DialogTitle = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Title>, React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>>(
  function DialogTitle({ className, ...props }, ref) {
    return <DialogPrimitive.Title ref={ref} className={cn('body-strong m-0', className)} {...props} />;
  },
);
export const DialogDescription = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Description>, React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>>(
  function DialogDescription({ className, ...props }, ref) {
    return <DialogPrimitive.Description ref={ref} className={cn('caption m-0 text-muted-foreground', className)} {...props} />;
  },
);

/* --------------------------------------------------------------- Sheet */

export const Sheet = DialogPrimitive.Root;
export const SheetTrigger = DialogPrimitive.Trigger;
export const SheetClose = DialogPrimitive.Close;
export const SheetTitle = DialogTitle;
export const SheetDescription = DialogDescription;
export const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div className={cn('grid gap-nano', className)} {...props} />;
export const SheetFooter = DialogFooter;

export const sheetVariants = cva(
  'fixed z-50 grid gap-mini bg-popover p-mini pb-small text-popover-foreground shadow-high outline-none motion-reduce:animate-none',
  {
    variants: {
      side: {
        bottom: 'inset-x-0 bottom-0 max-h-[90dvh] overflow-y-auto rounded-t-xl data-[state=open]:animate-slide-up data-[state=closed]:animate-slide-down',
        top: 'inset-x-0 top-0 max-h-[90dvh] overflow-y-auto rounded-b-xl data-[state=open]:animate-slide-in-top data-[state=closed]:animate-slide-out-top',
        left: 'inset-y-0 left-0 h-full w-[85%] max-w-[360px] content-start overflow-y-auto data-[state=open]:animate-slide-in-left data-[state=closed]:animate-slide-out-left',
        right: 'inset-y-0 right-0 h-full w-[85%] max-w-[360px] content-start overflow-y-auto data-[state=open]:animate-slide-in-right data-[state=closed]:animate-slide-out-right',
      },
    },
    defaultVariants: { side: 'bottom' },
  },
);
export interface SheetContentProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>, VariantProps<typeof sheetVariants> {
  showClose?: boolean;
}
/** Bottom sheet (shadcn Sheet com side="bottom"): alça no topo, raio radius-xlarge, sombra high. */
export const SheetContent = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Content>, SheetContentProps>(function SheetContent(
  { side, className, children, showClose = false, ...props },
  ref,
) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content ref={ref} className={cn(sheetVariants({ side }), className)} {...props}>
        {(side ?? 'bottom') === 'bottom' && <span aria-hidden className="mx-auto -mt-xnano block h-xnano w-large rounded-full bg-border" />}
        {children}
        {showClose && (
          <DialogPrimitive.Close className={closeCls} aria-label="Fechar">
            <X className="size-icon" aria-hidden />
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
});

/* ---------------------------------------------------------- AlertDialog */

export const AlertDialog = AlertDialogPrimitive.Root;
export const AlertDialogTrigger = AlertDialogPrimitive.Trigger;
export const AlertDialogPortal = AlertDialogPrimitive.Portal;
export const AlertDialogContent = React.forwardRef<React.ElementRef<typeof AlertDialogPrimitive.Content>, React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>>(
  function AlertDialogContent({ className, ...props }, ref) {
    return (
      <AlertDialogPrimitive.Portal>
        <AlertDialogPrimitive.Overlay className={overlayCls} />
        <AlertDialogPrimitive.Content
          ref={ref}
          className={cn(
            'fixed left-1/2 top-1/2 z-50 grid max-h-[calc(100dvh-48px)] w-[calc(100%-48px)] max-w-[340px] -translate-x-1/2 -translate-y-1/2 gap-mini overflow-y-auto rounded-lg bg-popover p-mini text-popover-foreground',
            'data-[state=open]:animate-zoom-in data-[state=closed]:animate-zoom-out motion-reduce:animate-none outline-none',
            className,
          )}
          {...props}
        />
      </AlertDialogPrimitive.Portal>
    );
  },
);
export const AlertDialogHeader = DialogHeader;
export const AlertDialogFooter = DialogFooter;
export const AlertDialogTitle = React.forwardRef<React.ElementRef<typeof AlertDialogPrimitive.Title>, React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>>(
  function AlertDialogTitle({ className, ...props }, ref) {
    return <AlertDialogPrimitive.Title ref={ref} className={cn('body-strong m-0', className)} {...props} />;
  },
);
export const AlertDialogDescription = React.forwardRef<React.ElementRef<typeof AlertDialogPrimitive.Description>, React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>>(
  function AlertDialogDescription({ className, ...props }, ref) {
    return <AlertDialogPrimitive.Description ref={ref} className={cn('caption m-0 text-muted-foreground', className)} {...props} />;
  },
);
export interface AlertDialogActionProps extends React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action> {
  /** destructive para sair, apagar ou cancelar algo que não volta. */
  hierarchy?: 'loud' | 'destructive';
}
export const AlertDialogAction = React.forwardRef<React.ElementRef<typeof AlertDialogPrimitive.Action>, AlertDialogActionProps>(
  function AlertDialogAction({ className, hierarchy = 'loud', ...props }, ref) {
    return <AlertDialogPrimitive.Action ref={ref} className={cn(buttonVariants({ hierarchy, fullWidth: true }), className)} {...props} />;
  },
);
export const AlertDialogCancel = React.forwardRef<React.ElementRef<typeof AlertDialogPrimitive.Cancel>, React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>>(
  function AlertDialogCancel({ className, ...props }, ref) {
    return <AlertDialogPrimitive.Cancel ref={ref} className={cn(buttonVariants({ hierarchy: 'quiet', fullWidth: true }), className)} {...props} />;
  },
);

/* --------------------------------------------------------------- Popover */

export const Popover = PopoverPrimitive.Root;
export const PopoverTrigger = PopoverPrimitive.Trigger;
export const PopoverAnchor = PopoverPrimitive.Anchor;
export const PopoverClose = PopoverPrimitive.Close;
export const PopoverContent = React.forwardRef<React.ElementRef<typeof PopoverPrimitive.Content>, React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>>(
  function PopoverContent({ className, align = 'center', sideOffset = 8, ...props }, ref) {
    return (
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          ref={ref}
          align={align}
          sideOffset={sideOffset}
          collisionPadding={16}
          className={cn(
            'caption z-50 w-[288px] max-w-[calc(100vw-32px)] rounded-md border border-border bg-popover p-mini text-popover-foreground shadow-high outline-none',
            'origin-[--radix-popover-content-transform-origin] data-[state=open]:animate-pop-in data-[state=closed]:animate-pop-out motion-reduce:animate-none',
            className,
          )}
          {...props}
        />
      </PopoverPrimitive.Portal>
    );
  },
);

/* ------------------------------------------------------------- Accordion */

export const Accordion = AccordionPrimitive.Root;
export const AccordionItem = React.forwardRef<React.ElementRef<typeof AccordionPrimitive.Item>, React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>>(
  function AccordionItem({ className, ...props }, ref) {
    return <AccordionPrimitive.Item ref={ref} className={cn('border-b border-border', className)} {...props} />;
  },
);
export const AccordionTrigger = React.forwardRef<React.ElementRef<typeof AccordionPrimitive.Trigger>, React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>>(
  function AccordionTrigger({ className, children, ...props }, ref) {
    return (
      <AccordionPrimitive.Header className="m-0 flex">
        <AccordionPrimitive.Trigger
          ref={ref}
          className={cn(
            'label flex min-h-touch flex-1 items-center justify-between gap-micro rounded-sm py-micro text-left text-foreground transition-colors',
            'cursor-pointer hover:text-text-link active:bg-interactive-fill-quiet-active',
            focusRing,
            'data-[disabled]:cursor-not-allowed data-[disabled]:text-interactive-text-disabled data-[disabled]:hover:text-interactive-text-disabled data-[disabled]:[&>svg]:text-interactive-text-disabled',
            '[&[data-state=open]>svg]:rotate-180',
            className,
          )}
          {...props}
        >
          {children}
          <ChevronDown className="size-icon shrink-0 text-icon-brand-strong transition-transform duration-200 motion-reduce:transition-none" aria-hidden />
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
    );
  },
);
export const AccordionContent = React.forwardRef<React.ElementRef<typeof AccordionPrimitive.Content>, React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>>(
  function AccordionContent({ className, children, ...props }, ref) {
    return (
      <AccordionPrimitive.Content
        ref={ref}
        className="body overflow-hidden text-muted-foreground data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down motion-reduce:animate-none"
        {...props}
      >
        <div className={cn('pb-mini', className)}>{children}</div>
      </AccordionPrimitive.Content>
    );
  },
);

/* ------------------------------------------------------------------ Tabs */

type TabsVariant = 'underline' | 'segmented';
const TabsVariantContext = React.createContext<TabsVariant>('underline');

export const tabsListVariants = cva('grid grid-flow-col auto-cols-fr', {
  variants: {
    variant: {
      underline: 'border-b border-border bg-surface-primary',
      segmented: 'gap-xnano rounded-md border border-border bg-surface-primary p-xnano',
    },
  },
  defaultVariants: { variant: 'underline' },
});
export const tabsTriggerVariants = cva(
  ['body cursor-pointer select-none font-medium transition-colors', focusRing, 'disabled:cursor-not-allowed disabled:text-interactive-text-disabled'],
  {
    variants: {
      variant: {
        underline: [
          'relative min-h-button px-mini text-muted-foreground hover:bg-interactive-fill-quiet-hover hover:text-foreground active:bg-interactive-fill-quiet-active disabled:hover:bg-transparent',
          'data-[state=active]:font-semibold data-[state=active]:text-foreground',
          "after:absolute after:inset-x-mini after:-bottom-px after:h-xnano after:rounded-full after:content-['']",
          'data-[state=active]:after:bg-selected-indicator',
        ],
        segmented: [
          'min-h-large rounded-sm text-foreground hover:bg-interactive-fill-quiet-hover active:bg-interactive-fill-quiet-active disabled:hover:bg-transparent data-[state=active]:hover:bg-interactive-fill-loud-hover',
          'data-[state=active]:bg-primary data-[state=active]:font-semibold data-[state=active]:text-primary-foreground',
        ],
      },
    },
    defaultVariants: { variant: 'underline' },
  },
);

export const TabsRoot = TabsPrimitive.Root;
export interface TabsListProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>, VariantProps<typeof tabsListVariants> {}
export const TabsList = React.forwardRef<React.ElementRef<typeof TabsPrimitive.List>, TabsListProps>(function TabsList(
  { className, variant = 'underline', ...props },
  ref,
) {
  const v = variant ?? 'underline';
  return (
    <TabsVariantContext.Provider value={v}>
      <TabsPrimitive.List ref={ref} className={cn(tabsListVariants({ variant: v }), className)} {...props} />
    </TabsVariantContext.Provider>
  );
});
export const TabsTrigger = React.forwardRef<React.ElementRef<typeof TabsPrimitive.Trigger>, React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>>(
  function TabsTrigger({ className, ...props }, ref) {
    const variant = React.useContext(TabsVariantContext);
    return <TabsPrimitive.Trigger ref={ref} className={cn(tabsTriggerVariants({ variant }), className)} {...props} />;
  },
);
export const TabsContent = React.forwardRef<React.ElementRef<typeof TabsPrimitive.Content>, React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>>(
  function TabsContent({ className, ...props }, ref) {
    return <TabsPrimitive.Content ref={ref} className={cn('mt-mini rounded-sm', focusRing, className)} {...props} />;
  },
);
