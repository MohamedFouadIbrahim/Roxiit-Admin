import React from 'react'
import { View, I18nManager } from 'react-native'
import TranslatedText from '../TranslatedText';
import FontedText from '../FontedText';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { largePagePadding } from '../../constants/Style';
import { mainTextColor, secondTextColor } from '../../constants/Colors';
import CustomTouchable from '../CustomTouchable';

export default ArrowItem = (props) => {
	const { title, style, subtitle = "", info, arrowless = false, customIcon, rightComponent, titleStyle, cancelEnabled = false, ...buttonProps } = props

	return (
		<CustomTouchable
			{...buttonProps}
			style={[{
				paddingVertical: 15,
				paddingHorizontal: largePagePadding,
				flexDirection: 'row',
				justifyContent: 'space-between',
				alignItems: 'center',
				backgroundColor: 'white',
			}, style]}>
			<View
				style={{
					justifyContent: 'center',
				}}>
				<TranslatedText style={[{
					// color: '#949EA5'
					color: secondTextColor
				}, titleStyle]} text={title} />
				{
					subtitle != "" ?
						<TranslatedText style={{
							// color: '#949EA5',
							color: secondTextColor,
							fontSize: 14
						}} text={subtitle} />
						: null
				}
			</View>

			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					paddingLeft: 10,
				}}>
				{rightComponent || <FontedText style={{ fontSize: 15, color: '#3B3B4D', }}>{info}</FontedText>}

				{
					arrowless ? null :
						customIcon ? customIcon() :
							<Ionicons
								style={{
									marginLeft: 10,
								}}
								name={cancelEnabled ? 'ios-close' : I18nManager.isRTL ? 'ios-arrow-back' : 'ios-arrow-forward'}
								size={20}
								// color={'#3B3B4D'}
								color={mainTextColor}
							/>
				}
			</View>
		</CustomTouchable>
	)
}