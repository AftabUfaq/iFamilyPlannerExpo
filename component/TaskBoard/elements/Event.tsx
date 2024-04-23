import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Menu, ProgressBar } from 'react-native-paper';
import { Entypo } from "@expo/vector-icons";
import React, { useState } from "react";
import LottieView from 'lottie-react-native';
import CustomCheckbox from "../CustomCheckbox";

import { appState, ICalendarEvents, IUser, TodoEvent } from "../../../dbConnection/localData/manageData";
import { updateTodoEvent } from "../manageTodoEvents/ManageTodos";
import moment from "moment";


interface IEventProps {
    todoEvent: TodoEvent
    userColor: string
    setEditEvent: React.Dispatch<React.SetStateAction<boolean>>;
    user: IUser;
    setSelectedEvent: React.Dispatch<React.SetStateAction<TodoEvent>>

    isAllUser: boolean

}
export default function Event(props: IEventProps) {
    const [isDropdownVisible, setIsDropdownVisible] = React.useState(false);
    const [startFireWorks, setStartFireWorks] = useState(false)


    function tasksDone(event: TodoEvent): number {
        let tasksDone = 0;

        event.tasks.forEach((task) => {
            if (task.done) {
                tasksDone++;
            }
        });


        return tasksDone;
    }


    function dropDown() {

        return (<Menu
            visible={isDropdownVisible}
            onDismiss={() => setIsDropdownVisible(false)}
            anchor={
                <TouchableOpacity onPress={toggleDropdown}>
                    <Image
                        source={require("../../../assets/avatars/zenkin_ikon.jpg")}
                        style={{ width: 20, height: 20 }}
                    />
                </TouchableOpacity>
            }>
            <Menu.Item onPress={() => {
                props.setSelectedEvent(props.todoEvent)
                props.setEditEvent(true)
            }} title="Rediger" />
            <Menu.Item onPress={() => {
                deleteEventById()
            }} title="Slet" />


        </Menu>

        )
    }

    const toggleDropdown = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };


    function eventDone(done) {
        setStartFireWorks(!!done);
        const updatedEvent = {
            ...props.todoEvent,
            eventDone: done,
            eventDoneDate: done ? new Date() : null,
        };

        appState.todoEvents.set((prevEvents) =>
            prevEvents.map((e) => (e.id === props.todoEvent.id ? updatedEvent : e))
        );

        if (done) {
            if (!props.todoEvent.allUsers) {
                appState.users.set((prevUsers) =>
                    prevUsers.map((user) => {
                        // Check if the user has the event in their todoEvents
                        if (user.todoEvents.includes(props.todoEvent.id)) {
                            // Logic to calculate the points to be added
                            // This could be a fixed value or based on the event's properties
                            const pointsToAdd = props.todoEvent.eventPoints // Implement this function based on your logic

                            // Add points to the user's weeklyTotalPoints
                            return {
                                ...user,
                                weeklyTotalPoints: user.weeklyTotalPoints + parseInt(pointsToAdd, 10),
                            };
                        }
                        return user;
                    })
                );
            } else {
                appState.users.set((prevUsers) =>
                    prevUsers.map((user) => {
                        const pointsToAdd = props.todoEvent.eventPoints // Implement this function based on your logic
                        // Update every user's weeklyTotalPoints
                        return {
                            ...user,
                            weeklyTotalPoints: user.weeklyTotalPoints + parseInt(pointsToAdd, 10),
                        };
                    })
                );
            }
        } else {
            if (!props.todoEvent.allUsers) {
                appState.users.set((prevUsers) =>
                    prevUsers.map((user) => {
                        // Check if the user has the event in their todoEvents
                        if (user.todoEvents.includes(props.todoEvent.id)) {
                            // Logic to calculate the points to be added
                            // This could be a fixed value or based on the event's properties
                            const pointsToAdd = props.todoEvent.eventPoints // Implement this function based on your logic

                            // Add points to the user's weeklyTotalPoints
                            return {
                                ...user,
                                weeklyTotalPoints: props.user.weeklyTotalPoints - parseInt(pointsToAdd, 10),
                            };
                        }
                        return user;
                    })
                );
            } else {
                appState.users.set((prevUsers) =>
                    prevUsers.map((user) => {
                        const pointsToAdd = props.todoEvent.eventPoints // Implement this function based on your logic
                        return {
                            ...user,
                            weeklyTotalPoints: props.user.weeklyTotalPoints - parseInt(pointsToAdd, 10),
                        };
                    })
                );
            }
        }
    }


    function areAllTasksCompleted(event) {
        return event.tasks.every(task => task.done);
    }

    function calculatePercentage(event: TodoEvent): number {
        const totalTasks = event.tasks?.length;
        let tasksDone = 0;

        event.tasks.forEach((task) => {
            if (task.done) {
                tasksDone++;
            }
        });

        // Calculate the proportion of completed tasks (0.0 to 1.0)
        const proportion = tasksDone / totalTasks;
        return proportion// This will be a value between 0.0 and 1.0
    }

    const handleEdit = () => {
        // Handle edit logic
        setIsDropdownVisible(false);
    };

    const handleDelete = () => {
        // Handle delete logic
        setIsDropdownVisible(false);
    };

    function deleteEventById() {
        // Retrieve lists once at the beginning to improve efficiency.
        const allCalendarEvents = appState.calendarEvents.get();
        const allTodoEvents = appState.todoEvents.get();
        const allUsers = appState.users.get();

        // Helper function to update user in the appState.
        const updateUserInAppState = (user) => {
            const userIndex = allUsers.findIndex(u => u.id === user.id);
            if (userIndex !== -1) {
                allUsers[userIndex] = user; // Directly update the user object.
            }
        };

        if (props.todoEvent.allUsers) {
            if (props.todoEvent.calendarEventId !== null) {
                const newCalendarList = allCalendarEvents.filter(calendarEvt => calendarEvt.id !== props.todoEvent.calendarEventId);
                appState.calendarEvents.set(newCalendarList);
            }

            const newTodoEventList = allTodoEvents.filter(todoEvt => todoEvt.id !== props.todoEvent.id);
            appState.todoEvents.set(newTodoEventList);

        } else if (props.todoEvent.collaborative) {
            const newCalendarList = allCalendarEvents.filter(calendarEvt =>
                calendarEvt.id !== props.todoEvent.calendarEventId || calendarEvt.userId === props.user.id);
            appState.calendarEvents.set(newCalendarList);

            const collaborativeUsers = allUsers.filter(usr =>
                usr.todoEvents.some(todoEventId => todoEventId === props.todoEvent.id));

            if (collaborativeUsers?.length > 2) {
                props.user.todoEvents = props.user.todoEvents.filter(todoEvtId => todoEvtId !== props.todoEvent.id);
                props.user.calendarEvents = props.user.calendarEvents.filter(calendarId =>
                    allCalendarEvents.some(calendar => calendar.id === calendarId && calendar.todoEventId === props.todoEvent.id));
                updateUserInAppState(props.user);
            } else {
                // Construct an updated list of user IDs excluding the current user.
                const withOutSelectedUser = collaborativeUsers.filter(user => user.id != props.user.id)
                const userIdsList = []
                withOutSelectedUser.map(user => userIdsList.push(user.id))
                updateTodoEvent({
                    calenderEventId: props.todoEvent.calendarEventId !== null ? props.todoEvent.calendarEventId : null,
                    id: props.todoEvent.id,
                    title: props.todoEvent.title,
                    tasks: props.todoEvent.tasks,
                    isCollaborative: userIdsList?.length >= 2,
                    eventPoints: props.todoEvent.eventPoints,
                    allUsers: false,
                    hasCalenderEvent: props.todoEvent.calendarEventId !== null,
                    calendarEventData: appState.calendarEvents.get().find(cal => cal.todoEventId == props.todoEvent.id)
                }, userIdsList)
            }

        } else {
            // For non-collaborative events, simply filter out the todo and calendar events.
            const newTodoEventList = allTodoEvents.filter(todoEvt => todoEvt.id !== props.todoEvent.id);
            appState.todoEvents.set(newTodoEventList);

            const newCalendarList = allCalendarEvents.filter(calendarEvt =>
                calendarEvt.id !== props.todoEvent.calendarEventId);
            appState.calendarEvents.set(newCalendarList);

            // Update the user's todo and calendar events.

            props.user.todoEvents = props.user.todoEvents.filter(todoEvtId => todoEvtId !== props.todoEvent.id);
            props.user.calendarEvents = props.user.calendarEvents.filter(calendarId =>
                allCalendarEvents.some(calendarEvent => calendarEvent.id === calendarId));
            updateUserInAppState(props.user);

        }
    }




    function handleTaskDone(event: TodoEvent, taskIndex: number) {
        if (!props.todoEvent.eventDone) {

            const updatedEvent = {
                ...event,
                tasks: event.tasks.map((task, index) =>
                    index === taskIndex ? { ...task, done: true } : task
                ),
            };

            // Update the appState with the updated event
            appState.todoEvents.set((prevEvents) =>
                prevEvents.map((e) => (e.id === event.id ? updatedEvent : e))
            );
        }

    }

    function handleTaskUndone(event: TodoEvent, taskIndex: number) {
        if (!props.todoEvent.eventDone) {

            // Create a new updated event object
            const updatedEvent = {
                ...event,
                tasks: event.tasks.map((task, index) =>
                    index === taskIndex ? { ...task, done: false } : task
                ),
            };

            // Update the appState with the updated event
            appState.todoEvents.set((prevEvents) =>
                prevEvents.map((e) => (e.id === event.id ? updatedEvent : e))
            );


        }
    }


    function findCalendarEvent(): ICalendarEvents {

        return appState.calendarEvents.get().find(cal => cal.todoEventId === props.todoEvent.id)
    }



    return (


        <TouchableOpacity key={props.todoEvent.id} style={{
            borderColor: '#F1F1F2', // Sets border color
        }} className={props.todoEvent.eventDone ? " pt-2 pl-3 mb-2 flex flex-col border-2 rounded-xl w-[250px] bg-gray-100" : "pt-2 pl-3 mb-2 flex flex-col border-2 rounded-xl w-[250px] "} >
            {startFireWorks ?
                <LottieView
                    source={require('../../../assets/Animation - 1705650643172.json')}
                    autoPlay
                    loop={false}
                    onAnimationFinish={() => {
                        setStartFireWorks(false)

                    }}
                /> : null}

            <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", marginRight: 10 }}>

                <Text style={styles.eventTitle}>{props.todoEvent.title}</Text>
                {props.todoEvent.eventDone ? null :

                    dropDown()
                }

            </View>
            {props.todoEvent.calendarEventId !== null ?
                <View className={"p-2 bg-gray-200 w-1/2 rounded-full"}>
                    <Text className={"text-center"}> {findCalendarEvent() !== undefined ? moment(findCalendarEvent().start).format("LL") : null}</Text>

                </View> : null
            }
            {props.todoEvent.tasks.map((undertansk, index) =>
                <View className={"flex flex-row  "} key={props.todoEvent.id + index}>


                    <CustomCheckbox
                        keyString={props.todoEvent.id + "100"}
                        status={undertansk.done ? 'checked' : 'unchecked'}
                        onPress={() => undertansk.done
                            ? handleTaskUndone(props.todoEvent, index)
                            : handleTaskDone(props.todoEvent, index)}
                        color={props.userColor}
                    />






                    <View>

                        <Text className={"text-black  text-lg"}>{undertansk.taskName}</Text></View>

                </View>


            )}
            {props.todoEvent.tasks?.length < 1 ? null :
                <View className={" flex flex-row justify-between mt-4 mb-4"}>

                    <View className={"flex flex-row space-x-1"}>
                        <Entypo name="list" size={20} color="gray" />
                        <Text style={{ color: "gray" }}>Fremskridt</Text>
                    </View>
                    <View>
                        <Text className={"pr-4"}>  {tasksDone(props.todoEvent)} / {props.todoEvent.tasks?.length}
                        </Text>

                    </View>
                </View>
            }
            {props.todoEvent.tasks?.length < 1 ? null :
                <ProgressBar
                    progress={calculatePercentage(props.todoEvent)}
                    width={null}
                    color={props.userColor}
                    style={styles.progressBar}
                />}
            {props.todoEvent.eventDone && props.todoEvent.eventDoneDate !== undefined ?

                <TouchableOpacity className={"rounded-full bg-gray-200 w-20 mt-2 pl-2 pr-2"} >
                    <Text className={"text-center text-sm font-semibold"}>Fuldført</Text>

                </TouchableOpacity> :
                null




            }

            <TouchableOpacity
                style={{
                    backgroundColor: !props.todoEvent.eventDone ? props.userColor : "#9a9595",
                    borderRadius: 30,
                    borderWidth: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 30,
                    marginTop: 10,
                    marginBottom: 10,
                    marginRight: 20,
                    borderColor: "white",
                    shadowColor: props.userColor,
                    shadowRadius: 100
                }}
                onPress={() => {
                    const newEventDoneStatus = !props.todoEvent.eventDone;


                    eventDone(newEventDoneStatus)



                }}
            >

                <Text className={props.todoEvent.eventDone ? "text-red-700" : "text-white"}>{props.todoEvent.eventDone ? "Fortryd " : "Færdig"}</Text>
            </TouchableOpacity>

        </TouchableOpacity>

    )
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
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
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
        fontWeight: 'bold',
        textAlign: "center"

    },
    eventCard: {
        paddingTop: 10,
        paddingLeft: 20,
        marginBottom: 15,

        width: 250,
        flexDirection: 'column', // Sets flex direction to column
        borderColor: '#F1F1F2', // Sets border color
        borderWidth: 2, // Sets border width
        borderRadius: 20,
    },
    eventTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10
    },
    progressBar: {
        marginRight: 15,
        marginLeft: 6
    },
    plusIcon: {
        alignSelf: 'center', // Center the icon under the username
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
        marginBottom: 5


    },
    roundCheckbox: {
        borderRadius: 10, // Adjust for desired roundness
        width: 25,
        height: 25,
        overflow: 'hidden', // Ensures the checkbox doesn't overflow its container
        justifyContent: 'center', // Centers the checkbox vertically
        alignItems: 'center', // Centers the checkbox horizontally
    },
    // Add other styles as needed
    roundedBtn: {
        width: "50%",
        borderRadius: 20,
        borderWidth: 1
    },
    progrssrow: {
        flexDirection: "row",
        marginLeft: 2,
        justifyContent: "space-between",
        marginRight: 14,
        marginTop: 10,
        alignItems: "center"
    },
    avatarContainer: {
        flexDirection: 'row',
        marginLeft: -64, // Negative margin adjusted for React Native
    },
    avatarRing: {
        borderRadius: 50,
        borderWidth: 2,
        borderColor: 'white',
    },

    content: {
        width: 296, // Adjust width as needed
    },

    radioRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        marginVertical: 4, // Add space between items
        paddingHorizontal: 8,
    },
    radio: {
        height: 40,
        width: 40,
    },

})