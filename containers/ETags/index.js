import React, { Component } from 'react'
import { View } from 'react-native'
import CustomHeader, { secondHeaderIconSize } from '../../components/CustomHeader/index.js';
import LazyContainer from '../../components/LazyContainer'
import RemoteDataContainer from '../../components/RemoteDataContainer/index.js';
import ItemSeparator from '../../components/ItemSeparator/index.js';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { DeleteETag } from '../../services/EtagsService.js';
import SearchBar from '../../components/SearchBar/index.js';
import { withLocalize } from 'react-localize-redux';
import CustomSelectorForDeleteAndEdit from '../../components/CustomSelectorForDeleteAndEdit/index';
import ETagItem from './ETagItem.js';
import { LongToast } from '../../utils/Toast.js';
import CustomTouchable from '../../components/CustomTouchable';
import { isValidSearchKeyword } from '../../utils/Validation.js';

class ETags extends Component {
	constructor(props) {
		super(props)
		this.state = {
			data: null,
			triggerRefresh: false,
			searchingFor: "",
			showCustomSelectorForDeleteref: false,
			Loading: false
		}
	}

	onPressItem = (item) => {
		const { Id } = item
		this.props.navigation.navigate('EtagScreen', {
			etagId: Id,
			onChildChange: this.onChildChange
		})
	}

	onLongPressItem = (item) => {
		const { Id } = item
		this.DeleteOrEditId = Id
		this.setState({ showCustomSelectorForDeleteref: true })
	}

	renderItem = ({ item }) => {
		return (
			<ETagItem
				item={item}
				onPress={this.onPressItem}
				onLongPress={this.onLongPressItem} />
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
		return (
			<LazyContainer style={{ flex: 1, backgroundColor: "#FFF" }}>
				<CustomHeader
					leftComponent="drawer"
					navigation={this.props.navigation}
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
									flex: 1,
									// padding: headerButtonPadding,
								}}>
								<Ionicons
									name={`ios-search`}
									size={24}
									color={'white'} />
							</CustomTouchable>

						
								<CustomTouchable
									onPress={() => this.props.navigation.navigate('EtagScreen', { onChildChange: this.onChildChange })}
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
						</View>
					}
					title="ETags" />

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

						DeleteETag(this.DeleteOrEditId, () => {
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
					url={"ETags"}
					// cacheName={"brands"}
					triggerRefresh={this.state.triggerRefresh}
					params={this.getParams()}
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
export default withLocalize(ETags)