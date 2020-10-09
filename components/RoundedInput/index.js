import React, { Component } from 'react';
import { I18nManager, TextInput, View } from 'react-native';
import FontedText from '../../components/FontedText';
import TranslatedText from '../../components/TranslatedText';
import { mainColor, mainTextColor, secondColor, secondTextColor } from '../../constants/Colors';
import { largePagePadding } from '../../constants/Style';
import { withLocalize } from 'react-localize-redux';

class RoundedInput extends Component {
	constructor() {
		super()

		this.state = {
			isFocused: false,
		}
	}

	renderlabel = () => {

		const {
			labelStyle,
			translatePlaceHolder,
			label,
		} = this.props

		if (translatePlaceHolder == false && label) {

			return (
				<FontedText
					style={[
						{
							fontSize: 14,
							top: 9,
							zIndex: 1,
							marginHorizontal: 5,
							color: secondTextColor,
							paddingHorizontal: 5,
							alignSelf: 'flex-start',
							color: secondColor
						},
						labelStyle
					]}
				>
					{label}
				</FontedText>
			)

		} else if (label) {

			return (<TranslatedText style={[
				{
					fontSize: 14,
					top: 9,
					zIndex: 1,
					marginHorizontal: 5,
					paddingHorizontal: 5,
					alignSelf: 'flex-start',
					backgroundColor: 'white',
					color: secondColor
				},
				labelStyle
			]} text={label} />)
		}
	}

	render() {
		const { props } = this

		let placeholderText;
		const {
			containerStyle,
			inputStyle,
			placeholder,
			translate,
			placeholderTextColor,
			label
		} = props

		if (placeholder) {
			placeholderText = translate(placeholder)
		}
		else if (label) {
			placeholderText = translate(label)
		}
		return (
			<View
				style={[{ marginHorizontal: largePagePadding }, containerStyle]}
			>

				{this.renderlabel()}

				<TextInput
					{...props}
					style={[
						{
							borderWidth: 0.5,
							paddingHorizontal: 10,
							paddingVertical: 8,
							width: '100%',
							fontSize: 16,
							borderColor: this.state.isFocused ? secondColor : mainColor,
							borderRadius: 10,
							color: mainTextColor,
							textAlign: I18nManager.isRTL ? 'right' : 'left'
						},
						inputStyle
					]}
					placeholder={placeholderText}
					placeholderTextColor={placeholderTextColor || '#717175'}
					underlineColorAndroid='transparent'
					selectionColor={mainColor}
					onFocus={() => {
						this.setState({ isFocused: true })
					}}
					onBlur={() => {
						this.setState({ isFocused: false })
					}}
				/>
			</View>
		)
	}
}

export default withLocalize(RoundedInput)