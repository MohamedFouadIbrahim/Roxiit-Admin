import React from 'react'
import { View } from 'react-native';
import CustomTouchable from '../../components/CustomTouchable';
import CircularImage from '../../components/CircularImage';
import { pagePadding, largePagePadding } from '../../constants/Style';
import { mainTextColor } from '../../constants/Colors';
import FontedText from '../../components/FontedText';
import { formatDate } from '../../utils/Date';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { TrimText } from '../../utils/Text';
import { screenWidth } from '../../constants/Metrics';

export default class CustomerListItem extends React.Component {

    render() {

        const {
            Item,
            onPressCustomerItem,
            style,
            onMoreVertPress,
            ...resProps
        } = this.props

        const {
            Customer: {
                FullName,
                Id,
                Media: {
                    ImageUrl,
                }
            },
            LastMessageText,
            LastMessageDate,
            ShowAlert
        } = Item

        return (
            <CustomTouchable
                style={[{ paddingHorizontal: pagePadding + 4, paddingVertical: pagePadding, flex: 1 }, style]}
                onPress={() => { onPressCustomerItem && onPressCustomerItem() }}
                onLongPress={() => onMoreVertPress()}
                {...resProps}
            >

                <View
                    style={{
                        backgroundColor: 'white',
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                    }}>

                    <View style={{ flexDirection: 'row', flex: 0.70, overflow: 'hidden', justifyContent: 'flex-start', }} >

                        {ShowAlert ? <LinearGradient
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            colors={['#108ebc', '#0e7ca4']}
                            style={{
                                height: 7,
                                width: 7,
                                borderRadius: 3.5,
                                marginTop: 5
                            }} /> : <View
                                style={{
                                    height: 7,
                                    width: 7,
                                    borderRadius: 3.5,
                                    marginTop: 5
                                }}
                            />}

                        <CircularImage
                            uri={ImageUrl}
                        // style={{ width: 60, height: 60, borderRadius: 30 }}
                        />
                        <View style={{ marginHorizontal: largePagePadding }} >
                            <FontedText style={{ color: mainTextColor }} >{TrimText(FullName, 20)}</FontedText>
                            <FontedText numberOfLines={2} ellipsizeMode='tail' style={{ color: mainTextColor, marginTop: 5, fontWeight: ShowAlert ? 'bold' : 'normal', }}>{TrimText(LastMessageText, screenWidth / 20/*will get enogh text based on screen width */)}</FontedText>
                        </View>

                    </View>

                    <View style={{ flexDirection: 'row', flex: 0.30, alignItems: 'center', justifyContent: 'flex-end' }} >

                        <FontedText style={{ marginHorizontal: 5 }}  >{formatDate(LastMessageDate)}</FontedText>

                        <CustomTouchable onPress={onMoreVertPress} >
                            <MaterialIcons
                                name={`more-vert`}
                                size={25} />
                        </CustomTouchable>

                    </View>

                </View>


            </CustomTouchable>
        )
    }

}