export interface iAddToCalendarTodo {
  end: Date;
  isAllDay: boolean;
  start: Date;
  title: string;
}

export interface iSelectedDate {
  stringDate: string;
  selectedDate: Date;
}
