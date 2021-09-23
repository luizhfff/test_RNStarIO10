import React, { Component } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import {
  InterfaceType,
  StarDeviceDiscoveryManager,
  StarDeviceDiscoveryManagerFactory,
  StarPrinter,
} from 'react-native-star-io10'
import { Discover } from './Discover'
import Canvas, { Image } from 'react-native-canvas'

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
      await this.STAR_PRINTER?.stopDiscovery()

      this.STAR_PRINTER = await StarDeviceDiscoveryManagerFactory.create([
        InterfaceType.Lan,
        InterfaceType.Bluetooth,
        InterfaceType.BluetoothLE,
        InterfaceType.Usb,
      ])

      this.STAR_PRINTER.discoveryTime = 10000

      this.STAR_PRINTER.onPrinterFound = (printer: StarPrinter) => {
        const printers = this.state.printers

        printers.push(printer)

        this.setState({
          printers,
        })
      }

      this.STAR_PRINTER.onDiscoveryFinished = () => {
        console.log(`-------> Discovery finished.`)
      }

      await this.STAR_PRINTER.startDiscovery()
    } catch (error) {
      console.log(`Error: ${String(error)}`)
    }
  }

  handleCanvas = async (canvas: Canvas) => {
    if (!canvas) return
    else {
      const ctx = canvas.getContext('2d')
      // ctx.fillStyle = 'white'
      // ctx.fillRect(0, 0, 100, 100)

      const text = 'text text'
      // const textMetrics = await ctx.measureText(text)

      // console.log('textMetrics', textMetrics)

      ctx.font = '25px serif'
      ctx.fillText(text, 0, 25, 100)

      ctx.font = '50px serif'

      // const image = new Image(canvas, 30, 40)
      // console.log('image', image)

      const imageBase64 = await canvas.toDataURL()

      this.setState({ imageBase64 })
    }
  }

  render() {
    return (
      <>
        <View>
          <TouchableOpacity onPress={() => this.loadPrinters()}>
            <Text>Refresh the list</Text>
          </TouchableOpacity>
        </View>
        <Discover
          printers={this.state.printers}
          imageBase64={this.state.imageBase64}
        />

        <Canvas ref={this.handleCanvas} />
      </>
    )
  }
}
