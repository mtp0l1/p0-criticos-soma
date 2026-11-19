/* So+ma · quiz (redesign): Trophy, LevelCard, LevelBadge, TierCard, ProtectionNotice, QuestionCard, PointsBadge,
   StreakTrail, StreakProgress, StreakSection, AnswerResult, DailyDone, HistorySummary, AnswerHistory, AnswerHistoryRow, MilestoneResult.
   Medidas, cores e textos conferidos nas telas NOVO do Quiz do Figma (Telas 1 a 8). Os níveis são troféus ilustrados, não medalhas. */
import * as React from 'react';
import { cn, fmt } from '../lib/utils';
import { Icon } from '../ui/icon';
import { Button, IconButton } from '../ui/button';
import { Card } from '../ui/display';
import { RadioGroup, RadioGroupItem } from '../ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/overlay';
import { ILLUSTRATIONS } from '../assets/illustrations';

/** Três níveis no redesign. Ferro e Platina do app anterior não existem mais. */
export type Tier = 'bronze' | 'prata' | 'ouro';
export const TIER_NAME: Record<Tier, string> = { bronze: 'Bronze', prata: 'Prata', ouro: 'Ouro' };
/** Dificuldade que o Figma escreve ao lado do nome do nível (Tela 5). */
export const TIER_LEVEL: Record<Tier, string> = { bronze: 'Iniciante', prata: 'Intermediário', ouro: 'Avançado' };
/** Perguntas respondidas para alcançar o nível (Tela 5). */
export const TIER_GOAL: Record<Tier, number> = { bronze: 5, prata: 15, ouro: 50 };
export const TIER_NEXT: Record<Tier, Tier | null> = { bronze: 'prata', prata: 'ouro', ouro: null };
/** Estrelas do troféu: 1 no Bronze, 2 na Prata, 3 no Ouro. */
export const TIER_STARS: Record<Tier, number> = { bronze: 1, prata: 2, ouro: 3 };

/* ---------------------------------------------------------------- Trophy */

const TROPHY_ART: Record<Tier, { md: string; lg: string }> = {
  bronze: { md: ILLUSTRATIONS['trofeu-bronze-96'].src, lg: ILLUSTRATIONS['trofeu-bronze-120'].src },
  prata: { md: ILLUSTRATIONS['trofeu-prata-96'].src, lg: ILLUSTRATIONS['trofeu-prata-96'].src },
  ouro: { md: ILLUSTRATIONS['trofeu-ouro-96'].src, lg: ILLUSTRATIONS['trofeu-ouro-96'].src },
};
export interface TrophyProps {
  tier: Tier;
  /** md 96px (cards de nível e Histórico) · lg 120px (topo do Quiz). */
  size?: 'md' | 'lg';
  /** Troca a arte do Figma por outra imagem. */
  src?: string;
  className?: string;
}
/** Troféu ilustrado do nível: pilha de pontos com estrela, num círculo. 1 estrela no Bronze, 2 na Prata e 3 no Ouro. A arte já vem embutida. */
export function Trophy({ tier, size = 'md', src, className }: TrophyProps) {
  const n = TIER_STARS[tier];
  return (
    <img
      src={src ?? TROPHY_ART[tier][size]}
      alt={`Troféu ${TIER_NAME[tier]}, ${n} ${n === 1 ? 'estrela' : 'estrelas'}`}
      width={size === 'lg' ? 120 : 96}
      height={size === 'lg' ? 120 : 96}
      className={cn('shrink-0 object-contain', size === 'lg' ? 'size-[120px]' : 'size-[96px]', className)}
    />
  );
}

/* ------------------------------------------------------------ LevelBadge */

const TIER_FILL: Record<Tier, string> = {
  bronze: 'bg-award-bronze font-semibold text-text-inverse',
  prata: 'bg-surface-track font-bold text-foreground',
  ouro: 'bg-tier-gold-border font-bold text-foreground',
};
export interface LevelBadgeProps {
  tier: Tier;
  /** name = "Bronze" (topo do Quiz, histórico) · level = "Iniciante" (lista de níveis). */
  kind?: 'name' | 'level';
  className?: string;
}
/** Etiqueta do nível em maiúsculas, 10px. A cor segue o nível nas duas formas: marrom, cinza-azulado e amarelo. */
export function LevelBadge({ tier, kind = 'name', className }: LevelBadgeProps) {
  return (
    <span className={cn('inline-flex items-center rounded-xs px-nano py-[2px] font-sans text-[12px] uppercase leading-4 tracking-[0.5px]', TIER_FILL[tier], className)}>
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
/** Topo do Quiz (Telas 1 e 3): troféu do nível, etiqueta e quantas perguntas faltam. Sem barra nem percentual. Mostra Bronze, Prata ou Ouro. */
export function LevelCard({ tier, remaining = 0, src, className }: LevelCardProps) {
  const next = TIER_NEXT[tier];
  return (
    <div role="group" aria-label={`Nível ${TIER_NAME[tier]}`} className={cn('grid justify-items-center gap-nano py-nano text-center', className)}>
      <div className="grid justify-items-center gap-[6px]">
        <div className="flex h-[145px] w-[130px] items-end justify-center">
          <Trophy tier={tier} size="lg" src={src} />
        </div>
        <LevelBadge tier={tier} />
      </div>
      <p className="m-0 text-[12px] font-medium leading-[15px] text-muted-foreground">
        {next ? `${remaining === 1 ? 'Falta 1 pergunta' : `Faltam ${remaining} perguntas`} para ${TIER_NAME[next]}` : 'Você chegou ao nível mais alto'}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------- TierCard */

const TIER_CARD: Record<Tier, string> = {
  bronze: 'border-border-highlight bg-surface-accent',
  prata: 'border-border bg-surface-secondary',
  ouro: 'border-tier-gold-border bg-tier-gold-surface',
};
export interface TierCardProps {
  tier: Tier;
  /** Nível da pessoa agora. No Figma o cartão não muda de aparência: só avisa o leitor de tela. */
  current?: boolean;
  /** Perguntas para chegar ao nível. Padrão: o do Figma (5, 15, 50). */
  questions?: number;
  src?: string;
}
/** Um nível na tela "Campeão da Reciclagem" (Tela 5): troféu, nome, etiqueta de dificuldade e quantas perguntas. Cada nível tem fundo e contorno próprios. Use dentro de <ul>. */
export function TierCard({ tier, current, questions = TIER_GOAL[tier], src }: TierCardProps) {
  return (
    <li aria-current={current ? 'true' : undefined} className={cn('grid list-none grid-cols-[auto_1fr] items-center gap-mini rounded-lg border p-mini', TIER_CARD[tier])}>
      <Trophy tier={tier} src={src} />
      <div className="grid gap-xnano">
        <div className="flex flex-wrap items-center gap-nano">
          <p className="m-0 text-[18px] font-extrabold leading-6 text-foreground">{TIER_NAME[tier]}</p>
          <LevelBadge tier={tier} kind="level" />
        </div>
        <p className="m-0 text-[12px] leading-[15px] text-muted-foreground">Responda {questions} perguntas</p>
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
      <p className="m-0 flex items-center gap-nano text-[12px] font-medium leading-[15px] text-foreground">
        <Icon name="shield" tone="info" className="size-[12px]" />{children}
      </p>
    );
  }
  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-micro rounded-md bg-surface-accent p-[14px]">
      <span aria-hidden className="grid size-[32px] place-items-center rounded-full bg-surface-brand text-text-on-loud"><Icon name="shield" size="small" /></span>
      <p className="m-0 text-[14px] leading-5 text-muted-foreground">{children}</p>
      {onInfo && <IconButton icon="info" label="Como funciona a proteção da sequência" onClick={onInfo} />}
    </div>
  );
}

/* ----------------------------------------------------------- QuestionCard */

export interface QuestionCardProps {
  /** Pontos que o acerto vale, no selo à direita. */
  points?: number;
  question: string;
  /** Só o texto. O componente escreve "a)", "b)"… na frente. */
  options: string[];
  value?: string;
  onChange?: (v: string) => void;
  onSubmit?: () => void;
  /** Texto do popover do (i). Sem ele, o (i) não aparece. */
  info?: string;
  submitting?: boolean;
}
/** Card da pergunta do dia (Tela 1): borda de destaque, selo de pontos, opções "a) …" em linha e "Enviar resposta". Depois de responder, use DailyDone. */
export function QuestionCard({ points, question, options, value, onChange, onSubmit, info, submitting }: QuestionCardProps) {
  const qid = React.useId();
  return (
    <Card aria-labelledby={qid} role="group" className="gap-micro border-[1.5px] border-border-highlight p-mini">
      <div className="flex items-center gap-xnano text-text-link">
        <span id={qid} className="text-[12px] font-bold leading-[15px]">Pergunta do dia</span>
        {info && (
          <Popover>
            <PopoverTrigger asChild><IconButton icon="info" label="Como funciona o quiz" className="-my-micro" /></PopoverTrigger>
            <PopoverContent aria-label="Como funciona o quiz">{info}</PopoverContent>
          </Popover>
        )}
        {points != null && <PointsBadge points={points} className="ml-auto min-h-0 px-nano py-[2px] text-[12px] leading-4" />}
      </div>
      <p className="m-0 text-[16px] font-bold leading-6 text-foreground" id={`${qid}-q`}>{question}</p>
      <RadioGroup value={value} onValueChange={onChange} aria-labelledby={`${qid}-q`} className="gap-nano">
        {options.map((o, i) => (
          <label
            key={o}
            className="flex min-h-touch cursor-pointer items-center rounded-sm border border-input bg-surface-primary p-[10px] text-[14px] leading-5 text-foreground transition-colors hover:bg-interactive-fill-quiet-hover has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring has-[[data-state=checked]]:border-[1.5px] has-[[data-state=checked]]:border-border-highlight has-[[data-state=checked]]:bg-surface-accent has-[[data-state=checked]]:font-semibold"
          >
            <RadioGroupItem value={o} id={`${qid}-${i}`} className="sr-only" />
            {String.fromCharCode(97 + i)}) {o}
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
/** "Sua trilha": check (feito), escudo (protegido) e a inicial do dia ainda sem resposta. Hoje leva anel laranja de 3px. O estado "missed" não aparece no Figma. */
export function StreakTrail({ days, className }: StreakTrailProps) {
  return (
    <ol aria-label="Sua semana no quiz" className={cn('m-0 flex list-none justify-between p-0 py-nano', className)}>
      {days.map((d, i) => {
        const ring = d.state === 'today' || d.today;
        return (
          <li key={i} className="grid w-[36px] justify-items-center gap-xnano">
            <span
              aria-hidden
              className={cn(
                'grid size-[36px] place-items-center rounded-full text-[12px] font-bold leading-[15px]',
                d.state === 'done' && 'bg-feedback-fill-positive text-feedback-text-positive',
                d.state === 'protected' && 'bg-surface-info text-icon-info',
                d.state === 'missed' && 'bg-feedback-fill-negative text-feedback-text-negative',
                (d.state === 'today' || d.state === 'future') && 'bg-surface-track text-muted-foreground',
                ring && 'border-[3px] border-border-highlight',
              )}
            >
              {d.state === 'done' && <Icon name="check" className="size-[12px]" />}
              {d.state === 'protected' && <Icon name="shield" className="size-[12px]" />}
              {d.state === 'missed' && <Icon name="close" className="size-[12px]" />}
              {(d.state === 'today' || d.state === 'future') && d.label}
            </span>
            <span className="text-[12px] leading-4 text-muted-foreground">
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
  /** Esconde o título "Sequência: N semanas". */
  hideLabel?: boolean;
  className?: string;
}
const wk = (n: number) => (n === 1 ? 'semana' : 'semanas');
/** Barra da sequência em semanas (Tela 1): trilho de 8px, marcos de prêmio em 1, 5, 10 e 20 semanas. Marco alcançado: bolinha laranja de 10px com check. Os outros: bolinha de 6px. */
export function StreakProgress({ weeks, milestones = [1, 5, 10, 20], nextReward, hideLabel, className }: StreakProgressProps) {
  const max = Math.max(...milestones);
  const pct = Math.min(100, (weeks / max) * 100);
  return (
    <div className={cn('grid gap-nano', className)}>
      {!hideLabel && <p className="m-0 text-[12px] font-semibold leading-[15px] text-foreground">Sequência: {weeks} {wk(weeks)}</p>}
      <div className="grid gap-[6px]">
        <div className="relative h-[8px] rounded-full bg-surface-track" role="progressbar" aria-label="Progresso da sequência" aria-valuemin={0} aria-valuemax={max} aria-valuenow={Math.min(weeks, max)} aria-valuetext={`${weeks} ${wk(weeks)} seguidas`}>
          <div className="h-full rounded-full bg-selected-indicator" style={{ width: `${pct}%` }} />
          {milestones.map((m) => {
            const reached = weeks >= m;
            return (
              <span
                key={m}
                aria-hidden
                className={cn('absolute top-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full', reached ? 'size-[10px] border border-background bg-selected-indicator text-text-on-loud' : 'size-[6px] bg-text-secondary')}
                style={{ left: `${(m / max) * 100}%` }}
              >
                {reached && <svg viewBox="0 0 12 12" className="size-[7px]" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 6.5l2.2 2.2 4.8-5" /></svg>}
              </span>
            );
          })}
        </div>
        <div aria-hidden className="relative h-[12px]">
          {milestones.map((m) => {
            const half = String(m).length > 1 ? 18 : 15;
            return (
              <span key={m} className="absolute -translate-x-1/2 whitespace-nowrap text-[12px] font-semibold leading-4 text-muted-foreground" style={{ left: `min(calc(100% - ${half}px), max(${half}px, ${(m / max) * 100}%))` }}>{m} sem</span>
            );
          })}
        </div>
      </div>
      {nextReward && <p className="m-0 text-[12px] font-medium leading-[15px] text-muted-foreground">Próximo prêmio: {fmt(nextReward.points)} pontos em {nextReward.inWeeks} {wk(nextReward.inWeeks)}</p>}
    </div>
  );
}

/* --------------------------------------------------------- StreakSection */

export interface StreakSectionProps {
  /** Sete dias da semana. */
  days: StreakDay[];
  weeks: number;
  nextReward?: { points: number; inWeeks: number };
  /** Aviso da proteção ("Proteção usada. Renova em 2 dias"). */
  protection?: React.ReactNode;
  /** Link "Ver histórico". Sem ele, o link não aparece. */
  onHistory?: () => void;
  className?: string;
}
/** Bloco "Sua trilha" das Telas 1 e 3: título, 7 dias, barra de semanas, aviso de proteção e link "Ver histórico". */
export function StreakSection({ days, weeks, nextReward, protection, onHistory, className }: StreakSectionProps) {
  return (
    <section aria-labelledby="streak-title" className={cn('grid gap-nano px-mini', className)}>
      <h2 id="streak-title" className="m-0 text-[14px] font-bold leading-[17px] text-foreground">Sua trilha</h2>
      <StreakTrail days={days} />
      <StreakProgress weeks={weeks} nextReward={nextReward} />
      {protection && <ProtectionNotice>{protection}</ProtectionNotice>}
      {onHistory && (
        <button type="button" onClick={onHistory} className="min-h-touch justify-self-start text-[12px] font-medium leading-[15px] text-text-link underline">Ver histórico</button>
      )}
    </section>
  );
}

/* ---------------------------------------------------------- AnswerResult */

const PILL = 'inline-flex items-center gap-[6px] rounded-full px-micro py-xnano text-[12px] leading-4';
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
  /** Troca a mascote do Figma por outra ilustração (URL ou nó). */
  art?: string | React.ReactNode;
  onContinue?: () => void;
  /** Link sob o botão: "Convidar amigos" no acerto, "Volte amanhã para a próxima pergunta" no erro. */
  secondary?: { label: string; onClick?: () => void; href?: string };
}
/** Resultado da resposta do dia, em tela cheia (Telas 2A e 2B): faixa com a mascote da lata, resposta certa, "Por quê?" e, no acerto, as pílulas de semanas e pontos. Não use Modal: o redesign não tem diálogo aqui. */
export function AnswerResult({ correct, answer, explanation, points, weeks, message = 'Volte amanhã para manter sua sequência!', art, onContinue, secondary }: AnswerResultProps) {
  const id = React.useId();
  const mascot = ILLUSTRATIONS[correct ? 'mascote-lata-acerto' : 'mascote-lata-erro'].src;
  return (
    <section aria-labelledby={id} className="grid min-h-full grid-rows-[auto_1fr_auto]">
      <header className="grid justify-items-center gap-mini border-b border-border bg-surface-primary px-mini py-mini">
        <span className={cn('rounded-full px-micro py-xnano text-[12px] font-bold uppercase leading-4', correct ? 'bg-feedback-text-positive text-text-inverse' : 'bg-destructive text-destructive-foreground')}>
          {correct ? 'Você acertou!' : 'Não foi dessa vez'}
        </span>
        {typeof art === 'string' || art == null ? (
          <img src={typeof art === 'string' ? art : mascot} alt="" width={200} height={200} className="size-[200px] object-contain" />
        ) : art}
      </header>
      <div className="grid content-start gap-xsmall p-small">
        <div className="grid gap-nano">
          <p className="m-0 text-[14px] font-bold leading-5 tracking-[0.5px] text-text-link">{correct ? 'A resposta certa é' : 'A resposta certa era'}</p>
          <h2 id={id} className="m-0 text-[18px] font-bold leading-[22px] text-foreground">{answer}</h2>
        </div>
        <div className="grid gap-nano">
          <h3 className="m-0 text-[14px] font-bold leading-5 tracking-[0.5px] text-muted-foreground">Por quê?</h3>
          <p className="m-0 text-[14px] leading-5 text-muted-foreground">{explanation}</p>
        </div>
        {correct ? (
          <div className="grid gap-nano">
            <h3 className="m-0 text-[14px] font-bold leading-5 tracking-[0.5px] text-muted-foreground">Pontos ganhos</h3>
            <p className="m-0 text-[14px] leading-5 text-muted-foreground">{message}</p>
            <div className="mt-xnano flex flex-wrap items-center justify-center gap-nano">
              {weeks != null && (
                <span className={cn(PILL, 'bg-feedback-fill-positive font-bold text-feedback-text-positive')}>
                  <Icon name="circle-check" className="size-[14px]" />{weeks} {wk(weeks)} {weeks === 1 ? 'seguida' : 'seguidas'}
                </span>
              )}
              {points != null && (
                <span className={cn(PILL, 'border border-border-highlight bg-surface-accent font-extrabold text-text-link')}>
                  <Icon name="star" className="size-[14px]" />+{fmt(points)} pontos
                </span>
              )}
            </div>
          </div>
        ) : (
          <p className="m-0 text-[14px] leading-5 text-muted-foreground">Continue aprendendo para subir de nível.</p>
        )}
      </div>
      <footer className="grid justify-items-center gap-micro px-small pb-small pt-large">
        <Button fullWidth onClick={onContinue}>Continuar</Button>
        {secondary && (secondary.href
          ? <a href={secondary.href} className="inline-flex min-h-touch items-center text-[14px] font-semibold leading-5 text-text-link underline">{secondary.label}</a>
          : <button type="button" onClick={secondary.onClick} className="inline-flex min-h-touch items-center text-[14px] font-semibold leading-5 text-text-link underline">{secondary.label}</button>)}
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
/** Estado do Quiz depois de responder (Tela 3): check verde, mensagem e "Próxima pergunta em 14h 15m". */
export function DailyDone({ title = 'Tarefa cumprida!', children = 'Você já respondeu hoje! Volte amanhã para continuar.', countdown, className }: DailyDoneProps) {
  return (
    <section role="status" className={cn('grid justify-items-center gap-micro rounded-lg border border-border bg-surface-primary p-mini text-center', className)}>
      <span aria-hidden className="grid size-[48px] place-items-center rounded-full bg-feedback-fill-positive text-feedback-text-positive"><Icon name="check" size="medium" /></span>
      <div className="grid gap-xnano">
        <h2 className="m-0 text-[16px] font-bold leading-5 text-foreground">{title}</h2>
        <p className="m-0 text-[14px] leading-5 text-muted-foreground">{children}</p>
      </div>
      {countdown && <span className="rounded-sm bg-surface-secondary px-micro py-[6px] text-[12px] font-semibold leading-[15px] text-muted-foreground">Próxima pergunta em {countdown}</span>}
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
/** Topo do Histórico (Tela 4): troféu de 96px com etiqueta do nível, total de respostas e data da última. */
export function HistorySummary({ tier, since, total, last, src }: HistorySummaryProps) {
  return (
    <div className="grid gap-nano">
      <div className="flex items-center gap-mini rounded-lg bg-surface-secondary p-mini">
        <Trophy tier={tier} src={src} />
        <div className="grid justify-items-start gap-[2px]">
          <LevelBadge tier={tier} />
          {since && <p className="m-0 text-[12px] leading-4 text-muted-foreground">Avançou de nível em {since}</p>}
        </div>
      </div>
      <dl className="m-0 grid grid-cols-2 gap-nano">
        {[['Total de respostas', String(total)], ['Última resposta', last]].map(([k, v]) => (
          <div key={k} className="grid gap-xnano rounded-md bg-surface-secondary p-[10px]">
            <dt className="text-[12px] leading-4 text-muted-foreground">{k}</dt>
            <dd className="m-0 text-[16px] font-bold leading-[19px] text-foreground">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export interface AnswerHistoryProps {
  /** Mês exibido ("Agosto 2026"). */
  month: string;
  /** Título da lista. Padrão: "Histórico de respostas". */
  title?: string;
  onPrev?: () => void;
  onNext?: () => void;
  children: React.ReactNode;
}
/** Título, paginador de mês e lista de respostas (Tela 4). Filhos: AnswerHistoryRow. */
export function AnswerHistory({ month, title = 'Histórico de respostas', onPrev, onNext, children }: AnswerHistoryProps) {
  return (
    <section aria-label={title} className="grid gap-micro">
      <h2 className="m-0 text-[14px] font-bold leading-[17px] text-foreground">{title}</h2>
      <div className="flex items-center justify-between rounded-md border border-border bg-surface-primary px-micro py-nano">
        <IconButton icon="chevron-left" label="Mês anterior" onClick={onPrev} disabled={!onPrev} className="rounded-full bg-surface-secondary" />
        <p className="m-0 text-[14px] font-bold leading-[17px] text-foreground" aria-live="polite">{month}</p>
        <IconButton icon="chevron-right" label="Próximo mês" onClick={onNext} disabled={!onNext} className="rounded-full bg-surface-secondary" />
      </div>
      <ul className="m-0 grid list-none overflow-hidden rounded-md border border-border p-0">{children}</ul>
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
/** Uma resposta do histórico: data, pergunta em uma linha e o resultado (+15 verde, "Sequência mantida" creme ou 0 cinza). */
export function AnswerHistoryRow({ date, question, result }: AnswerHistoryRowProps) {
  return (
    <li className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-micro border-b border-border bg-surface-primary p-micro last:border-b-0">
      <div className="grid min-w-0 gap-xnano">
        <p className="m-0 text-[14px] font-semibold leading-5 text-foreground">{date}</p>
        <p className="m-0 truncate text-[14px] leading-5 text-muted-foreground">{question}</p>
      </div>
      {result.kind === 'points' && <span className="inline-flex items-center rounded-full bg-feedback-fill-positive px-[10px] py-xnano text-[12px] font-bold leading-[15px] text-feedback-text-positive">+{result.points}<span className="sr-only"> pontos</span></span>}
      {result.kind === 'kept' && <span className="inline-flex items-center gap-[3px] rounded-full bg-surface-accent px-[10px] py-xnano text-[12px] font-bold leading-[15px] text-text-link"><Icon name="shield" className="size-[12px]" />Sequência mantida</span>}
      {result.kind === 'zero' && <span className="inline-flex items-center rounded-full bg-surface-secondary px-[10px] py-xnano text-[12px] font-bold leading-[15px] text-muted-foreground">0<span className="sr-only"> pontos</span></span>}
    </li>
  );
}

/* ------------------------------------------------------- MilestoneResult */

/** Marcos em blocos, espaçados por igual (Telas 7 e 8): feito = 16px laranja com check, atual = o mesmo com anel de 22px, futuro = 10px cinza. */
function MilestoneBlocks({ weeks, milestones }: { weeks: number; milestones: number[] }) {
  const n = milestones.length;
  const current = milestones.reduce((acc, m, i) => (weeks >= m ? i : acc), -1);
  const at = (i: number) => `calc(14px + (100% - 28px) * ${n > 1 ? i / (n - 1) : 0})`;
  return (
    <div role="img" aria-label={`Marcos da sequência. Você está na semana ${weeks} de ${milestones[n - 1]}.`} className="relative h-[44px]">
      <span aria-hidden className="absolute inset-x-[14px] top-[11px] h-[2px] bg-surface-track" />
      {milestones.map((m, i) => {
        const done = i <= current;
        return (
          <React.Fragment key={m}>
            <span aria-hidden className="absolute top-[12px] grid -translate-x-1/2 -translate-y-1/2 place-items-center" style={{ left: at(i) }}>
              {i === current && <span className="absolute size-[22px] rounded-full border-2 border-border-highlight bg-background" />}
              <span className={cn('relative grid place-items-center rounded-full', done ? 'size-[16px] bg-selected-indicator text-text-on-loud' : 'size-[10px] bg-text-secondary')}>
                {done && <svg viewBox="0 0 12 12" className="size-[9px]" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 6.5l2.2 2.2 4.8-5" /></svg>}
              </span>
            </span>
            <span aria-hidden className="absolute top-[30px] -translate-x-1/2 whitespace-nowrap text-[12px] font-semibold leading-4 text-muted-foreground" style={{ left: `min(calc(100% - ${String(m).length > 1 ? 18 : 15}px), max(${String(m).length > 1 ? 18 : 15}px, ${at(i)}))` }}>{m} sem</span>
          </React.Fragment>
        );
      })}
    </div>
  );
}

export interface MilestoneResultProps {
  /** Semanas seguidas completadas (1, 5, 10, 20). */
  weeks: number;
  /** Bônus do marco. */
  points: number;
  /** Próximo marco. Gera o texto: na 1ª semana "Continue assim. Na 5ª semana seguida você ganha 500 pontos.", depois "Próximo prêmio: 1.000 pontos na 10ª semana.". */
  nextReward?: { week: number; points: number };
  /** Texto de apoio, no lugar do gerado. */
  message?: string;
  milestones?: number[];
  /** Troca a arte de conquista do Figma por outra imagem. */
  art?: string | React.ReactNode;
  onContinue?: () => void;
}
/** Conquista de marco da sequência (Telas 7 e 8): arte do troféu com quatro estrelas, "+100 pontos", título e os marcos em blocos. */
export function MilestoneResult({ weeks, points, nextReward, message, milestones = [1, 5, 10, 20], art, onContinue }: MilestoneResultProps) {
  const id = React.useId();
  const text = message ?? (nextReward
    ? weeks <= milestones[0]
      ? `Continue assim. Na ${nextReward.week}ª semana seguida você ganha ${fmt(nextReward.points)} pontos.`
      : `Próximo prêmio: ${fmt(nextReward.points)} pontos na ${nextReward.week}ª semana.`
    : 'Continue assim para manter sua sequência.');
  return (
    <section aria-labelledby={id} className="grid min-h-full grid-rows-[auto_1fr_auto]">
      <header className="grid justify-items-center gap-mini border-b border-border bg-surface-primary p-small">
        {typeof art === 'string' || art == null ? (
          <img src={typeof art === 'string' ? art : ILLUSTRATIONS['conquista-bronze-148'].src} alt="" width={148} height={148} className="size-[148px] object-contain" />
        ) : art}
        <p className="m-0 text-[32px] font-extrabold leading-10 text-text-link">+{fmt(points)} pontos</p>
      </header>
      <div className="grid content-start gap-xsmall p-small">
        <h2 id={id} className="m-0 text-[18px] font-bold leading-[22px] text-foreground">Você completou {weeks} {wk(weeks)} {weeks === 1 ? 'seguida' : 'seguidas'}!</h2>
        <p className="m-0 text-[14px] leading-5 text-muted-foreground">{text}</p>
        <MilestoneBlocks weeks={weeks} milestones={milestones} />
      </div>
      <footer className="px-small pb-small pt-large"><Button fullWidth onClick={onContinue}>Continuar</Button></footer>
    </section>
  );
}
