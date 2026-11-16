import * as React from 'react';
import {
  House, Gift, PackageCheck, ChartColumn, Menu, ChevronLeft, ChevronRight, ChevronDown, ChevronUp,
  CircleHelp, Info, ShoppingCart, Search, X, Check, Clock, Star, MapPin, UserPlus, User, Share2, Mail,
  Medal, Recycle, Weight, TreePine, Droplet, Zap, Leaf, Coins, HandHeart, Heart, TriangleAlert, IdCard, LogOut,
  FileText, CircleCheck, CircleX, Bell, Settings, Lock, Calendar, MessageSquare, Minus, Plus, Trash2, History, Ticket,
  ArrowLeft, ArrowUp, ArrowLeftRight, Shield, ShieldCheck, Flame, Trophy, Award, Users, Utensils, Book, ShoppingBag,
  CalendarCheck, QrCode, Link, Headphones, MessageCircle, Phone, Globe, Crosshair, TrendingUp, BottleWine, Wine,
  Package, Copy, Contact, MailOpen, Sparkles, Ban, Target, Navigation, Volleyball, Store, Camera, Lightbulb, Building2, Flag, Eye, EyeOff,
  type LucideIcon,
} from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';
import {
  VECTOR_ICON_GROUP, VECTOR_ICON_GROUPS, VECTOR_ICON_NAMES, VECTOR_GROUP_LOADERS,
  type VectorIconName, type VectorIconGroup, type VectorPaths,
} from '../assets/icons';

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
  target: Target, flag: Flag, eye: Eye, 'eye-off': EyeOff, sparkles: Sparkles, 'trending-up': TrendingUp, lightbulb: Lightbulb,
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

/** Nomes do Lucide (e apelidos). */
export type LucideIconName = keyof typeof ICONS | keyof typeof ICON_ALIASES;
/** Qualquer ícone do sistema: Lucide ou do set vetorial (SVG em assets/icons, gerado por extrair_icones.py). */
export type IconName = LucideIconName | VectorIconName;

/* ---- set vetorial: contornos SVG com o equivalente a traço de 2px na grade de 24, desenhados com currentColor ----
   Os paths NÃO ficam no bundle inicial: cada grupo (assets/vector/<grupo>) é um import dinâmico, carregado na primeira vez que um
   ícone dele aparece (ou antes, com loadVectorIcons). Enquanto carrega, o ícone ocupa o espaço certo e fica vazio. */
export { VECTOR_ICON_NAMES, VECTOR_ICON_GROUPS, VECTOR_ICON_GROUP, type VectorIconName, type VectorIconGroup };
export const isVectorIcon = (name: string): name is VectorIconName => name in VECTOR_ICON_GROUP;
/** Nomes do set vetorial que o Lucide já cobre. Nesses, `name` usa o Lucide; para o vetorial, passe `source="vector"`. */
export const VECTOR_SHADOWED = VECTOR_ICON_NAMES.filter(n => n in ICONS || n in ICON_ALIASES);

/** Onde o navegador busca os grupos do set vetorial. Por padrão: a pasta `icons-chunks/` ao lado do script do bundle. Defina antes do primeiro ícone
 *  quando o bundle for inline, vier de blob ou de outra origem: `Soma.configureVectorIcons({ chunkBase: '/assets/icons-chunks/' })`. */
export function configureVectorIcons(opts: { chunkBase: string }): void {
  (globalThis as { __SOMA_ICON_BASE__?: string }).__SOMA_ICON_BASE__ = opts.chunkBase.endsWith('/') ? opts.chunkBase : opts.chunkBase + '/';
}

const vectorCache = new Map<VectorIconGroup, VectorPaths>();
const vectorPending = new Map<VectorIconGroup, Promise<void>>();
const vectorListeners = new Set<() => void>();
let vectorVersion = 0;
const subscribeVector = (cb: () => void) => { vectorListeners.add(cb); return () => { vectorListeners.delete(cb); }; };
const getVectorVersion = () => vectorVersion;

function loadVectorGroup(group: VectorIconGroup): Promise<void> {
  if (vectorCache.has(group)) return Promise.resolve();
  let p = vectorPending.get(group);
  if (!p) {
    p = VECTOR_GROUP_LOADERS[group]().then(
      m => { vectorCache.set(group, m.default); vectorVersion++; vectorListeners.forEach(f => f()); },
      err => { vectorPending.delete(group); console.warn(`[Icon] não carregou o grupo de ícones "${group}"`, err); },
    );
    vectorPending.set(group, p);
  }
  return p;
}

/** Baixa antes da hora o grupo (ou o grupo de cada nome) do set vetorial: use na rota que vai precisar deles. Sem argumento, baixa todos. */
export function loadVectorIcons(target?: VectorIconGroup | VectorIconName | Array<VectorIconGroup | VectorIconName>): Promise<void> {
  const list = target === undefined ? [...VECTOR_ICON_GROUPS] : Array.isArray(target) ? target : [target];
  const groups = new Set<VectorIconGroup>(list.map(t => ((VECTOR_ICON_GROUPS as readonly string[]).includes(t) ? t : VECTOR_ICON_GROUP[t as VectorIconName]) as VectorIconGroup).filter(Boolean));
  return Promise.all([...groups].map(loadVectorGroup)).then(() => undefined);
}

function useVectorPath(name: VectorIconName): string | undefined {
  React.useSyncExternalStore(subscribeVector, getVectorVersion, getVectorVersion);
  const group = VECTOR_ICON_GROUP[name];
  const path = vectorCache.get(group)?.[name];
  React.useEffect(() => { if (!path) void loadVectorGroup(group); }, [group, path]);
  return path;
}

function VectorGlyph({ name, ...rest }: { name: VectorIconName } & React.SVGProps<SVGSVGElement>) {
  const d = useVectorPath(name);
  return <svg viewBox="0 0 24 24" fill="currentColor" fillRule="evenodd" focusable="false" {...rest}>{d ? <path d={d} /> : null}</svg>;
}

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

export interface IconProps extends Omit<VariantProps<typeof iconVariants>, 'size'> {
  name: IconName;
  /** small 16 · medium 24 (padrão) · large 32 · xlarge 56, ou um número em px para um caso fora da escala. */
  size?: VariantProps<typeof iconVariants>['size'] | number;
  /** Cor CSS avulsa (ex.: `var(--token)`). Prefira `tone`, que usa o papel da cor. Vence o `tone` quando os dois vêm. */
  color?: string;
  /** auto: Lucide primeiro, depois o set vetorial. vector: força o set vetorial quando o nome existe nos dois. */
  source?: 'auto' | 'vector';
  /** Rótulo acessível. Sem ele o ícone é decorativo (aria-hidden). */
  label?: string;
  className?: string;
}

export function Icon({ name, size, tone, color, source = 'auto', label, className }: IconProps) {
  const px = typeof size === 'number' ? size : undefined;
  const variant = typeof size === 'number' ? undefined : size;
  const style: React.CSSProperties | undefined = px || color ? { width: px, height: px, color } : undefined;
  const a11y = { role: label ? 'img' : undefined, 'aria-label': label, 'aria-hidden': label ? undefined : true } as const;
  const lucideKey = (name in ICONS ? name : ICON_ALIASES[name as keyof typeof ICON_ALIASES]) as keyof typeof ICONS | undefined;
  const useVector = isVectorIcon(name) && (source === 'vector' || !lucideKey);
  if (useVector) {
    return <VectorGlyph name={name} className={cn(iconVariants({ size: variant, tone }), className)} style={style} {...a11y} />;
  }
  const Cmp = lucideKey ? ICONS[lucideKey] : undefined;
  if (!Cmp) return null;
  return (
    <Cmp
      className={cn(iconVariants({ size: variant, tone }), className)}
      style={style}
      strokeWidth={2}
      focusable="false"
      {...a11y}
    />
  );
}
