import React from 'react'
import { View, ScrollView } from 'react-native';
import CustomHeader from '../../components/CustomHeader';
import HeaderSubmitButton from '../../components/HeaderSubmitButton';
import LazyContainer from '../../components/LazyContainer';
import CustomSelector from '../../components/CustomSelector';
import HorizontalInput from '../../components/HorizontalInput';
import PhoneInput from '../../components/PhoneInput';
import ItemSeparator from '../../components/ItemSeparator';
import TranslatedText from '../../components/TranslatedText';
import CustomButton from '../../components/CustomButton';
import FontedText from '../../components/FontedText';
import { SelectEntity } from '../../utils/EntitySelector';
import { SelectCity, SelectArea, SelectCountry } from '../../utils/Places';
import { getDriverTextColor, getDriverBgColor, isValidDriverSelection } from '../../utils/Drivers.js';
import { STRING_LENGTH_LONG, STRING_LENGTH_MEDIUM } from '../../constants/Config';
import { GetCustomerByPhone } from '../../services/CustomersService';
import { GetOrderPricing } from '../../services/OrdersService';
import { OrderPlace } from '../../services/OrdersService';
import { TrimText } from '../../utils/Text';
import { pagePadding, largePagePadding } from '../../constants/Style';
import { mainColor, mainTextColor } from '../../constants/Colors';
import { LongToast } from '../../utils/Toast';
import ProductOptionsList from "./ProductOptionsList";
import { GetOptionsPostModel } from "../../utils/Product";
import { connect } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons'
import ArrowItem from '../../components/ArrowItem';

class CourierConfig extends React.Component {
	constructor(props) {
		super(props)

		const {
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
			POS_DefaultOrderStatus,
			Pricing,
			Items,
			Id,
			Status,
		} = this.props.route.params

		this.state = {
			// Name,
			// Phone,
			// PhoneCountry
			Status, // here
			// Note: null,
			// SubStore: null,
			// Address,
			// Country,
			// City,
			// Area: null,
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
			POS_DefaultOrderStatus,
			Items: Items.map(item => ({ ...item, ProductId: item.Id })),
			Pricing,
			Driver: null,
			CustomerId: null,
			Id,
			lockSubmit: false,
		}

		this.lockSubmit = false
		this.searchUpdateInterval = 600
		this.statusSelectorRef = React.createRef()

	}

	componentDidUpdate() {
		//trigger load pricing at startup for only once
		if (!this.state.lockPricingUpdateOnStartup) {
			this.setState({ lockPricingUpdateOnStartup: true }, () => {
				this.getPricing();
			})
		}
	}

	componentDidMount() {
		const {
			City: pCity,
			Country: pCountry,
			Area: PArea,
			PhoneCountry: pPhoneCountry,
			Phone: pPhone,
			Status: pStatus,
			Id,
		} = this.props.route.params

		const {
			customer_info: {
				Phone = null,
				PhoneCountry = null,
				CourierConfig = []
			},
			updateCustomerInfo,
			customer_info
		} = this.props

		const {
			POS_OptionGroups = []
		} = this.state

		if (CourierConfig && CourierConfig.length > 0) {
			const x = CourierConfig.find(item => item.CourierId == Id)
			if (x && x.Config && x.Config.length == POS_OptionGroups.length) {

				let HaveChangingMembers = false;

				for (let i = 0; i < x.Config.length; i++) {

					if (x.Config[i].Members.length != POS_OptionGroups[i].Members.length) {
						HaveChangingMembers = true
					}

				}

				if (!HaveChangingMembers) {
					this.setState({ POS_OptionGroups: x.Config })
				}
			}
		}

		updateCustomerInfo({
			...customer_info,
			Status: pStatus,
		})

		if (!PhoneCountry) {
			updateCustomerInfo({
				...customer_info,
				PhoneCountry: pPhoneCountry
			})
		}

		if (!Phone) {
			updateCustomerInfo({
				...customer_info,
				Phone: null
			})
		}
	}

	submit = () => {

		if (this.lockSubmit) {
			return
		}

		const {
			EmptyCart

		} = this.props.route.params;

		const {
			Id,
			POS_IsAddressRequired,
			POS_IsAreaRequired,
			POS_IsCityRequired,
			POS_IsCountryRequired,
			POS_IsDriverRequired,
			POS_IsSubStoreRequired,
			POS_OptionGroups,
			Pricing,
		} = this.state

		const {
			onChildChange
		} = this.props.route.params

		const {
			customer_info: {
				Name,
				Country = this.props.route.params?.Country,
				City = this.props.route.params?.City,
				Area = this.props.route.params?.Area,
				Status,
				Phone,
				PhoneCountry = this.props.route.params?.PhoneCountry,
				Address,
				Note,
				SubStore,
				Driver,
				CustomerId = null,
			}
		} = this.props

		GetOptionsPostModel(POS_OptionGroups, ({ model }) => {
			if (!Name || !Phone) {
				return LongToast('CantHaveEmptyInputs')
			}
			if (POS_IsAddressRequired && !Address) {
				return LongToast('EnterAddress')
			}
			if (POS_IsAreaRequired && !Area) {
				return LongToast('SelectArea')
			}
			if (POS_IsCityRequired && !City) {
				return LongToast('SelectCity')
			}
			if (POS_IsCountryRequired && !Country) {
				return LongToast('SelectCountery')
			}
			if (POS_IsDriverRequired && !Driver) {
				return LongToast('SelectDriver')
			}
			if (POS_IsSubStoreRequired && !SubStore) {
				return LongToast('SelectSubStore')
			}
			if (this.props.cart_items && this.props.cart_items.length <= 0) {
				return LongToast('pleaseAddItemsToCart')
			}


			this.lockSubmit = true
			this.setState({ lockSubmit: true })

			OrderPlace({
				Items: this.props.cart_items.map(item => ({
					ProductId: item.Id,
					Qty: item.Qty,
					Note: item.Note,
					Options: item.Options ? item.Options.map(mapItem => ({ ProductOptionId: mapItem.Id })) : []
				})),
				Discount: Pricing ? Pricing.Disocunt : 0/*wrong spelling form server*/,
				CustomerName: Name,
				CustomerPhone: `${PhoneCountry.PhoneCode}${Phone}`,
				CoutryId: Country && Country.Id ? Country.Id : null,
				CityId: City && City.Id ? City.Id : null,
				AreaId: Area && Area.Id ? Area.Id : null,
				Address,
				Note,
				SubStoreId: SubStore && SubStore.Id ? SubStore.Id : null,
				DriverId: Driver && Driver.Id ? Driver.Id : null,
				OrderStatus: Status && Status.Id ? Status.Id : null,
				CustomerId: CustomerId,
				CourierId: Id,
				Options: model
			}, () => {
				this.lockSubmit = false
				this.setState({ lockSubmit: false, Pricing: { Total: 0, SubTotal: 0, Shipping: 0, Tax: 0 } }, () => {
					EmptyCart && EmptyCart()
					onChildChange && onChildChange()
					this.props.navigation.navigate('POS')
				})
			}, err => {
				this.lockSubmit = false
				this.setState({ lockSubmit: false })
			})
		}, ({ required }) => {
			return LongToast(`${required} Is Required`, false)
		})
	}

	shouldComponentUpdate() {
		return true
	}

	onPhoneInputChange = (phone) => {
		const {
			customer_info,
			updateCustomerInfo
		} = this.props



		if (this._throttleTimeout) {
			clearTimeout(this._throttleTimeout)
		}

		updateCustomerInfo({
			...customer_info,
			Phone: phone,
			CustomerId: null
		})

		// this.setState({ Phone: phone, CustomerId: null })

		this._throttleTimeout = setTimeout(
			() => {
				const {
					PhoneCountry = this.props.route.params?.PhoneCountry
				} = customer_info

				let Phone = (phone[0] === "0") ? phone.substr(1) : phone;
				const fullPhone = `${PhoneCountry.PhoneCode}${Phone}`
				Phone = `${PhoneCountry.PhoneCode}${Phone}`
				Phone = encodeURIComponent(Phone)

				GetCustomerByPhone(Phone, res => {
					const {
						Id: CustomerId,
						FullName: Name,
						Address,
						City,
						Country,
						Area
					} = res.data

					LongToast(Name, false)

					const d = {
						CustomerId,
						Name,
						Address,
						Country,
						City,
						Area
					}

					updateCustomerInfo({
						...customer_info,
						...d,
						Phone: phone,
					})

				})
			}, this.searchUpdateInterval)
	}


	renderCourierInputs = () => {

		// return null
		const {
			POS_ShowDriver,
			POS_ShowAddress,
			POS_ShowCountry,
			POS_ShowCity,
			POS_ShowArea,
		} = this.state

		const {
			updateCustomerInfo,
			customer_info
		} = this.props

		const {
			customer_info: {
				Country = this.props.route.params?.Country,
				City = this.props.route.params?.City,
				Area = this.props.route.params?.Area,
				Address,
				Driver,
			}
		} = this.props
		return (
			<View>
				{POS_ShowAddress && <HorizontalInput
					maxLength={STRING_LENGTH_LONG}
					label="Address"
					value={Address}
					onChangeText={(Address) => {
						updateCustomerInfo({ ...customer_info, Address })

					}} />}

				<ItemSeparator />

				{POS_ShowCountry && <ArrowItem
					onPress={() => {
						SelectCountry(this.props.navigation, item => {
							updateCustomerInfo({ ...customer_info, Country: item, City: null })
							this.getPricing()
						})
					}}
					title={'Country'}
					info={Country ? Country.Name : null}
				/>}

				<ItemSeparator />

				{POS_ShowCity && <ArrowItem
					onPress={() => {
						if (Country && Country.Id) {
							SelectCity(this.props.navigation, item => {
								updateCustomerInfo({ ...customer_info, City: item, Area: null })
								this.getPricing()
							}, Country.Id)
						}
					}}
					title={'City'}
					info={City ? City.Name : null}
				/>}

				<ItemSeparator />

				{POS_ShowArea && <ArrowItem
					onPress={() => {
						if (City && City.Id) {
							SelectArea(this.props.navigation, item => {
								updateCustomerInfo({ ...customer_info, Area: item })
								this.getPricing()
							}, City.Id)
						}
					}}
					title={'Area'}
					info={Area ? Area.Name : null}
				/>}

				<ItemSeparator />

				{POS_ShowDriver && <ArrowItem
					onPress={() => {
						updateCustomerInfo({ ...customer_info, Driver: null })
						SelectEntity(this.props.navigation, Driver => {
							// this.setState({ Driver }, () => {
							// 	updateCustomerInfo({ ...customer_info, Driver })
							// })
							updateCustomerInfo({ ...customer_info, Driver })
						}, 'User/Drivers', null, false, 1, [], {
							itemTextColorModifier: (item) => getDriverTextColor(item.Status.Id),
							itemBgColorModifier: (item) => getDriverBgColor(item.Status.Id),
							onSelectItem: isValidDriverSelection,
						})
					}}
					title={'Driver'}
					info={Driver ? TrimText(Driver.Name, 20) : null}
					customIcon={Driver && Driver != null ?
						this.customIcon : null}
				/>}
			</View>
		)

	}

	customIcon = () => {
		return (
			<Ionicons
				name={'ios-close'}
				size={25}
				color={mainTextColor}
				style={{
					marginLeft: 10,
				}}
			/>
		)
	}

	renderOption = (item, index) => {
		const {
			Members,
			Name,
			Type,
		} = item

		return (
			<View
				key={index}
				style={{
					marginBottom: pagePadding,
				}}>

				{Type.Id != 8 && Type.Id != 9 && <FontedText
					style={{
						color: mainColor,
						fontSize: 16,
						fontWeight: 'bold',
						marginHorizontal: largePagePadding,
					}}>{Name}</FontedText>}

				<ProductOptionsList
					style={{
						marginTop: 5,
						marginHorizontal: largePagePadding,
					}}
					type={Type.Id}
					typName={Name}
					selection={1}
					onSelect={(items) => {
						this.onOptionChange(item, items)
					}}
					// d={Members[0].value1}
					data={Members} />
			</View>
		)
	}

	getPricing = () => {
		const {
			POS_OptionGroups,
			POS_ShowCity,
			POS_ShowArea,
			POS_ShowCountry,
			Id
		} = this.state
		const {
			Discount
		} = this.state.Pricing

		const {
			customer_info: {
				Country = this.props.route.params?.Country,
				City = this.props.route.params?.City,
				Area = this.props.route.params?.Area,
			},
		} = this.props

		GetOptionsPostModel(POS_OptionGroups, ({ model }) => {
			GetOrderPricing({
				Items: this.props.cart_items.map(item => ({
					ProductId: item.Id,
					Qty: item.Qty,
					Note: item.Note,
					Options: item.Options ? item.Options.map(mapItem => ({ ProductOptionId: mapItem.Id })) : []
				})),
				Options: model,
				Discount: Discount,
				CoutryId: POS_ShowCountry && (Country && Country.Id) ? Country.Id : null,
				CityId: POS_ShowCity && (City && City.Id) ? City.Id : null,
				AreaId: POS_ShowArea && (Area && Area.Id) ? Area.Id : null,
				CourierId: Id ? Id : null
			}, res => { this.setState({ Pricing: res.data }) })
		})
	}

	onBlurDiscountInput = () => {
		this.getPricing()
	}

	updateConfig = (CourierId, Config) => {

		const {
			updateCustomerInfo,
			customer_info: {
				CourierConfig = []
			},
			customer_info

		} = this.props

		for (let i = 0; i < CourierConfig.length; i++) {
			if (CourierConfig[i].CourierId == CourierId) {
				CourierConfig[i].Config = Config;
			}
		}

		updateCustomerInfo({
			...customer_info,
			CourierConfig
		})

	}

	// clearCha = () => {
	// 	const {
	// 		updateCustomerInfo,
	// 		customer_info: {
	// 			CourierConfig = []
	// 		},
	// 		customer_info
	// 	} = this.props

	// 	updateCustomerInfo({
	// 		...customer_info,
	// 		CourierConfig: []
	// 	})
	// }
	onOptionChange = (item, items) => {

		const {
			updateCustomerInfo,
			customer_info: {
				CourierConfig = []
			},
			customer_info
		} = this.props

		const {
			Id
		} = this.props.route.params

		const POS_OptionGroups = this.state.POS_OptionGroups.map(mapItem => ({
			...mapItem,
			Members: item.Id === mapItem.Id ? items : mapItem.Members
		}))

		this.setState({
			POS_OptionGroups,
		}, this.getPricing)

		// this.clearCha()
		// return
		let HaveConfig = false;

		for (let i = 0; i < CourierConfig.length; i++) {
			if (CourierConfig[i].CourierId == Id) {
				HaveConfig = true
			}
		}

		if (HaveConfig) {
			this.updateConfig(Id, POS_OptionGroups)
		} else {

			const d = CourierConfig
			d.push({ CourierId: Id, Config: POS_OptionGroups })

			updateCustomerInfo({
				...customer_info,
				CourierConfig: d
			})

		}
	}

	renderCheckoutForm = () => {

		const {
			updateCustomerInfo,
			customer_info
		} = this.props

		// return null
		const {
			POS_ShowSubStore,
			POS_ShowOrderStatus,
			POS_OptionGroups,
			Pricing: {
				Total,
				SubTotal,
				Shipping,
				Tax
			},
		} = this.state



		const {
			customer_info: {
				Phone = null,
				PhoneCountry = this.props.route.params?.PhoneCountry,
				Status = null,
				Note = null,
				SubStore = null,
				Discount = 0
			}
		} = this.props
		return (
			<View >
				<HorizontalInput
					maxLength={STRING_LENGTH_MEDIUM}
					label="Name"
					value={customer_info && customer_info.Name ? customer_info.Name : null}
					onChangeText={(Name) => {
						updateCustomerInfo({
							...customer_info,
							Name
						})
						// this.setState({ Name }, () => {
						// 	updateCustomerInfo({
						// 		...customer_info,
						// 		FullName: Name
						// 	})
						// })
					}} />

				<ItemSeparator />

				<PhoneInput
					countryId={PhoneCountry ? PhoneCountry.Id : undefined}
					onPressFlag={() => {
						SelectCountry(this.props.navigation, item => {
							updateCustomerInfo({
								...customer_info,
								PhoneCountry: item
							})
						})
					}}
					maxLength={STRING_LENGTH_MEDIUM}
					value={Phone ? Phone : null}
					onChangeText={this.onPhoneInputChange} />

				<ItemSeparator />

				{POS_ShowSubStore && <ArrowItem
					onPress={() => {
						updateCustomerInfo({ ...customer_info, SubStore: null })
						SelectEntity(this.props.navigation, SubStore => {
							updateCustomerInfo({
								...customer_info,
								SubStore
							})
						}, 'Tenant/SubStore/Simple', null, false, 1)
					}}
					title={'SubStore'}
					info={SubStore ? SubStore.Name : null}
					customIcon={SubStore && SubStore != null ?
						this.customIcon : null}
				/>}

				<ItemSeparator />

				{POS_ShowOrderStatus && <ArrowItem
					onPress={() => {
						this.statusSelectorRef.current.show()
					}}
					title={'Status'}
					info={Status ? Status.Name : null} />}

				<ItemSeparator />

				<HorizontalInput
					maxLength={STRING_LENGTH_LONG}
					multiline={true}
					numberOfLines={2}
					label="Note"
					value={Note}
					onChangeText={(Note) => {
						updateCustomerInfo({
							...customer_info,
							Note
						})
						// this.setState({ Note }, () => {
						// 	updateCustomerInfo({
						// 		...customer_info,
						// 		Note
						// 	})
						// })
					}} />

				<ItemSeparator />

				<HorizontalInput
					keyboardType='numeric'
					onBlur={this.onBlurDiscountInput}
					maxLength={STRING_LENGTH_MEDIUM}
					label="Discount"
					value={Discount ? `${Discount}` : null}
					onChangeText={(Discount) => {
						this.setState({
							Pricing: {
								...this.state.Pricing,
								Discount
							}
						})
						// this.setState({ Discount }, () => {
						// 	updateCustomerInfo({
						// 		...customer_info,
						// 		Discount
						// 	})
						// })
					}} />

				<HorizontalInput
					editable={false}
					label="Total"
					value={Total ? `${Total}` : '0'}
				/>

				<HorizontalInput
					editable={false}
					label="SubTotal"
					value={SubTotal ? `${SubTotal}` : '0'}
				/>

				<HorizontalInput
					editable={false}
					label="Tax"
					value={Tax ? `${Tax}` : '0'}
				/>

				<HorizontalInput
					editable={false}
					label="Shipping"
					value={Shipping ? `${Shipping}` : '0'}
				/>


				{this.renderCourierInputs()}
				<View
					style={{
						marginTop: largePagePadding,
					}}
				>
					{POS_OptionGroups.length != 0 ? <TranslatedText style={{ fontSize: 17, color: mainTextColor, marginHorizontal: largePagePadding }} text="SelectOptions" /> : null}

					{POS_OptionGroups.map(this.renderOption)}
				</View>

				<CustomButton
					onPress={() => { this.submit() }}
					style={{
						// marginVertical: 10,
						marginHorizontal: largePagePadding,
						marginBottom: 10
					}}
					loading={this.state.lockSubmit}
					// fullWidth={true}
					title={'PlaceOrder'}
				/>
			</View>
		)
	}

	render() {
		const {
			OrderStatusList,
			lockSubmit
		} = this.state

		const {
			customer_info,
			updateCustomerInfo
		} = this.props

		return (
			<LazyContainer
				style={{
					flex: 1
				}}
			>
				<CustomHeader
					navigation={this.props.navigation}
					title='Checkout'
					rightComponent={
						<HeaderSubmitButton
							isLoading={lockSubmit}
							onPress={() => { this.submit() }} />
					}
				/>
				<ScrollView>
					{this.renderCheckoutForm()}
				</ScrollView>

				{OrderStatusList && <CustomSelector
					ref={this.statusSelectorRef}
					options={OrderStatusList.map(item => item.Name)}
					onSelect={(index) => {
						// this.setState({
						// 	Status: OrderStatusList[index]
						// }, () => {
						// 	updateCustomerInfo({
						// 		...customer_info,
						// 		Status: OrderStatusList[index]
						// 	})
						// })
						updateCustomerInfo({
							...customer_info,
							Status: OrderStatusList[index]
						})
					}}
					onDismiss={() => { }}
				/>}

			</LazyContainer>
		)
	}
}


const mapStateToProps = ({
	cart: {
		cart_items,
		customer_info
	}
}) => ({
	cart_items,
	customer_info
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

export default connect(mapStateToProps, undefined, mergeProps)(CourierConfig)