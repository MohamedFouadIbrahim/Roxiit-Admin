import React, { Component } from 'react';
import { withLocalize } from 'react-localize-redux';
import { ScrollView, View } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Foundation from 'react-native-vector-icons/Foundation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Zocial from 'react-native-vector-icons/Zocial';
import { connect } from 'react-redux';
import ArrowItem from '../../components/ArrowItem';
import CustomHeader from '../../components/CustomHeader/index.js';
import CustomSelector from '../../components/CustomSelector/index.js';
import CustomSelectorForDeleteAndEdit from '../../components/CustomSelectorForDeleteAndEdit/index';
import CustomTouchable from '../../components/CustomTouchable';
import FontedText from '../../components/FontedText/index.js';
import HeaderSubmitButton from '../../components/HeaderSubmitButton/index.js';
import HorizontalInput from '../../components/HorizontalInput/index.js';
import ItemSeparator from '../../components/ItemSeparator/index.js';
import LazyContainer from '../../components/LazyContainer';
import SwitchItem from '../../components/SwitchItem/index.js';
import TranslatedText from '../../components/TranslatedText/index.js';
import { secondTextColor } from '../../constants/Colors.js';
import { STRING_LENGTH_LONG } from '../../constants/Config';
import { largePagePadding, pagePadding } from '../../constants/Style.js';
import { getFilters } from '../../services/FilterService.js';
import { CreateProductOptionGroup, DeleteMember, GetGroup } from '../../services/ProductOptionService.js';
import { LongToast } from '../../utils/Toast.js';
class optionGroup extends Component {
	_menu = null;
	constructor(props) {
		super(props)
		const { languages_data, currLang } = this.props
		this.state = {
			picker_image_uri: null,
			lockSubmit: false,
			didFetchData: false,
			Name: '',
			Description: '',
			members: [],
			selectedLang: {
				Id: null,
				Name: 'select language',
			},
			selectedIcon: {
				familyName: 'Entypo',
				iconName: 'info-with-circle',
			},
			showCustomSelectorForDeleteref: false,
			Loading: false,
			Language: languages_data.find(item => item.code === currLang),
			EnableOPtionGroupingInCheckout: true,
			IsRequiredOnCheckOut: false,
			ShowInProducts: true,
			IsGlobalInApp: false,
			PriceChange: null,
			AllowMultiple: true,
			showAllowMultiple: false,
		}

		if (this.props.route.params && this.props.route.params.Id) {
			this.editMode = true
			this.brandId = this.props.route.params?.Id
		}
		else {
			this.editMode = false

		}
		this.languageSelectorRef = React.createRef();
		this.typeRef = React.createRef()
		this.lockSubmit = false
	}

	componentDidMount() {
		this.fetchContent();
	}

	fetchContent = (language_id = null) => {
		this.cancelFetchData = GetGroup({ Id: this.props.route.params?.Id, languageId: language_id }, res => {
			getFilters({ productOptionGroupType: true }, resFilter => {

				const { LanguageId, ...restData } = res.data
				const { languages_data } = this.props
				this.setState({
					...restData,
					Language: languages_data.find(item => item.key === LanguageId),
					didFetchData: true,
					members: res.data.Members,
					minDate: res.data.Type.Id == 5 ? res.data.Members[0].value1 : null,
					maxDate: res.data.Type.Id == 5 ? res.data.Members[0].value2 : null,
					Name: res.data.Name,
					Type: res.data.Type,
					Description: res.data.Description,
					selectedIcon: {
						familyName: res.data.MobileIconFamily,
						iconName: res.data.MobileIcon
					},
					Types: resFilter.data.ProductOptionsGroupType,
					ShowInCheckOut: res.data.ShowInCheckout,
					ShowInProducts: res.data.ShowInProducts,
					//if(){}
					AllowMultiple: res.data.AllowMultiple,  // if typeId
					showAllowMultiple: res.data.Type.Id == 1 || res.data.Type.Id == 2 || res.data.Type.Id == 3 || res.data.Type.Id == 10 ? true : false,
					// EnableOPtionGroupingInCheckout: res.data.EnableOPtionGroupingInCheckout
				})
			})

		})
	}


	componentWillUnmount() {

		this.cancelFetchDataCreateProductOptionGroup && this.cancelFetchDataCreateProductOptionGroup()
		this.cancelFetchDataDeleteMember && this.cancelFetchDataDeleteMember()
	}
	submitOptionGroup = () => {
		const { selectedLang, Name, Description, Language, IsRequired, Type, minDate, maxDate, ShowInCheckOut, ShowInProducts, IsGlobalInApp, PriceChange, AllowMultiple } = this.state
		const Normal = {
			Id: this.props.route.params?.Id,
			LanguageId: Language.key,
			Name: Name,
			Description: Description,
			// MobileIconFamily: this.state.selectedIcon.familyName,
			// MobileIcon: this.state.selectedIcon.iconName,
			ProductOptionGroupType: Type.Id,
			IsRequired,
			ShowInCheckOut,
			ShowInProducts,
			//  EnableOPtionGroupingInCheckout,
			PriceChange,
			AllowMultiple  //if typeId
		}
		const DateType = {
			Id: this.props.route.params?.Id,
			LanguageId: Language.key,
			Name: Name,
			Description: Description,
			// MobileIconFamily: this.state.selectedIcon.familyName,
			// MobileIcon: this.state.selectedIcon.iconName,
			ProductOptionGroupType: Type.Id,
			IsRequired,
			value1: minDate,
			value2: maxDate,
			ShowInCheckOut,
			ShowInProducts,
			//  EnableOPtionGroupingInCheckout,
			PriceChange
			// Values: [minDate, maxDate]
		}
		if (Name == '') {
			return LongToast('CantHaveEmptyInputs')
		}
		if (!ShowInCheckOut && !ShowInProducts) {
			return LongToast('MustOneValueTrueShowInCheckOutShowInProducts')
		}
		if (this.state.Type.Id == 5) {
			this.setState({ lockSubmit: true })

			this.cancelFetchDataCreateProductOptionGroup = CreateProductOptionGroup(DateType, (res) => {
				// alert(JSON.stringify(res))

				this.setState({ didSucceed: true, lockSubmit: false })
				LongToast('dataSaved')

				this.props.route.params?.onChildChange &&
					this.props.route.params?.onChildChange()
				this.props.navigation.goBack()

				this.props.navigation.navigate('ProductOptions', { triggerRefresh: true })
			}, err => {
				this.setState({ lockSubmit: false })
			})
		} else {
			this.setState({ lockSubmit: true })

			this.cancelFetchDataCreateProductOptionGroup = CreateProductOptionGroup(Normal, (res) => {
				// alert(JSON.stringify(res))

				this.setState({ didSucceed: true, lockSubmit: false })
				LongToast('dataSaved')

				this.props.route.params?.onChildChange &&
					this.props.route.params?.onChildChange()
				this.props.navigation.goBack()

				this.props.navigation.navigate('ProductOptions', { triggerRefresh: true })
			}, err => {
				this.setState({ lockSubmit: false })
			})

		}

	}

	renderIcon = (MobileIcon, MobileIconFamily = this.state.selectedIcon.familyName) => {
		switch (MobileIconFamily) {
			case 'Ionicons':
				return <Ionicons style={{}} size={30} name={MobileIcon || this.state.selectedIcon.iconName} />
			case 'AntDesign':
				return <AntDesign style={{}} size={30} name={MobileIcon || this.state.selectedIcon.iconName} />
			case 'Entypo':
				return <Entypo style={{}} size={30} name={MobileIcon || this.state.selectedIcon.iconName} />
			case 'EvilIcons':
				return <EvilIcons style={{}} size={30} name={MobileIcon || this.state.selectedIcon.iconName} />
			case 'Feather':
				return <Feather style={{}} size={30} name={MobileIcon || this.state.selectedIcon.iconName} />
			case 'FontAwesome':
				return <FontAwesome style={{}} size={30} name={MobileIcon || this.state.selectedIcon.iconName} />
			case 'Foundation':
				return <Foundation style={{}} size={30} name={MobileIcon || this.state.selectedIcon.iconName} />
			case 'MaterialCommunityIcons':
				return <MaterialCommunityIcons style={{}} size={30} name={MobileIcon || this.state.selectedIcon.iconName} />
			case 'MaterialIcons':
				return <MaterialIcons style={{}} size={30} name={MobileIcon || this.state.selectedIcon.iconName} />
			case 'Octicons':
				return <Octicons style={{}} size={30} name={MobileIcon || this.state.selectedIcon.iconName} />
			case 'SimpleLineIcons':
				return <SimpleLineIcons style={{}} size={30} name={MobileIcon || this.state.selectedIcon.iconName} />
			case 'Zocial':
				return <Zocial style={{}} size={30} name={MobileIcon || this.state.selectedIcon.iconName} />

			default:
				return null
		}
	}


	renderContent = () => {
		const { Languages, Language, ChangeToLanguage, Types, Type } = this.state;

		if (this.state.didFetchData) {
			return (
				<ScrollView style={{ flex: 1, }} >
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
						onChangeText={(text) => { this.setState({ Description: text }) }}
					/>

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

					<ArrowItem
						style={{
							opacity: 0.4,
							backgroundColor: '#f2f2f2'
						}}
						disabled
						onPress={() => {
							this.typeRef.current.show()
						}}
						title={'Type'}
						info={Type ? Type.Name : null} />

					{/* <View style={{  borderWidth: 1, 
						borderColor: '#b3b3b3' ,
						// borderColor: 'black' ,
						 bottom: 25, marginHorizontal: 15 }} /> */}
					<ItemSeparator />

					{
						this.state.Type.Id == 1 || this.state.Type.Id == 2 || this.state.Type.Id == 3 || this.state.Type.Id == 10 ?

							<CustomTouchable onPress={() => this.props.navigation.navigate('ProductOptionMembers', { Id: this.props.route.params?.Id, Type: this.state.Type, callback: () => this.fetchContent() })} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', margin: largePagePadding, marginTop: 40 }}>
								<TranslatedText style={{
									// color: '#949EA5',
									color: secondTextColor
								}} text="Members" />
								<Ionicons size={25}
									// color='#949EA5'
									color={secondTextColor}
									name='ios-add-circle-outline' />
							</CustomTouchable>

							: null
					}



					<ItemSeparator />
					{this.state.Type.Id == 1 || this.state.Type.Id == 2 || this.state.Type.Id == 3 || this.state.Type.Id == 10 ? this.renderMembers() : null}


					{/* <View style={{ marginVertical: pagePadding, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
						 <TranslatedText style={{ flex: 1, textAlign: 'center', }} text="iconColor" />
						<TranslatedText style={{ flex: 1, textAlign: 'center', }} text="shortCode" /> 
						<TranslatedText style={{ flex: 1, textAlign: 'center', }} text="Name" />
					</View> */}
					{this.state.Type.Id == 5 &&
						<View>

							<HorizontalInput
								// maxLength={STRING_LENGTH_LONG}
								keyboardType="numeric"
								label="minDate"
								value={this.state.minDate}
								onChangeText={(text) => { this.setState({ minDate: text }) }}
							/>

							<ItemSeparator />

							<HorizontalInput
								// maxLength={STRING_LENGTH_LONG}
								keyboardType="numeric"
								label="maxDate"
								value={this.state.maxDate}
								onChangeText={(text) => { this.setState({ maxDate: text }) }}
							/>
						</View>
					}
				</ScrollView>
			)
		}
	}
	onSelectLanguage = (index) => {
		const { languages_data } = this.props
		const selectedLanguage = languages_data[index]
		this.setState({ ChangeToLanguage: selectedLanguage }, () => {
			this.fetchContent(this.state.ChangeToLanguage.key)
		})
	}

	renderMembers = () => {
		return this.state.members.map((member, i) => (
			<CustomTouchable
				key={i}
				onPress={() => {
					this.props.navigation.navigate('editMember', { Id: member.Id, groupId: this.props.route.params?.Id, Type: this.state.Type, callback: () => this.fetchContent() })
				}}
				onLongPress={() => {
					this.DeleteOrEditId = member.Id
					this.setState({ showCustomSelectorForDeleteref: true })
				}}>
				{/* {this.renderDeletebutton(member)} */}
				<View
					style={{
						backgroundColor: '#FFF',
						paddingVertical: pagePadding,
					}}>
					<View style={{ marginVertical: pagePadding, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
						{/* <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
							{this.renderIcon(member.MobileIcon, member.MobileIconFamily)}
						</View>
						<FontedText style={{ flex: 1, textAlign: 'center', }}>{member.ShortCode}</FontedText> */}
						<FontedText style={{ flex: 1, textAlign: 'center', }}>{member.Name}</FontedText>
					</View>
					<ItemSeparator />
				</View>
			</CustomTouchable>
		))
	}

	render() {
		const { languages_data } = this.props
		const { Types } = this.state
		return (
			<LazyContainer style={{ flex: 1, backgroundColor: "#FFF" }}>
				<CustomHeader
					navigation={this.props.navigation}
					title={"ProductOptionGroups"}
					rightComponent={
						<HeaderSubmitButton
							isLoading={this.state.lockSubmit}
							didSucceed={this.state.didSucceed}
							onPress={() => { this.submitOptionGroup() }} />
					} />

				{this.renderContent()}
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
						this.cancelFetchDataDeleteMember = DeleteMember(this.DeleteOrEditId, res => {
							this.setState({
								members: this.state.members.filter((item) => item.Id !== this.DeleteOrEditId),
								showCustomSelectorForDeleteref: false,
								Loading: false
							})
							LongToast('dataDeleted')

						}, () => {
							this.setState({ Loading: false })
						})
					}}
				/>
				<CustomSelector
					ref={this.languageSelectorRef}
					options={languages_data.map(item => item.label)}
					onSelect={(index) => { this.onSelectLanguage(index) }}
					onDismiss={() => { }}
				/>

				{Types && <CustomSelector
					ref={this.typeRef}
					options={Types.map(item => item.Name)}
					onSelect={(index) => { this.setState({ Type: Types[index] }) }}
					onDismiss={() => { }}
				/>}

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
export default connect(mapStateToProps)(withLocalize(optionGroup))