import React from 'react';
import { View } from 'react-native';
import { withLocalize } from 'react-localize-redux';
import CustomHeader, { headerHeight } from '../../components/CustomHeader/index.js';
import { largePagePadding, pagePadding, shadowStyle3 } from '../../constants/Style.js';
import RemoteDataContainer from '../../components/RemoteDataContainer/index';
import ItemSeparator from '../../components/ItemSeparator/index';
import LazyContainer from '../../components/LazyContainer';
import ArrowItem from '../../components/ArrowItem/index';
import CustomButton from '../../components/CustomButton/index';
import Triangle from 'react-native-triangle';
import CustomSelector from '../../components/CustomSelector/index.js';
import { GetCustomersFillter, GetStatusList, GetProudctList, PostStatus, DeleteQuestion } from '../../services/QuestionService';
import SearchBar from '../../components/SearchBar/index.js'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { SelectEntity } from '../../utils/EntitySelector.js';
import Ionicons from 'react-native-vector-icons/Ionicons'
import DeleteButton from '../../components/DeleteButton/index.js';
import CustomSelectorForDeleteAndEdit from '../../components/CustomSelectorForDeleteAndEdit/index';
import QuestionItem from './QuestionItem.js';
import { LongToast } from '../../utils/Toast.js';
import CustomTouchable from '../../components/CustomTouchable';
import { isValidSearchKeyword } from '../../utils/Validation.js';
// import console = require('console');
// import console = require('console');

class QuestionIndex extends React.Component {
	constructor(props) {
		super(props)
		this.statusRef = React.createRef()

		this.state = {
			data: null,
			searchBarShown: false,
			searchingFor: '',
			isPopupVisible: false,
			statusList: [],
			triggerRefresh: false,
			showCustomSelectorForDeleteref: false,
			Product: props.route.params?.product ? props.route.params.product : null,
		}
	}

	onSelectStatus = (status) => {
		const questionId = this.changingquestionId
		this.setState({ showCustomSelectorForDeleteref: false })
		if (questionId) {
			const DataArgs = { id: questionId, status: status.Id }
			PostStatus(DataArgs, (res) => {
				this.setState({ triggerRefresh: !this.state.triggerRefresh })
			}, (err) => {
				// alert(err)
			})
		} else if (questionId == '') {
			this.setState({ Status: status })
		}
	}
	onChildChange = () => {
		this.setState({ triggerRefresh: !this.state.triggerRefresh })
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

						DeleteQuestion(Id, () => {
							this.setState({
								data: this.state.data.filter(filterItem => filterItem.Id !== Id),
							})
						}, err => {
							// alert(err)
						})
					}} />
			</View>
		)
	}

	onPressItem = (item) => {
		this.setState({ isPopupVisible: false })

		const { Id } = item
		//  Customer
		this.props.navigation.navigate('Question', {
			Id,
			onChildChange: this.onChildChange,
		})
	}

	onLongPressItem = (item) => {
		const { Id } = item
		this.DeleteOrEditId = Id
		this.setState({ showCustomSelectorForDeleteref: true })
	}
	onSelectorPress = (id) => {
		this.changingquestionId = id
		this.statusRef.current.show()
	}

	renderItem = ({ item }) => {
		return (
			<QuestionItem
				item={item}
				onPress={this.onPressItem}
				onLongPress={this.onLongPressItem}
				onSelectorPress={this.onSelectorPress}
			/>
		)
	}

	addParamsSeparator = (params) => {
		return params.length ? '&' : ''
	}
	Refresh = () => {
		this.setState({ triggerRefresh: !this.state.triggerRefresh })
	}

	getRequestParams = () => {
		let params = ''
		const { Customer, Product, Status, searchingFor } = this.state
		if (Customer) {
			params += `${this.addParamsSeparator(params)}customerId=${Customer.Id}`
		}
		if (Product) {
			params += `${this.addParamsSeparator(params)}productId=${Product.Id}`
		}
		//  if (this.props.route.params && this.props.route.params.product) {
		// 	params += `${this.addParamsSeparator(params)}productId=${this.props.route.params.product.Id}`
		// }
		if (Status) {
			params += `${this.addParamsSeparator(params)}statusId=${Status.Id}`
		}
		if (isValidSearchKeyword(searchingFor)) {
			params += `${this.addParamsSeparator(params)}search=${searchingFor}`
		}
		return params
	}
	componentDidMount() {
		GetCustomersFillter((Customers) => { this.setState({ Customers }) })
		GetStatusList((dta) => { this.setState({ statusList: dta }) })
		GetProudctList((data) => { this.setState({ Products: data }) })

		// if (this.props.route.params && this.props.route.params?.product) {

		// 	this.setState({ Product: this.props.route.params?.product })

		// }

	}
	renderPopup = () => {
		let { pos_y, pos_x, isPopupVisible } = this.state

		if (!isPopupVisible || pos_x === undefined || pos_y === undefined) {
			return null
		}

		// Can cause bugs on iOS?
		pos_x -= 29

		const { translate } = this.props
		const { Product, Status, Customer } = this.state

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
						right: pos_x + 5,
						zIndex: 1
					}}
				/>
				<ArrowItem
					onPress={() => {
						SelectEntity(this.props.navigation, data => {
							this.setState(({ Customer: data }))
						}, 'Customers/Simple', null, true, 1, this.state.Customers, { pagination: true })
					}}
					title={'Customer'}
					info={Customer ? `${Customer.Name.slice(0, 15)}..` : translate('NoneSelected')} />

				<ItemSeparator />

				<ArrowItem
					onPress={() => {
						SelectEntity(this.props.navigation, data => {
							this.setState(({ Product: data }))
						}, 'Products/Simple', null, true, 1, this.state.Products)
					}}
					title={'Product'}
					info={Product ? `${Product.Name.slice(0, 15)}..` : translate('NoneSelected')} />

				<ItemSeparator />

				<ArrowItem
					onPress={() => {
						this.changingquestionId = ''
						this.statusRef.current.show()
					}}
					title={'Status'}
					info={Status ? Status.Name : translate('NoneSelected')} />

				<CustomButton
					onPress={() => {
						this.hidePopup()
						this.setState({
							Customer: null,
							Product: this.props.route.params?.product ? this.props.route.params.product : null,
							Status: null
						})
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
		const { statusList } = this.state
		const { translate } = this.props
		return (
			<LazyContainer style={{ flex: 1 }} >
				<CustomHeader
					leftComponent="drawer"
					navigation={this.props.navigation}
					title="Questions"
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
									flex: 1
								}}>
								<AntDesign
									name={`filter`}
									size={24}
									color={'white'} />
							</CustomTouchable>
						</View>
					} />
				{this.renderSearch()}
				<RemoteDataContainer
					url={"Question/Index"}
					cacheName={"Question"}
					params={this.getRequestParams()}
					onDataFetched={(data) => {
						this.setState({ data })
					}}
					updatedData={this.state.data}
					keyExtractor={({ Id }) => `${Id}`}
					ItemSeparatorComponent={() => <ItemSeparator />}
					renderItem={this.renderItem}
					triggerRefresh={this.state.triggerRefresh}
				/>
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
						DeleteQuestion(this.DeleteOrEditId, () => {
							this.setState({
								data: this.state.data.filter(filterItem => filterItem.Id !== this.DeleteOrEditId),
								showCustomSelectorForDeleteref: false,
								Loading: false
							})
							LongToast('dataDeleted')
						}, err => {
							// alert(err)
							this.setState({ Loading: false })
						})
					}}
				/>
				{this.renderPopup()}

				{statusList && <CustomSelector
					ref={this.statusRef}
					options={statusList.map(item => item.Name)}
					onSelect={(index) => { this.onSelectStatus(statusList[index]) }}
					onDismiss={() => { }}
				/>}
			</LazyContainer>
		);
	}
}
export default withLocalize(QuestionIndex)