import React, { PureComponent } from 'react'
import { View } from 'react-native'
import FontedText from '../../components/FontedText/index.js';
import CircularImage from '../../components/CircularImage/index.js';
import { largePagePadding, pagePadding, xmediumPagePadding } from '../../constants/Style.js';
import { secondTextColor } from '../../constants/Colors.js';
import CustomTouchable from '../../components/CustomTouchable';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';

export default class UserItem extends PureComponent {
	render() {
		const { item, onPress, onLongPress, ...restProps } = this.props
		const { Icon: { ImageUrl }, FirstName, SecondeName, Country, Role, SubStore } = item

		return (
			<CustomTouchable
				onPress={() => { onPress(item) }}
				onLongPress={() => { onLongPress(item) }}
				{...restProps}>
				<View
					style={{
						backgroundColor: 'white',
						flexDirection: 'row',
						paddingHorizontal: xmediumPagePadding,
						paddingVertical: pagePadding,
					}}>
					<CircularImage
						uri={ImageUrl} />

					<View
						style={{
							flex: 1,
							paddingLeft: largePagePadding,
						}}>
						<FontedText style={{ color: 'black' }}>{FirstName} {SecondeName}</FontedText>
						<FontedText style={{
							// color: '#949EA5'
							color: secondTextColor
						}}>{Country.Name}</FontedText>
						<View style={{
							flexDirection: 'row',
							alignItems: 'center',
							marginTop: 2
						}}>

							{SubStore && SubStore.Id && SubStore.Id != 0 ?
								<View style={{ flexDirection: 'row', marginRight: 5, }}>
									<AntDesign
										style={{ alignSelf: 'center' }}
										name={`user`}
										size={12} />
									<FontedText numberOfLines={1} style={{ color: secondTextColor, fontSize: 12, paddingLeft: 2 }}>{SubStore.Name}</FontedText>
								</View> : null}
							<View style={{
								flexDirection: 'row',
							}}>
								<MaterialIcons
									style={{ alignSelf: 'center' }}
									name={`work`}
									size={15} />
								<FontedText style={{
									color: secondTextColor,
									paddingLeft: 2
								}}>{Role.Name}</FontedText>
							</View>
						</View>
					</View>
					<CustomTouchable
						onPress={() => { onLongPress(item) }} >
						<MaterialIcons
							name={`more-vert`}
							size={20} />
					</CustomTouchable>

				</View>
			</CustomTouchable>
		)
	}
}