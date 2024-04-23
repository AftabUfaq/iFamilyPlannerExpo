import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import UserList from './UserList';
import PickColor from "./PickColor";
import ScreenSaver from "./ScreenSaver";
import {IUser} from "../../dbConnection/localData/manageData";

interface iSettingProps {
  systemColor: string;
  users:IUser[]
}
export default function Setting(props:iSettingProps) {
  const [selectedItem, setSelectedItem] = useState(0);

  function menuItems() {
    switch (selectedItem) {
      case 1:
        return <UserList setSetting={setSelectedItem} systemColor={props.systemColor} users={props.users} />;
      case 2:
        return <ScreenSaver  systemColor={props.systemColor} setSelectedItem={setSelectedItem}/>

      case 3:
        return <PickColor setSelectedItem={setSelectedItem} systemColor={props.systemColor}></PickColor>

      case 0:
        return (
            <View className={" flex flex-row justify-center items-center mt-[300] space-x-20"}>
              <TouchableOpacity style={styles.menuItem} onPress={() => setSelectedItem(1)}>
                <Icon name="account-circle" size={200} color="gray" />
                <Text className={"text-center text-2xl"}>Tilføj eller rediger bruger</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem} onPress={() => setSelectedItem(2)}>
                <Icon name="image" size={200} color="gray" />
                <Text className={"text-center text-2xl"}>Indstil pauseskærm</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem} onPress={() => setSelectedItem(3)}>
                <Icon name="eye" size={200} color="gray" />
                <Text className={"text-center text-2xl"}>Vælg farver</Text>
              </TouchableOpacity>
            </View>
        );
      default:
        return null;
    }
  }

  return <View style={styles.container}>{menuItems()}</View>;
}

const styles = StyleSheet.create({
  container: {
    flexDirection:"row",
    width: '100%',
    height: '100%',
    justifyContent:"center",
  },
  menuContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,


  },
  menuItem: {
    alignItems: 'center',
    marginHorizontal: 20,
  },
  menuText: {
    fontSize: 18,
    textAlign: 'center',

  },
});
