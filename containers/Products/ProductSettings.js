import React, { Component } from 'react'
import { ScrollView, View, ActivityIndicator, Switch, Dimensions } from 'react-native'
import LazyContainer from '../../components/LazyContainer'
import SwitchItem from '../../components/SwitchItem'
import ItemSeparator from '../../components/ItemSeparator/index.js';
import TranslatedText from '../../components/TranslatedText/index.js';
import { withLocalize } from 'react-localize-redux';
import { GetProductSettings, EditProductSettings } from '../../services/ProductService.js';
import { EventRegister } from 'react-native-event-listeners'
import ArrowItem from '../../components/ArrowItem/index.js';
import CustomSelector from '../../components/CustomSelector/index.js';
import { getFilters } from '../../services/FilterService.js';
import { SelectEntity, SelectMultiLevel } from '../../utils/EntitySelector.js';
import { LongToast } from '../../utils/Toast';
import { secondTextColor } from '../../constants/Colors';

class ProductSettings extends Component {
	constructor(props) {
		super(props)
		this.state = {
			didFetchData: false,
			productSettings: null,
			Categories: null,
			Etags: null,
			selectedBrand: null,
			selectedGender: null,
			selectedCategories: [],
			selectedEtags: [],
			screenWidth: Dimensions.get('screen').width,
			screenHeight: Dimensions.get('screen').height,
		}
		this.availableBrandsRef = React.createRef()
		this.availableGendersRef = React.createRef()

		this.listener = EventRegister.addEventListener('currentPost', (currentPost) => {
			if (currentPost == '3') {
				this.submitSettings()
				EventRegister.emit('submitting', true)
			}
		})
	}

	componentDidMount() {
		this.fetchCatsAndEtags();
		//re render when change orientation
		Dimensions.addEventListener('change', () => {
			this.setState({
				screenWidth: Dimensions.get('screen').width,
				screenHeight: Dimensions.get('screen').height,
			})
		})

	}

	fetchCatsAndEtags = () => {
		this.cancelFetchData = getFilters({
			categories: true,
			Etags: true,
		}, res => {
			const {
				Categories,
				Etags
			} = res.data

			this.setState({
				Categories,
				Etags
			}, this.fetchProductSettings)
		})
	}

	fetchProductSettings = () => {
		this.cancelFetchDataGetProductSettings = GetProductSettings(this.props.ProductId, (res) => {
			this.setState({
				productSettings: res.data,
				selectedBrand: res.data.BrandId ? res.data.availableBrands.filter(item => item.Id == res.data.BrandId)[0] : null,
				selectedGender: res.data.GenderId ? res.data.availableGenders.filter(item => item.Id == res.data.GenderId)[0] : null,
				selectedCategories: res.data.fullSelectedCategories,
				selectedEtags: res.data.selectedEtags.length > 0 ? res.data.selectedEtags : [],
				didFetchData: true
			})
		})
	}

	componentWillUnmount() {
		EventRegister.removeEventListener(this.listener)
		this.cancelFetchData && this.cancelFetchData()
		this.cancelFetchDataGetProductSettings && this.cancelFetchDataGetProductSettings()
		this.cancelFetchDataEditProductSettings && this.cancelFetchDataEditProductSettings()
	}

	submitSettings = () => {
		const { selectedCategories, selectedEtags, selectedBrand, selectedGender, productSettings } = this.state
		const { EnableQuestions, EnableReview, HideAddToCart } = productSettings
		const { ProductId } = this.props

		this.cancelFetchDataEditProductSettings = EditProductSettings({
			Id: ProductId,
			selectedCategories: selectedCategories.map(item => item.Id),
			selectedEtags: selectedEtags.map(item => item.Id),
			BrandId: selectedBrand ? selectedBrand.Id : null,
			GenderId: selectedGender ? selectedGender.Id : null,
			EnableQuestions,
			EnableReview,
			HideAddToCart
		}, (res) => {
			LongToast('dataSaved')
			EventRegister.emit('submitting', false)
		}, (err) => {
			EventRegister.emit('submitting', false)
		})
	}

	renderContent = () => {
		const { selectedBrand, selectedGender, selectedCategories } = this.state
		const { translate } = this.props
		if (this.state.didFetchData) {
			return (
				<ScrollView
					contentContainerStyle={{
					}}>

					<ArrowItem
						onPress={() => {
							this.availableBrandsRef.current.show()
						}}
						title={'Brand'}
						info={selectedBrand ? selectedBrand.Name : translate('NoneSelected')} />
					<ItemSeparator />

					<ArrowItem
						onPress={() => {
							this.availableGendersRef.current.show()
						}}
						title={'Gender'}
						info={selectedGender ? selectedGender.Name : translate('NoneSelected')} />

					<ItemSeparator />

					<ArrowItem
						onPress={() => {
							SelectMultiLevel(this.props.navigation, selectedCategories => {
								this.setState({ selectedCategories })

							}, 'Categories', null, 2, selectedCategories, { canSelectParents: true })
						}}
						title={'Category'}
						info={`(${selectedCategories.length}) selected`} />

					<ItemSeparator />

					<ArrowItem
						onPress={() => {
							SelectEntity(this.props.navigation, selectedEtags => {
								this.setState({ selectedEtags })
							}, 'ETags/Simple', null, false, 2, this.state.selectedEtags)
						}}
						title={'Etag'}
						info={`(${this.state.selectedEtags.length})${translate('selected')}`} />
					<ItemSeparator />
					<View
						activeOpacity={0.8}
						style={[{
							paddingVertical: 15,
							paddingHorizontal: 20,
							flexDirection: 'row',
							justifyContent: 'space-between',
							alignItems: 'center',
							backgroundColor: 'white',
						}]}>
						<View
							style={{
								justifyContent: 'center',
							}}>
							<TranslatedText style={{
								// color: '#949EA5'
								color: secondTextColor
							}} text='Enablequestions' />
						</View>

						<View
							style={{
								flexDirection: 'row',
								alignItems: 'center',
								paddingLeft: 10,
							}}>
							<Switch onValueChange={() => this.setState({ productSettings: { ...this.state.productSettings, EnableQuestions: !this.state.productSettings.EnableQuestions } })} value={this.state.productSettings.EnableQuestions} />
						</View>
					</View>
					<ItemSeparator />

					<View
						activeOpacity={0.8}
						style={[{
							paddingVertical: 15,
							paddingHorizontal: 20,
							flexDirection: 'row',
							justifyContent: 'space-between',
							alignItems: 'center',
							backgroundColor: 'white',
						}]}>
						<View
							style={{
								justifyContent: 'center',
							}}>
							<TranslatedText style={{
								// color: '#949EA5'
								color: secondTextColor
							}} text='Enablereviews' />
						</View>

						<View
							style={{
								flexDirection: 'row',
								alignItems: 'center',
								paddingLeft: 10,
							}}>
							<Switch onValueChange={() => this.setState({ productSettings: { ...this.state.productSettings, EnableReview: !this.state.productSettings.EnableReview } })} value={this.state.productSettings.EnableReview} />
						</View>
					</View>

					<ItemSeparator />

					<SwitchItem
						title={'HideAddToCart'}
						value={this.state.productSettings.HideAddToCart}
						onValueChange={(value) => {
							this.setState({ productSettings: { ...this.state.productSettings, HideAddToCart: value } })
						}}
					/>

					<ItemSeparator />

				</ScrollView>
			)
		} else {
			return (
				<View style={{ flex: 1, minHeight: this.state.screenHeight / 2, alignItems: 'center', justifyContent: 'center' }}>
					<ActivityIndicator />
				</View>
			)
		}
	}

	render() {
		const { productSettings } = this.state
		return (
			<LazyContainer style={{ flex: 1, backgroundColor: "#FFF", }}>
				{this.renderContent()}
				{productSettings && <CustomSelector
					notRequried={true}
					ref={this.availableBrandsRef}
					options={productSettings.availableBrands.map(item => item.Name)}
					onSelect={(index) => { this.setState({ selectedBrand: productSettings.availableBrands[index] }) }}
					onDismiss={() => { }}
				/>}
				{productSettings && <CustomSelector
					ref={this.availableGendersRef}
					options={[...productSettings.availableGenders, { Id: null, Name: 'None' }].map(item => item.Name)}
					onSelect={(index) => { this.setState({ selectedGender: productSettings.availableGenders[index] }) }}
					onDismiss={() => { }}
				/>}
			</LazyContainer>
		)
	}
}

export default withLocalize(ProductSettings)