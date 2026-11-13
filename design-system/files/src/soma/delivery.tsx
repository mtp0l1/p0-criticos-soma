/* So+ma · Ativação e primeira entrega: DeliverySummaryCard, DeliveryHistoryRow, DeliveryDayCard, RewardChoiceList, GoalProgressCard, GoalNote, ReminderCard, ShareImpactModal. */
import * as React from 'react';
import { cn, fmt, focusRing } from '../lib/utils';
import { Icon, type IconName } from '../ui/icon';
import { Button } from '../ui/button';
import { Progress } from '../ui/display';
import { RadioGroup, RadioGroupItem } from '../ui/form';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '../ui/overlay';
import { pressable } from './navigation';

/* ------------------------------------------------------ DeliverySummaryCard */

export interface DeliverySummaryCardProps {
  /** "Segunda, 7 de setembro". */
  date: string;
  /** Nome do espaço de recebimento ("Vila Verde"). */
  space: string;
  /** "Rua das Flores, 120 · 800 m". */
  address?: string;
  /** Abre o mapa. Sem ele, "Como chegar" não aparece. */
  onDirections?: () => void;
  /** "09h". */
  time: string;
  /** Antecedência do lembrete ("1 hora antes"). Só depois de salvar no calendário. */
  notice?: string;
  className?: string;
}
/** Resumo do agendamento (Telas 6, 7, 28 e 29): Quando, Onde, Horário e, depois do calendário, Aviso. Rótulos à esquerda, valores à direita. */
export function DeliverySummaryCard({ date, space, address, onDirections, time, notice, className }: DeliverySummaryCardProps) {
  const row = 'flex items-start justify-between gap-mini';
  const label = 'caption m-0 font-bold text-muted-foreground';
  return (
    <section aria-label="Resumo da entrega" className={cn('grid gap-micro rounded-lg border border-border bg-card p-mini text-card-foreground', className)}>
      <div className={row}><p className={label}>Quando</p><p className="label m-0 text-right">{date}</p></div>
      <hr className="m-0 border-0 border-t border-border" />
      <div className="grid gap-mini">
        <div className={row}>
          <p className={cn(label, 'pt-xnano')}>Onde</p>
          <div className="grid justify-items-end gap-xnano text-right">
            <p className="label m-0">{space}</p>
            {address && <p className="caption m-0 text-muted-foreground">{address}</p>}
            {onDirections && (
              <button type="button" onClick={onDirections} className={cn(pressable, 'caption inline-flex min-h-touch items-center gap-xnano rounded-xs font-bold text-text-link')}>
                <Icon name="pin" size="small" />Como chegar<span className="sr-only"> a {space}</span>
              </button>
            )}
          </div>
        </div>
        <div className={row}><p className={label}>Horário</p><p className="label m-0 text-right">{time}</p></div>
      </div>
      {notice && (
        <>
          <hr className="m-0 border-0 border-t border-border" />
          <div className={row}><p className={label}>Aviso</p><p className="label m-0 text-right">{notice}</p></div>
        </>
      )}
    </section>
  );
}

/* ------------------------------------------------------ DeliveryHistoryRow */

export interface DeliveryHistoryRowProps {
  space: string;
  /** "31 de agosto". */
  date: string;
  /** "Entrega registrada às 09h". */
  status: string;
  className?: string;
}
/** Entrega anterior em Meus agendamentos (Tela 7): espaço e data na primeira linha, situação embaixo. */
export function DeliveryHistoryRow({ space, date, status, className }: DeliveryHistoryRowProps) {
  return (
    <article className={cn('grid gap-nano rounded-md border border-border bg-card p-micro text-card-foreground', className)}>
      <div className="flex items-baseline justify-between gap-nano"><h3 className="label m-0">{space}</h3><p className="caption m-0 text-muted-foreground">{date}</p></div>
      <p className="caption m-0 text-muted-foreground">{status}</p>
    </article>
  );
}

/* --------------------------------------------------------- DeliveryDayCard */

export interface DeliveryDayCardProps {
  /** Padrão: "Hoje é o dia da sua entrega!". */
  title?: string;
  /** "Rua das Flores, 120 · 800 m". */
  address: string;
  /** "Vila Verde recebe até 18h". */
  hours: string;
  className?: string;
}
/** Estado de espera no dia da entrega (Tela 31): relógio, título, endereço e horário do espaço. O "Como chegar" e o "Cheguei ao espaço" ficam fora do card. */
export function DeliveryDayCard({ title = 'Hoje é o dia da sua entrega!', address, hours, className }: DeliveryDayCardProps) {
  return (
    <section aria-label="Entrega de hoje" className={cn('grid justify-items-center gap-mini rounded-xl border border-border bg-card p-medium text-center text-card-foreground', className)}>
      <span aria-hidden className="grid size-[64px] place-items-center rounded-full bg-surface-secondary text-icon-brand-strong"><Icon name="clock" size="large" /></span>
      <div className="grid gap-nano">
        <h2 className="screen-title m-0">{title}</h2>
        <p className="body-small m-0 text-muted-foreground">{address}</p>
        <p className="body-small m-0 text-muted-foreground">{hours}</p>
      </div>
    </section>
  );
}

/* --------------------------------------------------------- RewardChoiceList */

export interface RewardChoice { value: string; title: string; points: number; /** Sem estoque: aparece cinza, com "Indisponível no momento", e não é escolhível. */ unavailable?: boolean }
export interface RewardChoiceListProps {
  /** Rótulo do grupo para leitor de tela ("Recompensa da meta"). */
  label: string;
  options: RewardChoice[];
  value?: string;
  onChange?: (v: string) => void;
  className?: string;
}
/** Escolha da recompensa que vira a meta, no cadastro (Telas 25 e 26): cards de rádio com "Nome · 800 pontos". */
export function RewardChoiceList({ label, options, value, onChange, className }: RewardChoiceListProps) {
  const base = React.useId();
  return (
    <RadioGroup aria-label={label} value={value} onValueChange={onChange} className={cn('gap-micro', className)}>
      {options.map((o, i) => (
        <label
          key={o.value}
          htmlFor={`${base}-${i}`}
          className={cn(
            'flex min-h-touch cursor-pointer items-center gap-micro rounded-lg border-2 p-mini text-foreground',
            value === o.value ? 'border-border-highlight bg-card' : 'border-transparent bg-card',
            o.unavailable && 'cursor-not-allowed bg-interactive-fill-disabled text-interactive-text-disabled',
            !o.unavailable && value !== o.value && 'border-border',
          )}
        >
          <RadioGroupItem id={`${base}-${i}`} value={o.value} disabled={o.unavailable} />
          <span className={cn(value === o.value ? 'label' : 'body-small font-medium')}>
            {o.title} · {fmt(o.points)} pontos{o.unavailable ? ' · Indisponível no momento' : ''}
          </span>
        </label>
      ))}
    </RadioGroup>
  );
}

/* --------------------------------------------------------- GoalProgressCard */

export interface GoalProgressCardProps {
  points: number;
  goal: number;
  /** Quilos que faltam ("Faltam 36 kg de recicláveis"). */
  missingKg?: number;
  className?: string;
}
/** Progresso da meta escolhida (Telas 25 e 26): eyebrow, barra, "80 / 800 pontos" e quanto falta em kg. */
export function GoalProgressCard({ points, goal, missingKg, className }: GoalProgressCardProps) {
  const pct = goal > 0 ? Math.min(100, (points / goal) * 100) : 0;
  return (
    <section aria-label="Progresso da meta" className={cn('grid gap-micro rounded-lg border border-border bg-card p-mini text-card-foreground', className)}>
      <p className="eyebrow m-0 uppercase tracking-wide">Progresso da meta</p>
      <Progress value={pct} label="Progresso da meta" />
      <div className="flex items-baseline justify-between gap-nano">
        <span className="caption text-muted-foreground">{fmt(points)} / {fmt(goal)} pontos</span>
        {missingKg != null && <span className="label text-text-link">Faltam {fmt(missingKg)} kg de recicláveis</span>}
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- GoalNote */

export interface GoalNoteProps { title?: string; children: React.ReactNode; className?: string }
/** Nota "Sua meta" na Entrega registrada (Tela 12): caixa tracejada com o quanto já tem e quanto falta. */
export function GoalNote({ title = 'Sua meta', children, className }: GoalNoteProps) {
  return (
    <aside aria-label={title} className={cn('grid gap-nano rounded-lg border border-dashed border-border-highlight bg-surface-accent p-mini text-foreground', className)}>
      <p className="eyebrow m-0 uppercase text-text-link">{title}</p>
      <p className="body-small m-0 font-medium">{children}</p>
    </aside>
  );
}

/* ------------------------------------------------------------- ReminderCard */

export interface ReminderCardProps {
  /** Padrão: "Lembrar da próxima entrega". */
  title?: string;
  /** Padrão: "Em 1 semana, no mesmo dia e horário. Você pode mudar a data.". */
  description?: string;
  /** "Segunda, 14 de setembro · 08:00". A linha abre o seletor de data e horário. */
  date: string;
  onDatePress?: () => void;
  /** Já salvo no calendário: o botão vira "Adicionado ao calendário" com check, sem toque. */
  added?: boolean;
  onAdd?: () => void;
  className?: string;
}
/** Lembrete da próxima entrega (Telas 12 a 15): data sugerida e "Adicionar ao calendário". */
export function ReminderCard({ title = 'Lembrar da próxima entrega', description = 'Em 1 semana, no mesmo dia e horário. Você pode mudar a data.', date, onDatePress, added, onAdd, className }: ReminderCardProps) {
  const line = (
    <>
      <Icon name="calendar" size="small" tone="brand" />
      <span className="label">{date}</span>
    </>
  );
  return (
    <section aria-label={title} className={cn('grid gap-nano rounded-lg border-[1.5px] border-border bg-card p-mini text-card-foreground', className)}>
      <h2 className="body-strong m-0">{title}</h2>
      <p className="caption m-0 text-muted-foreground">{description}</p>
      {onDatePress
        ? <button type="button" onClick={onDatePress} className={cn(pressable, focusRing, 'flex min-h-touch items-center gap-nano rounded-sm text-left')}>{line}</button>
        : <div className="flex min-h-touch items-center gap-nano">{line}</div>}
      {added
        ? <Button fullWidth icon="check" disabled className="disabled:bg-interactive-fill-disabled disabled:text-foreground disabled:[&_svg]:text-foreground">Adicionado ao calendário</Button>
        : <Button fullWidth onClick={onAdd}>Adicionar ao calendário</Button>}
    </section>
  );
}

/* --------------------------------------------------------- ShareImpactModal */

export interface ShareImpactModalProps {
  /** Três números da entrega, como em `ImpactTiles` ("3,2 kg" · "reciclados"). `highlight` pinta os pontos. */
  stats: Array<{ value: string; label: string; highlight?: boolean }>;
  /** Destinos do compartilhamento: Mensagem, Rede social, Copiar link. */
  options: Array<{ icon: IconName; label: string; onClick?: () => void }>;
  trigger?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** false = sem película (use só em exemplos). */
  modal?: boolean;
}
/** Modal "Compartilhar meu impacto" (Tela 16 e Meu impacto): resumo em três números, três destinos em círculos e "Fechar". */
export function ShareImpactModal({ stats, options, trigger, open, defaultOpen, onOpenChange, modal = true }: ShareImpactModalProps) {
  return (
    <Dialog open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange} modal={modal}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent showClose className="max-w-[358px] gap-small rounded-xl p-small pt-small">
        <DialogHeader className="pr-[44px]">
          <DialogTitle>Compartilhar meu impacto</DialogTitle>
          <DialogDescription>Mostre o que você já fez e inspire mais gente a reciclar.</DialogDescription>
        </DialogHeader>
        <dl className="m-0 grid auto-cols-fr grid-flow-col gap-nano">
          {stats.map((s) => (
            <div key={s.label} className="grid gap-xnano rounded-md bg-surface-secondary p-nano">
              <dd className={cn('label m-0 font-bold', s.highlight && 'text-text-link')}>{s.value}</dd>
              <dt className={cn('caption order-last', s.highlight ? 'font-bold text-text-link' : 'text-muted-foreground')}>{s.label}</dt>
            </div>
          ))}
        </dl>
        <hr className="m-0 border-0 border-t border-border" />
        <ul className="m-0 grid list-none grid-flow-col auto-cols-fr p-0">
          {options.map((o) => (
            <li key={o.label} className="grid justify-items-center">
              <button type="button" onClick={o.onClick} className={cn(pressable, focusRing, 'grid min-h-touch justify-items-center gap-nano rounded-md px-nano py-xnano text-foreground')}>
                <span aria-hidden className="grid size-[48px] place-items-center rounded-full border border-border bg-surface-secondary"><Icon name={o.icon} /></span>
                <span className="caption font-bold">{o.label}</span>
              </button>
            </li>
          ))}
        </ul>
        <DialogClose asChild><Button fullWidth>Fechar</Button></DialogClose>
      </DialogContent>
    </Dialog>
  );
}
