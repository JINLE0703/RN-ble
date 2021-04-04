import {NativeModules, NativeEventEmitter} from 'react-native';
import BleManager from 'react-native-ble-manager';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

export default class BleModule {
  constructor() {
    this.isConnecting = false; // 蓝牙是否处于连接状态
    this.bleState = 'off'; // 蓝牙打开状态
    this.peripheralId = null; // 当前连接设备id
    this.serviceUUID = null;
    this.characteristicUUID = null;
  }

  /**
   * 添加监听器
   * @param {*} event 监听事件
   * @param {*} fnc 回调函数
   * @returns
   * BleManagerStopScan：扫描结束监听
   * BleManagerDiscoverPeripheral：扫描到一个新设备
   * BleManagerDidUpdateState：蓝牙状态改变
   * BleManagerDidUpdateValueForCharacteristic：接收到新数据
   * BleManagerConnectPeripheral：蓝牙设备已连接
   * BleManagerDisconnectPeripheral：蓝牙设备已断开连接
   */
  addListener(event, fnc) {
    return bleManagerEmitter.addListener(event, fnc);
  }

  /**
   * 初始化蓝牙模块
   */
  start() {
    BleManager.start({showAlert: false})
      .then(() => {
        this.checkState();
        console.log('Init BLE success');
      })
      .catch(err => {
        console.log('Init BLE fail: ', err);
      });
  }

  /**
   * 强制检查蓝牙状态，会触发 BleManagerDidUpdateState 事件
   */
  checkState() {
    BleManager.checkState();
  }

  /**
   * 扫描可用设备，5秒结束
   * 触发 BleManagerDiscoverPeripheral 事件
   * @returns
   */
  scan() {
    return new Promise((resolve, reject) => {
      BleManager.scan([], 5, true)
        .then(() => {
          console.log('Scan start');
          resolve();
        })
        .catch(err => {
          console.log('Scan start fail: ', err);
          reject();
        });
    });
  }

  /**
   * 停止扫描
   */
  stopScan() {
    BleManager.stopScan()
      .then(() => {
        console.log('Scan Stop');
      })
      .catch(err => {
        console.log('Scan stop fail: ', err);
      });
  }

  /**
   * 获取扫描结果
   * @returns 扫描外围设备数组
   */
  getDiscoveredPeripherals() {
    return new Promise((resolve, reject) => {
      BleManager.getDiscoveredPeripherals([])
        .then(peripheralsArray => {
          console.log('getDiscoveredPeripherals: ', peripheralsArray);
          resolve(peripheralsArray);
        })
        .catch(err => {
          console.log('getDiscoveredPeripherals fail: ', err);
        });
    });
  }

  /**
   * 连接设备
   * @param {*} id
   * @returns
   */
  connect(id) {
    this.isConnecting = true; // 当前蓝牙正在连接
    return new Promise((resolve, reject) => {
      BleManager.connect(id)
        .then(() => {
          console.log('Connect success');
          return BleManager.retrieveServices(id); // 扫描连接设备服务和特征
        })
        .then(peripheralInfo => {
          console.log('Connect Peripheral info: ', peripheralInfo);
          this.peripheralId = peripheralInfo.id;
          this.getUUID(peripheralInfo); // 获取UUID
          this.isConnecting = false; // 蓝牙连接结束
          resolve(peripheralInfo);
        })
        .catch(err => {
          console.log('Connect fail: ', err);
          this.isConnecting = false; // 蓝牙连接结束
          reject(err);
        });
    });
  }

  /**
   * 断开外围设备
   */
  disconnect() {
    BleManager.disconnect(this.peripheralId)
      .then(() => {
        console.log('disconnect success');
        this.peripheralId = null;
        this.serviceUUID = null;
        this.characteristicUUID = null;
      })
      .catch(err => {
        console.log('disconnect fail: ', err);
      });
  }

  /**
   * 获取UUID
   * Notify、Read、Write、WriteWithoutResponse的serviceUUID和characteristicUUID
   */
  getUUID(peripheralInfo) {
    for (let item of peripheralInfo.characteristics) {
      item.service = this.fullUUID(item.service);
      item.characteristic = this.fullUUID(item.characteristic);
      // 寻找目标服务
      if (
        item.properties.Notify === 'Notify' &&
        item.properties.Read === 'Read' &&
        item.properties.WriteWithoutResponse === 'WriteWithoutResponse'
      ) {
        this.serviceUUID = item.service;
        this.characteristicUUID = item.characteristic;
      }
    }
  }

  /**
   * 格式化UUID
   * @param {*} uuid
   * @returns
   */
  fullUUID(uuid) {
    if (uuid.length === 4) {
      return '0000' + uuid.toUpperCase() + '-0000-1000-8000-00805F9B34FB';
    }
    if (uuid.length === 8) {
      return uuid.toUpperCase() + '-0000-1000-8000-00805F9B34FB';
    }
    return uuid.toUpperCase();
  }

  /**
   * 开启监听通知
   * @returns
   */
  startNotification() {
    return new Promise((resolve, reject) => {
      BleManager.startNotification(
        this.peripheralId,
        this.serviceUUID,
        this.characteristicUUID,
      )
        .then(() => {
          console.log('Notification started');
          resolve();
        })
        .catch(err => {
          console.log('Notification fail: ', err);
          reject(err);
        });
    });
  }

  /**
   * 停止监听通知
   */
  stopNotification() {
    BleManager.stopNotification(
      this.peripheralId,
      this.serviceUUID,
      this.characteristicUUID,
    )
      .then(() => {
        console.log('Notification stop success');
      })
      .catch(err => {
        console.log('Notification stop fail: ', err);
      });
  }

  /**
   * 读取数据
   * @returns
   */
  read() {
    return new Promise((resolve, reject) => {
      BleManager.read(
        this.peripheralId,
        this.serviceUUID,
        this.characteristicUUID,
      )
        .then(readData => {
          const parsedData = this.byteToString(readData);
          console.log('Read: ', parsedData);
          resolve(parsedData);
        })
        .catch(err => {
          console.log('Read fail: ', err);
          reject(err);
        });
    });
  }

  /**
   * 写数据进设备，没有响应
   * @param {*} data
   * @returns
   */
  writeWithoutResponse(data) {
    return new Promise((resolve, reject) => {
      BleManager.writeWithoutResponse(
        this.peripheralId,
        this.serviceUUID,
        this.characteristicUUID,
        this.stringToByte(data),
      )
        .then(() => {
          console.log('Write success: ', data);
          resolve();
        })
        .catch(err => {
          console.log('Write fail:', data);
          reject(err);
        });
    });
  }

  /**
   * 请求激活蓝牙
   */
  enableBluetooth() {
    BleManager.enableBluetooth()
      .then(() => {
        console.log('The bluetooth is already enabled or the user confirm');
      })
      .catch(err => {
        console.log('The user refuse to enable bluetooth: ', err);
      });
  }

  /**
   * ASCII转字符串
   */
  byteToString(arr) {
    let str = '';
    arr.map(item => {
      str += String.fromCharCode(item);
    });
    return str;
  }

  /**
   * 字符串转ASCII
   */
  stringToByte(str) {
    let arr = [];
    for (let char of str) {
      arr.push(char.charCodeAt());
    }
    console.log(arr);
    return arr;
  }
}
