import React from "react";
import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/Colors";

export default function ImagePreview({ uri, onRemove, size = "medium" }) {
  const getSizeStyle = () => {
    switch (size) {
      case "small": return { width: 60, height: 60 };
      case "large": return { width: 150, height: 150 };
      default: return { width: 100, height: 100 };
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.imageContainer, getSizeStyle()]}>
        <Image source={{ uri }} style={styles.image} />
        {onRemove && (
          <TouchableOpacity style={styles.removeButton} onPress={onRemove}>
            <Ionicons name="close-circle" size={24} color={Colors.error} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    marginVertical: 8,
    marginHorizontal: 4,
  },
  imageContainer: {
    position: "relative",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: { 
    width: "100%", 
    height: "100%",
    resizeMode: "cover",
  },
  removeButton: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: Colors.white,
    borderRadius: 12,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 3,
  }
});
