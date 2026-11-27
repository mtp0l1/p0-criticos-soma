/* So+ma · Início: HomeGreeting, Tile, TileGrid, BalanceCard, QuestionTeaser, GoalSummaryCard, ActivityRow. */
import * as React from 'react';
import { cn, fmt, hitArea } from '../lib/utils';
import { Icon, type IconName } from '../ui/icon';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/display';
import { Button, IconButton } from '../ui/button';
import { pressable, PressableBase } from './navigation';

export interface HomeGreetingProps {
  /** Primeiro nome. Mostra "Olá {nome}" e a inicial no avatar. */
  name: string;
  /** Espaço de recebimento ("Casa so+ma Batel"), em linha de apoio sob o nome, com o ícone de local. */
  location?: string;
  /** Foto da pessoa. Sem ela, o avatar mostra a inicial. */
  photo?: string;
  /** Abre o cartão QR da pessoa (disco branco à direita). Sem ele, o botão não aparece. */
  onQr?: () => void;
  /** Abre a ajuda (disco branco à direita). Sem ele, o botão não aparece. */
  onHelp?: () => void;
}
const disc = 'size-touch shrink-0 rounded-full bg-surface-primary text-icon-brand shadow-card hover:bg-surface-secondary active:bg-surface-secondary-hover';
/** Saudação do Início (v2): avatar laranja com a inicial, "Olá Mônica" em screen-title, o espaço de recebimento embaixo e os botões de QR e ajuda em discos brancos. */
export function HomeGreeting({ name, location, photo, onQr, onHelp }: HomeGreetingProps) {
  return (
    <div className="flex items-center gap-micro text-foreground">
      <Avatar className="size-[48px]">
        {photo && <AvatarImage src={photo} alt="" />}
        <AvatarFallback className="body-strong bg-interactive-fill-loud text-foreground">{name.trim().charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="grid min-w-0 flex-1 gap-0">
        <h1 className="screen-title m-0 truncate">Olá {name}</h1>
        {location && <p className="caption m-0 flex items-center gap-xnano text-muted-foreground"><Icon name="pin" size="small" tone="brand" /><span className="truncate">{location}</span></p>}
      </div>
      {onQr && <IconButton icon="qr-code" label="Meu cartão QR" onClick={onQr} className={disc} />}
      {onHelp && <IconButton icon="help" label="Ajuda" onClick={onHelp} className={disc} />}
    </div>
  );
}

/** light = cartão branco (padrão) · primary = laranja da marca (a ação que gera pontos) · dark = azul-marinho · peach = pêssego. */
export type TileTone = 'light' | 'primary' | 'dark' | 'peach';
export interface TileProps { icon: IconName; label: string; tone?: TileTone; href?: string; onClick?: () => void }
const TILE: Record<TileTone, { box: string; disc: string }> = {
  light: { box: 'bg-surface-primary text-foreground shadow-card hover:bg-surface-secondary active:bg-surface-secondary-hover', disc: 'bg-surface-tint-peach text-icon-brand' },
  primary: { box: 'bg-primary text-primary-foreground shadow-card hover:bg-interactive-fill-loud-hover active:bg-interactive-fill-loud-active', disc: 'bg-surface-tint-peach text-icon-brand' },
  dark: { box: 'bg-surface-inverse text-text-inverse shadow-dark', disc: 'bg-surface-primary/[.12] text-text-inverse' },
  peach: { box: 'bg-surface-tint-peach text-foreground hover:bg-interactive-fill-quiet-hover active:bg-interactive-fill-quiet-active', disc: 'bg-surface-primary text-icon-brand' },
};
/** Atalho do Início (v2): disco com o ícone em cima, rótulo de até duas linhas embaixo, em cartão de 128px. */
export function Tile({ icon, label, tone = 'light', href, onClick }: TileProps) {
  return (
    <PressableBase
      href={href}
      onClick={onClick}
      className={cn(pressable, 'flex min-h-[128px] flex-col items-start justify-between gap-nano rounded-2xl p-mini text-left', TILE[tone].box)}
    >
      <span aria-hidden className={cn('grid size-[44px] place-items-center rounded-full', TILE[tone].disc)}><Icon name={icon} /></span>
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
  /** hero = cartão azul-marinho com o saldo em laranja (Início da v2, padrão) · light = cartão creme tocável com seta · dark = faixa escura com botão (Início com meta, Tela 17). */
  tone?: 'hero' | 'light' | 'dark' | 'card';
  /** Só no tone dark: o botão à direita ("Ver meta"). */
  action?: { label: string; onClick?: () => void; href?: string };
}
export function BalanceCard({ points, hint, href, onPress, tone = 'hero', action }: BalanceCardProps) {
  const text = hint ?? (points === 0 ? 'Faça sua primeira entrega e comece a pontuar' : undefined);
  if (tone === 'hero') {
    return (
      <PressableBase
        href={href}
        onClick={onPress}
        className={cn(pressable, 'relative grid min-h-[150px] w-full content-between gap-nano overflow-hidden rounded-3xl bg-surface-inverse p-small text-left text-text-inverse shadow-dark')}
      >
        <span aria-hidden className="pointer-events-none absolute -right-[30px] -top-[60px] size-[240px] rounded-full bg-surface-primary/[.07]" />
        <span aria-hidden className="pointer-events-none absolute -bottom-[60px] -right-[10px] size-[140px] rounded-full bg-surface-primary/[.07]" />
        <span className="relative flex items-center justify-between gap-nano">
          <span className="body-small">Saldo atual</span>
          <span aria-hidden className="grid size-[32px] place-items-center rounded-full bg-surface-primary text-foreground"><Icon name="chevron-right" size="small" /></span>
        </span>
        <span className="relative grid gap-0">
          <span className="flex items-baseline gap-nano"><span className="text-[48px] font-bold leading-[56px] text-primary">{fmt(points)}</span><span className="subtitle">{points === 1 ? 'ponto' : 'pontos'}</span></span>
          {text && <span className="caption">{text}</span>}
        </span>
      </PressableBase>
    );
  }
  if (tone === 'card') {
    return (
      <section aria-label="Saldo atual" className="grid gap-xnano rounded-lg bg-card p-mini text-card-foreground shadow-card">
        <span className="flex items-center justify-between gap-nano">
          <span className="eyebrow uppercase tracking-wide text-muted-foreground">Seu saldo atual</span>
          {action && (action.href
            ? <a href={action.href} onClick={action.onClick} className="caption inline-flex min-h-touch items-center font-bold text-text-link no-underline">{action.label}<Icon name="chevron-right" size="small" /></a>
            : <button type="button" onClick={action.onClick} className="caption inline-flex min-h-touch cursor-pointer items-center border-0 bg-transparent font-bold text-text-link">{action.label}<Icon name="chevron-right" size="small" /></button>)}
        </span>
        <span className="flex items-baseline gap-nano"><b className="text-[48px] leading-[56px]">{fmt(points)}</b><span className="body-small text-muted-foreground">{points === 1 ? 'ponto' : 'pontos'}</span></span>
        {text && <span className="caption text-muted-foreground">{text}</span>}
      </section>
    );
  }
  if (tone === 'dark') {
    return (
      <section aria-label="Saldo atual" className="grid grid-cols-[1fr_auto] items-center gap-nano rounded-lg bg-surface-inverse p-mini text-text-inverse">
        <span className="grid gap-xnano">
          <span className="eyebrow uppercase text-icon-brand">Seu saldo atual</span>
          <span className="page-title">{fmt(points)} {points === 1 ? 'ponto' : 'pontos'}</span>
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
      className={cn(pressable, 'grid min-h-[104px] w-full grid-cols-[1fr_auto] items-center gap-nano rounded-lg bg-surface-accent p-mini text-foreground hover:bg-surface-accent-hover active:bg-surface-accent-hover')}
    >
      <span className="grid gap-0 self-start">
        <span className="caption">Saldo atual</span>
        <span className="flex items-baseline gap-nano"><span className="balance-number font-normal">{fmt(points)}</span><span className="subtitle">{points === 1 ? 'ponto' : 'pontos'}</span></span>
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
/** Card "Pergunta do dia" do Início, sob um `SectionHeader` "Pergunta do dia". Leva ao Quiz; no lugar do banner antigo de quiz. */
export function QuestionTeaser({ question, hint = 'Responda para somar pontos e trocar por recompensas.', href, onPress }: QuestionTeaserProps) {
  return (
    <PressableBase
      href={href}
      onClick={onPress}
      className={cn(pressable, 'grid w-full gap-nano rounded-2xl bg-surface-tint-peach p-small text-left text-foreground hover:bg-interactive-fill-quiet-hover active:bg-interactive-fill-quiet-active')}
    >
      <span className="eyebrow inline-flex w-fit items-center gap-xnano rounded-full bg-surface-primary px-micro py-xnano uppercase text-text-link"><Icon name="sparkles" size="small" />Pergunta do dia</span>
      <span className="grid grid-cols-[1fr_auto] items-end gap-nano">
        <span className="grid gap-xnano">
          <span className="screen-title">{question}</span>
          <span className="body-small text-muted-foreground">{hint}</span>
        </span>
        <span aria-hidden className="grid size-[48px] place-items-center rounded-full bg-surface-inverse text-text-inverse"><Icon name="chevron-right" /></span>
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
export function GoalSummaryCard({ title, goal, remaining, href, onPress }: GoalSummaryCardProps) {
  const pct = goal > 0 ? Math.max(0, Math.min(100, ((goal - remaining) / goal) * 100)) : 0;
  return (
    <PressableBase
      href={href}
      onClick={onPress}
      className={cn(pressable, 'relative grid w-full gap-nano overflow-hidden rounded-lg bg-surface-inverse p-mini text-left text-text-inverse shadow-dark')}
    >
      <span aria-hidden className="pointer-events-none absolute -right-[40px] -top-[60px] size-[180px] rounded-full bg-surface-primary/[.07]" />
      <span className="flex items-center gap-nano">
        <span aria-hidden className="grid size-[28px] place-items-center rounded-full bg-primary text-primary-foreground"><Icon name="flag" size="small" /></span>
        <span className="eyebrow uppercase tracking-wide">Sua meta</span>
      </span>
      <span className="subtitle font-bold">{title}</span>
      <span className="caption">Meta: {fmt(goal)} pontos</span>
      <span aria-hidden className="block h-nano overflow-hidden rounded-full bg-surface-primary/[.2]"><span className="block h-full rounded-full bg-primary" style={{ width: `${pct}%` }} /></span>
      <span className="caption font-bold text-icon-brand">Faltam {fmt(remaining)} pontos para a meta</span>
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
export function ActivityRow({ title, detail, icon = 'check', action }: ActivityRowProps) {
  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-micro rounded-lg bg-card p-micro text-card-foreground shadow-card">
      <span aria-hidden className="grid size-[40px] place-items-center rounded-full bg-feedback-fill-positive text-feedback-text-positive"><Icon name={icon} size="small" /></span>
      <span className="grid gap-xnano"><span className="label">{title}</span><span className="caption font-semibold">{detail}</span></span>
      {action && (action.href
        ? <a href={action.href} onClick={action.onClick} className={cn(pressable, hitArea, 'caption rounded-xs font-bold text-text-link')}>{action.label}</a>
        : <button type="button" onClick={action.onClick} className={cn(pressable, hitArea, 'caption rounded-xs font-bold text-text-link')}>{action.label}</button>)}
    </div>
  );
}
