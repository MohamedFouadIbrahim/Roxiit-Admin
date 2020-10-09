import React, { Component } from 'react'
import { View } from 'react-native'
import CustomHeader from '../../components/CustomHeader/index.js';
import LazyContainer from '../../components/LazyContainer'
import RemoteDataContainer from '../../components/RemoteDataContainer/index.js';
import DeleteButton from '../../components/DeleteButton/index.js';
import ItemSeparator from '../../components/ItemSeparator/index.js';
import SearchBar from '../../components/SearchBar/index.js';
import Menu, { MenuItem } from 'react-native-material-menu';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { DELETE } from '../../utils/Network.js';
import { withLocalize } from 'react-localize-redux';
import CustomSelectorForDeleteAndEdit from '../../components/CustomSelectorForDeleteAndEdit/index';
import SessionItem from './SessionItem.js';
import { LongToast } from '../../utils/Toast.js';
import CustomTouchable from '../../components/CustomTouchable';
import { isValidSearchKeyword } from '../../utils/Validation.js';

class Sessions extends Component {
	constructor(props) {
		super(props)
		const { Id } = this.props.route.params
		this.userId = Id
		this.state = {
			data: null,
			triggerRefresh: false,
			searchingFor: ""
		}
	}

	_menu = null;
	setMenuRef = ref => {
		this._menu = ref;
	};

	hideMenu = () => {
		this._menu.hide();
		this.deleteAllSession()
	};

	showMenu = () => {
		this._menu.show();
	};

	onLongPressItem = (item) => {
		const { Id } = item
		this.DeleteOrEditId = Id
		this.setState({ showCustomSelectorForDeleteref: true })
	}

	renderItem = ({ item }) => {
		return (
			<SessionItem
				item={item}
				onLongPress={this.onLongPressItem} />
		)
	}

	deleteAllSession = () => {
		DELETE(`DeleteAllSessions?userId=${this.userId}&DeleteCurrentSession=${false}`, (res) => {
			this.onChildChange()
		}, (err) => {
		})
	}

	renderDeletebutton = (item) => {
		const { Id } = item

		return (
			<View
				style={{
					justifyContent: 'center',
					alignItems: 'flex-end',
					height: '100%',
					// padding: 20,
				}}>
				<DeleteButton
					onPress={() => {
						DELETE(`DeleteSession?userId=${this.userId}&sessionId=${Id}`, (res) => {
							this.onChildChange()
						}, (err) => {
						})
					}} />
			</View>
		)
	}

	getParams = () => {
		if (isValidSearchKeyword(this.state.searchingFor)) {
			return `search=${this.state.searchingFor}`
		} else {
			return null
		}
	}
	renderSearch = () => {
		return (
			<SearchBar
				visible={this.state.searchBarShown}
				onPressClose={() => { this.setState({ searchBarShown: !this.state.searchBarShown }) }}
				onSubmitEditing={(searchingFor) => {
					this.setState({ searchingFor })
				}} />
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
					title="Sessions"
					rightComponent={
						<Menu
							ref={this.setMenuRef}
							button={<CustomTouchable onPress={this.showMenu} style={{}}><MaterialCommunityIcons size={23} name="dots-vertical" color="#FFF" /></CustomTouchable>}
						>
							<MenuItem onPress={this.hideMenu}>Delete All Sessions</MenuItem>
						</Menu>
					}
				/>

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
						DELETE(`DeleteSession?userId=${this.userId}&sessionId=${this.DeleteOrEditId}`, (res) => {
							this.setState({
								triggerRefresh: !this.state.triggerRefresh,
								showCustomSelectorForDeleteref: false,
								Loading: false
							})
							LongToast('dataDeleted')

						}, (err) => {
							// alert(err)
							this.setState({ Loading: false })
						})
					}}
				/>
				<RemoteDataContainer
					url={"Sessions"}
					cacheName={"sessions"}
					triggerRefresh={this.state.triggerRefresh}
					params={`userId=${this.userId}`}
					onDataFetched={(data) => {
						this.setState({ data })
					}}
					updatedData={this.state.data}
					keyExtractor={({ Id }) => `${Id}`}
					ItemSeparatorComponent={() => <ItemSeparator />}
					renderItem={this.renderItem} />
			</LazyContainer>
		)
	}
}
export default withLocalize(Sessions)
