import React, { Component } from 'react'
import { ScrollView, KeyboardAvoidingView, Platform, ImageBackground, View, ActivityIndicator } from 'react-native'
import CustomHeader from '../../components/CustomHeader/index.js';
import LazyContainer from '../../components/LazyContainer'
import ItemSeparator from '../../components/ItemSeparator/index.js';
import HorizontalInput from '../../components/HorizontalInput/index.js';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import CircularImage from '../../components/CircularImage/index.js';
import { largePagePadding } from '../../constants/Style.js';
import { showImagePicker, OpenCamera, OpenSingleSelectImagePicker } from '../../utils/Image.js';
import { withLocalize } from 'react-localize-redux';
import { mainColor, secondColor } from '../../constants/Colors.js';
import { STRING_LENGTH_MEDIUM } from '../../constants/Config';
import CustomLoader from '../../components/CustomLoader/index';
import { SelectCountry } from '../../utils/Places.js';
import { GetSubStoreProfile, ChangeSubStoreImage, EditSubStoreProfile, AddSubStoreProfile } from '../../services/StoreProfileServece';
import { parsePhone } from '../../utils/Phone';
import { isValidMobileNumber } from '../../utils/Validation';
import PhoneInput from '../../components/PhoneInput/index';
import LinearGradient from 'react-native-linear-gradient';
import FontedText from '../../components/FontedText/index';
import { GetMyLocation } from '../../services/PlacesService.js';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { LongToast } from '../../utils/Toast.js';
import CustomTouchable from '../../components/CustomTouchable';
import ConditionalCircularImage from '../../components/ConditionalCircularImage';
import CustomImagePicker from '../../components/CustomImagePicker';
import ArrowItem from '../../components/ArrowItem/index.js';
import Entypo from 'react-native-vector-icons/Entypo'
import { ShareSomeThing } from '../../utils/Share.js';
import { connect } from 'react-redux';
import { GetSubStoreTypes } from '../../services/SubStoreTypeServices.js';
import CustomSelector from '../../components/CustomSelector/index.js';
import { ExternalTranslate } from '../../utils/Translate.js';

class SubStore extends Component {
	constructor(props) {
		super(props)

		this.lockSubmit = false
		if (this.props.route.params && this.props.route.params?.Id) {
			this.subStoreId = this.props.route.params?.Id
			this.editMode = true
		} else {
			this.editMode = false
		}
		this.state = {
			prossesEvent: 0,
			latitude: null,
			longitude: null,
			lockSubmit: false,
			remoteImage: false,
			selectedType: null,
			Types: null,
			Commission: null,
		}

		this.LibraryOrCameraRef = React.createRef();
		this.LibraryOrCameraOptions = [{ Id: 0, Name: 'Camera' }, { Id: 1, Name: 'Library' }]
		this.TypesRef = React.createRef();
	}

	componentWillUnmount() {
		this.cancelFetchDatagetFilters && this.cancelFetchDatagetFilters()
		this.cancelFetchDataGetArticle && this.cancelFetchDataGetArticle()
	}

	componentDidMount() {
		if (this.editMode) {
			this.fetchData()
		} else {
			GetMyLocation(res => {
				this.setState({
					PhoneCountry: res.data,
					PhoneCountry1: res.data,
					didFetchData: true,
					remoteImage: false
				})
			})
		}
	}

	fetchData = () => {
		GetSubStoreTypes(typesRes => {
			GetSubStoreProfile(this.subStoreId, res => {
				this.fixedName = res.data.Name
				const { Phone, Phone1 } = res.data
				this.setState({
					Types: typesRes.data.Data,
					...res.data,
					selectedType: typesRes.data.Data ? typesRes.data.Data.filter(item => item.Id == res.data.Type.Id)[0] : null,
					PhoneCountry: parsePhone(String(Phone)).NumberCountry,
					PhoneCountry1: parsePhone(String(Phone1)).NumberCountry,
					Phone: parsePhone(String(Phone)).NationalNumber,
					Phone1: parsePhone(String(Phone1)).NationalNumber,
					didFetchData: true,
					remoteImage: true
				})
			})
		})
	}

	submit = () => {
		if (this.lockSubmit) {
			return
		}
		const { Phone, PhoneCountry, Phone1, PhoneCountry1, Description, Name, Address, picker_image_uri, latitude, longitude, selectedType, Commission } = this.state

		if (!Name) {
			return LongToast('CantHaveEmptyInputs')
		}

		if (!isValidMobileNumber(`${PhoneCountry.PhoneCode}${Phone}`)) {
			return LongToast('InvalidPhone')
		}

		if (Phone1 && Phone1 != null && Phone1 != 'null' && !isValidMobileNumber(`${PhoneCountry1.PhoneCode}${Phone1}`)) {
			return LongToast('InvalidPhone')
		}

		if (!selectedType || !selectedType.Id) {
			return LongToast('TypeCantBeEmpty')
		}
		this.lockSubmit = true
		this.setState({ lockSubmit: true })
		if (this.editMode) {
			EditSubStoreProfile({
				Id: this.subStoreId,
				Name,
				Description,
				Phone: `${PhoneCountry.PhoneCode}${Phone}`,
				Phone1: Phone1 && Phone1 != null && Phone1 != 'null' ? `${PhoneCountry1.PhoneCode}${Phone1}` : null,
				Address,
				latitude, longitude,
				TypeId: selectedType.Id,
				Commission,
			}, res => {
				this.lockSubmit = false
				this.setState({ lockSubmit: false })
				LongToast('dataSaved')

				if (this.props.navigation.state.params.isFromSettings) { //To Prevent Passing To Main Store
					this.props.navigation.navigate('Home')
				}
				else {
					this.props.navigation.goBack()
				}
				this.props.navigation.state.params.onChildChange && this.props.navigation.state.params.onChildChange()

			}, () => {
				this.lockSubmit = false
				this.setState({ lockSubmit: false })
			})
		} else {
			// picker_image_uri
			this.setState({ uploadingImage: true, prossesEvent: 0 })
			// AddSubStoreProfile()
			AddSubStoreProfile({
				Id: 0,
				Name,
				Description,
				Phone: `${PhoneCountry.PhoneCode}${Phone}`,
				Phone1: Phone1 && Phone1 != null && Phone1 != 'null' ? `${PhoneCountry1.PhoneCode}${Phone1}` : null,
				Address,
				latitude, longitude,
				Commission
			}, picker_image_uri, res => {
				this.lockSubmit = false
				this.setState({ lockSubmit: false, uploadingImage: false, prossesEvent: 0 })
				LongToast('dataSaved')
				// this.props.navigation.goBack()
				this.props.navigation.navigate('Home')
				this.props.route.params?.onChildChange && this.props.route.params?.onChildChange()
			}, () => {
				this.lockSubmit = false
				this.setState({ lockSubmit: false, uploadingImage: false, prossesEvent: 0 })
			}, (re) => {
				this.setState({ prossesEvent: re * 0.01 })
			})
		}

	}



	onShareApp = () => {
		const { Url } = this.props;
		LongToast('PleaseWait')
		ShareSomeThing(`${Url}/s/${this.subStoreId}`)
	}

	renderImage = () => {
		const imageSize = 110

		const { picker_image_uri } = this.state
		if (this.editMode) {
			const { ImageUrl } = this.state.Image

			return (
				<CustomTouchable
					onPress={() => {
						if (!this.state.uploadingImage) {
							this.LibraryOrCameraRef.current.show()
						}
					}}
					style={{
						alignSelf: 'center',
						justifyContent: 'center',
						alignItems: 'center',
						marginBottom: largePagePadding,
					}}>

					<ConditionalCircularImage
						remote={this.state.remoteImage}
						uri={picker_image_uri || ImageUrl}
						size={imageSize}
					/>

					{/* <CircularImage
						uri={picker_image_uri || ImageUrl}
						size={imageSize} /> */}

					<FontAwesome
						style={{
							position: 'absolute',
							right: 4,
							bottom: 8,
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
			// const { picker_image_uri } = this.state

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
						remote={this.state.remoteImage}
						uri={picker_image_uri}
						size={imageSize} /> : <Ionicons
							name={`ios-add`}
							size={45}
							color={'white'} />}
					{this.state.uploadingImage == true ?
						<CustomLoader
							size={imageSize - 30}
							style={{ position: 'absolute', backgroundColor: 'white', borderRadius: 60 }}
							progress={this.state.prossesEvent == 0 ? this.state.prossesEvent : this.state.prossesEvent}
						/>
						: null
					}
				</CustomTouchable>
			)
		}


	}

	renderHeader = () => {
		const {
			Image,
			Name
		} = this.state

		return (
			<ImageBackground
				blurRadius={5}
				style={{ flex: 1, }}
				source={{ uri: this.state.didFetchData ? Image.ImageUrl : 'https://' }}
			>
				<LinearGradient
					colors={['rgba(0, 0, 0, .1)', 'rgba(0, 0, 0, .6)', 'rgba(0, 0, 0, 1)']}
					style={{
						flex: 1,
						paddingVertical: largePagePadding,
					}}>

					<View
						style={{
							justifyContent: 'center',
							alignItems: 'center',
							padding: largePagePadding,
						}}>
						{this.renderImage()}
						<FontedText style={{ color: '#FFF', textAlign: 'center' }}>{this.fixedName}</FontedText>
					</View>

				</LinearGradient>
			</ImageBackground>
		)
	}

	renderContent = () => {
		if (this.state.didFetchData) {
			const {
				Name,
				Description,
				Phone,
				Phone1,
				Address,
				PhoneCountry,
				PhoneCountry1,
				latitude,
				longitude,
				selectedType,
				Commission
			} = this.state

			return (
				<ScrollView>

					{this.editMode ? this.renderHeader() : this.renderImage()}

					<HorizontalInput
						maxLength={STRING_LENGTH_MEDIUM}
						label="Name"
						value={Name}
						onChangeText={(text) => { this.setState({ Name: text }) }} />

					<ItemSeparator />

					<HorizontalInput
						multiline
						label="Description"
						value={Description}
						onChangeText={(text) => { this.setState({ Description: text }) }} />

					<ItemSeparator />

					<HorizontalInput
						multiline
						label="Address"
						value={Address}
						onChangeText={(text) => { this.setState({ Address: text }) }} />

					<ItemSeparator />

					<PhoneInput
						countryId={PhoneCountry ? PhoneCountry.Id : undefined}
						onPressFlag={() => {
							SelectCountry(this.props.navigation, item => {
								this.setState({ PhoneCountry: item })
							})
						}}
						value={Phone}
						onChangeText={(text) => { this.setState({ Phone: text }) }} />

					<ItemSeparator />

					<PhoneInput
						countryId={PhoneCountry1 ? PhoneCountry1.Id : undefined}
						onPressFlag={() => {
							SelectCountry(this.props.navigation, item => {
								this.setState({ PhoneCountry1: item })
							})
						}}
						value={Phone1 && Phone1 != null && Phone1 != 'null' ? Phone1 : null}
						onChangeText={(text) => { this.setState({ Phone1: text }) }} />

					<ItemSeparator />

					<ArrowItem
						onPress={() => {
							this.props.navigation.navigate('SubStoreMap', {
								latitude: latitude ? latitude : 0,
								longitude: longitude ? longitude : 0,
								onSelectLatitudeAndLongitude: (latitude, longitude) => {
									this.setState({ latitude, longitude })
								}
							})
						}}
						title={"SubStoreLocation"}
						info={null}
					/>

					<ItemSeparator />
					<ArrowItem
						onPress={() => {
							this.TypesRef.current.show()
						}}
						title={'Type'}
						info={selectedType ? selectedType.Name : ExternalTranslate('NoneSelected')} />
					<ItemSeparator />

					<HorizontalInput
						keyboardType="numeric"
						label="Commission"
						value={Commission != null ? String(Commission) : null}
						rightMember={'%'}
						onChangeText={(Commission) => { this.setState({ Commission }) }} />
					<ItemSeparator />
				</ScrollView>
			)
		}
	}

	render() {
		const { Types } = this.state
		return (
			<LazyContainer style={{ flex: 1, backgroundColor: "#FFF" }}>

				<CustomHeader
					rightNumOfItems={2}
					navigation={this.props.navigation}
					title={"SubStore"}
					onBack={() => { this.props.navigation.navigate('Home') }}
					rightComponent={
						<View style={{
							flexDirection: "row",
						}}>
							{this.state.lockSubmit ?
								<ActivityIndicator color="#FFF" size="small" />
								:
								<CustomTouchable
									onPress={() => { this.submit() }}
									style={{
										flexDirection: 'row',
										justifyContent: 'center',
										alignItems: 'center',
										flex: 1,
									}}>
									<Ionicons
										name={`md-checkmark`}
										size={18}
										color={'white'} />
								</CustomTouchable>}

							<CustomTouchable
								onPress={() => {
									this.onShareApp()
								}}
								style={{
									flexDirection: "row",
									justifyContent: "center",
									alignItems: "center",
									flex: 1
								}}>
								<Entypo
									name={`share`}
									size={18}
									color={'white'} />
							</CustomTouchable>
						</View>
					} />

				{Platform.OS == 'ios' ?
					<KeyboardAvoidingView behavior='padding' enabled
						style={{ flex: 1 }}
						keyboardVerticalOffset={40}
					>
						{this.renderContent()}
					</KeyboardAvoidingView> :
					this.renderContent()
				}


				<CustomImagePicker
					onSelect={(Data) => {
						if (this.editMode) {
							const { uri, path } = Data
							this.setState({ picker_image_uri: uri, uploadingImage: true, prossesEvent: 0, remoteImage: false })
							ChangeSubStoreImage(this.subStoreId, path, () => {
								this.setState({ uploadingImage: false, prossesEvent: 0 })
								this.fetchData()
							}, err => {
								this.setState({ uploadingImage: false, prossesEvent: 0 })
							}, (re) => {
								this.setState({ prossesEvent: re * 0.01 })
							})
						}
						else {
							const { uri, path } = Data
							this.setState({ picker_image_uri: uri, remoteImage: false })
						}
					}}
					refrence={this.LibraryOrCameraRef}
				/>

				{Types && <CustomSelector
					ref={this.TypesRef}
					options={Types.map(item => item.Name)}
					onSelect={(index) => { this.setState({ selectedType: Types[index] }) }}
					onDismiss={() => { }}
				/>}
			</LazyContainer>
		)
	}
}
const mapStateToProps = ({
	runtime_config: {
		runtime_config: {
			AppUrl: {
				Url
			}
		},
	}
}) => ({
	Url
})

export default connect(mapStateToProps)(withLocalize(SubStore))