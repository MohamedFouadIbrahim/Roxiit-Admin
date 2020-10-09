import React from 'react'
import { TouchableOpacity } from 'react-native'

export default CustomTouchable = ({ onPress, children, ...restProps }) => {
	handleOnPress = () => {
		if (onPress) {
			requestAnimationFrame(() => { onPress() })
		}
	}
	
	return (
		<TouchableOpacity
			onPress={handleOnPress}
			delayPressIn={0}
			{...restProps}>
			{children}
		</TouchableOpacity>
	)
}