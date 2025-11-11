import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, BackHandler, Platform, Alert, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../styles";
import { db } from "../Utils/firebase";
import { collection, getDocs } from "firebase/firestore";

const LevelCard = ({ level, difficulty, selected, onSelect }) => {
  return (
    <TouchableOpacity
      style={[styles.levelCard, selected && styles.selectedCard]}
      onPress={onSelect}
    >
      <Text style={styles.levelTitle}>Level {level}</Text>
      <View style={styles.difficultyContainer}>
        <Text style={styles.difficultyText}>Dificult:</Text>
        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map((n) => (
            <Ionicons
              key={n}
              name={n <= difficulty ? "star" : "star-outline"}
              size={18}
              color="#FFD700"
            />
          ))}
        </View>
      </View>
      <View style={styles.scaleRow}>
        {[1, 2, 3, 4, 5].map((n) => (
          <Text key={n} style={styles.scaleText}>
            {n}
          </Text>
        ))}
      </View>
    </TouchableOpacity>
  );
};

const LevelScreen = ({ navigation }) => {
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [muted, setMuted] = useState(false); // 🔹 estado de mute

  const levels = [
    { id: 1, difficulty: 2 },
    { id: 2, difficulty: 1 },
    { id: 3, difficulty: 3 },
    { id: 4, difficulty: 4 },
    { id: 5, difficulty: 5 },
    { id: 6, difficulty: 1 },
    { id: 7, difficulty: 3 },

  ];
  const toggleMute = () => {
    setMuted(!muted);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => alert("La música se controla en el nivel")}>
          <TouchableOpacity onPress={toggleMute}>
            <Ionicons
              name={muted ? "volume-mute-outline" : "volume-high-outline"}
              size={26}
            />
          </TouchableOpacity>
        </TouchableOpacity>
        <Text style={styles.title}>Levels</Text>
        <TouchableOpacity
          onPress={() => {
            if (Platform.OS === "android") {
              Alert.alert(
                "¿Estás seguro?",
                "¿Quieres salir de la aplicación?",
                [
                  {
                    text: "Cancelar",
                    onPress: () => console.log("Se canceló la salida"),
                    style: "cancel",
                  },
                  {
                    text: "Salir",
                    onPress: () => BackHandler.exitApp(), // Sale de la app
                  },
                ],
                { cancelable: false } // No permite cerrar el alert tocando fuera
              );
            } else {
              Alert.alert(
                "No disponible",
                "Cerrar la app directamente no es soportado en iOS"
              );
            }
          }}
        >
          <Ionicons name="arrow-back-circle-outline" size={26} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={true}
        style={styles.scrollView}
      >
        {levels.map((lvl) => (
          <View key={lvl.id} style={styles.levelCapsule}>
            <LevelCard
              level={lvl.id}
              difficulty={lvl.difficulty}
              selected={selectedLevel === lvl.id}
              onSelect={() => setSelectedLevel(lvl.id)}
              style={styles.levelCard} // aplicamos estilo reducido
            />
          </View>
        ))}
      </ScrollView>

      <View style={[styles.bottomBar, { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, },]}>
        {/* Imagen a la izquierda */}
        <Image source={require("../assets/Geogeser.jpg")} style={{ width: 50, height: 50, borderRadius: 8 }} resizeMode="cover" />
        {/* Botón centrado */}
        <View style={{ flex: 1, alignItems: "center" }}>
          <TouchableOpacity
            style={styles.startButton}
            onPress={() => {
              if (selectedLevel) {
                const selectedLvl = levels.find((lvl) => lvl.id === selectedLevel);
                navigation.navigate("Game", { level: selectedLevel, difficulty: selectedLvl.difficulty, muted: muted, });
              }
            }}>
            <Text style={styles.startText}>Start</Text>
          </TouchableOpacity>
        </View>
        {/* Espacio vacío a la derecha para mantener centrado el botón */}
        <View style={{ width: 50 }} />
      </View>
    </View>
  );
};

export default LevelScreen;
