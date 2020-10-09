import React, { PureComponent } from 'react'
import {  View, I18nManager } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { mainTextColor } from '../../constants/Colors.js';
import CustomTouchable from '../../components/CustomTouchable/index.js';
import FontedText from '../../components/FontedText/index.js';
import CheckBox from '../../components/CheckBox/index.js';

class MultiLevelSelectorItem extends PureComponent {
	render() {
		const { 
			item, 
			onPress, 
			onSelect, 
			index, 
			canSelectParents, 
			...restProps
		} = this.props
		
		const { 
			Name, 
			isSelected, 
			hasChildren, 
		} = item

		return (
			<CustomTouchable
				onPress={() => { onPress(item, index) }}
				style={{
					paddingHorizontal: 20,
					paddingVertical: 15,
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center',
				}}
				{...restProps}>
				<View
					style={{
						justifyContent: 'center',
					}}>
					<FontedText style={{ color: mainTextColor, }}>{Name}</FontedText>
				</View>

				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'flex-end',
						alignItems: 'center',
					}}>
					{(canSelectParents || !hasChildren) && <CustomTouchable
						style={{
							paddingVertical: 5,
							paddingLeft: 20,
						}}
						onPress={() => { onSelect(item, index) }}>
						<CheckBox
							size={22}
							selected={isSelected} />
					</CustomTouchable>}

					<Ionicons
						style={{
							marginLeft: 10,
						}}
						name={I18nManager.isRTL ? 'ios-arrow-back' : 'ios-arrow-forward'}
						size={22}
						color={hasChildren && !isSelected ? mainTextColor : 'transparent'} />
				</View>
			</CustomTouchable>
		)
	}
}

export default MultiLevelSelectorItem