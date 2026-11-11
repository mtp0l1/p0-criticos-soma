/* Primitivas de menu e sobreposição no padrão shadcn/ui: DropdownMenu, Command, Combobox, Drawer. */
import * as React from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { Command as CommandPrimitive } from 'cmdk';
import { Drawer as DrawerPrimitive } from 'vaul';
import { Check, ChevronDown, ChevronRight, Search } from 'lucide-react';
import { cn, focusRing } from '../lib/utils';
import { fieldBase } from './form';
import { Popover, PopoverContent, PopoverTrigger } from './overlay';

const menuSurface = 'z-50 min-w-[200px] max-w-[calc(100vw-32px)] overflow-hidden rounded-md border border-border bg-popover p-xnano text-popover-foreground shadow-high';
const menuItem = cn(
  'body-small relative flex min-h-touch cursor-pointer select-none items-center gap-nano rounded-sm px-micro font-sans outline-none transition-colors',
  '[&_svg]:pointer-events-none [&_svg]:size-icon-small [&_svg]:shrink-0 [&_svg]:text-icon-brand-strong',
  'data-[highlighted]:bg-accent data-[disabled]:pointer-events-none data-[disabled]:text-interactive-text-disabled data-[disabled]:[&_svg]:text-interactive-text-disabled',
);

/* ---------------------------------------------------------- DropdownMenu */

export const DropdownMenu = DropdownMenuPrimitive.Root;
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
export const DropdownMenuGroup = DropdownMenuPrimitive.Group;
export const DropdownMenuPortal = DropdownMenuPrimitive.Portal;
export const DropdownMenuSub = DropdownMenuPrimitive.Sub;
export const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

/** Menu de ações de um item (Radix DropdownMenu): abre no toque, setas e letras navegam, Esc fecha e devolve o foco. */
export const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(function DropdownMenuContent({ className, sideOffset = 8, collisionPadding = 16, ...props }, ref) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
        className={cn(menuSurface, 'origin-[--radix-dropdown-menu-content-transform-origin] data-[state=open]:animate-pop-in data-[state=closed]:animate-pop-out motion-reduce:animate-none', className)}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
});
export interface DropdownMenuItemProps extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> {
  /** destructive = ação que apaga ou sai. */
  variant?: 'default' | 'destructive';
  /** Recuo para alinhar com itens que têm marca de seleção. */
  inset?: boolean;
}
export const DropdownMenuItem = React.forwardRef<React.ElementRef<typeof DropdownMenuPrimitive.Item>, DropdownMenuItemProps>(function DropdownMenuItem(
  { className, variant = 'default', inset, ...props },
  ref,
) {
  return (
    <DropdownMenuPrimitive.Item
      ref={ref}
      className={cn(menuItem, inset && 'pl-large', variant === 'destructive' && 'text-feedback-text-negative data-[highlighted]:bg-feedback-fill-negative [&_svg]:text-feedback-text-negative', className)}
      {...props}
    />
  );
});
export const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(function DropdownMenuCheckboxItem({ className, children, ...props }, ref) {
  return (
    <DropdownMenuPrimitive.CheckboxItem ref={ref} className={cn(menuItem, 'pl-large', className)} {...props}>
      <span className="absolute left-micro grid size-icon-small place-items-center">
        <DropdownMenuPrimitive.ItemIndicator><Check strokeWidth={2.5} aria-hidden /></DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  );
});
export const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(function DropdownMenuRadioItem({ className, children, ...props }, ref) {
  return (
    <DropdownMenuPrimitive.RadioItem ref={ref} className={cn(menuItem, 'pl-large data-[state=checked]:font-semibold', className)} {...props}>
      <span className="absolute left-micro grid size-icon-small place-items-center">
        <DropdownMenuPrimitive.ItemIndicator><span className="block size-nano rounded-full bg-text-primary" /></DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  );
});
export const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label>
>(function DropdownMenuLabel({ className, ...props }, ref) {
  return <DropdownMenuPrimitive.Label ref={ref} className={cn('caption px-micro py-nano font-semibold text-muted-foreground', className)} {...props} />;
});
export const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(function DropdownMenuSeparator({ className, ...props }, ref) {
  return <DropdownMenuPrimitive.Separator ref={ref} className={cn('-mx-xnano my-xnano h-px bg-border', className)} {...props} />;
});
export const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger>
>(function DropdownMenuSubTrigger({ className, children, ...props }, ref) {
  return (
    <DropdownMenuPrimitive.SubTrigger ref={ref} className={cn(menuItem, 'data-[state=open]:bg-accent', className)} {...props}>
      {children}
      <ChevronRight className="ml-auto" aria-hidden />
    </DropdownMenuPrimitive.SubTrigger>
  );
});
export const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(function DropdownMenuSubContent({ className, ...props }, ref) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.SubContent ref={ref} collisionPadding={16} className={cn(menuSurface, 'data-[state=open]:animate-pop-in data-[state=closed]:animate-pop-out motion-reduce:animate-none', className)} {...props} />
    </DropdownMenuPrimitive.Portal>
  );
});

/* --------------------------------------------------------------- Command */

/** Lista com busca e navegação por teclado (shadcn Command, sobre cmdk). Base do Combobox. */
export const Command = React.forwardRef<React.ElementRef<typeof CommandPrimitive>, React.ComponentPropsWithoutRef<typeof CommandPrimitive>>(
  function Command({ className, ...props }, ref) {
    return <CommandPrimitive ref={ref} className={cn('flex size-full flex-col overflow-hidden rounded-md bg-popover font-sans text-popover-foreground', className)} {...props} />;
  },
);
export const CommandInput = React.forwardRef<React.ElementRef<typeof CommandPrimitive.Input>, React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>>(
  function CommandInput({ className, ...props }, ref) {
    return (
      <div className="flex min-h-button items-center gap-nano border-b border-border px-micro has-[input:focus-visible]:border-border-highlight">
        <Search className="size-icon shrink-0 text-icon-brand-strong" aria-hidden />
        <CommandPrimitive.Input
          ref={ref}
          className={cn('body h-button w-full min-w-0 border-0 bg-transparent font-sans text-foreground outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:text-interactive-text-disabled', className)}
          {...props}
        />
      </div>
    );
  },
);
export const CommandList = React.forwardRef<React.ElementRef<typeof CommandPrimitive.List>, React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>>(
  function CommandList({ className, ...props }, ref) {
    return <CommandPrimitive.List ref={ref} className={cn('max-h-[264px] overflow-y-auto overflow-x-hidden p-xnano', className)} {...props} />;
  },
);
export const CommandEmpty = React.forwardRef<React.ElementRef<typeof CommandPrimitive.Empty>, React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>>(
  function CommandEmpty({ className, ...props }, ref) {
    return <CommandPrimitive.Empty ref={ref} className={cn('caption px-micro py-mini text-center text-muted-foreground', className)} {...props} />;
  },
);
export const CommandGroup = React.forwardRef<React.ElementRef<typeof CommandPrimitive.Group>, React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>>(
  function CommandGroup({ className, ...props }, ref) {
    return (
      <CommandPrimitive.Group
        ref={ref}
        className={cn('[&_[cmdk-group-heading]]:px-micro [&_[cmdk-group-heading]]:py-nano [&_[cmdk-group-heading]]:text-[12px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:leading-4 [&_[cmdk-group-heading]]:text-muted-foreground', className)}
        {...props}
      />
    );
  },
);
/** Divisor entre grupos. É decorativo (role="none"), para a lista continuar só com opções e grupos. */
export function CommandSeparator({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div role="none" className={cn('-mx-xnano my-xnano h-px bg-border', className)} {...props} />;
}
export const CommandItem = React.forwardRef<React.ElementRef<typeof CommandPrimitive.Item>, React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>>(
  function CommandItem({ className, ...props }, ref) {
    return (
      <CommandPrimitive.Item
        ref={ref}
        className={cn(
          'body-small relative flex min-h-touch cursor-pointer select-none items-center gap-nano rounded-sm px-micro outline-none',
          '[&_svg]:size-icon-small [&_svg]:shrink-0',
          'data-[selected=true]:bg-accent data-[disabled=true]:pointer-events-none data-[disabled=true]:text-interactive-text-disabled',
          className,
        )}
        {...props}
      />
    );
  },
);

/* -------------------------------------------------------------- Combobox */

export interface ComboboxOption { value: string; label: string; disabled?: boolean }
export interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  onChange?: (value: string) => void;
  /** Texto do gatilho sem valor ("Selecione a cidade"). */
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  /** Nome acessível quando não há Label ligado por id. */
  'aria-label'?: string;
  'aria-invalid'?: boolean;
  id?: string;
  disabled?: boolean;
  className?: string;
}
/** Select com busca para listas longas, como cidade (shadcn Combobox: Popover + Command). */
export function Combobox({ options, value, onChange, placeholder = 'Selecione', searchPlaceholder = 'Buscar', emptyText = 'Nada encontrado', className, id, disabled, ...aria }: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const current = options.find((o) => o.value === value);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          id={id}
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          disabled={disabled}
          {...aria}
          className={cn(fieldBase, 'flex h-input cursor-pointer items-center justify-between gap-nano text-left data-[state=open]:border-border-highlight disabled:[&_svg]:text-interactive-text-disabled', !current && 'text-muted-foreground', className)}
        >
          <span className="truncate">{current ? current.label : placeholder}</span>
          <ChevronDown className="size-icon shrink-0 text-icon-brand-strong" aria-hidden />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" aria-label={searchPlaceholder} className="w-[--radix-popover-trigger-width] min-w-[240px] p-0">
        <Command>
          <CommandInput placeholder={searchPlaceholder} aria-label={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {options.map((o) => (
                <CommandItem key={o.value} value={o.label} disabled={o.disabled} onSelect={() => { onChange?.(o.value); setOpen(false); }} className={cn(o.value === value && 'font-semibold')}>
                  <span className="flex-1">{o.label}</span>
                  {o.value === value && <Check strokeWidth={2.5} aria-hidden />}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

/* ---------------------------------------------------------------- Drawer */

/** Bottom sheet com gesto de arrastar para fechar (shadcn Drawer, sobre Vaul). Sem gesto, use Sheet. */
export function Drawer({ shouldScaleBackground = false, ...props }: React.ComponentProps<typeof DrawerPrimitive.Root>) {
  return <DrawerPrimitive.Root shouldScaleBackground={shouldScaleBackground} {...props} />;
}
export const DrawerTrigger = DrawerPrimitive.Trigger;
export const DrawerPortal = DrawerPrimitive.Portal;
export const DrawerClose = DrawerPrimitive.Close;
export const DrawerOverlay = React.forwardRef<React.ElementRef<typeof DrawerPrimitive.Overlay>, React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>>(
  function DrawerOverlay({ className, ...props }, ref) {
    return <DrawerPrimitive.Overlay ref={ref} className={cn('fixed inset-0 z-50 bg-overlay', className)} {...props} />;
  },
);
export const DrawerContent = React.forwardRef<React.ElementRef<typeof DrawerPrimitive.Content>, React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>>(
  function DrawerContent({ className, children, ...props }, ref) {
    return (
      <DrawerPortal>
        <DrawerOverlay />
        <DrawerPrimitive.Content
          ref={ref}
          className={cn('fixed inset-x-0 bottom-0 z-50 flex max-h-[90dvh] flex-col gap-mini rounded-t-xl bg-popover p-mini pb-small text-popover-foreground shadow-high outline-none', className)}
          {...props}
        >
          <span aria-hidden className="mx-auto -mt-xnano block h-xnano w-large shrink-0 rounded-full bg-border" />
          {children}
        </DrawerPrimitive.Content>
      </DrawerPortal>
    );
  },
);
export function DrawerHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('grid gap-nano', className)} {...props} />;
}
export function DrawerFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mt-auto flex flex-col-reverse gap-nano', className)} {...props} />;
}
export const DrawerTitle = React.forwardRef<React.ElementRef<typeof DrawerPrimitive.Title>, React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>>(
  function DrawerTitle({ className, ...props }, ref) {
    return <DrawerPrimitive.Title ref={ref} className={cn('body-strong m-0', className)} {...props} />;
  },
);
export const DrawerDescription = React.forwardRef<React.ElementRef<typeof DrawerPrimitive.Description>, React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>>(
  function DrawerDescription({ className, ...props }, ref) {
    return <DrawerPrimitive.Description ref={ref} className={cn('caption m-0 text-muted-foreground', className)} {...props} />;
  },
);
