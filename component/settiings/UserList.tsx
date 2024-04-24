import React, {useCallback, useState} from 'react'
import {ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import CreateUser from '../CreateUser/CreateUser'
import UpdateUser from '../CreateUser/UpdateUser'
import {Image} from 'expo-image';
import {MouseMemoirs_400Regular, useFonts} from '@expo-google-fonts/mouse-memoirs';
import {appState, IUser} from "../../dbConnection/localData/manageData";

interface CreateUserProps {
  setSetting: React.Dispatch<React.SetStateAction<number>>;
  systemColor:string;
  users:IUser[]

}

const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export default function UserList(props: CreateUserProps) {
  const [createNewUser, setCreateNewUser] = useState(false);
  const [updateUser, setUpdateUser] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectedUserIndex, setSelectedUserIndex] =useState<Number>(0)
  let [fontsLoaded] = useFonts({
    MouseMemoirs_400Regular,
  });

  const saveInput = useCallback(debounce((value) => {
    appState.assign({
      systemSettings: {
        ...appState.systemSettings.get(),
        familyName: value,
      }
    });
  }, 0), []); // Adjust debounce time (ms) as needed






  
  const familyName = appState.systemSettings.get().familyName
console.log(props.users);

  return (
      <View className={"w-full h-[671]"}>
        <ScrollView>
          {updateUser ? (
              <UpdateUser  selectedUser={props.users[selectedUserIndex]}   setUpdateUser={setUpdateUser}/>
          ) : createNewUser ? (
              <CreateUser setCreateNewUser={setCreateNewUser}   users={props.users}/>
          ) : (
              <View>
                <View className={"flex flex-row mt-10 justify items-center ml-10"}>
                  <TouchableOpacity onPress={() => props.setSetting(0)}>
                    <Icon name="chevron-left" size={40} style={styles.icon} />
                  </TouchableOpacity>
                  <Text style={styles.headerText}>Tilføj eller rediger bruger</Text>
                </View>

                <View className={"flex flex-col ml-10 mt-10"}>
                  <Text className={"text-lg"} style={{fontFamily: 'MouseMemoirs_400Regular', color:props.systemColor}}>Familens navn</Text >
                  <TextInput
                      style={{fontFamily: 'MouseMemoirs_400Regular'}}
                      value={familyName}
                      className={"bg-gray-200 w-80 text-3xl rounded-lg text-center h-16"}
                      placeholder={"Ingen familie navn"}
                      onChangeText={(text) => saveInput(text)} // Directly call saveInput with the debounced function
                  />



                </View>
                <View className={"flex flex-row  justify-center mt-20 space-x-16 "}>

                  {props.users.map((element,index) => (
                      <View key={index} className={"flex flex-col space-y-4"}>
                        <Image
                            style={styles.avatar}
                            source={{ uri: element.avatarString }}
                        />
                        <TouchableOpacity>
                          <Text style={{color:element.color}} className={"text-center text-xl"}>{element.name}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.editButton}
                            onPress={() => {
                              setSelectedUserIndex(index);
                              setUpdateUser(true);
                            }}
                        >
                          <Text className={"text-center text-xl mt-1"}>Rediger</Text>
                        </TouchableOpacity>
                      </View>
                  ))}
                  <View  className={"flex flex-col -mt-6 space-y-1 "}>
                    <TouchableOpacity onPress={() => setCreateNewUser(true)}>
                      <Icon name="plus-circle" size={200} color="gray" />
                    </TouchableOpacity>
                    <Text className={"text-center text-[#4B5563] text-xl"}>Ny bruger</Text>
                  </View>
                </View>
              </View>
          )}


        </ScrollView>


      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginLeft: 20,
  },
  headerText: {
    fontSize: 24,
    marginLeft: 10,
  },
  icon: {
    backgroundColor: '#E5E7EB', // Light gray background
    borderRadius: 20,

  },
  userList: {
    flexDirection: 'row',
    marginRight: 150,
    marginTop: 250,
    display:"flex",
    justifyContent: 'center',
    height: 820,
    maxHeight:200,
    marginLeft:10
  },
  userItem: {
    alignItems: 'center',
    marginHorizontal: 10,
    marginRight:40,
    backgroundColor:"blue",
    padding:1
  },
  avatar: {
    width: 160,
    height: 160,
    borderRadius: 40,

  },
  editButton: {
    backgroundColor: '#E5E7EB', // Light gray background
    paddingTop: 6,
    paddingHorizontal: 10,
    paddingBottom: 6,
    borderRadius: 30,
    marginTop:40,
    height :50,
    width:160
  },
  newUserItem: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  newUserText: {
    color: '#4B5563',
    paddingTop: 2,
    paddingHorizontal: 10,
    paddingBottom: 6,
    borderRadius: 30,
  },
});