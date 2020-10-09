import React from 'react'
import { Switch } from 'react-native';
import { switchBackground, secondColor } from '../../constants/Colors';

const CustomSwitch = (props) => (
	<Switch
		trackColor={{ switchBackground }}
		thumbColor={secondColor}
		{...props}
	/>
)
export default CustomSwitch