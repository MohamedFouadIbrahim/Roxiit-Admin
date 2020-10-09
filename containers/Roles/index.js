import React, { Component } from 'react'
import { View } from 'react-native'
import CustomHeader, { secondHeaderIconSize } from '../../components/CustomHeader/index.js';
import LazyContainer from '../../components/LazyContainer'
import RemoteDataContainer from '../../components/RemoteDataContainer/index.js';
import DeleteButton from '../../components/DeleteButton/index.js';
import ItemSeparator from '../../components/ItemSeparator/index.js';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { DeleteRole } from '../../services/RolesService.js';
import { withLocalize } from 'react-localize-redux';
import CustomSelectorForDeleteAndEdit from '../../components/CustomSelectorForDeleteAndEdit/index';
import RoleItem from './RoleItem.js';
import { LongToast } from '../../utils/Toast.js';
import CustomTouchable from '../../components/CustomTouchable';

class Roles extends Component {
	constructor() {
		super()
		this.state = {
			data: null,
			triggerRefresh: false,
			showCustomSelectorForDeleteref: false,
			Loading: false
		}
	}

	onPressItem = (item) => {
		const { Id } = item
		this.props.navigation.navigate('Role', {
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
			<RoleItem
				item={item}
				onPress={this.onPressItem}
				onLongPress={this.onLongPressItem} />
		)
	}

	renderDeletebutton = (item) => {
		const { Id } = item

		return (
			<View
				style={{
					justifyContent: 'center',
					alignItems: 'flex-end',
					height: '100%',
					padding: 20,
				}}>
				<DeleteButton
					onPress={() => {
						DeleteRole(Id, () => {
							this.setState({
								data: this.state.data.filter(filterItem => filterItem.Id !== Id),
							})
						}, err => {
							if (err.status === 400) {
								const { translate } = this.props;
								LongToast('MustHaveOneRole')
								return true
							}
						})
					}} />
			</View>
		)
	}

	onChildChange = () => {
		this.setState({ triggerRefresh: !this.state.triggerRefresh })
	}

	render() {
		const { translate } = this.props;

		return (
			<LazyContainer style={{ flex: 1, backgroundColor: "#FFF" }}>
				<CustomHeader
					leftComponent="drawer"
					navigation={this.props.navigation}
					title="Roles"
					rightComponent={
						<CustomTouchable
							onPress={() => { this.props.navigation.navigate('Role', { onChildChange: this.onChildChange }) }}
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

						DeleteRole(this.DeleteOrEditId, () => {
							this.setState({
								data: this.state.data.filter(filterItem => filterItem.Id !== this.DeleteOrEditId),
								showCustomSelectorForDeleteref: false,
								Loading: false
							})
							LongToast('dataDeleted')
						}, err => {
							if (err.status === 400) {
								LongToast('MustHaveOneRole')
								return true
							}
						})
					}}
				/>

				<RemoteDataContainer
					url={"Roles"}
					cacheName={"roles"}
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

export default withLocalize(Roles)