import React, { Component } from 'react'
import { ScrollView, KeyboardAvoidingView, View, Platform } from 'react-native'
import { connect } from 'react-redux'
import CustomHeader from '../../components/CustomHeader/index.js';
import LazyContainer from '../../components/LazyContainer'
import ItemSeparator from '../../components/ItemSeparator/index.js';
import HorizontalInput from '../../components/HorizontalInput/index.js';
import { withLocalize } from 'react-localize-redux';
import HeaderSubmitButton from '../../components/HeaderSubmitButton/index.js';
import ArrowItem from '../../components/ArrowItem/index.js';
import { SelectCountry } from '../../utils/Places.js';
import { GetMyLocation } from '../../services/PlacesService.js';
import PhoneInput from '../../components/PhoneInput/index.js';
import CustomSelector from '../../components/CustomSelector/index.js';
import { GetRolesSimple } from '../../services/RolesService.js';
import { isValidEmail, isValidMobileNumber, isValidPassword } from '../../utils/Validation';
import { AddNewUser } from '../../services/UsersService.js';
import { STRING_LENGTH_MEDIUM } from '../../constants/Config';
import { getFilters } from '../../services/FilterService.js';
import { LongToast } from '../../utils/Toast.js';
import SwitchItem from '../../components/SwitchItem/index.js';

class AddUser extends Component {
	constructor(props) {
		super(props)
		const { languages_data, currLang } = this.props
		this.state = {
			lockSubmit: false,
			Language: languages_data.find(item => item.code === currLang),
			IsDriver: false
		}

		this.lockSubmit = false
		this.roleSelectorRef = React.createRef();
		this.languageSelectorRef = React.createRef();
		this.SubStoresRef = React.createRef()

	}
	componentWillUnmount() {
		this.cancelFetchDatagetFilters && this.cancelFetchDatagetFilters()
		this.cancelFetchGetMyLocation && this.cancelFetchGetMyLocation()
		this.cancelFetchGetRolesSimple && this.cancelFetchGetRolesSimple()
	}
	componentDidMount = () => {
		this.cancelFetchGetMyLocation = GetMyLocation(res => {
			this.setState({
				Country: res.data,
				PhoneCountry: res.data,
			})
		})

		this.cancelFetchGetRolesSimple = GetRolesSimple(res => {
			this.setState({
				roles: res.data.Data
			})
		})
		this.cancelFetchDatagetFilters = getFilters({
			subStores: true
		}, res => {
			let {
				SubStores
			} = res.data

			SubStores.unshift({ Id: 0, Name: 'Create New' })

			this.setState({
				SubStores,
				didFetchData: true
			})
		})

	}


	submit = () => {
		if (this.lockSubmit) {
			return
		}

		const {
			FirstName,
			SecondeName,
			Email,
			Country,
			PhoneCountry,
			Password,
			ConfirmPassword,
			Language,
			Role,
			SubStore,
			IsDriver
		} = this.state

		let {
			Phone,
		} = this.state


		if (!FirstName || !SecondeName || !Phone || !Email || !Country || !Password || !ConfirmPassword || !Language || !Role) {
			return LongToast('CantHaveEmptyInputs')
		}


		if (!isValidEmail(Email)) {
			LongToast('InvalidEmail')
			return;
		}

		if (Password.length < 6) {
			LongToast('TooShortPassword')
			return;
		}

		if (!Password || !ConfirmPassword) {
			return LongToast('CantHaveEmptyInputs')
		}

		if (!isValidPassword(Password)) {
			return LongToast('InvalidPasswordFormat')
		}

		if (Password !== ConfirmPassword) {
			return LongToast('PassDontMatch')
		}

		Phone = (Phone[0] === "0") ? Phone.substr(1) : Phone;

		if (!Phone || !isValidMobileNumber(`${PhoneCountry.PhoneCode}${Phone}`)) {
			LongToast('InvalidPhone')
			return;
		}

		this.setState({ lockSubmit: true })
		this.lockSubmit = true

		AddNewUser({
			FirstName,
			SecondeName,
			LoginAccount: Email,
			Email,
			Phone: `${PhoneCountry.PhoneCode}${Phone}`,
			Password,
			PasswordConfirm: ConfirmPassword,
			LanguageId: Language.key,
			RoleId: Role.Id,
			CountryId: Country.Id,
			SubStoreId: SubStore ? SubStore.Id : null,
			IsDriver
		}, res => {
			this.setState({ didSucceed: true, })
			this.props.route.params?.onChildChange && this.props.route.params?.onChildChange()
			this.props.navigation.goBack()
		}, err => {
			this.setState({ lockSubmit: false })
			this.lockSubmit = false

			if (err.status === 400) {
				LongToast('UserAlreadyExists')
				return true
			}
		})
	}

	renderContent = () => {
		const {
			StoreTypeId,
			SubStoreId
		} = this.props.hello_data
		const {
			FirstName,
			SecondeName,
			Phone,
			Email,
			Country,
			PhoneCountry,
			Password,
			ConfirmPassword,
			Language,
			Role,
			IsDriver,
			SubStore,
		} = this.state
		return (
			<ScrollView>
				<HorizontalInput
					// style={{ marginVertical: 60 }}
					maxLength={STRING_LENGTH_MEDIUM}
					label="FirstName"
					value={FirstName}
					onChangeText={(text) => { this.setState({ FirstName: text }) }} />

				<ItemSeparator />

				<HorizontalInput
					style={{ marginVertical: 10 }}
					maxLength={STRING_LENGTH_MEDIUM}
					label="LastName"
					value={SecondeName}
					onChangeText={(text) => { this.setState({ SecondeName: text }) }} />

				<ItemSeparator />

				<HorizontalInput
					// style={{ marginVertical: 10 }}
					label="Email"
					maxLength={STRING_LENGTH_MEDIUM}
					value={Email}
					keyboardType='email-address'
					onChangeText={(text) => { this.setState({ Email: text }) }} />

				<ItemSeparator />

				<HorizontalInput
					maxLength={STRING_LENGTH_MEDIUM}
					label="Password"
					secureTextEntry={true}
					value={Password}
					onChangeText={(text) => { this.setState({ Password: text }) }} />

				<ItemSeparator />

				<HorizontalInput
					// style={{ marginVertical: 10 }}

					maxLength={STRING_LENGTH_MEDIUM}
					label="ConfirmPassword"
					secureTextEntry={true}
					value={ConfirmPassword}
					onChangeText={(text) => { this.setState({ ConfirmPassword: text }) }} />

				<ItemSeparator />

				<SwitchItem title={'IsDriver'} onValueChange={(IsDriver) => { this.setState({ IsDriver }) }} value={IsDriver} />

				<ItemSeparator />

				<ArrowItem
					onPress={() => {
						SelectCountry(this.props.navigation, item => {
							this.setState({ Country: item })
						})
					}}
					title={'Country'}
					info={Country ? Country.Name : null} />

				<ItemSeparator />

				<PhoneInput
					countryId={PhoneCountry ? PhoneCountry.Id : undefined}
					onPressFlag={() => {
						SelectCountry(this.props.navigation, item => {
							this.setState({ PhoneCountry: item })
						})
					}}
					value={Phone}
					onChangeText={(text) => { this.setState({ Phone: text }) }} />

				<ItemSeparator />

				<ArrowItem
					onPress={() => {
						this.languageSelectorRef.current.show()
					}}
					title={'Language'}
					info={Language ? Language.label : null} />

				<ItemSeparator />

				<ArrowItem
					onPress={() => {
						this.roleSelectorRef.current.show()
					}}
					title={'Role'}
					info={Role ? Role.Name : null} />
				<ItemSeparator />

				{StoreTypeId == 3 && SubStoreId == null ?
					<ArrowItem
						onPress={() => {
							this.SubStoresRef.current.show()
						}}
						title={'SubStore'}
						info={SubStore ? SubStore.Name : null} /> :
					null
				}

			</ScrollView>
		)
	}

	render() {
		const { languages_data } = this.props
		const { roles, SubStores } = this.state

		return (
			<LazyContainer style={{ flex: 1, backgroundColor: "#FFF" }}>
				<CustomHeader
					navigation={this.props.navigation}
					title={"AddUser"}
					rightComponent={
						<HeaderSubmitButton
							isLoading={this.state.lockSubmit}
							didSucceed={this.state.didSucceed}
							onPress={() => { this.submit() }} />
					} />
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



				<CustomSelector
					ref={this.languageSelectorRef}
					options={languages_data.map(item => item.label)}
					onSelect={(index) => { this.setState({ Language: languages_data[index] }) }}
					onDismiss={() => { }}
				/>

				{roles && <CustomSelector
					ref={this.roleSelectorRef}
					options={roles.map(item => item.Name)}
					onSelect={(index) => { this.setState({ Role: roles[index] }) }}
					onDismiss={() => { }}
				/>}

				{SubStores && <CustomSelector
					ref={this.SubStoresRef}
					options={SubStores.map(item => item.Name)}
					onSelect={(index) => { this.setState({ SubStore: SubStores[index] }) }}
					onDismiss={() => { }}
				/>}
			</LazyContainer>
		)
	}
}

const mapStateToProps = ({
	language: {
		languages_data,
		currLang,
	},
	login: {
		hello_data
	},
}) => ({
	languages_data,
	currLang,
	hello_data
})

export default connect(mapStateToProps)(withLocalize(AddUser))