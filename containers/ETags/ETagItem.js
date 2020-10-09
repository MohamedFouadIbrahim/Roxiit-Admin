import React, { PureComponent } from 'react'
import { View } from 'react-native'
import FontedText from '../../components/FontedText/index.js';
import CircularImage from '../../components/CircularImage/index.js';
import { largePagePadding, pagePadding } from '../../constants/Style.js';
import { secondTextColor } from '../../constants/Colors.js';
import CustomTouchable from '../../components/CustomTouchable';

export default class ETagItem extends PureComponent {
	render() {
		const { item, onPress, onLongPress, ...restProps } = this.props
		const { Icon: { ImageUrl }, Name, Description } = item

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
							justifyContent: 'center'
						}}>
						<FontedText style={{ color: 'black' }}>{Name}</FontedText>
						<FontedText style={{
								color: secondTextColor
								// color: '#949EA5'
						}}>{Description}</FontedText>
					</View>
				</View>
			</CustomTouchable>
		)
	}
}