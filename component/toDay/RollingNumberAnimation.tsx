import React, { useState, useEffect } from 'react';
import { View, Text, Animated } from 'react-native';

const RollingNumberAnimation = ({ targetScore }) => {
    const [animatedValue] = useState(new Animated.Value(0));

    useEffect(() => {
        Animated.timing(animatedValue, {
            toValue: 1,
            duration: 2000, // Duration of the animation
            useNativeDriver: true, // Use native driver for better performance
        }).start();
    }, [targetScore]);

    const score = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, targetScore], // Dynamically change to the target score
    });

    return (
        <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            <Animated.Text style={{ fontSize: 24, fontWeight: 'bold' }}>
                {score.interpolate({
                    inputRange: [0, 1000],
                    outputRange: [0, 200].map(Math.floor), // Round down to avoid decimal points
                })}
            </Animated.Text>
        </View>
    );
};

export default RollingNumberAnimation;
