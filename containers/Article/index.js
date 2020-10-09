import React, { Component } from 'react'
import { ScrollView, KeyboardAvoidingView, Platform, View } from 'react-native'
import { connect } from 'react-redux'
import CustomHeader from '../../components/CustomHeader/index.js';
import LazyContainer from '../../components/LazyContainer'
import ItemSeparator from '../../components/ItemSeparator/index.js';
import HorizontalInput from '../../components/HorizontalInput/index.js';
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import AntDesign from 'react-native-vector-icons/AntDesign'
import ConditionalCircularImage from '../../components/ConditionalCircularImage';
import { largePagePadding, pagePadding } from '../../constants/Style.js';
import { OpenSingleSelectImagePicker, OpenCamera } from '../../utils/Image.js';
import { withLocalize } from 'react-localize-redux';
import HeaderSubmitButton from '../../components/HeaderSubmitButton/index.js';
import { mainColor, secondTextColor } from '../../constants/Colors.js';
import { STRING_LENGTH_MEDIUM } from '../../constants/Config';
import { GetArticle, AddEditArticle } from '../../services/ArticlesService.js';
import ArrowItem from '../../components/ArrowItem/index.js';
import { SelectEntity } from '../../utils/EntitySelector.js';
import { getFilters } from '../../services/FilterService.js';
import CustomSelector from '../../components/CustomSelector/index.js';
import { getIconsArray } from '../../utils/iconsList/index';
import CustomLoader from '../../components/CustomLoader/index';
import TranslatedText from '../../components/TranslatedText';
import { LongToast } from '../../utils/Toast.js';
import CustomTouchable from '../../components/CustomTouchable';
// import TextEditorInput from '../../components/TextEditorInput/index.js';
import SwitchItem from '../../components/SwitchItem/index.js';

class Article extends Component {
	constructor(props) {
		super(props)
		const { languages_data, currLang } = this.props

		this.state = {
			picker_image_uri: null,
			lockSubmit: false,
			didFetchData: false,
			// Language: languages_data.find(item => item.code === currLang),
			Language: this.props.languages_data[1],
			remoteImage: false,
			IncludeInSideMenu: false,
			IncludeInNavBar: false
		}

		if (this.props.route.params && this.props.route.params?.Id) {
			this.editMode = true
			this.articleId = this.props.route.params?.Id
		}
		else {
			this.editMode = false
		}

		this.lockSubmit = false

		this.typeSelectorRef = React.createRef();
		this.languageSelectorRef = React.createRef();
		this.LibraryOrCameraRef = React.createRef();
		this.LibraryOrCameraOptions = [{ Id: 0, Name: 'Camera' }, { Id: 1, Name: 'Library' }]
	}
	componentWillUnmount() {
		this.cancelFetchDatagetFilters && this.cancelFetchDatagetFilters()
		this.cancelFetchDataGetArticle && this.cancelFetchDataGetArticle()
	}

	componentDidMount() {
		this.cancelFetchDatagetFilters = getFilters({
			articleTypes: true,
		}, res => {
			const {
				ArticleTypes,
			} = res.data

			this.setState({
				ArticleTypes,
			})
		})

		this.fetchData()
	}

	fetchData = () => {
		if (this.articleId) {
			this.cancelFetchDataGetArticle = GetArticle(this.articleId, this.state.Language ? this.state.Language.key : null, res => {
				const { Language, ...restData } = res.data
				this.setState({
					...restData,
					Language: {
						key: Language.Id,
						label: Language.Name,
					},
					didFetchData: true,
					remoteImage: true
				})
			})
		}
	}

	submit = () => {
		if (this.lockSubmit) {
			return
		}
		const IconArray = getIconsArray()
		const {
			Name,
			ShortDescription,
			Description,
			ParentArticle,
			MobileIcon,
			MobileIconFamily,
			Type,
			Language,
			ParentArticleId,
			picker_image_uri,
			ImageData,
			HtmlDescription,
			IncludeInSideMenu,
			IncludeInNavBar
		} = this.state

		if (!Name) {
			return LongToast('CantHaveEmptyInputs')
		}

		if (this.editMode) {
			this.lockSubmit = true
			this.setState({ lockSubmit: true, uploadingImage: true, prossesEvent: 0 })
			this.cancelFetchDataAddEditArticle = AddEditArticle({
				Id: this.articleId,
				languageId: Language.key,
				TypeId: Type.Id,
				Name,
				ShortDescription,
				Description,
				HtmlDescription,
				ParentArticleId,
				MobileIcon,
				MobileIconFamily,
				Image: ImageData,
				IncludeInSideMenu,
				IncludeInNavBar
			}, res => {
				this.setState({ didSucceed: true, uploadingImage: false, prossesEvent: 0 })
				this.props.route.params?.onChildChange && this.props.route.params?.onChildChange()
				this.props.navigation.goBack()
			}, err => {
				this.setState({ lockSubmit: false, uploadingImage: false, prossesEvent: 0 })
				this.lockSubmit = false
			}, (re) => {
				this.setState({ prossesEvent: re * 0.01 })
			})
		}
		else {
			this.setState({ lockSubmit: true, uploadingImage: true, prossesEvent: 0 })
			this.lockSubmit = true
			this.cancelFetchData = AddEditArticle({
				Id: 0,
				languageId: Language.key,
				TypeId: Type ? Type.Id : this.state.ArticleTypes[0].Id,
				Name,
				ShortDescription,
				Description,
				HtmlDescription,
				ParentArticleId: ParentArticle ? ParentArticle.Id : null,
				MobileIcon: MobileIcon ? MobileIcon : IconArray[0].iconName,
				MobileIconFamily: MobileIconFamily ? MobileIconFamily : IconArray[0].familyName,
				Image: ImageData,
				IncludeInSideMenu,
				IncludeInNavBar
			}, res => {
				this.setState({ didSucceed: true, uploadingImage: false, prossesEvent: 0 })
				this.props.route.params?.onChildChange && this.props.route.params?.onChildChange()
				this.props.navigation.goBack()
			}, err => {
				this.setState({ lockSubmit: false, uploadingImage: false, prossesEvent: 0 })
				this.lockSubmit = false
			}, (re) => {
				this.setState({ prossesEvent: re * 0.01 })
			})
		}
	}

	hadelArtical = (artic) => {
		if (artic) {
			return artic[0].Name
		} else {
			return null
		}
	}

	renderImage = () => {
		const imageSize = 90

		if (this.editMode) {
			const { ImageUrl } = this.state.Image
			const { picker_image_uri, remoteImage } = this.state

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
						uri={picker_image_uri || ImageUrl}
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
		else {
			const { picker_image_uri, remoteImage } = this.state

			return (
				<CustomTouchable
					onPress={() => {
						this.LibraryOrCameraRef.current.show()
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
					{picker_image_uri ? <ConditionalCircularImage
						remote={remoteImage}
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
	}

	renderContent = () => {
		const IconArray = getIconsArray()
		if (this.state.didFetchData || !this.editMode) {
			const {
				Name,
				ShortDescription,
				Description,
				ParentArticle,
				MobileIcon,
				MobileIconFamily,
				Type,
				Language,
				HtmlDescription,
				IncludeInNavBar,
				IncludeInSideMenu
			} = this.state

			return (
				<ScrollView>
					<ArrowItem
						onPress={() => {
							this.languageSelectorRef.current.show()
						}}
						title={'Language'}
						info={Language.label} />

					{this.renderImage()}

					<HorizontalInput
						maxLength={STRING_LENGTH_MEDIUM}
						label="Name"
						value={Name}
						onChangeText={(text) => { this.setState({ Name: text }) }} />

					<ItemSeparator />

					<HorizontalInput
						multiline
						maxLength={STRING_LENGTH_MEDIUM}
						label="ShortDescription"
						value={ShortDescription}
						onChangeText={(text) => { this.setState({ ShortDescription: text }) }} />

					<ItemSeparator />

					<HorizontalInput
						multiline
						label="Description"
						value={Description}
						onChangeText={(text) => { this.setState({ Description: text }) }} />

					<ItemSeparator />

					{/* <View style={{
						paddingVertical: 15,
						paddingHorizontal: 20,
						// height: 200
					}} >
						<TranslatedText style={{
							color: secondTextColor
						}} text={'HtmlDescription'} />

						<TextEditorInput
							navigation={this.props.navigation}
							value={HtmlDescription}
							onFinishEditing={(HtmlDescription) => { this.setState({ HtmlDescription }) }}
							showLanguageSelector={false}
						/>
					</View> */}

					{this.editMode && <View
						style={{
							paddingVertical: 15,
							paddingHorizontal: 20,
							// height: 200
						}}

					>

						<TranslatedText style={{
							color: secondTextColor
						}} text={'HtmlDescription'} />

						<CustomTouchable
							onPress={() => {
								this.props.navigation.push('HtmlTextEditor', {
									id: this.articleId,
									EntityName: 'article',
									PropName: 'HtmlDescription',
									lnaguageId: this.state.Language.key,
									EditMode: true
								})
							}}
							style={{
								flexDirection: 'row',
								alignItems: 'center',
								backgroundColor: 'white',
								paddingVertical: 15,
								paddingHorizontal: 20,
							}}>
							<AntDesign
								name={'edit'}
								size={26}
								color={'black'}
								style={{ marginRight: pagePadding, }} />

							<TranslatedText style={{ color: 'black' }} text='EditContentInEditor' />


						</CustomTouchable>
					</View>}

					<ItemSeparator />

					<ArrowItem
						onPress={() => {
							this.typeSelectorRef.current.show()
						}}
						title={'Type'}
						info={
							Type ? Type.Name : this.hadelArtical(this.state.ArticleTypes)
						}
					/>

					<ItemSeparator />

					<ArrowItem
						onPress={() => {
							SelectEntity(this.props.navigation, ParentArticle => {
								this.setState({ ParentArticle })
							}, 'Articles/SimpleList', null, true, 1)
						}}
						title={'ParentArticle'}
						info={ParentArticle ? ParentArticle.Name : null} />

					<ItemSeparator />

					<ArrowItem
						onPress={() => {
							this.props.navigation.navigate('IconSelector', {
								callback: (familyName, iconName) => {
									this.setState({
										MobileIcon: iconName,
										MobileIconFamily: familyName,
									})
								}
							})
						}}
						title={'Icon'}
						info={MobileIconFamily && MobileIcon ? `${MobileIconFamily} / ${MobileIcon}` : `${IconArray[0].familyName} /  ${IconArray[0].iconName}`} />

					<ItemSeparator />

					<SwitchItem
						title='IncludeInSideMenu'
						value={IncludeInSideMenu}
						onValueChange={(IncludeInSideMenu) => {
							this.setState({ IncludeInSideMenu })
						}}
					/>

					<ItemSeparator />

					<SwitchItem
						title='IncludeInNavBar'
						value={IncludeInNavBar}
						onValueChange={(IncludeInNavBar) => {
							this.setState({ IncludeInNavBar })
						}}
					/>

				</ScrollView>
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

				this.setState({
					picker_image_uri: uri,
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
					picker_image_uri: uri,
					ImageData: path,
					remoteImage: false
				})
			})
		}
	}

	render() {
		const { ArticleTypes } = this.state
		const { languages_data } = this.props

		return (
			<LazyContainer style={{ flex: 1, backgroundColor: "#FFF" }}>
				<CustomHeader
					navigation={this.props.navigation}
					title={"Article"}
					rightComponent={
						<HeaderSubmitButton
							isLoading={this.state.lockSubmit}
							didSucceed={this.state.didSucceed}
							onPress={() => { this.submit() }} />
					} />

				{/* {this.renderContent()} */}

				{Platform.OS == 'ios' ?
					<KeyboardAvoidingView behavior='padding' enabled
						style={{ flex: 1 }}
						keyboardVerticalOffset={40}
					>
						{this.renderContent()}
					</KeyboardAvoidingView> :
					this.renderContent()
				}

				{ArticleTypes && <CustomSelector
					ref={this.typeSelectorRef}
					options={ArticleTypes.map(item => item.Name)}
					onSelect={(index) => { this.setState({ Type: ArticleTypes[index] }) }}
					onDismiss={() => { }}
				/>}

				<CustomSelector
					ref={this.languageSelectorRef}
					options={languages_data.map(item => item.label)}
					onSelect={(index) => {
						this.setState({
							Language: languages_data[index]
						}, () => {
							this.fetchData()
						})
					}}
					onDismiss={() => { }}
				/>

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
	},
}) => ({
	languages_data,
})

export default connect(mapStateToProps)(withLocalize(Article))