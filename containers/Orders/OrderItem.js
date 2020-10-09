import React, { PureComponent } from 'react';
import { I18nManager, View, Clipboard, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import CircularImage from '../../components/CircularImage/index.js';
import CustomTouchable from '../../components/CustomTouchable';
import FontedText from '../../components/FontedText/index.js';
import TranslatedText from '../../components/TranslatedText/index.js';
import { mainColor, secondTextColor, secondColor } from '../../constants/Colors.js';
import { largeBorderRadius, largePagePadding, pagePadding } from '../../constants/Style.js';
import { formatDate, formatTime } from '../../utils/Date.js';
import { TrimText } from '../../utils/Text.js';
import { LongToast } from '../../utils/Toast.js';
import AntDesign from 'react-native-vector-icons/AntDesign';

class OrderItem extends PureComponent {

	render() {
		const { item, index, onPress, onLongPress, onPressTypeSelector, onAccept, onDecline, onAcceptDriver, onDeclineDriver, isDriverMode, onPressImage, screenWidth, screenHeight, ...restProps } = this.props
		const { Name, OrderCode, Status, TotalPrice, ProductImage, CreateDate, DriverAcceptanceStatus, Customer: { FullName }, Courier, Currency, SubStore } = item
		const ShowCourierInList = this.props.ShowCourierInList.Value

		return (
			<CustomTouchable
				onPress={() => { onPress(item) }}
				onLongPress={() => { onLongPress(item) }}
				{...restProps}>
				<View
					style={{
						backgroundColor: ((!isDriverMode && item.Status.Id == 1) || (isDriverMode && item.DriverAcceptanceStatus == null)) ? '#e6e6e6' : 'white',
						// backgroundColor: 'white',
						flexDirection: 'row',
						paddingHorizontal: largePagePadding,
						paddingVertical: pagePadding,
					}}
				>

					{((!isDriverMode && item.Status.Id == 1) || (isDriverMode && item.DriverAcceptanceStatus == null)) && <View
						style={{
							width: 10,
							height: 10,
							borderRadius: 5,
							backgroundColor: secondColor,
							position: 'absolute',
							left: 7,
							top: 30
						}}
					/>}
					<CustomTouchable onPress={() => { onPressImage(item) }} >
						<CircularImage
							// uri={ImageUrl}
							uri={ProductImage && ProductImage.ImageUrl ? ProductImage.ImageUrl : null}
						/>
					</CustomTouchable>
					<View
						style={{ paddingLeft: largePagePadding, marginHorizontal: I18nManager.isRTL ? 10 : 0, flex: 1 }}>

						<View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
							<View style={{ flex: 5 }} >
								<View style={{ flexDirection: 'row', alignItems: 'center' }}>
									<FontedText
										onPress={() => {
											Clipboard.setString(OrderCode)
											LongToast('Copied')
										}} style={{ color: 'black', fontWeight: 'bold' }}>{`#${OrderCode}`}</FontedText>
									{ShowCourierInList && <FontedText style={{ fontSize: 10, color: 'black' }}>{'  *  '}</FontedText>}
									{ShowCourierInList && <FontedText style={{ fontSize: 10, color: 'black' }}>{TrimText(Courier.Name, 50)}</FontedText>}
								</View>
								<FontedText style={{ color: 'black' }}>{TrimText(Name, 29)}</FontedText>
								<FontedText >{TrimText(FullName, 29)}</FontedText>
							</View>
							<FontedText style={{
								color: secondTextColor,
								flex: 2, textAlign: 'center', lineHeight: 20
							}}>{formatDate(CreateDate)} {formatTime(CreateDate)}</FontedText>

							<CustomTouchable onPress={() => { onLongPress(item) }} >
								<MaterialIcons
									name={`more-vert`}
									size={20}
								/>
							</CustomTouchable>
						</View>

						<View
							style={{ flexDirection: 'row', justifyContent: 'space-between' }}
						>
							<View style={{ flexDirection: 'row' }}>
								<FontedText style={{
									color: secondTextColor,
									marginTop: 5
								}}>{`${TotalPrice}${Currency ? Currency.Name : ''}`}</FontedText>

								{SubStore && SubStore.Id != 0 ?
									<View style={{ flexDirection: 'row', marginTop: 6, marginLeft: 0 }}>
										<AntDesign
											style={{ marginTop: 2 }}
											name={`user`}
											size={12} />
										<FontedText numberOfLines={1} style={{ color: 'black', fontSize: 12, paddingLeft: 2 }}>{TrimText(SubStore.Name, 15)}</FontedText>
									</View> : null}
							</View>

							<CustomTouchable
								disabled={!this.props.AcceptRejectOrderFromIndex.Value}
								onPress={() => {
									onPressTypeSelector(item, index)
								}}
								style={{
									flexDirection: 'row',
									justifyContent: 'center',
									alignItems: 'center',
									paddingHorizontal: 10,
									paddingVertical: 4,
									backgroundColor: mainColor,
									borderRadius: largeBorderRadius,
									marginTop: 15,
									maxWidth: 250
								}}>
								<FontedText style={{ color: 'white', fontSize: 10, textAlign: 'left', paddingLeft: 5 }}>{Status.Name}</FontedText>

								{this.props.AcceptRejectOrderFromIndex.Value && <Ionicons
									name={"md-arrow-dropdown"}
									size={18}
									color={'white'}
									style={{
										marginLeft: 5,
									}} />}
							</CustomTouchable>
						</View>

					</View>

				</View>
				{Status && Status.Id == 1 && isDriverMode != true && this.props.AcceptRejectOrderFromIndex.Value == true && <View style={{ justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: largePagePadding, marginBottom: 5, backgroundColor: '#e6e6e6' }} >
					<CustomTouchable
						onPress={onAccept}
						style={{
							width: screenWidth / 2.5,
							justifyContent: 'center',
							alignItems: 'center',
							paddingHorizontal: 10,
							paddingVertical: 6,
							backgroundColor: '#009688',
							borderRadius: largeBorderRadius,
							marginTop: 15,
							marginBottom: 5,
						}}>
						<TranslatedText style={{ color: 'white', fontSize: 12, }} text='Accept' />
					</CustomTouchable>

					<CustomTouchable
						onPress={onDecline}
						style={{
							width: screenWidth / 2.5,
							justifyContent: 'center',
							alignItems: 'center',
							paddingHorizontal: 10,
							paddingVertical: 6,
							backgroundColor: '#F44336',
							borderRadius: largeBorderRadius,
							marginTop: 15,
							marginBottom: 5,
						}}>
						<TranslatedText style={{ color: 'white', fontSize: 12, }} text='Decline' />
					</CustomTouchable>
				</View>}

				{DriverAcceptanceStatus == null && isDriverMode == true && this.props.AcceptRejectOrderFromIndex.Value == true && <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginHorizontal: largePagePadding, marginBottom: 5 }} >
					<CustomTouchable
						onPress={onAcceptDriver}
						style={{
							width: screenWidth / 2.5,
							justifyContent: 'center',
							alignItems: 'center',
							paddingHorizontal: 10,
							paddingVertical: 6,
							backgroundColor: '#009688',
							borderRadius: largeBorderRadius,
							marginTop: 15,
							marginBottom: 5,
						}}>
						<TranslatedText style={{ color: 'white', fontSize: 12, }} text='Accept' />
					</CustomTouchable>

					<CustomTouchable
						onPress={onDeclineDriver}
						style={{
							width: screenWidth / 2.5,
							justifyContent: 'center',
							alignItems: 'center',
							paddingHorizontal: 10,
							paddingVertical: 6,
							backgroundColor: '#F44336',
							borderRadius: largeBorderRadius,
							marginTop: 15,
							marginBottom: 5,
						}}>
						<TranslatedText style={{ color: 'white', fontSize: 12, }} text='Decline' />
					</CustomTouchable>
				</View>}

			</CustomTouchable>
		)
	}
}

const mapStateToProps = ({
	runtime_config: {
		runtime_config: {
			screens: {
				Admin_Page_0_0: {
					AcceptRejectOrderFromIndex,
					ShowCourierInList,
				}
			}
		}
	},
}) => ({
	AcceptRejectOrderFromIndex,
	ShowCourierInList,
})
export default connect(mapStateToProps)(OrderItem)