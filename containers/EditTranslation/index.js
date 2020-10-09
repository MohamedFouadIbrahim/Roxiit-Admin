import React, { Component } from 'react'
import { ScrollView, View } from 'react-native'
import { connect } from 'react-redux'
import CustomHeader from '../../components/CustomHeader/index.js';
import LazyContainer from '../../components/LazyContainer'
import ItemSeparator from '../../components/ItemSeparator/index.js';
import HorizontalInput from '../../components/HorizontalInput/index.js';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { pagePadding } from '../../constants/Style.js';
import { withLocalize } from 'react-localize-redux';
import HeaderSubmitButton from '../../components/HeaderSubmitButton/index.js';
import { GetCustomTranslation, EditCustomTranslation } from '../../services/CustomTranslationService.js';
import FontedText from '../../components/FontedText/index.js';
import { mainColor } from '../../constants/Colors.js';
import CustomSelector from '../../components/CustomSelector/index.js';
import { LongToast } from '../../utils/Toast.js';
import CustomTouchable from '../../components/CustomTouchable';

class EditTranslation extends Component {
	constructor(props) {
		super(props)

		const { Id, currentLanguage, targetLanguage, translationType } = this.props.route.params

		this.translationId = Id
		this.translationType = translationType

		this.state = {
			currentLanguage,
			targetLanguage,
			lockSubmit: false,
			didFetchData: false,
		}

		this.selectorRef = React.createRef();
		this.lockSubmit = false
	}

	componentDidMount() {
		this.fetchData()
	}
	componentWillUnmount() {
		this.cancelFetchDataGetCustomTranslation && this.cancelFetchDataGetCustomTranslation()
		this.cancelFetchDataEditCustomTranslation && this.cancelFetchDataEditCustomTranslation()
	}

	fetchData = () => {
		const { targetLanguage, currentLanguage } = this.state
		const { translationId } = this

		this.cancelFetchDataGetCustomTranslation = GetCustomTranslation(translationId, currentLanguage.key, targetLanguage.key, this.translationType, res => {
			this.setState({
				...res.data,
				didFetchData: true,
			})
		})
	}

	submit = () => {
		if (this.lockSubmit) {
			return
		}

		const { TargetText } = this.state

		this.setState({ lockSubmit: true })
		this.lockSubmit = true

		const { targetLanguage } = this.state

		const EmptyString = TargetText ? TargetText : ''

		this.cancelFetchDataEditCustomTranslation = EditCustomTranslation(this.translationId, EmptyString, targetLanguage.key, this.translationType, res => {
			this.setState({ didSucceed: true, })
			this.props.route.params?.onChildChange && this.props.route.params?.onChildChange()
			this.props.navigation.goBack()
		}, err => {
			this.setState({ lockSubmit: false })
			this.lockSubmit = false
		})
	}

	renderEditableInput = () => {
		if (this.state.IsHtml) {
			return (
				null
			)
		}
		else {
			return (
				<HorizontalInput
					label="TargetText"
					value={this.state.TargetText}
					onChangeText={(text) => { this.setState({ TargetText: text }) }} />
			)
		}
	}

	renderContent = () => {
		if (this.state.didFetchData) {
			return (
				<ScrollView
					contentContainerStyle={{
					}}>
					<HorizontalInput
						label="TranslationKey"
						value={this.state.key}
						editable={false} />

					<ItemSeparator />

					<HorizontalInput
						label="SourceText"
						value={this.state.SourceText}
						editable={false} />

					<ItemSeparator />

					{this.renderEditableInput()}
				</ScrollView>
			)
		}
	}

	swapLanguages = () => {
		this.setState({
			currentLanguage: this.state.targetLanguage,
			targetLanguage: this.state.currentLanguage,
		}, () => {
			this.fetchData()
		})
	}

	onSelectLanguage = (index) => {
		const { languages_data } = this.props

		this.setState({
			targetLanguage: languages_data[index]
		}, () => {
			this.fetchData()
		})
	}

	render() {
		const { targetLanguage, currentLanguage } = this.state
		const { languages_data } = this.props

		return (
			<LazyContainer style={{ flex: 1, backgroundColor: "#FFF" }}>
				<CustomHeader
					navigation={this.props.navigation}
					title={"Translation"}
					rightComponent={
						<HeaderSubmitButton
							isLoading={this.state.lockSubmit}
							didSucceed={this.state.didSucceed}
							onPress={() => { this.submit() }} />
					} />

				<View
					style={{
						backgroundColor: 'white',
						flexDirection: 'row',
						borderBottomColor: '#aaaaaa',
						borderBottomWidth: 0.5,
					}}>
					<View
						style={{
							flex: 2,
							justifyContent: 'center',
							alignItems: 'flex-start',
							paddingLeft: pagePadding,
						}}>
						<FontedText style={{ color: mainColor }}>{currentLanguage.label}</FontedText>
					</View>

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

				{this.renderContent()}

				<CustomSelector
					ref={this.selectorRef}
					options={languages_data.map(item => item.label)}
					onSelect={(index) => { this.onSelectLanguage(index) }}
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

export default connect(mapStateToProps)(withLocalize(EditTranslation))