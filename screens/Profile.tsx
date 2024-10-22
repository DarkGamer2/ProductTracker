import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/theme/ThemeContext';
import Colors from '../context/theme/Colors';
import { SafeAreaView, ScrollView } from 'react-native';
import { colors } from '../constants/colors';
import {
  NavigationProp,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';

type ThemeType = keyof typeof Colors;

type Props = {
  navigation: NavigationProp<ParamListBase>;
  route: RouteProp<ParamListBase>;
};

const Profile = ({ navigation, route }: Props) => {
  const { theme } = useTheme();
  const profileStyles = styling(theme);
  const { _id } = route.params as { _id: string }; // Get the _id from navigation parameters
  const [profileData, setProfileData] = useState<any>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isValidObjectId = (id: string) => /^[0-9a-fA-F]{24}$/.test(id); // MongoDB ObjectId validation

  const getData = async () => {
    if (!isValidObjectId(_id)) {
      setError('Invalid User ID');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`https://product-tracker-api-production.up.railway.app/api/users/${_id}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setProfileData(data);
      if (data.profileImage) {
        setProfileImage(data.profileImage); // Set profile image if available
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [_id]); // Trigger useEffect when _id changes

  const handleImagePicker = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorCode);
      } else if (response.assets && response.assets.length > 0) {
        const imageUri = response.assets[0].uri;
        if (imageUri) {
          setProfileImage(imageUri); // Set the selected image as profile image
          // Optionally, upload the selected image to your server here
        }
      }
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={profileStyles.container}>
        <Text style={profileStyles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={profileStyles.container}>
        <Text style={profileStyles.errorText}>{error}</Text>
        <Pressable style={profileStyles.goBackButton} onPress={() => navigation.goBack()}>
          <Text style={profileStyles.goBackButtonText}>Go Back</Text>
        </Pressable>
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
              <Image
                source={profileImage ? { uri: profileImage } : require('../assets/defaultProfilePic.jpg')}
                style={profileStyles.profilePic}
              />
              <Pressable style={profileStyles.changePicButton} onPress={handleImagePicker}>
                <Text style={profileStyles.changePicButtonText}>Change Picture</Text>
              </Pressable>
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
    fontFamily: 'BebasNeue-Regular',
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
    fontFamily: 'Lato-Regular',
    alignSelf: 'center',
    margin: 10,
  },
  loadingText: {
    color: Colors[theme]?.textColor,
    fontSize: 20,
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  changePicButton: {
    backgroundColor: colors.blue,
    padding: 10,
    borderRadius: 5,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  changePicButtonText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: 'BebasNeue-Regular',
  },
});