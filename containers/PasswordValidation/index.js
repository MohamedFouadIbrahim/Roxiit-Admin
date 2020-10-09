import React, { Component } from 'react'
import { ScrollView, Keyboard, View, StatusBar, Platform } from 'react-native'
import LazyContainer from '../../components/LazyContainer';
import { screenWidth } from '../../constants/Metrics';
// import CodeInput from '../../components/CodeInput';
import CustomHeader from '../../components/CustomHeader';
import TranslucentStatusBar from '../../components/TranslucentStatusBar';
import TranslatedText from '../../components/TranslatedText';
import { withLocalize } from 'react-localize-redux';
import { PasswordValidate } from '../../services/RegistrationService';
import { largePagePadding } from '../../constants/Style';
import { secondColor } from '../../constants/Colors';
// import { NavigationEvents } from 'react-navigation';
import CodeInput from '../../components/ConfirmationCodeInput/index';
import { LongToast } from '../../utils/Toast';
class PasswordValidation extends Component {
	constructor() {
		super()
		this.state = {
			isSubmitLocked: false,
		}
	}

	submit = (code) => {
		Keyboard.dismiss()

		this.setState({ isSubmitLocked: true })

		const { email } = this.props.route.params

		PasswordValidate(email, code, res => {
			this.props.navigation.replace('ChangePassword', { email, code })
		}, err => {
			this.setState({ isSubmitLocked: false })
			if (err.status === 404) {
				LongToast('IncorrectInput')
				return true
			}
		})
	}

	render() {
		return (
			<LazyContainer style={{ flex: 1, backgroundColor: secondColor, paddingTop: largePagePadding, }}>
				<TranslucentStatusBar />
				{/* <NavigationEvents onDidFocus={() => {
					if (Platform.OS === 'android') {
						StatusBar.setTranslucent(true);
					}
				}} /> */}
				<View style={{ width: screenWidth }} >
					<CustomHeader
						navigation={this.props.navigation}
						backgroundColor="transparent"
						title="ChangePassword" />
				</View>
				<ScrollView
					contentContainerStyle={{ justifyContent: 'center', flex: 1, paddingHorizontal: screenWidth * 0.1, paddingTop: screenWidth * 0.10, paddingBottom: screenWidth * 0.10 }}>
					<TranslatedText style={{ color: 'white', textAlign: 'center', marginBottom: 25 }} text="EnterConfirmCode" />

					<CodeInput onConfirm={(code) => { this.submit(code) }
					} />
				</ScrollView>
			</LazyContainer>
		)
	}
}

export default withLocalize(PasswordValidation)