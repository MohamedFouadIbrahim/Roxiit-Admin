import React, { Component } from 'react'
import CustomHeader from '../../components/CustomHeader'
import HeaderSubmitButton from '../../components/HeaderSubmitButton'
import LazyContainer from '../../components/LazyContainer'
import MultiLevelSelectorItem from './MultiLevelSelectorItem'
import SearchBar from '../../components/SearchBar'
import RemoteDataContainer from '../../components/RemoteDataContainer'
import { isValidSearchKeyword } from '../../utils/Validation'
import { View } from 'react-native'
import { largePagePadding, largeBorderRadius, pagePadding } from '../../constants/Style'
import CustomTouchable from '../../components/CustomTouchable'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { mainColor } from '../../constants/Colors'
import FontedText from '../../components/FontedText'

class MultiLevelSelector extends Component {
	constructor(props) {
		super(props)
		this.props.route.params?.onParentSelectionChange
		this.parentId = this.props.route.params?.Id
		this.callback = this.props.route.params?.callback
		this.first_dest_url = this.props.route.params?.first_dest_url
		this.second_dest_url = this.props.route.params?.second_dest_url
		this.options = this.props.route.params?.options
		this.selection = this.props.route.params?.selection
		this.onParentSelectionChange = this.props.route.params?.onParentSelectionChange

		if (this.options) {
			const {
				canSelectParents = true,
			} = this.options

			this.canSelectParents = canSelectParents
		}
		else {
			this.canSelectParents = true
		}

		this.state = {
			selected_items: this.props.route.params?.selected_items || [],
			searchingFor: null,
			data: [],
		}
	}

	submit = () => {
		this.props.navigation.goBack()

		if (!this.parentId) {
			this.callback && this.callback(this.state.selected_items)
		}
	}

	onSelect = (item) => {
		if (this.selection === 2) {
			let updatedIsSelected

			const data = this.state.data.map(mapItem => {
				if (mapItem.Id === item.Id) {
				updatedIsSelected = !mapItem.isSelected

					return {
						...mapItem,
						isSelected: updatedIsSelected,
					}
				}
				else {
					return mapItem
				}
			})

			this.onSelectionChange(item, updatedIsSelected)

			this.setState({
				data,
			})
		}
		else if (this.selection === 1) {
			this.callback && this.callback(item)
			this.props.navigation.goBack()
		}
	}

	onSelectionChange = (item, is_selected) => {
		if (is_selected) {
			if (!this.state.selected_items.map(mapItem => mapItem.Id).includes(item.Id)) {
				this.setState({
					selected_items: [
						...this.state.selected_items,
						item,
					]
				})
			}
		}
		else {
			const data = this.state.data.map(mapItem => mapItem.Id === item.Id ? ({
				...mapItem,
				isSelected: false,
			}) : mapItem)

			this.setState({
				selected_items: this.state.selected_items.filter(filterItem => filterItem.Id !== item.Id),
				data,
			})
		}

		this.onParentSelectionChange && this.onParentSelectionChange(item, is_selected)
	}

	onPressItem = (item, index) => {
		const {
			first_dest_url,
			second_dest_url,
			options,
		} = this

		const {
			isSelected,
			hasChildren,
			Id
		} = item

		if (hasChildren && !isSelected) {
			const {
				selection,
			} = this

			const {
				selected_items,
			} = this.state

			this.props.navigation.push('MultiLevelSelector', {
				Id,
				first_dest_url,
				second_dest_url,
				selection,
				selected_items,
				callback: this.submit,
				onParentSelectionChange: this.onSelectionChange,
				options,
			})
		}
		else {
			this.onSelect(item, index)
		}
	}

	renderItem = ({ item, index }) => {
		const {
			canSelectParents,
		} = this

		return (
			<MultiLevelSelectorItem
				item={item}
				index={index}
				canSelectParents={canSelectParents}
				onPress={this.onPressItem}
				onSelect={this.onSelect} />
		)
	}

	onSearch = (text) => {
		this.setState({ searchingFor: text })
	}

	renderSearch = () => {
		return (
			<SearchBar
				visible={true}
				autoFocus={false}
				onSubmitEditing={this.onSearch} />
		)
	}

	getRequestParams = () => {
		let params = this.parentId ? `parentId=${this.parentId}` : `parentId=0`

		const { searchingFor } = this.state

		if (isValidSearchKeyword(searchingFor)) {
			params += `&search=${searchingFor}`
		}

		return params
	}

	onPressListHeaderItem = (item) => {
		this.onSelect(item)
	}

	renderListHeaderItem = (item, index) => {
		const {
			Name
		} = item

		return (
			<CustomTouchable
				key={index}
				onPress={() => this.onPressListHeaderItem(item)}
				style={{
					borderRadius: largeBorderRadius,
					paddingHorizontal: 10,
					paddingVertical: 5,
					backgroundColor: mainColor,
					flexDirection: 'row',
					justifyContent: 'center',
					alignItems: 'center',
					marginTop: 5,
					marginRight: 5,
				}}>
				<FontedText style={{ fontSize: 12, color: "white" }}>{Name}</FontedText>
				<Ionicons name="ios-close-circle-outline" color={"white"} size={18} style={{ marginLeft: 5 }} />
			</CustomTouchable>
		)
	}

	renderListHeader = () => {
		if (this.selection === 2 && this.state.selected_items.length) {
			return (
				<View
					style={{
						paddingTop: 15,
						paddingHorizontal: largePagePadding,
						paddingBottom: pagePadding,
						flexDirection: 'row',
						flexWrap: 'wrap',
					}}>
					{this.state.selected_items.map(this.renderListHeaderItem)}
				</View>
			)
		}
		else {
			return null
		}
	}

	renderContent = () => {
		const {
			parentId,
			first_dest_url,
			second_dest_url,
		} = this

		const target_url = second_dest_url ? (parentId ? second_dest_url : first_dest_url) : first_dest_url

		return (
			<RemoteDataContainer
				ListHeaderComponent={this.renderListHeader}
				url={target_url}
				params={this.getRequestParams()}
				pagination={true}
				onDataFetched={(data) => {
					if (this.selection === 2 && this.state.selected_items.length) {
						const selected_items_ids = this.state.selected_items.map(item => item.Id)
						data = data.map(item => selected_items_ids.includes(item.Id) ? ({ ...item, isSelected: true, }) : item)
					}

					this.setState({
						data,
					})
				}}
				updatedData={this.state.data}
				keyExtractor={(item) => String(item.Id)}
				renderItem={this.renderItem} />
		)
	}

	renderRightComponent = () => {
		if (this.selection === 2 && !this.parentId) {
			return (
				<HeaderSubmitButton
					isLoading={false}
					didSucceed={this.state.didSucceed}
					onPress={this.submit} />
			)
		}
		else {
			return null
		}
	}

	render () {
		return (
			<LazyContainer style={{ flex: 1, backgroundColor: "#FFF" }}>
				<CustomHeader
					title="Select"
					leftComponent="back"
					navigation={this.props.navigation}
					rightNumOfItems={1}
					rightComponent={this.renderRightComponent()} />

				{this.renderSearch()}
				{this.renderContent()}
			</LazyContainer>
		)
	}
}

export default MultiLevelSelector