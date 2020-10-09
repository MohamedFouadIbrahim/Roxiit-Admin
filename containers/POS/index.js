import React, { Component } from 'react'
import { View, Dimensions } from 'react-native'
import { connect } from 'react-redux'
import CustomHeader from '../../components/CustomHeader/index.js';
import LazyContainer from '../../components/LazyContainer'
import RemoteDataContainer from '../../components/RemoteDataContainer/index.js';
import ItemSeparator from '../../components/ItemSeparator/index.js';
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import SearchBar from '../../components/SearchBar/index.js'
import CategoryItem from './CategoryItem.js';
import ProductItem from './ProductItem.js';
import CustomModal from '../../components/CustomModal/index.js';
import CustomInput from '../../components/CustomInput/index.js';
import CustomButton from '../../components/CustomButton/index.js';
import { pagePadding } from '../../constants/Style.js';
import HeaderSubmitButton from '../../components/HeaderSubmitButton/index.js';
import { LongToast } from '../../utils/Toast.js';
import { GetOrderPricing } from '../../services/OrdersService.js';
import CustomTouchable from '../../components/CustomTouchable';
import { SelectEntity } from '../../utils/EntitySelector.js';
import ArrowItem from '../../components/ArrowItem/index.js';
import { withLocalize } from 'react-localize-redux';
import { isValidSearchKeyword } from '../../utils/Validation.js';

class POS extends Component {
	constructor(props) {
		super(props)

		const { width } = Dimensions.get('window')

		const {
			numColumns,
			itemWidth,
			itemImageWidth
		} = this.calculateItemDimensions(width)

		this.state = {
			data: null,
			triggerRefresh: false,
			numColumns,
			itemWidth,
			itemImageWidth,
			customerInfo: {},
			searchBarShown: false
		}

		this.props.route.params?.hasCategories
		this.loadingPricing = false
		this.Id = this.props.route.params?.Id
		this.hasCategories = this.props?.route?.params?.hasCategories == undefined ? true : this.props.route.params.hasCategories
	}

	componentDidMount() {
		Dimensions.addEventListener('change', this.onDimensionsChange)
		this.updatePricing()
	}

	componentWillUnmount() {
		Dimensions.removeEventListener('change', this.onDimensionsChange)
	}

	componentDidUpdate(prevProps) {
		if (this.props.cart_items !== prevProps.cart_items) {
			const { data } = this.state

			this.setState({
				data: data.map(item => this.itemModifier(item))
			})

			this.updatePricing()
		}
	}

	onDimensionsChange = ({ window: { width } }) => {
		const {
			numColumns,
			itemWidth,
			itemImageWidth
		} = this.calculateItemDimensions(width)

		this.setState({
			numColumns,
			itemWidth,
			itemImageWidth
		})
	}

	calculateItemDimensions = (screen_width) => {
		let numColumns, itemWidth, itemImageWidth

		const {
			ItemsOnLargeScreen,
			ItemsOnMediumScreen,
			ItemsOnSmallScreen
		} = this.props

		if (screen_width > 900) {
			numColumns = ItemsOnLargeScreen.Value
		}
		else if (screen_width > 600) {
			numColumns = ItemsOnMediumScreen.Value
		}
		else {
			numColumns = ItemsOnSmallScreen.Value
		}

		itemWidth = screen_width / numColumns
		itemImageWidth = this.props.ShowTextOnImage ? itemWidth : itemWidth * 0.7

		return {
			numColumns,
			itemWidth,
			itemImageWidth
		}
	}

	updatePricing = (onSucess) => {
		if (this.props.cart_items.length) {
			this.loadingPricing = true
			GetOrderPricing({
				Items: this.props.cart_items.map(item => ({
					ProductId: item.Id,
					Qty: item.Qty,
					Note: item.Note,
					Options: item.Options ? item.Options.map(mapItem => ({ ProductOptionId: mapItem.Id })) : []
				})),
				Price: {
					SubTotal: 0,
					Shipping: 0,
					Tax: 0,
					Disocunt: 0
				}
			}, res => {
				this.loadingPricing = false
				this.setState({ Pricing: res.data })
				onSucess && onSucess(res.data)
			}, err => {
				this.loadingPricing = true
			})
		}
		else {
			this.setState({ Pricing: false })
		}
	}

	renderProductModal = () => {
		const {
			editedItemId
		} = this.state

		const { cart_items, translate } = this.props
		const foundCartItem = cart_items.find(findItem => findItem.Id === editedItemId)

		return (
			<CustomModal
				isVisible={this.state.productModalShown}
				onClose={() => {
					this.setState({ productModalShown: false })
				}}
				closeButton={true}>
				{foundCartItem && <ArrowItem
					onPress={() => {
						this.setState({ productModalShown: false })

						SelectEntity(this.props.navigation, data => {
							this.props.updateCartItemOptions(foundCartItem.Id, data)
						}, 'Product/Options/Simple', `productId=${foundCartItem.Id}`, false, 2, foundCartItem.Options)
					}}
					style={{
						width: '100%',
						paddingHorizontal: 0,
					}}
					title={'Options'}
					info={foundCartItem.Options.length || translate('NoneSelected')} />}

				<CustomInput
					placeholder="Note"
					value={this.state.editedItemNote}
					onChangeText={(text) => {
						this.setState({ editedItemNote: text })
					}} />

				<CustomButton
					onPress={() => {
						const { editedItemId, editedItemNote } = this.state
						const { editCartItemNote } = this.props

						editCartItemNote(editedItemId, editedItemNote)
						this.setState({ productModalShown: false })
					}}
					style={{
						marginTop: pagePadding,
					}}
					fullWidth={true}
					title='Change' />
			</CustomModal>
		)
	}

	renderSearch = () => {
		return (
			<SearchBar
				visible={this.state.searchBarShown}
				onPressClose={() => {
					this.setState({ searchBarShown: !this.state.searchBarShown })
				}}
				onSubmitEditing={(text) => {
					this.setState({ searchingFor: text })
				}} />
		)
	}

	onPressCategoryItem = (item) => {
		const { hasChildren, Id } = item

		this.props.navigation.push("POS", {
			Id,
			hasCategories: hasChildren,
		})
	}

	renderCategoryItem = ({ item }) => {
		return (
			<CategoryItem
				item={item}
				style={{
					width: this.state.itemWidth,
				}}
				imageSize={this.state.itemImageWidth}
				onPress={this.onPressCategoryItem} />
		)
	}

	onLongPressProductItem = (item, index) => {
		const { Id } = item
		const { cart_items } = this.props
		const foundCartItem = cart_items.find(findItem => findItem.Id === Id)

		if (foundCartItem) {
			this.setState({
				editedItemId: Id,
				editedItemNote: foundCartItem.Note,
				productModalShown: true
			})
		}
	}

	onPressAddProduct = (item) => {
		this.props.addCartItem(item)
	}

	onPressRemoveProduct = (item) => {
		this.props.removeCartItem(item.Id)
	}

	onPressIncrement = (item) => {
		this.props.incrementCartItemQuantity(item.Id)
	}

	onPressDecrement = (item) => {
		this.props.decrementCartItemQuantity(item.Id)
	}

	onRemoveCartItemByIndex = (index) => {
		this.props.removeCartItemByIndex(index)
	}
	renderProductItem = ({ item, index }) => {
		// const ShowPOSButtons = {
		// 	Value: false
		// }
		return (
			<ProductItem
				item={item}
				index={index}
				translate={this.props.translate}
				onLongPress={this.onLongPressProductItem}
				onPressAddProduct={this.onPressAddProduct}
				onPressRemoveProduct={this.onPressRemoveProduct}
				navigation={this.props.navigation}
				updatePricing={this.updatePricing}
				// onPressIncrement={this.onPressIncrement}
				// onPressDecrement={this.onPressDecrement}
				ShowPOSButtons={this.props.ShowPOSButtons}
				style={{
					width: this.state.itemWidth,
				}}
				imageSize={this.state.itemImageWidth} />
		)
	}

	addParamsSeparator = (params) => {
		return params.length ? '&' : ''
	}

	getRequestParams = () => {
		let params = ''

		const { searchingFor, searchBarShown } = this.state
		const { Id = 0 } = this

		if (isValidSearchKeyword(searchingFor)) {
			params += `${this.addParamsSeparator(params)}search=${searchingFor}`
		}

		if ((Id || Id == 0) && !searchBarShown) {
			params += `${this.addParamsSeparator(params)}${(this.hasCategories ?? false) ? 'parentId' : 'categoryId'}=${Id}`
		}

		return params
	}

	itemModifier = (item) => {
		const { cart_items } = this.props
		const foundCartItem = cart_items.find(findItem => findItem.Id === item.Id)

		return {
			...item,
			Qty: foundCartItem ? foundCartItem.Qty : null,
			isAdded: foundCartItem ? true : false
		}
	}

	renderList = () => {
		const { Id } = this

		const {
			searchBarShown
		} = this.state

		if (this.hasCategories && !searchBarShown) {
			return (
				<RemoteDataContainer
					numColumns={this.state.numColumns}
					key={this.state.numColumns}
					url={"Categories"}
					cacheName={Id ? null : "categories"}
					params={this.getRequestParams()}
					onDataFetched={(data) => {
						this.setState({ data })
					}}
					updatedData={this.state.data}
					keyExtractor={({ Id }) => `${Id}`}
					renderItem={this.renderCategoryItem} />
			)
		}
		else {
			return (
				<RemoteDataContainer
					numColumns={this.state.numColumns}
					key={this.state.numColumns}
					url={"Products"}
					triggerRefresh={this.state.triggerRefresh}
					params={this.getRequestParams()}
					onDataFetched={(data) => {
						this.setState({ data })
					}}
					updatedData={this.state.data}
					// itemModifier={this.itemModifier}
					keyExtractor={({ Id }) => `${Id}`}
					renderItem={this.renderProductItem} />
			)
		}
	}

	render() {
		const { Pricing } = this.state
		const { Currency, cart_items, emptyCart, removeCartItemByIndex } = this.props

		return (
			<LazyContainer style={{ flex: 1, backgroundColor: "#FFF" }}>
				<CustomHeader
					leftComponent="back"
					navigation={this.props.navigation}
					rightNumOfItems={3}
					rightComponent={
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'center',
							}}>
							<CustomTouchable
								onPress={emptyCart}
								style={{
									flexDirection: 'row',
									justifyContent: 'center',
									alignItems: 'center',
									flex: 1,
									paddingVertical: 9,
								}}>
								<MaterialCommunityIcons
									name={`cart-off`}
									size={24}
									color={'white'} />
							</CustomTouchable>

							<CustomTouchable
								onPress={() => {
									this.setState({ searchBarShown: !this.state.searchBarShown })
								}}
								style={{
									flexDirection: 'row',
									justifyContent: 'center',
									alignItems: 'center',
									flex: 1,
									paddingVertical: 9,
								}}>
								<Ionicons
									name={`ios-search`}
									size={24}
									color={'white'} />
							</CustomTouchable>

							<View
								style={{
									flexDirection: 'row',
									justifyContent: 'center',
									alignItems: 'center',
									flex: 1,
								}}>
								<HeaderSubmitButton
									onPress={() => {
										if (!this.loadingPricing) {
											this.props.navigation.navigate("Checkout", {
												Pricing: Pricing ? Pricing : {},
												removeCartItemByIndex: (index) => { this.onRemoveCartItemByIndex(index) },
												updatePricing: this.updatePricing,
											})
										}
									}} />
							</View>
						</View>
					}
					title="POS"
					subTitle={Pricing ? `${Currency.Name}${Pricing.Total} (${cart_items.length})` : null} />

				{this.renderSearch()}
				{this.renderList()}
				{this.renderProductModal()}
			</LazyContainer>
		)
	}
}

const mapStateToProps = ({
	cart: {
		cart_items,
	},
	login: {
		Currency,
	},
	runtime_config: {
		runtime_config: {
			screens: {
				Product_Details_09_5: {
					ShowTextOnImage,
				},
				Admin_Page_0_0
			},
		},
	},
}) => ({
	ShowTextOnImage,
	Currency,
	cart_items,
	...Admin_Page_0_0
})

function mergeProps(stateProps, { dispatch }, ownProps) {
	const {
		actions: {
			addCartItem,
			removeCartItem,
			incrementCartItemQuantity,
			decrementCartItemQuantity,
			editCartItemNote,
			updateCartItemOptions,
			emptyCart,
			removeCartItemByIndex
		}
	} = require('../../redux/CartRedux.js');

	return {
		...ownProps,
		...stateProps,
		addCartItem: (item) => addCartItem(dispatch, item),
		removeCartItemByIndex: (index) => removeCartItemByIndex(dispatch, index),
		removeCartItem: (id) => removeCartItem(dispatch, id),
		incrementCartItemQuantity: (id) => incrementCartItemQuantity(dispatch, id),
		decrementCartItemQuantity: (id) => decrementCartItemQuantity(dispatch, id),
		editCartItemNote: (id, note) => editCartItemNote(dispatch, id, note),
		updateCartItemOptions: (id, options) => updateCartItemOptions(dispatch, id, options),
		emptyCart: () => emptyCart(dispatch),
	};
}

export default connect(mapStateToProps, undefined, mergeProps)(withLocalize(POS))