/* eslint-disable semi */
import React from 'react'
import {
  ListRenderItemInfo,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { isNil } from 'lodash'
import { StarPrinter } from 'react-native-star-io10'

interface Props {
  list: ListRenderItemInfo<StarPrinter>
  connectPrinter: () => Promise<void>
  disconnectPrinter: () => Promise<void>
  print: () => Promise<void>
}

export const PrinterCard = ({
  list,
  connectPrinter,
  disconnectPrinter,
  print,
}: Props) => {
  const starPrinter = list.item
  const printer = list.item.information
    ? list.item.information.reserved
    : undefined

  if (printer) {
    let conn = ''

    const ipAddress = printer.get('ipAddress')
    const address = printer.get('address')
    const bluetoothAddress = printer.get('bluetoothAddress')

    switch (true) {
      case !isNil(ipAddress):
        conn = ipAddress
        break

      case !isNil(address):
        conn = address
        break

      case !isNil(bluetoothAddress):
        conn = bluetoothAddress
        break
    }

    return (
      <View style={styles.printer_container}>
        <Text style={styles.printer_header_text}>Printer information</Text>

        <View style={styles.information_container}>
          <Text style={styles.information_text}>ip: {conn}</Text>
          <Text style={styles.information_text}>
            {`model: ${starPrinter.information
              ? starPrinter.information.model
              : 'could not find a model'
              }`}
          </Text>
          <Text style={styles.information_text}>
            {`emulator: ${starPrinter.information
              ? starPrinter.information.emulation
              : 'could not find an emulation'
              }`}
          </Text>
        </View>

        <View style={styles.buttons_container}>
          <View style={styles.button}>
            <TouchableOpacity
              onPress={() => {
                connectPrinter()
              }}>
              <Text>Connect</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.button}>
            <TouchableOpacity
              onPress={() => {
                disconnectPrinter()
              }}>
              <Text>Disconnect</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.button}>
            <TouchableOpacity
              onPress={() => {
                print()
              }}>
              <Text>Print</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  } else {
    return (
      <View style={styles.printer_container}>
        <Text>Printer not found</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  printer_container: {
    borderRadius: 12,
    borderColor: 'black',
    borderWidth: 1,
    width: '50%',
    padding: 12,
    marginBottom: 12,
  },
  printer_header_text: {
    fontSize: 12,
    marginBottom: 4,
  },
  information_container: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  information_text: {
    fontSize: 8,
    marginRight: 12,
  },
  buttons_container: {
    flexDirection: 'row',
  },
  button: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 4,
    padding: 8,
    marginRight: 16,
  },
})
