import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {AntDesign} from "@expo/vector-icons";
import {appState} from "../../dbConnection/localData/manageData";


interface iPickColorProps {
    systemColor: string;
//  events: ICalendarEvent;
    setSelectedItem:React.Dispatch<React.SetStateAction<number>>;
}
export default function PickColor(props:iPickColorProps) {
    const [pressed, setPressed] = useState(null);

    const handlePressIn = (color) => {
        setPressed(color);

        // Correctly update the systemColor
        // Update systemColor within systemSettings
        appState.assign({
            systemSettings: {
                ...appState.systemSettings.get(), // Spread existing settings to preserve other properties
                systemColor: color, // Update systemColor
            }
        });
        console.log("Color updated successfully")

    };


    const handlePressOut = () => {
        setPressed(null);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.header} onPress={()=>props.setSelectedItem(0)}>
                <AntDesign name="leftcircle" size={40} color="gray"  />
                <Text style={styles.headerText}>Vælg farver</Text>
            </TouchableOpacity>

            <View style={styles.buttonContainer}>
                {['#00cae7', '#ff871a', '#00c552', '#ff1936', '#6344f7', '#ff81ff'].map((color, index) => (
                    <TouchableOpacity
                        key={index}

                        onPressIn={() => handlePressIn(color)}
                        onPressOut={handlePressOut}
                    >
                        <View style={{backgroundColor:color}} className={props.systemColor ==color ?`w-36 h-36 border-[6px] border-blue-500`:"w-36 h-36"}>


                        </View>


                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 10,
        marginTop: 20,
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        flex: 1,
    },
    button: {
        width: 150,
        height: 150,
    },
    pressedButton: {
        borderWidth: 5,
        borderColor: '#1CA1F1', // The color of the border when a button is pressed
    },
});
