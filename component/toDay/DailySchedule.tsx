import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import {ItoDayCalendarEvents} from "../../interfeces/ToDayInterface";

interface iDailyScheduleProps {
    events: ItoDayCalendarEvents[];
}

const ScheduleItem = ({ time, activities }) => (
    <View className="flex-row py-[8.5]">
        <Text className="w-16 mr-2 font-bold">{time}</Text>
        <View className="flex-1 flex-row border-b border-gray-200">
            {activities.map((activity, index) => (
                <Text key={index} className="text-sm font-bold" style={{ color: activity.color }}>
                    {activity.title}{index < activities?.length - 1 ? ',   ' : ''}
                </Text>
            ))}
        </View>
    </View>
);

const DailySchedule = (props: iDailyScheduleProps) => {
    // Generate a list of hours from 06:00 to 00:00
    const hours = Array.from({ length: 19 }, (_, i) => `${i + 6}`.padStart(2, '0') + ':00');

    // Get the current date at midnight for comparison
    const currentDay = new Date();
    currentDay.setHours(0, 0, 0, 0);

    const getActivitiesForTime = (hour: string) => {
        // Convert hour string to a Date object for comparison
        const timeParts = hour.split(':');
        const hourDate = new Date(currentDay);
        hourDate.setHours(parseInt(timeParts[0]), parseInt(timeParts[1]), 0, 0);

        return props.events
            .filter(event => {
                const startDate = new Date(event.start);
                const endDate = new Date(event.end);

                // Check if the event is all-day or spans the current hour
                if (event.isAllDay) {
                    return currentDay >= startDate && currentDay <= endDate;
                } else {
                    return startDate <= hourDate && endDate >= hourDate;
                }
            })
            .map(event => ({ title: event.title, color: event.color }));
    };

    return (
        <ScrollView className="flex-1 bg-white">
            {hours.map((time, index) => (
                <ScheduleItem key={index} time={time} activities={getActivitiesForTime(time)} />
            ))}
        </ScrollView>
    );
};

export default DailySchedule;
