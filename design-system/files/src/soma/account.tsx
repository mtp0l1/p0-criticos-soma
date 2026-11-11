/* So+ma · resgates e conta: StatusChip, Tag, Thumb, RedemptionItem, RedemptionGroup, MemberCard. */
import * as React from 'react';
import { cn, fmt } from '../lib/utils';
import { Icon, type IconName } from '../ui/icon';
import { Badge, Avatar, AvatarImage, AvatarFallback } from '../ui/display';
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

export interface MemberCardProps {
  name: string;
  /** O QR code (svg ou img) gerado pelo back-end. */
  qr: React.ReactNode;
  /** URL da foto; sem ela, aparecem as iniciais. */
  photo?: string;
  /** ax = nome em navy (padrão, 7,07:1) · app = nome branco como hoje (2,05:1, reprova). */
  nameTone?: 'ax' | 'app';
}
const initials = (n: string) => n.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase();
export function MemberCard({ name, qr, photo, nameTone = 'ax' }: MemberCardProps) {
  return (
    <section aria-label="Meu cartão" className={cn('flex flex-col items-center gap-small rounded-lg bg-surface-brand px-mini py-xlarge text-center', nameTone === 'app' ? 'text-[var(--white)]' : 'text-text-on-loud')}>
      <Avatar size="avatar" className="border-[3px] border-surface-primary">
        {photo && <AvatarImage src={photo} alt="" />}
        <AvatarFallback className="page-title">{initials(name)}</AvatarFallback>
      </Avatar>
      <p className="page-title m-0 uppercase tracking-[0.5px]">{name}</p>
      <div className="grid size-qr place-items-center rounded-lg bg-surface-primary p-micro [&>*]:size-full">{qr}</div>
    </section>
  );
}
