import {Image, Modal, Text, View} from "react-native";
import React from "react";
import {Button} from "react-native-paper";
import {ItoDayUser} from "../../interfeces/ToDayInterface";
import {appState, IUser} from "../../dbConnection/localData/manageData";

interface IChooseFamilySchemaProps {
    showModal: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    users: IUser[];



}

export default function ChooseFamilySchema(props: IChooseFamilySchemaProps) {
    const weeklySchedule =  appState.weeklySchedule.get()




    const toggleUserSelection = (user: ItoDayUser) => {
        if (weeklySchedule.users.some(selectedUser => selectedUser.userId === user.id)) {
            // User is already selected, remove them from the selection
            appState.weeklySchedule.get().users = appState.weeklySchedule.users.get().filter(selectedUser => selectedUser.userId !== user.id)

        } else {
            // User is not selected, add them to the selection
const weekUser = {userId: user.id, userImage: user.avatarString, userColor : user.color, listOfTasks: []}
            for (let j = 0; j <weeklySchedule.times?.length ; j++) {
                weekUser.listOfTasks.push("Fri")
            }
            appState.weeklySchedule.get().users.push(weekUser)
        }
    };



    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={props.showModal}
            onRequestClose={() => {
                props.setOpen(false);
            }}
        >
            {/* Overlay View */}
            <View className="flex flex-row mt-40 justify-center items-center  px-4 ">
                {/* Modal View */}
                <View className="m-4 bg-white rounded-lg p-10 shadow-lg flex flex-col">
                    <View className={"flex flex-row space-x-6"}>
                        {props.users.map((user, index) => (
                            <View key={`${index}`}  className={"flex flex-col space-y-2"}>
                                <Image className={"w-28 h-28"} source={{ uri: user.avatarString }} />
                                <Text style={{ color: user.color }} className={"text-center"}>{user.name}</Text>
                                 <Button
                                        textColor={"white"}
                                        className={weeklySchedule.users.some(selectedUser => selectedUser.userId === user.id) ? "border rounded-lg bg-red-600 text-white border-gray-300":"border rounded-lg bg-blue-600 text-white border-gray-300"}
                                        onPress={() => toggleUserSelection(user)}
                                    >
                                        {weeklySchedule.users.some(selectedUser => selectedUser.userId === user.id) ? 'Fjern' : 'Vælg'}
                                    </Button>

                            </View>
                        ))}


                    </View>
                    <View>

                        <Button className={"bg-green-600 mt-10"} onPress={()=>props.setOpen(false)}>Gem</Button>
                    </View>
                </View>
            </View>
        </Modal>
    );
}