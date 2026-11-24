# -*- coding: utf-8 -*-
"""Alinha componentes do Campana ao desenho final das telas da v2 do app (protótipo, 201 telas).
Rode logo depois de aplicar-v2-componentes.py (que refaz files/src a partir da v4). Cada troca confere que o trecho existe.

O que muda, conforme o app:
  · tons de categoria (tile de ícone e avatar) e degraus do pódio: tokens surface-tint-* e surface-podium-*
  · InstitutionRow: cartão branco 28px, tile de ícone de 60px em tom de categoria, botão redondo com seta
  · RankingRow e Podium: avatares em tom, linhas brancas com sombra, degraus pêssego/areia/laranja
  · HomeGreeting: avatar com inicial, nome, espaço de recebimento, QR e ajuda
  · BalanceCard: tone "hero" (cartão azul-marinho com o saldo em laranja), agora o padrão do Início
  · SignupStep: barra de progresso no topo, ícone no tile e botão fixo no pé da tela
"""
import os, sys
root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
src = os.path.join(root, 'design-system/files/src')


def ler(f): return open(os.path.join(src, f), encoding='utf-8').read()
def gravar(f, s): open(os.path.join(src, f), 'w', encoding='utf-8').write(s)


def rep(f, pairs):
    s = ler(f)
    for a, b in pairs:
        if a not in s: print('NÃO ACHEI em', f, ':', a[:80]); sys.exit(1)
        s = s.replace(a, b, 1)
    gravar(f, s)


def trocar_bloco(f, ini, fim, novo):
    """Troca tudo de `ini` (inclusive) até `fim` (exclusive)."""
    s = ler(f)
    i = s.find(ini); j = s.find(fim, i + 1)
    if i < 0 or j < 0: print('NÃO ACHEI bloco em', f, ':', ini[:60], '…', fim[:60]); sys.exit(1)
    gravar(f, s[:i] + novo + s[j:])


# ------------------------------------------------------------------ tons de categoria (lib/utils.ts)
s = ler('lib/utils.ts')
if 'tintFor' not in s:
    s += '''
/** Tom de categoria (tile de ícone, avatar). Cada um aponta para um token surface-tint-*; o ícone e a inicial ficam em foreground por cima. */
export type Tint = 'peach' | 'green' | 'blue' | 'lavender' | 'pink' | 'yellow';
export const tintBg: Record<Tint, string> = {
  peach: 'bg-surface-tint-peach',
  green: 'bg-surface-tint-green',
  blue: 'bg-surface-tint-blue',
  lavender: 'bg-surface-tint-lavender',
  pink: 'bg-surface-tint-pink',
  yellow: 'bg-surface-tint-yellow',
};
const TINTS: Tint[] = ['lavender', 'pink', 'blue', 'green', 'yellow', 'peach'];
/** Sempre o mesmo tom para o mesmo texto (nome da pessoa, categoria). */
export function tintFor(seed: string): Tint {
  let h = 0;
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return TINTS[h % TINTS.length]!;
}
'''
    gravar('lib/utils.ts', s)
rep('index.ts', [("export { cn, focusRing, disabledState, hitArea } from './lib/utils';", "export { cn, focusRing, disabledState, hitArea, tintBg, tintFor, type Tint } from './lib/utils';")])

# ------------------------------------------------------------------ InstitutionRow
rep('soma/donate.tsx', [("import { cn, fmt, focusRing, hitArea, hitAreaY } from '../lib/utils';", "import { cn, fmt, focusRing, hitArea, hitAreaY, tintBg, tintFor, type Tint } from '../lib/utils';")])
trocar_bloco('soma/donate.tsx', 'export interface InstitutionRowProps {', '/* ------------------------------------------------------ DonationAmountCard */', '''export interface InstitutionRowProps {
  name: string;
  description: string;
  /** Ícone da causa (cesta, coração, talheres…). Aparece em tile de 60px colorido pela categoria. */
  icon?: IconName;
  /** Tom do tile, por categoria da causa. Sem ele, o tom sai do nome (sempre o mesmo para a mesma instituição). */
  tint?: Tint;
  href?: string;
  onPress?: () => void;
}
/** Instituição na lista "Escolha para quem você quer doar seus pontos": cartão branco tocável com tile de ícone em tom de categoria, nome, causa e botão redondo com seta. */
export function InstitutionRow({ name, description, icon = 'heart', tint, href, onPress }: InstitutionRowProps) {
  return (
    <PressableBase
      href={href}
      onClick={onPress}
      className={cn(pressable, 'grid w-full grid-cols-[auto_1fr_auto] items-center gap-micro rounded-2xl bg-surface-primary p-[14px] text-left text-foreground shadow-card hover:bg-surface-secondary active:bg-surface-secondary-hover')}
    >
      <span aria-hidden className={cn('grid size-[60px] place-items-center rounded-lg', tintBg[tint ?? tintFor(name)])}><Icon name={icon} /></span>
      <span className="grid gap-xnano">
        <span className="label">{name}</span>
        <span className="body-small text-muted-foreground">{description}</span>
      </span>
      <span aria-hidden className="grid size-[36px] place-items-center rounded-full bg-surface-secondary"><Icon name="chevron-right" size="small" /></span>
    </PressableBase>
  );
}

''')

# ------------------------------------------------------------------ Podium e RankingRow
rep('soma/impact.tsx', [
    ("import { cn, fmt } from '../lib/utils';", "import { cn, fmt, tintBg, tintFor, type Tint } from '../lib/utils';"),
    ("""const STEP: Record<1 | 2 | 3, { fill: string; h: string; avatar: string }> = {
  1: { fill: 'bg-award-gold text-foreground', h: 'h-[46px]', avatar: 'size-[64px]' },
  2: { fill: 'bg-award-silver text-foreground', h: 'h-[34px]', avatar: 'size-[54px]' },
  3: { fill: 'bg-award-bronze text-text-inverse', h: 'h-[26px]', avatar: 'size-[54px]' },
};""", """const STEP: Record<1 | 2 | 3, { fill: string; h: string; avatar: string; face: string }> = {
  1: { fill: 'bg-primary text-foreground', h: 'h-[46px]', avatar: 'size-[64px]', face: 'bg-surface-tint-peach' },
  2: { fill: 'bg-surface-podium-2 text-foreground', h: 'h-[34px]', avatar: 'size-[52px]', face: 'bg-surface-tint-blue' },
  3: { fill: 'bg-surface-podium-3 text-foreground', h: 'h-[26px]', avatar: 'size-[52px]', face: 'bg-surface-tint-lavender' },
};"""),
    ("const SELF_FILL = 'bg-interactive-fill-loud text-foreground';", "const SELF_FILL = 'bg-interactive-fill-loud text-foreground';\nconst SELF_FACE = 'bg-interactive-fill-loud text-foreground ring-[2.5px] ring-inset ring-foreground';"),
    ("/** Os três primeiros: avatares sobre degraus ouro, prata e bronze (Ranking do redesign). Colunas de 100px, degraus retos com o número centralizado. */", "/** Os três primeiros: avatares em tom claro sobre degraus laranja, areia e pêssego, como no Ranking da v2. Colunas de 100px, degraus retos com o número centralizado. */"),
    ("        const fill = e.self ? SELF_FILL : STEP[e.position].fill;\n", "        const fill = e.self ? SELF_FILL : STEP[e.position].fill;\n        const face = e.self ? SELF_FACE : STEP[e.position].face;\n"),
    ("<AvatarFallback className={cn('body-strong', fill)}>{e.anonymous", "<AvatarFallback className={cn('body-strong text-foreground', face)}>{e.anonymous"),
    ("  /** Letras do avatar quando diferem do nome exibido (\"Você (Policarpo)\" → \"P\"). */\n  initials?: string;\n  /** Linha da própria pessoa", "  /** Letras do avatar quando diferem do nome exibido (\"Você (Policarpo)\" → \"P\"). */\n  initials?: string;\n  /** Tom do avatar. Sem ele, sai do nome (o mesmo tom para a mesma pessoa). */\n  tint?: Tint;\n  /** Linha da própria pessoa"),
    ("export function RankingRow({ position, name, kg, photo, initials: letters, self, hint }: RankingRowProps) {", "export function RankingRow({ position, name, kg, photo, initials: letters, tint, self, hint }: RankingRowProps) {"),
    ("'grid list-none grid-cols-[auto_36px_1fr_auto] items-center gap-x-micro rounded-md border p-micro', self ? 'border-border-highlight bg-surface-accent' : 'border-border bg-card')", "'grid list-none grid-cols-[auto_36px_1fr_auto] items-center gap-x-micro rounded-lg border p-micro', self ? 'border-border-highlight bg-surface-accent' : 'border-transparent bg-card shadow-card')"),
    ("self ? 'bg-interactive-fill-loud' : 'bg-surface-secondary')}>{letters ?? initials(name)}", "self ? 'bg-interactive-fill-loud' : tintBg[tint ?? tintFor(name)])}>{letters ?? initials(name)}"),
])

# ------------------------------------------------------------------ HomeGreeting e BalanceCard
rep('soma/home.tsx', [("import { Icon, type IconName } from '../ui/icon';", "import { Icon, type IconName } from '../ui/icon';\nimport { Avatar, AvatarImage, AvatarFallback } from '../ui/display';")])
trocar_bloco('soma/home.tsx', 'export interface HomeGreetingProps {', 'export interface TileProps {', '''export interface HomeGreetingProps {
  /** Primeiro nome. Mostra "Olá {nome}" e a inicial no avatar. */
  name: string;
  /** Espaço de recebimento ("Casa so+ma Batel"), em linha de apoio sob o nome, com o ícone de local. */
  location?: string;
  /** Foto da pessoa. Sem ela, o avatar mostra a inicial. */
  photo?: string;
  /** Abre o cartão QR da pessoa (disco branco à direita). Sem ele, o botão não aparece. */
  onQr?: () => void;
  /** Abre a ajuda (disco branco à direita). Sem ele, o botão não aparece. */
  onHelp?: () => void;
}
const disc = 'size-touch shrink-0 rounded-full bg-surface-primary text-icon-brand shadow-card hover:bg-surface-secondary active:bg-surface-secondary-hover';
/** Saudação do Início (v2): avatar laranja com a inicial, "Olá Mônica" em screen-title, o espaço de recebimento embaixo e os botões de QR e ajuda em discos brancos. */
export function HomeGreeting({ name, location, photo, onQr, onHelp }: HomeGreetingProps) {
  return (
    <div className="flex items-center gap-micro text-foreground">
      <Avatar className="size-[48px]">
        {photo && <AvatarImage src={photo} alt="" />}
        <AvatarFallback className="body-strong bg-interactive-fill-loud text-foreground">{name.trim().charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="grid min-w-0 flex-1 gap-0">
        <h1 className="screen-title m-0 truncate">Olá {name}</h1>
        {location && <p className="caption m-0 flex items-center gap-xnano text-muted-foreground"><Icon name="pin" size="small" tone="brand" /><span className="truncate">{location}</span></p>}
      </div>
      {onQr && <IconButton icon="qr-code" label="Meu cartão QR" onClick={onQr} className={disc} />}
      {onHelp && <IconButton icon="help" label="Ajuda" onClick={onHelp} className={disc} />}
    </div>
  );
}

''')
trocar_bloco('soma/home.tsx', 'export interface BalanceCardProps {', 'export interface QuestionTeaserProps {', '''export interface BalanceCardProps {
  points: number;
  /** Legenda de apoio. Com saldo zero e sem hint, o card chama para a primeira entrega. */
  hint?: string;
  href?: string;
  onPress?: () => void;
  /** hero = cartão azul-marinho com o saldo em laranja (Início da v2, padrão) · light = cartão creme tocável com seta · dark = faixa escura com botão (Início com meta, Tela 17). */
  tone?: 'hero' | 'light' | 'dark';
  /** Só no tone dark: o botão à direita ("Ver meta"). */
  action?: { label: string; onClick?: () => void; href?: string };
}
export function BalanceCard({ points, hint, href, onPress, tone = 'hero', action }: BalanceCardProps) {
  const text = hint ?? (points === 0 ? 'Faça sua primeira entrega e comece a pontuar' : undefined);
  if (tone === 'hero') {
    return (
      <PressableBase
        href={href}
        onClick={onPress}
        className={cn(pressable, 'relative grid min-h-[150px] w-full content-between gap-nano overflow-hidden rounded-3xl bg-surface-inverse p-small text-left text-text-inverse shadow-dark')}
      >
        <span aria-hidden className="pointer-events-none absolute -right-[30px] -top-[60px] size-[240px] rounded-full bg-surface-primary/[.07]" />
        <span aria-hidden className="pointer-events-none absolute -bottom-[60px] -right-[10px] size-[140px] rounded-full bg-surface-primary/[.07]" />
        <span className="relative flex items-center justify-between gap-nano">
          <span className="body-small">Saldo atual</span>
          <span aria-hidden className="grid size-[32px] place-items-center rounded-full bg-surface-primary text-foreground"><Icon name="chevron-right" size="small" /></span>
        </span>
        <span className="relative grid gap-0">
          <span className="flex items-baseline gap-nano"><span className="balance-number text-primary">{fmt(points)}</span><span className="subtitle">{points === 1 ? 'ponto' : 'pontos'}</span></span>
          {text && <span className="caption">{text}</span>}
        </span>
      </PressableBase>
    );
  }
  if (tone === 'dark') {
    return (
      <section aria-label="Saldo atual" className="grid grid-cols-[1fr_auto] items-center gap-nano rounded-lg bg-surface-inverse p-mini text-text-inverse">
        <span className="grid gap-xnano">
          <span className="eyebrow uppercase text-icon-brand">Seu saldo atual</span>
          <span className="page-title">{fmt(points)} {points === 1 ? 'ponto' : 'pontos'}</span>
          {text && <span className="caption">{text}</span>}
        </span>
        {action && <Button size="compact" asChild={!!action.href} onClick={action.onClick}>{action.href ? <a href={action.href}>{action.label}</a> : action.label}</Button>}
      </section>
    );
  }
  return (
    <PressableBase
      href={href}
      onClick={onPress}
      className={cn(pressable, 'grid min-h-[104px] w-full grid-cols-[1fr_auto] items-center gap-nano rounded-lg bg-surface-accent p-mini text-foreground hover:bg-surface-accent-hover active:bg-surface-accent-hover')}
    >
      <span className="grid gap-0 self-start">
        <span className="caption">Saldo atual</span>
        <span className="flex items-baseline gap-nano"><span className="balance-number font-normal">{fmt(points)}</span><span className="subtitle">{points === 1 ? 'ponto' : 'pontos'}</span></span>
        {text && <span className="caption text-muted-foreground">{text}</span>}
      </span>
      <Icon name="chevron-right" tone="brand-strong" />
    </PressableBase>
  );
}

''')

# ------------------------------------------------------------------ Tile e QuestionTeaser
trocar_bloco('soma/home.tsx', 'export interface TileProps {', 'export function TileGrid(', '''/** light = cartão branco (padrão) · primary = laranja da marca (a ação que gera pontos) · dark = azul-marinho · peach = pêssego. */
export type TileTone = 'light' | 'primary' | 'dark' | 'peach';
export interface TileProps { icon: IconName; label: string; tone?: TileTone; href?: string; onClick?: () => void }
const TILE: Record<TileTone, { box: string; disc: string }> = {
  light: { box: 'bg-surface-primary text-foreground shadow-card hover:bg-surface-secondary active:bg-surface-secondary-hover', disc: 'bg-surface-tint-peach text-icon-brand' },
  primary: { box: 'bg-primary text-primary-foreground shadow-card hover:bg-interactive-fill-loud-hover active:bg-interactive-fill-loud-active', disc: 'bg-surface-tint-peach text-icon-brand' },
  dark: { box: 'bg-surface-inverse text-text-inverse shadow-dark', disc: 'bg-surface-primary/[.12] text-text-inverse' },
  peach: { box: 'bg-surface-tint-peach text-foreground hover:bg-interactive-fill-quiet-hover active:bg-interactive-fill-quiet-active', disc: 'bg-surface-primary text-icon-brand' },
};
/** Atalho do Início (v2): disco com o ícone em cima, rótulo de até duas linhas embaixo, em cartão de 128px. */
export function Tile({ icon, label, tone = 'light', href, onClick }: TileProps) {
  return (
    <PressableBase
      href={href}
      onClick={onClick}
      className={cn(pressable, 'flex min-h-[128px] flex-col items-start justify-between gap-nano rounded-2xl p-mini text-left', TILE[tone].box)}
    >
      <span aria-hidden className={cn('grid size-[44px] place-items-center rounded-full', TILE[tone].disc)}><Icon name={icon} /></span>
      <span className="label">{label}</span>
    </PressableBase>
  );
}
''')
trocar_bloco('soma/home.tsx', 'export function QuestionTeaser(', 'export interface GoalSummaryCardProps', '''export function QuestionTeaser({ question, hint = 'Responda para somar pontos e trocar por recompensas.', href, onPress }: QuestionTeaserProps) {
  return (
    <PressableBase
      href={href}
      onClick={onPress}
      className={cn(pressable, 'grid w-full gap-nano rounded-2xl bg-surface-tint-peach p-small text-left text-foreground hover:bg-interactive-fill-quiet-hover active:bg-interactive-fill-quiet-active')}
    >
      <span className="eyebrow inline-flex w-fit items-center gap-xnano rounded-full bg-surface-primary px-micro py-xnano uppercase text-text-link"><Icon name="sparkles" size="small" />Pergunta do dia</span>
      <span className="grid grid-cols-[1fr_auto] items-end gap-nano">
        <span className="grid gap-xnano">
          <span className="screen-title">{question}</span>
          <span className="body-small text-muted-foreground">{hint}</span>
        </span>
        <span aria-hidden className="grid size-[48px] place-items-center rounded-full bg-surface-inverse text-text-inverse"><Icon name="chevron-right" /></span>
      </span>
    </PressableBase>
  );
}

''')

# ------------------------------------------------------------------ SectionHeader: a ação não quebra em várias linhas ("Ver todas (12)")
rep('soma/navigation.tsx', [("className={cn(pressable, hitAreaY, 'caption rounded-xs font-semibold text-text-link')}>{action.label}</button>", "className={cn(pressable, hitAreaY, 'caption shrink-0 whitespace-nowrap rounded-xs font-semibold text-text-link')}>{action.label}</button>")])

# ------------------------------------------------------------------ SignupStep
rep('soma/signup.tsx', [
    ("import { Button } from '../ui/button';\nimport { Icon } from '../ui/icon';", "import { Button, IconButton } from '../ui/button';\nimport { Icon, type IconName } from '../ui/icon';"),
    ("import { cn } from '../lib/utils';", "import { cn, tintBg } from '../lib/utils';"),
    ("import { StepDots } from './navigation';\n", ""),
])

trocar_bloco('soma/signup.tsx', 'export interface SignupStepProps {', '/* ------------------------------------------------------------ TermsConsent */', '''export interface SignupStepProps {
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
        {onBack ? <IconButton icon="arrow-left" label="Voltar" onClick={onBack} className={stepDisc} /> : <span />}
        {onHelp ? <IconButton icon="help" label="Ajuda" onClick={onHelp} className={stepDisc} /> : <span />}
      </header>
      <div className="grid content-start gap-small pt-large">
        {icon && <span aria-hidden className={cn('grid size-[52px] place-items-center rounded-lg', tintBg.peach)}><Icon name={icon} tone="brand" /></span>}
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

''')

# ------------------------------------------------------------------ StepDots ("Passo N de 7") saiu do sistema
n = ler('soma/navigation.tsx')
marca = '/* --------------------------------------------------------------- StepDots */'
i = n.find(marca)
if i < 0: print('NÃO ACHEI o bloco StepDots'); sys.exit(1)
n = n[:i].rstrip('\n') + '\n'
n = n.replace(', ListRow, StepDots.', ', ListRow.')
gravar('soma/navigation.tsx', n)
rep('index.ts', [("ListRow, StepDots, listRowVariants", "ListRow, listRowVariants"), ("ListRowProps, StepDotsProps }", "ListRowProps }")])
print('ok alinhar-app-componentes')
