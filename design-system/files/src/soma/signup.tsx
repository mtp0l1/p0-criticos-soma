/* So+ma · Cadastro: SignupStep, TermsConsent, InviteCodeField, NeighborhoodNote, AccountExistsSheet, InviteMessageExample, InviteCodeHelpSheet. */
import * as React from 'react';
import { cn, tintBg } from '../lib/utils';
import { Button, IconButton } from '../ui/button';
import { Icon, type IconName } from '../ui/icon';
import { Checkbox } from '../ui/form';
import { Field, FieldLabel } from '../ui/controls';
import { Sheet, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '../ui/overlay';
import { TextField } from './forms';

/* -------------------------------------------------------------- SignupStep */

export interface SignupStepProps {
  /** Título do passo ("Qual é o seu celular?"), em `page-title`. */
  title: string;
  /** Linha de apoio abaixo do título. */
  description?: string;
  /** Ícone do passo, em tile pêssego acima do título (user, id-card, phone…). */
  icon?: IconName;
  /** Volta ao passo anterior (disco à esquerda). Sem ele, o botão não aparece. */
  onBack?: () => void;
  /** Abre a ajuda (disco à direita). Sem ele, o botão não aparece. */
  onHelp?: () => void;
  /** Blocos do passo (campos, aceite). Agrupe os campos de um mesmo bloco numa `div` com `grid gap-nano`. */
  children?: React.ReactNode;
  /** Botão "Continuar" (ou "Criar minha conta"). Fica fixo no pé da tela, 56px de altura. */
  action?: React.ReactNode;
  className?: string;
}
const stepDisc = 'size-touch rounded-full bg-surface-primary text-foreground shadow-card hover:bg-surface-secondary active:bg-surface-secondary-hover';
/** Passo do cadastro (v2): topo com Voltar e Ajuda; tile de ícone, título e campos; o botão fica fixo no pé da tela. Um dado por tela. Não leva `Header` nem indicador de progresso. */
export function SignupStep({ title, description, icon, onBack, onHelp, children, action, className }: SignupStepProps) {
  return (
    <main className={cn('flex min-h-full flex-col px-xsmall pb-small pt-nano', className)}>
      <header className="flex min-h-header items-center justify-between gap-nano">
        {onBack ? <IconButton icon="chevron-left" label="Voltar" onClick={onBack} className={stepDisc} /> : <span />}
        {onHelp ? <IconButton icon="help" label="Ajuda" onClick={onHelp} className={stepDisc} /> : <span />}
      </header>
      <div className="grid content-start gap-small pt-large">
        {icon && <span aria-hidden className={cn('grid size-[56px] place-items-center rounded-full text-text-link', tintBg.peach)}><Icon name={icon} size="large" /></span>}
        <div className="grid gap-nano">
          <h2 className="page-title m-0">{title}</h2>
          {description && <p className="body-small m-0 text-muted-foreground">{description}</p>}
        </div>
        {children}
      </div>
      {action && <div className="mt-auto pt-large">{action}</div>}
    </main>
  );
}

/* ------------------------------------------------------------ TermsConsent */

export interface TermsConsentProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  regulationHref?: string;
  privacyHref?: string;
  className?: string;
}
const termLink = 'text-text-link underline underline-offset-2';
/** Aceite do regulamento e aviso de privacidade do último passo. "Criar minha conta" só fica ativo com o aceite marcado. */
export function TermsConsent({ checked, onCheckedChange, regulationHref = '#regulamento', privacyHref = '#privacidade', className }: TermsConsentProps) {
  const id = React.useId();
  return (
    <div className={cn('grid gap-mini', className)}>
      <Field orientation="horizontal">
        <Checkbox id={id} checked={checked} onCheckedChange={(v) => onCheckedChange(v === true)} />
        <FieldLabel htmlFor={id}>Declaro que li e estou de acordo com o <a href={regulationHref} className={termLink}>Regulamento do programa</a>.</FieldLabel>
      </Field>
      <p className="body-small m-0 text-foreground">Acesse a nossa <a href={privacyHref} className={termLink}>Política de Privacidade</a> para informações sobre como tratamos os seus Dados Pessoais.</p>
    </div>
  );
}

/* --------------------------------------------------------- InviteCodeField */

export interface InviteCodeFieldProps {
  value: string;
  onChange: (v: string) => void;
  /** Mostra "Código aplicado" com check. */
  applied?: boolean;
  /** Mensagem de código inválido ou expirado (texto ainda não definido no Figma). */
  error?: string;
  /** Abre a folha "Onde encontro o código?". */
  onHelp?: () => void;
}
/** Campo opcional de código de convite com o estado "Código aplicado" e o link "Onde encontro o código?". */
export function InviteCodeField({ value, onChange, applied, error, onHelp }: InviteCodeFieldProps) {
  const ok = applied && !error;
  return (
    <div className="grid gap-nano">
      <TextField label="Código de convite (opcional)" placeholder="Ex.: REC7X4KP" autoCapitalize="characters" autoComplete="off" value={value} onChange={(v) => onChange(v.toUpperCase())} error={error}
        trailing={ok ? <span aria-hidden className="mr-nano grid size-[24px] place-items-center rounded-full bg-feedback-text-positive text-text-inverse"><Icon name="check" size="small" /></span> : undefined} />
      {ok && <p role="status" className="body-small m-0 font-bold text-feedback-text-positive">Código aplicado</p>}
      {onHelp && <Button hierarchy="transparent" className="justify-self-start px-0" onClick={onHelp}>Onde encontro o código? →</Button>}
    </div>
  );
}

/* --------------------------------------------------------- NeighborhoodNote */

export interface NeighborhoodNoteProps {
  /** Rua do CEP ("Rua Pires da Mota"). Sem ela, o bairro vira o título. */
  street?: string;
  /** Bairro ("Aclimação"). */
  neighborhood: string;
  /** Cidade e UF ("São Paulo, SP"). */
  city?: string;
  /** Toque no lápis: volta ao CEP para corrigir. Sem ele, o lápis não aparece. */
  onFix?: () => void;
}
/** Endereço encontrado pelo CEP: cartão neutro com o pino, a rua e "bairro · cidade", e um lápis redondo para corrigir. Aparece quando o CEP completa 8 dígitos. Informa, não comemora: não use verde nem check. */
export function NeighborhoodNote({ street, neighborhood, city, onFix }: NeighborhoodNoteProps) {
  const title = street ?? neighborhood;
  const sub = street ? [neighborhood, city].filter(Boolean).join(' · ') : city;
  return (
    <div role="status" className="flex items-center gap-micro rounded-xl bg-surface-secondary p-[14px] text-foreground motion-safe:animate-[soma-rise_.24s_cubic-bezier(.2,.8,.2,1)_both]">
      <span aria-hidden className="grid size-[40px] shrink-0 place-items-center rounded-full bg-surface-primary shadow-card"><Icon name="pin" tone="brand-strong" /></span>
      <span className="grid min-w-0 flex-1 gap-0">
        <span className="label truncate">{title}</span>
        {sub && <span className="body-small truncate text-muted-foreground">{sub}</span>}
      </span>
      {onFix && <IconButton icon="pencil" label="Corrigir endereço" onClick={onFix} className="size-touch shrink-0 rounded-full bg-surface-primary text-icon-brand-strong shadow-card hover:bg-surface-primary active:bg-surface-primary" />}
    </div>
  );
}

/* ------------------------------------------------------------ sheet shared */

interface SignupSheetProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** false = sem película (só para exemplos incorporados na página). */
  modal?: boolean;
  trigger?: React.ReactNode;
}
const sheetCls = 'gap-small rounded-t-xl bg-background px-xsmall pb-medium pt-small';

/* -------------------------------------------------------- AccountExistsSheet */

export interface AccountExistsSheetProps extends SignupSheetProps {
  /** Número já cadastrado, como foi digitado: "(11) 98765-4321". */
  phone: string;
  onSignIn?: () => void;
  onUseOther?: () => void;
}
/** Folha "O (11) 98765-4321 já tem uma conta" (Tela 04A): Entrar na minha conta ou Usar outro número. Sem alça e sem X: as duas ações fecham. */
export function AccountExistsSheet({ phone, onSignIn, onUseOther, open, defaultOpen, onOpenChange, modal = true, trigger }: AccountExistsSheetProps) {
  return (
    <Sheet open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange} modal={modal}>
      {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
      <SheetContent side="bottom" className={sheetCls}>
        <SheetHeader className="gap-nano text-left">
          <span aria-hidden className="grid size-[48px] place-items-center rounded-full bg-surface-tint-peach text-text-link"><Icon name="phone" /></span>
          <SheetTitle className="screen-title !text-[18px] !font-bold !leading-6 m-0 text-left">O {phone} já tem uma conta</SheetTitle>
          <SheetDescription className="body-small m-0 text-left text-muted-foreground">Entre na sua conta ou cadastre outro número.</SheetDescription>
        </SheetHeader>
        <div className="grid gap-nano">
          <SheetClose asChild><Button fullWidth onClick={onSignIn}>Entrar na minha conta</Button></SheetClose>
          <SheetClose asChild><Button fullWidth hierarchy="quiet" onClick={onUseOther} className="bg-surface-secondary shadow-none">Usar outro número</Button></SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}

/* ------------------------------------------------------- InviteMessageExample */

export interface InviteMessageExampleProps {
  /** Quem mandou (padrão "Ana"). */
  sender?: string;
  /** Código destacado na mensagem. */
  code?: string;
  className?: string;
}
/** Simulação de conversa que mostra onde está o código dentro da mensagem de convite. Ilustração: o leitor de tela recebe a mensagem inteira. */
export function InviteMessageExample({ sender = 'Ana', code = 'REC7X4KP', className }: InviteMessageExampleProps) {
  return (
    <div role="img" aria-label={`Exemplo de mensagem de convite de ${sender}: Oi! Estou reciclando e ganhando pontos. Entra comigo usando meu código de convite: ${code}`} className={cn('grid gap-nano rounded-lg bg-surface-secondary p-micro text-foreground', className)}>
      <span className="caption text-muted-foreground">{sender}</span>
      <div className="body-small grid justify-items-start gap-nano rounded-lg bg-surface-primary p-micro">
        <span>Oi! Estou reciclando e ganhando pontos. Entra comigo usando meu código de convite:</span>
        <span className="rounded-md border border-border-highlight bg-surface-tint-peach px-micro py-[6px] font-bold tracking-[0.08em] text-text-link">{code}</span>
      </div>
      <span aria-hidden className="caption font-bold text-text-link">↑ Este é o código</span>
    </div>
  );
}

/* ---------------------------------------------------------- InviteCodeHelpSheet */

export interface InviteCodeHelpSheetProps extends SignupSheetProps {
  sender?: string;
  code?: string;
}
/** Folha "Onde encontro o código?" (Tela 07B): explica e mostra a mensagem de convite de exemplo. "Entendi" fecha. */
export function InviteCodeHelpSheet({ sender, code, open, defaultOpen, onOpenChange, modal = true, trigger }: InviteCodeHelpSheetProps) {
  return (
    <Sheet open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange} modal={modal}>
      {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
      <SheetContent side="bottom" className={sheetCls}>
        <SheetHeader className="gap-nano text-left">
          <SheetTitle className="screen-title !text-[18px] !font-bold !leading-6 m-0 text-left">Onde encontro o código?</SheetTitle>
          <SheetDescription className="body-small m-0 text-left text-muted-foreground">O código vem na mensagem de convite que seu amigo compartilhou com você.</SheetDescription>
        </SheetHeader>
        <InviteMessageExample sender={sender} code={code} />
        <SheetClose asChild><Button fullWidth>Entendi</Button></SheetClose>
      </SheetContent>
    </Sheet>
  );
}
