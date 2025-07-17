// import LotsOfStyles from './screens/lotsOfStyle';
// import Flex from './screens/understandingFlex';

// const App = () => {
//   return (
//     <LotsOfStyles/>
//   );
// }

// export default App;


// In App.js in a new project

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignupScreen from './screens/SignUpScreen.js';
import LoginScreen from './screens/LoginScreen.js';
import MapScreen from './screens/MapScreen.js';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Map" component={MapScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
