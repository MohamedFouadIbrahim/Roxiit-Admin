import React, { Component } from 'react'
import { View } from 'react-native'
import CustomHeader, { secondHeaderIconSize } from '../../components/CustomHeader/index.js';
import LazyContainer from '../../components/LazyContainer'
import RemoteDataContainer from '../../components/RemoteDataContainer/index.js';
import ItemSeparator from '../../components/ItemSeparator/index.js';
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'
import SearchBar from '../../components/SearchBar/index.js';
import { DeleteProduct, onAccept, onDecline } from '../../services/ProductService.js';
import { withLocalize } from 'react-localize-redux';
import CustomSelectorForDeleteAndEdit from '../../components/CustomSelectorForDeleteAndEdit/index';
import ProductItem from './ProductItem.js';
import { LongToast } from '../../utils/Toast.js';
import CustomTouchable from '../../components/CustomTouchable';
import CustomSelector from '../../components/CustomSelector';
import ConfirmModal from '../../components/ConfirmModal';
import { isValidSearchKeyword } from '../../utils/Validation.js';
import { ShareSomeThing } from '../../utils/Share.js';
import { connect } from 'react-redux';
class Products extends Component {
	constructor(props) {
		super(props)
		this.state = {
			data: null,
			selectedCategory: props.selectedCategory,
			selectedLanguage: props.selectedLanguage,
			triggerRefresh: false,
			searchingFor: "",
			params: null,
			SelectedFilters: null,
			showCustomSelectorForDeleteref: false,
			Loading: false
		}

		this.OptionRef = React.createRef();
		this.Confirm = React.createRef();
		this.Options = [
			{ Id: 0, Name: this.props.translate('Delete') },
			{ Id: 1, Name: this.props.translate('Reorder') },
			{ Id: 2, Name: this.props.translate('ShareProduct') },
		]
	}

	Accept = (id) => {
		onAccept(id, res => {
			LongToast('dataSaved')
			this.onChildChange()
		})
	}

	Decline = (id) => {
		onDecline(id, res => {
			LongToast('dataSaved')
			this.onChildChange()
		})
	}

	onPressItem = (item) => {
		const { Id, Type } = item
		this.props.navigation.navigate('Product', {
			ProductId: Id,
			onChildChange: this.onChildChange,
			Type
		})
	}

	onLongPressItem = (item) => {
		const { Id } = item
		this.DeleteOrEditId = Id
		this.OptionRef.current.show()
	}

	renderItem = ({ item }) => {
		const { Id } = item
		return (
			<ProductItem
				onAccept={() => { this.Accept(Id) }}
				onDecline={() => { this.Decline(Id) }}
				item={item}
				onPress={this.onPressItem}
				onLongPress={this.onLongPressItem}
				style={{
					paddingRight: 5,
				}} />
		)
	}

	getParams = () => {
		let Params = ''

		if (this.state.params) {
			Params += this.state.params
		}

		if (isValidSearchKeyword(this.state.searchingFor)) {
			Params += `${this.addParamsSeparator(Params)}search=${this.state.searchingFor}`
			// return `search=${this.state.searchingFor}`
		}

		if (this.props.route.params && this.props.route.params?.categoryId) {
			Params += `${this.addParamsSeparator(Params)}categoryId=${this.props.route.params?.categoryId}`
		}

		if (this.props.route.params && this.props.route.params?.subStoreId) {
			Params += `${this.addParamsSeparator(Params)}subStoreId=${this.props.route.params?.subStoreId}`
		}

		return Params
	}

	addParamsSeparator = (params) => {
		return params.length ? '&' : ''
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
		const { Url } = this.props
		return (
			<LazyContainer style={{ flex: 1, backgroundColor: "#FFF" }}>
				<CustomHeader
					leftComponent={"drawer"}
					navigation={this.props.navigation}
					rightNumOfItems={3}
					rightComponent={
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'center',
							}}>
							<CustomTouchable
								onPress={() => { this.setState({ searchBarShown: !this.state.searchBarShown }) }}
								style={{
									flex: 1,
									flexDirection: 'row',
									justifyContent: 'center',
									alignItems: 'center',
									// padding: headerButtonPadding,
								}}>
								<Ionicons
									name={`ios-search`}
									size={24}
									color={'white'} />
							</CustomTouchable>
							<CustomTouchable
								onPress={() => {
									this.props.navigation.navigate('ProductsFilters', {
										callback: (params, SelectedFilters) => {
											this.setState({ params, SelectedFilters })
										},
										SelectedFilters: this.state.SelectedFilters,
									})
								}}
								style={{
									flex: 1,
									flexDirection: 'row',
									justifyContent: 'center',
									alignItems: 'center',
									// padding: headerButtonPadding,
								}}>
								<AntDesign
									name={`filter`}
									size={24}
									color={'white'} />
							</CustomTouchable>

							<CustomTouchable
								onPress={() => {
									this.props.navigation.navigate('newProduct', { onChildChange: this.onChildChange })
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
					}
					title="Products" />

				{this.renderSearch()}

				<CustomSelector
					ref={this.OptionRef}
					options={this.Options.map(item => item.Name)}
					onSelect={(index) => {
						if (index == 0) {
							this.Confirm.current.show()
						} else if (index == 1) {
							this.props.navigation.navigate('ProductReorder', { onChildChange: this.onChildChange })
						}
						else if (index == 2) {
							LongToast('PleaseWait')
							ShareSomeThing(`${Url}/p/${this.DeleteOrEditId}`)
						}
					}}
					onDismiss={() => { }}
				/>
				<ConfirmModal
					ref={this.Confirm}
					onConfirm={() => {
						this.setState({ Loading: true, showCustomSelectorForDeleteref: false })
						DeleteProduct(this.DeleteOrEditId, (res) => {
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
				{/* <CustomSelectorForDeleteAndEdit
					showCustomSelectorForDeleteref={this.state.showCustomSelectorForDeleteref}
					justForDelete={true}
					onCancelDelete={() => {
						this.setState({ showCustomSelectorForDeleteref: false })
					}}
					onCancelConfirm={() => {
						this.setState({ showCustomSelectorForDeleteref: false })
					}}
					onDelete={() => {
					
					}}
				/> */}

				<RemoteDataContainer
					url={"Products"}
					cacheName={"products"}
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


const mapStateToProps = ({
	runtime_config: {
		runtime_config: {
			AppUrl: {
				Url
			}
		},
	}
}) => ({
	Url
})

export default connect(mapStateToProps)(withLocalize(Products))
