import { useState } from "react";
import { View, Text, Switch } from "react-native";




const DateSelector = ({}) => {


    const [ color, setColor ] = useState('pink');
    const [isEnabled, setIsEnabled] = useState(false);

    const toggleSwitch = () => {
        setIsEnabled(previousState => !previousState);
        color === "pink" ? setColor("blue") : setColor("pink");
      };


    return (
        <View>
            <Switch
                trackColor={{false: '#ffb0ff', true: '#81b0ff'}}
                thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
                onValueChange={toggleSwitch}
                value={isEnabled}
            /> 
            {/* <Text className="text-lg text-blue-500">This is a conditional component!</Text> */}
            {isEnabled ? (
                <Text className="text-lg text-blue-500">This is a conditional component!</Text>
            ) : null}
        </View>
    );
  };
  
  export default DateSelector;
  