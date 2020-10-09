import React, { Component } from 'react'
import { View } from 'react-native'
import CustomHeader, { secondHeaderIconSize } from '../../components/CustomHeader/index.js';
import LazyContainer from '../../components/LazyContainer'
import RemoteDataContainer from '../../components/RemoteDataContainer/index.js';
import DeleteButton from '../../components/DeleteButton/index.js';
import ItemSeparator from '../../components/ItemSeparator/index.js';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { DeleteStory } from '../../services/StoriesService.js';
import { withLocalize } from 'react-localize-redux';
import CustomSelectorForDeleteAndEdit from '../../components/CustomSelectorForDeleteAndEdit/index';
import StoryItem from './StoryItem.js';
import { LongToast } from '../../utils/Toast.js';
import CustomTouchable from '../../components/CustomTouchable';
class Stories extends Component {
	constructor() {
		super()

		this.state = {
			data: null,
			triggerRefresh: false,
		}
	}

	onPressItem = (item) => {
		const { Id } = item
		this.props.navigation.navigate('Story', {
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
			<StoryItem
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
						DeleteStory(Id, () => {
							this.setState({
								data: this.state.data.filter(filterItem => filterItem.Id !== Id),
							})
						})
					}} />
			</View>
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
					title="Stories"
					rightComponent={
						<CustomTouchable
							onPress={() => {
								this.props.navigation.navigate('Story', { onChildChange: this.onChildChange })
							}}
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
						DeleteStory(this.DeleteOrEditId, () => {
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
					url={"Story/Index"}
					cacheName={"stories"}
					pagination={false}
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
export default withLocalize(Stories)
