import * as Location from 'expo-location';
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import {Fontisto} from '@expo/vector-icons';
const {width:SCREEN_WIDTH} = Dimensions.get('window');

const icons = {
  Clouds:"cloudy",
  Clear:"day-sunny",
  Snow:"snow",
  Atmosphere:"cloudy-gusts",
  Drizzle:"rain",
  Thunderstrom:"lightning",
  Rain:"rains",
};
const API_KEY = "c6dc52d2bee4293677834428b00feca8";

export default function App() {
  const [district, setDistrict ] = useState("Loading...")
  const [days, setDays] = useState([])
  const [Ok, setOk] = useState(true);
  const ask = async() => {
    const {granted} = await Location.requestForegroundPermissionsAsync();
    if(!granted){
      setOk(false);
    }
    const {coords:{latitude,longitude}} = await Location.getCurrentPositionAsync({accuracy:5});
    const location = await Location.reverseGeocodeAsync(
      {latitude,longitude},
      {useGoogleMaps:false}
    );
    setDistrict(location[0].district);
  const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`)
  const json = await response.json();
  setDays(json.daily);
  };
  useEffect(()=>{
    ask();
  },[])
  return <View style={styles.container}>
    <View style={styles.district}>
      <Text style={styles.districtName}>{district}</Text>
    </View>
    <ScrollView 
    pagingEnabled
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.weather}>
      {days.length === 0 ? (<View style={{ ...styles.day,alignItems:"center"}}>
        <ActivityIndicator color={"white"}style={{marginTop:10}} size={"large"}/> 
      </View>
      ) : (
        days.map((day, index)=>
        <View key={index} style={styles.day}>
          <View style={{
            flexDirection:"row",
            alignItems:"flex-end",
            justifyContent:"space-between",
            width:"80%",
            }}
          >
            <Text style={styles.temp}>
              {parseFloat(day.temp.day).toFixed(1)}  
            </Text>
            <Text style={styles.celsius}>
            ℃
            </Text>
            <Fontisto style={{marginLeft:70}} name={icons[day.weather[0].main]} size={68} color="white" />
          </View>
          
          <Text style={styles.description}>{day.weather[0].main}</Text>
          <Text style={styles.tinyText}>{day.weather[0].description}</Text>
        </View>)
      )}
    </ScrollView>
  </View>;
}
const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:"teal",
  },
  district:{
    flex:1.2,
    justifyContent:"center",
    alignItems:"center",
  },
  celsius:{
    marginLeft:10,
    color:"white",
    textAlign:"left",
    fontSize:60,
    fontWeight:"600",
  },
  districtName:{
    color:"white",
    fontSize: 78,
    fontWeight:"500",
  },
  weather:{
  },
  day:{
    color:"white",
    width:SCREEN_WIDTH,
    alignItems:"flex-start",
    paddingHorizontal:20,
  },
  temp:{
    color:"white",
    textAlign:"left",
    marginTop:50,
    fontSize:80,
    fontWeight:"600",
  },
  description:{
    color:"white",
    marginTop:-10,
    fontSize:30,
    fontWeight:"500",
  },
  tinyText:{
    color:"white",
    fontWeight:"600",
    marginTop:-5,
    fontSize:25,
  },
})
