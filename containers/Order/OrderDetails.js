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
import { GetOrderDetails, EditOrderSummaryDetails } from '../../services/OrdersService.js';
import CustomDatePicker from '../../components/CustomDatePicker/index.js';
import { formatDate } from '../../utils/Date.js';
import { GetCustomer } from '../../services/CustomersService.js';
import CustomModal from '../../components/CustomModal/index.js';
import FontedText from '../../components/FontedText/index.js';
import HorizontalTagsInput from '../../components/HorizontalTagsInput/index.js';
import HorizontalInput from '../../components/HorizontalInput';
import CircularImage from '../../components/CircularImage/index.js';
import { largePagePadding } from '../../constants/Style.js';
import { STRING_LENGTH_LONG, STRING_LENGTH_SHORT } from '../../constants/Config';
import { LongToast } from '../../utils/Toast.js';
import { secondTextColor } from '../../constants/Colors.js';

class OrderDetails extends Component {
	constructor(props) {
		super(props)

		const { Id } = this.props.route.params
		this.orderId = Id

		this.state = {
			didFetchData: false,
			isDateTimePickerVisible: false,
			customerModalShown: false,
		}

		this.couriersSelectorRef = React.createRef();
		this.statusSelectorRef = React.createRef()
	}

	componentWillUnmount() {
		this.cancelGetOrderDetails && this.cancelGetOrderDetails()
		this.cancelFetchDataGetCustomer && this.cancelFetchDataGetCustomer()
		this.cancelGetFilters && this.cancelGetFilters()
	}

	componentDidMount() {
		this.cancelGetOrderDetails = GetOrderDetails(this.orderId, orderDetailsRes => {
			this.Tags = orderDetailsRes.data.Tags

			this.cancelFetchDataGetCustomer = GetCustomer(orderDetailsRes.data.Customer.Id, customerRes => {
				this.cancelGetFilters = getFilters({
					orderStatus: true,
					couriers: true,
				}, filtersRes => {
					this.setState({
						...orderDetailsRes.data,
						CustomerData: {
							...customerRes.data,
						},
						...filtersRes.data,
						didFetchData: true,
					})
				})
			})
		})
	}

	submit = () => {
		if (this.lockSubmit) {
			return
		}

		const {
			Courier,
			Status,
			DeliverDate,
			Name,
		} = this.state

		const {
			Tags,
		} = this

		if (!Name || !Courier) {
			return LongToast('CantHaveEmptyInputs')
		}

		this.setState({ lockSubmit: true })
		this.lockSubmit = true

		EditOrderSummaryDetails({
			Id: this.orderId,
			Name,
			CourierId: Courier.Id,
			OrderStatusId: Status.Id,
			DeliverDate,
			Tags,
		}, res => {
			this.setState({ didSucceed: true, })
			this.props.route.params?.onChildChange && this.props.route.params?.onChildChange()
			this.props.navigation.goBack()
		}, err => {
			this.setState({ lockSubmit: false })
			this.lockSubmit = false
		})
	}

	showDateTimePicker = () => {
		this.setState({ isDateTimePickerVisible: true });
	}

	hideDateTimePicker = () => {
		this.setState({ isDateTimePickerVisible: false });
	}

	renderContent = () => {
		if (this.state.didFetchData) {
			const { translate } = this.props

			const {
				Courier,
				Status,
				CreatedUtc,
				DeliverDate,
				Name,
				OrderCode,
				Customer,
				Tags,
			} = this.state

			return (
				<ScrollView
					contentContainerStyle={{
					}}>
					<HorizontalInput
						maxLength={STRING_LENGTH_LONG}
						label="Name"
						value={Name}
						onChangeText={(text) => { this.setState({ Name: text }) }} />

					<ItemSeparator />

					<HorizontalInput
						maxLength={STRING_LENGTH_SHORT}
						label="OrderCode"
						value={OrderCode}
						editable={false} />

					<ItemSeparator />

					<HorizontalTagsInput
						maxLength={STRING_LENGTH_LONG}
						label="Tags"
						initialText=""
						initialTags={Tags ? Tags.split(",") : []}
						onChangeTags={tags => {
							this.Tags = tags.join(",")
						}} />

					<ItemSeparator />

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

					<ItemSeparator />

					<ArrowItem
						title={'CreatedDate'}
						info={formatDate(CreatedUtc)} />

					<ItemSeparator />

					<ArrowItem
						onPress={() => {
							this.showDateTimePicker()
						}}
						title={'DeliveredDate'}
						info={formatDate(DeliverDate)} />

					<ItemSeparator />

					<ArrowItem
						onPress={() => {
							this.setState({ customerModalShown: true })
						}}
						title={'Customer'}
						info={Customer.Name} />
				</ScrollView>
			)
		}
	}

	renderCustomerModal = () => {
		if (!this.state.CustomerData) {
			return null
		}

		const { FullName, Type, Status, Country, CreatedUtc, Media: { ImageUrl } } = this.state.CustomerData
		const { translate } = this.props

		return (
			<CustomModal
				isVisible={this.state.customerModalShown}
				onClose={() => {
					this.setState({ customerModalShown: false })
				}}
				closeButton={true}>
				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'space-between',
						alignItems: 'center',
					}}>
					<CircularImage
						uri={ImageUrl}
						size={70} />

					<View
						style={{
							justifyContent: 'flex-start',
							alignItems: 'flex-start',
							paddingLeft: largePagePadding,
						}}>
						<FontedText style={{ color: 'black', textAlign: 'left', }}>{FullName}</FontedText>
						<FontedText style={{
							// color: '#949EA5',
							color: secondTextColor,
							textAlign: 'left',
						}}>{translate('CreatedDate')} {formatDate(CreatedUtc)}</FontedText>
						<FontedText style={{
							// color: '#949EA5',
							color: secondTextColor,
							textAlign: 'left',
						}}>{Country.Name}</FontedText>
						<FontedText style={{
							// color: '#949EA5',
							color: secondTextColor,
							textAlign: 'left',
						}}>{translate('Type')} {Type.Name}</FontedText>
						<FontedText style={{
							// color: '#949EA5',
							color: secondTextColor,
							textAlign: 'left',
						}}>{translate('Status')} {Status.Name}</FontedText>
					</View>
				</View>
			</CustomModal>
		)
	}

	render() {
		const {
			OrderStatusList,
			Couriers,
			DeliverDate,
			isDateTimePickerVisible,
		} = this.state

		return (
			<LazyContainer style={{ flex: 1, backgroundColor: "#FFF" }}>
				<CustomHeader
					navigation={this.props.navigation}
					title={"Details"}
					rightComponent={
						<HeaderSubmitButton
							isLoading={this.state.lockSubmit}
							didSucceed={this.state.didSucceed}
							onPress={() => { this.submit() }} />
					} />

				{this.renderContent()}

				{Couriers ? <CustomSelector
					ref={this.couriersSelectorRef}
					options={Couriers.map(item => item.Name)}
					onSelect={(index) => { this.setState({ Courier: Couriers[index] }) }}
					onDismiss={() => { }}
				/> : null}

				{OrderStatusList ? <CustomSelector
					ref={this.statusSelectorRef}
					options={OrderStatusList.map(item => item.Name)}
					onSelect={(index) => { this.setState({ Status: OrderStatusList[index] }) }}
					onDismiss={() => { }}
				/> : null}

				<CustomDatePicker
					isVisible={isDateTimePickerVisible}
					date={DeliverDate}
					onDatePicked={(date) => {
						this.setState({
							DeliverDate: date,
						})

						this.hideDateTimePicker()
					}}
					onCancel={this.hideDateTimePicker} />

				{this.renderCustomerModal()}
			</LazyContainer>
		)
	}
}

export default withLocalize(OrderDetails)