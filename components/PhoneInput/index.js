import React from 'react'
import { View, TextInput, I18nManager, Image } from 'react-native'
import { connect } from 'react-redux'
import { secondColor, mainTextColor, secondTextColor } from '../../constants/Colors';
import FontedText from '../FontedText';
import { GetCountryFlag } from '../../utils/Places';
import CustomTouchable from '../CustomTouchable';

const PhoneInput = (props) => {
	const {
		country_id,
	} = props

	const {
		value,
		style,
		countryId = country_id,
		countries,
		onPressFlag,
		placeholderTextColor = '#717175',
		containerStyle,
		...inputProps
	} = props

	const foundCountry = countries.find(item => item.Id === countryId)
	const { ISOAlpha_2, PhoneCode } = foundCountry

	return (
		<View
			style={[{
				paddingVertical: 15,
				paddingHorizontal: 20,
				flexDirection: 'row',
				alignItems: 'center',
				backgroundColor: 'white'
			}, containerStyle]}>
			<CustomTouchable
				onPress={onPressFlag}
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					height: '100%',
				}}>
				<Image
					source={GetCountryFlag(ISOAlpha_2)}
					style={{
						marginRight: 10,
						width: 40,
						height: 40,
						borderRadius: 10,
					}}
					resizeMode="contain" />

				<FontedText style={{
					// color: value ? '#3B3B4D' : '#949EA5', 
					color: value ? mainTextColor : secondTextColor,
					fontSize: 16, marginBottom: 3,
				}}>{PhoneCode}</FontedText>
			</CustomTouchable>

			<View
				style={{
					flex: 1,
					justifyContent: 'center',
					paddingLeft: 5,
				}}>
				<TextInput
					{...inputProps}
					value={value}
					style={[{
						fontSize: 15,
						// color: '#3B3B4D',
						color: mainTextColor,
						textAlign: I18nManager.isRTL ? 'right' : 'left',
						paddingLeft: 0,
						marginLeft: 0,
					}, style]}
					keyboardType='phone-pad'
					maxLength={15}
					placeholder={''}
					placeholderTextColor={placeholderTextColor}
					underlineColorAndroid='transparent'
					selectionColor={secondColor} />
			</View>
		</View>
	)
}

const mapStateToProps = ({
	places: {
		countries,
	},
	login: {
		country_id,
	},
}) => ({
	country_id,
	countries,
})

export default connect(mapStateToProps)(PhoneInput)