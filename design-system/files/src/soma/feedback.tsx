/* So+ma · feedback: Modal, Toast, Message, EmptyState, ResultScreen. */
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Toaster as SonnerToaster, toast as sonnerToast } from 'sonner';
import { cn } from '../lib/utils';
import { Icon, type IconName } from '../ui/icon';
import { Button, IconButton } from '../ui/button';
import { Alert, AlertTitle, AlertDescription } from '../ui/display';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/overlay';

/* ----------------------------------------------------------------- Modal */

export interface ModalProps {
  title: string;
  /** Texto curto (até três linhas) ou conteúdo, como um RadioList. */
  children?: React.ReactNode;
  art?: React.ReactNode;
  actionLabel: string;
  onAction?: () => void;
  actionDisabled?: boolean;
  /** Elemento que abre o modal (vira Dialog.Trigger). */
  trigger?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** false esconde o X; use quando a única saída for a ação. */
  dismissible?: boolean;
  /** false = sem película nem bloqueio de rolagem (Radix Dialog modal). Padrão true. */
  modal?: boolean;
}
/** Confirmação ou escolha com uma ação, sobre Radix Dialog: foco preso, Esc fecha, foco volta ao gatilho. */
export function Modal({ title, children, art, actionLabel, onAction, actionDisabled, trigger, open, defaultOpen, onOpenChange, dismissible = true, modal = true }: ModalProps) {
  return (
    <Dialog open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange} modal={modal}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent showClose={dismissible} onEscapeKeyDown={dismissible ? undefined : (e) => e.preventDefault()} onInteractOutside={dismissible ? undefined : (e) => e.preventDefault()}>
        {art && <div className="grid min-h-[120px] place-items-center rounded-md bg-surface-accent text-icon-brand-strong">{art}</div>}
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {typeof children === 'string' && <DialogDescription>{children}</DialogDescription>}
        </DialogHeader>
        {children != null && typeof children !== 'string' && <div className="text-left">{children}</div>}
        <DialogFooter>
          <Button fullWidth disabled={actionDisabled} onClick={onAction}>{actionLabel}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ----------------------------------------------------------------- Toast */

export const toastVariants = cva('flex items-center gap-nano rounded-sm px-mini py-micro text-text-inverse', {
  variants: {
    /** error = erro (padrão) · success = confirmação ("Código copiado", "Entrega agendada") · info = aviso neutro. */
    kind: { error: 'bg-destructive', success: 'bg-surface-inverse', info: 'bg-surface-inverse' },
    /** ax = vermelho acessível (padrão) · app = vermelho atual do app (4,21:1, reprova). Só vale para error. */
    tone: { ax: '', app: '' },
  },
  compoundVariants: [{ kind: 'error', tone: 'app', className: 'bg-[var(--danger)]' }],
  defaultVariants: { kind: 'error', tone: 'ax' },
});
export interface ToastProps extends VariantProps<typeof toastVariants> {
  message: string;
  /** Mostra o X para dispensar. */
  onDismiss?: () => void;
}
const TOAST_ICON = { error: 'circle-x', success: 'circle-check', info: 'info' } as const;
/** Visual do aviso passageiro. No app, renderize dentro do provedor de toast (Radix Toast ou Sonner) que cuida de tempo e fila. */
export function Toast({ message, kind = 'error', tone, onDismiss }: ToastProps) {
  const k = kind ?? 'error';
  return (
    <div role={k === 'error' ? 'alert' : 'status'} className={toastVariants({ kind: k, tone })}>
      <Icon name={TOAST_ICON[k]} className={k === 'success' ? 'text-feedback-fill-positive' : undefined} />
      <p className="label m-0 flex-1">{message}</p>
      {onDismiss && <IconButton icon="close" label="Dispensar" onClick={onDismiss} className="-my-micro -mr-nano text-text-inverse hover:bg-transparent active:bg-transparent" />}
    </div>
  );
}

/* ------------------------------------------------------ Toaster / notify */

export type ToasterProps = React.ComponentProps<typeof SonnerToaster>;
/** Provedor de avisos (shadcn Sonner): cuida de fila, tempo, gesto de dispensar e anúncio. Monte uma vez na raiz do app. */
export function Toaster({ position = 'bottom-center', offset = 96, mobileOffset = 96, ...props }: ToasterProps) {
  return <SonnerToaster position={position} offset={offset} mobileOffset={mobileOffset} visibleToasts={2} containerAriaLabel="Avisos" toastOptions={{ unstyled: true, className: 'w-full' }} {...props} />;
}
export interface NotifyOptions {
  /** error = erro (padrão: fica 6s) · success e info ficam 4s. */
  kind?: 'error' | 'success' | 'info';
  duration?: number;
  /** false tira o X de dispensar. */
  dismissible?: boolean;
}
/** Dispara um aviso com o visual do Toast do So+ma. Ex.: `notify('Entrega agendada', { kind: 'success' })`. */
export function notify(message: string, { kind = 'error', duration, dismissible = true }: NotifyOptions = {}) {
  return sonnerToast.custom(
    (id) => <Toast kind={kind} message={message} onDismiss={dismissible ? () => sonnerToast.dismiss(id) : undefined} />,
    { duration: duration ?? (kind === 'error' ? 6000 : 4000) },
  );
}

/* --------------------------------------------------------------- Message */

export interface MessageProps {
  tone?: 'informative' | 'positive' | 'caution' | 'negative';
  title?: string;
  children: React.ReactNode;
  action?: { label: string; onClick?: () => void };
}
const MSG_ICON: Record<NonNullable<MessageProps['tone']>, IconName> = { informative: 'info', positive: 'circle-check', caution: 'clock', negative: 'alert' };
/** Mensagem em linha que fica na tela (shadcn Alert + Message do Andes). */
export function Message({ tone = 'informative', title, children, action }: MessageProps) {
  return (
    <Alert tone={tone}>
      <Icon name={MSG_ICON[tone]} />
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription>{children}</AlertDescription>
      {action && <div className="col-start-2 -ml-nano"><Button hierarchy="transparent" onClick={action.onClick}>{action.label}</Button></div>}
    </Alert>
  );
}

/* ------------------------------------------------------------ EmptyState */

export interface EmptyStateProps {
  title: string;
  description: string;
  /** Ícone ou ilustração. Por padrão entra num círculo creme de 160px. */
  art?: React.ReactNode;
  /** false = mostra a `art` solta, sem o círculo (ilustração larga, como a do ranking vazio). */
  artFrame?: boolean;
  action?: { label: string; icon?: IconName; onClick?: () => void };
  className?: string;
}
export function EmptyState({ title, description, art, artFrame = true, action, className }: EmptyStateProps) {
  return (
    <section className={cn('flex flex-col items-center gap-mini px-mini py-large text-center text-foreground', className)}>
      {artFrame
        ? <div className="grid size-[160px] place-items-center rounded-full bg-surface-accent text-icon-brand-strong">{art ?? <Icon name="search" size="xlarge" />}</div>
        : art}
      <p className="page-title m-0">{title}</p>
      <p className="body m-0 max-w-[280px] text-muted-foreground">{description}</p>
      {action && <Button hierarchy="quiet" fullWidth icon={action.icon} onClick={action.onClick}>{action.label}</Button>}
    </section>
  );
}

/* ------------------------------------------------------------ ResultScreen */

export interface ResultScreenProps {
  /** positive = deu certo (check verde) · negative = não deu (×) · neutral = aviso ou pedido (ícone livre). */
  tone?: 'positive' | 'negative' | 'neutral';
  icon?: IconName;
  /** Arte no lugar do ícone (ilustração, selo de nível). */
  art?: React.ReactNode;
  title: string;
  description?: React.ReactNode;
  /** Conteúdo extra entre o texto e as ações (resumo, código, pontos). */
  children?: React.ReactNode;
  primaryAction?: { label: string; onClick?: () => void; icon?: IconName };
  secondaryAction?: { label: string; onClick?: () => void; icon?: IconName };
  /** "Ir para o início": obrigatório em tela de conclusão de fluxo. */
  onHome?: () => void;
  className?: string;
}
const RESULT = {
  positive: { icon: 'circle-check', ring: 'bg-feedback-fill-positive text-feedback-text-positive' },
  negative: { icon: 'circle-x', ring: 'bg-feedback-fill-negative text-feedback-text-negative' },
  neutral: { icon: 'info', ring: 'bg-surface-accent text-icon-brand-strong' },
} as const;
/** Tela de resultado ou pedido (sucesso, erro, permissão de contatos). Ícone a space-large do cabeçalho; ações no fim. */
export function ResultScreen({ tone = 'positive', icon, art, title, description, children, primaryAction, secondaryAction, onHome, className }: ResultScreenProps) {
  const r = RESULT[tone];
  const tid = React.useId();
  return (
    <section aria-labelledby={tid} className={cn('flex min-h-full flex-col gap-medium px-xsmall pb-small pt-large text-foreground', className)}>
      <div className="grid justify-items-center gap-mini text-center">
        {art ?? <span className={cn('grid size-[96px] place-items-center rounded-full', r.ring)}><Icon name={icon ?? r.icon} size="xlarge" /></span>}
        <h1 id={tid} className="page-title m-0">{title}</h1>
        {description && <div className="body m-0 max-w-[320px] text-muted-foreground">{description}</div>}
      </div>
      {children}
      {(primaryAction || secondaryAction || onHome) && (
        <div className="mt-auto grid gap-nano">
          {primaryAction && <Button fullWidth icon={primaryAction.icon} onClick={primaryAction.onClick}>{primaryAction.label}</Button>}
          {secondaryAction && <Button hierarchy="quiet" fullWidth icon={secondaryAction.icon} onClick={secondaryAction.onClick}>{secondaryAction.label}</Button>}
          {onHome && <Button hierarchy="transparent" fullWidth onClick={onHome}>Ir para o início</Button>}
        </div>
      )}
    </section>
  );
}
