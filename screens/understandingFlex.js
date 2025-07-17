import React from 'react';
import {StyleSheet, View, ScrollView, Image} from 'react-native';

const Flex = () => {
  return (
    <View
      style={[styles.container, {                 
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          rowGap: 20,
        //   columnGap: 5,
        }]}>
      <View style={[styles.box,{backgroundColor: 'red',}]} />
      <View style={[styles.box,{backgroundColor: 'darkorange',}]} />
      <View style={[styles.box,{backgroundColor: 'green'}]} />
      <View style={[styles.box,{backgroundColor: 'lightgreen'}]} />
      <View style={[styles.box,{backgroundColor: 'yellow',}]} />
      <View style={[styles.box,{backgroundColor: 'grey',}]} />
      <View style={[styles.box,{backgroundColor: 'purple',}]} />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  box: {
    width: 200,
    height: 200,
    // flex: 1,
  },
});

export default Flex;