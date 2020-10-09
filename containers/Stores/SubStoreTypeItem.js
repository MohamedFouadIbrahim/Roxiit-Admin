import React, { PureComponent } from 'react'
import { View } from 'react-native'
import FontedText from '../../components/FontedText/index.js';
import { pagePadding, mediumPagePadding } from '../../constants/Style.js';
import CustomTouchable from '../../components/CustomTouchable';
import TranslatedText from '../../components/TranslatedText/index.js';
import { secondColor } from '../../constants/Colors.js';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';


export default class SubStoreTypeItem extends PureComponent {

    renderIsDefault = () => {
        return (
            <View style={{
                backgroundColor: secondColor, borderRadius: 4, marginTop: 5, justifyContent: 'center', marginRight: 10
            }}>
                <TranslatedText style={{ fontSize: 12, color: "white", textAlign: 'center', paddingVertical: 4, paddingHorizontal: 6 }} text='Default' />
            </View>
        )
    }
    render() {
        const { item, currency, onPress, onLongPress, ...restProps } = this.props
        const { Name, IsDefault } = item




        return (
            <CustomTouchable
                style={{
                    paddingHorizontal: mediumPagePadding,
                    paddingVertical: pagePadding
                }}
                onPress={() => { onPress(item) }}
                onLongPress={() => { onLongPress(item) }}
                {...restProps}>

                <View
                    style={{
                        flexDirection: 'row',
                        flex: 1,
                        alignItems: 'center'
                    }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            flex: 1,
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                        <FontedText style={{ color: 'black' }} >{Name}</FontedText>
                        {IsDefault ? this.renderIsDefault() : null}


                    </View>

                    <CustomTouchable
                        onPress={() => { onLongPress(item) }}
                        style={{
                            alignSelf: 'flex-start',
                        }} >
                        <MaterialIcons
                            name={`more-vert`}
                            size={20} />
                    </CustomTouchable>
                </View>
            </CustomTouchable>
        )
    }
}