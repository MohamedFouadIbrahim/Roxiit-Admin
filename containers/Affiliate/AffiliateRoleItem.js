import React, { PureComponent } from 'react'
import { View, I18nManager, Text } from 'react-native'
import FontedText from '../../components/FontedText/index.js';
import { largePagePadding, pagePadding } from '../../constants/Style.js';
import CustomTouchable from '../../components/CustomTouchable';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TranslatedText from '../../components/TranslatedText/index.js';


export default class AffiliateRoleItem extends PureComponent {
    render() {
        const { item, currency, onPress, onLongPress, ...restProps } = this.props
        const { MinStep, MaxStep, VirtualBalancePerOne, VirtualBalanceForNewCustomer } = item

        return (
            <CustomTouchable
                style={{
                    paddingHorizontal: largePagePadding,
                    paddingVertical: pagePadding
                }}
                onPress={() => { onPress(item) }}
                onLongPress={() => { onLongPress(item) }}
                {...restProps}>

                <View
                    style={{
                        flexDirection: 'row',
                        flex: 1,
                        justifyContent: 'flex-start'
                    }}>
                    <FontedText >{MinStep}</FontedText>
                    <Ionicons name={I18nManager.isRTL ? 'ios-arrow-round-back' : 'ios-arrow-round-forward'} size={20} style={{ marginHorizontal: 10 }} />
                    <FontedText >{MaxStep}</FontedText>
                </View>

                <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row' }}>
                        <TranslatedText text='ForMe'></TranslatedText>
                        <FontedText>: </FontedText>
                        <FontedText>{VirtualBalancePerOne}</FontedText>
                        <FontedText >{currency}</FontedText>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <TranslatedText text='ForNewCustomer' ></TranslatedText>
                        <FontedText>: </FontedText>
                        <FontedText >{VirtualBalanceForNewCustomer}</FontedText>
                        <FontedText >{currency}</FontedText>
                    </View>
                </View>

            </CustomTouchable>
        )
    }
}