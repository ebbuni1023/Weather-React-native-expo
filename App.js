import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import React, { useState, useEffect } from 'react';
import { Ionicons, Fontisto } from '@expo/vector-icons';


const SCREEN_WIDTH = Dimensions.get("window").width;

const API_KEY = "c2b9e153ac1d22afe6d680d8b8a5204c";

const icons = {
  Clouds: "cloudy",
  Clear: "day-sunny",
  Rain: "rains",
  Snow: "snow",
  Drizzle:"rain",
  Thunderstorm: "lightning",
  
};

export default function App() {
  const [ok, setOk] = useState(true);
  const [forcast, setForcast] = useState([]);
  const [city, setCity] = useState("Loading..");
  const getPermission = async() => {
    const {granted} = await Location.requestForegroundPermissionsAsync();
    if(!granted){
      setOk(false);
    }
    const {coords:{latitude, longitude}} = await Location.getCurrentPositionAsync({accuracy:5});
    
    const location = await Location.reverseGeocodeAsync(
      {latitude, longitude}, 
      {useGoogleMaps: false});
    setCity(location[0].city);
    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`);
    const json = await response.json();
    setForcast(json.daily);
  };


  useEffect(() => {
    getPermission();

  }, [])

  return (
    <View style={styles.container}>
      {/* CITY */}
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      {/* WEATHER */}
      <ScrollView 
      pagingEnabled 
      horizontal
      showsHorizontalScrollIndicator = {false}
      contentContainerStyle = {styles.weather}
      >
        {forcast.length === 0 ? (
        <View style = {{...styles.day, alignItems:"center"}}><ActivityIndicator color="white" style ={{marginTop: 10}}size="large"/></View> 
        ) : (
          forcast.map((day, index) =>
        <View key ={index} style = {styles.day}>
          <View style = {{ 
            flexDirection: "row", 
            alignItems:"center", 
            width:'100%',
            justifyContent: 'space-between'
            }}>
            <Text style = {styles.temp}>{parseFloat(day.temp.day).toFixed(1)}</Text>
            <Fontisto name={icons[day.weather[0].main]} size={60} color= "white" />
          </View>

          <Text style = {styles.description}>{day.weather[0].main}</Text>
          <Text style = {styles.description1}>{day.weather[0].description}</Text>

        </View>
        ))}
      </ScrollView>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "tomato"
  },

  city: {
    flex: 1.2,
    justifyContent: 'center',
    alignItems: 'center',
  },

  cityName:{
    fontSize: 50,
    fontWeight: '900',
    color: 'white',
  },

  day:{
    alignItems:'flex-start',
    paddingHorizontal: 20,
    width: SCREEN_WIDTH,
  },

  temp:{
    marginTop: 50,
    fontSize: 80,
    color: 'white',
    fontWeight: '600'
  },
  description:{
    marginTop: -10,
    fontSize: 40,
    color: 'white',
    fontWeight: '500'


  },
  description1:{
    fontSize: 20,
    color: 'white',

  }
});
