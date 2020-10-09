import React, { Component } from 'react'
import { ScrollView, View } from 'react-native'
import CustomHeader from '../../components/CustomHeader/index.js';
import LazyContainer from '../../components/LazyContainer'
import ItemSeparator from '../../components/ItemSeparator/index.js';
import HorizontalInput from '../../components/HorizontalInput/index.js';
import { withLocalize } from 'react-localize-redux';
import HeaderSubmitButton from '../../components/HeaderSubmitButton/index.js';
import ArrowItem from '../../components/ArrowItem/index.js';
import { SelectEntity } from '../../utils/EntitySelector.js';
import { AddEditOrderItem } from '../../services/OrdersService.js';
import TranslatedText from '../../components/TranslatedText/index.js';
import CheckBox from '../../components/CheckBox/index.js';
import { pagePadding, largePagePadding } from '../../constants/Style.js';
import { STRING_LENGTH_LONG } from '../../constants/Config';
import { LongToast } from '../../utils/Toast.js';
import { mainTextColor, secondTextColor, mainColor } from '../../constants/Colors.js';
import CustomTouchable from '../../components/CustomTouchable';
import ConfirmModal from '../../components/ConfirmModal';
import FontedText from '../../components/FontedText/index.js';
import Ionicons from 'react-native-vector-icons/Ionicons';
class OrderItem extends Component {
	constructor(props) {
		super(props)

		this.state = {
			lockSubmit: false,
			didFetchData: false,
			updateOrderPrice: true,
			options: [],
		}

		this.editMode = false

		if (this.props.route.params) {
			if (this.props.route.params?.Id) {
				this.editMode = true
				this.orderItemId = this.props.route.params?.Id
			}

			if (this.props.route.params?.orderId) {
				this.orderId = this.props.route.params?.orderId
			}
		}

		this.ConfirmRef = React.createRef()
		this.lockSubmit = false
	}
	componentWillUnmount() {
		this.cancelFetchData && this.cancelFetchData()
	}

	componentDidMount() {
		if (this.orderItemId) {
			this.fetchOrderItem()
		}
	}

	fetchOrderItem = () => {
		this.setState({
			...this.props.route.params?.data,
			didFetchData: true,
		})
	}

	submit = () => {
		if (this.lockSubmit) {
			return
		}

		const { Qty, Product, ExtraDetails1, ExtraDetails2, updateOrderPrice, Note, options = [] } = this.state

		if (!Qty || !Product) {
			return LongToast('CantHaveEmptyInputs')
		}

		const orderId = this.orderId

		if (this.editMode) {
			const Id = this.orderItemId

			this.setState({ lockSubmit: true })
			this.lockSubmit = true
			//
			this.cancelFetchData = AddEditOrderItem(updateOrderPrice, {
				OrderLineId: Id,
				OrderId: orderId,
				ProductId: Product.Id,
				Qty,
				ExtraDetails1: ExtraDetails1 ? ExtraDetails1 : null,
				ExtraDetails2: ExtraDetails2 ? ExtraDetails2 : null,
				options: options && options.length > 0 ? options.map(item => ({ ProductOptionId: item.Id })) : [],
				Note,
			}, res => {
				this.setState({ didSucceed: true, })
				this.props.route.params?.onChildChange && this.props.route.params?.onChildChange()
				this.props.navigation.goBack()
			}, err => {
				this.setState({ lockSubmit: false })
				this.lockSubmit = false
			})
		}
		else {
			this.setState({ lockSubmit: true })
			this.lockSubmit = true

			this.cancelFetchData = AddEditOrderItem(updateOrderPrice, {
				OrderLineId: 0,
				OrderId: orderId,
				ProductId: Product.Id,
				Qty,
				ExtraDetails1: ExtraDetails1 ? ExtraDetails1 : null,
				ExtraDetails2: ExtraDetails2 ? ExtraDetails2 : null,
				options: options && options.length > 0 ? options.map(item => ({ ProductOptionId: item.Id })) : [],
				Note,
			}, res => {
				this.setState({ didSucceed: true, })
				this.props.route.params?.onChildChange && this.props.route.params?.onChildChange()
				this.props.navigation.goBack()
			}, err => {
				this.setState({ lockSubmit: false })
				this.lockSubmit = false
			})
		}
	}

	renderOptions = () => {
		const {
			options = []
		} = this.state

		return options.map((item, index) => {

			const {
				GroupName,
				Name,
				SKU
			} = item

			return (
				<CustomTouchable
					onLongPress={() => {
						this.item = item
						this.ConfirmRef.current.show()
					}}
					key={String(index)} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 5 }}
				>
					<FontedText style={{
						color: mainColor,
						textAlign: 'left',
						marginTop: 5,
					}} >{`${GroupName ? `${GroupName} : ` : ''}${Name} ${SKU != null && SKU != '' ? ` - ${SKU}` : ''}`}</FontedText>
				</CustomTouchable>
			)
		})

	}
	renderContent = () => {
		if (this.state.didFetchData || !this.editMode) {
			const { Qty, Product, ExtraDetails1, ExtraDetails2, Note, SKU } = this.state

			return (
				<ScrollView
					contentContainerStyle={{
					}}>
					<ArrowItem
						onPress={() => {
							SelectEntity(this.props.navigation, data => {
								this.setState({
									Product: data,
								})
							}, 'Products/Simple', null, true, 1)
						}}
						title={'Product'}
						info={Product ? Product.Name : null} />

					<ItemSeparator />

					<HorizontalInput
						label="Quantity"
						keyboardType="number-pad"
						value={Qty ? String(Qty) : null}
						onChangeText={(text) => { this.setState({ Qty: text }) }} />

					<ItemSeparator />

					<CustomTouchable
						activeOpacity={0.85}
						onPress={() => {
							this.setState({ updateOrderPrice: !this.state.updateOrderPrice })
						}}
						style={{
							paddingVertical: 15,
							paddingHorizontal: 20,
							width: '100%',
							flexDirection: 'row',
							justifyContent: 'space-between',
							alignItems: 'center',
							backgroundColor: 'white',
						}}>
						<TranslatedText style={{
							// color: '#3B3B4D',
							color: mainTextColor,
							marginRight: pagePadding,
						}} text={"UpdateCost"} />

						<CheckBox
							selected={this.state.updateOrderPrice} />
					</CustomTouchable>

					<ItemSeparator />

					<HorizontalInput
						maxLength={STRING_LENGTH_LONG}
						label="ExtraDetails"
						value={ExtraDetails1}
						onChangeText={(text) => { this.setState({ ExtraDetails1: text }) }} />

					<ItemSeparator />

					<HorizontalInput
						maxLength={STRING_LENGTH_LONG}
						label="ExtraDetails"
						value={ExtraDetails2}
						onChangeText={(text) => { this.setState({ ExtraDetails2: text }) }} />

					{SKU && SKU != null && SKU != '' ? <HorizontalInput
						editable={false}
						maxLength={STRING_LENGTH_LONG}
						label="SKU"
						value={SKU}
						onChangeText={(text) => { this.setState({ SKU: text }) }} /> : null}

					<ItemSeparator />

					<HorizontalInput
						maxLength={STRING_LENGTH_LONG}
						label="Note"
						value={Note}
						onChangeText={(text) => { this.setState({ Note: text }) }} />

					<ItemSeparator />

					<View
						style={{
							marginHorizontal: largePagePadding,
							marginTop: pagePadding,
						}}
					>
						<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }} >
							<TranslatedText style={{ fontWeight: 'bold', marginBottom: 5 }} text='Options' />

							<CustomTouchable
								style={{ width: 80, alignItems: 'flex-end', justifyContent: 'center', height: 20 }}
								onPress={() => {
									if (this.state?.Product?.Id) {
										SelectEntity(this.props.navigation, (item = null) => {
											if (item) {
												this.setState({ options: [...this.state.options, ...item] })
											}
										}, 'Product/Options/Simple', `productId=${this.state.Product.Id}`, true, 2, [])
									} else {
										LongToast('MustSelectProducts')
									}
								}}
							>
								<Ionicons name='ios-add-circle' size={20} color={mainColor} />
							</CustomTouchable>

						</View>
						{this.renderOptions()}
					</View>

					<ConfirmModal
						ref={this.ConfirmRef}
						onConfirm={() => {
							const {
								Id
							} = this.item

							this.setState({
								options: this.state.options.filter(item => item.Id != Id)
							})
						}}
					/>
				</ScrollView>
			)
		}
	}

	render() {
		return (
			<LazyContainer style={{ flex: 1, backgroundColor: "#FFF" }}>
				<CustomHeader
					navigation={this.props.navigation}
					title={"Item"}
					rightComponent={
						<HeaderSubmitButton
							isLoading={this.state.lockSubmit}
							didSucceed={this.state.didSucceed}
							onPress={() => { this.submit() }} />
					} />

				{this.renderContent()}
			</LazyContainer>
		)
	}
}

export default withLocalize(OrderItem)