import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/theme/ThemeContext';
import Colors from '../context/theme/Colors';
import { SafeAreaView, ScrollView } from 'react-native';
import { colors } from '../constants/colors';
import ProfilePic from "../assets/images/Male.jpg"; // Ensure this path is correct and the image exists
import {
  NavigationProp,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';

type ThemeType = keyof typeof Colors;

type Props = {
  navigation: NavigationProp<ParamListBase>;
  route: RouteProp<ParamListBase>;
};

const Profile = ({ navigation, route }: Props) => {
  const { theme } = useTheme();
  const profileStyles = styling(theme);
  const { _id } = route.params as { _id: string }; // Get the _id from navigation parameters// Get the _id from navigation parameters
    const [profileData, setProfileData] = useState<any>(null);

    const getData = async () => {
        try {
          const response = await fetch(`https://product-tracker-api-production.up.railway.app/api/users/${_id}`);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setProfileData(data); // Store the fetched data
        } catch (error) {
          console.error('Error fetching profile data:', error);
        }
      };
    
      useEffect(() => {
        getData();
      }, [_id]); // Trigger useEffect when _id changes
    useEffect(() => {
      getData();
    }, [_id]); // Trigger useEffect when _id changes
  
    if (!profileData) {
      return (
        <SafeAreaView style={profileStyles.container}>
          <Text style={profileStyles.loadingText}>Loading...</Text>
        </SafeAreaView>
      );
    }

  return (
    <SafeAreaView style={profileStyles.container}>
      <ScrollView>
        <View style={profileStyles.centered}>
          <Text style={profileStyles.profileText}>Profile</Text>
        </View>
        <View>
          <View>
            <View>
              <Image source={ProfilePic} style={profileStyles.profilePic} />
            </View>
            <View>
              <Text style={profileStyles.profilePicInfo}>{profileData.username}</Text>
              <Text style={profileStyles.profilePicInfo}>{profileData.email}</Text>
              {/* Render additional profile data here */}
              <Text style={profileStyles.profilePicInfo}>{profileData.fullName}</Text>
              <Text style={profileStyles.profilePicInfo}>{profileData.phoneNumber}</Text>
            </View>
          </View>
          <Pressable style={profileStyles.goBackButton} onPress={() => navigation.goBack()}>
            <Text style={profileStyles.goBackButtonText}>Go Back</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;

const styling = (theme: ThemeType) => StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: Colors[theme]?.backgroundColor,
  },
  centered: {
    alignItems: 'center',
  },
  profileText: {
    color: Colors[theme]?.textColor,
    fontSize: 20,
    fontWeight: 'bold',
  },
  goBackButton: {
    backgroundColor: colors.pink,
    padding: 10,
    borderRadius: 5,
    margin: 10,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goBackButtonText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: "BebasNeue-Regular",
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    margin: 10,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: colors.black,
  },
  profilePicInfo: {
    color: Colors[theme]?.textColor,
    fontSize: 16,
    fontFamily: "Lato-Regular",
    alignSelf: 'center',
    margin: 10,
  },
  loadingText: {
    color: Colors[theme]?.textColor,
    fontSize: 20,
    textAlign: 'center',
    marginTop: 20,
  },
});