import React from 'react';
import {
	View,
} from 'react-native';
import { thinLineGray } from '../../constants/Colors';

export default (props) => {
	const {
			style,
			...otherProps
		} = props;

	return (
		<View 
			style={[{ backgroundColor: thinLineGray, height: 0.5, }, style]}
			{...otherProps} />
	)
}