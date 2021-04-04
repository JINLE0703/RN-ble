import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {Button} from '@ant-design/react-native';

export default function BleItem(props) {
  const {item, connect} = props;

  const handlePress = () => {
    connect(item.id);
  };

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Text style={styles.rssi}>{item.rssi}db</Text>
      </View>
      <View style={styles.middle}>
        <Text style={styles.name}>{item.name || '没有名称'}</Text>
        <Text style={styles.id}>{item.id}</Text>
      </View>
      <View style={styles.right}>
        <Button type="primary" onPress={handlePress}>
          连接
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 70,
    margin: 5,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  left: {
    width: '25%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  middle: {
    flex: 1,
  },
  right: {
    width: '30%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rssi: {
    fontSize: 20,
    fontWeight: '700',
  },
  name: {
    fontSize: 16,
  },
  id: {
    fontSize: 12,
    color: '#696969',
  },
});
