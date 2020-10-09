// import { withNavigationFocus } from 'react-navigation'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React, { Component } from 'react';
import { withLocalize } from 'react-localize-redux';
import { Linking, View, Dimensions, BackHandler } from 'react-native';
import Modal from 'react-native-modal';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import ConfirmModal from '../../components/ConfirmModal';
import CustomAddModal from '../../components/CustomAddModal/index.js';
import CustomButton from '../../components/CustomButton/index.js';
import CustomDatePicker from '../../components/CustomDatePicker';
import CustomHeader, { secondHeaderIconSize } from '../../components/CustomHeader/index.js';
import CustomSelector from '../../components/CustomSelector/index.js';
import CustomTouchable from '../../components/CustomTouchable';
import FontedText from '../../components/FontedText/index.js';
import HorizontalInput from '../../components/HorizontalInput/index.js';
import ItemSeparator from '../../components/ItemSeparator/index.js';
import LazyContainer from '../../components/LazyContainer';
import RemoteImage from '../../components/RemoteImage/index.js';
import SearchBar from '../../components/SearchBar/index.js';
import TranslatedText from '../../components/TranslatedText/index.js';
import { mainColor, secondColor } from '../../constants/Colors';
import { screenWidth } from '../../constants/Metrics.js';
import { largeBorderRadius, largePagePadding, shadowStyle0 } from '../../constants/Style.js';
import { AcceptOrder, AcceptOrderDriver, AddDriverToOrder, DeclineOrder, DeclineOrderDriver, DeleteOrder } from '../../services/OrdersService';
import { ChangeOrderStatus, EditOrderDates, GetInvoice, GetOrderDates, GetOrderStatusList } from '../../services/OrdersService.js';
import { formatDate, formatTime } from '../../utils/Date';
import { getDriverBgColor, getDriverTextColor, isValidDriverSelection } from '../../utils/Drivers.js';
import { SelectEntity } from '../../utils/EntitySelector.js';
import { SaveFile } from '../../utils/File.js';
import { IsScreenPermitted } from '../../utils/Permissions.js';
import { ShareSomeThing } from '../../utils/Share.js';
import { LongToast } from '../../utils/Toast.js';
import { ExternalTranslate } from '../../utils/Translate';
import { isValidSearchKeyword } from '../../utils/Validation.js';
import CompletedOrders from './Completed.js';
import FullOrders from './Full.js';
import OrderItem from './OrderItem.js';
import PenndingOrders from './Pendding.js';
import ProcessingOrders from './Processing.js';

const Tabs = createMaterialTopTabNavigator()

// const fuFullOrders
const Tabs_stack = (props) => {
	const {
		routeName,
		DefaultTab,
		screenProps
	} = props

	return (
		<Tabs.Navigator
			initialRouteName={routeName}
			lazy={true}
			tabBarOptions={{
				labelStyle: {
					fontSize: 12,
					color: mainColor,
				}, indicatorStyle: {
					backgroundColor: secondColor,
				}, style: {
					backgroundColor: 'white',
				}
			}}
			backBehavior='none'
		>
			<Tabs.Screen name='Full' options={{ title: ExternalTranslate('All') }}>
				{() => {
					return (
						<FullOrders
							params={screenProps.params}
							renderItem={screenProps.renderItem}
							triggerRefresh={screenProps.triggerRefresh}
							isDriverMode={screenProps.isDriverMode}
							userId={screenProps.userId}
							refreshPennding={screenProps.refreshPennding}
						/>)
				}}
			</Tabs.Screen>
			<Tabs.Screen name='Pendding' options={{ title: ExternalTranslate('Pendding') }} >
				{() => {
					return (
						<PenndingOrders
							params={screenProps.params}
							renderItem={screenProps.renderItem}
							triggerRefresh={screenProps.triggerRefresh}
							isDriverMode={screenProps.isDriverMode}
							userId={screenProps.userId}
							refreshPennding={screenProps.refreshPennding}
						/>)
				}}
			</Tabs.Screen>
			<Tabs.Screen name='Processing' options={{ title: ExternalTranslate('Processing') }} >
				{() => {
					return (
						<ProcessingOrders
							params={screenProps.params}
							renderItem={screenProps.renderItem}
							triggerRefresh={screenProps.triggerRefresh}
							isDriverMode={screenProps.isDriverMode}
							userId={screenProps.userId}
							refreshPennding={screenProps.refreshPennding}
						/>)
				}}
			</Tabs.Screen>
			<Tabs.Screen name='Completed' options={{ title: ExternalTranslate('Completed') }} >
				{() => {
					return (
						<CompletedOrders
							params={screenProps.params}
							renderItem={screenProps.renderItem}
							triggerRefresh={screenProps.triggerRefresh}
							isDriverMode={screenProps.isDriverMode}
							userId={screenProps.userId}
							refreshPennding={screenProps.refreshPennding}
						/>)
				}}
			</Tabs.Screen>
		</Tabs.Navigator>
	)
}

class Orders extends Component {
	constructor(props) {
		super(props)

		const { translate } = this.props

		this.state = {
			showModal: false,
			data: null,
			triggerRefresh: false,
			searchBarShown: false,
			searchingFor: '',
			options: [
				translate('assignTODriver'),
				translate('DeliverMap'),
				translate('Items'),
				translate('DownloadInvoice'),
				translate('ShareInvoice'),
				translate('UpdateDate'),
				translate('Delete'),
			],
			Notes: '',
			showUpdateDateModal: false,
			isDateTimePickerVisibleFrom: false,
			isDateTimePickerVisibleTo: false,
			CreateDate: null,
			DeliveryDate: null,
			refreshPennding: false,
			showImageModal: false,
			selectedImage: null,

			screenWidth: Dimensions.get('screen').width,
			screenHeight: Dimensions.get('screen').height,
		}

		this.statusSelectorRef = React.createRef()
		this.assignToDriverSelectorRef = React.createRef()
		this.ConfirmRef = React.createRef()

		if (this.props.route.params && this.props.route.params?.Id) {
			this.customerId = this.props.route.params?.Id
		}
		else {
			this.customerId = null
		}

		if (this.props.route.params && this.props.route.params.product) {
			this.Product = this.props.route.params.product
		}
		const DefaultTab = props.Value

	}

	handelInitialRouteName = (DefaultTab) => {

		let routName;
		switch (DefaultTab) {
			case "pending":
				routName = 'Pendding'
				break;
			case "processing":
				routName = 'Processing'
				break
			case "completed":
				routName = 'Completed'
				break
			case "Full":
				routName = 'Full'
				break
			default:
				routName = 'Full'
				break;
		}
		return routName
	}

	componentWillUnmount() {
		this.cancelFetchData && this.cancelFetchData()
		this.cancelFetchDataChangeOrderStatus && this.cancelFetchDataChangeOrderStatus()
		this.backHandler.remove();
	}

	componentDidUpdate(prevProps) {
		if (this.props.isFocused == false) {
			clearInterval(global.penddingIntervalId)
			global.penddingIntervalId = null
		}
		if ((prevProps.isFocused !== this.props.isFocused) && this.props.isFocused == true) {
			this.setState({ refreshPennding: !this.state.refreshPennding })
		}
	}

	componentDidMount() {

		if (this.props.route.params && this.props.route.params?.Id) {
			this.onChildChange()
		}

		const HavePermission = this.props.permissions.includes(1) || this.props.permissions.includes(29)

		if (!HavePermission) {
			this.setState({ options: this.state.options.filter(item => item != this.props.translate('Delete')) })
		}

		//re render when change orientation
		Dimensions.addEventListener('change', () => {
			this.setState({
				screenWidth: Dimensions.get('screen').width,
				screenHeight: Dimensions.get('screen').height,
			})
		})

		this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
			this.props.route.params?.onChildChange && this.props.route.params?.onChildChange()
			this.props.navigation.goBack()
			return true
		});
	}

	onPressItem = (item) => {
		const { Id, CustomerId } = item

		if (this.props.route.params && this.props.route.params?.forceNavigateToOrderChat == true) {

			this.props.navigation.navigate('OrderChat', {
				orderId: Id,
				CustomerId: CustomerId,
				fromCustomer: false
			})

		} else {
			this.props.navigation.navigate('Order', {
				Id,
				onChildChange: this.onChildChange,
			})
		}
	}

	onLongPressItem = (item) => {
		const { Id, Lat, Lng, FullAddress } = item
		// this.lat = 31.205753
		this.lat = Lat
		this.Lng = Lng
		// this.Lng = 29.924526
		this.FullAddress = FullAddress
		this.AssignOrderId = Id
		this.assignToDriverSelectorRef.current.show()
	}

	onPressTypeSelector = (item, index) => {
		this.cancelFetchData = GetOrderStatusList(res => {
			this.setState({ StatusList: res.data.Data }, () => {
				const { Id } = item
				this.changingOrderId = Id
				this.AssignOrderId = Id
				this.changingOrderIndex = index
				this.statusSelectorRef.current.show()
			})
		})
	}

	onAcceptItem = (Item) => {
		const { Id } = Item

		AcceptOrder(Id, res => {
			this.onChildChange()
			LongToast('dataSaved')
		})
	}

	onDeclineItem = (Item) => {
		const { Id } = Item

		DeclineOrder(Id, res => {
			this.onChildChange()
			LongToast('dataSaved')
		})
	}

	renderItem = ({ item, index }) => {

		return (
			<OrderItem
				isDriverMode={this.props.isDriverMode}
				item={item}
				index={index}
				onLongPress={this.onLongPressItem}
				onPress={this.onPressItem}
				onPressTypeSelector={this.onPressTypeSelector}
				onAccept={() => { this.onAcceptItem(item) }}
				onDecline={() => { this.onDeclineItem(item) }}
				onAcceptDriver={() => { this.onAcceptDriverItem(item) }}
				onDeclineDriver={() => { this.onDeclineDriverItem(item) }}
				onPressImage={() => { this.onPressImage(item) }}
				screenWidth={this.state.screenWidth}
				screenHeight={this.state.screenHeight}
			/>
		)
	}

	onAcceptDriverItem = (item) => {
		const { Id } = item

		AcceptOrderDriver(Id, res => {
			this.onChildChange()
			LongToast('dataSaved')
		})
	}

	onDeclineDriverItem = (item) => {
		const { Id } = item
		DeclineOrderDriver(Id, res => {
			this.onChildChange()
			LongToast('dataSaved')
		})
	}

	onDownloadInvoice = () => {
		GetInvoice(this.AssignOrderId, res => {
			SaveFile(res.data, (f) => {

			}, err => {
				LongToast('SomeThingWrongCheckThePERMISSIONS')
			},
				() => {

				}, 'Invoice')
		})
	}

	onShareInvoice = () => {
		LongToast('PleaseWait')
		GetInvoice(this.AssignOrderId, res => {
			ShareSomeThing(res.data)
		})
	}

	onChildChange = () => {
		this.setState({ triggerRefresh: !this.state.triggerRefresh })
	}

	onFiltersResponse = (filters) => {
		this.setState({
			...filters
		})
	}

	addParamsSeparator = (params) => {
		return params.length ? '&' : ''
	}

	getRequestParams = () => {
		const {
			Courier,
			Customer,
			Countries,
			Cities,
			Areas,
			Status,
			MinPrice,
			MaxPrice,
			searchingFor,
			From,
			To,
			SubStore,
			Driver,
			Source
		} = this.state

		let params = ''

		if (isValidSearchKeyword(searchingFor)) {
			params += `search=${searchingFor}`
		}

		if (this.props.isDriverMode == true) {
			params += `${this.addParamsSeparator(params)}driverId=${this.props.user_data.Id}`
		}

		if (Courier) {
			params += `${this.addParamsSeparator(params)}courierId=${Courier.Id}`
		}

		if (Customer) {
			params += `${this.addParamsSeparator(params)}customerId=${Customer.Id}`
		}

		if (this.customerId) {
			params += `${this.addParamsSeparator(params)}customerId=${this.customerId}`
		}

		if (Countries && Countries.length) {
			params += `${this.addParamsSeparator(params)}countryId=${Countries.map(item => item.Id)}`
		}

		if (Cities && Cities.length) {
			params += `${this.addParamsSeparator(params)}cityId=${Cities.map(item => item.Id)}`
		}

		if (Areas && Areas.length) {
			params += `${this.addParamsSeparator(params)}areaId=${Areas.map(item => item.Id)}`
		}

		if (Status) {
			params += `${this.addParamsSeparator(params)}statusId=${Status.Id}`
		}

		if (MinPrice) {
			params += `${this.addParamsSeparator(params)}minPrice=${MinPrice}`
		}

		if (MaxPrice) {
			params += `${this.addParamsSeparator(params)}maxPrice=${MaxPrice}`
		}

		if (From && To) {
			params += `${this.addParamsSeparator(params)}createDateFrom=${From}&createDateTo=${To}`
		}

		if (From && !To) {
			params += `${this.addParamsSeparator(params)}createDateFrom=${From}`
		}

		if (this.Product) {
			params += `${this.addParamsSeparator(params)}productId=${this.Product.Id}`
		}
		if (SubStore) {
			params += `${this.addParamsSeparator(params)}subStoreId=${SubStore.Id}`
		}
		if (Driver) {
			params += `${this.addParamsSeparator(params)}driverId=${Driver.Id}`
		}
		if (Source) {
			params += `${this.addParamsSeparator(params)}source=${Source.Id}`
		}
		return params
	}

	renderSearch = () => {
		return (
			<SearchBar
				visible={this.state.searchBarShown}
				onPressClose={() => { this.setState({ searchBarShown: !this.state.searchBarShown }) }}
				autoFocus={false}
				onSubmitEditing={(text) => {
					this.setState({ searchingFor: text })
				}} />
		)
	}

	onSubmitStatus = () => {

		const order_id = this.AssignOrderId
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
				Submit: false
			})
			LongToast('dataSaved')
			this.onChildChange()
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

	onSelectStatus = (status) => {
		this.Status = status
		this.setState({ showModal: true })
	}

	onSelectDriver = (Driver) => {
		const { Id } = Driver

		AddDriverToOrder(this.AssignOrderId, Id, res => {
			LongToast('dataSaved')
		})
	}

	onSelectGenral = (index) => {
		if (index == 0) {
			SelectEntity(this.props.navigation, Driver => {
				this.onSelectDriver(Driver)
			}, 'User/Drivers', null, false, 1, [], {
				itemTextColorModifier: (item) => getDriverTextColor(item.Status.Id),
				itemBgColorModifier: (item) => getDriverBgColor(item.Status.Id),
				onSelectItem: isValidDriverSelection,
			})
		} else if (index == 1) {
			if (this.lat && this.Lng) {
				Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${this.lat},${this.Lng}`);
			} else {
				Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${this.FullAddress}`);
			}

		} else if (index == 2) {
			this.props.navigation.navigate('OrderItems', {
				Id: this.AssignOrderId,
				onChildChange: this.onChildChange,
			})
		} else if (index == 3) {
			this.onDownloadInvoice()
		} else if (index == 4) {
			this.onShareInvoice()
		}
		else if (index == 5) {
			this.cancelFetchData = GetOrderDates(this.AssignOrderId, res => {
				this.setState({
					CreateDate: res.data.CreateDate,
					DeliveryDate: res.data.DeliveryDate,
					showUpdateDateModal: true
				})
			})

		}
		else {
			this.ConfirmRef.current.show()
		}
	}

	renderUpdateDateModal = () => {
		return (
			<CustomAddModal
				onBackdropPress={() => {
					this.setState({ showUpdateDateModal: false, DeliveryDate: '', selectedDay: null })
				}}
				isVisible={this.state.showUpdateDateModal}
				RoundedCloseButtonPress={() => {
					this.setState({ showUpdateDateModal: false })
				}}
				Edit={true}
				loading={this.state.Submit}
				onSubmit={() => {
					const { CreateDate, DeliveryDate } = this.state
					const OrderId = this.AssignOrderId

					this.setState({
						isDateTimePickerVisibleFrom: false,
						isDateTimePickerVisibleTo: false,
						Submit: true,
					})
					this.cancelFetchDataEditOrderDates = EditOrderDates({
						OrderId,
						CreateDate,
						DeliveryDate,
					}, res => {
						this.setState({
							showUpdateDateModal: false,
							Submit: false
						})
						LongToast('dataSaved')
					}, () => {
						this.setState({
							Submit: false,
							showUpdateDateModal: false,
						})
					})
				}}
			>

				{this.renderModalItems()}

			</CustomAddModal>
		)
	}

	renderModalItems = () => {
		const { } = this.state;
		return (
			<View style={{ marginHorizontal: largePagePadding, width: (this.state.screenWidth - 80), alignSelf: 'center', alignItems: 'center', justifyContent: 'center', paddingBottom: 10, }} >
				{this.renderFromToDrobDown()}


				<CustomDatePicker
					isVisible={this.state.isDateTimePickerVisibleFrom}
					onDatePicked={(date) => {
						this.setState({ CreateDate: date, isDateTimePickerVisibleFrom: false })
					}}
					is24Hour={true}
					mode='datetime'
					onCancel={() => this.setState({ isDateTimePickerVisibleFrom: false })}
				/>

				<CustomDatePicker
					isVisible={this.state.isDateTimePickerVisibleTo}
					onDatePicked={(date) => {
						this.setState({ DeliveryDate: date, isDateTimePickerVisibleTo: false })

					}}
					is24Hour={true}
					mode='datetime'
					onCancel={() => this.setState({ isDateTimePickerVisibleTo: false, DeliveryDate: null })}
				/>

			</View>
		)
	}

	renderTimeInputs = (label, date) => {
		const { translate } = this.props
		return (
			<FontedText
				style={{
					fontSize: 11,
					color: 'white',
				}}>
				{date ? `${formatDate(date)} - ${formatTime(date)}` : translate(label)}
			</FontedText>
		)
	}

	renderFromToDrobDown = () => {
		const { CreateDate, DeliveryDate } = this.state;
		return (
			<View style={{ marginVertical: 10, width: '100%' }} >

				<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
					<TranslatedText text={'CreateDate'} color={'black'}></TranslatedText>
					<CustomTouchable
						onPress={() => {
							this.setState({ isDateTimePickerVisibleFrom: true })
						}}
						style={{
							flexDirection: 'row',
							justifyContent: 'space-between',
							alignItems: 'center',
							paddingHorizontal: 10,
							paddingVertical: 10,
							backgroundColor: mainColor,
							borderRadius: largeBorderRadius,
							marginVertical: 10,

						}}>
						{this.renderTimeInputs('CreateDate', CreateDate)}
						<Ionicons
							name={"md-arrow-dropdown"}
							size={18}
							color={'white'}
							style={{
								marginLeft: 5,
							}} />
					</CustomTouchable>
				</View>
				<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
					<TranslatedText text={'DeliveryDate'}></TranslatedText>

					<CustomTouchable
						onPress={() => {
							this.setState({ isDateTimePickerVisibleTo: true })
						}}
						style={{
							flexDirection: 'row',
							justifyContent: 'space-between',
							alignItems: 'center',
							paddingHorizontal: 10,
							paddingVertical: 10,
							backgroundColor: mainColor,
							borderRadius: largeBorderRadius,
							marginVertical: 10,
						}}>
						{this.renderTimeInputs('DeliveryDate', DeliveryDate)}

						<Ionicons
							name={DeliveryDate && DeliveryDate != null ? "ios-close" : "md-arrow-dropdown"}
							size={18}
							color={'white'}
							style={{
								marginLeft: 5,
							}} />
					</CustomTouchable>
				</View>
			</View>
		)
	}

	onPressImage = (item) => {
		const { ProductImage } = item
		this.setState({
			showImageModal: true,
			selectedImage: ProductImage && ProductImage.ImageUrl ? ProductImage.ImageUrl : null
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

	render() {
		const { StatusList, options } = this.state
		const canNavigateToPOS = IsScreenPermitted("POS")
		const { Value } = this.props
		return (
			<LazyContainer style={{ flex: 1, backgroundColor: "#FFF" }}>
				<CustomHeader
					navigation={this.props.navigation}
					leftComponent={
						this.customerId ? 'back' :
							this.props.route.params && this.props.route.params?.forceNavigateToOrderChat == true ?
								"back" :
								"drawer"
					}
					onBack={() => {
						this.props.route.params?.onChildChange && this.props.route.params.onChildChange()
					}}
					title="Orders"
					rightNumOfItems={canNavigateToPOS ? 3 : 2}
					rightComponent={
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'center',
							}}>
							<CustomTouchable
								onPress={() => {
									const {
										Courier,
										Customer,
										Countries,
										Cities,
										Areas,
										Status,
										MinPrice,
										MaxPrice,
										Source,
									} = this.state

									this.props.navigation.navigate('OrdersFilters', {
										onResponse: this.onFiltersResponse,
										currentFilters: {
											Courier,
											Customer,
											Countries,
											Cities,
											Areas,
											Status,
											MinPrice,
											MaxPrice,
											Source,
										}
									})
								}}
								style={{
									flexDirection: 'row',
									justifyContent: 'center',
									alignItems: 'center',
									flex: 1,
								}}>
								<FontAwesome
									name={`filter`}
									size={22}
									color={'white'} />
							</CustomTouchable>

							<CustomTouchable
								onPress={() => { this.setState({ searchBarShown: !this.state.searchBarShown }) }}
								style={{
									flexDirection: 'row',
									justifyContent: 'center',
									alignItems: 'center',
									flex: 1,
								}}>
								<Ionicons
									name={`ios-search`}
									size={24}
									color={'white'} />
							</CustomTouchable>

							{canNavigateToPOS && <CustomTouchable
								onPress={() => {
									this.props.navigation.navigate('POS')
								}}
								style={{
									flexDirection: 'row',
									justifyContent: 'center',
									alignItems: 'center',
									flex: 1,
								}}>
								<Ionicons
									name={`ios-add`}
									size={secondHeaderIconSize}
									color={'white'} />
							</CustomTouchable>}
						</View>
					} />

				{this.renderSearch()}

				{this.renderModal()}


				<Tabs_stack
					routeName={this.handelInitialRouteName(this.props.Value)}
					screenProps={{
						params: this.getRequestParams(),
						renderItem: this.renderItem,
						triggerRefresh: this.state.triggerRefresh,
						isDriverMode: this.props.isDriverMode == true ? true : false,
						userId: this.props.user_data.Id,
						refreshPennding: this.state.refreshPennding
					}}
				/>


				<ConfirmModal
					ref={this.ConfirmRef}
					onConfirm={() => {
						DeleteOrder(this.AssignOrderId, res => {
							LongToast('dataDeleted')
							this.onChildChange()
						})
					}}
				/>

				{StatusList && <CustomSelector
					ref={this.statusSelectorRef}
					options={StatusList.map(item => item.Name)}
					onSelect={(index) => { this.onSelectStatus(StatusList[index]) }}
					onDismiss={() => { }}
				/>}

				{<CustomSelector
					ref={this.assignToDriverSelectorRef}
					options={options.map(item => item)}
					onSelect={(index) => { this.onSelectGenral(index) }}
					onDismiss={() => { }}
				/>}

				{this.renderUpdateDateModal()}
				{/*{this.renderImageModal()} */}
			</LazyContainer>
		)
	}
}


const mapStateToProps = ({
	login: {
		user_data,
		hello_data
	},
	user: {
		permissions
	},

	runtime_config: {
		runtime_config: {
			screens: {
				Admin_Page_0_0: {
					DefaultOrdersTab:
					{
						Value,
					}
				}
			},
		},
	},
}) => ({
	permissions,
	user_data,
	hello_data,
	Value,
})

export default connect(mapStateToProps)(withLocalize(Orders))