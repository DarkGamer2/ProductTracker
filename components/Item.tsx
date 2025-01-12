import { StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';
import Colors from '../context/theme/Colors';
import { useTheme } from '../context/theme/ThemeContext';

type ThemeType = keyof typeof Colors;

const Item = (props: any) => {
  const { theme } = useTheme();

  const styles = styling(theme);
  return (
    <View style={styles.container}>
      <Image source={{ uri: props.image }} style={styles.itemImage} />
      <View>
        <Text style={styles.itemTitle}>{props.title || 'Item'}</Text>
        <Text style={styles.price}>${props.price || 0}</Text>
      </View>
    </View>
  );
};

export default Item;

const styling = (theme: ThemeType) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    itemImage: {
      width: 50,
      height: 50,
      marginRight: 10,
    },
    // details: {
    //   flex: 1,
    // },
    itemTitle: {
      fontFamily: 'Roboto-Regular',
      fontSize: 16,
      fontWeight: 'bold',
      marginRight: 10,
      color: Colors[theme]?.textColor,
    },
    price: {
      fontSize: 14,
      color: Colors[theme]?.textColor,
      marginTop: 5,
      fontFamily: 'Lato-Italic',
    },
  });