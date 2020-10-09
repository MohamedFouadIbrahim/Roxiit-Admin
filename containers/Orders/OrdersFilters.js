import React, { Component } from 'react'
import { ScrollView, View } from 'react-native'
import CustomHeader from '../../components/CustomHeader/index.js';
import LazyContainer from '../../components/LazyContainer'
import ItemSeparator from '../../components/ItemSeparator/index.js';
import { withLocalize } from 'react-localize-redux';
import HeaderSubmitButton from '../../components/HeaderSubmitButton/index.js';
import ArrowItem from '../../components/ArrowItem/index.js';
import { getFilters } from '../../services/FilterService.js';
import CustomSelector from '../../components/CustomSelector/index.js';
import { SelectCountry, SelectCity, SelectArea } from '../../utils/Places.js';
import { SelectEntity } from '../../utils/EntitySelector.js';
import { largePagePadding } from '../../constants/Style.js';
import CustomButton from '../../components/CustomButton/index.js';
import { MAX_PRICE_RANGE } from '../../constants/Config.js';
import FontedText from '../../components/FontedText/index.js';
import CustomMultiSlider from '../../components/CustomMultiSlider/index.js';
import TranslatedText from '../../components/TranslatedText/index.js';
import CustomDatePicker from '../../components/CustomDatePicker';
import { formatDate } from '../../utils/Date.js';
import { mainTextColor } from '../../constants/Colors.js';
import { GetDriverList } from '../../services/OrdersService.js';

class OrdersFilters extends Component {
	constructor(props) {
		super(props)

		if (this.props.route.params) {
			this.currentFilters = this.props.route.params?.currentFilters
			Object.keys(this.currentFilters).forEach((key) => (this.currentFilters[key] == null) && delete this.currentFilters[key])
		}
		this.sourceOptions = [{ Id: 0, Name: "All" }, { Id: 1, Name: "POS" }, { Id: 2, Name: "Customer" }]
		this.defaultFilters = {
			Courier: null,
			Customer: null,
			Countries: [],
			Cities: [],
			Areas: [],
			Status: null,
			MinPrice: 0,
			MaxPrice: 3000,
			From: null,
			To: null,
			Drivers: [],
			Driver: null,
			Source: this.sourceOptions[0],
		}

		this.state = {
			...this.defaultFilters,
			...this.currentFilters,
			didFetchData: false,
			isFromDateTimePickerVisible: false,
			isToDateTimePickerVisible: false
		}



		this.couriersSelectorRef = React.createRef();
		this.statusSelectorRef = React.createRef();
		this.subStoreSelectorRef = React.createRef()
		this.driversSelectorRef = React.createRef();
		this.sourceSelectorRef = React.createRef();
	}
	componentWillUnmount() {
		this.cancelFetchData && this.cancelFetchData()
		this.cancelFetchDriversData && this.cancelFetchDriversData()
	}

	handleFromDatePicked = date => {
		this.setState({ From: date, isFromDateTimePickerVisible: false })
	};

	handleToDatePicked = date => {
		this.setState({ To: date, isToDateTimePickerVisible: false })
	}

	componentDidMount() {
		this.cancelFetchData = getFilters({
			orderStatus: true,
			couriers: true,
			subStores: true,
		}, res => {
			this.setState({
				...res.data,
				didFetchData: true,
			})
		})
	}

	submit = () => {
		const {
			Courier,
			Customer,
			Countries,
			Cities,
			Areas,
			Status,
			MinPrice,
			MaxPrice,
			From,
			To,
			SubStore,
			Driver,
			Source,
		} = this.state

		const response = {
			Courier,
			Customer,
			Countries,
			Cities,
			Areas,
			Status,
			MinPrice,
			MaxPrice,
			From,
			To,
			SubStore,
			Driver,
			Source,
		}

		this.props.route.params
			&& this.props.route.params?.onResponse
			&& this.props.route.params?.onResponse(response)


		this.props.navigation.goBack()
	}

	onPricesChange = (prices) => {
		this.setState({
			MinPrice: prices[0],
			MaxPrice: prices[1],
		})
	}

	renderContent = () => {
		if (this.state.didFetchData) {
			const { translate } = this.props

			const {
				Courier,
				Customer,
				Countries,
				Cities,
				Areas,
				Status,
				MinPrice,
				MaxPrice,
				From,
				To,
				SubStore,
				Driver,
				Source,
			} = this.state

			return (
				<ScrollView
					contentContainerStyle={{
					}}>
					<ArrowItem
						onPress={() => {
							this.couriersSelectorRef.current.show()
						}}
						title={'Courier'}
						info={Courier ? Courier.Name : translate('NoneSelected')} />

					<ItemSeparator />

					<ArrowItem
						onPress={() => {
							this.statusSelectorRef.current.show()
						}}
						title={'Status'}
						info={Status ? Status.Name : translate('NoneSelected')} />

					<ArrowItem
						onPress={() => {
							SelectCountry(this.props.navigation, data => {
								this.setState({ Countries: data })
							}, multi_select = true, Countries)
						}}
						title={'Countries'}
						info={Countries.length || translate('NoneSelected')} />

					<ItemSeparator />

					{Countries.length > 0 && <View >
						<ArrowItem
							onPress={() => {
								SelectCity(this.props.navigation, data => {
									this.setState({ Cities: data })
								}, Countries.map(item => item.Id), multi_select = true,
									Cities)
							}}
							title={'Cities'}
							info={Cities.length || translate('NoneSelected')} />

						<ItemSeparator />
					</View>}

					{Cities.length > 0 && <View >
						<ArrowItem
							onPress={() => {
								SelectArea(this.props.navigation, data => {
									this.setState({ Areas: data })
								}, Cities.map(item => item.Id), multi_select = true,
									Areas)
							}}
							title={'Areas'}
							info={Areas.length || translate('NoneSelected')} />

						<ItemSeparator />
					</View>}

					<ArrowItem
						onPress={() => {
							SelectEntity(this.props.navigation, data => {
								this.setState({ Customer: data })
							}, 'Customers/Simple', null, true, 1, [], { pagination: true })
						}}
						title={'Customer'}
						info={Customer ? Customer.Name : translate('NoneSelected')} />

					<ItemSeparator />

					<ArrowItem
						onPress={() => {
							this.subStoreSelectorRef.current.show()
						}}
						title={'SubStore'}
						info={SubStore ? SubStore.Name : translate('NoneSelected')} />

					<ItemSeparator />

					<ArrowItem
						onPress={() => {
							this.cancelFetchDriversData = GetDriverList(res => {
								this.setState({
									Drivers: res.data.Data,
								})
								this.driversSelectorRef.current.show()
							})
						}}
						title={'Driver'}
						info={Driver ? Driver.Name : translate('NoneSelected')} />

					<ItemSeparator />


					<ArrowItem
						onPress={() => {
							this.sourceSelectorRef.current.show()
						}}
						title={'Source'}
						info={Source ? Source.Name : translate('NoneSelected')} />
					<ItemSeparator />


					<TranslatedText text='CreatedDate' style={{ marginHorizontal: 20, marginVertical: 10 }} />

					<ArrowItem
						onPress={() => {
							this.setState({ isFromDateTimePickerVisible: true })
						}}
						title={'From'}
						info={From ? formatDate(From) : translate('From')} />

					<ItemSeparator />

					{From && <ArrowItem
						onPress={() => {
							this.setState({ isToDateTimePickerVisible: true })
						}}
						title={'To'}
						info={To ? formatDate(To) : translate('To')} />}

					<ItemSeparator />

					<TranslatedText text='Price' style={{ marginHorizontal: 20, marginVertical: 10 }} />

					<CustomMultiSlider
						values={[
							MinPrice,
							MaxPrice,
						]}
						onValuesChangeFinish={this.onPricesChange}
						min={0}
						max={MAX_PRICE_RANGE}
						step={10}
						minMarkerOverlapDistance={100}
						allowOverlap={false}
					/>

					<View
						style={{
							paddingHorizontal: largePagePadding,
							flexDirection: 'row',
							justifyContent: 'space-between',
							alignItems: 'center',
						}}>
						<FontedText style={{
							fontSize: 14,
							// color: '#3B3B4D',
							color: mainTextColor,
						}}>{MinPrice}</FontedText>
						<FontedText style={{
							fontSize: 14,
							// color: '#3B3B4D',
							color: mainTextColor,
						}}>{MaxPrice}</FontedText>
					</View>

					<CustomButton
						onPress={() => {
							this.setState({
								...this.defaultFilters
							})
						}}
						style={{
							margin: largePagePadding,
						}}
						title='Clear' />
				</ScrollView>
			)
		}
	}

	render() {
		const {
			OrderStatusList,
			Couriers,
			SubStores,
			Drivers,
		} = this.state

		return (
			<LazyContainer style={{ flex: 1, backgroundColor: "#FFF" }}>
				<CustomHeader
					navigation={this.props.navigation}
					title={"Filters"}
					rightComponent={
						<HeaderSubmitButton
							isLoading={this.state.lockSubmit}
							didSucceed={this.state.didSucceed}
							onPress={() => { this.submit() }} />
					} />

				{this.renderContent()}

				{Couriers && <CustomSelector
					ref={this.couriersSelectorRef}
					options={Couriers.map(item => item.Name)}
					onSelect={(index) => { this.setState({ Courier: Couriers[index] }) }}
					onDismiss={() => { }}
				/>}

				{
					OrderStatusList && <CustomSelector
						ref={this.statusSelectorRef}
						options={OrderStatusList.map(item => item.Name)}
						onSelect={(index) => { this.setState({ Status: OrderStatusList[index] }) }}
						onDismiss={() => { }}
					/>
				}

				{
					SubStores && <CustomSelector
						ref={this.subStoreSelectorRef}
						options={SubStores.map(item => item.Name)}
						onSelect={(index) => { this.setState({ SubStore: SubStores[index] }) }}
						onDismiss={() => { }}
					/>
				}

				{
					Drivers && <CustomSelector
						ref={this.driversSelectorRef}
						options={Drivers.map(item => item.Name)}
						onSelect={(index) => { this.setState({ Driver: Drivers[index] }) }}
						onDismiss={() => { }}
					/>
				}

				{
					this.sourceOptions && <CustomSelector
						ref={this.sourceSelectorRef}
						options={this.sourceOptions.map(item => item.Name)}
						onSelect={(index) => { this.setState({ Source: this.sourceOptions[index] }) }}
						onDismiss={() => { }}
					/>
				}

				<CustomDatePicker
					onDatePicked={this.handleFromDatePicked}
					onCancel={() => this.setState({ isFromDateTimePickerVisible: false })}
					isVisible={this.state.isFromDateTimePickerVisible}
					date={this.state.From}
				/>

				<CustomDatePicker
					isVisible={this.state.isToDateTimePickerVisible}
					onDatePicked={this.handleToDatePicked}
					onCancel={() => this.setState({ isToDateTimePickerVisible: false })}
					date={this.state.To}
				/>
			</LazyContainer >
		)
	}
}

export default withLocalize(OrdersFilters)