import React, { PureComponent } from 'react'
import { View, Text } from 'react-native'
import FontedText from '../../components/FontedText/index.js';
import CircularImage from '../../components/CircularImage/index.js';
import { largePagePadding, pagePadding, largeBorderRadius, smallPagePadding } from '../../constants/Style.js';
import TranslatedText from '../../components/TranslatedText/index.js';
import { screenWidth, screenHeight } from '../../constants/Metrics';
import { secondTextColor, secondColor } from '../../constants/Colors.js';
import CustomTouchable from '../../components/CustomTouchable';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';

class ProductItem extends PureComponent {
	render() {
		const { item, onPress, onLongPress, onAccept, onDecline, ...restProps } = this.props
		const { Icon: { ImageUrl }, Name, ShortDescription, Price, SalePrice, Status, SubStore, Currency, ValidityExtendRequest } = item

		return (
			<CustomTouchable
				onPress={() => { onPress(item) }}
				onLongPress={() => { onLongPress(item) }}
				{...restProps}>
				<View
					style={{
						backgroundColor: '#FFF',
						justifyContent: 'center',
						alignItems: 'center',
						flexDirection: 'row',
						paddingVertical: pagePadding,
						paddingHorizontal: largePagePadding,
						paddingRight: smallPagePadding,
					}}>

					{ValidityExtendRequest || Status.Id == 8 ? <View
						style={{
							width: 10,
							height: 10,
							borderRadius: 5,
							backgroundColor: secondColor,
							position: 'absolute',
							left: 7,
							top: 28
						}}
					/> : null}
					<View style={{ justifyContent: 'center', alignItems: 'center', flex: .3 }}>
						<Text style={{ textDecorationLine: SalePrice ? 'line-through' : 'none', color: SalePrice ? 'red' : 'black', paddingBottom: 5, paddingTop: 10 }} >{Price} {(Currency ? Currency.Name : "")}</Text>
						{SalePrice !== 0 && SalePrice != null ? < FontedText >
							{SalePrice} {(Currency ? Currency.Name : "")}
						</FontedText> : null}
					</View>
					<CircularImage
						uri={ImageUrl} />
					<View
						style={{
							flex: 1,
							paddingLeft: largePagePadding,
							alignItems: 'flex-start',
							justifyContent: 'center'
						}}>
						<FontedText numberOfLines={2} style={{ color: 'black' }}>{Name}</FontedText>
						{ShortDescription && ShortDescription != '' ? <FontedText numberOfLines={1} style={{ color: secondTextColor }}>{ShortDescription}</FontedText> : null}
						{SubStore && SubStore.Name && SubStore.Name != '' ?
							<View style={{ flexDirection: 'row', marginTop: 2, alignItems: 'center' }}>
								<AntDesign
									name={`user`}
									size={12} />
								<FontedText numberOfLines={1} style={{ color: 'black', fontSize: 12, paddingLeft: 2 }}>{SubStore.Name}</FontedText>
							</View> : null}
					</View>
					<CustomTouchable
						onPress={() => { onLongPress(item) }}
						style={{
							alignSelf: 'flex-start'
						}} >
						<MaterialIcons
							name={`more-vert`}
							size={20} />
					</CustomTouchable>

				</View>
				{
					Status && Status.Id == 8 && <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginHorizontal: largePagePadding, marginBottom: 5 }} >
						<CustomTouchable
							onPress={() => { onAccept && onAccept() }}
							style={{
								// flexDirection: 'row',
								width: screenWidth / 2.5,
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
							onPress={() => { onDecline && onDecline() }}
							style={{
								width: screenWidth / 2.5,
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
				}
			</CustomTouchable >
		)
	}
}


export default ProductItem