import {appState, ICalendarEvents, TodoEvent} from "../../../dbConnection/localData/manageData";
import uuid from "react-native-uuid";

export function editCalendarEvent(something: {
    isAllDay: boolean;
    start: Date;
    end: Date;
    details: string;
    id: string;
    title: string
}, isTodoEvent: boolean, userIdsList: string[], selectedEvent: ICalendarEvents, addToDo: boolean) {
    console.log(selectedEvent, "seleectEvent");
    console.log(addToDo, "addToDo")
    console.log(something, "somethingsomething");
    
    
    if (selectedEvent.todoEventId !== null) {
        const calendarEventIndex = appState.calendarEvents.get().findIndex(cal => cal.id == something.id)
        console.log("in the IFFF");
        
        if (calendarEventIndex !== -1) {
            const newCalendarEvt: ICalendarEvents = {
                allUsers: selectedEvent.allUsers,
                color: selectedEvent.color,
                details: something.details,
                end: something.end,
                id: selectedEvent.id,
                isAllDay: something.isAllDay,
                isTodoEvent: true,
                start: something.start,
                title: something.title,
                todoEventId: selectedEvent.todoEventId,
                userId: selectedEvent.userId
            }
            console.log(newCalendarEvt,);
            
            appState.calendarEvents.get()[calendarEventIndex] = newCalendarEvt


           // console.log(selectedEvent.todoEventId)
          //  console.log(isTodoEvent)
        }

    } else {


        const calendarEventIndex = appState.calendarEvents.get().findIndex(cal => cal.id == something.id)


        if (calendarEventIndex !== -1) {


            const newCalendarEvt: ICalendarEvents = {
                allUsers: selectedEvent.allUsers,
                color: selectedEvent.color,
                details: something.details,
                end: something.end,
                id: selectedEvent.id,
                isAllDay: something.isAllDay,
                isTodoEvent: false,
                start: something.start,
                title: something.title,
                todoEventId: selectedEvent.todoEventId,
                userId: null
            }
///console.log("IN ELsE", newCalendarEvt,appState.calendarEvents.get()[calendarEventIndex]);


            appState.calendarEvents.get()[calendarEventIndex] = newCalendarEvt
            console.log("After Update",appState.calendarEvents.get()[calendarEventIndex]);
            
            const usersHasCalEvent = appState.users.get().filter(user => user.calendarEvents.some(cal => cal == selectedEvent.id))
            for (let i = 0; i < usersHasCalEvent?.length; i++) {
                //remove all selected Event from users.and  this insures that only the users who are in the userIdsList has the calendarEvent

                const user = appState.users.get().find(user => user.id == usersHasCalEvent[i])
                if (user !== undefined) {
                    const userIndex = appState.users.get().find(user => user.id == usersHasCalEvent[i])
                    const filteredUserCal = user.calendarEvents.filter(cal => cal != selectedEvent.id)
                    user.calendarEvents.set(filteredUserCal)

                    if (selectedEvent.todoEventId !== null) {
                        const filteredUserTodo = user.todoEvents.get().filter(todo => todo.calendarEventId != selectedEvent.id)
                        user.todoEvents.set(filteredUserTodo)
                    }
                    appState.users.get()[userIndex] = user


                }
            }
            const todoEvent: TodoEvent = {
                allUsers: false,
                calendarEventId: something.id,
                collaborative: true,
                eventDone: false,
                eventDoneDate: something.start,
                eventPoints: "0",
                id: uuid.v4().toString(),
                isCalendarEvent: true,
                tasks: [],
                title: something.title

            }


            for (let i = 0; i < userIdsList?.length; i++) {
                const user = appState.users.get().find(user => user.id = userIdsList[i])
                const userIndex = appState.users.get().findIndex(user => user.id == userIdsList[i])
                user.calendarEvents.push(newCalendarEvt.id)
                if (addToDo) {
                    user.todoEvents.push(todoEvent.id)


                }
                appState.users.get()[userIndex] = user


            }


        }


    }
}