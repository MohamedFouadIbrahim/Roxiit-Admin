import React, { Component } from 'react'
import { View, Image, } from 'react-native'
import { screenWidth, screenHeight } from '../../constants/Metrics';
import { largePagePadding } from '../../constants/Style';
import TranslatedText from '../TranslatedText';
import CustomButton from '../CustomButton';
import { mainTextColor } from '../../constants/Colors';

class FloatingNotice extends Component {
	render() {
		const { isVisible, title, info, image, button, onPressButton } = this.props

		if (isVisible) {
			return (
				<View
					style={{
						backgroundColor: "white",
						justifyContent: 'center',
						alignItems: 'center',
						position: "absolute",
						zIndex: 1,
						width: screenWidth,
						height: screenHeight,
						padding: 35,
					}}>
					<Image
						style={{
							width: 150,
							height: 150,
							marginBottom: 5,
						}}
						source={image} />

					<TranslatedText
						style={{
							// color: '#3B3B4D',
							color: mainTextColor,
							fontSize: 24,
							marginHorizontal: largePagePadding,
						}}
						text={title} />

					<TranslatedText
						style={{ color: '#6C7B8A', fontSize: 14, textAlign: "center", marginTop: 10, opacity: .6 }}
						text={info} />

					<CustomButton
						onPress={() => {
							onPressButton && onPressButton()
						}}
						style={{
							backgroundColor: "#19c6a9",
							marginTop: 60,
						}}
						fullWidth={true}
						uppercase={true}
						title={button} />
				</View>
			)
		}
		else {
			return null
		}
	}
}

export default FloatingNotice