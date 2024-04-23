import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  StyleSheet,
  Modal,
  SafeAreaViewComponent,
  SafeAreaView,
  Alert,
  GestureResponderEvent,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AddToCalendarModal from "./AddToCalenderModal";

import ChooseMembers from "../Calendar/ChooseMembers";
import ChooseMembersCalender from "./ChooseMembersCalender";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Tooltip } from "react-native-paper";

import { saveTodoEvent } from "./manageTodoEvents/ManageTodos";
import { IUser, TodoEvent } from "../../dbConnection/localData/manageData";
import { iAddToCalendarTodo } from "../../dbConnection/interfaces";

interface ICreateTodoProps {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  user: IUser;
  users?: IUser[];
  showAllUsers: boolean;
  setUpdateState: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CreateTodoEvent(props: ICreateTodoProps) {
  const [tasks, setTasks] = useState([]);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openChooseMembers, setOpenChooseMembers] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [dataCalendar, setDataFromAdd2Calendar] =
    useState<iAddToCalendarTodo>(null);
  const [is_Collective, set_Is_Collective] = useState<boolean>(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [points, setPoints] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<IUser[]>([
    { ...props.user },
  ]);
  const addTask = () => setTasks([...tasks, ""]);
  const removeTask = (index) =>
    setTasks(tasks.filter((_, idx) => idx !== index));

  async function submitEvent(e) {
    e.preventDefault();
    if (points == "") {
      setPoints("0");
    }

    if (title.trim() === "") {
      Alert.alert("Title Missing", "Please enter a title.");
      return;
    }

    if (tasks.some((task) => task.trim() === "")) {
      Alert.alert("Empty Fields", "All tasks must be filled.");
      return;
    }

    const taskList = tasks.map((task) => ({ taskName: task, done: false }));
    const newEvent = { tasks: taskList };

    const userIds = selectedMembers.map((user) => user.id);

    saveTodoEvent({
      isCalendarEvent: isFormSubmitted,
      title,
      userIds: userIds,
      isCollaborative: is_Collective,
      allUsers: props.showAllUsers,
      tasks: taskList,
      eventDoneDate: null,
      eventPoints: points == "" ? "0" : points,
      calendarEvents: isFormSubmitted ? dataCalendar : null,
    });
    props.setOpen(false);
  }

  const submitButton = (color: string): object => ({
    backgroundColor: color,
    borderRadius: 20,
    padding: 10,
    marginTop: 10,
    color: "white",
    textAlign: "center",
  });

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

  const renderTaskRow = (task: string, index: number) => (
    <View key={index} style={styles.taskRow}>
      <TextInput
        style={styles.taskInput}
        placeholder="Underopgave"
        value={task}
        onChangeText={(text) => {
          const newTasks = [...tasks];
          newTasks[index] = text;
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

  const renderUserImages = () => {
    if (props.users && props.users?.length > 0 && props.showAllUsers) {
      return (
        <View className={"flex flex-row space-x-[-60]"}>
          {props.users.map((user, index) => (
            <Image
              key={index}
              source={{ uri: user.avatarString }}
              style={styles.avatar}
            />
          ))}
        </View>
      );
    }
    return (
      <View className={"flex flex-row space-x-[-70]"}>
        {selectedMembers.map((user, index) => (
          <Image
            key={index}
            source={{ uri: user.avatarString }}
            style={styles.avatar}
          />
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView
      style={
        openChooseMembers
          ? { marginTop: 20, backgroundColor: "#d3d3d3", flex: 1 }
          : { backgroundColor: "white", height: 1000 }
      }
    >
      {ChooseMembers ? (
        <ChooseMembersCalender
          setOpen={() => setOpenChooseMembers(false)}
          selectedUsers={selectedMembers}
          setSelectedUsers={setSelectedMembers}
          users={props.users}
          selectedUser={props.user}
          showModal={openChooseMembers}
        ></ChooseMembersCalender>
      ) : null}
      <ScrollView style={styles.container}>
        {openModal && (
          <View className={" justify-center items-center "}>
            <AddToCalendarModal
              setOpenModal={setOpenModal}
              title={title}
              setTitle={setTitle}
              setCalendarEventSubmit={setIsFormSubmitted}
              isCalendarSubmitted={isFormSubmitted}
              calendarData={dataCalendar}
              setCalendarData={setDataFromAdd2Calendar}
            />
          </View>
        )}
        <View style={styles.header}>
          <AntDesign
            name="leftcircle"
            size={28}
            color="black"
            onPress={() => props.setOpen(false)}
          />
          <Text style={styles.title}>Ny opgave</Text>
        </View>

        <View className={" flex justify-center mt-20 items-center"}>
          <View className={"flex flex-row justify items-center "}>
            {renderUserImages()}
            {props.showAllUsers ? null : (
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
            )}
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
                {tasks.map((task, index) => renderTaskRow(task, index))}
              </ScrollView>
            ) : (
              tasks.map((task, index) => renderTaskRow(task, index))
            )}
            <TouchableOpacity style={styles.addButton} onPress={addTask}>
              <MaterialCommunityIcons name="plus" size={14} />
              <Text>Tilføj underopgave</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={(e) => submitEvent(e)}>
              <Text style={submitButton(props.user.color)}>Færdig</Text>
            </TouchableOpacity>
            <View className={"flex flex-col mt-2 "}>
              <View className={"flex flex-row"}>
                <BouncyCheckbox
                  size={14}
                  style={{ margin: 0 }}
                  onPress={() => setOpenModal(true)}
                  isChecked={isFormSubmitted}
                  disableBuiltInState
                />
                <Text>Tilføj til kalender</Text>
              </View>
              {selectedMembers?.length > 1 ? (
                <Tooltip title="Opgave for to eller flere personer der udfører en opgave sammen">
                  <View className={"flex flex-row justify items-center"}>
                    <BouncyCheckbox
                      isChecked={is_Collective}
                      size={14}
                      style={{ margin: 0 }}
                      onPress={(isChecked: boolean) =>
                        set_Is_Collective(isChecked)
                      }
                    />
                    <Text>Fælles opgave</Text>
                    <AntDesign
                      style={{ marginLeft: 5 }}
                      name="exclamationcircleo"
                      size={14}
                      color="black"
                    />
                  </View>
                </Tooltip>
              ) : null}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

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
    marginTop: 20,
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
