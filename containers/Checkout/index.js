import React, { Component } from 'react'
import { View, ScrollView } from 'react-native'
import { connect } from 'react-redux'
import CustomHeader from '../../components/CustomHeader/index.js';
import LazyContainer from '../../components/LazyContainer'
import ItemSeparator from '../../components/ItemSeparator/index.js';
import CustomButton from '../../components/CustomButton/index.js';
import { pagePadding, largePagePadding } from '../../constants/Style.js';
import { LongToast } from '../../utils/Toast.js';
import HorizontalInput from '../../components/HorizontalInput/index.js';
import PhoneInput from '../../components/PhoneInput/index.js';
import { SelectCountry, SelectCity, SelectArea } from '../../utils/Places.js';
import { STRING_LENGTH_MEDIUM, STRING_LENGTH_LONG } from '../../constants/Config.js';
import ArrowItem from '../../components/ArrowItem/index.js';
import { SelectEntity } from '../../utils/EntitySelector.js';
import HeaderSubmitButton from '../../components/HeaderSubmitButton/index.js';
import { OrderPlaceExtension, GetOrderCheckout } from '../../services/OrdersService.js';
import { isValidMobileNumber } from '../../utils/Validation.js';
import { ExternalTranslate } from '../../utils/Translate';
import { GetCustomerByPhone } from '../../services/CustomersService.js';
import { mainTextColor, secondTextColor, mainColor } from '../../constants/Colors.js';
import { getFilters } from '../../services/FilterService.js';
import CustomSelector from '../../components/CustomSelector/index.js';
import FontedText from '../../components/FontedText/index.js';
import RoundedCloseButton from '../../components/RoundedCloseButton';
import TranslatedText from '../../components/TranslatedText/index.js';
import { getDriverTextColor, getDriverBgColor, isValidDriverSelection } from '../../utils/Drivers.js';
import CustomTouchable from '../../components/CustomTouchable/index.js';
import { TrimText } from '../../utils/Text.js';

class Checkout extends Component {
	constructor(props) {
		super(props)

		this.state = {
			Pricing: this.props.route.params?.Pricing,
			customerInfo: {
			}
		}

		this.searchUpdateInterval = 600
		this.statusSelectorRef = React.createRef()

	}

	onChildChange = () => {
		this.setState({ triggerRefresh: !this.state.triggerRefresh, Pricing: { Total: 0, SubTotal: 0, Shipping: 0, Tax: 0 } }, () => {
			this.componentDidMount()

		})
	}

	componentDidMount() {
		const { country_id, city, countries } = this.props
		GetOrderCheckout(res => {
			const {
				Courier,
			} = res.data

			if (!Courier) {
				LongToast("InvalidCouriers")
				return
			}

			const Country = countries.find(item => item.Id === country_id)
			this.setState({
				Country: Country,
				PhoneCountry: Country,
				City: city,
				Courier,
				Options: [],
				didFetchData: true,
			})
		})

		getFilters({
			orderStatus: true,
		}, res => {
			const {
				OrderStatusList,
			} = res.data

			this.setState({
				OrderStatusList,
			})
		})
	}

	submit = () => {
		if (this.lockSubmit) {
			return
		}

		const { SelectedCourier } = this.state

		if (!SelectedCourier) {
			return
		}

		const { IsLocalPickUp } = SelectedCourier

		const {
			Name,
			PhoneCountry,
			SubStore,
			Country,
			City,
			Area,
			Address,
			Driver,
			Status,
			Note,
			CustomerId,
		} = this.state

		let {
			Phone,
		} = this.state

		if ((!IsLocalPickUp && !Name) || !Status || (IsLocalPickUp && !Phone) || (IsLocalPickUp && !Address) || !SubStore || (IsLocalPickUp && !Country) || (IsLocalPickUp && !City) || (IsLocalPickUp && !Address)) {
			return LongToast('CantHaveEmptyInputs')
		}

		if (Phone) {
			Phone = (Phone[0] === "0") ? Phone.substr(1) : Phone;

			if (!isValidMobileNumber(`${PhoneCountry.PhoneCode}${Phone}`)) {
				LongToast('InvalidPhone')
				return;
			}
		}

		this.setState({ lockSubmit: true })
		this.lockSubmit = true

		OrderPlaceExtension(IsLocalPickUp ? "Ship" : "Pickup", {
			CourierId: SelectedCourier.Id,
			CustomerId,
			CustomerName: Name,
			CustomerPhone: Phone ? `${PhoneCountry.PhoneCode}${Phone}` : null,
			CoutryId: Country ? Country.Id : null,
			CityId: City ? City.Id : null,
			AreaId: Area ? Area.Id : null,
			Address,
			Note,
			OrderStatus: Status.Id,
			SubStoreId: SubStore.Id,
			DriverId: Driver ? Driver.Id : null,
			Items: this.props.cart_items.map(item => ({
				ProductId: item.Id,
				Qty: item.Qty,
				Note: item.Note,
				Options: item.Options.map(item => item.Id),
			})),
			Price: this.state.Pricing
		}, res => {
			this.setState({ didSucceed: true, })
			this.props.emptyCart()
			this.props.navigation.navigate("POS")
		}, err => {
			this.setState({ lockSubmit: false })
			this.lockSubmit = false
		})
	}

	renderCourierInputs = () => {
		const {
			Country,
			City,
			Area,
			Address,
			Driver,
		} = this.state

		return (
			<View>
				<HorizontalInput
					maxLength={STRING_LENGTH_LONG}
					label="Address"
					value={Address}
					onChangeText={(Address) => { this.setState({ Address }) }} />

				<ItemSeparator />

				<ArrowItem
					onPress={() => {
						SelectCountry(this.props.navigation, item => {
							this.setState({
								Country: item,
								City: null
							})
						})
					}}
					title={'Country'}
					info={Country ? Country.Name : null}
				/>

				<ItemSeparator />

				<ArrowItem
					onPress={() => {
						SelectCity(this.props.navigation, item => {
							this.setState({ City: item, Area: null })
						}, Country.Id)
					}}
					title={'City'}
					info={City ? City.Name : null}
				/>

				<ItemSeparator />

				<ArrowItem
					onPress={() => {
						SelectArea(this.props.navigation, item => {
							this.setState({ Area: item })
						}, City.Id)
					}}
					title={'Area'}
					info={Area ? Area.Name : null}
				/>

				<ItemSeparator />

				<ArrowItem
					onPress={() => {
						SelectEntity(this.props.navigation, Driver => {
							this.setState({ Driver })
						}, 'User/Drivers', null, false, 1, [], {
							itemTextColorModifier: (item) => getDriverTextColor(item.Status.Id),
							itemBgColorModifier: (item) => getDriverBgColor(item.Status.Id),
							onSelectItem: isValidDriverSelection,
						})
					}}
					title={'Driver'}
					info={Driver ? Driver.Name : null} />
			</View>
		)

	}

	renderCartItemOption = (item, index) => {
		const {
			Name,
		} = item

		return (
			<FontedText
				key={index}
				numberOfLines={1}
				ellipsizeMode="middle"
				style={{
					textAlign: 'left',
					fontSize: 13,
					color: secondTextColor
				}}>{Name}</FontedText>
		)
	}

	groupBy = key => array =>
		array.reduce((objectsByKeyValue, obj) => {
			let value = { Name: '' }
			if (obj[key] != null) {
				value = obj[key].Name
			}
			objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
			return objectsByKeyValue;
		}, {});


	renderCartItemWithSubStores = () => {
		const { cart_items } = this.props
		const groupBySubStore = this.groupBy('SubStore')
		const newData = groupBySubStore(cart_items)
		const SubStore = Object.keys(newData)

		return SubStore.map((item, index) => {
			return (
				<View
					style={{
						marginTop: pagePadding,
						marginHorizontal: largePagePadding,
						marginVertical: 2
					}}
					key={index}
				>
					<FontedText
						numberOfLines={1}
						ellipsizeMode="middle"
						style={{
							textAlign: 'left',
							fontSize: 15,
							color: mainTextColor,
						}}>{item}</FontedText>
					{
						cart_items.map((ite, ind) => {
							if (ite.SubStore.Name == item) {
								return this.renderCartItem(ite, ind)
							}
						})
					}
				</View>
			)
		})
	}

	// onChangeCustomerInfo = (customerInfo) => {
	// 	const {
	// 		Id,
	// 		FullName,
	// 		Address,
	// 		City,
	// 		Country,
	// 		phone,
	// 		Area
	// 	} = customerInfo

	// 	const {
	// 		updateCustomerInfo
	// 	} = this.props

	// 	updateCustomerInfo({
	// 			CustomerId: Id,
	// 			FullName,
	// 			Address,
	// 			City,
	// 			Country,
	// 			phone,
	// 			Area
	// 		})
	// }

	renderCourier = (item, index) => {
		const {
			Id,
			Name,
			POS_OptionGroups,
			POS_OptionGroupsIds,
			POS_ShowDriver,
			POS_IsDriverRequired,
			POS_ShowSubStore,
			POS_IsSubStoreRequired,
			POS_ShowCountry,
			POS_IsCountryRequired,
			POS_ShowCity,
			POS_IsCityRequired,
			POS_ShowArea,
			POS_IsAreaRequired,
			POS_ShowAddress,
			POS_IsAddressRequired,
			POS_ShowOrderStatus,
			POS_DefaultOrderStatus
		} = item

		const {
			Phone,
			PhoneCountry,
			Country,
			City,
			OrderStatusList,
			customerInfo,
			Area
		} = this.state

		return (
			<View key={index} >

				<CustomButton
					onPress={() => {

						const { country_id, city, countries } = this.props
						const CountryPhone = countries.find(item => item.Id === country_id)
						this.props.navigation.navigate('CourierConfigrations', {
							Id,
							PhoneCountry: CountryPhone,
							Status: POS_DefaultOrderStatus,
							onChildChange: this.onChildChange,
							OrderStatusList,
							POS_OptionGroups,
							POS_OptionGroupsIds,
							POS_ShowDriver,
							POS_IsDriverRequired,
							POS_ShowSubStore,
							POS_IsSubStoreRequired,
							POS_ShowCountry,
							POS_IsCountryRequired,
							POS_ShowCity,
							POS_IsCityRequired,
							POS_ShowArea,
							POS_IsAreaRequired,
							POS_ShowAddress,
							POS_IsAddressRequired,
							POS_ShowOrderStatus,
							Items: this.props.cart_items,
							Pricing: this.state.Pricing,
							EmptyCart: this.props.emptyCart,
							// Address: POS_ShowAddress ? this.props.customer_info && this.props.customer_info.Address : null,
							Country: POS_ShowCountry ? Country : null,
							City: POS_ShowCity ? City : null,
							Area: POS_ShowArea && Area ? Area : null,
							// Name: this.props.customer_info && this.props.customer_info.FullName ? this.props.customer_info.FullName : null,
							// onChangeCustomerInfo: this.onChangeCustomerInfo
						})
					}}
					style={{
						marginTop: 10,
					}}
					fullWidth={true}
					title={Name}
				/>
			</View>

		)
	}
	renderCartItem = (item, index) => {
		const {
			Name,
			Price,
			SalePrice,
			Qty,
			Options,
			Note,
			SKU
		} = item

		const { Currency } = this.props
		return (
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center',
					marginVertical: 5,
					marginHorizontal: 5
				}}
				key={index}>
				<View
					style={{
						flex: 1,
						paddingRight: largePagePadding,
						alignItems: 'flex-start',
					}}>
					<FontedText
						style={{
							textAlign: 'left',
							fontSize: 15,
							color: mainTextColor
						}}>
						{SKU && SKU != '' ? `${Name}  *  ${SKU}` : Name}
					</FontedText>
					<View
						style={{
							paddingLeft: largePagePadding,
						}}>
						{Options.map(this.renderCartItemOption)}
					</View>
					{Note && Note.length > 0 && <FontedText style={{ fontSize: 14, color: secondTextColor }}>{Note}</FontedText>}
				</View>
				<FontedText style={{ fontSize: 14, color: secondTextColor, marginHorizontal: 10 }}>{Qty} x {Currency.Name}{SalePrice || Price}</FontedText>
				<RoundedCloseButton
					onPress={() => {
						const { removeCartItemByIndex, updatePricing } = this.props.route.params
						removeCartItemByIndex(index)
						updatePricing((Pricing) => {
							this.setState({ Pricing })
						})
					}}
				/>
			</View >
		)
	}



	renderContent = () => {
		const { didFetchData, Courier } = this.state

		const {
			cart_items,
		} = this.props

		if (didFetchData) {
			const {
				cart_items,
				Currency,
			} = this.props

			const { Pricing } = this.state

			return (
				<View>

					<View
						style={{
							marginHorizontal: largePagePadding,
							marginTop: pagePadding
						}}>
						<TranslatedText style={{ fontSize: 17, color: mainTextColor }} text="SelectCourier" />
						{Courier.map(this.renderCourier)}
					</View>

					<View
						style={{
							marginTop: pagePadding,
						}}>
						{this.renderCartItemWithSubStores()}
					</View>

					<ItemSeparator
						style={{
							marginVertical: pagePadding,
						}} />

					<View
						style={{
							flexDirection: 'row',
							alignItems: 'center',
							marginHorizontal: largePagePadding,
						}}>
						<TranslatedText style={{ fontSize: 17, color: mainTextColor }} text="Total" />
						{Pricing && <FontedText style={{ fontSize: 17, color: secondTextColor, marginLeft: 5, }}>{Currency.Name}{Pricing.Total}</FontedText>}
					</View>

				</View>
			)
		}
	}

	render() {
		const {
			OrderStatusList,
		} = this.state

		return (
			<LazyContainer style={{ flex: 1, backgroundColor: "#FFF" }}>
				<CustomHeader
					leftComponent="back"
					navigation={this.props.navigation}
					title="Cart" />

				<ScrollView>
					{this.renderContent()}
				</ScrollView>

				{OrderStatusList && <CustomSelector
					ref={this.statusSelectorRef}
					options={OrderStatusList.map(item => item.Name)}
					onSelect={(index) => { this.setState({ Status: OrderStatusList[index] }) }}
					onDismiss={() => { }}
				/>}
			</LazyContainer>
		)
	}
}

const mapStateToProps = ({
	login: {
		Currency,
		country_id,
		city
	},
	cart: {
		cart_items,
		customer_info,
	},
	places: {
		countries,
	},
}) => ({
	customer_info,
	Currency,
	cart_items,
	countries,
	country_id,
	city
})

function mergeProps(stateProps, { dispatch }, ownProps) {
	const {
		actions: {
			emptyCart,
			updateCustomerInfo
		}
	} = require('../../redux/CartRedux.js');

	return {
		...ownProps,
		...stateProps,
		emptyCart: () => emptyCart(dispatch),
		updateCustomerInfo: (customer_info) => updateCustomerInfo(dispatch, customer_info)
	};
}

export default connect(mapStateToProps, undefined, mergeProps)(Checkout)