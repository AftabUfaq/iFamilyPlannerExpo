import {appState, ICalendarEvents, IUser, TodoEvent} from "../../../dbConnection/localData/manageData";
import {iAddToCalendarTodo} from "../../../interfeces/EventsInterfaces";
import uuid from "react-native-uuid";


export  function saveTodoEvent(submittedData: {
    calendarEvents: iAddToCalendarTodo;
    eventPoints: string;
    allUsers: boolean;
    userIds: string[];
    isCollaborative: boolean;
    title: string;
    eventDoneDate: null;
    tasks: { taskName: any; done: boolean }[]
    isCalendarEvent: boolean
}) {

    const toDoEvent: TodoEvent = {
        allUsers: false,
        calendarEventId: null,
        collaborative: false,
        eventDone: false,
        eventDoneDate: undefined,
        eventPoints: submittedData.eventPoints,
        id: null,
        isCalendarEvent: false,
        tasks: submittedData.tasks,
        title: submittedData.title
    }


    const calendarEvent: ICalendarEvents = {
        color: "#0e0303",
        details: submittedData.tasks?.length>0 ?  submittedData.tasks.map(task => task.taskName).join(", ") : "",
        end: submittedData.calendarEvents === null ? null : submittedData.calendarEvents.end,
        id: null,
        isAllDay: submittedData.calendarEvents === null ? false : submittedData.calendarEvents.isAllDay,
        isTodoEvent: false,
        start: submittedData.calendarEvents === null ? null : submittedData.calendarEvents.start,
        title: toDoEvent.title,
        todoEventId: null,
        userId: null,
        allUsers:false
    }

// effects all Users saved once in appState.todoEvents and marked allUsers = true
    if (submittedData.allUsers) {
        toDoEvent.id = uuid.v4().toString()
        toDoEvent.allUsers = true
        if (submittedData.calendarEvents !== null && submittedData.isCalendarEvent) {
            calendarEvent.id = uuid.v4().toString()
            calendarEvent.isTodoEvent = true
            calendarEvent.todoEventId = toDoEvent.id
            calendarEvent.allUsers=true
            appState.calendarEvents.push(calendarEvent)
        }
        appState.todoEvents.push(toDoEvent)
    }else {


        // saved once, and then added to users.todoEvent
       if (submittedData.isCollaborative) {

             toDoEvent.id = uuid.v4().toString()
             toDoEvent.collaborative = true
             calendarEvent.id = uuid.v4().toString()

           if (toDoEvent.isCalendarEvent) {
               calendarEvent.isTodoEvent = true
               calendarEvent.todoEventId = toDoEvent.id
               calendarEvent.userId = null
               calendarEvent.color = null
               appState.calendarEvents.push(calendarEvent)
           }

             for (let i = 0; i < submittedData.userIds?.length; i++) {
                 const index = appState.users.get().findIndex(user => user.id == submittedData.userIds[i])
                 const user = appState.users.get()[index]
                 user.calendarEvents.push(calendarEvent.id)
                 user.todoEvents.push(toDoEvent.id)
                 appState.users.get()[index] = user

             }
             appState.todoEvents.push(toDoEvent)


        } else {

// each user in submittedData.userIds gets their own event
     const usersOld =  appState.users.get(true)
           const todoEventOld = appState.todoEvents.get(true)


           for (let i = 0; i < submittedData.userIds?.length; i++) {
               const index = appState.users.get().findIndex(user => user.id == submittedData.userIds[i])
             if (index !==-1) {
                const todoEventid = uuid.v4().toString()
                 const user = appState.users.get()[index]
                const calendarId = uuid.v4().toString()
                 const TestToDoEvent: TodoEvent = {
                     allUsers: false,
                     calendarEventId:submittedData.isCalendarEvent? calendarId : null,
                     collaborative: false,
                     eventDone: false,
                     eventDoneDate: undefined,
                     eventPoints: submittedData.eventPoints,
                     id: todoEventid,
                     isCalendarEvent: false,
                     tasks: submittedData.tasks,
                     title: submittedData.title
                 }
                 if (submittedData.isCalendarEvent) {
                     calendarEvent.id = calendarId
                     calendarEvent.isTodoEvent = true
                     calendarEvent.todoEventId = TestToDoEvent.id
                     calendarEvent.userId = user.id
                     calendarEvent.color = user.color
                     appState.calendarEvents.push(calendarEvent)
                     usersOld[index].calendarEvents.push(calendarEvent.id)
                 }


                 todoEventOld.push(TestToDoEvent)
                 usersOld[index].todoEvents.push(TestToDoEvent.id)


             }

           }
           appState.users.set(usersOld)
           appState.todoEvents.set(todoEventOld)

           }
       }




}





 export function updateTodoEvent(todoEvent: {
     eventPoints: string;
     allUsers: boolean;
     hasCalenderEvent: boolean;
     isCollaborative: boolean;
     calendarEventData: iAddToCalendarTodo;
     id: string;
     title: string;
     tasks: { taskName: string; done: boolean }[]
     calenderEventId:string
 }, usersIds: string[],

 ) {
     todoEvent.tasks = todoEvent.tasks.map(task => ({...task, done: false}))

     const index = appState.todoEvents.get().findIndex(evt => evt.id === todoEvent.id);
     const oldTodoEvent: TodoEvent = appState.todoEvents.get()[index]
     const todoEventUpDated: TodoEvent = {
         allUsers: todoEvent.allUsers,
         calendarEventId: oldTodoEvent.calendarEventId != undefined ? oldTodoEvent.calendarEventId : null,
         collaborative: todoEvent.isCollaborative,
         eventDone: false,
         eventDoneDate: undefined,
         eventPoints: todoEvent.eventPoints,
         id: uuid.v4.toString(),
         isCalendarEvent: false,
         tasks: todoEvent.tasks,
         title: todoEvent.title

     }

     if (index !== -1 ) { // Ensure the event exists
         if (todoEvent.allUsers) {
             updateAllUserEvent(todoEventUpDated, oldTodoEvent, index, "#0e0303", todoEvent.calendarEventData, todoEvent.hasCalenderEvent)

         } else {

             //if old todoEvent collaborative = ture, if new todoEvent collaborative = false
             //true false
             if (oldTodoEvent.collaborative && !todoEvent.isCollaborative) {
                 //deleting from todoEvents
                 const newTodoList = appState.todoEvents.get().filter(todoEvt => todoEvt.id != oldTodoEvent.id)
                 appState.todoEvents.set(newTodoList)

                 const newCalendarList = appState.calendarEvents.get().filter(calendarEvent => calendarEvent.todoEventId != oldTodoEvent.id)
                 appState.calendarEvents.set(newCalendarList)

                 //finding users how has oldTodoEvent.id
                 const usersWithEvent: IUser[] = appState.users.get().filter(user => user.todoEvents.some(todoEvtId => todoEvtId === oldTodoEvent.id));

                 //removing  from all users
                 for (let i = 0; i < usersWithEvent?.length; i++) {
                     usersWithEvent[i].todoEvents = usersWithEvent[i].todoEvents.filter(todoEvtId => todoEvtId != oldTodoEvent.id)
                     usersWithEvent[i].calendarEvents = usersWithEvent[i].calendarEvents.filter((calendarEvt => appState.calendarEvents.get().some(calendarEvent => calendarEvent.todoEventId == calendarEvt)))

                     const findUserIndex = appState.users.get().findIndex(user => user.id == usersWithEvent[i].id)
                     appState.users.get()[findUserIndex] = usersWithEvent[i]

                 }
                 // add newTodoEvent to the involved users
                 for (let i = 0; i < usersIds?.length; i++) {
                     const index = appState.users.get().findIndex(user => user.id == usersIds[i])
                     if (index !== -1) {
                         const user = appState.users.get()[index]


                         const TestTodoEventId = uuid.v4().toString()
                         const calendarId = uuid.v4().toString()


                         if (todoEvent.hasCalenderEvent) {
                             console.log("saving calendarEVent")
                             const newCalendarEvent: ICalendarEvents = {
                                 color: user.color,
                                 details: todoEventUpDated.tasks?.length > 0 ? todoEventUpDated.tasks.map(task => task.taskName).join(", ") : "",
                                 end: todoEvent.hasCalenderEvent ? todoEvent.calendarEventData.end : null,
                                 id: calendarId,
                                 isAllDay: todoEvent.hasCalenderEvent ? todoEvent.calendarEventData.isAllDay : false,
                                 isTodoEvent: true,
                                 start: todoEvent.hasCalenderEvent ? todoEvent.calendarEventData.start : null,
                                 title: todoEventUpDated.title,
                                 todoEventId: TestTodoEventId,
                                 userId: user.id,
                                 allUsers: false

                             }


                             appState.calendarEvents.push(newCalendarEvent)
                             user.calendarEvents.push(newCalendarEvent.id)


                         }

                         const TestToDoEvent: TodoEvent = {
                             allUsers: false,
                             calendarEventId: todoEvent.hasCalenderEvent ? calendarId : null,
                             collaborative: false,
                             eventDone: false,
                             eventDoneDate: undefined,
                             eventPoints: todoEventUpDated.eventPoints,
                             id: TestTodoEventId,
                             isCalendarEvent: false,
                             tasks: todoEventUpDated.tasks,
                             title: todoEventUpDated.title
                         }
                         appState.todoEvents.push(TestToDoEvent)
                         user.todoEvents.push(TestToDoEvent.id)
                         appState.users.get()[index] = user
                     }


                 }


             } else if (!oldTodoEvent.collaborative && !todoEventUpDated.collaborative) {
                 console.log("0")
                 //deleting from todoEvents
                 const newTodoList = appState.todoEvents.get().filter(todoEvt => todoEvt.id != oldTodoEvent.id)
                 appState.todoEvents.set(newTodoList)

                 const newCalendarList = appState.calendarEvents.get().filter(calendarEvent => calendarEvent.todoEventId != oldTodoEvent.id)
                 appState.calendarEvents.set(newCalendarList)

                 //finding users how has oldTodoEvent.id
                 const usersWithEvent: IUser[] = appState.users.get().filter(user => user.todoEvents.some(todoEvtId => todoEvtId === oldTodoEvent.id));

                 //removing  from all users
                 for (let i = 0; i < usersWithEvent?.length; i++) {
                     usersWithEvent[i].todoEvents = usersWithEvent[i].todoEvents.filter(todoEvtId => todoEvtId != oldTodoEvent.id)
                     usersWithEvent[i].calendarEvents = usersWithEvent[i].calendarEvents.filter((calendarEvt => appState.calendarEvents.get().some(calendarEvent => calendarEvent.todoEventId == calendarEvt)))

                     const findUserIndex = appState.users.get().findIndex(user => user.id == usersWithEvent[i].id)
                     appState.users.get()[findUserIndex] = usersWithEvent[i]

                 }
                 // add newTodoEvent to the involved users
                 for (let i = 0; i < usersIds?.length; i++) {
                     const index = appState.users.get().findIndex(user => user.id == usersIds[i])
                     if (index !== -1) {
                         const user = appState.users.get()[index]


                         const TestTodoEventId = uuid.v4().toString()
                         const calendarId = uuid.v4().toString()


                         if (todoEvent.hasCalenderEvent) {
                             console.log("saving calendarEVent")
                             const newCalendarEvent: ICalendarEvents = {
                                 allUsers: false,
                                 color: user.color,
                                 details: todoEventUpDated.tasks?.length > 0 ? todoEventUpDated.tasks.map(task => task.taskName).join(", ") : "",
                                 end: todoEvent.hasCalenderEvent ? todoEvent.calendarEventData.end : null,
                                 id: calendarId,
                                 isAllDay: todoEvent.hasCalenderEvent ? todoEvent.calendarEventData.isAllDay : false,
                                 isTodoEvent: true,
                                 start: todoEvent.hasCalenderEvent ? todoEvent.calendarEventData.start : null,
                                 title: todoEventUpDated.title,
                                 todoEventId: TestTodoEventId,
                                 userId: user.id

                             }


                             appState.calendarEvents.push(newCalendarEvent)
                             user.calendarEvents.push(newCalendarEvent.id)


                         }

                         const TestToDoEvent: TodoEvent = {
                             allUsers: false,
                             calendarEventId: todoEvent.hasCalenderEvent ? calendarId : null,
                             collaborative: false,
                             eventDone: false,
                             eventDoneDate: undefined,
                             eventPoints: todoEventUpDated.eventPoints,
                             id: TestTodoEventId,
                             isCalendarEvent: false,
                             tasks: todoEventUpDated.tasks,
                             title: todoEventUpDated.title
                         }
                         appState.todoEvents.push(TestToDoEvent)
                         user.todoEvents.push(TestToDoEvent.id)
                         appState.users.get()[index] = user
                     }


                 }


             } else if (!oldTodoEvent.collaborative && todoEventUpDated.collaborative) {


                 const newTodoList = appState.todoEvents.get().filter(todoEvt => todoEvt.id !== oldTodoEvent.id)
                 appState.todoEvents.set(newTodoList)

                 const newCalendarList = appState.calendarEvents.get().filter(calendarEvent => calendarEvent.todoEventId != oldTodoEvent.id)
                 appState.calendarEvents.set(newCalendarList)
                 const usersWithEvent: IUser[] = appState.users.get().filter(user => user.todoEvents.some(todoEvtId => todoEvtId === oldTodoEvent.id));

                 //remove from all users
                 for (let i = 0; i < usersWithEvent?.length; i++) {
                     usersWithEvent[i].todoEvents.filter(todoEvtId => todoEvtId != todoEventUpDated.id)
                     usersWithEvent[i].calendarEvents = usersWithEvent[i].calendarEvents.filter((calendarEvt => appState.calendarEvents.get().some(calendarEvent => calendarEvent.todoEventId == calendarEvt)))

                     const findUserIndex = appState.users.get().findIndex(user => user.id == usersWithEvent[i].id)
                     appState.users.get()[findUserIndex] = usersWithEvent[i]

                 }
                 const todoEventId = uuid.v4().toString()

                 todoEventUpDated.id = todoEventId
                 todoEventUpDated.collaborative = true
                 const calenderId = uuid.v4().toString()

                 if (todoEvent.hasCalenderEvent) {
                     const newCalendarEvent: ICalendarEvents = {
                         color: "",
                         details: todoEventUpDated.tasks?.length > 0 ? todoEventUpDated.tasks.map(task => task.taskName).join(", ") : "",
                         end: todoEventUpDated.isCalendarEvent ? null : todoEvent.calendarEventData.end,
                         id: calenderId,
                         isAllDay: todoEventUpDated.isCalendarEvent ? false : todoEvent.calendarEventData.isAllDay,
                         isTodoEvent: true,
                         start: todoEventUpDated.isCalendarEvent ? null : todoEvent.calendarEventData.start,
                         title: todoEventUpDated.title,
                         todoEventId: todoEventId,
                         userId: null,
                         allUsers: false


                     }

                     appState.calendarEvents.push(newCalendarEvent)
                 }


                 for (let i = 0; i < usersIds?.length; i++) {
                     const index = appState.users.get().findIndex(user => user.id == usersIds[i])
                     if (index != -1) {
                         const user = appState.users.get()[index]


                         user.calendarEvents.push(calenderId)
                         user.todoEvents.push(todoEventId)
                         appState.users.get()[index] = user


                     }


                 }
                 appState.todoEvents.push(todoEventUpDated)


                 //true true
             } else if (oldTodoEvent.collaborative && todoEventUpDated.collaborative) {
                 if (todoEvent.calenderEventId == null) {
                     const newTodoList = appState.todoEvents.get().filter(todoEvt => todoEvt.id != oldTodoEvent.id)
                     appState.todoEvents.set(newTodoList)
                     const newCalendarList = appState.calendarEvents.get().filter(calendarEvent => calendarEvent.todoEventId != oldTodoEvent.id)
                     appState.calendarEvents.set(newCalendarList)
                     const usersWithEvent: IUser[] = appState.users.get().filter(user => user.todoEvents.some(todoEvtId => todoEvtId === oldTodoEvent.id));
                     const todoEventId = uuid.v4().toString()

                     //remove from all users
                     for (let i = 0; i < usersWithEvent?.length; i++) {
                         usersWithEvent[i].todoEvents.filter(todoEvtId => todoEvtId != todoEventUpDated.id)
                         usersWithEvent[i].calendarEvents = usersWithEvent[i].calendarEvents.filter((calendarEvt => appState.calendarEvents.get().some(calendarEvent => calendarEvent.todoEventId == calendarEvt)))

                         const findUserIndex = appState.users.get().findIndex(user => user.id == usersWithEvent[i].id)
                         appState.users.get()[findUserIndex] = usersWithEvent[i]

                     }
                     todoEventUpDated.id = todoEventId
                     todoEventUpDated.collaborative = true
                     const calenderId = uuid.v4().toString()


                     if (todoEvent.hasCalenderEvent) {
                         const newCalendarEvent: ICalendarEvents = {
                             color: "",
                             details: todoEventUpDated.tasks?.length > 0 ? todoEventUpDated.tasks.map(task => task.taskName).join(", ") : "",
                             end: todoEventUpDated.isCalendarEvent ? null : todoEvent.calendarEventData.end,
                             id: calenderId,
                             isAllDay: todoEventUpDated.isCalendarEvent ? false : todoEvent.calendarEventData.isAllDay,
                             isTodoEvent: true,
                             start: todoEventUpDated.isCalendarEvent ? null : todoEvent.calendarEventData.start,
                             title: todoEventUpDated.title,
                             todoEventId: todoEventId,
                             userId: null,
                             allUsers: false,


                         }
                         appState.calendarEvents.push(newCalendarEvent)

                     }


                     for (let i = 0; i < usersIds?.length; i++) {
                         const index = appState.users.get().findIndex(user => user.id == usersIds[i])
                         if (index != -1) {
                             const user = appState.users.get()[index]


                             user.calendarEvents.push(calenderId)
                             user.todoEvents.push(todoEventId)
                             appState.users.get()[index] = user
                         }


                     }
                     appState.todoEvents.push(todoEventUpDated)


                 }else{
                  const todoEventFound=    appState.todoEvents.get().find(todoEvt=> todoEvt.id ==todoEvent.id)
                     todoEventFound.tasks =todoEvent.tasks
                     todoEventFound.title = todoEvent.title
                     todoEventFound.eventPoints = todoEvent.eventPoints
                  const indexFound  = appState.todoEvents.get().findIndex(todoEvt=> todoEvt.id ==todoEvent.id)
                     if (indexFound !=-1){
                         appState.todoEvents[indexFound].set(todoEventFound)

                     }
                 }


                    }
         }
     }


}

 function updateAllUserEvent(todoEventUpDated: TodoEvent, oldTodoEvent: TodoEvent, index: number, color: string, calendarEventData: iAddToCalendarTodo, isCalenderEvent: boolean){



     //if user wants to update calendar and update todoEvent true true
     if (oldTodoEvent.calendarEventId !==null && isCalenderEvent) {

         const findCalendarIndex = appState.calendarEvents.get().findIndex(calendar => calendar.id == oldTodoEvent.calendarEventId)

         appState.calendarEvents.get()[findCalendarIndex] = {
             color: color,
             details: todoEventUpDated.tasks?.length > 0 ? todoEventUpDated.tasks.map(task => task.taskName).join(", ") : "",
             end: calendarEventData.end,
             id: oldTodoEvent.calendarEventId,
             isAllDay: calendarEventData.isAllDay,
             isTodoEvent: true,
             start: calendarEventData.start,
             title: todoEventUpDated.title,
             todoEventId: todoEventUpDated.id,
             userId: null,
             allUsers:true
         }

         appState.todoEvents.get()[index] = todoEventUpDated

         //if  Calender saved before. and user has un clicked savedCalendar and update todoEvent true false
     } else if (oldTodoEvent.calendarEventId !==null && !isCalenderEvent) {
         const newCalendarList: ICalendarEvents[] = appState.calendarEvents.get().filter(calendarEvt => calendarEvt.id != oldTodoEvent.calendarEventId)
         appState.calendarEvents.set(newCalendarList)

         todoEventUpDated.isCalendarEvent = false
         todoEventUpDated.calendarEventId = null
         appState.todoEvents.get()[index] = todoEventUpDated

         //if no Calender save new Calendar and update todoEvent false true
     } else if (oldTodoEvent.calendarEventId ==null && isCalenderEvent) {
         const calendarEventId = uuid.v4().toString()
         const calendarToBeSaved: ICalendarEvents = {
             allUsers:true,
             color:color,
             details: todoEventUpDated.tasks?.length > 0 ? todoEventUpDated.tasks.map(task => task.taskName).join(", ") : "",
             end: calendarEventData.end,
             id: calendarEventId,
             isAllDay: calendarEventData.isAllDay,
             isTodoEvent: true,
             start: calendarEventData.start,
             title: todoEventUpDated.title,
             todoEventId: todoEventUpDated.id,
             userId: null

         }
         appState.calendarEvents.push(calendarToBeSaved)

         todoEventUpDated.calendarEventId=calendarEventId
         todoEventUpDated.isCalendarEvent=true
         appState.todoEvents.get()[index] = todoEventUpDated
         // just update todoEvent false false
     }else if(oldTodoEvent.calendarEventId ===null && !todoEventUpDated.isCalendarEvent){
         appState.todoEvents.get()[index] = todoEventUpDated
     }





 }