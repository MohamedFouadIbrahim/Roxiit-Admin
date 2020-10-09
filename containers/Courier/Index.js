import React from 'react';
import { View } from 'react-native';
import { withLocalize } from 'react-localize-redux';
import CustomHeader, { headerHeight } from '../../components/CustomHeader/index.js';
import { largePagePadding, pagePadding, shadowStyle3 } from '../../constants/Style.js';
import RemoteDataContainer from '../../components/RemoteDataContainer/index';
import ItemSeparator from '../../components/ItemSeparator/index';
import LazyContainer from '../../components/LazyContainer';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { SelectCountry } from '../../utils/Places.js';
import ArrowItem from '../../components/ArrowItem/index';
import CustomButton from '../../components/CustomButton/index';
import Triangle from 'react-native-triangle';
import { DeleteCourier } from '../../services/CourierServices';
import SearchBar from '../../components/SearchBar/index.js'
import CustomSelectorForDeleteAndEdit from '../../components/CustomSelectorForDeleteAndEdit/index';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import CourierItem from './CourierItem.js';
import { LongToast } from '../../utils/Toast.js';
import CustomTouchable from '../../components/CustomTouchable';
import { isValidSearchKeyword } from '../../utils/Validation.js';

class CourierIndex extends React.Component {
	constructor(props) {
		super(props)
		
		if (this.props.route.params && this.props.route.params?.FormGoLive) {
			this.FormGoLive = true
		} else {
			this.FormGoLive = false
		}
	}

	state = {
		selectedCourier: '',
		selectedCountry: '',
		data: null,
		triggerRefresh: false,
		searchBarShown: false,
		searchingFor: '',
		isPopupVisible: false,
		showCustomSelectorForDeleteref: false,
		Loading: false
	}

	onPressItem = (item) => {
		const { Id, isConfigured } = item
		this.setState({ isPopupVisible: false })
		this.props.navigation.navigate('CourierConfig', { Id, isConfigured, onChildChange: this.onChildChange })
	}

	onLongPressItem = (item) => {
		const { Id } = item
		this.DeleteOrEditId = Id
		this.setState({ showCustomSelectorForDeleteref: true })
	}

	renderItem = ({ item }) => {
		return (
			<CourierItem
				item={item}
				onPress={this.onPressItem}
				onLongPress={this.onLongPressItem}

			/>
		)
	}

	addParamsSeparator = (params) => {
		return params.length ? '&' : ''
	}

	getRequestParams = () => {
		let params = ''
		const { searchingFor, Country } = this.state

		if (isValidSearchKeyword(searchingFor)) {
			params += `${this.addParamsSeparator(params)}search=${searchingFor}`
		}
		if (Country) {
			params += `${this.addParamsSeparator(params)}countryId=${Country.Id}`
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
		const { Country } = this.state

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
					height={10}
					color={'white'}
					direction={'up'}
					style={{
						position: 'absolute',
						top: -10,
						right: pos_x + 2,
					}}
				/>

				<ArrowItem
					onPress={() => {
						SelectCountry(this.props.navigation, item => {
							this.setState({ Country: item })
						})
					}}
					title={'Country'}
					info={Country ? Country.Name : translate('NoneSelected')} />

				<CustomButton
					onPress={() => {
						this.hidePopup()
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

	onChildChange = () => {
		this.setState({ triggerRefresh: !this.state.triggerRefresh })
	}

	render() {
		return (
			<LazyContainer style={{ flex: 1, }} >
				<CustomHeader
					leftComponent={this.FormGoLive ? 'back' : "drawer"}
					navigation={this.props.navigation}
					title="Courier"
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
								onPress={() => { this.setState({ isPopupVisible: !this.state.isPopupVisible }) }}
								style={{
									flexDirection: 'row',
									justifyContent: 'center',
									alignItems: 'center',
									flex: 1,
								}}>

								<FontAwesome
									name={`filter`}
									size={24}
									color={'white'} />


							</CustomTouchable>

						</View>
					} />
				{this.renderSearch()}
				<RemoteDataContainer
					url={"Couriers"}
					cacheName={"couriers"}
					params={this.getRequestParams()}
					onDataFetched={(data) => {
						this.setState({ data })
					}}
					triggerRefresh={this.state.triggerRefresh}
					updatedData={this.state.data}
					keyExtractor={({ Id }) => `${Id}`}
					ItemSeparatorComponent={() => <ItemSeparator />}
					renderItem={this.renderItem}
				/>
				{this.renderPopup()}

				<CustomSelectorForDeleteAndEdit
					justForDelete={true}
					showCustomSelectorForDeleteref={this.state.showCustomSelectorForDeleteref}
					onCancelDelete={() => {
						this.setState({ showCustomSelectorForDeleteref: false })
					}}
					onCancelConfirm={() => {
						this.setState({ showCustomSelectorForDeleteref: false })
					}}
					onDelete={() => {
						this.setState({ Loading: true, showCustomSelectorForDeleteref: false })
						DeleteCourier(this.DeleteOrEditId, () => {
							this.setState({
								// data: this.state.data.filter(filterItem => filterItem.Id !== this.DeleteOrEditId),
								showCustomSelectorForDeleteref: false,
								Loading: false
							})
							this.onChildChange()
							LongToast('dataDeleted')
						}, () => {
							this.setState({ Loading: false })
						})
					}}
				/>
			</LazyContainer>
		);
	}
}
export default withLocalize(CourierIndex)