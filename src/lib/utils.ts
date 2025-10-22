import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// #60 Rubio Claro
// #01 Negro Intenso (Negro Ébano)
// #613 Rubio Platino
// #1B Negro Natural (Negro Seda)
// #02 Marrón oscuro (Castaño Expresso)
// #04 Castaño Chocolate Intenso
// #05 Castaño Medio (Castaño caramelo)
// #06 Castaño (Castaño Avellana)
// #08 Castaño Claro Cenizo (Castaño Humo)
// #10 Castaño Claro (Castaño Miel Suave)
// #12 Rubio Cenizo Oscuro
// #14 Castaño Claro Dorado
// #16 Rubio Oscuro
// #27 Rubio Oscuro Dorado
// #33 Rojo Cobrizo Intenso
// #35 Rojo Cobrizo
// #37 Rojo Caoba Oscuro
// #99J Rojo oscuro (Vino Burdeos)
// #2/613 Castaño Claro Cenizo
// #4/613 Castaño Medio con Reflejos Rubio Platinado
// #6/613 Castaño con Reflejos Dorados Platinados
// #27/613 Rubio Oscuro Dorado con Reflejo Rubio Platinado
