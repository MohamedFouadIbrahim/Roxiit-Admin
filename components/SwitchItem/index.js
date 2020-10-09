import React, { Component } from 'react'
import { View } from 'react-native'
import TranslatedText from '../TranslatedText';
import CustomSwitch from '../CustomSwitch/index'
import { secondTextColor } from '../../constants/Colors';

export default class SwitchItem extends Component {
	render() {
		const { title, style, ...switchProps } = this.props

		return (
			<View
				style={[{
					paddingVertical: 15,
					paddingHorizontal: 20,
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center',
					backgroundColor: 'white',
				}, style]}>
				<View
					style={{
						justifyContent: 'center',
					}}>
					<TranslatedText style={[{
						// color: '#949EA5'
						color: secondTextColor
					}, this.props.titleStyle]} text={title} />
				</View>

				<View
					style={{
						flexDirection: 'row',
						alignItems: 'center',
						paddingLeft: 10,
					}}>
					<CustomSwitch
						{...switchProps} />
				</View>
			</View>
		)
	}
}