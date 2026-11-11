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

/** Anel de foco único do sistema: 2px em `ring` (focus-ring), a 2px de distância. */
export const focusRing =
  'outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background';

/** Número no padrão brasileiro (9.057). */
export const fmt = (n: number) => n.toLocaleString('pt-BR');
