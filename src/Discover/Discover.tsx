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

const GR_LOGO = require('./../Images/basic-logo_300x300.png')

interface Props {
  printers: StarPrinter[]
  imageBase64?: string
}

const createReceipt = async () => {
  const builder = new StarXpandCommand.StarXpandCommandBuilder()
  builder.addDocument(
    new StarXpandCommand.DocumentBuilder().addPrinter(
      new StarXpandCommand.PrinterBuilder()
        .actionPrintImage(
          new StarXpandCommand.Printer.ImageParameter(
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACWCAYAAABkW7XSAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAABLKADAAQAAAABAAAAlgAAAABJS0H3AAAHd0lEQVR4Ae3aecilUxwH8DG2GTs19l0IISTJNinZU8ia5Q+lMPYoKaFMSRL+osi+iyT8oaH84Q9LhJRk7NmiZF+/vzxPPd2ee9+517zvvDWfU9855znPcs791D2d574zZ45CgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgRms8CVmdwaK2CCG2TMRWOOO8k9Yw4x9PIV5TR0Qk4QWBkE5nY+5DppX5Gs0umbqeZ5GWjzMQeb5J4xh+i9fEU69U5IJ4GVTaAWqceSf5I1Z/jD75vxfkkWjzHuJPeM8fihl65Ip6GTcoLAyiKwWj7oWsnNyYnNh9499e/J98mnTV9VC5L9k92ST5KXks+TtmyTxvrtQVN/l7qu2SFZu+mr6u2mfWDqR5N5ycbJHkmV95OaQ19Z1ntGzbcW5Z17Hv5e+mou23fOfZV2ZVmdOrdqEiCwvAUuzwMfT/5Oaof1ZHN8Yeq2nJbGh8kNTb5J/WNyVtKWg9J4MKlnVD5K9kmqHJ3UAvRl0j53m7RrsXonqetrkap5VDZN+sqy3jPVfOu17rLks6TGrtyU1O93tdA9nVTfw0kt4FWWxem/K/1LgMC0C/yZEepLWruPbjkpB+0Oo+3fL41agP5I9mw7m/rO1PWc2l2t2/Tt1Rzv2Bx3q6tzUNcv7nZO0R51zzjzrV1WLbw1/lWdMZ9K+7bOcbc5zKl7jTYBAtMs0PdFnJ8xP06u6xn79fTVF/3egXP1SvVuc+7W1LUAvpkcnvSVUYtP3/XVN+yeSeZ7Zp5Xn6MWrq2TU5KXk3pd7it9Tn3X6SNAYDkLDPtStsPUa159iQ9Onmg7m3qzpq7ftLrl1xyckbyanJ9slzybvJBMd5lkvrXgHpccn9yX1OdamNTCpBAgMIsEplqw2le4azLnWoD6Su1OBssb6ahd2fXJwuTkZCbKpPM9N5M7IKmFuT7rF4lCgMAsE5g7xXy2as5vmfq3IanfsvrK/en8O6kfuK/tu2Aa+iad77eZS+0Cq1yS1OdVCBCYZQJTLVjtTuOQEfNuXw27l9TO7d7kguTn5NJk1DNyermUSed7VEbfNrkrqf9Bf3eySqIQIDBLBfp+TK4fyv9J6q+BO/fMe/X03d7Tf2P6rmv6a9GqZyxN1ksGy9XpqPOLB0+MOB52zyTzrV1Z/ZGgFt76q+ZHSc3noqSv9Dn1XaePAIFpFPghz64v6k7NGFukXiP5IKn+pcneSVs2TOOe5NS2o6mPTb0kWbU5rp3Ki0k9o37UHiwXp6POPdicqN3ZJk17WDXsnnHnWwvuK8lhnYEWpl2vsvW/7wf/oJCuOX1O1a8QIDCDAq9lrFo47k5OTxYlVY5M/krqXNVvJUuS2nU9l3TLrjmoL/T23c60d0nq/so5Sbcck4Pq/zqpxe+WZEEyqoy6Z5z53pFB6tV1sDySjppT7bwGd4XDnAaf4ZgAgWkUOCLP/impH9EfSmr30ZZD0/giaRedquuLvk7SlhPSqEWnzj2crJlUmZ/cn7T31ivVA0m7i6pd0fPN+Q9T1zymKlPdM9V8a07PJDWnT5NaANtSO8SlSTvf99M+O2nLKKf2GjUBAjMgMC9jbDRknLnpr1ek+sJuPuSa/9NdvyGN+0P3qHumc76jnP6PgXsJECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECAwLQL/AgGeHJ7zrXDhAAAAAElFTkSuQmCC',
            406,
          ),
        )

        // .actionPrintImage(
        //   new StarXpandCommand.Printer.ImageParameter(GR_LOGO, 406),
        // )

        // .actionPrintImage(
        //   new StarXpandCommand.Printer.ImageParameter('logo_01.png', 406),
        // )

        // .styleInternationalCharacter(
        //   StarXpandCommand.Printer.InternationalCharacterType.Usa,
        // )
        // .styleCharacterSpace(0)
        // .styleAlignment(StarXpandCommand.Printer.Alignment.Center)
        // .actionPrintText(
        //   'Star Clothing Boutique\n' +
        //     '123 Star Road\n' +
        //     'City, State 12345\n' +
        //     '\n',
        // )

        // .styleAlignment(StarXpandCommand.Printer.Alignment.Left)
        // .actionPrintText(
        //   'Date:MM/DD/YYYY    Time:HH:MM PM\n' +
        //     '--------------------------------\n' +
        //     '\n',
        // )
        // .actionPrintText(
        //   'SKU         Description    Total\n' +
        //     '300678566   PLAIN T-SHIRT  10.99\n' +
        //     '300692003   BLACK DENIM    29.99\n' +
        //     '300651148   BLUE DENIM     29.99\n' +
        //     '300642980   STRIPED DRESS  49.99\n' +
        //     '300638471   BLACK BOOTS    35.99\n' +
        //     '\n' +
        //     'Subtotal                  156.95\n' +
        //     'Tax                         0.00\n' +
        //     '--------------------------------\n',
        // )

        // .actionPrintText('Total     ')
        // .add(
        //   new StarXpandCommand.PrinterBuilder()
        //     .styleMagnification(
        //       new StarXpandCommand.MagnificationParameter(2, 2),
        //     )
        //     .actionPrintText('   $156.95\n'),
        // )

        // .actionPrintText(
        //   '--------------------------------\n' +
        //     '\n' +
        //     'Charge\n' +
        //     '156.95\n' +
        //     'Visa XXXX-XXXX-XXXX-0123\n' +
        //     '\n',
        // )

        // .add(
        //   new StarXpandCommand.PrinterBuilder()
        //     .styleInvert(true)
        //     .actionPrintText('Refunds and Exchanges\n'),
        // )
        // .actionPrintText('Within ')
        // .add(
        //   new StarXpandCommand.PrinterBuilder()
        //     .styleUnderLine(true)
        //     .actionPrintText('30 days'),
        // )
        // .actionPrintText(' with receipt\n')
        // .actionPrintText('And tags attached\n' + '\n')

        // .styleAlignment(StarXpandCommand.Printer.Alignment.Center)
        // .actionPrintBarcode(
        //   new StarXpandCommand.Printer.BarcodeParameter(
        //     '0123456',
        //     StarXpandCommand.Printer.BarcodeSymbology.Jan8,
        //   )
        //     .setBarDots(3)
        //     .setBarRatioLevel(
        //       StarXpandCommand.Printer.BarcodeBarRatioLevel.Level0,
        //     )
        //     .setHeight(5)
        //     .setPrintHri(true),
        // )

        .actionFeedLine(1)
        // .actionPrintQRCode(
        //   new StarXpandCommand.Printer.QRCodeParameter('Hello World.\n')
        //     .setModel(StarXpandCommand.Printer.QRCodeModel.Model2)
        //     .setLevel(StarXpandCommand.Printer.QRCodeLevel.L)
        //     .setCellSize(8),
        // )
        .actionCut(StarXpandCommand.Printer.CutType.Partial),
    ),
  )

  const commands = await builder.getCommands()

  return commands
}

const listenPrinter = async (starPrinter: StarPrinter) => {
  let printer = starPrinter

  // await printer.close()
  // await printer.dispose()

  const settings = new StarConnectionSettings()

  settings.interfaceType = printer.connectionSettings.interfaceType
  settings.identifier = printer.connectionSettings.identifier

  printer = new StarPrinter(settings)

  try {
    await printer.open()
    const status = await printer.getStatus()
    console.log(status)

    const commands = await createReceipt()

    await printer.print(commands)

    console.log(`Success`)

    console.log('------------------------------')
    // console.log(printer)
    // console.log(`Has Error: ${String(status.hasError)}`)
    // console.log(`Paper Empty: ${String(status.paperEmpty)}`)
    // console.log(`Paper Near Empty: ${String(status.paperNearEmpty)}`)
    // console.log(`Cover Open: ${String(status.coverOpen)}`)
    // console.log(
    //   `Drawer Open Close Signal: ${String(status.drawerOpenCloseSignal)}`,
    // )

    // printer.printerDelegate.onCommunicationError = error => {
    //   console.log(`Printer: Communication Error`)
    //   console.log(error)
    // }
    // printer.printerDelegate.onReady = () => {
    //   console.log(`Printer: Ready`)
    // }
    // printer.printerDelegate.onError = () => {
    //   console.log(`Printer: Error`)
    // }
    // printer.printerDelegate.onPaperReady = () => {
    //   console.log(`Printer: Paper Ready`)
    // }
    // printer.printerDelegate.onPaperNearEmpty = () => {
    //   console.log(`Printer: Paper Near Empty`)
    // }
    // printer.printerDelegate.onPaperEmpty = () => {
    //   console.log(`Printer: Paper Empty`)
    // }
    // printer.printerDelegate.onCoverOpened = () => {
    //   console.log(`Printer: Cover Opened`)
    // }
    // printer.printerDelegate.onCoverClosed = () => {
    //   console.log(`Printer: Cover Closed`)
    // }
    // printer.drawerDelegate.onCommunicationError = error => {
    //   console.log(`Drawer: Communication Error`)
    //   console.log(error)
    // }
    // printer.drawerDelegate.onOpenCloseSignalSwitched = openCloseSignal => {
    //   console.log(
    //     `Drawer: Open Close Signal Switched: ${String(openCloseSignal)}`,
    //   )
    // }
    // printer.inputDeviceDelegate.onCommunicationError = error => {
    //   console.log(`Input Device: Communication Error`)
    //   console.log(error)
    // }
    // printer.inputDeviceDelegate.onConnected = () => {
    //   console.log(`Input Device: Connected`)
    // }
    // printer.inputDeviceDelegate.onDisconnected = () => {
    //   console.log(`Input Device: Disconnected`)
    // }
    // printer.inputDeviceDelegate.onDataReceived = data => {
    //   console.log(`Input Device: DataReceived ${String(data)}`)
    // }
    // printer.displayDelegate.onCommunicationError = error => {
    //   console.log(`Display: Communication Error`)
    //   console.log(error)
    // }
    // printer.displayDelegate.onConnected = () => {
    //   console.log(`Display: Connected`)
    // }
    // printer.displayDelegate.onDisconnected = () => {
    //   console.log(`Display: Disconnected`)
    // }

    // ------------------------------

    // console.log('------------------------------')
  } catch (error) {
    console.log(`Error: ${String(error)}`)
  } finally {
    await printer.close()
    await printer.dispose()
  }
}

const renderItem: ListRenderItem<StarPrinter> = ({ item: starPrinter }) => {
  return (
    <View style={styles.printer_container}>
      <Text style={styles.printer_header_text}>Printer information</Text>

      <View style={styles.information_container}>
        <Text style={styles.information_text}>
          id: {starPrinter.connectionSettings.identifier}
        </Text>
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

      <View>
        <TouchableOpacity
          onPress={() => {
            listenPrinter(starPrinter)
          }}>
          <Text>Connect</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
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
})
