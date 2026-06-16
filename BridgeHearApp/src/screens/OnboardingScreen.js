import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { colors, radius } from '../theme';
const slides = [
  { title: 'Bienvenido a BridgeHear', sub: 'Aprende la pronunciacion del ingles escrita en espanol.', emoji: '🎯' },
  { title: '10 palabras cada dia', sub: 'La repeticion espaciada ayuda a tu cerebro a largo plazo.', emoji: '🧠' },
  { title: 'Aprende. Habla. Conectate.', sub: 'Vocabulario real que usan los nativos.', emoji: '🌉' },
];
export default function OnboardingScreen({ onDone }) {
  const [actual, setActual] = useState(0);
  const siguiente = () => { if (actual < slides.length - 1) { setActual(actual + 1); return; } onDone(); };
  const s = slides[actual];
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.logoWrap}>
          <Image source={require('../../assets/icon.png')} style={styles.logo} resizeMode='contain'/>
        </View>
        <View style={styles.dots}>
          {slides.map((_, i) => (<View key={i} style={[styles.dot, i === actual && styles.dotActive]}/>))}
        </View>
        <Text style={styles.emoji}>{s.emoji}</Text>
        <Text style={styles.title}>{s.title}</Text>
        <Text style={styles.sub}>{s.sub}</Text>
        <TouchableOpacity style={styles.btn} onPress={siguiente}>
          <Text style={styles.btnTxt}>{actual < slides.length - 1 ? 'Siguiente' : 'Comenzar!'}</Text>
        </TouchableOpacity>
        {actual < slides.length - 1 && (
          <TouchableOpacity onPress={onDone} style={styles.skip}>
            <Text style={styles.skipTxt}>Omitir</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safe:{ flex:1, backgroundColor:colors.primary },
  container:{ flex:1, alignItems:'center', justifyContent:'center', padding:30 },
  logoWrap:{ width:130, height:130, borderRadius:30, marginBottom:24, overflow:'hidden' },
  logo:{ width:130, height:130 },
  dots:{ flexDirection:'row', gap:8, marginBottom:40 },
  dot:{ width:8, height:8, borderRadius:4, backgroundColor:'rgba(255,255,255,0.3)' },
  dotActive:{ backgroundColor:'white', width:24 },
  emoji:{ fontSize:60, marginBottom:20 },
  title:{ color:'white', fontSize:26, fontWeight:'700', textAlign:'center', marginBottom:14 },
  sub:{ color:'rgba(255,255,255,0.85)', fontSize:16, textAlign:'center', lineHeight:24, marginBottom:40 },
  btn:{ backgroundColor:'white', borderRadius:12, paddingVertical:14, paddingHorizontal:40 },
  btnTxt:{ color:colors.primary, fontSize:16, fontWeight:'700' },
  skip:{ marginTop:16 },
  skipTxt:{ color:'rgba(255,255,255,0.6)', fontSize:14 },
});
