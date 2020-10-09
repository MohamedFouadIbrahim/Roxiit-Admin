import React, { Component } from 'react';
import { withLocalize } from 'react-localize-redux';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import ArrowItem from '../../components/ArrowItem/index.js';
import CircularImage from '../../components/CircularImage/index.js';
import CustomHeader from '../../components/CustomHeader/index.js';
import CustomLoader from '../../components/CustomLoader/index';
import MultiImageUplaoder from '../../components/CustomMultiImageUploader/index.js';
import CustomSelector from '../../components/CustomSelector/index.js';
import CustomTouchable from '../../components/CustomTouchable';
import FontedText from '../../components/FontedText/index.js';
import HeaderSubmitButton from '../../components/HeaderSubmitButton/index.js';
import HorizontalInput from '../../components/HorizontalInput/index.js';
import ItemSeparator from '../../components/ItemSeparator/index.js';
import LazyContainer from '../../components/LazyContainer';
import TranslatedText from '../../components/TranslatedText/index.js';
import { mainColor, secondTextColor } from '../../constants/Colors.js';
import { STRING_LENGTH_MEDIUM } from '../../constants/Config';
import { largePagePadding } from '../../constants/Style.js';
import { getFilters } from '../../services/FilterService.js';
import { AddProduct, GETProductNew } from '../../services/ProductService.js';
import { SelectEntity } from '../../utils/EntitySelector.js';
import { showImagePicker } from '../../utils/Image.js';
import { LongToast } from '../../utils/Toast.js';

class newProduct extends Component {
	constructor(props) {
		super(props)
		const { languages_data, currLang } = this.props

		this.state = {
			picker_image_uri: null,
			lockSubmit: false,
			didFetchData: false,
			selectedCategories: [],
			Language: languages_data.find(item => item.code === currLang),
			Images: [],
		}

		if (this.props.route.params && this.props.route.params?.Id) {
			this.editMode = true
			this.articleId = this.props.route.params?.Id
		}
		else {
			this.editMode = false
		}
		this.lockSubmit = false
		this.deleteImageRef = React.createRef()
		this.typeSelectorRef = React.createRef();
		this.statusSelectorRef = React.createRef();
		this.visibilitySelectorRef = React.createRef();
		this.languageSelectorRef = React.createRef();
		this.SubStoresRef = React.createRef()
		this.WarehousesRef = React.createRef()
	}
	componentWillUnmount() {
		this.cancelFetchDatagetFilters && this.cancelFetchDatagetFilters()
		this.cancelFetchDataAddProduct && this.cancelFetchDataAddProduct()
	}

	renderImage = () => {
		const imageSize = 90

		const { picker_image_uri } = this.state

		return (
			<CustomTouchable
				onPress={() => {
					showImagePicker((Data) => {
						if (Data) {
							const { uri, path } = Data
							this.setState({ picker_image_uri: uri, ImageData: path })
						}
					})
				}}
				style={{
					alignSelf: 'center',
					justifyContent: 'center',
					alignItems: 'center',
					backgroundColor: '#aaaaaa',
					margin: largePagePadding,
					width: imageSize,
					height: imageSize,
					borderRadius: imageSize / 2,
				}}>
				{picker_image_uri ? <CircularImage
					uri={picker_image_uri}
					size={imageSize} /> : <Ionicons
						name={`ios-add`}
						size={45}
						color={'white'} />}
				{this.state.uploadingImage == true ?
					<CustomLoader
						size={imageSize - 30}
						progress={this.state.prossesEvent == 0 ? this.state.prossesEvent : this.state.prossesEvent}
					/>
					: null
				}
			</CustomTouchable>
		)

	}


	componentDidMount() {
		this.cancelFetchDatagetFilters = getFilters({
			productStatus: true,
			productVisibility: true,
			productTypes: true,
			subStores: true
		}, res => {

			GETProductNew(resPro => {

				const {
					ProductTypes,
					ProductVisibility,
					ProductStatus,
					SubStores
				} = res.data

				const { Warehouses } = resPro.data

				this.setState({
					ProductTypes,
					ProductVisibility,
					ProductStatus,
					SubStores,
					Warehouses,
					didFetchData: true
				})

			})

		})


	}

	submit = () => {
		if (this.lockSubmit) {
			return
		}

		const {
			Name,
			ShortDescription,
			Description,
			Price,
			RealPrice,
			Type,
			status,
			visibility,
			Language,
			selectedCategories,
			ProductTypes,
			ProductVisibility,
			ProductStatus,
			picker_image_uri,
			ImageData,
			SalePrice,
			SubStore,
			Warehouses,
			AltName,
			Images
		} = this.state
		if (!Name || !Price || !Language) {
			return LongToast('CantHaveEmptyInputs')
		} else {
			this.setState({ lockSubmit: true, uploadingImage: true, prossesEvent: 0 })

			this.cancelFetchDataAddProduct = AddProduct({
				Status: status ? status.Id : ProductStatus[2].Id,
				Visibility: visibility ? visibility.Id : ProductVisibility[1].Id,
				Type: Type ? Type.Id : ProductTypes[1].Id,
				Name,
				ShortDescription,
				Description,
				Price,
				RealPrice,
				selectedCategories: selectedCategories.map(cate => cate.Id),
				languageId: Language.key,
				SalePrice,
				Image: ImageData,
				SubStoreId: SubStore ? SubStore.Id : null,
				Warehouses,
				AltName,
				Images
			}, res => {
				this.setState({ lockSubmit: false })
				this.props.route.params?.onChildChange && this.props.route.params?.onChildChange()
				this.props.navigation.goBack()
			}, (err) => {
				const NewImage = this.state.Images.map(item => ({ ...item, IsLoading: false, prossesEvent: 0 }))
				this.setState({ lockSubmit: false, Images: NewImage })
				this.lockSubmit = false
			}, (obj) => {
				const NewImage = this.state.Images.map(item => ({ ...item, IsLoading: true, prossesEvent: obj.prossesEvent * 0.01 }))
				this.setState({ Images: NewImage })
			})
		}

	}


	getNumberIfThereDecimalPoints = (Num) => {
		const ret = Num.toFixed(2);
		return ret
	}

	AddEditImage = (index, IsEditMode) => {
		if (IsEditMode) { // Edit Image Uri

			showImagePicker((Data) => {
				if (Data) {
					const { uri, path } = Data
					const OurImages = this.state.Images
					OurImages[index] = {
						Id: index,
						picker_image_uri: uri,
						picker_image_Path: path,
						IsLoading: false,
						prossesEvent: 0
					}

					const newArray = OurImages.map((item, index) => ({ ...item, Id: index }))
					this.setState({ Images: newArray })
				}
			})
		} else {

			showImagePicker((Data) => {
				if (Data) {
					const { uri, path } = Data
					const NewImage = {
						Id: index,
						picker_image_uri: uri,
						picker_image_Path: path,
						IsLoading: false,
						prossesEvent: 0
					}

					const NewData = [NewImage, ...this.state.Images].map((item, index) => ({ ...item, Id: index }))
					this.setState({ Images: NewData })
				}
			})
		}
	}

	renderContent = () => {
		const {
			StoreTypeId,
			SubStoreId
		} = this.props.hello_data

		if (!this.state.didFetchData) {
			return <ActivityIndicator style={{ justifyContent: 'center', alignItems: 'center', alignSelf: 'center', flex: 1 }} color={mainColor} size='large' />
		}

		if (this.state.didFetchData) {
			const {
				Name,
				ShortDescription,
				Description,
				ParentArticle,
				MobileIcon,
				MobileIconFamily,
				SubStore,
				Type,
				status,
				visibility,
				Language,
				Price,
				RealPrice,
				selectedCategories,
				ProductVisibility,
				ProductStatus,
				ProductTypes,
				SalePrice,
				Warehouses,
				Warehouse,
				AltName
			} = this.state

			const {
				Currency,
			} = this.props

			return (
				<ScrollView
					contentContainerStyle={{
					}}>

					<ArrowItem
						onPress={() => {
							this.languageSelectorRef.current.show()
						}}
						title={'Language'}
						info={Language.label} />

					<ItemSeparator />

					{/* {this.renderImage()} */}

					<MultiImageUplaoder
						contanierStyle={{ justifyContent: 'center' }}
						Images={this.state.Images}
						onPress={(index, IsEditMode) => { this.AddEditImage(index, IsEditMode) }}
						onLongPress={(id) => {
							this.DeleteId = id
							this.deleteImageRef.current.show()
						}}
					/>

					<ItemSeparator />


					<HorizontalInput
						maxLength={STRING_LENGTH_MEDIUM}
						label="Name"
						value={Name}
						onChangeText={(text) => { this.setState({ Name: text }) }} />

					<ItemSeparator />

					<HorizontalInput
						maxLength={STRING_LENGTH_MEDIUM}
						label="AltName"
						value={AltName}
						onChangeText={(AltName) => { this.setState({ AltName }) }} />

					<ItemSeparator />

					<HorizontalInput
						maxLength={STRING_LENGTH_MEDIUM}
						label="ShortDescription"
						value={ShortDescription}
						onChangeText={(text) => { this.setState({ ShortDescription: text }) }} />

					<ItemSeparator />

					<HorizontalInput
						label="Description"
						value={Description}
						onChangeText={(text) => { this.setState({ Description: text }) }} />

					<ItemSeparator />

					<HorizontalInput
						label="Price"
						keyboardType="numeric"
						value={Price}
						onChangeText={(text) => { this.setState({ Price: text }) }} />

					<ItemSeparator />



					{SalePrice && Price ? <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: largePagePadding, flex: 1, paddingVertical: 15, opacity: 0.4 }} >
						<TranslatedText style={{ color: secondTextColor, fontSize: 16, flex: 2 }} text={'Saving'} />
						{/* <FontedText  >{'Saving'}</FontedText> */}
						<View style={{
							flexDirection: 'row', justifyContent: 'space-between',
							flex: 5,
							paddingLeft: 70,
							paddingRight: 20
						}} >
							<FontedText style={{ color: secondTextColor, fontSize: 16, }} >{`${this.getNumberIfThereDecimalPoints(Price - SalePrice)} ${(Currency ? Currency.Name : "")}`}</FontedText>
							<FontedText style={{ color: secondTextColor, fontSize: 16, }} >{`${this.getNumberIfThereDecimalPoints(((Price - SalePrice) / Price) * 100)}%`}</FontedText>
						</View>
					</View> : null}

					<HorizontalInput
						label="SalePrice"
						keyboardType="numeric"
						value={SalePrice}
						onChangeText={(text) => {
							if (parseInt(text, 10) <= parseInt(Price, 10)) {
								this.setState({ SalePrice: text })
							} else if (!text || text == null || text == '') {
								this.setState({ SalePrice: null })
							}
							// this.setState({ SalePrice: text }) 
						}} />

					<ItemSeparator />

					<HorizontalInput
						label="RealPrice"
						keyboardType="numeric"
						value={RealPrice}
						onChangeText={(text) => { this.setState({ RealPrice: text }) }} />

					<ItemSeparator />

					<ArrowItem
						onPress={() => {
							this.typeSelectorRef.current.show()
						}}
						title={'Type'}
						info={Type ? Type.Name : ProductTypes.find(item => item.Id == 1).Name} />

					<ItemSeparator />

					<ArrowItem
						onPress={() => {
							this.visibilitySelectorRef.current.show()
						}}
						title={'Visibility'}
						info={visibility ? visibility.Name : ProductVisibility.find(item => item.Id == 1).Name} />

					<ItemSeparator />

					<ArrowItem
						onPress={() => {
							this.statusSelectorRef.current.show()
						}}
						title={'Status'}
						info={status ? status.Name : ProductStatus[2].Name} />

					<ItemSeparator />

					<ArrowItem
						onPress={() => {

							this.props.navigation.navigate('NewProductWherehouses', {
								Data: Warehouses,
								onSelect: (allData) => {
									this.setState({ Warehouses: allData })
								}
							})

						}}
						title={'Warehouse'}
						info={`(${Warehouses.filter(item => item.IsSelected == true).length}) selected`}
					// info={Warehouses.length}
					/>

					<ItemSeparator />

					<ArrowItem
						onPress={() => {
							SelectEntity(this.props.navigation, selectedCategories => {
								this.setState({ selectedCategories })
							}, 'Categories/Simple', null, true, 2, selectedCategories.map(item => item.Id))
						}}
						title={'Category'}
						info={`(${selectedCategories.length}) selected`} />

					<ItemSeparator />

					{StoreTypeId == 3 && SubStoreId == null ?
						<ArrowItem
							onPress={() => {
								this.SubStoresRef.current.show()
							}}
							title={'SubStore'}
							info={SubStore ? SubStore.Name : this.props.translate('NoneSelected')} /> :
						null
					}

				</ScrollView>
			)
		}
	}

	render() {
		const { ProductTypes, ProductStatus, ProductVisibility, SubStores, Warehouses } = this.state
		const { languages_data } = this.props

		return (
			<LazyContainer style={{ flex: 1, backgroundColor: "#FFF" }}>
				<CustomHeader
					navigation={this.props.navigation}
					title={"Products"}
					rightComponent={
						<HeaderSubmitButton
							isLoading={this.state.lockSubmit}
							didSucceed={this.state.didSucceed}
							onPress={() => { this.submit() }} />
					} />

				{/* {this.renderContent()} */}
				{
					Platform.OS == 'ios' ?

						<KeyboardAvoidingView behavior='padding' enabled
							style={{ flex: 1 }}
							keyboardVerticalOffset={40}
						>
							{this.renderContent()}
						</KeyboardAvoidingView> :

						this.renderContent()

				}

				{ProductTypes && <CustomSelector
					ref={this.typeSelectorRef}
					options={ProductTypes.map(item => item.Name)}
					onSelect={(index) => { this.setState({ Type: ProductTypes[index] }) }}
					onDismiss={() => { }}
				/>}

				{ProductStatus && <CustomSelector
					ref={this.statusSelectorRef}
					options={ProductStatus.map(item => item.Name)}
					onSelect={(index) => { this.setState({ status: ProductStatus[index] }) }}
					onDismiss={() => { }}
				/>}

				{ProductVisibility && <CustomSelector
					ref={this.visibilitySelectorRef}
					options={ProductVisibility.map(item => item.Name)}
					onSelect={(index) => { this.setState({ visibility: ProductVisibility[index] }) }}
					onDismiss={() => { }}
				/>}

				<CustomSelector
					ref={this.deleteImageRef}
					options={['Delete']}
					onSelect={(index) => {
						const NewData = this.state.Images.filter(item => item.Id != this.state.Images[this.DeleteId].Id).map((item, index) => ({ ...item, Id: index }))
						this.setState({ Images: NewData })
					}}
					onDismiss={() => { }}
				/>

				<CustomSelector
					ref={this.languageSelectorRef}
					options={languages_data.map(item => item.label)}
					onSelect={(index) => {
						this.setState({
							Language: languages_data[index]
						})
					}}
					onDismiss={() => { }}
				/>

				{SubStores && <CustomSelector
					ref={this.SubStoresRef}
					options={SubStores.map(item => item.Name)}
					onSelect={(index) => { this.setState({ SubStore: SubStores[index] }) }}
					onDismiss={() => { }}
				/>}

				{Warehouses && <CustomSelector
					ref={this.WarehousesRef}
					options={Warehouses.map(item => item.Warehouse.Name)}
					onSelect={(index) => { this.setState({ Warehouse: Warehouses[index].Warehouse }) }}
					onDismiss={() => { }}
				/>}
			</LazyContainer>
		)
	}
}

const mapStateToProps = ({
	language: {
		languages_data,
		currLang
	},
	login: {
		Currency,
		user_data,
		hello_data
	},
}) => ({
	languages_data,
	currLang,
	user_data,
	hello_data,
	Currency,
})


export default connect(mapStateToProps)(withLocalize(newProduct))