import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import CustomTouchable from '../CustomTouchable';

export default ({ style, ...otherProps }) => (
	<CustomTouchable
		style={{
			borderRadius: 10,
			paddingVertical: 2,
			paddingHorizontal: 10,
			backgroundColor: '#EFF0F1',
		}}
		{...otherProps}>
		<Ionicons name='ios-close' color='#888888' size={19} />
	</CustomTouchable>
)