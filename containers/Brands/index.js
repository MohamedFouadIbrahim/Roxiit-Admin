import React, { Component } from 'react'
import CustomHeader, { secondHeaderIconSize } from '../../components/CustomHeader/index.js';
import LazyContainer from '../../components/LazyContainer'
import RemoteDataContainer from '../../components/RemoteDataContainer/index.js';
import ItemSeparator from '../../components/ItemSeparator/index.js';
import { DeleteBrand } from '../../services/BrandsService.js';
import Ionicons from 'react-native-vector-icons/Ionicons'
import CustomSelectorForDeleteAndEdit from '../../components/CustomSelectorForDeleteAndEdit/index';
import { withLocalize } from 'react-localize-redux';
import BrandItem from './BrandItem.js';
import { LongToast } from '../../utils/Toast.js';
import CustomTouchable from '../../components/CustomTouchable';

class Brands extends Component {
	constructor() {
		super()

		this.state = {
			data: null,
			triggerRefresh: false,
			showCustomSelectorForDeleteref: false,
			loading: false
		}
	}

	onPressItem = (item) => {
		const { Id } = item
		this.props.navigation.navigate('Brand', {
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
			<BrandItem
				item={item}
				onPress={this.onPressItem}
				onLongPress={this.onLongPressItem} />
		)
	}

	onChildChange = () => {
		this.setState({ triggerRefresh: !this.state.triggerRefresh })
	}

	render() {
		const { translate } = this.props
		return (
			<LazyContainer style={{ flex: 1, backgroundColor: "#FFF" }}>
				<CustomHeader
					leftComponent="drawer"
					navigation={this.props.navigation}
					title="Brands"
					rightComponent={
						<CustomTouchable
							onPress={() => { this.props.navigation.navigate('Brand', { onChildChange: this.onChildChange }) }}
							style={{
								flexDirection: 'row',
								justifyContent: 'center',
								alignItems: 'center',
								flex: 1,
								// padding: headerButtonPadding,
							}}>
							<Ionicons
								name={`ios-add`}
								size={secondHeaderIconSize}
								color={'white'} />
						</CustomTouchable>
					} />


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
						DeleteBrand(this.DeleteOrEditId, () => {
							this.setState({
								data: this.state.data.filter(filterItem => filterItem.Id !== this.DeleteOrEditId),
								showCustomSelectorForDeleteref: false,
								Loading: false
							})
							LongToast('dataDeleted')
						},
							() => {
								this.setState({ Loading: false })
							})
					}}
				/>

				<RemoteDataContainer
					url={"Brands"}
					cacheName={"brands"}
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
export default withLocalize(Brands)
