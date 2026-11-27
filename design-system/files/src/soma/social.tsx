/* So+ma · ranking social e convites: InviteCodeCard, FriendRequestSheet, ContactRow. */
import * as React from 'react';
import { cn } from '../lib/utils';
import { Button } from '../ui/button';
import { Icon } from '../ui/icon';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger, SheetClose } from '../ui/overlay';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/display';

const initials = (n: string) => n.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]!.toUpperCase()).join('');

/* ---------------------------------------------------------- InviteCodeCard */

export interface InviteCodeCardProps {
  code: string;
  /** Chamado depois de copiar; o componente já anuncia "Código copiado". */
  onCopy?: (code: string) => void;
  className?: string;
}
/** "Seu código" de convite com Copiar ao lado (Tela 9). O botão principal da tela é Compartilhar convite. */
export function InviteCodeCard({ code, onCopy, className }: InviteCodeCardProps) {
  const [copied, setCopied] = React.useState(false);
  const copy = async () => {
    try { await navigator.clipboard?.writeText(code); } catch { /* o código continua visível para copiar à mão */ }
    setCopied(true);
    onCopy?.(code);
    window.setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className={cn('grid gap-xnano rounded-lg bg-surface-inverse p-mini text-text-inverse shadow-dark', className)}>
      <div className="flex items-center justify-between gap-nano">
        <p className="eyebrow m-0 uppercase tracking-wide">Seu código</p>
        <Button size="compact" icon={copied ? 'check' : 'copy'} onClick={copy} className="rounded-full shadow-none">{copied ? 'Copiado' : 'Copiar'}</Button>
      </div>
      <p className="m-0 select-all text-center font-sans text-[28px] font-bold leading-10 tracking-[0.08em] text-icon-brand">{code}</p>
      <span aria-live="polite" className="sr-only">{copied ? 'Código copiado' : ''}</span>
    </div>
  );
}

/* ------------------------------------------------------ FriendRequestSheet */

export interface FriendRequestSheetProps {
  /** Quem pediu ("Policarpo"). */
  name: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** false = sem película nem trava de rolagem (só para exemplos incorporados na página). Padrão true. */
  modal?: boolean;
  /** Elemento que abre a folha (opcional; no app ela abre sozinha ao entrar no Ranking). */
  trigger?: React.ReactNode;
  onAccept?: () => void;
  onDecline?: () => void;
}
/**
 * Pedido de amizade recebido (Tela 13): bottom sheet que aparece ao abrir o Ranking, com ícone de 56px,
 * "Policarpo quer adicionar você como amigo no ranking." e os botões "Agora não" e "Aceitar".
 * Não é um banner no topo da lista. Pendente no handoff: o que acontece em "Agora não" e se o pedido expira.
 */
export function FriendRequestSheet({ name, open, defaultOpen, onOpenChange, modal = true, trigger, onAccept, onDecline }: FriendRequestSheetProps) {
  return (
    <Sheet open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange} modal={modal}>
      {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
      <SheetContent side="bottom" className="rounded-t-xl bg-background">
        <SheetHeader className="justify-items-center gap-micro text-center">
          <span aria-hidden className="grid size-[56px] place-items-center rounded-full bg-surface-info text-[18px] font-bold text-foreground">{initials(name).slice(0, 1)}</span>
          <SheetTitle className="screen-title !text-[18px] !font-bold !leading-6 text-center">{name} quer adicionar você como amigo no ranking.</SheetTitle>
          <SheetDescription className="sr-only">Aceite para aparecer no ranking de amigos um do outro.</SheetDescription>
        </SheetHeader>
        <div className="mt-small grid grid-cols-2 gap-micro">
          <SheetClose asChild><Button hierarchy="quiet" fullWidth onClick={onDecline} className="bg-surface-secondary shadow-none">Agora não</Button></SheetClose>
          <SheetClose asChild><Button fullWidth onClick={onAccept}>Aceitar</Button></SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}

/* ------------------------------------------------------------- ContactRow */

export interface ContactRowProps {
  name: string;
  /** Espaço de recebimento do contato ("Vila Verde"). */
  space?: string;
  photo?: string;
  /** idle = botão Convidar · sent = "Convite enviado", sem ação. */
  status?: 'idle' | 'sent';
  onInvite?: () => void;
}
/** Contato que já participa (Tela 15). Use dentro de <ul>. Convidar envia o pedido e vira "Convite enviado". */
export function ContactRow({ name, space, photo, status = 'idle', onInvite }: ContactRowProps) {
  return (
    <li className="grid list-none grid-cols-[auto_1fr_auto] items-center gap-micro rounded-lg bg-card p-micro text-card-foreground shadow-card">
      <Avatar className="size-[40px]">
        {photo && <AvatarImage src={photo} alt="" />}
        <AvatarFallback className="bg-surface-tint-peach text-foreground">{initials(name)}</AvatarFallback>
      </Avatar>
      <span className="grid min-w-0 gap-xnano">
        <span className="body-strong truncate">{name}</span>
        {space && <span className="caption truncate text-muted-foreground">{space}</span>}
      </span>
      {status === 'sent' ? (
        <span className="caption inline-flex min-h-small items-center gap-xnano rounded-full bg-feedback-fill-positive px-micro font-bold text-feedback-text-positive"><Icon name="check" size="small" />Enviado<span className="sr-only">: convite enviado</span></span>
      ) : (
        <Button hierarchy="quiet" size="compact" onClick={onInvite} className="rounded-full border-[1.5px] border-primary shadow-none">Convidar<span className="sr-only"> {name}</span></Button>
      )}
    </li>
  );
}
