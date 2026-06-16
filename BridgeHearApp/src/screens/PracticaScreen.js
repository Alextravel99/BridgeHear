
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import * as Speech from 'expo-speech';
import { colors, radius } from '../theme';
import { obtenerDiaActual, obtenerPalabrasDelDia } from '../storage';
import { getPalabrasDelDia, getCategoriaDelDia, getDiaSemana } from '../data';

export default function PracticaScreen({ navigation, route }) {
  const palabrasParam = route?.params?.palabras || [];
  const inicio = route?.params?.inicio || 0;
  const onPalabraVista = route?.params?.onPalabraVista;
  const [modo, setModo] = useState(palabrasParam.length > 0 ? 'practica' : 'bloques');
  const [bloques, setBloques] = useState([]);
  const [palabras, setPalabras] = useState(palabrasParam);
  const [actual, setActual] = useState(inicio);
  const [visible, setVisible] = useState(false);
  const [terminado, setTerminado] = useState(false);
  const [vistas, setVistas] = useState(palabrasParam.map(()=>false));
  const [diaSeleccionado, setDiaSeleccionado] = useState(null);
  const [diaActualNum, setDiaActualNum] = useState(1);

  useEffect(() => {
    if (modo === 'bloques') cargarBloques();
    cargarDiaActual();
  }, [modo]);

  const cargarDiaActual = async () => {
    const { obtenerDiaActual } = require('../storage');
    const dia = await obtenerDiaActual();
    setDiaActualNum(dia);
  };
  const cargarBloques = async () => {
    const diaActual = await obtenerDiaActual();
    const lista = [];
    for (let i = 1; i < diaActual; i++) {
      lista.push({
        dia: i,
        categoria: getCategoriaDelDia(i),
        diaSemana: getDiaSemana(i),
        palabras: getPalabrasDelDia(i),
      });
    }
    setBloques(lista);
  };

  const abrirBloque = (bloque) => {
    setPalabras(bloque.palabras);
    setVistas(bloque.palabras.map(()=>false));
    setActual(0);
    setVisible(false);
    setTerminado(false);
    setDiaSeleccionado(bloque.dia);
    setModo('practica');
  };

  const p = palabras[actual];
  const pct = palabras.length > 0 ? Math.round(((actual+1)/palabras.length)*100) : 0;
  const hablar = () => p && Speech.speak(p.en, { language: 'en-US', rate: 0.8 });

  const marcarYAvanzar = () => {
    const nuevasVistas = [...vistas];
    nuevasVistas[actual] = true;
    setVistas(nuevasVistas);
    if (onPalabraVista && !diaSeleccionado) onPalabraVista(actual);
    if (actual === palabras.length - 1) {
      setTerminado(true);
    } else {
      setActual(actual + 1);
      setVisible(false);
    }
  };

  const anterior = () => {
    if (actual === 0) return;
    setActual(actual - 1);
    setVisible(false);
  };

  const reiniciar = () => {
    setActual(0);
    setVisible(false);
    setTerminado(false);
    setVistas(palabras.map(()=>false));
  };

  // PANTALLA DE BLOQUES
  if (modo === 'bloques') return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={()=>navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backTxt}>‹</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Practicar</Text>
          <Text style={styles.headerSub}>Elige un bloque para repasar</Text>
        </View>
      </View>
      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
        {bloques.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>📅</Text>
            <Text style={styles.emptyTxt}>Completa tu primer bloque del dia para poder practicar aqui.</Text>
            <TouchableOpacity style={styles.btnPrimary} onPress={()=>navigation.goBack()}>
              <Text style={styles.btnPrimaryTxt}>Ir al Bloque del dia</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={styles.secLabel}>TUS BLOQUES COMPLETADOS</Text>
            {bloques.map((b,i)=>(
              <TouchableOpacity key={i} style={styles.bloqueCard} onPress={()=>abrirBloque(b)}>
                <View style={styles.bloqueNum}>
                  <Text style={styles.bloqueNumTxt}>{b.dia}</Text>
                </View>
                <View style={styles.bloqueInfo}>
                  <Text style={styles.bloqueTitle}>Dia {b.dia} — {b.diaSemana}</Text>
                  <Text style={styles.bloqueSub}>{b.categoria} · 10 palabras</Text>
                </View>
                <Text style={styles.bloqueArrow}>›</Text>
              </TouchableOpacity>
            ))}
            <View style={{height:20}}/>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );

  // PANTALLA COMPLETADO
  if (terminado) return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={()=>setModo('bloques')} style={styles.backBtn}>
          <Text style={styles.backTxt}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Practica</Text>
      </View>
      <View style={styles.doneScreen}>
        <Text style={styles.doneEmoji}>🎉</Text>
        <Text style={styles.doneTitle}>Completado</Text>
        <Text style={styles.doneSub}>Repasaste todas las palabras.</Text>
        <TouchableOpacity style={styles.btnPrimary} onPress={reiniciar}>
          <Text style={styles.btnPrimaryTxt}>Repasar de nuevo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btnPrimary,{backgroundColor:colors.successBg,marginTop:8}]} onPress={()=>setModo('bloques')}>
          <Text style={[styles.btnPrimaryTxt,{color:colors.success}]}>Ver todos los bloques</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btnPrimary,{backgroundColor:'#4a90d9',marginTop:8}]} onPress={()=>navigation.navigate('Bloque')}>
          <Text style={styles.btnPrimaryTxt}>Siguiente dia →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  // PANTALLA PRACTICA
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={()=>setModo('bloques')} style={styles.backBtn}>
          <Text style={styles.backTxt}>‹</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Practica</Text>
          <Text style={styles.headerSub}>Palabra {actual+1} de {palabras.length}</Text>
        </View>
      </View>
      <View style={styles.body}>
        <View style={styles.progBar}>
          <View style={[styles.progFill,{width:pct+'%'}]}/>
        </View>
        <View style={styles.bigCard}>
          <Text style={styles.bigEn}>{p?.en}</Text>
          <View style={styles.divider}/>
          <Text style={styles.bigEs}>{p?.es}</Text>
          <View style={styles.pronArea}>
            {visible ? (
              <>
                <Text style={styles.pronHint}>Pronunciacion</Text>
                <Text style={styles.bigPron}>{p?.pron}</Text>
              </>
            ) : (
              <Text style={styles.pronHint}>Como se pronuncia?</Text>
            )}
          </View>
          <TouchableOpacity style={styles.btnEscuchar} onPress={hablar}>
            <Text style={styles.btnEscucharTxt}>🔊 Escuchar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btnReveal, visible&&styles.btnRevealOn]} onPress={()=>setVisible(!visible)}>
            <Text style={[styles.btnRevealTxt, visible&&{color:colors.primaryDark}]}>
              {visible ? 'Ocultar pronunciacion' : 'Ver pronunciacion'}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.navRow}>
          <TouchableOpacity style={[styles.btnNav, actual===0&&{opacity:0.3}]} onPress={anterior} disabled={actual===0}>
            <Text style={styles.btnNavTxt}>← Anterior</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btnNav, styles.btnNavPrimary]} onPress={marcarYAvanzar}>
            <Text style={[styles.btnNavTxt,{color:'white'}]}>
              {actual===palabras.length-1 ? 'Terminar ✓' : 'Siguiente →'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:{flex:1,backgroundColor:colors.primary},
  header:{backgroundColor:colors.primary,paddingHorizontal:16,paddingTop:10,paddingBottom:16,flexDirection:'row',alignItems:'center',gap:10},
  backBtn:{padding:4},backTxt:{color:'white',fontSize:28,fontWeight:'300'},
  headerTitle:{color:'white',fontSize:18,fontWeight:'700'},
  headerSub:{color:'rgba(255,255,255,0.85)',fontSize:12},
  body:{flex:1,backgroundColor:colors.background,padding:16},
  progBar:{backgroundColor:'#e8edf2',borderRadius:10,height:5,marginBottom:20},
  progFill:{backgroundColor:colors.primary,borderRadius:10,height:5},
  bigCard:{backgroundColor:colors.card,borderRadius:20,borderWidth:0.5,borderColor:colors.border,padding:30,alignItems:'center',marginBottom:20,gap:10},
  bigEn:{fontSize:34,fontWeight:'700',color:colors.text},
  divider:{width:40,height:1.5,backgroundColor:colors.border,borderRadius:2},
  bigEs:{fontSize:17,color:colors.textSub},
  pronArea:{minHeight:55,alignItems:'center',justifyContent:'center',gap:4},
  pronHint:{fontSize:12,color:colors.textLight,textTransform:'uppercase',letterSpacing:0.5},
  bigPron:{fontSize:26,fontWeight:'700',color:colors.primary},
  btnEscuchar:{backgroundColor:'#eaf3de',borderRadius:10,paddingVertical:10,paddingHorizontal:20,marginBottom:4},
  btnEscucharTxt:{fontSize:13,fontWeight:'600',color:'#3b6d11'},
  btnReveal:{backgroundColor:'#f0f4f9',borderWidth:0.5,borderColor:colors.border,borderRadius:12,paddingVertical:10,paddingHorizontal:20},
  btnRevealOn:{backgroundColor:colors.primaryLight,borderColor:colors.primary},
  btnRevealTxt:{fontSize:13,fontWeight:'500',color:colors.textSub},
  navRow:{flexDirection:'row',gap:10},
  btnNav:{flex:1,backgroundColor:colors.card,borderWidth:0.5,borderColor:colors.border,borderRadius:12,padding:13,alignItems:'center'},
  btnNavPrimary:{backgroundColor:colors.primary,borderColor:colors.primary},
  btnNavTxt:{fontSize:14,fontWeight:'600',color:colors.text},
  doneScreen:{flex:1,backgroundColor:colors.background,alignItems:'center',justifyContent:'center',padding:30,gap:12},
  doneEmoji:{fontSize:55},
  doneTitle:{fontSize:24,fontWeight:'700',color:colors.text},
  doneSub:{fontSize:14,color:colors.textSub,textAlign:'center',lineHeight:22},
  btnPrimary:{backgroundColor:colors.primary,borderRadius:12,padding:14,width:'100%',alignItems:'center',marginTop:8},
  btnPrimaryTxt:{color:'white',fontSize:14,fontWeight:'600'},
  secLabel:{fontSize:11,color:colors.textSub,fontWeight:'600',letterSpacing:0.5,marginBottom:10},
  bloqueCard:{backgroundColor:colors.card,borderRadius:radius.md,borderWidth:0.5,borderColor:colors.border,padding:13,marginBottom:9,flexDirection:'row',alignItems:'center',gap:10},
  bloqueNum:{width:36,height:36,borderRadius:18,backgroundColor:colors.primaryLight,alignItems:'center',justifyContent:'center'},
  bloqueNumTxt:{fontSize:13,fontWeight:'700',color:colors.primaryDark},
  bloqueInfo:{flex:1},
  bloqueTitle:{fontSize:14,fontWeight:'600',color:colors.text},
  bloqueSub:{fontSize:12,color:colors.textSub,marginTop:2},
  bloqueArrow:{fontSize:20,color:colors.textLight},
  empty:{alignItems:'center',paddingTop:40,paddingHorizontal:20},
  emptyEmoji:{fontSize:50,marginBottom:12},
  emptyTxt:{fontSize:14,color:colors.textSub,textAlign:'center',lineHeight:22,marginBottom:20},
});
