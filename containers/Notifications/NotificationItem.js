import React, { PureComponent } from 'react'
import { View} from 'react-native'
import FontedText from '../../components/FontedText/index.js';
import LinearGradient from 'react-native-linear-gradient';
import { formatDate, formatTime } from '../../utils/Date.js';
import { secondTextColor } from '../../constants/Colors.js';
import CustomTouchable from '../../components/CustomTouchable';

export default class NotificationItem extends PureComponent {
	render() {
		const { item, onPress, ...restProps } = this.props

		return (
			<CustomTouchable
				onPress={() => { onPress(item) }}
				{...restProps}>
				<View
					style={{
						flex: 1,
						alignItems: 'center',
					}}>
					<LinearGradient
						start={{ x: 0, y: 0 }}
						end={{ x: 1, y: 1 }}
						colors={[item.notificationType.Color, item.notificationType.Color]}
						style={{
							height: 10,
							width: 10,
							borderRadius: 5,
						}} />
				</View>

				<View style={{ flex: 6, }}>
					<FontedText style={{ color: '#131315', fontSize: 16, paddingTop: 0, }}>{item.Title}</FontedText>
					<FontedText style={{
								color: secondTextColor
								// color: '#949EA5'
					}}>{item.Body}</FontedText>
				</View>

				<View
					style={{
						flex: 3,
						alignItems: 'center',
					}}>
					<View
						style={{
							alignItems: 'flex-start',
							marginHorizontal: 20,
							justifyContent: 'center'
						}}>
						<FontedText numberOfLines={2} style={{ color: '#6C7B8A', paddingTop: 0, fontSize: 13, textAlign: 'center' }}>{formatDate(item.CreateDate)}</FontedText>
						<FontedText numberOfLines={2} style={{ color: '#6C7B8A', paddingTop: 0, fontSize: 13, textAlign: 'center' }}>{formatTime(item.CreateDate)}</FontedText>
					</View>
				</View>
			</CustomTouchable>
		)
	}
}