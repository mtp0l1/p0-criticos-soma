/* Primitivas de formulário no padrão shadcn/ui: Label, Input, Textarea, Checkbox, Switch, RadioGroup, Select. */
import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { cn, focusRing } from '../lib/utils';

/* ---------------------------------------------------------------- Label */

export const Label = React.forwardRef<React.ElementRef<typeof LabelPrimitive.Root>, React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>>(
  function Label({ className, ...props }, ref) {
    return <LabelPrimitive.Root ref={ref} className={cn('label text-foreground peer-disabled:cursor-not-allowed peer-disabled:text-interactive-text-disabled', className)} {...props} />;
  },
);

/* ---------------------------------------------------------- Input/Textarea */

const fieldBase = cn(
  'body w-full rounded-md border border-input bg-surface-primary px-mini text-foreground font-sans',
  'placeholder:text-muted-foreground transition-colors duration-150 motion-reduce:transition-none',
  'hover:border-text-secondary focus-visible:border-border-highlight',
  focusRing,
  'disabled:cursor-not-allowed disabled:border-transparent disabled:bg-interactive-fill-disabled disabled:text-interactive-text-disabled',
  'aria-[invalid=true]:border-feedback-text-negative',
);

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;
/** shadcn Input com a altura e a borda acessível do So+ma. */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input({ className, type = 'text', ...props }, ref) {
  return <input ref={ref} type={type} className={cn(fieldBase, 'h-input', className)} {...props} />;
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
          'peer grid size-xsmall shrink-0 place-items-center rounded-xs border-[1.5px] border-input bg-surface-primary transition-colors',
          'hover:border-text-primary',
          focusRing,
          'data-[state=checked]:border-text-primary data-[state=checked]:bg-surface-inverse data-[state=checked]:text-text-inverse',
          'disabled:cursor-not-allowed disabled:border-border disabled:bg-interactive-fill-disabled',
          className,
        )}
        {...props}
      >
        <CheckboxPrimitive.Indicator>
          <Check className="size-[14px]" strokeWidth={3} aria-hidden />
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
          'bg-text-secondary data-[state=checked]:bg-surface-inverse',
          focusRing,
          'disabled:cursor-not-allowed disabled:bg-border',
          className,
        )}
        {...props}
      >
        <SwitchPrimitive.Thumb
          className={cn(
            'pointer-events-none block size-xsmall rounded-full bg-surface-primary transition-transform motion-reduce:transition-none',
            'data-[state=checked]:translate-x-xsmall data-[state=checked]:bg-primary data-[state=unchecked]:translate-x-0',
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
          'peer grid aspect-square size-xsmall shrink-0 place-items-center rounded-full border-[1.5px] border-input bg-surface-primary text-text-primary',
          'hover:border-text-primary data-[state=checked]:border-text-primary',
          focusRing,
          'disabled:cursor-not-allowed disabled:border-border disabled:bg-interactive-fill-disabled',
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
        className={cn(fieldBase, 'flex h-input items-center justify-between gap-nano text-left data-[placeholder]:text-muted-foreground [&>span]:truncate', className)}
        {...props}
      >
        {children}
        <SelectPrimitive.Icon asChild>
          <ChevronDown className="size-icon shrink-0 text-icon-brand-strong" strokeWidth={1.75} aria-hidden />
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
            'data-[state=open]:animate-fade-in',
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
