/* So+ma · impacto e ranking: StatTile, StatGrid, PositionCard, Podium, RankingRow, StatsRow. */
import * as React from 'react';
import { pressable } from './navigation';
import { cva, type VariantProps } from 'class-variance-authority';
import { focusRing, cn, fmt, tintBg, tintFor, type Tint } from '../lib/utils';
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
    <div role="group" aria-label="Sua posição" className={cn('relative grid gap-xnano overflow-hidden rounded-lg bg-surface-inverse p-mini text-text-inverse shadow-dark', className)}>
      <span aria-hidden className="pointer-events-none absolute -right-[40px] -top-[60px] size-[180px] rounded-full bg-surface-primary/[.07]" />
      {percent == null
        ? <p className="label m-0">Faça sua primeira entrega para entrar no ranking do seu espaço de recebimento.</p>
        : (
          <>
            <p aria-hidden className="eyebrow m-0 uppercase tracking-wide">Seu desempenho</p>
            <p aria-hidden className="m-0 text-[48px] font-bold leading-[56px] text-icon-brand">{fmt(percent)}%</p>
            <p className="body-small m-0">Você reciclou mais que {fmt(percent)}% dos participantes do seu espaço de recebimento.</p>
          </>
        )}
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
const STEP: Record<1 | 2 | 3, { fill: string; h: string; avatar: string; face: string }> = {
  1: { fill: 'bg-primary text-foreground', h: 'h-[72px] rounded-t-lg', avatar: 'size-[64px]', face: 'bg-surface-tint-peach' },
  2: { fill: 'bg-surface-podium-2 text-foreground', h: 'h-[56px] rounded-t-lg', avatar: 'size-[52px]', face: 'bg-surface-tint-blue' },
  3: { fill: 'bg-surface-podium-3 text-foreground', h: 'h-[44px] rounded-t-lg', avatar: 'size-[52px]', face: 'bg-surface-tint-lavender' },
};
/** A própria pessoa no pódio: avatar e degrau na cor de destaque (Figma: laranja), nome "Você" e kg em cor de link. */
const SELF_FILL = 'bg-interactive-fill-loud text-foreground';
const SELF_FACE = 'bg-interactive-fill-loud text-foreground ring-[2.5px] ring-inset ring-foreground';
/** Os três primeiros: avatares em tom claro sobre degraus laranja, areia e pêssego, como no Ranking da v2. Colunas de 100px, degraus retos com o número centralizado. */
export function Podium({ entries }: PodiumProps) {
  const sorted = [...entries].sort((a, b) => a.position - b.position);
  // Ordem visual 2 · 1 · 3; a lista continua em ordem de posição para o leitor de tela.
  return (
    <ol aria-label="Os três primeiros" className="m-0 mx-auto grid max-w-[324px] list-none grid-cols-3 items-end gap-micro p-0">
      {sorted.map((e) => {
        const fill = e.self ? SELF_FILL : STEP[e.position].fill;
        const face = e.self ? SELF_FACE : STEP[e.position].face;
        return (
          <li key={e.position} className={cn('grid justify-items-center gap-xnano text-center text-foreground', e.position === 1 && 'order-2', e.position === 2 && 'order-1', e.position === 3 && 'order-3')}>
            <Avatar className={STEP[e.position].avatar}>
              {e.photo && <AvatarImage src={e.photo} alt="" />}
              <AvatarFallback className={cn('body-strong text-foreground', face)}>{e.anonymous ? '?' : (e.initials ?? initials(e.name))}</AvatarFallback>
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
  /** Tom do avatar. Sem ele, sai do nome (o mesmo tom para a mesma pessoa). */
  tint?: Tint;
  /** Linha da própria pessoa: fundo creme, borda de destaque, nome em negrito e kg em cor de link. */
  self?: boolean;
  /** Linha de apoio ("Faltam 6,5 kg para ultrapassar Ana"). Ocupa a largura da linha, alinhada ao avatar. */
  hint?: string;
}
/** Linha da lista do ranking, depois do pódio: "#4", avatar de 36px, nome e kg. Não é tocável. */
export function RankingRow({ position, name, kg, photo, initials: letters, tint, self, hint }: RankingRowProps) {
  return (
    <li className={cn('grid list-none grid-cols-[auto_36px_1fr_auto] items-center gap-x-micro rounded-lg border p-micro', self ? 'border-border-highlight bg-surface-accent' : 'border-transparent bg-card shadow-card')}>
      <span className={cn('min-w-[20px] text-[14px] font-bold leading-5', self ? 'text-text-link' : 'text-muted-foreground')}><span aria-hidden>#</span>{position}<span className="sr-only">º lugar</span></span>
      <Avatar className="size-[36px]">
        {photo && <AvatarImage src={photo} alt="" />}
        <AvatarFallback className={cn('caption font-semibold text-foreground', self ? 'bg-interactive-fill-loud' : tintBg[tint ?? tintFor(name)])}>{letters ?? initials(name)}</AvatarFallback>
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
    <section aria-label={title} className={cn('grid gap-nano rounded-lg bg-surface-tint-peach p-mini text-foreground', className)}>
      <div className="flex items-center gap-nano">
        <span aria-hidden className="grid size-[32px] shrink-0 place-items-center rounded-full bg-surface-primary text-text-link"><Icon name="calendar" size="small" /></span>
        <h3 className="body-strong m-0">{title}</h3>
      </div>
      <p className="body-small m-0">{description}</p>
      <Button fullWidth size="compact" onClick={onAction}>{actionLabel}</Button>
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
    <section aria-label={title ?? 'Seu impacto'} className={cn('grid gap-micro rounded-lg bg-surface-inverse p-mini text-text-inverse shadow-dark', className)}>
      {(title || onShare) && (
        <div className="flex items-center justify-between gap-nano">
          {title && <h2 className="label m-0">{title}</h2>}
          {onShare && (
            <button type="button" onClick={onShare} className={cn(pressable, focusRing, 'caption inline-flex min-h-touch items-center gap-xnano whitespace-nowrap rounded-xs border-0 bg-transparent font-bold text-icon-brand')}>
              <Icon name="share" size="small" />Compartilhar
            </button>
          )}
        </div>
      )}
      <dl className="m-0 grid auto-cols-fr grid-flow-col gap-nano">
        {items.map((it) => (
          <div key={it.label} className="grid content-start gap-xnano">
            <dd className="m-0 whitespace-nowrap text-[22px] font-bold leading-7 text-icon-brand">{it.value}</dd>
            <dt className={cn('caption order-last', it.highlight && 'font-bold')}>{it.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
}
