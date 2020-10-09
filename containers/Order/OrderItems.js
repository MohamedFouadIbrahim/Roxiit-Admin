import React, { Component } from 'react';
import { withLocalize } from 'react-localize-redux';
import { FlatList, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CheckBox from '../../components/CheckBox/index.js';
import CircularImage from '../../components/CircularImage/index.js';
import CustomButton from '../../components/CustomButton/index.js';
import CustomHeader, { secondHeaderIconSize } from '../../components/CustomHeader/index.js';
import CustomInput from '../../components/CustomInput/index.js';
import CustomModal from '../../components/CustomModal/index.js';
import CustomTouchable from '../../components/CustomTouchable';
import FontedText from '../../components/FontedText/index.js';
import ItemSeparator from '../../components/ItemSeparator/index.js';
import LazyContainer from '../../components/LazyContainer';
import RemoteDataContainer from '../../components/RemoteDataContainer/index.js';
import TranslatedText from '../../components/TranslatedText/index.js';
import { mainColor, mainTextColor, secondTextColor } from '../../constants/Colors.js';
import { STRING_LENGTH_SHORT } from '../../constants/Config';
import { largePagePadding, pagePadding, shadowStyle0 } from '../../constants/Style.js';
import { ChangeOrderItemQuantity, DeleteOrderItem } from '../../services/OrdersService.js';
import { LongToast } from '../../utils/Toast.js';

class OrderItems extends Component {
	constructor(props) {
		super(props)

		const { Id } = this.props.route.params
		this.orderId = Id

		this.state = {
			data: null,
			triggerRefresh: false,
			deleteModalShown: false,
			quantityModalShown: false,
			updateOrderPrice: true,
			updatedQuantity: null,
			showCustomSelectorForDeleteref: false,
			Loading: false,
			quantityModalLoading: false,
		}
	}

	// componentWillUnmount() {
	// 	this.cancelFetchData && this.cancelFetchData()
	// 	this.cancelFetchDataDeleteOrderItem && this.cancelFetchDataDeleteOrderItem()
	// }

	renderOption = ({ item, inedx }) => {

		const {

			ProductOptionId,
			ExtraDetails1,
			ExtraDetails2,
			ExtraDetails3,
			ProductOptionGroupMember,
			ProductOptionGroup,
			ProductOptionGroupType

		} = item

		return (
			<View key={String(ProductOptionId)} style={{ marginTop: 5 }} >
				{ProductOptionGroup && ProductOptionGroupMember ? <FontedText style={{ color: 'black', textAlign: 'left' }}>{`${ProductOptionGroup.Name} : ${ProductOptionGroupMember.Name}`}</FontedText> : null}
				{ExtraDetails1 ? <FontedText style={{ color: secondTextColor, textAlign: 'left' }}>{ExtraDetails1}</FontedText> : null}
				{ExtraDetails2 ? <FontedText style={{ color: secondTextColor, textAlign: 'left' }}>{ExtraDetails2}</FontedText> : null}
				{ExtraDetails3 ? <FontedText style={{ color: secondTextColor, textAlign: 'left' }}>{ExtraDetails3}</FontedText> : null}
			</View>
		)
	}

	renderItem = ({ item, index }) => {
		const {
			OrderLineId,
			Product: {
				Name,
				Icon: {
					ImageUrl,
				},
				Currency,
			},
			Qty,
			UnitPrice,
			ExtraDetails1,
			ExtraDetails2,
			ExtraDetails3,
			Options,
		} = item

		return (
			<CustomTouchable
				onPress={() => {
					this.props.navigation.navigate('OrderItem', {
						Id: OrderLineId,
						orderId: this.orderId,
						onChildChange: this.onChildChange,
						data: item,
					})
				}}
				onLongPress={() => {
					this.changingOrderItemId = OrderLineId
					this.setState({ deleteModalShown: true })
				}}
			>
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
						<CircularImage
							uri={ImageUrl} id={index} />

						<View
							style={{
								flex: 1,
								paddingLeft: largePagePadding,
							}}>
							<FontedText style={{ color: 'black', textAlign: 'left' }}>{Name}</FontedText>
							<FontedText style={{ color: secondTextColor, textAlign: 'left', marginTop: 5, }}>{UnitPrice} {(Currency ? Currency.Name : "")}</FontedText>
							{ExtraDetails1 ? <FontedText style={{ color: secondTextColor, textAlign: 'left', marginTop: 5, }}>{ExtraDetails1}</FontedText> : null}
							{ExtraDetails2 ? <FontedText style={{ color: secondTextColor, textAlign: 'left', marginTop: 5, }}>{ExtraDetails2}</FontedText> : null}
							{ExtraDetails3 ? <FontedText style={{ color: secondTextColor, textAlign: 'left', marginTop: 5, }}>{ExtraDetails3}</FontedText> : null}

							<FlatList
								data={Options}
								renderItem={this.renderOption}
								keyExtractor={({ ProductOptionId }) => String(ProductOptionId)}
							/>

							{/* {Options && Options.length &&  this.renderOption(Options)} */}
						</View>
					</View>

					<CustomTouchable
						style={{
							justifyContent: 'center',
							alignItems: 'flex-end',
							// paddingLeft: 30,
							justifyContent: 'center',
							alignItems: 'center',
							// backgroundColor: mainColor,
							width: 38,
							height: 38,
							borderRadius: 19,
							borderWidth: 0.5,
							borderColor: mainColor,
							...shadowStyle0
						}}
						onPress={() => {
							this.changingOrderItemId = OrderLineId
							this.setState({ quantityModalShown: true, updatedQuantity: Qty })
						}}
					>

						<FontedText style={{ color: mainColor, fontSize: 20, fontWeight: 'bold', textAlign: 'right' }}>{Qty}</FontedText>
					</CustomTouchable>
				</View>
			</CustomTouchable>
		)
	}


	renderDeleteModal = () => {
		return (
			<CustomModal
				isVisible={this.state.deleteModalShown}
				onClose={() => {
					this.setState({ deleteModalShown: false })
				}}
				closeButton={true}>
				<CustomTouchable
					activeOpacity={0.85}
					onPress={() => {
						this.setState({ updateOrderPrice: !this.state.updateOrderPrice })
					}}
					style={{
						marginBottom: pagePadding,
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

				<CustomButton
					onPress={() => {
						const OrderLineId = this.changingOrderItemId

						this.cancelFetchDataDeleteOrderItem = DeleteOrderItem(OrderLineId, this.state.updateOrderPrice, () => {
							this.setState({
								data: this.state.data.filter(filterItem => filterItem.OrderLineId !== OrderLineId),
								deleteModalShown: false,
							})
						})
					}}
					style={{
						marginTop: pagePadding,
					}}
					fullWidth={true}
					title='Delete' />
			</CustomModal>
		)
	}

	renderQuantityModal = () => {

		return (
			<CustomModal
				isVisible={this.state.quantityModalShown}
				onClose={() => {
					this.setState({ quantityModalShown: false })
				}}
				closeButton={true}>
				<CustomInput
					maxLength={STRING_LENGTH_SHORT}
					placeholder="Quantity"
					keyboardType="number-pad"
					value={'' + this.state.updatedQuantity}
					onChangeText={(text) => {
						this.setState({ updatedQuantity: text })
					}} />

				<CustomTouchable
					activeOpacity={0.85}
					onPress={() => {
						this.setState({ updateOrderPrice: !this.state.updateOrderPrice })
					}}
					style={{
						marginTop: largePagePadding,
						marginBottom: pagePadding,
						width: '100%',
						flexDirection: 'row',
						justifyContent: 'space-between',
						alignItems: 'center',
						backgroundColor: 'white',
					}}>
					<TranslatedText style={{ color: '#3B3B4D', marginRight: pagePadding, }} text={"UpdateCost"} />

					<CheckBox
						selected={this.state.updateOrderPrice} />
				</CustomTouchable>

				<CustomButton
					onPress={() => {
						const OrderLineId = this.changingOrderItemId

						if (!this.state.updatedQuantity) {
							LongToast('CantHaveEmptyInputs')
							return
						}
						this.setState({
							quantityModalLoading: true,
						})

						this.cancelFetchData = ChangeOrderItemQuantity(OrderLineId, this.state.updatedQuantity, this.state.updateOrderPrice, () => {
							LongToast('dataSaved')
							this.setState({
								quantityModalLoading: false,
								triggerRefresh: !this.state.triggerRefresh,
								quantityModalShown: false,
							})
						})
					}}
					style={{
						marginTop: pagePadding,
					}}
					loading={this.state.quantityModalLoading}

					fullWidth={true}
					title='Update' />
			</CustomModal>
		)
	}

	onChildChange = () => {
		this.setState({ triggerRefresh: !this.state.triggerRefresh })
	}

	render() {
		return (
			<LazyContainer style={{ flex: 1, backgroundColor: "#FFF" }}>
				<CustomHeader
					navigation={this.props.navigation}
					title="Items"
					rightComponent={
						<CustomTouchable
							onPress={() => {
								this.props.navigation.navigate('OrderItem', {
									orderId: this.orderId,
									onChildChange: this.onChildChange,
								})
							}}
							style={{
								flexDirection: 'row',
								justifyContent: 'center',
								alignItems: 'center',
								// padding: headerButtonPadding,
								// marginLeft: 10,
								flex: 1,
							}}>
							<Ionicons
								name={`ios-add`}
								size={secondHeaderIconSize}
								color={'white'} />
						</CustomTouchable>
					} />

				<RemoteDataContainer
					url={"Order/Items"}
					params={`orderId=${this.orderId}`}
					pagination={false}
					onDataFetched={(data) => {
						this.setState({ data })
					}}
					updatedData={this.state.data}
					triggerRefresh={this.state.triggerRefresh}
					keyExtractor={({ OrderLineId }) => `${OrderLineId}`}
					ItemSeparatorComponent={() => <ItemSeparator />}
					renderItem={this.renderItem} />

				{this.renderDeleteModal()}
				{this.renderQuantityModal()}
			</LazyContainer>
		)
	}
}


export default withLocalize(OrderItems)