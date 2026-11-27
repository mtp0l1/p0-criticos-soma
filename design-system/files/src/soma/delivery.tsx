/* So+ma · Ativação e primeira entrega: DeliverySummaryCard, DeliveryHistoryRow, DeliveryDayCard, RewardChoiceList, GoalProgressCard, GoalNote, ReminderCard, ShareImpactModal. */
import * as React from 'react';
import { SpaceMap } from './recycle';
import { cn, fmt, focusRing } from '../lib/utils';
import { Icon, type IconName } from '../ui/icon';
import { Button } from '../ui/button';
import { Progress } from '../ui/display';
import { RadioGroup, RadioGroupItem } from '../ui/form';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose, Sheet, SheetTrigger, SheetContent, SheetTitle, SheetDescription, SheetClose } from '../ui/overlay';
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
  /** Horário em que o espaço recebe: "8h às 18h". */
  openHours?: string;
  /** Antecedência do lembrete ("1 hora antes"). Só depois de salvar no calendário. */
  notice?: string;
  className?: string;
}
/** Resumo do agendamento (Telas 6, 7, 28 e 29): Quando, Onde, Horário e, depois do calendário, Aviso. Rótulos à esquerda, valores à direita. */
export function DeliverySummaryCard({ date, space, address, onDirections, time, openHours, notice, className }: DeliverySummaryCardProps) {
  const quando = /^(?:Hoje, )?([^,]+), (\d{1,2}) de (\S+)/.exec(date);
  const linha = 'grid grid-cols-[auto_1fr_auto] items-center gap-micro';
  const disco = 'grid size-[40px] shrink-0 place-items-center rounded-full bg-surface-tint-peach text-text-link';
  return (
    <section aria-label="Resumo da entrega" className={cn('overflow-hidden rounded-lg bg-card text-card-foreground shadow-card', className)}>
      <div className="flex items-center gap-micro p-mini">
        {quando && (
          <p aria-hidden className="m-0 grid size-[64px] shrink-0 place-content-center rounded-md bg-surface-tint-peach text-center">
            <b className="text-[22px] leading-7">{quando[2].padStart(2, '0')}</b>
            <span className="caption font-bold uppercase text-text-link">{quando[3].slice(0, 3)}</span>
          </p>
        )}
        <p className="m-0 mr-auto grid">
          <span className="eyebrow uppercase tracking-wide text-muted-foreground">Quando</span>
          <span className="label">{quando ? <><span aria-hidden>{quando[1]}</span><span className="sr-only">{date}</span></> : date}</span>
        </p>
        <p className="caption m-0 inline-flex items-center gap-xnano whitespace-nowrap rounded-full bg-surface-inverse px-micro py-[6px] font-bold text-surface-primary"><Icon name="clock" size="small" />{time}</p>
      </div>
      <hr className="m-0 border-0 border-t border-dashed border-border" />
      <div className="grid gap-micro p-mini">
        <div className={linha}>
          <span aria-hidden className={disco}><Icon name="pin" /></span>
          <p className="m-0 grid min-w-0">
            <span className="label">{space}</span>
            {address && <span className="caption text-muted-foreground">{address}</span>}
          </p>
          {onDirections && (
            <button type="button" onClick={onDirections} className={cn(pressable, 'caption inline-flex min-h-touch items-center gap-xnano whitespace-nowrap rounded-xs font-bold text-text-link')}>
              <Icon name="navigation" size="small" />Como chegar<span className="sr-only"> a {space}</span>
            </button>
          )}
        </div>
        {openHours && (
          <div className={linha}>
            <span aria-hidden className={disco}><Icon name="store" /></span>
            <p className="m-0 grid"><span className="caption text-muted-foreground">Horário de recebimento</span><span className="label">{openHours}</span></p>
          </div>
        )}
        {notice && (
          <div className={linha}>
            <span aria-hidden className={disco}><Icon name="bell" /></span>
            <p className="m-0 grid"><span className="caption text-muted-foreground">Aviso</span><span className="label">{notice}</span></p>
          </div>
        )}
      </div>
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
    <article className={cn('grid grid-cols-[auto_1fr] items-center gap-micro rounded-lg bg-card p-micro text-card-foreground shadow-card', className)}>
      <span aria-hidden className="grid size-[40px] place-items-center rounded-full bg-feedback-fill-positive text-feedback-text-positive"><Icon name="check" /></span>
      <div className="grid min-w-0 gap-[2px]">
        <h3 className="label m-0">{space}</h3>
        <p className="caption m-0 text-muted-foreground">{date} · {status}</p>
      </div>
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
/** Estado de espera no dia da entrega: mapa do espaço, título e, num cartão, endereço e horário. "Cheguei ao espaço" e "Como chegar" ficam fora. */
export function DeliveryDayCard({ title = 'Hoje é o dia da sua entrega!', address, hours, className }: DeliveryDayCardProps) {
  const item = 'flex items-center gap-micro';
  const disco = 'grid size-[36px] shrink-0 place-items-center rounded-full bg-surface-tint-peach text-text-link';
  return (
    <section aria-label="Entrega de hoje" className={cn('grid gap-mini text-foreground', className)}>
      <SpaceMap className="h-[156px]" />
      <h2 className="screen-title m-0">{title}</h2>
      <ul className="m-0 grid list-none gap-micro rounded-lg bg-card p-micro text-card-foreground shadow-card">
        <li className={item}><span aria-hidden className={disco}><Icon name="pin" /></span><span className="body-small">{address}</span></li>
        <li className={item}><span aria-hidden className={disco}><Icon name="clock" /></span><span className="body-small">{hours}</span></li>
      </ul>
    </section>
  );
}

/* --------------------------------------------------------- RewardChoiceList */

export interface RewardChoice { value: string; title: string; points: number; /** Ícone no disco do cartão. Padrão: gift. */ icon?: IconName; /** Sem estoque: aparece cinza, com "Indisponível no momento", e não é escolhível. */ unavailable?: boolean }
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
    <RadioGroup aria-label={label} value={value} onValueChange={onChange} className={cn('gap-nano', className)}>
      {options.map((o, i) => {
        const on = value === o.value;
        return (
          <label
            key={o.value}
            htmlFor={`${base}-${i}`}
            className={cn(
              'grid min-h-button cursor-pointer grid-cols-[auto_1fr_auto] items-center gap-micro rounded-lg border-[1.5px] p-micro text-foreground has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring',
              o.unavailable ? 'cursor-not-allowed border-transparent bg-surface-secondary text-muted-foreground' : on ? 'border-border-highlight bg-surface-accent' : 'border-transparent bg-card shadow-card',
            )}
          >
            <span aria-hidden className={cn('grid size-[44px] place-items-center rounded-full', on ? 'bg-primary text-primary-foreground' : 'bg-surface-primary')}><Icon name={o.icon ?? 'gift'} /></span>
            <span className="grid gap-[2px]">
              <span className="label">{o.title}</span>
              <span className="caption flex flex-wrap items-center gap-xnano text-muted-foreground">{fmt(o.points)} pontos{o.unavailable && <span className="rounded-full bg-surface-track px-nano font-semibold text-foreground">Indisponível no momento</span>}</span>
            </span>
            <RadioGroupItem id={`${base}-${i}`} value={o.value} disabled={o.unavailable} className="!sr-only" />
            <span aria-hidden>{on && <span className="grid size-[22px] place-items-center rounded-full bg-primary text-primary-foreground"><Icon name="check" size="small" /></span>}</span>
          </label>
        );
      })}
    </RadioGroup>
  );
}

/* --------------------------------------------------------- GoalProgressCard */

export interface GoalProgressCardProps {
  points: number;
  goal: number;
  /** Quilos que faltam ("Faltam 36 kg de recicláveis"). */
  missingKg?: number;
  /** Material da estimativa ("PET"). Padrão: "recicláveis". */
  material?: string;
  className?: string;
}
/** Progresso da meta escolhida (Telas 25 e 26): eyebrow, barra, "80 / 800 pontos" e quanto falta em kg. */
export function GoalProgressCard({ points, goal, missingKg, material = 'recicláveis', className }: GoalProgressCardProps) {
  const pct = goal > 0 ? Math.min(100, (points / goal) * 100) : 0;
  return (
    <section aria-label="Progresso da meta" className={cn('grid gap-nano rounded-lg bg-card p-mini text-card-foreground shadow-card', className)}>
      <p className="eyebrow m-0 uppercase tracking-wide text-muted-foreground">Progresso da meta</p>
      <p className="m-0 flex items-baseline gap-xnano"><b className="text-[32px] leading-10">{fmt(points)}</b><span className="body-small text-muted-foreground">/ {fmt(goal)} pontos</span></p>
      <Progress value={pct} label="Progresso da meta" />
      {missingKg != null && <p className="body-small m-0 flex items-center gap-xnano font-semibold"><Icon name="refresh" size="small" className="text-text-link" />Faltam {fmt(missingKg)} kg de {material}</p>}
    </section>
  );
}

/* ----------------------------------------------------------------- GoalNote */

export interface GoalNoteProps { title?: string; children: React.ReactNode; /** Barra sob o texto: pontos que tem e meta. */ progress?: { points: number; goal: number }; className?: string }
/** Nota "Sua meta" na Entrega registrada: bandeira, quanto já tem, quanto falta e a barra. */
export function GoalNote({ title = 'Sua meta', children, progress, className }: GoalNoteProps) {
  return (
    <aside aria-label={title} className={cn('grid gap-nano rounded-lg bg-card p-mini text-card-foreground shadow-card', className)}>
      <p className="m-0 flex items-center gap-nano">
        <span aria-hidden className="grid size-[32px] place-items-center rounded-full bg-surface-tint-peach text-text-link"><Icon name="flag" size="small" /></span>
        <span className="eyebrow uppercase text-muted-foreground">{title}</span>
      </p>
      <p className="body-small m-0 font-semibold">{children}</p>
      {progress && <Progress value={progress.goal > 0 ? (progress.points / progress.goal) * 100 : 0} label="Progresso da meta" />}
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
  const pill = 'inline-flex min-h-touch items-center gap-nano justify-self-start rounded-full bg-surface-primary px-micro text-left text-foreground';
  const line = (
    <>
      <Icon name="calendar" size="small" className="text-text-link" />
      <span className="caption font-bold">{date}</span>
    </>
  );
  return (
    <section aria-label={title} className={cn('grid gap-nano rounded-lg bg-surface-tint-peach p-mini text-foreground', className)}>
      <div className="flex items-center gap-nano">
        <span aria-hidden className="grid size-[32px] place-items-center rounded-full bg-surface-primary text-text-link"><Icon name="bell" size="small" /></span>
        <h2 className="body-strong m-0">{title}</h2>
      </div>
      <p className="caption m-0">{description}</p>
      {onDatePress
        ? <button type="button" onClick={onDatePress} className={cn(pressable, focusRing, pill, 'border-0')}>{line}</button>
        : <div className={pill}>{line}</div>}
      {added
        ? <Button fullWidth icon="check" disabled className="disabled:bg-interactive-fill-disabled disabled:text-foreground disabled:[&_svg]:text-foreground">Adicionado ao calendário</Button>
        : <Button fullWidth icon="calendar" onClick={onAdd}>Adicionar ao calendário</Button>}
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
    <Sheet open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange} modal={modal}>
      {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
      <SheetContent side="bottom" className="gap-micro rounded-t-xl bg-background px-xsmall pb-medium pt-small">
        <div className="grid gap-nano">
          <SheetTitle className="screen-title !text-[18px] !font-bold !leading-6 m-0 text-left">Compartilhar meu impacto</SheetTitle>
          <SheetDescription className="body-small m-0 text-left text-muted-foreground">Mostre o que você já fez e inspire mais gente a reciclar.</SheetDescription>
        </div>
        <dl className="m-0 grid auto-cols-fr grid-flow-col gap-nano rounded-lg bg-surface-inverse p-micro text-text-inverse">
          {stats.map((s) => (
            <div key={s.label} className="grid content-start gap-[2px]">
              <dd className="m-0 whitespace-nowrap text-[18px] font-bold leading-6 text-icon-brand">{s.value}</dd>
              <dt className={cn('caption order-last', s.highlight && 'font-bold')}>{s.label}</dt>
            </div>
          ))}
        </dl>
        <ul className="m-0 grid list-none grid-flow-col auto-cols-fr p-0">
          {options.map((o) => (
            <li key={o.label} className="grid justify-items-center">
              <button type="button" onClick={o.onClick} className={cn(pressable, focusRing, 'grid min-h-touch cursor-pointer justify-items-center gap-nano rounded-md border-0 bg-transparent px-nano py-xnano text-foreground')}>
                <span aria-hidden className="grid size-[48px] place-items-center rounded-full bg-surface-primary shadow-card"><Icon name={o.icon} /></span>
                <span className="caption font-bold">{o.label}</span>
              </button>
            </li>
          ))}
        </ul>
        <SheetClose asChild><Button fullWidth hierarchy="quiet" className="bg-surface-secondary shadow-none">Fechar</Button></SheetClose>
      </SheetContent>
    </Sheet>
  );
}
