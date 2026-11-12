/* So+ma · quiz (redesign): Medal, LevelCard, LevelBadge, TierCard, ProtectionNotice, QuestionCard, PointsBadge,
   StreakTrail, StreakProgress, AnswerResult, DailyDone, HistorySummary, AnswerHistory, AnswerHistoryRow, MilestoneResult. */
import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn, fmt } from '../lib/utils';
import { Icon } from '../ui/icon';
import { Button, IconButton } from '../ui/button';
import { Card } from '../ui/display';
import { RadioGroup, RadioGroupItem } from '../ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/overlay';

/** Três níveis no redesign. Ferro e Platina do app anterior não existem mais. */
export type Tier = 'bronze' | 'prata' | 'ouro';
export const TIER_NAME: Record<Tier, string> = { bronze: 'Bronze', prata: 'Prata', ouro: 'Ouro' };
/** Dificuldade que o Figma escreve ao lado do nome do nível (Tela 5). */
export const TIER_LEVEL: Record<Tier, string> = { bronze: 'Iniciante', prata: 'Intermediário', ouro: 'Avançado' };
/** Perguntas respondidas para alcançar o nível (Tela 5). */
export const TIER_GOAL: Record<Tier, number> = { bronze: 5, prata: 15, ouro: 50 };
export const TIER_NEXT: Record<Tier, Tier | null> = { bronze: 'prata', prata: 'ouro', ouro: null };
const TIER_STARS: Record<Tier, number> = { bronze: 1, prata: 2, ouro: 3 };

/* ----------------------------------------------------------------- Medal */

const medalVariants = cva('relative grid shrink-0 place-items-center rounded-full border-[1.5px]', {
  variants: {
    size: { sm: 'size-[56px]', md: 'size-[96px]', lg: 'size-[124px]' },
    tier: { bronze: 'border-award-bronze bg-surface-accent', prata: 'border-award-silver bg-surface-secondary', ouro: 'border-award-gold bg-surface-accent' },
  },
  defaultVariants: { size: 'md', tier: 'bronze' },
});
export interface MedalProps {
  tier: Tier;
  /** sm 56px (listas) · md 96px (cards de nível) · lg 124px (topo do Quiz). */
  size?: 'sm' | 'md' | 'lg';
  /** Arte ilustrada do nível (a do Figma). Sem ela, desenha a medalha simples do sistema. */
  src?: string;
  className?: string;
}
/** Selo ilustrado do nível: 1 estrela no Bronze, 2 na Prata, 3 no Ouro, sobre o aro. */
export function Medal({ tier, size = 'md', src, className }: MedalProps) {
  const n = TIER_STARS[tier];
  return (
    <span role="img" aria-label={`Medalha ${TIER_NAME[tier]}`} className={cn(medalVariants({ size, tier }), className)}>
      <span aria-hidden className="absolute -top-[9px] left-1/2 flex -translate-x-1/2 items-end gap-[2px]">
        {Array.from({ length: n }, (_, i) => (
          <Icon key={i} name="star" size="small" className={cn('fill-current text-selected-indicator', n === 3 && i === 1 && '-translate-y-[3px]')} />
        ))}
      </span>
      {src ? (
        <img src={src} alt="" className="size-[72%] object-contain" />
      ) : (
        <Icon name="medal" size={size === 'sm' ? 'medium' : 'xlarge'} className={tier === 'prata' ? 'text-icon-secondary' : tier === 'ouro' ? 'text-award-gold' : 'text-award-bronze'} />
      )}
    </span>
  );
}

/* ------------------------------------------------------------ LevelBadge */

const TIER_FILL: Record<Tier, string> = {
  bronze: 'bg-award-bronze text-text-inverse',
  prata: 'bg-award-silver text-foreground',
  ouro: 'bg-award-gold text-foreground',
};
export interface LevelBadgeProps {
  tier: Tier;
  /** name = "BRONZE" (topo do Quiz, histórico) · level = "INICIANTE" (lista de níveis). */
  kind?: 'name' | 'level';
  className?: string;
}
/** Etiqueta do nível em maiúsculas. A cor segue o nível nas duas formas. */
export function LevelBadge({ tier, kind = 'name', className }: LevelBadgeProps) {
  return (
    <span className={cn('inline-flex min-h-small items-center rounded-xs px-nano font-sans text-[12px] font-semibold uppercase leading-4 tracking-wide', TIER_FILL[tier], className)}>
      {kind === 'name' ? TIER_NAME[tier] : TIER_LEVEL[tier]}
    </span>
  );
}

/* ------------------------------------------------------------- LevelCard */

export interface LevelCardProps {
  tier: Tier;
  /** Perguntas que faltam para o próximo nível. Ignorado no Ouro. */
  remaining?: number;
  src?: string;
  className?: string;
}
/** Topo do Quiz: medalha grande, etiqueta do nível e quantas perguntas faltam. Sem barra nem percentual. */
export function LevelCard({ tier, remaining = 0, src, className }: LevelCardProps) {
  const next = TIER_NEXT[tier];
  return (
    <div role="group" aria-label={`Nível ${TIER_NAME[tier]}`} className={cn('grid justify-items-center gap-nano pt-nano text-center', className)}>
      <Medal tier={tier} size="lg" src={src} />
      <LevelBadge tier={tier} />
      <p className="body-small m-0 text-muted-foreground">
        {next ? `${remaining === 1 ? 'Falta 1 pergunta' : `Faltam ${remaining} perguntas`} para ${TIER_NAME[next]}` : 'Você chegou ao nível mais alto'}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------- TierCard */

export interface TierCardProps {
  tier: Tier;
  /** Nível da pessoa agora: borda de destaque. */
  current?: boolean;
  /** Perguntas para chegar ao nível. Padrão: o do Figma (5, 15, 50). */
  questions?: number;
  src?: string;
}
/** Um nível na tela "Campeão da Reciclagem": medalha, nome, etiqueta de dificuldade e quantas perguntas. Use dentro de <ul>. */
export function TierCard({ tier, current, questions = TIER_GOAL[tier], src }: TierCardProps) {
  return (
    <li
      aria-current={current ? 'true' : undefined}
      className={cn(
        'grid list-none grid-cols-[auto_1fr] items-center gap-mini rounded-lg border p-mini',
        tier === 'prata' ? 'bg-surface-secondary' : 'bg-surface-accent',
        current ? 'border-[1.5px] border-border-highlight' : 'border-border',
      )}
    >
      <Medal tier={tier} src={src} />
      <div className="grid gap-xnano">
        <div className="flex flex-wrap items-center gap-nano">
          <p className="page-title m-0">{TIER_NAME[tier]}</p>
          <LevelBadge tier={tier} kind="level" />
        </div>
        <p className="body-small m-0 text-muted-foreground">Responda {questions} perguntas</p>
      </div>
    </li>
  );
}

/* ------------------------------------------------------- ProtectionNotice */

export interface ProtectionNoticeProps {
  children: React.ReactNode;
  /** inline = linha curta com escudo (trilha: "Proteção usada. Renova em 2 dias") · card = aviso creme com (i) (lista de níveis). */
  variant?: 'inline' | 'card';
  /** Só no card: abre "Como funciona a sequência". */
  onInfo?: () => void;
}
/** Aviso da proteção semanal da sequência. */
export function ProtectionNotice({ children, variant = 'inline', onInfo }: ProtectionNoticeProps) {
  if (variant === 'inline') {
    return (
      <p className="caption m-0 flex items-center gap-xnano text-foreground">
        <Icon name="shield" size="small" tone="info" />{children}
      </p>
    );
  }
  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-micro rounded-lg bg-surface-accent p-micro">
      <span aria-hidden className="grid size-[32px] place-items-center rounded-full bg-surface-brand text-text-on-loud"><Icon name="shield" size="small" /></span>
      <p className="body-small m-0">{children}</p>
      {onInfo && <IconButton icon="info" label="Como funciona a proteção da sequência" onClick={onInfo} />}
    </div>
  );
}

/* ----------------------------------------------------------- QuestionCard */

export interface QuestionCardProps {
  /** Pontos que o acerto vale, no selo à direita. */
  points?: number;
  question: string;
  options: string[];
  value?: string;
  onChange?: (v: string) => void;
  onSubmit?: () => void;
  /** Texto do popover do (i). Sem ele, o (i) não aparece. */
  info?: string;
  submitting?: boolean;
}
/** Card da pergunta do dia: borda de destaque, selo de pontos, opções em linha e "Enviar resposta". Depois de responder, use DailyDone. */
export function QuestionCard({ points, question, options, value, onChange, onSubmit, info, submitting }: QuestionCardProps) {
  const qid = React.useId();
  return (
    <Card aria-labelledby={qid} role="group" className="border-[1.5px] border-border-highlight">
      <div className="flex items-center gap-xnano text-text-link">
        <span id={qid} className="eyebrow uppercase tracking-wide">Pergunta do dia</span>
        {info && (
          <Popover>
            <PopoverTrigger asChild><IconButton icon="info" label="Como funciona o quiz" className="-my-micro" /></PopoverTrigger>
            <PopoverContent aria-label="Como funciona o quiz">{info}</PopoverContent>
          </Popover>
        )}
        {points != null && <PointsBadge points={points} className="ml-auto" />}
      </div>
      <p className="body-strong m-0" id={`${qid}-q`}>{question}</p>
      <RadioGroup value={value} onValueChange={onChange} aria-labelledby={`${qid}-q`}>
        {options.map((o, i) => (
          <label
            key={o}
            className="body-small flex min-h-touch cursor-pointer items-center gap-nano rounded-sm border-[1.5px] border-input bg-surface-primary px-micro py-nano text-foreground transition-colors hover:bg-interactive-fill-quiet-hover has-[[data-state=checked]]:border-border-highlight has-[[data-state=checked]]:bg-surface-accent"
          >
            <RadioGroupItem value={o} id={`${qid}-${i}`} />
            {o}
          </label>
        ))}
      </RadioGroup>
      <Button fullWidth disabled={!value} loading={submitting} onClick={onSubmit}>Enviar resposta</Button>
    </Card>
  );
}

/* ----------------------------------------------------------- PointsBadge */

export interface PointsBadgeProps {
  points: number;
  /** gain = "+15 pontos" (o que vale) · cost = "1.200 pontos" (o que custa). */
  kind?: 'gain' | 'cost';
  className?: string;
}
/** Pílula de pontos em creme com texto text-link. Número no padrão brasileiro. */
export function PointsBadge({ points, kind = 'gain', className }: PointsBadgeProps) {
  return (
    <span className={cn('inline-flex min-h-small items-center gap-xnano whitespace-nowrap rounded-full bg-surface-accent px-nano font-sans text-[12px] font-semibold leading-4 text-text-link', className)}>
      {kind === 'gain' && '+'}{fmt(points)} {points === 1 ? 'ponto' : 'pontos'}
    </span>
  );
}

/* ----------------------------------------------------------- StreakTrail */

export type StreakDayState = 'done' | 'protected' | 'today' | 'missed' | 'future';
export interface StreakDay {
  /** Inicial do dia ("S", "T", "Q"). */
  label: string;
  state: StreakDayState;
  /** Hoje, já respondido: o check ganha o anel de destaque (Tela 3). Com state="today", o anel já vem. */
  today?: boolean;
}
export interface StreakTrailProps {
  /** Sete dias, na ordem da semana. */
  days: StreakDay[];
  className?: string;
}
const DAY_NAME: Record<StreakDayState, string> = { done: 'respondido', protected: 'protegido', today: 'hoje, ainda sem resposta', missed: 'perdido', future: 'ainda não chegou' };
/** "Sua trilha": check (feito), escudo (protegido), × (perdido) e a inicial do dia quando ainda não há resposta. Hoje leva anel de destaque. */
export function StreakTrail({ days, className }: StreakTrailProps) {
  return (
    <ol aria-label="Sua semana no quiz" className={cn('m-0 grid list-none grid-cols-7 gap-xnano p-0', className)}>
      {days.map((d, i) => {
        const ring = d.state === 'today' || d.today;
        return (
          <li key={i} className="grid justify-items-center gap-xnano">
            <span
              aria-hidden
              className={cn(
                'grid size-[36px] place-items-center rounded-full text-[14px] font-semibold leading-5',
                d.state === 'done' && 'bg-feedback-fill-positive text-feedback-text-positive',
                d.state === 'protected' && 'bg-surface-info text-icon-info',
                d.state === 'missed' && 'bg-feedback-fill-negative text-feedback-text-negative',
                (d.state === 'today' || d.state === 'future') && 'bg-surface-track text-muted-foreground',
                ring && 'border-[3px] border-border-highlight',
                d.state === 'today' && 'text-foreground',
              )}
            >
              {d.state === 'done' && <Icon name="check" size="small" />}
              {d.state === 'protected' && <Icon name="shield" size="small" />}
              {d.state === 'missed' && <Icon name="close" size="small" />}
              {(d.state === 'today' || d.state === 'future') && d.label}
            </span>
            <span className={cn('caption', ring ? 'font-semibold text-foreground' : 'text-muted-foreground')}>
              {d.label}<span className="sr-only">: {DAY_NAME[d.state]}{d.today && d.state !== 'today' ? ', hoje' : ''}</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}

/* -------------------------------------------------------- StreakProgress */

export interface StreakProgressProps {
  /** Semanas seguidas até agora. */
  weeks: number;
  /** Marcos em semanas. O último é o fim da barra. Padrão do Figma: 1, 5, 10, 20. */
  milestones?: number[];
  /** "Próximo prêmio: 500 pontos em 3 semanas". */
  nextReward?: { points: number; inWeeks: number };
  /** Esconde o título "Sequência: N semanas" (tela de conquista). */
  hideLabel?: boolean;
  className?: string;
}
const wk = (n: number) => (n === 1 ? 'semana' : 'semanas');
/** Barra da sequência em semanas, com marcos de prêmio (1, 5, 10 e 20 semanas). Marco alcançado: bolinha laranja com check. */
export function StreakProgress({ weeks, milestones = [1, 5, 10, 20], nextReward, hideLabel, className }: StreakProgressProps) {
  const max = Math.max(...milestones);
  const pct = Math.min(100, (weeks / max) * 100);
  return (
    <div className={cn('grid gap-nano', className)}>
      {!hideLabel && <p className="label m-0">Sequência: {weeks} {wk(weeks)}</p>}
      <div className="relative h-[16px]" role="progressbar" aria-label="Progresso da sequência" aria-valuemin={0} aria-valuemax={max} aria-valuenow={Math.min(weeks, max)} aria-valuetext={`${weeks} ${wk(weeks)} seguidas`}>
        <div className="absolute inset-x-0 top-1/2 h-[8px] -translate-y-1/2 overflow-hidden rounded-full bg-surface-track">
          <div className="h-full rounded-full bg-selected-indicator" style={{ width: `${pct}%` }} />
        </div>
        {milestones.map((m) => {
          const reached = weeks >= m;
          return (
            <span
              key={m}
              aria-hidden
              className={cn('absolute top-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full', reached ? 'size-[16px] bg-selected-indicator text-text-on-loud' : 'size-[10px] bg-text-secondary')}
              style={{ left: `${(m / max) * 100}%` }}
            >
              {reached && <svg viewBox="0 0 12 12" className="size-[10px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 6.5l2.2 2.2 4.8-5" /></svg>}
            </span>
          );
        })}
      </div>
      <div aria-hidden className="relative h-small">
        {milestones.map((m) => (
          <span key={m} className="caption absolute -translate-x-1/2 whitespace-nowrap text-muted-foreground" style={{ left: `min(calc(100% - 16px), max(16px, ${(m / max) * 100}%))` }}>{m} sem</span>
        ))}
      </div>
      {nextReward && <p className="body-small m-0 text-muted-foreground">Próximo prêmio: {fmt(nextReward.points)} pontos em {nextReward.inWeeks} {wk(nextReward.inWeeks)}</p>}
    </div>
  );
}

/* ---------------------------------------------------------- AnswerResult */

function Art({ art, fallback }: { art?: string | React.ReactNode; fallback: React.ReactNode }) {
  return (
    <span aria-hidden className="grid size-[160px] place-items-center overflow-hidden rounded-full bg-surface-accent">
      {typeof art === 'string' ? <img src={art} alt="" className="size-full object-contain" /> : art ?? fallback}
    </span>
  );
}
export interface AnswerResultProps {
  correct: boolean;
  /** A resposta certa, como aparece nas opções. */
  answer: string;
  /** "Por quê?": a explicação curta. */
  explanation: string;
  /** Só no acerto. */
  points?: number;
  /** Semanas seguidas, só no acerto. */
  weeks?: number;
  /** Frase abaixo de "Pontos ganhos". Padrão: "Volte amanhã para manter sua sequência!". */
  message?: string;
  /** Ilustração do mascote (URL ou nó). Sem ela, mostra um ícone. */
  art?: string | React.ReactNode;
  onContinue?: () => void;
  /** Link sob o botão: "Convidar amigos" no acerto, "Volte amanhã para a próxima pergunta" no erro. */
  secondary?: { label: string; onClick?: () => void; href?: string };
}
/** Resultado da resposta do dia, em tela cheia (Telas 2A e 2B). Não use Modal: o redesign não tem diálogo aqui. */
export function AnswerResult({ correct, answer, explanation, points, weeks, message = 'Volte amanhã para manter sua sequência!', art, onContinue, secondary }: AnswerResultProps) {
  const id = React.useId();
  return (
    <section aria-labelledby={id} className="grid min-h-full grid-rows-[auto_1fr_auto]">
      <header className="grid justify-items-center gap-mini border-b border-border px-mini pb-mini pt-nano">
        <span className={cn('rounded-full px-nano py-xnano text-[12px] font-bold uppercase leading-4 tracking-wide', correct ? 'bg-feedback-text-positive text-text-inverse' : 'bg-destructive text-destructive-foreground')}>
          {correct ? 'Você acertou!' : 'Não foi dessa vez'}
        </span>
        <Art art={art} fallback={<Icon name={correct ? 'circle-check' : 'help'} size="xlarge" tone={correct ? 'positive' : 'brand-strong'} />} />
      </header>
      <div className="grid content-start gap-mini px-mini pt-mini">
        <div className="grid gap-xnano">
          <p className="eyebrow m-0 uppercase text-text-link">{correct ? 'A resposta certa é' : 'A resposta certa era'}</p>
          <h2 id={id} className="screen-title m-0">{answer}</h2>
        </div>
        <div className="grid gap-xnano">
          <h3 className="caption m-0 font-bold uppercase text-muted-foreground">Por quê?</h3>
          <p className="body m-0 text-muted-foreground">{explanation}</p>
        </div>
        {correct ? (
          <div className="grid gap-xnano">
            <h3 className="caption m-0 font-bold uppercase text-muted-foreground">Pontos ganhos</h3>
            <p className="body m-0 text-muted-foreground">{message}</p>
            <div className="mt-xnano flex flex-wrap gap-nano">
              {weeks != null && (
                <span className="inline-flex min-h-small items-center gap-xnano rounded-full bg-feedback-fill-positive px-nano text-[12px] font-semibold leading-4 text-feedback-text-positive">
                  <Icon name="circle-check" size="small" />{weeks} {wk(weeks)} {weeks === 1 ? 'seguida' : 'seguidas'}
                </span>
              )}
              {points != null && (
                <span className="inline-flex min-h-small items-center gap-xnano rounded-full border border-border-highlight px-nano text-[12px] font-semibold leading-4 text-text-link">
                  <Icon name="star" size="small" />+{fmt(points)} pontos
                </span>
              )}
            </div>
          </div>
        ) : (
          <p className="body m-0 text-muted-foreground">Continue aprendendo para subir de nível.</p>
        )}
      </div>
      <footer className="grid justify-items-center gap-nano px-mini pb-mini pt-large">
        <Button fullWidth onClick={onContinue}>Continuar</Button>
        {secondary && <Button hierarchy="transparent" asChild={!!secondary.href} onClick={secondary.onClick} className="underline">{secondary.href ? <a href={secondary.href}>{secondary.label}</a> : secondary.label}</Button>}
      </footer>
    </section>
  );
}

/* ------------------------------------------------------------- DailyDone */

export interface DailyDoneProps {
  /** Padrão "Tarefa cumprida!". */
  title?: string;
  children?: React.ReactNode;
  /** Tempo até a próxima pergunta ("14h 15m"). */
  countdown?: string;
  className?: string;
}
/** Estado do Quiz depois de responder: check verde, mensagem e contagem até a próxima pergunta (Tela 3). */
export function DailyDone({ title = 'Tarefa cumprida!', children = 'Você já respondeu hoje! Volte amanhã para continuar.', countdown, className }: DailyDoneProps) {
  return (
    <section role="status" className={cn('grid justify-items-center gap-nano rounded-lg border border-border bg-surface-primary px-mini py-small text-center', className)}>
      <span aria-hidden className="grid size-[48px] place-items-center rounded-full bg-feedback-fill-positive text-feedback-text-positive"><Icon name="check" size="large" /></span>
      <h2 className="body-strong m-0 text-[18px] leading-6">{title}</h2>
      <p className="body-small m-0 text-muted-foreground">{children}</p>
      {countdown && <span className="rounded-md bg-surface-secondary px-micro py-xnano caption font-semibold text-foreground">Próxima pergunta em {countdown}</span>}
    </section>
  );
}

/* --------------------------------------------------------------- Histórico */

export interface HistorySummaryProps {
  tier: Tier;
  /** Data em que subiu de nível ("26/08/2026"). */
  since?: string;
  total: number;
  /** Data da última resposta. */
  last: string;
  src?: string;
}
/** Topo do Histórico: medalha com etiqueta, total de respostas e data da última (Tela 4). */
export function HistorySummary({ tier, since, total, last, src }: HistorySummaryProps) {
  return (
    <div className="grid gap-micro">
      <div className="flex items-center gap-mini rounded-lg bg-surface-secondary p-mini">
        <Medal tier={tier} src={src} />
        <div className="grid justify-items-start gap-xnano">
          <LevelBadge tier={tier} />
          {since && <p className="caption m-0 text-muted-foreground">Avançou de nível em {since}</p>}
        </div>
      </div>
      <dl className="m-0 grid grid-cols-2 gap-micro">
        {[['Total de respostas', String(total)], ['Última resposta', last]].map(([k, v]) => (
          <div key={k} className="grid gap-xnano rounded-md bg-surface-secondary p-micro">
            <dt className="caption text-muted-foreground">{k}</dt>
            <dd className="m-0 text-[18px] font-bold leading-6 text-foreground">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export interface AnswerHistoryProps {
  /** Mês exibido ("Agosto 2026"). */
  month: string;
  onPrev?: () => void;
  onNext?: () => void;
  children: React.ReactNode;
}
/** Paginador de mês + lista de respostas. Filhos: AnswerHistoryRow. */
export function AnswerHistory({ month, onPrev, onNext, children }: AnswerHistoryProps) {
  return (
    <section aria-label="Histórico de respostas" className="grid gap-micro">
      <div className="flex items-center justify-between rounded-lg border border-border px-xnano">
        <IconButton icon="chevron-left" label="Mês anterior" onClick={onPrev} disabled={!onPrev} />
        <p className="label m-0" aria-live="polite">{month}</p>
        <IconButton icon="chevron-right" label="Próximo mês" onClick={onNext} disabled={!onNext} />
      </div>
      <ul className="m-0 grid list-none overflow-hidden rounded-lg border border-border p-0">{children}</ul>
    </section>
  );
}

export type AnswerResultKind = { kind: 'points'; points: number } | { kind: 'kept' } | { kind: 'zero' };
export interface AnswerHistoryRowProps {
  /** "28/08/2026". */
  date: string;
  question: string;
  result: AnswerResultKind;
}
/** Uma resposta do histórico: data, pergunta em uma linha e o resultado (+15, "Sequência mantida" ou 0). */
export function AnswerHistoryRow({ date, question, result }: AnswerHistoryRowProps) {
  return (
    <li className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-nano border-b border-border px-micro py-nano last:border-b-0">
      <div className="grid min-w-0 gap-xnano">
        <p className="label m-0">{date}</p>
        <p className="caption m-0 truncate text-muted-foreground">{question}</p>
      </div>
      {result.kind === 'points' && <span className="inline-flex min-h-small items-center rounded-full bg-feedback-fill-positive px-nano text-[12px] font-semibold leading-4 text-feedback-text-positive">+{result.points}<span className="sr-only"> pontos</span></span>}
      {result.kind === 'kept' && <span className="inline-flex min-h-small items-center gap-xnano rounded-full bg-surface-accent px-nano text-[12px] font-semibold leading-4 text-text-link"><Icon name="shield" size="small" tone="info" />Sequência mantida</span>}
      {result.kind === 'zero' && <span className="inline-flex min-h-small items-center rounded-full bg-surface-secondary px-nano text-[12px] font-semibold leading-4 text-muted-foreground">0<span className="sr-only"> pontos</span></span>}
    </li>
  );
}

/* ------------------------------------------------------- MilestoneResult */

export interface MilestoneResultProps {
  /** Semanas seguidas completadas (1, 5, 10, 20). */
  weeks: number;
  /** Bônus do marco. */
  points: number;
  /** Próximo marco. Sem ele, usa só o texto de `message`. */
  nextReward?: { week: number; points: number };
  /** Texto de apoio. Padrão: "Continue assim. Na 5ª semana seguida você ganha 500 pontos.". */
  message?: string;
  milestones?: number[];
  tier?: Tier;
  /** Arte da conquista (URL ou nó). */
  art?: string | React.ReactNode;
  onContinue?: () => void;
}
/** Conquista de marco da sequência (Telas 7 e 8): "+100 pontos", título e os marcos com o atual marcado. */
export function MilestoneResult({ weeks, points, nextReward, message, milestones = [1, 5, 10, 20], tier = 'bronze', art, onContinue }: MilestoneResultProps) {
  const id = React.useId();
  const text = message ?? (nextReward ? `Continue assim. Na ${nextReward.week}ª semana seguida você ganha ${fmt(nextReward.points)} pontos.` : 'Continue assim para manter sua sequência.');
  return (
    <section aria-labelledby={id} className="grid min-h-full grid-rows-[auto_1fr_auto]">
      <header className="grid justify-items-center gap-mini border-b border-border px-mini pb-mini pt-small">
        {typeof art === 'string' ? <img src={art} alt="" className="size-[120px] object-contain" /> : art ?? <Medal tier={tier} size="md" />}
        <p className="m-0 text-[40px] font-bold leading-[48px] text-text-link">+{fmt(points)} pontos</p>
      </header>
      <div className="grid content-start gap-micro px-mini pt-mini">
        <h2 id={id} className="screen-title m-0">Você completou {weeks} {wk(weeks)} {weeks === 1 ? 'seguida' : 'seguidas'}!</h2>
        <p className="body m-0 text-muted-foreground">{text}</p>
        <StreakProgress weeks={weeks} milestones={milestones} hideLabel />
      </div>
      <footer className="px-mini pb-mini pt-large"><Button fullWidth onClick={onContinue}>Continuar</Button></footer>
    </section>
  );
}
