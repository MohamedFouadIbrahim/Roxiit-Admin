import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Feather from 'react-native-vector-icons/Feather'
import CustomTouchable from '../CustomTouchable';

export default (props) => {
	return (
		<CustomTouchable
			{...props}>
			<LinearGradient
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 1 }}
				colors={['#E83F94', '#F54E5E']}
				style={{
					height: 50,
					width: 50,
					borderRadius: 25,
					justifyContent: 'center',
					alignItems: 'center',
				}}>
				<Feather
					name={"edit-2"}
					size={21}
					color={'white'}
					style={{
						// marginLeft: -1,
						// paddingLeft: 0,
					}} />
			</LinearGradient>
		</CustomTouchable>
	)
}