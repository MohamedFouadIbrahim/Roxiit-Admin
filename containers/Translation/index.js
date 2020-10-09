import React, { Component } from 'react'
import { View, Text } from 'react-native'
import CustomHeader from '../../components/CustomHeader/index.js';
import LazyContainer from '../../components/LazyContainer'
import FontedText from '../../components/FontedText/index.js';
import RemoteDataContainer from '../../components/RemoteDataContainer/index.js';
import DeleteButton from '../../components/DeleteButton/index.js';
import ItemSeparator from '../../components/ItemSeparator/index.js';
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { mainColor } from '../../constants/Colors.js';
import { pagePadding } from '../../constants/Style.js';
import { connect } from 'react-redux'
import CustomSelector from '../../components/CustomSelector/index.js';
import { DeleteCustomTranslation, DeleteAllCustomTranslation } from '../../services/CustomTranslationService.js';
import { withLocalize } from 'react-localize-redux';
import SearchBar from '../../components/SearchBar/index.js';
import TranslationItem from './TranslationItem.js';
import { LongToast } from '../../utils/Toast.js';
import CustomTouchable from '../../components/CustomTouchable';
import TranslatedText from '../../components/TranslatedText/index.js';
import { isValidSearchKeyword } from '../../utils/Validation.js';

class Translation extends Component {
	constructor(props) {
		super(props)

		this.state = {
			data: null,
			currentLanguage: null,
			targetLanguage: null,
			triggerRefresh: false,
			searchBarShown: false,
			searchingFor: '',
			showCustomSelectorForDeleteref: false,
			Loading: false
		}

		this.selectorRef = React.createRef();
		this.deleteLanguageSelectorRef = React.createRef();
		this.deleteAllSelectorRef = React.createRef();

		const { translationType } = this.props
		this.translationType = translationType
	}

	componentDidMount() {
		this.cacelFitchData = this.getLanguagesData()
	}
	componentWillUnmount() {
		this.cacelFitchData && this.cacelFitchData()
	}
	getLanguagesData = () => {
		const { languages_data, currLang } = this.props

		let currentLanguage = languages_data.find(item => item.code === currLang)
		let targetLanguage = languages_data.find(item => item.isDefault === true)

		if (!currentLanguage) {
			currentLanguage = targetLanguage
		}

		if (currentLanguage.code === targetLanguage.code) {
			targetLanguage = languages_data.find(item => item.code !== currentLanguage.code)
		}

		this.setState({
			currentLanguage,
			targetLanguage,
		})
	}

	swapLanguages = () => {
		this.setState({
			currentLanguage: this.state.targetLanguage,
			targetLanguage: this.state.currentLanguage,
		})
	}

	onPressItem = (item) => {
		const { Id } = item
		const { translationType } = this
		const { targetLanguage, currentLanguage } = this.state

		this.props.navigation.navigate('EditTranslation', {
			Id,
			currentLanguage,
			targetLanguage,
			onChildChange: this.onChildChange,
			translationType,
		})
	}

	onLongPressItem = (item) => {
		const { Id } = item

		this.DeleteOrEditId = Id
		this.deletingTranslationId = Id
		this.setState({ showCustomSelectorForDeleteref: true })
		this.deleteLanguageSelectorRef.current.show()
	}

	renderItem = ({ item }) => {
		return (
			<TranslationItem
				item={item}
				onPress={this.onPressItem}
				onLongPress={this.onLongPressItem} />
		)
	}

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
						this.deletingTranslationId = Id
						this.deleteLanguageSelectorRef.current.show()
					}} />
			</View>
		)
	}

	onChildChange = () => {
		this.setState({ triggerRefresh: !this.state.triggerRefresh })
	}

	onSelectDeleteAll = (index) => {
		const { languages_data } = this.props
		const language_id = languages_data[index].key

		DeleteAllCustomTranslation(language_id, this.translationType, () => {
			this.setState({ triggerRefresh: !this.state.triggerRefresh })
		})
	}

	onSelectLanguage = (index) => {
		const { languages_data } = this.props

		if (this.changingSourceLanguage) {
			this.setState({
				currentLanguage: languages_data[index]
			})
		}
		else {
			this.setState({
				targetLanguage: languages_data[index]
			})
		}
	}

	onSelectDeleteLanguage = (index) => {
		const { targetLanguage, currentLanguage } = this.state
		const language_id = index === 0 ? currentLanguage.key : targetLanguage.key
		DeleteCustomTranslation(this.deletingTranslationId, language_id, this.translationType, () => {
			this.setState({ triggerRefresh: !this.state.triggerRefresh })
		})
	}

	getRequestParams = () => {
		const { targetLanguage, currentLanguage, searchingFor } = this.state

		let params = `sourceLanguageId=${currentLanguage.key}&targetLanguageId=${targetLanguage.key}`

		if (isValidSearchKeyword(searchingFor)) {
			params = `${params}&search=${searchingFor}`
		}

		return params
	}

	renderSearch = () => {
		return (
			<SearchBar
				visible={this.state.searchBarShown}
				onPressClose={() => { this.setState({ searchBarShown: !this.state.searchBarShown }) }}
				onSubmitEditing={(text) => {
					this.setState({ searchingFor: text })
				}} />
		)
	}

	render() {
		const { targetLanguage, currentLanguage } = this.state

		if (!targetLanguage || !currentLanguage) {
			return null
		}

		const { languages_data } = this.props

		return (
			<LazyContainer style={{ flex: 1, backgroundColor: "#FFF" }}>
				<CustomHeader
					leftComponent="drawer"
					navigation={this.props.navigation}
					title={`${this.translationType}Translation`}
					rightNumOfItems={2}
					rightComponent={
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'center',
							}}>
							<CustomTouchable
								onPress={() => { this.setState({ searchBarShown: !this.state.searchBarShown }) }}
								style={{
									flexDirection: 'row',
									justifyContent: 'center',
									alignItems: 'center',
									flex: 1,
								}}>
								<Ionicons
									name={`ios-search`}
									size={24}
									color={'white'} />
							</CustomTouchable>

							<CustomTouchable
								onPress={() => { this.deleteAllSelectorRef.current.show() }}
								style={{
									flexDirection: 'row',
									justifyContent: 'center',
									alignItems: 'center',
									flex: 1,
								}}>
								<Ionicons
									name={`md-trash`}
									size={24}
									color={'white'} />
							</CustomTouchable>
						</View>
					} />

				<View
					style={{
						backgroundColor: 'white',
						flexDirection: 'row',
						borderBottomColor: '#aaaaaa',
						borderBottomWidth: 0.5,
					}}>
					<CustomTouchable
						onPress={() => {
							this.changingSourceLanguage = true
							this.selectorRef.current.show()
						}}
						style={{
							flex: 2,
							justifyContent: 'center',
							alignItems: 'flex-start',
							paddingLeft: pagePadding,
						}}>
						{currentLanguage && <View
							style={{
								flexDirection: 'row',
								alignItems: 'center',
							}}>
							<FontedText style={{ color: mainColor }}>{currentLanguage.label}</FontedText>

							<Ionicons
								name={"md-arrow-dropdown"}
								size={24}
								color={mainColor}
								style={{
									marginLeft: 5,
								}} />
						</View>}
					</CustomTouchable>

					<CustomTouchable
						onPress={() => { this.swapLanguages() }}
						style={{
							flex: 1.5,
							justifyContent: 'center',
							alignItems: 'center',
							paddingVertical: pagePadding,
						}}>
						<MaterialIcons
							name={"compare-arrows"}
							size={26}
							color={mainColor} />
					</CustomTouchable>

					<CustomTouchable
						onPress={() => {
							this.changingSourceLanguage = false
							this.selectorRef.current.show()
						}}
						style={{
							flex: 2,
							justifyContent: 'center',
							alignItems: 'flex-end',
							paddingRight: pagePadding,
						}}>
						{targetLanguage && <View
							style={{
								flexDirection: 'row',
								alignItems: 'center',
							}}>
							<FontedText style={{ color: mainColor }}>{targetLanguage.label}</FontedText>

							<Ionicons
								name={"md-arrow-dropdown"}
								size={24}
								color={mainColor}
								style={{
									marginLeft: 5,
								}} />
						</View>}
					</CustomTouchable>
				</View>

				{this.renderSearch()}

				<RemoteDataContainer
					url={`Translations/Custom/${this.translationType}`}
					params={this.getRequestParams()}
					onDataFetched={(data) => {
						this.setState({ data })
					}}
					updatedData={this.state.data}
					triggerRefresh={this.state.triggerRefresh}
					keyExtractor={({ Id }) => `${Id}`}
					ItemSeparatorComponent={() => <ItemSeparator />}
					renderItem={this.renderItem} />

				<CustomSelector
					ref={this.selectorRef}
					options={languages_data.map(item => item.label)}
					onSelect={(index) => { this.onSelectLanguage(index) }}
					onDismiss={() => { }}
				/>

				{/* <CustomSelectorForDeleteAndEdit
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

						this.deletingTranslationId = this.DeleteOrEditId
						// this.deleteLanguageSelectorRef.current.show()

						// DeleteUser(this.DeleteOrEditId, () => {
						// 	this.setState({
						// 		data: this.state.data.filter(filterItem => filterItem.Id !== this.DeleteOrEditId),
						// 		showCustomSelectorForDeleteref: false,
						// 		Loading: false
						// 	})
						// 	LongToast('dataDeleted')
						// }, () => {
						// 	this.setState({ Loading: false })
						// })
					}}

				/> */}
				<CustomSelector
					title={<TranslatedText text={'ChoosethelanguagetoDeleteitstranslation'} style={{ fontSize: 15 }} />}
					ref={this.deleteLanguageSelectorRef}
					options={[
						currentLanguage.label,
						targetLanguage.label
					]}
					onSelect={(index) => { this.onSelectDeleteLanguage(index) }}
					onDismiss={() => { }}
				/>

				<CustomSelector
					title={<TranslatedText text={'ChoosethelanguagetoDeleteitstranslation'} style={{ fontSize: 15 }} />}
					ref={this.deleteAllSelectorRef}
					options={languages_data.map(item => item.label)}
					onSelect={(index) => { this.onSelectDeleteAll(index) }}
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
}) => ({
	languages_data,
	currLang,
})

export default connect(mapStateToProps)(withLocalize(Translation))