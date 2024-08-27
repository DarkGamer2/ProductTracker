import { NavigatorScreenParams } from '@react-navigation/native';

export type BottomTabNavigatorParams = {
  Home: undefined; // No parameters expected for Home
  Profile: { userId: string }; // Example of passing parameters
  // Add other tab routes here
};

export type StackNavigatorParams = {
  BottomTabNavigator: NavigatorScreenParams<BottomTabNavigatorParams>;
  // Define other stack routes here if necessary
};
