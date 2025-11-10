import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { db } from "../Utils/firebase";
import { query, collection, getDocs, where, orderBy } from "firebase/firestore";
import styles from "../styles";
import { Audio } from "expo-av";


const GameScreen = ({ route, navigation }) => {
    const { level, difficulty, muted: initialMuted = true } = route.params;

    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userMarker, setUserMarker] = useState(null);
    const [distance, setDistance] = useState(null);
    const [scores, setScores] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [startTime, setStartTime] = useState(Date.now());
    const mapRef = useRef(null);
    const [muted, setMuted] = useState(initialMuted); // 🔹 Estado de mute
    const soundObject = useRef(new Audio.Sound());
    const [isLoaded, setIsLoaded] = useState(false);
    const [checkDisabled, setCheckDisabled] = useState(false);


    useEffect(() => {
        const loadMusic = async () => {
            try {
                await soundObject.current.loadAsync(
                    require("../Music/Tensio.mp3"),
                    { shouldPlay: !muted, isLooping: true }
                );
                setIsLoaded(true); // ✅ ya podemos controlar mute
            } catch (error) {
                console.log("Error al cargar música:", error);
            }
        };

        loadMusic();

        return () => {
            soundObject.current.unloadAsync();
        };
    }, []);

    const toggleMute = async () => {
        if (!isLoaded) return; // 🔹 no hacer nada si aún no se cargó
        try {
            await soundObject.current.setStatusAsync({ shouldPlay: muted });
            setMuted(!muted);
        } catch (error) {
            console.log("Error al cambiar mute:", error);
        }
    };

    // 🔹 Segundo useEffect solo para cargar preguntas
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const q = query(
                    collection(db, "questions"),
                    where("difficulty", "==", difficulty), // 🔹 Filtra por dificultad
                    orderBy("title", "asc")
                );
                const querySnapshot = await getDocs(q);
                const loadedQuestions = [];

                querySnapshot.forEach((doc) => {
                    const data = doc.data();

                    // 🔹 Convertimos el target a coordenadas numéricas
                    let lat = 0, lon = 0;
                    if (Array.isArray(data.target) && data.target.length === 2) {
                        lat = parseFloat(data.target[0]);
                        lon = parseFloat(data.target[1]);
                    } else if (typeof data.target === "object" && data.target.latitude) {
                        lat = data.target.latitude;
                        lon = data.target.longitude;
                    } else if (typeof data.target === "string") {
                        const parts = data.target.split(",");
                        lat = parseFloat(parts[0]);
                        lon = parseFloat(parts[1]);
                    }

                    loadedQuestions.push({
                        id: doc.id,
                        title: data.title || "Quest",
                        text: data.text || "",
                        target: { latitude: lat, longitude: lon },
                    });
                });

                setQuestions(loadedQuestions);
                setLoading(false);
            } catch (error) {
                console.error("Error al cargar preguntas:", error);
                Alert.alert("Error", "No se pudieron cargar las preguntas.");
                setLoading(false);
            }
        };

        fetchQuestions();
    }, []);

    const currentQuestion = questions[currentIndex];

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371;
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;
        const a = Math.sin(dLat / 2) ** 2 +
            Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return (R * c).toFixed(2);
    };

    const maxScore = 100;

    const calculateScore = (distance, timeInSeconds) => {
        const distanceFactor = parseFloat(distance);
        const timeFactor = timeInSeconds / 10; // penaliza cada 10s
        let score = maxScore - (distanceFactor * 5 + timeFactor);
        if (score < 0) score = 0;
        return Math.round(score);
    };

    const handleMapPress = (e) => setUserMarker(e.nativeEvent.coordinate);

    const handleCheck = () => {
        if (!userMarker) {
            Alert.alert("Selecciona un punto en el mapa");
            return;
        }

        setCheckDisabled(true); // 🔹 bloqueamos el botón inmediatamente

        const dist = calculateDistance(
            userMarker.latitude,
            userMarker.longitude,
            currentQuestion.target.latitude,
            currentQuestion.target.longitude
        );

        setDistance(dist);

        const timeElapsed = (Date.now() - startTime) / 1000;
        const score = calculateScore(dist, timeElapsed);
        setScores([...scores, { question: currentQuestion.title, distance: dist, score }]);

        // 🔍 Hacer zoom para mostrar ambos puntos
        if (mapRef.current && userMarker) {
            mapRef.current.fitToCoordinates(
                [userMarker, currentQuestion.target],
                { edgePadding: { top: 100, right: 100, bottom: 100, left: 100 }, animated: true }
            );
        }

        setTimeout(() => {
            if (currentIndex < questions.length - 1) {
                setCurrentIndex(currentIndex + 1);
                setUserMarker(null);
                setDistance(null);
                setStartTime(Date.now());
            } else {
                setShowResults(true);
            }
            setCheckDisabled(false); // 🔹 desbloqueamos el botón al terminar
        }, 3000);
    };

    if (showResults) {
        const totalScore = scores.reduce((acc, item) => acc + item.score, 0);
        return (
            <View style={styles.container}>
                <Text style={styles.questTitle}>Resultados Level {level}</Text>
                {scores.map((item, idx) => (
                    <Text key={idx} style={styles.resultText}>
                        {item.question}: {item.distance} km → {item.score} pts
                    </Text>
                ))}
                <Text style={[styles.resultText, { marginTop: 20, fontSize: 18 }]}>
                    Puntuación total: {totalScore} pts
                </Text>
                <TouchableOpacity style={[styles.startButton, { marginTop: 20 }]} onPress={() => navigation.goBack()}>
                    <Text style={styles.startText}>Volver</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={toggleMute}>
                    <Ionicons name={muted ? "volume-mute-outline" : "volume-high-outline"} size={26} />
                </TouchableOpacity>
                <Text style={styles.title}>Level {level}</Text>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back-circle-outline" size={26} />
                </TouchableOpacity>
            </View>

            {!loading && currentQuestion ? (
                <>
                    <Text style={styles.questTitle}>{currentQuestion.title}</Text>
                    <Text style={styles.questText}>{currentQuestion.text}</Text>
                </>
            ) : (
                <View style={{ alignItems: "center", marginTop: 20 }}>
                    <ActivityIndicator size="large" color="#000" />
                    <Text style={styles.questText}>Cargando preguntas...</Text>
                </View>
            )}

            <MapView
                ref={mapRef}   // ✅ referencia aquí
                style={[styles.map, { marginBottom: 80 }]}
                initialRegion={{
                    latitude: 40.0,         
                    longitude: -3.7,
                    latitudeDelta: 10.5,  
                    longitudeDelta: 10.5,
                }}
                onPress={handleMapPress}
            >

                {userMarker && <Marker coordinate={userMarker} pinColor="red" />}
                {distance && <Marker coordinate={currentQuestion.target} pinColor="orange" />}
                {distance && <Polyline coordinates={[userMarker, currentQuestion.target]} strokeColor="blue" strokeWidth={2} />}
            </MapView>

            {distance && <Text style={styles.resultText}>Estás a {distance} km del objetivo</Text>}

            <View style={styles.bottomBar}>
                <TouchableOpacity style={styles.startButton} onPress={handleCheck} disabled={checkDisabled}>
                    <Text style={styles.startText}>Check</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default GameScreen;
