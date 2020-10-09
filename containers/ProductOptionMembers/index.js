import React, { Component } from 'react';
import { withLocalize } from 'react-localize-redux';
import { Image, ScrollView, Text, View, Dimensions } from 'react-native';
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
import { secondColor, secondTextColor } from '../../constants/Colors.js';
import { largePagePadding } from '../../constants/Style.js';
import { getFilters } from '../../services/FilterService.js';
import { CreateProductOptionGroupMember } from '../../services/ProductOptionService.js';
import { LongToast } from '../../utils/Toast.js';
import { isValidHexColor } from '../../utils/Validation.js';
import { SelectEntity } from '../../utils/EntitySelector';

class Brand extends Component {
	_menu = null;
	constructor(props) {
		super(props)

		const { languages_data, currLang } = this.props

		this.state = {
			Products: [],
			picker_image_uri: null,
			lockSubmit: false,
			didFetchData: false,
			Name: '',
			Description: '',
			shortCode: '',
			members: [],
			isColorModalVisible: false,
			color: '#ff0000',
			Type: this.props.route.params?.Type,
			// selectedIcon: {
			// 	familyName: 'Entypo',
			// 	iconName: 'info-with-circle',
			// },
			selectedLang: languages_data.find(item => item.code === currLang),
			selectedIcon: {
				familyName: null,
				iconName: null,
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
		this.fetchFilters();

		//re render when change orientation
		Dimensions.addEventListener('change', () => {
			this.setState({
				screenWidth: Dimensions.get('screen').width,
				screenHeight: Dimensions.get('screen').height,
			})
		})

	}
	componentWillUnmount() {
		this.cancelFetchDatagetFilters && this.cancelFetchDatagetFilters()
		this.cancelFetchDataCreateProductOptionGroupMember && this.cancelFetchDataCreateProductOptionGroupMember()
	}

	// componentWillMount() {
	// 	this.cancelFetchDatagetFilters && this.cancelFetchDatagetFilters()
	// 	this.cancelFetchDataCreateProductOptionGroupMember && this.cancelFetchDataCreateProductOptionGroupMember()
	// }

	fetchFilters = () => {
		this.cancelFetchDatagetFilters = getFilters({ languages: true, }, (res) => {
			this.setState({ Languages: res.data.Languages, didFetchData: true })
		});
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
					<CustomTouchable onPress={() => this.setState({ isColorModalVisible: false })} style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: secondColor, }}>
						<Text style={{ color: "#FFF", padding: 10, paddingVertical: 15 }}>Done</Text>
					</CustomTouchable>
				</View>
			</View>
		</Modal>
	)
	submitOptionGroup = () => {
		const { Name, Description, shortCode, selectedIcon, color, selectedLang, Type, Products, PriceChange } = this.state
		if (Name == '') {
			return LongToast('CantHaveEmptyInputs')
		} else if (Type.Id == 3 && selectedIcon.familyName == null) {
			return LongToast('CantHaveEmptyInputs')
		} else if (Type.Id == 2 && shortCode == '') {
			return LongToast('CantHaveEmptyInputs')
		}
		else {

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

			this.setState({ lockSubmit: true })

			this.cancelFetchDataCreateProductOptionGroupMember = CreateProductOptionGroupMember({
				Id: 0,
				LanguageId: selectedLang.key,
				Name, Description,
				value1: DynamicObj.value1,
				value2: DynamicObj.value2,
				value3: DynamicObj.value3,
				Products: Products.map(item => item.Id),
				PriceChange,
				ProductOptionGroupId: this.props.route.params?.Id
			}, res => {
				this.setState({ didSucceed: true, lockSubmit: false })
				this.props.navigation.goBack()
				this.props.route.params?.callback()
			}, err => {
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
		const { Languages, selectedLang, Type, Products } = this.state
		const { languages_data } = this.props

		return (
			<ScrollView style={{ flex: 1, }} >
				<ArrowItem
					onPress={() => {
						this.languageSelectorRef.current.show()
					}}
					title={'Language'}
					info={selectedLang ? selectedLang.label : ''} />
				<HorizontalInput
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
					label="shortCode"
					value={this.state.shortCode}
					onChangeText={(text) => { this.setState({ shortCode: text }) }} /> : null}

				<ItemSeparator />

				{
					languages_data && <CustomSelector
						ref={this.languageSelectorRef}
						options={languages_data.map(item => item.label)}
						onSelect={(index) => {
							this.setState({
								selectedLang: languages_data[index]
							})
						}}
						onDismiss={() => { }}
					/>
				}


				{Type && Type.Id == 3 ?
					<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', margin: largePagePadding, marginBottom: 15 }}>
						<TranslatedText style={{ flex: 2, color: secondTextColor, }} text="MobileIcon" />
						<CustomTouchable onPress={() => this.props.navigation.navigate('IconSelector', {
							callback: (familyName, iconName) => this.setState({ selectedIcon: { familyName, iconName } })
						})} style={{ flex: 5, paddingLeft: 70, }}>
							{
								this.state.selectedIcon.familyName != null && this.state.selectedIcon.iconName != null ? this.renderIcon() :
									<Ionicons size={25} color={secondTextColor} name='ios-add-circle-outline' />
								// <TranslatedText style={{ color: secondTextColor }} text='AddIcon' />
							}
							{/* {this.renderIcon()}  */}
						</CustomTouchable>
					</View> : null
				}


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