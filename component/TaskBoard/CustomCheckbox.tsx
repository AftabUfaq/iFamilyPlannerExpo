import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Checkbox } from 'react-native-paper';

// Define the types for the component's props
type CustomCheckboxProps = {
    status: 'checked' | 'unchecked';
    onPress: () => void;
    color: string;
    keyString:string
};

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({ status, onPress, color,keyString }) => {
    return (
        <TouchableOpacity key={keyString} onPress={onPress} style={styles.container}>
            <View style={[styles.outerCircle, { borderColor: color }]}>
                {status === 'checked' && <View style={[styles.innerCircle, { backgroundColor: color }]} />}
            </View>
            {/* Invisible Checkbox component to handle the actual checking logic */}
            <Checkbox status={status} uncheckedColor="transparent" color="transparent" onPress={onPress} />
        </TouchableOpacity>
    );
};

// Stylesheet
const styles = StyleSheet.create({
    container: {
      height:35
    },
    outerCircle: {
        height: 23,
        width: 23,
        borderRadius: 20,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerCircle: {
        height: 15,
        width: 16,
        borderRadius: 10,
    },
});

export default CustomCheckbox;
