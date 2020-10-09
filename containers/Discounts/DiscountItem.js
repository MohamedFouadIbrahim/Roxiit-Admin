import React, { PureComponent } from 'react'
import { View } from 'react-native'
import FontedText from '../../components/FontedText/index.js';
import LinearGradient from 'react-native-linear-gradient';
import { secondTextColor } from '../../constants/Colors.js';
import CustomTouchable from '../../components/CustomTouchable/index.js';

export default class DiscountItem extends PureComponent {
	render() {
		const { item, onPress, onLongPress, ...restProps } = this.props
		const { Name, Type, isActive, CouponCode } = item

		return (
			<CustomTouchable
				onPress={() => { onPress(item) }}
				onLongPress={() => { onLongPress(item) }}
				{...restProps}>
				<View
					style={{
						backgroundColor: 'white',
						paddingRight: 20,
						flexDirection: 'row',
						justifyContent: 'space-between',
						alignItems: 'center',
						height: 95,
					}}>
					<View
						style={{
							flex: 1,
							flexDirection: 'row',
							alignItems: 'center',
						}}>
						<View
							style={{
								width: 40,
								justifyContent: 'center',
								alignItems: 'center',
							}}>
							{isActive ? <LinearGradient
								start={{ x: 0, y: 0 }}
								end={{ x: 1, y: 1 }}
								colors={['#009900', '#99ff99']}
								style={{
									height: 10,
									width: 10,
									borderRadius: 5,
								}} /> : <LinearGradient
									start={{ x: 0, y: 0 }}
									end={{ x: 1, y: 1 }}
									colors={['#ECF0F5', '#CCD6E6']}
									style={{
										height: 10,
										width: 10,
										borderRadius: 5,
									}} />}
						</View>

						<View
							style={{
								flex: 1,
								justifyContent: 'center',
								paddingRight: 10,
							}}>
							<View style={{ justifyContent: 'space-between', flexDirection: 'row' }} >
								<FontedText style={{ color: 'black' }}>{Name.length > 22 ? `${Name.slice(0, 22)}...` : Name}</FontedText>
								<FontedText style={{ color: 'black' }}>{CouponCode.toUpperCase()}</FontedText>
							</View>
							<FontedText style={{
								// color: '#949EA5'
								color: secondTextColor
							}}>{Type.Name}</FontedText>
						</View>
					</View>
				</View>
			</CustomTouchable>
		)
	}
}