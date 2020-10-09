import React, { Component } from 'react'
import { ImageBackground, View, ScrollView, Image, Keyboard, KeyboardAvoidingView, StatusBar, Platform } from 'react-native'
import { screenWidth, screenHeight } from '../../constants/Metrics';
import CustomInput from '../../components/CustomInput';
import { connect } from 'react-redux'
import { withLocalize } from "react-localize-redux";
import TranslucentStatusBar from '../../components/TranslucentStatusBar';
import { isValidEmail } from '../../utils/Validation';
import DeviceInfo from 'react-native-device-info';
import CustomButton from '../../components/CustomButton';
import { LoginUser } from '../../services/RegistrationService';
import LanguageInitializer from '../../LanguageInitializer';
import Hello from '../../Hello';
// import { NavigationEvents } from 'react-navigation'
import TranslatedText from '../../components/TranslatedText';
import CheckBox from '../../components/CheckBox';
import { isDevelopmentMode } from '../../constants/Config';
import { DEFAULT_ROOT_URL_DEV, DEFAULT_ROOT_URL_DIST } from '../../utils/Network';
import { LongToast } from '../../utils/Toast';
import CustomTouchable from '../../components/CustomTouchable';
import { EventRegister } from 'react-native-event-listeners'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { TextView } from '../Pages/ItemsComponent';

class Login extends Component {
	constructor() {
		super()

		this.state = {
			isValidEmail: true,
			isSubmitLocked: false,
			loadHello: false,
			loadLanguageInitializer: false,
			email: (isDevelopmentMode ? 'roxiit@hotmail.com' : ""),
			password: (isDevelopmentMode ? 'a1B2c3D4' : "")
		}
	}

	componentDidMount() {
		this.props.setRootURL(isDevelopmentMode ? DEFAULT_ROOT_URL_DEV : DEFAULT_ROOT_URL_DIST)

		this.autoLoginListener = EventRegister.addEventListener('AutoLogin', ({ email, password, dev }) => {
			this.props.setRootURL(dev ? DEFAULT_ROOT_URL_DEV : DEFAULT_ROOT_URL_DIST)

			this.setState({
				email,
				password,
			}, () => {
				this.submitLogin()
			})
		})
	}

	componentWillUnmount() {
		EventRegister.removeEventListener(this.autoLoginListener)
	}

	submitLogin = async () => {
		const { password, email, isValidEmail } = this.state;

		Keyboard.dismiss()

		if (!email || !password) {
			LongToast('CantHaveEmptyInputs')
			return;
		}

		if (!isValidEmail) {
			LongToast('InvalidEmail')
			return;
		}

		this.setState({ isSubmitLocked: true })

		const deviceName = await DeviceInfo.getDeviceName()

		LoginUser({
			AccountLogin: email,
			Password: password,
			devicemodel: DeviceInfo.getModel(),
			deviceBrand: DeviceInfo.getBrand(),
			deviceName,
			deviceID: DeviceInfo.getUniqueId(),
		},
			({ data: { AccessToken, TenantId, ServerUrl } }) => {
				const {
					setMainToken,
					setSecondaryToken,
					setRootURL,
				} = this.props;

				if (ServerUrl[ServerUrl.length - 1] === '/') {
					ServerUrl = ServerUrl.slice(0, -1);
				}

				setMainToken(AccessToken);
				setRootURL(ServerUrl);
				setSecondaryToken(TenantId);

				this.setState({ loadHello: true })
				// Todo: Check language
			}, err => {
				this.setState({ isSubmitLocked: false })

				if (err.status === 404) {
					LongToast('FailedLogin')
					return true
				}
			})
	}

	addHelloInitializer = () => {
		if (this.state.loadHello) {
			return (
				<Hello
					force_logged_in={true}
					onFinish={() => { this.setState({ loadLanguageInitializer: true }) }} />
			)
		}
		else {
			return null
		}
	}

	addLanguageInitializer = () => {
		if (this.state.loadLanguageInitializer) {
			return (
				<LanguageInitializer
					key={0}
					force_logged_in={true}
					onLanguageInit={() => {
						const {
							setIsLoggedIn,
							setDidNeverLogin,
						} = this.props;

						setIsLoggedIn(true)
						setDidNeverLogin(false)
					}} />
			)
		}
		else {
			return null
		}
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
					style={{ flex: 1 }}
					source={require("../../assets/images/registration/login_bg.jpg")}>
					<KeyboardAwareScrollView
						extraHeight={90}
						extraScrollHeight={90}
						innerRef={ref => {
							this.scroll = ref
						}}
						contentContainerStyle={{
							minHeight: screenHeight,
							justifyContent: 'center',
							alignItems: 'center',
							flexDirection: 'row',
						}}>

						<View
							style={{
								padding: 20,
								borderRadius: 14,
								backgroundColor: 'rgba(255, 255, 255, 0.9)',
								flex: .8,
							}}
						>
							<Image
								resizeMode="contain"
								style={{
									height: 100,
									marginBottom: 50,
									marginTop: 30,
									alignSelf: 'center',
								}}
								source={require("../../assets/images/logo/login.png")} />
							<KeyboardAvoidingView
								behavior='padding'
								keyboardVerticalOffset={0}
							>
								<CustomInput
									backgroundStyle="dark"
									autoCapitalize="none"
									keyboardType="email-address"
									returnKeyType="next"
									blurOnSubmit={false}
									onChangeText={(text) => {
										this.setState({ email: text, isValidEmail: true })
									}}
									onBlur={() => {
										this.setState({
											isValidEmail: isValidEmail(this.state.email)
										})
									}}
									onSubmitEditing={() => { this.input2Ref.focus(); }}
									value={this.state.email}
									valid={this.state.isValidEmail}
									containerStyle={{ marginBottom: 15, }}
									placeholder={"Email"} />

								<CustomInput
									onRef={(ref) => { this.input2Ref = ref; }}
									backgroundStyle="dark"
									autoCapitalize="none"
									returnKeyType="done"
									onChangeText={(text) => {
										this.setState({ password: text })
									}}
									onSubmitEditing={() => { this.submitLogin() }}
									containerStyle={{ marginBottom: 15, }}
									placeholder={"Password"}
									value={this.state.password}
									secureTextEntry={true} />

								<CustomButton
									onPress={() => { this.submitLogin() }}
									style={{}}
									loading={this.state.isSubmitLocked}
									uppercase={true}
									title={"Login"} />

								<View
									style={{
										flexDirection: 'row',
										paddingTop: 20
									}}>
									<CheckBox selected={true} />
									<TranslatedText style={{ fontSize: 12, paddingHorizontal: 5 }} text={'TermsAndCondation'} />
								</View>
							</KeyboardAvoidingView>

							{/* <View
							style={{
								// marginTop: 25,
								height: 50,
								flexDirection: 'row',
								justifyContent: 'space-between',
								alignItems: 'center',
							}}>
							<CustomTouchable
								onPress={() => {
									this.props.navigation.navigate('PasswordReset')
									// this.props.navigation.navigate('PasswordValidation')
								}}
								style={{
									paddingVertical: 5,
								}}>
								<TranslatedText
									style={{ color: 'rgba(255,255,255,0.85)', fontSize: 12 }}
									text="ResetPassword"
									uppercase={true} />
							</CustomTouchable> 
						</View> */}

						</View>
					</KeyboardAwareScrollView>
				</ImageBackground>

				{this.addHelloInitializer()}
				{this.addLanguageInitializer()}
			</View>
		)
	}
}

function mergeProps(stateProps, { dispatch }, ownProps) {
	const {
		actions: {
			setIsLoggedIn,
			setDidNeverLogin,
			setMainToken,
			setSecondaryToken,
		}
	} = require('../../redux/LoginRedux.js');

	const {
		actions: {
			setRootURL,
		}
	} = require('../../redux/ServerRedux.js');

	return {
		...ownProps,
		...stateProps,
		setIsLoggedIn: (is_logged_in) => setIsLoggedIn(dispatch, is_logged_in),
		setDidNeverLogin: (did_never_log_in) => setDidNeverLogin(dispatch, did_never_log_in),
		setMainToken: (main_token) => setMainToken(dispatch, main_token),
		setSecondaryToken: (secondary_token) => setSecondaryToken(dispatch, secondary_token),
		setRootURL: (root_url) => setRootURL(dispatch, root_url),
	};
}

export default connect(undefined, undefined, mergeProps)(withLocalize(Login))