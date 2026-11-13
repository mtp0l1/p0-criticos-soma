/* So+ma · Doar pontos: InstitutionRow, DonationAmountCard, DonationStateCard, InstitutionDetailModal. */
import * as React from 'react';
import { cn, fmt, focusRing, hitArea } from '../lib/utils';
import { Icon, type IconName } from '../ui/icon';
import { Progress } from '../ui/display';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from '../ui/overlay';
import { pressable, PressableBase } from './navigation';
import { TextField } from './forms';
import { Illustration } from './illustration';

/* ---------------------------------------------------------- InstitutionRow */

export interface InstitutionRowProps {
  name: string;
  description: string;
  /** Ícone da causa (cesta, coração, talheres…). Aparece em quadro de 40px com borda. */
  icon?: IconName;
  href?: string;
  onPress?: () => void;
}
/** Instituição na lista "Escolha para quem você quer doar seus pontos": card cinza tocável com ícone, nome e causa. */
export function InstitutionRow({ name, description, icon = 'heart', href, onPress }: InstitutionRowProps) {
  return (
    <PressableBase
      href={href}
      onClick={onPress}
      className={cn(pressable, 'grid w-full grid-cols-[auto_1fr] items-start gap-micro rounded-lg bg-surface-secondary p-mini text-left text-foreground hover:bg-surface-secondary-hover active:bg-surface-secondary-hover')}
    >
      <span aria-hidden className="grid size-[40px] place-items-center rounded-md border border-foreground bg-surface-secondary"><Icon name={icon} /></span>
      <span className="grid gap-xnano">
        <span className="label">{name}</span>
        <span className="body-small text-muted-foreground">{description}</span>
      </span>
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
  className?: string;
}
/** Cartão "Quantos pontos deseja doar?": saldo, campo numérico de inteiros e mensagem de erro embaixo (Tela de doação). */
export function DonationAmountCard({ balance, value, onChange, error, className }: DonationAmountCardProps) {
  const msg = error ?? donationError(value, balance);
  return (
    <section aria-label="Quantidade a doar" className={cn('grid gap-mini rounded-xl border border-border bg-card p-mini text-card-foreground', className)}>
      <div className="grid gap-xnano">
        <h2 className="body-strong m-0">Quantos pontos deseja doar?</h2>
        <p className="caption m-0 font-medium text-muted-foreground">Você tem <b className="font-semibold text-text-link">{fmt(balance)} {balance === 1 ? 'ponto' : 'pontos'}</b></p>
      </div>
      <TextField
        label="Quantidade de pontos"
        inputMode="numeric"
        autoComplete="off"
        placeholder="Digite um número"
        value={value === null ? '' : fmt(value)}
        onChange={(v) => { const d = v.replace(/\D/g, '').slice(0, 9); onChange(d === '' ? null : parseInt(d, 10)); }}
        error={msg}
      />
    </section>
  );
}

/* ------------------------------------------------------- DonationStateCard */

export interface DonationStateCardProps {
  title: string;
  description: string;
  /** Mostra a barra "150 / 500 pontos" (pontos insuficientes para a instituição). */
  progress?: { points: number; goal: number };
  /** Arte de 80px. Padrão: a ilustração `doar-saldo-insuficiente` (reciclagem em círculo cinza). */
  art?: React.ReactNode;
  className?: string;
}
/** Estado no lugar do campo de doação: "Você ainda não tem pontos" (saldo zero) e "Pontos insuficientes" (com barra de progresso). */
export function DonationStateCard({ title, description, progress, art, className }: DonationStateCardProps) {
  const pct = progress && progress.goal > 0 ? Math.min(100, (progress.points / progress.goal) * 100) : 0;
  return (
    <section aria-label={title} className={cn('grid justify-items-center gap-mini rounded-xl border border-border bg-card px-mini py-medium text-center text-card-foreground', className)}>
      {art ?? <Illustration name="doar-saldo-insuficiente" />}
      <div className="grid gap-nano">
        <h2 className="subtitle m-0 font-semibold">{title}</h2>
        <p className="body-small m-0 text-muted-foreground">{description}</p>
      </div>
      {progress && (
        <div className="grid w-full gap-nano">
          <Progress value={pct} label="Pontos para doar a esta instituição" />
          <p className="caption m-0 text-right font-medium text-muted-foreground">{fmt(progress.points)} / {fmt(progress.goal)} pontos</p>
        </div>
      )}
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
  /** Banner de 160px de altura. Sem ele, aparece um quadro cinza com o ícone da causa. */
  image?: string;
  trigger?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** false = sem película (use só em exemplos). */
  modal?: boolean;
}
const infoRow = 'flex items-center gap-nano';
const infoIcon = 'grid size-[24px] shrink-0 place-items-center rounded-full bg-border text-icon-secondary';
/** Modal "Saber mais" da instituição (Radix Dialog): banner, nome, descrição e contatos. Fecha pelo X sobre a imagem, por Esc ou fora. */
export function InstitutionDetailModal({ name, description, address, phone, site, image, trigger, open, defaultOpen, onOpenChange, modal = true }: InstitutionDetailModalProps) {
  return (
    <Dialog open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange} modal={modal}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent showClose={false} className="max-w-[320px] gap-0 overflow-hidden rounded-lg p-0 pt-0">
        <div className="relative h-[160px] bg-surface-secondary">
          {image
            ? <img src={image} alt="" className="size-full object-cover" />
            : <span aria-hidden className="grid size-full place-items-center text-icon-brand-strong"><Icon name="hand-heart" size="xlarge" /></span>}
          <DialogClose
            aria-label="Fechar"
            className={cn(hitArea, focusRing, 'absolute right-nano top-nano grid size-[32px] place-items-center rounded-full border border-border bg-white/90 text-foreground')}
          >
            <Icon name="close" size="small" />
          </DialogClose>
        </div>
        <div className="grid gap-mini p-xsmall">
          <DialogTitle className="screen-title">{name}</DialogTitle>
          <DialogDescription className="body-small m-0 text-left text-muted-foreground">{description}</DialogDescription>
          {(address || phone || site) && (
            <>
              <hr className="m-0 border-0 border-t border-border" />
              <ul className="m-0 grid list-none gap-nano p-0 body-small text-muted-foreground">
                {address && <li className={infoRow}><span aria-hidden className={infoIcon}><Icon name="pin" size="small" /></span>{address}</li>}
                {phone && <li className={infoRow}><span aria-hidden className={infoIcon}><Icon name="phone" size="small" /></span><a href={`tel:${phone.replace(/\D/g, '')}`} className={cn(focusRing, 'rounded-xs text-inherit')}>{phone}</a></li>}
                {site && <li className={infoRow}><span aria-hidden className={infoIcon}><Icon name="globe" size="small" /></span><a href={site.startsWith('http') ? site : `https://${site}`} className={cn(focusRing, 'rounded-xs font-medium text-foreground underline underline-offset-2')}>{site.replace(/^https?:\/\//, '')}</a></li>}
              </ul>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
