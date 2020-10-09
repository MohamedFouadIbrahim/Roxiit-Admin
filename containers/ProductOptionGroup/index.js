import React, { Component } from 'react';
import { withLocalize } from 'react-localize-redux';
import { ScrollView } from 'react-native';
import { connect } from 'react-redux';
import ArrowItem from '../../components/ArrowItem/index.js';
import CustomHeader from '../../components/CustomHeader/index.js';
import CustomSelector from '../../components/CustomSelector/index.js';
import HeaderSubmitButton from '../../components/HeaderSubmitButton/index.js';
import HorizontalInput from '../../components/HorizontalInput/index.js';
import ItemSeparator from '../../components/ItemSeparator/index.js';
import LazyContainer from '../../components/LazyContainer';
import SwitchItem from '../../components/SwitchItem';
import { STRING_LENGTH_LONG } from '../../constants/Config';
import { getFilters } from '../../services/FilterService';
import { CreateProductOptionGroup } from '../../services/ProductOptionService.js';
import { LongToast } from '../../utils/Toast.js';

class ProductOptionGroup extends Component {
	_menu = null;
	constructor(props) {
		super(props)
		const {
			languages_data,
			currLang
		} = props

		this.state = {
			Language: languages_data.find(item => item.code === currLang),
			picker_image_uri: null,
			lockSubmit: false,
			didFetchData: false,
			Name: '',
			Description: '',
			selectedIcon: {
				familyName: null,
				iconName: null
			},
			EnableOPtionGroupingInCheckout: true,
			IsRequiredOnCheckOut: false,
			ShowInProducts: true,
			IsGlobalInApp: false,
			PriceChange: null,
			AllowMultiple: true,
			showAllowMultiple: true,
		}

		if (this.props.route.params && this.props.route.params?.Id) {
			this.editMode = true
			this.brandId = this.props.route.params?.Id
		}
		else {
			this.editMode = false
		}

		this.lockSubmit = false
		this.languageSelectorRef = React.createRef()
		this.typeRef = React.createRef()
	}


	fetchOptionGroup = (language_id = null) => {
		this.cancelFetchData = GetRole(this.roleId, language_id, res => {
			const { LanguageId, ...restData } = res.data
			const { languages_data } = this.props

			this.setState({
				...restData,
				Language: languages_data.find(item => item.key === LanguageId),
				didFetchData: true,
			})
		})
	}
	componentDidMount() {

		getFilters({ productOptionGroupType: true }, resFilter => {
			this.setState({ Types: resFilter.data.ProductOptionsGroupType, Type: resFilter.data.ProductOptionsGroupType[0] })
		})

	}
	componentWillUnmount() {
		this.cancelFetchData && this.cancelFetchData()
		this.cancelFetchDataCreateProductOptionGroup && this.cancelFetchDataCreateProductOptionGroup()
	}

	submitOptionGroup = () => {
		//selectedIcon: { familyName, iconName },
		const { Language, Name, Description, Type, IsRequired, lockSubmit, ShowInCheckOut, ShowInProducts, IsGlobalInApp, PriceChange, AllowMultiple } = this.state

		if (lockSubmit) {
			return
		}

		if (Name == '') {
			return LongToast('CantHaveEmptyInputs')
		} else if (!ShowInCheckOut && !ShowInProducts) {
			return LongToast('MustOneValueTrueShowInCheckOutShowInProducts')
		} else {

			//LanguageId: Language.key,
			// create a new option group
			// alert('add')

			this.setState({ lockSubmit: true })
			this.lockSubmit = true

			this.cancelFetchDataCreateProductOptionGroup = CreateProductOptionGroup({
				Id: 0,
				LanguageId: Language.key,
				Name: Name,
				Description: Description,
				ProductOptionGroupType: Type.Id,
				IsRequired,
				ShowInCheckOut: ShowInCheckOut,
				ShowInProducts: ShowInProducts,
				// EnableOPtionGroupingInCheckout: EnableOPtionGroupingInCheckout,
				PriceChange,
				AllowMultiple,
			}, (res) => {
				this.lockSubmit = false
				this.setState({ didSucceed: true, lockSubmit: false })

				this.props.route.params?.onChildChange && this.props.route.params?.onChildChange()

				this.props.navigation.goBack()
				LongToast('dataSaved')

			}, err => {
				this.lockSubmit = false
				this.setState({ lockSubmit: false })
			})
		}
	}
	onSelectLanguage = (index) => {
		const { languages_data } = this.props
		const selectedLanguage = languages_data[index]

		this.setState({ ChangeToLanguage: selectedLanguage }, () => {
			// this.fetchPermissions(this.state.ChangeToLanguage.key)
		})

	}

	setShowAllowMultiple(typeId) {
		if (typeId == 1 || typeId == 2 || typeId == 3 || typeId == 10) {
			this.setState({ showAllowMultiple: true })
		}
		else {
			this.setState({ showAllowMultiple: false })
		}
	}

	renderContent = () => {
		const { ChangeToLanguage, Language, } = this.state
		const { languages_data } = this.props
		return (
			<ScrollView
				contentContainerStyle={{
				}}>

				<ArrowItem
					onPress={() => {
						this.languageSelectorRef.current.show()
					}}
					title={'Language'}
					info={ChangeToLanguage ? ChangeToLanguage.label : Language.label} />

				<ItemSeparator />

				<HorizontalInput
					maxLength={STRING_LENGTH_LONG}
					label="Name"
					value={this.state.Name}
					onChangeText={(text) => { this.setState({ Name: text }) }} />

				<ItemSeparator />

				<HorizontalInput
					maxLength={STRING_LENGTH_LONG}
					label="Description"
					value={this.state.Description}
					onChangeText={(text) => { this.setState({ Description: text }) }} />

				<ItemSeparator />

				<HorizontalInput
					label="PriceChange"
					value={this.state.PriceChange ? `${this.state.PriceChange}` : null}
					onChangeText={(PriceChange) => { this.setState({ PriceChange }) }}
					keyboardType='numeric'
				/>
				<ItemSeparator />

				<SwitchItem
					title={'IsRequired'}
					value={this.state.IsRequired}
					onValueChange={IsRequired => { this.setState({ IsRequired }) }}
				/>
				<ItemSeparator />

				<SwitchItem
					title={'ShowInCheckOut'}
					value={this.state.ShowInCheckOut}
					onValueChange={ShowInCheckOut => { this.setState({ ShowInCheckOut }) }}
				/>

				<ItemSeparator />

				<SwitchItem
					title={'ShowInProducts'}
					value={this.state.ShowInProducts}
					onValueChange={ShowInProducts => { this.setState({ ShowInProducts }) }}
				/>


				<ItemSeparator />

				{this.state.showAllowMultiple &&
					< SwitchItem
						title={'AllowMultiple'}
						value={this.state.AllowMultiple}
						onValueChange={AllowMultiple => { this.setState({ AllowMultiple }) }}
					/>}

				{this.state.showAllowMultiple &&
					<ItemSeparator />}

				{this.state.Types && <ArrowItem
					onPress={() => {
						this.typeRef.current.show()
					}}
					title={'Type'}
					info={this.state.Type ? this.state.Type.Name : null} />}

				<ItemSeparator />


				<CustomSelector
					ref={this.languageSelectorRef}
					options={languages_data.map(item => item.label)}
					onSelect={(index) => { this.onSelectLanguage(index) }}
					onDismiss={() => { }}
				/>

				{this.state.Types && <CustomSelector
					ref={this.typeRef}
					options={this.state.Types.map(item => item.Name)}
					onSelect={(index) => {
						this.setState({ Type: this.state.Types[index] })
						this.setShowAllowMultiple(this.state.Types[index].Id)
					}}
					onDismiss={() => { }}
				/>}

			</ScrollView>
		)

	}

	render() {
		return (
			<LazyContainer style={{ flex: 1, backgroundColor: "#FFF" }}>
				<CustomHeader
					navigation={this.props.navigation}
					title={"ProductOptionGroups"}

					rightComponent={
						<HeaderSubmitButton
							isLoading={this.state.lockSubmit}
							onPress={() => { this.submitOptionGroup() }}
						/>
					} />

				{this.renderContent()}
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
export default connect(mapStateToProps)(withLocalize(ProductOptionGroup))