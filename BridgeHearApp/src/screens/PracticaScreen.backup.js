import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import * as Speech from 'expo-speech';
import { colors, radius } from '../theme';
import { palabrasDelDia } from '../data';

export default function PracticaScreen({ navigation, route }) {
  const inicio = route?.params?.inicio || 0;
  const [actual, setActual] = useState(inicio);
  const [visible, setVisible] = useState(false);
  const [terminado, setTerminado] = useState(false);
  const p = palabrasDelDia[actual];
  const pct = Math.round(((actual+1)/palabrasDelDia.length)*100);
  const siguiente = () => { if(actual===palabrasDelDia.length-1){setTerminado(true);return;} setActual(actual+1); setVisible(false); };
  const anterior = () => { if(actual===0)return; setActual(actual-1); setVisible(false); };
  const reiniciar = () => { setActual(0); setVisible(false); setTerminado(false); };
  if(terminado) return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={()=>navigation.goBack()} style={styles.backBtn}><Text style={styles.backTxt}>‹</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>Practice</Text>
      </View>
      <View style={styles.doneScreen}>
        <Text style={styles.doneEmoji}>🎉</Text>
        <Text style={styles.doneTitle}>Completed!</Text>
        <Text style={styles.doneSub}>You reviewed all 10 words today.{"\n"}Come back anytime to review again.</Text>
        <TouchableOpacity style={styles.btnPrimary} onPress={reiniciar}><Text style={styles.btnPrimaryTxt}>Review again</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.btnPrimary,styles.btnSec]} onPress={()=>navigation.navigate('Home')}><Text style={[styles.btnPrimaryTxt,{color:colors.primaryDark}]}>Go to home</Text></TouchableOpacity>
      </View>
    </SafeAreaView>
  );
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={()=>navigation.goBack()} style={styles.backBtn}><Text style={styles.backTxt}>‹</Text></TouchableOpacity>
        <View><Text style={styles.headerTitle}>Practice</Text><Text style={styles.headerSub}>Word {actual+1} of {palabrasDelDia.length}</Text></View>
      </View>
      <View style={styles.body}>
        <View style={styles.progBar}><View style={[styles.progFill,{width:`${pct}%`}]}/></View>
        <View style={styles.bigCard}>
          <Text style={styles.bigEn}>{p.en}</Text>
          <View style={styles.divider}/>
          <Text style={styles.bigEs}>{p.es}</Text>
          <View style={styles.pronArea}>
            {visible?(<><Text style={styles.pronHint}>Pronunciation</Text><Text style={styles.bigPron}>{p.pron}</Text></>):(<Text style={styles.pronHint}>How is it pronounced?</Text>)}
          </View>
          <TouchableOpacity style={[styles.btnReveal,visible&&styles.btnRevealOn]} onPress={()=>setVisible(!visible)}>
            <Text style={[styles.btnRevealTxt,visible&&{color:colors.primaryDark}]}>{visible?"👁 Hide pronunciation":"👁 See pronunciation"}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.navRow}>
          <TouchableOpacity style={[styles.btnNav,actual===0&&{opacity:0.3}]} onPress={anterior} disabled={actual===0}><Text style={styles.btnNavTxt}>← Previous</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.btnNav,styles.btnNavPrimary]} onPress={siguiente}><Text style={[styles.btnNavTxt,{color:"white"}]}>{actual===palabrasDelDia.length-1?"Finish ✓":"Next →"}</Text></TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safe:{flex:1,backgroundColor:colors.primary},
  header:{backgroundColor:colors.primary,paddingHorizontal:16,paddingTop:10,paddingBottom:16,flexDirection:"row",alignItems:"center",gap:10},
  backBtn:{padding:4},backTxt:{color:"white",fontSize:28,fontWeight:"300"},
  headerTitle:{color:"white",fontSize:18,fontWeight:"700"},
  headerSub:{color:"rgba(255,255,255,0.85)",fontSize:12},
  body:{flex:1,backgroundColor:colors.background,padding:16},
  progBar:{backgroundColor:"#e8edf2",borderRadius:10,height:5,marginBottom:20},
  progFill:{backgroundColor:colors.primary,borderRadius:10,height:5},
  bigCard:{backgroundColor:colors.card,borderRadius:20,borderWidth:0.5,borderColor:colors.border,padding:36,alignItems:"center",marginBottom:20,gap:12},
  bigEn:{fontSize:34,fontWeight:"700",color:colors.text},
  divider:{width:40,height:1.5,backgroundColor:colors.border,borderRadius:2},
  bigEs:{fontSize:17,color:colors.textSub},
  pronArea:{minHeight:55,alignItems:"center",justifyContent:"center",gap:4},
  pronHint:{fontSize:12,color:colors.textLight,textTransform:"uppercase",letterSpacing:0.5},
  bigPron:{fontSize:26,fontWeight:"700",color:colors.primary},
  btnReveal:{backgroundColor:"#f0f4f9",borderWidth:0.5,borderColor:colors.border,borderRadius:radius.md,paddingVertical:10,paddingHorizontal:20},
  btnRevealOn:{backgroundColor:colors.primaryLight,borderColor:colors.primary},
  btnRevealTxt:{fontSize:13,fontWeight:"500",color:colors.textSub},
  navRow:{flexDirection:"row",gap:10},
  btnNav:{flex:1,backgroundColor:colors.card,borderWidth:0.5,borderColor:colors.border,borderRadius:radius.md,padding:13,alignItems:"center"},
  btnNavPrimary:{backgroundColor:colors.primary,borderColor:colors.primary},
  btnNavTxt:{fontSize:14,fontWeight:"600",color:colors.text},
  doneScreen:{flex:1,backgroundColor:colors.background,alignItems:"center",justifyContent:"center",padding:30,gap:12},
  doneEmoji:{fontSize:55},doneTitle:{fontSize:24,fontWeight:"700",color:colors.text},
  doneSub:{fontSize:14,color:colors.textSub,textAlign:"center",lineHeight:22},
  btnPrimary:{backgroundColor:colors.primary,borderRadius:radius.md,padding:14,width:"100%",alignItems:"center",marginTop:8},
  btnSec:{backgroundColor:colors.primaryLight},
  btnPrimaryTxt:{color:"white",fontSize:14,fontWeight:"600"},
});
