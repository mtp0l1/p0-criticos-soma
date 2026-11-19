/* Primitivas de estrutura no padrão shadcn/ui: AspectRatio, ScrollArea, Collapsible, Table, Pagination, Carousel. */
import * as React from 'react';
import * as AspectRatioPrimitive from '@radix-ui/react-aspect-ratio';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';
import useEmblaCarousel, { type UseEmblaCarouselType } from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, Ellipsis } from 'lucide-react';
import { cn, focusRing } from '../lib/utils';
import { buttonVariants } from './button';

/* ----------------------------------------------------------- AspectRatio */

/** Mantém a proporção de imagem, vídeo ou mapa (Radix AspectRatio). Ex.: `ratio={16 / 9}`. */
export const AspectRatio = AspectRatioPrimitive.Root;

/* ------------------------------------------------------------ ScrollArea */

export const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(function ScrollBar({ className, orientation = 'vertical', ...props }, ref) {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      ref={ref}
      orientation={orientation}
      className={cn('flex touch-none select-none p-[2px] transition-colors', orientation === 'vertical' ? 'h-full w-micro' : 'h-micro flex-col', className)}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border-strong" />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  );
});
/** Área rolável com barra desenhada (Radix ScrollArea). A área recebe foco pelo teclado. */
export const ScrollArea = React.forwardRef<React.ElementRef<typeof ScrollAreaPrimitive.Root>, React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>>(
  function ScrollArea({ className, children, ...props }, ref) {
    return (
      <ScrollAreaPrimitive.Root ref={ref} className={cn('relative overflow-hidden', className)} {...props}>
        <ScrollAreaPrimitive.Viewport tabIndex={0} className={cn('size-full rounded-[inherit]', focusRing)}>{children}</ScrollAreaPrimitive.Viewport>
        <ScrollBar />
        <ScrollAreaPrimitive.Corner />
      </ScrollAreaPrimitive.Root>
    );
  },
);

/* ----------------------------------------------------------- Collapsible */

export const Collapsible = CollapsiblePrimitive.Root;
export const CollapsibleTrigger = CollapsiblePrimitive.Trigger;
/** Conteúdo que abre e fecha com animação de altura (Radix Collapsible). Para várias perguntas, use Accordion. */
export const CollapsibleContent = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Content>
>(function CollapsibleContent({ className, ...props }, ref) {
  return (
    <CollapsiblePrimitive.Content
      ref={ref}
      className={cn('overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down motion-reduce:animate-none', className)}
      {...props}
    />
  );
});

/* ----------------------------------------------------------------- Table */

/** Tabela de dados simples (shadcn Table), com rolagem horizontal própria. Ex.: extrato de pontos. */
export const Table = React.forwardRef<HTMLTableElement, React.TableHTMLAttributes<HTMLTableElement>>(function Table({ className, ...props }, ref) {
  return (
    <div tabIndex={0} role="region" aria-label={props['aria-label'] ?? 'Tabela'} className={cn('w-full overflow-x-auto rounded-lg border border-border bg-card', focusRing)}>
      <table ref={ref} className={cn('body-small w-full border-collapse text-left text-foreground', className)} {...props} />
    </div>
  );
});
export function TableHeader({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={cn('bg-surface-secondary', className)} {...props} />;
}
export function TableBody({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn('[&>tr:last-child]:border-0', className)} {...props} />;
}
export function TableFooter({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tfoot className={cn('border-t border-border bg-surface-secondary font-semibold', className)} {...props} />;
}
export function TableRow({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return <tr className={cn('border-b border-border transition-colors hover:bg-interactive-fill-quiet-hover data-[state=selected]:bg-surface-accent', className)} {...props} />;
}
export function TableHead({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return <th scope="col" className={cn('caption whitespace-nowrap px-mini py-micro font-semibold text-muted-foreground', className)} {...props} />;
}
export function TableCell({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn('px-mini py-micro align-middle', className)} {...props} />;
}
export function TableCaption({ className, ...props }: React.HTMLAttributes<HTMLTableCaptionElement>) {
  return <caption className={cn('caption caption-bottom p-micro text-muted-foreground', className)} {...props} />;
}

/* ------------------------------------------------------------ Pagination */

/** Navegação entre páginas (shadcn Pagination). No app, prefira "Carregar mais"; use em listas longas com posição conhecida. */
export function Pagination({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return <nav aria-label="Paginação" className={cn('flex w-full justify-center', className)} {...props} />;
}
export function PaginationContent({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) {
  return <ul className={cn('m-0 flex list-none items-center gap-xnano p-0', className)} {...props} />;
}
export function PaginationItem(props: React.LiHTMLAttributes<HTMLLIElement>) {
  return <li {...props} />;
}
export interface PaginationLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  isActive?: boolean;
  disabled?: boolean;
}
export function PaginationLink({ className, isActive, disabled, href, ...props }: PaginationLinkProps) {
  return (
    <a
      href={disabled ? undefined : href}
      aria-current={isActive ? 'page' : undefined}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : undefined}
      className={cn(
        buttonVariants({ hierarchy: 'transparent', size: 'icon' }),
        'label rounded-md text-foreground no-underline aria-[current=page]:border-border-highlight aria-[current=page]:bg-surface-accent aria-[current=page]:font-semibold',
        className,
      )}
      {...props}
    />
  );
}
export function PaginationPrevious({ className, ...props }: PaginationLinkProps) {
  return <PaginationLink aria-label="Página anterior" className={className} {...props}><ChevronLeft className="size-icon" aria-hidden /></PaginationLink>;
}
export function PaginationNext({ className, ...props }: PaginationLinkProps) {
  return <PaginationLink aria-label="Próxima página" className={className} {...props}><ChevronRight className="size-icon" aria-hidden /></PaginationLink>;
}
export function PaginationEllipsis({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn('grid size-touch place-items-center text-muted-foreground', className)} {...props}><Ellipsis className="size-icon" aria-hidden /><span className="sr-only">Mais páginas</span></span>;
}

/* -------------------------------------------------------------- Carousel */

type CarouselApi = UseEmblaCarouselType[1];
type CarouselOptions = Parameters<typeof useEmblaCarousel>[0];
interface CarouselCtx { viewportRef: UseEmblaCarouselType[0]; api: CarouselApi; canPrev: boolean; canNext: boolean; selected: number; count: number }
const CarouselContext = React.createContext<CarouselCtx | null>(null);
function useCarousel() {
  const c = React.useContext(CarouselContext);
  if (!c) throw new Error('Use os componentes do Carousel dentro de <Carousel>.');
  return c;
}
export interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Nome do carrossel ("Novidades do programa"). */
  label: string;
  opts?: CarouselOptions;
  setApi?: (api: CarouselApi) => void;
}
/** Carrossel por gesto (shadcn Carousel, sobre Embla). Sem avanço automático; setas do teclado passam os slides. */
export function Carousel({ label, opts, setApi, className, children, ...props }: CarouselProps) {
  const [viewportRef, api] = useEmblaCarousel({ align: 'start', ...opts });
  const [state, setState] = React.useState({ canPrev: false, canNext: false, selected: 0, count: 0 });
  React.useEffect(() => {
    if (!api) return;
    const sync = () => setState({ canPrev: api.canScrollPrev(), canNext: api.canScrollNext(), selected: api.selectedScrollSnap(), count: api.scrollSnapList().length });
    sync(); setApi?.(api);
    api.on('select', sync); api.on('reInit', sync);
    return () => { api.off('select', sync); api.off('reInit', sync); };
  }, [api, setApi]);
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); api?.scrollPrev(); }
    if (e.key === 'ArrowRight') { e.preventDefault(); api?.scrollNext(); }
  };
  return (
    <CarouselContext.Provider value={{ viewportRef, api, ...state }}>
      <div role="region" aria-roledescription="carrossel" aria-label={label} onKeyDownCapture={onKeyDown} className={cn('relative grid gap-nano', className)} {...props}>
        {children}
      </div>
    </CarouselContext.Provider>
  );
}
export function CarouselContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { viewportRef } = useCarousel();
  return (
    <div ref={viewportRef} className="overflow-hidden">
      <div className={cn('-ml-micro flex', className)} {...props} />
    </div>
  );
}
export function CarouselItem({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div role="group" aria-roledescription="slide" className={cn('min-w-0 shrink-0 grow-0 basis-full pl-micro', className)} {...props} />;
}
const arrowCls = cn(buttonVariants({ hierarchy: 'quiet', size: 'icon' }), 'rounded-full');
export function CarouselPrevious({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { api, canPrev } = useCarousel();
  return <button type="button" aria-label="Slide anterior" disabled={!canPrev} onClick={() => api?.scrollPrev()} className={cn(arrowCls, className)} {...props}><ChevronLeft className="size-icon" aria-hidden /></button>;
}
export function CarouselNext({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { api, canNext } = useCarousel();
  return <button type="button" aria-label="Próximo slide" disabled={!canNext} onClick={() => api?.scrollNext()} className={cn(arrowCls, className)} {...props}><ChevronRight className="size-icon" aria-hidden /></button>;
}
/** Pontos de posição: mostram o slide atual e levam direto a um slide. */
export function CarouselDots({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { api, selected, count } = useCarousel();
  return (
    <div className={cn('flex items-center justify-center', className)} {...props}>
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          aria-label={`Ir para o slide ${i + 1} de ${count}`}
          aria-current={i === selected ? 'true' : undefined}
          onClick={() => api?.scrollTo(i)}
          className={cn('group grid size-touch cursor-pointer place-items-center rounded-full', focusRing)}
        >
          <span className="block size-nano rounded-full bg-indicator-inactive transition-colors group-hover:bg-text-secondary group-aria-[current=true]:bg-selected-indicator" />
        </button>
      ))}
    </div>
  );
}
