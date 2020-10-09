import React, { Component } from 'react'
import { View, ActivityIndicator, Text, ImageBackground, ScrollView, I18nManager, Dimensions } from 'react-native'
import LazyContainer from '../../components/LazyContainer'
import ItemSeparator from '../../components/ItemSeparator/index.js';
import Ionicons from 'react-native-vector-icons/Ionicons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import TranslatedText from '../../components/TranslatedText/index.js';
import { withLocalize } from 'react-localize-redux';
import { DeleteProductPriceStep, GetProductHome, EditProductStatus, EditProductVisibility, onAccept, onDecline, AcceptValidityExtendRequest } from '../../services/ProductService.js';
import { mainColor, mainTextColor, secondTextColor } from '../../constants/Colors.js';
import DeleteButton from '../../components/DeleteButton/index.js';
import FontedText from '../../components/FontedText';
import { numeral } from '../../utils/numeral';
import { pagePadding, largeBorderRadius, largePagePadding, shadowStyle0 } from '../../constants/Style';
import { getFilters } from '../../services/FilterService';
import CustomSelector from '../../components/CustomSelector';
import LinearGradient from 'react-native-linear-gradient';
import CircularImage from '../../components/CircularImage';
import { LongToast } from '../../utils/Toast';
import CustomTouchable from '../../components/CustomTouchable';
import { connect } from 'react-redux';
import QR from '../../components/QRCode';
import { SaveImge } from '../../utils/Image';
import CustomButton from '../../components/CustomButton';
import Modal from 'react-native-modal';
import HorizontalInput from '../../components/HorizontalInput';
import { ExternalTranslate } from '../../utils/Translate';
import { IsScreenPermitted } from '../../utils/Permissions';
import { formatDate } from '../../utils/Date';
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import { DeleteValidityExtend } from '../../services/ProductService.js';
import CustomAddModal from '../../components/CustomAddModal';


require('datejs')

class ProductPricing extends Component {
	constructor(props) {
		super(props)
		this.state = {
			didFetchData: false,
			isDateTimePickerVisible: false,
			PricingHistory: [],
			isPriceModalVisible: false,
			stepPrice: null,
			LowStep: null,
			HighStep: null,
			priceStepErr: null,
			buttonLoading: false,
			ProductOptions: [],
			refresh: false,
			showPadding: true,
			showModal: false,
			note: '',
			ExtendForDays: null,
			showValidityExtendModal: false,
			screenWidth: Dimensions.get('screen').width,
			screenHeight: Dimensions.get('screen').height,
		}

		if (IsScreenPermitted('SubStoreProfile')) {
			this.substoreOptions = [
				{
					Id: 0,
					Name: ExternalTranslate('Profile')
				},
				{
					Id: 1,
					Name: ExternalTranslate('Users')
				},
				{
					Id: 2,
					Name: ExternalTranslate('Products')
				}
			]
		}
		else {
			this.substoreOptions = [
				{
					Id: 1,
					Name: ExternalTranslate('Users')
				},
				{
					Id: 2,
					Name: ExternalTranslate('Products')
				}
			]
		}
		this.ProductVisibilityRef = React.createRef();
		this.ProductStatusRef = React.createRef();
		this.substoreOptionsRef = React.createRef();
	}

	onChileChange = () => {
		this.setState({ refresh: !this.state.refresh })
	}
	componentDidMount() {
		// this.fetchContent()
		this.fetchFilters();

		//re render when change orientation
		Dimensions.addEventListener('change', () => {
			this.setState({
				screenWidth: Dimensions.get('screen').width,
				screenHeight: Dimensions.get('screen').height,
			})
		})

	}

	fetchFilters = () => {
		this.cancelFetchDatagetFilters = getFilters({ productStatus: true, productVisibility: true }, res => {
			this.setState({ filters: res.data, }, this.fetchContent)
		})
	}

	fetchContent = () => {
		this.cancelFetchDataGetProductHome = GetProductHome(this.props.ProductId, res => {
			this.setState({
				productHome: res.data, didFetchData: true, selectedStatus: res.data.Status, selectedVisibility: res.data.Visibility,
				ExtendForDays: res.data.DefaultExtendValue
			})
		})
	}

	EditStatus = () => {
		const { note } = this.state

		const productId = this.props.ProductId
		EditProductStatus({ productId, statusId: this.state.selectedStatus.Id, note }
			, res => {
				this.setState({
					showModal: false,
					note: '',
					Submit: false
				})
			})
	}

	componentWillUnmount() {
		this.cancelFetchDataDeleteProductPriceStep && this.cancelFetchDataDeleteProductPriceStep()
		this.cancelFetchDataGetProductHome && this.cancelFetchDataGetProductHome()
		this.cancelFetchDatagetFilters && this.cancelFetchDatagetFilters()

	}


	onSelectGenral = (index) => {
		const { SubStore } = this.state.productHome
		if (index == 0 && IsScreenPermitted('SubStoreProfile')) {               //Profile
			this.props.navigation.navigate('SubStoreProfile', {
				Id: SubStore.Id,
				onChildChange: this.onChildChange
			})

		} else if ((index == 0 && !IsScreenPermitted('SubStoreProfile')) ||       //Users
			(index == 1 && IsScreenPermitted('SubStoreProfile'))) {
			this.props.navigation.navigate('Users', { SubSToreId: SubStore.Id })
		}
		else {                                                                     //Products
			this.props.navigation.navigate('Products', { subStoreId: SubStore.Id })
		}
	}

	handleDatePicked = date => {
		this.setState({ SaleExpirationDate: date.toISOString(), isDateTimePickerVisible: false })
	};



	renderDeletebutton = (item) => {
		const { Id } = item

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
						this.cancelFetchDataDeleteProductPriceStep = DeleteProductPriceStep(Id, () => {
							this.setState({
								priceSteps: this.state.priceSteps.filter(filterItem => filterItem.Id !== Id),
							})
						})
					}} />
			</View>
		)
	}

	renderImage = () => {
		const imageSize = 90
		const { ImageUrl } = this.state.productHome.Image

		return (
			<View
				style={{
					alignSelf: 'center',
					justifyContent: 'center',
					alignItems: 'center',
				}}>
				<CircularImage
					uri={ImageUrl}
					size={imageSize} />
			</View>
		)
	}

	renderPebddingOrders = () => {

		if (this.state.productHome.Status.Id != 8 || this.state.showPadding == false) {
			return null
		}

		return (
			<View>
				<TranslatedText text='AcceptOrDeclineProudctNow' style={{ alignSelf: 'center', fontSize: 16, marginVertical: 10, color: 'black' }} />

				<View style={{ justifyContent: 'space-between', flexDirection: 'row', marginHorizontal: largePagePadding, marginBottom: 5 }} >
					<CustomTouchable
						onPress={() => {
							onAccept(this.props.ProductId, res => {
								LongToast('dataSaved')
								this.fetchContent()
								this.setState({ showPadding: false })

							})
							// this.onAcceptItem(orderId)
						}}
						style={{
							// flexDirection: 'row',
							width: this.state.screenWidth / 2.5,
							justifyContent: 'center',
							alignItems: 'center',
							paddingHorizontal: 10,
							paddingVertical: 6,
							backgroundColor: '#009688',
							borderRadius: largeBorderRadius,
							marginTop: 15,
						}}>
						<TranslatedText style={{ color: 'white', fontSize: 12, }} text='Accept' />
					</CustomTouchable>

					<CustomTouchable
						onPress={() => {
							// this.onDeclineItem(orderId)
							onDecline(this.props.productId, res => {
								LongToast('dataSaved')
								this.fetchContent()
								this.setState({ showPadding: false })
							})
						}}
						style={{
							width: this.state.screenWidth / 2.5,
							// flexDirection: 'row',
							justifyContent: 'center',
							alignItems: 'center',
							paddingHorizontal: 10,
							paddingVertical: 6,
							backgroundColor: '#F44336',
							borderRadius: largeBorderRadius,
							marginTop: 15,
						}}>
						<TranslatedText style={{ color: 'white', fontSize: 12, }} text='Decline' />
					</CustomTouchable>
				</View>
			</View >

		)
	}


	renderValidityExtendModalItems = () => {
		const { ExtendForDays } = this.state;
		const { translate } = this.props;
		return (
			<View style={{ marginHorizontal: largePagePadding, width: (this.state.screenWidth - 80), alignSelf: 'center', alignItems: 'center', justifyContent: 'center', paddingBottom: 10, }} >
				<HorizontalInput
					label="ExtendFor"
					keyboardType="numeric"
					containerStyle={{ width: "100%", marginVertical: 10 }}
					value={ExtendForDays != null ? String(ExtendForDays) : null}
					onChangeText={(ExtendForDays) => { this.setState({ ExtendForDays }) }}
					rightMember={translate('Days')}
				/>
			</View>
		)
	}

	_onRenderValidityExtendModal = () => {
		const { showValidityExtendModal, loading, ExtendForDays } = this.state
		return (
			<CustomAddModal
				onBackdropPress={() => {
					this.setState({ showValidityExtendModal: false, })
				}}
				isVisible={showValidityExtendModal}
				loading={loading}
				RoundedCloseButtonPress={() => {
					this.setState({ showValidityExtendModal: false })
				}}
				Edit={false}
				onSubmit={() => {
					this.setState({
						loading: true,
						showValidityExtendModal: false,
					})

					if (!ExtendForDays) {
						return LongToast('CantHaveEmptyInputs')
					}
					AcceptValidityExtendRequest(this.props.ProductId, ExtendForDays,
						(res) => {
							LongToast('ValidityExtendAccepted')
							this.fetchContent()
							this.setState({
								loading: false,
								showValidityExtendModal: false,
							})
						},
						(err) => {
							this.setState({
								loading: false,
								showValidityExtendModal: false,
							})
						},
					)

				}}>
				{this.renderValidityExtendModalItems()}
			</CustomAddModal>
		)
	}


	renderContent = () => {
		const { translate } = this.props
		if (this.state.didFetchData) {
			const { product } = this.props;
			const { filters, selectedStatus, selectedVisibility } = this.state
			const { Currency, SubStore, ValidityExpiration, ValidityExtendRequest } = this.state.productHome


			return (
				<ScrollView style={{ flex: 1, }}>
					<ImageBackground
						blurRadius={5}
						style={{ flex: 1, }}
						source={{ uri: this.state.productHome.Image.ImageUrl }}>
						<LinearGradient
							colors={['rgba(0, 0, 0, .1)', 'rgba(0, 0, 0, .6)', 'rgba(0, 0, 0, 1)']}
							style={{
								flex: 1,
								paddingVertical: largePagePadding,
								justifyContent: 'center',
								alignItems: 'center',
							}}>
							{this.renderImage()}

							<View style={{ justifyContent: 'center', alignItems: 'center', marginTop: largePagePadding }}>
								<FontedText style={{ color: 'white', fontSize: 20, textAlign: 'center', fontWeight: 'bold' }}>{product.Name}</FontedText>
								<View style={{ flexDirection: 'row', justifyContent: 'space-between', width: this.state.screenWidth, marginTop: 20 }}>
									<View style={{ textAlign: 'center', justifyContent: 'center', borderRadius: 10, paddingHorizontal: 13, paddingVertical: 9 }}>
										<Text style={{ color: '#FFF', textAlign: 'center' }}>{translate('Price')}</Text>
										<Text style={{ color: '#FFF', textAlign: 'center' }}>{`${numeral(product.Price)} ${(Currency ? Currency.Name : "")}`}</Text>
									</View>
									<View style={{ textAlign: 'center', justifyContent: 'center', borderRadius: 10, paddingHorizontal: 13, paddingVertical: 9 }}>
										<Text style={{ color: '#FFF', textAlign: 'center' }}>{translate('Orders')}</Text>
										<Text style={{ color: '#FFF', textAlign: 'center' }}>{numeral(product.OrdersCount)}</Text>
									</View>
									<View style={{ textAlign: 'center', justifyContent: 'center', borderRadius: 10, paddingHorizontal: 13, paddingVertical: 9 }}>
										<Text style={{ color: '#FFF', textAlign: 'center' }}>{translate('Rating')}</Text>
										<Text style={{ color: '#FFF', textAlign: 'center' }}>{numeral(product.Rating)}</Text>
									</View>
									<View style={{ textAlign: 'center', justifyContent: 'center', borderRadius: 10, paddingHorizontal: 13, paddingVertical: 9 }}>
										<Text style={{ color: '#FFF', textAlign: 'center' }}>{translate('Questions')}</Text>
										<Text style={{ color: '#FFF', textAlign: 'center' }}>{`${product.QuestionsNeedAttentionCount} (${numeral(product.QuestionsCount)})`}</Text>
									</View>
								</View>
							</View>
						</LinearGradient>
					</ImageBackground>

					<View style={{ position: 'absolute', zIndex: 3, top: 20, width: this.state.screenWidth - pagePadding * 2, left: pagePadding, right: pagePadding, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
						{filters && <CustomTouchable
							onPress={() => {
								this.ProductStatusRef.current.show()
							}}
							style={{
								flexDirection: 'row',
								justifyContent: 'center',
								alignItems: 'center',
								paddingHorizontal: 10,
								paddingVertical: 6,
								backgroundColor: mainColor,
								borderRadius: largeBorderRadius,
							}}>
							<FontedText style={{ color: 'white', fontSize: 11, }}>{selectedStatus ? selectedStatus.Name.slice(0, 10) : null}</FontedText>

							<Ionicons
								name={"md-arrow-dropdown"}
								size={18}
								color={'white'}
								style={{
									marginLeft: 5,
								}} />
						</CustomTouchable>}
						{filters && <CustomTouchable
							onPress={() => {
								this.ProductVisibilityRef.current.show()
							}}
							style={{
								flexDirection: 'row',
								justifyContent: 'center',
								alignItems: 'center',
								paddingHorizontal: 10,
								paddingVertical: 6,
								backgroundColor: mainColor,
								borderRadius: largeBorderRadius,
							}}>
							<FontedText style={{ color: 'white', fontSize: 11, }}>{selectedVisibility ? selectedVisibility.Name.slice(0, 10) : null}</FontedText>

							<Ionicons
								name={"md-arrow-dropdown"}
								size={18}
								color={'white'}
								style={{
									marginLeft: 5,
								}} />
						</CustomTouchable>}
					</View>

					{this.renderPebddingOrders()}

					<CustomTouchable
						style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15, }}
						onPress={() => {
							this.props.navigation.navigate('QuestionsIndex', { product: this.state.productHome })
							// this.props.navigation.navigate('Questions')
						}}
					>
						<View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
							<View style={{ marginRight: 10, backgroundColor: "#edeeef", padding: 5, borderRadius: 8 }}>
								<Text style={{ fontSize: 13 }}>{this.state.productHome.QuestionsCount}</Text>
							</View>
							<TranslatedText style={{
								// color: '#3B3B4D'
								color: mainTextColor
							}} text={'Questions'} />
						</View>
						<Ionicons name={I18nManager.isRTL ? 'ios-arrow-back' : 'ios-arrow-forward'} size={18} color={secondTextColor} />
					</CustomTouchable>

					<ItemSeparator />

					<CustomTouchable
						style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15, }}
						onPress={() => {
							this.props.navigation.navigate('Reviews', { product: this.state.productHome })
							//NS_Reviews
						}}
					>
						<View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
							<View style={{ marginRight: 10, backgroundColor: "#edeeef", padding: 5, borderRadius: 8 }}>
								<Text style={{ fontSize: 13 }}>{this.state.productHome.ReviewsCount}</Text>
							</View>
							<TranslatedText style={{
								// color: '#3B3B4D'
								color: mainTextColor
							}} text={'NS_Reviews'} />
						</View>
						<Ionicons name={I18nManager.isRTL ? 'ios-arrow-back' : 'ios-arrow-forward'} size={18} color={secondTextColor} />
					</CustomTouchable>

					<ItemSeparator />

					<CustomTouchable
						style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15, }}
						onPress={() => {
							//Orders
							this.props.navigation.navigate('Orders', { product: this.state.productHome })
						}}
					>
						<View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
							<View style={{ marginRight: 10, backgroundColor: "#edeeef", padding: 5, borderRadius: 8 }}>
								<Text style={{ fontSize: 13 }}>{this.state.productHome.OrdersCount}</Text>
							</View>
							<TranslatedText style={{
								// color: '#3B3B4D'
								color: mainTextColor
							}} text={'Orders'} />
						</View>
						<Ionicons name={I18nManager.isRTL ? 'ios-arrow-back' : 'ios-arrow-forward'} size={18} color={secondTextColor} />
					</CustomTouchable>

					<ItemSeparator />

					{SubStore && SubStore.Id != 0 ?
						<CustomTouchable
							style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15, }}
							onPress={() => {
								this.substoreOptionsRef.current.show()
							}}
						>
							<View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
								<View style={{ marginRight: 10, padding: 5, }}>
									<AntDesign
										name={`user`}
										size={20} />
								</View>
								<FontedText style={{
									color: mainTextColor
								}} >{SubStore.Name} </FontedText>
							</View>
							<Ionicons name={I18nManager.isRTL ? 'ios-arrow-back' : 'ios-arrow-forward'} size={18} color={secondTextColor} />
						</CustomTouchable> : null}
					{SubStore && SubStore.Id != 0 ?
						<ItemSeparator /> : null}


					{ValidityExpiration != null ?
						<CustomTouchable
							style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15, }}
							onPress={null}
						>
							<View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
								<View style={{ marginRight: 10, padding: 5, }}>
									<EvilIcons
										name={"clock"}
										size={24}
									/>
								</View>
								<FontedText style={{
									color: mainTextColor
								}} >{formatDate(ValidityExpiration)} </FontedText>
							</View>
						</CustomTouchable> : null}

					{ValidityExpiration != null ?
						<ItemSeparator /> : null}

					{ValidityExtendRequest ?
						<CustomTouchable
							style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 10, }}
							onPress={() => {
								this.substoreOptionsRef.current.show()
							}}
						>
							<View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
								<View style={{ marginRight: 10, padding: 5, }}>
									<AntDesign
										name={`exclamation`}
										size={20} />
								</View>
								<FontedText style={{
									color: mainTextColor
								}} >{'ExtendRequest'} </FontedText>
							</View>
							<View style={{ flexDirection: 'row' }}>
								<CustomTouchable
									onPress={() => {
										this.setState({ showValidityExtendModal: true })
									}}	>
									<Ionicons style={{ paddingHorizontal: 20 }}
										name={`ios-checkmark`} size={40} color={'#009688'} />
								</CustomTouchable>
								<CustomTouchable
									onPress={() => {
										this.setState({ loading: true })
										DeleteValidityExtend(this.props.ProductId, (res) => {
											this.setState({
												showValidityExtendModal: false,
												loading: false
											})
											LongToast('ValidityExtendRejected')
											this.fetchContent()
										}, () => {
											this.setState({ loading: false })
										})
									}}>
									<Ionicons
										name={`ios-close`} size={40} color={'#F44336'} />
								</CustomTouchable>

							</View>
						</CustomTouchable> : null}
					{ValidityExtendRequest ?
						<ItemSeparator /> : null}

					<View
						style={{ paddingHorizontal: largePagePadding, alignItems: 'center', marginHorizontal: 40, marginVertical: 20 }}
					>
						<QR
							getRef={(c) => (this.svg = c)}
							size={150}
							value={`purchase_${this.props.ProductId}_${this.props.secondary_token}`}
						/>
					</View>

					<CustomButton
						style={{
							marginHorizontal: largePagePadding,
							marginVertical: 10
						}}
						title='SaveToGallery'
						onPress={() => {
							this.svg.toDataURL(data => {
								this.setState({ loading: true })
								SaveImge(
									data,
									`ProductQRCode(${this.props.ProductId})`, () => {
										this.setState({ loading: false })
									}, err => {
										this.setState({ loading: false })
										LongToast('DataNotSaved')
									})
							})

						}}
						loading={this.state.loading}
					/>
				</ScrollView>
			)
		} else {
			return (
				<View style={{ flex: 1, minHeight: this.state.screenHeight / 2, alignItems: 'center', justifyContent: 'center' }}>
					<ActivityIndicator />
				</View>
			)
		}
	}


	renderModal = () => {

		return (
			<Modal
				isVisible={this.state.showModal}
				onBackdropPress={() => {
					this.setState({ showModal: false, note: '' })
				}}
				onSwipeComplete={() => {
					this.setState({ showModal: false, note: '' })
				}}
			>
				<View
					style={{
						margin: 20,
						padding: 10,
						borderRadius: 20,
						backgroundColor: 'white',
						justifyContent: 'center',
						alignItems: 'center',
						...shadowStyle0
					}} >
					<View
						style={{
							flexDirection: 'row',
							justifyContent: 'flex-end',
							alignItems: 'center',
							width: '100%',
							marginBottom: 10,
						}}>


						<CustomTouchable
							onPress={() => {
								this.setState({ showModal: false, note: '' })
							}}
							style={{
								paddingLeft: 5,
								paddingBottom: 5,
								marginRight: 10

							}}>
							<Ionicons name='ios-close' color='#444444' size={26} />
						</CustomTouchable>
					</View>

					<HorizontalInput
						autoFocus={this.state.showModal}
						value={this.state.note}
						label={'Notes'}
						onChangeText={(note) => { this.setState({ note }) }}
					/>

					<ItemSeparator />

					<CustomButton
						style={{ width: '100%' }}
						title={'Send'}
						loading={this.state.Submit}
						onPress={() => {
							this.setState({ Submit: true })
							this.EditStatus()
						}}
					/>
				</View>

			</Modal>
		)
	}

	render() {
		const { filters, note } = this.state
		const { translate } = this.props

		return (
			<LazyContainer style={{ flex: 1, backgroundColor: "#FFF", }}>
				{this.renderContent()}
				{filters && <CustomSelector
					ref={this.ProductStatusRef}
					options={filters.ProductStatus.map(item => item.Name)}
					onSelect={(index) => {
						this.setState({ selectedStatus: filters.ProductStatus[index], showModal: true }, () => {
						})
					}}
					onDismiss={() => { }}
				/>}
				{filters && <CustomSelector
					ref={this.ProductVisibilityRef}
					options={filters.ProductVisibility.map(item => item.Name)}
					onSelect={(index) => {
						this.setState({ selectedVisibility: filters.ProductVisibility[index] }, () => {
							EditProductVisibility({ productId: this.props.ProductId, visibilityId: this.state.selectedVisibility.Id })
						})
					}}
					onDismiss={() => { }}
				/>}

				{this.substoreOptions &&
					<CustomSelector
						ref={this.substoreOptionsRef}
						options={this.substoreOptions.map(item => item.Name)}
						onSelect={(index) => { this.onSelectGenral(index) }}
						onDismiss={() => { }}
					/>
				}
				{this.renderModal()}
				{this._onRenderValidityExtendModal()}
			</LazyContainer>
		)
	}
}

const mapStateToProps = ({
	login: {
		secondary_token
	}
}) => ({
	secondary_token,
})


export default connect(mapStateToProps)(withLocalize(ProductPricing))