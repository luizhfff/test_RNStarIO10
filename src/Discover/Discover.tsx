/* eslint-disable semi */
import React from 'react'
import { FlatList, ListRenderItem, View } from 'react-native'
import { StarPrinter } from 'react-native-star-io10'
import { PrinterCardContainer } from '../Printer/PrinterCardContainer'

interface Props {
  printers: StarPrinter[]
  imageBase64?: string
}

const renderItem: ListRenderItem<StarPrinter> = list => (
  <PrinterCardContainer list={list} />
)

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
