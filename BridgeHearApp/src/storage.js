
import AsyncStorage from '@react-native-async-storage/async-storage';

export const guardarPalabrasDelDia = async (dia, palabras) => {
  try { await AsyncStorage.setItem('dia_'+dia, JSON.stringify(palabras)); } catch(e) {}
};

export const obtenerPalabrasDelDia = async (dia) => {
  try { const data = await AsyncStorage.getItem('dia_'+dia); return data ? JSON.parse(data) : null; } catch(e) { return null; }
};

export const obtenerDiaActual = async () => {
  try { const data = await AsyncStorage.getItem('dia_actual'); return data ? parseInt(data) : 1; } catch(e) { return 1; }
};

export const avanzarDia = async () => {
  try {
    const dia = await obtenerDiaActual();
    const nuevo = dia + 1;
    await AsyncStorage.setItem('dia_actual', String(nuevo));
    return nuevo;
  } catch(e) { return 1; }
};

export const obtenerEstadisticas = async () => {
  try {
    const dia = await obtenerDiaActual();
    const racha = await AsyncStorage.getItem('racha') || '0';
    const totalPalabras = (dia - 1) * 10;
    return { dia, racha: parseInt(racha), totalPalabras };
  } catch(e) { return { dia: 1, racha: 0, totalPalabras: 0 }; }
};

export const completarDia = async () => {
  try {
    const racha = parseInt(await AsyncStorage.getItem('racha') || '0');
    await AsyncStorage.setItem('racha', String(racha + 1));
    await avanzarDia();
  } catch(e) {}
};
