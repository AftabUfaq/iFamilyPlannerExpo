import React, { useEffect, useState } from "react";
import {
  Alert,
  GestureResponderEvent,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ChooseMembers from "../Calendar/ChooseMembers";
import ChooseMembersCalender from "./ChooseMembersCalender";
import { Tooltip } from "react-native-paper";
import {
  appState,
  IUser,
  TodoEvent,
} from "../../dbConnection/localData/manageData";
import { updateTodoEvent } from "./manageTodoEvents/ManageTodos";
import AddToCalendarModal from "./AddToCalenderModal";
import { iAddToCalendarTodo } from "../../dbConnection/interfaces";

interface IEditTodoProps {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  eventToEdit: TodoEvent;
  users: IUser[];
  showAllUsers: boolean;
}

export default function EditTodoEvent(props: IEditTodoProps) {
  const [title, setTitle] = useState<string>(props.eventToEdit.title);
  const [tasks, setTasks] = useState<{ taskName: string; done: boolean }[]>(
    props.eventToEdit.tasks
  );
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [points, setPoints] = useState<string>(props.eventToEdit.eventPoints);
  const [selectedUsers, setSelectedUsers] = useState<IUser[]>([]);
  const [openChooseMembers, setOpenChooseMembers] = useState<boolean>(false);
  const [isCalendarSubmitted, setIsCalendarSubmitted] = useState(false);
  const [isCollective, set_Is_Collective] = useState<boolean>(
    props.eventToEdit.collaborative
  );
  const [dataCalendar, setDataFromAdd2Calendar] =
    useState<iAddToCalendarTodo>(null);

  useEffect(() => {
    const calendar = appState.calendarEvents
      .get()
      .find((evt) => evt.todoEventId == props.eventToEdit.id);

    if (calendar != undefined) {
      const getCalendarEvent: iAddToCalendarTodo = {
        end: calendar.end,
        isAllDay: calendar.isAllDay,
        start: calendar.start,
        title: props.eventToEdit.title,
      };

      setIsCalendarSubmitted(true);
      setDataFromAdd2Calendar(getCalendarEvent);
    } else {
      console.log("calendar not found");
    }
  }, []);

  const addTask = () => setTasks([...tasks, { taskName: "", done: false }]);
  const removeTask = (index: number) => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);
  };

  function filterNonNumbers(value: string) {
    let newText = "";
    let numbers = "0123456789";
    if (value?.length < 4) {
      for (let i = 0; i < value?.length; i++) {
        if (numbers.indexOf(value[i]) > -1) {
          newText = newText + value[i];
        }
      }
      setPoints(parseInt(newText) > 100 ? "100" : newText);
    }
  }

  useEffect(() => {
    if (props.eventToEdit.allUsers) {
      setSelectedUsers(props.users);
    } else {
      const usersToDisplay = props.users.filter((usr) =>
        usr.todoEvents.includes(props.eventToEdit.id)
      );
      setSelectedUsers(usersToDisplay);
    }
  }, []);

  const renderUserImages = () => {
    return (
      <View style={{ flexDirection: "row", marginLeft: -70 }}>
        {selectedUsers.map((user, index) => (
          <Image
            key={index}
            source={{ uri: user.avatarString }}
            style={[
              styles.avatar,
              { marginLeft: index > 0 ? -70 : 0 }, // Adjust for overlap; set to 0 for the first image
            ]}
          />
        ))}
      </View>
    );
  };

  const submitEvent = (e: GestureResponderEvent) => {
    e.preventDefault();

    if (title === "") {
      Alert.alert("Title missing", "Please provide a title.");
      return;
    }

    if (selectedUsers?.length < 1) {
      Alert.alert("bruger mangler", "Vælg brugere");
      return;
    }

    // Update the event with the new data (title and tasks) here.

    const userIds = selectedUsers.map((user) => user.id);

    updateTodoEvent(
      {
        id: props.eventToEdit.id,
        title: title,
        tasks: tasks,
        isCollaborative: selectedUsers?.length > 1 ? isCollective : false,
        eventPoints: points,
        allUsers: props.eventToEdit.allUsers,
        hasCalenderEvent: isCalendarSubmitted,
        calendarEventData: dataCalendar,
        calenderEventId: props.eventToEdit.calendarEventId,
      },
      userIds
    );

    props.setOpen(false);
  };

  const submitButton = (color: string): object => ({
    backgroundColor: color,
    borderRadius: 20,
    padding: 10,
    marginTop: 10,
    color: "white",
    textAlign: "center",
  });

  const renderTaskRow = (task: string, index: number) => (
    <View key={index} style={styles.taskRow}>
      <TextInput
        style={styles.taskInput}
        placeholder="Underopgave"
        value={task}
        onChangeText={(text) => {
          const newTasks = [...tasks];
          newTasks[index] = { taskName: text, done: false };
          setTasks(newTasks);
        }}
      />
      <MaterialCommunityIcons
        name="minus-circle"
        size={16}
        color={"red"}
        onPress={() => removeTask(index)}
      />
    </View>
  );

  return (
    <SafeAreaView>
      <ScrollView>
        {openModal && (
          <View className={" justify-center items-center "}>
            <AddToCalendarModal
              setOpenModal={setOpenModal}
              title={title}
              setTitle={setTitle}
              setCalendarEventSubmit={setIsCalendarSubmitted}
              isCalendarSubmitted={isCalendarSubmitted}
              calendarData={dataCalendar}
              setCalendarData={setDataFromAdd2Calendar}
            />
          </View>
        )}

        {ChooseMembers ? (
          <ChooseMembersCalender
            setOpen={() => setOpenChooseMembers(false)}
            selectedUsers={selectedUsers}
            setSelectedUsers={setSelectedUsers}
            users={props.users}
            selectedUser={null}
            showModal={openChooseMembers}
          ></ChooseMembersCalender>
        ) : null}

        <View style={styles.header}>
          <AntDesign
            name="leftcircle"
            size={28}
            color="black"
            onPress={() => props.setOpen(false)}
          />
          <Text style={styles.title}>Edit Event</Text>
        </View>

        <View className={" flex justify-center mt-44 items-center"}>
          <View className={"flex flex-row justify items-center bg-blue-500"}>
            {/* Render user images */}
            {/* Add the logic to display user images here */}
          </View>
          <View className={"flex flex-row justify items-center "}>
            {renderUserImages()}
            {props.eventToEdit.allUsers ||
            props.eventToEdit.isCalendarEvent !== true ? (
              <TouchableOpacity
                className={"flex flex-col"}
                onPress={() => setOpenChooseMembers(true)}
              >
                <Icon
                  name="plus-circle"
                  size={120}
                  style={{ margin: 0, padding: 0, marginTop: 30 }}
                  color="gray"
                />
                <Text className={"text-center"}>Tilføj bruger</Text>
              </TouchableOpacity>
            ) : null}
          </View>
          <View style={styles.inputBox}>
            <View className={"flex flex-col space-y-2"}>
              <TextInput
                style={styles.taskName}
                placeholder="Titel"
                value={title}
                onChangeText={setTitle}
              />
              <TextInput
                value={points.toString()}
                keyboardType={"numeric"}
                textContentType={"telephoneNumber"}
                style={styles.taskName}
                placeholder={"Antal points"}
                onChangeText={filterNonNumbers}
              ></TextInput>
            </View>

            {tasks?.length > 13 ? (
              <ScrollView style={{ maxHeight: 200 }}>
                {tasks.map((task, index) =>
                  renderTaskRow(task.taskName, index)
                )}
                {tasks.map((task, index) =>
                  renderTaskRow(task.taskName, index)
                )}
              </ScrollView>
            ) : (
              tasks.map((task, index) => renderTaskRow(task.taskName, index))
            )}
            <TouchableOpacity style={styles.addButton} onPress={addTask}>
              <MaterialCommunityIcons name="plus" size={14} />
              <Text>Tilføj underopgave</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={(e) => submitEvent(e)}>
              <Text style={submitButton("#09f1e1")}>Færdig</Text>
            </TouchableOpacity>

            {selectedUsers?.length > 1 ? (
              <Tooltip title="Opgave for to eller flere personer der udfører en opgave sammen">
                <View className={"flex flex-row justify items-center"}>
                  <BouncyCheckbox
                    isChecked={isCollective}
                    disabled={props.eventToEdit.calendarEventId !== null}
                    size={14}
                    style={{ margin: 0 }}
                    onPress={(isChecked: boolean) =>
                      set_Is_Collective(isChecked)
                    }
                  />
                  <Text>
                    {props.eventToEdit.isCalendarEvent !== true
                      ? "Tilføjet via kalender"
                      : "Fælles opgave"}
                  </Text>
                  <AntDesign
                    style={{ marginLeft: 5 }}
                    name="exclamationcircleo"
                    size={14}
                    color="black"
                  />
                </View>
              </Tooltip>
            ) : null}

            <View className={"flex flex-row mt-2"}>
              <BouncyCheckbox
                size={14}
                style={{ margin: 0 }}
                onPress={() => setOpenModal(true)}
                isChecked={isCalendarSubmitted}
                disableBuiltInState
                disabled={props.eventToEdit.isCalendarEvent == true}
              />
              <Text>
                {props.eventToEdit.isCalendarEvent !== true
                  ? "Tilføj til kalender"
                  : "Rediger via kalenderen"}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Define the IEvent interface according to your event data structure

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginLeft: 10,
  },
  title: {
    fontSize: 24,
    marginLeft: 10,
  },
  content: {
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    marginLeft: 380,
    marginTop: 120,
    borderRadius: 4,
    width: "50%",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 40,
    borderWidth: 2,
  },
  taskRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingLeft: 2,
  },
  taskInput: {
    flex: 1,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 10,
    padding: 5,
    margin: 8,
    paddingLeft: 20,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    marginLeft: 5,
  },

  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 6,
    marginTop: 4,
  },
  // Additional styles can be added as needed
  inputBox: {
    padding: 40,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    borderRadius: 20,
    overflow: "hidden",
    width: 400,
  },
  taskName: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "black",
    padding: 2,
    paddingHorizontal: 10,
  },
  addAssignment: {
    marginTop: 10,
  },
});
