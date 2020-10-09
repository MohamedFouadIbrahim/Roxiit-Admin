import React, { Component } from 'react';
import { withLocalize } from 'react-localize-redux';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { EventRegister } from 'react-native-event-listeners';
import { connect } from 'react-redux';
import ArrowItem from '../../components/ArrowItem';
import CustomSelector from '../../components/CustomSelector';
import HorizontalInput from '../../components/HorizontalInput/index.js';
import ItemSeparator from '../../components/ItemSeparator/index.js';
import LazyContainer from '../../components/LazyContainer';
// import TextEditorInput from '../../components/TextEditorInput';
import TranslatedText from '../../components/TranslatedText/index';
import { secondTextColor } from '../../constants/Colors';
import { STRING_LENGTH_MEDIUM } from '../../constants/Config';
import { screenHeight } from '../../constants/Metrics';
import { AddRichTextDescription, EditProductDescription, GetProductDescription, GETRichTextDescription } from '../../services/ProductService.js';
import { LongToast } from '../../utils/Toast';
import CustomTouchable from '../../components/CustomTouchable';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { pagePadding } from '../../constants/Style';
class ProductDescription extends Component {
	constructor(props) {
		super(props)
		// const { languages_data, currLang } = props
		this.state = {
			didFetchData: false,
			lockSubmit: false,
			Languages: this.props.languages_data,
			Language: this.props.languages_data.find(item => item.code === this.props.currLang),

		}

		this.lockSubmit = false

		this.languageSelectorRef = React.createRef();

		this.listener = EventRegister.addEventListener('currentPost', (currentPost) => {
			if (currentPost == '4') {
				this.submitDesc()
			}
		})
	}

	componentDidMount() {
		this.fetchContent()
		this.fetchHtmlDescription()
		this.fetchSignInDescription()
	}


	fetchHtmlDescription = (languageId = this.state.Language.key) => {
		GETRichTextDescription(this.props.ProductId, languageId, 1, res => {
			this.setState({ Description: res.data.Description })
		})
	}

	fetchSignInDescription = (languageId = this.state.Language.key) => {
		GETRichTextDescription(this.props.ProductId, languageId, 2, res => {
			this.setState({ SigninHtmlDescription: res.data.Description })
		})
	}

	fetchContent = (languageId = this.state.Language.key) => {
		this.setState({ didFetchData: false })
		this.cancelFetchDataGetProductDescription = GetProductDescription(this.props.ProductId, languageId, res => {
			this.setState({
				...res.data,
				didFetchData: true,
				Language: {
					key: res.data.Language.Id,
					label: res.data.Language.Name
				}
			})
		})
	}

	componentWillUnmount() {
		EventRegister.removeEventListener(this.listener)
		this.cancelFetchData && this.cancelFetchData()
		this.cancelFetchDataGetProductDescription && this.cancelFetchDataGetProductDescription()
		this.cancelFetchDataEditProductDescription && this.cancelFetchDataEditProductDescription()
		this.cancelFetchDatagetFilters && this.cancelFetchDatagetFilters()
	}

	submitDesc = () => {
		const { Name, ShortDescription, Description, Language } = this.state
		const { ProductId } = this.props

		EventRegister.emit('submitting', true)

		if (!Name) {
			EventRegister.emit('submitting', false)
			return LongToast('CantHaveEmptyInputs')
		} else {
			this.cancelFetchDataEditProductDescription = EditProductDescription({
				Id: ProductId,
				Language: Language.key,
				Name,
				ShortDescription,
				Description,
				HtmlDescription: "",
				SigninHtmlDescription: ""
			}, res => {
				LongToast('dataSaved')
				EventRegister.emit('submitting', false)
			}, err => {
				EventRegister.emit('submitting', false)
			})
		}
	}

	renderContent = () => {
		const { Languages, Language } = this.state;
		if (this.state.didFetchData) {
			return (
				<ScrollView contentContainerStyle={Platform.OS == 'ios' ? { height: screenHeight } : {}}>
					<ArrowItem
						onPress={() => {
							this.languageSelectorRef.current.show()
						}}
						title={'Language'}
						info={Language ? Language.label : ''} />

					<HorizontalInput
						maxLength={STRING_LENGTH_MEDIUM}
						label="Name"
						value={this.state.Name}
						onChangeText={(text) => { this.setState({ Name: text }) }} />

					<ItemSeparator />

					<HorizontalInput
						maxLength={STRING_LENGTH_MEDIUM}
						label="ShortDescription"
						value={this.state.ShortDescription}
						onChangeText={(text) => { this.setState({ ShortDescription: text }) }} />

					<ItemSeparator />

					<View
						style={{
							paddingVertical: 15,
							paddingHorizontal: 20,
							// height: 200
						}}

					>

						<TranslatedText style={{
							color: secondTextColor
						}} text={'Description'} />

						<CustomTouchable
							onPress={() => {
								this.props.navigation.push('HtmlTextEditor', {
									id: this.props.ProductId,
									EntityName: 'product',
									PropName: 'description',
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
					</View>

					<ItemSeparator />


					<View
						style={{
							paddingVertical: 15,
							paddingHorizontal: 20,
							// height: 200
						}}

					>

						<TranslatedText style={{
							color: secondTextColor
						}} text={'SignInDescription'} />

						<CustomTouchable
							onPress={() => {
								this.props.navigation.push('HtmlTextEditor', {
									id: this.props.ProductId,
									EntityName: 'product',
									PropName: 'signinhtmldescription',
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
					</View>

				</ScrollView>
			)
		}
	}

	render() {
		const { Languages } = this.state;

		return (
			<LazyContainer style={{ flex: 1, backgroundColor: "#FFF", }}>
				{
					Platform.OS == 'ios' ?

						<KeyboardAvoidingView behavior='padding' enabled
							style={{ flex: 1 }}
							shouldRasterizeIOS
							keyboardVerticalOffset={150}
						>
							{this.renderContent()}
						</KeyboardAvoidingView> :

						this.renderContent()

				}

				{
					Languages && <CustomSelector
						ref={this.languageSelectorRef}
						options={Languages.map(item => item.label)}
						onSelect={(index) => {
							this.setState({
								Language: Languages[index]
							}, () => {
								this.fetchContent(Languages[index].key)
								this.fetchHtmlDescription(Languages[index].key)
								this.fetchSignInDescription(Languages[index].key)
							})
						}}
						onDismiss={() => { }}
					/>
				}
			</LazyContainer>
		)
	}
}
const mapStateToProps = ({
	language: {
		languages_data,
		currLang
	},
}) => ({
	languages_data,
	currLang
})

export default connect(mapStateToProps)(withLocalize(ProductDescription))