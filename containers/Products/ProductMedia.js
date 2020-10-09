import React, { Component } from 'react'
import { View } from 'react-native'
import LazyContainer from '../../components/LazyContainer'
import FontedText from '../../components/FontedText/index.js';
import RemoteDataContainer from '../../components/RemoteDataContainer/index.js';
import CircularImage from '../../components/CircularImage/index.js';
import DeleteButton from '../../components/DeleteButton/index.js';
import { largePagePadding, pagePadding, shadowStyle1 } from '../../constants/Style.js';
import { secondTextColor } from '../../constants/Colors';
import ItemSeparator from '../../components/ItemSeparator/index.js';
import Ionicons from 'react-native-vector-icons/Ionicons'
import SearchBar from '../../components/SearchBar/index.js';
import { withLocalize } from 'react-localize-redux';
import { getFilters } from '../../services/FilterService.js';
import CustomSelector from '../../components/CustomSelector/index.js';
import { EventRegister } from 'react-native-event-listeners'
import { DeleteProductMedia, ReorderProductMedia, AddProductMedia } from '../../services/ProductService.js';
import { OpenMultiSelectImagePicker, OpenCamera } from '../../utils/Image.js';
import CustomSelectorForDeleteAndEdit from '../../components/CustomSelectorForDeleteAndEdit/index';
import CustomModal from '../../components/LoadingModal/index';
import RoundedCloseButton from '../../components/RoundedCloseButton/index.js';
import CustomLoader from '../../components/CustomLoader/index';
import { LongToast } from '../../utils/Toast';
import CustomTouchable from '../../components/CustomTouchable';

class ProductMedia extends Component {
	constructor() {
		super()

		this.state = {
			data: null,
			triggerRefresh: false,
			searchBarShown: false,
			searchingFor: '',
			isPopupVisible: false,
			showCustomSelectorForDeleteref: false,
			Loading: false,
			uploadingImg: false,
			ProsessEvent: 0
		}

		this.typeSelectorRef = React.createRef();
		this.LibraryOrCameraRef = React.createRef();
		this.LibraryOrCameraOptions = [{ Id: 0, Name: 'Camera' }, { Id: 1, Name: 'Library' }]
		this.uploadMediaListener = EventRegister.addEventListener('uploadMedia', (uploadMedia) => {
			// this.uploadMedia()
			this.LibraryOrCameraRef.current.show()
		})

		this.listener = EventRegister.addEventListener('currentPost', (currentPost) => {
			if (currentPost == '6') {
				this.onChildChange();
				// EventRegister.emit('submitting', true)
			}
		})
	}

	componentWillUnmount() {
		EventRegister.removeEventListener(this.listener)
		EventRegister.removeEventListener(this.uploadMediaListener)
		this.cancelFetchDatagetFilters && this.cancelFetchDatagetFilters()
		this.cancelFetchDataDeleteProductMedia && this.cancelFetchDataDeleteProductMedia()
		this.cancelFetchDataAddProductMedia && this.cancelFetchDataAddProductMedia()
		// this.cancelFetchDataReorderProductMedia && this.cancelFetchDataReorderProductMedia()
	}

	componentDidMount() {
		this.cancelFetchDatagetFilters = getFilters({
			articleTypes: true,
		}, res => {
			const {
				ArticleTypes,
			} = res.data
			this.setState({
				ArticleTypes,
			})
		})
	}

	renderItem = ({ item, index, drag, isActive }) => {
		const { productId, Media: { ImageUrl, Name, Alt, Id } } = item

		return (
			<CustomTouchable
				onLongPress={() => {
					this.productId = productId
					this.imageId = Id
					this.setState({ showCustomSelectorForDeleteref: true })

				}}
			>
				<View
					style={{
						backgroundColor: isActive ? '#cccccc' : 'white',
						flexDirection: 'row',
						justifyContent: 'space-between',
						paddingHorizontal: largePagePadding,
						paddingVertical: pagePadding,
					}}>
					<View
						style={{
							flex: 1,
							flexDirection: 'row',
						}}>
						<CircularImage
							uri={ImageUrl} id={index} />

						<View
							style={{
								flex: 1,
								paddingLeft: largePagePadding,
							}}>
							<FontedText style={{ color: 'black', marginHorizontal: 8 }}>{Name}</FontedText>
							{Alt ? <FontedText style={{
								// color: '#949EA5'
								color: secondTextColor
							}}>{Alt}</FontedText> : null}
						</View>
					</View>

					<CustomTouchable
						onLongPress={drag}
						style={{
							padding: 10,
						}}>
						<Ionicons
							name={`ios-menu`}
							size={28}
							// color={'#949EA5'}
							color={secondTextColor}
						/>
					</CustomTouchable>
				</View>
			</CustomTouchable>
		)
	}

	renderDeletebutton = (item) => {
		const { productId, Media: { Id } } = item

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
						DeleteProductMedia({ productId, imageId: Id }, () => {
							this.setState({
								data: this.state.data.filter(filterItem => filterItem.Media.Id !== Id),
							})
						})
					}} />
			</View>
		)
	}

	onChildChange = () => {
		this.setState({ triggerRefresh: !this.state.triggerRefresh })
	}

	addParamsSeparator = (params) => {
		return params.length ? '&' : ''
	}

	getRequestParams = () => {
		return `productId=${this.props.ProductId}`
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

	onSelectArticleType = (index) => {
		if (index === 0) {
			this.setState({ Type: null })
		}
		else {
			const { ArticleTypes } = this.state
			this.setState({ Type: ArticleTypes[index - 1] })
		}
	}

	onDataReordered = (data) => {
		this.cancelFetchDataReorderProductMedia = ReorderProductMedia(this.props.ProductId, data.map(item => item.Media.Id), (res) => {

		})
	}
	onCloseButtonPress = () => {
		this.cancelFetchDataDeleteProductMedia && this.cancelFetchDataDeleteProductMedia()
		this.setState({ uploadingImg: false, ProsessEvent: 0 })
	}

	AddEditImage = (chosseindex) => {
		if (chosseindex == 0) {
			this.uploadMediaByCamera()
		} else {
			this.uploadMedia()
		}
	}

	uploadMediaByCamera = () => {
		OpenCamera((imags) => {

			if (imags) {

				const { path } = imags
				const d = {
					...imags,
					picker_image_uri: path,
					picker_image_Path: path,
				}

				EventRegister.emit('submitting', true)
				this.setState({ uploadingImg: true, ProsessEvent: 0 })
				const element = { ...imags, picker_image_Path: imags.path }

				this.cancelFetchDataAddProductMedia = AddProductMedia({ Images: [d], productId: this.props.ProductId }, (res) => {
					EventRegister.emit('submitting', false)
					EventRegister.emit('currentPost', '6')
					this.setState({ uploadingImg: false, ProsessEvent: 0 })
				}, (err) => {

					this.setState({ uploadingImg: false, ProsessEvent: 0 })
				}, (pros) => {
					this.setState({ uploadingImg: true, ProsessEvent: pros * 0.01 })
				})
			}

		})

	}
	uploadMedia = () => {
		const { data } = this.state
		OpenMultiSelectImagePicker(imags => {

			if (imags && imags.length) {
				const NewImage = imags.map((item, index) => ({
					...item,
					Id: index,
					picker_image_uri: item.path,
					picker_image_Path: item.path,
					IsLoading: false,
					prossesEvent: 0
				}))

				EventRegister.emit('submitting', true)
				this.setState({ uploadingImg: true, ProsessEvent: 0 })

				this.cancelFetchDataAddProductMedia = AddProductMedia({ Images: NewImage, productId: this.props.ProductId }, (res) => {
					EventRegister.emit('submitting', false)
					EventRegister.emit('currentPost', '6')
					this.setState({ uploadingImg: false, ProsessEvent: 0 })
				}, (err) => {
					this.setState({ uploadingImg: false, ProsessEvent: 0 })
				}, (pros) => {
					this.setState({ uploadingImg: true, ProsessEvent: pros * 0.01 })
				})

			}

		})
	}
	// uploadMedia = () => {
	// 	showImagePicker((Data) => {

	// 		if (Data) {
	// 			const { uri, path } = Data
	// 			EventRegister.emit('submitting', true)
	// 			this.setState({ uploadingImg: true, ProsessEvent: 0 })
	// 			this.cancelFetchDataAddProductMedia = AddProductMedia({ Image: path, productId: this.props.ProductId }, (res) => {
	// 				EventRegister.emit('submitting', false)
	// 				EventRegister.emit('currentPost', '6')
	// 				this.setState({ uploadingImg: false, ProsessEvent: 0 })
	// 			}, (err) => {
	// 				this.setState({ uploadingImg: false, ProsessEvent: 0 })
	// 			}, (pros) => {
	// 				this.setState({ uploadingImg: true, ProsessEvent: pros * 0.01 })
	// 			})
	// 		}
	// 	})
	// }
	render() {
		const { ArticleTypes, Type } = this.state
		const { translate, scrollOffset } = this.props
		// if (this.state.uploadingImg) {
		// 	return ()
		// }
		return (
			<LazyContainer style={{ flex: 1, backgroundColor: "#FFF", }}>


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

						this.cancelFetchDataDeleteProductMedia = DeleteProductMedia({ productId: this.productId, imageId: this.imageId }, () => {
							this.setState({
								data: this.state.data.filter(filterItem => filterItem.Media.Id !== this.imageId),
								showCustomSelectorForDeleteref: false,
								Loading: false
							})
							LongToast('dataDeleted')
						}, () => {
							this.setState({ Loading: false })
						})
					}}
				/>
				{this.state.uploadingImg == true ?
					<CustomModal
						visible={this.state.uploadingImg}
						contentContainerStyle={{ ...shadowStyle1, }}
					>

						<View style={{ position: 'absolute', right: 10, top: 10 }} >
							<RoundedCloseButton onPress={() => { this.onCloseButtonPress() }} />
						</View>

						<CustomLoader
							style={{ backgroundColor: 'white', borderRadius: 60, position: 'relative' }}
							size={100}
							progress={this.state.prossesEvent == 0 ? this.state.ProsessEvent : this.state.ProsessEvent}
						/>

					</CustomModal> : null}

				<CustomSelector
					ref={this.LibraryOrCameraRef}
					options={this.LibraryOrCameraOptions.map(item => item.Name)}
					onSelect={(chosseindex) => {
						this.AddEditImage(chosseindex)
					}}
					onDismiss={() => { }}
				/>

				<RemoteDataContainer
					url={"Product/Images"}
					params={this.getRequestParams()}
					cacheName={"productimages"}
					draggable={true}
					onMoveEnd={({ data }) => { this.onDataReordered(data) }}
					onDataFetched={(data) => {
						this.setState({ data })
					}}
					updatedData={this.state.data}
					triggerRefresh={this.state.triggerRefresh}
					keyExtractor={({ Media }) => `draggable-item-${Media.Id}`}
					ItemSeparatorComponent={() => <ItemSeparator />}
					renderItem={this.renderItem} />

				{ArticleTypes && <CustomSelector
					ref={this.typeSelectorRef}
					options={[
						translate('NoneSelected'),
						...ArticleTypes.map(item => item.Name)
					]}
					onSelect={(index) => { this.onSelectArticleType(index) }}
					onDismiss={() => { }}
				/>}
			</LazyContainer>
		)
	}
}

export default withLocalize(ProductMedia)