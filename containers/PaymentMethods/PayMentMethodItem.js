import React, { PureComponent } from 'react'
import { View } from 'react-native'
import FontedText from '../../components/FontedText/index.js';
import { largePagePadding, pagePadding } from '../../constants/Style.js';
import { mainColor, secondColor } from '../../constants/Colors.js';
import CustomTouchable from '../../components/CustomTouchable';

export default class PayMentItem extends PureComponent {
    render() {
        const { item, onPress, onLongPress, ...restProps } = this.props
        const { Name, Id, IsActive } = item;
        return (
            <CustomTouchable
                style={{
                    paddingHorizontal: largePagePadding,
                    paddingVertical: pagePadding + 5,
                    justifyContent: 'space-between',
                    flexDirection: "row",
                }}
                onPress={() => { onPress(item) }}
                {...restProps}
            >
                <FontedText style={{ color: "black", alignItems: 'center', padding: 5 }}>{Name}</FontedText>

                {IsActive == true ?
                    <View style={{ backgroundColor: secondColor, padding: 5, borderRadius: 2.5 }} >
                        <FontedText
                            style={{
                                color: "#fff",
                                textAlign: "center",
                            }}>
                            {'Active'}
                        </FontedText>
                    </View>
                    : <View />}
            </CustomTouchable>
        )
    }
}