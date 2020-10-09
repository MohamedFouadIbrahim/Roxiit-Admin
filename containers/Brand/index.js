import React, { Component } from 'react'
import { ScrollView, Platform, KeyboardAvoidingView } from 'react-native'
import CustomHeader from '../../components/CustomHeader/index.js';
import LazyContainer from '../../components/LazyContainer'
import ItemSeparator from '../../components/ItemSeparator/index.js';
import HorizontalInput from '../../components/HorizontalInput/index.js';
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import ConditionalCircularImage from '../../components/ConditionalCircularImage';
import { largePagePadding } from '../../constants/Style.js';
import { STRING_LENGTH_MEDIUM } from '../../constants/Config';
import { OpenSingleSelectImagePicker, OpenCamera } from '../../utils/Image.js';
import { withLocalize } from 'react-localize-redux';
import { EditBrand, GetBrand } from '../../services/BrandsService.js';
import HeaderSubmitButton from '../../components/HeaderSubmitButton/index.js';
import { mainColor } from '../../constants/Colors.js';
import CustomLoader from '../../components/CustomLoader/index';
import { LongToast } from '../../utils/Toast.js';
import CustomTouchable from '../../components/CustomTouchable';
import CustomSelector from '../../components/CustomSelector';

class Brand extends Component {
	constructor(props) {
		super(props)

		this.state = {
			picker_image_uri: null,
			lockSubmit: false,
			didFetchData: false,
			remoteImage: false
		}

		if (this.props.route.params && this.props.route.params?.Id) {
			this.editMode = true
			this.brandId = this.props.route.params?.Id
		}
		else {
			this.editMode = false
		}

		this.LibraryOrCameraRef = React.createRef();
		this.LibraryOrCameraOptions = [{ Id: 0, Name: 'Camera' }, { Id: 1, Name: 'Library' }]
		this.lockSubmit = false
	}

	componentDidMount() {
		if (this.brandId) {
			this.cancelFetchData = GetBrand(this.brandId, res => {
				this.setState({
					...res.data,
					didFetchData: true,
					remoteImage: true
				})
			})
		}
	}
	componentWillUnmount() {
		this.cancelFetchData && this.cancelFetchData()
		// this.cancelFetchDataEditBrand && this.cancelFetchDataEditBrand()
	}
	submitBrand = () => {
		if (this.lockSubmit) {
			return
		}

		const { Name, ShortDescription, Website, picker_image_uri, ImageData } = this.state

		if (!Name) {
			return LongToast('CantHaveEmptyInputs')
		}

		if (this.editMode) {
			const { Id } = this.state

			this.setState({ lockSubmit: true, uploadingImage: true, prossesEvent: 0 })
			this.lockSubmit = true
			this.cancelFetchDataEditBrand = EditBrand({
				Id,
				Name,
				ShortDescription,
				Description: " ",
				Website: Website ? Website : '',
				Image: ImageData,
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
			this.lockSubmit = true
			this.setState({ lockSubmit: true, uploadingImage: true, prossesEvent: 0 })
			EditBrand({
				Id: 0,
				Name,
				ShortDescription,
				Description: " ",
				Website: Website ? Website : '',
				Image: ImageData,
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

	renderImage = () => {
		const imageSize = 90

		if (this.editMode) {
			const { ImageUrl } = this.state.media
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
							style={{ position: 'absolute', backgroundColor: 'white', borderRadius: 60 }}
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
							style={{ position: 'absolute', backgroundColor: 'white', borderRadius: 60 }}
							progress={this.state.prossesEvent == 0 ? this.state.prossesEvent : this.state.prossesEvent}
						/>
						: null
					}
				</CustomTouchable>
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

	renderContent = () => {
		if (this.state.didFetchData || !this.editMode) {
			return (
				<ScrollView
					contentContainerStyle={{
					}}>
					{this.renderImage()}

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

					<HorizontalInput
						label="Website"
						value={this.state.Website}
						onChangeText={(text) => { this.setState({ Website: text }) }} />
				</ScrollView>
			)
		}
	}

	render() {
		return (
			<LazyContainer style={{ flex: 1, backgroundColor: "#FFF" }}>
				<CustomHeader
					navigation={this.props.navigation}
					title={"Brand"}
					rightComponent={
						<HeaderSubmitButton
							isLoading={this.state.lockSubmit}
							didSucceed={this.state.didSucceed}
							onPress={() => { this.submitBrand() }} />
					} />
				{Platform.OS == 'ios' ?
					<KeyboardAvoidingView behavior='padding' enabled
						style={{ flex: 1 }}
					// keyboardVerticalOffset={40}
					>
						{this.renderContent()}
					</KeyboardAvoidingView> :
					this.renderContent()
				}

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

export default withLocalize(Brand)