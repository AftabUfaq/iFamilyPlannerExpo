import {Text} from "react-native";
import {IEvent} from "../../interfeces/EventsInterfaces";

interface iCollectiveEventsProps {
    events : IEvent


}
export default function CollectiveEvents(props :iCollectiveEventsProps){





    return(
        <Text>

            {JSON.stringify(props.events)}

        </Text>

    )
}