/* So+ma · recompensas e doação: GoalCard, CampaignBanner, RewardRow, RedeemCode, RewardDetail, InstitutionCard. */
import * as React from 'react';
import { cn, fmt } from '../lib/utils';
import { Icon, type IconName } from '../ui/icon';
import { Button } from '../ui/button';
import { Badge, Progress, type BadgeProps } from '../ui/display';
import { pressable, PressableBase } from './navigation';
import { Thumb } from './account';

/* --------------------------------------------------------------- GoalCard */

export interface GoalCardProps {
  /** Recompensa escolhida como meta. */
  reward: string;
  points: number;
  goal: number;
  onChange?: () => void;
  className?: string;
}
/**
 * Meta atual no topo do catálogo. No Figma é um degradê laranja com texto branco (2,05:1): aqui o fundo é
 * surface-brand com text-on-loud e o progresso em surface-inverse.
 */
export function GoalCard({ reward, points, goal, onChange, className }: GoalCardProps) {
  const missing = Math.max(0, goal - points);
  const pct = goal > 0 ? Math.min(100, (points / goal) * 100) : 0;
  return (
    <section aria-label="Sua meta" className={cn('grid gap-nano rounded-lg bg-surface-brand p-mini text-primary-foreground', className)}>
      <div className="flex items-center justify-between gap-nano">
        <p className="eyebrow m-0 uppercase tracking-wide">Sua meta</p>
        {onChange && <button type="button" onClick={onChange} className={cn(pressable, 'caption min-h-touch rounded-sm px-nano font-semibold underline underline-offset-2')}>Trocar meta</button>}
      </div>
      <p className="body-strong m-0">{reward}</p>
      <Progress value={pct} label="Progresso da meta" className="bg-surface-primary" indicatorClassName="bg-surface-inverse" />
      <p className="caption m-0">
        <b className="font-semibold">{fmt(points)}</b> de {fmt(goal)} pontos · {missing === 0 ? 'você já pode resgatar' : `faltam ${fmt(missing)}`}
      </p>
    </section>
  );
}

/* --------------------------------------------------------- CampaignBanner */

export interface CampaignBannerProps {
  title: string;
  children: React.ReactNode;
  icon?: IconName;
  action?: { label: string; onClick?: () => void };
  className?: string;
}
/** Campanha ativa ("Vidro vale o dobro esta semana"). Verde de sucesso com borda, raio de card. */
export function CampaignBanner({ title, children, icon = 'bolt', action, className }: CampaignBannerProps) {
  return (
    <section aria-label={title} className={cn('grid grid-cols-[auto_1fr] gap-x-micro gap-y-xnano rounded-lg border border-feedback-text-positive bg-feedback-fill-positive p-mini text-foreground', className)}>
      <span className="grid size-touch place-items-center rounded-full bg-surface-primary text-feedback-text-positive"><Icon name={icon} /></span>
      <div className="grid gap-xnano self-center">
        <p className="label m-0">{title}</p>
        <div className="caption m-0">{children}</div>
        {action && <button type="button" onClick={action.onClick} className={cn(pressable, 'caption justify-self-start rounded-xs font-semibold text-feedback-text-positive underline underline-offset-2')}>{action.label}</button>}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- RewardRow */

export interface RewardTag { label: string; tone?: 'positive' | 'caution' | 'neutral'; icon?: IconName }
export interface RewardRowProps {
  title: string;
  /** Parceiro ou categoria ("Restaurante Bom Prato"). */
  partner?: string;
  points: number;
  image?: string;
  icon?: IconName;
  /** Etiquetas curtas: "2× vidro" (positive), "Sua meta atual" (caution). */
  tags?: RewardTag[];
  /** Saldo abaixo do custo: a linha mostra quanto falta, sem bloquear o toque. */
  missing?: number;
  href?: string;
  onClick?: () => void;
}
/** Linha do catálogo de recompensas. Tocável inteira; abre o detalhe. */
export function RewardRow({ title, partner, points, image, icon = 'gift', tags, missing, href, onClick }: RewardRowProps) {
  return (
    <PressableBase
      href={href}
      onClick={onClick}
      className={cn(pressable, 'grid w-full grid-cols-[auto_1fr_auto] items-center gap-micro rounded-lg border border-border bg-card p-micro text-card-foreground hover:bg-interactive-fill-quiet-hover active:bg-interactive-fill-quiet-active')}
    >
      <Thumb src={image} icon={icon} shape="square" />
      <span className="grid min-w-0 gap-xnano">
        {tags && tags.length > 0 && (
          <span className="flex flex-wrap gap-xnano">
            {tags.map((t) => <Badge key={t.label} tone={(t.tone ?? 'neutral') as BadgeProps['tone']}>{t.icon && <Icon name={t.icon} />}{t.label}</Badge>)}
          </span>
        )}
        <span className="label">{title}</span>
        {partner && <span className="caption text-muted-foreground">{partner}</span>}
        <span className="caption font-semibold text-text-link">
          {fmt(points)} pontos{missing != null && missing > 0 && <span className="font-normal text-muted-foreground"> · faltam {fmt(missing)}</span>}
        </span>
      </span>
      <Icon name="chevron-right" size="small" tone="brand-strong" />
    </PressableBase>
  );
}

/* ------------------------------------------------------------- RedeemCode */

export interface RedeemCodeProps {
  code: string;
  /** "Válido até 5 de nov de 2026". */
  validity?: string;
  /** Texto sob a caixa. Padrão: "Use na retirada ou no site do parceiro.". */
  hint?: string;
  /** Chamado depois de copiar; o componente já anuncia "Código copiado". */
  onCopy?: (code: string) => void;
  className?: string;
}
/** Código do resgate (Tela 21): caixa tracejada com o código em laranja, a instrução e o botão principal "Copiar código". */
export function RedeemCode({ code, validity, hint = 'Use na retirada ou no site do parceiro.', onCopy, className }: RedeemCodeProps) {
  const [copied, setCopied] = React.useState(false);
  const copy = async () => {
    try { await navigator.clipboard?.writeText(code); } catch { /* sem permissão: o código continua visível para copiar à mão */ }
    setCopied(true);
    onCopy?.(code);
    window.setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className={cn('grid gap-mini text-foreground', className)}>
      <div className="grid justify-items-center gap-nano rounded-lg border-[1.5px] border-dashed border-border-highlight bg-card px-mini py-small text-center">
        <p className="caption m-0 font-semibold uppercase tracking-wide text-muted-foreground">Código de resgate</p>
        <p className="m-0 select-all font-sans text-[28px] font-bold leading-9 tracking-[0.08em] text-text-link">{code}</p>
        {validity && <p className="caption m-0 text-muted-foreground">{validity}</p>}
      </div>
      <p className="body-small m-0 text-center text-muted-foreground">{hint}</p>
      <Button fullWidth icon={copied ? 'check' : undefined} onClick={copy}>{copied ? 'Copiado' : 'Copiar código'}</Button>
      <span aria-live="polite" className="sr-only">{copied ? 'Código copiado' : ''}</span>
    </div>
  );
}

/* ------------------------------------------------------------ RewardDetail */

export interface RewardDetailProps {
  /** Foto do prêmio. Sem ela, mostra o espaço em cinza. */
  image?: string;
  /** Categoria em maiúsculas ("Alimentação e gastronomia"). */
  category: string;
  title: string;
  points: number;
  /** Etiquetas como "2× vidro". */
  tags?: RewardTag[];
  /** "45,0 kg de vidro = 450 pontos ≈ R$ 45,00 em prêmios". */
  source: string;
  className?: string;
}
/** Detalhe do prêmio (Telas 18, 20 e V2): foto, categoria, nome, custo e "De onde vêm os pontos". O botão fica na tela. */
export function RewardDetail({ image, category, title, points, tags, source, className }: RewardDetailProps) {
  return (
    <article className={cn('grid gap-mini', className)}>
      <div className="grid h-[148px] place-items-center overflow-hidden rounded-lg bg-surface-secondary text-icon-brand-strong">
        {image ? <img src={image} alt="" className="size-full object-cover" /> : <Icon name="gift" size="xlarge" />}
      </div>
      <div className="grid gap-xnano">
        <p className="eyebrow m-0 uppercase text-text-link">{category}</p>
        <h1 className="page-title m-0">{title}</h1>
      </div>
      <div className="flex flex-wrap items-center gap-nano">
        <span className="inline-flex min-h-small items-center rounded-full bg-surface-secondary px-nano text-[12px] font-semibold leading-4 text-foreground">{fmt(points)} pontos</span>
        {tags?.map((t) => <Badge key={t.label} tone={(t.tone ?? 'neutral') as BadgeProps['tone']}>{t.icon && <Icon name={t.icon} />}{t.label}</Badge>)}
      </div>
      <div className="grid gap-xnano rounded-lg bg-surface-secondary p-mini">
        <p className="caption m-0 font-semibold uppercase tracking-wide text-muted-foreground">De onde vêm os pontos</p>
        <p className="body-strong m-0 text-text-link">{source}</p>
      </div>
    </article>
  );
}

/* --------------------------------------------------------- InstitutionCard */

export interface InstitutionCardProps {
  name: string;
  description: string;
  image?: string;
  /** "Saber mais": abre o detalhe da instituição. */
  onMore?: () => void;
  href?: string;
  className?: string;
}
/** Instituição que recebe a doação de pontos. */
export function InstitutionCard({ name, description, image, onMore, href, className }: InstitutionCardProps) {
  const more = 'caption justify-self-start rounded-xs font-semibold text-text-link underline underline-offset-2';
  return (
    <article className={cn('grid grid-cols-[auto_1fr] items-center gap-micro rounded-lg border border-border bg-card p-mini text-card-foreground', className)}>
      <span className="grid size-[64px] place-items-center overflow-hidden rounded-md bg-surface-secondary text-icon-brand-strong">
        {image ? <img src={image} alt="" className="size-full object-cover" /> : <Icon name="hand-heart" size="large" />}
      </span>
      <div className="grid min-w-0 gap-xnano">
        <h2 className="label m-0">{name}</h2>
        <p className="caption m-0 text-muted-foreground">{description}</p>
        {href ? <a href={href} className={cn(pressable, more)}>Saber mais<span className="sr-only"> sobre {name}</span></a>
          : onMore ? <button type="button" onClick={onMore} className={cn(pressable, more)}>Saber mais<span className="sr-only"> sobre {name}</span></button> : null}
      </div>
    </article>
  );
}
