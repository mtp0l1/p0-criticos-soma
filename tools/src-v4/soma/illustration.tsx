/* So+ma · Illustration: ilustrações do Figma embutidas no bundle (troféus, mascotes da lata, conquista). */
import * as React from 'react';
import { cn } from '../lib/utils';
import { ILLUSTRATIONS, type IllustrationName } from '../assets/illustrations';

export interface IllustrationProps {
  name: IllustrationName;
  /** Texto alternativo. Vazio por padrão: a ilustração é decorativa e o texto da tela já diz o que ela mostra. */
  alt?: string;
  /** Lado maior em px. Sem ele, usa o tamanho do Figma. */
  size?: number;
  className?: string;
}
/** Mostra uma das ilustrações do sistema pelo nome. Use quando precisar da arte fora de um componente de Quiz. */
export function Illustration({ name, alt = '', size, className }: IllustrationProps) {
  const a = ILLUSTRATIONS[name];
  const k = size ? size / Math.max(a.width, a.height) : 1;
  return <img src={a.src} alt={alt} width={Math.round(a.width * k)} height={Math.round(a.height * k)} className={cn('shrink-0 object-contain', className)} />;
}
export { ILLUSTRATIONS };
export type { IllustrationName };
