import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, SafeAreaView, Alert } from 'react-native';
import { colors, radius } from '../theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MisPalabrasScreen({ navigation }) {
  const [tab, setTab] = useState('add');
  const [enInput, setEn] = useState('');
  const [pronInput, setPron] = useState('');
  const [esInput, setEs] = useState('');
  const [misPalabras, setMisPalabras] = useState([]);

  React.useEffect(() => { cargarPalabras(); }, []);

  const cargarPalabras = async () => {
    try {
      const data = await AsyncStorage.getItem('mis_palabras');
      if (data) setMisPalabras(JSON.parse(data));
    } catch(e) {}
  };

  const guardarPalabras = async (nuevas) => {
    try { await AsyncStorage.setItem('mis_palabras', JSON.stringify(nuevas)); } catch(e) {}
  };

  const agregar = () => {
    if (!enInput.trim() || !pronInput.trim() || !esInput.trim()) {
      Alert.alert('Campos vacios', 'Por favor llena los tres campos.');
      return;
    }
    const nueva = { en: enInput.trim(), pron: pronInput.trim(), es: esInput.trim(), tipo: 'mia' };
    const nuevas = [nueva, ...misPalabras];
    setMisPalabras(nuevas);
    guardarPalabras(nuevas);
    setEn(''); setPron(''); setEs('');
    setTab('mis');
  };

  const eliminar = (i) => {
    Alert.alert('Eliminar', 'Esta seguro?', [
      { text: 'Cancelar' },
      { text: 'Eliminar', style: 'destructive', onPress: () => {
        const nuevas = misPalabras.filter((_,idx) => idx !== i);
        setMisPalabras(nuevas);
        guardarPalabras(nuevas);
      }}
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={()=>navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backTxt}>‹</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Mis Palabras</Text>
          <Text style={styles.headerSub}>Vocabulario personal</Text>
        </View>
      </View>
      <View style={styles.body}>
        <View style={styles.tabs}>
          <TouchableOpacity style={[styles.tab, tab==='add'&&styles.tabActive]} onPress={()=>setTab('add')}>
            <Text style={[styles.tabTxt, tab==='add'&&styles.tabTxtActive]}>Agregar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tab, tab==='mis'&&styles.tabActive]} onPress={()=>setTab('mis')}>
            <Text style={[styles.tabTxt, tab==='mis'&&styles.tabTxtActive]}>Guardadas</Text>
          </TouchableOpacity>
        </View>
        {tab==='add' ? (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLbl}>Palabra en ingles</Text>
              <TextInput style={styles.input} placeholder="Ej: Schedule" value={enInput} onChangeText={setEn}/>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLbl}>Pronunciacion en espanol</Text>
              <TextInput style={styles.input} placeholder="Ej: Skechul" value={pronInput} onChangeText={setPron}/>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLbl}>Significado</Text>
              <TextInput style={styles.input} placeholder="Ej: Horario" value={esInput} onChangeText={setEs}/>
            </View>
            <TouchableOpacity style={styles.btnPrimary} onPress={agregar}>
              <Text style={styles.btnPrimaryTxt}>+ Agregar palabra</Text>
            </TouchableOpacity>
            <Text style={styles.hint}>Se mezclaran con tu bloque diario</Text>
          </ScrollView>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            {misPalabras.length===0 ? (
              <View style={styles.empty}>
                <Text style={styles.emptyTxt}>No tienes palabras guardadas.</Text>
              </View>
            ) : misPalabras.map((p,i)=>(
              <View key={i} style={styles.wordCard}>
                <View style={styles.wIcon}><Text>📝</Text></View>
                <View style={styles.wInfo}>
                  <Text style={styles.wEn}>{p.en}</Text>
                  <Text style={styles.wPron}>{p.pron}</Text>
                  <Text style={styles.wEs}>{p.es}</Text>
                </View>
                <View style={styles.badgeMia}><Text style={styles.badgeMiaTxt}>Mia</Text></View>
                <TouchableOpacity onPress={()=>eliminar(i)} style={{padding:4}}>
                  <Text style={{fontSize:18,color:colors.textLight}}>X</Text>
                </TouchableOpacity>
              </View>
            ))}
            <View style={{height:20}}/>
          </ScrollView>
        )}
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
  body:{flex:1,backgroundColor:colors.background,padding:14},
  tabs:{flexDirection:'row',borderBottomWidth:0.5,borderColor:colors.border,marginBottom:14},
  tab:{flex:1,paddingVertical:10,alignItems:'center',borderBottomWidth:2,borderColor:'transparent'},
  tabActive:{borderColor:colors.primary},
  tabTxt:{fontSize:13,color:colors.textSub},tabTxtActive:{color:colors.primary,fontWeight:'600'},
  inputGroup:{marginBottom:12},inputLbl:{fontSize:11,color:colors.textSub,marginBottom:4},
  input:{backgroundColor:'#f0f4f9',borderWidth:0.5,borderColor:colors.border,borderRadius:radius.md,padding:11,fontSize:14,color:colors.text},
  btnPrimary:{backgroundColor:colors.primary,borderRadius:radius.md,padding:13,alignItems:'center'},
  btnPrimaryTxt:{color:'white',fontSize:14,fontWeight:'600'},
  hint:{fontSize:11,color:colors.textLight,textAlign:'center',marginTop:10},
  wordCard:{backgroundColor:colors.card,borderRadius:radius.md,borderWidth:0.5,borderColor:colors.border,padding:12,marginBottom:9,flexDirection:'row',alignItems:'center',gap:10},
  wIcon:{width:32,height:32,borderRadius:16,backgroundColor:colors.successBg,alignItems:'center',justifyContent:'center'},
  wInfo:{flex:1},wEn:{fontSize:14,fontWeight:'600',color:colors.text},
  wPron:{fontSize:13,color:colors.primary,marginTop:1},wEs:{fontSize:12,color:colors.textSub,marginTop:1},
  badgeMia:{backgroundColor:colors.successBg,borderRadius:6,paddingHorizontal:7,paddingVertical:2},
  badgeMiaTxt:{fontSize:10,fontWeight:'600',color:colors.success},
  empty:{alignItems:'center',paddingTop:50},emptyTxt:{fontSize:14,color:colors.textSub,textAlign:'center',lineHeight:22},
});
