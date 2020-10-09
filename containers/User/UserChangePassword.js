import React, { Component } from 'react'
import { ScrollView } from 'react-native'
import CustomHeader from '../../components/CustomHeader/index.js';
import LazyContainer from '../../components/LazyContainer'
import ItemSeparator from '../../components/ItemSeparator/index.js';
import HorizontalInput from '../../components/HorizontalInput/index.js';
import { withLocalize } from 'react-localize-redux';
import HeaderSubmitButton from '../../components/HeaderSubmitButton/index.js';
import { ChangeUserPassword } from '../../services/UsersService.js';
import { isValidPassword } from '../../utils/Validation.js';
import { STRING_LENGTH_MEDIUM } from '../../constants/Config';
import { LongToast } from '../../utils/Toast.js';

class UserChangePassword extends Component {
	constructor(props) {
		super(props)

		const { Id } = this.props.route.params
		this.userId = Id

		this.state = {
			lockSubmit: false,
			password: null,
			confirmPassword: null,
		}

		this.lockSubmit = false
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

		ChangeUserPassword(this.userId, password, res => {
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
				}}>
				<HorizontalInput
					maxLength={STRING_LENGTH_MEDIUM}
					label="Password"
					secureTextEntry={true}
					value={password}
					onChangeText={(text) => { this.setState({ password: text }) }} />

				<ItemSeparator />

				<HorizontalInput
					maxLength={STRING_LENGTH_MEDIUM}
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

				{this.renderContent()}
			</LazyContainer>
		)
	}
}

export default withLocalize(UserChangePassword)