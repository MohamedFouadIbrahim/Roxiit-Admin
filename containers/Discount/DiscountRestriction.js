import React, { Component } from 'react'
import { ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import LazyContainer from '../../components/LazyContainer'
import ItemSeparator from '../../components/ItemSeparator/index.js';
import ArrowItem from '../../components/ArrowItem/index.js';
import HorizontalInput from '../../components/HorizontalInput';
import { SelectEntity } from '../../utils/EntitySelector';
import { withLocalize } from 'react-localize-redux';
import { SelectCountry } from '../../utils/Places';
import { GetCustomerStatus } from '../../services/CustomersService';

class DiscountRestriction extends Component {
	constructor() {
		super()

		this.tabIndex = 2
	}

	componentDidMount() {
		const {
			SpentAmountRestriction
		} = this.props.data

		this.setState({
			SpentAmountRestriction,
		})
	}


	renderContent = () => {
		const {
			translate,
		} = this.props

		const { CustomerRoles, SpentAmountRestriction } = this.state
		const {
			CustomerRoleRestriction,
			CustomerRestriction,
			ToCountryRestriction,
		} = this.props.data

		return (
			<ScrollView
				contentContainerStyle={{
				}}>
				<HorizontalInput
					label="SpentAmountRestriction"
					keyboardType="numeric"
					value={`${SpentAmountRestriction ? SpentAmountRestriction : ''}`}
					onChangeText={(text) => {
						this.setState({
							SpentAmountRestriction: text
						}, () => {
							this.props.onTabDataChange(this.tabIndex, {
								...this.props.data,
								SpentAmountRestriction: text,
							}, false)
						})

					}} />

				<ItemSeparator />

				<ArrowItem
					onPress={() => {
						GetCustomerStatus(langId = null, res => {
							SelectEntity(this.props.navigation, data => {
								this.props.onTabDataChange(this.tabIndex, {
									...this.props.data,
									CustomerRoleRestriction: data,
								})
							}, null, null, false, 2, CustomerRoleRestriction, { initialData: res.data })
						})
					}}
					title={'Roles'}
					info={CustomerRoleRestriction.length || translate('NoneSelected')} />

				<ItemSeparator />

				<ArrowItem
					onPress={() => {
						SelectEntity(this.props.navigation, data => {
							this.props.onTabDataChange(this.tabIndex, {
								...this.props.data,
								CustomerRestriction: data,
							})
						}, 'Customers/Simple', null, true, 2, CustomerRestriction, { pagination: true })
					}}
					title={'Customers'}
					info={CustomerRestriction.length || translate('NoneSelected')} />

				<ItemSeparator />

				<ArrowItem
					onPress={() => {
						SelectCountry(this.props.navigation, data => {
							this.props.onTabDataChange(this.tabIndex, {
								...this.props.data,
								ToCountryRestriction: data,
							})
						}, true, ToCountryRestriction)
					}}
					title={'Countries'}
					info={ToCountryRestriction.length || translate('NoneSelected')} />
			</ScrollView>
		)
	}

	render() {
		return (
			<LazyContainer style={{ flex: 1, backgroundColor: "white" }}>
				{
					Platform.OS == 'ios' ?

						<KeyboardAvoidingView behavior='padding' enabled
							style={{ flex: 1 }}
							keyboardVerticalOffset={40}
						>
							{this.renderContent()}
						</KeyboardAvoidingView> :

						this.renderContent()

				}
				{/* {this.renderContent()} */}
			</LazyContainer>
		)
	}
}

export default withLocalize(DiscountRestriction)