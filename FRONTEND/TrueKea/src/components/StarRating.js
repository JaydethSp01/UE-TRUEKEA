import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/Colors";

export default function StarRating({ 
  maxStars = 5, 
  rating = 0, 
  onChange, 
  size = "medium",
  readonly = false 
}) {
  const [currentRating, setCurrentRating] = useState(rating);

  const handlePress = (starIndex) => {
    if (readonly) return;
    const newRating = starIndex + 1;
    setCurrentRating(newRating);
    onChange && onChange(newRating);
  };

  const getStarSize = () => {
    switch (size) {
      case "small": return 16;
      case "large": return 32;
      default: return 24;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.starsContainer}>
        {Array.from({ length: maxStars }).map((_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handlePress(index)}
            disabled={readonly}
            style={styles.starButton}
          >
            <Ionicons
              name={currentRating > index ? "star" : "star-outline"}
              size={getStarSize()}
              color={currentRating > index ? Colors.accent : Colors.lightGray}
            />
          </TouchableOpacity>
        ))}
      </View>
      {!readonly && (
        <Text style={styles.ratingText}>
          {currentRating} de {maxStars} estrellas
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 8,
  },
  starsContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  starButton: {
    paddingHorizontal: 2,
  },
  ratingText: {
    marginTop: 8,
    fontSize: 14,
    color: Colors.textSecondary,
    fontFamily: "Inter-Regular",
  }
});
