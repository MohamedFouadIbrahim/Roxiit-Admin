import React, { PureComponent } from 'react'
import { View } from 'react-native'
import FontedText from '../../components/FontedText/index.js';
import CircularImage from '../../components/CircularImage/index.js';
import { largePagePadding, pagePadding } from '../../constants/Style.js';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { secondTextColor } from '../../constants/Colors.js';
import CustomTouchable from '../../components/CustomTouchable';

export default class ArticleItem extends PureComponent {
	render() {
		const { item, onPress, onLongPress, move, isActive, ...restProps } = this.props
		const { Name, ShortDescription, Image: { ImageUrl } } = item

		return (
			<CustomTouchable
				onPress={() => { onPress(item) }}
				onLongPress={() => { onLongPress(item) }}
				{...restProps}>
				<View
					style={{
						backgroundColor: isActive ? '#cccccc' : 'white',
						flexDirection: 'row',
						justifyContent: 'space-between',
						paddingHorizontal: largePagePadding,
						paddingVertical: pagePadding,
					}}>
					<View
						style={{
							flex: 1,
							flexDirection: 'row',
						}}>
						<CircularImage
							uri={ImageUrl} />

						<View
							style={{
								flex: 1,
								paddingLeft: largePagePadding,
							}}>
							<FontedText style={{ color: 'black' }}>{Name}</FontedText>
							<FontedText style={{
								// color: '#949EA5'
								color: secondTextColor
							}}>{ShortDescription}</FontedText>
						</View>
					</View>

					<CustomTouchable
						onLongPress={move}
						style={{
							padding: 10,
						}}>
						<Ionicons
							name={`ios-menu`}
							size={28}
							// color={'#949EA5'}
							color={secondTextColor}
						/>
					</CustomTouchable>
				</View>
			</CustomTouchable>
		)
	}
}