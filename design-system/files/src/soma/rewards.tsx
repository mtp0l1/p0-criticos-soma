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
  /** Material da estimativa ("PET"). Padrão: "recicláveis". */
  material?: string;
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
export function GoalCard({ reward, points, goal, missingKg, material = 'recicláveis', onPress, href, className }: GoalCardProps) {
  const missing = Math.max(0, goal - points);
  const done = goal > 0 && missing === 0;
  const pct = goal > 0 ? Math.min(100, (points / goal) * 100) : 0;
  const base = cn('relative grid gap-nano overflow-hidden rounded-lg bg-surface-brand p-mini text-left text-primary-foreground shadow-glow', className);
  const body = (
    <>
      <span aria-hidden className="pointer-events-none absolute -right-[40px] -top-[60px] size-[180px] rounded-full bg-surface-primary/[.14]" />
      <span className="relative flex items-center justify-between gap-nano">
        <span className="flex items-center gap-nano">
          <span aria-hidden className="grid size-[28px] place-items-center rounded-full bg-surface-inverse text-icon-brand"><Icon name="flag" size="small" /></span>
          <span className="eyebrow uppercase tracking-wide">Minha meta</span>
        </span>
        <span className="body-small font-bold">{fmt(points)} / {fmt(goal)} pontos</span>
      </span>
      <span className="screen-title relative block">{reward}</span>
      <span className="relative grid gap-nano">
        <Progress value={pct} label="Progresso da meta" className="bg-surface-primary/[.4]" indicatorClassName="bg-surface-inverse" />
        {done
          ? <span className="caption inline-flex items-center gap-xnano justify-self-start rounded-full bg-surface-inverse px-micro py-[6px] font-bold text-text-inverse"><Icon name="check" size="small" className="text-icon-brand" />Meta atingida! Pronta para troca.</span>
          : <span className="caption flex justify-between gap-nano font-bold"><span>Faltam {fmt(missing)} pontos</span>{missingKg != null && <span>≈ {fmt(missingKg)} kg de {material}</span>}</span>}
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
export function CampaignBanner({ children, icon = 'sparkles', className }: CampaignBannerProps) {
  return (
    <section aria-label="Campanha ativa" className={cn('flex items-center gap-nano rounded-md bg-feedback-fill-positive px-micro py-micro', className)}>
      <Icon name={icon} size="small" className="shrink-0 text-feedback-text-positive" />
      <p className="caption m-0 font-bold text-feedback-text-positive">{children}</p>
    </section>
  );
}

/* -------------------------------------------------------------- RewardRow */

export interface RewardTag { label: string; tone?: 'positive' | 'caution' | 'neutral'; icon?: IconName }
export interface RewardRowProps {
  title: string;
  points: number;
  /** Saldo da pessoa. Com ele, a linha diz quanto falta ou que já dá para trocar. */
  balance?: number;
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
/** Linha do catálogo (Telas 1, 5, 9 e 23): título, pontos em cor de link e seta. Tocável inteira; abre o detalhe. Com `balance`, mostra "Faltam N pontos" ou "Você já pode trocar". */
export function RewardRow({ title, points, balance, tags, current, image, icon, href, onClick }: RewardRowProps) {
  const missing = balance == null ? null : Math.max(0, points - balance);
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
          {missing === 0 && <span className="caption font-semibold text-feedback-text-positive">Você já pode trocar</span>}
          {!!missing && <span className="caption text-muted-foreground">{missing === 1 ? 'Falta 1 ponto' : `Faltam ${fmt(missing)} pontos`}</span>}
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
      <div className="grid justify-items-center gap-nano rounded-lg bg-surface-inverse px-mini py-small text-center text-text-inverse shadow-dark">
        <p className="eyebrow m-0 uppercase tracking-wide">Código de resgate</p>
        <p className="m-0 select-all font-sans text-[28px] font-bold leading-9 tracking-[0.08em] text-icon-brand">{code}</p>
        <hr className="m-0 w-full border-0 border-t border-dashed border-surface-primary/[.4]" />
        <p className="caption m-0">{hint}</p>
        {validity && <p className="caption m-0">{validity}</p>}
      </div>
      <Button fullWidth icon={copied ? 'check' : 'copy'} onClick={copy}>{copied ? 'Copiado' : 'Copiar código'}</Button>
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
  /** Ícone do disco quando não há imagem. */
  icon?: IconName;
  /** "Como resgatar", em passos numerados. */
  steps?: string[];
  className?: string;
}
/** Detalhe do prêmio (Telas 18, 20 e V2): foto, categoria, nome, custo e "De onde vêm os pontos". O botão fica na tela. */
export function RewardDetail({ image, category, title, points, tags, source, icon = 'gift', steps, className }: RewardDetailProps) {
  // "22,5 kg de vidro = 450 pontos ≈ R$ 45,00 em prêmios" vira três colunas; outro formato aparece como frase
  const parts = /^(.*?) = (.*?) ≈ (.*)$/.exec(source);
  return (
    <article className={cn('grid gap-micro text-foreground', className)}>
      <div className="grid h-[112px] place-items-center overflow-hidden rounded-lg bg-surface-tint-peach">
        {image ? <img src={image} alt="" className="size-full object-cover" /> : <span aria-hidden className="grid size-[64px] place-items-center rounded-full bg-surface-primary"><Icon name={icon} size="large" /></span>}
      </div>
      <div className="grid gap-xnano">
        <p className="eyebrow m-0 uppercase text-text-link">{category}</p>
        <h1 className="page-title m-0">{title}</h1>
      </div>
      <div className="flex flex-wrap items-center gap-nano">
        <span className="caption inline-flex min-h-small items-center gap-xnano rounded-full bg-primary px-micro font-bold text-primary-foreground"><Icon name="sparkles" size="small" />{fmt(points)} pontos</span>
        {tags?.map((t) => <Badge key={t.label} tone={(t.tone ?? 'neutral') as BadgeProps['tone']}>{t.icon && <Icon name={t.icon} />}{t.label}</Badge>)}
      </div>
      <div className="grid gap-nano rounded-lg bg-card p-micro shadow-card">
        <p className="eyebrow m-0 uppercase tracking-wide text-muted-foreground">De onde vêm os pontos</p>
        {parts
          ? <p className="m-0 grid grid-cols-3 gap-nano">{parts.slice(1).map((x, i) => <span key={i} className={cn('label', i === 1 && 'text-text-link')}>{i === 2 ? '≈ ' : i === 1 ? '→ ' : ''}{x}</span>)}</p>
          : <p className="body-strong m-0 text-text-link">{source}</p>}
      </div>
      {steps && (
        <div className="grid gap-nano rounded-lg bg-card p-micro shadow-card">
          <p className="eyebrow m-0 uppercase tracking-wide text-muted-foreground">Como resgatar</p>
          <ol className="caption m-0 grid list-none gap-nano p-0">
            {steps.map((t, i) => <li key={t} className="grid grid-cols-[auto_1fr] items-start gap-nano"><span aria-hidden className="grid size-[20px] place-items-center rounded-full bg-primary font-bold text-primary-foreground">{i + 1}</span>{t}</li>)}
          </ol>
        </div>
      )}
    </article>
  );
}

/* --------------------------------------------------------- InstitutionCard */

export interface InstitutionCardProps {
  name: string;
  description?: string;
  image?: string;
  /** "Saber mais": abre o detalhe da instituição. */
  onMore?: () => void;
  href?: string;
  className?: string;
}
/** Instituição que recebe a doação de pontos. */
export function InstitutionCard({ name, description, image, onMore, href, className }: InstitutionCardProps) {
  const more = cn(hitAreaY, 'caption inline-flex items-center gap-[2px] justify-self-start rounded-xs border-0 bg-transparent p-0 font-bold text-text-link');
  return (
    <article className={cn('grid grid-cols-[auto_1fr] items-center gap-micro rounded-lg border border-border bg-card p-mini text-card-foreground', className)}>
      <span className="grid size-[64px] place-items-center overflow-hidden rounded-md bg-surface-secondary text-icon-brand-strong">
        {image ? <img src={image} alt="" className="size-full object-cover" /> : <Icon name="hand-heart" size="large" />}
      </span>
      <div className="grid min-w-0 gap-xnano">
        <h2 className="label m-0">{name}</h2>
        {description && <p className="caption m-0 text-muted-foreground">{description}</p>}
        {href ? <a href={href} className={cn(pressable, more)}>Saber mais<span className="sr-only"> sobre {name}</span><Icon name="chevron-right" size="small" /></a>
          : onMore ? <button type="button" onClick={onMore} className={cn(pressable, more)}>Saber mais<span className="sr-only"> sobre {name}</span><Icon name="chevron-right" size="small" /></button> : null}
      </div>
    </article>
  );
}
