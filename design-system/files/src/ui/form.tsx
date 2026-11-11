/* Primitivas de formulário no padrão shadcn/ui: Label, Input, Textarea, Checkbox, Switch, RadioGroup, Select. */
import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown, ChevronUp, Minus } from 'lucide-react';
import { cn, focusRing, hitArea } from '../lib/utils';

/* ---------------------------------------------------------------- Label */

export const Label = React.forwardRef<React.ElementRef<typeof LabelPrimitive.Root>, React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>>(
  function Label({ className, ...props }, ref) {
    return <LabelPrimitive.Root ref={ref} className={cn('label text-foreground peer-disabled:cursor-not-allowed peer-disabled:text-interactive-text-disabled group-data-[disabled=true]:text-interactive-text-disabled', className)} {...props} />;
  },
);

/* ---------------------------------------------------------- Input/Textarea */

export const fieldBase = cn(
  'body w-full rounded-md border border-input bg-surface-primary px-mini text-foreground font-sans',
  'placeholder:text-muted-foreground transition-colors duration-150 motion-reduce:transition-none',
  'hover:border-text-secondary focus-visible:border-border-highlight',
  focusRing,
  'disabled:cursor-not-allowed disabled:border-transparent disabled:bg-interactive-fill-disabled disabled:text-interactive-text-disabled',
  '[&[readonly]]:bg-surface-secondary [&[readonly]]:hover:border-input',
  'aria-[invalid=true]:border-feedback-text-negative aria-[invalid=true]:hover:border-feedback-text-negative aria-[invalid=true]:focus-visible:border-feedback-text-negative aria-[invalid=true]:focus-visible:ring-destructive',
);

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;
/** shadcn Input com a altura e a borda acessível do So+ma. */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input({ className, type = 'text', ...props }, ref) {
  return <input ref={ref} type={type} className={cn(fieldBase, 'h-input min-w-0 file:mr-micro file:h-full file:cursor-pointer file:border-0 file:bg-transparent file:font-sans file:font-semibold file:text-text-link', className)} {...props} />;
});

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea({ className, rows = 4, ...props }, ref) {
  return <textarea ref={ref} rows={rows} className={cn(fieldBase, 'block resize-y py-micro', className)} {...props} />;
});

/* -------------------------------------------------------------- Checkbox */

export const Checkbox = React.forwardRef<React.ElementRef<typeof CheckboxPrimitive.Root>, React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>>(
  function Checkbox({ className, ...props }, ref) {
    return (
      <CheckboxPrimitive.Root
        ref={ref}
        className={cn(
          'peer group grid size-xsmall shrink-0 cursor-pointer place-items-center rounded-xs border-[1.5px] border-input bg-surface-primary transition-colors',
          hitArea,
          'hover:border-text-primary active:bg-interactive-fill-quiet-active',
          focusRing,
          'data-[state=checked]:border-text-primary data-[state=checked]:bg-surface-inverse data-[state=checked]:text-text-inverse',
          'data-[state=indeterminate]:border-text-primary data-[state=indeterminate]:bg-surface-inverse data-[state=indeterminate]:text-text-inverse',
          'aria-[invalid=true]:border-feedback-text-negative',
          'disabled:cursor-not-allowed disabled:border-border disabled:bg-interactive-fill-disabled disabled:text-interactive-text-disabled disabled:data-[state=checked]:bg-interactive-fill-disabled disabled:data-[state=checked]:text-interactive-text-disabled',
          className,
        )}
        {...props}
      >
        <CheckboxPrimitive.Indicator>
          <Check className="size-[14px] group-data-[state=indeterminate]:hidden" strokeWidth={3} aria-hidden />
          <Minus className="hidden size-[14px] group-data-[state=indeterminate]:block" strokeWidth={3} aria-hidden />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
    );
  },
);

/* ---------------------------------------------------------------- Switch */

/** Trilho navy quando ligado e cinza quando desligado: os dois passam de 3:1 contra o branco (o laranja não passaria). */
export const Switch = React.forwardRef<React.ElementRef<typeof SwitchPrimitive.Root>, React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>>(
  function Switch({ className, ...props }, ref) {
    return (
      <SwitchPrimitive.Root
        ref={ref}
        className={cn(
          'peer inline-flex h-small w-touch shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors',
          'bg-text-secondary hover:bg-text-primary data-[state=checked]:bg-surface-inverse',
          hitArea,
          focusRing,
          'disabled:cursor-not-allowed disabled:bg-border disabled:hover:bg-border disabled:data-[state=checked]:bg-border',
          className,
        )}
        {...props}
      >
        <SwitchPrimitive.Thumb
          className={cn(
            'pointer-events-none block size-xsmall rounded-full bg-surface-primary transition-transform motion-reduce:transition-none',
            'data-[state=checked]:translate-x-xsmall data-[state=checked]:bg-primary data-[state=unchecked]:translate-x-0 data-[disabled]:bg-interactive-fill-disabled',
          )}
        />
      </SwitchPrimitive.Root>
    );
  },
);

/* ------------------------------------------------------------ RadioGroup */

export const RadioGroup = React.forwardRef<React.ElementRef<typeof RadioGroupPrimitive.Root>, React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>>(
  function RadioGroup({ className, ...props }, ref) {
    return <RadioGroupPrimitive.Root ref={ref} className={cn('grid gap-nano', className)} {...props} />;
  },
);
export const RadioGroupItem = React.forwardRef<React.ElementRef<typeof RadioGroupPrimitive.Item>, React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>>(
  function RadioGroupItem({ className, ...props }, ref) {
    return (
      <RadioGroupPrimitive.Item
        ref={ref}
        className={cn(
          'peer grid aspect-square size-xsmall shrink-0 cursor-pointer place-items-center rounded-full border-[1.5px] border-input bg-surface-primary text-text-primary transition-colors',
          hitArea,
          'hover:border-text-primary active:bg-interactive-fill-quiet-active data-[state=checked]:border-text-primary',
          focusRing,
          'aria-[invalid=true]:border-feedback-text-negative',
          'disabled:cursor-not-allowed disabled:border-border disabled:bg-interactive-fill-disabled disabled:text-interactive-text-disabled',
          className,
        )}
        {...props}
      >
        <RadioGroupPrimitive.Indicator className="block size-nano rounded-full bg-current" />
      </RadioGroupPrimitive.Item>
    );
  },
);

/* ---------------------------------------------------------------- Select */

export const Select = SelectPrimitive.Root;
export const SelectGroup = SelectPrimitive.Group;
export const SelectValue = SelectPrimitive.Value;

export const SelectTrigger = React.forwardRef<React.ElementRef<typeof SelectPrimitive.Trigger>, React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>>(
  function SelectTrigger({ className, children, ...props }, ref) {
    return (
      <SelectPrimitive.Trigger
        ref={ref}
        className={cn(fieldBase, 'flex h-input cursor-pointer items-center justify-between gap-nano text-left data-[placeholder]:text-muted-foreground data-[state=open]:border-border-highlight disabled:[&_svg]:text-interactive-text-disabled [&>span]:truncate', className)}
        {...props}
      >
        {children}
        <SelectPrimitive.Icon asChild>
          <ChevronDown className="size-icon shrink-0 text-icon-brand-strong" aria-hidden />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
    );
  },
);

export const SelectContent = React.forwardRef<React.ElementRef<typeof SelectPrimitive.Content>, React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>>(
  function SelectContent({ className, children, position = 'popper', ...props }, ref) {
    return (
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          ref={ref}
          position={position}
          className={cn(
            'relative z-50 max-h-[--radix-select-content-available-height] min-w-[--radix-select-trigger-width] overflow-hidden rounded-md border border-border bg-popover text-popover-foreground shadow-high',
            'data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out motion-reduce:animate-none',
            position === 'popper' && 'data-[side=bottom]:translate-y-xnano data-[side=top]:-translate-y-xnano',
            className,
          )}
          {...props}
        >
          <SelectPrimitive.ScrollUpButton className="flex h-small items-center justify-center"><ChevronUp className="size-icon-small" aria-hidden /></SelectPrimitive.ScrollUpButton>
          <SelectPrimitive.Viewport className={cn('p-xnano', position === 'popper' && 'w-full min-w-[--radix-select-trigger-width]')}>{children}</SelectPrimitive.Viewport>
          <SelectPrimitive.ScrollDownButton className="flex h-small items-center justify-center"><ChevronDown className="size-icon-small" aria-hidden /></SelectPrimitive.ScrollDownButton>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    );
  },
);

export const SelectLabel = React.forwardRef<React.ElementRef<typeof SelectPrimitive.Label>, React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>>(
  function SelectLabel({ className, ...props }, ref) {
    return <SelectPrimitive.Label ref={ref} className={cn('eyebrow px-micro py-nano text-muted-foreground', className)} {...props} />;
  },
);

export const SelectItem = React.forwardRef<React.ElementRef<typeof SelectPrimitive.Item>, React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>>(
  function SelectItem({ className, children, ...props }, ref) {
    return (
      <SelectPrimitive.Item
        ref={ref}
        className={cn(
          'body relative flex min-h-touch w-full cursor-pointer select-none items-center rounded-sm py-nano pl-micro pr-xlarge outline-none',
          'data-[highlighted]:bg-accent data-[state=checked]:font-semibold',
          'data-[disabled]:pointer-events-none data-[disabled]:text-interactive-text-disabled',
          className,
        )}
        {...props}
      >
        <span className="absolute right-micro flex size-icon items-center justify-center">
          <SelectPrimitive.ItemIndicator><Check className="size-icon-small" strokeWidth={2.5} aria-hidden /></SelectPrimitive.ItemIndicator>
        </span>
        <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      </SelectPrimitive.Item>
    );
  },
);

export const SelectSeparator = React.forwardRef<React.ElementRef<typeof SelectPrimitive.Separator>, React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>>(
  function SelectSeparator({ className, ...props }, ref) {
    return <SelectPrimitive.Separator ref={ref} className={cn('my-xnano h-px bg-border', className)} {...props} />;
  },
);
