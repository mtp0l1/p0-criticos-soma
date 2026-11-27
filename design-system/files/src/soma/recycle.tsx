/* So+ma · reciclar e agendar: DeliveryCard, SpaceCard, SlotPicker, SpaceDetail, SpaceMap, SpaceMapSheet, SpacePickerSheet. */
import * as React from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { cn, focusRing } from '../lib/utils';
import { Icon } from '../ui/icon';
import { Button } from '../ui/button';
import { Sheet, SheetTrigger, SheetContent, SheetTitle, SheetDescription, SheetClose } from '../ui/overlay';
import { pressable } from './navigation';

/* ------------------------------------------------------------ DeliveryCard */

export interface DeliveryCardProps {
  /**
   * empty = sem entrega agendada (Agendar entrega) · scheduled = data, espaço e Mostrar meu QR ·
   * past = a data passou sem entrega registrada (Reagendar).
   */
  state: 'empty' | 'scheduled' | 'past';
  /** Nome do espaço de recebimento ("Vila Verde"). */
  space?: string;
  /** Data já formatada ("Seg, 07 set · 09h"). */
  date?: string;
  address?: string;
  onAction?: () => void;
  className?: string;
}
const DELIVERY = {
  empty: { text: 'Você ainda não agendou uma entrega', action: 'Agendar entrega', bg: 'bg-card shadow-card' },
  scheduled: { text: '', action: 'Mostrar meu QR', bg: 'bg-surface-accent' },
  past: { text: 'A data da sua entrega passou', action: 'Reagendar entrega', bg: 'bg-surface-secondary' },
} as const;
/** "Sua próxima entrega" na aba Reciclar. Sem entrega agendada, um ícone de calendário acompanha o aviso. */
export function DeliveryCard({ state, space, date, address, onAction, className }: DeliveryCardProps) {
  const d = DELIVERY[state];
  return (
    <section aria-label="Sua próxima entrega" className={cn('grid gap-micro rounded-lg p-micro text-foreground', d.bg, className)}>
      {state === 'scheduled' ? (
        <div className="grid gap-xnano">
          <p className="label m-0">{[space, date].filter(Boolean).join(' · ')}</p>
          {address && <p className="caption m-0 text-muted-foreground">{address}</p>}
        </div>
      ) : (
        <div className="flex items-center gap-micro">
          {state === 'empty' && <span aria-hidden className="grid size-[40px] shrink-0 place-items-center rounded-full bg-surface-tint-peach text-text-link"><Icon name="calendar" /></span>}
          <p className="label m-0">{d.text}</p>
        </div>
      )}
      <Button size="compact" fullWidth onClick={onAction}>{d.action}</Button>
    </section>
  );
}

/* --------------------------------------------------------------- SpaceCard */

export interface SpaceCardProps {
  name: string;
  /** "1,6 km" ou "800 m". */
  distance?: string;
  address?: string;
  /** "Seg a sáb, 9h às 18h". */
  hours?: string;
  /** Com onSelect, o card vira opção de uma lista (rádio). */
  selected?: boolean;
  onSelect?: () => void;
  /** O espaço que já é da pessoa, na troca de espaço: não é escolhível e mostra o selo "Seu espaço". */
  current?: boolean;
  /** Abre a folha "Como chegar" deste espaço. Sem ele, "Como chegar" não aparece. */
  onDirections?: () => void;
  className?: string;
}
const badge = 'caption whitespace-nowrap rounded-full bg-surface-secondary px-nano py-[2px] font-semibold text-foreground';
/**
 * Espaço de recebimento, em três usos: perto de você (Reciclar), opção do agendamento e da troca de espaço (rádio),
 * e espaço atual na troca.
 */
export function SpaceCard({ name, distance, address, hours, selected, onSelect, current, onDirections, className }: SpaceCardProps) {
  const selectable = !!onSelect && !current;
  const head = (
    <span className="flex items-start justify-between gap-nano">
      <span className="label">{name}</span>
      {distance && <span className={badge}>{distance}</span>}
    </span>
  );
  if (!selectable && !current) {
    return (
      <div className={cn('grid gap-nano rounded-lg bg-card p-micro text-card-foreground shadow-card', className)}>
        {head}
        {address && <span className="caption text-muted-foreground">{address}</span>}
        {hours && <span className="caption flex items-center gap-xnano text-muted-foreground"><Icon name="clock" size="small" />{hours}</span>}
        {onDirections && (
          <Button hierarchy="quiet" size="compact" fullWidth icon="navigation" onClick={onDirections} className="rounded-full bg-surface-tint-peach">
            Como chegar<span className="sr-only"> a {name}</span>
          </Button>
        )}
      </div>
    );
  }
  const mark = current
    ? <span aria-hidden className="grid size-[22px] shrink-0 place-items-center rounded-full bg-surface-primary text-text-link"><Icon name="pin" size="small" /></span>
    : <span aria-hidden className={cn('mt-[1px] grid size-[20px] shrink-0 place-items-center rounded-full border-2', selected ? 'border-text-link bg-text-link text-surface-primary' : 'border-icon-secondary bg-surface-primary')}>{selected && <Icon name="check" size="small" />}</span>;
  const body = (
    <>
      {mark}
      <span className="grid min-w-0 gap-[2px]">
        {head}
        {address && <span className="caption text-muted-foreground">{address}</span>}
        {(hours || onDirections) && (
          <span className="flex items-end justify-between gap-nano">
            <span className="caption text-muted-foreground">{hours}</span>
            {onDirections && <span aria-hidden className="caption invisible inline-flex shrink-0 items-center gap-xnano whitespace-nowrap font-bold"><Icon name="navigation" size="small" />Como chegar</span>}
          </span>
        )}
        {current && <span className="caption justify-self-end rounded-full bg-feedback-fill-positive px-nano font-semibold text-feedback-text-positive">Seu espaço</span>}
      </span>
    </>
  );
  const row = 'grid w-full grid-cols-[auto_1fr] items-start gap-nano rounded-md p-micro text-left';
  return (
    <div className={cn(
      'relative rounded-md border-2 text-foreground',
      current ? 'border-transparent bg-surface-secondary' : selected ? 'border-text-link bg-surface-accent' : 'border-border bg-card',
      className,
    )}>
      {selectable
        ? <button type="button" aria-pressed={!!selected} onClick={onSelect} className={cn(pressable, row)}>{body}</button>
        : <div className={row}>{body}</div>}
      {onDirections && (
        <button type="button" onClick={onDirections} className={cn(pressable, focusRing, 'caption absolute bottom-0 right-nano inline-flex min-h-touch items-center gap-xnano rounded-xs font-bold text-text-link')}>
          <Icon name="navigation" size="small" />Como chegar<span className="sr-only"> a {name}</span>
        </button>
      )}
    </div>
  );
}

/* -------------------------------------------------------------- SlotPicker */

export interface Slot { value: string; label: string; /** Linha de cima menor ("Seg"). */ sublabel?: string; disabled?: boolean }
export interface SlotPickerProps {
  /** Nome do grupo ("Escolha a data"). Aparece como eyebrow. */
  label: string;
  /** Aviso curto à direita do rótulo: "Domingo fechado", "Casa so+ma Batel abre às 9h". */
  note?: string;
  /** Grade de 7 colunas que quebra linha, em vez da fileira rolável (horários do dia inteiro). */
  wrap?: boolean;
  slots: Slot[];
  value?: string;
  onChange?: (v: string) => void;
  className?: string;
}
/** Escolha de data ou horário em fileira rolável, sobre RadioGroup (setas do teclado, um ponto de tabulação). */
export function SlotPicker({ label, note, wrap, slots, value, onChange, className }: SlotPickerProps) {
  const id = React.useId();
  return (
    <div className={cn('grid gap-nano', className)}>
      <div className="flex items-baseline justify-between gap-nano">
        <p id={id} className="eyebrow m-0 uppercase tracking-wide text-foreground">{label}</p>
        {note && <p id={`${id}-nota`} className="caption m-0 text-right text-muted-foreground">{note}</p>}
      </div>
      <RadioGroupPrimitive.Root aria-labelledby={id} aria-describedby={note ? `${id}-nota` : undefined} value={value} onValueChange={onChange} orientation="horizontal" loop={false}
        className={wrap ? 'grid grid-cols-7 gap-[6px]' : '-mx-xsmall flex gap-nano overflow-x-auto px-xsmall pb-xnano [scrollbar-width:none]'}>
        {slots.map((s) => (
          <RadioGroupPrimitive.Item
            key={s.value}
            value={s.value}
            disabled={s.disabled}
            aria-label={[s.sublabel, s.label, s.disabled ? 'indisponível' : ''].filter(Boolean).join(' ')}
            className={cn(
              pressable, focusRing,
              'grid min-h-touch shrink-0 place-items-center content-center gap-xnano rounded-md border border-border bg-card py-nano text-center text-foreground',
              wrap ? 'min-w-0' : 'min-w-touch px-nano',
              'hover:bg-interactive-fill-quiet-hover active:bg-interactive-fill-quiet-active',
              s.sublabel
                ? 'data-[state=checked]:border-surface-inverse data-[state=checked]:bg-surface-inverse data-[state=checked]:text-text-inverse'
                : 'data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
              'disabled:cursor-not-allowed disabled:border-interactive-fill-disabled disabled:bg-interactive-fill-disabled disabled:text-interactive-text-disabled',
            )}
          >
            {s.sublabel && <span aria-hidden className="caption">{s.sublabel}</span>}
            <span aria-hidden className="text-[14px] font-bold leading-5">{s.label}</span>
          </RadioGroupPrimitive.Item>
        ))}
      </RadioGroupPrimitive.Root>
    </div>
  );
}

/* -------------------------------------------------------------- SpaceDetail */

export interface SpaceDetailProps {
  name: string;
  /** "Rua das Flores, 120 · Seg a sáb, 8h às 18h". */
  address: string;
  /** Abre o mapa. */
  onDirections?: () => void;
  className?: string;
}
/** Painel creme que aparece sob a lista de espaços quando um está escolhido (Tela 27): endereço, horário e "Como chegar". */
export function SpaceDetail({ name, address, onDirections, className }: SpaceDetailProps) {
  return (
    <section aria-label={`Detalhes de ${name}`} className={cn('grid gap-nano rounded-md bg-surface-accent p-micro text-foreground', className)}>
      <p className="label m-0">{name}</p>
      <p className="caption m-0 text-muted-foreground">{address}</p>
      {onDirections && <Button hierarchy="quiet" size="compact" fullWidth icon="pin" onClick={onDirections} className="rounded-full">Como chegar<span className="sr-only"> a {name}</span></Button>}
    </section>
  );
}

/* ----------------------------------------------------------------- SpaceMap */

export interface SpaceMapProps { className?: string }
/** Mapa ilustrativo, igual para todos os espaços: dá o lugar do pino, não o caminho. O caminho abre no app de mapas. */
export function SpaceMap({ className }: SpaceMapProps) {
  return (
    <div aria-hidden className={cn('relative h-[132px] overflow-hidden rounded-lg', className)}>
      <svg viewBox="0 0 320 132" preserveAspectRatio="xMidYMid slice" className="block size-full">
        <rect width="320" height="132" fill="var(--surface-secondary)" />
        <path d="M0 0h110v52H0zM214 84h106v48H214z" fill="var(--feedback-fill-positive)" />
        <rect x="226" y="10" width="78" height="42" rx="10" fill="var(--surface-track)" />
        <rect x="22" y="86" width="90" height="46" rx="10" fill="var(--surface-track)" />
        <path d="M0 66h320M138 0v132M196 0l-6 132M54 18l266 82" stroke="var(--surface-primary)" strokeWidth="11" fill="none" />
      </svg>
      <span className="absolute left-1/2 top-1/2 grid size-[44px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-primary text-primary-foreground shadow-card"><Icon name="pin" /></span>
    </div>
  );
}

/* ------------------------------------------------------------ SpaceMapSheet */

export interface SpaceMapSheetProps {
  name: string;
  /** "Rua das Flores, 120 · 800 m". */
  address: string;
  /** Situação agora: "Aberto até 18h". */
  status?: string;
  /** "Seg a sáb, 8h às 18h". */
  hours?: string;
  onOpenMaps?: () => void;
  onCopyAddress?: () => void;
  trigger?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** false = sem película (use só em exemplos). */
  modal?: boolean;
}
const sheetBox = 'max-h-[92dvh] gap-micro overflow-y-auto rounded-t-xl bg-background px-xsmall pb-medium pt-small';
function SheetTop({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between gap-nano">
      <SheetTitle className="subtitle m-0 text-left font-bold">{title}</SheetTitle>
      <SheetClose aria-label="Fechar" className={cn(focusRing, 'grid size-touch shrink-0 cursor-pointer place-items-center rounded-full border-0 bg-surface-primary text-foreground shadow-card')}>
        <Icon name="close" />
      </SheetClose>
    </div>
  );
}
/** Folha "Como chegar": abre sobre a tela de origem, com o espaço que foi tocado. */
export function SpaceMapSheet({ name, address, status, hours, onOpenMaps, onCopyAddress, trigger, open, defaultOpen, onOpenChange, modal = true }: SpaceMapSheetProps) {
  return (
    <Sheet open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange} modal={modal}>
      {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
      <SheetContent side="bottom" className={sheetBox}>
        <div className="grid gap-xnano">
          <SheetTop title={name} />
          <SheetDescription className="caption m-0 text-left text-muted-foreground">{address}</SheetDescription>
        </div>
        {(status || hours) && (
          <p className="caption m-0 flex flex-wrap items-center gap-nano text-muted-foreground">
            {status && <span className="rounded-full bg-feedback-fill-positive px-nano py-[2px] font-semibold text-feedback-text-positive">{status}</span>}
            {hours}
          </p>
        )}
        <SpaceMap />
        <div className="grid gap-nano">
          <Button fullWidth icon="navigation" onClick={onOpenMaps}>Abrir no app de mapas</Button>
          <Button fullWidth hierarchy="quiet" icon="copy" onClick={onCopyAddress}>Copiar endereço</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

/* --------------------------------------------------------- SpacePickerSheet */

export interface SpaceOption { value: string; name: string; distance?: string; address?: string; hours?: string }
export interface SpacePickerSheetProps {
  spaces: SpaceOption[];
  /** `value` do espaço atual da pessoa. */
  current: string;
  /** Escolha ainda não confirmada. */
  value?: string;
  onChange?: (v: string) => void;
  onConfirm?: (v: string) => void;
  /** O que muda com a troca. */
  note?: string;
  trigger?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  modal?: boolean;
}
/** Folha "Escolha seu espaço": o atual primeiro, os outros como opções. O botão diz para qual espaço a pessoa vai trocar. */
export function SpacePickerSheet({ spaces, current, value, onChange, onConfirm, note = 'A troca vale para os próximos agendamentos. O ranking muda após sua 1ª entrega no novo espaço.', trigger, open, defaultOpen, onOpenChange, modal = true }: SpacePickerSheetProps) {
  const ordered = [...spaces].sort((a, b) => Number(b.value === current) - Number(a.value === current));
  const chosen = spaces.find((x) => x.value === value && x.value !== current);
  return (
    <Sheet open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange} modal={modal}>
      {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
      <SheetContent side="bottom" className={sheetBox} aria-describedby={undefined}>
        <SheetTop title="Escolha seu espaço" />
        <ul className="m-0 grid list-none gap-nano p-0">
          {ordered.map((x) => (
            <li key={x.value}>
              <SpaceCard name={x.name} distance={x.distance} address={x.address} hours={x.hours}
                current={x.value === current} selected={x.value === chosen?.value} onSelect={() => onChange?.(x.value)} />
            </li>
          ))}
        </ul>
        {note && <p className="caption m-0 text-muted-foreground">{note}</p>}
        <div className="grid gap-xnano">
          <SheetClose asChild><Button fullWidth disabled={!chosen} onClick={() => chosen && onConfirm?.(chosen.value)}>{chosen ? `Trocar para ${chosen.name}` : 'Trocar espaço'}</Button></SheetClose>
          <SheetClose asChild><Button fullWidth hierarchy="quiet" className="bg-transparent">Cancelar</Button></SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}
