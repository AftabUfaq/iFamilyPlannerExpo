import React, {useEffect, useState} from "react";
import {FlatList, Modal, Pressable, StatusBar, Text, TouchableOpacity, View} from "react-native";
import moment from "moment";
import {deleteCalendarEvent} from "./logic/deleteCalendarEvent";
import {ICalendarEventBase} from "react-native-big-calendar";


interface IMoreLabelProps {
    events:ICalendarEventBase[];
    setSelectedEvent: React.Dispatch<React.SetStateAction<ICalendarEventBase>>;
    setShowOneEvent: React.Dispatch<React.SetStateAction<boolean>>;
    setMoreLabelPressed: React.Dispatch<React.SetStateAction<boolean>>;
    moreLabelPressed: boolean;
    systemColor :string
}
interface iStartAndEndDate{
    start : string
    end:string

}

export default function MoreLabelModal(props: IMoreLabelProps) {
    const closeModal = () => props.setMoreLabelPressed(false);
    const [showEventDate , setShowEventDate ] = useState<iStartAndEndDate>({start:"", end:""})
    useState()


    useEffect(() => {
        let earliestEvent = props.events[0];
        let latestEvent = props.events[0];

        props.events.forEach((event) => {
            if (moment(event.start).isBefore(moment(earliestEvent.start))) {
                earliestEvent = event;
            }
            if (event.end && moment(event.end).isAfter(moment(latestEvent.end || latestEvent.start))) {
                latestEvent = event;
            }
        });

        setShowEventDate({end: moment(earliestEvent.start).format("LL"), start: moment(latestEvent.end).format("LL")  }) ;



    }, []);


// Example usage:
// const longestBreak = calculateLongestDurationBetweenEvents(props.events);


function selectedEvent(evt){
    props.setMoreLabelPressed(false)
    props.setSelectedEvent(evt)
    props.setShowOneEvent(true)


}

function handleDeleteCalendar(item) {
    deleteCalendarEvent(item)
    props.setMoreLabelPressed(false)

}

    return (
        <>
            <StatusBar hidden={true} />

            <Modal
            visible={props.moreLabelPressed}
            transparent={true}
            onRequestClose={closeModal}
            presentationStyle="overFullScreen"
            animationType="slide"
            statusBarTranslucent={true}

            useNativeDriver={true}
        >
            <View  style={{opacity:0.9}} className="flex-1 justify-center items-center  bg-gray-600">
                <View className="w-1/2 bg-white rounded-lg p-5">
                    <View className="flex-row justify-between items-center pb-3">
                        <Text style={{color:props.systemColor}} className="text-2xl text-center font-bold">
                            {showEventDate.end} -
                            {showEventDate.start} +/-
                        </Text>
                        <TouchableOpacity onPress={closeModal} className="p-2 rounded-full">
                            <Text className="text-2xl">✕</Text>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={props.events}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <Pressable onPress={()=>selectedEvent(item)} onLongPress={()=>handleDeleteCalendar(item)}>
                                <View style={{ backgroundColor: item.color+33, borderLeftColor: item.color, borderLeftWidth: 10, shadowColor: "#FFFFFF"}} className={`flex-row items-center p-3 border-l-4 ${item.color} mb-2.5`}>
                                    <Text className="flex-1 text-lg">{item.title}</Text>
                                </View>
                            </Pressable>

                        )}
                    />
                </View>
            </View>
        </Modal>
        </>
    );
}
