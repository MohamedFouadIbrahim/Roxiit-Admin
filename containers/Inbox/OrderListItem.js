import React from 'react'
import { View, Text, TextInput } from 'react-native';
import CustomTouchable from '../../components/CustomTouchable';
import { pagePadding, largePagePadding } from '../../constants/Style';
import FontedText from '../../components/FontedText';
import { formatDate } from '../../utils/Date';
import LinearGradient from 'react-native-linear-gradient';
import { mainColor } from '../../constants/Colors';
import { TrimText } from '../../utils/Text';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { screenWidth } from '../../constants/Metrics';

export default class OrderListItem extends React.Component {

    render() {

        const {
            Item,
            onOrderPress,
            onMoreVertPress
        } = this.props

        const {
            Order: { OrderCode },
            LastMessageText,
            LastMessageDate,
            ShowAlert,
            CustomerName
        } = Item

        return (
            <CustomTouchable
                style={{ paddingHorizontal: pagePadding + 4, paddingVertical: pagePadding, flex: 1, }}
                onPress={() => { onOrderPress && onOrderPress() }}
                onLongPress={() => onMoreVertPress()}
            >

                <View
                    style={{
                        backgroundColor: 'white',
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                    }}>
                    <View style={{ flexDirection: 'row', flex: 0.70, overflow: 'hidden', justifyContent: 'flex-start', }} >
                        {ShowAlert && <LinearGradient
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            colors={['#108ebc', '#0e7ca4']}
                            style={{
                                height: 7,
                                width: 7,
                                borderRadius: 3.5,
                                marginTop: 5
                            }} />}

                        <View style={{}} >
                            <View style={{ flexDirection: 'row', }} >
                                <FontedText ellipsizeMode='tail' style={{ color: mainColor, fontWeight: 'bold' }} >{`#${OrderCode},`}</FontedText>
                                <FontedText ellipsizeMode='tail' style={{ color: mainColor, marginHorizontal: 5 }} >{TrimText(CustomerName, 15)}</FontedText>
                            </View>
                            <FontedText numberOfLines={2} ellipsizeMode='tail' style={{ marginTop: 5, fontWeight: ShowAlert ? 'bold' : 'normal', color: mainColor, }} >{TrimText(LastMessageText, screenWidth / 20/*will get enogh text based on screen width */)}</FontedText>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', flex: 0.30, alignItems: 'center', justifyContent: 'flex-end' }} >
                        <FontedText  >{formatDate(LastMessageDate)}</FontedText>
                        <CustomTouchable onPress={onMoreVertPress} >
                            <MaterialIcons
                                name={`more-vert`}
                                size={25} />
                        </CustomTouchable>

                    </View>
                    {/*                     
                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }} >
                    <View
                        style={{ flexDirection: 'row', justifyContent: 'center' }}
                    >
                        <FontedText ellipsizeMode='tail' style={{ color: mainColor, fontWeight: 'bold' }} >{`#${OrderCode},`}</FontedText>
                        <FontedText ellipsizeMode='tail' style={{ color: mainColor, marginHorizontal: 5 }} >{TrimText(CustomerName, 25)}</FontedText>
                    </View>

                    <View style={{ flexDirection: 'row' }} >
                        <FontedText  >{formatDate(LastMessageDate)}</FontedText>

                        <CustomTouchable
                            onPress={onMoreVertPress}
                            style={{
                                marginHorizontal: 5,
                            }}>
                            <MaterialIcons
                                name={`more-vert`}
                                size={25} />
                        </CustomTouchable>

                    </View>

                </View> */}

                    {/* <FontedText numberOfLines={2} ellipsizeMode='tail' style={{ marginTop: 15, fontWeight: ShowAlert ? 'bold' : 'normal', color: mainColor }} >{LastMessageText}</FontedText> */}
                </View>
            </CustomTouchable>
        )
    }

}