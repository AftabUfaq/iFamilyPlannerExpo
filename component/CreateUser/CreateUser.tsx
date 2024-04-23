import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Using MaterialCommunityIcons as a replacement for HeroIcons
import ChooseAvatarModal from './ChooseAvatarModal';
import { Image } from 'expo-image';
import DateTimePicker from "@react-native-community/datetimepicker";
import {appState, IUser} from '../../dbConnection/localData/manageData';
import uuid from 'react-native-uuid';

interface ICreateUserProps {
  setCreateNewUser: React.Dispatch<React.SetStateAction<boolean>>;
  users:IUser[]

}

const CreateUser: React.FC<ICreateUserProps> = (props) => {
  const defaultImage = require('../../assets/avatars/defaultImage.png');
  const [selectedColor, setSelectedColor] = useState('#00CFE8');
  const [isOpen, setIsOpen] = useState(false);
  const [imageString, setImageString] = useState<any>(defaultImage);
  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const colors = ['#28C76F', '#00CFE8', '#FC4E4E', '#FF9F43', '#FDA4FF', '#7367F0'];
  const [dateOfBirthStatus, setDateOfBirthStatus] = useState(false);
  const [favoriteFood, setFavoriteFood] = useState("");


  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
  };

  useEffect(() => {
  }, [imageString]);

  const submitData = () => {

   if(__DEV__){


   }
   if (name=="" ){
     Alert.alert('Indtast venligst navn');

   }

   else if (imageString === defaultImage) {
      Alert.alert('Vælg en avatar ved at klikke under billedet');

    } else {
      appState.get().users.push({
        id: uuid.v4().toString(),
        name: name,
        color: selectedColor,
        avatarString: imageString,
        birthDay: dateOfBirth,
        favoriteFood: favoriteFood,
        weeklyTotalPoints: 0,
        todoEvents: [],
        calendarEvents: [],

      })
     props.setCreateNewUser(false)

    }

  };


  return (
      <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "android" ? "height" : "padding"}
          enabled
      >
        <ScrollView>
        {isOpen ? (
            <ChooseAvatarModal setOpen={setIsOpen} isOpen={isOpen} setImage={setImageString}  users={props.users}/>
        ) : (
            <View>
              <View className={" flex- flex-row mt-10 ml-5 justify items-center space-x-2"}>
                <TouchableOpacity onPress={() => props.setCreateNewUser(false)}>
                  <Icon name="chevron-left" size={56} style={styles.icon} />
                </TouchableOpacity>
                <Text className={"text-center text-2xl"}>Tilføj bruger</Text>
              </View>

              <View  className={"flex flex-row justify-center items-center mt-36  space-x-10"}>
                <View className={"flex-col  "}>
                  <Image source={imageString} className={"w-52 h-52 "} />

                </View>
                <View className={"  flex-col w-[1/3] space-y-3"}>
                  <View className={"flex flex-row "}>
                    <Text style={{color:"#5b5769"}} className={"text-xl"}>Navn</Text>
                    <TextInput
                        className={"w-52 rounded-xl p-3 font-bold h-10 ml-[125]  "}
                        style={{backgroundColor:"#f0f0f0"}}
                        value={name}
                        onChangeText={setName}
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

                          value={dateOfBirth.toLocaleDateString()} // You can format the date as you like
                          placeholderTextColor="gray"
                      />


                    </TouchableOpacity>


                    {dateOfBirthStatus && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={dateOfBirth}
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

                  <View className={"flex flex-row"}>
                    <Text style={{color:"#5b5769"}} className={"text-xl text-center  "}>Vælg farve</Text>
                    <View className={" flex flex-row ml-[70]"}>
                      {colors.map((color, index) => (
                          <TouchableOpacity
                              key={`${index}`}

                              style={[{height:30, width:30},styles.colorOption, { backgroundColor: color }, selectedColor === color && styles.selectedColor]}
                              onPress={() => handleColorSelect(color)}
                          />
                      ))}
                    </View>
                  </View>

                </View>
              </View>
              <View className={"flex flex-row  justify-center  mt-2  "}>
                <View>
                  <TouchableOpacity style={{backgroundColor:"#f0f0f0"}}  className={" rounded-xl p-1 ml-14  h-10 " } onPress={() => setIsOpen(true)}>
                    <Text style={{color:"#5b5769"}} className={"text-white text-center text-lg"}>Vælg avatar</Text>
                  </TouchableOpacity>

                </View>
                <View>
                  <TouchableOpacity className={"bg-green-600 w-96 rounded-xl p-1 ml-20  h-10 justify-center items-center"} onPress={submitData}>
                    <Text className={"text-white text-center text-lg"}>Opret bruger</Text>
                  </TouchableOpacity>

                </View>

              </View>

            </View>
        )}
        </ScrollView>
      </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginLeft: 10,
  },
  icon: {
    backgroundColor: '#E5E7EB',
    borderRadius: 28,
  },
  headerTitle: {
    fontSize: 24,
    marginLeft: 10,
  },
  form: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginTop: 52,
  },
  avatarSection: {
    alignItems: 'center',
  },
  avatar: {
    width: 192,
    height: 192,
    borderRadius: 96,
  },
  chooseAvatarButton: {
    backgroundColor: '#E5E7EB',
    padding: 10,
    borderRadius: 18,
    marginTop: 10,
  },
  inputSection: {
    marginTop: 36,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 18,
    marginRight: 16,
  },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    width: 224,
    height: 40,
    padding: 10,
  },
  colorPickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 26,
  },
  colorPicker: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  colorOption: {
    width: 30,
    height: 30,

    marginHorizontal: 5,
  },
  selectedColor: {
    borderWidth: 2,
    borderColor: 'blue',
  },
  submitButton: {
    backgroundColor: '#10B981',
    padding: 12,
    borderRadius: 24,
    marginTop: 40,
    alignSelf: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
  // Add other styles as needed
});

export default CreateUser;
