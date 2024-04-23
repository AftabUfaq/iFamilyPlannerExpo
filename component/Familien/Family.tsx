import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import moment from "moment/moment";
import React, { useEffect, useState } from "react";
import mealData from "../../assets/jsonFiler/danishFood.json";

import {
  MouseMemoirs_400Regular,
  useFonts,
} from "@expo-google-fonts/mouse-memoirs";

import { appState } from "../../dbConnection/localData/manageData";

interface familyProps {
  systemColor: string;
}

export default function Family(props: familyProps) {
  const [familyName, setFamilyName] = useState<string>(
    appState.systemSettings.get().familyName
  );
  const [eventPoints, setPoints] = useState<number>(0);
  const [editMode, setEditMode] = useState(false);
  const [data, setData] = useState([]);
  const [currentSuggestions, setCurrentSuggestions] = useState([]);

  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const todoEvents = appState.todoEvents.get();
  const users = appState.users.get();
  const mealPlan = appState.mealPlan.get();

  const updateSuggestions = (text) => {
    setInput(text);
    const allMeals = [
      ...mealData.breakfast,
      ...mealData.lunch,
      ...mealData.dinner,
    ];
    const filtered = allMeals.filter((meal) =>
      meal.toLowerCase().includes(text.toLowerCase())
    );
    setSuggestions(filtered);
  };

  useEffect(() => {
    setData(appState.mealPlan.get());
    const fetchEventData = async () => {
      try {
        // Define totalPoints variable
        let totalPoints = 0;

        todoEvents.forEach((element) => {
          if (
            element.eventPoints !== null &&
            element.eventDone &&
            new Date(element.eventDoneDate).getFullYear() ===
              new Date().getFullYear()
          ) {
            totalPoints += parseInt(element.eventPoints, 10); // Ensure to parse as integer with base 10
          }
        });

        // Set the total points
        setPoints(totalPoints);
      } catch (error) {
        console.error("Error fetching event data:", error);
      }
    };

    // Call fetchEventData
    fetchEventData();
  }, []);

  let [fontsLoaded] = useFonts({
    MouseMemoirs_400Regular,
  });

  const handleInputChange = (day, mealType, text) => {
    // Update the meal plan data
    const newData = data.map((item) => {
      if (item.day === day) {
        return { ...item, [mealType]: text };
      }
      return item;
    });
    setData(newData);

    // Filter suggestions for auto-complete
    if (editMode) {
      const suggestions = mealData[mealType].filter((meal) =>
        meal.toLowerCase().includes(text.toLowerCase())
      );
      setCurrentSuggestions(suggestions);
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  function clearMealPlan() {
    const newList = data.map((item) => ({
      ...item,
      breakfast: "",
      lunch: "",
      dinner: "",
    }));

    setData(newList);
  }

  function saveMealPlan() {
    setEditMode(false);
    appState.mealPlan.set(data);
  }

  return (
    <View className={"flex flex-col"}>
      <View
        className={
          "flex flex-row mt-10 border-b border-b-gray-200 justify-evenly space-x-[900]"
        }
      >
        <Text style={{ color: props.systemColor }} className={"text-3xl ml-10"}>
          {familyName.toUpperCase()}
        </Text>
        <Text style={{ color: props.systemColor }} className={"text-3xl ml-10"}>
          {moment().format("LT")}
        </Text>
      </View>

      <View className={"flex flex-row space-x-20"}>
        <View className={"ml-20 mt-2  w-[300] "}>
          <Text className={"text-2xl"}>PERSONER</Text>

          <View className={"flex flex-col space-y-4 mt-6 "}>
            {users.map((user, index) => (
              <View key={index} className={"space-x-4 flex-row flex "}>
                <View>
                  <Image
                    className={"w-20 h-20"}
                    source={{ uri: user.avatarString }}
                  />
                </View>
                <View className={"flex flex-col"}>
                  <View>
                    <Text
                      className={"text-3xl"}
                      style={{
                        fontFamily: "MouseMemoirs_400Regular",
                        color: user.color,
                      }}
                    >
                      {user.name}
                    </Text>
                  </View>
                  <View className={"flex flex-row"}>
                    <Text style={{ fontSize: 16, color: user.color }}>
                      Fødselsdag:{" "}
                    </Text>
                    <Text
                      className={"text"}
                      style={{
                        fontSize: 16,
                        fontWeight: "bold",
                        color: user.color,
                      }}
                    >
                      d. {moment(new Date(user.birthDay)).format("LL")}
                    </Text>
                  </View>

                  <View className={"flex flex-row"}>
                    <Text style={{ fontSize: 16, color: user.color }}>
                      Livret:{" "}
                    </Text>
                    <Text
                      className={"text"}
                      style={{
                        fontSize: 16,
                        fontWeight: "bold",
                        color: user.color,
                      }}
                    >
                      {user.favoriteFood}
                    </Text>
                  </View>
                  <View className={"flex flex-row"}>
                    <Text style={{ fontSize: 16, color: user.color }}>
                      Points for ugen :{" "}
                    </Text>
                    <Text
                      className={"text"}
                      style={{
                        fontSize: 16,
                        fontWeight: "bold",
                        color: user.color,
                      }}
                    >
                      {user.weeklyTotalPoints}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
        <View className={" flex flex-col "}>
          <View className={"flex flex-row justify-evenly space-x-2 "}>
            <View>
              <Text className={"text-3xl"}>MÅLTIDSPLAN FOR UGEN</Text>
            </View>
            <View className={"flex flex-row space-x-2"}>
              <View>
                <TouchableOpacity
                  onPress={() =>
                    editMode ? saveMealPlan() : setEditMode(true)
                  }
                >
                  <View
                    className={"p-3 w-32 text-center rounded-3xl h-12"}
                    style={{ backgroundColor: props.systemColor }}
                  >
                    <Text className={"text-center"}>
                      {editMode ? "Gem" : "rediger"}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
              {editMode ? (
                <View>
                  <TouchableOpacity onPress={() => clearMealPlan()}>
                    <View
                      className={
                        "p-3 w-32 text-center rounded-3xl h-12 bg-red-500"
                      }
                    >
                      <Text className={"text-center text-white"}>
                        Ryd MadPlan
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
          </View>
          <ScrollView className={"w-max h-max"}>
            {data.map((item, index) => (
              <View
                key={`${index}`}
                className="flex flex-row space-x-2 space-y-1 justify-center items-center "
              >
                <View className={" w-12 justify items-center "}>
                  <Text className="text-xl font-semibold">{item.day}</Text>
                </View>
                <View className="flex-row  flex justify-end p-1   ">
                  <TextInput
                    className={
                      editMode
                        ? "bg-gradient-to-r from-indigo-500 border-black border-2  text-black p-2 rounded-2xl ml-2 text-center  w-40 "
                        : "bg-gray-300  p-2 rounded-2xl ml-2 text-center  w-40 "
                    }
                    onChangeText={(text) =>
                      handleInputChange(item.day, "breakfast", text)
                    }
                    editable={editMode}
                    placeholder="Morgenmad"
                    value={item.breakfast}
                  ></TextInput>

                  <TextInput
                    className={
                      editMode
                        ? "bg-gradient-to-r from-indigo-500 border-black border-2  text-black p-2 rounded-2xl ml-2 text-center  w-40 "
                        : "bg-gray-300  p-2 rounded-2xl ml-2 text-center  w-40 "
                    }
                    onChangeText={(text) =>
                      handleInputChange(item.day, "lunch", text)
                    }
                    editable={editMode}
                    value={item.lunch}
                    placeholder="Frokost"
                  />

                  <TextInput
                    className={
                      editMode
                        ? "bg-gradient-to-r from-indigo-500 border-black border-2  text-black p-2 rounded-2xl ml-2 text-center  w-40 "
                        : "bg-gray-300  p-2 rounded-2xl ml-2 text-center  w-40 "
                    }
                    onChangeText={(text) =>
                      handleInputChange(item.day, "dinner", text)
                    }
                    editable={editMode}
                    value={item.dinner}
                    placeholder="Aftensmad"
                  />
                </View>
              </View>
            ))}
          </ScrollView>

          <View className={""}>
            <View>
              <Text className={"text-2xl"}>POINTS SAMLET I ÅR</Text>
            </View>
            <View
              style={{ backgroundColor: props.systemColor, height: 100 }}
              className={"  flex flex-row mt-2 rounded-2xl p-1"}
            >
              <Image
                className={"h-10 w-10"}
                source={require("../../assets/starPng.png")}
              ></Image>
              <View className={"justify-evenly items-center flex-1"}>
                <Text className={"text-3xl text-center mt-4"}>
                  {eventPoints} POINTS
                </Text>
                <Image
                  className={"h-10 w-10 ml-[470]"}
                  source={require("../../assets/starPng.png")}
                ></Image>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
