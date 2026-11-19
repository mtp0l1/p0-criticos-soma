/* So+ma · resgates e conta: StatusChip, Tag, Thumb, RedemptionItem, RedemptionGroup, QrCheckinCard. */
import * as React from 'react';
import { cn, fmt } from '../lib/utils';
import { Icon, type IconName } from '../ui/icon';
import { Badge } from '../ui/display';
import { pressable, PressableBase } from './navigation';

export interface StatusChipProps {
  status: 'done' | 'expired' | 'pending';
  /** Texto do chip. Padrão: Concluído, Expirado, Aguardando retirada. */
  children?: React.ReactNode;
}
const CHIP = {
  done: { icon: 'check', text: 'Concluído', tone: 'positive' },
  expired: { icon: 'close', text: 'Expirado', tone: 'negative' },
  pending: { icon: 'clock', text: 'Aguardando retirada', tone: 'caution' },
} as const;
/** Status de resgate, sobre Badge. Sempre ícone e palavra. */
export function StatusChip({ status, children }: StatusChipProps) {
  const c = CHIP[status];
  return <Badge tone={c.tone}><Icon name={c.icon} />{children ?? c.text}</Badge>;
}

export interface TagProps { icon?: IconName; children: React.ReactNode }
/** Etiqueta de categoria (Plástico, Cartonado), sobre Badge. Não é tocável. */
export function Tag({ icon, children }: TagProps) {
  return <Badge tone="caution">{icon && <Icon name={icon} />}{children}</Badge>;
}

export interface ThumbProps { src?: string; alt?: string; icon?: IconName; shape?: 'circle' | 'square' }
export function Thumb({ src, alt = '', icon = 'gift', shape = 'circle' }: ThumbProps) {
  return (
    <span className={cn('grid size-thumb shrink-0 place-items-center overflow-hidden bg-surface-secondary text-icon-primary', shape === 'square' ? 'rounded-md' : 'rounded-full')}>
      {src ? <img src={src} alt={alt} className="size-full object-cover" /> : <Icon name={icon} />}
    </span>
  );
}

export interface RedemptionItemProps {
  title: string;
  points: number;
  time: string;
  status: StatusChipProps['status'];
  logo?: ThumbProps;
  href?: string;
  onPress?: () => void;
}
export function RedemptionItem({ title, points, time, status, logo, href, onPress }: RedemptionItemProps) {
  return (
    <PressableBase
      href={href}
      onClick={onPress}
      className={cn(pressable, 'grid w-full grid-cols-[auto_1fr_auto] items-center gap-micro border-b border-border bg-transparent py-micro text-foreground hover:bg-interactive-fill-quiet-hover active:bg-interactive-fill-quiet-active')}
    >
      <Thumb {...logo} />
      <span className="grid min-w-0 justify-items-start gap-xnano">
        <span className="label">{title}</span>
        <span className="caption text-muted-foreground">{fmt(points)} pontos · {time}</span>
        <StatusChip status={status} />
      </span>
      <Icon name="chevron-right" tone="brand-strong" size="small" />
    </PressableBase>
  );
}
export function RedemptionGroup({ date, children }: { date: string; children?: React.ReactNode }) {
  return (
    <section aria-label={date} className="grid gap-xnano">
      <h3 className="label m-0 mt-mini text-foreground">{date}</h3>
      {children}
    </section>
  );
}

export interface QrCheckinCardProps {
  /** QR gerado pelo back-end (svg ou img). */
  qr: React.ReactNode;
  /** Nome da pessoa, mostrado em maiúsculas sob o QR. */
  name: string;
  /** Passos do atendimento. Padrão: "Mostre o QR", "A equipe pesa seus recicláveis", "Seus pontos aparecem aqui". */
  steps?: string[];
  title?: string;
  description?: string;
  className?: string;
}
/** QR de identificação na entrega (Tela 11): cartão branco com título, QR, nome e os três passos. Aparece no dia da entrega, não escondido no Menu. */
export function QrCheckinCard({
  qr, name, className,
  title = 'Chegou? Mostre este QR no atendimento',
  description = 'A equipe vai ler o código para registrar seus recicláveis e liberar seus pontos.',
  steps = ['Mostre o QR', 'A equipe pesa seus recicláveis', 'Seus pontos aparecem aqui'],
}: QrCheckinCardProps) {
  return (
    <section aria-label="Meu QR de entrega" className={cn('grid justify-items-center gap-mini rounded-lg border border-border bg-card p-small text-center text-card-foreground', className)}>
      <div className="grid gap-xnano">
        <h2 className="screen-title m-0 text-left">{title}</h2>
        <p className="body-small m-0 text-left text-muted-foreground">{description}</p>
      </div>
      <div className="grid size-qr place-items-center rounded-lg border border-border bg-surface-primary p-mini [&>*]:size-full">{qr}</div>
      <p className="body-strong m-0 uppercase tracking-[0.5px]">{name}</p>
      <ol className="caption m-0 grid list-none gap-xnano p-0 text-muted-foreground">
        {steps.map((t, i) => <li key={t}>{i + 1}. {t}</li>)}
      </ol>
    </section>
  );
}
