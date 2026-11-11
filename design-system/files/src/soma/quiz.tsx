/* So+ma · quiz: Medal, LevelCard, QuestionCard, LevelList, LevelBadge, PointsBadge, StreakTrail, StreakProgress. */
import * as React from 'react';
import { cn } from '../lib/utils';
import { Icon } from '../ui/icon';
import { Button, IconButton } from '../ui/button';
import { Card, Progress } from '../ui/display';
import { RadioGroup, RadioGroupItem } from '../ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/overlay';

export type Tier = 'ferro' | 'bronze' | 'prata' | 'ouro' | 'platina';
export const TIER_NAME: Record<Tier, string> = { ferro: 'Ferro', bronze: 'Bronze', prata: 'Prata', ouro: 'Ouro', platina: 'Platina' };

export interface MedalProps { tier: Tier; className?: string }
/** Hoje o app usa a mesma arte para todos os níveis; o nível vai no rótulo acessível. */
export function Medal({ tier, className }: MedalProps) {
  return (
    <span role="img" aria-label={`Medalha ${TIER_NAME[tier]}`} className={cn('grid size-medal shrink-0 place-items-center rounded-full bg-surface-inverse text-text-inverse', className)}>
      <Icon name="medal" />
    </span>
  );
}

export interface LevelCardProps {
  tier: Tier;
  /** 0 a 100. Atualize assim que o modal de acerto fechar. */
  percent: number;
  remaining: number;
  onSeeLevels?: () => void;
}
export function LevelCard({ tier, percent, remaining, onSeeLevels }: LevelCardProps) {
  const p = Math.max(0, Math.min(100, Math.round(percent)));
  return (
    <Card aria-label={`Nível ${TIER_NAME[tier]}`} className="grid-cols-[auto_1fr_auto] items-center gap-x-micro" role="group">
      <Medal tier={tier} />
      <div className="grid min-w-0 gap-nano">
        <p className="label m-0">Nível {TIER_NAME[tier]}</p>
        <Progress value={p} label="Progresso no nível" />
        <p className="caption m-0 text-muted-foreground">
          {remaining === 1 ? 'Falta 1 pergunta para o próximo nível' : `Faltam ${remaining} perguntas para o próximo nível`}
        </p>
      </div>
      <span className="label self-start">{p}%</span>
      {onSeeLevels && <span className="col-span-3 justify-self-end"><Button hierarchy="transparent" onClick={onSeeLevels}>Ver níveis</Button></span>}
    </Card>
  );
}

export interface QuestionCardProps {
  /** open = pergunta para responder · answered = já respondeu hoje. */
  state: 'open' | 'answered';
  /** atual = card com borda de destaque, selo de pontos e opções em linha (Figma novo) · anterior = app em produção. Padrão "atual". */
  version?: 'atual' | 'anterior';
  /** Pontos que o acerto vale; aparece como PointsBadge na versão atual. */
  points?: number;
  question?: string;
  options?: string[];
  value?: string;
  onChange?: (v: string) => void;
  onSubmit?: () => void;
  /** Texto do popover do (i). Sem ele, o (i) não aparece. */
  info?: string;
  submitting?: boolean;
  answeredMessage?: string;
}
export function QuestionCard({
  state, version = 'atual', points, question, options = [], value, onChange, onSubmit, info, submitting,
  answeredMessage = 'Você já respondeu a pergunta do dia. Volte amanhã para responder a próxima e avançar de nível!',
}: QuestionCardProps) {
  const qid = React.useId();
  const now = version === 'atual';
  return (
    <Card aria-labelledby={qid} role="group" className={cn(now && 'border-[1.5px] border-border-highlight')}>
      <div className={cn('flex items-center gap-xnano', now ? 'text-text-link' : 'border-b border-dashed border-border pb-xnano text-muted-foreground')}>
        <span id={qid} className={cn('eyebrow', now && 'uppercase tracking-wide')}>Pergunta do dia</span>
        {info && (
          <Popover>
            <PopoverTrigger asChild><IconButton icon="info" label="Como funciona o quiz" className="-my-micro" /></PopoverTrigger>
            <PopoverContent aria-label="Como funciona o quiz">{info}</PopoverContent>
          </Popover>
        )}
        {now && points != null && <PointsBadge points={points} className="ml-auto" />}
      </div>
      {state === 'answered' ? (
        <div className="grid grid-cols-[auto_1fr] items-center gap-micro">
          <Icon name="clock" tone="brand-strong" />
          <p className="body m-0">{answeredMessage}</p>
        </div>
      ) : (
        <>
          <p className="body-strong m-0" id={`${qid}-q`}>{question}</p>
          <RadioGroup value={value} onValueChange={onChange} aria-labelledby={`${qid}-q`}>
            {options.map((o, i) => (
              <label
                key={o}
                className={cn(
                  'flex min-h-touch cursor-pointer items-center gap-nano rounded-sm bg-surface-primary px-micro py-nano text-foreground transition-colors hover:bg-interactive-fill-quiet-hover has-[[data-state=checked]]:bg-surface-accent',
                  now
                    ? 'body-small border-[1.5px] border-input has-[[data-state=checked]]:border-border-highlight'
                    : 'body border-[1.5px] border-interactive-border-quiet has-[[data-state=checked]]:border-2',
                )}
              >
                <RadioGroupItem value={o} id={`${qid}-${i}`} />
                {o}
              </label>
            ))}
          </RadioGroup>
          <Button fullWidth disabled={!value} loading={submitting} onClick={onSubmit}>Enviar resposta</Button>
        </>
      )}
    </Card>
  );
}

export interface LevelListProps { levels: Array<{ tier: Tier; description: string }> }
export function LevelList({ levels }: LevelListProps) {
  return (
    <ul className="m-0 grid list-none p-0">
      {levels.map((l) => (
        <li key={l.tier} className="grid grid-cols-[auto_1fr] gap-micro border-b border-border py-mini last:border-b-0">
          <Medal tier={l.tier} />
          <div className="grid gap-xnano">
            <p className="label m-0">{TIER_NAME[l.tier]}</p>
            <p className="caption m-0 text-muted-foreground">{l.description}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------ LevelBadge */

const TIER_FILL: Record<Tier, string> = {
  ferro: 'bg-surface-secondary text-foreground',
  bronze: 'bg-award-bronze text-text-inverse',
  prata: 'bg-award-silver text-foreground',
  ouro: 'bg-award-gold text-foreground',
  platina: 'bg-surface-inverse text-text-inverse',
};
export interface LevelBadgeProps { tier: Tier; className?: string }
/** Selo do nível em maiúsculas ("BRONZE"), ao lado do selo ilustrado ou do nome. */
export function LevelBadge({ tier, className }: LevelBadgeProps) {
  return (
    <span className={cn('inline-flex min-h-small items-center rounded-xs px-nano font-sans text-[12px] font-semibold uppercase leading-4 tracking-wide', TIER_FILL[tier], className)}>
      {TIER_NAME[tier]}
    </span>
  );
}

/* ----------------------------------------------------------- PointsBadge */

export interface PointsBadgeProps {
  points: number;
  /** gain = "+15 pontos" (o que vale) · cost = "1.200 pontos" (o que custa) · balance = saldo. */
  kind?: 'gain' | 'cost';
  className?: string;
}
/** Pílula de pontos em creme com texto text-link. Número no padrão brasileiro. */
export function PointsBadge({ points, kind = 'gain', className }: PointsBadgeProps) {
  return (
    <span className={cn('inline-flex min-h-small items-center gap-xnano whitespace-nowrap rounded-full bg-surface-accent px-nano font-sans text-[12px] font-semibold leading-4 text-text-link', className)}>
      {kind === 'gain' && '+'}{points.toLocaleString('pt-BR')} {points === 1 ? 'ponto' : 'pontos'}
    </span>
  );
}

/* ----------------------------------------------------------- StreakTrail */

export type StreakDayState = 'done' | 'protected' | 'today' | 'missed' | 'future';
export interface StreakTrailProps {
  /** Sete dias, na ordem da semana. */
  days: Array<{ label: string; state: StreakDayState }>;
  className?: string;
}
const DAY_NAME: Record<StreakDayState, string> = { done: 'respondido', protected: 'protegido', today: 'hoje', missed: 'perdido', future: 'ainda não chegou' };
/** Trilha da semana do quiz: feito (check), protegido (escudo), hoje (anel de destaque), perdido e futuro. */
export function StreakTrail({ days, className }: StreakTrailProps) {
  return (
    <ol aria-label="Sua semana no quiz" className={cn('m-0 grid list-none grid-cols-7 gap-xnano p-0', className)}>
      {days.map((d, i) => (
        <li key={i} className="grid justify-items-center gap-xnano">
          <span
            aria-hidden
            className={cn(
              'grid size-[36px] place-items-center rounded-full',
              d.state === 'done' && 'bg-feedback-fill-positive text-feedback-text-positive',
              d.state === 'protected' && 'bg-surface-info text-icon-info',
              d.state === 'today' && 'border-[3px] border-border-highlight bg-surface-track',
              d.state === 'missed' && 'bg-feedback-fill-negative text-feedback-text-negative',
              d.state === 'future' && 'bg-surface-track',
            )}
          >
            {d.state === 'done' && <Icon name="check" size="small" />}
            {d.state === 'protected' && <Icon name="shield" size="small" />}
            {d.state === 'missed' && <Icon name="close" size="small" />}
          </span>
          <span className={cn('caption', d.state === 'today' ? 'font-semibold text-foreground' : 'text-muted-foreground')}>
            {d.label}<span className="sr-only">: {DAY_NAME[d.state]}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}

/* -------------------------------------------------------- StreakProgress */

export interface StreakProgressProps {
  /** Dias seguidos até agora. */
  days: number;
  /** Marcos com recompensa, em dias (ex.: [3, 7, 14]). O último é o fim da barra. */
  milestones: number[];
  className?: string;
}
/** Barra da sequência com marcos. Trilho surface-track de 8px, preenchimento selected-indicator. */
export function StreakProgress({ days, milestones, className }: StreakProgressProps) {
  const max = Math.max(...milestones);
  const next = milestones.find((m) => m > days);
  return (
    <div className={cn('grid gap-nano', className)}>
      <div className="flex items-baseline justify-between gap-nano">
        <p className="label m-0 flex items-center gap-xnano"><Icon name="flame" size="small" tone="brand-strong" />{days} {days === 1 ? 'dia seguido' : 'dias seguidos'}</p>
        {next != null && <p className="caption m-0 text-muted-foreground">Próximo marco: {next} dias</p>}
      </div>
      <div className="relative">
        <Progress value={(days / max) * 100} label="Progresso da sequência" className="bg-surface-track" />
        {milestones.map((m) => (
          <span key={m} aria-hidden className={cn('absolute top-1/2 size-micro -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-surface-primary', m <= days ? 'bg-selected-indicator' : 'bg-surface-track')} style={{ left: `${(m / max) * 100}%` }} />
        ))}
      </div>
      <div className="relative h-small">
        {milestones.map((m) => (
          <span key={m} className="caption absolute -translate-x-1/2 text-muted-foreground" style={{ left: `min(calc(100% - 12px), max(12px, ${(m / max) * 100}%))` }}>{m}</span>
        ))}
      </div>
    </div>
  );
}
