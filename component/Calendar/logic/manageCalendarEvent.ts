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
   
    console.log(selectedEvent.todoEventId);
    
  
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
//console.log("IN ELsE", newCalendarEvt,appState.calendarEvents.get()[calendarEventIndex], calendarEventIndex);

            //return
            appState.calendarEvents.get()[calendarEventIndex] = newCalendarEvt
           // console.log("After Update",appState.calendarEvents.get()[calendarEventIndex]);
            
           const usersWithCalEvent = appState.users.get().filter(user => user.calendarEvents.includes(selectedEvent.id));

           for (const user of usersWithCalEvent) {
               // Find the index of the user in the original array
               const userIndex = appState.users.get().indexOf(user);
           
               // Update user's calendar events
               const filteredUserCal = user.calendarEvents.filter(cal => cal !== selectedEvent.id);
               user.calendarEvents = filteredUserCal;
           
               // Update user's todo events if needed
               if (selectedEvent.todoEventId !== null) {
                   const filteredUserTodo = user.todoEvents.filter(todo => todo.calendarEventId !== selectedEvent.id);
                   user.todoEvents = filteredUserTodo;
               }
           
               // Update user in the original array
               appState.users.get()[userIndex] = user;
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
                const user = appState.users.get().find(user => user.id == userIdsList[i])
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