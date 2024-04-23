import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import CreateTodoEvent from "./CreateTodoEvent"; // Ensure this is a React Native compatible component
import Event from "./elements/Event";
import EditTodoEvent from "./editEvent";
import {
  appState,
  ICalendarEvents,
  IUser,
  TodoEvent,
} from "../../dbConnection/localData/manageData";
import LottieView from "lottie-react-native";

interface taskbordProps {
  systemColor: string;
  users: IUser[];
  todoEvents: TodoEvent[];
}

export default function TaskBoard(props: taskbordProps) {
  const [showAllUsers, setShowAllUsers] = useState<boolean>(false);
  const [createNewEvent, SetCreateNewEvent] = useState(false);
  const [updateState, setUpdateState] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<TodoEvent>({
    allUsers: false,
    calendarEventId: "",
    collaborative: false,
    eventDone: false,
    eventDoneDate: undefined,
    eventPoints: "",
    id: "",
    isCalendarEvent: false,
    tasks: [],
    title: "",
  });
  const [openEditEvent, setEditEvent] = useState(false);
  const [user, setUser] = useState<IUser>({
    weeklyTotalPoints: 0,
    calendarEvents: [],
    todoEvents: [],
    id: "",
    avatarString: "",
    color: "",
    name: "",
    favoriteFood: "",
    birthDay: undefined,
  });

  const systemColor = appState.systemSettings.get().systemColor;

  function prePrepareNewEvent(user: IUser) {
    setUser(user);
    SetCreateNewEvent(true);
    setShowAllUsers(false);
  }

  function prePrepareNewEventAll() {
    setUser({
      weeklyTotalPoints: 0,
      calendarEvents: [],
      todoEvents: [],
      birthDay: new Date(),
      favoriteFood: "",
      id: "string",
      avatarString: "string",
      color: "gray",
      name: "All",
    });

    SetCreateNewEvent(true);
    setShowAllUsers(true);
  }

  function editEvent(eventId: number) {}

  function showView() {
    if (createNewEvent) {
      return (
        <CreateTodoEvent
          isOpen={createNewEvent}
          setOpen={SetCreateNewEvent}
          user={user}
          showAllUsers={showAllUsers}
          setUpdateState={setUpdateState}
          users={props.users}
        />
      );
    } else {
      return (
        <EditTodoEvent
          eventToEdit={selectedEvent}
          isOpen={openEditEvent}
          setOpen={setEditEvent}
          showAllUsers={selectedEvent.allUsers}
          users={props.users}
        ></EditTodoEvent>
      );
    }
  }

  return (
    <View className={"w-full h-[780]"}>
      <View className={"border-y-green-900 "}>
        {createNewEvent || openEditEvent ? (
          showView()
        ) : (
          <View className={"flex flex-row  mt-10 ml-20 "}>
            <View className={"flex flex-col   w-52 items-center "}>
              <View
                className={
                  " rounded-full ring-2 ring-white flex flex-row space-x-[-40px]"
                }
              >
                {props.users.map((user, index) => (
                  <View key={user.id + index}>
                    <Image
                      source={{ uri: user.avatarString }}
                      alt={`Avatar ${index + 1}`}
                      className=" rounded-full object-cover w-20 h-20  "
                    />
                  </View>
                ))}
              </View>
              <Text className={"text-center font-bold text-md text-[16px]"}>
                Alle
              </Text>
              <TouchableOpacity
                className={"justify-center items-center"}
                onPress={() => prePrepareNewEventAll()}
              >
                <View className={"flex flex-row items-center"}>
                  <Ionicons name="add-circle" size={42} color={"gray"} />
                  <Text>Ny opgave</Text>
                </View>
              </TouchableOpacity>
              <View
                className={"mt-3  justify-center items-center h-[1000] w-[400]"}
              >
                <ScrollView showsVerticalScrollIndicator={false}>
                  {props.todoEvents.map((todoEvent, index) =>
                    todoEvent.allUsers ? (
                      <Event
                        todoEvent={todoEvent}
                        isAllUser={todoEvent.allUsers}
                        key={`${todoEvent.id}${index}`}
                        setEditEvent={setEditEvent}
                        userColor={"gray"}
                        user={null}
                        setSelectedEvent={setSelectedEvent}
                      ></Event>
                    ) : null
                  )}
                </ScrollView>
              </View>
            </View>

            {props.users.map((user, index) => (
              <View
                key={`${user.id}${index}`}
                className={"space-x-4 ml-10"}
              >
                <View className={"flex flex-col items-center"}>
                  <Image
                    source={{ uri: user.avatarString }}
                    style={styles.avatar}
                  />
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "bold",
                      textAlign: "center",
                      color: user.color,
                    }}
                  >
                    {user.name}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.plusIcon}
                  onPress={() => prePrepareNewEvent(user)}
                >
                  <View style={styles.addEvent}>
                    <Ionicons
                      name="add-circle"
                      size={42}
                      color={user.color}
                      className=" rounded-full object-cover w-20 h-20  "
                    />
                    <Text style={{ marginTop: 10 }}>Ny opgave</Text>
                  </View>
                </TouchableOpacity>
                <View className={"h-[650]"}>
                  <ScrollView showsVerticalScrollIndicator={false}>
                    {user.todoEvents.map((eventId, eventIndex) =>
                      props.todoEvents.findIndex(
                        (todoEvent) => eventId == todoEvent.id
                      ) !== -1 ? (
                        <Event
                          todoEvent={
                            props.todoEvents[
                              props.todoEvents.findIndex(
                                (todoEvent) => eventId == todoEvent.id
                              )
                            ]
                          }
                          isAllUser={false}
                          setEditEvent={setEditEvent}
                          user={user}
                          userColor={user.color}
                          setSelectedEvent={setSelectedEvent}
                        ></Event>
                      ) : null
                    )}
                  </ScrollView>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  userList: {
    flexDirection: "row",

    marginLeft: 150,
    marginTop: 30,
  },
  userCard: {
    marginLeft: 80,
    textAlign: "center",
    // Style for each user card
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  eventCard: {
    paddingTop: 10,
    paddingLeft: 20,
    marginBottom: 15,

    width: 250,
    flexDirection: "column", // Sets flex direction to column
    borderColor: "#F1F1F2", // Sets border color
    borderWidth: 2, // Sets border width
    borderRadius: 20,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  progressBar: {
    marginRight: 15,
    // Style for progress bar
  },
  plusIcon: {
    alignSelf: "center", // Center the icon under the username
    marginVertical: 5, // Add some vertical space
  },
  addEvent: {
    flexDirection: "row",
    textAlign: "center",
    fontWeight: "bold",
  },
  taskRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 5,
  },
  roundCheckbox: {
    borderRadius: 10, // Adjust for desired roundness
    width: 25,
    height: 25,
    overflow: "hidden", // Ensures the checkbox doesn't overflow its container
    justifyContent: "center", // Centers the checkbox vertically
    alignItems: "center", // Centers the checkbox horizontally
  },
  // Add other styles as needed
  roundedBtn: {
    width: "50%",
    borderRadius: 20,
    borderWidth: 1,
  },
  progrssrow: {
    flexDirection: "row",
    marginLeft: 2,
    justifyContent: "space-between",
    marginRight: 14,
    marginTop: 10,
    alignItems: "center",
  },
  avatarContainer: {
    flexDirection: "row",
    marginLeft: -64, // Negative margin adjusted for React Native
  },
  avatarRing: {
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "white",
  },

  content: {
    width: 296, // Adjust width as needed
  },

  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    marginVertical: 4, // Add space between items
    paddingHorizontal: 8,
  },
  radio: {
    height: 40,
    width: 40,
  },
});
