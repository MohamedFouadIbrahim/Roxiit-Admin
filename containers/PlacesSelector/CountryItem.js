import React, { PureComponent } from 'react'
import { View, Image } from 'react-native'
import FontedText from '../../components/FontedText/index.js';
import CheckBox from '../../components/CheckBox/index.js';
import { GetCountryFlag } from '../../utils/Places';
import { mainTextColor } from '../../constants/Colors.js';
import CustomTouchable from '../../components/CustomTouchable';

export default class CountryItem extends PureComponent {
	render() {
		const { item, onPress, index, ...restProps } = this.props
		const { Name, ISOAlpha_2, isSelected } = item

		return (
			<CustomTouchable
				onPress={() => { onPress(item, index) }}
				{...restProps}>
				<View
					style={{
						flexDirection: 'row',
						alignItems: 'center',
					}}>
					<Image
						source={GetCountryFlag(ISOAlpha_2)}
						style={{
							marginRight: 15,
							width: 50,
							height: 50,
							borderRadius: 10,
						}}
						resizeMode="contain" />

					<FontedText style={{
						// color: '#3B3B4D'
						color: mainTextColor
					}}>{Name}</FontedText>
				</View>

				<CheckBox
					style={{
						alignSelf: 'flex-end',
					}}
					selected={isSelected} />
			</CustomTouchable>
		)
	}
}