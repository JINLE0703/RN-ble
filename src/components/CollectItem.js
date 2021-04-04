import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

export default function CollectItem(props) {
  const {item} = props;
  return (
    <View style={styles.container}>
      <Text>压力值为：{item.value}</Text>
      <Text style={styles.time}>{item.time}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
  },
  time: {
    fontSize: 12,
    color: '#BEBEBE',
  },
});
