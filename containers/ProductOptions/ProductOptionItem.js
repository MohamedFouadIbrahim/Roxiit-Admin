import React, { PureComponent } from 'react';
import { View } from 'react-native';
import CustomTouchable from '../../components/CustomTouchable';
import FontedText from '../../components/FontedText/index.js';
import { secondColor } from '../../constants/Colors.js';
import { largePagePadding } from '../../constants/Style.js';
export default class ProductOptionItem extends PureComponent {


	render() {
		const { item, onPress, onLongPress, ...restProps } = this.props

		return (
			<CustomTouchable
				onPress={() => { onPress(item) }}
				onLongPress={() => { onLongPress(item) }}
				{...restProps}>
				<View
					style={{
						backgroundColor: '#FFF',
						flexDirection: 'row',
						padding: largePagePadding,
						justifyContent: 'space-between'
					}}>

					<View style={{ flex: 0.9 }} >
						<FontedText style={{ fontWeight: 'bold', marginBottom: 5 }}>{item.Name}</FontedText>
						<FontedText>{item.Description}</FontedText>
					</View>

					<View  >
						<FontedText style={{ color: 'white', padding: 5, backgroundColor: secondColor, borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}  >{item.Type.Name}</FontedText>
					</View>

				</View>
			</CustomTouchable>
		)
	}
}