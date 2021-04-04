import React, {useState, useEffect} from 'react';
import {View, Text} from 'react-native';

import {Ble} from '../untils/global';

export default function Detail(props) {
  const {route} = props;
  const peripheralInfo = route.params.peripheralInfo; // 已连接外围设备信息
  const [receiveData, setReceiveData] = useState([]); // 接收的数据的缓存列表

  useEffect(() => {
    const updateValueListener = Ble.addListener(
      'BleManagerDidUpdateValueForCharacteristic',
      handleUpdateValue,
    );
    return () => {
      updateValueListener.remove();
      disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * 处理接收新数据
   */
  const handleUpdateValue = data => {
    console.log('BleManagerDidUpdateValueForCharacteristic', data);
    // const {value} = data;
    // let str = Ble.byteToString(value);
    // setReceiveData(prevData => [...prevData, str]);
  };

  /**
   * 断开连接
   */
  const disconnect = () => {
    Ble.disconnect();
  };

  return (
    <View>
      <Text>1</Text>
    </View>
  );
}
