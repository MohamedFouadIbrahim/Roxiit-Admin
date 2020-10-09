import React, { Component } from 'react';
import { withLocalize } from 'react-localize-redux';
import { ScrollView } from 'react-native';
import ArrowItem from '../../components/ArrowItem/index.js';
import LazyContainer from '../../components/LazyContainer';
import { SelectEntity } from '../../utils/EntitySelector';

class WarehouseUsers extends Component {
	constructor() {
		super()

		this.tabIndex = 1
		// const { Id } = this.props.route.params?

		// this.warehouseId = Id
	}
	state = {
		ApplyForProduct: [],
	}




	renderContent = () => {
		const {
			translate,
		} = this.props
		const { ApplyForProduct } = this.state;
		return (
			<ScrollView
				contentContainerStyle={{
				}}

			>
				<ArrowItem
					onPress={() => {

					}}
					title={'Users'}
					info={ApplyForProduct.length || translate('NoneSelected')} />



			</ScrollView>
		)
	}

	render() {
		return (
			<LazyContainer style={{ flex: 1, backgroundColor: "white" }} navigation={this.props.navigation}>
				{this.renderContent()}
			</LazyContainer>
		)
	}
}

export default withLocalize(WarehouseUsers)