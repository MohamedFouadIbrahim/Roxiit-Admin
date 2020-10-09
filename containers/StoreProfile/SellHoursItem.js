import React, { PureComponent } from 'react'
import { View, I18nManager, Text } from 'react-native'
import FontedText from '../../components/FontedText/index.js';
import { largePagePadding, pagePadding } from '../../constants/Style.js';
import CustomTouchable from '../../components/CustomTouchable';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TranslatedText from '../../components/TranslatedText/index.js';


export default class SellHoursItem extends PureComponent {

    renderIsOpen = (IsOpen) => {
        return (
            <View style={{
                backgroundColor: IsOpen == true ? '#32CD32' : 'red'
                , borderRadius: 4, marginTop: 5, justifyContent: 'center', marginRight: 10
            }}>
                <TranslatedText style={{ fontSize: 12, color: "white", textAlign: 'center', paddingVertical: 4, paddingHorizontal: 6 }} text={IsOpen == true ? 'Open' : 'Close'} />
            </View>
        )
    }



    render() {
        const { index, item, onPress, onLongPress, ...restProps } = this.props
        const { DayName, IsEnabled,
            IsAllTheDay, From, To } = item

        return (
            <CustomTouchable
                style={{
                    paddingHorizontal: largePagePadding,
                    paddingVertical: pagePadding,
                    backgroundColor: 'white'
                }}
                onPress={() => { onPress(index, item) }}
                {...restProps}>

                <View style={{
                    flexDirection: 'row',
                    flex: 1,
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                }}>
                    {this.renderIsOpen(IsEnabled)}

                    <FontedText >{DayName}</FontedText>
                    <Text> : </Text>
                    {IsEnabled && IsAllTheDay ? <TranslatedText style={{ paddingHorizontal: pagePadding }} text='Available24Hours' ></TranslatedText> : null}

                    {IsEnabled && !IsAllTheDay ? <FontedText style={{ paddingHorizontal: pagePadding }} >{From}</FontedText> : null}

                    {IsEnabled && !IsAllTheDay ?
                        I18nManager.isRTL ?
                            <Ionicons name='ios-arrow-round-back' size={25} /> :
                            <Ionicons name='ios-arrow-round-forward' size={25} />
                        : null
                    }
                    {IsEnabled && !IsAllTheDay ? <FontedText style={{ paddingHorizontal: 10 }}>{To}</FontedText> : null}
                </View>

            </CustomTouchable >
        )
    }
}