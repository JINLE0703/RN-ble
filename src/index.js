import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {
  CardStyleInterpolators,
  createStackNavigator,
  HeaderStyleInterpolators,
} from '@react-navigation/stack';
import Home from './pages/Home';
import Detail from './pages/Detail';

import {Ble} from './untils/global';

const Stack = createStackNavigator(); // 创建堆栈式导航器

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
    Ble.bleState = args.state;
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
   */
  const handleDisconnectPeripheral = args => {
    console.log('BleManagerDisconnectPeripheral', args);
  };

  /**
   * 处理接收新数据
   */
  const handleUpdateValue = data => {
    console.log('BleManagerDidUpdateValueForCharacteristic', data);
    // const {value} = data;
    // let str = Ble.byteToString(value);
    // setReceiveData(prevData => [...prevData, str]);
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        headerMode="float"
        screenOptions={{
          headerTitleAlign: 'center', // 头部标签居中
          headerStyleInterpolator: HeaderStyleInterpolators.forUIKit, // 头部返回动画
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, // 主题返回动画
          gestureEnabled: true, // 开启手势
          gestureDirection: 'horizontal', // 手势方向
        }}>
        <Stack.Screen name="蓝牙列表" component={Home} />
        <Stack.Screen name="Detail" component={Detail} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
