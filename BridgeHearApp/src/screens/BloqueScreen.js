
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import { colors, radius } from '../theme';
import { obtenerDiaActual, completarDia } from '../storage';
import { getPalabrasDelDia, getCategoriaDelDia, getDiaSemana } from '../data';

export default function BloqueScreen({ navigation }) {
  const [palabras, setPalabras] = useState([]);
  const [vistas, setVistas] = useState([]);
  const [diaActual, setDiaActual] = useState(1);
  const [cargando, setCargando] = useState(true);
  const [completado, setCompletado] = useState(false);


  const cargarPalabras = async () => {
    setCargando(true);
    const dia = await obtenerDiaActual();
    setDiaActual(dia);
    const p = getPalabrasDelDia(dia);
    setPalabras(p);
    setVistas(p.map(()=>false));
    setCompletado(false);
    setCargando(false);
  };

  const marcarVista = async (i) => {
    const nuevas = [...vistas];
    nuevas[i] = true;
    setVistas(nuevas);
    const todasVistas = nuevas.every(Boolean);
    if (todasVistas && !completado) {
      setCompletado(true);
      await completarDia();
    }
    navigation.navigate('Practica', {
      inicio:i, 
      palabras,
      onPalabraVista: (idx) => {
        setVistas(prev => {
          const nuevas = [...prev];
          nuevas[idx] = true;
          const todasVistas = nuevas.every(Boolean);
          if (todasVistas) {
            setCompletado(true);
            completarDia();
          }
          return nuevas;
        });
      }
    });
  };

  const siguienteDia = async () => {
    await cargarPalabras();
  };

  const visitadas = vistas.filter(Boolean).length;
  const pct = palabras.length > 0 ? Math.round((visitadas/palabras.length)*100) : 0;
  const categoria = getCategoriaDelDia(diaActual);
  const diaSemana = getDiaSemana(diaActual);

  if (cargando) return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}><Text style={styles.headerTitle}>Bloque del dia</Text></View>
      <View style={{flex:1,backgroundColor:colors.background,alignItems:'center',justifyContent:'center'}}>
        <ActivityIndicator size='large' color={colors.primary}/>
        <Text style={{color:colors.textSub,marginTop:12,fontSize:14}}>Cargando palabras...</Text>
      </View>
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={()=>navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backTxt}>‹</Text>
        </TouchableOpacity>
        <View style={{flex:1}}>
          <Text style={styles.headerTitle}>Dia {diaActual} — {diaSemana}</Text>
          <Text style={styles.headerSub}>{categoria} · 10 palabras</Text>
        </View>
      </View>
      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
        {completado && (
          <View style={styles.completadoBanner}>
            <Text style={styles.completadoEmoji}>🎉</Text>
            <View style={{flex:1}}>
              <Text style={styles.completadoTxt}>Dia {diaActual} completado</Text>
              <Text style={styles.completadoSub}>Listo para el siguiente</Text>
            </View>
            <TouchableOpacity style={styles.btnSiguiente} onPress={siguienteDia}>
              <Text style={styles.btnSiguienteTxt}>Dia {diaActual+1} →</Text>
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.infoBanner}>
          <Text style={{fontSize:16}}>🕐</Text>
          <Text style={styles.infoTxt}>Entra cuando quieras — sin limite de hora</Text>
        </View>
        <View style={styles.progWrap}>
          <View style={styles.progTop}>
            <Text style={styles.progLbl}>Revisadas: {visitadas} de {palabras.length}</Text>
            <Text style={styles.progLbl}>{pct}%</Text>
          </View>
          <View style={styles.progBar}>
            <View style={[styles.progFill,{width:pct+'%'}]}/>
          </View>
        </View>
        <Text style={styles.secLabel}>10 PALABRAS DE HOY</Text>
        {palabras.map((p,i)=>(
          <TouchableOpacity key={i} style={styles.wordCard} onPress={()=>marcarVista(i)}>
            <View style={[styles.wNum, vistas[i]?styles.wDone:p.tipo==='repaso'?styles.wRep:{}]}>
              <Text style={[styles.wNumTxt, vistas[i]?{color:colors.success}:p.tipo==='repaso'?{color:colors.warning}:{color:colors.primaryDark}]}>
                {vistas[i]?'✓':i+1}
              </Text>
            </View>
            <View style={styles.wInfo}>
              <Text style={styles.wEn}>{p.en}</Text>
              <Text style={styles.wPron}>{p.pron}</Text>
              <Text style={styles.wEs}>{p.es}</Text>
            </View>
            {vistas[i]&&<View style={[styles.badge,styles.badgeDone]}><Text style={styles.badgeDoneTxt}>Vista</Text></View>}
            {!vistas[i]&&p.tipo==='repaso'&&<View style={[styles.badge,styles.badgeRep]}><Text style={styles.badgeRepTxt}>Repaso</Text></View>}
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.btnPrimary} onPress={()=>navigation.navigate('Practica',{inicio:0,palabras})}>
          <Text style={styles.btnPrimaryTxt}>🎯 Ir a Practicar</Text>
        </TouchableOpacity>
        {completado && (
          <TouchableOpacity style={[styles.btnPrimary,{backgroundColor:colors.success,marginTop:10}]} onPress={siguienteDia}>
            <Text style={styles.btnPrimaryTxt}>Siguiente dia →</Text>
          </TouchableOpacity>
        )}
        <View style={{height:20}}/>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:{flex:1,backgroundColor:colors.primary},
  header:{backgroundColor:colors.primary,paddingHorizontal:16,paddingTop:10,paddingBottom:16,flexDirection:'row',alignItems:'center',gap:10},
  backBtn:{padding:4},backTxt:{color:'white',fontSize:28,fontWeight:'300'},
  headerTitle:{color:'white',fontSize:18,fontWeight:'700'},
  headerSub:{color:'rgba(255,255,255,0.85)',fontSize:12},
  body:{flex:1,backgroundColor:colors.background,padding:14},
  completadoBanner:{backgroundColor:'#eaf3de',borderRadius:radius.md,padding:14,marginBottom:14,flexDirection:'row',alignItems:'center',gap:10},
  completadoEmoji:{fontSize:24},
  completadoTxt:{fontSize:14,fontWeight:'600',color:colors.success},
  completadoSub:{fontSize:12,color:colors.success,opacity:0.8},
  btnSiguiente:{backgroundColor:colors.primary,borderRadius:radius.md,padding:8,paddingHorizontal:14},
  btnSiguienteTxt:{color:'white',fontSize:13,fontWeight:'600'},
  infoBanner:{backgroundColor:colors.primaryLight,borderRadius:radius.md,padding:11,marginBottom:14,flexDirection:'row',gap:8,alignItems:'flex-start'},
  infoTxt:{fontSize:12,color:colors.primaryDark,flex:1},
  progWrap:{marginBottom:14},
  progTop:{flexDirection:'row',justifyContent:'space-between',marginBottom:5},
  progLbl:{fontSize:12,color:colors.textSub},
  progBar:{backgroundColor:'#e8edf2',borderRadius:10,height:6},
  progFill:{backgroundColor:colors.primary,borderRadius:10,height:6},
  secLabel:{fontSize:11,color:colors.textSub,fontWeight:'600',letterSpacing:0.5,marginBottom:10},
  wordCard:{backgroundColor:colors.card,borderRadius:radius.md,borderWidth:0.5,borderColor:colors.border,padding:12,marginBottom:8,flexDirection:'row',alignItems:'center',gap:10},
  wNum:{width:28,height:28,borderRadius:14,backgroundColor:colors.primaryLight,alignItems:'center',justifyContent:'center'},
  wDone:{backgroundColor:colors.successBg},wRep:{backgroundColor:colors.warningBg},
  wNumTxt:{fontSize:12,fontWeight:'700',color:colors.primaryDark},
  wInfo:{flex:1},wEn:{fontSize:14,fontWeight:'600',color:colors.text},
  wPron:{fontSize:13,color:colors.primary,marginTop:1},wEs:{fontSize:12,color:colors.textSub,marginTop:1},
  badge:{borderRadius:6,paddingHorizontal:7,paddingVertical:2},
  badgeDone:{backgroundColor:colors.successBg},badgeDoneTxt:{fontSize:10,fontWeight:'600',color:colors.success},
  badgeRep:{backgroundColor:colors.warningBg},badgeRepTxt:{fontSize:10,fontWeight:'600',color:colors.warning},
  btnPrimary:{backgroundColor:colors.primary,borderRadius:radius.md,padding:14,alignItems:'center',marginTop:6},
  btnPrimaryTxt:{color:'white',fontSize:14,fontWeight:'600'},
});
