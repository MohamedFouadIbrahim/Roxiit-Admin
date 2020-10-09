import React from 'react'
import { View, TextInput, I18nManager } from 'react-native'
import { secondColor, mainTextColor, secondTextColor } from '../../constants/Colors';
import TranslatedText from '../TranslatedText';
import FontedText from '../FontedText';
import { withLocalize } from 'react-localize-redux';

const HorizontalInput = (props) => {
	const { 
		label, 
		placeholder,
		style, 
		placeholderTextColor, 
		containerStyle, 
		rightMember, 
		middleMember, 
		translate,
		...inputProps 
	} = props

	let placeholderText

	if (placeholder) {
		placeholderText = translate(placeholder)
	}
	else if (label) {
		placeholderText = translate(label)
	}

	return (
		<View
			style={[{
				paddingVertical: 15,
				paddingHorizontal: 20,
				flexDirection: 'row',
				alignItems: 'center',
				backgroundColor: 'white',
			},  containerStyle ]}>
			<View
				style={{
					justifyContent: 'center',
					flex: 2,
				}}>
				<TranslatedText style={{
					// color: '#949EA5'
					color: secondTextColor
				}} text={label} />
			</View>

			<View
				style={{
					flex: 5,
					justifyContent: 'center',
					paddingLeft: 70,
					flexDirection: middleMember ? 'row' : 'column'
				}}>

				{middleMember && <View
					style={{
						justifyContent: 'center',
					}}
				>
					<FontedText style={{ textAlign: I18nManager.isRTL ? 'right' : 'left', color: 'black', fontSize: 16 }} >{middleMember}</FontedText>
				</View>}

				<TextInput
					{...inputProps}
					style={[{
						fontSize: 15,
						// color: inputProps.editable === false ? '#949EA5' : '#3B3B4D',
						color: inputProps.editable === false ? secondColor : mainTextColor,
						textAlign: I18nManager.isRTL ? 'right' : 'left',
						paddingLeft: 0,
						marginLeft: 0,
					}, style]}
					placeholder={placeholderText}
					placeholderTextColor={placeholderTextColor || '#717175'}
					underlineColorAndroid='transparent'
					selectionColor={secondColor}
				/>
			</View>

			{rightMember && <View
				style={{
					flex: 2,
					justifyContent: 'center',
				}}
			>
				<FontedText style={{ textAlign: I18nManager.isRTL ? 'right' : 'left', color: 'black', fontSize: 16 }} >{rightMember}</FontedText>
			</View>}

		</View>
	)
}

export default withLocalize(HorizontalInput)