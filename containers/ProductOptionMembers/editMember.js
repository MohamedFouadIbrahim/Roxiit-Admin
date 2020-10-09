import React, { Component } from 'react';
import { withLocalize } from 'react-localize-redux';
import { Image, ScrollView, View, Dimensions } from 'react-native';
import { ColorPicker, fromHsv } from 'react-native-color-picker';
import Modal from "react-native-modal";
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
import CustomColorModal from '../../components/CustomColorModal';
import CustomHeader from '../../components/CustomHeader/index.js';
import CustomSelector from '../../components/CustomSelector/index.js';
import CustomTouchable from '../../components/CustomTouchable';
import HeaderSubmitButton from '../../components/HeaderSubmitButton/index.js';
import HorizontalInput from '../../components/HorizontalInput/index.js';
import ItemSeparator from '../../components/ItemSeparator/index.js';
import LazyContainer from '../../components/LazyContainer';
import TranslatedText from '../../components/TranslatedText/index.js';
import { secondTextColor } from '../../constants/Colors.js';
import { STRING_LENGTH_LONG, STRING_LENGTH_SHORT } from '../../constants/Config';
import { largePagePadding } from '../../constants/Style.js';
import { getFilters } from '../../services/FilterService.js';
import { CreateProductOptionGroupMember, GetMemberDetails } from '../../services/ProductOptionService.js';
import { LongToast } from '../../utils/Toast.js';
import { SelectEntity } from '../../utils/EntitySelector';
import { isValidHexColor } from '../../utils/Validation.js';


class Brand extends Component {
	_menu = null;
	constructor(props) {
		super(props)
		const { languages_data, currLang } = this.props
		//
		//label
		this.state = {
			picker_image_uri: null,
			lockSubmit: false,
			didFetchData: false,
			Name: '',
			Description: '',
			shortCode: '',
			isColorModalVisible: false,
			color: 'red',
			languages: languages_data,
			selectedLang: languages_data.find(item => item.code === currLang),
			selectedLang: {
				Id: null,
				Name: 'select language',
			},
			selectedIcon: {
				familyName: 'Entypo',
				iconName: 'info-with-circle',
			},
			PriceChange: null,
			screenWidth: Dimensions.get('screen').width,
			screenHeight: Dimensions.get('screen').height,

		}

		this.languageSelectorRef = React.createRef();

		if (this.props.route.params && this.props.route.params?.Id) {
			this.editMode = true
			this.brandId = this.props.route.params?.Id
		}
		else {
			this.editMode = false
		}

		this.lockSubmit = false
	}

	componentDidMount() {
		this.fetchContent();

		//re render when change orientation
		Dimensions.addEventListener('change', () => {
			this.setState({
				screenWidth: Dimensions.get('screen').width,
				screenHeight: Dimensions.get('screen').height,
			})
		})


	}
	componentWillUnmount() {
		this.cancelFetchDataCreateProductOptionGroupMember && this.cancelFetchDataCreateProductOptionGroupMember()
		this.cancelFetchDataGetMemberDetails && this.cancelFetchDataGetMemberDetails()
		this.cancelFetchDatagetFilters && this.cancelFetchDatagetFilters()
	}
	fetchContent = (languageId = null) => {

		this.cancelFetchDataGetMemberDetails = GetMemberDetails({ Id: this.props.route.params?.Id, languageId }, result => {
			this.cancelFetchDatagetFilters = getFilters({ languages: true, }, (res) => {
				// return
				this.setState({
					...result.data,
					Type: this.props.route.params?.Type,
					selectedLang: this.props.languages_data.find(item => item.key === result.data.LanguageId),
					languages: res.data.Languages,
					didFetchData: true
				}, () => {
					if (this.state.Type.Id == 3) {
						this.setState({
							selectedIcon: { familyName: result.data.value2, iconName: result.data.value1 }
						})
					} else if (this.state.Type.Id == 1) {
						this.setState({
							color: result.data.value1
						})
					} else if (this.state.Type.Id == 2) {
						this.setState({
							shortCode: result.data.value1
						})
					}

				})
			});
		})
	}

	renderColorModal = () => (
		<Modal onBackdropPress={() => this.setState({ isColorModalVisible: false })} isVisible={this.state.isColorModalVisible}>
			<View style={{ width: this.state.screenWidth * .9, alignSelf: "center", paddingBottom: 35, backgroundColor: "#FFF", borderRadius: 10, overflow: "hidden", alignItems: "center", justifyContent: "center" }}>
				<ColorPicker
					onColorChange={color => this.setState({ color: fromHsv(color) })}
					hideSliders={false}
					color={this.state.color}
					defaultColor={this.state.color}
					style={{ width: 150, height: 150, marginVertical: 30 }}
				/>
				<View style={{ flexDirection: "row", position: "absolute", bottom: -.5, justifyContent: "center", alignItems: "center" }}>
					<CustomTouchable onPress={() => this.setState({ isColorModalVisible: false })} style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: '#000', }}>
						<TranslatedText style={{ color: "#FFF", padding: 10, paddingVertical: 15 }} text={'Done'} />
					</CustomTouchable>
				</View>
			</View>
		</Modal>
	)

	submitOptionGroup = () => {
		const { Name, Description, shortCode, selectedIcon, color, selectedLang, Type, lockSubmit, Products, PriceChange } = this.state

		if (lockSubmit) {
			return
		}

		if (Name == '') {
			return LongToast('CantHaveEmptyInputs')
		} else {
			let DynamicObj = {}
			if (Type.Id == 3) {
				DynamicObj = {
					value1: selectedIcon.iconName,
					value2: selectedIcon.familyName,
					value3: this.state.value3
				}
			} else if (Type.Id == 2) {
				DynamicObj = {
					value1: shortCode,
					value2: shortCode,
					value3: shortCode
				}
			} else if (Type.Id == 1) {

				if (isValidHexColor(color)) {
					DynamicObj = {
						value1: color,
						value2: color,
						value3: color
					}
				} else {
					return LongToast('invaildColor')
				}

			}

			this.lockSubmit = true
			this.setState({ lockSubmit: true })

			this.cancelFetchDataCreateProductOptionGroupMember = CreateProductOptionGroupMember({
				Id: this.props.route.params?.Id,
				LanguageId: selectedLang.key,
				Name,
				Description,
				Products: Products.map(item => item.Id),
				PriceChange,
				...DynamicObj,
				ProductOptionGroupId: this.props.route.params?.groupId
			}, res => {
				this.lockSubmit = false
				this.setState({ didSucceed: true, lockSubmit: false })
				this.props.navigation.goBack()
				this.props.route.params?.callback()
			}, err => {

				this.lockSubmit = false
				this.setState({ lockSubmit: false })

			})
		}
	}

	renderIcon = () => {
		switch (this.state.selectedIcon.familyName) {
			case 'Ionicons':
				return <Ionicons style={{}} size={30} name={this.state.selectedIcon.iconName} />
			case 'AntDesign':
				return <AntDesign style={{}} size={30} name={this.state.selectedIcon.iconName} />
			case 'Entypo':
				return <Entypo style={{}} size={30} name={this.state.selectedIcon.iconName} />
			case 'EvilIcons':
				return <EvilIcons style={{}} size={30} name={this.state.selectedIcon.iconName} />
			case 'Feather':
				return <Feather style={{}} size={30} name={this.state.selectedIcon.iconName} />
			case 'FontAwesome':
				return <FontAwesome style={{}} size={30} name={this.state.selectedIcon.iconName} />
			case 'Foundation':
				return <Foundation style={{}} size={30} name={this.state.selectedIcon.iconName} />
			case 'MaterialCommunityIcons':
				return <MaterialCommunityIcons style={{}} size={30} name={this.state.selectedIcon.iconName} />
			case 'MaterialIcons':
				return <MaterialIcons style={{}} size={30} name={this.state.selectedIcon.iconName} />
			case 'Octicons':
				return <Octicons style={{}} size={30} name={this.state.selectedIcon.iconName} />
			case 'SimpleLineIcons':
				return <SimpleLineIcons style={{}} size={30} name={this.state.selectedIcon.iconName} />
			case 'Zocial':
				return <Zocial style={{}} size={30} name={this.state.selectedIcon.iconName} />

			default:
				return null
		}
	}

	renderContent = () => {

		const { selectedLang, languages, Type, Products } = this.state
		if (this.state.didFetchData == false) {
			return null
		}
		return (
			<ScrollView style={{ flex: 1, }} >

				<ArrowItem
					onPress={() => {
						this.languageSelectorRef.current.show()
					}}
					title={'Language'}
					info={selectedLang ? selectedLang.label : ''} />

				<ItemSeparator />

				<HorizontalInput
					maxLength={STRING_LENGTH_LONG}
					label="Name"
					value={this.state.Name}
					onChangeText={(text) => { this.setState({ Name: text }) }} />

				<ItemSeparator />

				<HorizontalInput
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

				{Type && Type.Id == 2 ? <HorizontalInput
					maxLength={STRING_LENGTH_SHORT}
					label="shortCode"
					value={this.state.shortCode}
					onChangeText={(text) => { this.setState({ shortCode: text }) }} /> : null}

				<ItemSeparator />

				{
					languages && <CustomSelector
						ref={this.languageSelectorRef}
						options={languages.map(item => item.Name)}
						onSelect={(index) => {
							this.setState({
								selectedLang: languages[index]
							}, () => this.fetchContent(languages[index].Id))
						}}
						onDismiss={() => { }}
					/>
				}

				{Type && Type.Id == 3 ? <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', margin: largePagePadding, marginBottom: 15 }}>
					<TranslatedText style={{ flex: 2, color: secondTextColor, }} text="MobileIcon" />
					<CustomTouchable onPress={() => this.props.navigation.navigate('IconSelector', {
						callback: (familyName, iconName) => this.setState({ selectedIcon: { familyName, iconName } })
					})} style={{ flex: 5, paddingLeft: 70, }}>
						{this.renderIcon()}
					</CustomTouchable>
				</View> : null}

				<ItemSeparator />

				{Type && Type.Id == 1 ? <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', margin: largePagePadding, marginBottom: 15 }}>
					<TranslatedText style={{ flex: 2, color: secondTextColor, }} text="color" />
					<View style={{ flex: 5, }}>
						<CustomTouchable onPress={() => { this.setState({ isColorModalVisible: true }) }} style={{ paddingLeft: 50, }}>
							<View>
								<Image source={require('../../assets/images/productOptions/wheel-5-ryb.png')} style={{ width: 30, height: 30, borderRadius: 15 }} />
								<View style={{ backgroundColor: this.state.color, width: 20, height: 20, borderRadius: 10, left: 5, top: 5, position: "absolute" }}></View>
							</View>
						</CustomTouchable>
					</View>
				</View> : null}

				<ItemSeparator />
				{/* {this.renderColorModal()} */}

				<CustomColorModal
					onBackdropPress={() => { this.setState({ isColorModalVisible: false }) }}
					onChangeText={(text) => { this.setState({ color: text }) }}
					value={this.state.color}
					onColorChange={color => this.setState({ color: fromHsv(color) })}
					isVisible={this.state.isColorModalVisible}
					onDonepress={() => { this.setState({ isColorModalVisible: false }) }}
					defaultColor={this.state.color}
				/>
				<ItemSeparator />

				<ArrowItem
					onPress={() => {
						// this.languageSelectorRef.current.show()

						SelectEntity(this.props.navigation, Products => {
							this.setState({ Products })
						}, 'Products', null, true, 2, Products, { pagination: true, initialData: this.state.Products })
					}}
					title={'Products'}
					info={`(${Products.length}) selected`}
				/>
			</ScrollView>
		)

	}

	render() {
		return (
			<LazyContainer style={{ flex: 1, backgroundColor: "#FFF" }}>
				<CustomHeader
					navigation={this.props.navigation}
					title={"ProductOptionsMembers"}
					rightComponent={
						<HeaderSubmitButton
							isLoading={this.state.lockSubmit}
							didSucceed={this.state.didSucceed}
							onPress={() => { this.submitOptionGroup() }} />
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
export default connect(mapStateToProps)(withLocalize(Brand))