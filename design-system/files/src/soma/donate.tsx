/* So+ma · Doar pontos: InstitutionRow, DonationAmountCard, DonationStateCard, InstitutionDetailModal. */
import * as React from 'react';
import { Button } from '../ui/button';
import { cn, fmt, focusRing, hitArea, hitAreaY, tintBg, type Tint } from '../lib/utils';
import { Icon, type IconName } from '../ui/icon';
import { Sheet, SheetTrigger, SheetContent, SheetTitle, SheetDescription, SheetClose } from '../ui/overlay';
import { pressable, PressableBase } from './navigation';

/* ---------------------------------------------------------- InstitutionRow */

export interface InstitutionRowProps {
  name: string;
  description: string;
  /** Ícone da causa (cesta, coração, talheres…). Aparece em tile de 60px colorido pela categoria. */
  icon?: IconName;
  /** Tom do tile, por categoria da causa. Sem ele, o tom sai do nome (sempre o mesmo para a mesma instituição). */
  tint?: Tint;
  href?: string;
  onPress?: () => void;
}
/** Instituição na lista "Escolha para quem você quer doar seus pontos": cartão branco tocável com tile de ícone em tom de categoria, nome, causa e botão redondo com seta. */
export function InstitutionRow({ name, description, icon = 'heart', tint, href, onPress }: InstitutionRowProps) {
  return (
    <PressableBase
      href={href}
      onClick={onPress}
      className={cn(pressable, 'grid w-full grid-cols-[auto_1fr_auto] items-center gap-micro rounded-2xl bg-surface-primary p-[14px] text-left text-foreground shadow-card hover:bg-surface-secondary active:bg-surface-secondary-hover')}
    >
      <span aria-hidden className={cn('grid size-[60px] place-items-center rounded-lg', tintBg[tint ?? 'peach'])}><Icon name={icon} /></span>
      <span className="grid gap-xnano">
        <span className="label">{name}</span>
        <span className="body-small text-muted-foreground">{description}</span>
      </span>
      <span aria-hidden className="grid size-[36px] place-items-center rounded-full bg-surface-secondary"><Icon name="chevron-right" size="small" /></span>
    </PressableBase>
  );
}

/* ------------------------------------------------------ DonationAmountCard */

const ZERO_MSG = 'Digite um número maior que zero.';
const OVER_MSG = 'Você não tem saldo suficiente para doar essa quantidade.';
/** Mensagem de erro do valor digitado, ou `undefined` quando vazio ou válido. Use também para desabilitar "Doar". */
export function donationError(value: number | null, balance: number): string | undefined {
  if (value === null) return undefined;
  if (value <= 0) return ZERO_MSG;
  if (value > balance) return OVER_MSG;
  return undefined;
}

export interface DonationAmountCardProps {
  /** Saldo da pessoa, em pontos. */
  balance: number;
  /** Valor digitado. `null` = campo vazio. */
  value: number | null;
  onChange: (v: number | null) => void;
  /** Sobrescreve a mensagem padrão (`donationError`). */
  error?: string;
  /** Com o NumericKeypad na tela: o campo não abre o teclado do aparelho (o teclado físico continua funcionando). */
  keypad?: boolean;
  className?: string;
}
const digits = (v: string, max: number) => { const d = v.replace(/\D/g, '').slice(0, max); return d === '' ? null : parseInt(d, 10); };
/**
 * Valor da doação: pergunta, número grande com "pts", saldo logo abaixo e o erro em espaço reservado,
 * para a pergunta, o saldo e o botão não mudarem de lugar entre os estados.
 */
export function DonationAmountCard({ balance, value, onChange, error, keypad, className }: DonationAmountCardProps) {
  const msg = error ?? donationError(value, balance);
  const id = React.useId();
  const text = value === null ? '' : fmt(value);
  return (
    <section aria-label="Quantidade a doar" className={cn('grid justify-items-center gap-nano text-center text-foreground', className)}>
      <label htmlFor={id} className="body-small m-0 text-muted-foreground">Quantos pontos deseja doar?</label>
      <div className="flex items-baseline justify-center gap-nano">
        <input
          id={id}
          inputMode={keypad ? 'none' : 'numeric'}
          autoComplete="off"
          placeholder="0"
          value={text}
          onChange={(e) => onChange(digits(e.target.value, 6))}
          aria-invalid={!!msg}
          aria-describedby={msg ? `${id}-erro` : `${id}-saldo`}
          size={Math.max(1, text.length)}
          // o ponto de milhar é bem mais estreito que um algarismo
          style={{ width: `${Math.max(1, text.replace(/\./g, '').length + (text.split('.').length - 1) * 0.4)}ch` }}
          className={cn(focusRing, 'box-content max-w-[240px] rounded-xs border-0 bg-transparent p-0 text-center font-sans text-[48px] font-bold leading-[56px] caret-primary placeholder:text-interactive-text-disabled', msg ? 'text-feedback-text-negative' : 'text-foreground')}
        />
        <span aria-hidden className="subtitle text-muted-foreground">pts</span>
      </div>
      <p id={`${id}-saldo`} className="caption m-0 rounded-full bg-surface-secondary px-micro py-[6px] font-medium text-muted-foreground">Você tem <b className="font-semibold text-text-link">{fmt(balance)} {balance === 1 ? 'ponto' : 'pontos'}</b></p>
      <div className="grid min-h-[56px] w-full content-center">
        {msg && (
          <p id={`${id}-erro`} role="alert" className="caption m-0 flex items-center justify-center gap-nano rounded-md bg-feedback-fill-negative px-micro py-nano font-medium text-feedback-text-negative">
            <Icon name="alert" size="small" />{msg}
          </p>
        )}
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- NumericKeypad */

export interface NumericKeypadProps {
  value: number | null;
  onChange: (v: number | null) => void;
  /** Máximo de dígitos. */
  maxLength?: number;
  className?: string;
}
/** Teclado numérico do valor da doação, no pé da tela, abaixo do botão "Doar". */
export function NumericKeypad({ value, onChange, maxLength = 6, className }: NumericKeypadProps) {
  const text = value === null ? '' : String(value);
  const key = cn(focusRing, 'grid h-[52px] cursor-pointer place-items-center rounded-md border-0 bg-transparent font-sans text-[22px] font-semibold text-foreground active:bg-interactive-fill-quiet-active');
  const press = (k: string) => onChange(digits(text === '0' ? k : text + k, maxLength));
  return (
    <div role="group" aria-label="Teclado numérico" className={cn('grid grid-cols-3 rounded-t-xl bg-surface-primary px-xsmall pb-small pt-micro shadow-sheet', className)}>
      {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((k) => <button key={k} type="button" onClick={() => press(k)} className={key}>{k}</button>)}
      <span aria-hidden />
      <button type="button" onClick={() => press('0')} className={key}>0</button>
      <button type="button" aria-label="Apagar" onClick={() => onChange(digits(text.slice(0, -1), maxLength))} className={key}><Icon name="backspace" /></button>
    </div>
  );
}

/* ------------------------------------------------------- DonationStateCard */

export interface DonationStateCardProps {
  title: string;
  description: string;
  /** Mostra o anel "320 de 500 pontos" (pontos insuficientes para a instituição). */
  progress?: { points: number; goal: number };
  /** Arte quando não há anel. Padrão: o círculo pêssego com o ícone de reciclar. */
  art?: React.ReactNode;
  className?: string;
}
/** Estado no lugar do valor da doação: "Você ainda não tem pontos" (saldo zero) e "Pontos insuficientes" (com anel de progresso). */
export function DonationStateCard({ title, description, progress, art, className }: DonationStateCardProps) {
  const pct = progress && progress.goal > 0 ? Math.min(100, (progress.points / progress.goal) * 100) : 0;
  return (
    <section aria-label={title} className={cn('grid justify-items-center gap-mini px-mini py-small text-center text-foreground', className)}>
      {progress ? (
        <div role="progressbar" aria-label="Pontos para doar a esta instituição" aria-valuemin={0} aria-valuemax={progress.goal} aria-valuenow={Math.min(progress.points, progress.goal)} aria-valuetext={`${fmt(progress.points)} de ${fmt(progress.goal)} pontos`} className="relative grid size-[136px] place-items-center">
          <svg aria-hidden viewBox="0 0 136 136" className="absolute inset-0 size-full -rotate-90">
            <circle cx="68" cy="68" r="62" fill="none" strokeWidth="10" className="stroke-surface-track" />
            <circle cx="68" cy="68" r="62" fill="none" strokeWidth="10" strokeLinecap="round" pathLength={100} strokeDasharray={`${pct} 100`} className="stroke-primary" />
          </svg>
          <span aria-hidden className="grid">
            <b className="text-[28px] leading-9">{fmt(progress.points)}</b>
            <span className="caption text-muted-foreground">de {fmt(progress.goal)} pontos</span>
          </span>
        </div>
      ) : (art ?? <span aria-hidden className="grid size-[112px] place-items-center rounded-full bg-surface-tint-peach text-text-link"><Icon name="refresh" size="xlarge" /></span>)}
      <div className="grid gap-nano">
        <h2 className="screen-title m-0">{title}</h2>
        <p className="body-small m-0 text-muted-foreground">{description}</p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------ InstitutionDetailModal */

export interface InstitutionDetailModalProps {
  name: string;
  /** Texto longo sobre a instituição. */
  description: string;
  /** Endereço, telefone e site. O que faltar não aparece. */
  address?: string;
  phone?: string;
  site?: string;
  /** Banner. Sem ele, um quadro pêssego com o coração. */
  image?: string;
  /** "São Paulo, SP". */
  city?: string;
  /** Mostra "Doar para esta instituição". */
  onDonate?: () => void;
  trigger?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** false = sem película (use só em exemplos). */
  modal?: boolean;
}
const infoRow = 'flex items-center gap-nano';
const infoIcon = 'grid size-[24px] shrink-0 place-items-center rounded-full bg-border text-icon-secondary';
/** Modal "Saber mais" da instituição: banner, nome, descrição e contatos. Fecha pelo X sobre a imagem, por Esc ou fora. */
export function InstitutionDetailModal({ name, description, address, phone, site, image, city, onDonate, trigger, open, defaultOpen, onOpenChange, modal = true }: InstitutionDetailModalProps) {
  const [all, setAll] = React.useState(false);
  const long = description.length > 160;
  const contact = 'grid grid-cols-[auto_1fr] items-center gap-micro';
  const disc = 'grid size-[36px] place-items-center rounded-full bg-surface-tint-peach text-text-link';
  return (
    <Sheet open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange} modal={modal}>
      {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
      <SheetContent side="bottom" handle={false} className="max-h-[92dvh] gap-0 overflow-y-auto rounded-t-xl bg-background p-0">
        <div className="relative grid h-[132px] shrink-0 place-items-center bg-surface-tint-peach">
          {image
            ? <img src={image} alt="" className="size-full object-cover" />
            : <span aria-hidden className="grid size-[64px] place-items-center rounded-full bg-surface-primary text-text-link"><Icon name="heart" size="large" /></span>}
          <SheetClose aria-label="Fechar" className={cn(focusRing, 'absolute right-micro top-micro grid size-touch cursor-pointer place-items-center rounded-full border-0 bg-surface-primary text-foreground shadow-card')}>
            <Icon name="close" size="small" />
          </SheetClose>
        </div>
        <div className="grid gap-micro p-xsmall">
          {city && <p className="caption m-0 inline-flex items-center gap-xnano justify-self-start rounded-full bg-surface-tint-peach px-nano py-[2px] font-bold text-text-link"><Icon name="pin" size="small" />{city}</p>}
          <SheetTitle className="screen-title !text-[18px] !font-bold !leading-6 m-0 text-left">{name}</SheetTitle>
          <div className="grid gap-xnano">
            <SheetDescription className={cn('m-0 text-left !text-[13px] !leading-5 text-muted-foreground', long && !all && 'line-clamp-4')}>{description}</SheetDescription>
            {long && <button type="button" aria-expanded={all} onClick={() => setAll((v) => !v)} className={cn(focusRing, 'caption min-h-touch justify-self-start rounded-xs border-0 bg-transparent p-0 font-bold text-text-link')}>{all ? 'Ler menos' : 'Ler mais'}</button>}
          </div>
          {(address || phone || site) && (
            <ul className="body-small m-0 grid list-none gap-micro rounded-lg bg-card p-micro text-card-foreground shadow-card">
              {address && <li className={contact}><span aria-hidden className={disc}><Icon name="pin" size="small" /></span>{address}</li>}
              {phone && <li className={contact}><span aria-hidden className={disc}><Icon name="phone" size="small" /></span><a href={`tel:${phone.replace(/\D/g, '')}`} className={cn(focusRing, hitAreaY, 'rounded-xs text-inherit no-underline')}>{phone}</a></li>}
              {site && <li className={contact}><span aria-hidden className={disc}><Icon name="globe" size="small" /></span><a href={site.startsWith('http') ? site : `https://${site}`} className={cn(focusRing, hitAreaY, 'break-all rounded-xs text-inherit no-underline')}>{site.replace(/^https?:\/\//, '')}</a></li>}
            </ul>
          )}
          {onDonate && <Button fullWidth icon="heart" onClick={onDonate}>Doar para esta instituição</Button>}
        </div>
      </SheetContent>
    </Sheet>
  );
}
