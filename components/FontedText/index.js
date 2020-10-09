import React from 'react';
import {
	Text
} from 'react-native';

export default (props) => {
	const {
			style,
			children,
			font,
			...otherProps
		} = props;

	return (
		<Text
			style={[{ fontFamily: font || 'Montserrat-Regular', textAlign: 'left' } , style]}
			{...otherProps}
		>
			{children}
		</Text>
	);
}