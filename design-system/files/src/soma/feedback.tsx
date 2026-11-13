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
  /** Ícone próprio ("user-plus", "arrow-up"). Com `surface="card"` ele vai num círculo de 32px. */
  icon?: IconName;
  /** inverse = barra escura (padrão) · card = cartão claro com ícone em círculo creme, para novidades do ranking ("Ana Souza entrou no seu ranking de amigos!"). */
  surface?: 'inverse' | 'card';
}
const TOAST_ICON = { error: 'circle-x', success: 'circle-check', info: 'info' } as const;
/** Visual do aviso passageiro. No app, renderize dentro do provedor de toast (Radix Toast ou Sonner) que cuida de tempo e fila. */
export function Toast({ message, kind = 'error', tone, onDismiss, icon, surface = 'inverse' }: ToastProps) {
  const k = kind ?? 'error';
  if (surface === 'card') {
    return (
      <div role="status" className="flex items-center gap-micro rounded-lg border border-border bg-card py-nano pl-nano pr-mini text-card-foreground">
        <span aria-hidden className="grid size-[32px] shrink-0 place-items-center rounded-full bg-surface-accent text-icon-brand-strong"><Icon name={icon ?? TOAST_ICON[k]} /></span>
        <p className="label m-0 flex-1">{message}</p>
        {onDismiss && <IconButton icon="close" label="Dispensar" onClick={onDismiss} />}
      </div>
    );
  }
  return (
    <div role={k === 'error' ? 'alert' : 'status'} className={toastVariants({ kind: k, tone })}>
      <Icon name={icon ?? TOAST_ICON[k]} className={!icon && k === 'success' ? 'text-feedback-fill-positive' : undefined} />
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
  icon?: IconName;
  surface?: 'inverse' | 'card';
  /** Onde aparece. As novidades do ranking (Telas 5 e 10) vêm no topo; os demais avisos, embaixo. */
  position?: 'top-center' | 'bottom-center';
}
/** Dispara um aviso com o visual do Toast do So+ma. Ex.: `notify('Entrega agendada', { kind: 'success' })`. */
export function notify(message: string, { kind = 'error', duration, dismissible = true, icon, surface, position }: NotifyOptions = {}) {
  return sonnerToast.custom(
    (id) => <Toast kind={kind} icon={icon} surface={surface} message={message} onDismiss={dismissible ? () => sonnerToast.dismiss(id) : undefined} />,
    { duration: duration ?? (kind === 'error' ? 6000 : 4000), ...(position ? { position } : {}) },
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
  /** true = círculo creme de 160px (padrão) · 'rect' = retângulo cinza de 240×160 (Meu espaço antes da 1ª entrega) · false = `art` solta, sem moldura (ilustração larga, como a do ranking vazio). */
  artFrame?: boolean | 'rect';
  action?: { label: string; icon?: IconName; onClick?: () => void; /** loud = botão cheio (padrão do redesign) · quiet = contornado. */ hierarchy?: 'loud' | 'quiet' };
  /** Segunda saída, contornada, abaixo da principal ("Adicionar amigo por código"). */
  secondaryAction?: { label: string; icon?: IconName; onClick?: () => void };
  className?: string;
}
export function EmptyState({ title, description, art, artFrame = true, action, secondaryAction, className }: EmptyStateProps) {
  return (
    <section className={cn('flex flex-col items-center gap-mini px-mini py-large text-center text-foreground', className)}>
      {artFrame === 'rect'
        ? <div className="grid h-[160px] w-[240px] max-w-full place-items-center rounded-lg bg-surface-secondary text-muted-foreground">{art ?? <Icon name="search" size="xlarge" />}</div>
        : artFrame
          ? <div className="grid size-[160px] place-items-center rounded-full bg-surface-accent text-icon-brand-strong">{art ?? <Icon name="search" size="xlarge" />}</div>
          : art}
      <p className="page-title m-0 whitespace-pre-line">{title}</p>
      <p className="body m-0 max-w-[280px] text-muted-foreground">{description}</p>
      {(action || secondaryAction) && (
        <div className="mt-mini grid w-full gap-nano">
          {action && <Button hierarchy={action.hierarchy ?? 'loud'} fullWidth icon={action.icon} onClick={action.onClick}>{action.label}</Button>}
          {secondaryAction && <Button hierarchy="quiet" fullWidth icon={secondaryAction.icon} onClick={secondaryAction.onClick}>{secondaryAction.label}</Button>}
        </div>
      )}
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
  /** done = já feito: botão cinza com check e sem toque ("Adicionado ao calendário"). */
  primaryAction?: { label: string; onClick?: () => void; icon?: IconName; done?: boolean };
  /** quiet = botão contornado (padrão) · transparent = link em texto ("Agora não", "Voltar ao ranking"). */
  secondaryAction?: { label: string; onClick?: () => void; icon?: IconName; hierarchy?: 'quiet' | 'transparent' };
  /** Segundo link em texto ao lado de "Ir para o início" ("Ver meus agendamentos"). */
  extraLink?: { label: string; onClick?: () => void };
  /** circle = círculo (padrão) · square = caixa de 56px com cantos de 16px, para telas de confirmação menores (agendamento). */
  iconShape?: 'circle' | 'square';
  /** page = título de 24px (padrão) · screen = 20px. */
  titleSize?: 'page' | 'screen';
  /** Contorno de 3px em laranja no círculo (Cadastro concluído). Só com `iconShape="circle"`. */
  ringOutline?: boolean;
  /** Tamanho do círculo do ícone: sm 72px (Pedido enviado!) · md 88px (permissão de contatos) · lg 96px (padrão). */
  ringSize?: 'sm' | 'md' | 'lg';
  /** inline = ações logo abaixo do texto, com o conteúdo no topo (Telas 12, 14 e 16) · bottom = ações no fim da tela (padrão). */
  actionsPlacement?: 'bottom' | 'inline';
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
const RING = { sm: 'size-[72px]', md: 'size-[88px]', lg: 'size-[96px]' } as const;
export function ResultScreen({ tone = 'positive', icon, art, title, description, children, primaryAction, secondaryAction, extraLink, iconShape = 'circle', titleSize = 'page', ringOutline, ringSize = 'lg', actionsPlacement = 'bottom', onHome, className }: ResultScreenProps) {
  const r = RESULT[tone];
  const tid = React.useId();
  return (
    <section aria-labelledby={tid} className={cn('flex min-h-full flex-col gap-medium px-xsmall pb-small pt-large text-foreground', className)}>
      <div className="grid justify-items-center gap-mini text-center">
        {art ?? (iconShape === 'square'
          ? <span className={cn('grid size-[56px] place-items-center rounded-lg', r.ring)}><Icon name={icon ?? r.icon} size="large" /></span>
          : <span className={cn('grid place-items-center rounded-full', RING[ringSize], r.ring, ringOutline && 'border-[3px] border-border-highlight')}><Icon name={icon ?? r.icon} size="xlarge" /></span>)}
        <h1 id={tid} className={cn(titleSize === 'screen' ? 'screen-title' : 'page-title', 'm-0')}>{title}</h1>
        {description && <div className="body m-0 max-w-[320px] text-muted-foreground">{description}</div>}
      </div>
      {children}
      {(primaryAction || secondaryAction || onHome) && (
        <div className={cn('grid gap-nano', actionsPlacement === 'bottom' && 'mt-auto')}>
          {primaryAction && (primaryAction.done
            ? <Button fullWidth disabled icon="check" className="disabled:bg-interactive-fill-disabled disabled:text-foreground disabled:[&_svg]:text-foreground disabled:opacity-100">{primaryAction.label}</Button>
            : <Button fullWidth icon={primaryAction.icon} onClick={primaryAction.onClick}>{primaryAction.label}</Button>)}
          {secondaryAction && <Button hierarchy={secondaryAction.hierarchy ?? 'quiet'} fullWidth icon={secondaryAction.icon} onClick={secondaryAction.onClick}>{secondaryAction.label}</Button>}
          {(onHome || extraLink) && (
            <div className="flex flex-wrap items-center justify-center gap-x-mini">
              {extraLink && <Button hierarchy="transparent" onClick={extraLink.onClick}>{extraLink.label}</Button>}
              {onHome && <Button hierarchy="transparent" fullWidth={!extraLink} onClick={onHome}>Ir para o início</Button>}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
