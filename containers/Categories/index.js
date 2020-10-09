import React, { Component } from 'react'
import { View } from 'react-native'
import CustomHeader, { secondHeaderIconSize, headerHeight } from '../../components/CustomHeader/index.js';
import CustomButton from '../../components/CustomButton/index';
import LazyContainer from '../../components/LazyContainer'
import RemoteDataContainer from '../../components/RemoteDataContainer/index.js';
import { largePagePadding, pagePadding, shadowStyle3 } from '../../constants/Style.js';
import ItemSeparator from '../../components/ItemSeparator/index.js';
import { DeleteCategory } from '../../services/CategoriesService';
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { getFilters } from '../../services/FilterService.js';
import { withLocalize } from 'react-localize-redux';
import SearchBar from '../../components/SearchBar/index.js'
import Triangle from 'react-native-triangle';
import CustomSelector from '../../components/CustomSelector/index.js';
import CategoryItem from './CategoryItem.js';
import { LongToast } from '../../utils/Toast.js';
import CustomTouchable from '../../components/CustomTouchable';
import { isValidSearchKeyword } from '../../utils/Validation.js';
import ConfirmModal from '../../components/ConfirmModal/index.js';

class Categories extends Component {
	constructor(props) {
		super(props)

		const { translate } = this.props

		this.state = {
			data: null,
			triggerRefresh: false,
			params: null,
			options: [
				{
					Id: 0,
					Name: translate('ShowProducts')
				},
				{
					Id: 1,
					Name: translate('Delete')
				}, {
					Id: 3,
					Name: translate('Reorder')
				}, {
					Id: 4,
					Name: translate('HomePageReorder')
				}
			]
		}

		this.parentCatRef = React.createRef();
		this.optionsRef = React.createRef();
		this.confirmRef = React.createRef();


	}


	componentWillUnmount() {
		this.cancelFetchDatagetFilters && this.cancelFetchDatagetFilters()
	}

	fetchCategories = () => {
		this.cancelFetchDatagetFilters = getFilters({ categories: true }, (res) => {
			var categories = res.data.Categories;
			this.setState({ categories })
		});
	}

	renderPopup = () => {
		let { pos_y, pos_x, isPopupVisible, category } = this.state

		if (!isPopupVisible || pos_x === undefined || pos_y === undefined) {
			return null
		}

		// Can cause bugs on iOS?
		pos_x -= 29

		const { translate } = this.props

		return (
			<View
				style={{
					position: 'absolute',
					top: pos_y + headerHeight + 2,
					right: pos_x,
					backgroundColor: 'white',
					borderRadius: 15,
					paddingVertical: largePagePadding,
					width: 250,
					...shadowStyle3,
				}}>
				<Triangle
					width={14}
					height={12}
					color={'white'}
					direction={'up'}
					style={{
						position: 'absolute',
						top: -10,
						right: pos_x + headerHeight - 10,
					}}
				/>

				<ArrowItem
					onPress={() => {
						this.parentCatRef.current.show()
					}}
					title={'ParentCategory'}
					info={category ? `${category.Name.slice(0, 5)}..` : translate('NoneSelected')} />

				<ItemSeparator />

				<CustomButton
					onPress={() => {
						this.hidePopup()
						this.setState({ category: null })
					}}
					style={{
						marginTop: pagePadding,
						marginHorizontal: largePagePadding,
					}}
					title='Clear' />
			</View>
		)
	}

	renderSearch = () => {
		return (
			<SearchBar
				visible={this.state.searchBarShown}
				onPressClose={() => {
					this.setState({ searchBarShown: !this.state.searchBarShown })
					this.hidePopup()
				}}
				onSubmitEditing={(text) => {
					this.setState({ searchingFor: text })

				}} />
		)
	}

	addParamsSeparator = (params) => {
		return params.length ? '&' : ''
	}

	hidePopup = () => {
		this.setState({ isPopupVisible: false })
	}

	onPressItem = (item) => {
		const { Id } = item
		this.props.navigation.navigate('CategoryScreen', {
			categoryId: Id,
			onChildChange: this.onChildChange
		})
		this.hidePopup()
	}

	onLongPressItem = (item) => {
		const { Id } = item
		this.DeleteOrEditId = Id
		this.optionsRef.current.show()
		this.hidePopup()
	}

	renderItem = ({ item }) => {
		return (
			<CategoryItem
				item={item}
				onPress={this.onPressItem}
				onLongPress={this.onLongPressItem} />
		)
	}

	getParams = () => {
		if (this.state.params) {
			return this.state.params
		}
		else {
			return null
		}
	}

	getRequestParams = () => {
		let params = ''

		const { searchingFor, category } = this.state

		if (isValidSearchKeyword(searchingFor)) {
			params += `${this.addParamsSeparator(params)}search=${searchingFor}`
		}

		if (category) {
			params += `${this.addParamsSeparator(params)}parentId=${category.Id}`
		}

		return params
	}

	onChildChange = () => {
		this.setState({ triggerRefresh: !this.state.triggerRefresh })
	}

	render() {
		const { categories, options } = this.state

		return (
			<LazyContainer style={{ flex: 1, backgroundColor: "#FFF" }}>
				<CustomHeader
					leftComponent="drawer"
					navigation={this.props.navigation}
					rightNumOfItems={3}
					rightComponent={
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'center',
							}}>
							<CustomTouchable
								onPress={() => {
									this.setState({ searchBarShown: !this.state.searchBarShown })
									this.hidePopup()
								}}
								style={{
									flexDirection: 'row',
									justifyContent: 'center',
									alignItems: 'center',
									flex: 1,
								}}>
								<Ionicons
									name={`ios-search`}
									size={24}
									color={'white'} />
							</CustomTouchable>

							<CustomTouchable
								onLayout={({ nativeEvent: { layout: { x, y } } }) => {
									this.setState({ pos_x: x, pos_y: y })
								}}
								onPress={() => {
									this.setState({ isPopupVisible: !this.state.isPopupVisible })
									this.fetchCategories()
								}}
								style={{
									flexDirection: 'row',
									justifyContent: 'center',
									alignItems: 'center',
									flex: 1,
								}}>
								<AntDesign
									name={`filter`}
									size={24}
									color={'white'} />
							</CustomTouchable>

							<CustomTouchable
								onPress={() => {
									this.props.navigation.navigate('newCategory', { onChildChange: this.onChildChange })
									this.hidePopup()
								}}
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
					} title="Categories" />

				{this.renderSearch()}

				<RemoteDataContainer
					url={"Categories"}
					cacheName={"categories"}
					triggerRefresh={this.state.triggerRefresh}
					params={this.getRequestParams()}
					// onDataFetched={(data) => {
					// 	this.setState({ data })
					// }}
					// updatedData={this.state.data}
					keyExtractor={({ Id }) => `${Id}`}
					ItemSeparatorComponent={() => <ItemSeparator />}
					renderItem={this.renderItem} />

				{this.renderPopup()}

				{categories && <CustomSelector
					ref={this.parentCatRef}
					options={categories.map(item => item.Name)}
					onSelect={(index) => {
						this.hidePopup()
						this.setState({ category: categories[index] })
					}}
					onDismiss={() => { }}
				/>}

				{this.state.options &&
					<CustomSelector
						ref={this.optionsRef}
						options={options.map(item => item.Name)}
						onSelect={(index) => {
							if (options[index].Id == 4) {
								this.props.navigation.navigate('CategoryReorderInHomePage')
								return
							}
							if (options[index].Id == 3) {
								this.props.navigation.navigate('CategoryReorder', { onChildChange: this.onChildChange })
								return
							}
							options[index].Id == 1 ?
								this.confirmRef.current.show() :
								this.props.navigation.navigate('Products', { categoryId: this.DeleteOrEditId })
						}}
						onDismiss={() => { }}
					/>
				}


				<ConfirmModal
					ref={this.confirmRef}
					onConfirm={() => {
						DeleteCategory(this.DeleteOrEditId, () => {
							this.setState({
								data: this.state.data.filter(filterItem => filterItem.Id !== this.DeleteOrEditId)
							})
							LongToast('dataDeleted')
						}, () => {
						})
					}}
				/>

			</LazyContainer>
		)
	}
}
export default withLocalize(Categories)