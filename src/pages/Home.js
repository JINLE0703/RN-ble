import React, {useState, useEffect} from 'react';
import {StyleSheet, View, FlatList, Alert, Text} from 'react-native';
import {Button, Modal} from '@ant-design/react-native';
import ListItem from '../components/ListItem';

import {Ble} from '../untils/global';

export default function Home(props) {
  const {navigation} = props;
  const [bleList, setBleList] = useState([]); // 扫描的蓝牙列表
  const [isScaning, setIsScaning] = useState(false); // 是否正在扫描蓝牙
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    const stopScanListener = Ble.addListener(
      'BleManagerStopScan',
      handleStopScan,
    );
    return () => {
      stopScanListener.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * 处理扫描结束
   */
  const handleStopScan = () => {
    console.log('BleManagerStopScan');
    setIsScaning(false);
    // 获取扫描结果数组
    Ble.getDiscoveredPeripherals().then(res => {
      setBleList(res);
    });
  };

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
            Ble.enableBluetooth().then(() => {
              scan();
            });
          },
        },
      ]);
    }
  };

  /**
   * 连接设备
   * @param {*} id
   */
  const connect = id => {
    if (isScaning) {
      Ble.stopScan();
      setIsScaning(false);
    }
    setIsConnecting(true);
    Ble.connect(id).then(peripheralInfo => {
      setIsConnecting(false);
      // 跳转
      navigation.navigate('Detail', {
        peripheralInfo,
      });
    });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={bleList}
        renderItem={({item}) => <ListItem item={item} connect={connect} />}
        keyExtractor={item => item.id}
      />
      <Button
        type={isScaning ? 'warning' : 'primary'}
        onPress={scan}
        size="large"
        loading={isScaning}>
        {isScaning ? '正在扫描外围设备' : '扫描外围设备'}
      </Button>
      <Modal
        style={styles.modal}
        visible={isConnecting}
        transparent
        title="提示">
        <Text style={styles.modalText}>正在连接设备...</Text>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modal: {
    height: 100,
    width: 200,
    alignItems: 'center',
  },
  modalText: {
    marginTop: 15,
  },
});
