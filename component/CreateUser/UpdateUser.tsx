import React, {useState} from 'react';
import {Platform, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {Image} from "expo-image"
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // For ChevronLeftIcon replacement
import ChooseAvatarModal from './ChooseAvatarModal';
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import {appState, IUser} from "../../dbConnection/localData/manageData";
import {removeUserLocalState, updateUserInAppState} from "./manageUser"; // Adjust path as needed

interface IUpdateUserProps {
  setUpdateUser: React.Dispatch<React.SetStateAction<boolean>>;
  selectedUser: IUser | undefined;

}
const format = "MM/DD/YYYY";

function UpdateUser (props :IUpdateUserProps)  {
  const defaultImage = require('../../assets/avatars/defaultImage.png');

  const [selectedColor, setSelectedColor] = useState<string>(props.selectedUser.color);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [imageString, setImageString] = useState<string>(props.selectedUser.avatarString);
  const [name, setName] = useState<string>(props.selectedUser?.name ?? '');
  const colors = ['#28C76F', '#00CFE8', '#FC4E4E', '#FF9F43', '#FDA4FF', '#7367F0'];
  const [dateOfBirthStatus, setDateOfBirthStatus] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState(new Date(props.selectedUser.birthDay));
  const [favoriteFood, setFavoriteFood] = useState(props.selectedUser.favoriteFood);


  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
  };



  const submitData = () => {
    if (!props.selectedUser) return;

    const a = {
      id: props.selectedUser.id,
      name: name,
      color: selectedColor,
      avatarString: imageString,
      birthDay: dateOfBirth,
      favoriteFood: favoriteFood,
      weeklyTotalPoints: props.selectedUser.weeklyTotalPoints,
      todoEvents: props.selectedUser.todoEvents,
      calendarEvents: props.selectedUser.calendarEvents
    }

    updateUserInAppState(a)

     props.setUpdateUser(false)
    // Additional UI updates or notifications following the update
  };
  const removeUser = () => {
    if (props.selectedUser) {
      removeUserLocalState(props.selectedUser)
      props.setUpdateUser(false)

    }
  };

  return (
      <View>
        {isOpen ? (
            <ChooseAvatarModal setOpen={setIsOpen} isOpen={isOpen} setImage={setImageString} />
        ) : (
            <View>
              <View className={" mt-10 "}>
                <TouchableOpacity onPress={() => submitData()}>
                <View className={"flex flex-row items-center space-x-4"}>
                  <Icon name="chevron-left" size={56} style={{backgroundColor:"#e0e0e0", borderRadius:50, marginLeft:10}}/>
                  <Text className={"font-bold text-2xl"}>Rediger Bruger</Text>
                </View>
                </TouchableOpacity>
              </View>

              <View className={"flex flex-row  space-x-10 justify-center mt-36"}>
                <View className={"flex flex-  w-80 justify-center items-center"}>
                  <Image source={{ uri: imageString }} className={"w-52 h-52"} />

                </View>
                <View className={"flex-col  w-[500] space-y-10 mt-10"}>
                  <View  className={"flex flex-row justify items-center "}>
                    <Text style={{color:"#5b5769"}} className={"text-xl "}> Rediger navn</Text>
                    <TextInput
                        className={"w-52 rounded-xl p-3 font-bold ml-12"}
                        style={{backgroundColor:"#f0f0f0"}}
                        value={name}
                        onChangeText={setName}
                        placeholder="Navn"
                    />
                  </View>
                  <View className={"flex flex-row "}>
                    <Text style={{color:"#5b5769"}} className={"text-xl"}>Fødselsdag</Text>

                    <TouchableOpacity className={" flex-row"} onPress={()=>setDateOfBirthStatus(true)}>

                      <TextInput
                          editable={false} // To prevent manual editing
                          className={"w-52 rounded-xl p-3 font-bold h-10 ml-16 text-center  "}
                          placeholder="fødselsdag"
                          style={{backgroundColor:"#f0f0f0"}}

                          value={moment(new Date(dateOfBirth)).format("LL")} // You can format the date as you like
                          placeholderTextColor="black"
                      />


                    </TouchableOpacity>


                    {dateOfBirthStatus && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={new Date(dateOfBirth)}
                            mode="date"
                            is24Hour={true}
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={(evnet,date)=>
                            {
                              setDateOfBirthStatus(false)
                              setDateOfBirth(date)
                            }}

                        />
                    )}


                  </View>
                  <View className={"flex flex-row "}>
                    <Text style={{color:"#5b5769"}} className={"text-xl"}>Livsret</Text>
                    <TextInput
                        className={"w-52 rounded-xl p-3 font-bold h-10 ml-[110]  "}
                        style={{backgroundColor:"#f0f0f0"}}
                        value={favoriteFood}
                        onChangeText={setFavoriteFood}
                    />
                  </View>


                  <View className={"flex flex-row "}>
                    <Text style={{color:"#5b5769"}} className={" ml-1 text-xl font "}>Vælg farve</Text>
                    <View className={"flex flex-row ml-9"}>
                      {colors.map((color, index) => (
                          <TouchableOpacity
                              key={`${index}`}
                              style={[
                                styles.colorOption,
                                { backgroundColor: color },
                                selectedColor === color ? styles.selectedColor  : {borderWidth:2, borderColor: "#FFFFFF"}// Update this line
                              ]}
                              onPress={() => handleColorSelect(color)}
                          />
                      ))}
                    </View>
                  </View>

                </View>
              </View>

              <View className={"flex flex-row  justify-center space-x-44 mt-2  "}>
                <View>
                  <TouchableOpacity style={{backgroundColor:"#f0f0f0"}}  className={" rounded-xl p-1  h-10 justify-center items-center" } onPress={() => setIsOpen(true)}>
                    <Text style={{color:"#5b5769"}} className={"text-white text-center text-lg"}>Vælg avatar</Text>
                  </TouchableOpacity>

                </View>
                <View>
                  <TouchableOpacity className={"bg-red-600 w-96 rounded-xl p-1  h-10 justify-center items-center mt-5"} onPress={removeUser}>
                    <Text className={"text-white text-center text-lg"}>Slet bruger</Text>
                  </TouchableOpacity>

                </View>

              </View>
            </View>
        )}
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginTop:10
  },
  icon: {
    padding: 5,
    borderRadius: 30,
    backgroundColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    marginLeft: 10,
    fontWeight: 'bold',
  },
  form: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 20,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  chooseAvatarButton: {
    marginTop: 10,
    backgroundColor: '#e0e0e0',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  inputSection: {
    width: '80%',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  label: {
    fontSize: 18,
    width: '30%',
  },
  input: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    flex: 1,
    paddingHorizontal: 10,
    height: 40,
  },
  colorPickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  colorPicker: {
    flexDirection: 'row',
  },
  colorOption: {
    width: 30,
    height: 30,

    marginHorizontal: 5,
  },
  selectedColor: {
    borderWidth: 2,
    borderColor: '#005ce7',

  },
  submitButton: {
    backgroundColor: '#4caf50',
    padding: 12,
    borderRadius: 25,
    width: '50%',
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: '#f44336',
    padding: 12,
    borderRadius: 25,
    width: '50%',
    alignItems: 'center',
    marginTop: 10,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default UpdateUser;
