import React from 'react';
import {Image, Modal, Text, View} from "react-native";
import {Button} from "react-native-paper";
import {IUser} from "../../dbConnection/localData/manageData";

interface IChooseMembersProps {
    showModal: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    users: IUser[];
    setSelectedUsers: React.Dispatch<React.SetStateAction<IUser[]>>;
    selectedUsers: IUser[]
}

export default function ChooseMembers(props: IChooseMembersProps) {


    const toggleUserSelection = (user: IUser) => {
        if (props.selectedUsers.some(selectedUser => selectedUser.id === user.id)) {
            // User is already selected, remove them from the selection
            props.setSelectedUsers(props.selectedUsers.filter(selectedUser => selectedUser.id !== user.id));
        } else {
            // User is not selected, add them to the selection
            props.setSelectedUsers(prevState =>  [...prevState,user]);
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
            <View className="flex-1 justify-center items-center  px-4">
                {/* Modal View */}
                <View className="m-4 bg-white rounded-lg p-10 shadow-lg flex flex-col">
                    <View className={"flex flex-row space-x-6"}>
                        {props.users.map((user, index) => (
                            <View key={`${index}`}  className={"flex flex-col space-y-2"}>
                                <Image className={"w-28 h-28"} source={{ uri: user.avatarString }} />
                                <Text style={{ color: user.color }} className={"text-center"}>{user.name}</Text>
                                <Button
                                    textColor={"white"}
                                    className={props.selectedUsers.some(selectedUser => selectedUser.id === user.id) ? "border rounded-lg bg-red-600 text-white border-gray-300":"border rounded-lg bg-blue-600 text-white border-gray-300"}
                                    onPress={() => toggleUserSelection(user)}
                                >
                                    {props.selectedUsers.some(selectedUser => selectedUser.id === user.id) ? 'Fjern' : 'Vælg'}
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
