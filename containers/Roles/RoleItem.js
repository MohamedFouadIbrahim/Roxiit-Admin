import React, { PureComponent } from 'react'
import { View } from 'react-native'
import FontedText from '../../components/FontedText/index.js';
import { largePagePadding, pagePadding } from '../../constants/Style.js';
import { secondTextColor } from '../../constants/Colors.js';
import CustomTouchable from '../../components/CustomTouchable';

export default class RoleItem extends PureComponent {
	render() {
		const { item, onPress, onLongPress, ...restProps } = this.props
		const { Name, Description } = item

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
					<View
						style={{ flex: 1 }}>
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