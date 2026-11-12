/* So+ma · navegação: Header, LocationBar, TabBar, Tabs, SegmentedControl, SectionHeader, ListRow, StepDots. */
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn, focusRing } from '../lib/utils';
import { Icon, type IconName } from '../ui/icon';
import { Button, IconButton } from '../ui/button';
import { TabsRoot, TabsList, TabsTrigger, TabsContent } from '../ui/overlay';

/** Classe comum de superfícies tocáveis (tile, card de saldo, linha). */
export const pressable = cn(
  'cursor-pointer select-none text-left font-sans transition-colors duration-150 motion-reduce:transition-none',
  focusRing,
  'disabled:pointer-events-none disabled:text-interactive-text-disabled aria-disabled:pointer-events-none aria-disabled:text-interactive-text-disabled',
);

/** Renderiza <a> quando há href, senão <button>. Mantém um único elemento tocável. */
export function PressableBase({ href, className, children, disabled, onClick, ...props }: { href?: string; className?: string; children?: React.ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  if (href) {
    // O link recebe os mesmos atributos (aria-*, data-*, onClick); desabilitado vira aria-disabled e sai da ordem de foco.
    const { type: _type, ...rest } = props as React.ButtonHTMLAttributes<HTMLButtonElement>;
    return (
      <a
        {...(rest as unknown as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        href={disabled ? undefined : href}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : undefined}
        onClick={onClick as unknown as React.MouseEventHandler<HTMLAnchorElement>}
        className={className}
      >
        {children}
      </a>
    );
  }
  return <button type="button" className={className} disabled={disabled} onClick={onClick} {...props}>{children}</button>;
}

/* ---------------------------------------------------------------- Header */

export interface HeaderProps {
  /** Título em sentence case ("Meu impacto"). */
  title: string;
  /** Voltar para a tela anterior real (nunca direto para o Início). Sem ele, a seta não aparece. */
  onBack?: () => void;
  /** Uma ação à direita (ajuda, carrinho). Nunca um "Fechar" junto do voltar. */
  action?: { icon: IconName; label: string; onClick?: () => void };
  /**
   * center = título centralizado, seta solta (padrão; Doar, Cadastro, telas anteriores).
   * round = voltar em círculo creme, título centralizado em text-secondary (Quiz).
   * start = título de tela raiz à esquerda em screen-title, botões em círculo (Ranking).
   */
  variant?: 'center' | 'round' | 'start';
  /** Divisor embaixo, como nas telas novas. Padrão true. */
  divider?: boolean;
  className?: string;
}
const roundBtn = 'size-touch rounded-full bg-surface-accent text-icon-brand-strong hover:bg-surface-accent-hover active:bg-surface-accent-hover';
export function Header({ title, onBack, action, variant = 'center', divider = true, className }: HeaderProps) {
  const round = variant !== 'center';
  const back = onBack ? <IconButton icon={round ? 'arrow-left' : 'chevron-left'} label="Voltar" onClick={onBack} className={round ? roundBtn : undefined} /> : null;
  const act = action ? <IconButton icon={action.icon} label={action.label} onClick={action.onClick} className={round ? roundBtn : undefined} /> : null;
  const shell = cn('bg-surface-primary px-xsmall py-nano text-foreground', divider && 'border-b border-border', className);
  if (variant === 'start') {
    return (
      <header className={cn(shell, 'flex min-h-input items-center gap-micro')}>
        {back}
        <h1 className="screen-title m-0 min-w-0 flex-1 truncate">{title}</h1>
        {act}
      </header>
    );
  }
  return (
    <header className={cn(shell, 'grid min-h-input grid-cols-[theme(spacing.touch)_1fr_theme(spacing.touch)] items-center')}>
      {back ?? <span />}
      <h1 className={cn('m-0 truncate text-center', variant === 'round' ? 'label text-muted-foreground' : 'header-title')}>{title}</h1>
      {act ?? <span />}
    </header>
  );
}

/* ----------------------------------------------------------- LocationBar */

export interface LocationBarProps {
  /** Nome do espaço de recebimento. Vazio = a barra vira chamada para adicionar local. */
  location?: string | null;
  onPress?: () => void;
  /** Fixa no topo ao rolar a Home. */
  sticky?: boolean;
}
export function LocationBar({ location, onPress, sticky }: LocationBarProps) {
  const empty = !location;
  return (
    <button
      type="button"
      onClick={onPress}
      className={cn(
        pressable,
        'flex min-h-touch w-full items-center justify-center gap-nano bg-surface-primary px-mini py-nano text-center text-foreground hover:bg-interactive-fill-quiet-hover active:bg-interactive-fill-quiet-active',
        sticky && 'sticky top-0 z-10 border-b border-border',
      )}
    >
      <Icon name="pin" tone="brand" />
      <span className="grid min-w-0">
        <span className="caption text-muted-foreground">{empty ? 'Você ainda não escolheu um local' : 'Entregando em'}</span>
        <span className={cn('label truncate', empty && 'text-text-link')}>{empty ? 'Adicione seu local de entrega' : location}</span>
      </span>
      <Icon name="chevron-down" tone="brand-strong" size="small" />
    </button>
  );
}

/* ---------------------------------------------------------------- TabBar */

export type TabId = 'inicio' | 'reciclar' | 'recompensas' | 'impacto' | 'menu';
/** Barra de cinco itens do redesign. "Meus resgates" virou aba dentro de Recompensas. */
export const TAB_ITEMS: Array<{ id: TabId; label: string; icon: IconName }> = [
  { id: 'inicio', label: 'Início', icon: 'home' },
  { id: 'reciclar', label: 'Reciclar', icon: 'recycle' },
  { id: 'recompensas', label: 'Recompensas', icon: 'gift' },
  { id: 'impacto', label: 'Impacto', icon: 'chart' },
  { id: 'menu', label: 'Menu', icon: 'menu' },
];
export interface TabBarProps {
  active: TabId;
  onNavigate?: (id: TabId) => void;
}
/** Navegação inferior fixa. É navegação (nav + aria-current), não abas: por isso não usa Radix Tabs. */
export function TabBar({ active, onNavigate }: TabBarProps) {
  return (
    <nav aria-label="Navegação principal" className="grid min-h-tabbar grid-cols-5 border-t border-border bg-surface-primary">
      {TAB_ITEMS.map((t) => {
        const on = t.id === active;
        return (
          <button
            key={t.id}
            type="button"
            aria-current={on ? 'page' : undefined}
            onClick={() => onNavigate?.(t.id)}
            className={cn(
              pressable,
              'tab-label flex min-h-touch flex-col items-center justify-center gap-xnano py-nano text-muted-foreground hover:text-foreground',
              'aria-[current=page]:font-semibold aria-[current=page]:text-text-link',
            )}
          >
            <Icon name={t.icon} />
            {t.label}
          </button>
        );
      })}
    </nav>
  );
}

/* ------------------------------------------------- Tabs / SegmentedControl */

export interface TabsItem { id: string; label: string; disabled?: boolean }
export interface TabsProps {
  items: TabsItem[];
  value: string;
  onChange?: (id: string) => void;
  /** Nome do grupo para leitor de tela ("Período do ranking"). */
  label: string;
  /** Conteúdo do item ativo. Com ele, cada aba aponta para um painel real (aria-controls). */
  children?: React.ReactNode;
  className?: string;
}
function TabsImpl({ items, value, onChange, label, children, className, variant }: TabsProps & { variant: 'underline' | 'segmented' }) {
  return (
    <TabsRoot value={value} onValueChange={onChange} activationMode="manual" className={className}>
      <TabsList variant={variant} aria-label={label}>
        {items.map((it) => (
          // Sem painel (children), a aba não aponta para um conteúdo inexistente.
          <TabsTrigger key={it.id} value={it.id} disabled={it.disabled} {...(children == null ? { 'aria-controls': undefined } : {})}>{it.label}</TabsTrigger>
        ))}
      </TabsList>
      {children != null && <TabsContent value={value}>{children}</TabsContent>}
    </TabsRoot>
  );
}
/** Abas com sublinhado (Radix Tabs), para filtrar o mesmo conteúdo. */
export function Tabs(props: TabsProps) { return <TabsImpl {...props} variant="underline" />; }
/** Controle em pílula (Radix Tabs, variante segmented), para alternar seções. */
export function SegmentedControl(props: TabsProps) { return <TabsImpl {...props} variant="segmented" />; }

/* ---------------------------------------------------------- SectionHeader */

export interface SectionHeaderProps {
  title: string;
  /** Link curto à direita ("Ver mais", "Ver informações"). */
  action?: { label: string; onClick?: () => void };
}
export function SectionHeader({ title, action }: SectionHeaderProps) {
  return (
    <div className="flex min-h-touch items-center justify-between gap-nano text-foreground">
      <h2 className="subtitle m-0">{title}</h2>
      {action && <Button hierarchy="transparent" onClick={action.onClick}>{action.label}</Button>}
    </div>
  );
}

/* ---------------------------------------------------------------- ListRow */

export const listRowVariants = cva(
  [pressable, 'grid w-full min-h-touch items-center gap-micro text-foreground'],
  {
    variants: {
      /** help = linha creme com legenda e seta (Ajuda) · menu = linha do Menu com ícone e divisor. */
      variant: {
        help: 'rounded-md bg-surface-accent px-mini py-micro hover:bg-surface-accent-hover active:bg-surface-accent-hover',
        menu: 'border-b border-border bg-surface-primary py-micro hover:bg-interactive-fill-quiet-hover active:bg-interactive-fill-quiet-active',
      },
      lead: { true: 'grid-cols-[auto_1fr_auto]', false: 'grid-cols-[1fr_auto]' },
    },
    defaultVariants: { variant: 'help', lead: false },
  },
);
export interface ListRowProps extends Omit<VariantProps<typeof listRowVariants>, 'lead'> {
  title: string;
  description?: string;
  icon?: IconName;
  href?: string;
  onClick?: () => void;
}
export function ListRow({ variant = 'help', title, description, icon, href, onClick }: ListRowProps) {
  return (
    <PressableBase href={href} onClick={onClick} className={listRowVariants({ variant, lead: !!icon })}>
      {icon && <Icon name={icon} tone={variant === 'menu' ? 'primary' : 'brand'} />}
      <span className="grid min-w-0 gap-xnano">
        <span className="label">{title}</span>
        {description && <span className="caption text-muted-foreground">{description}</span>}
      </span>
      {variant === 'help' ? <Icon name="chevron-right" tone="brand-strong" size="small" /> : <span />}
    </PressableBase>
  );
}

/* --------------------------------------------------------------- StepDots */

export interface StepDotsProps {
  /** Passo atual, começando em 1. */
  current: number;
  total: number;
  className?: string;
}
/** Pontos de progresso do cadastro ("Passo 1 de 7"). O texto vai para o leitor de tela; os pontos são decorativos. */
export function StepDots({ current, total, className }: StepDotsProps) {
  return (
    <div className={cn('flex items-center justify-center gap-nano', className)}>
      <span className="sr-only">Passo {current} de {total}</span>
      {Array.from({ length: total }, (_, i) => (
        <span key={i} aria-hidden className={cn('size-nano rounded-full', i + 1 === current ? 'bg-selected-indicator' : i + 1 < current ? 'bg-interactive-fill-loud' : 'bg-indicator-inactive')} />
      ))}
    </div>
  );
}
