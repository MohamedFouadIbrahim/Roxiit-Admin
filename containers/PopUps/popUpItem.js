import React, { PureComponent } from 'react'
import { View } from 'react-native'
import FontedText from '../../components/FontedText/index.js';
import CustomTouchable from '../../components/CustomTouchable/index.js';
import CircularImage from '../../components/CircularImage/index.js';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { xmediumPagePadding, pagePadding } from '../../constants/Style.js';

export default class PopUpItem extends PureComponent {
    render() {
        const { item, onPress, onLongPress, ...restProps } = this.props
        const { name, Icon, } = item

        return (
            <CustomTouchable
                onPress={() => { onPress(item) }}
                onLongPress={() => { onLongPress(item) }}
                {...restProps}>
                <View
                    style={{
                        paddingHorizontal: xmediumPagePadding,
                        paddingVertical: pagePadding,
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}>
                    <CircularImage
                        uri={Icon ? Icon.ImageUrl : null} />

                    <FontedText style={{ flex: 1, color: 'black', paddingHorizontal: 20 }}>{name}</FontedText>
                    <CustomTouchable
                        style={{ alignSelf: 'flex-start' }}
                        onPress={() => { onLongPress(item) }} >
                        <MaterialIcons
                            name={`more-vert`}
                            size={20} />
                    </CustomTouchable>

                </View>
            </CustomTouchable>
        )
    }
}