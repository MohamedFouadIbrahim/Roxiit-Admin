import React, { Component } from 'react'
import { FlatList } from 'react-native'
import LazyContainer from '../../components/LazyContainer'
import CustomHeader from '../../components/CustomHeader';
import { connect } from 'react-redux'
import SearchBar from '../../components/SearchBar';
import RemoteDataContainer from '../../components/RemoteDataContainer';
import HeaderSubmitButton from '../../components/HeaderSubmitButton';
import CountryItem from './CountryItem';
import CityAreaItem from './CityAreaItem';
import ItemSeparator from '../../components/ItemSeparator';

class PlacesSelector extends Component {
	constructor(props) {
		super(props)

		this.place_type = 0

		if (this.props.route.params?) {
			const {
				place_type,
				parent_id,
				selected_items,
				multi_select,
			} = this.props.route.params?

			this.place_type = place_type

			if (Array.isArray(parent_id)) {
				this.request_params = `${parent_id.map(item => `id=${item}`).join("&")}`

				if (place_type === 1) {
					this.request_endpoint = "Cities/Array"
				}
				else if (place_type === 2) {
					this.request_endpoint = "Areas/Array"
				}
			}
			else {
				this.request_params = `id=${parent_id}`

				if (place_type === 1) {
					this.request_endpoint = "Cities"
				}
				else if (place_type === 2) {
					this.request_endpoint = "Areas"
				}
			}

			this.multi_select = multi_select
			this.selected_items = selected_items
		}

		let originalData = []

		if (this.place_type === 0) {
			const countries = [...this.props.countries.map(item => ({
				...item,
				isSelected: null
			}))]

			if (this.selected_items.length) {
				const selected_items_ids = this.selected_items

				originalData = [
					...countries.filter(item => selected_items_ids.includes(item.Id)).map(item => ({ ...item, isSelected: true, })),
					...countries.filter(item => !selected_items_ids.includes(item.Id))
				]
			}
			else {
				originalData = countries
			}
		}

		this.originalData = originalData
		this.selectedItemsIds = originalData.filter(item => item.isSelected).map(item => item.Id)

		this.state = {
			data: originalData,
		}
	}

	submit = () => {
		this.props.navigation.goBack()

		this.props.route.params?
			&& this.props.route.params?.onSelect
			&& this.props.route.params?.onSelect(this.originalData.filter(item => this.selectedItemsIds.includes(item.Id)))
	}

	onSelectPlace = (item, index) => {
		if (this.multi_select) {
			let copy_items = [
				...this.state.data
			]

			copy_items[index].isSelected = !copy_items[index].isSelected

			this.setState({
				data: copy_items,
			})

			if (copy_items[index].isSelected) {
				this.selectedItemsIds.push(item.Id)
			}
			else {
				this.selectedItemsIds = this.selectedItemsIds.filter(Id => Id !== item.Id)
			}
		}
		else {
			this.props.route.params? && this.props.route.params?.onSelect && this.props.route.params?.onSelect(item)
			this.props.navigation.goBack()
		}
	}

	onPressItem = (item, index) => {
		this.onSelectPlace(item, index)
	}

	renderCountry = ({ item, index }) => {
		return (
			<CountryItem
				item={item}
				index={index}
				onPress={this.onPressItem}
				style={{
					paddingHorizontal: 20,
					paddingVertical: 15,
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center',
					backgroundColor: 'white',
				}} />
		)
	}

	renderCityOrArea = ({ item, index }) => {
		return (
			<CityAreaItem
				item={item}
				index={index}
				onPress={this.onPressItem}
				style={{
					paddingHorizontal: 20,
					paddingVertical: 15,
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center',
					backgroundColor: 'white',
				}} />
		)
	}

	renderSearch = () => {
		return (
			<SearchBar
				visible={true}
				autoFocus={false}
				interval={100}
				onSubmitEditing={(target_keyword) => {
					if (target_keyword) {
						const filteredData = this.state.data.filter(item => item.Name.toLowerCase().includes(target_keyword.toLowerCase()))
						this.setState({ data: filteredData })
					}
					else {
						this.setState({ data: this.originalData })
					}
				}} />
		)
	}

	renderContent = () => {
		if (this.place_type === 0) {
			return (
				<FlatList
					ItemSeparatorComponent={() => <ItemSeparator />}
					keyExtractor={(item) => String(item.Id)}
					extraData={this.state}
					data={this.state.data}
					renderItem={this.renderCountry} />
			)
		}
		else {
			return (
				<RemoteDataContainer
					url={this.request_endpoint}
					params={this.request_params}
					pagination={false}
					onDataFetched={(data) => {
						this.setState({ data })
					}}
					extraData={this.state}
					updatedData={this.state.data}
					ItemSeparatorComponent={() => <ItemSeparator />}
					keyExtractor={(item) => String(item.Id)}
					renderItem={this.renderCityOrArea} />
			)
		}
	}

	render() {
		return (
			<LazyContainer style={{ flex: 1, backgroundColor: 'white' }}>
				<CustomHeader
					navigation={this.props.navigation}
					title={"SelectPlace"}
					rightComponent={
						this.multi_select ? <HeaderSubmitButton
							isLoading={false}
							didSucceed={this.state.didSucceed}
							onPress={this.submit} /> : null
					} />

				{this.renderSearch()}
				{this.renderContent()}
			</LazyContainer>
		)
	}
}

const mapStateToProps = ({
	places: {
		countries,
	},
}) => ({
	countries,
})

export default connect(mapStateToProps)(PlacesSelector)