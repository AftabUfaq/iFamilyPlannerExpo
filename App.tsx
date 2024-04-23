import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import "moment/locale/da";
import { useEffect, useState } from "react";
import {
  Keyboard,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { PaperProvider } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import Calendar from "./component/Calendar/calender";
import Family from "./component/Familien/Family";
import TaskBoard from "./component/TaskBoard/TaskBoard";
import Setting from "./component/settiings/Setting";
import ToDay from "./component/toDay/toDay";
import { appState } from "./dbConnection/localData/manageData";
import { enableReactTracking } from "@legendapp/state/config/enableReactTracking";
enableReactTracking({
  auto: true,
});
function Hello() {
  const [systemSettingsLoaded, setSystemSettingsLoaded] =
    useState<boolean>(false);
  const users = appState.users.get();
  const calendarEvent = appState.calendarEvents.get();
  const todoEvent = appState.todoEvents.get();

  
  const [menuIndex, setMenu] = useState(0);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [screenSaverTimer, setScreenSaverTimer] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isScreenSaverActive, setScreenSaverActive] = useState(true);
  const systemColor = appState.systemSettings.get().systemColor;
  const screenSaverImage = appState.systemSettings.get().screensaverImage;
  
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

 
  function menu() {
    switch (menuIndex) {
      case 0:
        return (
          <Calendar
            systemColor={systemColor}
            users={users}
            calendarList={calendarEvent}
          />
        );
      case 1:
        return (
          <TaskBoard
            systemColor={systemColor}
            users={users}
            todoEvents={todoEvent}
          />
        );
      case 2:
        return <Setting systemColor={systemColor} users={users} />;
      case 3:
        return <ToDay systemColor={systemColor} />;
      case 4:
        return <Family systemColor={systemColor}></Family>;
      default:
        return null;
    }
  }
  return (
    <PaperProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar hidden={true} />

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
            <View className={"h-[60%]"}>{menu()}</View>
            {!isKeyboardVisible && (
              <View style={styles.navigation}>
                <TouchableOpacity
                  style={styles.navItem}
                  onPress={() => setMenu(0)}
                >
                  <Icon
                    name="calendar"
                    size={24}
                    color={menuIndex === 0 ? systemColor : "gray"}
                  />
                  <Text
                    className={"text-xl"}
                    style={menuIndex == 0 ? { color: systemColor } : {}}
                  >
                    Kalender
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.navItem}
                  onPress={() => setMenu(1)}
                >
                  <Icon
                    name="check"
                    size={24}
                    color={menuIndex === 1 ? systemColor : "gray"}
                  />
                  <Text
                    className={"text-xl"}
                    style={menuIndex == 1 ? { color: systemColor } : {}}
                  >
                    To Do
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.navItem}
                  onPress={() => setMenu(2)}
                >
                  <Icon
                    name="cog"
                    size={24}
                    color={menuIndex === 2 ? systemColor : "gray"}
                  />
                  <Text
                    style={menuIndex == 2 ? { color: systemColor } : {}}
                    className={"text-xl"}
                  >
                    Indstillinger
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.navItem}
                  onPress={() => setMenu(3)}
                >
                  <MaterialIcons
                    name="today"
                    size={24}
                    color={menuIndex === 3 ? systemColor : "gray"}
                  />
                  <Text
                    style={menuIndex == 3 ? { color: systemColor } : {}}
                    className={"text-xl"}
                  >
                    Idag
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.navItem}
                onPress={() => setMenu(4)}
                >
                  <AntDesign
                    name="heart"
                    size={24}
                    color={menuIndex === 4 ? systemColor : "gray"}
                  />
                  <Text
                    style={menuIndex == 4 ? { color: systemColor } : {}}
                    className={"text-xl"}
                  >
                    Familien
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  navigation: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    borderTopWidth: 1,
    borderTopColor: "black",
    shadowColor: "black",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderColor: "gray",
  },
  navItem: {
    alignItems: "center",
    width: "25%",
    padding: 10,
  },
  navText: {
    textAlign: "center",
    fontSize: 16,
  },
  screenSaver: {
    height: 800,
    width: 1500,
  },
});

export default Hello;
