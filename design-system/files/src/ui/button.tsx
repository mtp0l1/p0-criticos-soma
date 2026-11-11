import * as React from 'react';
import { Slot, Slottable } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn, focusRing } from '../lib/utils';
import { Icon, type IconName } from './icon';

export const buttonVariants = cva(
  [
    'button relative inline-flex items-center justify-center gap-nano whitespace-nowrap rounded-md border-[1.5px] border-transparent',
    'font-sans transition-colors duration-150 motion-reduce:transition-none select-none cursor-pointer',
    focusRing,
    '[&_svg]:pointer-events-none [&_svg]:shrink-0',
    'disabled:pointer-events-none disabled:border-transparent disabled:bg-interactive-fill-disabled disabled:text-interactive-text-disabled disabled:[&_svg]:text-interactive-text-disabled',
    // Link com cara de botão (asChild) não tem `disabled`: usa aria-disabled com o mesmo visual.
    'aria-disabled:pointer-events-none aria-disabled:border-transparent aria-disabled:bg-interactive-fill-disabled aria-disabled:text-interactive-text-disabled aria-disabled:[&_svg]:text-interactive-text-disabled',
    'aria-[busy=true]:cursor-progress',
  ],
  {
    variants: {
      /** loud = primário (um por tela) · quiet = outline · transparent = texto/link · destructive = ação que apaga ou sai. */
      hierarchy: {
        loud: 'bg-primary text-primary-foreground hover:bg-interactive-fill-loud-hover active:bg-interactive-fill-loud-active',
        quiet: 'border-interactive-border-quiet bg-surface-primary text-foreground hover:bg-interactive-fill-quiet-hover active:bg-interactive-fill-quiet-active [&_svg]:text-icon-brand',
        transparent: 'bg-transparent text-text-link hover:bg-interactive-fill-quiet-hover active:bg-interactive-fill-quiet-active active:text-foreground disabled:bg-transparent aria-disabled:bg-transparent',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-interactive-fill-destructive-hover active:bg-interactive-fill-destructive-active',
      },
      /** large = 48px (padrão) · compact = 44px, para listas e cards densos · icon = quadrado de 44px. */
      size: {
        large: 'min-h-button px-small',
        compact: 'min-h-touch px-mini',
        icon: 'size-touch p-0',
      },
      fullWidth: { true: 'flex w-full', false: '' },
    },
    compoundVariants: [
      { hierarchy: 'transparent', size: 'large', className: 'min-h-touch px-nano' },
      { hierarchy: 'transparent', size: 'icon', className: 'rounded-full text-icon-brand-strong' },
    ],
    defaultVariants: { hierarchy: 'loud', size: 'large', fullWidth: false },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Renderiza o filho (ex.: um link) com o visual do botão. Padrão Radix Slot. */
  asChild?: boolean;
  icon?: IconName;
  iconPosition?: 'start' | 'end';
  /** Mantém a cor da ênfase, mostra o indicador e ignora toques. */
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, hierarchy, size, fullWidth, asChild = false, icon, iconPosition = 'start', loading, disabled, onClick, children, type, ...props },
  ref,
) {
  const Comp = asChild ? Slot : 'button';
  const ic = icon ? <Icon name={icon} size={hierarchy === 'transparent' ? 'small' : 'medium'} /> : null;
  return (
    <Comp
      ref={ref}
      className={cn(buttonVariants({ hierarchy, size, fullWidth }), className)}
      disabled={asChild ? undefined : disabled}
      aria-disabled={asChild && disabled ? true : undefined}
      tabIndex={asChild && disabled ? -1 : undefined}
      data-loading={loading || undefined}
      type={asChild ? undefined : (type ?? 'button')}
      aria-busy={loading || undefined}
      onClick={loading ? (e: React.MouseEvent<HTMLButtonElement>) => e.preventDefault() : onClick}
      {...props}
    >
      {loading ? <Loader2 className="size-icon-small animate-spin motion-reduce:animate-none" aria-hidden /> : iconPosition === 'start' && ic}
      <Slottable>{children}</Slottable>
      {!loading && iconPosition === 'end' && ic}
    </Comp>
  );
});

export interface IconButtonProps extends Omit<ButtonProps, 'children' | 'icon' | 'size' | 'iconPosition'> {
  icon: IconName;
  /** Obrigatório: descreve a ação ("Voltar", "Ajuda", "Fechar"). */
  label: string;
}

/** Botão só com ícone: área de 44px e rótulo acessível obrigatório. */
export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { icon, label, hierarchy = 'transparent', ...props },
  ref,
) {
  return (
    <Button ref={ref} hierarchy={hierarchy} size="icon" aria-label={label} {...props}>
      <Icon name={icon} />
    </Button>
  );
});
