import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import {ItoDayEvent} from "../../interfeces/ToDayInterface";
import { Ionicons } from '@expo/vector-icons';
import {IUser, TodoEvent} from "../../dbConnection/localData/manageData";
import { appState } from "../../dbConnection/localData/manageData";

interface itodoListprops {
    events : TodoEvent[]
    systemColor:string
    users :IUser[]

}

export default function ToDoList  (props :itodoListprops) {
    const [ toDayState, setToDayState ] = useState<ItoDayEvent[]>([])

    useEffect(() => {
       const itoDayEventList : ItoDayEvent[] = []

        for (let i = 0; i <props.events?.length ; i++) {
            for (let j = 0; j <props.users?.length; j++) {
                for (let k = 0; k <props.users[j].todoEvents?.length ; k++) {
                    if (props.users[j].todoEvents[k] == props.events[i].id){

                        const itoDayEvt : ItoDayEvent ={
                            color: props.users[j].color, eventDoneDate: props.events[i].eventDoneDate, id: props.events[i].id, isToDoEventDone: props.events[i].eventDone, points: parseInt(props.events[i].eventPoints,10), title: props.events[i].title
                        }

                        itoDayEventList.push(itoDayEvt)
                    }
                }
            }
        }
        for (let i = 0; i <props.events?.length ; i++) {

            if(props.events[i].allUsers){
                const itoDayEvt : ItoDayEvent ={
                    color: "#000000", eventDoneDate: props.events[i].eventDoneDate, id: props.events[i].id, isToDoEventDone: props.events[i].eventDone, points: parseInt(props.events[i].eventPoints,10), title: props.events[i].title
                }
                itoDayEventList.push(itoDayEvt)


            }

        }



            setToDayState(itoDayEventList);

    }, [props.events,props.users]);

    const TaskItem = ({ task, points, isChecked,userColor }) => {
        return (
            <View className={"flex flex-row ml-2 justify items-center "}>

                <View className={" justify items-center"}>
                    <Ionicons name={isChecked ? "checkbox" : "square-outline"} size={24} color={props.systemColor}  />


                </View>
                <View className={"flex flex-row ml-5 w-[260] space-x-[100] items-center border-b border-gray-400 "}>

                    <Text className={"flex-1  pb-2  pt-2"} style={{color:userColor}}>{task}</Text>

                    <Text className={"   text-base px-2 py-1 rounded"} > {task ==="" ? "" : points + " " + "points"}</Text>


                </View>


            </View>

        );
    };

    
    return (
        <View  className={"flex flex-col h-[250] pt-5 "}>
       
          <ScrollView>
            {toDayState.map((task,index) => (
                <TaskItem
                    key={index}
                    task={task.title}
                    points={task.points}
                    isChecked={task.points}
                    userColor ={task.color}
                />
            ))}
                <TaskItem
                  key={props.events?.length+3}
                  task={""}
                  points={0}
                  isChecked={false}
                  userColor ={""}
              />
              <TaskItem
                  key={props.events?.length+4}
                  task={""}
                  points={0}
                  isChecked={false}
                  userColor ={""}
              />
              <TaskItem
                  key={props.events?.length+5}
                  task={""}
                  points={0}
                  isChecked={false}
                  userColor ={""}
              />
              <TaskItem
                  key={props.events?.length+6}
                  task={""}
                  points={0}
                  isChecked={false}
                  userColor ={""}
              />

          </ScrollView>
        </View>
    );
};




