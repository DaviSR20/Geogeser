import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor: "#d9d9d9",
        paddingTop: 40,
    },
    header: {
        width: "90%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
    },
    levelsList: {
        flex: 1,
        width: "100%",
        alignItems: "center",
        paddingBottom: 120,
    },
    levelCard: {
        width: "100%",
        backgroundColor: "#fff",
        borderRadius: 50,
        padding: 15,
        alignItems: "center",
        marginVertical: 10,
    },
    selectedCard: {
        borderWidth: 2,
        borderColor: "green",
    },
    levelTitle: {
        fontWeight: "bold",
        fontSize: 18,
        marginBottom: 5,
    },
    difficultyContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
    },
    difficultyText: {
        fontSize: 14,
    },
    starsRow: {
        flexDirection: "row",
        gap: 2,
    },
    scaleRow: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 4,
        marginLeft: 55,
    },
    scaleText: {
        fontSize: 12,
        color: "#444",
        marginHorizontal: 6,
    },
    bottomBar: {
        position: "absolute",       // <--- fijar posición
        bottom: 0,                  // <--- al fondo
        left: 0,
        right: 0,
        backgroundColor: "green",
        alignItems: "center",
        paddingVertical: 20,
    },
    startButton: {
        backgroundColor: "white",
        borderRadius: 50,
        paddingVertical: 10,
        paddingHorizontal: 40,
    },
    startText: {
        fontSize: 18,
        fontWeight: "bold",
    }, questTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 5,
    },
    questText: {
        fontSize: 14,
        marginBottom: 10,
    },
    map: {
        width: "90%",
        height: 300,
        borderRadius: 10,
    },
    resultText: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: "bold",
    },

});

