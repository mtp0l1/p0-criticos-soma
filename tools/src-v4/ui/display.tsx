/* Primitivas de exibição no padrão shadcn/ui: Badge, Card, Separator, Progress, Avatar, Skeleton, Alert. */
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import * as SeparatorPrimitive from '@radix-ui/react-separator';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { Slot } from '@radix-ui/react-slot';
import { cn, focusRing } from '../lib/utils';

/* ---------------------------------------------------------------- Badge */

export const badgeVariants = cva(
  'inline-flex items-center gap-xnano min-h-small px-micro rounded-full font-sans text-[12px] leading-4 font-medium whitespace-nowrap [&_svg]:size-[14px] [&_svg]:shrink-0',
  {
    variants: {
      /** Papel do selo. Sempre com palavra; ícone para estado. */
      tone: {
        neutral: 'bg-secondary text-secondary-foreground',
        positive: 'bg-feedback-fill-positive text-feedback-text-positive',
        caution: 'bg-feedback-fill-caution text-feedback-text-caution',
        negative: 'bg-feedback-fill-negative text-feedback-text-negative',
        informative: 'bg-feedback-fill-informative text-feedback-text-informative',
        brand: 'bg-primary text-primary-foreground',
      },
    },
    defaultVariants: { tone: 'neutral' },
  },
);
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {
  /** Renderiza o filho (um link ou botão) com o visual do selo; ganha foco e hover. */
  asChild?: boolean;
}
/** Selo (shadcn Badge). Não interativo por padrão; com asChild vira link ou botão. Base de Tag e StatusChip. */
export function Badge({ className, tone, asChild, ...props }: BadgeProps) {
  const Comp = asChild ? Slot : 'span';
  return <Comp className={cn(badgeVariants({ tone }), asChild && cn('cursor-pointer no-underline transition-colors hover:underline', focusRing), className)} {...props} />;
}

/* ----------------------------------------------------------------- Card */

export const cardVariants = cva('grid rounded-lg text-card-foreground', {
  variants: {
    /** outline = borda clara sobre fundo branco · flat = sem borda, sobre background-secondary · accent = creme · inverse = navy. */
    variant: {
      outline: 'border border-border bg-card',
      flat: 'bg-card',
      accent: 'bg-surface-accent',
      inverse: 'bg-surface-inverse text-text-inverse',
    },
    padding: { none: '', default: 'gap-micro p-mini' },
  },
  defaultVariants: { variant: 'outline', padding: 'default' },
});
export interface CardProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {}
export const Card = React.forwardRef<HTMLDivElement, CardProps>(function Card({ className, variant, padding, ...props }, ref) {
  return <div ref={ref} className={cn(cardVariants({ variant, padding }), className)} {...props} />;
});
export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('grid gap-xnano', className)} {...props} />;
}
export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('body-strong m-0', className)} {...props} />;
}
export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('caption m-0 text-muted-foreground', className)} {...props} />;
}
/** Ação no canto do cabeçalho do card (shadcn CardAction). Use dentro de CardHeader com `className="grid-cols-[1fr_auto]"`. */
export function CardAction({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('col-start-2 row-span-2 row-start-1 self-start justify-self-end', className)} {...props} />;
}
export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('grid gap-nano', className)} {...props} />;
}
export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-wrap items-center gap-nano', className)} {...props} />;
}

/* ------------------------------------------------------------ Separator */

export type SeparatorProps = React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>;
export const Separator = React.forwardRef<React.ElementRef<typeof SeparatorPrimitive.Root>, SeparatorProps>(function Separator(
  { className, orientation = 'horizontal', decorative = true, ...props },
  ref,
) {
  return (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn('shrink-0 bg-border', orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px', className)}
      {...props}
    />
  );
});

/* ------------------------------------------------------------- Progress */

export interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  /** 0 a 100. */
  value?: number;
  /** Nome acessível ("Progresso no nível"). */
  label?: string;
  /** Classe do preenchimento (ex.: sobre surface-brand use bg-surface-inverse). */
  indicatorClassName?: string;
}
export const Progress = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, ProgressProps>(function Progress(
  { className, value = 0, label, indicatorClassName, ...props },
  ref,
) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <ProgressPrimitive.Root ref={ref} value={v} aria-label={label} className={cn('relative h-nano w-full overflow-hidden rounded-full bg-surface-track', className)} {...props}>
      <ProgressPrimitive.Indicator
        className={cn('h-full w-full rounded-full bg-selected-indicator transition-transform duration-300 motion-reduce:transition-none', indicatorClassName)}
        style={{ transform: `translateX(-${100 - v}%)` }}
      />
    </ProgressPrimitive.Root>
  );
});

/* --------------------------------------------------------------- Avatar */

export const avatarVariants = cva('relative flex shrink-0 overflow-hidden rounded-full bg-surface-accent', {
  variants: { size: { medal: 'size-medal', thumb: 'size-thumb', avatar: 'size-avatar' } },
  defaultVariants: { size: 'thumb' },
});
export interface AvatarProps extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>, VariantProps<typeof avatarVariants> {}
export const Avatar = React.forwardRef<React.ElementRef<typeof AvatarPrimitive.Root>, AvatarProps>(function Avatar({ className, size, ...props }, ref) {
  return <AvatarPrimitive.Root ref={ref} className={cn(avatarVariants({ size }), className)} {...props} />;
});
export const AvatarImage = React.forwardRef<React.ElementRef<typeof AvatarPrimitive.Image>, React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>>(
  function AvatarImage({ className, ...props }, ref) {
    return <AvatarPrimitive.Image ref={ref} className={cn('aspect-square size-full object-cover', className)} {...props} />;
  },
);
export const AvatarFallback = React.forwardRef<React.ElementRef<typeof AvatarPrimitive.Fallback>, React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>>(
  function AvatarFallback({ className, ...props }, ref) {
    return <AvatarPrimitive.Fallback ref={ref} className={cn('label flex size-full items-center justify-center text-text-link', className)} {...props} />;
  },
);

/* ------------------------------------------------------------- Skeleton */

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Sem variant: um bloco livre (shadcn). text = parágrafo · row = linha com miniatura · card = bloco do tamanho de um tile. */
  variant?: 'text' | 'row' | 'card';
  lines?: number;
}
const Bone = ({ className }: { className?: string }) => (
  <span className={cn('block rounded-sm bg-muted animate-pulse motion-reduce:animate-none', className)} />
);
/** Placeholder de carregamento. Adição intencional, inspirada no Skeleton do Andes e do shadcn. */
export function Skeleton({ variant, lines = 2, className, ...props }: SkeletonProps) {
  if (!variant) return <div className={cn('rounded-md bg-muted animate-pulse motion-reduce:animate-none', className)} {...props} />;
  const ls = Array.from({ length: lines }, (_, i) => <Bone key={i} className={cn('h-micro', i === lines - 1 ? 'w-[70%]' : 'w-full')} />);
  return (
    <div role="status" aria-label="Carregando" className={cn('grid gap-nano', className)} {...props}>
      {variant === 'card' && <Bone className="h-tile rounded-lg" />}
      {variant === 'row' ? (
        <div className="grid grid-cols-[auto_1fr] items-center gap-micro">
          <Bone className="size-thumb rounded-full" />
          <div className="grid gap-nano"><Bone className="h-mini w-[60%]" />{ls}</div>
        </div>
      ) : (
        <>{variant === 'text' && <Bone className="h-mini w-[60%]" />}{ls}</>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- Alert */

export const alertVariants = cva('relative grid grid-cols-[auto_1fr] gap-x-micro gap-y-xnano rounded-md px-mini py-micro [&>svg]:mt-[1px]', {
  variants: {
    tone: {
      informative: 'bg-feedback-fill-informative text-feedback-text-informative',
      positive: 'bg-feedback-fill-positive text-foreground [&>svg]:text-feedback-text-positive',
      caution: 'bg-feedback-fill-caution text-foreground [&>svg]:text-feedback-text-caution',
      negative: 'bg-feedback-fill-negative text-foreground [&>svg]:text-feedback-text-negative',
    },
  },
  defaultVariants: { tone: 'informative' },
});
export interface AlertProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof alertVariants> {}
/** shadcn Alert: base do Message. */
export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert({ className, tone, ...props }, ref) {
  return <div ref={ref} role={tone === 'negative' ? 'alert' : 'status'} className={cn(alertVariants({ tone }), className)} {...props} />;
});
export function AlertTitle({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('label col-start-2 m-0', className)} {...props} />;
}
export function AlertDescription({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('caption col-start-2', className)} {...props} />;
}
