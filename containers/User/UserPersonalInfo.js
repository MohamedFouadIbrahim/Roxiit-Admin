import React, { Component } from 'react'
import { ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import CustomHeader from '../../components/CustomHeader/index.js';
import LazyContainer from '../../components/LazyContainer'
import ItemSeparator from '../../components/ItemSeparator/index.js';
import HorizontalInput from '../../components/HorizontalInput/index.js';
import { withLocalize } from 'react-localize-redux';
import HeaderSubmitButton from '../../components/HeaderSubmitButton/index.js';
import { GetUserInfo, EditUserInfo } from '../../services/UsersService.js';
import ArrowItem from '../../components/ArrowItem/index.js';
import { SelectCountry, SelectCity, SelectArea } from '../../utils/Places.js';
import { STRING_LENGTH_MEDIUM } from '../../constants/Config';
import { LongToast } from '../../utils/Toast.js';
import SwitchItem from '../../components/SwitchItem';
import { connect } from 'react-redux';
import { SelectEntity } from '../../utils/EntitySelector.js';

class UserPersonalInfo extends Component {
	constructor(props) {
		super(props)

		const { Id } = this.props.route.params
		this.userId = Id

		this.state = {
			lockSubmit: false,
			didFetchData: false,
			IsDriver: false
		}

		this.lockSubmit = false
	}

	componentDidMount() {
		GetUserInfo(this.userId, res => {
			this.setState({
				...res.data,
				didFetchData: true,
			})
		})
	}

	submit = () => {
		if (this.lockSubmit) {
			return
		}

		const { FirstName, SecondeName, LoginAccount, Address1, Address2, Country, City, Area, IsDriver, Substore } = this.state

		if (!FirstName || !SecondeName || !LoginAccount || !Country) {
			return LongToast('CantHaveEmptyInputs')
		}

		this.setState({ lockSubmit: true })
		this.lockSubmit = true
		EditUserInfo({
			Id: this.userId,
			FirstName,
			SecondeName,
			LoginAccount,
			Address1: Address1 ? Address1 : null,
			Address2: Address2 ? Address2 : null,
			CountryId: Country.Id,
			CityId: City ? City.Id : this.props.city.Id,
			AreaId: Area ? Area.Id : null,
			AreaText: Area ? Area.Name : '',
			IsDriver,
			SubStoreId: Substore ? Substore.Id : null,
		}, res => {
			this.setState({ didSucceed: true, })
			this.props.route.params?.onChildChange && this.props.route.params?.onChildChange()
			this.props.navigation.goBack()
		}, err => {
			this.setState({ lockSubmit: false })
			this.lockSubmit = false
		})
	}

	renderContent = () => {
		if (this.state.didFetchData) {
			const { FirstName, SecondeName, LoginAccount, Address1, Address2, Country, City, Area, IsDriver, Substore } = this.state

			return (
				<ScrollView contentContainerStyle={Platform.OS == 'ios' ? { flexGrow: 0.98 } : {}}>
					<HorizontalInput
						maxLength={STRING_LENGTH_MEDIUM}
						label="FirstName"
						value={FirstName}
						onChangeText={(text) => { this.setState({ FirstName: text }) }} />

					<ItemSeparator />

					<HorizontalInput
						maxLength={STRING_LENGTH_MEDIUM}
						label="LastName"
						value={SecondeName}
						onChangeText={(text) => { this.setState({ SecondeName: text }) }} />

					<ItemSeparator />

					<HorizontalInput
						label="LoginAccount"
						editable={false}
						value={LoginAccount} />

					<ItemSeparator />

					<HorizontalInput
						maxLength={STRING_LENGTH_MEDIUM}
						label="Address1"
						value={Address1}
						onChangeText={(text) => { this.setState({ Address1: text }) }} />

					<ItemSeparator />

					<HorizontalInput
						maxLength={STRING_LENGTH_MEDIUM}
						label="Address2"
						value={Address2}
						onChangeText={(text) => { this.setState({ Address2: text }) }} />

					<ItemSeparator />

					<SwitchItem title={'IsDriver'} onValueChange={(IsDriver) => { this.setState({ IsDriver }) }} value={IsDriver} />

					<ItemSeparator />

					<ArrowItem
						onPress={() => {
							SelectCountry(this.props.navigation, item => {
								this.setState({ Country: item, City: null, Area: null })
							})
						}}
						title={'Country'}
						info={Country ? Country.Name : null} />

					{Country && <ArrowItem
						onPress={() => {
							SelectCity(this.props.navigation, item => {
								this.setState({ City: item, Area: null })
							}, Country.Id)
						}}
						title={'City'}
						info={City ? City.Name : this.props.city.Name} />}

					{City && <ArrowItem
						onPress={() => {
							SelectArea(this.props.navigation, item => {
								this.setState({ Area: item })
							}, City.Id)
						}}
						title={'Area'}
						info={Area ? Area.Name : null} />}

					<ArrowItem
						onPress={() => {
							if (Substore && Substore.Id != 0) {
								this.setState({ Substore: null })  //clear previous substore
							}
							else {
								SelectEntity(this.props.navigation, Substore => {
									this.setState({ Substore })
								}, 'Tenant/SubStore/Simple', null, true, 1)
							}
						}}
						title={'SubStore'}
						info={Substore ? Substore.Name : null}
						cancelEnabled={Substore != null && Substore.Id != 0 ? true : false} />
				</ScrollView>
			)
		}
	}

	render() {
		return (
			<LazyContainer style={{ flex: 1, backgroundColor: "#FFF" }}>
				<CustomHeader
					navigation={this.props.navigation}
					title={"PersonalInfo"}
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
							shouldRasterizeIOS
						// keyboardVerticalOffset={150}
						>
							{this.renderContent()}
						</KeyboardAvoidingView> :

						this.renderContent()

				}
				{/* {this.renderContent()} */}
			</LazyContainer>
		)
	}
}

const mapStateToProps = ({
	login: {
		city
	},
}) => ({
	city,
})

export default connect(mapStateToProps)(withLocalize(UserPersonalInfo))