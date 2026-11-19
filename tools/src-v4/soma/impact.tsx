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
  /** Letras do avatar quando diferem do nome exibido ("Você" → "P" de Policarpo). */
  initials?: string;
  /** Aba Geral: sem nome nem foto; o avatar mostra "?". */
  anonymous?: boolean;
}
export interface PodiumProps { entries: PodiumEntry[] }
const initials = (n: string) => n.split(/\s+/).filter((w) => /^\p{L}/u.test(w)).slice(0, 2).map((w) => w[0]!.toUpperCase()).join('');
const STEP: Record<1 | 2 | 3, { fill: string; h: string; avatar: string }> = {
  1: { fill: 'bg-award-gold text-foreground', h: 'h-[46px]', avatar: 'size-[64px]' },
  2: { fill: 'bg-award-silver text-foreground', h: 'h-[34px]', avatar: 'size-[54px]' },
  3: { fill: 'bg-award-bronze text-text-inverse', h: 'h-[26px]', avatar: 'size-[54px]' },
};
/** A própria pessoa no pódio: avatar e degrau na cor de destaque (Figma: laranja), nome "Você" e kg em cor de link. */
const SELF_FILL = 'bg-interactive-fill-loud text-foreground';
/** Os três primeiros: avatares sobre degraus ouro, prata e bronze (Ranking do redesign). Colunas de 100px, degraus retos com o número centralizado. */
export function Podium({ entries }: PodiumProps) {
  const sorted = [...entries].sort((a, b) => a.position - b.position);
  // Ordem visual 2 · 1 · 3; a lista continua em ordem de posição para o leitor de tela.
  return (
    <ol aria-label="Os três primeiros" className="m-0 mx-auto grid max-w-[324px] list-none grid-cols-3 items-end gap-micro p-0">
      {sorted.map((e) => {
        const fill = e.self ? SELF_FILL : STEP[e.position].fill;
        return (
          <li key={e.position} className={cn('grid justify-items-center gap-xnano text-center text-foreground', e.position === 1 && 'order-2', e.position === 2 && 'order-1', e.position === 3 && 'order-3')}>
            <Avatar className={STEP[e.position].avatar}>
              {e.photo && <AvatarImage src={e.photo} alt="" />}
              <AvatarFallback className={cn('body-strong', fill)}>{e.anonymous ? '?' : (e.initials ?? initials(e.name))}</AvatarFallback>
            </Avatar>
            <p className={cn('label m-0 max-w-full truncate', e.self && 'font-bold')}><span className="sr-only">{e.position}º lugar: </span>{e.name}{e.self && e.name !== 'Você' && <span className="sr-only"> (você)</span>}</p>
            <p className={cn('caption m-0 font-semibold', e.self ? 'text-text-link' : 'text-muted-foreground')}>{fmt(e.kg)} kg</p>
            <span aria-hidden className={cn('mt-xnano grid w-full place-items-center text-[16px] font-bold leading-5', fill, STEP[e.position].h)}>{e.position}</span>
          </li>
        );
      })}
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
  /** Letras do avatar quando diferem do nome exibido ("Você (Policarpo)" → "P"). */
  initials?: string;
  /** Linha da própria pessoa: fundo creme, borda de destaque, nome em negrito e kg em cor de link. */
  self?: boolean;
  /** Linha de apoio ("Faltam 6,5 kg para ultrapassar Ana"). Ocupa a largura da linha, alinhada ao avatar. */
  hint?: string;
}
/** Linha da lista do ranking, depois do pódio: "#4", avatar de 36px, nome e kg. Não é tocável. */
export function RankingRow({ position, name, kg, photo, initials: letters, self, hint }: RankingRowProps) {
  return (
    <li className={cn('grid list-none grid-cols-[auto_36px_1fr_auto] items-center gap-x-micro rounded-md border p-micro', self ? 'border-border-highlight bg-surface-accent' : 'border-border bg-card')}>
      <span className={cn('min-w-[20px] text-[14px] font-bold leading-5', self ? 'text-text-link' : 'text-muted-foreground')}><span aria-hidden>#</span>{position}<span className="sr-only">º lugar</span></span>
      <Avatar className="size-[36px]">
        {photo && <AvatarImage src={photo} alt="" />}
        <AvatarFallback className={cn('caption font-semibold text-foreground', self ? 'bg-interactive-fill-loud' : 'bg-surface-secondary')}>{letters ?? initials(name)}</AvatarFallback>
      </Avatar>
      <span className={cn('label min-w-0 truncate', self && 'font-bold')}>{name}{self && <span className="sr-only"> (você)</span>}</span>
      <span className={cn('label whitespace-nowrap font-bold', self && 'text-text-link')}>{fmt(kg)} kg</span>
      {hint && <span className="caption col-span-full mt-nano pl-[32px] font-bold text-foreground">{hint}</span>}
    </li>
  );
}
/** Lista para RankingRow (ol com espaçamento). */
export function RankingList({ children, label = 'Classificação' }: { children: React.ReactNode; label?: string }) {
  return <ol aria-label={label} className="m-0 grid gap-nano p-0">{children}</ol>;
}

export interface RankingStarterCardProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}
/** Quem ainda não reciclou no período (Tela 4): card creme abaixo da lista, com o caminho para a primeira entrega. */
export function RankingStarterCard({
  title = 'Sua jornada começa na 1ª entrega.',
  description = 'Faça a primeira e entre no ranking do seu espaço de recebimento.',
  actionLabel = 'Agendar primeira entrega',
  onAction,
  className,
}: RankingStarterCardProps) {
  return (
    <section aria-label="Sua jornada" className={cn('grid gap-micro rounded-lg border border-border-highlight bg-surface-accent p-mini text-foreground', className)}>
      <div className="grid gap-xnano">
        <p className="label m-0 font-bold">{title}</p>
        <p className="caption m-0 text-muted-foreground">{description}</p>
      </div>
      <Button size="compact" fullWidth onClick={onAction}>{actionLabel}</Button>
    </section>
  );
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
          {title && <h2 className="label m-0">{title}</h2>}
          {onShare && <Button hierarchy="transparent" size="compact" icon="share" onClick={onShare} className="rounded-full bg-surface-accent">Compartilhar</Button>}
        </div>
      )}
      <dl className="m-0 grid auto-cols-fr grid-flow-col gap-nano">
        {items.map((it) => (
          <div key={it.label} className={cn('grid content-between gap-xnano rounded-lg border bg-card p-micro', 'border-[1.5px]', it.highlight ? 'border-border-highlight' : 'border-border')}>
            <dd className={cn('m-0 text-[24px] font-bold leading-8', it.highlight ? 'text-text-link' : 'text-foreground')}>{it.value}</dd>
            <dt className={cn('caption order-last', it.highlight ? 'font-bold text-text-link' : 'text-muted-foreground')}>{it.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
}
