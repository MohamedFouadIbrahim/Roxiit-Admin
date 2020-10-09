import React, { PureComponent } from 'react'
import { View } from 'react-native'
import FontedText from '../../components/FontedText/index.js';
import CircularImage from '../../components/CircularImage/index.js';
import { largePagePadding, pagePadding, mediumPagePadding } from '../../constants/Style.js';
import { secondTextColor } from '../../constants/Colors.js';
import CustomTouchable from '../../components/CustomTouchable';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

export default class CustomerItem extends PureComponent {
	render() {
		const { item, onPress, onLongPress, ...restProps } = this.props
		const { Media: { ImageUrl }, FullName, Type, Status, Language, Substore } = item

		return (
			<CustomTouchable
				onPress={() => { onPress(item) }}
				onLongPress={() => { onLongPress(item) }}
				{...restProps}>
				<View
					style={{
						backgroundColor: 'white',
						flexDirection: 'row',
						paddingHorizontal: mediumPagePadding,
						paddingVertical: pagePadding,
					}}>
					<CircularImage
						uri={ImageUrl} />

					<View
						style={{
							flex: 1,
							paddingLeft: largePagePadding,
						}}>
						<FontedText style={{ color: 'black' }}>{FullName}</FontedText>
						<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} >
							<FontedText style={{
								// color: '#949EA5'
								color: secondTextColor
							}}>{Type.Name}</FontedText>
							<FontedText style={{
								color: secondTextColor
								// color: '#949EA5'
							}}>{Status.Name}</FontedText>
						</View>
						<View style={{ flexDirection: 'row' }}>
							{Substore && Substore.Id && Substore.Id != 0 ?
								<View style={{ flexDirection: 'row', marginRight: 5, marginTop: 2 }}>
									<AntDesign
										style={{ alignSelf: 'center' }}
										name={`user`}
										size={12} />
									<FontedText numberOfLines={1} style={{ color: secondTextColor, fontSize: 12, paddingLeft: 2 }}>{Substore.Name}</FontedText>
								</View> : null}
							<View style={{ flexDirection: 'row' }}>
								<SimpleLineIcons
									style={{ alignSelf: 'center' }}
									name={`globe`}
									size={12} />
								<FontedText style={{
									// color: '#949EA5'
									color: secondTextColor,
									paddingLeft: 2
								}}>{Language.Name}</FontedText>
							</View>
						</View>
					</View>
					<CustomTouchable onPress={() => { onLongPress(item) }} style={{ paddingLeft: 12 }}>
						<MaterialIcons
							size={20}
							name={`more-vert`} />
					</CustomTouchable>
				</View>
			</CustomTouchable>
		)
	}
}