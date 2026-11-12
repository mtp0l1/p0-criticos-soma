/* So+ma · reciclar e agendar: DeliveryCard, SpaceCard, SlotPicker. */
import * as React from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { cn, focusRing } from '../lib/utils';
import { Icon } from '../ui/icon';
import { Button } from '../ui/button';
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
  empty: { text: 'Você ainda não agendou uma entrega', action: 'Agendar entrega', bg: 'bg-surface-secondary' },
  scheduled: { text: '', action: 'Mostrar meu QR', bg: 'bg-surface-accent' },
  past: { text: 'A data da sua entrega passou', action: 'Reagendar entrega', bg: 'bg-surface-secondary' },
} as const;
/** "Sua próxima entrega" na aba Reciclar (Figma: Variante A sem entrega, Variante B com entrega; os rótulos são só anotação). Texto e botão, sem ícone. */
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
        <p className="label m-0">{d.text}</p>
      )}
      <Button size="compact" fullWidth onClick={onAction}>{d.action}</Button>
    </section>
  );
}

/* --------------------------------------------------------------- SpaceCard */

export interface SpaceCardProps {
  name: string;
  /** "0,8 km" ou "800 m". */
  distance?: string;
  address?: string;
  /** "Hoje · 09h às 18h". */
  hours?: string;
  /** Com onSelect, o card vira opção (aria-pressed) com borda de destaque quando selecionado. */
  selected?: boolean;
  onSelect?: () => void;
  /** Abre o mapa. Sem ele, "Como chegar" não aparece. */
  onDirections?: () => void;
  className?: string;
}
/** Espaço de recebimento: perto de você (Reciclar) ou opção na escolha do agendamento. */
export function SpaceCard({ name, distance, address, hours, selected, onSelect, onDirections, className }: SpaceCardProps) {
  const selectable = !!onSelect;
  const summary = (
    <>
      <span className="flex items-baseline justify-between gap-nano">
        <span className="label">{name}</span>
        {distance && <span className={cn('caption whitespace-nowrap', selected ? 'font-semibold text-text-link' : 'text-muted-foreground')}>{distance}</span>}
      </span>
      {address && <span className="caption text-muted-foreground">{address}</span>}
      {hours && <span className="caption flex items-center gap-xnano text-muted-foreground"><Icon name="clock" size="small" />{hours}</span>}
    </>
  );
  return (
    <div className={cn(
      'grid gap-nano rounded-lg p-micro text-foreground',
      selectable ? cn('border bg-card', selected ? 'border-2 border-border-highlight' : 'border-border') : 'bg-surface-secondary',
      className,
    )}>
      {selectable ? (
        <button type="button" aria-pressed={!!selected} onClick={onSelect} className={cn(pressable, '-m-xnano grid gap-xnano rounded-md p-xnano')}>{summary}</button>
      ) : <div className="grid gap-xnano">{summary}</div>}
      {onDirections && (
        <Button hierarchy="quiet" size="compact" fullWidth icon="pin" onClick={onDirections} className="rounded-full">
          Como chegar<span className="sr-only"> a {name}</span>
        </Button>
      )}
    </div>
  );
}

/* -------------------------------------------------------------- SlotPicker */

export interface Slot { value: string; label: string; /** Linha de cima menor ("Seg"). */ sublabel?: string; disabled?: boolean }
export interface SlotPickerProps {
  /** Nome do grupo ("Escolha a data"). Aparece como eyebrow. */
  label: string;
  slots: Slot[];
  value?: string;
  onChange?: (v: string) => void;
  className?: string;
}
/** Escolha de data ou horário em fileira rolável, sobre Radix RadioGroup (setas do teclado, um ponto de tabulação). */
export function SlotPicker({ label, slots, value, onChange, className }: SlotPickerProps) {
  const id = React.useId();
  return (
    <div className={cn('grid gap-nano', className)}>
      <p id={id} className="eyebrow m-0 uppercase tracking-wide text-foreground">{label}</p>
      <RadioGroupPrimitive.Root aria-labelledby={id} value={value} onValueChange={onChange} orientation="horizontal" loop={false}
        className="-mx-xsmall flex gap-nano overflow-x-auto px-xsmall pb-xnano [scrollbar-width:none]">
        {slots.map((s) => (
          <RadioGroupPrimitive.Item
            key={s.value}
            value={s.value}
            disabled={s.disabled}
            aria-label={[s.sublabel, s.label, s.disabled ? 'indisponível' : ''].filter(Boolean).join(' ')}
            className={cn(
              pressable, focusRing,
              'grid min-h-touch min-w-[48px] shrink-0 place-items-center content-center gap-xnano rounded-sm border border-border bg-card px-nano py-nano text-center text-foreground',
              'hover:bg-interactive-fill-quiet-hover active:bg-interactive-fill-quiet-active',
              'data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
              'disabled:cursor-not-allowed disabled:border-interactive-fill-disabled disabled:bg-interactive-fill-disabled disabled:text-interactive-text-disabled disabled:line-through',
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
/** Painel salmão que aparece sob a lista de espaços quando um está escolhido (Tela 27): endereço, horário e "Como chegar". */
export function SpaceDetail({ name, address, onDirections, className }: SpaceDetailProps) {
  return (
    <section aria-label={`Detalhes de ${name}`} className={cn('grid gap-nano rounded-lg bg-surface-accent p-mini text-foreground', className)}>
      <p className="label m-0">{name}</p>
      <p className="caption m-0 text-muted-foreground">{address}</p>
      {onDirections && <Button hierarchy="quiet" size="compact" fullWidth icon="pin" onClick={onDirections} className="rounded-full">Como chegar<span className="sr-only"> a {name}</span></Button>}
    </section>
  );
}
