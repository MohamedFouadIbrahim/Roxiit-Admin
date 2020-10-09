import React, { Component } from 'react'
import { ScrollView, View, Text, Image, Dimensions } from 'react-native'
import CustomHeader from '../../components/CustomHeader/index.js';
import LazyContainer from '../../components/LazyContainer'
import ItemSeparator from '../../components/ItemSeparator/index.js';
import HorizontalInput from '../../components/HorizontalInput/index.js';
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import CircularImage from '../../components/CircularImage/index.js';
import ConditionalRemoteImage from '../../components/ConditionalRemoteImage';
import { largePagePadding } from '../../constants/Style.js';
import { showImagePicker, OpenSingleSelectImagePicker, OpenCamera } from '../../utils/Image.js';
import { withLocalize } from 'react-localize-redux';
import HeaderSubmitButton from '../../components/HeaderSubmitButton/index.js';
import { mainColor, secondColor } from '../../constants/Colors.js';
import ArrowItem from '../../components/ArrowItem/index.js';
import CustomSelector from '../../components/CustomSelector/index.js';
import { GetStory, AddEditStory } from '../../services/StoriesService.js';
import { STRING_LENGTH_LONG } from '../../constants/Config';
import { ColorPicker, fromHsv } from 'react-native-color-picker'
import Modal from "react-native-modal";
import TranslatedText from '../../components/TranslatedText/index.js';
import CustomLoader from '../../components/CustomLoader/index';
import { LongToast } from '../../utils/Toast.js';
import CustomColorModal from '../../components/CustomColorModal';
import CustomTouchable from '../../components/CustomTouchable';

class Story extends Component {
	constructor(props) {
		super(props)

		this.lengthSelectorRef = React.createRef();

		const { translate } = this.props

		this.videoLengths = [
			{
				length: 12,
				text: `12 ${translate('Hours')}`
			},
			{
				length: 24,
				text: `24 ${translate('Hours')}`
			},
			{
				length: 72,
				text: `3  ${translate('Days')}`
			},
			{
				length: 168,
				text: `1  ${translate('Weeks')}`
			}
		]

		this.state = {
			picker_image_uri: null,
			lockSubmit: false,
			didFetchData: false,
			colorPickerShown: false,
			LengthInHours: this.videoLengths[1].length,
			TextColor: '#FFDF00',
			BackgroundColor: '#FF0000',
			remoteImage: false,
			screenWidth: Dimensions.get('screen').width,
			screenHeight: Dimensions.get('screen').height,
		}

		if (this.props.route.params? && this.props.route.params?.Id) {
			this.editMode = true
			this.storyId = this.props.route.params?.Id
		}
		else {
			this.editMode = false
		}

		this.lockSubmit = false

		this.LibraryOrCameraRef = React.createRef();
		this.LibraryOrCameraOptions = [{ Id: 0, Name: 'Camera' }, { Id: 1, Name: 'Library' }]

	}

	componentDidMount() {
		this.fetchData()
		//re render when change orientation
		Dimensions.addEventListener('change', () => {
			this.setState({
				screenWidth: Dimensions.get('screen').width,
				screenHeight: Dimensions.get('screen').height,
			})
		})

	}
	componentWillUnmount() {
		this.cancelFetchData && this.cancelFetchData()
		this.cancelFetchDataAddEditStory && this.cancelFetchDataAddEditStory()
	}
	fetchData = () => {
		if (this.storyId) {
			this.cancelFetchData = GetStory(this.storyId, res => {
				this.setState({
					...res.data,
					didFetchData: true,
					remoteImage: true
				})
			})
		}
	}
	renderColorModal = () => (
		<Modal onBackdropPress={() => this.setState({ colorPickerShown: false })} isVisible={this.state.colorPickerShown}>

			<View style={{ width: this.state.screenWidth * .9, alignSelf: "center", paddingBottom: 35, backgroundColor: "#FFF", borderRadius: 10, overflow: "hidden", alignItems: "center", justifyContent: "center" }}>


				<ColorPicker
					// onColorChange={color => this.setState({ color: fromHsv(color) })}
					onColorChange={color => {
						if (this.editingTextColor) {
							this.setState({ TextColor: fromHsv(color) })
						}
						else {
							this.setState({ BackgroundColor: fromHsv(color) })
						}
					}}
					hideSliders={false}
					color={this.editingTextColor ? this.state.TextColor : this.state.BackgroundColor}
					defaultColor={this.state.color}
					style={{ width: 150, height: 150, marginVertical: 30 }}
				/>
				<View style={{ flexDirection: "row", position: "absolute", bottom: -.5, justifyContent: "center", alignItems: "center" }}>
					<CustomTouchable onPress={() => this.setState({ colorPickerShown: false })} style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: secondColor, }}>
						<TranslatedText style={{ color: "#FFF", padding: 10, paddingVertical: 15 }} text={'Done'} />
					</CustomTouchable>
				</View>
			</View>
		</Modal>
	)
	submit = () => {
		if (this.lockSubmit) {
			return
		}

		const {
			Text,
			LengthInHours,
			TextColor,
			BackgroundColor,
			picker_image_uri,
			ImageData
		} = this.state

		if (!Text || !LengthInHours || !TextColor || !BackgroundColor) {
			return LongToast('CantHaveEmptyInputs')
		}

		if (this.editMode) {
			this.setState({ lockSubmit: true, uploadingImage: true, prossesEvent: 0 })
			this.lockSubmit = true
			this.cancelFetchDataAddEditStory = AddEditStory({
				Id: this.storyId,
				Text,
				LengthInHours,
				TextColor,
				BackgroundColor,
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
			if (!picker_image_uri || !ImageData) {
				return LongToast('ImageRequired')
			}

			this.setState({ lockSubmit: true, lockSubmit: true, uploadingImage: true, prossesEvent: 0 })
			this.lockSubmit = true

			this.cancelFetchDataAddEditStory = AddEditStory({
				Id: 0,
				Text,
				LengthInHours,
				TextColor,
				BackgroundColor,
				Image: ImageData,
			}, res => {
				this.setState({ didSucceed: true, uploadingImage: true, prossesEvent: 0 })
				this.props.route.params?.onChildChange && this.props.route.params?.onChildChange()
				this.props.navigation.goBack()
			}, err => {
				this.setState({ lockSubmit: false })
				this.lockSubmit = false
			}, (re) => {
				this.setState({ prossesEvent: re * 0.01 })
			})
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

	renderImage = () => {
		const imageSize = 90

		if (this.editMode) {
			const { ImageUrl } = this.state.Media
			const { picker_image_uri } = this.state

			return (
				<CustomTouchable
					onPress={() => {
						showImagePicker((Data) => {
							if (Data) {
								const { uri, path } = Data
								this.setState({ picker_image_uri: uri, ImageData: path })
							}
							// this.setState({ picker_image_uri: uri })
						})
					}}
					style={{
						alignSelf: 'center',
						justifyContent: 'center',
						alignItems: 'center',
						margin: largePagePadding,
					}}>
					<ConditionalRemoteImage
						remote={this.state.remoteImage}
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
							progress={this.state.prossesEvent == 0 ? this.state.prossesEvent : this.state.prossesEvent}
						/>
						: null
					}
				</CustomTouchable>
			)
		}
		else {
			const { picker_image_uri } = this.state

			return (
				<CustomTouchable
					onPress={() => {
						showImagePicker((Data) => {
							if (Data) {
								const { uri, path } = Data
								this.setState({ picker_image_uri: uri, ImageData: path })
							}
						})
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
					{picker_image_uri ? <ConditionalRemoteImage
						remote={this.state.remoteImage}
						uri={picker_image_uri}
						size={imageSize} /> : <Ionicons
							name={`ios-add`}
							size={45}
							color={'white'} />}

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
	}

	// renderColorPicker = () => {
	// 	const {
	// 		TextColor,
	// 		BackgroundColor,
	// 	} = this.state

	// 	return (
	// 		<CustomModal
	// 			isVisible={this.state.colorPickerShown}
	// 			onClose={() => {
	// 				this.setState({ colorPickerShown: false })
	// 			}}
	// 			closeButton={true}
	// 			swipeDirection={null}>
	// 			<ColorPicker
	// 				onColorChange={color => {
	// 					if (this.editingTextColor) {
	// 						this.setState({ TextColor: fromHsv(color) })
	// 					}
	// 					else {
	// 						this.setState({ BackgroundColor: fromHsv(color) })
	// 					}
	// 				}}
	// 				hideSliders={false}
	// 				color={this.editingTextColor ? TextColor : BackgroundColor}
	// 				defaultColor={'yellow'}
	// 				style={{ width: 250, height: 250, marginVertical: 10 }}
	// 			/>
	// 		</CustomModal>
	// 	)
	// }

	renderContent = () => {
		if (this.state.didFetchData || !this.editMode) {
			const { translate } = this.props
			const {
				Text,
				LengthInHours,
				TextColor,
				BackgroundColor,
			} = this.state

			return (
				<ScrollView
					contentContainerStyle={{
					}}>
					{this.renderImage()}

					<HorizontalInput
						maxLength={STRING_LENGTH_LONG}
						label="Text"
						value={Text}
						onChangeText={(text) => { this.setState({ Text: text }) }} />

					<ItemSeparator />

					<ArrowItem
						onPress={() => {
							this.lengthSelectorRef.current.show()
						}}
						title={'Length'}
						info={`${LengthInHours} ${translate('Hours')}`} />

					<ItemSeparator />

					<ArrowItem
						onPress={() => {
							this.editingTextColor = true
							this.setState({ colorPickerShown: true })
						}}
						title={'TextColor'}
						// rightComponent={<View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: TextColor }} />} 
						rightComponent={
							<View>
								<Image source={require('../../assets/images/productOptions/wheel-5-ryb.png')} style={{ width: 30, height: 30, borderRadius: 15 }} />
								<View style={{ backgroundColor: TextColor, width: 20, height: 20, borderRadius: 10, left: 5, top: 5, position: "absolute" }}></View>
							</View>
						}
					/>

					<ItemSeparator />

					<ArrowItem
						onPress={() => {
							this.editingTextColor = false
							this.setState({ colorPickerShown: true })
						}}
						title={'BackgroundColor'}
						//rightComponent={<View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: BackgroundColor }} />} 
						rightComponent={
							<View>
								<Image source={require('../../assets/images/productOptions/wheel-5-ryb.png')} style={{ width: 30, height: 30, borderRadius: 15 }} />
								<View style={{ backgroundColor: BackgroundColor, width: 20, height: 20, borderRadius: 10, left: 5, top: 5, position: "absolute" }}></View>
							</View>
						}
					/>
				</ScrollView>
			)
		}
	}

	render() {
		return (
			<LazyContainer style={{ flex: 1, backgroundColor: "#FFF" }}>
				<CustomHeader
					navigation={this.props.navigation}
					title={"Story"}
					rightComponent={
						<HeaderSubmitButton
							isLoading={this.state.lockSubmit}
							didSucceed={this.state.didSucceed}
							onPress={() => { this.submit() }} />
					} />

				{this.renderContent()}



				<CustomSelector
					ref={this.lengthSelectorRef}
					options={this.videoLengths.map(item => item.text)}
					onSelect={(index) => {
						this.setState({
							LengthInHours: this.videoLengths[index].length
						})
					}}
					onDismiss={() => { }}
				/>

				<CustomColorModal
					onBackdropPress={() => { this.setState({ colorPickerShown: false }) }}
					onChangeText={(te) => {
						if (this.editingTextColor) {
							this.setState({ TextColor: te })
						}
						else {
							this.setState({ BackgroundColor: te })
						}
					}}
					value={this.editingTextColor ? this.state.TextColor : this.state.BackgroundColor}
					onColorChange={color => {
						if (this.editingTextColor) {
							this.setState({ TextColor: fromHsv(color) })
						}
						else {
							this.setState({ BackgroundColor: fromHsv(color) })
						}
					}}
					isVisible={this.state.colorPickerShown}
					onDonepress={() => { this.setState({ colorPickerShown: false }) }}
					defaultColor={mainColor}
				/>

				{/* {this.renderColorModal()} */}

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

export default withLocalize(Story)