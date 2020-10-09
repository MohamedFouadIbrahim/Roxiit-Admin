import React, { Component } from "react";
import { ScrollView, View, Platform, KeyboardAvoidingView, Dimensions } from "react-native";
import { connect } from "react-redux";
import CustomHeader, { headerHeight } from "../../components/CustomHeader/index.js";
import LazyContainer from "../../components/LazyContainer";
import ItemSeparator from "../../components/ItemSeparator/index.js";
import HorizontalInput from "../../components/HorizontalInput/index.js";
import { withLocalize } from "react-localize-redux";
import HeaderSubmitButton from "../../components/HeaderSubmitButton/index.js";
import ArrowItem from "../../components/ArrowItem/index.js";
import { SelectCountry, SelectCity, SelectArea } from "../../utils/Places.js";
import { GetMyCurrentPostion, GpsPermisiton } from '../../utils/Location';
import { NewCustomer, GetGenderStatus } from '../../services/CustomersService';
import PhoneInput from "../../components/PhoneInput/index.js";
import CustomSelector from "../../components/CustomSelector/index.js";
import MapView, { Marker } from 'react-native-maps';
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { isValidEmail, isValidMobileNumber } from "../../utils/Validation";
import { largePagePadding } from '../../constants/Style.js';
import { STRING_LENGTH_MEDIUM } from "../../constants/Config";
import { LongToast } from "../../utils/Toast.js";
import { generateRandomNumber } from "../../utils/numeral.js";
import CustomTouchable from '../../components/CustomTouchable';
import CurrentLocationButton from '../../components/CurrentLocationButton';

class AddNewCustomer extends Component {
	constructor(props) {
		super(props);

		const { languages_data, currLang, country_id, countries } = this.props;
		const Password = generateRandomNumber(10)
		const Country = countries.find(item => item.Id === country_id)

		this.state = {
			lockSubmit: false,
			Password,
			Email: null,
			Phone: null,
			FullName: null,
			Gender: null,
			LanguageId: null,
			Language: languages_data.find(item => item.code === currLang),
			CountryId: country_id,
			CityId: null,
			Address1: null,
			secureTextEntry: true,
			PhoneCountry: Country,
			Country,
			screenWidth: Dimensions.get('screen').width,
			screenHeight: Dimensions.get('screen').height,

		};
		this.JustRequredFeilds = this.props.route.params?.Min
		this.genderTypesSelcectorRef = React.createRef();
		this.lockSubmit = false;
		this.roleSelectorRef = React.createRef();
		this.languageSelectorRef = React.createRef();
		this.dayTypesSelcectorRef = React.createRef();
	}

	componentDidMount() {
		GetGenderStatus(res => {
			const { ...restData } = res.data;

			this.setState({
				...restData,
				GenderTypeList: res.data.Data,
				Gender: res.data.Data.find(item => item.Id === 2)

			});
		});

		//re render when change orientation
		Dimensions.addEventListener('change', () => {
			this.setState({
				screenWidth: Dimensions.get('screen').width,
				screenHeight: Dimensions.get('screen').height,
			})
		})

	};

	submit = () => {
		if (this.lockSubmit) {
			return;
		}

		const {
			Password,
			Email,
			FullName,
			Gender,
			Language,
			CountryId,
			CityId,
			Address1,
			latitude,
			longitude,
			City,
			Country,
			PhoneCountry,
			Area
		} = this.state;

		let {
			Phone,
		} = this.state;

		if (!FullName || !Language) {
			LongToast('CantHaveEmptyInputs')
			return;
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

		this.setState({ lockSubmit: true });
		this.lockSubmit = true;

		let NewCustomerData = {
			Password,
			Email,
			Phone: FullPhone,
			FullName,
			GenderId: Gender ? Gender.Id : null,
			LanguageId: Language.key,
			CountryId: Country.Id,
			CityId: City ? City.Id : this.props.city.Id,
			Address1: Address1 ? Address1 : null,
			latitude: latitude,
			longitude: longitude,
			AreaId: Area ? Area.Id : null
		}

		NewCustomer(NewCustomerData, res => {

			NewCustomerData = {
				Id: res.data,
				...NewCustomerData
			}

			this.setState({ lockSubmit: false });
			this.lockSubmit = false;

			// this.setState({ didSucceed: true });
			this.props.route.params?.onChildChange &&
				this.props.route.params?.onChildChange();
			this.props.route.params?.onSelectCustomer &&
				this.props.route.params?.onSelectCustomer(NewCustomerData);
			LongToast('dataSaved')

			this.props.navigation.goBack();
			// if (this.props.route.params?.fromSearch && this.props.route.params?.fromSearch == true) {
			// 	this.props.navigation.navigate('AddNewOrder')
			// } else {
			// 	this.props.navigation.goBack();
			// }
		},
			err => {
				this.setState({ lockSubmit: false });
				this.lockSubmit = false;

				if (err.status === 400) {
					LongToast("UserAlreadyExists");
					return true;
				}
			}
		);
	};

	onGetMyLocation = async () => {
		await GpsPermisiton(() => {
			GetMyCurrentPostion((data) => {
				this.setState({
					latitude: data.latitude,
					longitude: data.longitude,
					errorLocation: false
				}, () => {
					this.scrollView.scrollToEnd({ animated: true });
				})
			}, err => {
				this.setState({ errorLocation: true, latitude: 0, longitude: 0 })
			})

		}, () => { this.setState({ latitude: 0, longitude: 0 }) }, () => { this.setState({ latitude: 0, longitude: 0 }) })
	}

	onEathIconPress = () => {
		this.onGetMyLocation()
			.then(() => {
				if (this.state.errorLocation) {
					LongToast('Gps')
				}
			})
	}

	renderContent = () => {
		const {
			Password,
			Email,
			Phone,
			FullName,
			Gender,
			LanguageId,
			Language,
			CountryId,
			CityId,
			Address1,
			latitude,
			longitude,
			City,
			Country,
			PhoneCountry,
			secureTextEntry,
			Area
		} = this.state;

		return (
			<ScrollView
				ref={(view) => {
					this.scrollView = view;
				}}>
				<HorizontalInput
					maxLength={STRING_LENGTH_MEDIUM}
					label="FullName"
					value={FullName}
					onChangeText={text => {
						this.setState({ FullName: text });
					}}
				/>

				<ItemSeparator />

				<PhoneInput
					countryId={PhoneCountry ? PhoneCountry.Id : undefined}
					onPressFlag={() => {
						SelectCountry(this.props.navigation, item => {
							this.setState({ PhoneCountry: item });
						});
					}}
					value={Phone}
					onChangeText={text => {
						this.setState({ Phone: text });
					}}
				/>

				<ItemSeparator />

				<HorizontalInput
					label="Email"
					maxLength={STRING_LENGTH_MEDIUM}
					value={Email}
					keyboardType="email-address"
					onChangeText={text => {
						this.setState({ Email: text });
					}}
				/>

				<ItemSeparator />

				<HorizontalInput
					maxLength={STRING_LENGTH_MEDIUM}
					label="Address1"
					value={Address1}
					onChangeText={text => {
						this.setState({ Address1: text });
					}}
				/>

				<ItemSeparator />

				<View
					style={{
						flexDirection: 'row',
						alignItems: 'center',
					}}>
					<View
						style={{
							flex: 1,
						}}>
						<HorizontalInput
							maxLength={STRING_LENGTH_MEDIUM}
							label="Password"
							secureTextEntry={secureTextEntry}
							value={Password}
							onChangeText={(text) => { this.setState({ Password: text }) }} />
					</View>

					<CustomTouchable
						onPress={() => { this.setState({ secureTextEntry: !secureTextEntry }) }}
						style={{
							paddingVertical: 5,
							paddingLeft: 5,
							paddingRight: 20,
							justifyContent: 'center',
							alignItems: 'center',
						}}>
						<Ionicons
							name={secureTextEntry ? 'ios-eye' : 'ios-eye-off'}
							color={'#333333'}
							size={22} />
					</CustomTouchable>
				</View>

				<ItemSeparator />

				{this.JustRequredFeilds != true ?
					<View>
						<ArrowItem
							onPress={() => {
								this.genderTypesSelcectorRef.current.show();
							}}
							title={"Gender"}
							info={Gender ? Gender.Name : null}
						/>

						<ItemSeparator />
					</View> : null
				}

				<ArrowItem
					onPress={() => {
						this.languageSelectorRef.current.show()
					}}
					title={'Language'}
					info={Language ? Language.label : null} />
				<ItemSeparator />


				<ArrowItem
					onPress={() => {
						SelectCountry(this.props.navigation, item => {
							this.setState({ Country: item, City: null });
						});
					}}
					title={"Country"}
					info={Country ? Country.Name : null}
				/>

				{Country && (
					<ArrowItem
						onPress={() => {
							SelectCity(
								this.props.navigation,
								item => {
									this.setState({ City: item });
								},
								Country.Id
							);
						}}
						title={"City"}
						info={City ? City.Name : this.props.city.Name}
					/>
				)}

				{City && (
					<ArrowItem
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
				)}

				{this.renderMap()}
			</ScrollView>
		);
	};

	renderMap = () => {
		const {
			latitude,
			longitude
		} = this.state

		if (latitude && longitude) {
			return ([<MapView
				key={0}
				onPress={(f) => {
					this.setState({
						latitude: f.nativeEvent.coordinate.latitude,
						longitude: f.nativeEvent.coordinate.longitude
					})
				}}
				style={{
					width: this.state.screenWidth,
					height: 200,
					marginTop: largePagePadding,
				}}
				showsUserLocation={false}
				followsUserLocation={false}
				initialRegion={{
					latitude,
					longitude,
					latitudeDelta: 0.4,
					longitudeDelta: 0.4,
				}}
				region={{
					latitude,
					longitude,
					latitudeDelta: 0.4,
					longitudeDelta: 0.4,
				}}>
				<Marker
					key={1}
					draggable
					coordinate={{ latitude, longitude, latitudeDelta: 0.4, longitudeDelta: 0.4 }}
					onDragEnd={(f) => {
						this.setState({
							latitude: f.nativeEvent.coordinate.latitude,
							longitude: f.nativeEvent.coordinate.longitude
						})
					}}
				/>
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
				onPress={this.onEathIconPress}
			/>]
			)
		}
	}

	render() {
		const { languages_data } = this.props;
		const { GenderTypeList, Gender } = this.state;

		return (
			<LazyContainer style={{ flex: 1, backgroundColor: "#FFF" }}>
				<CustomHeader
					navigation={this.props.navigation}
					title={"Add"}
					rightNumOfItems={this.JustRequredFeilds != true ? 2 : 1}
					rightComponent={
						< View
							style={{
								flexDirection: 'row',
								alignItems: 'center'
							}}>
							{this.JustRequredFeilds != true ?
								<CustomTouchable
									onPress={() => { this.onEathIconPress() }}
									style={{
										flexDirection: 'row',
										justifyContent: 'center',
										alignItems: 'center',
										flex: 1,
									}}>
									<MaterialCommunityIcons
										name={`earth`}
										size={22}
										color={'white'} />
								</CustomTouchable> : null
							}
							<View
								style={{
									flexDirection: 'row',
									justifyContent: 'center',
									alignItems: 'center',
									flex: 1,
								}}>
								<HeaderSubmitButton
									isLoading={this.state.lockSubmit}
									// didSucceed={this.state.dataFitched}
									onPress={() => {
										this.submit()
									}} />
							</View>

						</View>
					}
				/>
				{Platform.OS === 'ios' ? <KeyboardAvoidingView
					behavior='padding'
					enabled
					style={{ flex: 1 }}
					keyboardVerticalOffset={40}>
					{this.renderContent()}
				</KeyboardAvoidingView> : this.renderContent()}

				<CustomSelector
					ref={this.languageSelectorRef}
					options={languages_data.map(item => item.label)}
					onSelect={(index) => { this.setState({ Language: languages_data[index] }) }}
					onDismiss={() => { }}
				/>

				{GenderTypeList && (
					<CustomSelector
						ref={this.genderTypesSelcectorRef}
						options={GenderTypeList.map(item => item.Name)}
						onSelect={index => {
							this.setState({ Gender: GenderTypeList[index] });
						}}
						onDismiss={() => { }}
					/>
				)}
			</LazyContainer>
		);
	}
}

const mapStateToProps = ({
	language: {
		languages_data,
		currLang
	},
	login: {
		country_id,
		city,
	},
	places: {
		countries,
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
	city,
	SigninInput,
	countries,
	country_id,
	languages_data,
	currLang
});

export default connect(mapStateToProps)(withLocalize(AddNewCustomer));