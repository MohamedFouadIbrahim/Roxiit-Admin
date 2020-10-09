import React, { PureComponent } from 'react'
import { View, Switch } from 'react-native'
import FontedText from '../../components/FontedText/index.js';
import { largePagePadding } from '../../constants/Style.js';
import CustomTouchable from '../../components/CustomTouchable';

export default class CurrencyListItem extends PureComponent {
	render() {
		const { item, onPress, onLongPress, onSwitchValueChange, ...restProps } = this.props

		return (
			<CustomTouchable
				onPress={() => { onPress(item) }}
				onLongPress={() => { onLongPress(item) }}
				{...restProps}>
				<View 
					style={{
						backgroundColor: '#FFF',
						flexDirection: 'row',
						paddingVertical: largePagePadding,
					}}>
					<View style={{ flex: .3, justifyContent: 'center', alignItems: 'center', }}>
						{
							item.customPrice ? <FontedText style={{ fontSize: 20, fontWeight: 'bold', color: "#08CDB0" }}>{`$ ${item.customPrice}`}</FontedText> : null
						}
						<FontedText style={[{ fontSize: 20, fontWeight: 'bold', color: "#08CDB0", }, item.customPrice ? { color: "#080516", fontSize: 18, opacity: .7, textDecorationLine: 'line-through', } : {}]}>{`$ ${item.OnUsdEqual}`}</FontedText>
					</View>

					<View style={{ flexDirection: 'column', flex: 1, marginRight: largePagePadding }}>
						<FontedText style={{ fontWeight: 'bold', marginBottom: 5 }}>{item.Name}</FontedText>
						<FontedText>{item.Description}</FontedText>
					</View>

					<View style={{ flex: .3, justifyContent: 'center', alignItems: 'center', }}>
						<Switch 
							onValueChange={() => { onSwitchValueChange(item) }}
							value={item.isSelected} />
					</View>
				</View>
			</CustomTouchable>
		)
	}
}