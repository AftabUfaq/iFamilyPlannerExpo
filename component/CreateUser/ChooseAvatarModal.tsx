import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import {Asset} from "expo-asset";
import {IUser} from "../../dbConnection/localData/manageData";

interface IChooseAvatarProps {
    isOpen: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setImage: React.Dispatch<React.SetStateAction<string>>;
    users:IUser[]

}

const ChooseAvatarModal: React.FC<IChooseAvatarProps> = (props) => {
    const [availableAvatars, setAvailableAvatars] = useState<boolean[]>([]);

    const avatarMap = [
        require('../../assets/avatars/Avatar_1.png'),
        require('../../assets/avatars/Avatar_2.png'),
        require('../../assets/avatars/Avatar_3.png'),
        require('../../assets/avatars/Avatar_4.png'),
        require('../../assets/avatars/Avatar_5.png'),
        require('../../assets/avatars/Avatar_6.png'),
        require('../../assets/avatars/Avatar_9.png'),
        require('../../assets/avatars/Avatar_10.png'),
        require('../../assets/avatars/Avatar_12.png'),
    ];


    useEffect(() => {

        console.log(props.users)
    }, []); // Empty dependency array to run only on mount


    function setAvatar(index: number) {
       const avatar = avatarMap[index];
        const avatarUri:string = typeof avatar === 'string' ? avatar : Asset.fromModule(avatar).uri;

        props.setImage(avatarUri);
        props.setOpen(false);
    }

    return (
        <View className={"h-[800] w-full justify items-center mt-10 "}>
            <View className={"  flex flex-row justify-center items-center  h-full space-x-5"}>
                {avatarMap.map((avatar, index) => (
                    <TouchableOpacity
                        key={`${index}`}
                        onPress={() => {
                            if (!availableAvatars[index]) {
                                setAvatar(index);
                            }
                        }}
                    >
                        <Image
                            source={avatar}
                            className={availableAvatars[index] ? 'w-40 h-40 bg-blue-500 ' : ' w-40 h-40'}

                        />
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

export default ChooseAvatarModal;
