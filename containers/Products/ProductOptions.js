import React, { Component } from 'react';
import { withLocalize } from 'react-localize-redux';
import { ActivityIndicator, I18nManager, ScrollView, Switch, TextInput, View, Dimensions, KeyboardAvoidingView } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { EventRegister } from 'react-native-event-listeners';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import ArrowItem from '../../components/ArrowItem/index.js';
import CircularImage from '../../components/CircularImage/index.js';
import ConfirmModal from '../../components/ConfirmModal';
import CustomLoader from '../../components/CustomLoader/index';
import CustomSelector from '../../components/CustomSelector';
import CustomSelectorForDeleteAndEdit from '../../components/CustomSelectorForDeleteAndEdit/index';
import CustomTouchable from '../../components/CustomTouchable';
import DeleteButton from '../../components/DeleteButton/index.js';
import FontedText from '../../components/FontedText/index.js';
import HorizontalInput from '../../components/HorizontalInput';
import ItemSeparator from '../../components/ItemSeparator/index.js';
import LazyContainer from '../../components/LazyContainer';
import CustomModal from '../../components/LoadingModal/index';
import RoundedCloseButton from '../../components/RoundedCloseButton/index.js';
import TranslatedText from '../../components/TranslatedText/index';
import { mainTextColor, secondColor, secondTextColor, mainColor } from '../../constants/Colors';

import { largePagePadding, pagePadding, shadowStyle1 } from '../../constants/Style.js';
import { AddRelationProductOption, DeleteRelationProductOption, AddProductOption, AddProductOptionImage, DeleteProductOption, DeleteProductOptionImage, GetProductOptionDetails, GetProductOptionGroups, GetProductOptionMembers, GetProductOptions, ReorderProductOptionImages } from '../../services/ProductService.js';
import { OpenCamera, OpenSingleSelectImagePicker } from '../../utils/Image.js';
import { LongToast } from '../../utils/Toast';
import { ReoderProductOption, ReoderProductOptionGroup, SetProductOptionDefault, removeProductOptionDefault } from '../../services/ProductOptionService.js';
import { STRING_LENGTH_MEDIUM, STRING_LENGTH_LONG } from '../../constants/Config.js';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

require('datejs')

const imagesPerRow = 5
const imagesPerRowLen = imagesPerRow - 1

class ProductOptions extends Component {
	constructor(props) {
		super(props)
		const { languages_data, currLang } = this.props

		this.state = {
			didFetchData: false,
			uploadingImg: false,
			createMode: false,
			isAddOptionGroupVisible: false,
			isAddPhotosVisible: false,
			createButtonLoading: false,
			stepPrice: null,
			LowStep: null,
			HighStep: null,
			priceStepErr: null,
			buttonLoading: false,
			ProductOptions: [],
			ProductOptionGroups: [],
			selectedOptionGroup: null,
			ProductOptionMembers: [],
			selectedOptionMember: null,
			priceChange: "",
			isReplaceableImage: false,
			images: [],
			showCustomSelectorForDeleteref: false,
			IsReplaceDescription: false,
			Description: null,
			Loading: false,
			Language: languages_data.find(item => item.code === currLang),
			myOrignalLanguage: languages_data.find(item => item.code === currLang),
			remoteImage: false,
			reordering: false,
			showAddEditNewProductOptionInputs: false,
			Stock: null,
			stock: null,
			PriceChange: null,
			ProductOptionsForNewInputs: [],
			selectedProductOptionsForNewInputs: null,
			showDeleteCustomSelectorForRelation: false,
			screenWidth: Dimensions.get('screen').width,
			screenHeight: Dimensions.get('screen').height,

		}
		this.deleteRelationRef = React.createRef()
		this.setDefaultRef = React.createRef()
		this.NewInputOptions = React.createRef()
		this.LanguageRef = React.createRef()
		this.groupSelectorRef = React.createRef();
		this.memberSelectorRef = React.createRef();
		this.confirmRef = React.createRef();
		this.LibraryOrCameraRef = React.createRef();
		this.removeDefaultRef = React.createRef();
		this.LibraryOrCameraOptions = [{ Id: 0, Name: 'Camera' }, { Id: 1, Name: 'Library' }]
		this.listener = EventRegister.addEventListener('currentPost', (currentPost) => {
			if (currentPost == '7') {
				if (this.state.showAddEditNewProductOptionInputs) {
					this.submitRelation()
				} else {
					this.submitProductOption()
				}
			}
		})

		this.AddOptionGroupListener1 = EventRegister.addEventListener('isAddOptionGroupVisible', (isAddOptionGroupVisible) => {
			this.setState({ isAddOptionGroupVisible, isAddPhotosVisible: false, createMode: true, selectedOptionGroup: null, selectedOptionMember: null, priceChange: "", isReplaceableImage: false, images: [], Description: null, IsReplaceDescription: false })
		})

		this.AddOptionGroupListener2 = EventRegister.addEventListener('uploadOptionImage', (isAddOptionGroupVisible) => {
			this.LibraryOrCameraRef.current.show()
			// showImagePicker((Data) => {
			// 	// if (Data) {
			// 	// const { uri, path } = Data
			// 	// 	this.setState({ picker_image_uri: uri, ImageData: path })
			// 	// }
			// 	if (Data) {
			// 		const { uri, path } = Data
			// 		this.uploadOptionImage(path)
			// 	}
			// })
		})
	}

	submitRelation = () => {


		const {
			selectedProductOptionsForNewInputs,
			Stock,
			PriceChange,
			currentProductOptionId
		} = this.state

		if (!selectedProductOptionsForNewInputs) {

			return LongToast('CantHaveEmptyInputs')
		}

		EventRegister.emit('submitting', true)

		AddRelationProductOption({
			"FromProductOption": currentProductOptionId,
			"ToProductOption": selectedProductOptionsForNewInputs.GroupMember.Id,
			"Stock": Stock,
			"PriceChange": PriceChange
		}, res => {

			this.fetchContent();
			this.fetchOptionImages()
			this.setState({
				showAddEditNewProductOptionInputs: false,
				selectedProductOptionsForNewInputs: null,
				Stock: null,
				PriceChange: null
			})
			EventRegister.emit('submitting', false)
		}, err => {
			EventRegister.emit('submitting', false)
		})

	}

	componentDidMount() {
		// this.fetchContent();
		this.fetchOptionGroups();

		//re render when change orientation
		Dimensions.addEventListener('change', () => {
			this.setState({
				screenWidth: Dimensions.get('screen').width,
				screenHeight: Dimensions.get('screen').height,
			})
		})
	}

	componentDidUpdate(prevProps) {
		if (this.props.ProductId !== prevProps.ProductId) {
			// this.fetchContent();
			this.fetchOptionGroups();
			EventRegister.emit('isAddOptionGroupVisible', false)
		}
	}

	fetchOptionGroups = () => {
		this.cancelFetchDataGetProductOptionGroups = GetProductOptionGroups(2, res => {
			this.setState({ ProductOptionGroups: res.data.Data, selectedOptionGroup: res.data.Data[0], currentProductOptionId: null })
			this.fetchOptionMembers(res.data.Data[0].Id)
		})
	}

	fetchOptionMembers = (groupId) => {
		this.cancelFetchDataForFitchOptionMember = GetProductOptionMembers({ groupId, languageId: 2 }, res => {
			this.setState({ ProductOptionMembers: res.data.Data, selectedOptionMember: res.data.Data[0] }, this.fetchContent)
		})
	}

	fetchContent = () => {
		// this.setState({ didFetchData: false })

		this.cancelFetchData = GetProductOptions(this.props.ProductId, res => {

			const newOptons = []

			res.data.map(item => {
				newOptons.push(...item.GroupMembers)
			})

			this.setState({ ProductOptions: res.data, didFetchData: true, remoteImage: true, reordering: false, ProductOptionsForNewInputs: newOptons })
		})
	}

	componentWillUnmount() {
		EventRegister.emit('isAddOptionGroupVisible', false)
		EventRegister.emit('isAddPhotosVisible', false)
		EventRegister.removeEventListener(this.listener)
		EventRegister.removeEventListener(this.AddOptionGroupListener1)
		EventRegister.removeEventListener(this.AddOptionGroupListener2)
		this.cancelFetchDataGetProductOptionGroups && this.cancelFetchDataGetProductOptionGroups()
		this.cancelFetchDataForFitchOptionMember && this.cancelFetchDataForFitchOptionMember()
	}

	submitProductOption = () => {
		const { selectedOptionMember, priceChange, isReplaceableImage, Description, IsReplaceDescription, Language, myOrignalLanguage, stock, sku } = this.state
		const { ProductId } = this.props
		if (selectedOptionMember) {
			this.setState({ createButtonLoading: true })
			EventRegister.emit('submitting', true)
			AddProductOption({
				Id: this.state.createMode ? 0 : this.state.ProductOptionID,
				ProductId,
				ProductOptionGroupMemberId: selectedOptionMember.Id,
				IsReplaceImage: isReplaceableImage,
				PriceChange: priceChange,
				Description,
				IsReplaceDescription,
				LanguageId: Language.key,
				Stock: stock,
				SKU: sku,
			}, res => {

				EventRegister.emit('isAddOptionGroupVisible', false)
				this.fetchContent();
				this.setState({ isAddOptionGroupVisible: false, Language: myOrignalLanguage, stock: null })
				this.setState({ createButtonLoading: false })
				EventRegister.emit('submitting', false)
			})
		} else {
			LongToast('CantHaveEmptyInputs')

		}
	}

	submitProductOptionAndGetImages = () => {
		const { selectedOptionMember, priceChange, isReplaceableImage, Description, IsReplaceDescription, Language, myOrignalLanguage, stock } = this.state
		const { ProductId } = this.props
		if (selectedOptionMember) {
			this.setState({ createButtonLoading: true })
			AddProductOption({
				Id: this.state.createMode ? 0 : this.state.ProductOptionID,
				ProductId,
				ProductOptionGroupMemberId: selectedOptionMember.Id,
				IsReplaceImage: isReplaceableImage,
				PriceChange: priceChange,
				Description,
				IsReplaceDescription,
				LanguageId: Language.key,
				Stock: stock
			}, res => {
				this.fetchContent();
				// fetch images
				this.setState({ currentProductOptionId: res.data, createButtonLoading: false, isAddOptionGroupVisible: false, stock: null, isAddPhotosVisible: true, Language: myOrignalLanguage }, () => {
					this.fetchOptionImages(Language.key);
					EventRegister.emit('isAddPhotosVisible', true)
				})
			})
		} else {
			LongToast('CantHaveEmptyInputs')
		}
	}

	fetchOptionImages = (Languagekey = null) => {
		GetProductOptionDetails(this.state.currentProductOptionId, Languagekey, res => {
			this.setState({
				images: res.data.images,
				Description: res.data.Description,
				priceChange: res.data.PriceChange,
				selectedOptionGroup: res.data.OptionGroup,
				stock: res.data.Stock,
				sku: res.data.SKU,
				selectedOptionMember: res.data.GroupMember,
				isReplaceableImage: res.data.IsReplaceImage,
				ProductOptionID: res.data.Id,
				IsReplaceDescription: res.data.IsReplaceDescription,
				createMode: false,
				relations: res.data.relations
			})
		})
	}

	onSelectLanguage = (Language) => {

		const { createMode } = this.state

		if (createMode) {
			this.setState({ Language })
		}
		else {
			this.setState({ Language }, () => {
				this.fetchOptionImages(this.state.Language.key);
			})
		}
	}
	uploadOptionImage = (uri) => {
		EventRegister.emit('submitting', true)
		this.setState({ uploadingImg: true, ProsessEvent: 0 })
		this.cancelFetchDataDeleteProductMedia = AddProductOptionImage({ Image: uri, productOptionId: this.state.currentProductOptionId }, res => {
			this.setState({ uploadingImg: false, Language: this.state.myOrignalLanguage })
			EventRegister.emit('submitting', false)
			this.fetchOptionImages(this.state.Language.key);
		}, err => {
			this.setState({ uploadingImg: false, ProsessEvent: 0 })
		}, (re) => {
			this.setState({ uploadingImg: true, ProsessEvent: re * 0.01 })
		})
	}
	onCloseButtonPress = () => {
		this.cancelFetchDataDeleteProductMedia && this.cancelFetchDataDeleteProductMedia()
		this.setState({ uploadingImg: false, ProsessEvent: 0 })
	}

	renderImageItem = ({ item, index, drag, isActive }) => {
		return (
			<CustomTouchable
				onLongPress={() => {
					this.imageId = item.Id
					this.setState({ showCustomSelectorForDeleteref: true })
				}}
			>
				{/* {this.renderDeletebutton(item)} */}
				<View
					style={{
						backgroundColor: isActive ? '#cccccc' : 'white',
						flexDirection: 'row',
						justifyContent: 'space-between',
						paddingVertical: pagePadding,
					}}>
					<View
						style={{
							flex: 1,
							flexDirection: 'row',
						}}>
						<CircularImage
							uri={item.ImageUrl}
							size={50}
						/>

						<View
							style={{
								flex: 1,
								paddingLeft: largePagePadding,
								justifyContent: 'center',
								// alignItems: 'center',
							}}>
							<FontedText style={{ color: 'black' }}>{item.Name}</FontedText>
						</View>
					</View>

					<CustomTouchable
						onLongPress={drag}
						style={{
							padding: 10,
						}}>
						<Ionicons
							name={`ios-menu`}
							size={28}
							color={secondTextColor}
						// color={'#949EA5'} 

						/>
					</CustomTouchable>
				</View>
			</CustomTouchable>
		)
	}

	renderAddMode = () => {
		const { translate, Currency } = this.props
		const { myOrignalLanguage, currentProductOptionId } = this.state

		return (
			<View style={{ flex: 1 }}>
				<KeyboardAwareScrollView
					extraHeight={90}
					extraScrollHeight={90}
				>
					<ScrollView>
						<CustomTouchable onPress={() => this.setState({ isAddOptionGroupVisible: false, currentProductOptionId: null, stock: null, isAddPhotosVisible: false, Language: myOrignalLanguage }, () => {
							EventRegister.emit('isAddPhotosVisible', false)
							EventRegister.emit('isAddOptionGroupVisible', false)
						})} style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15 }}>
							<Ionicons
								style={{}}
								name='ios-arrow-back'
								size={16}
								// color={'#949EA5'} 
								color={secondTextColor}
							/>
							<TranslatedText style={{
								color: secondTextColor,
								// color: '#949EA5',
								paddingHorizontal: 10
							}} text={'ProductOption'} />
						</CustomTouchable>
						<ItemSeparator />

						<ArrowItem
							onPress={() => {
								this.groupSelectorRef.current.show()
							}}
							style={{ marginTop: 20 }}
							title={'Group'}
							info={this.state.selectedOptionGroup ? this.state.selectedOptionGroup.Name : translate('notselected')} />
						<ItemSeparator />

						<ArrowItem
							onPress={() => {
								this.memberSelectorRef.current.show()
							}}
							title={'Member'}
							info={this.state.selectedOptionMember ? this.state.selectedOptionMember.Name : translate('notselected')} />
						<ItemSeparator />
						<View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', margin: 20 }}>
							<FontedText style={{ backgroundColor: "#edeeef", padding: 5, borderRadius: 5 }}>{(Currency ? Currency.Name : "")}</FontedText>
							<TextInput value={this.state.priceChange ? String(this.state.priceChange) : null} placeholder={this.props.translate('Pricechange')} style={{ marginHorizontal: 8, width: "100%" }} keyboardType='numeric' onChangeText={(priceChange) => this.setState({ priceChange })} />
						</View>
						<ItemSeparator />
						<View style={{
							paddingVertical: 15,
							paddingHorizontal: 20,
							flexDirection: 'row',
							justifyContent: 'space-between',
							alignItems: 'center',
							backgroundColor: 'white',
						}}>
							<TranslatedText style={{
								// color: '#949EA5'
								color: secondTextColor
							}} text={'isreplaceableimage'} />
							<Switch onValueChange={() => { this.setState({ isReplaceableImage: !this.state.isReplaceableImage }) }} value={this.state.isReplaceableImage} />
						</View>

						<ItemSeparator />

						<HorizontalInput
							keyboardType='number-pad'
							label="Stock"
							// value={this.state.stock != null ? String(this.state.stock) : null}
							value={this.state.stock || this.state.stock == 0 ? String(this.state.stock) : null}
							onChangeText={stock => {
								this.setState({ stock });
							}}
						/>

						<ItemSeparator />

						<HorizontalInput
							maxLength={STRING_LENGTH_LONG}
							label="SKU"
							value={this.state.sku}
							onChangeText={sku => {
								this.setState({ sku });
							}}
						/>
						<ItemSeparator />


						<View style={{
							paddingVertical: 15,
							paddingHorizontal: 20,
							flexDirection: 'row',
							justifyContent: 'space-between',
							alignItems: 'center',
							backgroundColor: 'white',
						}}>
							<TranslatedText style={{
								// color: '#949EA5'
								color: secondTextColor
							}} text={'isreplaceableDescription'} />
							<Switch onValueChange={(IsReplaceDescription) => { this.setState({ IsReplaceDescription: IsReplaceDescription }) }} value={this.state.IsReplaceDescription} />

						</View>
						<ItemSeparator />

						<CustomTouchable onPress={this.submitProductOptionAndGetImages} style={{
							paddingVertical: 15,
							paddingHorizontal: 20,
							flexDirection: 'row',
							justifyContent: 'space-between',
							alignItems: 'center',
							backgroundColor: 'white',
						}}>
							<TranslatedText style={{
								// color: '#949EA5'
								color: secondTextColor
							}} text={'Images'} />
							<Ionicons
								style={{
									marginLeft: 10,
								}}
								name={I18nManager.isRTL ? 'ios-arrow-back' : 'ios-arrow-forward'}
								size={20}
								// color={'#3B3B4D'}
								color={mainTextColor}
							/>
						</CustomTouchable>

						<ItemSeparator />

						<ArrowItem
							onPress={() => {
								this.LanguageRef.current.show()
							}}
							title='Language'
							info={this.state.Language ? this.state.Language.label : null}
						/>
						{/* <TextInput 
				
				/> */}
						<ItemSeparator />

						<HorizontalInput
							numberOfLines={4}
							style={{ backgroundColor: 'rgba(242, 242, 242,0.2)' }}
							multiline={true}
							label="Description"
							value={this.state.Description}
							onChangeText={Description => {
								this.setState({ Description });
							}}
						/>
						{currentProductOptionId != null && this.renderProductOptionsNewInputs()}
					</ScrollView>
				</KeyboardAwareScrollView>
			</View>
		)
	}

	rendershowAddEditNewProductOptionInputs = () => {

		const { translate } = this.props

		const {
			selectedProductOptionsForNewInputs
		} = this.state

		return (
			<View style={{ flex: 1 }}>
				<KeyboardAwareScrollView
					extraHeight={90}
					extraScrollHeight={90}
				>
					<ScrollView>
						<CustomTouchable
							onPress={() => this.setState({ showAddEditNewProductOptionInputs: false, selectedProductOptionsForNewInputs: null, Stock: null, PriceChange: null })}
							style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15 }}>
							<Ionicons
								name='ios-arrow-back'
								size={16}
								color={secondTextColor}
							/>
							<TranslatedText style={{
								color: secondTextColor,
								paddingHorizontal: 10
							}} text={'Back'} />
						</CustomTouchable>

						<ArrowItem
							onPress={() => {
								this.NewInputOptions.current.show()
							}}
							style={{ marginTop: 20 }}
							title={'Member'}
							info={selectedProductOptionsForNewInputs ? selectedProductOptionsForNewInputs.GroupMember.Name : translate('notselected')} />

						<ItemSeparator />

						<HorizontalInput
							keyboardType='number-pad'
							label="Stock"
							value={this.state.Stock || this.state.Stock == 0 ? String(this.state.Stock) : null}
							onChangeText={Stock => {
								this.setState({ Stock });
							}}
						/>

						<ItemSeparator />

						<HorizontalInput
							keyboardType='decimal-pad'
							label="PriceChange"
							value={this.state.PriceChange ? String(this.state.PriceChange) : null}
							onChangeText={PriceChange => {
								this.setState({ PriceChange });
							}}
						/>
					</ScrollView>
				</KeyboardAwareScrollView>
			</View>
		)

	}

	renderProductOptionsNewInputs = () => {

		const relations = this.state.relations || []

		const { translate } = this.props

		return (
			<View
				style={{
					marginBottom: 10,
					paddingHorizontal: largePagePadding + 20
				}}
			>
				<CustomTouchable onPress={() => {
					this.set
					State({
						showAddEditNewProductOptionInputs: true,
						selectedProductOptionsForNewInputs: null,
						Stock: null,
						PriceChange: null
					})
				}}
					style={{ position: 'absolute', marginLeft: 10 }}
				>
					<Ionicons name='ios-add-circle-outline' color={secondTextColor} size={20} style={{}} />
				</CustomTouchable>

				<View
					style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 5 }}
				>
					<FontedText style={{ fontWeight: 'bold' }} >
						{translate('ToProductOption')}
					</FontedText>

					<FontedText style={{ fontWeight: 'bold' }} >
						{translate('Stock')}
					</FontedText>

					<FontedText style={{ fontWeight: 'bold' }} >
						{translate('PriceChange')}
					</FontedText>

				</View>

				{relations.map((item, index) => (
					<CustomTouchable
						onLongPress={() => {
							this.FromProductOption = this.state.currentProductOptionId
							this.ToProductOption = item.ToProductOption.Id

							this.setState({
								showDeleteCustomSelectorForRelation: true,
							})
						}}
						onPress={() => {
							this.setState({
								showAddEditNewProductOptionInputs: true,
								selectedProductOptionsForNewInputs: {
									...this.state.selectedProductOptionsForNewInputs,
									GroupMember: item.ToProductOption
								},
								Stock: item.Stock,
								PriceChange: item.PriceChange
							})
						}}
						key={index}
						style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 5 }}
					>
						<FontedText key={index} >
							{item.ToProductOption.Name || ''}
						</FontedText>

						<FontedText
						// style={{  width: 70 }}
						>
							{item.Stock || ''}
						</FontedText>

						<FontedText>
							{item.PriceChange || ''}
						</FontedText>

					</CustomTouchable>
				))}
			</View>
		)
		//currentProductOptionId
	}

	renderAddImages = () => (
		<View style={{ flex: 1, paddingHorizontal: 20, }}>
			<View onPress={() => { }} style={{
				paddingVertical: 15,
				flexDirection: 'row',
				justifyContent: 'space-between',
				alignItems: 'center',
				backgroundColor: 'white',
			}}>
				<CustomTouchable onPress={() => this.setState({ flex: 1, isAddOptionGroupVisible: false, isAddPhotosVisible: false }, () => {
					EventRegister.emit('isAddPhotosVisible', false)
					EventRegister.emit('isAddOptionGroupVisible', false)
					this.fetchContent()
				})} style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
					<Ionicons
						style={{}}
						name='ios-arrow-back'
						size={16}
						// color={'#949EA5'}
						color={secondTextColor}
					/>
					<TranslatedText style={{
						// color: '#949EA5',
						color: secondTextColor,
						marginHorizontal: 10
					}} text={'Images'} />
				</CustomTouchable>
			</View>
			<ItemSeparator />
			<DraggableFlatList
				data={this.state.images}
				renderItem={this.renderImageItem}
				style={{ marginTop: 20 }}
				keyExtractor={(item, index) => String(item.Id)}
				scrollPercent={5}
				onDragEnd={({ data }) => {
					ReorderProductOptionImages(this.state.currentProductOptionId, data.map(item => item.Id), (res) => {
						this.setState({ images: data })
					})
				}}
			/>
		</View>
	)
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
						DeleteProductOptionImage({ productOptionId: this.state.currentProductOptionId, imageId: Id }, (res) => {
							this.setState({ images: this.state.images.filter((img) => img.Id) })
							this.fetchOptionImages(this.state.Language.key)
						})
					}} />
			</View>
		)
	}

	renderContent = () => {
		if (this.state.didFetchData) {
			if (this.state.showAddEditNewProductOptionInputs) {
				return this.rendershowAddEditNewProductOptionInputs()
			}
			if (this.state.isAddOptionGroupVisible) {
				return this.renderAddMode()
			} else if (this.state.isAddPhotosVisible) {
				return this.renderAddImages()
			} else {
				const { Currency } = this.props
				return (
					<View style={{ flex: 1, }}>
						<ConfirmModal
							ref={this.confirmRef}
							onConfirm={() => {
								DeleteProductOption(this.state.DeleteProductOptionId, res => {
									this.fetchContent();
								})
							}}
						/>
						<DraggableFlatList
							ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
							keyExtractor={(item) => `draggable-item-${item.OptionGroup.Id}`}
							data={this.state.ProductOptions}
							ListEmptyComponent={() => <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 100 }}><TranslatedText text={'nooptionsfound'} /></View>}
							ItemSeparatorComponent={() => <ItemSeparator style={{ marginVertical: 30 }} />}
							onDragEnd={({ data }) => {
								this.setState({ didFetchData: false })
								ReoderProductOptionGroup(this.props.ProductId, data.map(item => item.OptionGroup.Id), () => {
									this.fetchContent()
								})
							}}
							renderItem={({ item, drag }) => (
								<CustomTouchable
									onLongPress={drag}
								>
									<View
										style={{
											flexDirection: 'row',
											alignItems: 'center',
											padding: 20,
										}}>

										<View
											style={{
												justifyContent: 'center',
												width: '100%'
											}}>
											<View
												style={{ flexDirection: 'row', justifyContent: 'space-between' }}
											>
												<FontedText style={{ color: "#1C162E", fontSize: 14, marginBottom: 10, fontWeight: '500' }}>{item.OptionGroup.Name}</FontedText>


												<Ionicons
													name={`ios-menu`}
													size={28}
													// color={'#949EA5'}
													color={secondTextColor}
												/>
											</View>


											{this.state.reordering ? <ActivityIndicator /> : <DraggableFlatList
												showsHorizontalScrollIndicator={false}
												horizontal
												data={item.GroupMembers}
												keyExtractor={(item, index) => String(index)}
												onDragEnd={({ data }) => {
													this.setState({ reordering: true })
													ReoderProductOption(this.props.ProductId, item.OptionGroup.Id, data.map(item => item.productOptionId), res => {
														this.fetchContent()
													})

												}}
												renderItem={({ item, drag }) => {
													const GroupMember = item
													return (
														<>

															<CustomTouchable
																onLongPress={drag}
																onPress={() => this.setState({ createMode: false, isAddOptionGroupVisible: true, currentProductOptionId: GroupMember.productOptionId }, () => {
																	EventRegister.emit('isAddOptionGroupVisible', true)
																	this.fetchOptionImages(this.state.Language.key)
																})} key={String(GroupMember.productOptionId)} style={{ marginHorizontal: 10, backgroundColor: 'rgba(244, 244, 244, 0.4)', padding: 10, }}>

																<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
																	<View>
																		<FontedText numberOfLines={1} style={{ flex: 1, maxWidth: this.state.screenWidth / 3.5 }}>{`${GroupMember.GroupMember.Name}`}</FontedText>
																		<FontedText style={{ flex: 1, color: '#3DA641', }}>{(Currency ? Currency.Name : "")}{((this.props.product.SalePrice || this.props.product.Price) + GroupMember.Price)}{GroupMember.Price && GroupMember.Price > 0 ? ` (${(Currency ? Currency.Name : "")}${GroupMember.Price})` : ''}</FontedText>
																	</View>
																	<View>

																		<CustomTouchable
																			onPress={() => { this.setState({ DeleteProductOptionId: GroupMember.productOptionId }, this.confirmRef.current.show()) }}
																			style={{ flex: .3, paddingHorizontal: 15, justifyContent: 'center', alignItems: 'center' }}>
																			<EvilIcons name='trash' color='red' size={25} />
																		</CustomTouchable>

																		{GroupMember.IsDefault ?
																			<CustomTouchable
																				activeOpacity={1}
																				onPress={() => {
																					this.DefaultProductOptionId = GroupMember.productOptionId;
																					this.removeDefaultRef.current.show()
																				}}
																				style={{ flex: .3, marginTop: 8, justifyContent: 'center', alignItems: 'center' }}>
																				<View >
																					<MaterialCommunityIcons
																						name='flag-remove'
																						color='red'
																						size={16}
																					/>
																				</View>
																			</CustomTouchable>
																			:
																			<CustomTouchable
																				onPress={() => {
																					this.DefaultProductOptionId = GroupMember.productOptionId;
																					this.setDefaultRef.current.show()
																				}}
																				activeOpacity={1}
																				style={{ flex: .3, marginTop: 8, justifyContent: 'center', alignItems: 'center' }}>
																				<View >
																					<MaterialCommunityIcons
																						name='flag-plus'
																						color={secondColor}
																						size={16}
																					/>
																				</View>
																			</CustomTouchable>

																		}
																	</View>

																</View>


																<View style={{ flexDirection: 'row' }}>
																	{
																		GroupMember.images.map((memberImage, index) => {

																			if (index == 3 && GroupMember.images.length > 3) {
																				return (<View key={String(memberImage.Id)} style={{ justifyContent: 'center', alignItems: 'center' }} >
																					<FontedText style={{ color: secondColor }} > {`+${GroupMember.images.length - 3} More`} </FontedText>
																				</View>)
																			}

																			else if (index > 2) {
																				return null
																			}
																			else {
																				return (
																					<CircularImage
																						key={String(memberImage.Id)}
																						uri={memberImage.ImageUrl}
																						style={{ width: 100, height: 100, borderRadius: 17, marginRight: 8, marginTop: 8 }}
																					/>

																				)
																			}

																		}
																		)
																	}
																</View>

															</CustomTouchable>
														</>
													)
												}
												}
											/>}



										</View>
									</View>
								</CustomTouchable>
							)}
						/>
					</View>
				)
			}
		} else {
			return (
				<View style={{ flex: 1, minHeight: this.state.screenHeight / 2, alignItems: 'center', justifyContent: 'center' }}>
					<ActivityIndicator />
				</View>
			)
		}
	}

	AddEditImage = (chosseindex) => {
		if (chosseindex == 0) {

			OpenCamera(Data => {
				const {
					uri,
					path
				} = Data

				this.uploadOptionImage(path)

				// this.setState({
				//     picker_image_uri: uri,
				//     ImageData: path,
				//     remoteImage: false
				// })

			})

		} else {
			OpenSingleSelectImagePicker(Data => {
				const {
					uri,
					path
				} = Data
				this.uploadOptionImage(path)
				// this.setState({
				//     picker_image_uri: uri,
				//     ImageData: path,
				//     remoteImage: false
				// })
			})
		}
	}

	render() {
		const { ProductOptionGroups, ProductOptionMembers, ProductOptionsForNewInputs } = this.state

		const { languages_data } = this.props



		return (
			<LazyContainer style={{ flex: 1, width: this.state.screenWidth, backgroundColor: "#FFF", }}>

				{this.renderContent()}

				{ProductOptionGroups && <CustomSelector
					ref={this.groupSelectorRef}
					options={ProductOptionGroups.map(item => item.Name)}
					onSelect={(index) => { this.setState({ selectedOptionGroup: ProductOptionGroups[index] }, () => this.fetchOptionMembers(ProductOptionGroups[index].Id)) }}
					onDismiss={() => { }}
				/>}


				<CustomSelector
					ref={this.setDefaultRef}
					options={['Set Default']}
					onSelect={(index) => {
						SetProductOptionDefault(this.DefaultProductOptionId, () => {
							LongToast('dataSaved');
							this.fetchContent()
						})
					}}
					onDismiss={() => { }}
				/>

				<CustomSelector
					ref={this.removeDefaultRef}
					options={['Remove Default']}
					onSelect={(index) => {

						removeProductOptionDefault(this.DefaultProductOptionId, () => {
							LongToast('dataSaved');
							this.fetchContent()
						})

					}}
					onDismiss={() => { }}
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

						DeleteProductOptionImage({ productOptionId: this.state.currentProductOptionId, imageId: this.imageId }, (res) => {
							this.setState({
								images: this.state.images.filter((img) => img.Id),
								showCustomSelectorForDeleteref: false,
								Loading: false
							})
							LongToast('dataDeleted')
							this.fetchOptionImages(this.state.Language.key)
						}, () => {
							this.setState({ Loading: false })
						})
					}}
				/>

				<CustomSelectorForDeleteAndEdit
					showCustomSelectorForDeleteref={this.state.showDeleteCustomSelectorForRelation}
					justForDelete={true}
					onCancelDelete={() => {
						this.setState({ showDeleteCustomSelectorForRelation: false })
					}}
					onCancelConfirm={() => {
						this.setState({ showDeleteCustomSelectorForRelation: false })
					}}
					onDelete={() => {
						this.setState({
							showDeleteCustomSelectorForRelation: false
						})

						DeleteRelationProductOption(this.FromProductOption, this.ToProductOption, () => {
							this.fetchOptionImages()
							LongToast('dataDeleted')
						})

					}}
				/>

				{ProductOptionMembers && <CustomSelector
					ref={this.memberSelectorRef}
					options={ProductOptionMembers.map(item => item.Name)}
					onSelect={(index) => { this.setState({ selectedOptionMember: ProductOptionMembers[index] }) }}
					onDismiss={() => { }}
				/>}
				{this.state.uploadingImg == true ?
					<CustomModal
						visible={this.state.uploadingImg}
						contentContainerStyle={{ ...shadowStyle1, }}
					>

						<View style={{ position: 'absolute', right: 10, top: 10 }} >
							<RoundedCloseButton onPress={() => { this.onCloseButtonPress() }} />
						</View>

						<CustomLoader
							style={{ backgroundColor: 'white', borderRadius: 60, position: 'relative' }}
							size={100}
							progress={this.state.prossesEvent == 0 ? this.state.ProsessEvent : this.state.ProsessEvent}
						/>

					</CustomModal> : null}


				{languages_data && <CustomSelector
					ref={this.LanguageRef}
					options={languages_data.map(item => item.label)}
					onSelect={(index) => { this.onSelectLanguage(languages_data[index]) }}
					onDismiss={() => { }}
				/>}

				<CustomSelector
					ref={this.LibraryOrCameraRef}
					options={this.LibraryOrCameraOptions.map(item => item.Name)}
					onSelect={(chosseindex) => {
						this.AddEditImage(chosseindex)
					}}
					onDismiss={() => { }}
				/>
				{this.state.ProductOptions.length > 0 &&
					<CustomSelector
						ref={this.NewInputOptions}
						options={ProductOptionsForNewInputs.map(item => item.GroupMember.Name)}
						onSelect={(chosseindex) => {
							this.setState({
								selectedProductOptionsForNewInputs: ProductOptionsForNewInputs[chosseindex]

							})
						}}
						onDismiss={() => { }}
					/>}
			</LazyContainer>
		)
	}
}
const mapStateToProps = ({
	login: {
		Currency,
	},
	language: {
		languages_data,
		currLang,
	},
}) => ({
	Currency,
	languages_data,
	currLang,
})

export default connect(mapStateToProps)(withLocalize(ProductOptions))