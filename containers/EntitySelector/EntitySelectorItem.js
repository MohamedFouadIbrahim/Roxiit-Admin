import React, { PureComponent } from 'react'
import { View } from 'react-native'
import FontedText from '../../components/FontedText/index.js';
import CheckBox from '../../components/CheckBox/index.js';
import { mainTextColor, secondTextColor } from '../../constants/Colors.js';
import CustomTouchable from '../../components/CustomTouchable/index.js';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { pagePadding } from '../../constants/Style.js';

export default class EntitySelectorItem extends PureComponent {
	render() {
		const { 
			item, 
			itemTextColorModifier,
			onPress, 
			index, 
			move, 
			moveEnd, 
			isActive,
			style,
			bgColor,
			reorder,
			...restProps 
		} = this.props

		const { 
			Name, 
			isSelected 
		} = item

		return (
			<CustomTouchable
				onPress={() => { onPress(item, index) }}
				style={[style, {
					backgroundColor: isActive ? '#cccccc' : bgColor
				}]}
				{...restProps}>
				<FontedText style={{ color: (itemTextColorModifier && itemTextColorModifier(item, index)) || mainTextColor }}>{Name}</FontedText>

				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'space-between',
						alignItems: 'center',
					}}>
					<CheckBox
						style={{
						}}
						selected={isSelected} />

					{reorder && <CustomTouchable
						onLongPress={move}
						onPressOut={moveEnd}
						style={{
							paddingVertical: pagePadding,
							paddingLeft: pagePadding,
							marginLeft: 5,
						}}>
						<Ionicons
							name={`ios-menu`}
							size={28}
							color={secondTextColor}
						/>
					</CustomTouchable>}
				</View>
			</CustomTouchable>
		)
	}
}