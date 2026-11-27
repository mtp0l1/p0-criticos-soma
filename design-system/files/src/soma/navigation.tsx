/* So+ma · navegação: Header, LocationBar, TabBar, Tabs, SegmentedControl, SectionHeader, ListRow. */
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn, focusRing, hitArea, hitAreaY } from '../lib/utils';
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
  /** Uma ação à direita: a ajuda (`?`) só no Início e no cadastro. Nunca um "Fechar" junto do voltar. */
  action?: { icon: IconName; label: string; onClick?: () => void };
  /**
   * center = título centralizado, seta solta (padrão; Doar, Cadastro, telas anteriores).
   * round = voltar em círculo creme, título centralizado em text-secondary (Quiz).
   * start = obsoleto: vira o mesmo arranjo do center. A tela raiz de aba (Ranking) usa center sem onBack.
   * eyebrow = seta solta e título pequeno em maiúsculas, apagado (QR do dia da entrega: "VILA VERDE").
   */
  variant?: 'center' | 'round' | 'start' | 'eyebrow';
  /** Divisor embaixo, como nas telas novas. Padrão true. */
  divider?: boolean;
  className?: string;
}
const roundBtn = 'size-back rounded-full bg-surface-primary text-icon-primary shadow-card hover:bg-surface-accent active:bg-surface-accent';
export function Header({ title, onBack, action, variant: variantProp = 'center', divider = true, className }: HeaderProps) {
  let variant = variantProp;
  const round = true;
  const back = onBack ? <IconButton icon="chevron-left" label="Voltar" onClick={onBack} className={round ? roundBtn : 'text-foreground'} /> : null;
  const act = action ? <IconButton icon={action.icon} label={action.label} onClick={action.onClick} className={round ? roundBtn : undefined} /> : null;
  const shell = cn('bg-transparent px-xsmall py-nano text-foreground', className);
  if (variant === 'start') variant = 'center'; // obsoleto: um só cabeçalho (título centralizado, mesma altura e mesmos slots)
  return (
    <header className={cn(shell, 'grid min-h-header grid-cols-[theme(spacing.touch)_1fr_theme(spacing.touch)] items-center')}>
      {back ?? <span />}
      <h1 className={cn('m-0 text-center', variant === 'center' ? 'line-clamp-3' : 'truncate', variant === 'round' ? 'subtitle text-foreground' : variant === 'eyebrow' ? 'eyebrow uppercase tracking-wide text-muted-foreground' : 'header-title')}>{title}</h1>
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
        hitAreaY,
        'flex w-full items-center justify-center gap-[6px] bg-surface-primary py-0 text-center text-foreground',
        sticky && 'sticky top-0 z-10 border-b border-border',
      )}
    >
      <Icon name="pin" size="small" tone="brand" />
      <span className={cn('caption truncate', empty && 'font-semibold text-text-link')}>{empty ? 'Adicione seu local de entrega' : `Entregando em ${location}`}</span>
      <Icon name="chevron-down" size="small" tone="brand-strong" />
    </button>
  );
}

/* ---------------------------------------------------------------- TabBar */

export type TabId = 'inicio' | 'reciclar' | 'recompensas' | 'ranking' | 'menu';
/** Barra de cinco itens do redesign. "Meus resgates" virou aba dentro de Recompensas. */
export const TAB_ITEMS: Array<{ id: TabId; label: string; icon: IconName }> = [
  { id: 'inicio', label: 'Início', icon: 'home' },
  { id: 'reciclar', label: 'Reciclar', icon: 'refresh' },
  { id: 'recompensas', label: 'Recompensas', icon: 'gift' },
  { id: 'ranking', label: 'Ranking', icon: 'trophy' },
  { id: 'menu', label: 'Menu', icon: 'menu' },
];
export interface TabBarProps {
  active: TabId;
  onNavigate?: (id: TabId) => void;
}
/** Navegação inferior fixa. É navegação (nav + aria-current), não abas: por isso não usa Tabs. */
export function TabBar({ active, onNavigate }: TabBarProps) {
  return (
    <nav aria-label="Navegação principal" className="mx-mini mb-small flex min-h-tabbar w-[calc(100%-32px)] [contain:inline-size] items-center justify-between rounded-3xl bg-surface-primary/[.86] px-nano shadow-float backdrop-blur-[24px] motion-reduce:backdrop-blur-none motion-reduce:bg-surface-primary">
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
              'flex size-tab-item items-center justify-center rounded-full text-icon-secondary hover:text-foreground',
              'aria-[current=page]:w-auto aria-[current=page]:gap-[6px] aria-[current=page]:bg-primary aria-[current=page]:px-micro aria-[current=page]:text-text-on-loud',
            )}
          >
            <Icon name={t.icon} />
            <span className={on ? 'caption font-bold' : 'sr-only'}>{t.label}</span>
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
function TabsImpl({ items, value, onChange, label, children, className, variant }: TabsProps & { variant: 'underline' | 'segmented' | 'pill' }) {
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
/** Abas com sublinhado, para filtrar o mesmo conteúdo. */
export function Tabs(props: TabsProps) { return <TabsImpl {...props} variant="underline" />; }
/** Controle em pílula, para alternar seções. */
export function SegmentedControl(props: TabsProps) { return <TabsImpl {...props} variant="segmented" />; }
/** Abas em pílulas soltas: a ativa cheia, as outras contornadas (Recompensas: Catálogo | Meus resgates). */
export function PillTabs(props: TabsProps) { return <TabsImpl {...props} variant="pill" />; }

/* ---------------------------------------------------------- SectionHeader */

export interface SectionHeaderProps {
  title: string;
  /** Link curto à direita ("Ver mais", "Ver todas (12)"). */
  action?: { label: string; onClick?: () => void };
  /** Ícone de 16px antes do título (blocos de categoria no catálogo). */
  icon?: IconName;
  /** default = título de bloco · small = título de categoria (14px bold) com link pequeno em cor de link · eyebrow = rótulo em maiúsculas de 12px, sem link ("PRÓXIMAS ENTREGAS", "ESCOLHA O ESPAÇO"). */
  size?: 'default' | 'small' | 'eyebrow';
}
export function SectionHeader({ title, action, icon, size = 'default' }: SectionHeaderProps) {
  if (size === 'eyebrow') {
    return <h2 className="eyebrow m-0 flex min-h-icon items-center gap-nano uppercase tracking-wide text-foreground">{title}</h2>;
  }
  if (size === 'small') {
    return (
      <div className={cn('flex items-center justify-between gap-nano text-foreground', action ? 'min-h-touch' : 'min-h-icon')}>
        <h2 className="label m-0 flex items-center gap-nano">{icon && <Icon name={icon} size="small" />}{title}</h2>
        {action && <button type="button" onClick={action.onClick} className={cn(pressable, hitAreaY, 'caption shrink-0 whitespace-nowrap rounded-xs font-semibold text-text-link')}>{action.label}</button>}
      </div>
    );
  }
  return (
    <div className={cn('flex items-center justify-between gap-nano text-foreground', action && 'min-h-touch')}>
      <h2 className="subtitle m-0 flex items-center gap-nano">{icon && <Icon name={icon} />}{title}</h2>
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
        help: 'min-h-row rounded-lg bg-surface-primary px-micro py-nano shadow-card hover:bg-surface-accent active:bg-surface-accent',
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
