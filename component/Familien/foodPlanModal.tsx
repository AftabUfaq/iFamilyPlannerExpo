import React from 'react';
import {Modal, View, Text, TextInput, TouchableWithoutFeedback, Button} from 'react-native';


interface ifoodPlanProps {
    isOpen : boolean
    setOpenModal:   React.Dispatch<React.SetStateAction<boolean>>;
    selectedMeal:{ day : string, meal:string}
    setData:React.Dispatch<React.SetStateAction<{ id: '', day: '', breakfast: '', lunch: '', dinner: '' }[]>>;
    data  :{ id: string, day: string, breakfast: string, lunch: string, dinner: string }[]
}





export default function FoodPlanModal(props : ifoodPlanProps) {
    const handleInputChange = (day, meal, text) => {
        const newData = props.data.map((item) => {
            if (item.day === day) {
                return { ...item, [meal]: text };
            }
            return item;
        });
        props.setData(newData);
    };

    function translate(meal:string){

        switch (meal){

            case "dinner":
                return "AftensMad"

            case "breakfast" :

                return "MorgenMad"

            case "lunch":
                return "Frokost"


        }
    }

    return (

        <Modal transparent={true} visible={true} animationType="slide">
            <TouchableWithoutFeedback onPress={() => props.setOpenModal(false)}>

            <View className="flex-1 justify-center items-center bg-opacity-50">
                <View className="m-4 bg-white p-6 rounded-lg shadow-xl">
                    <Text> Indtast Måltid for {translate(props.selectedMeal.meal)} {props.selectedMeal.day}dag</Text>
                    <TextInput  className="text-lg font-bold w-52 text-center bg-gray-200 rounded-xl"></TextInput>

                    <View className={"flex flex-row justify-between"}>
                        <Button title={"annullere"}></Button>

                        <Button title={"Gem"}></Button>


                    </View>
                </View>


            </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}
