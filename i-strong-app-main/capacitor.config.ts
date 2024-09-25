import { CapacitorConfig } from '@capacitor/cli'
import { KeyboardResize, KeyboardStyle } from '@capacitor/keyboard';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'IStrong',
  webDir: 'out',
  server: {
    // Uncomment the URL you want to use

    // Development
    // url: 'http://192.168.178.54:3000/', // Denis

    // Staging
    url: 'https://i-strong-app.vercel.app',
    // allowNavigation: [
    //   'i-strong-app.vercel.app', // Разрешенные домены для навигации
    //   'front.istrongapp.com',
    // ],
    // Production
    // url: 'https://front.istrongapp.com', // Production

    cleartext: true, // Allow cleartext traffic if needed (generally not recommended for production)
  },
  plugins: {
    LocalNotifications: {
      // smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#F25B48',
      sound: 'beep.wav',
    },
    // Keyboard: {
    //   resize: KeyboardResize.Body,
    //   style: KeyboardStyle.Dark,
    //   resizeOnFullScreen: true,
    // },
  },
  // android: {
  //   // allowMixedContent: true, // Allows loading HTTP content in WebView
  //   // webContentsDebuggingEnabled: true, // Enable WebView debugging, useful during development
  // },
  // ios: {
  //   contentInset: 'always', // Adjusts the content inset behavior on iOS
  //   backgroundColor: '#ffffff', // Set background color
  // },
  // Additional configurations can be added here
}

export default config
