import React, { Component } from 'react'
import {
	ScrollView,
	View,
	Text,
	ActivityIndicator,
} from 'react-native'
import { connect } from 'react-redux';
import CustomHeader from '../../components/CustomHeader/index.js';
import LazyContainer from '../../components/LazyContainer'
import { withLocalize } from 'react-localize-redux';
import HeaderSubmitButton from '../../components/HeaderSubmitButton/index.js';
import { getFilters } from '../../services/FilterService.js';
import { largePagePadding } from '../../constants/Style.js';
import CustomButton from '../../components/CustomButton/index.js';
import FontedText from '../../components/FontedText/index.js';
import CustomMultiSlider from '../../components/CustomMultiSlider/index.js';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { screenWidth, screenHeight } from '../../constants/Metrics';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { secondColor } from '../../constants/Colors.js';
import CustomTouchable from '../../components/CustomTouchable';
import CustomDatePicker from '../../components/CustomDatePicker/index.js';
import ArrowItem from '../../components/ArrowItem/index.js';
import CustomSelector from '../../components/CustomSelector';
import { formatDate } from '../../utils/Date.js';

class ProductsFilters extends Component {
	constructor(props) {
		super(props)
		this.state = {
			didFetchData: true,
			ProductStatus: [],
			ProductTypes: [],
			ProductVisibility: [],
			showProductStatus: false,
			showProductType: false,
			showProductVisibility: false,
			fetchingFilters: true,
			selectedProductStatus: {
				Id: null,
				Name: ""
			},
			selectedProductType: {
				Id: null,
				Name: ""
			},
			selectedProductVisibility: {
				Id: null,
				Name: ""
			},
			qry: this.props.searchQry,
			priceSliderValue: [0, 3000],
			ratingSliderValue: [0, 5],
			isToDatePickerVisible: false,
			isFromDatePickerVisible: false,
			SubStores: [],
			SubStore: null,
			SortingOptions: [{ Id: 0, Name: 'Default', Value: null }, { Id: 1, Name: "SalesHigherFirst", Value: "sales-high", }, { Id: 2, Name: "SalesLowerFirst", Value: "sales-low" },
			{ Id: 3, Name: "MostViews", Value: "views" }, { Id: 4, Name: "PriceHigherFirst", Value: "price-high" }, { Id: 5, Name: "PriceLowerFirst", Value: "price-low" }]
		}

		this.SubStoresRef = React.createRef();
		this.SortRef = React.createRef();
	}

	componentDidMount() {
		this.getFilterDropDowns()
	}

	getFilterDropDowns = () => {
		getFilters({ productTypes: true, productStatus: true, ProductVisibility: true, subStores: true }, (res) => {
			var ProductStatus = res.data.ProductStatus
			var ProductTypes = res.data.ProductTypes
			var ProductVisibility = res.data.ProductVisibility
			const SubStores = res.data.SubStores
			var SelectedFilters = this.props.route.params?.SelectedFilters

			this.setState({ ProductStatus, ProductTypes, ProductVisibility, SubStores }, () => {
				// SelectedFilters = { priceSliderValue, ratingSliderValue, selectedProductStatus, selectedProductType, selectedProductVisibility }
				if (SelectedFilters) {
					this.setState({ ...SelectedFilters })
				}
				this.setState({ fetchingFilters: false })
			})
		}, err => {
		});
	}

	priceSliderValuesChange = values => {
		this.setState({
			priceSliderValue: values,
		});
	};

	ratingSliderValuesChange = values => {
		this.setState({
			ratingSliderValue: values,
		});
	};

	selectProductStatus = (Id) => {
		var ProductStatus = this.state.ProductStatus;
		var selectedProductStatus = this.state.selectedProductStatus
		ProductStatus.map((item) => {
			if (item.Id == Id) {
				item.selected = true
				selectedProductStatus = item
			} else {
				item.selected = false
			}
		})
		this.setState({ ProductStatus, selectedProductStatus }, () => {
			this.setState({ showProductStatus: false })
		})
	}

	selectProductType = (Id) => {
		var ProductTypes = this.state.ProductTypes;
		var selectedProductType = this.state.selectedProductType
		ProductTypes.map((item) => {
			if (item.Id == Id) {
				item.selected = true
				selectedProductType = item
			} else {
				item.selected = false
			}
		})
		this.setState({ ProductTypes, selectedProductType }, () => {
			this.setState({ showProductType: false })
		})
	}

	selectProductVisibility = (Id) => {
		var ProductVisibility = this.state.ProductVisibility;
		var selectedProductVisibility = this.state.selectedProductVisibility
		ProductVisibility.map((item) => {
			if (item.Id == Id) {
				item.selected = true
				selectedProductVisibility = item
			} else {
				item.selected = false
			}
		})
		this.setState({ ProductVisibility, selectedProductVisibility }, () => {
			// alert(JSON.stringify(this.state.ProductVisibility))
			this.setState({ showProductVisibility: false })
		})
	}

	clearPickers = () => {
		this.setState({
			ProductStatus: this.state.ProductStatus.map(item => { return { Id: item.Id, Name: item.Name, selected: false } }),
			ProductTypes: this.state.ProductTypes.map(item => { return { Id: item.Id, Name: item.Name, selected: false } }),
			ProductVisibility: this.state.ProductVisibility.map(item => { return { Id: item.Id, Name: item.Name, selected: false } }),
			selectedProductStatus: { Id: null, Name: "" },
			selectedProductType: { Id: null, Name: "" },
			selectedProductVisibility: { Id: null, Name: "" },
			priceSliderValue: [0, 3000],
			ratingSliderValue: [0, 5],
			showProductStatus: false,
			showProductType: false,
			showProductVisibility: false,
			from: null,
			to: null,
			SubStore: null,
			Sort: null,
		})
	}

	renderProductStatus = () => {
		return (
			<>
				<CustomTouchable activeOpacity={.5} onPress={() => this.setState({ showProductStatus: !this.state.showProductStatus })} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 30, }}>
					<View style={{}}>
						<Text style={{ paddingRight: 10, fontSize: 18, fontWeight: '300' }}>Select Product Status</Text>
						<Text style={{ paddingRight: 10, fontSize: 15, color: 'grey' }}>{this.state.selectedProductStatus.Name}</Text>
					</View>
					<SimpleLineIcons name={this.state.showProductStatus ? 'arrow-up' : 'arrow-down'} color="#6C7B8A" />
				</CustomTouchable>
				{
					this.state.showProductStatus ?
						this.state.fetchingFilters ?
							<ActivityIndicator />
							:
							<ScrollView style={{ width: '100%', maxHeight: screenHeight / 2.2, paddingLeft: 20 }}>
								{
									this.state.ProductStatus.map((item, index) => (
										<CustomTouchable activeOpacity={.5} onPress={() => this.selectProductStatus(item.Id)} key={`{${index}}`} style={{ flex: 1, paddingTop: 18, flexDirection: 'row', alignItems: 'center' }}>
											<MaterialCommunityIcons size={17} color={secondColor} name={item.selected ? 'checkbox-marked' : 'checkbox-blank-outline'} style={{ marginRight: 8 }} />
											<Text style={{ fontSize: 17 }}>{item.Name}</Text>
										</CustomTouchable>
									))
								}
							</ScrollView>
						: null
				}
			</>
		)
	}

	renderProductTypes = () => {
		const { translate } = this.props
		return (
			<>
				<CustomTouchable activeOpacity={.5} onPress={() => this.setState({ showProductType: !this.state.showProductType })} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 30, }}>
					<View style={{}}>
						<Text style={{ paddingRight: 10, fontSize: 18, fontWeight: '300' }}>{translate('SelectProductType')}</Text>
						<Text style={{ paddingRight: 10, fontSize: 15, color: 'grey' }}>{this.state.selectedProductType.Name}</Text>
					</View>
					<SimpleLineIcons name={this.state.showProductType ? 'arrow-up' : 'arrow-down'} color="#6C7B8A" />
				</CustomTouchable>
				{
					this.state.showProductType ?
						this.state.fetchingFilters ?
							<ActivityIndicator />
							:
							<ScrollView style={{ width: '100%', maxHeight: screenHeight / 2.2, paddingLeft: 20, marginBottom: 50 }}>
								{
									this.state.ProductTypes.map((item, index) => (
										<CustomTouchable activeOpacity={.5} onPress={() => this.selectProductType(item.Id)} key={`{${index}}`} style={{ flex: 1, paddingTop: 18, flexDirection: 'row', alignItems: 'center' }}>
											<MaterialCommunityIcons size={17} color={secondColor} name={item.selected ? 'checkbox-marked' : 'checkbox-blank-outline'} style={{ marginRight: 8 }} />
											<Text style={{ fontSize: 17 }}>{item.Name}</Text>
										</CustomTouchable>
									))
								}
							</ScrollView>
						: null
				}
			</>
		)
	}

	renderProductVisibility = () => {
		const { translate } = this.props
		return (
			<>
				<CustomTouchable activeOpacity={.5} onPress={() => this.setState({ showProductVisibility: !this.state.showProductVisibility })} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 30, }}>
					<View style={{}}>
						<Text style={{ paddingRight: 10, fontSize: 18, fontWeight: '300' }}>{translate('SelectProductVisibility')}</Text>
						<Text style={{ paddingRight: 10, fontSize: 15, color: 'grey' }}>{this.state.selectedProductVisibility.Name}</Text>
					</View>
					<SimpleLineIcons name={this.state.showProductVisibility ? 'arrow-up' : 'arrow-down'} color="#6C7B8A" />
				</CustomTouchable>
				{
					this.state.showProductVisibility ?
						this.state.fetchingFilters ?
							<ActivityIndicator />
							:
							<ScrollView style={{ width: '100%', maxHeight: screenHeight / 2.2, paddingLeft: 20, marginBottom: 50 }}>
								{
									this.state.ProductVisibility.map((item, index) => (
										<CustomTouchable activeOpacity={.5} onPress={() => this.selectProductVisibility(item.Id)} key={`{${index}}`} style={{ flex: 1, paddingTop: 18, flexDirection: 'row', alignItems: 'center' }}>
											<MaterialCommunityIcons size={17} color={secondColor} name={item.selected ? 'checkbox-marked' : 'checkbox-blank-outline'} style={{ marginRight: 8 }} />
											<Text style={{ fontSize: 17 }}>{item.Name}</Text>
										</CustomTouchable>
									))
								}
							</ScrollView>
						: null
				}
			</>
		)
	}

	showFromDateTimePicker = () => {
		this.setState({ isFromDatePickerVisible: true });
	}

	hideFromDateTimePicker = () => {
		this.setState({ isFromDatePickerVisible: false });
	}

	showToDateTimePicker = () => {
		this.setState({ isToDatePickerVisible: true });
	}

	hideToDateTimePicker = () => {
		this.setState({ isToDatePickerVisible: false });
	}

	renderFromTo = () => {
		const { from, to, isFromDatePickerVisible, isToDatePickerVisible } = this.state

		return (
			<View >

				<ArrowItem
					style={{ paddingHorizontal: 0 }}
					onPress={() => {
						this.showFromDateTimePicker()
					}}
					title='From'
					info={from ? formatDate(from) : null}
				/>

				<ArrowItem
					onPress={() => { this.showToDateTimePicker() }}
					title='To'
					info={to ? formatDate(to) : null}
					style={{ paddingHorizontal: 0 }}

				/>

				<CustomDatePicker
					isVisible={isFromDatePickerVisible}
					date={from}
					onDatePicked={(date) => {
						this.setState({
							from: date,
						})

						this.hideFromDateTimePicker()
					}}
					onCancel={this.hideFromDateTimePicker} />

				<CustomDatePicker
					isVisible={isToDatePickerVisible}
					date={to}
					onDatePicked={(date) => {
						this.setState({
							to: date,
						})

						this.hideToDateTimePicker()
					}}
					onCancel={this.hideToDateTimePicker} />

			</View>
		)
	}
	submit = () => {
		const {
			priceSliderValue,
			ratingSliderValue,
			selectedProductStatus,
			selectedProductType,
			selectedProductVisibility,
			from,
			to,
			SubStore,
			Sort
		} = this.state
		var params = "";
		var SelectedFilters = { priceSliderValue, ratingSliderValue, selectedProductStatus, selectedProductType, selectedProductVisibility, SubStore, Sort }
		if (selectedProductType.Id)
			params += `typeId=${selectedProductType.Id}`
		if (selectedProductStatus.Id)
			params += `${params.length > 0 ? '&' : ''}statusId=${selectedProductStatus.Id}`
		if (selectedProductVisibility.Id)
			params += `${params.length > 0 ? '&' : ''}visiblityId=${selectedProductVisibility.Id}`
		params += `${params.length > 0 ? '&' : ''}minPrice=${priceSliderValue[0]}&maxPrice=${priceSliderValue[1]}&minRating=${ratingSliderValue[0]}&maxRating=${ratingSliderValue[1]}`
		// params = `typeId=${selectedProductType.Id}&statusId=${selectedProductStatus.Id}&visiblityId=${selectedProductVisibility.Id}&minPrice=${priceSliderValue[0]}&maxPrice=${priceSliderValue[1]}&minRating=${ratingSliderValue[0]}&maxRating=${ratingSliderValue[1]}`
		if (from && to) {
			params += `${params.length > 0 ? '&' : ''}from=${from}&to=${to}`
			// params = `from=${from}&to=${to}`
		}
		if (SubStore) {
			params += `${params.length > 0 ? '&' : ''}subStoreId=${SubStore.Id}`
		}
		if (Sort && Sort.Value) {
			params += `${params.length > 0 ? '&' : ''}sort=${Sort.Value}`
		}
		this.props.route.params?.callback(params, SelectedFilters)
		this.props.navigation.goBack()
	}

	onPricesChange = (prices) => {
		this.setState({
			MinPrice: prices[0],
			MaxPrice: prices[1],
		})
	}

	renderSubStoresSelector = () => {

		const {
			StoreTypeId,
			SubStoreId
		} = this.props.hello_data

		return (
			StoreTypeId == 3 && SubStoreId == null ?
				<ArrowItem
					onPress={() => {
						this.SubStoresRef.current.show()
					}}
					style={{ paddingHorizontal: 0 }}

					title={'SubStore'}
					info={this.state.SubStore ? this.state.SubStore.Name : null} /> :
				null
		)
	}

	renderSortSelector = () => {
		const { translate } = this.props
		return (
			<ArrowItem
				onPress={() => {
					this.SortRef.current.show()
				}}
				style={{ paddingHorizontal: 0 }}

				title={'Sort'}
				info={this.state.Sort ? translate(this.state.Sort.Name) : translate('Default')} />
		)
	}
	renderContent = () => {

		if (this.state.didFetchData) {
			const { translate, Currency } = this.props
			const {
				StoreTypeId,
			} = this.props.hello_data


			return (
				<View style={{ flex: 1 }}>
					<ScrollView style={{
						flex: 1, backgroundColor: "#FFF",
						padding: 30,
					}}>
						<View>
							<View
								style={{
									flexDirection: 'row',
									justifyContent: 'space-between',
									alignItems: 'center',
								}}>
								<FontedText style={{ color: '#131315', textAlign: 'left', fontSize: 12 }}>{translate('PriceRange')}</FontedText>
								<FontedText style={{ color: '#6C7B8A', textAlign: 'left', fontSize: 12 }}>{`${(Currency ? Currency.Name : "")}${this.state.priceSliderValue[0]} - ${(Currency ? Currency.Name : "")}${this.state.priceSliderValue[1]}`}</FontedText>
							</View>

							<CustomMultiSlider
								values={[
									this.state.priceSliderValue[0],
									this.state.priceSliderValue[1],
								]}
								sliderLength={screenWidth - 80}
								onValuesChange={this.priceSliderValuesChange}
								min={0}
								max={3000}
								step={10}
								allowOverlap={false}
								color={secondColor}
							/>

							<View
								style={{
									flexDirection: 'row',
									justifyContent: 'space-between',
									alignItems: 'center',
									marginTop: 20,
								}}>
								<FontedText style={{ color: '#131315', textAlign: 'left', fontSize: 12 }}>{translate('RATINGRANAGE')}</FontedText>
								<FontedText style={{ color: '#6C7B8A', textAlign: 'left', fontSize: 12 }}>{`${this.state.ratingSliderValue[0]} - ${this.state.ratingSliderValue[1]}`}</FontedText>
							</View>

							<CustomMultiSlider
								values={[
									this.state.ratingSliderValue[0],
									this.state.ratingSliderValue[1],
								]}
								sliderLength={screenWidth - 80}
								onValuesChange={this.ratingSliderValuesChange}
								min={0}
								max={5}
								step={1}
								allowOverlap={false}
								color={secondColor}
							/>

							{this.renderProductStatus()}
							{this.renderProductTypes()}
							{this.renderProductVisibility()}
							<View style={{ marginBottom: 20, paddingBottom: 20 }}>
								{this.renderFromTo()}
								{this.renderSubStoresSelector()}
								{this.renderSortSelector()}
							</View>
						</View>

					</ScrollView>
					<CustomButton
						onPress={this.clearPickers}
						style={{
							marginHorizontal: largePagePadding,
							marginBottom: 10
						}}
						title='Clear' />
				</View>
			)
		}
	}

	render() {

		const { SubStores, SortingOptions } = this.state
		const { translate } = this.props
		return (
			<LazyContainer style={{ flex: 1, backgroundColor: "#FFF" }}>
				<CustomHeader
					navigation={this.props.navigation}
					title={"Filters"}
					rightComponent={
						<HeaderSubmitButton
							isLoading={this.state.lockSubmit}
							didSucceed={this.state.didSucceed}
							onPress={() => { this.submit() }} />
					} />

				{this.renderContent()}

				{SubStores && <CustomSelector
					ref={this.SubStoresRef}
					options={SubStores.map(item => item.Name)}
					onSelect={(index) => { this.setState({ SubStore: SubStores[index] }) }}
					onDismiss={() => { }}
				/>}

				{SortingOptions && <CustomSelector
					ref={this.SortRef}
					options={SortingOptions.map(item => translate(item.Name))}
					onSelect={(index) => { this.setState({ Sort: SortingOptions[index] }) }}
					onDismiss={() => { }}
				/>}


			</LazyContainer>
		)
	}
}

const mapStateToProps = ({
	login: {
		Currency,
		hello_data
	},
}) => ({
	Currency,
	hello_data
})

export default connect(mapStateToProps)(withLocalize(ProductsFilters))