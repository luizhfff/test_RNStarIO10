import React from 'react'
import { SafeAreaView, StyleSheet, useColorScheme, View } from 'react-native'

import { DiscoverContainer } from './Discover/DiscoverContainer'

const App = () => {
  const isDarkMode = useColorScheme() === 'dark'

  return (
    <SafeAreaView>
      <View style={styles.view_main}>
        <DiscoverContainer />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  view_main: {
    padding: 16,
    height: '100%',
  },
})

export default App
