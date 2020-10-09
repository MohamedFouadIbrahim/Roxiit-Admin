import React, { Component } from 'react'
import { ScrollView } from 'react-native'
import LazyContainer from '../../components/LazyContainer'
import ItemSeparator from '../../components/ItemSeparator/index.js';
import ArrowItem from '../../components/ArrowItem/index.js';
import SwitchItem from '../../components/SwitchItem';
import { SelectEntity } from '../../utils/EntitySelector';
import { withLocalize } from 'react-localize-redux';

class DiscountApplyFor extends Component {
	constructor() {
		super()

		this.tabIndex = 1
	}

	renderContent = () => {
		const {
			translate,
		} = this.props

		const { 
			ApplyForChildCategory,
			ApplyForBrand,
			ApplyForCategory,
			ApplyForProduct,
		} = this.props.data
		
		
		return (
			<ScrollView
				contentContainerStyle={{
				}}>
				<ArrowItem
					onPress={() => {
						SelectEntity(this.props.navigation, data => {
							this.props.onTabDataChange(this.tabIndex, {
								...this.props.data,
								ApplyForProduct: data,
							})
						}, 'Products/Simple', null, true, 2, ApplyForProduct)
					}}
					title={'Products'}
					info={ApplyForProduct.length || translate('NoneSelected')} />

				<ItemSeparator />

				<ArrowItem
					onPress={() => {
						SelectEntity(this.props.navigation, data => {
							this.props.onTabDataChange(this.tabIndex, {
								...this.props.data,
								ApplyForBrand: data,
							})
						}, 'Brands/Simple', null, false, 2, ApplyForBrand)
					}}
					title={'Brands'}
					info={ApplyForBrand.length || translate('NoneSelected')} />

				<ItemSeparator />

				<ArrowItem
					onPress={() => {
						SelectEntity(this.props.navigation, data => {
							this.props.onTabDataChange(this.tabIndex, {
								...this.props.data,
								ApplyForCategory: data,
							})
						}, 'Categories/Simple', null, true, 2, ApplyForCategory)
					}}
					title={'Categories'}
					info={ApplyForCategory.length || translate('NoneSelected')} />

				<ItemSeparator />

				<SwitchItem
					title="ApplyForChildCategory"
					value={ApplyForChildCategory}
					onValueChange={(value) => {
						this.props.onTabDataChange(this.tabIndex, {
							...this.props.data,
							ApplyForChildCategory: value,
						})
					}} />
			</ScrollView>
		)
	}

	render() {
		return (
			<LazyContainer style={{ flex: 1, backgroundColor: "white" }}>
				{this.renderContent()}
			</LazyContainer>
		)
	}
}

export default withLocalize(DiscountApplyFor)