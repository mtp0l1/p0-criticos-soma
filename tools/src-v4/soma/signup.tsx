/* So+ma · Cadastro: SignupStep, TermsConsent, InviteCodeField, NeighborhoodNote, AccountExistsSheet, InviteMessageExample, InviteCodeHelpSheet. */
import * as React from 'react';
import { cn } from '../lib/utils';
import { Button } from '../ui/button';
import { Icon } from '../ui/icon';
import { Checkbox } from '../ui/form';
import { Field, FieldLabel } from '../ui/controls';
import { Sheet, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '../ui/overlay';
import { StepDots } from './navigation';
import { TextField } from './forms';

/* -------------------------------------------------------------- SignupStep */

export interface SignupStepProps {
  /** Título do passo ("Qual é o seu celular?"), em `page-title`. */
  title: string;
  /** Linha de apoio abaixo do título. */
  description?: string;
  /** Passo atual, a partir de 1. */
  step: number;
  /** Total de passos (padrão 7). */
  total?: number;
  /** Blocos do passo (campos, aceite). Cada filho fica a 40px do próximo; agrupe campos de um mesmo bloco numa `div` com `grid gap-small`. */
  children?: React.ReactNode;
  /** Botão "Continuar" (ou "Criar minha conta"). Fica 40px abaixo do último bloco, não preso no rodapé. */
  action?: React.ReactNode;
  className?: string;
}
/** Corpo de um passo do cadastro: título, campos, botão e pontos de progresso. Um dado por tela. Vai abaixo do `Header title="Cadastro"`. */
export function SignupStep({ title, description, step, total = 7, children, action, className }: SignupStepProps) {
  return (
    <main className={cn('grid content-start gap-large px-xsmall pb-large pt-small', className)}>
      <div className="grid gap-nano">
        <h2 className="page-title m-0">{title}</h2>
        {description && <p className="body-small m-0 text-muted-foreground">{description}</p>}
      </div>
      {children}
      {action && <div>{action}</div>}
      <StepDots current={step} total={total} />
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
  return (
    <div className="grid gap-nano">
      <TextField label="Código de convite (opcional)" placeholder="Ex.: REC7X4KP" autoCapitalize="characters" autoComplete="off" value={value} onChange={(v) => onChange(v.toUpperCase())} error={error} />
      {applied && !error && <p role="status" className="body-small m-0 flex items-center gap-xnano text-foreground">Código aplicado <Icon name="check" size="small" /></p>}
      {onHelp && <Button hierarchy="transparent" className="justify-self-start px-0" onClick={onHelp}>Onde encontro o código?</Button>}
    </div>
  );
}

/* --------------------------------------------------------- NeighborhoodNote */

export interface NeighborhoodNoteProps {
  /** "Aclimação, São Paulo". */
  neighborhood: string;
  onFix?: () => void;
}
/** Bairro encontrado pelo CEP, com o link "Corrigir". Aparece quando o CEP completa 8 dígitos. */
export function NeighborhoodNote({ neighborhood, onFix }: NeighborhoodNoteProps) {
  return (
    <div role="status" className="grid gap-nano justify-items-start">
      <p className="body-small m-0 text-foreground">Bairro: {neighborhood}</p>
      {onFix && <Button hierarchy="transparent" className="px-0" onClick={onFix}>Corrigir</Button>}
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
const sheetCls = 'gap-small rounded-t-lg bg-surface-secondary px-xsmall pb-medium pt-small';

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
      <SheetContent side="bottom" handle={false} className={sheetCls}>
        <SheetHeader className="gap-nano text-left">
          <SheetTitle className="body m-0 text-left font-bold">O {phone} já tem uma conta</SheetTitle>
          <SheetDescription className="body-small m-0 text-left text-muted-foreground">Entre na sua conta ou cadastre outro número.</SheetDescription>
        </SheetHeader>
        <div className="grid gap-nano">
          <SheetClose asChild><Button fullWidth onClick={onSignIn}>Entrar na minha conta</Button></SheetClose>
          <SheetClose asChild><Button fullWidth hierarchy="quiet" onClick={onUseOther}>Usar outro número</Button></SheetClose>
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
    <div role="img" aria-label={`Exemplo de mensagem de convite de ${sender}: Oi! Estou reciclando e ganhando pontos. Entra comigo usando meu código de convite: ${code}`} className={cn('relative h-[160px] overflow-hidden rounded-md bg-surface-secondary', className)}>
      <span className="caption absolute left-mini top-[9px] text-muted-foreground">{sender}</span>
      <p className="body-small absolute inset-x-mini top-[29px] m-0 grid h-[90px] content-center gap-0 rounded-md bg-surface-primary px-micro text-foreground">
        <span>Oi! Estou reciclando e ganhando pontos.</span>
        <span>Entra comigo usando meu código de</span>
        <span>convite: <mark className="rounded-xs bg-surface-accent px-xnano font-semibold text-foreground">{code}</mark></span>
      </p>
      <svg aria-hidden viewBox="0 0 28 34" className="absolute left-[112px] top-[98px] h-[34px] w-[28px] text-text-link" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2c0 14 8 20 22 26M19 24l6 4-3 6" /></svg>
      <span aria-hidden className="caption absolute left-[146px] top-[132px] font-semibold text-text-link">Este é o código</span>
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
      <SheetContent side="bottom" handle={false} className={cn(sheetCls, 'pb-small')}>
        <SheetHeader className="gap-nano text-left">
          <SheetTitle className="body m-0 text-left font-bold">Onde encontro o código?</SheetTitle>
          <SheetDescription className="body-small m-0 text-left text-muted-foreground">O código vem na mensagem de convite que seu amigo compartilhou com você.</SheetDescription>
        </SheetHeader>
        <InviteMessageExample sender={sender} code={code} />
        <SheetClose asChild><Button fullWidth>Entendi</Button></SheetClose>
      </SheetContent>
    </Sheet>
  );
}
