import React, { Component } from 'react'
import { ImageBackground, ScrollView, View, StatusBar, Platform } from 'react-native'
import LazyContainer from '../../components/LazyContainer';
import { screenWidth } from '../../constants/Metrics';
import CustomInput from '../../components/CustomInput';
import CustomHeader from '../../components/CustomHeader';
import TranslucentStatusBar from '../../components/TranslucentStatusBar';
import { withLocalize } from 'react-localize-redux';
import { PasswordReset } from '../../services/RegistrationService';
import CustomButton from '../../components/CustomButton';
import { isValidPassword } from '../../utils/Validation';
import { largePagePadding } from '../../constants/Style';
import { STRING_LENGTH_MEDIUM } from '../../constants/Config';
// import { NavigationEvents } from 'react-navigation';
import FontedText from '../../components/FontedText';
import { LongToast } from '../../utils/Toast';

class ChangePassword extends Component {
	constructor() {
		super()

		this.state = {
			isValidEmail: false,
			isSubmitLocked: false,
		}
	}

	submit = () => {
		const { password, confirmPassword } = this.state

		if (!password || !confirmPassword) {
			return LongToast('CantHaveEmptyInputs')
		}

		if (password.length < 6) {
			LongToast('TooShortPassword')
			return;
		}

		if (!isValidPassword(password)) {
			return LongToast('InvalidPasswordFormat')
		}

		if (password !== confirmPassword) {
			return LongToast('PassDontMatch')
		}

		this.setState({ isSubmitLocked: true })

		const { email, code } = this.props.route.params

		PasswordReset(email, code, password, res => {
			this.props.navigation.navigate('Login')
		}, err => {
			this.setState({ isSubmitLocked: false })
		})
	}

	render() {
		const { translate } = this.props
		return (
			<LazyContainer style={{ flex: 1 }}>
				<TranslucentStatusBar />
				{/* <NavigationEvents onDidFocus={() => {
					if (Platform.OS === 'android') {
						StatusBar.setTranslucent(true);
					}
				}} /> */}

				<ImageBackground
					blurRadius={5}
					style={{ flex: 1, paddingTop: largePagePadding, }}
					source={require("../../assets/images/registration/login_bg.jpg")}>
					<View style={{ width: screenWidth }} >
						<CustomHeader
							navigation={this.props.navigation}
							backgroundColor="transparent"
							title="ChangePassword" />
					</View>

					<ScrollView
						contentContainerStyle={{ justifyContent: 'flex-end', marginHorizontal: screenWidth * 0.1, paddingTop: screenWidth * 0.10, paddingBottom: screenWidth * 0.10 }}>
						<CustomInput
							backgroundStyle="dark"
							autoCapitalize="none"
							onChangeText={(text) => {
								this.setState({ password: text })
							}}
							containerStyle={{ marginBottom: 15, }}
							placeholder={"Password"}
							maxLength={STRING_LENGTH_MEDIUM}
							value={this.state.password}
							secureTextEntry={true} />

						<CustomInput
							backgroundStyle="dark"
							autoCapitalize="none"
							onChangeText={(text) => {
								this.setState({ confirmPassword: text })
							}}
							containerStyle={{ marginBottom: 15, }}
							maxLength={STRING_LENGTH_MEDIUM}
							placeholder={"ConfirmPassword"}
							value={this.state.confirmPassword}
							secureTextEntry={true} />

						<CustomButton
							onPress={() => { this.submit() }}
							style={{ marginTop: 15, }}
							loading={this.state.isSubmitLocked}
							uppercase={true}
							title={"ChangePassword"} />
						<FontedText style={{ color: '#fff', marginTop: 40, alignSelf: 'center' }} >{translate('InvalidPasswordFormat')}</FontedText>
					</ScrollView>
				</ImageBackground>
			</LazyContainer>
		)
	}
}

export default withLocalize(ChangePassword)