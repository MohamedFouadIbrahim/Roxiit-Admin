import React, { Component } from 'react'
import { View, BackHandler } from 'react-native'
import LazyContainer from '../../components/LazyContainer'
import CustomHeader from '../../components/CustomHeader';
import RemoteDataContainer from '../../components/RemoteDataContainer';
import HeaderSubmitButton from '../../components/HeaderSubmitButton';
import SearchBar from '../../components/SearchBar';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import EntitySelectorItem from './EntitySelectorItem';
import CustomTouchable from '../../components/CustomTouchable';
import ItemSeparator from '../../components/ItemSeparator';
import { isValidSearchKeyword } from '../../utils/Validation';
import FontedText from '../../components/FontedText';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { largeBorderRadius, largePagePadding, pagePadding } from '../../constants/Style';
import { mainColor } from '../../constants/Colors';

export default class EntitySelector extends Component {
	constructor(props) {
		super(props)

		this.selectedItemsIds = []
		this.isAllSelected = false

		let selected_items = []

		if (this.props.route.params) {
			const {
				destination_url,
				destination_params,
				selection,
				selected_items: passed_selected_items,
				search,
				callback,
				options,
			} = this.props.route.params

			this.destination_url = destination_url
			this.destination_params = destination_params
			this.selection = selection
			this.search = search
			this.callback = callback

			selected_items = passed_selected_items
			
			if (options) {
				const { 
					ListEmptyComponent,
					itemTextColorModifier,
					itemBgColorModifier,
					forceSubmit,
					initialData,
					onSelectItem,
					pagination = false,
					reorder = false,
				} = options

				this.ListEmptyComponent = ListEmptyComponent
				this.itemTextColorModifier = itemTextColorModifier
				this.itemBgColorModifier = itemBgColorModifier
				this.forceSubmit = forceSubmit
				this.onSelectItem = onSelectItem
				this.pagination = pagination
				this.reorder = reorder

				if (selected_items.length && initialData.length) {
					const selected_items_ids = selected_items.map(item => item.Id)

					this.initialData = [
						...selected_items.map(item => ({ ...item, isSelected: true })),
						...initialData.filter(item => !selected_items_ids.includes(item.Id))
					]
				}
				else {
					this.initialData = initialData
				}
			}
			else {
				this.pagination = false
				this.reorder = false
			}
		}

		this.state = {
			data: [],
			isAllSelected: this.isAllSelected,
			selected_items,
		}
	}

	componentDidMount() {
		this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.onPressBack);

		if (this.initialData && !this.destination_url) {
			this.onDataFetched(this.initialData)
		}
	}

	componentWillUnmount() {
		this.backHandler.remove();
	}

	onPressBack = () => {
		if (this.forceSubmit) {
			this.submit()
			return true
		}

		return false
	}

	submit = () => {
		this.props.navigation.goBack()
		this.callback && this.callback(this.state.selected_items.map(item => ({ ...item, isSelected: true })))
	}

	onSelect = (item, index) => {
		if (this.onSelectItem && this.onSelectItem(item, index)) {
			
		}
		else {
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
			this.setState({
				selected_items: this.state.selected_items.filter(filterItem => filterItem.Id !== item.Id),
			})
		}
	}

	toggleSelectionAll = () => {
		const nextIsAllSelected = !this.isAllSelected
		this.isAllSelected = nextIsAllSelected

		this.setState({ 
			selected_items: nextIsAllSelected ? this.state.data : [],
			data: this.state.data.map(item => ({ ...item, isSelected: nextIsAllSelected })),
			isAllSelected: nextIsAllSelected,
		})
	}

	onPressItem = (item, index) => {
		this.onSelect(item, index)
	}

	renderItem = ({ item, index, move, moveEnd, isActive }) => {
		const {
			itemTextColorModifier,
			itemBgColorModifier,
			reorder,
		} = this

		return (
			<EntitySelectorItem
				item={item}
				itemTextColorModifier={itemTextColorModifier}
				index={index}
				reorder={reorder}
				move={move}
				moveEnd={moveEnd}
				isActive={isActive}
				onPress={this.onPressItem}
				bgColor={(itemBgColorModifier && itemBgColorModifier(item, index)) || 'white'}
				style={{
					paddingHorizontal: 20,
					paddingVertical: 15,
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center',
				}} />
		)
	}

	addParamsSeparator = (params) => {
		return params.length ? '&' : ''
	}

	getRequestParams = () => {
		let params = ''

		const { searchingFor } = this.state
		const { destination_params } = this

		if (isValidSearchKeyword(searchingFor)) {
			params += `search=${searchingFor}`
		}

		if (destination_params && destination_params.length) {
			params += `${this.addParamsSeparator(params)}${destination_params}`
		}

		return params
	}

	renderSearch = () => {
		if (this.search) {
			return (
				<SearchBar
					visible={true}
					autoFocus={false}
					onSubmitEditing={(text) => {
						this.setState({ searchingFor: text })
					}} />
			)
		}
	}

	onDataFetched = (data) => {
		let isAllSelected = this.isAllSelected
		let selected_items = this.state.selected_items

		if (this.selection === 2 && this.state.selected_items.length) {
			if (this.isAllSelected) {
				data = data.map(item => ({ ...item, isSelected: true })),
				selected_items = data
			}
			else {
				const selected_items_ids = this.state.selected_items.map(item => item.Id)
				isAllSelected = selected_items_ids.length >= data.length
				data = data.map(item => selected_items_ids.includes(item.Id) ? ({ ...item, isSelected: true, }) : item)
			}
		}

		this.setState({
			data,
			isAllSelected,
			selected_items,
		})
	}

	onDataReordered = ({ data }) => {
		if (this.state.selected_items.length) {
			this.setState({
				selected_items: data.filter(item => item.isSelected)
			})
		}
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
			pagination,
			reorder,
		} = this

		return (
			<RemoteDataContainer
				ListHeaderComponent={this.renderListHeader}
				ListEmptyComponent={this.ListEmptyComponent && this.ListEmptyComponent()}
				url={this.destination_url}
				params={this.getRequestParams()}
				pagination={pagination}
				draggable={reorder}
				showCount={false}
				onMoveEnd={this.onDataReordered}
				onDataFetched={this.onDataFetched}
				initialData={this.initialData}
				updatedData={this.state.data}
				ItemSeparatorComponent={() => <ItemSeparator />}
				extraData={this.state}
				keyExtractor={(item) => String(item.Id)}
				renderItem={this.renderItem} />
		)
	}

	renderRightComponent = () => {
		if (this.selection == 2) {
			return (
				<View style={{ flexDirection: 'row', alignItems: 'center', width: '50%' }}>
					<CustomTouchable
						onPress={this.toggleSelectionAll}
						style={{ marginRight: 5 }} >
						<MaterialCommunityIcons
							name={this.state.isAllSelected ? "checkbox-multiple-marked-circle" : "checkbox-multiple-marked-circle-outline"}
							size={18}
							color={'white'} />
					</CustomTouchable>

					{!this.forceSubmit && <HeaderSubmitButton
							isLoading={false}
							didSucceed={this.state.didSucceed}
							onPress={this.submit} />}
							
				</View>
			)
		} else {
			return null
		}
	}

	render() {
		return (
			<LazyContainer style={{ flex: 1, backgroundColor: 'white' }}>
				<CustomHeader
					navigation={this.props.navigation}
					rightNumOfItems={this.forceSubmit ? 1 : this.selection}
					title={"Select"}
					onBack={this.onPressBack}
					rightComponent={this.renderRightComponent()} />

				{this.renderSearch()}
				{this.renderContent()}
			</LazyContainer>
		)
	}
}