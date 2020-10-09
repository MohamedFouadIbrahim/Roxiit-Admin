import React, { Component } from 'react'
import { ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator, Dimensions } from 'react-native'
import { connect } from 'react-redux'
import CustomHeader from '../../components/CustomHeader/index.js';
import LazyContainer from '../../components/LazyContainer'
import ItemSeparator from '../../components/ItemSeparator/index.js';
import HorizontalInput from '../../components/HorizontalInput/index.js';
import { withLocalize } from 'react-localize-redux';
import HeaderSubmitButton from '../../components/HeaderSubmitButton/index.js';
import ArrowItem from '../../components/ArrowItem/index.js';
import { SelectCountry, SelectCity, SelectArea } from '../../utils/Places.js';
import { GetCustomerInfo, EditCustomerInfo } from '../../services/CustomersService.js';
import { isValidMobileNumber, isValidEmail } from '../../utils/Validation.js';
import CustomSelector from '../../components/CustomSelector/index.js';
import CurrentLocationButton from '../../components/CurrentLocationButton';
import PhoneInput from '../../components/PhoneInput/index.js';
import CustomDatePicker from '../../components/CustomDatePicker/index.js';
import { formatDate } from '../../utils/Date.js';
import { GetMyCurrentPostion } from '../../utils/Location';
import MapView, { Marker } from 'react-native-maps';
import { largePagePadding } from '../../constants/Style.js';
import { parsePhone } from '../../utils/Phone.js';
import { STRING_LENGTH_LONG } from '../../constants/Config';
import { LongToast } from '../../utils/Toast.js';
import { mainColor } from '../../constants/Colors.js';
import { SelectEntity } from '../../utils/EntitySelector.js';

class CustomerPersonalInfo extends Component {
	constructor(props) {
		super(props)

		const { country_id, countries } = this.props;
		const Country = countries.find(item => item.Id === country_id)
		const { Id } = this.props.route.params
		this.customerId = Id

		this.state = {
			lockSubmit: false,
			didFetchData: false,
			isDateTimePickerVisible: false,
			latitude: 0,
			longitude: 0,
			PhoneCountry: Country,
			screenWidth: Dimensions.get('screen').width,
			screenHeight: Dimensions.get('screen').height,

		}

		this.lockSubmit = false

		this.genderSelectorRef = React.createRef();
		this.languageSelectorRef = React.createRef();
	}

	componentWillUnmount() {
		this.cancelFetchData && this.cancelFetchData()
		this.cancelFetchDataEditCustomerInfo && this.cancelFetchDataEditCustomerInfo()
	}

	componentDidMount() {
		this.cancelFetchData = GetCustomerInfo(this.customerId, res => {

			const { Language, Birthday, Phone, ...restData } = res.data
			if (Phone) {
				const { NumberCountry, NationalNumber } = parsePhone(Phone)

				this.setState({
					...restData,
					Language: {
						...Language,
						key: Language.Id,
						label: Language.Name
					},
					Birthday,
					Phone: NationalNumber,
					PhoneCountry: NumberCountry,
					FormattedBirthday: formatDate(Birthday),
					didFetchData: true,
				})

			} else {
				this.setState({
					...restData,
					Language: {
						...Language,
						key: Language.Id,
						label: Language.Name
					},
					Birthday,
					FormattedBirthday: formatDate(Birthday),
					didFetchData: true,
				})
			}
		})

		//re render when change orientation
		Dimensions.addEventListener('change', () => {
			this.setState({
				screenWidth: Dimensions.get('screen').width,
				screenHeight: Dimensions.get('screen').height,
			})
		})

	}

	showDateTimePicker = () => {
		this.setState({ isDateTimePickerVisible: true });
	}

	hideDateTimePicker = () => {
		this.setState({ isDateTimePickerVisible: false });
	}

	submit = () => {
		if (this.lockSubmit) {
			return
		}

		const {
			FullName,
			Email,
			Gender,
			Country,
			PhoneCountry,
			City,
			Facebook,
			Twitter,
			Website,
			Language,
			Birthday,
			Lat,
			Lng,
			Area,
			SubStore
		} = this.state

		if (!FullName || !Language || !Country) {
			return LongToast('CantHaveEmptyInputs')
		}

		const { SigninInput } = this.props;
		const isMethodPhone = SigninInput.Value === 2

		if (Email && Email.length) {
			if (!isValidEmail(Email)) {
				LongToast('InvalidEmail')
				return;
			}
		}
		else if (!isMethodPhone) {
			LongToast('CantHaveEmptyInputs')
			return;
		}

		let { Phone } = this.state
		let FullPhone = ""

		if (Phone && Phone.length) {
			Phone = (Phone[0] === "0") ? Phone.substr(1) : Phone;
			FullPhone = `${PhoneCountry.PhoneCode}${Phone}`

			if (!isValidMobileNumber(FullPhone)) {
				LongToast('InvalidPhone')
				return;
			}
		}
		else if (isMethodPhone) {
			LongToast('CantHaveEmptyInputs')
			return;
		}

		this.setState({ lockSubmit: true })
		this.lockSubmit = true

		this.cancelFetchDataEditCustomerInfo = EditCustomerInfo({
			Id: this.customerId,
			Email,
			Phone: FullPhone,
			FullName,
			GenderId: Gender ? Gender.Id : null,
			CountryId: Country.Id,
			CityId: City ? City.Id : this.props.city.Id,
			Birthday,
			Facebook,
			Twitter,
			Website,
			LanguageId: Language.key,
			Lat,
			Lng,
			AreaId: Area ? Area.Id : null,
			SubStoreId: SubStore ? SubStore.Id : null,
		}, res => {
			this.setState({ didSucceed: true, })
			this.props.route.params?.onChildChange && this.props.route.params?.onChildChange()
			this.props.navigation.goBack()
		}, err => {
			this.setState({ lockSubmit: false })
			this.lockSubmit = false
		})
	}

	renderMap = () => {
		const {
			Lat,
			Lng,
			latitude,
			longitude
		} = this.state

		if (Lat && Lng) {
			return (
				[<MapView
					ref={ref => this.map = ref}
					key={0}
					style={{
						width: this.state.screenWidth,
						height: 200,
						marginTop: largePagePadding,
					}}
					showsUserLocation={false}
					followsUserLocation={false}
					initialRegion={{
						latitude: Lat,
						longitude: Lng,
						latitudeDelta: 0.4,
						longitudeDelta: 0.4,
					}}
				// region={{
				// 	latitude: latitude,
				// 	longitude: longitude,
				// 	latitudeDelta: 0.4,
				// 	longitudeDelta: 0.4,
				// }}
				>
					{latitude != 0 && longitude != 0 && <Marker key={1}
						coordinate={{
							latitude: latitude,
							longitude: longitude,
							latitudeDelta: 0.4,
							longitudeDelta: 0.4,
						}} />}

				</MapView>,
				<CurrentLocationButton
					key={2}
					size={35}
					style={{
						position: 'absolute',
						right: 10,
						bottom: 160,
						borderRadius: 30,
						paddingHorizontal: 2
					}}
					onPress={this.onMyLocationPress}
				/>
				]
			)
		}
	}

	onMyLocationPress = () => {
		GetMyCurrentPostion((data) => {
			const { latitude, longitude } = data
			const { Lat, Lng } = this.state
			this.setState({ latitude, longitude })
			const fitToCoordinates = []

			if (Lat && Lng) {
				fitToCoordinates.push({
					latitude: Lat,
					longitude: Lng
				})
			}

			if (latitude && latitude) {
				fitToCoordinates.push({
					latitude,
					longitude
				})
			}

			this.map.fitToCoordinates(fitToCoordinates, {
				edgePadding: { top: 80, right: 80, bottom: 80, left: 80 },
				animated: true,
			})

		})
	}

	renderContent = () => {

		if (!this.state.didFetchData) {
			return <ActivityIndicator style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} color={mainColor} size='large' />
		}

		const {
			FullName,
			Email,
			Phone,
			PhoneCountry,
			Gender,
			FormattedBirthday,
			Country,
			City,
			Facebook,
			Twitter,
			Website,
			Language,
			Area,
			SubStore
		} = this.state

		return (
			<ScrollView
				contentContainerStyle={{
				}}>
				<HorizontalInput
					maxLength={STRING_LENGTH_LONG}
					label="Name"
					value={FullName}
					onChangeText={(text) => { this.setState({ FullName: text }) }} />

				<ItemSeparator />

				<HorizontalInput
					maxLength={STRING_LENGTH_LONG}
					label="Email"
					value={Email}
					keyboardType='email-address'
					onChangeText={(text) => { this.setState({ Email: text }) }} />

				<ItemSeparator />

				<HorizontalInput
					maxLength={STRING_LENGTH_LONG}
					label="Facebook"
					value={Facebook}
					onChangeText={(text) => { this.setState({ Facebook: text }) }} />

				<ItemSeparator />

				<HorizontalInput
					maxLength={STRING_LENGTH_LONG}
					label="Twitter"
					value={Twitter}
					onChangeText={(text) => { this.setState({ Twitter: text }) }} />

				<ItemSeparator />

				<HorizontalInput
					maxLength={STRING_LENGTH_LONG}
					label="Website"
					value={Website}
					onChangeText={(text) => { this.setState({ Website: text }) }} />

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
						SelectCountry(this.props.navigation, item => {
							this.setState({ Country: item, City: null })
						})
					}}
					title={'Country'}
					info={Country ? Country.Name : null} />

				{Country && <ArrowItem
					onPress={() => {
						SelectCity(this.props.navigation, item => {
							this.setState({ City: item })
						}, Country.Id)
					}}
					title={'City'}
					info={City && City.Name ? City.Name : this.props.city.Name} />}

				{City && City.Name && <ArrowItem
					onPress={() => {
						SelectArea(
							this.props.navigation,
							item => {
								this.setState({ Area: item });
							},
							City.Id
						);
					}}
					title={"Area"}
					info={Area ? Area.Name : null}
				/>
				}

				<ArrowItem
					onPress={() => {
						this.languageSelectorRef.current.show()
					}}
					title={'Language'}
					info={Language ? Language.label : null} />

				<ArrowItem
					onPress={() => {
						this.genderSelectorRef.current.show()
					}}
					title={'Gender'}
					info={Gender ? Gender.Name : null} />

				<ArrowItem
					onPress={() => {
						this.showDateTimePicker()
					}}
					title={'Birthday'}
					info={FormattedBirthday} />

				<ArrowItem
					onPress={() => {
						if (SubStore && SubStore.Id != 0) {
							this.setState({ SubStore: null })  //clear previous substore
						}
						else {
							SelectEntity(this.props.navigation, SubStore => {
								this.setState({ SubStore })
							}, 'Tenant/SubStore/Simple', null, true, 1)
						}
					}}
					title={'SubStore'}
					info={SubStore ? SubStore.Name : null}
					cancelEnabled={SubStore != null && SubStore.Id != 0 ? true : false} />

				{this.renderMap()}
			</ScrollView>
		)

	}

	render() {
		const { availableGenders, Birthday, isDateTimePickerVisible } = this.state
		const { languages_data } = this.props

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

				{availableGenders && <CustomSelector
					ref={this.genderSelectorRef}
					options={availableGenders.map(item => item.Name)}
					onSelect={(index) => { this.setState({ Gender: availableGenders[index] }) }}
					onDismiss={() => { }}
				/>}

				<CustomSelector
					ref={this.languageSelectorRef}
					options={languages_data.map(item => item.label)}
					onSelect={(index) => { this.setState({ Language: languages_data[index] }) }}
					onDismiss={() => { }}
				/>

				<CustomDatePicker
					isVisible={isDateTimePickerVisible}
					date={Birthday}
					onDatePicked={(date, date_formatted) => {
						this.setState({
							Birthday: date,
							FormattedBirthday: date_formatted
						})

						this.hideDateTimePicker()
					}}
					onCancel={this.hideDateTimePicker} />
			</LazyContainer>
		)
	}
}

const mapStateToProps = ({
	login: {
		city,
		country_id,
	},
	places: {
		countries,
	},
	language: {
		languages_data,
	},
	runtime_config: {
		runtime_config: {
			screens: {
				Signin_02_3: {
					SigninInput,
				},
			},
		},
	},
}) => ({
	country_id,
	countries,
	city,
	SigninInput,
	languages_data,
})

export default connect(mapStateToProps)(withLocalize(CustomerPersonalInfo))