import React from 'react';
import { View, Text, TouchableOpacity, FlatList,Modal } from 'react-native';
import dayjs from "dayjs";

interface iEventListModal {
    isVisible:boolean
    events:[]
    onClose:React.Dispatch<React.SetStateAction<boolean>>;


}

export default function EventModal (props:iEventListModal) {
    return (
        <Modal isVisible={props.isVisible} onBackdropPress={()=>props.onClose} style="m-0 justify-end bg-orange-500">
            <View style="bg-white p-5 rounded-t-3xl">
                <View style="flex-row justify-between items-center pb-3">
                    <Text style="text-xl font-bold">
                        {props.events[0] ? dayjs(props.events[0].start).format('D MMMM, YYYY') : ''}
                    </Text>
                    <TouchableOpacity onPress={()=>props.onClose} style="p-2 rounded-full">
                        <Text style="text-xl">✕</Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={props.events}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View className={`flex-row items-center p-3 border-l-4 border-${item.color}-500`}>
                            <Text style="flex-1 text-lg">{item.title}</Text>
                        </View>
                    )}
                />
            </View>
        </Modal>
    );
};

