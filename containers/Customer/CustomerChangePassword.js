import React, { Component } from 'react'
import { ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import CustomHeader from '../../components/CustomHeader/index.js';
import LazyContainer from '../../components/LazyContainer'
import ItemSeparator from '../../components/ItemSeparator/index.js';
import HorizontalInput from '../../components/HorizontalInput/index.js';
import { withLocalize } from 'react-localize-redux';
import HeaderSubmitButton from '../../components/HeaderSubmitButton/index.js';
import { ChangeCustomerPassword } from '../../services/CustomersService.js';
import { isValidPassword } from '../../utils/Validation.js';
import { STRING_LENGTH_LONG } from '../../constants/Config.js'
import { LongToast } from '../../utils/Toast.js';

class CustomerChangePassword extends Component {
	constructor(props) {
		super(props)

		const { Id } = this.props.route.params
		this.customerId = Id

		this.state = {
			lockSubmit: false,
			password: null,
			confirmPassword: null,
		}

		this.lockSubmit = false
	}
	componentWillUnmount() {
		this.cancelFetchData && this.cancelFetchData()
	}
	submit = () => {
		if (this.lockSubmit) {
			return
		}

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

		this.setState({ lockSubmit: true })
		this.lockSubmit = true

		this.cancelFetchData = ChangeCustomerPassword(this.customerId, password, res => {
			this.setState({ didSucceed: true, })
			this.props.navigation.goBack()
		}, err => {
			this.setState({ lockSubmit: false })
			this.lockSubmit = false
		})
	}

	renderContent = () => {
		const { password, confirmPassword } = this.state

		return (
			<ScrollView
				contentContainerStyle={{
					flex: 1,
				}}>
				<HorizontalInput
					maxLength={STRING_LENGTH_LONG}
					label="Password"
					secureTextEntry={true}
					value={password}
					onChangeText={(text) => { this.setState({ password: text }) }} />

				<ItemSeparator />

				<HorizontalInput
					maxLength={STRING_LENGTH_LONG}
					label="ConfirmPassword"
					secureTextEntry={true}
					value={confirmPassword}
					onChangeText={(text) => { this.setState({ confirmPassword: text }) }} />
			</ScrollView>
		)
	}

	render() {
		return (
			<LazyContainer style={{ flex: 1, backgroundColor: "#FFF" }}>
				<CustomHeader
					navigation={this.props.navigation}
					title={"Password"}
					rightComponent={
						<HeaderSubmitButton
							isLoading={this.state.lockSubmit}
							didSucceed={this.state.didSucceed}
							onPress={() => { this.submit() }} />
					} />

				{/* {this.renderContent()} */}
				{
					Platform.OS == 'ios' ?

						<KeyboardAvoidingView behavior='padding' enabled
							style={{ flex: 1 }}
							keyboardVerticalOffset={40}
						>
							{this.renderContent()}
						</KeyboardAvoidingView> :

						this.renderContent()
				}


			</LazyContainer>
		)
	}
}

export default withLocalize(CustomerChangePassword)