import React from 'react'
import { View, TextInput, I18nManager, Image } from 'react-native'
import { connect } from 'react-redux'
import { secondColor, mainTextColor, secondTextColor, mainColor } from '../../constants/Colors';
import FontedText from '../FontedText';
import TranslatedText from '../TranslatedText';
import { GetCountryFlag } from '../../utils/Places';
import CustomTouchable from '../CustomTouchable';
import { largePagePadding } from '../../constants/Style';
// import { mainColor, secondColor, mainTextColor, secondTextColor } from '../../constants/Colors';
class PhoneInput extends React.Component {

	constructor() {
		super()

		this.state = {
			isFocused: false,
		}

	}

	renderTitle = () => {

		const {
			title,
			titleStyle
		} = this.props

		if (title) {
			return (
				<TranslatedText style={[{
					fontSize: 14,
					marginBottom: 25,
					position: 'absolute',
					bottom: 13,
					marginHorizontal: 5,
					paddingHorizontal: 5,
					color: secondColor,
					backgroundColor: 'white'
				}, titleStyle]} text={title} />
			)
		}

	}


	render() {

		const {
			country_id,
		} = this.props

		const {
			value,
			style,
			countryId = country_id,
			countries,
			onPressFlag,
			placeholderTextColor = '#717175',
			containerStyle,
			...inputProps
		} = this.props

		const foundCountry = countries.find(item => item.Id === countryId)
		const { ISOAlpha_2, PhoneCode } = foundCountry

		return (
			<View
				style={[{
					marginHorizontal: largePagePadding,
					paddingHorizontal: 10,
					marginTop: largePagePadding,
					paddingVertical: 0,
					flexDirection: 'row',
					alignItems: 'center',
					borderColor: this.state.isFocused ? secondColor : mainColor,
					borderWidth: 0.5,
					borderRadius: 10,
					backgroundColor: 'white'
				}, containerStyle]}>

				{this.renderTitle()}
				<CustomTouchable
					onPress={onPressFlag}
					style={{
						flexDirection: 'row',
						alignItems: 'center',
						// height: '100%',
					}}>
					<Image
						source={GetCountryFlag(ISOAlpha_2)}
						style={{
							marginRight: 10,
							width: 30,
							height: 30,
							borderRadius: 10,
						}}
						resizeMode="contain" />

					<FontedText style={{
						// color: value ? '#3B3B4D' : '#949EA5', 
						color: this.state.isFocused ? secondColor : mainColor,
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
							color: this.state.isFocused ? secondColor : mainColor,
							textAlign: I18nManager.isRTL ? 'right' : 'left',
							paddingLeft: 0,
							marginLeft: 0,
							paddingVertical: 9
						}, style]}
						keyboardType='phone-pad'
						maxLength={15}
						placeholder={''}

						onFocus={() => {
							this.setState({ isFocused: true })
						}}
						onBlur={() => {
							this.setState({ isFocused: false })
						}}
						placeholderTextColor={placeholderTextColor}
						underlineColorAndroid='transparent'
						selectionColor={secondColor} />
				</View>
			</View>
		)
	}
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