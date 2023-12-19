import getBluetoothService, {
  requestBluetoothPermission,
} from '../services/BluetoothService';

const markAttendanceBLE = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const bluetoothService = getBluetoothService();
      const tokenBLE = await getMessageFromBLE(bluetoothService);
      bluetoothService.destroy();

      console.log(`send ${tokenBLE.data} to server`);
      resolve({
        status: 'success',
        message: 'Marked successfully',
        data: tokenBLE.data,
      });
    } catch (error) {
      reject(error);
    }
  });
};

const getMessageFromBLE = BluetoothService => {
  const serviceUUID = '1821';
  const characteristicUUID = '1822';
  const deviceIdentifiers = ['7C:70:DB:2D:D4:F7'];

  return new Promise(async (resolve, reject) => {
    const hasPermission = await requestBluetoothPermission();
    console.log(`hasPermission: ${hasPermission}`);
    if (!hasPermission) {
      reject({
        status: 'error',
        message: 'Permission has not been granted',
        error: '',
      });
    }

    try {
      const timeoutId = setTimeout(async () => {
        await BluetoothService.stopScan();
        console.log('Scan Stopped by timeout');
        reject({
          status: 'error',
          message: 'Device not found in scan',
          error: '',
        });
        return;
      }, 5000);
      console.log('Starting Scan');

      const {device} = await BluetoothService.startScan(
        serviceUUID,
        deviceIdentifiers,
      );
      BluetoothService.stopScan();
      console.log('Scan Stopped');
      clearTimeout(timeoutId);

      const res = await BluetoothService.connectAndReadCharacteristic(
        device,
        serviceUUID,
        characteristicUUID,
      );
      resolve(res);
    } catch (error) {
      reject(error);
    }
  });
};
export default markAttendanceBLE;
