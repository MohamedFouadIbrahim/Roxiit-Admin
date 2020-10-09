import React, { Component } from 'react';
import { withLocalize } from 'react-localize-redux';
import { ActivityIndicator, Keyboard, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import ArrowItem from '../../components/ArrowItem/index.js';
import ConditionalCircularImage from '../../components/ConditionalCircularImage';
import CustomHeader from '../../components/CustomHeader/index.js';
import CustomLoader from '../../components/CustomLoader/index';
import CustomSelector from '../../components/CustomSelector/index.js';
import CustomTouchable from '../../components/CustomTouchable';
import HorizontalInput from '../../components/HorizontalInput/index.js';
import ItemSeparator from '../../components/ItemSeparator/index.js';
import LazyContainer from '../../components/LazyContainer';
import { STRING_LENGTH_LONG } from '../../constants/Config';
import { largePagePadding } from '../../constants/Style.js';
import { editCategory, GetCategory } from "../../services/CategoriesService";
import { getFilters } from '../../services/FilterService.js';
import { SelectEntity } from '../../utils/EntitySelector.js';
import { OpenSingleSelectImagePicker, OpenCamera } from '../../utils/Image';
import { LongToast } from '../../utils/Toast.js';
import SwitchItem from '../../components/SwitchItem';
import { SelectMultiLevel } from '../../utils/EntitySelector.js';

class newCategory extends Component {
	constructor(props) {
		super(props);
		const { languages_data, currLang } = this.props

		this.state = {
			fetching: false,
			editMode: true,
			submitingCategory: false,
			Language: languages_data.find(item => item.code === currLang),
			ImageUrl: '',
			name: '',
			AltName: '',
			description: '',
			htmlDescription: '',
			prossesEvent: 0,
			selectedCategory: [],
			ChildrenCategory: [],
			Products: [],
			remoteImage: false,
			IsShowInHomePage: false,
			IsShowInHomePageOrder: null,
			IsDraft: false,
			InHomePageMaxHieght: false,
			AllowToCustomer: true,
		}
		this.Id = 0
		this.parentCatRef = React.createRef();
		this.languagesRef = React.createRef();
		this.LibraryOrCameraRef = React.createRef();
		this.LibraryOrCameraOptions = [{ Id: 0, Name: 'Camera' }, { Id: 1, Name: 'Library' }]
	}

	componentDidMount() {
		this.fetchFiiter()
	}

	componentWillUnmount() {
		this.cancelFetchDatagetFilters && this.cancelFetchDatagetFilters()
		this.cancelFetchDataeditCategory && this.cancelFetchDataeditCategory()
	}
	onSelectLanguage = (index) => {
		const { languages_data } = this.props
		const selectedLanguage = languages_data[index]
		this.setState({ ChangeToLanguage: selectedLanguage }, () => {
			if (this.Id) {
				this.fetchCategories(this.state.ChangeToLanguage.key)
			}
		})

	}

	fetchCategories = (LangId = null) => {
		this.cancelFetchData = GetCategory(this.Id, LangId, (res) => {
			this.setState({
				name: res.data.Name ? res.data.Name : null,
				description: res.data.Description ? res.data.Description : null,
				htmlDescription: res.data.HtmlDescription,
				ShowProductsWithChildren: res.data.ShowProductsWithChildren,
				ImageUrl: res.data.Icon.ImageUrl,
				selectedCategory: res.data.ParentCategory,
				fetching: false,
				Icon: res.data.Icon,
				ChildrenCategory: res.data.ChildrenCategory.map(item => item.Id),
				Products: res.data.Products,
				remoteImage: true,
				IsDraft: res.data.IsDraft,
				AllowToCustomer: res.data.AllowToCustomer,
			})
		})
	}

	fetchFiiter = () => {
		this.cancelFetchDatagetFilters = getFilters({ categories: true }, (res) => {
			const Data = res.data.Categories
			this.setState({ categories: Data })
		});
	}

	submitCategory = () => {
		Keyboard.dismiss()
		const {
			IsDraft,
			name,
			AltName,
			description,
			selectedCategory,
			Language,
			selectedLanguage,
			ChangeToLanguage,
			ImageData,
			ShowProductsWithChildren,
			ChildrenCategory,
			Products,
			IsShowInHomePage,
			IsShowInHomePageOrder,
			InHomePageMaxHieght,
			AllowToCustomer,
		} = this.state

		if (!name || !Language) {
			return LongToast('CantHaveEmptyInputs')
		}

		this.setState({ submitingCategory: true, uploadingImage: true, prossesEvent: 0 })

		const args = {
			Id: this.Id,
			LanguageId: ChangeToLanguage ? ChangeToLanguage.key : Language.key,
			Name: name,
			AltName,
			ParentCategory: selectedCategory.map(item => item.Id),
			Description: description, HtmlDescription: 'mohamed',
			Image: ImageData,
			ShowProductsWithChildren,
			ChildrenCategory: ChildrenCategory.map(item => item.Id),
			Products: Products.length ? Products.map(item => item.Id) : [],
			IsShowInHomePage,
			IsShowInHomePageOrder,
			IsDraft,
			InHomePageMaxHieght,
			AllowToCustomer,
		}
		if (this.state.ImageUrl.length > 0) {
			args.Image = this.state.ImageData
		}

		this.cancelFetchDataeditCategory = editCategory(args, (res) => {
			this.Id = res.data
			this.setState({ submitingCategory: false, uploadingImage: false, prossesEvent: 0 })
			this.props.route.params?.onChildChange && this.props.route.params?.onChildChange()
			this.props.navigation.goBack()
			LongToast('dataSaved')
		}, (err) => {

			this.setState({ submitingCategory: false, uploadingImage: false, prossesEvent: 0 })
			return LongToast('DataNotSaved')
		}, (re) => {
			this.setState({ prossesEvent: re * 0.01 })
		})
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

	renderCategory = () => {
		const { selectedCategory, ChangeToLanguage, Language, categories, ChildrenCategory, Products, IsDraft, AllowToCustomer, AltName } = this.state
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
					maxLength={STRING_LENGTH_LONG}
					label="AltName"
					value={AltName}
					onChangeText={(AltName) => { this.setState({ AltName }) }} />

				<ItemSeparator />

				<HorizontalInput
					// style={{ maxHeight: 45 }}
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

				<ArrowItem
					onPress={() => {
						SelectEntity(this.props.navigation, Result => {
							this.setState({ Products: Result })
						}, 'Products', null, true, 2, Products, { pagination: true })

					}}
					title={'Products'}
					info={Products ? Products.length : 0} />
			</ScrollView>
		)
	}


	renderImage = () => {
		const imageSize = 90
		const { ImageUrl, remoteImage } = this.state
		return (
			<View style={{ margin: largePagePadding * 2, justifyContent: 'center', alignItems: 'center', padding: largePagePadding, }}>
				{
					this.state.ImageUrl ?
						<CustomTouchable
							//  activeOpacity={1}
							onPress={() => { this.LibraryOrCameraRef.current.show() }}
							style={{
								position: 'absolute',
								alignSelf: 'center',
								justifyContent: 'center',
								alignItems: 'center',
								width: imageSize,
								height: imageSize,
								borderRadius: imageSize / 2,
							}}>
							<ConditionalCircularImage
								remote={remoteImage}
								uri={ImageUrl}
								size={imageSize} />

						</CustomTouchable>
						: <CustomTouchable
							onPress={() => { this.LibraryOrCameraRef.current.show() }}
							style={{
								position: 'absolute',
								alignSelf: 'center',
								justifyContent: 'center',
								alignItems: 'center',
								backgroundColor: 'rgba(0, 0, 0, .5)',
								width: imageSize,
								height: imageSize,
								borderRadius: imageSize / 2,
							}}>
							<Ionicons
								name={`ios-add`}
								size={45}
								color={'white'} />
						</CustomTouchable>
				}


				{this.state.uploadingImage == true ?
					<CustomLoader
						size={imageSize - 30}
						progress={this.state.prossesEvent == 0 ? this.state.prossesEvent : this.state.prossesEvent}
					/>
					: null
				}
			</View>
		)
	}

	render() {
		const { categories } = this.state
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
									// padding: headerButtonPadding,
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
					this.renderCategory()
				}


				{categories && <CustomSelector
					notRequried={true}
					ref={this.parentCatRef}
					options={categories.map(item => item.Name)}
					onSelect={(index) => { this.setState({ category: categories[index] }) }}
					onDismiss={() => { }}
				/>}
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
	hello_data
})
export default connect(mapStateToProps)(withLocalize(newCategory))