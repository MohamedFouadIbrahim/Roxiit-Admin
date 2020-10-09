import React, { PureComponent } from 'react'
import { View,  I18nManager } from 'react-native'
import FontedText from '../../components/FontedText/index.js';
import CircularImage from '../../components/CircularImage/index.js';
import { largePagePadding, pagePadding, largeBorderRadius } from '../../constants/Style.js';
import StarRating from 'react-native-star-rating';
import { mainColor, secondTextColor } from '../../constants/Colors.js';
import CustomTouchable from '../../components/CustomTouchable';
export default class ReviewItem extends PureComponent {
	render() {
		const { item, onPress, onLongPress, ...restProps } = this.props
		const { Product, Customer, Rating, IsReviewApproved, Order } = item;

		return (
			<CustomTouchable
				onPress={() => { onPress(item) }}
				onLongPress={() => { onLongPress(item) }}
				{...restProps}>
				<View
					style={{
						backgroundColor: IsReviewApproved == null ? '#eff4fc' : 'white',
						flexDirection: 'row',
						paddingHorizontal: largePagePadding,
						paddingVertical: pagePadding,
					}}>
					<CircularImage
						uri={Product.Media.ImageUrl} />
					<View
						style={{
							flex: 1,
							paddingLeft: largePagePadding,
							justifyContent: 'center'
						}}>
						<View style={{
							flexDirection: 'row', justifyContent: 'space-between',
							// if there an issue in Ios Design remove justifyContent and add some padding or margin
						}} >
							<FontedText style={{
								color: 'black',
								fontSize: 14,
								textAlign: I18nManager.isRTL ? 'right' : 'left'
							}}>{`${Product.Name.slice(0, 30)}`}</FontedText>
							<View
								style={{
									flexDirection: 'row',
									justifyContent: 'center',
									alignItems: 'center',
									paddingHorizontal: 10,
									paddingVertical: 4,
									backgroundColor: mainColor,
									borderRadius: largeBorderRadius,
								}}>
								<FontedText style={{ color: 'white', fontSize: 10 }}>{Order.Id}</FontedText>

							</View>
						</View>
						<View style={{ flexDirection: 'row', justifyContent: 'space-between' }} >
							<FontedText style={{
								// color: '#949EA5'
								color: secondTextColor
							}}>{`${Customer.Name.slice(0, 35)}...`}</FontedText>
							<StarRating
								containerStyle={{ marginTop: 5 }}
								disabled={true}
								maxStars={5}
								fullStarColor="#FFC600"
								starSize={15}
								rating={parseInt(Rating, 10)}
							/>
						</View>
					</View>
				</View>
			</CustomTouchable>
		)
	}
}