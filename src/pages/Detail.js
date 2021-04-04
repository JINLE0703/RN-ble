import React from 'react';
import {View, Text} from 'react-native';

export default function Detail(props) {
  const {route} = props;
  const {params} = route; // 跳转传参
  return (
    <View>
      <Text>hello detail {params.id}</Text>
    </View>
  );
}
