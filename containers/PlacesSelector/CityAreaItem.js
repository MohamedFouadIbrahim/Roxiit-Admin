import React, { PureComponent } from 'react'
import FontedText from '../../components/FontedText/index.js';
import CheckBox from '../../components/CheckBox/index.js';
import { mainTextColor } from '../../constants/Colors.js';
import CustomTouchable from '../../components/CustomTouchable';

export default class CityAreaItem extends PureComponent {
	render() {
		const { item, onPress, index, ...restProps } = this.props
		const { Name, isSelected } = item

		return (
			<CustomTouchable
				onPress={() => { onPress(item, index) }}
				{...restProps}>
				<FontedText style={{
					color: mainTextColor
					// color: '#3B3B4D'
				}}>{Name}</FontedText>

				<CheckBox
					style={{
						alignSelf: 'flex-end',
					}}
					selected={isSelected} />
			</CustomTouchable>
		)
	}
}