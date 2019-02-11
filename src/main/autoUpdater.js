import { autoUpdater } from 'electron-updater';
import mainWindowEvent from './mainWindowEvent';

export default (ipcMain) => {
  autoUpdater.autoDownload = true;

  ipcMain.on(mainWindowEvent.confirmUpdate, (event) => {
    console.log('\n\n================');
    console.log(event);
    console.log('\n\n================');

    autoUpdater.quitAndInstall();
  });

  ipcMain.on(mainWindowEvent.updateOnNextOpen, () => {
    autoUpdater.autoInstallOnAppQuit = true;
  });

  ipcMain.on(mainWindowEvent.checkForUpdateEvent, (event) => {
    autoUpdater.on('checking-for-update', () => {
      console.log('\n\n=======================');
      console.log('Checking for update');
      console.log('\n\n=======================');
    });

    autoUpdater.on('update-available', (info) => {
      console.log('\n\n=======================');
      console.log('Update available');
      console.log(info);
      console.log('\n\n=======================');

      event.sender.send(mainWindowEvent.updateNotify, {
        isUpdateAvailable: true,
      });
    });

    autoUpdater.on('update-not-available', (info) => {
      console.log('\n\n=======================');
      console.log('Update not available');
      console.log(info);
      console.log('\n\n=======================');
    });

    autoUpdater.on('error', (error) => {
      console.log('\n\n=======================');
      console.log('Error checking for update');
      console.log(error);
      console.log('\n\n=======================');
    });

    autoUpdater.on('update-downloaded', (info) => {
      console.log('\n\n=======================');
      console.log('Update downloaded');
      console.log(info);
      console.log('\n\n=======================');

      event.sender.send(mainWindowEvent.updateNotify, {
        isUpdateReady: true,
      });
    });

    autoUpdater.checkForUpdates();
  });
};
