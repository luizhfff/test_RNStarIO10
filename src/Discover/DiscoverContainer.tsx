import React, { Component } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import {
  InterfaceType,
  StarDeviceDiscoveryManager,
  StarDeviceDiscoveryManagerFactory,
  StarPrinter,
} from 'react-native-star-io10'
import { sleep } from '../../lib/helpers'
import { Discover } from './Discover'

const DISCOVER_TIME = 2 * 1000

interface Props {}

interface State {
  lanIsEnabled: boolean
  bluetoothIsEnabled: boolean
  bluetoothLeIsEnabled: boolean
  usbIsEnabled: boolean
  printers: StarPrinter[]
  imageBase64?: string
}

export class DiscoverContainer extends Component<Props, State> {
  private STAR_PRINTER?: StarDeviceDiscoveryManager

  constructor(props: Props) {
    super(props)

    this.state = {
      lanIsEnabled: true,
      bluetoothIsEnabled: true,
      bluetoothLeIsEnabled: true,
      usbIsEnabled: true,
      printers: [],
      imageBase64: undefined,
    }
  }

  componentDidMount = () => {
    this.loadPrinters()
  }

  private loadPrinters = async () => {
    this.setState({
      printers: [],
    })

    try {
      await this.stopFindingPrinters()

      const printer = await StarDeviceDiscoveryManagerFactory.create([
        InterfaceType.Lan,
        InterfaceType.Bluetooth,
        InterfaceType.BluetoothLE,
        InterfaceType.Usb,
      ])

      this.setStarPrinter(printer)

      printer.discoveryTime = DISCOVER_TIME

      printer.onPrinterFound = (printer: StarPrinter) => {
        console.log('onPrinterFound', printer)
        const printers = this.state.printers

        printers.push(printer)

        this.setState({
          printers,
        })
      }

      printer.onDiscoveryFinished = () => {
        console.log(`------- Discovery finished -------`)
      }

      await this.starFindingPrinters(printer)
    } catch (error) {
      console.log(`Error: ${String(error)}`)
    } finally {
      await sleep(DISCOVER_TIME)
      await this.stopFindingPrinters()
    }
  }

  setStarPrinter = (printer?: StarDeviceDiscoveryManager) => {
    this.STAR_PRINTER = printer
  }

  starFindingPrinters = async (printer: StarDeviceDiscoveryManager) => {
    try {
      await printer.startDiscovery()
    } catch (error) {
      console.log(error)
    } finally {
      console.log('-------> starFindingPrinters triggered')
    }
  }

  stopFindingPrinters = async () => {
    try {
      await this.STAR_PRINTER?.stopDiscovery()
      this.setStarPrinter()
    } catch (error) {
      console.log(error)
    } finally {
      console.log('-------> stopFindingPrinters triggered')
    }
  }

  render() {
    return (
      <>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => this.loadPrinters()}
            style={styles.button}>
            <Text>Refresh the list</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this.stopFindingPrinters()}
            style={styles.button}>
            <Text>Stop</Text>
          </TouchableOpacity>
        </View>

        <Discover
          printers={this.state.printers}
          imageBase64={this.state.imageBase64}
        />
      </>
    )
  }
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 16,
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
