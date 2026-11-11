/* So+ma · Home e missão: Tile, TileGrid, BalanceCard, MissionBanner, StepChecklist. */
import * as React from 'react';
import { cn, fmt } from '../lib/utils';
import { Icon, type IconName } from '../ui/icon';
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
}
export function BalanceCard({ points, hint, href, onPress }: BalanceCardProps) {
  const text = hint ?? (points === 0 ? 'Faça sua primeira entrega e comece a pontuar' : undefined);
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

export interface MissionBannerProps { title: string; total: number; done: number }
/** Some sozinho quando a missão termina. */
export function MissionBanner({ title, total, done }: MissionBannerProps) {
  if (done >= total) return null;
  return (
    <section aria-label={title} className="grid grid-cols-[auto_1fr] items-center gap-x-micro gap-y-nano rounded-lg bg-surface-inverse p-mini text-text-inverse">
      <Icon name="star" tone="brand" />
      <p className="label m-0">{title}</p>
      <p className="caption col-start-2 m-0">{done} de {total} etapas completas</p>
      <div aria-hidden className="col-span-2 mt-xnano grid auto-cols-fr grid-flow-col gap-xnano">
        {Array.from({ length: total }, (_, i) => (
          <i key={i} className={cn('block h-xnano rounded-full', i < done ? 'bg-selected-indicator' : 'bg-text-secondary')} />
        ))}
      </div>
    </section>
  );
}

export interface StepChecklistProps { steps: Array<{ label: string; status: 'done' | 'current' | 'todo' }> }
export function StepChecklist({ steps }: StepChecklistProps) {
  return (
    <ol className="m-0 grid list-none p-0">
      {steps.map((s, i) => (
        <li
          key={i}
          aria-current={s.status === 'current' ? 'step' : undefined}
          className={cn('grid min-h-touch grid-cols-[auto_1fr] items-center gap-micro', s.status === 'todo' ? 'text-muted-foreground' : 'text-foreground')}
        >
          <span
            className={cn(
              'grid size-[28px] place-items-center rounded-full border-[1.5px] text-[13px] font-semibold',
              s.status === 'done' && 'border-transparent bg-feedback-fill-positive text-feedback-text-positive',
              s.status === 'current' && 'border-primary bg-primary text-primary-foreground',
              s.status === 'todo' && 'border-input text-muted-foreground',
            )}
          >
            {s.status === 'done' ? <Icon name="check" size="small" /> : i + 1}
          </span>
          <span className={cn('body', s.status === 'current' && 'font-semibold')}>
            {s.label}
            <span className="sr-only">{s.status === 'done' ? ' (concluída)' : s.status === 'current' ? ' (etapa atual)' : ' (pendente)'}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}
