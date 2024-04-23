import {Alert, Image, Platform, Text, TextInput, TouchableHighlight, TouchableOpacity, View} from "react-native";
import React, {useEffect, useState} from "react";
import {AntDesign, EvilIcons, FontAwesome5} from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker';
import ChooseMembers from "./ChooseMembers";
import {DatePicker} from 'antd';
import Checkbox from "expo-checkbox";
import {iSelectedDate} from "../../interfeces/calendarInterfaces";
import moment from "moment/moment";
import {appState, ICalendarEvents, IUser, TodoEvent} from "../../dbConnection/localData/manageData";
import uuid from "react-native-uuid";


interface ICreateCalenderProps {
    isOpen: boolean;
//  events: ICalendarEvent;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    users:IUser[]
    selectedDate :iSelectedDate
    setLoadNewEvents:React.Dispatch<React.SetStateAction<boolean>>;
}
const format = 'HH:mm';
const { RangePicker } = DatePicker;

export default function CreateCalenderEvent(props:ICreateCalenderProps){
    const [startDateStatus, setShowStartDate] = useState(false);

    const [startDate, setStartDate] = useState(new Date());
    const [endDateStatus, setShowEndDate] = useState(false);

    const [endDate, setEndDate] = useState(new Date());


    const [showStartClock, setShowStartClock] = useState(false);
    const [showEndClock, setShowEndClock] = useState(false);

    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    const [addToDo, setAddToDo]  = useState(false)
     const [showModal , setShowModal]  = useState<boolean>(false)
    const [selectedUser,setSelectedUsers] = useState<IUser[]>([])
    const [title , setTitle]  = useState<string>("")
    const [allDayIsChecked, setAllDayChecked] = useState(false);
    const [startDateString,setStartDateString]  = useState("Start Dato")
    const [endDateString,setEndDateString]  = useState("Slut dato")
    const [details, setDetails] = useState<string>("")
    const { RangePicker } = DatePicker;

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

    }; const activeEndClock = () => {
        setShowEndClock(true);
        setShowStartClock(false);


    };

    useEffect(()=>{
     if(props.selectedDate.stringDate ==""){

     }else{
         setStartDate(props.selectedDate.selectedDate)
         setStartTime(props.selectedDate.selectedDate)
         setStartDateString(props.selectedDate.stringDate)


     }

    },[])


    const formatTime = (date) => {
        if (!date) return '';

        let hours = date.getHours();
        let minutes = date.getMinutes();

        // Pad with zeros to get a double-digit format
        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;

        return `${hours}:${minutes}`;
    };


    const onChangeStartClock = (event, selectedDate) => {
        const currentDate = selectedDate || startTime; // Use the current startTime as fallback
        setShowStartClock(false); // Hide the picker
        if(currentDate) {
            setStartTime(currentDate); // Update startTime

            // If startDate and endDate are the same, adjust endTime if it's before startTime
            if (startDate.toDateString() === endDate.toDateString() && moment(endTime).isBefore(moment(currentDate))) {
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
        if(currentDate) {
            // If startDate and endDate are the same, and currentDate is before startTime, don't update endTime
            if (startDate.toDateString() === endDate.toDateString() && moment(currentDate).isBefore(moment(startTime))) {
                // Notify user that endTime cannot be before startTime on the same day
                Alert.alert("Ugyldig tid", "Slut tiden kan ikke være være før start tiden på samme dag.");
            } else {
                setEndTime(currentDate); // Update endTime as it's valid
            }
        }
    };




    function submitDate() {
        if(title ===""){
            window.alert("Angiv title")
            return;
        }

        if(selectedUser?.length==0){
            window.alert("Angiv tilhørende bruger")
            return;

        }

        if(endDateString ==""){
            window.alert("Angiv slut Dato")
            return;

        }

        if(allDayIsChecked){
            const startOfDay = new Date(startDate);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(endDate);
            endOfDay.setHours(0, 0, 0, 0);
            const calenderEventId = uuid.v4().toString()
            const todoEventID = uuid.v4().toString()


            const calendarEvent : ICalendarEvents ={
                color: null,
                details: details,
                end: endOfDay,
                id: calenderEventId,
                isAllDay: true,
                isTodoEvent: false,
                start: startOfDay,
                title: title,
                todoEventId: addToDo ?   todoEventID : null ,
                userId: null,
                allUsers:false
            }

            appState.calendarEvents.set((currentCalendarEvents) => [...currentCalendarEvents, calendarEvent]);

            const todoEvent: TodoEvent = {
                allUsers: false,
                calendarEventId: calenderEventId,
                collaborative: true,
                eventDone: false,
                eventDoneDate: calendarEvent.start,
                eventPoints: "0",
                id: todoEventID,
                isCalendarEvent: true,
                tasks: [],
                title: title
            }

            if (addToDo){

                appState.todoEvents.set((currentTodoEvents) => [...currentTodoEvents, todoEvent]);

            }



            for (let i = 0; i <selectedUser?.length ; i++) {
                if(addToDo) {


                    selectedUser[i].todoEvents.push(todoEvent.id)



                }
                selectedUser[i].calendarEvents.push(calendarEvent.id)
                const index = appState.users.get().findIndex(user => user.id == selectedUser[i].id)
                appState.users.get()[index]=selectedUser[i]

            }






        }else{
            const startDateTime = new Date(startDate);
            startDateTime.setHours(startTime.getHours(), startTime.getMinutes(), 0, 0);

            const endDateTime = new Date(endDate);
            endDateTime.setHours(endTime.getHours(), endTime.getMinutes(), 0, 0);

            const calenderEventId = uuid.v4().toString()

            const calendarEvent : ICalendarEvents ={
                color: null,
                details: details,
                end: endDateTime,
                id: calenderEventId,
                isAllDay: false,
                isTodoEvent: addToDo,
                start: startDateTime,
                title: title,
                todoEventId: null,
                userId: null,
                allUsers:false
            }
            appState.calendarEvents.set((currentCalendarEvents) => [...currentCalendarEvents, calendarEvent]);


            const todoEvent: TodoEvent = {
                allUsers: false,
                calendarEventId: calenderEventId,
                collaborative: false,
                eventDone: false,
                eventDoneDate: calendarEvent.start,
                eventPoints: "0",
                id: uuid.v4().toString(),
                isCalendarEvent: true,
                tasks: [],
                title: title
            }

            if (addToDo){

                appState.todoEvents.set((currentTodoEvents) => [...currentTodoEvents, todoEvent]);

            }

            for (let i = 0; i <selectedUser?.length ; i++) {
                const todoEventID = uuid.v4().toString()
                if(addToDo) {

                    selectedUser[i].calendarEvents.push(calenderEventId)

                    selectedUser[i].todoEvents.push(todoEventID)



                }
                const index = appState.users.get().findIndex(user => user.id == selectedUser[i].id)

                appState.users.get()[index] = selectedUser[i]



            }
        }
      closeModal()
    }




    function closeModal(){
        props.setLoadNewEvents(true)
        props.setOpen(false)

    }

console.log(props.users);


    return (
        <View className={"w-full h-[765]  "}>

            <ChooseMembers setOpen={setShowModal} showModal={showModal} setSelectedUsers={setSelectedUsers} users={props.users} selectedUsers={selectedUser}></ChooseMembers>
            <View className={"mt-10 "}>
                <TouchableOpacity className={"flex flex-row justify items-center space-x-4 ml-5"}  onPress={()=>props.setOpen(false)}>
                    <AntDesign name="leftcircle" size={40} color="gray"  />
                    <Text className={"text-xl font-bold"} >Tilføj begivenhed</Text>
                </TouchableOpacity>
            </View>

            <View className={"justify-center items-center h-40  flex flex-row space-x-[-50]"}>
                {selectedUser.map((user, index)=>

                <Image key={`${index}`} className={"w-32 h-32"} source={{uri :user.avatarString}}></Image>


                )}

            </View>

            <View className={" justify-center items-center h-auto "}>
                <View  className={"flex flex-col  border-[#E5E5E6FF] rounded-lg border-2  p-10 justify-center items-center h-[500] w-[40%] "}>
                    <View className={"flex flex-col space-y-8 w-full"}>
                        <TextInput className={"border border-black w-full pl-5 rounded-lg h-12"} placeholder={"Title"}     onChangeText={newTitle => setTitle(newTitle)}/>
                        <View className="flex-col   rounded-lg w-full ">
                        <View className={"flex flex-row  justify-evenly "}>
                            <TouchableOpacity className={"flex w-[150]   rounded-2xl "} onPress={showStartDatepicker}>
                                <TextInput
                                    editable={false} // To prevent manual editing
                                    className={"flex mx-2 text-black rounded-xl pl-5 border h-10 "}
                                    placeholder="Dato"
                                    value={startDateString} // You can format the date as you like
                                    placeholderTextColor="gray"
                                />
                                <AntDesign name="calendar" size={24} color="gray" style={{ position: 'absolute', right: 15, top:7 }} />
                            </TouchableOpacity>

                            <TouchableOpacity className={" w-[150] runded-2xl "} onPress={showEndDatepicker}>
                                <TextInput
                                    editable={false} // To prevent manual editing
                                    className="flex mx-2 text-black rounded-xl border pl-5 h-10"
                                    placeholder="Dato"
                                    value={endDateString} // You can format the date as you like
                                    placeholderTextColor="gray"
                                />
                                <AntDesign name="calendar" size={24} color="gray" style={{ position: 'absolute', right: 15, top:7 }} />
                            </TouchableOpacity>


                            {startDateStatus && (
                                <DateTimePicker
                                    testID="dateTimePicker"
                                    value={startDate}
                                    mode="date"
                                    is24Hour={true}
                                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
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
                                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                    onChange={onChangeEndDate}
                                    minimumDate={startDate}

                                />
                            )}


                        </View>
                            <View className={"flex flex-row mt-2  space-x-2 ml-4"}>
                                <Checkbox
                                    value={allDayIsChecked}
                                    onValueChange={setAllDayChecked}/>
                                <Text>Heldagsbegivenhed</Text>
                            </View>

                        </View>

                        {allDayIsChecked  ? null :
                        <View className={"flex flex-row space-x-20   "}>
                            <View className={" w-[40%] border rounded-xl"}>



                                <TouchableOpacity className="flex flex-row  items-center space-x-[100]" onPress={activeStartClock}>
                                    <TextInput
                                        editable={false} // To prevent manual editing
                                        className=" pl-5 mx-2 text-black h-10  "
                                        placeholder="Start tid"
                                        value={formatTime(startTime) ===formatTime(new Date()) ?  "Start tid" : formatTime(startTime)}

                                        placeholderTextColor="gray"

                                    />
                                    <FontAwesome5 name="clock" size={24} color="gray" className="absolute " />
                                </TouchableOpacity>
                                {showStartClock && (
                                    <DateTimePicker
                                        testID="dateTimePicker"
                                        value={startTime}
                                        mode="time"
                                        is24Hour={true}
                                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                        onChange={onChangeStartClock}
                                        minimumDate={startDate}

                                    />
                                )}

                            </View>

                            <View className={"w-[40%] border rounded-xl"}>

                                <TouchableOpacity className="flex flex-row items-center   space-x-[120]" onPress={activeEndClock}>
                                    <TextInput
                                        editable={false} // To prevent manual editing
                                        className="   pl-5 text-black h-10  "
                                        placeholder="Start tid"
                                        value={formatTime(endTime) ===formatTime(new Date()) ?  "Slut tid" : formatTime(endTime)}
                                        placeholderTextColor="gray"
                                        defaultValue={"Start tid"}

                                    />
                                    <FontAwesome5  name="clock" size={24} color="gray" className=" " />
                                </TouchableOpacity>
                                {showEndClock && (
                                    <DateTimePicker
                                        testID="dateTimePicker"
                                        value={endTime}
                                        mode="time"
                                        is24Hour={true}
                                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                        onChange={onChangeEndClock}


                                    />
                                )}
                            </View>
                        </View>
                        }

                        <View>
                            <TextInput style={{}} className={" border border-black rounded-2xl h-16 pl-2"}      numberOfLines={4}
                                       multiline={true}
                                       placeholder={"Detailjer "}
                                       textAlignVertical="top"
                                       onChangeText={(newText) => setDetails(newText)}
                                       value={details}
                            ></TextInput>



                        </View>
                        <TouchableOpacity className={"flex flex-row space-x-1 ml-2"} onPress={()=>setShowModal(true)}>
                            <EvilIcons name="plus" size={24} color="black" />
                            <Text>Tilføj person</Text>
                        </TouchableOpacity>

                        <View className={"flex flex-col"}>
                          <View>


                            <TouchableHighlight
                                className={"bg-[#00CAE7] h-10 justify-center items-center rounded-xl"}
                                onPress={() => submitDate()}
                                underlayColor='#FFFFF'>
                                <Text >Submit</Text>

                            </TouchableHighlight>
                          </View>
                        {    <View className={"flex flex-row mt-2  space-x-2 ml-4"}>
                                <Checkbox
                                    value={addToDo}
                                    onValueChange={setAddToDo}/>
                                <Text>tilføj til To Do</Text>
                            </View>}
                        </View>
                    </View>

                </View>

            </View>

        </View>

    )
}