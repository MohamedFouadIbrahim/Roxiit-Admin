import React, { Component } from 'react';
import { withLocalize } from 'react-localize-redux';
import { FlatList, ScrollView, View, Platform, BackHandler, Dimensions, I18nManager, Linking, Alert, } from 'react-native';
import Modal from 'react-native-modal';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import ArrowItem from '../../components/ArrowItem/index.js';
import CustomHeader from '../../components/CustomHeader/index.js';
import CircularImage from '../../components/CircularImage';
import CustomWebView from '../../components/CustomWebView';
import CustomTouchable from '../../components/CustomTouchable';
import FontedText from '../../components/FontedText/index.js';
import HeaderSubmitButton from '../../components/HeaderSubmitButton/index.js';
import HorizontalInput from '../../components/HorizontalInput/index.js';
import LazyContainer from '../../components/LazyContainer';
import SettingsSeparator from '../../components/Settings/SettingsSeparator.js';
import CustomButton from '../../components/CustomButton';
import ItemSeparator from '../../components/ItemSeparator';
import CustomSelector from '../../components/CustomSelector';
import SettingsTitle from '../../components/Settings/SettingsTitle.js';
import TranslatedText from '../../components/TranslatedText/index.js';
import { mainTextColor, secondTextColor, mainColor } from '../../constants/Colors.js';
import { largeBorderRadius, largePagePadding, pagePadding, shadowStyle0, shadowStyle3 } from '../../constants/Style.js';
import { AcceptOrder, ChangeOrderPricing, DeclineOrder, GetOrderDetails, GetOrderSummary, GetOrderStatusList, ChangeOrderStatus, AcceptOrderDriver, DeclineOrderDriver } from '../../services/OrdersService.js';
import { LongToast } from '../../utils/Toast.js';
import { IsScreenPermitted } from '../../utils/Permissions';
import ReminderList from './ReminderList';
import ProductOptionLabel from './ProductOptionLabel.js';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import RemoteImage from '../../components/RemoteImage/index.js';
import AntDesign from 'react-native-vector-icons/AntDesign'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { Whatsapp, PhoneCall } from '../../utils/Call.js'

class Order extends Component {
	constructor(props) {
		super(props)

		const { Id } = this.props.route.params
		this.orderId = Id

		this.state = {
			didFetchData: false,
			isPriceCollapsed: false,
			priceEditorShown: false,
			Reminders: [],
			Status: {
				Id: 0
			},
			lockSubmit: false,
			showImageModal: false,
			selectedImage: null,

			screenWidth: Dimensions.get('screen').width,
			screenHeight: Dimensions.get('screen').height,
		}
		this.statusSelectorRef = React.createRef()
		this.isCustomersPermitted = IsScreenPermitted("Customers")
		this.lockSubmit = false
	}

	componentDidMount() {
		this.fetchData()
		this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
			this.props.navigation.goBack()
			return true
		});

		//re render when change orientation
		Dimensions.addEventListener('change', () => {
			this.setState({
				screenWidth: Dimensions.get('screen').width,
				screenHeight: Dimensions.get('screen').height,
			})
		})
	}

	componentWillUnmount() {
		this.cancelFetchDataGetOrderSummary && this.cancelFetchDataGetOrderSummary()
		this.cancelFetchDataChangeOrderPricing && this.cancelFetchDataChangeOrderPricing()
		this.backHandler.remove();
	}

	grtStatusList = (callBack) => {
		GetOrderStatusList(res => {
			this.setState({ StatusList: res.data.Data }, callBack)
		})
	}

	getOrderOrderSammertyDetails = (callBack) => {
		GetOrderDetails(this.orderId, resDeta => {
			this.setState({
				Lat: resDeta.data.Lat,
				Lng: resDeta.data.Lng,
			}, callBack)
		})
	}

	fetchData = () => {
		const { orderId } = this
		this.cancelFetchDataGetOrderSummary = GetOrderSummary(orderId, res => {

			this.setState({
				...res.data,
				Customer: {
					OrdersCount: res.data.OrdersCount,
					TotalSpent: res.data.TotalSpent,
					Id: res.data.CustomerId
				},
				didFetchData: true,
			})

		})
	}

	renderModal = () => {

		return (
			<Modal
				isVisible={this.state.showModal}
				onBackdropPress={() => {
					this.setState({ showModal: false, Notes: '' })
				}}
				onSwipeComplete={() => {
					this.setState({ showModal: false, Notes: '' })
				}}
			>
				<View
					style={{
						margin: 20,
						padding: 10,
						borderRadius: 20,
						backgroundColor: 'white',
						justifyContent: 'center',
						alignItems: 'center',
						...shadowStyle0
					}} >
					<View
						style={{
							flexDirection: 'row',
							justifyContent: 'flex-end',
							alignItems: 'center',
							width: '100%',
							marginBottom: 10,
						}}>


						<CustomTouchable
							onPress={() => {
								this.setState({ showModal: false, Notes: '' })
							}}
							style={{
								paddingLeft: 5,
								paddingBottom: 5,
								marginRight: 10

							}}>
							<Ionicons name='ios-close' color='#444444' size={26} />
						</CustomTouchable>
					</View>

					<HorizontalInput
						autoFocus={this.state.showModal}
						value={this.state.Notes}
						label={'Notes'}
						onChangeText={(Notes) => { this.setState({ Notes }) }}
					/>

					<ItemSeparator />

					<CustomButton
						style={{ width: '100%' }}
						title={'Send'}
						loading={this.state.Submit}
						onPress={() => {
							this.onSubmitStatus()
						}}
					/>
				</View>

			</Modal>
		)
	}

	onSubmitStatus = () => {
		const order_id = this.changingOrderId
		const status = this.Status
		const { Notes } = this.state

		this.setState({ Submit: true })

		this.cancelFetchDataChangeOrderStatus = ChangeOrderStatus({
			orderId: order_id,
			statusId: status.Id,
			note: Notes
		}, res => {
			this.setState({
				showModal: false,
				Notes: '',
				Submit: false,
				Status: status
			})
			LongToast('dataSaved')
			// this.onChildChange()
		})
	}

	onSelectStatus = (status) => {
		this.Status = status
		this.setState({ showModal: true })
	}

	onPressTypeSelector = () => {
		const { orderId } = this
		this.changingOrderId = orderId
		this.grtStatusList(() => {
			this.statusSelectorRef.current.show()
		})
	}

	onChildChange = () => {
		this.props.route.params?.onChildChange && this.props.route.params?.onChildChange()
		this.fetchData()
	}

	renderHeader = () => {
		const { summary } = this.state

		return (
			<View
				style={{
					backgroundColor: 'white',
					borderRadius: largeBorderRadius,
					...shadowStyle0,
					paddingVertical: largePagePadding,
					marginHorizontal: largePagePadding,
					alignItems: 'center',
				}}>

				{summary ? <CustomWebView
					style={{ width: this.state.screenWidth - (largePagePadding * 4) }}
					source={summary}
				/> : null}
			</View>
		)
	}

	renderFooter = () => {
		if (!this.state.didFetchData) {
			return null
		}

		const { Total, Currency } = this.state.pricing

		if (this.state.isPriceCollapsed) {
			const { SubTotal, Tax, Shipping, Disocunt: Discount, ProccessingFees } = this.state.pricing

			return (
				<CustomTouchable
					onPress={() => {
						this.setState({ isPriceCollapsed: false })
					}}
					style={{
						backgroundColor: 'white',
						...shadowStyle3,
					}}>
					<OrderPriceRow
						title="SubTotal"
						price={SubTotal}
						currency={(Currency ? Currency.Name : "")}
						bold={false} />

					<OrderPriceRow
						title="Tax"
						price={Tax}
						currency={(Currency ? Currency.Name : "")}
						bold={false} />

					<OrderPriceRow
						title="Shipping"
						price={Shipping}
						currency={(Currency ? Currency.Name : "")}
						bold={false} />

					<OrderPriceRow
						title="Discount"
						price={Discount}
						currency={(Currency ? Currency.Name : "")}
						bold={false} />

					<OrderPriceRow
						title="ProccessingFees"
						price={ProccessingFees != null ? ProccessingFees : 0}
						currency={(Currency ? Currency.Name : "")}
						bold={true} />

					<OrderPriceRow
						title="Total"
						price={Total}
						currency={(Currency ? Currency.Name : "")}
						bold={true} />

				</CustomTouchable>
			)
		}

		else {
			return (
				<View
					style={{
						backgroundColor: 'white',
						...shadowStyle3,
						flexDirection: 'row',
						justifyContent: 'space-between',
					}}>
					<OrderPriceRow
						title="Total"
						price={Total}
						currency={(Currency ? Currency.Name : "")}
						bold={true} />

					<View
						style={{
							flexDirection: 'row',
							alignItems: 'center',
							paddingHorizontal: 10,
						}}>
						<CustomTouchable
							onPress={() => {
								this.setState({ priceEditorShown: true })
							}}
							style={{
								paddingVertical: 2,
								paddingHorizontal: 10,
							}}>
							<Feather
								name={"edit-3"}
								size={21}
								color={'#888888'} />
						</CustomTouchable>

						<CustomTouchable
							onPress={() => {
								this.setState({ isPriceCollapsed: true })
							}}
							style={{
								paddingVertical: 2,
								paddingHorizontal: 10,
								marginLeft: 5,
							}}>
							<Ionicons name='ios-arrow-up' color='#888888' size={24} />
						</CustomTouchable>
					</View>
				</View>
			)
		}
	}

	submit = () => {

		if (this.state.lockSubmit) {
			return
		}

		const { SubTotal, Tax, Shipping, Disocunt, ProccessingFees } = this.state.pricing


		if ((SubTotal < 0) || (Tax < 0) || (Shipping < 0) || (Disocunt < 0)) {
			LongToast('CantHaveEmptyInputs')
			return
		}

		if ((!SubTotal && SubTotal !== 0) || (!Tax && Tax !== 0) || (!Shipping && Shipping !== 0) || (!Disocunt && Disocunt !== 0)) {
			LongToast('CantHaveEmptyInputs')
			return
		}


		this.lockSubmit = true
		this.setState({ lockSubmit: true })

		this.cancelFetchDataChangeOrderPricing = ChangeOrderPricing({
			Id: this.orderId,
			SubTotal,
			Shipping,
			Tax,
			Disocunt,
			ProcessingFees: ProccessingFees
		}, res => {

			this.lockSubmit = false
			this.setState({ priceEditorShown: false, lockSubmit: false })
			this.fetchData()

		}, err => {

			this.lockSubmit = false
			this.setState({ priceEditorShown: false, lockSubmit: false })

		})

	}

	closeModal = () => {
		this.setState({ priceEditorShown: false })
	}

	renderPriceEditor2Items = () => {
		const { SubTotal, Tax, Shipping, Disocunt, ProccessingFees } = this.state.pricing
		return (
			<View
				style={[{
					padding: 20,
					backgroundColor: 'white',
					justifyContent: 'center',
					// alignItems: 'center',
					borderRadius: 20

				}]}>
				<View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20 }} >

					<HeaderSubmitButton
						style={{ flex: 0 }}
						color='black'
						onPress={() => { this.submit() }}
						isLoading={this.state.lockSubmit}
					/>

					<CustomTouchable
						onPress={() => { this.setState({ priceEditorShown: false }) }}
						style={{
							paddingLeft: 5,
							paddingBottom: 5,
						}}>
						<Ionicons name='ios-close' color='#444444' size={26} />
					</CustomTouchable>

				</View>

				<HorizontalInput
					label="Discount"
					keyboardType="numeric"
					// value={Disocunt ? Disocunt : null}
					value={String(Disocunt)}
					onChangeText={(text) => {
						this.setState({
							pricing: {
								...this.state.pricing,
								Disocunt: text,
							},
						})
					}} />

				<HorizontalInput
					label="Shipping"
					keyboardType="numeric"
					// value={Shipping ? Shipping : null}
					value={String(Shipping)}
					onChangeText={(text) => {
						this.setState({
							pricing: {
								...this.state.pricing,
								Shipping: text,
							},
						})
					}} />

				<HorizontalInput
					label="Tax"
					keyboardType="numeric"
					value={String(Tax)}
					onChangeText={(text) => {
						this.setState({
							pricing: {
								...this.state.pricing,
								Tax: text,
							},
						})
					}} />

				<HorizontalInput
					label="SubTotal"
					keyboardType="numeric"
					value={String(SubTotal)}
					onChangeText={(text) => {
						this.setState({
							pricing: {
								...this.state.pricing,
								SubTotal: text,
							},
						})
					}} />

				<HorizontalInput
					label="ProccessingFees"
					keyboardType="numeric"
					value={ProccessingFees != null ? String(ProccessingFees) : null}
					onChangeText={(text) => {
						this.setState({
							pricing: {
								...this.state.pricing,
								ProccessingFees: text,
							},
						})
					}} />

			</View>
		)
	}

	renderPriceEditor2 = () => {

		if (!this.state.didFetchData) {
			return null
		}

		return (
			<Modal
				isVisible={this.state.priceEditorShown}
				hideModalContentWhileAnimating={true}
				swipeDirection={'down'}
				onSwipeComplete={() => this.closeModal()}
				onBackdropPress={() => this.closeModal()}
				onRequestClose={() => this.closeModal()}
				style={[{
					flex: 1,
					justifyContent: 'flex-end',
					padding: 0,
					margin: 0,
				}]}
			>

				{
					Platform.OS == 'ios' ?
						<KeyboardAwareScrollView
							extraHeight={40}
							extraScrollHeight={40}
							innerRef={ref => {
								this.scroll = ref
							}}>
							{this.renderPriceEditor2Items()}
						</KeyboardAwareScrollView> :
						this.renderPriceEditor2Items()
				}


			</Modal>)
	}
	//ProccessingFees
	onAcceptItem = (Id) => {

		const {
			isDriver
		} = this.props

		if (isDriver) {
			AcceptOrderDriver(Id, res => {
				this.onChildChange()
				LongToast('dataSaved')
			})
		} else {
			AcceptOrder(Id, res => {
				this.onChildChange()
				LongToast('dataSaved')
			})
		}

	}

	onDeclineItem = (Id) => {

		const {
			isDriver
		} = this.props

		if (isDriver) {
			DeclineOrderDriver(Id, res => {
				this.onChildChange()
				LongToast('dataSaved')
			})
		} else {
			DeclineOrder(Id, res => {
				this.onChildChange()
				LongToast('dataSaved')
			})
		}

	}

	//accept and reject buttons
	renderPebddingOrders = () => {

		const {
			Status,
			DriverAcceptanceStatus,
		} = this.state
		const { orderId, } = this
		const {
			isDriver
		} = this.props

		// hide button:
		// 1- not driver & order status not pending
		// 2- driver & drvier acceptance status has value (1 or 2)
		if ((!isDriver && Status.Id != 1) /* pending status */ || !this.state.didFetchData || (isDriver && DriverAcceptanceStatus != null/*driver status was set before */)) {
			return null
		}
		return (
			<View>
				<TranslatedText text='AcceptOrDeclineOrderNow' style={{ alignSelf: 'center', fontSize: 16, marginVertical: 10, color: 'black' }} />

				<View style={{ justifyContent: 'space-between', flexDirection: 'row', marginHorizontal: largePagePadding, marginBottom: 5 }} >
					<CustomTouchable
						onPress={() => { this.onAcceptItem(orderId) }}
						style={{
							// flexDirection: 'row',
							width: this.state.screenWidth / 2.5,
							justifyContent: 'center',
							alignItems: 'center',
							paddingHorizontal: 10,
							paddingVertical: 6,
							backgroundColor: '#009688',
							borderRadius: largeBorderRadius,
							marginTop: 15,
						}}>
						<TranslatedText style={{ color: 'white', fontSize: 12, }} text='Accept' />
					</CustomTouchable>

					<CustomTouchable
						onPress={() => { this.onDeclineItem(orderId) }}
						style={{
							width: this.state.screenWidth / 2.5,
							// flexDirection: 'row',
							justifyContent: 'center',
							alignItems: 'center',
							paddingHorizontal: 10,
							paddingVertical: 6,
							backgroundColor: '#F44336',
							borderRadius: largeBorderRadius,
							marginTop: 15,
						}}>
						<TranslatedText style={{ color: 'white', fontSize: 12, }} text='Decline' />
					</CustomTouchable>
				</View>
			</View>

		)
	}

	renderOrderItemList = () => {
		const { didFetchData, Items } = this.state
		if (didFetchData) {
			return (
				<FlatList
					data={Items.Data}
					keyExtractor={({ OrderLineId }) => String(OrderLineId)}
					renderItem={this.renderOrderItems}
				/>
			)
		}
	}

	renderProdoctOptioins = () => {
		const { OrderOptions, Options } = this.state
		return (
			<FlatList
				contentContainerStyle={{
					backgroundColor: 'white',
					padding: pagePadding
				}}
				numColumns={3}
				columnWrapperStyle={{
					flexWrap: 'wrap'
				}}
				data={Options}
				keyExtractor={({ Id }) => String(Id)}
				renderItem={({ item, index }) => {
					return (
						<ProductOptionLabel item={item} key={index} />
					)
				}}
			/>
		)
	}
	renderOption = ({ item, index }) => {

		return <ProductOptionLabel item={item} key={index} />
	}


	onPressImage = (ImageUrl) => {
		this.setState({
			showImageModal: true,
			selectedImage: ImageUrl ? ImageUrl : null
		})
	}

	renderImageModal() {
		const { selectedImage } = this.state
		return (
			<Modal
				isVisible={this.state.showImageModal}
				onBackdropPress={() => {
					this.setState({ showImageModal: false })
				}}
				onSwipeComplete={() => {
					this.setState({ showImageModal: false })
				}}
			>
				<View style={{
					margin: 0,
					padding: 0,
					borderRadius: 0,
					alignItems: "center",
					justifyContent: 'center'
				}}>
					<RemoteImage
						uri={selectedImage}
						style={{
							width: this.state.screenWidth - 50,
							height: this.state.screenWidth - 50,
							borderRadius: 0,
						}}
						dimension={720}
						wide={true}
					/>
					<CustomTouchable
						onPress={() => this.setState({ showImageModal: false })}
						style={{
							position: "absolute",
							zIndex: 1,
							top: 10,
							right: 20,
						}}>
						<Ionicons name='ios-close' color='#444444' size={26} />
					</CustomTouchable>
				</View>
			</Modal>
		)
	}


	renderOrderItems = ({ item, index }) => { // Oreder Items And Options
		const {
			OrderLineId,
			Product: {
				Name,
				Icon: {
					ImageUrl,
				},
				Currency
			},
			Qty,
			UnitPrice,
			ExtraDetails1,
			ExtraDetails2,
			ExtraDetails3,
			Options,
			options,
			Note,
			SKU,
		} = item
		return (
			<View>
				<View
					style={{
						backgroundColor: 'white',
						flexDirection: 'row',
						justifyContent: 'space-between',
						paddingHorizontal: largePagePadding,
						paddingVertical: pagePadding,
					}}>
					<View
						style={{
							flex: 1,
							flexDirection: 'row',
						}}>
						<CustomTouchable onPress={() => { this.onPressImage(ImageUrl) }} >
							<CircularImage
								uri={ImageUrl} id={index} />
						</CustomTouchable>
						<View
							style={{
								flex: 1,
								paddingLeft: largePagePadding,
							}}>
							<FontedText style={{ color: 'black', textAlign: 'left', fontWeight: 'bold', fontSize: 15 }}>{Name}</FontedText>
							{SKU && SKU != '' && SKU != null ? < FontedText style={{ color: 'black', textAlign: 'left', fontWeight: 'bold', fontSize: 15 }}>{`sku: ${SKU}`}</FontedText> : null}
							<FontedText style={{ color: secondTextColor, textAlign: 'left', marginTop: 5, }}>{UnitPrice} {(Currency ? Currency.Name : "")}</FontedText>
							{Note !== null && Note !== '' ?
								<View style={{ flexDirection: 'row', marginTop: 5, alignContent: 'center' }} >
									<FontedText style={{ color: secondTextColor, textAlign: 'left', }}>{this.props.translate('OrderNote')}</FontedText>
									<FontedText style={{ color: secondTextColor, textAlign: 'left', }}>{Note}</FontedText>
								</View>
								: null}
							{ExtraDetails1 && ExtraDetails1 !== '' ? <FontedText style={{ color: secondTextColor, textAlign: 'left', marginTop: 5, }}>{ExtraDetails1}</FontedText> : null}
							{ExtraDetails2 && ExtraDetails2 !== '' ? <FontedText style={{ color: secondTextColor, textAlign: 'left', marginTop: 5, }}>{ExtraDetails2}</FontedText> : null}
							{ExtraDetails3 && ExtraDetails3 !== '' ? <FontedText style={{ color: secondTextColor, textAlign: 'left', marginTop: 5, }}>{ExtraDetails3}</FontedText> : null}
							<FlatList
								data={options}
								renderItem={this.renderOption}
								contentContainerStyle={{
									backgroundColor: 'white',
									padding: pagePadding
								}}
								numColumns={3}
								columnWrapperStyle={{
									flexWrap: 'wrap'
								}}
								keyExtractor={({ Id }) => String(Id)}
							/>
						</View>
					</View>

					<View
						style={{
							justifyContent: 'center',
							alignItems: 'flex-end',
							paddingLeft: 30,
						}}>
						<View
							style={{
								justifyContent: 'center',
								alignItems: 'center',
								width: 38,
								height: 38,
								borderRadius: 19,
							}}>
							<FontedText style={{ color: mainColor, fontSize: 20, fontWeight: 'bold', textAlign: 'right' }}>{Qty}</FontedText>
						</View>
					</View>
				</View>
			</View >
		)
	}

	renderAddReminder = () => {

		return (
			<View
				style={{
					backgroundColor: 'white',
					borderRadius: largePagePadding,
					...shadowStyle0,
					justifyContent: 'center',
					padding: 5,
					marginVertical: 2
				}}>

				<CustomTouchable
					onPress={this.onAddPress}
					style={{
						flexDirection: 'row',
					}}>

					<Ionicons
						name={`ios-add`}
						size={20} />
					<TranslatedText text='Reminder' style={{ marginHorizontal: 5 }} />

				</CustomTouchable>
			</View>

		)
	}

	onAddPress = () => {
		this.props.navigation.navigate('Reminder', {
			orderId: this.orderId,
			onChildChange: this.onChildChange
		})
	}

	renderReminderList = () => {
		const { Reminders } = this.state
		if (Reminders && Reminders.length) {
			return (
				<ReminderList
					fetchData={this.fetchData}
					Reminders={Reminders}
					navigation={this.props.navigation}
					Id={this.orderId} />
			)
		} else {
			return null
		}
	}

	renderCustomerOperations = () => {

		const {
			didFetchData
		} = this.state


		if (!didFetchData) {
			return null
		}

		const {
			Currency
		} = this.state.pricing

		const {
			Status
		} = this.state

		const {
			OrdersCount,
			TotalSpent,
		} = this.state.Customer

		return (
			<View
				style={{ backgroundColor: 'white' }}
			>
				{this.renderModal()}
				<View
					style={{
						backgroundColor: 'white',
						justifyContent: 'space-between',
						paddingHorizontal: largePagePadding,
						paddingVertical: pagePadding,
						flexDirection: 'row'
					}}
				>
					<View style={{
						flexDirection: 'row'
					}} >
						<TranslatedText
							text='CustomerOrderCount'
							style={{ color: mainColor, fontWeight: 'bold' }}
						/>
						<FontedText style={{ color: mainColor }}>{` ${OrdersCount}`}</FontedText>
					</View>

					<View style={{
						flexDirection: 'row',
					}} >
						<TranslatedText
							text='CustomerTotalSpent'
							style={{ color: mainColor, fontWeight: 'bold' }}
						/>
						<FontedText style={{ color: mainColor }}>{` ${TotalSpent} ${(Currency ? Currency.Name : "")}`}</FontedText>

					</View>

				</View>

				{!this.props.isDriver ? <CustomTouchable
					onPress={() => {
						this.onPressTypeSelector()
					}}
					style={{
						flexDirection: 'row',
						justifyContent: 'center',
						alignItems: 'center',
						alignSelf: 'center',
						paddingHorizontal: 10,
						paddingVertical: 4,
						backgroundColor: mainColor,
						borderRadius: largeBorderRadius,
						marginBottom: 5,
						maxWidth: 250
					}}>
					<FontedText style={{ color: 'white', fontSize: 10, textAlign: 'left', paddingLeft: 5 }}>{Status.Name}</FontedText>

					<Ionicons
						name={"md-arrow-dropdown"}
						size={18}
						color={'white'}
						style={{
							marginLeft: 5,
						}} />
				</CustomTouchable> : null}
			</View>

		)

	}

	render() {

		const {
			StatusList, ActivePhone
		} = this.state

		return (
			<LazyContainer style={{ flex: 1, }}>
				<CustomHeader
					rightNumOfItems={2}
					navigation={this.props.navigation}
					title={"Order"}
					rightComponent={
						<View style={{ flexDirection: 'row', justifyContent: 'space-between' }} >

							<CustomTouchable
								onPress={() => {
									this.props.navigation.navigate('OrderNote', {
										Id: this.orderId,
										onChildChange: this.onChildChange,
									})
								}}
								style={{
									flexDirection: 'row',
									justifyContent: 'center',
									alignItems: 'center',
									// padding: headerButtonPadding,
									flex: 1,
								}}>
								<Ionicons
									name={`ios-paper`}
									size={24}
									color={'white'} />
							</CustomTouchable>

							<CustomTouchable
								onPress={() => {
									this.props.navigation.navigate('OrderDetails', {
										Id: this.orderId,
										onChildChange: this.onChildChange,
									})
								}}
								style={{
									flexDirection: 'row',
									justifyContent: 'center',
									alignItems: 'center',
									// padding: headerButtonPadding,
									flex: 1,
								}}>
								<Ionicons
									name={`ios-information-circle`}
									size={24}
									color={'white'} />
							</CustomTouchable>
						</View>
					} />

				{this.renderPebddingOrders()}

				<ScrollView>

					<View>
						<SettingsTitle title={"Reminder"} />
						<View style={{ flexDirection: 'row', marginHorizontal: largePagePadding, alignItems: 'center' }} >
							{this.renderAddReminder()}

							{this.renderReminderList()}

						</View>
					</View>

					{this.props.OrderSummaryStyle.Value != 1 ?
						<View>
							<SettingsTitle title={"Summary"} />
							{this.renderHeader()}
						</View> : null}

					{this.state.Items ?
						<View>
							<SettingsTitle title={"Items"} />
							{this.renderOrderItemList()}
						</View> : null
					}

					{this.state.OrderOptions && this.state.OrderOptions.length ?
						<View>
							<SettingsTitle title={"Options"} />
							{this.renderProdoctOptioins()}
						</View> : null}

					<View>
						<SettingsTitle title={"Customeroperations"} />
						{this.renderCustomerOperations()}
					</View>

					<SettingsTitle title={"More"} />
					<ArrowItem
						onPress={() => {
							this.props.navigation.navigate('OrderHistory', {
								Id: this.orderId,
								onChildChange: this.onChildChange,
							})
						}}
						title="TrackingHistory" />

					<SettingsSeparator />

					<ArrowItem
						onPress={() => {
							this.getOrderOrderSammertyDetails(() => {
								this.props.navigation.navigate('OrderLocation', {
									Lat: this.state.Lat ? this.state.Lat : null,
									Lng: this.state.Lng ? this.state.Lng : null,
									Id: this.orderId,
									onChildChange: this.onChildChange
								})
							})
						}}
						title="UpdateOrderLocation" />

					<SettingsSeparator />

					<CustomTouchable style={{
						paddingVertical: 15,
						paddingHorizontal: largePagePadding,
						flexDirection: 'row',
						justifyContent: 'space-between',
						alignItems: 'center',
						backgroundColor: 'white'
					}}
						onPress={() => {

							if (this.state.Customer) {

								this.props.navigation.navigate('OrderChat', {
									orderId: this.orderId,
									onChildChange: this.onChildChange,
									CustomerId: this.state.Customer.Id,
									fromCustomer: false
								})
							}
						}}
					>
						<View style={{
							justifyContent: 'center',
						}}>
							<TranslatedText style={{
								color: secondTextColor
							}} text={"Chat"} />
						</View>
						<View style={{
							flexDirection: 'row',
							alignItems: 'center',
							paddingLeft: 10,
						}}>
							{ActivePhone != null && ActivePhone != '' ?
								<CustomTouchable onPress={() => PhoneCall(ActivePhone)}>
									<AntDesign
										style={{
											marginHorizontal: 10,
										}}
										name={'phone'}
										size={20}
										color={mainTextColor}
									/>
								</CustomTouchable> : null}


							{ActivePhone != null && ActivePhone != '' ?
								<CustomTouchable onPress={() => Whatsapp(ActivePhone)}>
									<FontAwesome
										style={{
											marginHorizontal: 10,
										}}
										name={'whatsapp'}
										size={20}
										color={mainTextColor}
									/>
								</CustomTouchable> : null}

							<Ionicons
								style={{
									marginLeft: 10,
								}}
								name={I18nManager.isRTL ? 'ios-arrow-back' : 'ios-arrow-forward'}
								size={20}
								color={mainTextColor}
							/>
						</View>
					</CustomTouchable>

					<SettingsSeparator />

					<ArrowItem
						onPress={() => {
							this.props.navigation.navigate('OrderItems', {
								Id: this.orderId,
								onChildChange: this.onChildChange,
							})
						}}
						title="Items" />
					<SettingsSeparator />
					{this.isCustomersPermitted ? <ArrowItem
						onPress={() => {
							this.props.navigation.navigate('Customer', { Id: this.state.Customer.Id })
						}}
						title="Customer" /> : null}

				</ScrollView>

				{this.renderFooter()}



				{this.renderPriceEditor2()}

				{StatusList ? <CustomSelector
					ref={this.statusSelectorRef}
					options={StatusList.map(item => item.Name)}
					onSelect={(index) => { this.onSelectStatus(StatusList[index]) }}
					onDismiss={() => { }}
				/> : null}

				{this.renderImageModal()}
			</LazyContainer>
		)
	}
}

const mapStateToProps = ({
	login: {
		isDriver
	},
	runtime_config: {
		runtime_config: {
			screens: {
				Admin_Page_0_0: {
					OrderSummaryStyle
				}
			}
		}
	},
}) => ({
	isDriver,
	OrderSummaryStyle,
})
export default connect(mapStateToProps)(withLocalize(Order))

const OrderPriceRow = ({ title, price, bold, currency }) => {
	const textStyle = bold ? {
		fontSize: 13,
		color: 'black',
	} : {
			fontSize: 11,
			// color: '#3B3B4D',
			color: mainTextColor,
		}

	return (
		<View
			style={{
				flexDirection: 'row',
				justifyContent: 'space-between',
				alignItems: 'center',
				paddingVertical: pagePadding,
				paddingHorizontal: largePagePadding,
			}}>
			<TranslatedText
				style={textStyle}
				text={title} />

			<FontedText style={[textStyle, { marginLeft: 5, }]}>{price} {currency}</FontedText>
		</View>
	)
}