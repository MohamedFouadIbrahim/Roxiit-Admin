import React, { PureComponent } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import FontedText from '../../components/FontedText/index.js';
import { largePagePadding, pagePadding, largeBorderRadius } from '../../constants/Style.js';
import { mainColor, secondTextColor } from '../../constants/Colors.js';
import Ionicons from 'react-native-vector-icons/Ionicons'
import CustomTouchable from '../../components/CustomTouchable';

export default class WarehouseItem extends PureComponent {
	render() {

		const { item, onPress, onLongPress, move, isActive, ...restProps } = this.props
		const { Name, Description, Id, Country, City } = item;


		return (
			<CustomTouchable
				onPress={() => { onPress(item) }}
				onLongPress={() => { onLongPress(item) }}
				{...restProps}>
				<View
					style={{
						paddingHorizontal: largePagePadding,
						paddingVertical: pagePadding + 5,
						// alignItems: 'center'
						justifyContent: 'space-between',
						flexDirection: "row",
					}}>
					<View>
						<FontedText style={{ color: "black" }}>{Name}</FontedText>
						<View style={{ flexDirection: "row" }}>
							<FontedText style={{ color: "black" }}>{`${Country.Name.slice(0, 15)}..`}</FontedText>
							<Text style={{ color: "black", paddingHorizontal: 5 }}>
								-
              				</Text>
							<FontedText style={{ color: "black" }}>{`${City.Name.slice(0, 15)}..`}</FontedText>
						</View>
					</View>

					<TouchableOpacity
						style={[
							{
								flex: 1,
								flexDirection: "row",
								borderBottomColor: "#EEE",
								// borderBottomWidth: 0.3,
								// backgroundColor: "white",
								flexDirection: "row",
								justifyContent: "flex-end",
								alignItems: "center"
							}
						]}
						onLongPress={move}
					>
						<Ionicons
							name={`ios-menu`}
							size={28}
							// color={'#949EA5'}
							color={secondTextColor}
						/>
					</TouchableOpacity>
				</View>
			</CustomTouchable>
		)
	}
}