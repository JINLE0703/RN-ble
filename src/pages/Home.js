import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';

import {Ble} from '../untils/global';

export default function Home(props) {
  const {navigation} = props;
  const [bleList, setBleList] = useState([]); // 扫描的蓝牙列表
  const [isScaning, setIsScaning] = useState(false); // 是否正在扫描蓝牙

  /**
   * 处理扫描事件
   */
  const scan = () => {
    if (isScaning) {
      Ble.stopScan();
      setIsScaning(false);
      return;
    }
    if (Ble.bleState === 'on') {
      Ble.scan().then(() => {
        setIsScaning(true);
      });
    } else {
      Ble.checkState();
      Alert.alert('提示', '请开启手机蓝牙', [
        {
          text: '取消',
        },
        {
          text: '打开',
          onPress: () => {
            Ble.enableBluetooth();
          },
        },
      ]);
    }
  };

  const renderItem = item => {
    let data = item.item;
    return (
      <View>
        <Text>{data}</Text>
        <Text>{data}</Text>
        <Text>{data}</Text>
        <Text>{data}</Text>
        <Text>{data}</Text>
        <Text>{data}</Text>
        <Text>{data}</Text>
        <Text>{data}</Text>
        <Text>{data}</Text>
        <Text>{data}</Text>
        <Text>{data}</Text>
        <Text>{data}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList data={bleList} renderItem={renderItem} />
      <TouchableOpacity onPress={scan}>
        <View style={styles.btn}>
          <Text>扫描蓝牙</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  btn: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ddd',
  },
});
