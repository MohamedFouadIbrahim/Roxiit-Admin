import React from 'react';
import { View, Platform } from 'react-native';
import CustomTouchable from '../../components/CustomTouchable';
import TranslatedText from '../../components/TranslatedText';
import { shadowStyle0, largePagePadding } from '../../constants/Style';
import { screenWidth } from '../../constants/Metrics';

const numColumns = 3
const itemWidth = screenWidth / numColumns
const itemPadding = largePagePadding
const iconContainerWidth = (itemWidth - itemPadding) * 0.6
const iconSize = Platform.isPad ? 32 : 20
const iconContainerRadius = iconContainerWidth / 2

const MyAppItem = ({ onPress, Name, iconName, IconComponent, onLongPress }) => {
    return (
        <CustomTouchable

            onLongPress={() => {
                onLongPress && onLongPress()
            }}

            onPress={() => {
                onPress && onPress()
            }}
        >
            <View
                style={{
                    backgroundColor: 'white',
                    width: iconContainerWidth,
                    height: iconContainerWidth,
                    borderRadius: iconContainerRadius,
                    justifyContent: 'center',
                    alignItems: 'center',
                    ...shadowStyle0,
                }}>

                <IconComponent color={'#444444'} name={iconName} size={iconSize} />
            </View>

            <TranslatedText
                style={{
                    color: '#555555',
                    fontSize: 15,
                    marginTop: 5,
                    textAlign: 'center',
                }}
                text={Name} />
        </CustomTouchable>
    )
}

export default MyAppItem