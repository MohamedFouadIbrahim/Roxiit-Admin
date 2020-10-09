import React, { Component } from 'react'
import { View } from 'react-native'
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { largePagePadding, shadowStyle0 } from '../../constants/Style';
import { screenWidth } from '../../constants/Metrics';
import { secondColor } from '../../constants/Colors';

class CustomMultiSlider extends Component {
	render() {
		const { color = secondColor } = this.props

		return (
			<MultiSlider
				containerStyle={{
					justifyContent: 'center',
					alignItems: 'center',
					alignSelf: 'center',
				}}
				sliderLength={screenWidth - (largePagePadding * 2)}
				selectedStyle={{
					backgroundColor: color
				}}
				customMarker={() => (
					<View style={{
						backgroundColor: color,
						width: 20,
						height: 20,
						borderRadius: 10,
						...shadowStyle0,
					}} />
				)}
				{...this.props}
			/>
		)
	}
}

export default CustomMultiSlider