import React, { Component } from 'react'
import { ScrollView } from 'react-native'
import CustomHeader from '../../components/CustomHeader/index.js';
import LazyContainer from '../../components/LazyContainer'
import ItemSeparator from '../../components/ItemSeparator/index.js';
import { withLocalize } from 'react-localize-redux';
import HeaderSubmitButton from '../../components/HeaderSubmitButton/index.js';
import ArrowItem from '../../components/ArrowItem/index.js';
import { getFilters } from '../../services/FilterService.js';
import CustomSelector from '../../components/CustomSelector/index.js';
import { SelectCountry } from '../../utils/Places.js';
import { SelectEntity } from '../../utils/EntitySelector.js';
import { largePagePadding } from '../../constants/Style.js';
import CustomButton from '../../components/CustomButton/index.js';

class DiscountsFilters extends Component {
	constructor(props) {
		super(props)

		if (this.props.route.params) {
			this.currentFilters = this.props.route.params?.currentFilters
			Object.keys(this.currentFilters).forEach((key) => (this.currentFilters[key] == null) && delete this.currentFilters[key])
		}

		this.defaultFilters = {
			Active: 2,
			Brands: [],
			Categories: [],
			Warehouses: [],
			Countries: [],
			CustomerType: null,
			Courier: null,
			DiscountType: null,
		}

		this.state = {
			...this.defaultFilters,
			...this.currentFilters,
			didFetchData: false,
		}

		const { translate } = this.props

		this.activeNames = [
			translate('Inactive'),
			translate('Active'),
			translate('Both')
		]

		this.activeSelectorRef = React.createRef();
		this.customerTypesSelectorRef = React.createRef();
		this.couriersSelectorRef = React.createRef();
		this.discountTypesSelectorRef = React.createRef();
	}

	componentDidMount() {
		this.cancelFetchData = getFilters({
			discountTypes: true,
			couriers: true,
			customerTypes: true,
		}, res => {
			this.setState({
				...res.data,
				didFetchData: true,
			})
		})
	}

	submit = () => {
		const {
			Active,
			Brands,
			Categories,
			Warehouses,
			Countries,
			CustomerType,
			Courier,
			DiscountType,
		} = this.state

		const response = {
			Active,
			Brands,
			Categories,
			Warehouses,
			Countries,
			CustomerType,
			Courier,
			DiscountType,
		}

		this.props.route.params
			&& this.props.route.params?.onResponse
			&& this.props.route.params?.onResponse(response)

		this.props.navigation.goBack()
	}

	renderContent = () => {
		if (this.state.didFetchData) {
			const { translate } = this.props

			const {
				Active,
				Brands,
				Categories,
				Warehouses,
				Countries,
				CustomerType,
				Courier,
				DiscountType,
			} = this.state

			return (
				<ScrollView
					contentContainerStyle={{
					}}>
					<ArrowItem
						onPress={() => {
							this.activeSelectorRef.current.show()
						}}
						title={'Active'}
						info={this.activeNames[Active]} />

					<ItemSeparator />

					<ArrowItem
						onPress={() => {
							this.customerTypesSelectorRef.current.show()
						}}
						title={'CustomerType'}
						info={CustomerType ? CustomerType.Name : translate('NoneSelected')} />

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
							this.discountTypesSelectorRef.current.show()
						}}
						title={'DiscountType'}
						info={DiscountType ? DiscountType.Name : translate('NoneSelected')} />

					<ItemSeparator />

					<ArrowItem
						onPress={() => {
							SelectCountry(this.props.navigation, data => {
								this.setState({ Countries: data })
							}, true, Countries)
						}}
						title={'Countries'}
						info={Countries.length || translate('NoneSelected')} />

					<ItemSeparator />

					<ArrowItem
						onPress={() => {
							SelectEntity(this.props.navigation, data => {
								this.setState({ Brands: data })
							}, 'Brands/Simple', null, false, 2, this.state.Brands)
						}}
						title={'Brands'}
						info={Brands.length || translate('NoneSelected')} />

					<ItemSeparator />

					<ArrowItem
						onPress={() => {
							SelectEntity(this.props.navigation, data => {
								this.setState({ Categories: data })
							}, 'Categories/Simple', null, true, 2, this.state.Categories)
						}}
						title={'Categories'}
						info={Categories.length || translate('NoneSelected')} />

					<ItemSeparator />

					<ArrowItem
						onPress={() => {
							SelectEntity(this.props.navigation, data => {
								this.setState({ Warehouses: data })
							}, 'Warehouses/Simple', null, false, 2, this.state.Warehouses)
						}}
						title={'Warehouses'}
						info={Warehouses.length || translate('NoneSelected')} />

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
			CustomerTypes,
			Couriers,
			DiscountTypeList,
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

				<CustomSelector
					ref={this.activeSelectorRef}
					options={this.activeNames}
					onSelect={(index) => { this.setState({ Active: index }) }}
				/>

				{CustomerTypes && <CustomSelector
					ref={this.customerTypesSelectorRef}
					options={CustomerTypes.map(item => item.Name)}
					onSelect={(index) => { this.setState({ CustomerType: CustomerTypes[index] }) }}
					onDismiss={() => { }}
				/>}


				{Couriers && <CustomSelector
					ref={this.couriersSelectorRef}
					options={Couriers.map(item => item.Name)}
					onSelect={(index) => { this.setState({ Courier: Couriers[index] }) }}
					onDismiss={() => { }}
				/>}


				{DiscountTypeList && <CustomSelector
					ref={this.discountTypesSelectorRef}
					options={DiscountTypeList.map(item => item.Name)}
					onSelect={(index) => { this.setState({ DiscountType: DiscountTypeList[index] }) }}
					onDismiss={() => { }}
				/>}
			</LazyContainer>
		)
	}
}

export default withLocalize(DiscountsFilters)