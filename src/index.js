import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {
  CardStyleInterpolators,
  createStackNavigator,
  HeaderStyleInterpolators,
} from '@react-navigation/stack';
import {Provider} from '@ant-design/react-native';
import Home from './pages/Home';
import Detail from './pages/Detail';

import {Ble} from './untils/global';

const Stack = createStackNavigator(); // 创建堆栈式导航器

export default function App() {
  /**
   * 初始化绑定监听器
   */
  useEffect(() => {
    Ble.start(); // 初始化蓝牙模块
    const updateStateListener = Ble.addListener(
      'BleManagerDidUpdateState',
      handleUpdateState,
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

    return () => {
      updateStateListener.remove();
      discoverPeripheralListener.remove();
      connectPeripheralListener.remove();
      disconnectPeripheralListener.remove();
      if (Ble.isConnected) {
        Ble.disconnect();
      }
    };
  }, []);

  /**
   * 处理蓝牙状态变化
   */
  const handleUpdateState = args => {
    console.log('BleManagerDidUpdateState', args);
    Ble.bleState = args.state;
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

  return (
    <Provider>
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
          <Stack.Screen
            name="Home"
            component={Home}
            options={{title: '设备列表'}}
          />
          <Stack.Screen
            name="Detail"
            component={Detail}
            options={{title: '采集列表'}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
