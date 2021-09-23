import React from 'react'
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native'

import {
  InterfaceType,
  StarDeviceDiscoveryManager,
  StarDeviceDiscoveryManagerFactory,
  StarPrinter,
} from 'react-native-star-io10'

const App = () => {
  const isDarkMode = useColorScheme() === 'dark'

  return (
    <SafeAreaView>
      <View></View>
    </SafeAreaView>
  )
}

export default App
