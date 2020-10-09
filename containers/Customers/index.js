import React, { Component } from 'react'
import { View, ScrollView, BackHandler } from 'react-native'
import CustomHeader, { headerHeight, secondHeaderIconSize } from '../../components/CustomHeader/index.js';
import LazyContainer from '../../components/LazyContainer'
import RemoteDataContainer from '../../components/RemoteDataContainer/index.js';
import { largePagePadding, pagePadding, shadowStyle3, smallBorderRadius } from '../../constants/Style.js';
import ItemSeparator from '../../components/ItemSeparator/index.js';
import Ionicons from 'react-native-vector-icons/Ionicons'
import SearchBar from '../../components/SearchBar/index.js';
import { DeleteCustomer } from '../../services/CustomersService.js';
import Triangle from 'react-native-triangle';
import { SelectCountry, SelectCity } from '../../utils/Places.js';
import { withLocalize } from 'react-localize-redux';
import CustomButton from '../../components/CustomButton/index.js';
import { getFilters } from '../../services/FilterService.js';
import CustomSelector from '../../components/CustomSelector/index.js';
import ArrowItem from '../../components/ArrowItem/index.js';
import CustomSelectorForDeleteAndEdit from '../../components/CustomSelectorForDeleteAndEdit/index';
import AntDesign from 'react-native-vector-icons/AntDesign'
import CustomerItem from './CustomerItem.js';
import { LongToast } from '../../utils/Toast.js';
import ConfirmModal from '../../components/ConfirmModal/index.js';
import CustomTouchable from '../../components/CustomTouchable';
import { formatDate } from '../../utils/Date.js';
import CustomDatePicker from '../../components/CustomDatePicker';
import { isValidSearchKeyword } from '../../utils/Validation.js';
import { connect } from 'react-redux';
import { TrimText } from '../../utils/Text.js';
import CustomModal from '../../components/CustomModal/index.js';
import HorizontalInput from "../../components/HorizontalInput/index.js";

class Customers extends Component {
	constructor(props) {
		super(props)

		const { translate } = this.props

		this.state = {
			data: null,
			triggerRefresh: false,
			searchBarShown: false,
			searchingFor: '',
			isPopupVisible: false,
			isFromDatePickerVisible: false,
			isToDatePickerVisible: false,
			showCustomSelectorForDeleteref: false,
			Loading: false,
			From: null,
			To: null,
			SubStores: [],
			showSpentModal: false,
			customeOptions: [
				{
					Id: 0,
					Name: translate('Delete')
				},
				{
					Id: 1,
					Name: translate('Chat')
				}
			]
		}

		this.Orders = [{ Id: 0, Name: "All", Value: null }, { Id: 1, Name: "OrderedBefore", Value: 'orderedBefore' }, { Id: 2, Name: "NotOrderedBefore", Value: 'notOrderedBefore' }]
		this.Sources = [{ Id: 0, Name: "All", Value: null }, { Id: 1, Name: "POS", Value: "pos" }, { Id: 2, Name: "CustomerApp", Value: "customerApp" }]
		this.optionsRef = React.createRef()
		this.statusSelectorRef = React.createRef();
		this.typeSelectorRef = React.createRef();
		this.confirmRef = React.createRef();
		this.SubStoresRef = React.createRef();
		this.OrderRef = React.createRef();
		this.SourceRef = React.createRef();

	}

	componentDidMount() {
		this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
			this.props.route.params?.onChildChange && this.props.route.params?.onChildChange()
			this.props.navigation.goBack()
			return true
		});
	}

	componentWillUnmount() {
		this.cancelFetchData && this.cancelFetchData()
		this.cancelFetchDataDeleteCustomer && this.cancelFetchDataDeleteCustomer()
		this.backHandler.remove()
	}

	getCustomerTyoes = (callBack) => {
		this.cancelFetchData = getFilters({
			customerTypes: true,
		}, res => {
			const {
				CustomerTypes,
			} = res.data
			this.setState({ CustomerTypes }, callBack)
		})

	}

	getCustomerStatus = (callBack) => {

		this.cancelFetchData = getFilters({
			customerStatus: true
		}, res => {
			const {
				CustomerStatus
			} = res.data
			this.setState({
				CustomerStatus
			}, callBack)
		})

	}

	getSubStores = (callBack) => {

		this.cancelFetchData = getFilters({
			subStores: true,
		}, res => {
			const {
				SubStores
			} = res.data
			this.setState({
				SubStores
			}, callBack)
		})
	}

	onPressItem = (item) => {
		this.setState({ isPopupVisible: false })

		const { Id } = item
		if (this.props.route.params && this.props.route.params?.forceNavigateToCustomerChat == true) {

			this.props.navigation.navigate('OrderChat', {
				orderId: null,
				CustomerId: Id,
				fromCustomer: true,
				onChildChange: this.onChildChange
			})

		} else {
			this.props.navigation.navigate('Customer', {
				Id,
				onChildChange: this.onChildChange,
			})
		}
	}

	onLongPressItem = (item) => {
		const { Id } = item
		this.DeleteOrEditId = Id
		this.optionsRef.current.show()
		// this.setState({ showCustomSelectorForDeleteref: true })
	}

	renderItem = ({ item }) => {
		return (
			<CustomerItem
				item={item}
				onPress={this.onPressItem}
				onLongPress={this.onLongPressItem} />
		)
	}

	onChildChange = () => {
		this.setState({ triggerRefresh: !this.state.triggerRefresh })
	}

	addParamsSeparator = (params) => {
		return params.length ? '&' : ''
	}

	getRequestParams = () => {
		let params = ''

		const { searchingFor, Status, Type, Country, City, From, To, SubStore, Order, Source, Spent } = this.state

		if (isValidSearchKeyword(searchingFor)) {
			params += `${this.addParamsSeparator(params)}search=${searchingFor}`
		}

		if (Status) {
			params += `${this.addParamsSeparator(params)}statusId=${Status.Id}`
		}

		if (Type) {
			params += `${this.addParamsSeparator(params)}typeId=${Type.Id}`
		}

		if (Country) {
			params += `${this.addParamsSeparator(params)}countryId=${Country.Id}`
		}

		if (City) {
			params += `${this.addParamsSeparator(params)}cityId=${City.Id}`
		}

		if (From && !To) {
			params = `from=${From}`
		}

		if (From && To) {
			params = `from=${From}&to=${To}`
		}
		if (SubStore) {
			params = `subStoreId=${SubStore.Id}`
		}
		if (Order) {
			params += `${this.addParamsSeparator(params)}order=${Order.Value}`
		}
		if (Source) {
			params += `${this.addParamsSeparator(params)}source=${Source.Value}`
		}
		if (Spent) {
			params += `${this.addParamsSeparator(params)}spent=${Spent}`
		}
		if (this.props.route.params && this.props.route.params.subStoreId) {
			params += `${this.addParamsSeparator(params)}subStoreId=${this.props.route.params.subStoreId}`
		}
		return params
	}

	showFromDateTimePicker = () => {
		this.setState({ isFromDatePickerVisible: true });
	}

	hideFromDateTimePicker = () => {
		this.setState({ isFromDatePickerVisible: false });
	}

	showToDateTimePicker = () => {
		this.setState({ isToDatePickerVisible: true });
	}

	hideToDateTimePicker = () => {
		this.setState({ isToDatePickerVisible: false });
	}

	renderSearch = () => {
		return (
			<SearchBar
				visible={this.state.searchBarShown}
				onPressClose={() => { this.setState({ searchBarShown: !this.state.searchBarShown }) }}
				onSubmitEditing={(text) => {
					this.setState({ searchingFor: text })
				}} />
		)
	}

	hidePopup = () => {
		this.setState({ isPopupVisible: false })
	}

	renderSpentModal = () => {
		const {
			showSpentModal,
			Spent,
			_Spent
		} = this.state

		return (
			<CustomModal
				isVisible={showSpentModal}
				style={{ ...shadowStyle3, flex: 1, }}
				contentContainerStyle={{ ...shadowStyle3, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', }}
				closeButton={true}
				onClose={() => {
					this.setState({ showSpentModal: false })
				}}>
				<HorizontalInput
					label="Spend"
					keyboardType="number-pad"
					value={_Spent != null ? String(_Spent) : null}
					onChangeText={(text) => {
						this.setState({ _Spent: text })
					}} />


				<CustomButton title='Filter'
					onPress={() => {
						this.setState({ Spent: _Spent, showSpentModal: false })
					}}
					style={{ borderRadius: 10, }}
				/>

			</CustomModal>
		)
	}

	renderPopup = () => {
		let { pos_y, pos_x, isPopupVisible } = this.state

		if (!isPopupVisible || pos_x === undefined || pos_y === undefined) {
			return null
		}

		// Can cause bugs on iOS?
		pos_x -= 29

		const { translate } = this.props
		const { Country, City, Type, Status, From, To, Order, Spent, Source } = this.state
		const {
			StoreTypeId,
			SubStoreId
		} = this.props.hello_data

		return (
			<View
				style={{
					position: 'absolute',
					top: pos_y + headerHeight + 2,
					right: 0,
					bottom: 0,
					backgroundColor: 'white',
					borderRadius: 15,
					paddingVertical: largePagePadding,
					width: 250,
					marginHorizontal: 5,
					...shadowStyle3,
				}}>
				<Triangle
					width={14}
					height={10}
					color={'white'}
					direction={'up'}
					style={{
						position: 'absolute',
						top: -10,
						right: pos_x + 2,
					}}
				/>
				<ScrollView
					contentContainerStyle={{
					}}>
					<ArrowItem
						onPress={() => {
							SelectCountry(this.props.navigation, item => {
								this.setState({ Country: item, City: null })
							})
						}}
						title={'Country'}
						info={Country ? Country.Name : translate('NoneSelected')}
						style={{ paddingHorizontal: largePagePadding }}
					/>

					<ItemSeparator />

					{Country && <View>
						<ArrowItem
							onPress={() => {
								SelectCity(this.props.navigation, item => {
									this.setState({ City: item })
								}, Country.Id)
							}}
							title={'City'}
							info={City ? City.Name : translate('NoneSelected')}
							style={{ paddingHorizontal: largePagePadding }}
						/>

						<ItemSeparator />
					</View>}

					<ArrowItem
						onPress={() => {
							this.getCustomerTyoes(() => {
								this.typeSelectorRef.current.show()
							})
						}}
						title={'Type'}
						style={{ paddingHorizontal: largePagePadding }}

						info={Type ? Type.Name : translate('NoneSelected')} />

					<ItemSeparator />

					<ArrowItem
						onPress={() => {
							this.getCustomerStatus(() => {
								this.statusSelectorRef.current.show()
							})
						}}
						style={{ paddingHorizontal: largePagePadding }}
						title={'Status'}
						info={Status ? Status.Name : translate('NoneSelected')} />

					<ItemSeparator />

					<ArrowItem
						onPress={() => { this.showFromDateTimePicker() }}
						style={{ paddingHorizontal: largePagePadding }}
						title={'From'}
						info={From ? formatDate(From) : translate('NoneSelected')} />
					<ItemSeparator />

					<ArrowItem
						onPress={() => { this.showToDateTimePicker() }}
						style={{ paddingHorizontal: largePagePadding }}
						title={'To'}
						info={To ? formatDate(To) : translate('NoneSelected')} />

					<ItemSeparator />

					{StoreTypeId == 3 && SubStoreId == null ?
						<ArrowItem
							onPress={() => {
								this.getSubStores(() => {
									this.SubStoresRef.current.show()
								})
							}}
							title={'SubStore'}
							info={this.state.SubStore ? TrimText(this.state.SubStore.Name, 10) : translate('NoneSelected')} /> :
						null}

					<ArrowItem
						onPress={() => {
							this.OrderRef.current.show()
						}}
						title={'Order'}
						info={Order ? TrimText(translate(Order.Name), 10) : translate('NoneSelected')} />


					<ArrowItem
						onPress={() => {
							this.SourceRef.current.show()
						}}
						title={'Source'}
						info={Source ? TrimText(translate(Source.Name), 10) : translate('NoneSelected')} />

					<ArrowItem
						onPress={() => {
							this.setState({ showSpentModal: true, isPopupVisible: false })
						}}
						title={'Spend'}
						info={Spent ? TrimText(Spent, 10) : translate('NoneSelected')} />


					<CustomButton
						onPress={() => {
							this.hidePopup()
							this.setState({
								Country: null,
								City: null,
								Status: null,
								Type: null,
								SubStore: null,
								Order: null,
								Source: null,
								Spent: null,
								_Spent: null
							})
						}}
						style={{
							marginTop: pagePadding + 10,
							marginHorizontal: largePagePadding,
						}}
						title='Clear' />
				</ScrollView>
			</View>
		)
	}

	render() {
		const { CustomerTypes, CustomerStatus, From, To, isFromDatePickerVisible, isToDatePickerVisible, SubStores } = this.state
		const { translate } = this.props;
		const { Sources, Orders } = this;
		return (
			<LazyContainer
				style={{ flex: 1, backgroundColor: "#FFF" }}
			>
				<CustomHeader
					leftComponent={this.props.route.params && this.props.route.params?.forceNavigateToCustomerChat == true ? 'back' : "drawer"}
					onBack={() => {
						this.props.route.params?.onChildChange && this.props.route.params.onChildChange()
					}}
					navigation={this.props.navigation}
					title="Customers"
					rightNumOfItems={3}
					rightComponent={
						<View
							style={{
								flexDirection: "row",
								alignItems: "center"
							}}>
							<CustomTouchable
								onPress={() => { this.setState({ searchBarShown: !this.state.searchBarShown }) }}
								style={{
									flexDirection: "row",
									justifyContent: "center",
									alignItems: "center",
									flex: 1
								}}>
								<Ionicons
									name={`ios-search`}
									size={24}
									color={'white'} />
							</CustomTouchable>


							<CustomTouchable
								onLayout={({ nativeEvent: { layout: { x, y } } }) => {
									this.setState({ pos_x: x, pos_y: y })
								}}
								onPress={() => { this.setState({ isPopupVisible: !this.state.isPopupVisible }) }}
								style={{
									flexDirection: "row",
									justifyContent: "center",
									alignItems: "center",
									flex: 1
								}}>
								<AntDesign
									name={`filter`}
									size={24}
									color={'white'} />
							</CustomTouchable>
							<CustomTouchable
								onPress={() => { this.props.navigation.navigate('AddNewCustomer', { onChildChange: this.onChildChange }) }}
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
							</CustomTouchable>

						</View>
					} />

				{this.renderSearch()}

				<RemoteDataContainer
					url={"Customers"}
					params={this.getRequestParams()}
					cacheName={"customers"}
					onDataFetched={(data) => {
						this.setState({ data })
					}}
					updatedData={this.state.data}
					triggerRefresh={this.state.triggerRefresh}
					keyExtractor={({ Id }) => `${Id}`}
					ItemSeparatorComponent={() => <ItemSeparator />}
					renderItem={this.renderItem} />

				{this.renderPopup()}

				{this.state.customeOptions &&
					<CustomSelector
						ref={this.optionsRef}
						options={this.state.customeOptions.map(item => item.Name)}
						onSelect={(index) => {
							this.state.customeOptions[index].Id == 0 ?
								this.confirmRef.current.show() :
								this.props.navigation.navigate('Chat', {
									fromCustomer: true,
									CustomerId: this.DeleteOrEditId
								})
						}}
						onDismiss={() => { }}
					/>
				}

				<ConfirmModal
					ref={this.confirmRef}
					onConfirm={() => {
						DeleteCustomer(this.DeleteOrEditId, () => {
							this.onChildChange()
							LongToast('dataDeleted')
						})
					}}
					onResponse={() => {

					}}
				/>

				{CustomerTypes && <CustomSelector
					ref={this.typeSelectorRef}
					options={CustomerTypes.map(item => item.Name)}
					onSelect={(index) => { this.setState({ Type: CustomerTypes[index] }) }}
					onDismiss={() => { }}
				/>}

				{CustomerStatus && <CustomSelector
					ref={this.statusSelectorRef}
					options={CustomerStatus.map(item => item.Name)}
					onSelect={(index) => { this.setState({ Status: CustomerStatus[index] }) }}
					onDismiss={() => { }}
				/>}

				<CustomDatePicker
					isVisible={isFromDatePickerVisible}
					date={From}
					onDatePicked={(date) => {
						this.setState({
							From: date,
						})

						this.hideFromDateTimePicker()
					}}
					onCancel={this.hideFromDateTimePicker} />

				<CustomDatePicker
					isVisible={isToDatePickerVisible}
					date={To}
					onDatePicked={(date) => {
						this.setState({
							To: date,
						})

						this.hideToDateTimePicker()
					}}
					onCancel={this.hideToDateTimePicker} />

				{SubStores && <CustomSelector
					ref={this.SubStoresRef}
					options={SubStores.map(item => item.Name)}
					onSelect={(index) => { this.setState({ SubStore: SubStores[index] }) }}
					onDismiss={() => { }}
				/>}

				{Orders && <CustomSelector
					ref={this.OrderRef}
					options={Orders.map(item => translate(item.Name))}
					onSelect={(index) => { this.setState({ Order: Orders[index] }) }}
					onDismiss={() => { }}
				/>}


				{Sources && <CustomSelector
					ref={this.SourceRef}
					options={Sources.map(item => translate(item.Name))}
					onSelect={(index) => { this.setState({ Source: Sources[index] }) }}
					onDismiss={() => { }}
				/>}

				{this.renderSpentModal()}

			</LazyContainer>
		)
	}
}

const mapStateToProps = ({
	login: {
		hello_data
	},
}) => ({
	hello_data
})

export default connect(mapStateToProps)(withLocalize(Customers))