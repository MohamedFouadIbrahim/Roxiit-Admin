import React, { PureComponent } from 'react'
import { View } from 'react-native'
import FontedText from '../../components/FontedText/index.js';
import CircularImage from '../../components/CircularImage/index.js';
import { largePagePadding, pagePadding } from '../../constants/Style.js';
import { secondTextColor } from '../../constants/Colors.js';
import CustomTouchable from '../../components/CustomTouchable';

export default class BrandItem extends PureComponent {
	render() {
		const { item, onPress, onLongPress, ...restProps } = this.props
		const { media: { ImageUrl }, Name, ShortDescription } = item

		return (
			<CustomTouchable
				onPress={() => { onPress(item) }}
				onLongPress={() => { onLongPress(item) }}
				{...restProps}>
				<View
					style={{
						backgroundColor: 'white',
						flexDirection: 'row',
						paddingHorizontal: largePagePadding,
						paddingVertical: pagePadding,
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
			</CustomTouchable>
		)
	}
}