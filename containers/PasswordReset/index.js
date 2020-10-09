import React, { Component } from 'react'
import { ImageBackground, ScrollView, View, StatusBar, Platform } from 'react-native'
import LazyContainer from '../../components/LazyContainer';
import { screenWidth } from '../../constants/Metrics';
import CustomInput from '../../components/CustomInput';
import CustomHeader from '../../components/CustomHeader';
import TranslucentStatusBar from '../../components/TranslucentStatusBar';
import CustomButton from '../../components/CustomButton';
import { largePagePadding } from '../../constants/Style';
import { withLocalize } from 'react-localize-redux';
import { PasswordForget } from '../../services/RegistrationService';
import { isValidEmail } from '../../utils/Validation';
import { STRING_LENGTH_MEDIUM } from '../../constants/Config';
// import { NavigationEvents } from 'react-navigation';
import { LongToast } from '../../utils/Toast';
class PasswordReset extends Component {
	constructor() {
		super()

		this.state = {
			isValidEmail: true,
			isSubmitLocked: false,
		}
	}
	submit = () => {
		const { email } = this.state;
		if (!email) {
			LongToast('CantHaveEmptyInputs')
			return;
		}

		if (!isValidEmail(this.state.email)) {
			LongToast('InvalidEmail')
			return;
		}
		this.setState({ isSubmitLocked: true })
		PasswordForget(this.state.email, res => {
			this.props.navigation.navigate('PasswordValidation', { email })
			this.setState({ isSubmitLocked: false })
		}, err => {
			this.setState({ isSubmitLocked: false })
			if (err.status === 404) {
				return LongToast('InvalidEmail')
			}
		})
	}

	render() {
		return (
			<View style={{ flex: 1 }}>
				{/* <NavigationEvents onDidFocus={() => {
					if (Platform.OS === 'android') {
						StatusBar.setTranslucent(true);
					}
				}} /> */}
				<TranslucentStatusBar />
				<ImageBackground
					blurRadius={5}
					style={{ flex: 1, paddingTop: largePagePadding, }}
					source={require("../../assets/images/registration/login_bg.jpg")}>

					<View style={{ width: screenWidth }}>
						<CustomHeader
							navigation={this.props.navigation}
							backgroundColor="transparent"
							title="ResetPassword" />
					</View>

					<ScrollView
						contentContainerStyle={{ justifyContent: 'flex-end', marginHorizontal: screenWidth * 0.1, paddingTop: screenWidth * 0.10, paddingBottom: screenWidth * 0.10 }}>
						<CustomInput
							backgroundStyle="dark"
							autoCapitalize="none"
							keyboardType="email-address"
							blurOnSubmit={false}
							onChangeText={(text) => {
								this.setState({ email: text, isValidEmail: true })
							}}
							onBlur={() => {
								this.setState({
									isValidEmail: isValidEmail(this.state.email)
								})
							}}
							value={this.state.email}
							valid={this.state.isValidEmail}
							maxLength={STRING_LENGTH_MEDIUM}
							containerStyle={{ marginBottom: 15, }}
							placeholder={"Email"} />

						<CustomButton
							onPress={() => {
								this.submit()
							}}
							style={{ marginTop: 15, }}
							loading={this.state.isSubmitLocked}
							uppercase={true}
							title={"ResetPassword"} />
					</ScrollView>
				</ImageBackground>
			</View>
		)
	}
}

export default PasswordReset