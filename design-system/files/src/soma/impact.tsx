/* So+ma · impacto e ranking: StatTile, StatGrid, RankingBanner, PositionCard, Podium, RankingRow, StatsRow. */
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn, fmt } from '../lib/utils';
import { Icon, type IconName } from '../ui/icon';
import { Card, Avatar, AvatarImage, AvatarFallback } from '../ui/display';
import { pressable, PressableBase } from './navigation';

export const statTileVariants = cva('flex rounded-lg bg-card text-card-foreground', {
  variants: {
    /** stack = card do painel em grade · row = resumo em linha (Total de entregas). */
    layout: {
      stack: 'flex-col items-center gap-xnano px-micro py-mini text-center',
      row: 'flex-row items-center gap-micro p-mini text-left',
    },
  },
  defaultVariants: { layout: 'stack' },
});
export interface StatTileProps extends VariantProps<typeof statTileVariants> {
  icon: IconName;
  /** Frase de entrada ("Você reciclou um total de"). */
  lead: string;
  value: string;
  /** Equivalência concreta ("Isso equivale a 141 celulares"). */
  equivalence?: string;
}
export function StatTile({ icon, lead, value, equivalence, layout }: StatTileProps) {
  return (
    <div className={statTileVariants({ layout })}>
      <Icon name={icon} tone="brand" size={layout === 'row' ? 'medium' : 'large'} className={layout === 'row' ? '' : 'mb-xnano'} />
      <div className="grid gap-xnano">
        <p className="caption m-0">{lead}</p>
        <p className="stat-number m-0">{value}</p>
        {equivalence && <p className="caption m-0 text-muted-foreground">{equivalence}</p>}
      </div>
    </div>
  );
}
export function StatGrid({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <div className={cn('grid grid-cols-2 gap-micro', className)}>{children}</div>;
}

export interface RankingBannerProps { position: number; title: string; message: string; href?: string; onPress?: () => void }
export function RankingBanner({ position, title, message, href, onPress }: RankingBannerProps) {
  return (
    <PressableBase
      href={href}
      onClick={onPress}
      className={cn(pressable, 'grid w-full grid-cols-[auto_1fr] items-center gap-micro rounded-lg bg-surface-brand p-mini text-text-on-loud hover:bg-interactive-fill-loud-hover active:bg-interactive-fill-loud-active')}
    >
      <span aria-label={`Posição ${position}`} className="stat-number grid h-[56px] min-w-[56px] place-items-center rounded-full border-2 border-text-on-loud px-xnano">{position}</span>
      <span className="grid gap-xnano"><span className="label">{title}</span><span className="caption">{message}</span></span>
    </PressableBase>
  );
}

export interface PositionCardProps {
  /** null = ainda sem entrega no período. */
  position: number | null;
  percent?: number;
}
export function PositionCard({ position, percent }: PositionCardProps) {
  return (
    <Card variant="flat" aria-label="Sua posição" role="group" className="justify-items-center text-center">
      <p className="eyebrow m-0 text-muted-foreground">Sua posição</p>
      {position == null ? (
        <>
          <p className="page-title m-0">Sem posição ainda</p>
          <p className="caption m-0 max-w-[280px] text-muted-foreground">Faça sua primeira entrega para entrar no ranking do seu espaço de recebimento.</p>
        </>
      ) : (
        <>
          <p className="page-title m-0">{position}º lugar</p>
          {percent != null && (
            <p className="caption m-0 max-w-[280px] text-muted-foreground">
              Você reciclou mais que {fmt(percent)}% dos participantes que entregam no mesmo espaço de recebimento.
            </p>
          )}
        </>
      )}
    </Card>
  );
}

export interface PodiumEntry { position: 1 | 2 | 3; name: string; kg: number; self?: boolean; photo?: string }
export interface PodiumProps {
  entries: PodiumEntry[];
  /** atual = avatares sobre degraus ouro, prata e bronze (Figma novo) · anterior = três cards (app em produção). Padrão "atual". */
  version?: 'atual' | 'anterior';
}
const initials = (n: string) => n.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]!.toUpperCase()).join('');
const STEP: Record<1 | 2 | 3, { fill: string; h: string; avatar: string }> = {
  1: { fill: 'bg-award-gold text-foreground', h: 'h-[46px]', avatar: 'size-[64px]' },
  2: { fill: 'bg-award-silver text-foreground', h: 'h-[34px]', avatar: 'size-[54px]' },
  3: { fill: 'bg-award-bronze text-text-inverse', h: 'h-[26px]', avatar: 'size-[54px]' },
};
export function Podium({ entries, version = 'atual' }: PodiumProps) {
  const sorted = [...entries].sort((a, b) => a.position - b.position);
  if (version === 'anterior') {
    return (
      <ol aria-label="Os três primeiros" className="m-0 grid list-none grid-cols-3 gap-nano p-0">
        {sorted.map((e) => (
          <li key={e.position} className={cn('grid justify-items-center gap-xnano rounded-lg bg-card px-nano py-mini text-center text-card-foreground', e.self && 'ring-2 ring-inset ring-selected-indicator')}>
            <span aria-hidden className="relative grid size-medal place-items-center text-feedback-text-positive">
              <Icon name="recycle" className="absolute inset-0 size-full" />
              <b className="text-[13px] font-semibold leading-none">{e.position}</b>
            </span>
            <p className="label m-0"><span className="sr-only">{e.position}º lugar: </span>{e.name}{e.self && <span className="sr-only"> (você)</span>}</p>
            <p className="caption m-0 text-muted-foreground">{fmt(e.kg)} kg</p>
          </li>
        ))}
      </ol>
    );
  }
  // Ordem visual 2 · 1 · 3; a lista continua em ordem de posição para o leitor de tela.
  return (
    <ol aria-label="Os três primeiros" className="m-0 grid list-none grid-cols-3 items-end gap-nano p-0">
      {sorted.map((e) => (
        <li key={e.position} className={cn('grid justify-items-center gap-xnano text-center text-foreground', e.position === 1 && 'order-2', e.position === 2 && 'order-1', e.position === 3 && 'order-3')}>
          <Avatar className={cn(STEP[e.position].avatar, e.self ? 'ring-[3px] ring-border-highlight ring-offset-2 ring-offset-background' : '')}>
            {e.photo && <AvatarImage src={e.photo} alt="" />}
            <AvatarFallback className={cn('body-strong', STEP[e.position].fill)}>{initials(e.name)}</AvatarFallback>
          </Avatar>
          <p className={cn('label m-0 max-w-full truncate', e.self && 'text-text-link')}><span className="sr-only">{e.position}º lugar: </span>{e.name}{e.self && <span className="sr-only"> (você)</span>}</p>
          <p className="caption m-0 text-muted-foreground">{fmt(e.kg)} kg</p>
          <span aria-hidden className={cn('grid w-full place-items-start justify-center rounded-t-[10px] pt-xnano text-[14px] font-bold leading-5', STEP[e.position].fill, STEP[e.position].h)}>{e.position}</span>
        </li>
      ))}
    </ol>
  );
}

/* ------------------------------------------------------------- RankingRow */

export interface RankingRowProps {
  position: number;
  name: string;
  /** Valor já formatado ou número em kg. */
  kg: number;
  photo?: string;
  /** Linha da própria pessoa: fundo creme, borda de destaque e texto do que falta. */
  self?: boolean;
  /** Linha de apoio ("Faltam 6,5 kg para ultrapassar Ana"). */
  hint?: string;
}
/** Linha da lista do ranking, depois do pódio. Não é tocável. */
export function RankingRow({ position, name, kg, photo, self, hint }: RankingRowProps) {
  return (
    <li className={cn('grid list-none grid-cols-[28px_auto_1fr_auto] items-center gap-micro rounded-md border px-micro py-micro', self ? 'border-border-highlight bg-surface-accent' : 'border-border bg-card')}>
      <span className={cn('text-center text-[14px] font-bold leading-5', self ? 'text-text-link' : 'text-muted-foreground')}>{position}<span className="sr-only">º lugar</span></span>
      <Avatar className="size-[36px]">
        {photo && <AvatarImage src={photo} alt="" />}
        <AvatarFallback className="caption bg-surface-secondary font-semibold text-foreground">{initials(name)}</AvatarFallback>
      </Avatar>
      <span className="grid min-w-0">
        <span className={cn('label truncate', self && 'text-text-link')}>{name}{self && <span className="sr-only"> (você)</span>}</span>
        {hint && <span className="caption text-muted-foreground">{hint}</span>}
      </span>
      <span className="label whitespace-nowrap">{fmt(kg)} kg</span>
    </li>
  );
}
/** Lista para RankingRow (ol com espaçamento). */
export function RankingList({ children, label = 'Classificação' }: { children: React.ReactNode; label?: string }) {
  return <ol aria-label={label} className="m-0 grid gap-nano p-0">{children}</ol>;
}

/* --------------------------------------------------------------- StatsRow */

export interface StatsRowProps {
  items: Array<{ value: string; label: string; icon?: IconName }>;
  className?: string;
}
/** Números lado a lado (entregas, kg, pontos) em um card creme ou neutro. */
export function StatsRow({ items, className }: StatsRowProps) {
  return (
    <dl className={cn('m-0 grid auto-cols-fr grid-flow-col divide-x divide-border rounded-lg bg-surface-secondary py-micro text-foreground', className)}>
      {items.map((it) => (
        <div key={it.label} className="grid justify-items-center gap-xnano px-nano text-center">
          <dt className="caption order-last text-muted-foreground">{it.label}</dt>
          <dd className="stat-number m-0 grid justify-items-center gap-xnano">{it.icon && <Icon name={it.icon} size="small" tone="brand-strong" />}{it.value}</dd>
        </div>
      ))}
    </dl>
  );
}
