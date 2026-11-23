# -*- coding: utf-8 -*-
"""Aplica a linguagem visual da v2 no código dos componentes (design-system/files/src). Cada troca confere que o trecho existe.
Só rode sobre a fonte da v4 (ela guarda uma cópia em src-v4/ na primeira execução)."""
import os, shutil, sys
root=os.path.abspath(os.path.join(os.path.dirname(__file__),'..'))
src=os.path.join(root,'design-system/files/src'); bak=os.path.join(root,'tools/src-v4')
if not os.path.exists(bak): shutil.copytree(src,bak)
else:
    shutil.rmtree(src); shutil.copytree(bak,src)   # idempotente: parte sempre da v4
# o preset é gerado por migrar-tokens-v2.py, que roda de novo no fim
def rep(f,pairs):
    p=os.path.join(src,f); s=open(p,encoding='utf-8').read()
    for a,b in pairs:
        if a not in s: print('NÃO ACHEI em',f,':',a[:70]); sys.exit(1)
        s=s.replace(a,b)
    open(p,'w',encoding='utf-8').write(s)
# ---------------- Button ----------------
rep('ui/button.tsx',[
("rounded-md border-[1.5px] border-transparent","rounded-full border-[1.5px] border-transparent"),
("'font-sans transition-colors duration-150 motion-reduce:transition-none select-none cursor-pointer',","'font-sans transition-[background-color,box-shadow,transform] duration-100 ease-out active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100 select-none cursor-pointer',"),
("'disabled:pointer-events-none disabled:border-transparent disabled:bg-interactive-fill-disabled","'disabled:pointer-events-none disabled:border-transparent disabled:shadow-none disabled:bg-interactive-fill-disabled"),
("'aria-disabled:pointer-events-none aria-disabled:border-transparent aria-disabled:bg-interactive-fill-disabled","'aria-disabled:pointer-events-none aria-disabled:border-transparent aria-disabled:shadow-none aria-disabled:bg-interactive-fill-disabled"),
("loud: 'bg-primary text-primary-foreground hover:","loud: 'bg-primary text-primary-foreground shadow-glow hover:"),
("quiet: 'border-interactive-border-quiet bg-surface-primary text-foreground hover:bg-interactive-fill-quiet-hover active:bg-interactive-fill-quiet-active [&_svg]:text-icon-brand',","quiet: 'bg-surface-primary text-foreground shadow-card hover:bg-surface-accent active:bg-interactive-fill-quiet-active [&_svg]:text-icon-primary',\n        /** dark = ação forte secundária (Mostrar meu QR, Compartilhar). */\n        dark: 'bg-surface-inverse text-text-inverse shadow-dark hover:bg-surface-inverse/[.9] active:bg-surface-inverse/[.8] [&_svg]:text-icon-brand',"),
("large: 'min-h-button px-small',","large: 'min-h-button px-small',"),
("compact: 'min-h-touch px-mini',","compact: 'min-h-tab-item px-mini',"),
("/** loud = primário (um por tela) · quiet = outline · transparent = texto/link · destructive = ação que apaga ou sai. */","/** loud = primário laranja (um por tela) · dark = escuro · quiet = claro com sombra · transparent = texto/link · destructive = ação que apaga ou sai. */"),
("/** large = 48px (padrão) · compact = 44px, para listas e cards densos · icon = quadrado de 44px. */","/** large = 56px (padrão) · compact = 48px, para listas e cards densos · icon = disco de 44px. */"),
])
# ---------------- Form ----------------
rep('ui/form.tsx',[
("'body w-full rounded-md border border-input bg-surface-primary px-mini text-foreground font-sans',","'body w-full rounded-lg border border-border bg-surface-primary px-[18px] text-foreground font-sans shadow-card',"),
("'hover:border-text-secondary focus-visible:border-border-highlight',","'hover:border-input focus-visible:border-border-highlight',"),
("'peer group grid size-xsmall shrink-0 cursor-pointer place-items-center rounded-xs border-[1.5px] border-input bg-surface-primary transition-colors',","'peer group grid size-[26px] shrink-0 cursor-pointer place-items-center rounded-xs border-2 border-input bg-surface-primary transition-colors',"),
("'data-[state=checked]:border-text-primary data-[state=checked]:bg-surface-inverse data-[state=checked]:text-text-inverse',","'data-[state=checked]:border-transparent data-[state=checked]:bg-primary data-[state=checked]:text-text-on-loud',"),
("'data-[state=indeterminate]:border-text-primary data-[state=indeterminate]:bg-surface-inverse data-[state=indeterminate]:text-text-inverse',","'data-[state=indeterminate]:border-transparent data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-text-on-loud',"),
("'peer inline-flex h-small w-touch shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors',\n          'bg-text-secondary hover:bg-text-primary data-[state=checked]:bg-surface-inverse',","'peer inline-flex h-[32px] w-[52px] shrink-0 cursor-pointer items-center rounded-full border-0 transition-colors',\n          'bg-interactive-fill-disabled hover:bg-surface-track data-[state=checked]:bg-primary',"),
("'pointer-events-none block size-xsmall rounded-full bg-surface-primary transition-transform motion-reduce:transition-none',\n            'data-[state=checked]:translate-x-xsmall data-[state=checked]:bg-primary data-[state=unchecked]:translate-x-0 data-[disabled]:bg-interactive-fill-disabled',","'pointer-events-none block size-[26px] rounded-full bg-surface-primary shadow-card transition-transform duration-200 motion-reduce:transition-none',\n            'data-[state=checked]:translate-x-[23px] data-[state=unchecked]:translate-x-[3px]',"),
("'peer grid aspect-square size-xsmall shrink-0 cursor-pointer place-items-center rounded-full border-[1.5px] border-input","'peer grid aspect-square size-[26px] shrink-0 cursor-pointer place-items-center rounded-full border-2 border-input"),
("hover:border-text-primary active:bg-interactive-fill-quiet-active data-[state=checked]:border-text-primary',","hover:border-text-primary active:bg-interactive-fill-quiet-active data-[state=checked]:border-transparent data-[state=checked]:bg-primary',"),
])
# ---------------- Display ----------------
rep('ui/display.tsx',[
("'inline-flex items-center gap-xnano min-h-small px-micro rounded-full font-sans text-[12px] leading-4 font-medium whitespace-nowrap","'inline-flex items-center gap-xnano min-h-[24px] px-[10px] py-[4px] rounded-full font-sans text-[12px] leading-4 font-bold whitespace-nowrap"),
("cva('grid rounded-lg text-card-foreground', {","cva('grid rounded-xl text-card-foreground', {"),
("outline: 'border border-border bg-card',","outline: 'bg-card shadow-card',"),
("inverse: 'bg-surface-inverse text-text-inverse',","inverse: 'bg-surface-inverse text-text-inverse shadow-dark',"),
])
# ---------------- Overlay (Dialog, Sheet, Tabs) ----------------
s=open(os.path.join(src,'ui/overlay.tsx'),encoding='utf-8').read()
assert s.count('overflow-y-auto rounded-lg bg-popover')==2
s=s.replace('overflow-y-auto rounded-lg bg-popover','overflow-y-auto rounded-xl bg-popover shadow-high')
open(os.path.join(src,'ui/overlay.tsx'),'w',encoding='utf-8').write(s)
rep('ui/overlay.tsx',[
("'fixed z-50 grid gap-mini bg-popover p-mini pb-small text-popover-foreground shadow-high outline-none motion-reduce:animate-none',","'fixed z-50 grid gap-mini bg-background p-mini pb-small text-popover-foreground shadow-sheet outline-none motion-reduce:animate-none',"),
("bottom: 'inset-x-0 bottom-0 max-h-[90dvh] overflow-y-auto rounded-t-xl ","bottom: 'inset-x-0 bottom-0 max-h-[90dvh] overflow-y-auto rounded-t-sheet "),
("segmented: 'gap-xnano rounded-md border border-border bg-surface-primary p-xnano',","segmented: 'gap-0 rounded-full bg-surface-secondary p-xnano',"),
("'min-h-touch rounded-sm text-foreground hover:bg-interactive-fill-quiet-hover active:bg-interactive-fill-quiet-active disabled:hover:bg-transparent data-[state=active]:hover:bg-interactive-fill-loud-hover',\n          'data-[state=active]:bg-primary data-[state=active]:font-semibold data-[state=active]:text-primary-foreground',","'min-h-[40px] rounded-full text-muted-foreground hover:text-foreground disabled:hover:bg-transparent data-[state=active]:hover:bg-surface-inverse',\n          'data-[state=active]:bg-surface-inverse data-[state=active]:font-semibold data-[state=active]:text-text-inverse',"),
("'min-h-touch rounded-full border border-border-highlight bg-surface-primary px-mini font-semibold text-foreground hover:bg-interactive-fill-quiet-hover active:bg-interactive-fill-quiet-active disabled:hover:bg-surface-primary',\n          'data-[state=active]:border-transparent data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:hover:bg-interactive-fill-loud-hover',","'min-h-chip rounded-full bg-surface-primary px-mini font-semibold text-foreground shadow-card hover:bg-surface-accent active:bg-interactive-fill-quiet-active disabled:hover:bg-surface-primary',\n          'data-[state=active]:bg-surface-inverse data-[state=active]:text-text-inverse data-[state=active]:shadow-none data-[state=active]:hover:bg-surface-inverse',"),
])
rep('ui/menus.tsx',[("rounded-t-xl bg-popover p-mini pb-small text-popover-foreground shadow-high outline-none","rounded-t-sheet bg-background p-mini pb-small text-popover-foreground shadow-sheet outline-none")])
# ---------------- Controls (Toggle chip, busca, OTP) ----------------
rep('ui/controls.tsx',[
("'label inline-flex cursor-pointer select-none items-center justify-center gap-nano rounded-md border-[1.5px]","'label inline-flex cursor-pointer select-none items-center justify-center gap-nano rounded-full border-[1.5px]"),
("'flex h-input w-full items-center rounded-md border border-input bg-surface-primary text-foreground transition-colors motion-reduce:transition-none',","'flex h-button w-full items-center rounded-full border border-border bg-surface-primary text-foreground shadow-card transition-colors motion-reduce:transition-none',"),
("'body h-full min-w-0 flex-1 rounded-md border-0","'body h-full min-w-0 flex-1 rounded-full border-0"),
("'relative grid h-input w-button place-items-center rounded-md border border-input bg-surface-primary","'relative grid h-button w-button place-items-center rounded-lg border border-border bg-surface-primary shadow-card"),
])
# ---------------- Navegação ----------------
rep('soma/navigation.tsx',[
("const roundBtn = 'size-touch rounded-full bg-surface-accent text-icon-brand-strong hover:bg-surface-accent-hover active:bg-surface-accent-hover';","const roundBtn = 'size-back rounded-full bg-surface-primary text-icon-primary shadow-card hover:bg-surface-accent active:bg-surface-accent';"),
("const round = variant === 'round' || variant === 'start';","const round = true;"),
("const shell = cn('bg-surface-primary px-xsmall py-nano text-foreground', divider && 'border-b border-border', className);","const shell = cn('bg-transparent px-xsmall py-nano text-foreground', className);"),
("variant === 'round' ? 'label text-muted-foreground' : variant === 'eyebrow' ? 'eyebrow uppercase tracking-wide text-muted-foreground' : 'header-title')","variant === 'round' ? 'subtitle text-foreground' : variant === 'eyebrow' ? 'eyebrow uppercase tracking-wide text-muted-foreground' : 'header-title')"),
("className=\"grid min-h-tabbar grid-cols-5 border-t border-border bg-surface-primary\"","className=\"mx-mini mb-small flex min-h-tabbar w-[calc(100%-32px)] [contain:inline-size] items-center justify-between rounded-3xl bg-surface-primary/[.86] px-nano shadow-float backdrop-blur-[24px] motion-reduce:backdrop-blur-none motion-reduce:bg-surface-primary\""),
("'tab-label flex min-h-touch flex-col items-center justify-center gap-xnano py-nano text-muted-foreground hover:text-foreground',\n              'aria-[current=page]:font-semibold aria-[current=page]:text-text-link',","'flex size-tab-item items-center justify-center rounded-full text-icon-secondary hover:text-foreground',\n              'aria-[current=page]:w-auto aria-[current=page]:gap-[6px] aria-[current=page]:bg-primary aria-[current=page]:px-micro aria-[current=page]:text-text-on-loud',"),
("            <Icon name={t.icon} />\n            {t.label}","            <Icon name={t.icon} />\n            <span className={on ? 'caption font-bold' : 'sr-only'}>{t.label}</span>"),
("help: 'rounded-md bg-surface-accent px-mini py-micro hover:bg-surface-accent-hover active:bg-surface-accent-hover',","help: 'min-h-row rounded-lg bg-surface-primary px-micro py-nano shadow-card hover:bg-surface-accent active:bg-surface-accent',"),
])
# StepDots: segmentos
rep('soma/navigation.tsx',[
("    <div className={cn('flex items-center justify-center gap-nano', className)}>\n      <span className=\"sr-only\">Passo {current} de {total}</span>\n      {Array.from({ length: total }, (_, i) => (\n        <span key={i} aria-hidden className={cn('size-nano rounded-full', i + 1 === current ? 'bg-selected-indicator' : 'bg-indicator-inactive')} />\n      ))}\n    </div>","    <div className={cn('grid justify-items-center gap-[6px]', className)}>\n      <div aria-hidden className=\"flex items-center gap-[6px]\">\n        {Array.from({ length: total }, (_, i) => (\n          <span key={i} className={cn('h-[6px] rounded-full', i + 1 === current ? 'w-[28px]' : 'w-[20px]', i + 1 <= current ? 'bg-selected-indicator' : 'bg-surface-track')} />\n        ))}\n      </div>\n      <span className=\"micro text-muted-foreground\">Passo {current} de {total}</span>\n    </div>"),
])
# ---------------- Campo de texto com rótulo flutuante e busca ----------------
rep('soma/forms.tsx',[
("className={cn('pl-xlarge pr-xlarge [&::-webkit-search-cancel-button]:hidden', border === 'app' && 'border-border')}","className={cn('h-button rounded-full pl-xlarge pr-xlarge [&::-webkit-search-cancel-button]:hidden', border === 'app' && 'border-border')}"),
("      className={trailing ? 'pr-xlarge' : undefined}\n    />\n  );\n  return (\n    <div className={cn('grid gap-nano', className)}>\n      <Label htmlFor={fid} className=\"body-small font-normal\">{label}{required && <span aria-hidden>*</span>}</Label>\n      {trailing ? <div className=\"relative\">{input}<div className=\"absolute right-xnano top-1/2 -translate-y-1/2\">{trailing}</div></div> : input}",
 "      className={cn('pb-[8px] pt-[26px]', trailing && 'pr-xlarge')}\n    />\n  );\n  return (\n    <div className={cn('grid gap-nano', className)}>\n      <div className=\"group relative\">\n        {input}\n        <Label htmlFor={fid} className=\"micro pointer-events-none absolute left-[18px] top-[12px] z-10 font-bold text-muted-foreground group-focus-within:text-text-link group-has-[[aria-invalid=true]]:text-feedback-text-negative\">{label}{required && <span aria-hidden>*</span>}</Label>\n        {trailing && <div className=\"absolute right-xnano top-1/2 -translate-y-1/2\">{trailing}</div>}\n      </div>"),
])
# ---------------- Feedback ----------------
rep('soma/feedback.tsx',[
("cva('flex items-center gap-nano rounded-sm px-mini py-micro text-text-inverse', {","cva('flex items-center gap-nano rounded-md px-mini py-micro text-text-inverse shadow-high', {"),
("className=\"flex items-center gap-micro rounded-lg border border-border bg-card py-nano pl-nano pr-mini text-card-foreground\"","className=\"flex items-center gap-micro rounded-xl bg-card py-nano pl-nano pr-mini text-card-foreground shadow-high\""),
])
# ---------------- escala de texto da v2: 20 e 24px viram 22px (Title M) ----------------
rep('ui/controls.tsx',[("text-[20px] font-semibold leading-7","text-[22px] font-semibold leading-7")])
rep('soma/impact.tsx',[("m-0 text-[24px] font-bold leading-8","m-0 text-[22px] font-bold leading-7")])
rep('soma/rewards.tsx',[("select-all font-sans text-[24px] font-bold leading-8","select-all font-sans text-[22px] font-bold leading-7")])
print('ok')
