import React, { Component } from 'react';
import { ActivityIndicator, Keyboard, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { withLocalize } from 'react-localize-redux';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import ConditionalCircularImage from '../../components/ConditionalCircularImage';
import CustomHeader from '../../components/CustomHeader/index.js';
import CustomLoader from '../../components/CustomLoader/index';
import CustomSelector from '../../components/CustomSelector/index.js';
import CustomTouchable from '../../components/CustomTouchable';
import HorizontalInput from '../../components/HorizontalInput/index.js';
import ItemSeparator from '../../components/ItemSeparator/index.js';
import LazyContainer from '../../components/LazyContainer';
import SwitchItem from '../../components/SwitchItem';
import { mainColor, secondTextColor } from '../../constants/Colors.js';
import { STRING_LENGTH_LONG } from '../../constants/Config';
import { largePagePadding } from '../../constants/Style.js';
import { editCategory, GetCategory } from "../../services/CategoriesService";
import { SelectEntity } from '../../utils/EntitySelector.js';
import { SelectMultiLevel } from '../../utils/EntitySelector.js';
import { OpenSingleSelectImagePicker, OpenCamera } from '../../utils/Image';
import { LongToast } from '../../utils/Toast.js';
import TranslatedText from '../../components/TranslatedText/index.js';
import FontedText from '../../components/FontedText/index.js';

class Category extends Component {
	constructor(props) {
		super(props);
		const { languages_data, currLang } = this.props
		this.state = {
			fetching: true,
			category: undefined,
			editMode: false,
			submitingCategory: false,
			Language: languages_data.find(item => item.code === currLang),
			// cat inputs
			ImageUrl: '',
			name: '',
			description: '',
			htmlDescription: ' ',
			selectedCategory: [],
			prossesEvent: 0,
			Products: [],
			remoteImage: false,
			IsShowInHomePage: false,
			IsShowInHomePageOrder: null,
			IsDraft: false,
			InHomePageMaxHieght: false,
			AllowToCustomer: false,
		}
		
		this.categoryId = this.props.route.params?.categoryId

		this.LibraryOrCameraRef = React.createRef();
		this.LibraryOrCameraOptions = [{ Id: 0, Name: 'Camera' }, { Id: 1, Name: 'Library' }]
		this.languagesRef = React.createRef();
	}

	componentDidMount() {
		this.fetchCategories()
	}

	componentDidUpdate(prevProps) {
		if (this.props.navigation !== prevProps.navigation) {
			this.fetchCategories()
		}
	}

	componentWillUnmount() {
		this.cancelFetchData && this.cancelFetchData()
	}

	fetchCategories = (LangId = null) => {
		this.cancelFetchData = GetCategory(this.categoryId, LangId, (res) => {
			this.setState({
				name: res.data.Name,
				description: res.data.Description,
				htmlDescription: res.data.HtmlDescription,
				ShowProductsWithChildren: res.data.ShowProductsWithChildren,
				ImageUrl: res.data.Icon.ImageUrl,
				selectedCategory: res.data.ParentCategory,
				fetching: false,
				Icon: res.data.Icon,
				ChildrenCategory: res.data.ChildrenCategory,
				Products: res.data.Products,
				remoteImage: true,
				// IsShowInHomePage: res.data.IsShowInHomePage,
				// IsShowInHomePageOrder: res.data.IsShowInHomePageOrder,
				IsDraft: res.data.IsDraft,
				InHomePageMaxHieght: res.data.InHomePageMaxHieght,
				AllowToCustomer: res.data.AllowToCustomer,
			})
		})
	}

	fetchCategoryProducts = () => {
		this.cancelFetchData = GetCategory(this.categoryId, null, (res) => {
			this.setState({
				Products: res.data.Products,
			})
		})
	}

	submitCategory = () => {
		Keyboard.dismiss()

		this.setState({ submitingCategory: true })

		const {
			name,
			description,
			selectedCategory,
			htmlDescription,
			Language,
			ChangeToLanguage,
			ImageData,
			ShowProductsWithChildren,
			Products,
			ChildrenCategory,
			IsShowInHomePage,
			IsDraft,
			IsShowInHomePageOrder,
			InHomePageMaxHieght,
			AllowToCustomer,
		} = this.state

		if (!name) {
			return LongToast('CantHaveEmptyInputs')
		}

		const Id = this.props.route.params?.categoryId

		const args = {
			Id,
			LanguageId: ChangeToLanguage ? ChangeToLanguage.key : Language.key,
			Name: name,
			ParentCategory: selectedCategory.map(item => item.Id),
			Description: description,
			HtmlDescription: htmlDescription,
			Image: ImageData,
			ShowProductsWithChildren,
			ChildrenCategory: ChildrenCategory.map(item => item.Id),
			Products: Products.map(item => item.Id),
			// IsShowInHomePage,
			// IsShowInHomePageOrder,
			IsDraft,
			InHomePageMaxHieght,
			AllowToCustomer,
		}

		this.setState({ uploadingImage: true, prossesEvent: 0 })

		this.cancelFetchDataeditCategory = editCategory(args, (res) => {
			this.setState({ submitingCategory: false, uploadingImage: false, prossesEvent: null })
			this.props.route.params?.onChildChange && this.props.route.params?.onChildChange()
			// this.props.navigation.goBack()
			LongToast('dataSaved')
		}, (err) => {
			this.setState({ submitingCategory: false, uploadingImage: false, prossesEvent: null })
		}, (re) => {
			this.setState({ prossesEvent: re * 0.01 })
		})
	}

	renderCategory = () => {
		const { selectedCategory, ChangeToLanguage, Language, ChildrenCategory, Products, AllowToCustomer } = this.state
		const { translate } = this.props
		return (
			<ScrollView>
				<ArrowItem
					onPress={() => {
						this.languagesRef.current.show()
					}}
					title={'Language'}
					info={ChangeToLanguage ? ChangeToLanguage.label : Language.label} />

				<ItemSeparator />

				{this.renderImage()}

				<HorizontalInput
					maxLength={STRING_LENGTH_LONG}
					label="Name"
					value={this.state.name}
					onChangeText={(text) => { this.setState({ name: text }) }} />

				<ItemSeparator />

				<HorizontalInput
					multiline
					label="Description"
					value={this.state.description}
					onChangeText={(text) => { this.setState({ description: text }) }} />

				<ItemSeparator />

				<SwitchItem
					value={this.state.ShowProductsWithChildren}
					title={'ShowProductsWithChildren'}
					onValueChange={(ShowProductsWithChildren) => { this.setState({ ShowProductsWithChildren }) }}
				/>
				<ItemSeparator />

				<SwitchItem
					value={this.state.IsDraft}
					title={'IsDraft'}
					onValueChange={(IsDraft) => { this.setState({ IsDraft }) }}
				/>
				<ItemSeparator />

				<SwitchItem
					value={this.state.InHomePageMaxHieght}
					title={'InHomePageMaxHieght'}
					onValueChange={(InHomePageMaxHieght) => { this.setState({ InHomePageMaxHieght }) }}
				/>
				<ItemSeparator />

				{this.props.hello_data.StoreTypeId == 3 &&
					<SwitchItem
						value={AllowToCustomer}
						title={'ShownInCustomer'}
						onValueChange={(AllowToCustomer) => { this.setState({ AllowToCustomer }) }}
					/>}
				{this.props.hello_data.StoreTypeId == 3 &&
					<ItemSeparator />
				}
				<ArrowItem
					onPress={() => {
						SelectMultiLevel(this.props.navigation, selectedCategory => {
							this.setState({ selectedCategory })
						}, 'Categories', null, 2, selectedCategory, { canSelectParents: true })
					}}
					title={'ParentCategory'}
					info={selectedCategory ? selectedCategory.length : 0} />

				<ItemSeparator />

				<ArrowItem
					onPress={() => {
						SelectMultiLevel(this.props.navigation, ChildrenCategory => {
							this.setState({ ChildrenCategory })
						}, 'Categories', null, 2, ChildrenCategory, { canSelectParents: true })
					}}
					title={'ChildrenCategory'}
					info={ChildrenCategory ? ChildrenCategory.length : 0} />

				<ItemSeparator />

				<View
					style={{
						paddingVertical: 15,
						paddingHorizontal: largePagePadding,
						flexDirection: 'row',
						justifyContent: 'space-between',
						alignItems: 'center',
						backgroundColor: 'white',
					}}>
					<View
						style={{
							justifyContent: 'center',
						}}>
						<TranslatedText
							style={{
								color: secondTextColor
							}}
							text={"Products"} />
					</View>

					<View
						style={{
							flexDirection: 'row',
							alignItems: 'center',
							paddingLeft: 10,
						}}>
						<CustomTouchable
							onPress={() => {
								const OneCategory = {
									Id: this.categoryId,
									Name: this.state.name
								}
								this.props.navigation.navigate("newProduct_Alt", {
									Categories: [OneCategory],
									onChildChange: this.fetchCategoryProducts
								})
							}}
							style={{
								flexDirection: 'row',
								justifyContent: 'center',
								alignItems: 'center',
							}}>
							<TranslatedText
								style={{
									color: mainColor,
									marginRight: 5,
								}}
								text={"New"} />

							<Ionicons
								name={'ios-add'}
								size={22}
								color={mainColor} />
						</CustomTouchable>

						<CustomTouchable
							onPress={() => {
								SelectEntity(this.props.navigation, Products => {
									this.setState({ Products })
								}, 'Products/Simple', null, true, 2, Products)
							}}
							style={{
								marginLeft: largePagePadding,
								flexDirection: 'row',
								justifyContent: 'center',
								alignItems: 'center',
							}}>
							<TranslatedText
								style={{
									color: mainColor,
									marginRight: 5,
								}}
								text={"Select"} />

							{Products && Products.length > 0 ? <FontedText
								style={{
									color: mainColor,
								}}>({Products.length})</FontedText> : <Ionicons
									name={'ios-search'}
									size={18}
									color={mainColor} />}
						</CustomTouchable>
					</View>
				</View>

			</ScrollView>
		)
	}

	AddEditImage = (chosseindex) => {
		if (chosseindex == 0) {
			OpenCamera(Data => {
				const {
					uri,
					path
				} = Data
				this.setState({
					ImageUrl: uri,
					ImageData: path,
					remoteImage: false
				})
			})

		} else {
			OpenSingleSelectImagePicker(Data => {
				const {
					uri,
					path
				} = Data
				this.setState({
					ImageUrl: uri,
					ImageData: path,
					remoteImage: false
				})
			})
		}
	}
	renderImage = () => {
		const imageSize = 90
		const { ImageUrl, remoteImage } = this.state

		return (
			<CustomTouchable
				onPress={() => {
					this.LibraryOrCameraRef.current.show()
				}}
				style={{
					alignSelf: 'center',
					justifyContent: 'center',
					alignItems: 'center',
					margin: largePagePadding,
				}}>

				<ConditionalCircularImage
					remote={remoteImage}
					uri={ImageUrl ? ImageUrl : null}
					size={imageSize} />

				<FontAwesome
					style={{
						position: 'absolute',
						right: 2,
						bottom: 2,
					}}
					name={`camera`}
					size={20}
					color={mainColor} />
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

	onSelectLanguage = (index) => {
		const { languages_data } = this.props
		const selectedLanguage = languages_data[index]
		this.setState({ ChangeToLanguage: selectedLanguage }, () => {
			this.fetchCategories(this.state.ChangeToLanguage.key)
		})
	}

	render() {
		const { languages_data } = this.props

		return (
			<LazyContainer style={{ flex: 1, backgroundColor: "#FFF" }}>
				<CustomHeader
					navigation={this.props.navigation}
					title={"Category"}
					rightComponent={
						this.state.submitingCategory ?
							<ActivityIndicator color="#FFF" size="small" />
							:
							<CustomTouchable
								onPress={this.submitCategory}
								style={{
									flexDirection: 'row',
									justifyContent: 'center',
									alignItems: 'center',
									flex: 1,
								}}>
								<Ionicons
									name={`md-checkmark`}
									size={18}
									color={'white'} />
							</CustomTouchable>
					} />

				{Platform.OS == 'ios' ?
					this.state.fetching ? null :
						<KeyboardAvoidingView behavior='padding' enabled
							style={{ flex: 1 }}
							keyboardVerticalOffset={40}
						>
							{this.renderCategory()}
						</KeyboardAvoidingView> :
					this.renderCategory()}

				{languages_data && <CustomSelector
					ref={this.languagesRef}
					options={languages_data.map(item => item.label)}
					onSelect={(index) => { this.onSelectLanguage(index) }}
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

			</LazyContainer>
		)
	}
}
const mapStateToProps = ({
	language: {
		languages_data,
		currLang,
	},
	login: {
		hello_data
	},
}) => ({
	languages_data,
	currLang,
	hello_data,
})
export default connect(mapStateToProps)(withLocalize(Category))