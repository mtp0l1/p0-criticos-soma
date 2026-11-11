/* So+ma · busca e formulários: SearchField, TextField, ChoiceChips, RadioList, MaterialResult, HelpfulVote. */
import * as React from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import { cn, focusRing } from '../lib/utils';
import { Icon, type IconName } from '../ui/icon';
import { IconButton } from '../ui/button';
import { Input, Label, RadioGroup, RadioGroupItem, type InputProps } from '../ui/form';
import { Thumb, Tag, type ThumbProps } from './account';

/* ------------------------------------------------------------ SearchField */

export interface SearchFieldProps extends Omit<InputProps, 'onChange' | 'value'> {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  onClear?: () => void;
  /** strong = borda acessível (padrão) · app = borda clara como hoje no app. */
  border?: 'strong' | 'app';
}
export function SearchField({ label, value, onChange, onClear, border = 'strong', placeholder = 'Buscar material', className, ...props }: SearchFieldProps) {
  return (
    <div role="search" className={cn('relative', className)}>
      <Icon name="search" tone="brand" className="pointer-events-none absolute left-mini top-1/2 -translate-y-1/2" />
      <Input
        {...props}
        type="search"
        aria-label={label}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
        className={cn('pl-xlarge pr-xlarge [&::-webkit-search-cancel-button]:hidden', border === 'app' && 'border-border')}
      />
      {value && (
        <IconButton icon="close" label="Limpar busca" className="absolute right-xnano top-1/2 -translate-y-1/2 text-icon-secondary" onClick={() => (onClear ? onClear() : onChange?.(''))} />
      )}
    </div>
  );
}

/* -------------------------------------------------------------- TextField */

export interface TextFieldProps extends Omit<InputProps, 'onChange' | 'value'> {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  /** Texto de ajuda abaixo do campo. */
  helper?: string;
  /** Mensagem de erro: diz o que fazer ("Digite um CPF válido para continuar"). */
  error?: string;
}
/** Campo completo no padrão shadcn Form: Label + Input + descrição + mensagem, ligados por id e aria. */
export function TextField({ label, value, onChange, helper, error, id, required, className, ...props }: TextFieldProps) {
  const auto = React.useId();
  const fid = id ?? auto;
  const hid = `${fid}-help`;
  return (
    <div className={cn('grid gap-nano', className)}>
      <Label htmlFor={fid}>{label}{required && <span aria-hidden> *</span>}</Label>
      <Input
        {...props}
        id={fid}
        value={value}
        required={required}
        aria-invalid={!!error || undefined}
        aria-describedby={helper || error ? hid : undefined}
        onChange={(e) => onChange?.(e.target.value)}
      />
      {error ? (
        <p id={hid} className="caption m-0 flex items-start gap-xnano text-feedback-text-negative"><Icon name="alert" size="small" />{error}</p>
      ) : helper ? (
        <p id={hid} className="caption m-0 text-muted-foreground">{helper}</p>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------ ChoiceChips */

export interface ChoiceOption { value: string; label: string; disabled?: boolean; /** Ícone antes do rótulo (categorias, materiais). */ icon?: IconName }
export interface ChoiceChipsProps {
  label: string;
  options: ChoiceOption[];
  value?: string;
  onChange?: (v: string) => void;
  /** outline = borda laranja, marcado em laranja cheio (valores, categorias) · soft = cinza sem borda, marcado com borda de destaque (materiais). */
  variant?: 'outline' | 'soft';
  /** Uma linha rolável em vez de quebrar. */
  scroll?: boolean;
}
/** Escolha única em pílula, sobre Radix RadioGroup (setas do teclado, um ponto de tabulação). */
export function ChoiceChips({ label, options, value, onChange, variant = 'outline', scroll }: ChoiceChipsProps) {
  return (
    <RadioGroupPrimitive.Root aria-label={label} value={value} onValueChange={onChange} orientation="horizontal" className={cn('flex gap-nano', scroll ? '-mx-xsmall overflow-x-auto px-xsmall pb-xnano [scrollbar-width:none]' : 'flex-wrap')}>
      {options.map((o) => (
        <RadioGroupPrimitive.Item
          key={o.value}
          value={o.value}
          disabled={o.disabled}
          className={cn(
            'inline-flex min-h-touch shrink-0 cursor-pointer items-center gap-xnano whitespace-nowrap rounded-full px-mini font-medium text-foreground transition-colors',
            'hover:bg-interactive-fill-quiet-hover active:bg-interactive-fill-quiet-active',
            focusRing,
            variant === 'soft'
              ? 'body-small border-[1.5px] border-transparent bg-surface-secondary data-[state=checked]:border-border-highlight data-[state=checked]:bg-surface-accent data-[state=checked]:font-semibold'
              : 'body border-[1.5px] border-interactive-border-quiet bg-surface-primary data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:font-semibold data-[state=checked]:text-primary-foreground',
            'disabled:cursor-not-allowed disabled:border-interactive-fill-disabled disabled:bg-interactive-fill-disabled disabled:text-interactive-text-disabled',
          )}
        >
          {o.icon && <Icon name={o.icon} size="small" className={variant === 'soft' ? 'text-icon-brand-strong' : undefined} />}
          {o.label}
        </RadioGroupPrimitive.Item>
      ))}
    </RadioGroupPrimitive.Root>
  );
}

/* -------------------------------------------------------------- RadioList */

export interface RadioListProps { name?: string; legend: string; options: ChoiceOption[]; value?: string; onChange?: (v: string) => void }
export function RadioList({ name, legend, options, value, onChange }: RadioListProps) {
  const base = React.useId();
  return (
    <RadioGroup name={name} aria-label={legend} value={value} onValueChange={onChange} className="gap-0">
      {options.map((o, i) => (
        <label key={o.value} htmlFor={`${base}-${i}`} className="body flex min-h-touch cursor-pointer items-center gap-micro py-nano text-foreground has-[:disabled]:cursor-not-allowed has-[:disabled]:text-interactive-text-disabled">
          <RadioGroupItem id={`${base}-${i}`} value={o.value} disabled={o.disabled} />
          {o.label}
        </label>
      ))}
    </RadioGroup>
  );
}

/* --------------------------------------------------------- MaterialResult */

export interface MaterialResultProps { name: string; image?: ThumbProps; accepted: boolean; recyclable: boolean; category: string }
export function MaterialResult({ name, image, accepted, recyclable, category }: MaterialResultProps) {
  const line = (ok: boolean, yes: string, no: string) => (
    <span className={cn('caption flex items-center gap-xnano', ok ? 'text-feedback-text-positive' : 'text-feedback-text-negative')}>
      <Icon name={ok ? 'check' : 'close'} size="small" />{ok ? yes : no}
    </span>
  );
  return (
    <article className="grid grid-cols-[auto_1fr] gap-micro border-b border-border py-micro text-foreground">
      <Thumb shape="square" icon="recycle" {...image} />
      <div className="grid justify-items-start gap-xnano">
        <p className="label m-0">{name}</p>
        {line(accepted, 'Aceito no local', 'Não aceito neste local')}
        {line(recyclable, 'Reciclável', 'Não reciclável')}
        <Tag icon="recycle">{category}</Tag>
      </div>
    </article>
  );
}

/* ----------------------------------------------------------- HelpfulVote */

export interface HelpfulVoteProps { question?: string; value?: 'sim' | 'nao'; onVote?: (v: 'sim' | 'nao') => void }
/** "Essa resposta foi útil?", sobre Radix ToggleGroup (seleção única, aria-pressed). */
export function HelpfulVote({ question = 'Essa resposta foi útil?', value, onVote }: HelpfulVoteProps) {
  const item = cn(
    'body min-h-touch min-w-[64px] cursor-pointer rounded-sm border-[1.5px] border-interactive-border-quiet bg-surface-primary px-mini font-semibold text-foreground transition-colors',
    'hover:bg-interactive-fill-quiet-hover active:bg-interactive-fill-quiet-active',
    focusRing,
    'data-[state=on]:border-primary data-[state=on]:bg-primary data-[state=on]:text-primary-foreground',
  );
  return (
    <div className="grid gap-nano border-t border-border pt-mini">
      <p className="label m-0">{question}</p>
      <ToggleGroupPrimitive.Root type="single" aria-label={question} value={value ?? ''} onValueChange={(v) => v && onVote?.(v as 'sim' | 'nao')} className="flex gap-nano">
        <ToggleGroupPrimitive.Item value="sim" className={item}>Sim</ToggleGroupPrimitive.Item>
        <ToggleGroupPrimitive.Item value="nao" className={item}>Não</ToggleGroupPrimitive.Item>
      </ToggleGroupPrimitive.Root>
      {value && <p role="status" className="caption m-0 text-muted-foreground">Obrigado pela resposta.</p>}
    </div>
  );
}
