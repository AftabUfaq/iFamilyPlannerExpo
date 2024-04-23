import React, { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import Checkbox from "expo-checkbox";
import moment from "moment";
import { iAddToCalendarTodo } from "../../dbConnection/interfaces";

interface iAddCalenderModal {
  setCalendarData: React.Dispatch<React.SetStateAction<iAddToCalendarTodo>>;
  calendarData: iAddToCalendarTodo;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setCalendarEventSubmit: React.Dispatch<React.SetStateAction<boolean>>;
  isCalendarSubmitted: boolean;
  title: string;
}
export default function AddToCalendarModal(props: iAddCalenderModal) {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [startDateStatus, setShowStartDate] = useState(false);
  const [endDateStatus, setShowEndDate] = useState(false);

  const [showStartClock, setShowStartClock] = useState(false);
  const [showEndClock, setShowEndClock] = useState(false);

  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [allDayIsChecked, setAllDayChecked] = useState(false);
  const [startDateString, setStartDateString] = useState("Start Dato");
  const [endDateString, setEndDateString] = useState("Slut dato");

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

  useEffect(() => {
    if (props.isCalendarSubmitted) {
      console.log("doing this");
      setStartDateString(moment(props.calendarData.start).format("LL"));
      setEndDateString(moment(props.calendarData.end).format("LL"));
      setStartDate(new Date(props.calendarData.start));
      setEndDate(new Date(props.calendarData.end));

      if (!allDayIsChecked) {
        setAllDayChecked(props.calendarData.isAllDay);
        setStartTime(new Date(props.calendarData.start));
        setEndTime(new Date(props.calendarData.end));
      }
    }
  }, []);

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
    const currentDate = selectedDate || startTime; // Use the current startTime as fallback
    setShowStartClock(false); // Hide the picker
    if (currentDate) {
      setStartTime(currentDate); // Update startTime

      // If startDate and endDate are the same, adjust endTime if it's before startTime
      if (
        startDate.toDateString() === endDate.toDateString() &&
        moment(endTime).isBefore(moment(currentDate))
      ) {
        // Option 1: Set endTime to be the same as startTime
        // setEndTime(currentDate);

        // Option 2: Set endTime to a default duration after startTime, e.g., 1 hour later
        const adjustedEndTime = new Date(currentDate);
        adjustedEndTime.setHours(adjustedEndTime.getHours() + 1); // Adjust based on your needs
        setEndTime(adjustedEndTime);
      }
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
    if (allDayIsChecked) {
      const startOfDay = new Date(startDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(endDate);
      endOfDay.setHours(0, 0, 0, 0);
      const event = {
        title: props.title,
        start: startOfDay,
        end: endOfDay,
        isAllDay: true,
      };

      props.setCalendarData(event);
      props.setCalendarEventSubmit(true);
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
        title: props.title,
        start: startDateTime,
        end: endDateTime,
        isAllDay: false,
      };
      props.setCalendarData(something);
      props.setCalendarEventSubmit(true);
      props.setOpenModal(false);
    }
  }

  return (
    <Modal
      transparent={true}
      visible={true}
      onRequestClose={() => props.setOpenModal(false)}
    >
      <TouchableWithoutFeedback onPress={() => props.setOpenModal(false)}>
        <View className="flex-1 justify-center items-center   ">
          <TouchableWithoutFeedback onPress={() => {}}>
            <View
              style={{ opacity: 0.94 }}
              className="w-[70%] h-[80%] bg-white  p-5  rounded-lg justify-center items-center"
            >
              <View
                className={
                  "flex flex-col  border-[#E5E5E6FF]  bg-transparent rounded-lg border-2  p-10 justify-center items-center h-full w-[70%] "
                }
              >
                <View className={"flex flex-col space-y-8 w-full"}>
                  <TextInput
                    className={
                      "border border-black w-full pl-2 rounded-lg h-12"
                    }
                    value={props.title}
                    placeholder={"Title"}
                    onChangeText={(text) => props.setTitle(text)}
                  />
                  <View className="flex-col rounded-lg w-full ">
                    <View className={"flex flex-row justify-between w-[100%] "}>
                      <View className={"flex w-[40%]   rounded-2xl "}>
                        <TouchableOpacity onPress={showStartDatepicker}>
                          <TextInput
                            editable={false} // To prevent manual editing
                            className={
                              "flex mx-2 text-black rounded-xl text-center border h-10 w-full "
                            }
                            placeholder="Dato"
                            value={startDateString} // You can format the date as you like
                            placeholderTextColor="gray"
                          />
                          <AntDesign
                            name="calendar"
                            size={24}
                            color="gray"
                            style={{ position: "absolute", right: -15, top: 7 }}
                          />
                        </TouchableOpacity>
                      </View>
                      <View className={"flex w-[40%]   rounded-2xl "}>
                        <TouchableOpacity
                          className="flex w-full runded-2xl "
                          onPress={showEndDatepicker}
                        >
                          <TextInput
                            editable={false} // To prevent manual editing
                            className="flex mx-2 text-black rounded-xl border text-center h-10"
                            placeholder="Dato"
                            value={endDateString} // You can format the date as you like
                            placeholderTextColor="gray"
                          />
                          <AntDesign
                            name="calendar"
                            size={24}
                            color="gray"
                            style={{ position: "absolute", right: 30, top: 7 }}
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
                          minimumDate={new Date()}
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
                        />
                      )}
                    </View>
                    <View
                      className={
                        "flex flex-row mt-2  space-x-2 ml-4 justify items-center"
                      }
                    >
                      <Checkbox
                        size
                        value={allDayIsChecked}
                        onValueChange={setAllDayChecked}
                      />
                      <Text className={"text-xl"}>Heldagsbegivenhed 2</Text>
                    </View>
                  </View>

                  {allDayIsChecked ? null : (
                    <View className={"flex flex-row space-x-[140]   "}>
                      <View className={" w-[40%] border rounded-xl "}>
                        <TouchableOpacity
                          className="flex flex-row  items-center space-x-0"
                          onPress={activeStartClock}
                        >
                          <TextInput
                            editable={false} // To prevent manual editing
                            className=" text-center  text-black h-10 text-center font-ligt-bold text-2xl w-[88%]  "
                            placeholder="Start tid"
                            value={
                              formatTime(startTime) === formatTime(new Date())
                                ? "Start tid"
                                : formatTime(startTime)
                            }
                            placeholderTextColor="gray"
                          />
                          <FontAwesome5
                            name="clock"
                            size={24}
                            color="gray"
                            className="absolute "
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

                      <View className={"w-[40%] border rounded-xl "}>
                        <TouchableOpacity
                          className="flex flex-row  items-center space-x-0"
                          onPress={activeStartClock}
                        >
                          <TextInput
                            editable={false} // To prevent manual editing
                            className=" text-center  text-black h-10 font-ligt-bold text-2xl w-[88%]  "
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
                            className="absolute "
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
                    <View className={"flex flex-col space-y-2"}>
                      {props.isCalendarSubmitted ? (
                        <TouchableHighlight
                          className={
                            "bg-[#00CAE7] h-10 justify-center items-center rounded-xl"
                          }
                          onPress={() => {
                            submitDate();
                          }}
                          underlayColor="#FFFFF"
                        >
                          <Text
                            className={
                              props.isCalendarSubmitted
                                ? "text-white"
                                : "text-black"
                            }
                          >
                            Updater
                          </Text>
                        </TouchableHighlight>
                      ) : null}
                      <TouchableHighlight
                        className={
                          props.isCalendarSubmitted
                            ? "bg-red-600 h-10 justify-center items-center rounded-xl"
                            : "bg-[#00CAE7] h-10 justify-center items-center rounded-xl"
                        }
                        onPress={() => {
                          if (props.isCalendarSubmitted) {
                            props.setCalendarEventSubmit(false);
                            props.setOpenModal(false);
                          } else {
                            submitDate();
                          }
                        }}
                        underlayColor="#FFFFF"
                      >
                        <Text
                          className={
                            props.isCalendarSubmitted
                              ? "text-white"
                              : "text-black"
                          }
                        >
                          {props.isCalendarSubmitted
                            ? "Fjern kalender event"
                            : "Gem"}
                        </Text>
                      </TouchableHighlight>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
