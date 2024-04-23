import { appState, IUser } from "../../dbConnection/localData/manageData";

export function updateUserInAppState(updatedUser: IUser): void {
    // Update general user information in appState.users
    appState.users.set(users => {
        const index = users.findIndex(user => user.id === updatedUser.id);
        if (index !== -1) {
            // Creating a new array for immutability
            const updatedUsers = [...users];
            updatedUsers[index] = updatedUser;
            return updatedUsers; // Returning the updated users array
        }
        // Optionally, you might handle the case where the user is not found
        console.error("User not found in appState.users:", updatedUser.id);
        return users; // Return unchanged users array if not found
    });

    // Update user schedule information in appState.weeklySchedule
    appState.weeklySchedule.set(schedule => {
        const index = schedule.users.findIndex(sch => sch.userId === updatedUser.id);
        if (index !== -1) {
            // Copying the existing weeklySchedule to maintain immutability
            const updatedSchedule = {...schedule};
            // Update only the necessary user data to minimize state changes
            updatedSchedule.users[index] = {
                ...updatedSchedule.users[index], // Retain other properties
                userId: updatedUser.id,
                userColor: updatedUser.color,
                userImage: updatedUser.avatarString
                // listOfTasks is not updated here, assuming it should not change
            };
            return updatedSchedule; // Returning the updated schedule
        }
        // Optionally, you might handle the case where the schedule is not found
        console.error("User schedule not found in appState.weeklySchedule:", updatedUser.id);
        return schedule; // Return unchanged schedule if not found
    });
}


export function removeUserLocalState(selectedUser: IUser) {
    const allUsers = appState.users.get();
    const allTodos = appState.todoEvents.get();
    const allCalendarEvents = appState.calendarEvents.get();

    // Update Todo Events
    const updatedTodos = allTodos.map(todo => {
        if (selectedUser.todoEvents.includes(todo.id)) {
            if (todo.collaborative) {
                // Reduce count of collaborative users
                const userCount = allUsers.filter(user => user.todoEvents.includes(todo.id))?.length;
                if (userCount === 2) {
                    return { ...todo, collaborative: todo.isCalendarEvent, allUsers: false }; // End collaboration if only two users are involved
                }
            }
            // Remove todo if not collaborative or last collaborative user
            return null;
        }
        return todo;
    }).filter(Boolean); // Remove null entries

    // Update Calendar Events
    const updatedCalendarEvents = allCalendarEvents.filter(calendarEvent => {
        const involvedUsers = allUsers.filter(user => user.calendarEvents.includes(calendarEvent.id));
        return involvedUsers?.length > 1 || !selectedUser.calendarEvents.includes(calendarEvent.id);
    });

    // Update Users
    const updatedUsers = allUsers.filter(user => user.id !== selectedUser.id);

    // Set the updated states
    appState.todoEvents.set(updatedTodos);
    appState.calendarEvents.set(updatedCalendarEvents);
    appState.users.set(updatedUsers);

   const newWeeklySchedule = appState.weeklySchedule.get()
    newWeeklySchedule.users = newWeeklySchedule.users.filter(weekUser=>weekUser.userId!=selectedUser.id)
    appState.weeklySchedule.set(newWeeklySchedule)
}
