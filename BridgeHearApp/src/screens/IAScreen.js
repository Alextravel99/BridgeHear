
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import { colors, radius } from '../theme';
import { categorias } from '../data';

export default function IAScreen({ navigation }) {
  const [catActual, setCat] = useState('trabajo');
  const [palabras, setPalabras] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const generar = async () => {
    setCargando(true);
    setError('');
    setPalabras([]);
    try {
      const resp = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: 'Generate 10 English words from category ' + catActual + ' that native speakers use in real daily life. For each word include: English word, pronunciation written in Spanish phonetics like Jelou Wuater Biutiful, Spanish meaning, short context max 6 words. Respond ONLY with valid JSON no backticks: {"palabras":[{"en":"...","pron":"...","es":"...","ctx":"..."}]}'
          }]
        })
      });
      const data = await resp.json();
      if (data.error) { setError('Error: ' + data.error.message); setCargando(false); return; }
      const txt = data.content.map(i => i.text || '').join('');
      const clean = txt.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(clean);
      setPalabras(parsed.palabras);
    } catch(e) {
      setError('Error al generar palabras. Verifica tu conexion.');
    }
    setCargando(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={()=>navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backTxt}>‹</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Palabras con IA</Text>
          <Text style={styles.headerSub}>Vocabulario real de nativos</Text>
        </View>
      </View>
      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
        <Text style={styles.secLabel}>ELIGE CATEGORIA</Text>
        <View style={styles.cats}>
          {categorias.map(c=>(
            <TouchableOpacity key={c.id} style={[styles.cat, catActual===c.id&&styles.catActive]} onPress={()=>setCat(c.id)}>
              <Text style={[styles.catTxt, catActual===c.id&&styles.catTxtActive]}>{c.emoji} {c.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={[styles.btnGenerar, cargando&&{opacity:0.6}]} onPress={generar} disabled={cargando}>
          {cargando
            ? <ActivityIndicator color='white'/>
            : <Text style={styles.btnGenerarTxt}>✨ Generar 10 palabras</Text>
          }
        </TouchableOpacity>
        {error!==''&&(
          <View style={styles.errorBox}>
            <Text style={styles.errorTxt}>{error}</Text>
          </View>
        )}
        {palabras.length>0&&(
          <>
            <Text style={styles.secLabel}>PALABRAS DE NATIVOS</Text>
            {palabras.map((p,i)=>(
              <View key={i} style={styles.wordCard}>
                <View style={styles.wNum}><Text style={styles.wNumTxt}>{i+1}</Text></View>
                <View style={styles.wInfo}>
                  <Text style={styles.wEn}>{p.en}</Text>
                  <Text style={styles.wPron}>{p.pron}</Text>
                  <Text style={styles.wEs}>{p.es}</Text>
                  <Text style={styles.wCtx}>📍 {p.ctx}</Text>
                </View>
              </View>
            ))}
          </>
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
  secLabel:{fontSize:11,color:colors.textSub,fontWeight:'600',letterSpacing:0.5,marginBottom:10},
  cats:{flexDirection:'row',flexWrap:'wrap',gap:7,marginBottom:14},
  cat:{backgroundColor:colors.card,borderWidth:0.5,borderColor:colors.border,borderRadius:20,paddingVertical:7,paddingHorizontal:12},
  catActive:{backgroundColor:colors.primary,borderColor:colors.primary},
  catTxt:{fontSize:12,color:colors.textSub},catTxtActive:{color:'white'},
  btnGenerar:{backgroundColor:colors.primary,borderRadius:radius.md,padding:13,alignItems:'center',marginBottom:14},
  btnGenerarTxt:{color:'white',fontSize:14,fontWeight:'600'},
  errorBox:{backgroundColor:colors.errorBg,borderRadius:radius.md,padding:12,marginBottom:12},
  errorTxt:{fontSize:13,color:colors.error},
  wordCard:{backgroundColor:colors.card,borderRadius:radius.md,borderWidth:0.5,borderColor:colors.border,padding:12,marginBottom:8,flexDirection:'row',gap:10},
  wNum:{width:26,height:26,borderRadius:13,backgroundColor:colors.primaryLight,alignItems:'center',justifyContent:'center',marginTop:2},
  wNumTxt:{fontSize:11,fontWeight:'700',color:colors.primaryDark},
  wInfo:{flex:1},wEn:{fontSize:14,fontWeight:'600',color:colors.text},
  wPron:{fontSize:13,color:colors.primary,marginTop:2},wEs:{fontSize:12,color:colors.textSub,marginTop:2},
  wCtx:{fontSize:11,color:colors.textLight,marginTop:3,fontStyle:'italic'},
});
