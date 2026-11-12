/* So+ma · Início: Tile, TileGrid, BalanceCard, QuestionTeaser, GoalSummaryCard, ActivityRow. */
import * as React from 'react';
import { cn, fmt } from '../lib/utils';
import { Icon, type IconName } from '../ui/icon';
import { Button } from '../ui/button';
import { pressable, PressableBase } from './navigation';

export interface TileProps { icon: IconName; label: string; href?: string; onClick?: () => void }
export function Tile({ icon, label, href, onClick }: TileProps) {
  return (
    <PressableBase
      href={href}
      onClick={onClick}
      className={cn(
        pressable,
        'flex min-h-tile flex-col items-start justify-between gap-nano rounded-lg bg-surface-secondary p-mini text-foreground',
        'hover:bg-surface-secondary-hover active:bg-surface-secondary-hover',
      )}
    >
      <Icon name={icon} tone="brand" />
      <span className="label">{label}</span>
    </PressableBase>
  );
}
export function TileGrid({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <div className={cn('grid grid-cols-2 gap-mini', className)}>{children}</div>;
}

export interface BalanceCardProps {
  points: number;
  /** Legenda de apoio. Com saldo zero e sem hint, o card chama para a primeira entrega. */
  hint?: string;
  href?: string;
  onPress?: () => void;
  /** light = card creme tocável com seta (Início) · dark = faixa escura com botão (Início com meta, Tela 17). */
  tone?: 'light' | 'dark';
  /** Só no tone dark: o botão à direita ("Ver meta"). */
  action?: { label: string; onClick?: () => void; href?: string };
}
export function BalanceCard({ points, hint, href, onPress, tone = 'light', action }: BalanceCardProps) {
  const text = hint ?? (points === 0 ? 'Faça sua primeira entrega e comece a pontuar' : undefined);
  if (tone === 'dark') {
    return (
      <section aria-label="Saldo atual" className="grid grid-cols-[1fr_auto] items-center gap-nano rounded-lg bg-surface-inverse p-mini text-text-inverse">
        <span className="grid gap-xnano">
          <span className="eyebrow uppercase text-icon-brand">Seu saldo atual</span>
          <span className="text-[28px] font-bold leading-8">{fmt(points)} {points === 1 ? 'ponto' : 'pontos'}</span>
          {text && <span className="caption">{text}</span>}
        </span>
        {action && <Button size="compact" asChild={!!action.href} onClick={action.onClick}>{action.href ? <a href={action.href}>{action.label}</a> : action.label}</Button>}
      </section>
    );
  }
  return (
    <PressableBase
      href={href}
      onClick={onPress}
      className={cn(pressable, 'grid w-full grid-cols-[1fr_auto] items-center gap-nano rounded-lg bg-surface-accent p-mini text-foreground hover:bg-surface-accent-hover active:bg-surface-accent-hover')}
    >
      <span className="grid gap-xnano">
        <span className="caption text-muted-foreground">Saldo atual</span>
        <span className="flex items-baseline gap-nano"><span className="balance-number">{fmt(points)}</span><span className="body">pontos</span></span>
        {text && <span className="caption text-muted-foreground">{text}</span>}
      </span>
      <Icon name="chevron-right" tone="brand-strong" />
    </PressableBase>
  );
}

export interface QuestionTeaserProps {
  /** A pergunta do dia, curta ("Isopor é reciclável?"). */
  question: string;
  /** Padrão: "Responda para somar pontos e trocar por recompensas.". */
  hint?: string;
  href?: string;
  onPress?: () => void;
}
/** Card "Pergunta do dia" do Início. Leva ao Quiz; no lugar de "Responda ao Quiz" e "Ganhe suas medalhas". */
export function QuestionTeaser({ question, hint = 'Responda para somar pontos e trocar por recompensas.', href, onPress }: QuestionTeaserProps) {
  return (
    <PressableBase
      href={href}
      onClick={onPress}
      className={cn(pressable, 'grid w-full grid-cols-[auto_1fr] items-center gap-micro rounded-lg border-[1.5px] border-border-highlight bg-surface-primary p-mini text-foreground hover:bg-interactive-fill-quiet-hover active:bg-interactive-fill-quiet-active')}
    >
      <Icon name="help" tone="brand-strong" />
      <span className="grid gap-xnano">
        <span className="body-strong">{question}</span>
        <span className="caption text-muted-foreground">{hint}</span>
      </span>
    </PressableBase>
  );
}

export interface GoalSummaryCardProps {
  /** Nome do prêmio escolhido como meta. */
  title: string;
  /** Pontos que o prêmio custa. */
  goal: number;
  /** Pontos que faltam. */
  remaining: number;
  icon?: IconName;
  href?: string;
  onPress?: () => void;
}
/** Meta ativa no topo do Início (Tela 17): prêmio, custo e quanto falta. Para o card laranja do catálogo use GoalCard. */
export function GoalSummaryCard({ title, goal, remaining, icon = 'gift', href, onPress }: GoalSummaryCardProps) {
  return (
    <PressableBase
      href={href}
      onClick={onPress}
      className={cn(pressable, 'grid w-full gap-nano rounded-lg border-[1.5px] border-border-highlight bg-surface-primary p-mini text-foreground hover:bg-interactive-fill-quiet-hover active:bg-interactive-fill-quiet-active')}
    >
      <span className="grid grid-cols-[auto_1fr] items-center gap-micro">
        <span aria-hidden className="grid size-[44px] place-items-center rounded-md bg-surface-accent text-icon-brand-strong"><Icon name={icon} /></span>
        <span className="grid gap-xnano"><span className="body-strong">{title}</span><span className="caption text-muted-foreground">Meta: {fmt(goal)} pontos</span></span>
      </span>
      <span className="flex items-center gap-xnano rounded-md bg-surface-accent px-micro py-xnano caption text-foreground"><Icon name="target" size="small" tone="brand-strong" />Faltam {fmt(remaining)} pontos para a meta</span>
    </PressableBase>
  );
}

export interface ActivityRowProps {
  title: string;
  /** "3,2 kg de PET · +64 pontos". */
  detail: string;
  icon?: IconName;
  /** Ação à direita ("Ver recibo"). */
  action?: { label: string; onClick?: () => void; href?: string };
}
/** Linha de "Atividade recente" do Início (Tela 17). */
export function ActivityRow({ title, detail, icon = 'recycle', action }: ActivityRowProps) {
  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-micro rounded-lg border border-border bg-card p-mini text-card-foreground">
      <span aria-hidden className="grid size-[40px] place-items-center rounded-full bg-feedback-fill-positive text-feedback-text-positive"><Icon name={icon} /></span>
      <span className="grid gap-xnano"><span className="body-strong">{title}</span><span className="caption text-muted-foreground">{detail}</span></span>
      {action && <Button hierarchy="transparent" size="compact" asChild={!!action.href} onClick={action.onClick}>{action.href ? <a href={action.href}>{action.label}</a> : action.label}</Button>}
    </div>
  );
}
