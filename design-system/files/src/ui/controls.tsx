/* Primitivas de controle no padrão shadcn/ui: Spinner, ButtonGroup, Toggle, ToggleGroup, Slider, NativeSelect, InputGroup, InputOTP, Field. */
import * as React from 'react';
import * as TogglePrimitive from '@radix-ui/react-toggle';
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { OTPInput, OTPInputContext } from 'input-otp';
import { cva, type VariantProps } from 'class-variance-authority';
import { ChevronDown, Loader2 } from 'lucide-react';
import { cn, focusRing, hitArea } from '../lib/utils';
import { fieldBase, Label } from './form';

/* --------------------------------------------------------------- Spinner */

export interface SpinnerProps extends React.SVGAttributes<SVGSVGElement> {
  /** Texto para leitor de tela. Padrão "Carregando". */
  label?: string;
}
/** Indicador de espera sem duração conhecida (shadcn Spinner). Dentro de botão, use `loading` do Button. */
export function Spinner({ className, label = 'Carregando', ...props }: SpinnerProps) {
  return <Loader2 role="status" aria-label={label} className={cn('size-icon animate-spin text-icon-brand-strong motion-reduce:animate-none', className)} {...props} />;
}

/* ----------------------------------------------------------- ButtonGroup */

export const buttonGroupVariants = cva('inline-flex [&>*]:relative [&>*:focus-visible]:z-10', {
  variants: {
    orientation: {
      horizontal: 'flex-row [&>*:not(:first-child)]:-ml-[1.5px] [&>*:not(:first-child)]:rounded-l-none [&>*:not(:last-child)]:rounded-r-none',
      vertical: 'flex-col [&>*:not(:first-child)]:-mt-[1.5px] [&>*:not(:first-child)]:rounded-t-none [&>*:not(:last-child)]:rounded-b-none',
    },
  },
  defaultVariants: { orientation: 'horizontal' },
});
export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof buttonGroupVariants> {}
/** Botões relacionados colados lado a lado (shadcn ButtonGroup). Dê um nome com aria-label. */
export function ButtonGroup({ className, orientation, ...props }: ButtonGroupProps) {
  return <div role="group" data-orientation={orientation ?? 'horizontal'} className={cn(buttonGroupVariants({ orientation }), className)} {...props} />;
}

/* ---------------------------------------------------------------- Toggle */

export const toggleVariants = cva(
  [
    'label inline-flex cursor-pointer select-none items-center justify-center gap-nano rounded-md border-[1.5px] font-sans text-foreground transition-colors motion-reduce:transition-none',
    '[&_svg]:pointer-events-none [&_svg]:size-icon [&_svg]:shrink-0',
    'hover:bg-interactive-fill-quiet-hover active:bg-interactive-fill-quiet-active',
    focusRing,
    'data-[state=on]:border-border-highlight data-[state=on]:bg-surface-accent data-[state=on]:font-semibold',
    'disabled:pointer-events-none disabled:border-transparent disabled:bg-interactive-fill-disabled disabled:text-interactive-text-disabled',
  ],
  {
    variants: {
      /** ghost = sem borda até ligar · outline = borda sempre visível. */
      variant: { ghost: 'border-transparent bg-transparent', outline: 'border-input bg-surface-primary' },
      size: { large: 'min-h-button min-w-button px-mini', compact: 'min-h-touch min-w-touch px-micro' },
    },
    defaultVariants: { variant: 'ghost', size: 'compact' },
  },
);
export interface ToggleProps extends React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root>, VariantProps<typeof toggleVariants> {}
/** Botão de liga e desliga (aria-pressed), sobre Radix Toggle. Ex.: favoritar uma recompensa. */
export const Toggle = React.forwardRef<React.ElementRef<typeof TogglePrimitive.Root>, ToggleProps>(function Toggle({ className, variant, size, ...props }, ref) {
  return <TogglePrimitive.Root ref={ref} className={cn(toggleVariants({ variant, size }), className)} {...props} />;
});

const ToggleGroupContext = React.createContext<VariantProps<typeof toggleVariants>>({});
export type ToggleGroupProps = React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> & VariantProps<typeof toggleVariants>;
/** Grupo de Toggles: escolha única (type="single") ou múltipla (type="multiple"), com setas do teclado. */
export const ToggleGroup = React.forwardRef<React.ElementRef<typeof ToggleGroupPrimitive.Root>, ToggleGroupProps>(function ToggleGroup(
  { className, variant, size, children, ...props },
  ref,
) {
  return (
    <ToggleGroupPrimitive.Root ref={ref} className={cn('flex flex-wrap items-center gap-xnano', className)} {...props}>
      <ToggleGroupContext.Provider value={{ variant, size }}>{children}</ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  );
});
export const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> & VariantProps<typeof toggleVariants>
>(function ToggleGroupItem({ className, variant, size, ...props }, ref) {
  const ctx = React.useContext(ToggleGroupContext);
  return <ToggleGroupPrimitive.Item ref={ref} className={cn(toggleVariants({ variant: ctx.variant ?? variant, size: ctx.size ?? size }), className)} {...props} />;
});

/* ---------------------------------------------------------------- Slider */

export interface SliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  /** Nome acessível de cada alça, na ordem (uma por valor). */
  thumbLabels?: string[];
}
/** Seleção de valor em faixa (Radix Slider). Mostre sempre o valor em texto ao lado. */
export const Slider = React.forwardRef<React.ElementRef<typeof SliderPrimitive.Root>, SliderProps>(function Slider(
  { className, thumbLabels, defaultValue, value, 'aria-label': ariaLabel, ...props },
  ref,
) {
  const count = (value ?? defaultValue ?? [0]).length;
  return (
    <SliderPrimitive.Root
      ref={ref}
      value={value}
      defaultValue={defaultValue}
      className={cn('relative flex min-h-touch w-full touch-none select-none items-center data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-0 data-[orientation=vertical]:w-touch data-[orientation=vertical]:flex-col', className)}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-nano w-full grow overflow-hidden rounded-full bg-surface-track data-[orientation=vertical]:h-full data-[orientation=vertical]:w-nano">
        <SliderPrimitive.Range className="absolute h-full bg-selected-indicator data-[disabled]:bg-interactive-text-disabled data-[orientation=vertical]:h-auto data-[orientation=vertical]:w-full" />
      </SliderPrimitive.Track>
      {Array.from({ length: count }, (_, i) => (
        <SliderPrimitive.Thumb
          key={i}
          aria-label={thumbLabels?.[i] ?? ariaLabel}
          className={cn(
            'block size-small cursor-grab rounded-full border-2 border-text-primary bg-surface-primary transition-colors active:cursor-grabbing',
            hitArea,
            'hover:bg-interactive-fill-quiet-hover active:bg-interactive-fill-quiet-active',
            focusRing,
            'data-[disabled]:cursor-not-allowed data-[disabled]:border-interactive-text-disabled data-[disabled]:bg-interactive-fill-disabled',
          )}
        />
      ))}
    </SliderPrimitive.Root>
  );
});

/* ---------------------------------------------------------- NativeSelect */

export type NativeSelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;
/** Select nativo do sistema (shadcn NativeSelect). No celular abre o seletor do aparelho: prefira-o para listas simples. */
export const NativeSelect = React.forwardRef<HTMLSelectElement, NativeSelectProps>(function NativeSelect({ className, children, ...props }, ref) {
  return (
    <div className="group relative w-full">
      <select ref={ref} className={cn(fieldBase, 'h-input cursor-pointer appearance-none pr-xlarge', className)} {...props}>
        {children}
      </select>
      <ChevronDown aria-hidden className="pointer-events-none absolute right-mini top-1/2 size-icon -translate-y-1/2 text-icon-brand-strong group-has-[:disabled]:text-interactive-text-disabled" />
    </div>
  );
});

/* ------------------------------------------------------------ InputGroup */

/** Campo com ícone, texto ou botão dentro da mesma borda (shadcn InputGroup). O foco e o erro aparecem no grupo inteiro. */
export function InputGroup({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="group"
      className={cn(
        'flex h-input w-full items-center rounded-md border border-input bg-surface-primary text-foreground transition-colors motion-reduce:transition-none',
        'hover:border-text-secondary',
        'has-[input:focus-visible]:border-border-highlight has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-ring has-[input:focus-visible]:ring-offset-2 has-[input:focus-visible]:ring-offset-background',
        'has-[input[aria-invalid=true]]:border-feedback-text-negative has-[input[aria-invalid=true]:focus-visible]:ring-destructive',
        'has-[input:disabled]:border-transparent has-[input:disabled]:bg-interactive-fill-disabled has-[input:disabled]:text-interactive-text-disabled',
        className,
      )}
      {...props}
    />
  );
}
export const InputGroupInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(function InputGroupInput({ className, type = 'text', ...props }, ref) {
  return (
    <input
      ref={ref}
      type={type}
      className={cn('body h-full min-w-0 flex-1 rounded-md border-0 bg-transparent px-mini font-sans text-foreground outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:text-interactive-text-disabled', className)}
      {...props}
    />
  );
});
export interface InputGroupAddonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** start = antes do campo · end = depois. */
  align?: 'start' | 'end';
}
/** Ícone, texto ("R$", "pontos") ou botão do grupo. */
export function InputGroupAddon({ className, align = 'start', ...props }: InputGroupAddonProps) {
  return (
    <div
      data-align={align}
      className={cn('caption flex shrink-0 items-center gap-xnano text-muted-foreground [&_svg]:size-icon [&_svg]:text-icon-brand-strong', align === 'start' ? 'order-first pl-mini' : 'order-last pr-xnano [&:not(:has(button))]:pr-mini', className)}
      {...props}
    />
  );
}

/* -------------------------------------------------------------- InputOTP */

/** Código de verificação por dígitos (shadcn InputOTP, sobre input-otp). Cola o código inteiro e lê o SMS no celular. */
export const InputOTP = React.forwardRef<React.ElementRef<typeof OTPInput>, React.ComponentPropsWithoutRef<typeof OTPInput>>(function InputOTP(
  { className, containerClassName, ...props },
  ref,
) {
  return <OTPInput ref={ref} containerClassName={cn('flex items-center gap-nano', containerClassName)} className={cn('disabled:cursor-not-allowed', className)} {...props} />;
});
export function InputOTPGroup({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex items-center gap-nano', className)} {...props} />;
}
export interface InputOTPSlotProps extends React.HTMLAttributes<HTMLDivElement> {
  index: number;
  invalid?: boolean;
}
export function InputOTPSlot({ index, invalid, className, ...props }: InputOTPSlotProps) {
  const ctx = React.useContext(OTPInputContext);
  const slot = ctx?.slots[index];
  return (
    <div
      data-active={slot?.isActive || undefined}
      className={cn(
        'relative grid h-input w-button place-items-center rounded-md border border-input bg-surface-primary font-sans text-[20px] font-semibold leading-7 text-foreground transition-colors motion-reduce:transition-none',
        'data-[active]:border-border-highlight data-[active]:ring-2 data-[active]:ring-ring data-[active]:ring-offset-2 data-[active]:ring-offset-background',
        invalid && 'border-feedback-text-negative data-[active]:ring-destructive',
        className,
      )}
      {...props}
    >
      {slot?.char}
      {slot?.hasFakeCaret && <span aria-hidden className="pointer-events-none absolute h-small w-[2px] animate-caret-blink bg-text-primary motion-reduce:animate-none" />}
    </div>
  );
}
export function InputOTPSeparator(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div role="separator" className="h-[2px] w-nano rounded-full bg-border" {...props} />;
}

/* ----------------------------------------------------------------- Field */

/** Grupo de campos com legenda (shadcn FieldSet). */
export function FieldSet({ className, ...props }: React.FieldsetHTMLAttributes<HTMLFieldSetElement>) {
  return <fieldset className={cn('m-0 grid min-w-0 gap-mini border-0 p-0', className)} {...props} />;
}
export function FieldLegend({ className, ...props }: React.HTMLAttributes<HTMLLegendElement>) {
  return <legend className={cn('body-strong mb-nano p-0 text-foreground', className)} {...props} />;
}
/** Empilha Fields com o espaço padrão entre campos (space-small). */
export function FieldGroup({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('grid gap-small', className)} {...props} />;
}
export const fieldVariants = cva('group grid', {
  variants: {
    /** vertical = rótulo em cima (padrão) · horizontal = controle e rótulo lado a lado (Checkbox, Switch). */
    orientation: { vertical: 'gap-nano', horizontal: 'grid-cols-[auto_1fr] items-start gap-x-micro gap-y-xnano [&>[role=switch]]:order-last [&:has(>[role=switch])]:grid-cols-[1fr_auto]' },
  },
  defaultVariants: { orientation: 'vertical' },
});
export interface FieldProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof fieldVariants> {
  invalid?: boolean;
  disabled?: boolean;
}
/** Um campo: rótulo, controle, ajuda e erro (shadcn Field). Marca data-invalid e data-disabled para os filhos. */
export function Field({ className, orientation, invalid, disabled, ...props }: FieldProps) {
  return <div role="group" data-invalid={invalid || undefined} data-disabled={disabled || undefined} className={cn(fieldVariants({ orientation }), className)} {...props} />;
}
export const FieldLabel = React.forwardRef<React.ElementRef<typeof Label>, React.ComponentPropsWithoutRef<typeof Label>>(function FieldLabel({ className, ...props }, ref) {
  return <Label ref={ref} className={cn('body-small font-normal group-data-[invalid=true]:text-feedback-text-negative', className)} {...props} />;
});
/** Agrupa rótulo e descrição ao lado de um Checkbox ou Switch. */
export function FieldContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('grid gap-xnano', className)} {...props} />;
}
export function FieldDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('caption m-0 text-muted-foreground', className)} {...props} />;
}
/** Mensagem de erro do campo: anunciada na hora (role="alert") e ligada ao controle por aria-describedby. */
export function FieldError({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  if (!children) return null;
  return <p role="alert" className={cn('caption m-0 font-medium text-feedback-text-negative', className)} {...props}>{children}</p>;
}
export function FieldSeparator({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div role="separator" className={cn('h-px w-full bg-border', className)} {...props} />;
}
