import React, { PureComponent } from 'react';
import { View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import CustomTouchable from '../../components/CustomTouchable';
import FontedText from '../../components/FontedText/index.js';

export default class TranslationItem extends PureComponent {
	render() {
		const { item, onPress, onLongPress, ...restProps } = this.props
		const { key, CustomTranslation,TargetText } = item
		
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
						paddingVertical: 20
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
							{CustomTranslation ? <LinearGradient
								start={{ x: 0, y: 0 }}
								end={{ x: 1, y: 1 }}
								colors={['#4048EF', '#5A7BEF']}
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
							<FontedText style={{ color: '#140F26' }}>{key.length > 50 ? key.slice(0, 50) : key}</FontedText>
							<FontedText style={{ color: '#6C7B8A' }}>{TargetText.length > 50 ? TargetText.slice(0, 50) : TargetText}</FontedText>
						</View>
					</View>
				</View>
			</CustomTouchable>
		)
	}
}