import React, { Component } from 'react'
import { View } from 'react-native'
import CustomHeader, { secondHeaderIconSize } from '../../components/CustomHeader/index.js';
import LazyContainer from '../../components/LazyContainer'
import Ionicons from 'react-native-vector-icons/Ionicons'
import SearchBar from '../../components/SearchBar/index.js';
import RemoteDataContainer from '../../components/RemoteDataContainer/index.js';
import ItemSeparator from '../../components/ItemSeparator/index.js';
import { DeleteProductOptionGroup } from '../../services/ProductOptionService.js';
import CustomSelector from '../../components/CustomSelector/index.js';
import { getFilters } from '../../services/FilterService.js';
import { withLocalize } from 'react-localize-redux';
import CustomSelectorForDeleteAndEdit from '../../components/CustomSelectorForDeleteAndEdit/index';
import ProductOptionItem from './ProductOptionItem.js';
import { LongToast } from '../../utils/Toast.js';
import CustomTouchable from '../../components/CustomTouchable';
import { isValidSearchKeyword } from '../../utils/Validation.js';

class ProductOptions extends Component {
	constructor(props) {
		super(props);
		this.state = {
			triggerRefresh: false,
			searchBarShown: false,
			searchingFor: '',
			showCustomSelectorForDeleteref: false,
			Loading: false,
			didFetchData: false
		}
		this.languageSelectorRef = React.createRef();
	}
	onChildChange = () => {
		this.setState({ triggerRefresh: !this.state.triggerRefresh })
	}

	componentDidUpdate(prevProps) {
		
		if (this.props.route.params?.triggerRefresh !== prevProps.route.params?.triggerRefresh) {
			this.onChildChange()
		}
	}
	componentWillUnmount() {
		this.cacelFitchData && this.cacelFitchData()
	}
	componentDidMount() {
		this.fetchFilters()
	}
	fetchFilters = () => {
		this.cancelFithData = getFilters({ languages: true, }, (result) => {
			this.setState({ Languages: result.data.Languages, didFetchData: true, })
		});
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

	onPressItem = (item) => {

		this.props.navigation.navigate('optionGroup', {
			Id: item.Id,
			onChildChange: this.onChildChange
		})

	}

	onLongPressItem = (item) => {
		this.DeleteOrEditId = item.Id
		this.setState({ showCustomSelectorForDeleteref: true })
	}

	renderItem = ({ item }) => {
		return (
			<ProductOptionItem
				item={item}
				onPress={this.onPressItem}
				onLongPress={this.onLongPressItem} />
		)
	}

	getParams = () => {
		var params = "";
		if (isValidSearchKeyword(this.state.searchingFor)) {
			params += `search=${this.state.searchingFor}`
		}
		if (this.state.Language) {
			params += `${params.length > 0 ? '&' : ''}languageId=${this.state.Language.Id}`
		}
		return params.length > 0 ? params : null

	}
	render() {
		const { Languages, Language, didFetchData } = this.state;
		return (
			<LazyContainer style={{ flex: 1, }}>
				<CustomHeader
					leftComponent="drawer"
					navigation={this.props.navigation}
					title="ProductOptions"
					rightNumOfItems={2}
					rightComponent={
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'center',
							}}>
							<CustomTouchable
								onPress={() => {
									// didFetchData ? this.languageSelectorRef.current.show() : null
									this.setState({ searchBarShown: !this.state.searchBarShown })
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
									color={'white'}
								/>
							</CustomTouchable>

							<CustomTouchable
								onPress={() => {
									this.props.navigation.navigate('ProductOptionGroup', { onChildChange: this.onChildChange })
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
					} />
				{
					Languages && <CustomSelector
						ref={this.languageSelectorRef}
						options={Languages.map(item => item.Name)}
						onSelect={(index) => {
							this.setState({
								Language: Languages[index]
							})
						}}
						onDismiss={() => { }}
					/>
				}

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

						DeleteProductOptionGroup(this.DeleteOrEditId, () => {
							this.setState({
								showCustomSelectorForDeleteref: false,
								Loading: false,
								triggerRefresh: !this.state.triggerRefresh
							});
							LongToast('dataDeleted')
						}, () => {
							this.setState({ Loading: false })
						})
					}}
				/>
				{this.renderSearch()}
				<RemoteDataContainer
					url={"ProductOption/Groups"}
					params={this.getParams()}
					triggerRefresh={this.state.triggerRefresh}
					style={{}}
					onDataFetched={(data) => {
						this.setState({ Countries: data, originalCntrs: data })
					}}
					updatedData={this.state.Countries}
					keyExtractor={({ Id }) => `${Id}`}
					ItemSeparatorComponent={() => <ItemSeparator />}
					renderItem={this.renderItem} />
			</LazyContainer>
		)
	}
}
export default withLocalize(ProductOptions)