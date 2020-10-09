import React, { PureComponent } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import FontedText from '../../components/FontedText/index.js';
import CircularImage from '../../components/CircularImage/index.js';
import { largePagePadding, pagePadding } from '../../constants/Style.js';
import RemoteImage from '../../components/RemoteImage/index.js';
import CustomTouchable from '../../components/CustomTouchable';
import { grayColor } from '../../constants/Colors.js';

class CategoryItem extends PureComponent {
	render() {
		const {
			item,
			onPress,
			imageSize,
			ShowTextOnImage,
			...restProps
		} = this.props

		const {
			Icon: {
				ImageUrl,
			},
			Name
		} = item

		if (ShowTextOnImage) {

			const {
				Icon: {
					TextColor,
					RoundTextColor
				},
			} = item

			const {
				ShowPOSImage,
			} = this.props

			const color = ShowPOSImage.Value ? TextColor : "black"
			const backgroundColor = ShowPOSImage.Value ? RoundTextColor : "white"

			return (
				<CustomTouchable
					onPress={() => { onPress(item) }}
					style={{
						justifyContent: 'center',
						alignItems: 'center',
						backgroundColor: 'white',
					}}
					{...restProps}>
					{ShowPOSImage.Value ? <RemoteImage
						uri={ImageUrl}
						style={{
							width: imageSize,
							height: imageSize,
							borderColor: TextColor,
							borderWidth: 0.25,
						}}
						dimension={imageSize}
						wide={false} /> : <View
							style={{
								width: imageSize,
								height: imageSize,
								backgroundColor: grayColor,
								borderColor: "white",
								borderWidth: 0.25,
							}} />}

					<View
						style={{
							position: 'absolute',
							width: imageSize,
							height: imageSize,
							padding: pagePadding,
							justifyContent: 'center',
							alignItems: 'center',
						}}>
						<FontedText
							style={{
								color,
								fontSize: 22,
								textAlign: 'center',
								backgroundColor,
								borderRadius: 5,
							}}>{Name}</FontedText>
					</View>
				</CustomTouchable>
			)
		}
		else {
			return (
				<CustomTouchable
					onPress={() => { onPress(item) }}
					style={{
						justifyContent: 'center',
						alignItems: 'center',
						backgroundColor: 'white',
						paddingHorizontal: largePagePadding,
						paddingVertical: pagePadding,
					}}
					{...restProps}>
					<CircularImage
						size={imageSize}
						uri={ImageUrl} />

					<View
						style={{
							padding: largePagePadding,
							justifyContent: 'center',
							alignItems: 'center',
						}}>
						<FontedText style={{ color: 'black' }}>{Name}</FontedText>
					</View>
				</CustomTouchable>
			)
		}
	}
}

const mapStateToProps = ({
	runtime_config: {
		runtime_config: {
			screens: {
				Product_Details_09_5: {
					ShowTextOnImage,
				},
				Admin_Page_0_0: {
					ShowPOSImage,
				},
			},
		},
	},
}) => ({
	ShowTextOnImage,
	ShowPOSImage,
})

export default connect(mapStateToProps)(CategoryItem)