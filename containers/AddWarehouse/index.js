import React, { Component } from "react";
import { ScrollView } from "react-native";
import { connect } from "react-redux";
import CustomHeader from "../../components/CustomHeader/index.js";
import LazyContainer from "../../components/LazyContainer";
import ItemSeparator from "../../components/ItemSeparator/index.js";
import HorizontalInput from "../../components/HorizontalInput/index.js";
import { withLocalize } from "react-localize-redux";
import HeaderSubmitButton from "../../components/HeaderSubmitButton/index.js";
import ArrowItem from "../../components/ArrowItem/index.js";
import { SelectCountry, SelectCity, SelectArea } from "../../utils/Places.js";
import { AddNewWarehouseUser } from "../../services/WarehousesService.js";
import PhoneInput from "../../components/PhoneInput/index.js";
import CustomSelector from "../../components/CustomSelector/index.js";
import { isValidEmail, isValidMobileNumber } from "../../utils/Validation";
import { STRING_LENGTH_MEDIUM } from "../../constants/Config";
import { LongToast } from "../../utils/Toast.js";
import { largePagePadding } from "../../constants/Style.js";

class AddWarehouse extends Component {
	constructor(props) {
		super(props)

		const { languages_data, currLang, countries, country_id } = this.props
		const Country = countries.find(item => item.Id === country_id)


		this.state = {
			Country,
			PhoneCountry: Country,
			PhoneCountryTwo: Country,
			lockSubmit: false,
			Language: languages_data.find(item => item.code === currLang),
			dataFetched: true
		}

		this.lockSubmit = false;
		this.roleSelectorRef = React.createRef();
		this.languageSelectorRef = React.createRef();
		this.dayTypesSelcectorRef = React.createRef();
	}

	submit = () => {
		if (this.lockSubmit) {
			return;
		}

		const {
			Address1,
			Address2,
			Area,
			City,
			Country,
			Description,
			Email1,
			Email2,
			Name,
			PostCode,
			PhoneCountry,
			PhoneCountryTwo,
		} = this.state;

		let { Phone1, Phone2 } = this.state;

		if (
			!Name ||
			!Phone1 ||
			!Email1 ||
			!Country ||
			!City ||
			!Address1 ||
			!Area
		) {
			return LongToast("CantHaveEmptyInputs")
		}

		if (!isValidEmail(Email1)) {
			LongToast("InvalidEmail")
			return;
		}

		Phone1 = Phone1[0] === "0" ? Phone1.substr(1) : Phone1;

		if (!Phone1 || !isValidMobileNumber(`${PhoneCountry.PhoneCode}${Phone1}`)) {
			LongToast("InvalidPhone")
			return;
		}

		if (Phone2 != null && !isValidMobileNumber(`${PhoneCountryTwo.PhoneCode}${Phone2}`)) {
			LongToast("InvalidPhone")
			return;
		}


		this.setState({ lockSubmit: true });
		this.lockSubmit = true;

		AddNewWarehouseUser(
			{
				Name,
				Description,
				Phone1: `${PhoneCountry.PhoneCode}${Phone1}`,
				Phone2: Phone2 ? `${PhoneCountryTwo.PhoneCode}${Phone2}` : '',
				Email1,
				Email2,
				Country: Country.Id,
				City: City ? City.Id : null,
				Area: Area ? Area.Id : null,
				Address1: Address1 ? Address1 : null,
				Address2: Address2 ? Address2 : null,
				PostCode
			},
			res => {
				this.setState({ didSucceed: true });
				this.props.route.params?.onChildChange &&
					this.props.route.params?.onChildChange();
				this.props.navigation.goBack();
			},
			err => {
				this.setState({ lockSubmit: false });
				this.lockSubmit = false;

				if (err.status === 400) {
					LongToast("UserAlreadyExists")
					return true;
				}
			}
		);
	};

	renderContent = () => {
		const {
			Address1,
			Address2,
			Area,
			City,
			Country,
			Description,
			Email1,
			Email2,
			Name,
			Phone1,
			Phone2,
			PostCode,
			PhoneCountry,
			PhoneCountryTwo,
		} = this.state;

		if (!this.state.dataFetched) {
			return null
		}

		return (
			<ScrollView contentContainerStyle={{}}>
				<HorizontalInput
					maxLength={STRING_LENGTH_MEDIUM}
					label="Name"
					value={Name}
					onChangeText={text => {
						this.setState({ Name: text });
					}}
				/>

				<ItemSeparator />

				<HorizontalInput
					maxLength={STRING_LENGTH_MEDIUM}
					label="Description"
					value={Description}
					onChangeText={text => {
						this.setState({ Description: text });
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
					value={Phone1}
					onChangeText={text => {
						this.setState({ Phone1: text });
					}}
				/>

				<ItemSeparator />
				<PhoneInput
					countryId={PhoneCountryTwo ? PhoneCountryTwo.Id : undefined}
					onPressFlag={() => {
						SelectCountry(this.props.navigation, item => {
							this.setState({ PhoneCountryTwo: item });
						});
					}}
					value={Phone2}
					onChangeText={text => {
						this.setState({ Phone2: text });
					}}
				/>
				<ItemSeparator />

				<HorizontalInput
					label="Email1"
					maxLength={STRING_LENGTH_MEDIUM}
					value={Email1}
					keyboardType="email-address"
					onChangeText={text => {
						this.setState({ Email1: text });
					}}
				/>
				<ItemSeparator />

				<HorizontalInput
					label="Email2"
					maxLength={STRING_LENGTH_MEDIUM}
					value={Email2}
					keyboardType="email-address"
					onChangeText={text => {
						this.setState({ Email2: text });
					}}
				/>
				<ItemSeparator />

				<ArrowItem
					onPress={() => {
						SelectCountry(this.props.navigation, item => {
							this.setState({ Country: item, City: null });
						});
					}}
					title={"Country"}
					style={{ paddingHorizontal: largePagePadding }}
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
						info={City ? City.Name : null}
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

				<HorizontalInput
					maxLength={STRING_LENGTH_MEDIUM}
					label="Address2"
					value={Address2}
					onChangeText={text => {
						this.setState({ Address2: text });
					}}
				/>
				<ItemSeparator />
				<HorizontalInput
					maxLength={STRING_LENGTH_MEDIUM}
					label="PostCode"
					value={PostCode}
					onChangeText={text => {
						this.setState({ PostCode: text });
					}}
				/>
				<ItemSeparator />

			</ScrollView>
		)
	}

	render() {
		const { languages_data } = this.props;
		const { roles, DayTypes } = this.state;

		return (
			<LazyContainer style={{ flex: 1, backgroundColor: "#FFF" }}>
				<CustomHeader
					navigation={this.props.navigation}
					title={"AddWarehouse"}
					rightComponent={
						<HeaderSubmitButton
							isLoading={this.state.lockSubmit}
							didSucceed={this.state.didSucceed}
							onPress={() => {
								this.submit();
							}}
						/>
					}
				/>

				{this.renderContent()}

				{DayTypes && (
					<CustomSelector
						ref={this.dayTypesSelcectorRef}
						options={DayTypes.map(item => item.Day.Name)}
						onSelect={index => {
							this.setState({ DayType: DayTypes[index] });
						}}
						onDismiss={() => { }}
					/>
				)}
				<CustomSelector
					ref={this.languageSelectorRef}
					options={languages_data.map(item => item.label)}
					onSelect={index => {
						this.setState({ Language: languages_data[index] });
					}}
					onDismiss={() => { }}
				/>

				{roles && (
					<CustomSelector
						ref={this.roleSelectorRef}
						options={roles.map(item => item.Name)}
						onSelect={index => {
							this.setState({ Role: roles[index] });
						}}
						onDismiss={() => { }}
					/>
				)}
			</LazyContainer>
		)
	}
}

const mapStateToProps = ({ 
	language: { 
		languages_data, 
		currLang 
	},
	places: {
		countries,
	},
	login: {
		country_id,
	},
}) => ({
	languages_data,
	currLang,
	country_id,
	countries,
})

export default connect(mapStateToProps)(withLocalize(AddWarehouse));
