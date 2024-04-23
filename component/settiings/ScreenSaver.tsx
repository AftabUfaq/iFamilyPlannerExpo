import {Text, TouchableOpacity, View, FlatList, StyleSheet, Image, Pressable} from "react-native";

import {AntDesign} from "@expo/vector-icons";
import React, {useEffect, useState} from "react";
import {Select} from "antd";
import {Asset} from "expo-asset";
import {appState} from "../../dbConnection/localData/manageData";


interface iScreenSaverProps {
    systemColor:string
    setSelectedItem :React.Dispatch<React.SetStateAction<number>>;

}

interface iTimerOption{
    timer: number,
    title:string


}


export default function ScreenSaver(props:iScreenSaverProps){
    const options = [{ timer: 0,  title:'Aldrig'}, {timer: 60000, title:'Efter 1 minuts inaktivitet'}, {timer: 900000, title:'Efter 15 minuts inaktivitet'}];
    const [isOpen, setIsOpen] = useState(false);
    const toggleDropdown = () => setIsOpen(!isOpen);
    const [selectedOption, setSelectedOption] = useState<iTimerOption>(options[0]);
    const [currentScreenSaver, setCurrentScreenSaver] = useState<string>("")

    const selectOption = (option) => {
        setSelectedOption(option);
        setIsOpen(false);
        appState.assign({
            systemSettings: {
                ...appState.systemSettings.get(),
                SCREENSAVER_DELAY: option,
            }
        });
    };

    useEffect(() => {
        const systemSettings = appState.systemSettings.get()
                setCurrentScreenSaver(Asset.fromModule(systemSettings.screensaverImage).uri)
        setSelectedOption(systemSettings.SCREENSAVER_DELAY);



    }, []);

    const images = [
       require('../../assets/screenSavers/1.jpeg'),
       require('../../assets/screenSavers/2.jpeg'),
       require('../../assets/screenSavers/3.jpeg'),
       require('../../assets/screenSavers/4.jpeg'),
       require('../../assets/screenSavers/5.jpeg'),
        require('../../assets/screenSavers/6.jpeg'),
    ];


    function setScreenSaver(index: number) {
        const avatar = images[index];
        const imageUri:string = typeof avatar === 'string' ? avatar : Asset.fromModule(avatar).uri;
        setCurrentScreenSaver(imageUri)

        appState.assign({
            systemSettings: {
                ...appState.systemSettings.get(),
                screensaverImage: imageUri,
            }
        });

    }





    return(

        <View className={"w-full h-full"}>
            <View className={"mt-10"}>
                <TouchableOpacity className={"flex flex-row justify items-center space-x-4 ml-5"} onPress={()=>props.setSelectedItem(0)}>
                    <AntDesign name="leftcircle" size={40} color="gray"  />
                    <Text className={" font-bold text-xl"}>Indstil pauseskærm</Text>
                </TouchableOpacity>


            </View>

            <View className={" flex flex-row w-full mt-10 ml-32 space-x-10  "}>
                <View>
                <Text className={"text-gray-400 mt-20 text-xl"}>Vælg billede</Text>
                </View>

                <View style={{ width: '100%', height: '100%', flexDirection: 'row', flexWrap: 'wrap' }}>

                    {images.map((element, index) => (

                        <Pressable
                            key={index}
                            style={{ margin: 4, width: '25%' }} // Adjusting for 4 items per row, similar to w-1/4 and m-1
                            onPress={() => setScreenSaver(index)}
                        >
                            <Image
                                source={element} // Assuming element has a uri property
                                style={{
                                    height: 240, // Adjust height as necessary
                                    width: '100%', // Make image fill the container
                                    resizeMode: 'cover',
                                    borderWidth: 4,
                                    borderColor: currentScreenSaver === Asset.fromModule(element).uri ? props.systemColor : null, // Conditional border color
                                }}
                            />
                        </Pressable>
                    ))}
                </View>


            </View>
<View className={"flex flex-row space-x-10 justify items-center ml-40 mt-10"}>

    <View>
        <Text>Pauseskærm vises</Text>

    </View>

    <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={toggleDropdown}>
            <Text style={styles.selectedOption}>{selectedOption.title}</Text>
            <AntDesign name={isOpen ? 'up' : 'down'} size={16} color="black"/>
        </TouchableOpacity>
        {isOpen && (
            <View style={styles.optionsContainer}>
                {options.map((option, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.option}
                        onPress={() => selectOption(option)}>
                        <Text style={styles.text}>{option.title}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        )}
    </View>

</View>


        </View>

    )
}
const styles = StyleSheet.create({
    container: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#00BFFF',
        marginBottom: 8,
        width: '20%',
        alignSelf: 'center',
    },
    button: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 15,
        alignItems: 'center',
        backgroundColor: '#D1EFFF',
    },
    selectedOption: {
        fontSize: 16,
        color: 'black',
    },
    optionsContainer: {
        backgroundColor: '#FFFFFF',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    },
    option: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    text: {
        fontSize: 16,
        color: 'black',
    },
});
