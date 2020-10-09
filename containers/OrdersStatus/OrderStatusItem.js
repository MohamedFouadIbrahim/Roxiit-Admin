import React, { PureComponent } from 'react';
import { View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomTouchable from '../../components/CustomTouchable';
import FontedText from '../../components/FontedText/index.js';
import { secondTextColor } from '../../constants/Colors.js';
import { largePagePadding, pagePadding } from '../../constants/Style.js';

class OrderStatusItem extends PureComponent {

    render() {
        const { item, index, onPress, onLongPress, onDrag, } = this.props
        const { Name } = item

        return (
            <CustomTouchable
                style={{
                    paddingHorizontal: largePagePadding,
                    paddingVertical: pagePadding,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'

                }}
                onPress={() => { onPress(item) }}
                onLongPress={() => { onLongPress(item) }}>
                <View>
                    <FontedText style={{ color: 'black' }}>{Name}</FontedText>
                </View>

                <CustomTouchable
                    onLongPress={onDrag}
                    style={{
                        padding: 10,
                    }}>
                    <Ionicons
                        name={`ios-menu`}
                        size={28}
                        color={secondTextColor}
                    />
                </CustomTouchable>

            </CustomTouchable>
        )
    }
}

export default OrderStatusItem