import React, { PureComponent } from 'react'
import { View } from 'react-native'
import FontedText from '../../components/FontedText/index.js';
import { largePagePadding } from '../../constants/Style.js';
import TranslatedText from '../../components/TranslatedText/index.js';
import { secondColor } from '../../constants/Colors.js';
import CustomTouchable from '../../components/CustomTouchable';

export default class CourierItem extends PureComponent {
	render() {
		const { item, onPress, onLongPress, ...restProps } = this.props
		const { Name, isConfigured } = item;

		return (
			<CustomTouchable
				onPress={() => { onPress(item) }}
				onLongPress={() => { onLongPress(item) }}
				style={{
					flex: 1,
					backgroundColor: 'white',
					flexDirection: 'row',
					paddingHorizontal: largePagePadding,
					paddingVertical: largePagePadding,
					justifyContent: 'space-between'
				}}
				{...restProps}>

				<View
					style={{
						// flex: 1,
						justifyContent: 'center',
					}}>
					<FontedText style={{ color: 'black' }}>{Name}</FontedText>
				</View>

				{isConfigured === true ?
					<View style={{ backgroundColor: secondColor, borderRadius: 4, justifyContent: 'center', }}>
						<TranslatedText style={{ fontSize: 12, color: "white", textAlign: 'center', paddingVertical: 4, paddingHorizontal: 6 }} text="Active" />
					</View> : null
				}
			</CustomTouchable>
		)
	}
}