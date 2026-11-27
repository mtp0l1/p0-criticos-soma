/* So+ma · quiz (redesign): Trophy, LevelCard, LevelBadge, TierCard, ProtectionNotice, QuestionCard, PointsBadge,
   StreakTrail, StreakProgress, StreakSection, AnswerResult, DailyDone, HistorySummary, AnswerHistory, AnswerHistoryRow, MilestoneResult.
   Medidas, cores e textos conferidos nas telas NOVO do Quiz do Figma (Telas 1 a 8). Os níveis são troféus ilustrados, não medalhas. */
import * as React from 'react';
import { cn, fmt } from '../lib/utils';
import { Icon } from '../ui/icon';
import { Button, IconButton } from '../ui/button';
import { Card, Progress } from '../ui/display';
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
  bronze: 'bg-primary font-bold text-primary-foreground',
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
    <span className={cn('inline-flex items-center rounded-full px-nano py-[2px] font-sans text-[11px] uppercase leading-4 tracking-[0.5px]', TIER_FILL[tier], className)}>
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
  const goal = next ? TIER_GOAL[next] : 0;
  const pct = next ? Math.max(0, Math.min(100, ((goal - remaining) / goal) * 100)) : 100;
  return (
    <div role="group" aria-label={`Nível ${TIER_NAME[tier]}`} className={cn('grid gap-micro rounded-lg bg-surface-inverse p-mini text-text-inverse shadow-dark', className)}>
      <div className="flex items-center gap-micro">
        <span className="grid size-[72px] shrink-0 place-items-center rounded-full bg-surface-tint-peach"><Trophy tier={tier} src={src} className="size-[64px]" /></span>
        <div className="grid justify-items-start gap-xnano">
          <LevelBadge tier={tier} />
          <p className="body-small m-0 font-semibold">
            {next ? `${remaining === 1 ? 'Falta 1 pergunta' : `Faltam ${remaining} perguntas`} para ${TIER_NAME[next]}` : 'Você chegou ao nível mais alto'}
          </p>
        </div>
      </div>
      <Progress value={pct} label="Progresso para o próximo nível" />
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
    <li aria-current={current ? 'true' : undefined} className={cn('grid list-none grid-cols-[auto_1fr] items-center gap-mini rounded-lg border-[1.5px] p-micro', current ? 'border-border-highlight bg-surface-accent' : 'border-transparent bg-card shadow-card')}>
      <span className="grid size-[56px] place-items-center rounded-full bg-surface-tint-peach"><Trophy tier={tier} src={src} className="size-[48px]" /></span>
      <div className="grid gap-xnano">
        <div className="flex flex-wrap items-center gap-nano">
          <p className="m-0 text-[18px] font-bold leading-6 text-foreground">{TIER_NAME[tier]}</p>
          <span className={cn('rounded-full px-nano py-[2px] text-[11px] font-bold leading-4', current ? 'bg-primary text-primary-foreground' : 'bg-surface-secondary text-foreground')}>{TIER_LEVEL[tier]}</span>
        </div>
        <p className="m-0 text-[13px] leading-5 text-muted-foreground">Responda {questions} perguntas</p>
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
      <p className="caption m-0 flex items-center gap-nano rounded-full bg-surface-info px-micro py-nano font-medium text-foreground">
        <Icon name="shield" tone="info" size="small" />{children}
      </p>
    );
  }
  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-micro rounded-md bg-surface-info p-micro text-foreground">
      <span aria-hidden className="grid size-[32px] place-items-center rounded-full bg-surface-primary text-icon-info"><Icon name="shield" size="small" /></span>
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
    <div aria-labelledby={qid} role="group" className="grid gap-micro rounded-lg border-[1.5px] border-border-highlight bg-surface-accent p-mini text-foreground">
      <div className="flex items-center gap-xnano text-text-link">
        <span id={qid} className="eyebrow uppercase tracking-wide">Pergunta do dia</span>
        {info && (
          <Popover>
            <PopoverTrigger asChild><IconButton icon="info" label="Como funciona o quiz" className="-my-micro" /></PopoverTrigger>
            <PopoverContent aria-label="Como funciona o quiz">{info}</PopoverContent>
          </Popover>
        )}
        {points != null && <span className="ml-auto whitespace-nowrap rounded-full bg-primary px-micro py-[2px] text-[12px] font-bold leading-4 text-primary-foreground">+{fmt(points)} pontos</span>}
      </div>
      <p className="m-0 text-[18px] font-bold leading-6" id={`${qid}-q`}>{question}</p>
      <RadioGroup value={value} onValueChange={onChange} aria-labelledby={`${qid}-q`} className="gap-nano">
        {options.map((o, i) => {
          const on = value === o;
          return (
            <label
              key={o}
              className="flex min-h-button cursor-pointer items-center gap-micro rounded-md border-[1.5px] border-transparent bg-surface-primary px-micro py-nano text-[14px] leading-5 transition-colors hover:bg-interactive-fill-quiet-hover has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring has-[[data-state=checked]]:border-border-highlight has-[[data-state=checked]]:font-semibold"
            >
              <RadioGroupItem value={o} id={`${qid}-${i}`} className="!sr-only" />
              <span aria-hidden className={cn('grid size-[22px] shrink-0 place-items-center rounded-full border-2', on ? 'border-primary bg-primary text-primary-foreground' : 'border-icon-secondary')}>{on && <Icon name="check" size="small" />}</span>
              {String.fromCharCode(97 + i)}) {o}
            </label>
          );
        })}
      </RadioGroup>
      <Button fullWidth disabled={!value} loading={submitting} onClick={onSubmit}>Enviar resposta</Button>
    </div>
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
    <ol aria-label="Sua semana no quiz" className={cn('m-0 flex list-none justify-between p-0 py-xnano', className)}>
      {days.map((d, i) => {
        const open = d.state === 'today';
        return (
          <li key={i} className="grid w-[36px] justify-items-center gap-xnano">
            <span
              aria-hidden
              className={cn(
                'grid size-[32px] place-items-center rounded-full',
                d.state === 'done' && 'bg-primary text-primary-foreground',
                d.state === 'protected' && 'bg-surface-info text-icon-info',
                d.state === 'missed' && 'bg-feedback-fill-negative text-feedback-text-negative',
                d.state === 'future' && 'bg-surface-secondary',
                open && 'border-2 border-border-highlight bg-surface-primary',
              )}
            >
              {d.state === 'done' && <Icon name="check" size="small" />}
              {d.state === 'protected' && <Icon name="shield" size="small" />}
              {d.state === 'missed' && <Icon name="close" size="small" />}
            </span>
            <span className={cn('text-[12px] leading-4', open || d.today ? 'font-bold text-foreground' : 'text-muted-foreground')}>
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
  const next = milestones.find((m) => m > weeks) ?? max;
  const pct = Math.min(100, (weeks / next) * 100);
  return (
    <div className={cn('grid gap-nano', className)}>
      {!hideLabel && <p className="body-small m-0 flex items-center gap-xnano font-bold text-foreground"><Icon name="flame" size="small" className="text-text-link" />Sequência: {weeks} {wk(weeks)}</p>}
      <div className="relative h-[8px] overflow-hidden rounded-full bg-surface-track" role="progressbar" aria-label="Progresso da sequência" aria-valuemin={0} aria-valuemax={next} aria-valuenow={Math.min(weeks, next)} aria-valuetext={`${weeks} ${wk(weeks)} seguidas`}>
        <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
      </div>
      <p aria-hidden className="caption m-0 flex justify-between text-muted-foreground"><span>Agora: {weeks} {wk(weeks)}</span><span>{next} semanas</span></p>
      {nextReward && <p className="caption m-0 text-muted-foreground">{nextReward.inWeeks === 1 ? 'Falta 1 semana' : `Faltam ${nextReward.inWeeks} semanas`} para ganhar {fmt(nextReward.points)} pontos.</p>}
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
  const id = React.useId();
  return (
    <section aria-labelledby={id} className={cn('grid gap-nano rounded-lg bg-card p-mini text-card-foreground shadow-card', className)}>
      <div className="flex items-center justify-between gap-nano">
        <h2 id={id} className="body-strong m-0">Sua trilha</h2>
        {onHistory && (
          <button type="button" onClick={onHistory} className="caption inline-flex min-h-touch items-center gap-[2px] border-0 bg-transparent font-bold text-text-link">Ver histórico<Icon name="chevron-right" size="small" /></button>
        )}
      </div>
      <StreakTrail days={days} />
      {protection && <ProtectionNotice>{protection}</ProtectionNotice>}
      <StreakProgress weeks={weeks} nextReward={nextReward} />
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
    <section aria-labelledby={id} className="flex min-h-full flex-col bg-background text-foreground">
      <header className={cn('relative grid justify-items-center gap-mini overflow-hidden px-small pb-[48px] pt-small', correct ? 'bg-primary' : 'bg-surface-inverse')}>
        <span aria-hidden className="absolute -right-[64px] -top-[72px] size-[240px] rounded-full bg-surface-primary/[.12]" />
        <span className={cn('eyebrow relative inline-flex items-center gap-xnano rounded-full px-micro py-[6px] uppercase', correct ? 'bg-surface-inverse text-text-inverse' : 'bg-surface-primary/[.16] text-text-inverse')}>
          <Icon name={correct ? 'check' : 'close'} size="small" className="text-icon-brand" />{correct ? 'Você acertou!' : 'Não foi dessa vez'}
        </span>
        {typeof art === 'string' || art == null ? (
          <span className="relative grid size-[128px] place-items-center rounded-full bg-surface-primary shadow-card"><img src={typeof art === 'string' ? art : mascot} alt="" width={112} height={112} className="size-[112px] object-contain" /></span>
        ) : art}
      </header>
      <div className="relative -mt-small flex flex-1 flex-col gap-micro rounded-t-xl bg-background px-xsmall pb-small pt-small">
        <div className="grid gap-xnano">
          <p className="body-small m-0 text-muted-foreground">{correct ? 'A resposta certa é' : 'A resposta certa era'}</p>
          <h2 id={id} className="screen-title m-0">{answer}</h2>
        </div>
        <div className="grid gap-xnano rounded-lg bg-card p-micro shadow-card">
          <h3 className="body-strong m-0 flex items-center gap-nano"><Icon name="lightbulb" size="small" className="text-text-link" />Por quê?</h3>
          <p className="body-small m-0 text-muted-foreground">{explanation}</p>
        </div>
        {correct ? (
          <>
            <div className="flex flex-wrap items-center gap-nano">
              {weeks != null && (
                <span className={cn(PILL, 'bg-surface-tint-peach font-bold text-text-link')}>
                  <Icon name="flame" className="size-[14px]" />{weeks} {wk(weeks)} {weeks === 1 ? 'seguida' : 'seguidas'}
                </span>
              )}
              {points != null && (
                <span className={cn(PILL, 'bg-primary font-bold text-primary-foreground')}>
                  <Icon name="star" className="size-[14px]" />+{fmt(points)} pontos
                </span>
              )}
            </div>
            <p className="body-small m-0 text-muted-foreground">{message}</p>
          </>
        ) : (
          <p className="body-small m-0 text-muted-foreground">Continue aprendendo para subir de nível.</p>
        )}
        <footer className="mt-auto grid gap-nano pt-small">
          <Button fullWidth onClick={onContinue}>Continuar</Button>
          {secondary && (secondary.href
            ? <a href={secondary.href} className="body-small inline-flex min-h-button items-center justify-center rounded-full bg-surface-secondary px-small text-center font-bold text-foreground">{secondary.label}</a>
            : <button type="button" onClick={secondary.onClick} className="body-small min-h-button rounded-full border-0 bg-surface-secondary px-small font-bold text-foreground">{secondary.label}</button>)}
        </footer>
      </div>
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
    <section role="status" className={cn('grid gap-nano rounded-lg bg-feedback-fill-positive p-mini text-foreground', className)}>
      <div className="flex items-center gap-micro">
        <span aria-hidden className="grid size-[40px] shrink-0 place-items-center rounded-full bg-feedback-text-positive text-text-inverse"><Icon name="check" size="medium" /></span>
        <h2 className="m-0 text-[18px] font-bold leading-6 text-feedback-text-positive">{title}</h2>
      </div>
      <p className="body-small m-0">{children}</p>
      {countdown && <span className="caption inline-flex items-center gap-xnano justify-self-start rounded-full bg-surface-primary px-micro py-[6px] font-bold"><Icon name="clock" size="small" className="text-feedback-text-positive" />Próxima pergunta em {countdown}</span>}
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
    <div className="grid gap-nano text-foreground">
      <div className="flex items-center gap-micro rounded-lg bg-surface-inverse p-micro text-text-inverse shadow-dark">
        <span className="grid size-[56px] shrink-0 place-items-center rounded-full bg-surface-tint-peach"><Trophy tier={tier} src={src} className="size-[48px]" /></span>
        <div className="grid justify-items-start gap-xnano">
          <LevelBadge tier={tier} />
          {since && <p className="caption m-0">Avançou de nível em {since}</p>}
        </div>
      </div>
      <dl className="m-0 grid grid-cols-2 gap-nano">
        {[['Total de respostas', String(total)], ['Última resposta', last]].map(([k, v]) => (
          <div key={k} className="grid gap-xnano rounded-lg bg-card p-micro shadow-card">
            <dt className="caption text-muted-foreground">{k}</dt>
            <dd className="m-0 text-[18px] font-bold leading-6">{v}</dd>
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
    <section aria-label={title} className="grid gap-nano text-foreground">
      <h2 className="body-strong m-0">{title}</h2>
      <div className="flex min-h-[24px] items-center justify-between gap-nano">
        <p className="eyebrow m-0 uppercase tracking-wide text-muted-foreground" aria-live="polite">{month}</p>
        {(onPrev || onNext) && (
          <span className="flex gap-xnano">
            <IconButton icon="chevron-left" label="Mês anterior" onClick={onPrev} disabled={!onPrev} />
            <IconButton icon="chevron-right" label="Próximo mês" onClick={onNext} disabled={!onNext} />
          </span>
        )}
      </div>
      <ul className="m-0 grid list-none gap-nano p-0">{children}</ul>
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
  const pill = 'inline-flex items-center gap-[3px] rounded-full px-[10px] py-[2px] text-[12px] font-bold leading-4';
  return (
    <li className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-micro gap-y-xnano rounded-md bg-card p-micro text-card-foreground shadow-card">
      <p className="caption m-0 text-muted-foreground">{date}</p>
      {result.kind === 'points' && <span className={cn(pill, 'bg-feedback-fill-positive text-feedback-text-positive')}>+{result.points}<span className="sr-only"> pontos</span></span>}
      {result.kind === 'kept' && <span className={cn(pill, 'bg-surface-info text-foreground')}><Icon name="shield" className="size-[12px] text-icon-info" />Sequência mantida</span>}
      {result.kind === 'zero' && <span className={cn(pill, 'bg-surface-secondary text-muted-foreground')}>0<span className="sr-only"> pontos</span></span>}
      <p className="body-small col-span-2 m-0 font-semibold">{question}</p>
    </li>
  );
}

/* ------------------------------------------------------- MilestoneResult */

/** Marcos em blocos, espaçados por igual (Telas 7 e 8): feito = 16px laranja com check, atual = o mesmo com anel de 22px, futuro = 10px cinza. */
function MilestoneBlocks({ weeks, milestones }: { weeks: number; milestones: number[] }) {
  const n = milestones.length;
  const current = milestones.reduce((acc, m, i) => (weeks >= m ? i : acc), -1);
  const at = (i: number) => `calc(20px + (100% - 40px) * ${n > 1 ? i / (n - 1) : 0})`;
  return (
    <div className="rounded-lg bg-card px-nano py-micro shadow-card">
      <div role="img" aria-label={`Marcos da sequência. Você está na semana ${weeks} de ${milestones[n - 1]}.`} className="relative h-[48px]">
        <span aria-hidden className="absolute inset-x-[20px] top-[11px] h-[2px] bg-surface-track" />
        {current > 0 && <span aria-hidden className="absolute left-[20px] top-[11px] h-[2px] bg-primary" style={{ width: `calc((100% - 40px) * ${current / (n - 1)})` }} />}
        {milestones.map((m, i) => {
          const done = i <= current;
          return (
            <React.Fragment key={m}>
              <span aria-hidden className={cn('absolute top-0 grid size-[24px] -translate-x-1/2 place-items-center rounded-full', done ? 'bg-primary text-primary-foreground' : 'bg-surface-secondary')} style={{ left: at(i) }}>
                {done && <Icon name="check" size="small" />}
              </span>
              <span aria-hidden className={cn('absolute top-[30px] -translate-x-1/2 whitespace-nowrap text-[12px] leading-4', done ? 'font-bold text-foreground' : 'text-muted-foreground')} style={{ left: at(i) }}>{m} sem</span>
            </React.Fragment>
          );
        })}
      </div>
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
    <section aria-labelledby={id} className="flex min-h-full flex-col bg-background text-foreground">
      <header className="relative grid justify-items-center gap-mini overflow-hidden bg-primary px-small pb-[48px] pt-large text-primary-foreground">
        <span aria-hidden className="absolute -right-[64px] -top-[72px] size-[240px] rounded-full bg-surface-primary/[.14]" />
        {typeof art === 'string' || art == null ? (
          <span className="relative grid size-[112px] place-items-center rounded-full bg-surface-tint-peach shadow-card"><img src={typeof art === 'string' ? art : ILLUSTRATIONS['conquista-bronze-148'].src} alt="" width={96} height={96} className="size-[96px] object-contain" /></span>
        ) : art}
        <p className="relative m-0 text-[32px] font-bold leading-10">+{fmt(points)} pontos</p>
      </header>
      <div className="relative -mt-small flex flex-1 flex-col gap-micro rounded-t-xl bg-background px-xsmall pb-small pt-small">
        <h2 id={id} className="screen-title m-0">Você completou {weeks} {wk(weeks)} {weeks === 1 ? 'seguida' : 'seguidas'}!</h2>
        <p className="body-small m-0 text-muted-foreground">{text}</p>
        <MilestoneBlocks weeks={weeks} milestones={milestones} />
        <footer className="mt-auto grid pt-small"><Button fullWidth hierarchy="dark" onClick={onContinue}>Continuar</Button></footer>
      </div>
    </section>
  );
}
