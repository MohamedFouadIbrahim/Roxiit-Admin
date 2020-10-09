import React, { PureComponent } from 'react'
import { View } from 'react-native'
import FontedText from '../../components/FontedText/index.js';
import CircularImage from '../../components/CircularImage/index.js';
import { largePagePadding, pagePadding, mediumPagePadding } from '../../constants/Style.js';
import { secondTextColor } from '../../constants/Colors.js';
import CustomTouchable from '../../components/CustomTouchable';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default class CategoryItem extends PureComponent {
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
						paddingHorizontal: mediumPagePadding,
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
							// color: '#949EA5'
							color: secondTextColor
						}}>{Description}</FontedText>
					</View>
					<CustomTouchable
						onPress={() => { onLongPress(item) }} >
						<MaterialIcons
							name={`more-vert`}
							size={20} />
					</CustomTouchable>
				</View>
			</CustomTouchable>
		)
	}
}