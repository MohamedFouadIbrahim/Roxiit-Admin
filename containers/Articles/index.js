import React, { Component } from 'react'
import { View } from 'react-native'
import CustomHeader, { secondHeaderIconSize, headerHeight } from '../../components/CustomHeader/index.js';
import LazyContainer from '../../components/LazyContainer'
import FontedText from '../../components/FontedText/index.js';
import RemoteDataContainer from '../../components/RemoteDataContainer/index.js';
import CircularImage from '../../components/CircularImage/index.js';
import { largePagePadding, pagePadding, shadowStyle3 } from '../../constants/Style.js';
import ItemSeparator from '../../components/ItemSeparator/index.js';
import Ionicons from 'react-native-vector-icons/Ionicons'
import SearchBar from '../../components/SearchBar/index.js';
import { withLocalize } from 'react-localize-redux';
import { getFilters } from '../../services/FilterService.js';
import CustomSelector from '../../components/CustomSelector/index.js';
import { DeleteArticle, ReorderArticles } from '../../services/ArticlesService.js';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import ArrowItem from '../../components/ArrowItem/index';
import Triangle from 'react-native-triangle';
import CustomButton from '../../components/CustomButton/index';
import CustomSelectorForDeleteAndEdit from '../../components/CustomSelectorForDeleteAndEdit/index';
import ArticleItem from './ArticleItem.js';
import { LongToast } from '../../utils/Toast.js';
import { secondTextColor } from '../../constants/Colors.js';
import CustomTouchable from '../../components/CustomTouchable';
import { isValidSearchKeyword } from '../../utils/Validation.js';

class Articles extends Component {
	constructor() {
		super()

		this.state = {
			data: null,
			triggerRefresh: false,
			searchBarShown: false,
			searchingFor: '',
			isPopupVisible: false,
			showCustomSelectorForDeleteRef: false,
			Loading: false
		}
		this.typeSelectorRef = React.createRef();
	}

	componentDidMount() {
		getFilters({
			articleTypes: true,
		}, res => {
			const {
				ArticleTypes,
			} = res.data

			this.setState({
				ArticleTypes,
			})
		})
	}

	onPressItem = (item) => {
		const { Id } = item
		this.hidePopup()
		this.props.navigation.navigate('Article', {
			Id,
			onChildChange: this.onChildChange,
		})
	}

	onLongPressItem = (item) => {
		const { Id } = item
		this.DeleteOrEditId = Id
		this.setState({ showCustomSelectorForDeleteref: true })
	}

	renderItem = ({ item, drag, isActive }) => {
		return (
			<ArticleItem
				item={item}
				move={drag}
				isActive={isActive}
				onPress={this.onPressItem}
				onLongPress={this.onLongPressItem} />
		)
	}

	renderItem = ({ item, index, drag, isActive }) => {
		const { Id, Name, ShortDescription, Image: { ImageUrl } } = item

		return (
			<CustomTouchable
				onPress={() => {
					this.hidePopup()
					this.props.navigation.navigate('Article', {
						Id,
						onChildChange: this.onChildChange,
					})
				}}
				onLongPress={() => {
					this.hidePopup()
					this.DeleteOrEditId = Id
					this.setState({ showCustomSelectorForDeleteref: true })
				}}>
				<View
					style={{
						backgroundColor: isActive ? '#cccccc' : 'white',
						flexDirection: 'row',
						justifyContent: 'space-between',
						paddingHorizontal: largePagePadding,
						paddingVertical: pagePadding,
					}}>
					<View
						style={{
							flex: 1,
							flexDirection: 'row',
						}}>
						<CircularImage
							uri={ImageUrl} />

						<View
							style={{
								flex: 1,
								paddingLeft: largePagePadding,
							}}>
							<FontedText style={{ color: 'black' }}>{Name}</FontedText>
							<FontedText style={{
								color: secondTextColor
								// color: '#949EA5'
							}}>{ShortDescription}</FontedText>
						</View>
					</View>

					<CustomTouchable
						onLongPress={drag}
						onPressOut={drag}
						style={{
							padding: 10,
						}}>
						<Ionicons
							name={`ios-menu`}
							size={28}
							// color={'#949EA5'}
							color={secondTextColor}
						/>
					</CustomTouchable>
				</View>
			</CustomTouchable>
		)
	}
	onChildChange = () => {
		this.setState({ triggerRefresh: !this.state.triggerRefresh })
	}

	addParamsSeparator = (params) => {
		return params.length ? '&' : ''
	}

	getRequestParams = () => {
		let params = ''

		const { searchingFor, Type } = this.state

		if (isValidSearchKeyword(searchingFor)) {
			params += `${this.addParamsSeparator(params)}search=${searchingFor}`
		}

		if (Type) {
			params += `${this.addParamsSeparator(params)}typeId=${Type.Id}`
		}

		return params
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
	renderPopup = () => {
		let { pos_y, pos_x, isPopupVisible } = this.state

		if (!isPopupVisible || pos_x === undefined || pos_y === undefined) {
			return null
		}

		// Can cause bugs on iOS?
		pos_x -= 29

		const { translate } = this.props
		const { Country, Type } = this.state

		return (
			<View
				style={{
					position: 'absolute',
					top: pos_y + headerHeight + 2,
					right: pos_x + 30,
					backgroundColor: 'white',
					borderRadius: 15,
					paddingVertical: largePagePadding,
					width: 200,
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
						right: 90,
					}}
				/>

				<ArrowItem
					onPress={() => {
						this.typeSelectorRef.current.show()
					}}
					title={'Type'}
					info={Type ? Type.Name : translate('NoneSelected')} />

				<ItemSeparator />
				<CustomButton
					onPress={() => {
						this.hidePopup()
						this.setState({ Type: null })
					}}
					style={{
						marginTop: pagePadding,
						marginHorizontal: largePagePadding,
					}}
					title='Clear' />
			</View>
		)
	}
	hidePopup = () => {
		this.setState({ isPopupVisible: false })
	}

	onSelectArticleType = (index) => {
		if (index === 0) {
			this.setState({ Type: null })
		}
		else {
			const { ArticleTypes } = this.state
			this.setState({ Type: ArticleTypes[index - 1] })
		}
	}

	onDataReordered = (data) => {
		ReorderArticles(data.map(item => item.Id))
	}

	render() {
		const { ArticleTypes, Type } = this.state
		const { translate } = this.props

		return (
			<LazyContainer style={{ flex: 1, backgroundColor: "#FFF" }}>
				<CustomHeader
					leftComponent="drawer"
					navigation={this.props.navigation}
					title="Articles"
					rightNumOfItems={3}
					rightComponent={
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'center',
							}}>
							<CustomTouchable
								onLayout={({ nativeEvent: { layout: { x, y } } }) => {
									this.setState({ pos_x: x, pos_y: y })
								}}
								onPress={() => {
									// this.typeSelectorRef.current.show()
									this.setState({ isPopupVisible: !this.state.isPopupVisible })
								}}
								style={{
									flexDirection: 'row',
									justifyContent: 'center',
									alignItems: 'center',
									// padding: headerButtonPadding,
									flex: 1,
								}}>
								<FontAwesome
									name={`filter`}
									size={22}
									color={'white'} />
							</CustomTouchable>
							<CustomTouchable
								onPress={() => { this.setState({ searchBarShown: !this.state.searchBarShown }) }}
								style={{
									flexDirection: 'row',
									justifyContent: 'center',
									alignItems: 'center',
									// padding: headerButtonPadding,
									flex: 1,
								}}>
								<Ionicons
									name={`ios-search`}
									size={24}
									color={'white'} />
							</CustomTouchable>

							<CustomTouchable
								onPress={() => {
									this.setState({ isPopupVisible: false })
									this.props.navigation.navigate('Article', { onChildChange: this.onChildChange })
								}}
								style={{
									flexDirection: 'row',
									justifyContent: 'center',
									alignItems: 'center',
									// padding: headerButtonPadding,
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
						this.setState({ Loading: true, showCustomSelectorForDeleteref: false })
						DeleteArticle(this.DeleteOrEditId, () => {
							this.setState({
								data: this.state.data.filter(filterItem => filterItem.Id !== this.DeleteOrEditId),
								showCustomSelectorForDeleteref: false,
								Loading: false
							})
							LongToast('dataDeleted')
						}, (err) => {
							this.setState({ Loading: false })
							// alert(err)
						})
					}}
				/>
				<RemoteDataContainer
					url={"Articles"}
					params={this.getRequestParams()}
					cacheName={"articles"}
					draggable={true}
					onMoveEnd={({ data }) => { this.onDataReordered(data) }}
					onDataFetched={(data) => {
						this.setState({ data })
					}}
					updatedData={this.state.data}
					triggerRefresh={this.state.triggerRefresh}
					keyExtractor={({ Id }) => `${Id}`}
					ItemSeparatorComponent={() => <ItemSeparator />}
					renderItem={this.renderItem} />
				{this.renderPopup()}

				{ArticleTypes && <CustomSelector
					ref={this.typeSelectorRef}
					options={[
						translate('NoneSelected'),
						...ArticleTypes.map(item => item.Name)
					]}
					onSelect={(index) => { this.onSelectArticleType(index); this.hidePopup() }}
					onDismiss={() => { }}
				/>}
			</LazyContainer>
		)
	}
}

export default withLocalize(Articles)