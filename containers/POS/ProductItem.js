import React, { PureComponent } from 'react'
import { View, Platform, InteractionManager } from 'react-native'
import { connect } from 'react-redux'
import FontedText from '../../components/FontedText/index.js';
import CircularImage from '../../components/CircularImage/index.js';
import { pagePadding, smallBorderRadius } from '../../constants/Style.js';
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { mainColor, darkColor, grayColor } from '../../constants/Colors.js';
import RemoteImage from '../../components/RemoteImage/index.js';
import CustomTouchable from '../../components/CustomTouchable';
import TranslatedText from '../../components/TranslatedText/index.js';
import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';
import CustomModal from '../../components/CustomModal';
import { SelectEntity } from '../../utils/EntitySelector';
import ArrowItem from '../../components/ArrowItem';
import { LongToast } from '../../utils/Toast.js';
import { ExternalTranslate } from '../../utils/Translate.js';


class ProductItem extends PureComponent {
	constructor(props) {
		super(props)

		this.state = {
			Item: { ...this.props.item, Qty: 0, Options: this.props.item.Options ? this.props.item.Options : [] },
			Index: this.props.index
		}

	}


	renderAddButtons = () => {
		const item = this.state.Item
		const { ShowPOSButtons } = this.props
		// const { isAdded } = item
		const { Qty } = item

		if (ShowPOSButtons.Value == true) {
			return (
				<View
					style={{
						position: 'absolute',
						backgroundColor: darkColor,
						justifyContent: 'center',
						alignItems: 'center',
						paddingHorizontal: 12,
						paddingVertical: 5,
						borderRadius: smallBorderRadius,
					}}>
					<FontedText style={{ fontSize: 20, color: "white" }}>{Qty}</FontedText>
				</View>
			)
		}
		else if (ShowPOSButtons.Value == false) {
			return (
				<CustomTouchable
					style={{
						position: 'absolute',
						backgroundColor: darkColor,
						justifyContent: 'center',
						alignItems: 'center',
						paddingHorizontal: 12,
						paddingVertical: 5,
						borderRadius: smallBorderRadius,
					}}
					onPress={() => {
						this.onIncrement()
						// onPressAddProduct(item)
					}}>
					<FontedText style={{ fontSize: 20, color: 'white' }}>{Qty}</FontedText>
				</CustomTouchable>
			)
		}
	}

	onPressAddButton = () => {
		this.onIncrement()
	}

	onDecrement = () => {
		const { Qty } = this.state.Item

		if (Qty > 0) {
			this.setState({ Item: { ...this.state.Item, Qty: Qty - 1 } })
		}
	}

	onIncrement = () => {
		const { Qty } = this.state.Item
		this.setState({ Item: { ...this.state.Item, Qty: Qty + 1 } })
	}

	onPressLeftSide = () => {
		this.onIncrement()
	}

	onPressRightSide = () => {
		this.onDecrement()
	}

	onAddTocartPress = () => {

		const { onPressAddProduct } = this.props
		const { Qty } = this.state.Item

		if (this.state.Item.Qty == 0) {

			this.setState({ Item: { ...this.state.Item, Qty: Qty + 1 } }, () => {
				onPressAddProduct(this.state.Item)
			})
			this.setState({ productModalShown: false, Item: { ...this.state.Item, Qty: 0, Options: this.props.item.Options ? this.props.item.Options : [], Note: null } })
			LongToast('AddedToCart')

		} else {
			onPressAddProduct(this.state.Item)
			this.setState({ productModalShown: false, Item: { ...this.state.Item, Qty: 0, Options: this.props.item.Options ? this.props.item.Options : [], Note: null } })
			LongToast('AddedToCart')
		}

	}

	renderRemoveButtons = () => {
		// const { item } = this.props
		// const item = this.state.Item
		return (
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'flex-end',
				}}>
				<CustomTouchable
					onPress={() => {
						this.onDecrement()
					}}
					style={{
						backgroundColor: darkColor,
						justifyContent: 'center',
						alignItems: 'center',
						width: 35,
						height: 25,
						borderRadius: smallBorderRadius,
					}}>
					<Ionicons name={"ios-remove"} color={"white"} size={24} />
				</CustomTouchable>
			</View>
		)

	}

	renderIcons = (showText) => {

		const { Currency, imageSize, ShowPOSButtonsOnImage } = this.props
		const item = this.state.Item
		const {
			Name,
			Price,
			SalePrice
		} = item
		return (
			<View
				style={
					ShowPOSButtonsOnImage.Value == false ?
						{
							flexDirection: 'row',
							justifyContent: 'space-between',
							marginVertical: pagePadding,
							marginHorizontal: 2,
						} : {
							flexDirection: 'row',
							justifyContent: 'space-between',
							// marginVertical: pagePadding,
							width: '95%',
							marginLeft: 5,
							position: 'absolute',
							top: imageSize - 60,
						}}
			>
				<CustomTouchable
					onPress={this.onPressRightSide}
					onLongPress={() => {
						this.setState({ QtyModalShown: true, QtyInput: null })
					}}
					style={{
						backgroundColor: darkColor,
						justifyContent: 'center',
						alignItems: 'center',
						width: showText == true ? 60 : ShowPOSButtonsOnImage.Value == false ? (imageSize / 2) - 5 : (imageSize / 2) - 10,
						height: 25,
						borderRadius: smallBorderRadius,
					}}>
					<Ionicons name={"ios-remove"} color={"white"} size={24} />
				</CustomTouchable>

				{showText == true ?
					<View
						style={{
							flex: 1,
							alignItems: 'center'
						}}>
						<View
							style={{
								flex: 1,
							}}>
							<FontedText style={{ color: 'black', fontSize: 15, textAlign: 'center' }}>{Name}</FontedText>
						</View>

						<View
							style={{
								flex: 1,
								justifyContent: 'flex-end',
							}}>
							<FontedText style={{ color: 'black', fontSize: 15, }}>{Currency.Name}{SalePrice || Price}</FontedText>
						</View>
					</View> : null
				}


				<CustomTouchable
					onPress={this.onPressLeftSide}
					onLongPress={() => {
						this.setState({ QtyModalShown: true, QtyInput: null })
					}}

					style={{
						backgroundColor: darkColor,
						justifyContent: 'center',
						alignItems: 'center',
						width: showText == true ? 60 : ShowPOSButtonsOnImage.Value == false ? (imageSize / 2) - 5 : (imageSize / 2) - 10,
						height: 25,
						borderRadius: smallBorderRadius,
					}}>
					<Ionicons name={"ios-add"} color={"white"} size={24} />
				</CustomTouchable>

			</View>
		)
	}

	renderAddToCartButton = () => {
		const { ShowPOSButtonsOnImage, imageSize } = this.props
		return (
			<CustomTouchable
				onLongPress={() => { this.setState({ productModalShown: true }) }}
				onPress={() => { this.onAddTocartPress() }}
				style={
					ShowPOSButtonsOnImage.Value == false ? {
						backgroundColor: darkColor,
						justifyContent: 'center',
						alignItems: 'center',
						height: 25,
						felx: 1,
						borderRadius: smallBorderRadius,
						marginHorizontal: 2
					} : {
							position: 'absolute',
							backgroundColor: darkColor,
							justifyContent: 'center',
							alignItems: 'center',
							height: 25,
							borderRadius: smallBorderRadius,
							// alignSelf: 'center',
							padding: pagePadding,
							paddingVertical: 0,
							top: imageSize - 30,
							marginLeft: 5,
							width: '95%'
						}}>

				<TranslatedText
					text='AddToCard'
					style={{
						color: 'white'
					}}
				/>
			</CustomTouchable>
		)
	}

	renderProductModal = () => {
		const { translate } = this.props
		return (
			<CustomModal
				isVisible={this.state.productModalShown}
				onClose={() => {
					this.setState({ productModalShown: false })
				}}
				closeButton={true}>
				<ArrowItem
					onPress={() => {
						this.setState({ productModalShown: false })

						SelectEntity(this.props.navigation, data => {
							this.setState({ Item: { ...this.state.Item, Options: data }, productModalShown: true })
						}, 'Product/Options/Simple', `productId=${this.state.Item.Id}`, false, 2, this.state.Item.Options)
					}}
					style={{
						width: '100%',
						paddingHorizontal: 0,
					}}
					title={'Options'}
					info={this.state.Item.Options && this.state.Item.Options.length || translate('NoneSelected')} />

				<CustomInput
					placeholder="Note"
					value={this.state.Item.Note}
					onChangeText={(text) => {
						this.setState({
							Item: {
								...this.state.Item,
								Note: text
							}
						})
					}} />

				<CustomButton
					onPress={() => { this.onAddTocartPress() }}
					style={{
						marginTop: pagePadding,
					}}
					fullWidth={true}
					title='Add' />
			</CustomModal>
		)
	}


	renderQtyModal = () => {
		const { translate } = this.props
		const { QtyInput } = this.state
		return (
			<CustomModal
				isVisible={this.state.QtyModalShown}
				onClose={() => {
					this.setState({ QtyModalShown: false })
				}}
				closeButton={true}>

				<CustomInput
					placeholder="Qty"
					value={QtyInput}
					keyboardType="numeric"
					onChangeText={(text) => {
						this.setState({
							QtyInput: text
						})
					}} />

				<CustomButton
					onPress={() => {
						if (!QtyInput || QtyInput <= 0 || isNaN(QtyInput)) {
							LongToast(`${ExternalTranslate('Qty')}${ExternalTranslate('ShouldBeAPositiveNumber')}`, false)
							return
						}
						this.setState({
							Item: {
								...this.state.Item,
								Qty: parseInt(QtyInput)
							},
							QtyModalShown: false
						})
					}}
					style={{
						marginTop: pagePadding,
					}}
					fullWidth={true}
					title='SetQty' />
			</CustomModal>
		)
	}

	render() {
		const item = this.state.Item
		const index = this.state.Index

		const {
			imageSize,
			onLongPress,
			Currency,
			ShowTextOnImage,
			ShowPOSButtons,
			...restProps
		} = this.props

		const {
			Icon: {
				ImageUrl
			},
			Name,
			Price,
			SalePrice,
			Qty,
			Status
		} = item

		const disableAddToCart = (Status && Status.Id == 6) /*out of stock*/ || (Status && Status.Id == 7)/* not for sale*/ || (Status && Status.Id == 8)/* pending */;
		if (ShowTextOnImage) {
			const {
				Icon: {
					TextColor,
					RoundTextColor
				},
			} = item

			const {
				ShowPOSImage,
			} = this.props

			const color = ShowPOSImage.Value ? TextColor : "black"
			const backgroundColor = ShowPOSImage.Value ? RoundTextColor : "white"

			return (
				<View
					style={{
						justifyContent: 'center',
						alignItems: 'center',
						backgroundColor: 'white',
					}}
					{...restProps}>
					{disableAddToCart == false && this.renderProductModal()}
					{this.renderQtyModal()}
					{ShowPOSImage.Value ? <RemoteImage
						uri={ImageUrl}
						style={{
							width: imageSize,
							height: imageSize,
							borderColor: TextColor,
							borderWidth: 0.25,
						}}
						dimension={imageSize}
						wide={false} /> : <View
							style={{
								width: imageSize,
								height: imageSize,
								backgroundColor: grayColor,
								borderColor: "white",
								borderWidth: 0.25,
							}} />}

					<View
						style={{
							position: 'absolute',
							width: imageSize,
							height: imageSize,
							padding: 0,
							justifyContent: 'center',
							alignItems: 'flex-start',
						}}>
						{
							disableAddToCart == true ? <View
								style={{
									position: 'absolute',
									top: 0,
									backgroundColor: '#F00',
									padding: 1,
									zIndex: 2,
								}}>
								<CustomTouchable style={{}} >
									{Status && <FontedText style={{ color: 'black', fontSize: 10, }}>{Status.Name}</FontedText>}
								</CustomTouchable>
							</View> : null
						}
						<FontedText
							style={[{
								color,
								position: 'absolute',
								top: 0,
								fontSize: this.props.ShowPOSButtonsOnImage.Value == true ? 14 : 22,
								textAlign: 'center',
								backgroundColor,
								borderRadius: 0,
								padding: 5
							}, this.props.ShowPOSButtonsOnImage.Value == true ? { marginTop: 12 } : {}]}>{Name}{Qty >= 1 ? ` [${Qty}]` : ''} {Currency.Name}{SalePrice || Price}</FontedText>

						<FontedText
							style={{
								color,
								fontSize: 12,
								textAlign: 'center',
								marginTop: 2,
								marginBottom: 90
							}}></FontedText>
					</View>

					{ShowPOSButtons.Value == true ?
						disableAddToCart == false && this.renderIcons() : disableAddToCart == false &&
						<View
							style={{
								position: 'absolute',
								width: imageSize,
								height: imageSize,
								flexDirection: 'row',
							}}>
							<CustomTouchable
								onPress={this.onPressLeftSide}
								style={{
									flex: 1,
								}} />

							<CustomTouchable
								onPress={this.onPressRightSide}
								style={{
									flex: 1,
								}} />
						</View>}

					{disableAddToCart == false && this.props.ShowPOSButtonsOnImage.Value == true ?
						this.renderAddToCartButton() : disableAddToCart == false &&
						<View style={{ flex: 1, marginVertical: 5 }} >
							{this.renderAddToCartButton()}
						</View>}
				</View>
			)
		}
		else {
			return (
				<CustomTouchable
					activeOpacity={1}
					style={{
						justifyContent: 'center',
						alignItems: 'center',
						backgroundColor: 'white',
					}}
					{...restProps}>
					{disableAddToCart == false && this.renderProductModal()}
					{this.renderQtyModal()}
					<View
						style={{
							paddingTop: pagePadding,
							justifyContent: 'center',
							alignItems: 'center',
						}}>
						<CircularImage
							size={imageSize}
							uri={ImageUrl} />

						{disableAddToCart == false && this.renderAddButtons()}

					</View>

					{ShowPOSButtons.Value == true ?
						disableAddToCart == false && this.renderIcons(true) :
						<View
							style={{
								flex: 1,
								padding: pagePadding,
								flexDirection: 'row',
							}}>
							<View
								style={{
									flex: 1,
									paddingRight: 10,
									justifyContent: 'space-between',
								}}>
								<View
									style={{
										flex: 1,
									}}>
									<FontedText style={{ color: 'black', fontSize: 15, }}>{Name}</FontedText>
								</View>

								<View
									style={{
										flex: 1,
										justifyContent: 'flex-end',
									}}>
									<FontedText style={{ color: 'black', fontSize: 15, }}>{Currency.Name}{SalePrice || Price}</FontedText>
								</View>
							</View>
							{disableAddToCart == false && this.renderRemoveButtons()}

						</View>}
					<View>
						{disableAddToCart == false && this.renderAddToCartButton()}
					</View>
				</CustomTouchable>
			)
		}
	}
}

const mapStateToProps = ({
	login: {
		Currency,
	},
	runtime_config: {
		runtime_config: {
			screens: {
				Product_Details_09_5: {
					ShowTextOnImage,
				},
				Admin_Page_0_0: {
					ShowPOSImage,
					ShowPOSButtonsOnImage
				},
			},
		},
	},
}) => ({
	Currency,
	ShowTextOnImage,
	ShowPOSImage,
	ShowPOSButtonsOnImage
})

export default connect(mapStateToProps)(ProductItem)