import { AntDesign } from "@expo/vector-icons";
import dayjs from "dayjs";
import "dayjs/locale/da";
import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar, ICalendarEventBase } from "react-native-big-calendar";
import { Button } from "react-native-paper";
import CreateEventModal from "../createEventModal";
import CreateCalenderEvent from "./CalenderEvent";

import { iSelectedDate } from "../../dbConnection/interfaces";
import {
  ICalendarEvents,
  IUser
} from "../../dbConnection/localData/manageData";
import EventModal from "./EventModal";
import { deleteCalendarEvent } from "./logic/deleteCalendarEvent"; // Import Danish locale
import MoreLabelModal from "./MoreLabelModal";
import ViewCalendarModal from "./ViewCalendarModal";

interface calendarProps {
  systemColor: string;
  users: IUser[];
  calendarList: ICalendarEvents[];
}

const segments: string[] = ["month", "week", "day"];
export default function MyCalendarComponent(props: calendarProps) {
  const [selected, setSelected] = useState("month");
  // Start with the current date
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState("all");
  const [selectedDate, setSelectedDate] = useState<iSelectedDate>({
    stringDate: "",
    selectedDate: new Date(),
  });
  const [loadNewEvents, setLoadNewEvents] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<ICalendarEvents>();
  const didMount = useRef(false);
  const [isEventListVisible, setIsEventListVisible] = useState(false);
  const [filteredEvent, setFilteredEvent] = useState<ICalendarEvents[]>([]);
  const [dayEvents, setDayEvents] = useState([]);

  const [showOneEvent, setShowOneEvent] = useState(false);
  const [moreLabelPressed, setMoreLabelPressed] = useState(false);
  const [moreLabelItems, setMoreLabelItems] = useState<ICalendarEventBase[]>(
    []
  );

  useEffect(() => {
    setCurrentUser("all");
    eventsLogic();
  }, [props.calendarList]);

  // Effect for handling changes to users
  useEffect(() => {
    setCurrentUser("all");
    eventsLogic();
  }, [props.users]);

  // Function to move to the next week
  const goToNextWeek = () => {
    switch (selected) {
      case "month":
        setCurrentDate(dayjs(currentDate).add(1, "month").toDate());
        break;

      case "week":
        setCurrentDate(dayjs(currentDate).add(1, "week").toDate());
        break;

      case "day":
        setCurrentDate(dayjs(currentDate).add(1, "day").toDate());
        break;
    }
  };

  // Function to move to the previous week
  const goToPrevWeek = () => {
    switch (selected) {
      case "month":
        setCurrentDate(dayjs(currentDate).subtract(1, "month").toDate());
        break;

      case "week":
        setCurrentDate(dayjs(currentDate).subtract(1, "week").toDate());

        break;

      case "day":
        setCurrentDate(dayjs(currentDate).subtract(1, "day").toDate());

        break;
    }
  };

  function getCalendarList() {
    const transformedEvents = [];

    // Step 1: Transform the events
    props.calendarList.forEach((event) => {
      if (event.allUsers) {
        transformedEvents.push({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
          color: "#c01515",
          todoEventId: event.todoEventId !== null ? event.todoEventId : null,
          userId: null,
        });
      } else {
        const userHasEvent = props.users.filter((user) =>
          user.calendarEvents.includes(event.id)
        );
        userHasEvent.forEach((user) => {
          transformedEvents.push({
            ...event,
            color: user.color,
            userId: user.id,
            start: new Date(event.start),
            end: new Date(event.end),
            todoEventId: event.todoEventId !== null ? event.todoEventId : null,
          });
        });
      }
    });

    // Step 2: Group events by their start date
    const eventsByDate = transformedEvents.reduce((acc, event) => {
      const dateKey = event.start.toISOString().split("T")[0]; // YYYY-MM-DD
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(event);
      return acc;
    }, {});

    // Step 3: Calculate overlap positions and counts for each group of events
    Object.keys(eventsByDate).forEach((dateKey) => {
      const eventsForDay = eventsByDate[dateKey];

      // Assuming events are already sorted by their start time
      eventsForDay.sort((a, b) => a.start - b.start);

      // Initialize all events' overlapCount to the total number of events in the same group
      eventsForDay.forEach(
        (event) => (event.overlapCount = eventsForDay?.length)
      );

      // Calculate overlapPosition
      for (let i = 0; i < eventsForDay?.length; i++) {
        let overlapPosition = 0;

        for (let j = 0; j < i; j++) {
          if (eventsForDay[i].start < eventsForDay[j].end) {
            overlapPosition = Math.max(
              overlapPosition,
              eventsForDay[j].overlapPosition + 1
            );
          }
        }

        eventsForDay[i].overlapPosition = overlapPosition;
      }
    });
    console.log(Object.values(eventsByDate).flat(), "EVENTS");

    // Flatten the dictionary back into a list and return
    return Object.values(eventsByDate).flat();
  }

  useEffect(() => {
    eventsLogic();
  }, [currentUser]);

  const eventsLogic = () => {
    if (currentUser === "all") {

      setFilteredEvent(getCalendarList());
    } else {
      const a = getCalendarList().filter(
        (event: ICalendarEvents) => event.userId === currentUser
      );
      console.log(a, "AAAA");

      setFilteredEvent(a);
    }
  };

  // Function to determine the number of days between two dates
  const areDaysBetween = (startDate: Date, endDate: Date) => {
    const oneDay = 24 * 60 * 60 * 1000; // One day in milliseconds
    const start = new Date(startDate.getTime());
    const end = new Date(endDate.getTime());

    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    return Math.floor((end - start) / oneDay);
  };

  function onCellPressed(date) {
    // Assuming 'events' is an array of event objects with a 'start' date property
    const eventsForDate = events.filter((event) =>
      dayjs(event.start).isSame(dayjs(date), "day")
    );
    setDayEvents(eventsForDate);
    setIsEventListVisible(true);
  }

  const renderEvent = (event, touchableOpacityProps) => {
    // Check if the current mode is 'week'
    if (selected === "week") {
      return (
        <TouchableOpacity
          onLongPress={() => deleteCalendarEvent(event)}
          {...touchableOpacityProps}
        >
          <Text
            className={"font-semibold  text-xl"}
            style={{ color: event.color }}
          >
            {event.title}
          </Text>
        </TouchableOpacity>
      );
    } else if (selected == "month") {
      return (
        <View>
          <TouchableOpacity
            onLongPress={() => deleteCalendarEvent(event)}
            {...touchableOpacityProps}
          >
            <Text style={{ color: event.color }}>{event.title}</Text>
          </TouchableOpacity>
        </View>
      );
    } else if (selected == "day") {
      return (
        <TouchableOpacity
          onLongPress={() => deleteCalendarEvent(event)}
          {...touchableOpacityProps}
        >
          <Text className={"text-3xl"} style={{ color: event.color }}>
            {event.title}
          </Text>
        </TouchableOpacity>
      );
    }
  };

  function renderUsers() {
    return (
      <ScrollView
        className={
          selected == "day"
            ? "flex flex-row space-x-5 ml-10 mt-2 h-[600]"
            : "flex flex-col space-y-5 ml-10 mt-10 h-[710]"
        }
      >
        <TouchableOpacity>
          <Text className={selected ? "hidden" : "font-bold text-gray-400"}>
            {" "}
            Personer
          </Text>
        </TouchableOpacity>
        {isEventListVisible ? (
          <EventModal
            events={dayEvents}
            isVisible={isEventListVisible}
            onClose={setIsEventListVisible}
          ></EventModal>
        ) : null}
        {showOneEvent ? (
          <ViewCalendarModal
            selectedEvent={selectedEvent}
            setOpenModal={() => {

              setShowOneEvent(false)
              eventsLogic();


            }}
            events={props.calendarList}
            userList={props.users}
            systemColor={props.systemColor}
          ></ViewCalendarModal>
        ) : null}

        {props.users.map((element: IUser, index) => (
          <TouchableOpacity
            className={"flex flex-row justify space-x-2 items-center"}
            onPress={() => setCurrentUser(element.id)}
            key={`${index}`}
          >
            <Image
              source={{ uri: element.avatarString }}
              className={"w-20 h-20"}
            />
            <Text
              className={"text-lg font-bold"}
              style={{ color: element.color }}
            >
              {" "}
              {element.name}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          className={"flex flex-row justify items-center   space-x-2"}
          onPress={() => setCurrentUser("all")}
        >
          <View className={"flex flex-row  space-x-[-70px]"}>
            {props.users.map((images, index) => (
              <Image
                key={`${index}`}
                source={{ uri: images.avatarString }}
                className={"w-20 h-20"}
              />
            ))}
          </View>
          <Text className={"text-lg font-bold"} style={{ color: "black" }}>
            {" "}
            Alle
          </Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  function createEvent() {
    setIsOpen(true);
    setSelectedDate({ stringDate: "", selectedDate: new Date() });
  }
  function onCellPressed(event: Date) {
    setSelectedDate({
      stringDate: event.toLocaleDateString(),
      selectedDate: event,
    });
    setIsOpen(true);
  }

  function changeDate() {
    return (
      <View className={"flex flex-row  space-x-4"}>
        <AntDesign name="left" size={24} color="black" onPress={goToPrevWeek} />
        <AntDesign
          name="right"
          size={24}
          color="black"
          onPress={goToNextWeek}
        />
        {selected == "week" ? (
          <Text>
            {currentDate.getDate() +
              " " +
              currentDate.toLocaleString("DA", { month: "long" }) +
              " " +
              currentDate.getFullYear()}
            , Uge {getISOWeekNumber(currentDate)}{" "}
          </Text>
        ) : (
          <Text>
            {currentDate.getDate() +
              " " +
              currentDate.toLocaleString("DA", { month: "long" }) +
              " " +
              currentDate.getFullYear()}
          </Text>
        )}
      </View>
    );
  }

  function getISOWeekNumber(d) {
    const date = new Date(d.getTime());
    date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
    // January 4 is always in week 1.
    const week1 = new Date(date.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return (
      1 +
      Math.round(
        ((date.getTime() - week1.getTime()) / 86400000 -
          3 +
          ((week1.getDay() + 6) % 7)) /
        7
      )
    );
  }

  function selectedEvt(evt: ICalendarEvents) {
    setSelectedEvent(evt);
    setShowOneEvent(true);
  }

  function onMorePressed(events: ICalendarEventBase[]) {
    setMoreLabelItems(events);
    setMoreLabelPressed(true);
  }

  function getClassBySelectedMode(selected) {
    switch (selected) {
      case "day":
        return "w-[80%] h-[750] mt-2";
      case "month":
        return "w-[80%] h-[94%] mt-2"; // You should adjust the values accordingly
      case "week":
        return "w-[80%] h-[94%] mt-2"; // You should adjust the values accordingly
      default:
        return "w-[84%] h-[94%] mt-2"; // Default case if none of the above
    }
  }

  function changeMode() {
    return (
      <View className={"flex flex-row"}>
        <TouchableOpacity
          className={
            "flex justify-center items-center  w-[14%] rounded-l-md p-4"
          }
          style={{ borderColor: props.systemColor, borderWidth: 1 }}
          onPress={() => setSelected("month")}
        >
          <Text style={{ color: props.systemColor }}>Måned</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={"flex justify-center items-center rounded  w-[14%]  p-4"}
          style={{ borderColor: props.systemColor, borderWidth: 1 }}
          onPress={() => setSelected("week")}
        >
          <Text style={{ color: props.systemColor }}>Uge</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={
            "flex justify-center items-center  w-[14%] rounded-r-md p-4"
          }
          style={{ borderColor: props.systemColor, borderWidth: 1 }}
          onPress={() => setSelected("day")}
        >
          <Text style={{ color: props.systemColor }}>Dag</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Render your Calendar component with buttons to navigate weeks
  return (
    <SafeAreaView>
      {isOpen ? (
        <CreateCalenderEvent
          isOpen={isOpen}
          setOpen={setIsOpen}
          users={props.users}
          selectedDate={selectedDate}
          setLoadNewEvents={setLoadNewEvents}
        ></CreateCalenderEvent>
      ) : (
        <View className={"flex flex-row mt-10"}>
          <CreateEventModal isOpen={isOpen} setOpen={setIsOpen} />
          <View className={"w-80  h-[80%]"}>
            <Button
              buttonColor={props.systemColor}
              textColor={"white"}
              className={" ml-10 text-white rounded-lg"}
              onPress={() => createEvent()}
            >
              Ny begivenhed
            </Button>

            {renderUsers()}
          </View>
          <View className={"flex flex-col  h-full w-full  "}>
            <View className={"flex flex-row w-full justify-between"}>
              {changeDate()}
              {changeMode()}
            </View>
            <View className={getClassBySelectedMode(selected)}>
              {moreLabelPressed ? (
                <MoreLabelModal
                  events={moreLabelItems}
                  setSelectedEvent={setSelectedEvent}
                  setShowOneEvent={() => {
                    setShowOneEvent(false)
                    eventsLogic();

                  }}
                  setMoreLabelPressed={setMoreLabelPressed}
                  moreLabelPressed={moreLabelPressed}
                  systemColor={props.systemColor}
                ></MoreLabelModal>
              ) : null}
              <Calendar
                events={filteredEvent}
                date={currentDate}
                height={300}
                mode={selected.toString()}
                showVerticalScrollIndicator={true}
                locale={"da"}
                weekStartsOn={1}
                onSwipeEnd={(date) => setCurrentDate(date)}
                onPressCell={(date) => onCellPressed(date)}
                onPressMoreLabel={(date) => onMorePressed(date)}
                overlapOffset={50}
                onPressEvent={(evento: ICalendarEvents) => selectedEvt(evento)}
                eventCellStyle={(event) => {
                  if (selected == "month") {
                    // Start with a base style that includes default values from ICalendarEventBase
                    const baseStyle = {
                      height: 30,
                      titleTextColor: "black",
                      color: "black",
                    };

                    // Return a style object that spreads in the base styles and then
                    // applies specific styles for the current event, potentially overriding defaults
                    return {
                      ...baseStyle, // Spread the base (default) styles
                      backgroundColor: `${event.color}33`, // Apply a specific background color with opacity
                      borderLeftColor: event.color, // Apply a specific border color
                      borderLeftWidth: 10, // Override the default border width if needed
                      shadowColor: "#FFFFFF", // Apply a specific shadow color
                      color: "#e10a0a",
                    };
                  }
                  if (selected == "week") {
                    // Start with a base style that includes default values from ICalendarEventBase
                    const baseStyle = {
                      titleTextColor: "white",
                      color: "black",
                    };

                    // Return a style object that spreads in the base styles and then
                    // applies specific styles for the current event, potentially overriding defaults
                    return {
                      ...baseStyle, // Spread the base (default) styles
                      titleTextColor: "#c41414",
                      backgroundColor: `${event.color}ED`, // Apply a specific background color with opacity
                    };
                  }
                  if (selected == "day") {
                    // Start with a base style that includes default values from ICalendarEventBase
                    const baseStyle = {
                      titleTextColor: "white",
                      color: "black",
                    };

                    // Return a style object that spreads in the base styles and then
                    // applies specific styles for the current event, potentially overriding defaults
                    return {
                      ...baseStyle, // Spread the base (default) styles
                      titleTextColor: "#c41414",
                      backgroundColor: `${event.color}E6`, // Apply a specific background color with opacity
                    };
                  }
                }}
                moreLabel={"Flere events"}
                showAllDayEventCell={true}
                renderEvent={renderEvent}
                enableEnrichedEvents={true}
                allDayEventCellStyle={(event) => ({
                  height: 20, // Set the cell height
                  backgroundColor: event.color + "96", // Dynamically set the background color based on the event
                  titleTextColor: "black",
                })}
              />
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
