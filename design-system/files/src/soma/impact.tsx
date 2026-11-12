/* So+ma · impacto e ranking: StatTile, StatGrid, PositionCard, Podium, RankingRow, StatsRow. */
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn, fmt } from '../lib/utils';
import { Icon, type IconName } from '../ui/icon';
import { Card, Avatar, AvatarImage, AvatarFallback } from '../ui/display';
import { Button } from '../ui/button';

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

export interface PositionCardProps {
  /** Percentual de participantes do mesmo espaço de recebimento que a pessoa superou. null = ainda sem entrega no período. */
  percent: number | null;
  className?: string;
}
/** Aba Geral do ranking: uma frase de comparação com quem entrega no mesmo espaço (Figma: ícone de tendência em círculo laranja). */
export function PositionCard({ percent, className }: PositionCardProps) {
  return (
    <div role="group" aria-label="Sua posição" className={cn('grid grid-cols-[auto_1fr] items-center gap-micro rounded-lg border border-border bg-card p-mini text-card-foreground', className)}>
      <span aria-hidden className="grid size-[40px] place-items-center rounded-full border border-border-highlight bg-surface-accent text-icon-brand-strong"><Icon name="trending-up" /></span>
      <p className="label m-0">
        {percent == null
          ? 'Faça sua primeira entrega para entrar no ranking do seu espaço de recebimento.'
          : `Você reciclou mais que ${fmt(percent)}% dos participantes do seu espaço de recebimento.`}
      </p>
    </div>
  );
}

export interface PodiumEntry {
  position: 1 | 2 | 3;
  /** Nome ou "Participante" na aba Geral. */
  name: string;
  kg: number;
  self?: boolean;
  photo?: string;
  /** Aba Geral: sem nome nem foto; o avatar mostra "?". */
  anonymous?: boolean;
}
export interface PodiumProps { entries: PodiumEntry[] }
const initials = (n: string) => n.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]!.toUpperCase()).join('');
const STEP: Record<1 | 2 | 3, { fill: string; h: string; avatar: string }> = {
  1: { fill: 'bg-award-gold text-foreground', h: 'h-[46px]', avatar: 'size-[64px]' },
  2: { fill: 'bg-award-silver text-foreground', h: 'h-[34px]', avatar: 'size-[54px]' },
  3: { fill: 'bg-award-bronze text-text-inverse', h: 'h-[26px]', avatar: 'size-[54px]' },
};
/** Os três primeiros: avatares sobre degraus ouro, prata e bronze (Ranking do redesign). */
export function Podium({ entries }: PodiumProps) {
  const sorted = [...entries].sort((a, b) => a.position - b.position);
  // Ordem visual 2 · 1 · 3; a lista continua em ordem de posição para o leitor de tela.
  return (
    <ol aria-label="Os três primeiros" className="m-0 grid list-none grid-cols-3 items-end gap-nano p-0">
      {sorted.map((e) => (
        <li key={e.position} className={cn('grid justify-items-center gap-xnano text-center text-foreground', e.position === 1 && 'order-2', e.position === 2 && 'order-1', e.position === 3 && 'order-3')}>
          <Avatar className={cn(STEP[e.position].avatar, e.self ? 'ring-[3px] ring-border-highlight ring-offset-2 ring-offset-background' : '')}>
            {e.photo && <AvatarImage src={e.photo} alt="" />}
            <AvatarFallback className={cn('body-strong', STEP[e.position].fill)}>{e.anonymous ? '?' : initials(e.name)}</AvatarFallback>
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

/* ------------------------------------------------------------- ImpactTiles */

export interface ImpactTilesProps {
  /** Título da faixa ("Seu impacto nesta entrega"). */
  title?: string;
  /** Três números do resultado. O que tem `highlight` ganha borda e valor laranja (os pontos ganhos). */
  items: Array<{ value: string; label: string; highlight?: boolean }>;
  /** "Compartilhar" no canto do título. Sem ele, a pílula não aparece. */
  onShare?: () => void;
  className?: string;
}
/** Resultado da entrega em três cartões (kg, pontos, água), como na tela "Entrega registrada". */
export function ImpactTiles({ title, items, onShare, className }: ImpactTilesProps) {
  return (
    <section aria-label={title ?? 'Seu impacto'} className={cn('grid gap-nano', className)}>
      {(title || onShare) && (
        <div className="flex items-center justify-between gap-nano">
          {title && <h2 className="body-strong m-0">{title}</h2>}
          {onShare && <Button hierarchy="transparent" size="compact" icon="share" onClick={onShare} className="rounded-full bg-surface-accent">Compartilhar</Button>}
        </div>
      )}
      <dl className="m-0 grid auto-cols-fr grid-flow-col gap-nano">
        {items.map((it) => (
          <div key={it.label} className={cn('grid content-between gap-xnano rounded-lg border bg-card p-micro', it.highlight ? 'border-[1.5px] border-border-highlight' : 'border-border')}>
            <dd className={cn('m-0 text-[24px] font-bold leading-8', it.highlight ? 'text-text-link' : 'text-foreground')}>{it.value}</dd>
            <dt className="caption order-last text-muted-foreground">{it.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
}
