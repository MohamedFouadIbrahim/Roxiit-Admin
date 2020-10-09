import React, { PureComponent } from 'react'
import { View, I18nManager } from 'react-native'
import FontedText from '../../components/FontedText/index.js';
import CircularImage from '../../components/CircularImage/index.js';
import { largePagePadding, pagePadding, largeBorderRadius } from '../../constants/Style.js';
import { mainColor, secondTextColor } from '../../constants/Colors.js';
import Ionicons from 'react-native-vector-icons/Ionicons'
import CustomTouchable from '../../components/CustomTouchable';

export default class QuestionItem extends PureComponent {
	render() {
		const { item, onPress, onLongPress, onSelectorPress, ...restProps } = this.props
		const { Id, Product, Customer, Status, QuestionText, CustomerImage, LikesCount, ProductImage, isAnswered } = item;

		return (
			<CustomTouchable
				onPress={() => { onPress(item) }}
				onLongPress={() => { onLongPress(item) }}
				{...restProps}>
				<View
					style={{
						backgroundColor: isAnswered == true ? 'white' : '#eff4fc',
						flexDirection: 'row',
						paddingHorizontal: largePagePadding,
						paddingVertical: pagePadding,
					}}>
					<CircularImage
						uri={ProductImage.ImageUrl} />
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
							<CustomTouchable
								onPress={() => {
									this.changingquestionId = Id
									this.changingStutasId = Status.Id
									onSelectorPress && onSelectorPress(Id)
								}}
								style={{
									flexDirection: 'row',
									justifyContent: 'center',
									alignItems: 'center',
									paddingHorizontal: 10,
									paddingVertical: 4,
									backgroundColor: mainColor,
									borderRadius: largeBorderRadius,
									marginTop: 15,
								}}>
								<FontedText style={{ color: 'white', fontSize: 10, }}>{Status.Name}</FontedText>

								<Ionicons
									name={"md-arrow-dropdown"}
									size={18}
									color={'white'}
									style={{
										marginLeft: 5,
									}} />
							</CustomTouchable>

						</View>
						<FontedText style={{
							// color: '#949EA5'
							color: secondTextColor
						}}>{`${QuestionText.slice(0, 35)}...`}</FontedText>
					</View>
				</View>
			</CustomTouchable>
		)
	}
}