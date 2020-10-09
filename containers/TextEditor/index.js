import React, { Component } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import LazyContainer from '../../components/LazyContainer'
import { RichEditor, RichToolbar } from 'react-native-pell-rich-editor'
import { largePagePadding } from '../../constants/Style';
import CustomHeader from '../../components/CustomHeader';
import CustomSelector from '../../components/CustomSelector';
import HeaderSubmitButton from '../../components/HeaderSubmitButton';
import { showImagePicker } from '../../utils/Image';
import { GetImageUrl } from '../../services/MiscService';

class TextEditor extends Component {
	constructor(props) {
		super(props)

		this.languageSelectorRef = React.createRef()

		this.state = {

			Languages: this.props.languages_data,
			Language: this.props.route.params?.Language,
			text: this.props.route.params?.text,
			isLoading: false

		}
	}

	componentDidMount() {
		setTimeout(() => {
			if (this.richtext)
				this.richtext.focusContentEditor()
		}, 2000)
	}

	onPressAddImage = () => {
		showImagePicker((data) => {
			if (data) {
				const { uri, path } = data
				GetImageUrl(uri, res => {
					this.richtext.insertImage(`${res.data.ImageUrl}`);
					this.richtext.blurContentEditor();
				})
			}
		})
	}

	render() {
		const { onEditorInitialized } = this.props
		const { showLanguageSelector, onChangeLangue } = this.props.route.params?
		const { Languages, Language } = this.state;

		return (
			<LazyContainer style={{ flex: 1, backgroundColor: "#FFF", paddingTop: 0 }}>
				<CustomHeader
					navigation={this.props.navigation}
					title={"RichTextEditor"}
					rightComponent={<HeaderSubmitButton
						onPress={() => {

							this.richtext.getContentHtml().then(content => {
								if (showLanguageSelector == true) {

									const data = {
										Language: this.state.Language,
										content
									}

									this.props.route.params?.onFinishEditing(data)
									this.props.navigation.goBack()

								} else {
									this.props.route.params?.onFinishEditing(content)
									this.props.navigation.goBack()
								}
							})

						}} />}

				/>

				{showLanguageSelector && <ArrowItem
					onPress={() => {
						this.languageSelectorRef.current.show()
					}}
					title={'Language'}
					info={Language ? Language.label : ''} />}

				<RichEditor
					style={{
						paddingTop: largePagePadding * 2,
						flex: 1
					}}
					ref={(r) => this.richtext = r}
					hiddenTitle={true}
					initialContentHTML={this.state.text}
					editorInitializedCallback={() => {
						this.richtext.blurContentEditor();
						onEditorInitialized && onEditorInitialized()
					}}
				/>

				<View
					style={{
						position: 'absolute',
						top: showLanguageSelector ? 100 : 56,
						width: '100%'
					}}>
					<RichToolbar
						style={{
							backgroundColor: '#eeeeee',
						}}
						getEditor={() => this.richtext}
						selectedIconTint="black"
						selectedButtonStyle={{
							backgroundColor: '#cccccc',
						}}
						unselectedButtonStyle={{
							backgroundColor: '#eeeeee',
						}}
						onPressAddImage={this.onPressAddImage}
					// actions={[
					// 	'bold',
					// 	'italic',
					// 	'underline',
					// 	'unorderedList',
					// 	'orderedList',
					// 	'image',
					// 	'SET_TEXT_COLOR',
					// 	'SET_BACKGROUND_COLOR',
					// 	'indent',
					// 	'justifyFull',
					// 	'justifyCenter',
					// 	'link'
					// ]}
					/>
				</View>

				{Languages && <CustomSelector
					ref={this.languageSelectorRef}
					options={Languages.map(item => item.label)}
					onSelect={(index) => {
						this.setState({
							Language: Languages[index]
						}, () => {
							onChangeLangue && onChangeLangue(Languages[index])
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
	login: {
		hello_data
	},
}) => ({
	hello_data,
	languages_data,
	currLang
})
export default connect(mapStateToProps)(TextEditor)