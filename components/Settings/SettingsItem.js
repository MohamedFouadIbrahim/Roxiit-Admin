import React from 'react'
import { View, TouchableWithoutFeedback } from 'react-native'
import TranslatedText from '../TranslatedText';
import RemoteImage from '../RemoteImage';
import { mainTextColor, secondTextColor } from '../../constants/Colors';

export default SettingsItem = ({ title, image, info, infoStyle, leftComponent, rightComponent, onPress }) => {
	const renderInfoOnly = !image && !title

	renderTitle = () => {
		if (image) {
			return (
				<RemoteImage
					uri={image}
					wide={true}
					dimension={40}
					style={{
						width: 40,
						height: 30,
						borderRadius: 5,
					}} />
			)
		}
		else if (title) {
			return (
				<TranslatedText style={{
					// color: '#949EA5'
					color: secondTextColor
				}} text={title} />
			)
		}
		else {
			return null;
		}
	}

	renderContent = () => {
		if (renderInfoOnly) {
			return (
				<TranslatedText style={[{
					// color: '#3B3B4D'
					color: mainTextColor
				}, infoStyle]} text={info} />
			)
		}
		else {
			return ([
				<View
					key="0"
					style={[{
						justifyContent: 'center',
					}, image && !renderInfoOnly ? {} : { flex: 2 }]}>
					{this.renderTitle()}
				</View>
				,
				<View
					key="1"
					style={{
						flex: 5,
						justifyContent: 'center',
						paddingLeft: image ? 20 : 70,
					}}>
					<TranslatedText style={[{
						// color: '#3B3B4D'
						color: mainTextColor
					}, infoStyle]} text={info} />
				</View>
			])
		}
	}

	renderLeftComponent = () => {
		if (leftComponent) {
			return (
				<View
					style={{
						justifyContent: 'center',
						alignItems: 'center',
						marginRight: 20
					}}>
					{leftComponent}
				</View>
			)
		}
	}

	renderRightComponent = () => {
		if (rightComponent) {
			return (
				<View
					style={{
						flex: 1,
						justifyContent: 'center',
						alignItems: 'flex-end',
					}}>
					{rightComponent}
				</View>
			)
		}
	}

	return (
		<TouchableWithoutFeedback
			onPress={onPress}>
			<View
				style={{
					paddingVertical: 15,
					paddingHorizontal: 20,
					flexDirection: 'row',
					alignItems: 'center',
					backgroundColor: 'white',
				}}>
				{this.renderLeftComponent()}
				{this.renderContent()}
				{this.renderRightComponent()}
			</View>
		</TouchableWithoutFeedback>
	)
}