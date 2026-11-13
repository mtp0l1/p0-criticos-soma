import * as React from 'react';
import {
  House, Gift, PackageCheck, ChartColumn, Menu, ChevronLeft, ChevronRight, ChevronDown, ChevronUp,
  CircleHelp, Info, ShoppingCart, Search, X, Check, Clock, Star, MapPin, UserPlus, User, Share2, Mail,
  Medal, Recycle, Weight, TreePine, Droplet, Zap, Leaf, Coins, HandHeart, Heart, TriangleAlert, IdCard, LogOut,
  FileText, CircleCheck, CircleX, Bell, Settings, Lock, Calendar, MessageSquare, Minus, Plus, Trash2, History, Ticket,
  ArrowLeft, ArrowUp, ArrowLeftRight, Shield, ShieldCheck, Flame, Trophy, Award, Users, Utensils, Book, ShoppingBag,
  CalendarCheck, QrCode, Link, Headphones, MessageCircle, Phone, Globe, Crosshair, TrendingUp, BottleWine, Wine,
  Package, Copy, Contact, MailOpen, Sparkles, Ban, Target, Navigation, Volleyball, Store, Camera, Lightbulb, Building2, Flag,
  type LucideIcon,
} from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

/**
 * Ícones de linha do sistema: Lucide (o set do shadcn/ui), o mesmo set das telas novas no Figma.
 * Os ícones "SVG fornecido" do Figma também são Lucide: Reciclar = recycle, Meu impacto = chart,
 * Pino = pin, Recompensas = gift. Nomes de camada do Figma funcionam como apelido (help-circle, map-pin, clock-3…).
 */
export const ICONS = {
  /* Navegação (barra inferior atual: home · recycle · gift · chart · menu; anterior: home · gift · bag-check · chart · menu) */
  home: House, recycle: Recycle, gift: Gift, chart: ChartColumn, menu: Menu, 'bag-check': PackageCheck,
  'chevron-left': ChevronLeft, 'chevron-right': ChevronRight, 'chevron-down': ChevronDown, 'chevron-up': ChevronUp,
  'arrow-left': ArrowLeft, 'arrow-up': ArrowUp, 'arrow-left-right': ArrowLeftRight, navigation: Navigation,
  /* Ações */
  help: CircleHelp, info: Info, search: Search, close: X, check: Check, plus: Plus, minus: Minus, trash: Trash2,
  share: Share2, copy: Copy, link: Link, 'user-plus': UserPlus, contacts: Contact, logout: LogOut, settings: Settings,
  /* Pessoa, conta e contato */
  user: User, users: Users, card: IdCard, lock: Lock, bell: Bell, mail: Mail, 'mail-open': MailOpen, phone: Phone,
  message: MessageSquare, 'message-circle': MessageCircle, headphones: Headphones, globe: Globe,
  /* Entrega, local e tempo */
  pin: MapPin, crosshair: Crosshair, calendar: Calendar, 'calendar-check': CalendarCheck, clock: Clock, history: History,
  'qr-code': QrCode, store: Store, building: Building2, camera: Camera,
  /* Gamificação */
  star: Star, medal: Medal, award: Award, trophy: Trophy, flame: Flame, shield: Shield, 'shield-check': ShieldCheck,
  target: Target, flag: Flag, sparkles: Sparkles, 'trending-up': TrendingUp, lightbulb: Lightbulb,
  /* Recompensas, pontos e categorias */
  coin: Coins, ticket: Ticket, cart: ShoppingCart, 'shopping-bag': ShoppingBag, utensils: Utensils, book: Book,
  heart: Heart, 'hand-heart': HandHeart, leaf: Leaf, sport: Volleyball,
  /* Materiais e impacto */
  bottle: BottleWine, wine: Wine, package: Package, doc: FileText, drop: Droplet, bolt: Zap, scale: Weight, tree: TreePine,
  /* Estado */
  alert: TriangleAlert, 'circle-check': CircleCheck, 'circle-x': CircleX, ban: Ban,

} satisfies Record<string, LucideIcon>;

/** Nomes de camada do Figma e do Lucide → nome So+ma. Servem para achar o ícone pelo nome que está no arquivo. */
export const ICON_ALIASES = {
  house: 'home', 'help-circle': 'help', 'circle-help': 'help', x: 'close', 'map-pin': 'pin', 'clock-3': 'clock',
  droplet: 'drop', 'chart-column': 'chart', 'file-text': 'doc', 'share-2': 'share', zap: 'bolt',
  'fork-knife': 'utensils', 'shopping-cart': 'cart', 'bottle-wine': 'bottle', 'check-circle': 'circle-check',
  'soccer-ball': 'sport', 'envelope-open-heart': 'mail-open', 'Qr code': 'qr-code', Medal: 'medal',
  'Reciclar — SVG fornecido': 'recycle', 'Meu impacto — SVG fornecido': 'chart', 'Pino — SVG fornecido': 'pin',
} as const satisfies Record<string, keyof typeof ICONS>;

export type IconName = keyof typeof ICONS | keyof typeof ICON_ALIASES;

export const iconVariants = cva('shrink-0', {
  variants: {
    /** small = 16px (chip, linha de status, botão compacto) · medium = 24px (padrão) · large = 32px (indicador) · xlarge = 56px (estado vazio e tela de resultado). */
    size: { small: 'size-icon-small', medium: 'size-icon', large: 'size-medium', xlarge: 'size-[56px]' },
    /** Cor por papel. inherit usa a cor do texto do pai. */
    tone: {
      inherit: '',
      brand: 'text-icon-brand',
      'brand-strong': 'text-icon-brand-strong',
      primary: 'text-icon-primary',
      secondary: 'text-icon-secondary',
      positive: 'text-feedback-text-positive',
      negative: 'text-feedback-text-negative',
      info: 'text-icon-info',
    },
  },
  defaultVariants: { size: 'medium', tone: 'inherit' },
});

export interface IconProps extends VariantProps<typeof iconVariants> {
  name: IconName;
  /** Rótulo acessível. Sem ele o ícone é decorativo (aria-hidden). */
  label?: string;
  className?: string;
}

export function Icon({ name, size, tone, label, className }: IconProps) {
  const key = (name in ICONS ? name : ICON_ALIASES[name as keyof typeof ICON_ALIASES]) as keyof typeof ICONS;
  const Cmp = ICONS[key];
  return (
    <Cmp
      className={cn(iconVariants({ size, tone }), className)}
      strokeWidth={2}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    />
  );
}
