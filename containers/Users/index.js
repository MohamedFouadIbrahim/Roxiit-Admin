import React, { Component } from 'react'
import { View, BackHandler } from 'react-native'
import CustomHeader, { secondHeaderIconSize } from '../../components/CustomHeader/index.js';
import LazyContainer from '../../components/LazyContainer'
import RemoteDataContainer from '../../components/RemoteDataContainer/index.js';
import ItemSeparator from '../../components/ItemSeparator/index.js';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { DeleteUser } from '../../services/UsersService.js';
import SearchBar from '../../components/SearchBar/index.js';
import CustomSelectorForDeleteAndEdit from '../../components/CustomSelectorForDeleteAndEdit/index';
import UserItem from './UserItem.js';
import CustomTouchable from '../../components/CustomTouchable';
import { isValidSearchKeyword } from '../../utils/Validation.js';

export default class Users extends Component {
	constructor(props) {
		super(props)
		this.CustomSelectorForDeleteref = React.createRef()
		this.state = {
			data: null,
			triggerRefresh: false,
			searchBarShown: false,
			searchingFor: '',
			showCustomSelectorForDeleteref: false,
			Loading: false,
			params: null
		}
	}

	componentDidMount() {
		this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
			this.props.route.params?.onChildChange && this.props.route.params?.onChildChange()
			this.props.navigation.goBack()
			return true
		});
	}

	componentWillUnmount() {
		this.backHandler.remove()
	}


	onPressItem = (item) => {
		const { Id } = item
		if (this.props.route.params && this.props.route.params.forceNavigateToUserChat == true) {
			this.props.navigation.navigate('OrderChat', {
				fromUser: true,
				ToUser: Id,
				onChildChange: this.onChildChange,
			})

		} else {
			this.props.navigation.navigate('UserHome', {
				Id,
				onChildChange: this.onChildChange,
			})
		}
	}

	onLongPressItem = (item) => {
		const { Id } = item
		this.DeleteOrEditId = Id
		this.setState({ showCustomSelectorForDeleteref: true })
	}

	renderItem = ({ item }) => {
		return (
			<UserItem
				item={item}
				onPress={this.onPressItem}
				onLongPress={this.onLongPressItem} />
		)
	}

	onChildChange = () => {
		this.setState({ triggerRefresh: !this.state.triggerRefresh })
	}

	getRequestParams = () => {
		const { searchingFor } = this.state
		let Params = ''

		if (this.state.params) {
			Params += this.state.params
		}

		if (isValidSearchKeyword(searchingFor)) {
			Params += `${this.addParamsSeparator(Params)}search=${this.state.searchingFor}`
		}

		if (this.props.route.params && this.props.route.params?.SubSToreId) {
			Params += `${this.addParamsSeparator(Params)}SubSToreId=${this.props.route.params?.SubSToreId}`
		}

		return Params
	}

	addParamsSeparator = (params) => {
		return params.length ? '&' : ''
	}

	renderSearch = () => {
		return (
			<SearchBar
				visible={this.state.searchBarShown}
				onPressClose={() => { this.setState({ searchBarShown: !this.state.searchBarShown }) }}
				onSubmitEditing={(text) => {
					this.setState({ searchingFor: text })
				}} />
		)
	}

	render() {
		return (
			<LazyContainer style={{ flex: 1, backgroundColor: "#FFF" }}>
				<CustomHeader
					leftComponent={this.props.route.params && this.props.route.params?.forceNavigateToUserChat == true ? 'back' : "drawer"}
					onBack={() => {
						this.props.route.params?.onChildChange && this.props.route.params.onChildChange()
					}}
					navigation={this.props.navigation}
					title="Users"
					rightNumOfItems={2}
					rightComponent={
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'center',
							}}>
							<CustomTouchable
								onPress={() => { this.setState({ searchBarShown: !this.state.searchBarShown }) }}
								style={{
									flexDirection: 'row',
									justifyContent: 'center',
									alignItems: 'center',
									flex: 1
								}}>
								<Ionicons
									name={`ios-search`}
									size={24}
									color={'white'} />
							</CustomTouchable>
							<CustomTouchable
								onPress={() => { this.props.navigation.navigate('AddUser', { onChildChange: this.onChildChange }) }}
								style={{
									flexDirection: 'row',
									justifyContent: 'center',
									alignItems: 'center',
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
						this.setState({ showCustomSelectorForDeleteref: false })
						DeleteUser(this.DeleteOrEditId, () => {
							this.setState({
								data: this.state.data.filter(filterItem => filterItem.Id !== this.DeleteOrEditId),
								showCustomSelectorForDeleteref: false,
								Loading: false
							})
						}, () => { this.setState({ Loading: false }) })
					}}
				/>
				<RemoteDataContainer
					url={"Users"}
					params={this.getRequestParams()}
					cacheName={"users"}
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