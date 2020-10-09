import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { mainColor, thinLineGray } from '../../constants/Colors';

const CheckBox = (props) => {
	const {
		size = 22,
		selected,
		...restProps
	} = props;

	if (selected) {
		return (
			<Ionicons
				name={"ios-checkmark-circle"}
				size={size}
				color={mainColor}
				{...restProps} />
		)
	}
	else {
		return (
			<Ionicons
				name={"ios-checkmark-circle-outline"}
				size={size}
				color={thinLineGray}
				{...restProps} />
		)
	}
}

export default CheckBox