import React, {useEffect, useState} from 'react';
import { Image, Modal, Text, View } from "react-native";
import { Button } from "react-native-paper";
import {IUserDB} from "../../interfeces/IUser";
import {ICalendarEvents, IUser} from "../../dbConnection/localData/manageData";

interface IChooseMembersProps {
    showModal: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    events:ICalendarEvents[]
    userList:IUser[]
    setSelectedUsers:React.Dispatch<React.SetStateAction<IUser[]>>
    selectedUsers:IUser[]
    selectedEvent:ICalendarEvents
}

export default function ChooseMoreMembers(props:IChooseMembersProps) {
    const [userSelectionState, setUserSelectionState] = useState([]);

    useEffect(() => {
        // Initialize selection state for all users based on their participation in the event
        const initializeUserSelectionState = props.userList.map(user => ({
            ...user,
            // Check if this user is selected for the event
            isSelected: props.selectedUsers.some(selectedUser => selectedUser.id === user.id),
        }));
        setUserSelectionState(initializeUserSelectionState);
    }, [props.userList, props.selectedUsers]);

   
    
    const toggleUserSelection = (user) => {
        const isCurrentlySelected = userSelectionState.some(selectionState => selectionState.id === user.id && selectionState.isSelected);
        console.log(isCurrentlySelected , user.isSelected, "isCurrentlySelected");
        
        const updatedSelectionState = userSelectionState.map(selectionState => {
            if (selectionState.id === user.id) {
                return { ...selectionState, isSelected: !isCurrentlySelected };
            }
            return selectionState;
        });
       
        
        setUserSelectionState(updatedSelectionState);
        // // Correctly update the parent component's selectedUsers based on the new selection state
         const updatedSelectedUsersIds = updatedSelectionState.filter(state => state.isSelected).map(state => state.id);
      
         
         const updatedSelectedUsers = props.userList.filter(user => updatedSelectedUsersIds.includes(user.id));
        // console.log(updatedSelectedUsers);
        props.setSelectedUsers(updatedSelectedUsers);
    };

    const toggleUserSelection1 = (user) => {
        const isCurrentlySelected = userSelectionState.some(selectionState => selectionState.id === user.id && selectionState.isSelected);
        const updatedSelectionState = userSelectionState.map(selectionState => {
            if (selectionState.id === user.id) {
                return { ...selectionState, isSelected: !isCurrentlySelected };
            }
            return selectionState;
        });

        setUserSelectionState(updatedSelectionState);
        // Correctly update the parent component's selectedUsers based on the new selection state
        const updatedSelectedUsersIds = updatedSelectionState.filter(state => state.isSelected).map(state => state.id);
        const updatedSelectedUsers = props.userList.filter(user => updatedSelectedUsersIds.includes(user.id));
        props.setSelectedUsers(updatedSelectedUsers);
    };

    console.log(userSelectionState);
    
    return (
        <Modal
            animationType="slide"
            transparent={false}
            visible={props.showModal}
            onRequestClose={() => {
                props.setOpen(false);
            }}
        >
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 4 }}>
                <View style={{ margin: 4, backgroundColor: 'white', borderRadius: 10, padding: 10, shadowOpacity: 0.25, elevation: 5, width: '100%', maxWidth: 600 }}>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                        {userSelectionState.map((user, index) => { 
                            console.log(user.id);
                            
                            return (
                            <View key={index} style={{ alignItems: 'center', margin: 8 }}>
                                <Image
                                    style={{ width: 112, height: 112, borderRadius: 56 }}
                                    source={{ uri: user.avatarString }}
                                />
                                <Text style={{ color: user.color, marginTop: 4 }}>{user.name}</Text>
                                <Button
                                    mode="contained"
                                    onPress={() => toggleUserSelection(user)}
                                    style={{ marginTop: 8, backgroundColor: user.isSelected ? 'red' : 'blue' }}
                                >
                                    {user.isSelected ? 'Fjern' : 'Vælg'}
                                </Button>
                            </View>
                        )})}
                    </View>
                    <Button onPress={() => props.setOpen(false)} style={{ marginTop: 20, backgroundColor: 'red' }}>
                        Gem
                    </Button>
                </View>
            </View>
        </Modal>
    );
}