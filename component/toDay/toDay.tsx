import { Image, Text, View } from "react-native";
import moment from "moment";
import React, { useEffect, useState } from "react";

import AnimateNumber from 'react-native-animate-number'
import Schedule from "./Schedule";
import ChooseFamilySchema from "./ChooseFamilySchema";

import ToDoList from "./TodoListe";
import DailySchedule from "./DailySchedule";
import { appState, ICalendarEvents, IUser, TodoEvent } from "../../dbConnection/localData/manageData";

interface toDayProps {
    systemColor: string


}

export default function ToDay(props: toDayProps) {
    const [users, setUsers] = useState<IUser[]>([])
    const [eventPoints, setPoints] = useState<number>(0)
    const [currentTime, setCurrentTime] = useState(new Date());
    const [modalOpen, setModalOpen] = useState<boolean>(false)
    const [todoEvents, setTodoEvents] = useState<TodoEvent[]>([])
    const [calendarEvents, setCalendarEvents] = useState<ICalendarEvents[]>([])





    useEffect(() => {
        const fetchEventData = async () => {
            try {


                const todoEvents = appState.todoEvents.get();
                setTodoEvents(todoEvents);

                const users = appState.users.get();
                setUsers(users);

                setCalendarEvents(appState.calendarEvents.get());

                let totalPoints = 0;
                const today = new Date().setHours(0, 0, 0, 0); // Adjust the today date once
                todoEvents.forEach((event) => {
                    const eventDate = new Date(event.eventDoneDate).setHours(0, 0, 0, 0);
                    if (event.eventDone && eventDate === today) {
                        // Convert event.eventPoints to a number using parseInt and ensure to provide the radix
                        totalPoints += parseInt(event.eventPoints, 10);
                    }
                });
                setPoints(totalPoints);
            } catch (error) {
                console.error("Error fetching event data:", error);
                // Implement user-facing error handling here
            }
        };

        fetchEventData();
    }, []);

    useEffect(() => {
        // Set up an interval to update the state every second
        const intervalId = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        // Clear the interval on component unmount
        return () => clearInterval(intervalId);
    }, []);


    function mealDay(day) {

        switch (day) {

            case 0:
                return "Søn"

            case 1:
                return "Man"

            case 2:
                return "Tir"

            case 3:
                return "Ons"

            case 4:
                return "Tor"

            case 5:
                return "Fre"
            case 6:
                return "Lør"

        }

    }


    return (
        <View>
            <View className={"flex flex-col"}>
                <ChooseFamilySchema setOpen={setModalOpen} showModal={modalOpen} users={users}></ChooseFamilySchema>
                <View className={"flex flex-row mt-10 border-b border-b-gray-200 justify-evenly space-x-[900]"}>
                    <Text style={{ color: props.systemColor }} className={"text-3xl ml-2"}>{moment(currentTime).format('dddd DD. MMMM. YYYY').toUpperCase()}</Text>
                    <Text style={{ color: props.systemColor }} className={"text-3xl ml-10"}>{moment(currentTime).format('LT')}</Text>

                </View>


                <View className={"flex flex-row "}>

                    <View className={" flex flex-col  ml-[102] mt-4 w-[450] "}>

                        <View>
                            <Text className={"text-2xl font-bold"}>Points samlet i dag </Text>


                        </View>

                        <View className={"w-80 flex flex-row justify-between rounded-xl w-[400]  "} style={{ backgroundColor: props.systemColor }}>
                            <Image className={"h-10 w-10"} source={require("../../assets/starPng.png")}></Image>

                            <View className={"w-20 h-20 justify-center items-center flex"}>


                                <AnimateNumber className="w-52 text-center text-2xl ml-10" value={eventPoints} formatter={(val) => {
                                    return parseFloat(val).toFixed(0) + " POINTS"
                                }} />

                            </View>

                            <View className={"w-20 h-20"}>

                                <Image className={"h-10 w-10 ml-10 mt-10"} source={require("../../assets/starPng.png")}></Image>
                            </View>







                        </View>
                        <View className={"flex flex-row space-x-4 w-1/3"}>
                            <View className={"flex flex-col  mt-2"}>
                                <View>
                                    <Text className={"text-2xl ml-4"}>Måltidsplan for idag</Text>


                                </View>
                                {appState.mealPlan.get().map((meal, index) =>
                                    <View className={""} key={`${index}`} >
                                        {mealDay(new Date().getDay()) === meal.day ?
                                            <View className={"flex flex-col space-y-2"}>
                                                <View className={"flex flex-row bg-gray-200  w-[400]  p-3 rounded-2xl  "}>

                                                    <Text className={"font-semibold"}>MORGENMAD</Text>
                                                    <Text className=" ml-10" numberOfLines={3} multiline={true}
                                                        ellipsizeMode='clip'>
                                                        {meal.breakfast}
                                                    </Text>

                                                </View>
                                                <View className={"flex flex-row bg-gray-200   w-[400]  p-3 rounded-2xl  "}>

                                                    <Text className={"font-semibold"}>Frokost</Text>
                                                    <Text className=" ml-20" numberOfLines={3} multiline={true}
                                                        ellipsizeMode='clip'>

                                                        {meal.lunch}
                                                    </Text>

                                                </View>
                                                <View className={"flex flex-row bg-gray-200  w-[400]  p-3 rounded-2xl  "}>

                                                    <Text className={"font-semibold"}>Aftensmad</Text>
                                                    <Text className=" ml-14 text-center " numberOfLines={3} multiline={true}
                                                        ellipsizeMode='clip'>
                                                        {meal.dinner}
                                                    </Text>

                                                </View>


                                            </View>
                                            : null
                                        }

                                    </View>
                                )}
                            </View>



                        </View>
                        <View className={"mt-3 w-[810] h-[900] "}>
                            <Text>Ugens skema</Text>


                            <Schedule users={users} setOpenModal={setModalOpen} systemColor={props.systemColor}></Schedule>




                        </View>

                    </View>
                    <View className={"flex flex-col mt-5"}>
                        <View>
                            <Text className={"text-2xl font-bold ml-2"}>TODO I DAG</Text>
                        </View>


                        <View className={"border w-[350] ] mt-2 flex flex-col rounded-xl"} style={{ borderColor: props.systemColor, shadowColor: props.systemColor, shadowRadius: 40 }}>
                            <ToDoList events={todoEvents} systemColor={props.systemColor} users={users}></ToDoList>


                        </View>
                    </View>
                    <View>

                        <View className={"mt-5"}>
                            <Text className="text-2xl font-bold text-center ">AKTIVITETER I DAG</Text>

                        </View>
                        <View className={" ml-10 h-[700] w-[400]"}>

                            <DailySchedule events={calendarEvents}></DailySchedule>
                        </View>
                    </View>
                </View>

            </View>
        </View>)





}