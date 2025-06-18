import { useRef, useEffect } from "react";
import { Animated } from "react-native";

export const useAnimatedValue = (initialValue = 0) => {
  const animatedValue = useRef(new Animated.Value(initialValue)).current;
  return animatedValue;
};

export const usePulseAnimation = (duration = 1000) => {
  const pulseAnim = useAnimatedValue(1);
  
  useEffect(() => {
    const pulse = () => {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: duration / 2,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: duration / 2,
          useNativeDriver: true,
        }),
      ]).start(() => pulse());
    };
    
    pulse();
  }, []);
  
  return pulseAnim;
};

export const useScaleAnimation = (trigger, scale = 1.05) => {
  const scaleAnim = useAnimatedValue(1);
  
  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: trigger ? scale : 1,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  }, [trigger]);
  
  return scaleAnim;
};
