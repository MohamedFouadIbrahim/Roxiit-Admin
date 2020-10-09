import React, { Component } from 'react';
import { withLocalize } from 'react-localize-redux';
import { ActivityIndicator, FlatList, I18nManager, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, View, saf, Dimensions } from 'react-native';
import { EventRegister } from 'react-native-event-listeners';
import LinearGradient from 'react-native-linear-gradient';
import Modal from "react-native-modal";
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import CustomSelectorForDeleteAndEdit from '../../components/CustomSelectorForDeleteAndEdit/index';
import CustomTouchable from '../../components/CustomTouchable';
import CustomDatePicker from '../../components/CustomDatePicker';
import DeleteButton from '../../components/DeleteButton/index.js';
import FontedText from '../../components/FontedText';
import HorizontalInput from '../../components/HorizontalInput/index';
import ItemSeparator from '../../components/ItemSeparator/index.js';
import LazyContainer from '../../components/LazyContainer';
import RoundedCloseButton from '../../components/RoundedCloseButton/index.js';
import TranslatedText from '../../components/TranslatedText/index.js';
import { secondColor, secondTextColor, mainColor } from '../../constants/Colors.js';
import { largePagePadding, smallBorderRadius } from '../../constants/Style';
import { AddProductPriceStep, DeleteProductPriceStep, EditProductPricing, GetProductPricing, GetProductPricingHistory, GetAllCurrencies } from '../../services/ProductService.js';
import { formatDate, formatTime } from '../../utils/Date';
import { LongToast } from '../../utils/Toast';
import { convertNumbers2English } from '../../utils/numeral';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import CustomSelector from '../../components/CustomSelector';
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
			showCustomSelectorForDeleteref: false,
			Loading: false,
			EditMode: false,
			IsAddPriceStep: true,
			VirtualBalance: null,
			Stock: 0,
			AllCurrencies: [],
			screenWidth: Dimensions.get('screen').width,
			screenHeight: Dimensions.get('screen').height,
		}
		this.currencySelectorRef = React.createRef();

		this.listener = EventRegister.addEventListener('currentPost', (currentPost) => {
			if (currentPost == '1') {
				this.submitPricing()
			}
		})
	}

	componentDidMount() {
		this.fetchPricingHistory()
		this.fetchProductPricing()
		this.fetchRunTimeConfig()

		//re render when change orientation
		Dimensions.addEventListener('change', () => {
			this.setState({
				screenWidth: Dimensions.get('screen').width,
				screenHeight: Dimensions.get('screen').height,
			})
		})

	}

	fetchProductPricing = () => {
		this.cancelFetchDataGetProductPricing = GetProductPricing(this.props.ProductId, res => {
			this.setState({
				...res.data,
				didFetchData: true,
			})
		}, err => {
		})
	}

	fetchRunTimeConfig = () => {

		const { AdminShowCommission } = this.props.Admin_Page_0_0
		this.setState({ AdminShowCommission: AdminShowCommission.Value })

	}

	fetchPricingHistory = () => {
		this.cancelFetchDataGetProductPricingHistory = GetProductPricingHistory(this.props.ProductId, res => {
			this.setState({ PricingHistory: res.data })
		})
	}

	componentWillUnmount() {
		EventRegister.removeEventListener(this.listener)
		this.cancelFetchData && this.cancelFetchData()
		this.cancelFetchDataGetProductPricingHistory && this.cancelFetchDataGetProductPricingHistory()
		this.cancelFetchDataGetProductPricing && this.cancelFetchDataGetProductPricing()
		this.cancelFetchDataAddProductPriceStep && this.cancelFetchDataAddProductPriceStep()
	}

	handleDatePicked = date => {
		this.setState({ SaleExpirationDate: date, isDateTimePickerVisible: false })
	};

	getNumberIfThereDecimalPoints = (Num) => {
		const ret = Num.toFixed(2);
		return ret
	}


	submitPricing = () => {
		const { Price, RealPrice, MaxPurchaseCount, SalePrice, SaleExpirationDate, Tax, Commission,
			ProductMinQty,
			ProductMaxQty,
			ProductQtyStep,
			VirtualBalance,
			Stock,
			ExtraPrice,
			Currency,
		} = this.state

		const { ProductId } = this.props
		if (!parseFloat(convertNumbers2English(Price.toString()))) {
			LongToast('pleaseenteraprice')
		} else if (SalePrice && Number.isNaN(parseFloat(convertNumbers2English(SalePrice.toString())))) {
			LongToast('EnterVaildSalePrice')
			return
		} else if (RealPrice && Number.isNaN(parseFloat(convertNumbers2English(RealPrice.toString())))) {
			LongToast('EnterVaildRealPrice')
			return
		} else {
			const finalPrice = parseFloat(convertNumbers2English(Price.toString()))
			const finalRealPrice = RealPrice ? parseFloat(convertNumbers2English(RealPrice.toString())) : null
			const finalSalePrice = SalePrice ? parseFloat(convertNumbers2English(SalePrice.toString())) : null
			const finanlMaxPurchaseCount = MaxPurchaseCount ? convertNumbers2English(MaxPurchaseCount.toString()) : null
			const finalCommission = Commission <= 100 && Commission > 0 ? convertNumbers2English(Commission.toString()) : 0
			const finalExtraPrice = ExtraPrice ? parseFloat(convertNumbers2English(ExtraPrice.toString())) : null
			const finalTax = Tax ? convertNumbers2English(Tax.toString()) : null
			const finanlProductMinQty = ProductMinQty ? parseInt(convertNumbers2English(ProductMinQty.toString()), 10) : null
			const finalProductMaxQty = ProductMaxQty ? parseInt(convertNumbers2English(ProductMaxQty.toString()), 10) : null
			const finalProductQtyStep = ProductQtyStep ? parseInt(convertNumbers2English(ProductQtyStep.toString()), 10) : null
			const finalVirtualBalance = VirtualBalance ? parseInt(convertNumbers2English(VirtualBalance.toString()), 10) : null
			const finalStock = Stock || Stock == 0 ? parseInt(convertNumbers2English(Stock.toString()), 10) : null

			EventRegister.emit('submitting', true)
			EditProductPricing({
				Id: ProductId,
				Price: finalPrice,
				RealPrice: finalRealPrice,
				MaxPurchaseCount: finanlMaxPurchaseCount,
				SalePrice: finalSalePrice,
				SaleExpirationDate,
				Tax: finalTax,
				Commission: finalCommission,
				ProductMinQty: finanlProductMinQty,
				ProductMaxQty: finalProductMaxQty,
				ProductQtyStep: finalProductQtyStep,
				VirtualBalance: finalVirtualBalance,
				Stock: finalStock,
				ExtraPrice: finalExtraPrice,
				CurrencyId: Currency.Id,
			}, res => {
				LongToast('dataSaved')
				EventRegister.emit('submitting', false)
			}, err => {
				EventRegister.emit('submitting', false)
			})
		}
	}

	renderPriceModal = (item) => {
		const FinalLowSteps = this.state.LowStep ? String(this.state.LowStep) : ''
		const FinalHighStep = this.state.HighStep ? String(this.state.HighStep) : ''
		const FinatlStepPrice = this.state.stepPrice ? String(this.state.stepPrice) : ''
		const { translate } = this.props
		const { Currency } = this.state
		return (
			<Modal onBackdropPress={() => this.setState({ priceStepErr: null, isPriceModalVisible: false })} isVisible={this.state.isPriceModalVisible}>
				<View style={{ position: 'absolute', top: Platform.OS == 'ios' ? 70 : 25, zIndex: 3 }}>
					{
						this.state.priceStepErr ?
							<LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
								colors={['#f24b80', '#f26390']}
								style={[{
									width: this.state.screenWidth - 40,
									borderRadius: 40,
									justifyContent: "space-between",
									alignItems: "center",
									flexDirection: "row",
									paddingHorizontal: 20,
									paddingVertical: 15,
									opacity: .99,
									alignSelf: 'center',
								}]}>

								<FontedText style={{ flex: 1, color: "#FFF", fontSize: 14, }}>{this.state.priceStepErr}</FontedText>
								<CustomTouchable onPress={() => {

								}} style={{ flex: .3, alignItems: "flex-end" }}>
									<AntDesign style={{}} name="close" color="#FFF" size={18} onPress={() => {
										this.setState({ priceStepErr: '' })
									}} />
								</CustomTouchable>
							</LinearGradient> : null
					}
				</View>
				<View style={{ backgroundColor: "#FFF", width: this.state.screenWidth - 40, borderRadius: 20 }}>
					<View style={{ marginTop: 10, marginRight: 10, alignItems: 'flex-end' }}>
						<RoundedCloseButton onPress={() => this.setState({ priceStepErr: null, isPriceModalVisible: false })} />
					</View>
					<View
						style={{
							padding: 20,
							justifyContent: 'center',
							alignItems: 'center',
							flexDirection: 'row'
						}}>
						<TranslatedText style={{ flex: 1, color: secondTextColor }} text={"LowStep"} />
						<TextInput
							style={[{
								flex: 1,
								fontSize: 15,
								// color: secondTextColor,
								textAlign: I18nManager.isRTL ? 'right' : 'left',
								paddingLeft: 0,
								marginLeft: 0,
								width: "100%"
							}]}
							placeholder={translate('LowStep')}
							placeholderTextColor={'#717175'}
							keyboardType="numeric"
							value={item ? String(item.LowStepQty) : FinalLowSteps}
							onChangeText={
								(LowStep) => {
									item ? this.setState(prevstate => ({
										item: {
											...prevstate.item,
											LowStepQty: LowStep
										}
									})) :
										this.setState({ LowStep })
								}
							}
							underlineColorAndroid='transparent'
							selectionColor={secondColor} />
					</View>
					<ItemSeparator />

					<View
						style={{
							justifyContent: 'center',
							alignItems: 'center',
							flexDirection: 'row',
							padding: 20,
						}}>
						<TranslatedText style={{ flex: 1, color: secondTextColor }} text={"HighStep"} />
						<TextInput
							style={[{
								flex: 1,
								fontSize: 15,
								// color: secondTextColor,
								textAlign: I18nManager.isRTL ? 'right' : 'left',
								paddingLeft: 0,
								marginLeft: 0,
								width: "100%"
							}]}
							placeholder={translate('HighStep')}
							placeholderTextColor={'#717175'}
							keyboardType="numeric"
							value={item ? String(item.HighStepQty) : FinalHighStep}
							onChangeText={(HighStep) => {
								// this.setState({ HighStep })
								item ? this.setState(prevstate => ({
									item: {
										...prevstate.item,
										HighStepQty: HighStep
									}
								})) :
									this.setState({ HighStep })
							}
							}
							underlineColorAndroid='transparent'
							selectionColor={secondColor} />
					</View>
					<ItemSeparator />

					<View
						style={{
							padding: 20,
							justifyContent: 'center',
							alignItems: 'center',
							flexDirection: 'row'
						}}>
						<TranslatedText style={{ flex: 1, color: secondTextColor }} text={"Price"} />
						<TextInput
							style={[{
								fontSize: 15,
								flex: 1,
								// color: secondTextColor,
								textAlign: I18nManager.isRTL ? 'right' : 'left',
								paddingLeft: 0,
								marginLeft: 0,
								width: "100%"
							}]}
							placeholder="Price"
							placeholderTextColor={'#717175'}
							keyboardType="numeric"
							value={item ? String(item.Price) : FinatlStepPrice}
							onChangeText={(stepPrice) => {
								item ? this.setState(prevstate => ({
									item: {
										...prevstate.item,
										Price: stepPrice
									}
								})) :
									this.setState({ stepPrice })
							}
							}
							underlineColorAndroid='transparent'
							selectionColor={secondColor} />
						<FontedText>{(Currency ? Currency.Name : "")}</FontedText>
					</View>
					{/* { this.state.priceStepErr ? <Text style={{ color: "red", textAlign: "center", marginBottom: 10 }}>{ this.state.priceStepErr }</Text> : null } */}
					<CustomTouchable
						disabled={this.state.buttonLoading}
						style={{ backgroundColor: secondColor, justifyContent: "center", alignItems: "center", borderBottomEndRadius: 20, borderBottomLeftRadius: 20 }}
						onPress={() => { this.AddPriceStep(); this.setState({ item: null }) }}>
						{
							this.state.buttonLoading ? <ActivityIndicator color="#FFF" size="small" style={{ paddingVertical: 13 }} /> :
								<TranslatedText style={{ color: '#FFF', textAlign: "center", paddingVertical: 13 }} text={this.state.IsAddPriceStep ? "Add" : 'CanEdit'} />
						}
					</CustomTouchable>
				</View>
			</Modal>
		)
	}
	AddPriceStep = () => {
		const { LowStep, HighStep, stepPrice } = this.state
		const { translate } = this.props
		// // For Add 

		if (LowStep == null || LowStep == "")
			this.setState({ priceStepErr: translate('Lowstepvaluecantbeempty') }, () => setTimeout(() => this.setState({ priceStepErr: null }), 2000))
		else if (HighStep == null || HighStep == "")
			this.setState({ priceStepErr: translate('Highstepvaluecantbeempty') }, () => setTimeout(() => this.setState({ priceStepErr: null }), 2000))
		else if (stepPrice == null || stepPrice == "")
			this.setState({ priceStepErr: translate('Steppricevalue') }, () => setTimeout(() => this.setState({ priceStepErr: null }), 2000))
		else if (LowStep < 2)
			this.setState({ priceStepErr: "Low step can't be lower than 2" }, () => setTimeout(() => this.setState({ priceStepErr: null }), 2000))
		else if (parseInt(convertNumbers2English(HighStep.toString()), 10) <= parseInt(convertNumbers2English(LowStep.toString()), 10))
			this.setState({ priceStepErr: translate('Highstepmustbehigherthanlowstep') }, () => setTimeout(() => this.setState({ priceStepErr: null }), 2000))
		else {

			this.setState({ priceStepErr: null, buttonLoading: true })
			this.cancelFetchDataAddProductPriceStep = AddProductPriceStep({
				ProductId: this.props.ProductId,
				LowStepQty: parseInt(convertNumbers2English(LowStep.toString()), 10),
				HighStepQty: parseInt(convertNumbers2English(HighStep.toString()), 10),
				// Price: parseInt(stepPrice, 10),
				Price: parseFloat(convertNumbers2English(stepPrice.toString())),
				Id: this.state.Id
			}, res => {
				this.fetchProductPricing();
				this.setState({ priceStepErr: null, isPriceModalVisible: false, buttonLoading: false, LowStep: null, HighStep: null, stepPrice: null, })
			}, err => {
				this.setState({ buttonLoading: false, priceStepErr: err.data.Message })
				return true
			})

		}



	}

	renderCurrency = () => {
		const { Currency } = this.state
		return (
			<CustomTouchable
				onPress={() => {
					GetAllCurrencies(res => {
						this.setState({
							AllCurrencies: res.data.Data,
						})
						this.currencySelectorRef.current.show()
					})
				}}
				style={{
					flexDirection: 'row',
					justifyContent: 'center',
					alignItems: 'center',
					paddingRight: 10,
					paddingVertical: 8,
					backgroundColor: mainColor,
					borderRadius: smallBorderRadius,
					marginHorizontal: largePagePadding,
					maxWidth: 250
				}}>
				<FontedText style={{ color: 'white', fontSize: 10, textAlign: 'left', paddingLeft: 5 }}>{(Currency ? Currency.Name : "")}</FontedText>

				<Ionicons
					name={"md-arrow-dropdown"}
					size={18}
					color={'white'}
					style={{
						marginLeft: 5,
					}} />
			</CustomTouchable>)
	}
	renderContent = () => {
		const { product, translate } = this.props;
		const { Currency } = this.state
		if (this.state.didFetchData) {
			return (
				<KeyboardAwareScrollView
					extraHeight={90}
					extraScrollHeight={90}
					innerRef={ref => {
						this.scroll = ref
					}}
				>
					<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
						<HorizontalInput
							containerStyle={{ flex: 1 }}
							keyboardType="numeric"
							label="Price"
							value={this.state.Price ? `${this.state.Price}` : null}
							onChangeText={(Price) => {
								this.setState({ Price })
							}} />
						{this.renderCurrency()}
					</View>

					<ItemSeparator />

					<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
						<HorizontalInput
							containerStyle={{ flex: 1 }}
							keyboardType="numeric"
							label="SalePrice"
							value={this.state.SalePrice ? `${this.state.SalePrice}` : null}
							onChangeText={(text) => {
								this.setState({ SalePrice: text })

							}}
						/>
						{this.renderCurrency()}

					</View>

					<ItemSeparator />

					{this.state.SalePrice && this.state.Price ? <View style={{ opacity: 0.4, flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: largePagePadding, flex: 1, paddingVertical: 15 }} >
						<TranslatedText style={{ fontSize: 16, flex: 2, color: secondTextColor }} text={'Saving'} />
						{/* <FontedText style={{ fontSize: 16, flex: 2, color: secondTextColor }} >{''}</FontedText> */}
						<View style={{
							flexDirection: 'row', justifyContent: 'space-between',
							flex: 5,
							paddingLeft: 70,
							paddingRight: 20
						}} >
							<FontedText style={{ color: secondTextColor, fontSize: 16, }} >{`${this.getNumberIfThereDecimalPoints(this.state.Price - this.state.SalePrice)} ${(Currency ? Currency.Name : "")}`}</FontedText>
							<FontedText style={{ color: secondTextColor, fontSize: 16, }} >{`${this.getNumberIfThereDecimalPoints(((this.state.Price - this.state.SalePrice) / this.state.Price) * 100)}%`}</FontedText>
						</View>
					</View> : null}

					<ItemSeparator />

					<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
						<HorizontalInput
							containerStyle={{ flex: 1 }}
							keyboardType="numeric"
							label="RealPrice"
							value={this.state.RealPrice ? `${this.state.RealPrice}` : null}
							onChangeText={(RealPrice) => {
								this.setState({ RealPrice })

							}}
						/>
						{this.renderCurrency()}
					</View>

					<ItemSeparator />

					<CustomTouchable
						onPress={() => this.setState({ isDateTimePickerVisible: true })}
						style={{
							// flex: 1,
							justifyContent: 'center',
							alignItems: 'center',
							flexDirection: 'row',
							paddingVertical: 15,
							paddingHorizontal: 20,
							backgroundColor: 'white',
						}}>


						<CustomDatePicker
							isVisible={this.state.isDateTimePickerVisible}
							onDatePicked={this.handleDatePicked}
							is24Hour={true}
							mode='datetime'
							onCancel={() => this.setState({ isDateTimePickerVisible: false })}
						/>


						<TranslatedText style={{
							justifyContent: 'center',
							flex: 2, color: secondTextColor
						}} text={"SaleExpirationDate"} />
						<Text style={{
							color: 'black',
							flex: 4,
							justifyContent: 'center',
							// paddingLeft: 70,
							textAlign: 'center'
						}}>{this.state.SaleExpirationDate ? `${formatDate(this.state.SaleExpirationDate)} - ${formatTime(this.state.SaleExpirationDate)}` : translate('notselected')}</Text>


						{this.state.SaleExpirationDate && <Ionicons
							style={{
								justifyContent: 'center',
								alignItems: 'center',
								backgroundColor: '#EFF0F1',
								marginRight: 10,
								paddingHorizontal: 7,
								borderRadius: 20
							}}
							onPress={() => { this.setState({ SaleExpirationDate: null }) }}
							name='ios-close'
							color='black'
							size={25} />}


					</CustomTouchable>

					<ItemSeparator />

					{this.state.AdminShowCommission && <HorizontalInput
						rightMember='%'
						keyboardType="numeric"
						label="Comission"
						value={this.state.Commission <= 100 && this.state.Commission > 0 ? `${this.state.Commission}` : null}
						onChangeText={(text) => {
							const d = parseFloat(convertNumbers2English(text.toString()))
							if (d <= 100) {
								this.setState({ Commission: d })
							}
						}}
					/>}


					<ItemSeparator />

					{this.state.Commission && (this.state.SalePrice || this.state.Price) ? <View style={{ opacity: 0.4, flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: largePagePadding, flex: 1, paddingVertical: 15 }} >
						<TranslatedText style={{ fontSize: 16, flex: 2, color: secondTextColor }} text={'Brofite'} />
						{/* <FontedText style={{ fontSize: 16, flex: 2, color: secondTextColor }} >{'Brofite'}</FontedText> */}
						<View style={{
							flexDirection: 'row', justifyContent: 'space-between',
							flex: 5,
							paddingLeft: 70,
							paddingRight: 20
						}} >
							{this.state.SalePrice ?

								<FontedText style={{ color: 'black', fontSize: 16, }} >{`${this.getNumberIfThereDecimalPoints(parseFloat(convertNumbers2English(this.state.SalePrice)) * (this.state.Commission / 100))} ${(Currency ? Currency.Name : "")}`}</FontedText> :
								<FontedText style={{ color: 'black', fontSize: 16, }} >{`${this.getNumberIfThereDecimalPoints(parseFloat(convertNumbers2English(this.state.Price)) * (this.state.Commission / 100))} ${(Currency ? Currency.Name : "")}`}</FontedText>
							}
						</View>
					</View> : null}

					<ItemSeparator />

					<HorizontalInput
						rightMember='%'
						keyboardType="numeric"
						label="Tax"
						value={this.state.Tax ? String(this.state.Tax) : null}
						onChangeText={(Tax) => {
							this.setState({ Tax: Tax })
						}} />

					<ItemSeparator />
					<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

						<HorizontalInput
							containerStyle={{ flex: 1 }}
							keyboardType="numeric"
							label="ExtraPrice"
							value={this.state.ExtraPrice ? String(this.state.ExtraPrice) : null}
							onChangeText={(ExtraPrice) => {
								this.setState({ ExtraPrice })
							}} />
						{this.renderCurrency()}
					</View>

					<ItemSeparator />

					<HorizontalInput
						keyboardType="numeric"
						label="MaxPurchaseCount"
						value={this.state.MaxPurchaseCount ? String(this.state.MaxPurchaseCount) : null}
						onChangeText={(MaxPurchaseCount) => {
							this.setState({ MaxPurchaseCount })
						}} />

					<ItemSeparator />

					<HorizontalInput
						keyboardType="numeric"
						label="ProductMinQty"
						value={this.state.ProductMinQty ? String(this.state.ProductMinQty) : null}
						onChangeText={(ProductMinQty) => { this.setState({ ProductMinQty }) }} />

					<ItemSeparator />

					<HorizontalInput
						keyboardType="numeric"
						label="ProductMaxQty"
						value={this.state.ProductMaxQty ? String(this.state.ProductMaxQty) : null}
						onChangeText={(ProductMaxQty) => { this.setState({ ProductMaxQty }) }} />

					<ItemSeparator />

					<HorizontalInput
						keyboardType="numeric"
						label="ProductQtyStep"
						value={this.state.ProductQtyStep ? String(this.state.ProductQtyStep) : null}
						onChangeText={(ProductQtyStep) => { this.setState({ ProductQtyStep }) }} />

					<ItemSeparator />

					<HorizontalInput
						keyboardType="numeric"
						label="VirtualBalance"
						value={this.state.VirtualBalance ? String(this.state.VirtualBalance) : null}
						onChangeText={(VirtualBalance) => { this.setState({ VirtualBalance: VirtualBalance }) }} />

					<ItemSeparator />

					<HorizontalInput
						keyboardType="numeric"
						label="Stock"
						// value={this.state.Stock != null && this.state.Stock != '' ? String(this.state.Stock) : null}
						value={this.state.Stock || this.state.Stock == 0 ? String(this.state.Stock) : null}
						onChangeText={(Stock) => { this.setState({ Stock: Stock }) }} />

					<ItemSeparator />


					<CustomTouchable onPress={() => { //price Step Button To Add
						this.setState({ LowStep: '', HighStep: '', stepPrice: '', Id: 0, IsAddPriceStep: true }, () => {
							this.setState({ isPriceModalVisible: true })
						})
					}} style={{
						flexDirection: 'row', alignItems: "center", justifyContent: "space-between",
						// marginTop: Platform.OS == 'android' ? 60 : 30,
						paddingVertical: 15,
						paddingHorizontal: 20,
					}}>
						<TranslatedText style={{ color: '#414345', fontWeight: 'bold', }} text={"priceSteps"} />
						<Ionicons name='ios-add-circle-outline' color={secondTextColor} size={20} style={{}} />
					</CustomTouchable>

					{this.renderPriceModal(null)}
					<FlatList
						data={this.state.priceSteps}
						extraData={this.state}
						keyExtractor={(item) => String(item.Id)}
						ItemSeparatorComponent={() => <ItemSeparator />}
						renderItem={({ item }) => (
							<CustomTouchable
								onPress={() => {
									this.setState({
										LowStep: parseInt(item.LowStepQty, 10),
										HighStep: parseInt(item.HighStepQty, 10),
										// stepPrice: parseInt(item.Price, 10),
										stepPrice: item.Price,
										Id: item.Id,
										IsAddPriceStep: false
									}, () => {
										this.setState({ isPriceModalVisible: true })
									})

								}}
								onLongPress={() => {
									this.DeleteOrEditId = item.Id
									this.setState({ showCustomSelectorForDeleteref: true })
								}}
							>
								<View style={{ backgroundColor: "#FFF", flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 }}>
									<View style={{ flexDirection: 'row', alignItems: 'center' }}>
										<Text>{item.LowStepQty}</Text>
										<Ionicons name={I18nManager.isRTL ? 'ios-arrow-round-back' : 'ios-arrow-round-forward'} size={20} style={{ marginHorizontal: 10 }} />
										<Text>{item.HighStepQty}</Text>
									</View>
									<Text>{`${item.Price} ${(Currency ? Currency.Name : "")}`}</Text>
								</View>
							</CustomTouchable>
						)}
					/>

					{
						this.state.PricingHistory.length > 0 ?
							<>
								<TranslatedText style={{ color: '#414345', paddingTop: 60, fontWeight: 'bold', paddingHorizontal: 20 }} text={"PricingHistory"} />
								<FlatList
									data={this.state.PricingHistory}
									extraData={this.state}
									keyExtractor={(item) => String(item.Id)}
									ItemSeparatorComponent={() => <ItemSeparator />}
									renderItem={({ item }) => (
										<View style={{ padding: 20 }}>
											<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
												<View style={{ flexDirection: 'row', alignItems: 'center' }}>
													<Text>{item.OldPrice}</Text>
													<Ionicons name={I18nManager.isRTL ? 'ios-arrow-round-back' : 'ios-arrow-round-forward'} size={20} style={{ marginHorizontal: 10 }} />
													<Text>{item.NewPrice}</Text>
												</View>
												<Text style={{ color: secondTextColor }}>{formatDate(item.CreatedUtc)}</Text>
											</View>
											{item.ProductOption ? <Text style={{ color: secondTextColor }}>{item.ProductOption.Name}</Text> : null}
										</View>
									)}
								/>
							</>
							: null
					}

					{/* </ScrollView> */}
				</KeyboardAwareScrollView>
			)
		} else {
			return (
				<View style={{ flex: 1, minHeight: this.state.screenHeight / 2, alignItems: 'center', justifyContent: 'center' }}>
					<ActivityIndicator />
				</View>
			)
		}
	}

	_scrollToInput(reactNode) {
		// Add a 'scroll' ref to your ScrollView
		this.scroll.props.scrollToFocusedInput(reactNode)
	}

	render() {
		const { translate } = this.props
		const { AllCurrencies } = this.state
		return (
			<LazyContainer style={{ flex: 1, backgroundColor: "#FFF", }}>
				{/* {this.renderContent()} */}


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

						DeleteProductPriceStep(this.DeleteOrEditId, () => {
							this.setState({
								priceSteps: this.state.priceSteps.filter(filterItem => filterItem.Id !== this.DeleteOrEditId),
								showCustomSelectorForDeleteref: false,
								Loading: false
							})
							LongToast('dataDeleted')
						}, () => { this.setState({ Loading: false }) })
					}}
				/>

				{AllCurrencies && <CustomSelector
					ref={this.currencySelectorRef}
					options={AllCurrencies.map(item => item.Name)}
					onSelect={(index) => {
						this.setState({
							Currency: AllCurrencies[index]
						})
					}}
					onDismiss={() => { }}
				/>}
			</LazyContainer>
		)
	}
}
const mapStateToProps = ({
	runtime_config: {
		runtime_config: {
			screens: {
				Admin_Page_0_0
			},
		},
	}
}) => ({
	Admin_Page_0_0
})

export default connect(mapStateToProps)(withLocalize(ProductPricing))