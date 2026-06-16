
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { colors, radius } from '../theme';
import { obtenerEstadisticas } from '../storage';


export default function HomeScreen({ navigation }) {
  const [stats, setStats] = useState({ dia: 1, racha: 0, totalPalabras: 0 });

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      cargarStats();
    });
    return unsubscribe;
  }, [navigation]);

  const cargarStats = async () => {
    const s = await obtenerEstadisticas();
    setStats(s);
  };

  const accesos = [
    { icon: '📅', title: 'Bloque del dia', sub: '10 palabras — entra cuando quieras', bg: colors.primaryLight, screen: 'Bloque' },
    { icon: '🎯', title: 'Practicar', sub: 'Repasa y oculta pronunciacion', bg: '#faeeda', screen: 'Practica' },
    { icon: '✏️', title: 'Mis Palabras', sub: 'Agrega tu propio vocabulario', bg: colors.successBg, screen: 'MisPalabras' },
    { icon: '✨', title: 'Palabras con IA', sub: 'Vocabulario real de nativos', bg: '#f0e6fb', screen: 'IA' },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>BridgeHear</Text>
        <Text style={styles.headerSub}>Sigue aprendiendo hoy</Text>
        <View style={styles.progBarWrap}>
          <View style={[styles.progBarFill, {width: stats.totalPalabras > 0 ? Math.min((stats.totalPalabras/3650)*100, 100)+'%' : '0%'}]}/>
        </View>
        <View style={styles.progRow}>
          <Text style={styles.progTxt}>{stats.totalPalabras} palabras aprendidas</Text>
          <Text style={styles.progTxt}>Meta: 10 hoy</Text>
        </View>
      </View>
      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.statsGrid}>
          {[
            {v: String(stats.totalPalabras), l: 'Total palabras'},
            {v: stats.racha+' 🔥', l: 'Dias de racha 🔥'},
            {v: 'Dia '+stats.dia, l: 'Dia actual'},
            {v: '3,650', l: 'Meta del año'},
          ].map((s,i)=>(
            <View key={i} style={styles.statCard}>
              <Text style={styles.statVal}>{s.v}</Text>
              <Text style={styles.statLbl}>{s.l}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.secLabel}>ACCESO RAPIDO</Text>
        {accesos.map((a,i)=>(
          <TouchableOpacity key={i} style={styles.accessCard} onPress={()=>navigation.navigate(a.screen)}>
            <View style={[styles.accessIcon,{backgroundColor:a.bg}]}>
              <Text style={{fontSize:22}}>{a.icon}</Text>
            </View>
            <View style={styles.accessInfo}>
              <Text style={styles.accessTitle}>{a.title}</Text>
              <Text style={styles.accessSub}>{a.sub}</Text>
            </View>
            <Text style={styles.accessArrow}>›</Text>
          </TouchableOpacity>
        ))}
        <View style={{height:20}}/>
        
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:{flex:1,backgroundColor:colors.primary},
  header:{backgroundColor:colors.primary,paddingHorizontal:18,paddingTop:10,paddingBottom:18},
  headerTitle:{color:'white',fontSize:22,fontWeight:'700'},
  headerSub:{color:'rgba(255,255,255,0.85)',fontSize:13,marginTop:2},
  progBarWrap:{backgroundColor:'rgba(255,255,255,0.3)',borderRadius:10,height:6,marginTop:12},
  progBarFill:{backgroundColor:'white',borderRadius:10,height:6},
  progRow:{flexDirection:'row',justifyContent:'space-between',marginTop:5},
  progTxt:{color:'rgba(255,255,255,0.85)',fontSize:11},
  body:{flex:1,backgroundColor:colors.background,padding:14},
  statsGrid:{flexDirection:'row',flexWrap:'wrap',gap:9,marginBottom:18,marginTop:4},
  statCard:{backgroundColor:colors.card,borderRadius:radius.md,borderWidth:0.5,borderColor:colors.border,padding:13,width:'47.5%'},
  statVal:{fontSize:22,fontWeight:'600',color:colors.text},
  statLbl:{fontSize:11,color:colors.textSub,marginTop:2},
  secLabel:{fontSize:11,color:colors.textSub,fontWeight:'600',letterSpacing:0.5,marginBottom:10},
  accessCard:{backgroundColor:colors.card,borderRadius:radius.lg,borderWidth:0.5,borderColor:colors.border,padding:13,marginBottom:9,flexDirection:'row',alignItems:'center',gap:12},
  accessIcon:{width:44,height:44,borderRadius:radius.md,alignItems:'center',justifyContent:'center'},
  accessInfo:{flex:1},
  accessTitle:{fontSize:14,fontWeight:'600',color:colors.text},
  accessSub:{fontSize:12,color:colors.textSub,marginTop:2},
  accessArrow:{fontSize:22,color:colors.textLight},
});
