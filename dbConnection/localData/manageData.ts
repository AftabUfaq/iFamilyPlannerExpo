import {configureObservablePersistence, persistObservable,} from '@legendapp/state/persist';
import {ObservablePersistAsyncStorage} from '@legendapp/state/persist-plugins/async-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {observable} from "@legendapp/state";
import {Asset} from "expo-asset";


export interface IUser {
    id: string;
    name: string;
    avatarString: string;
    favoriteFood: string;
    birthDay: Date;
    color:string;
    todoEvents:string[],
    calendarEvents:string[]
    weeklyTotalPoints:number,


}
export interface IWeeklyScheduleUser{
    userId:string
    userImage:string
    userColor:string
    listOfTasks:string[]

}
export interface IWeeklySchedule{
    times : string[]
    users : IWeeklyScheduleUser[]
}

export interface ISystemSettings{
    systemColor:string,
    screensaverImage:string,
    SCREENSAVER_DELAY:number
    familyName:string
    weeklySchedule : boolean
}

export interface IMealPlan{
    day :string,
    breakfast :string,
    lunch :  string,
    dinner : string

}
export interface TodoEvent {
    id:string;
    title: string;
    eventDone:boolean,
    collaborative:boolean
    tasks: { taskName: string; done: boolean }[];
    eventDoneDate:Date
    eventPoints:string,
    allUsers:boolean,
    calendarEventId: string
    isCalendarEvent:boolean
}
export interface ICalendarEvents {
    id:string;
    userId: string;
    title: string;
    start: Date;
    end: Date;
    color: string;
    isAllDay: boolean;
    details:string
    isTodoEvent: boolean
    todoEventId:string
    allUsers:boolean


}


// Configure persistence
configureObservablePersistence({
    pluginLocal: ObservablePersistAsyncStorage,
    localOptions: {
        asyncStorage: {
            AsyncStorage, // Provide AsyncStorage
        },
    },
});

// Define your application state
const screensaverImage = require('./../../assets/screenSavers/1.jpeg');


function initializeMealPlan() :{ lunch: string; breakfast: string; day: string; dinner: string }[] {
    const days = ['Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør', 'Søn'];

    // Check if the meal plan already exists or needs initialization

    // Assuming appState has a method to set state or you directly assign to it
    return days.map(day => ({
        day,
        breakfast: "",
        lunch: "",
        dinner: ""
    }))


}

function initializeWeeklySchedule() :IWeeklySchedule {
    const times = ['08:15-09.00', '09:00-09.45', '10:00-10.45', '10.45-11.30', '12.00-12.45', '12.45-13.30', '13.30-14.15'];

   return {
    times : times,
    users : []
    }


}
export const appState = observable<{
    users: IUser[],
    todoEvents: TodoEvent[],
    calendarEvents: ICalendarEvents[],
    mealPlan: IMealPlan[],
    systemSettings: ISystemSettings,
    weeklySchedule:IWeeklySchedule
}>({
    users: [],
    todoEvents: [],
    calendarEvents: [],
    mealPlan: initializeMealPlan(),
    systemSettings:{systemColor :'#00cae7',SCREENSAVER_DELAY:2000,screensaverImage:Asset.fromModule(screensaverImage).uri, familyName:"",weeklySchedule:false},
    weeklySchedule:initializeWeeklySchedule()
});



// Enable persistence for appState
persistObservable(appState, {
    local: 'appStore', // Unique name for your stored state
});



