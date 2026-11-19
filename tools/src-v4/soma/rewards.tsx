/* So+ma · recompensas e doação: GoalCard, CampaignBanner, RewardRow, RedeemCode, RewardDetail, InstitutionCard. */
import * as React from 'react';
import { cn, fmt, hitAreaY } from '../lib/utils';
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
  /** Quilos equivalentes ao que falta ("≈ 24 kg de recicláveis"). */
  missingKg?: number;
  /** Torna o card tocável (Tela 5: leva direto ao detalhe com "Trocar recompensa"). */
  onPress?: () => void;
  href?: string;
  className?: string;
}
/**
 * Minha meta no topo do catálogo (Telas 1 e 5): "Minha meta" e "320 / 800 pontos" na primeira linha, o prêmio, a barra e,
 * embaixo, "faltam 480 pontos" e "≈ 24 kg de recicláveis". Com a meta atingida: ícone de check, "Meta atingida! Pronta para troca."
 * No Figma é um degradê laranja com texto branco (2,05:1): aqui o fundo é surface-brand com text-on-loud e o progresso em surface-inverse.
 */
export function GoalCard({ reward, points, goal, missingKg, onPress, href, className }: GoalCardProps) {
  const missing = Math.max(0, goal - points);
  const done = goal > 0 && missing === 0;
  const pct = goal > 0 ? Math.min(100, (points / goal) * 100) : 0;
  const base = cn('grid gap-micro rounded-lg bg-surface-brand p-mini text-primary-foreground', className);
  const body = (
    <>
      <span className="flex items-center justify-between gap-nano">
        <span className="eyebrow uppercase tracking-wide">Minha meta</span>
        <span className="body-strong flex items-center gap-xnano">{done && <Icon name="circle-check" size="small" />}{fmt(points)} / {fmt(goal)} pontos</span>
      </span>
      <span className="subtitle block">{reward}</span>
      <span className="grid gap-xnano">
        <Progress value={pct} label="Progresso da meta" className="bg-surface-primary" indicatorClassName="bg-surface-inverse" />
        {done
          ? <span className="caption font-semibold">Meta atingida! Pronta para troca.</span>
          : <span className="caption flex justify-between gap-nano"><span>faltam {fmt(missing)} pontos</span>{missingKg != null && <span>≈ {fmt(missingKg)} kg de recicláveis</span>}</span>}
      </span>
    </>
  );
  if (onPress || href) return <PressableBase href={href} onClick={onPress} className={cn(pressable, base, 'w-full')}>{body}</PressableBase>;
  return <section aria-label="Minha meta" className={base}>{body}</section>;
}

/* --------------------------------------------------------- CampaignBanner */

export interface CampaignBannerProps {
  /** Frase curta, em uma linha ("Vidro vale 2× pontos até sexta-feira"). */
  children: React.ReactNode;
  icon?: IconName;
  className?: string;
}
/** Campanha ativa (Telas 1 e 23): faixa compacta de uma linha, verde de sucesso com borda, ícone de 16px e frase de 12px. */
export function CampaignBanner({ children, icon = 'bolt', className }: CampaignBannerProps) {
  return (
    <section aria-label="Campanha ativa" className={cn('flex items-center gap-nano rounded-md border border-feedback-text-positive bg-feedback-fill-positive px-micro py-nano text-foreground', className)}>
      <Icon name={icon} size="small" className="shrink-0 text-feedback-text-positive" />
      <p className="caption m-0">{children}</p>
    </section>
  );
}

/* -------------------------------------------------------------- RewardRow */

export interface RewardTag { label: string; tone?: 'positive' | 'caution' | 'neutral'; icon?: IconName }
export interface RewardRowProps {
  title: string;
  points: number;
  /** Etiquetas curtas ao lado dos pontos: "2× vidro" (positive). */
  tags?: RewardTag[];
  /** Prêmio da meta atual: borda de destaque e etiqueta "Sua meta atual". */
  current?: boolean;
  /** Imagem ou ícone à esquerda. O Figma não usa: a linha é só título, pontos e seta. */
  image?: string;
  icon?: IconName;
  href?: string;
  onClick?: () => void;
}
/** Linha do catálogo (Telas 1, 5, 9 e 23): título, pontos em cor de link e seta. Tocável inteira; abre o detalhe. Prêmios acima do saldo aparecem iguais. */
export function RewardRow({ title, points, tags, current, image, icon, href, onClick }: RewardRowProps) {
  const all: RewardTag[] = [...(current ? [{ label: 'Sua meta atual', tone: 'caution' as const }] : []), ...(tags ?? [])];
  return (
    <PressableBase
      href={href}
      onClick={onClick}
      className={cn(pressable, 'grid w-full items-center gap-micro rounded-lg border bg-card p-micro text-card-foreground hover:bg-interactive-fill-quiet-hover active:bg-interactive-fill-quiet-active', image || icon ? 'grid-cols-[auto_1fr_auto]' : 'grid-cols-[1fr_auto]', current ? 'border-border-highlight' : 'border-border')}
    >
      {(image || icon) && <Thumb src={image} icon={icon ?? 'gift'} shape="square" />}
      <span className="grid min-w-0 gap-xnano">
        <span className="label">{title}</span>
        <span className="flex flex-wrap items-center gap-nano">
          <span className="caption font-semibold text-text-link">{fmt(points)} pontos</span>
          {all.map((t) => <Badge key={t.label} tone={(t.tone ?? 'neutral') as BadgeProps['tone']}>{t.icon && <Icon name={t.icon} />}{t.label}</Badge>)}
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
      <div className="grid justify-items-center gap-nano rounded-lg border-2 border-dashed border-border-highlight bg-card px-mini py-small text-center">
        <p className="caption m-0 font-semibold uppercase tracking-wide text-muted-foreground">Código de resgate</p>
        <p className="m-0 select-all font-sans text-[24px] font-bold leading-8 tracking-[0.08em] text-text-link">{code}</p>
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
      <div className="grid h-[150px] place-items-center overflow-hidden rounded-lg bg-surface-secondary text-icon-brand-strong">
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
  const more = cn(hitAreaY, 'caption justify-self-start rounded-xs font-semibold text-text-link underline underline-offset-2');
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
