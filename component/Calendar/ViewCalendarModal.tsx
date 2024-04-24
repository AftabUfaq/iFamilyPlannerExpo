import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import "nativewind";

import { AntDesign, EvilIcons, FontAwesome5 } from "@expo/vector-icons";
import moment from "moment";
import DateTimePicker from "@react-native-community/datetimepicker";
import Checkbox from "expo-checkbox";

import ChoseMoreMembers from "./ChoseMoreMembers";
import {
  appState,
  ICalendarEvents,
  IUser,
} from "../../dbConnection/localData/manageData";
import { editCalendarEvent } from "./logic/manageCalendarEvent"; // Ensure NativeWind is imported to use the Tailwind classes

interface viewCalendarModalProps {
  selectedEvent: ICalendarEvents;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;

  events: ICalendarEvents[];
  userList: IUser[];
  systemColor: string;
}
const ViewCalendarModal = (props: viewCalendarModalProps) => {
  const [title, setTitle] = useState<string>(props.selectedEvent.title);
  const [startDate, setStartDate] = useState(props.selectedEvent.start);
  const [endDate, setEndDate] = useState(props.selectedEvent.end);
  const [startDateStatus, setShowStartDate] = useState(false);
  const [endDateStatus, setShowEndDate] = useState(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [showStartClock, setShowStartClock] = useState(false);
  const [showEndClock, setShowEndClock] = useState(false);
  const [startTime, setStartTime] = useState(
    new Date(props.selectedEvent.start)
  );
  const [endTime, setEndTime] = useState(new Date(props.selectedEvent.end));
  const [allDayIsChecked, setAllDayChecked] = useState(
    props.selectedEvent.isAllDay
  );
  const [startDateString, setStartDateString] = useState(
    moment(props.selectedEvent.start).format("LL")
  );
  const [endDateString, setEndDateString] = useState(
    moment(props.selectedEvent.end).format("LL")
  );
  const [details, setDetails] = useState<string>(
    props.selectedEvent.details != null ? props.selectedEvent.details : ""
  );
  const [chooseMember, setChooseMembers] = useState<boolean>(false);
  const [selectedUsers, setSelectedUsers] = useState<IUser[]>([]);
  const [addToDo, setAddToDo] = useState(false);

  useEffect(() => {
    // Filter userList to include only users associated with the selectedEvent
    const selectableUsers = props.userList.filter((user) =>
      user.calendarEvents.some((eventId) => props.selectedEvent.id == eventId)
    );

    setSelectedUsers(selectableUsers);

    const index = appState.todoEvents
      .get()
      .findIndex((todo) => todo.calendarEventId == props.selectedEvent.id);

    if (index != -1) {
      setAddToDo(true);
    }
  }, []);

  useEffect(() => {
   // console.log(addToDo);
  }, [addToDo]);

  const onChangeStartDate = (event, selectedDate) => {
    const currentDate = selectedDate || startDate; // Fallback to current date if no date is selected
    setShowStartDate(false); // This will hide the picker on both Android and iOS after selection
    if (currentDate) {
      setStartDate(currentDate); // Update the start date only if a selection was made
      setStartDateString(moment(currentDate).format("LL")); // Format date using moment

      // Check if the current end date is before the new start date
      if (moment(endDate).isBefore(moment(currentDate))) {
        setEndDate(currentDate); // Align the end date with the new start date
        setEndDateString(moment(currentDate).format("LL")); // Update the end date string to match
      }
    }
  };

  const onChangeEndDate = (event, selectedDate) => {
    const currentDate = selectedDate || endDate; // Use the current end date as fallback
    setShowEndDate(false); // This will hide the picker on both Android and iOS after selection

    // Ensure the selected date is not before the start date
    if (currentDate && !moment(currentDate).isBefore(moment(startDate))) {
      setEndDate(currentDate); // Update the end date only if a selection was made
      setEndDateString(moment(currentDate).format("LL")); // Format date using moment
    } else if (currentDate) {
      setEndDate(startDate);
      setEndDateString(moment(startDate).format("LL")); // Update the end date string to match
      Alert.alert("Invalid Date", "End date cannot be before the start date.");
    }
  };

  const showStartDatepicker = () => {
    setShowStartDate(true);
  };
  const showEndDatepicker = () => {
    setShowEndDate(true);
  };
  const activeStartClock = () => {
    setShowStartClock(true);
    setShowEndClock(false); // Ensure the end time picker is hidden
  };
  const activeEndClock = () => {
    setShowEndClock(true);
    setShowStartClock(false);
  };

  const formatTime = (date) => {
    if (!date) return "";

    let hours = date.getHours();
    let minutes = date.getMinutes();

    // Pad with zeros to get a double-digit format
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;

    return `${hours}:${minutes}`;
  };

  const onChangeStartClock = (event, selectedDate) => {
    const currentDate = selectedDate || startDate; // Fallback to current date if no date is selected
    setShowStartClock(false); // This will hide the picker on both Android and iOS after selection
    if (currentDate) {
      setStartTime(currentDate); // Update the date only if a selection was made
    }
  };

  const onChangeEndClock = (event, selectedDate) => {
    const currentDate = selectedDate || endTime; // Use the current endTime as fallback
    setShowEndClock(false); // Hide the picker
    if (currentDate) {
      // If startDate and endDate are the same, and currentDate is before startTime, don't update endTime
      if (
        startDate.toDateString() === endDate.toDateString() &&
        moment(currentDate).isBefore(moment(startTime))
      ) {
        // Notify user that endTime cannot be before startTime on the same day
        Alert.alert(
          "Ugyldig tid",
          "Slut tiden kan ikke være være før start tiden på samme dag."
        );
      } else {
        setEndTime(currentDate); // Update endTime as it's valid
      }
    }
  };

  function closeModal() {
    props.setOpenModal(false);
  }
  function submitDate() {
    if (title === "") {
      window.alert("Angiv title");
      return;
    }

    if (endDateString == "") {
      window.alert("Angiv slut Dato");
      return;
    }
    if (startDateString == "") {
      window.alert("Angiv start Dato");
      return;
    }

    const matched = props.events.filter(
      (evt) => evt.id === props.selectedEvent.id
    );

    console.log(matched?.length);

    sendData(true);
  }

  function sendData(option: boolean) {
    const userIdsList: string[] = [];
    console.log(allDayIsChecked, 'allDayIsChecked');
    
    selectedUsers.map((user) => userIdsList.push(user.id));
   // console.log(userIdsList);
    
   // return 
    if (allDayIsChecked) {
      const startOfDay = new Date(startDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(endDate);
      endOfDay.setHours(0, 0, 0, 0);
      const event = {
        id: props.selectedEvent.id,
        title: title,
        start: startOfDay,
        end: endOfDay,
        isAllDay: true,
        details: details.trim(),
        selected: userIdsList,
      };

      console.log(event, "EVENT");
      console.log(props.selectedEvent.isTodoEvent,"isTodoEventisTodoEvent");
      console.log(userIdsList,"userIdsList");
      console.log(props.selectedEvent ,"selectedEvent");
      console.log(addToDo,"addToDo");
      
      
  
      editCalendarEvent(
        event,
        props.selectedEvent.isTodoEvent,
        userIdsList,
        props.selectedEvent,
        addToDo
      );
     props.setOpenModal(false);
    } else {
      const startDateTime = new Date(startDate);
      startDateTime.setHours(
        startTime.getHours(),
        startTime.getMinutes(),
        0,
        0
      );

      const endDateTime = new Date(endDate);
      endDateTime.setHours(endTime.getHours(), endTime.getMinutes(), 0, 0);

      const something = {
        id: props.selectedEvent.id,
        title: title,
        start: startDateTime,
        end: endDateTime,
        isAllDay: false,
        details: details.trim(),
      };
      // editCalendarEvent(
      //   something,
      //   props.selectedEvent.isTodoEvent,
      //   userIdsList,
      //   props.selectedEvent,
      //   addToDo
      // );
      // props.setOpenModal(false);
    }
  }

  function renderImage() {
    if (props.selectedEvent.userId == null) {
      return (
        <View className={"flex flex-row ml-[-75] space-x-[-75]"}>
          {props.userList.map((user, index) => (
            <Image
              key={`${index}`}
              className="w-32 h-32 "
              source={{ uri: user.avatarString }}
            ></Image>
          ))}
        </View>
      );
    } else {
      return (
        <View className={"flex flex-row  space-x-[-75]"}>
          {selectedUsers.map((user, index) => (
            <Image
              key={`${index}`}
              className="w-32 h-32 "
              source={{ uri: user.avatarString }}
            ></Image>
          ))}
        </View>
      );
    }
  }

  function deleteCalEvent() {
     ///  deleteCalendarEventApi(props.selectedEvent.userId ===null ? null : props.selectedEvent.userId ,props.selectedEvent.id,true,props.selectedEvent.isTodoEvent,props.selectedEvent.todoEventId)
  }
  
  return (
    <Modal
      transparent={false}
      visible={true}
      style={{ backgroundColor: "#000" }}
      onRequestClose={() => props.setOpenModal(false)}
    >
      <TouchableWithoutFeedback
        style={{flex:1, backgroundColor: "#000" }}
        onPress={() => props.setOpenModal(false)}
      >
        <ScrollView style={{backgroundColor:"#fff"}}>
          {chooseMember ? (
            <ChoseMoreMembers
              showModal={chooseMember}
              setOpen={setChooseMembers}
              events={props.events}
              userList={props.userList}
              selectedEvent={props.selectedEvent}
              setSelectedUsers={setSelectedUsers}
              selectedUsers={selectedUsers}
            ></ChoseMoreMembers>
          ) : (
            <KeyboardAvoidingView keyboardVerticalOffset={0}>
              <View className="flex-1 justify-center items-center   ">
                <View className="w-[70%]   bg-white p-5  rounded-lg justify-center items-center">
                  <View
                    className={
                      "flex flex-col  border-[#E5E5E6FF]  bg-transparent rounded-lg border-2  p-10 h-full w-[70%] "
                    }
                  >
                    <View className={"ml-[250]"}>{renderImage()}</View>
                    <View className={"flex flex-col space-y-8 w-full mt-10"}>
                      <TextInput
                        className={
                          "border border-black w-full pl-5 rounded-lg h-12 text-black font-bold text-xl text-center "
                        }
                        value={title}
                        onChangeText={(text) => setTitle(text)}
                      />
                      <View className="flex-col  rounded-lg w-full ">
                        <View className={" flex flex-row   space-x-[90]"}>
                          <TouchableOpacity
                            className={"flex  flex-row  rounded-2xl"}
                            onPress={showStartDatepicker}
                          >
                            <TextInput
                              className={
                                "flex  text-black rounded-xl pl-5 border h-10 w-[300] text-center font-semibold "
                              }
                              editable={false} // To prevent manual editing
                              placeholder="Dato"
                              value={startDateString} // You can format the date as you like
                              placeholderTextColor="gray"
                            />
                            <AntDesign
                              name="calendar"
                              size={24}
                              color="gray"
                              style={{
                                position: "absolute",
                                right: 20,
                                top: 7,
                              }}
                            />
                          </TouchableOpacity>

                          <TouchableOpacity
                            className="flex w-[300] runded-2xl "
                            onPress={showEndDatepicker}
                          >
                            <TextInput
                              editable={false} // To prevent manual editing
                              className="flex mx-2 text-black rounded-xl border pl-5 h-10 text-center font-semibold"
                              placeholder="Dato"
                              value={endDateString} // You can format the date as you like
                              placeholderTextColor="gray"
                            />
                            <AntDesign
                              name="calendar"
                              size={24}
                              color="gray"
                              style={{
                                position: "absolute",
                                right: 20,
                                top: 7,
                              }}
                            />
                          </TouchableOpacity>
                        </View>

                        {startDateStatus && (
                          <DateTimePicker
                            testID="dateTimePicker"
                            value={startDate}
                            mode="date"
                            is24Hour={true}
                            display={
                              Platform.OS === "ios" ? "spinner" : "default"
                            }
                            onChange={onChangeStartDate}
                            textColor={props.systemColor}
                            accentColor={props.systemColor}
                          />
                        )}

                        {endDateStatus && (
                          <DateTimePicker
                            testID="dateTimePicker"
                            value={endDate}
                            mode="date"
                            is24Hour={true}
                            display={
                              Platform.OS === "ios" ? "spinner" : "default"
                            }
                            onChange={onChangeEndDate}
                            minimumDate={startDate}
                            accentColor={"#e81616"}
                          />
                        )}

                        <View className={"flex flex-row mt-2  space-x-2 ml-4"}>
                          <Checkbox
                            value={allDayIsChecked}
                            onValueChange={setAllDayChecked}
                          />
                          <Text className={""}>Heldagsbegivenhed 3</Text>
                        </View>
                      </View>

                      {allDayIsChecked ? null : (
                        <View className={"flex flex-row space-x-[120]"}>
                          <View className={"w-[40%] border rounded-xl"}>
                            <TouchableOpacity
                              className="flex flex-row w-[300]  items-center space-x-[170]"
                              onPress={activeStartClock}
                            >
                              <TextInput
                                editable={false} // To prevent manual editing
                                className=" pl-5   text-black h-10 font-semibold text-center  "
                                placeholder="Start tid"
                                value={
                                  formatTime(startTime) ===
                                  formatTime(new Date())
                                    ? "Start tid"
                                    : formatTime(startTime)
                                }
                                placeholderTextColor="gray"
                              />
                              <FontAwesome5
                                name="clock"
                                size={24}
                                color="gray"
                                className="relative "
                              />
                            </TouchableOpacity>
                            {showStartClock && (
                              <DateTimePicker
                                testID="dateTimePicker"
                                value={startTime}
                                mode="time"
                                is24Hour={true}
                                display={
                                  Platform.OS === "ios" ? "spinner" : "default"
                                }
                                onChange={onChangeStartClock}
                                minimumDate={startDate}
                              />
                            )}
                          </View>

                          <View className={"w-[40%]  border rounded-xl"}>
                            <TouchableOpacity
                              className="flex flex-row items-center space-x-[170]   "
                              onPress={activeEndClock}
                            >
                              <TextInput
                                editable={false} // To prevent manual editing
                                className=" text-center mx-2 text-black h-10 font-semibold "
                                placeholder="Start tid"
                                value={
                                  formatTime(endTime) === formatTime(new Date())
                                    ? "Slut tid"
                                    : formatTime(endTime)
                                }
                                placeholderTextColor="gray"
                                defaultValue={"Start tid"}
                              />
                              <FontAwesome5
                                name="clock"
                                size={24}
                                color="gray"
                                className="relative"
                              />
                            </TouchableOpacity>
                            {showEndClock && (
                              <DateTimePicker
                                testID="dateTimePicker"
                                value={endTime}
                                mode="time"
                                is24Hour={true}
                                display={
                                  Platform.OS === "ios" ? "spinner" : "default"
                                }
                                onChange={onChangeEndClock}
                              />
                            )}
                          </View>
                        </View>
                      )}

                      <View className={"flex flex-col"}>
                        <View>
                          <TextInput
                            style={{}}
                            className={
                              " border border-black rounded-2xl h-16 pl-2"
                            }
                            numberOfLines={4}
                            multiline={true}
                            placeholder={"Detailjer "}
                            textAlignVertical="top"
                            value={details}
                            onChangeText={(newText) => setDetails(newText)}
                          ></TextInput>
                        </View>
                      </View>
                      {props.selectedEvent.userId == null ? null : (
                        <View>
                          <TouchableOpacity
                            className={"flex flex-row space-x-1 -mt-6"}
                            onPress={() =>
                              props.selectedEvent.isTodoEvent
                                ? null
                                : setChooseMembers(true)
                            }
                          >
                            <EvilIcons name="plus" size={24} color="black" />
                            <Text>
                              {props.selectedEvent.isTodoEvent
                                ? "Brugere tilføjes via Todo"
                                : "Tilføj person"}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>

                    <TouchableWithoutFeedback
                      style={{ backgroundColor: props.selectedEvent.color }}
                      onPress={() =>
                        selectedUsers?.length == 0
                          ? deleteCalEvent()
                          : submitDate()
                      }
                    >
                      <View
                        style={
                          selectedUsers?.length != 0
                            ? { backgroundColor: props.systemColor }
                            : { backgroundColor: "red" }
                        }
                        className={"w-[650] h-10  justify-center rounded-2xl"}
                      >
                        <Text
                          className={
                            "text-center text-2xl font-semibold text-white"
                          }
                        >
                          {selectedUsers?.length == 0 ? "SLET" : " 223"}
                        </Text>
                      </View>
                    </TouchableWithoutFeedback>

                    <View className={"mt-2 flex flex-row space-x-2"}>
                      <Checkbox
                        value={addToDo}
                        onValueChange={
                          props.selectedEvent.isTodoEvent ? null : setAddToDo
                        }
                      ></Checkbox>
                      <Text>
                        {props.selectedEvent.isTodoEvent
                          ? "Tilføjet via todo"
                          : "Tilføj til todo"}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </KeyboardAvoidingView>
          )}
        </ScrollView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ViewCalendarModal;
