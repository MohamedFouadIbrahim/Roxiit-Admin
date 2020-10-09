import React, { Component } from 'react'
import { ScrollView, View, ActivityIndicator, TextInput, Linking, Dimensions } from 'react-native'
import DocumentPicker from 'react-native-document-picker';
import LazyContainer from '../../components/LazyContainer'
import ItemSeparator from '../../components/ItemSeparator/index.js';
import TranslatedText from '../../components/TranslatedText/index.js';
import { withLocalize } from 'react-localize-redux';
import { GetProductFiles, EditProductFiles, uploadProductFile, DeleteProductDemoFile, DeleteProductPurchaseFile } from '../../services/ProductService.js';
import { EventRegister } from 'react-native-event-listeners'
import Feather from 'react-native-vector-icons/Feather';
import ArrowItem from '../../components/ArrowItem/index.js';
import CustomSelectorForDeleteAndEdit from '../../components/CustomSelectorForDeleteAndEdit/index';
import CustomTouchable from '../../components/CustomTouchable';
import DeleteButton from '../../components/DeleteButton/index.js';
import { mainTextColor, secondColor, secondTextColor } from '../../constants/Colors';
import { screenHeight } from '../../constants/Metrics.js';
import { TrimText } from '../../utils/Text';
import { LongToast } from '../../utils/Toast';

class ProductFiles extends Component {
	constructor(props) {
		super(props)
		this.state = {
			didFetchData: false,
			productSettings: null,
			Categories: null,
			Etags: null,
			selectedBrand: null,
			selectedGender: null,
			selectedCategories: [],
			selectedEtags: [],

			ProductFile: null,
			selectedFile_0: null,
			selectedFile_1: null,
			uploadingFile_0: false,
			uploadingFile_1: false,
			showCustomSelectorForDeleteref: false,
			Loading: false,
			screenWidth: Dimensions.get('screen').width,
			screenHeight: Dimensions.get('screen').height,
		}
		this.availableBrandsRef = React.createRef()
		this.availableGendersRef = React.createRef()

		this.listener = EventRegister.addEventListener('currentPost', (currentPost) => {
			if (currentPost == '5') {
				this.submitFileInfo()
				EventRegister.emit('submitting', true)
			}
		})
	}

	componentDidMount() {
		this.fetchFileInfo();

		//re render when change orientation
		Dimensions.addEventListener('change', () => {
			this.setState({
				screenWidth: Dimensions.get('screen').width,
				screenHeight: Dimensions.get('screen').height,
			})
		})
	}

	fetchFileInfo = () => {
		this.setState({ didFetchData: false })
		this.cancelFetchDataGetProductFiles = GetProductFiles(this.props.ProductId, res => {
			this.setState({ ProductFile: res.data, didFetchData: true, selectedFile_0: null, selectedFile_1: null })
		})
	}

	componentWillUnmount() {
		EventRegister.removeEventListener(this.listener)
		this.cancelFetchDataGetProductFiles && this.cancelFetchDataGetProductFiles()
		this.cancelFetchDataEditProductFiles && this.cancelFetchDataEditProductFiles()
		this.cancelFetchDatauploadProductFile && this.cancelFetchDatauploadProductFile()
		this.cancelFetchDataDeleteProductDemoFile && this.cancelFetchDataDeleteProductDemoFile()
		this.cancelFetchDataDeleteProductPurchaseFile && this.cancelFetchDataDeleteProductPurchaseFile()
	}

	pickFile = async (fileType) => {

		var productId = this.props.ProductId
		DocumentPicker.pick({
			type: [DocumentPicker.types.allFiles]
		}, (error, res) => {
			if (res) {
				fileType == 0 ? this.setState({ selectedFile_0: res, uploadingFile_0: true }) : this.setState({ selectedFile_1: res, uploadingFile_1: true })
				res.fileType = res.fileName.slice(res.fileName.lastIndexOf('.')).replace('.', "")
				const { status, errMsg } = this.validateFile(res)
				if (status == 200) {
					this.cancelFetchDatauploadProductFile = uploadProductFile({ file: res, productId, fileType }, res => {
						fileType == 0 ? this.setState({ uploadingFile_0: false, ProductFile: { ...this.state.ProductFile, DemoFile: null } }) : this.setState({ uploadingFile_1: false, ProductFile: { ...this.state.ProductFile, PurchaseFile: null } })
						LongToast('dataSaved')
					})
				} else {
					LongToast(errMsg, false)
				}
			}
		});

	}
	validateFile = (file) => {
		const { translate } = this.props
		var supportedFileTypes = ["pdf", "jpg", "png", "jpeg", "xlsx", "xls", "gif", "txt", "mp3", "wav", "doc", "docx", "ppt", "pptx", "pps", "avi", "flv", "mov"]
		if (supportedFileTypes.includes(file.fileType) == false) {
			this.setState({ uploadingFile_0: false, uploadingFile_1: false, selectedFile_0: null, selectedFile_1: null })
			return { errMsg: translate("filetypenotsupported"), status: 400 }
		}
		else if (file.size > 10000) {
			this.setState({ uploadingFile_0: false, uploadingFile_1: false, selectedFile_0: null, selectedFile_1: null })
			return { errMsg: translate("exceededfilesizelimit"), status: 400 }
		}
		else
			return { status: 200 }

	}
	downloadFile = (url) => {
		Linking.canOpenURL(url).then(supported => {
			if (supported) {
				Linking.openURL(url);
			} else {
				LongToast('cantdownload', false)
			}
		});
	}

	submitFileInfo = () => {
		const { Id, AllowedNumberOfDaysForDownload, AllowedNumberOfDownloads } = this.state.ProductFile
		this.cancelFetchDataEditProductFiles = EditProductFiles({
			Id,
			AllowedNumberOfDaysForDownload,
			AllowedNumberOfDownloads
		}, res => {
			LongToast('dataSaved')
			EventRegister.emit('submitting', false)
		}, err => {
			EventRegister.emit('submitting', false)
		})
	}

	renderDeletebutton = (type) => {
		// const { Id } = item
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
						if (type == 0)
							this.deleteDemoFile()
						else
							this.deletePurchaseFile()
					}} />
			</View>
		)
	}

	deleteDemoFile = (onSucess, onFail) => {
		this.cancelFetchDataDeleteProductDemoFile = DeleteProductDemoFile(this.props.ProductId, res => {
			this.fetchFileInfo();
			onSucess()
		}, () => {
			onFail()
		})
	}

	deletePurchaseFile = (onSucess, onFail) => {
		this.cancelFetchDataDeleteProductPurchaseFile = DeleteProductPurchaseFile(this.props.ProductId, res => {
			this.fetchFileInfo();
			onSucess()
		}, () => {
			onFail()
		})
	}

	renderContent = () => {
		const { translate } = this.props
		const { ProductFile, selectedFile_0, selectedFile_1, uploadingFile_0, uploadingFile_1 } = this.state
		if (this.state.didFetchData) {
			return (
				<ScrollView
					contentContainerStyle={{
					}}>
					<View
						activeOpacity={0.8}
						style={[{
							paddingVertical: 15,
							paddingHorizontal: 20,
							flexDirection: 'row',
							justifyContent: 'space-between',
							alignItems: 'center',
							backgroundColor: 'white',
						}]}>
						<View
							style={{
								justifyContent: 'center',
							}}>
							<TranslatedText style={{
								color: secondTextColor
								// color: '#949EA5'
							}} text={"Numberofdownloadsperday"} />
						</View>

						<View
							style={{
								flexDirection: 'row',
								alignItems: 'center',
								paddingLeft: 10,
								paddingHorizontal: 20
							}}>
							<TextInput placeholder="Number" keyboardType="numeric" onChangeText={(txt) => this.setState({ ProductFile: { ...this.state.ProductFile, AllowedNumberOfDaysForDownload: txt } })} value={this.state.ProductFile.AllowedNumberOfDaysForDownload ? String(this.state.ProductFile.AllowedNumberOfDaysForDownload) : null} style={{ textAlign: 'right' }} />
						</View>
					</View>
					<ItemSeparator />
					<View
						activeOpacity={0.8}
						style={[{
							paddingVertical: 15,
							paddingHorizontal: 20,
							flexDirection: 'row',
							justifyContent: 'space-between',
							alignItems: 'center',
							backgroundColor: 'white',
						}]}>
						<View
							style={{
								justifyContent: 'center',
							}}>
							<TranslatedText style={{
								// color: '#949EA5'
								color: secondTextColor
							}} text={"Numberofdaysdownloadavailable"} />
						</View>

						<View
							style={{
								flexDirection: 'row',
								alignItems: 'center',
								paddingLeft: 10,
								paddingHorizontal: 20
							}}>
							<TextInput placeholder="Number" keyboardType="numeric" onChangeText={(txt) => this.setState({ ProductFile: { ...this.state.ProductFile, AllowedNumberOfDownloads: txt } })} value={this.state.ProductFile.AllowedNumberOfDownloads ? String(this.state.ProductFile.AllowedNumberOfDownloads) : null} style={{ textAlign: 'right' }} />
						</View>
					</View>
					<ItemSeparator />

					<CustomTouchable
						onLongPress={() => {
							this.type = 0
							this.setState({ showCustomSelectorForDeleteref: true })
						}}
					>
						<View
							style={{
								backgroundColor: 'white',
								flexDirection: 'row',
								justifyContent: 'space-between',
								// paddingHorizontal: largePagePadding,
								// paddingVertical: pagePadding,
							}}>
							<ArrowItem
								style={{ width: "100%" }}
								onPress={() => {
									if (this.state.showCustomSelectorForDeleteref == true) {
										return
									}
									if (ProductFile.DemoFile) {
										this.downloadFile(ProductFile.DemoFile.FileUrl)
										return
									} else if (!uploadingFile_0) {
										this.pickFile(0)
									}
								}}
								customIcon={() => (
									<View style={{ flexDirection: 'row', }}>
										{
											ProductFile.DemoFile ?
												<Feather name="download-cloud" style={{ marginRight: 30 }} size={20}
													// color={'#3B3B4D'}
													color={mainTextColor}
												/>
												:
												null
										}
										{
											uploadingFile_0 ?
												<ActivityIndicator color={secondColor} />
												:
												<Feather name="upload" style={{}} size={20}
													// color={'#3B3B4D'}
													color={mainTextColor}
												/>
										}
									</View>
								)}
								subtitle={`${selectedFile_0 ? TrimText(selectedFile_0.fileName, 40) : ProductFile.DemoFile ? TrimText(ProductFile.DemoFile.Name, 40) : ""}`}
								title={`Demofile`} />
						</View>
					</CustomTouchable>

					<ItemSeparator />

					<CustomTouchable
						onLongPress={() => {
							this.type = 1
							this.setState({ showCustomSelectorForDeleteref: true })
						}}
					>
						<View
							style={{
								backgroundColor: 'white',
								flexDirection: 'row',
								justifyContent: 'space-between',
								// paddingHorizontal: largePagePadding,
								// paddingVertical: pagePadding,
							}}>
							<ArrowItem
								style={{ width: "100%" }}
								onPress={() => {
									if (this.state.showCustomSelectorForDeleteref == true) {
										return
									}
									if (ProductFile.PurchaseFile) {
										this.downloadFile(ProductFile.PurchaseFile.FileUrl)
										return
									} else if (!uploadingFile_1) {
										this.pickFile(1)
									}
								}}
								customIcon={() => (
									<View style={{ flexDirection: 'row', }}>
										{
											ProductFile.PurchaseFile ?
												<Feather name="download-cloud" style={{ marginRight: 30 }} size={20}
													// color={'#3B3B4D'}
													color={mainTextColor}
												/>
												:
												null
										}
										{
											uploadingFile_1 ?
												<ActivityIndicator color={secondColor} />
												:
												<Feather name="upload" style={{}} size={20}
													// color={'#3B3B4D'}
													color={mainTextColor}
												/>
										}
									</View>
								)}
								subtitle={`${selectedFile_1 ? TrimText(selectedFile_1.fileName, 40) : ProductFile.PurchaseFile ? TrimText(ProductFile.PurchaseFile.Name, 40) : ""}`}
								title={'Purchasefile'} />
						</View>
					</CustomTouchable>
					<ItemSeparator />

				</ScrollView>
			)
		} else {
			return (
				<View style={{ flex: 1, minHeight: this.state.screenHeight / 2, alignItems: 'center', justifyContent: 'center' }}>
					<ActivityIndicator color={secondColor} />
				</View>
			)
		}
	}

	render() {
		const { productSettings } = this.state
		const { translate } = this.props
		return (
			<LazyContainer style={{ flex: 1, backgroundColor: "#FFF", }}>
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

						if (this.type == 0) {
							this.deleteDemoFile(() => {
								this.setState({
									showCustomSelectorForDeleteref: false,
									Loading: false
								})
								LongToast('dataDeleted')
							}, () => {
								this.setState({ Loading: false })
							})
						} else {
							this.deletePurchaseFile(() => {
								this.setState({
									showCustomSelectorForDeleteref: false,
									Loading: false
								})
								LongToast('dataDeleted')
							}, () => {
								this.setState({ Loading: false })
							})
						}
					}}
				/>
			</LazyContainer>
		)
	}
}

export default withLocalize(ProductFiles)