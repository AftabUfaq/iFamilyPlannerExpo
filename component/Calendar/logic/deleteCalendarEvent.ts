import {Alert} from "react-native";
import {appState, ICalendarEvents, IUser, TodoEvent} from "../../../dbConnection/localData/manageData";


export function deleteCalendarEvent(selectEvent: ICalendarEvents){
const users :IUser[]= appState.users.get()

         //allUsers From todo
           if (selectEvent.userId ==null && selectEvent.allUsers){

               Alert.alert('Slet fælles begivenhed!', ' Beskræft slet fælles event?', [

                   {
                       text: 'Nej',
                       style: 'cancel',
                   },
                   {text: 'Ja', style:"default", onPress: () =>faellesTodoEventCalendar(selectEvent)}
               ])

           }else if(filterUsers(users,selectEvent)?.length>1){
            //done
               Alert.alert('Slet begivenheden!', 'Skal alle involverede brugeres kalenderbegivenhed slettes?\n\nHvis JA Slettes Begivenheden hos alle.\nHvis Nej slettes den kun hos dig ', [
                   {
                       text: 'Annuller',
                       style:"destructive"

                   },
                   {
                       text: 'Nej',
                       onPress: () =>deleteOneCalendarEvent(users,selectEvent),
                   style: 'default',
                   },
                   {text: 'Ja',
                       onPress: () =>deleteAllCalendarEvent(users,selectEvent),
                   }
               ])

           } else if (filterUsers(users, selectEvent)?.length == 1) {
               // More than one user involved
               Alert.alert('Slet begivenhed!', 'Bekræft slet begivenhed?\n\nHvis JA Slettes Begivenheden hos alle.\nTryk Annuller for at Annuller sletningen ', [
                   { text: 'Annuller', style: "destructive" },
                   { text: 'Ja', onPress: () => deleteAllCalendarEvent(users, selectEvent) }
               ]);
           }


           else if(selectEvent.isTodoEvent){
               Alert.alert('Slet begivenheden!', 'kalender Begivenhed er fra Todo!\n\nHvis JA Slettes kalender Begivenheden hos alle.\n\nDeltagere kan ændres via. Todo', [
                   {
                       text: 'Annuller',
                       style:"cancel"

                   },
                   {text: 'Ja',
                       onPress: () =>deleteFromToDoEvent(users,selectEvent),
                   }
               ])
           }

}

//delete One User calendarEvent
//done
function deleteOneCalendarEvent(users: IUser[], selectedEvent: ICalendarEvents) {
    // Find the user who has the event to be deleted
    const userFound = users.find(user => user.id === selectedEvent.userId);

    if (userFound !== undefined) {
        // Correctly filter out the event and todo IDs and update the user's arrays
        userFound.calendarEvents = userFound.calendarEvents.filter(cal => cal !== selectedEvent.id);
        userFound.todoEvents = userFound.todoEvents.filter(todo => todo !== selectedEvent.todoEventId);

        // Find the index of the user in the original users array
        const userIndex = users.findIndex(user => user.id === userFound.id);

        if (userIndex !== -1) {
            // Update the specific user in the appState.users array
            const updatedUsers = appState.users.get(); // Get the current users array
            updatedUsers[userIndex] = userFound; // Update the user with the filtered events
            appState.users.set(updatedUsers); // Set the updated users array back to appState
        }
    }
}

//delete all percipient calendarEvent and the todoEvent

function deleteAllCalendarEvent(users :IUser[],selectedEvent:ICalendarEvents){
const percipientUsers= filterUsers(users,selectedEvent)

    if (selectedEvent.todoEventId !==null){
        const filteredTodo = appState.todoEvents.get().filter(todo=> todo.calendarEventId != selectedEvent.id)
        appState.todoEvents.set(filteredTodo)
    }

   if (percipientUsers>1){
       for (let i = 0; i <percipientUsers?.length ; i++) {
           const userFound = users.find(user=> user.calendarEvents.some(cal=> cal ==selectedEvent.userId))
           userFound.calendarEvents.filter(cal => cal !=selectedEvent.userId)
           userFound.todoEvents.filter(todoEvt=> todoEvt !=selectedEvent.todoEventId)
           appState.users[userFound].set(userFound)
       }


   }
    const newCalendarList =  appState.calendarEvents.get().filter(cal=> cal.id !==selectedEvent.id)
    appState.calendarEvents.set(newCalendarList)

}


//delete all users todoEvent Calendar
function deleteFromToDoEvent(users :IUser[],selectedEvent  : ICalendarEvents) {
    const percipientUsers = filterUsers(users, selectedEvent)

    if (percipientUsers > 1) {
        // remove the id's from users. todo and calendarEvents
        for (let i = 0; i < percipientUsers?.length; i++) {
            const userFound = users.find(user => user.calendarEvents.some(cal => cal == selectedEvent.userId))
            userFound.calendarEvents.filter(cal => cal != selectedEvent.userId)
            userFound.todoEvents.filter(todo => todo != selectedEvent.todoEventId)

            appState.users[userFound].set(userFound)

        }
        if (selectedEvent.todoEventId !== null) {
            const foundTodoEvent: TodoEvent = appState.todoEvents.find(todo => todo.calendarEventId == selectedEvent.id)
            const findTodoEvtIndex = appState.todoEvents.get().findIndex(todo => todo.calendarEventId == selectedEvent.id)

            if (foundTodoEvent !== undefined && findTodoEvtIndex !== -1) {
                foundTodoEvent.calendarEventId = null

                appState.todoEvents[findTodoEvtIndex].set(foundTodoEvent)

            }

        }

        const newCalendarList = appState.calendarEvents.get().filter(cal => cal.id != selectedEvent.id)
        appState.calendarEvents.set(newCalendarList)

    }

}

function faellesTodoEventCalendar(selectEvent){
        if (selectEvent.todoEventId !==null){

            const filteredTodo = appState.todoEvents.get().find(todo=> todo.id != selectEvent.todoEventId)
        if (filteredTodo !==undefined) {
            filteredTodo.isCalendarEvent = false
            filteredTodo.todoEventId = null
            appState.todoEvents.set(filteredTodo)

            const newCalendarList = appState.calendarEvents.get().filter(cal => cal.id != selectEvent.todoEventId)
            appState.calendarEvents.set(newCalendarList)
        }else{
            console.log("not found")
        }
        }




}


function filterUsers(users: IUser[], selectedEvent: ICalendarEvents) {
    // Filter users directly where user.calendarEvents includes the selectedEvent.id
    // Now usersMatched contains all users associated with the selectedEvent
    return users.filter(user =>
        user.calendarEvents.includes(selectedEvent.id)
    );
}
