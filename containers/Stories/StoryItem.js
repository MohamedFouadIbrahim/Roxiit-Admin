import React, { PureComponent } from 'react'
import { View } from 'react-native'
import FontedText from '../../components/FontedText/index.js';
import { largePagePadding, pagePadding } from '../../constants/Style.js';
import { formatDate } from '../../utils/Date.js';
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import { screenWidth, screenHeight } from '../../constants/Metrics.js';
import TranslatedText from '../../components/TranslatedText/index.js';
import RemoteImage from '../../components/RemoteImage/index.js';
import CustomTouchable from '../../components/CustomTouchable';

export default class StoryItem extends PureComponent {
	render() {
		const { item, onPress, onLongPress, ...restProps } = this.props
		const { Id, Media: { ImageUrl }, Text, Views, Likes, CreateDate } = item

		return (
			<CustomTouchable
				onPress={() => { onPress(item) }}
				onLongPress={() => { onLongPress(item) }}
				{...restProps}>
				<View style={{}}>
					<View
						style={{
							flexDirection: 'row',
							justifyContent: 'space-between',
							padding: largePagePadding,
							borderBottomColor: '#f3f4f5',
							borderBottomWidth: 1,
						}}>
						<View
							style={{
								flex: 1,
								flexDirection: 'row',
								alignItems: 'center',
							}}>
							<FontedText style={{ color: "#6C7B8A", fontSize: 12 }}>{Text}</FontedText>
						</View>

						<View
							style={{
								flexDirection: 'row',
								justifyContent: 'flex-end',
								marginLeft: pagePadding,
							}}>
							<FontedText style={{ color: "#6C7B8A", fontSize: 12 }}>{formatDate(CreateDate)}</FontedText>

							<EvilIcons
								name={"clock"}
								size={16}
								color={'#6C7B8A'}
								style={{ marginLeft: pagePadding }} />
						</View>
					</View>

					<RemoteImage
						source={{ uri: ImageUrl }}
						wide={true}
						dimension={screenWidth}
						style={{
							width: screenWidth,
							height: screenHeight * 0.3,
						}} />

					<View
						style={{
							flexDirection: 'row',
							justifyContent: 'space-between',
							alignItems: 'center',
							paddingHorizontal: largePagePadding,
						}}>
						<View style={{ flexDirection: 'row', alignItems: 'center', paddingRight: 3 }}>
							<View style={{ flexDirection: 'row', alignItems: 'center', }}>
								<EvilIcons
									name={"like"}
									size={16}
									color={'#6C7B8A'} />

								<FontedText style={{ color: "#131315", fontSize: 12, marginLeft: 5 }}>{Likes}</FontedText>
								<TranslatedText style={{ color: "#a3acb6", fontSize: 12, marginLeft: 4 }} text="Likes" />
							</View>

							<View
								style={{
									flexDirection: 'row',
									alignItems: 'center',
									marginLeft: 8,
									paddingVertical: largePagePadding,
								}}>
								<EvilIcons
									name={"eye"}
									size={16}
									color={'#6C7B8A'} />

								<FontedText style={{ color: "#131315", fontSize: 12, marginLeft: 5 }}>{Views}</FontedText>
								<TranslatedText style={{ color: "#a3acb6", fontSize: 12, marginLeft: 4 }} text="Views" />
							</View>
						</View>
					</View>
				</View>
			</CustomTouchable>
		)
	}
}