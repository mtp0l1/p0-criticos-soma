import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/** Ensina o tailwind-merge as escalas So+ma (p-mini, h-button, rounded-lg…), para resolver conflitos de classe corretamente. */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      spacing: [
        'xnano', 'nano', 'micro', 'mini', 'xsmall', 'small', 'medium', 'large', 'xlarge',
        'touch', 'button', 'input', 'icon', 'icon-small', 'tile', 'tabbar', 'thumb', 'medal', 'avatar', 'qr',
      ],
      borderRadius: ['xs', 'sm', 'md', 'lg', 'xl', 'full'],
    },
  },
});

/** Junta classes condicionais e resolve conflitos do Tailwind (padrão shadcn/ui). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Anel de foco único do sistema: 2px em `ring` (focus-ring), a 2px de distância.
 * O contorno transparente só aparece no modo de alto contraste do sistema (forced-colors), onde box-shadow some.
 */
export const focusRing =
  'outline outline-2 outline-offset-2 outline-transparent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background';

/** Estado desabilitado comum a controles: cor cheia (sem opacidade) e sem resposta a toque. Vale para `disabled` e `aria-disabled`. */
export const disabledState =
  'disabled:pointer-events-none disabled:cursor-not-allowed aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed data-[disabled]:pointer-events-none data-[disabled]:cursor-not-allowed';

/** Aumenta a área tocável de controles pequenos (checkbox, rádio, switch, thumb) para 44px sem mudar o desenho. */
export const hitArea = "relative after:absolute after:left-1/2 after:top-1/2 after:size-touch after:-translate-x-1/2 after:-translate-y-1/2 after:content-['']";

/** Igual a hitArea, mas só na altura: links e botões de texto curtos ganham 44px de altura tocável e mantêm a largura do texto. */
export const hitAreaY = "relative after:absolute after:inset-x-0 after:top-1/2 after:h-touch after:-translate-y-1/2 after:content-['']";

/** Número no padrão brasileiro (9.057). */
export const fmt = (n: number) => n.toLocaleString('pt-BR');
