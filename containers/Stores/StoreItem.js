import React, { PureComponent } from 'react'
import { View } from 'react-native'
import FontedText from '../../components/FontedText/index.js';
import { largePagePadding, pagePadding, xmediumPagePadding } from '../../constants/Style.js';
import CustomTouchable from '../../components/CustomTouchable';
import CircularImage from '../../components/CircularImage/index.js';
import StarRating from 'react-native-star-rating';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { secondTextColor } from '../../constants/Colors.js';
import { numeral } from '../../utils/numeral.js';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';


export default class StoreItem extends PureComponent {
    render() {
        const { item, onPress, onLongPress, ...restProps } = this.props
        const { Name, Image: { ImageUrl }, Likes, Description, Rating, RatingCount } = item


        return (
            <CustomTouchable
                style={{
                    paddingHorizontal: xmediumPagePadding,
                    paddingVertical: pagePadding
                }}
                onPress={() => { onPress(item) }}
                onLongPress={() => { onLongPress(item) }}
                {...restProps}>

                <View
                    style={{
                        flexDirection: 'row',
                        flex: 1,
                        justifyContent: 'space-between'
                    }}>

                    <CircularImage
                        uri={ImageUrl} />

                    <View style={{
                        flex: 1,
                        paddingLeft: largePagePadding,
                        justifyContent: 'space-around'
                    }}>
                        <FontedText numberOfLines={1} style={{ color: 'black' }}>{Name}</FontedText>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                            <View style={{ flexDirection: 'row' }}>
                                <StarRating
                                    disabled={true}
                                    maxStars={Rating}
                                    fullStarColor="#FFC600"
                                    starSize={20}
                                    rating={RatingCount} />
                                <FontedText style={{ color: secondTextColor, textAlign: 'center' }}>{` (${numeral(RatingCount)})`}</FontedText>
                            </View>

                            <View style={{
                                flexDirection: 'row',
                            }}>
                                <AntDesign name='like1' size={20} color='#d1d4d6' />
                                <FontedText style={{ color: secondTextColor, textAlign: 'center', bottom: -0.3 }}>{` (${numeral(Likes)})`}</FontedText>
                            </View>
                        </View>
                    </View>

                    <CustomTouchable
                        onPress={() => { onLongPress(item) }}
                        style={{
                            justifyContent: 'flex-start',
                            bottom: -2
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