import React, {useEffect} from 'react';
import {View, Text, ScrollView, Image, Pressable, TextInput} from 'react-native';
import 'nativewind';
import { IUserDB } from "../../interfeces/IUser"; // Make sure the path to interfaces is correct
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {ItoDayUser} from "../../interfeces/ToDayInterface";
import {appState} from "../../dbConnection/localData/manageData";

interface IScheduleProps {
    users: ItoDayUser[];
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
    systemColor:string
}

export default function Schedule(props: IScheduleProps) {
       const weeklySchedule =  appState.weeklySchedule.get()
    // Calculate the flex value based on the number of users
    // Assuming the TIME column takes up the space of 1 user
    const userFlexValue = 1 / (props.users?.length + 1); // +1 for the TIME column

    useEffect(() => {
        for (let i = 0; i <weeklySchedule.users?.length ; i++) {
            console.log(weeklySchedule.users[i].listOfTasks?.length)
            if (weeklySchedule.users[i].listOfTasks?.length ==0){

                for (let j = 0; j <weeklySchedule.times?.length ; j++) {
                    weeklySchedule.users[i].listOfTasks.push("Fri")
                }
            }
        }
        appState.weeklySchedule.set(weeklySchedule)
    }, []);


    function textChange(user,text,index){
        user.listOfTasks[index] = text


    }

    return (
        <Pressable
            onLongPress={() => props.setOpenModal(true)}
            delayLongPress={500}
            className={weeklySchedule.users?.length> 0 ? " rounded-xl m-2 w-full border h-[400]" :""}
            style={{borderColor:props.systemColor, borderStyle:"solid"}}>

            {weeklySchedule.users?.length > 0 ?
            <ScrollView horizontal className="flex-row">
                {/* TIME column */}
                <View className={`flex-${userFlexValue}  p-4 h-full border-r border-gray-300`}>
                    <Text className="text-center font-bold mb-1">TID</Text>
                   <View className={"mt-[80] space-y-1"}>
                       {weeklySchedule.times.map((time, index) => (
                           <Text key={index} className="text-center w-full h-9 ">{time}</Text>
                       ))}


                   </View>

                </View>

                {/* User columns */}
                {weeklySchedule.users.map((user, index) => (
                    <View key={`${user.userId}${index}`} className={`flex-${userFlexValue} items-center  border-gray-300 w-44 h-full`}>
                        <Image className="w-[100] h-[100] rounded-full mb-2 " source={{ uri: user.userImage }} />
                        {user.listOfTasks.map((time, timeIndex) => (
                            <TextInput onChangeText={(text)=> textChange(user,text,timeIndex)} style={{backgroundColor:user.userColor+"33"}} key={timeIndex} placeholder={time} className="text-center w-full h-[50]"></TextInput>

                        ))}
                    </View>
                ))}
            </ScrollView>
            :
            <Icon name="plus-circle" size={100} onPress={()=>props.setOpenModal(true)} className="absolute bottom-0 right-0 m-2" color="gray" />
            }
            </Pressable>
    );
}
