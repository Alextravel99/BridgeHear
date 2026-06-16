
import { palabras365 } from './palabras365';

export const getPalabrasDelDia = (dia) => {
  const index = (dia - 1) % 365;
  return palabras365[index];
};

export const getCategoriaDelDia = (dia) => {
  const cats = ['Trabajo','Escuela','Vida diaria','Social','Salud','Viajes','Comida','Deportes','Naturaleza','Emociones','Negocios','Casa'];
  return cats[(dia - 1) % cats.length];
};

export const getDiaSemana = (dia) => {
  const dias = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];
  return dias[(dia - 1) % 7];
};

export const categorias = [
  { id: 'trabajo', emoji: '💼', label: 'Trabajo' },
  { id: 'escuela', emoji: '📚', label: 'Escuela' },
  { id: 'vida diaria', emoji: '🏠', label: 'Vida diaria' },
  { id: 'socializar', emoji: '👥', label: 'Social' },
  { id: 'salud', emoji: '💪', label: 'Salud' },
  { id: 'tecnologia', emoji: '📱', label: 'Tecnología' },
  { id: 'viajes', emoji: '✈️', label: 'Viajes' },
  { id: 'comida', emoji: '🍽️', label: 'Comida' },
  { id: 'deportes', emoji: '⚽', label: 'Deportes' },
  { id: 'naturaleza', emoji: '🌿', label: 'Naturaleza' },
];
