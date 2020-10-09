import React, { Component } from 'react'
import { View } from 'react-native'
import CustomHeader, { secondHeaderIconSize, } from '../../components/CustomHeader/index.js';
import LazyContainer from '../../components/LazyContainer'
import RemoteDataContainer from '../../components/RemoteDataContainer/index.js';
import ItemSeparator from '../../components/ItemSeparator/index.js';
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import SearchBar from '../../components/SearchBar/index.js';
import { DeleteDiscount } from '../../services/DiscountsService.js';
import { withLocalize } from 'react-localize-redux';
import CustomSelectorForDeleteAndEdit from '../../components/CustomSelectorForDeleteAndEdit/index';
import DiscountItem from './DiscountItem.js';
import { LongToast } from '../../utils/Toast.js';
import CustomTouchable from '../../components/CustomTouchable';
import { isValidSearchKeyword } from '../../utils/Validation.js';

class Discounts extends Component {
	constructor() {
		super()

		this.state = {
			data: null,
			triggerRefresh: false,
			searchingFor: '',
			showSearch: false,
			showCustomSelectorForDeleteref: false,
			Loading: false
		}
	}

	onPressItem = (item) => {
		const { Id } = item
		this.props.navigation.navigate('Discount', {
			Id,
			onChildChange: this.onChildChange,
		})
	}

	onLongPressItem = (item) => {
		const { Id } = item
		this.DeleteOrEditId = Id
		this.setState({ showCustomSelectorForDeleteref: true })
	}

	renderItem = ({ item }) => {
		return (
			<DiscountItem
				item={item}
				onPress={this.onPressItem}
				onLongPress={this.onLongPressItem} />
		)
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
			Active,
			Brands,
			Categories,
			Warehouses,
			Countries,
			DiscountType,
			CustomerType,
			Courier,
			searchingFor,
		} = this.state

		let params = ''

		if (isValidSearchKeyword(searchingFor)) {
			params += `search=${searchingFor}`
		}

		if (Active === 1 || Active === 0) {
			params += `${this.addParamsSeparator(params)}isActive=${Active === 1 ? true : false}`
		}

		if (Brands && Brands.length) {
			let brands_params_arr = []

			Brands.forEach(item => {
				brands_params_arr.push(`brands=${item.Id}`)
			})

			params += `${this.addParamsSeparator(params)}${brands_params_arr.join("&")}`
		}

		if (Categories && Categories.length) {
			let categories_params_arr = []

			Categories.forEach(item => {
				categories_params_arr.push(`categories=${item.Id}`)
			})

			params += `${this.addParamsSeparator(params)}${categories_params_arr.join("&")}`
		}

		if (Warehouses && Warehouses.length) {
			let warehouses_params_arr = []

			Warehouses.forEach(item => {
				warehouses_params_arr.push(`warehouses=${item.Id}`)
			})

			params += `${this.addParamsSeparator(params)}${warehouses_params_arr.join("&")}`
		}

		if (Countries && Countries.length) {
			let countries_params_arr = []

			Countries.map(item => item.Id).forEach(item => {
				countries_params_arr.push(`countries=${item}`)
			})

			params += `${this.addParamsSeparator(params)}${countries_params_arr.join("&")}`
		}

		if (DiscountType) {
			params += `${this.addParamsSeparator(params)}typeId=${DiscountType.Id}`
		}

		if (CustomerType) {
			params += `${this.addParamsSeparator(params)}customerTypeId=${CustomerType.Id}`
		}

		if (Courier) {
			params += `${this.addParamsSeparator(params)}courierPicingId=${Courier.Id}`
		}

		return params
	}
	onPressClose = () => {
		if (this.state.searchingFor == '') {
			this.setState({ showSearch: !this.state.showSearch })
		} else {
			this.setState({ searchingFor: '' })
		}
	}

	renderSearch = () => {
		return (
			<SearchBar
				onPressClose={this.onPressClose}
				visible={this.state.showSearch}
				autoFocus={false}
				onSubmitEditing={(text) => {
					this.setState({ searchingFor: text })
				}} />
		)
	}

	render() {
		const { translate } = this.props
		return (
			<LazyContainer style={{ flex: 1, backgroundColor: "#FFF" }}>
				<CustomHeader
					leftComponent="drawer"
					navigation={this.props.navigation}
					title="Discounts"
					rightNumOfItems={3}
					rightComponent={
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'center',
							}}>
							<CustomTouchable
								onPress={() => {
									this.setState({ showSearch: !this.state.showSearch })
								}}
								style={{
									flexDirection: 'row',
									justifyContent: 'center',
									alignItems: 'center',
									// padding: headerButtonPadding * 1.5,
									flex: 1,
								}}>
								<Ionicons
									name={`ios-search`}
									size={24}
									color={'white'} />
							</CustomTouchable>
							<CustomTouchable
								onPress={() => {
									const {
										Active,
										Brands,
										Categories,
										Warehouses,
										Countries,
										DiscountType,
										CustomerType,
										Courier,
										searchingFor,
									} = this.state

									this.props.navigation.navigate('DiscountsFilters', {
										onResponse: this.onFiltersResponse,
										currentFilters: {
											Active,
											Brands,
											Categories,
											Warehouses,
											Countries,
											DiscountType,
											CustomerType,
											Courier,
											searchingFor,
										}
									})
								}}
								style={{
									flexDirection: 'row',
									justifyContent: 'center',
									alignItems: 'center',
									// padding: headerButtonPadding * 1.5,
									flex: 1,
								}}>
								<FontAwesome
									name={`filter`}
									size={22}
									color={'white'} />
							</CustomTouchable>

								<CustomTouchable
									onPress={() => {
										this.props.navigation.navigate('Discount', {
											onChildChange: this.onChildChange,
											AddMew: true
										})
									}}
									style={{
										flexDirection: 'row',
										justifyContent: 'center',
										alignItems: 'center',
										// padding: headerButtonPadding * 1.5,
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


				<CustomSelectorForDeleteAndEdit
					showCustomSelectorForDeleteref={this.state.showCustomSelectorForDeleteref}
					justForDelete={true}
					onCancelDelete={() => {
						this.setState({ showCustomSelectorForDeleteref: false })
					}}
					onCancelConfirm={() => {
						this.setState({ showCustomSelectorForDeleteref: false })
					}}
					onDelete={() => {
						this.setState({ Loading: true, showCustomSelectorForDeleteref: false })
						DeleteDiscount(this.DeleteOrEditId, () => {
							this.setState({
								data: this.state.data.filter(filterItem => filterItem.Id !== this.DeleteOrEditId),
								showCustomSelectorForDeleteref: false,
								Loading: false
							})
							LongToast('dataDeleted')
						}, () => {
							this.setState({ Loading: false })
						})
					}}
				/>

				<RemoteDataContainer
					url={"Discounts"}
					params={this.getRequestParams()}
					cacheName={"discounts"}
					onDataFetched={(data) => {
						this.setState({ data })
					}}
					updatedData={this.state.data}
					triggerRefresh={this.state.triggerRefresh}
					keyExtractor={({ Id }) => `${Id}`}
					ItemSeparatorComponent={() => <ItemSeparator />}
					renderItem={this.renderItem} />
			</LazyContainer>
		)
	}
}

export default withLocalize(Discounts)