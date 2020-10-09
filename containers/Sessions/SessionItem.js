import React, { PureComponent } from 'react'
import { View } from 'react-native'
import FontedText from '../../components/FontedText/index.js';
import { formatDate, formatTime } from '../../utils/Date.js';
import { secondColor } from '../../constants/Colors.js';
import CustomTouchable from '../../components/CustomTouchable';
export default class SessionItem extends PureComponent {
	render() {
		const { item, onPress, onLongPress, ...restProps } = this.props

		return (
			<CustomTouchable
				onLongPress={() => { onLongPress(item) }}
				{...restProps}>
				<View
					style={[
						{
							flex: 1,
							flexDirection: "row",
							paddingVertical: 15,
							paddingHorizontal: 20,
							borderBottomColor: "#EEE",
							borderBottomWidth: .3,
							backgroundColor: 'white',
							flexDirection: 'row',
							justifyContent: 'center',
							alignItems: 'center'
						},
					]}>
					<View style={{ flex: 1 }}>
						<FontedText style={{ fontWeight: "500", marginBottom: 5, fontSize: 18, color: "#140F26" }}>{`${item.SessionSource.Name} . ${item.Country.Name}, ${item.City}`}</FontedText>
						<FontedText style={{ color: "#6C7B8A" }}>{`${item.IP} . ${item.devicemodel}`}</FontedText>
						<FontedText style={{ color: "#6C7B8A" }}>{`${formatDate(item.ExpirationDate)} - ${formatTime(item.ExpirationDate)}`}</FontedText>
					</View>
					<View style={{ flex: .25 }}>
						<View style={{ backgroundColor: item.IsActive ? secondColor : '#d9dbdd', borderRadius: 4, marginBottom: 5 }}>
							<FontedText style={{ fontSize: 12, color: item.IsActive ? "#FFF" : "#000", textAlign: 'center', paddingVertical: 4, paddingHorizontal: 6 }}>active</FontedText>
						</View>
						<View style={{ backgroundColor: item.IsCurrent ? "#07ba66" : '#d9dbdd', borderRadius: 4, marginTop: 5 }}>
							<FontedText style={{ fontSize: 12, color: item.IsCurrent ? "#FFF" : "#000", textAlign: 'center', paddingVertical: 4, paddingHorizontal: 6 }}>current</FontedText>
						</View>
					</View>
				</View>
			</CustomTouchable>
		)
	}
}