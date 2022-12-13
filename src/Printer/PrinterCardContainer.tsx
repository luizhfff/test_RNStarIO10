/* eslint-disable semi */
import React from 'react'
import { ListRenderItemInfo } from 'react-native'
import {
  StarConnectionSettings,
  StarPrinter,
  StarXpandCommand,
} from 'react-native-star-io10'
import { PrinterCard } from './PrinterCard'
// import RNFS, { MainBundlePath } from 'react-native-fs'
// import { sleep } from '../../lib/helpers'

interface Props {
  list: ListRenderItemInfo<StarPrinter>
}

export class PrinterCardContainer extends React.Component<Props> {
  starConnectionSettings = new StarConnectionSettings()

  _printer = new StarPrinter(this.starConnectionSettings)

  constructor(props: Props) {
    super(props)

    this.createStarConnectionSettings()
  }

  createStarConnectionSettings = () => {
    const printer = this.props.list.item

    this.starConnectionSettings.interfaceType =
      printer.connectionSettings.interfaceType

    this.starConnectionSettings.identifier =
      printer.connectionSettings.identifier
  }

  addListeners = () => {
    console.log('=> addListeners')

    // printerDelegate
    this._printer.printerDelegate.onCommunicationError = error => {
      console.log('Printer: Communication Error')
      console.log(error)
    }
    this._printer.printerDelegate.onReady = () => {
      console.log('Printer: Ready')
    }
    this._printer.printerDelegate.onError = () => {
      console.log('Printer: Error')
    }
    this._printer.printerDelegate.onPaperReady = () => {
      console.log('Printer: Paper Ready')
    }
    this._printer.printerDelegate.onPaperNearEmpty = () => {
      console.log('Printer: Paper Near Empty')
    }
    this._printer.printerDelegate.onPaperEmpty = () => {
      console.log('Printer: Paper Empty')
    }
    this._printer.printerDelegate.onCoverOpened = () => {
      console.log('Printer: Cover Opened')
    }
    this._printer.printerDelegate.onCoverClosed = () => {
      console.log('Printer: Cover Closed')
    }
    // drawerDelegate
    this._printer.drawerDelegate.onCommunicationError = error => {
      console.log('Drawer: Communication Error')
      console.log(error)
    }
    this._printer.drawerDelegate.onOpenCloseSignalSwitched =
      openCloseSignal => {
        console.log(
          `Drawer: Open Close Signal Switched: ${String(openCloseSignal)}`,
        )
      }
    // inputDeviceDelegate
    this._printer.inputDeviceDelegate.onCommunicationError = error => {
      console.log('Input Device: Communication Error')
      console.log(error)
    }
    this._printer.inputDeviceDelegate.onConnected = () => {
      console.log('Input Device: Connected')
    }
    this._printer.inputDeviceDelegate.onDisconnected = () => {
      console.log('Input Device: Disconnected')
    }
    this._printer.inputDeviceDelegate.onDataReceived = data => {
      console.log(`Input Device: DataReceived ${String(data)}`)
    }
    // displayDelegate
    this._printer.displayDelegate.onCommunicationError = error => {
      console.log('Display: Communication Error')
      console.log(error)
    }
    this._printer.displayDelegate.onConnected = () => {
      console.log('Display: Connected')
    }
    this._printer.displayDelegate.onDisconnected = () => {
      console.log('Display: Disconnected')
    }
  }

  disconnectPrinter = async () => {
    try {
      console.log('-----> disconnectPrinter')
      await this._printer.close()
      await this._printer.dispose()
    } catch (error) {
      console.log(`Error: ${String(error)}`)
    }
  }

  checkPrinterStatus = async () => {
    const status = await this._printer.getStatus()
    console.log('--- status ---')
    console.log(status)

    console.log(`Has Error: ${String(status.hasError)}`)
    console.log(`Paper Empty: ${String(status.paperEmpty)}`)
    console.log(`Paper Near Empty: ${String(status.paperNearEmpty)}`)
    console.log(`Cover Open: ${String(status.coverOpen)}`)
    console.log(
      `Drawer Open Close Signal: ${String(status.drawerOpenCloseSignal)}`,
    )
  }

  connectPrinter = async () => {
    await this.disconnectPrinter()

    try {
      console.log('-----> opening: Printer')

      this.addListeners()

      await this._printer.open()
      await this.checkPrinterStatus()
    } catch (error) {
      console.log(`Error: ${String(error)}`)
    } finally {
      console.log('-----> printer opened')
      // await sleep(2000)
      // await disconnectPrinter(printer)
    }
  }

  createReceipt = async () => {
    // // For iOS: print image
    // const blob = await RNFS.readFile(
    //   MainBundlePath + '/assets/src/Images/basic-logo_300x300.png',
    //   'base64',
    // )
    // const str = `data:image/png;base64,${blob}`

    // const builder = new StarXpandCommand.StarXpandCommandBuilder()

    // builder.addDocument(
    //   new StarXpandCommand.DocumentBuilder().addPrinter(
    //     new StarXpandCommand.PrinterBuilder()
    //       .styleAlignment(StarXpandCommand.Printer.Alignment.Center)

    //       .actionPrintImage(new StarXpandCommand.Printer.ImageParameter(str, 120))

    //       .actionFeedLine(1)

    //       .actionCut(StarXpandCommand.Printer.CutType.Partial),
    //   ),
    // )

    // Print text
    const builder = new StarXpandCommand.StarXpandCommandBuilder()

    builder.addDocument(
      new StarXpandCommand.DocumentBuilder().addPrinter(
        new StarXpandCommand.PrinterBuilder()
          .actionPrintText('Hello World\n')
          .actionPrintText('Hello World\n')
          .actionPrintText('Hello World\n')
          .actionPrintText('Hello World\n')
          .actionPrintText('Hello World\n')
          .actionPrintText('Hello World\n')

          .actionFeedLine(1)

          .actionCut(StarXpandCommand.Printer.CutType.Partial),
      ),
    )

    const commands = await builder.getCommands()

    return commands
  }

  print = async () => {
    // await this.disconnectPrinter(printer)

    try {
      console.log('-----> print')

      const commands = await this.createReceipt()

      await this._printer.print(commands)
    } catch (error) {
      console.log(`Error: ${String(error)}`)
    } finally {
      // await disconnectPrinter(printer)
    }
  }

  render() {
    return (
      <PrinterCard
        list={this.props.list}
        connectPrinter={this.connectPrinter}
        disconnectPrinter={this.disconnectPrinter}
        print={this.print}
      />
    )
  }
}
