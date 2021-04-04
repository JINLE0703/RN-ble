import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, TextInput, Switch} from 'react-native';
import CollectList from '../components/CollectList';
import {Button} from '@ant-design/react-native';

import {Ble} from '../untils/global';

export default function Detail(props) {
  const {route} = props;
  const peripheralInfo = route.params.peripheralInfo; // 已连接外围设备信息
  const [receiveData, setReceiveData] = useState([]); // 接收的数据的缓存列表
  const [intervalTime, setIntervalTime] = useState('1000'); // 间隔时间
  const [mode, setMode] = useState('notify'); // 模式 notify or read

  useEffect(() => {
    const updateValueListener = Ble.addListener(
      'BleManagerDidUpdateValueForCharacteristic',
      handleUpdateValue,
    );
    return () => {
      updateValueListener.remove();
      disconnect();
    };
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

  /**
   * 处理时间间隔变化
   */
  const handleChangeText = text => {
    setIntervalTime(text);
  };

  /**
   * 处理模式更改
   */
  const handleToggleMode = () => {
    setMode(prevMode => (prevMode === 'notify' ? 'read' : 'notify'));
  };

  return (
    <View style={styles.container}>
      <CollectList data={receiveData} />
      <View style={styles.control}>
        <View style={styles.btnWrapper}>
          <Button type="primary" size="large">
            开启采集
          </Button>
        </View>
        <View style={styles.textInputWrapper}>
          <Text>采集间隔：</Text>
          <TextInput
            style={styles.textInput}
            value={intervalTime}
            onChangeText={handleChangeText}
          />
          <Text>ms</Text>
        </View>
        <View style={styles.switchWrapper}>
          <Text>主动模式</Text>
          <Switch
            value={mode === 'read'}
            onValueChange={handleToggleMode}
            trackColor={{false: '#D3EAFB', true: '#9FD2F6'}}
            thumbColor="#108EE9"
          />
          <Text>响应模式</Text>
        </View>
        <View style={styles.btnWrapper}>
          <Button type="primary" size="large" disabled={mode === 'notify'}>
            读取
          </Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
  },
  control: {
    height: 200,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 4,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignContent: 'space-around',
    paddingLeft: 20,
    paddingRight: 20,
    flexWrap: 'wrap',
  },
  btnWrapper: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInputWrapper: {
    height: 100,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  textInput: {
    height: 36,
    width: 40,
    borderColor: '#ddd',
    borderBottomWidth: 1,
    marginLeft: 5,
    marginRight: 5,
  },
  switchWrapper: {
    height: 100,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
});
