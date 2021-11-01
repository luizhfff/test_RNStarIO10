import { isNil } from 'lodash'
import React from 'react'
import {
  FlatList,
  ListRenderItem,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import {
  StarConnectionSettings,
  StarPrinter,
  StarXpandCommand,
} from 'react-native-star-io10'
import RNFS, { MainBundlePath } from 'react-native-fs'
import { sleep } from '../../lib/helpers'

interface Props {
  printers: StarPrinter[]
  imageBase64?: string
}

const createReceipt = async () => {
  // For iOS
  const blob = await RNFS.readFile(
    MainBundlePath + '/assets/src/Images/basic-logo_300x300.png',
    'base64',
  )
  const str = `data:image/png;base64,${blob}`

  const builder = new StarXpandCommand.StarXpandCommandBuilder()

  builder.addDocument(
    new StarXpandCommand.DocumentBuilder().addPrinter(
      new StarXpandCommand.PrinterBuilder()
        .styleAlignment(StarXpandCommand.Printer.Alignment.Center)

        .actionPrintImage(new StarXpandCommand.Printer.ImageParameter(str, 120))

        .actionFeedLine(1)

        .actionCut(StarXpandCommand.Printer.CutType.Partial),
    ),
  )

  const commands = await builder.getCommands()

  return commands
}

const print = async (printer: StarPrinter) => {
  await disconnectPrinter(printer)

  const settings = new StarConnectionSettings()

  settings.interfaceType = printer.connectionSettings.interfaceType
  settings.identifier = printer.connectionSettings.identifier

  printer = new StarPrinter(settings)

  try {
    console.log('-----> print')
    await printer.open()
    const commands = await createReceipt()

    await printer.print(commands)
  } catch (error) {
    console.log(`Error: ${String(error)}`)
  } finally {
    await disconnectPrinter(printer)
  }
}

const listenPrinter = async (printer: StarPrinter) => {
  await disconnectPrinter(printer)

  const settings = new StarConnectionSettings()

  settings.interfaceType = printer.connectionSettings.interfaceType
  settings.identifier = printer.connectionSettings.identifier

  printer = new StarPrinter(settings)

  try {
    console.log('-----> listenPrinter')

    await printer.open()
    const status = await printer.getStatus()
    console.log('--- status ---')
    console.log(status)

    console.log(`Has Error: ${String(status.hasError)}`)
    console.log(`Paper Empty: ${String(status.paperEmpty)}`)
    console.log(`Paper Near Empty: ${String(status.paperNearEmpty)}`)
    console.log(`Cover Open: ${String(status.coverOpen)}`)
    console.log(
      `Drawer Open Close Signal: ${String(status.drawerOpenCloseSignal)}`,
    )

    printer.printerDelegate.onCommunicationError = error => {
      console.log(`Printer: Communication Error`)
      console.log(error)
    }
    printer.printerDelegate.onReady = () => {
      console.log(`Printer: Ready`)
    }
    printer.printerDelegate.onError = () => {
      console.log(`Printer: Error`)
    }
    printer.printerDelegate.onPaperReady = () => {
      console.log(`Printer: Paper Ready`)
    }
    printer.printerDelegate.onPaperNearEmpty = () => {
      console.log(`Printer: Paper Near Empty`)
    }
    printer.printerDelegate.onPaperEmpty = () => {
      console.log(`Printer: Paper Empty`)
    }
    printer.printerDelegate.onCoverOpened = () => {
      console.log(`Printer: Cover Opened`)
    }
    printer.printerDelegate.onCoverClosed = () => {
      console.log(`Printer: Cover Closed`)
    }
    printer.drawerDelegate.onCommunicationError = error => {
      console.log(`Drawer: Communication Error`)
      console.log(error)
    }
    printer.drawerDelegate.onOpenCloseSignalSwitched = openCloseSignal => {
      console.log(
        `Drawer: Open Close Signal Switched: ${String(openCloseSignal)}`,
      )
    }
    printer.inputDeviceDelegate.onCommunicationError = error => {
      console.log(`Input Device: Communication Error`)
      console.log(error)
    }
    printer.inputDeviceDelegate.onConnected = () => {
      console.log(`Input Device: Connected`)
    }
    printer.inputDeviceDelegate.onDisconnected = () => {
      console.log(`Input Device: Disconnected`)
    }
    printer.inputDeviceDelegate.onDataReceived = data => {
      console.log(`Input Device: DataReceived ${String(data)}`)
    }
    printer.displayDelegate.onCommunicationError = error => {
      console.log(`Display: Communication Error`)
      console.log(error)
    }
    printer.displayDelegate.onConnected = () => {
      console.log(`Display: Connected`)
    }
    printer.displayDelegate.onDisconnected = () => {
      console.log(`Display: Disconnected`)
    }
  } catch (error) {
    console.log(`Error: ${String(error)}`)
  } finally {
    await sleep(2000)
    await disconnectPrinter(printer)
  }
}

const disconnectPrinter = async (printer: StarPrinter) => {
  try {
    console.log('-----> disconnectPrinter')
    // await printer.close()
    // await printer.dispose()
  } catch (error) {
    console.log(`Error: ${String(error)}`)
  }
}

const renderItem: ListRenderItem<StarPrinter> = ({ item: starPrinter }) => {
  const printer = starPrinter.information
    ? starPrinter.information.reserved
    : undefined

  if (printer) {
    // console.log(printer)

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
            {`model: ${
              starPrinter.information
                ? starPrinter.information.model
                : 'could not find a model'
            }`}
          </Text>
          <Text style={styles.information_text}>
            {`emulator: ${
              starPrinter.information
                ? starPrinter.information.emulation
                : 'could not find an emulation'
            }`}
          </Text>
        </View>

        <View style={styles.buttons_container}>
          <View style={styles.button}>
            <TouchableOpacity
              onPress={() => {
                listenPrinter(starPrinter)
              }}>
              <Text>Connect</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.button}>
            <TouchableOpacity
              onPress={() => {
                disconnectPrinter(starPrinter)
              }}>
              <Text>Disconnect</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.button}>
            <TouchableOpacity
              onPress={() => {
                print(starPrinter)
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

export const Discover = (props: Props) => {
  const { printers } = props

  return (
    <View>
      <FlatList<StarPrinter>
        key={'printer_info'}
        data={printers}
        renderItem={renderItem}
        keyExtractor={item => item.connectionSettings.identifier}
        horizontal={false}
        numColumns={2}
      />
    </View>
  )
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
