import React from 'react'
import { View, I18nManager } from 'react-native'
import { secondColor, mainTextColor, secondTextColor } from '../../constants/Colors';
import TranslatedText from '../TranslatedText';
import TagsInput from "react-native-tags"
import { withLocalize } from 'react-localize-redux';

HorizontalTagsInput = (props) => {
	const { translate, label, style, placeholderTextColor, ...inputProps } = props

	return (
		<View
			style={{
				paddingVertical: 15,
				paddingHorizontal: 20,
				flexDirection: 'row',
				alignItems: 'center',
				backgroundColor: 'white',
			}}>
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
					paddingLeft: 70,
				}}>
				<TagsInput
					{...inputProps}
					textInputProps={{
						style: {
							fontSize: 15,
							textAlign: I18nManager.isRTL ? 'right' : 'left',
							// color: '#3B3B4D',
							color: mainTextColor,
							paddingLeft: 0,
							marginLeft: 0,
						},
						placeholder: translate('TypeNewTagHere'),
						placeholderTextColor: placeholderTextColor || '#717175',
						underlineColorAndroid: 'transparent',
						selectionColor: secondColor,
						maxLength: props.maxLength
					}}
					inputStyle={{
						backgroundColor: "white"
					}}
				/>
			</View>
		</View>
	)
}

export default withLocalize(HorizontalTagsInput)