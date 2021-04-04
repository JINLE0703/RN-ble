import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
} from 'react-native';

import BleModule from './modules/BleModule';

const Ble = new BleModule();
global.Ble = Ble;

export default function App() {
  const [bleList, setBleList] = useState([]); // 扫描的蓝牙列表
  const [isConnected, setIsConnected] = useState(false); // 连接状态
  const [receiveData, setReceiveData] = useState([]); // 接收的数据的缓存列表

  /**
   * 初始化绑定监听器
   */
  useEffect(() => {
    Ble.start(); // 初始化蓝牙模块
    const updateStateListener = Ble.addListener(
      'BleManagerDidUpdateState',
      handleUpdateState,
    );
    const stopScanListener = Ble.addListener(
      'BleManagerStopScan',
      handleStopScan,
    );
    const discoverPeripheralListener = Ble.addListener(
      'BleManagerDiscoverPeripheral',
      handleDiscoverPeripheral,
    );
    const connectPeripheralListener = Ble.addListener(
      'BleManagerConnectPeripheral',
      handleConnectPeripheral,
    );
    const disconnectPeripheralListener = Ble.addListener(
      'BleManagerDisconnectPeripheral',
      handleDisconnectPeripheral,
    );
    const updateValueListener = Ble.addListener(
      'BleManagerDidUpdateValueForCharacteristic',
      handleUpdateValue,
    );
    return () => {
      updateStateListener.remove();
      stopScanListener.remove();
      discoverPeripheralListener.remove();
      connectPeripheralListener.remove();
      disconnectPeripheralListener.remove();
      updateValueListener.remove();
      if (isConnected) {
        Ble.disconnect();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * 处理蓝牙状态变化
   * @args state: on/off
   */
  const handleUpdateState = args => {
    console.log('BleManagerDidUpdateState', args);
  };

  /**
   * 处理扫描结束
   */
  const handleStopScan = () => {
    console.log('BleManagerStopScan');
    // 获取扫描结果数组
    Ble.getDiscoveredPeripherals().then(res => {
      setBleList(res);
    });
  };

  /**
   * 扫描发现新的外围设备
   * @param {id, name, rssi} args
   */
  const handleDiscoverPeripheral = args => {
    console.log('BleManagerDiscoverPeripheral', args);
  };

  /**
   * 处理连接外围设备
   */
  const handleConnectPeripheral = args => {
    console.log('BleManagerConnectPeripheral', args);
  };

  /**
   * 处理断开外围设备
   * @param {*} args
   */
  const handleDisconnectPeripheral = args => {
    console.log('BleManagerDisconnectPeripheral', args);
  };

  /**
   * 处理接收新数据
   * @param {*} data
   */
  const handleUpdateValue = data => {
    console.log('BleManagerDidUpdateValueForCharacteristic', data);
    const {value} = data;
    let str = Ble.byteToString(value);
    setReceiveData(prevData => [...prevData, str]);
  };

  /**
   * 扫描外围设备
   */
  const scan = () => {
    Ble.scan();
  };

  /**
   * 连接设备
   * @param {*}} id
   */
  const connect = id => {
    Ble.connect(id).then(info => {
      setIsConnected(true);
      Ble.startNotification();
      Ble.writeWithoutResponse('start');
    });
  };

  /**
   * 断开设备
   */
  const disconnect = () => {
    Ble.disconnect();
    setIsConnected(false);
  };

  /**
   * 读数据
   */
  const read = () => {
    Ble.read().then(readData => {
      Alert.alert(readData);
      console.log(readData);
    });
  };

  const renderItem = item => {
    let data = item.item;
    return (
      <View>
        <Text>id: {data.id}</Text>
        <Text>name: {data.name}</Text>
        <Text>rssi: {data.rssi}</Text>
        <TouchableOpacity
          onPress={() => {
            connect(data.id);
          }}>
          <View style={styles.btn}>
            <Text>connect</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={disconnect}>
          <View style={styles.btn}>
            <Text>disconnect</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={scan}>
        <View style={styles.btn}>
          <Text>scan</Text>
        </View>
      </TouchableOpacity>
      <FlatList data={bleList} renderItem={renderItem} />
      <Text>{receiveData.map(item => item)}</Text>
      <TouchableOpacity onPress={read}>
        <View style={styles.btn}>
          <Text>read</Text>
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
