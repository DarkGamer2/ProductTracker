import {SafeAreaView, Text, TextInput, View} from 'react-native';
import { useState } from 'react';
const Welcome = () => {
    const [companyName, setCompanyName] = useState('');
  return (
    <SafeAreaView>
      <Text>Company Configuration</Text>

      <View>
        <Text>Company Name:</Text>
        <TextInput></TextInput>
      </View>
    </SafeAreaView>
  );
};

export default Welcome;
