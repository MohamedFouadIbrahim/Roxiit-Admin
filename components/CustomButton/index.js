import React from 'react'
import { ActivityIndicator } from 'react-native'
import FontedText from '../FontedText';
import { withLocalize } from 'react-localize-redux';
import { largeBorderRadius } from '../../constants/Style';
import { secondColor} from '../../constants/Colors';
import CustomTouchable from '../CustomTouchable';

const CustomButton = (props) => {
	const {
		style,
		title,
		autoTranslate = true,
		uppercase = false,
		translate,
		loading = false,
		color = "white",
		backgroundColor = secondColor,
		fullWidth = false,
		...restProps
	} = props

	const buttonTitle = autoTranslate ? translate(title) : title

	return (
		<CustomTouchable
			{...restProps}
			style={[{
				justifyContent: 'center',
				alignItems: 'center',
				padding: 12,
				borderRadius: largeBorderRadius,
				backgroundColor,
				width: fullWidth ? '100%' : 'auto',
			}, style]}>
			{
				loading ?
					<ActivityIndicator size="small" color={color} />
					:
					<FontedText style={{ color: 'white' }}>{uppercase ? buttonTitle.toUpperCase() : buttonTitle}</FontedText>
			}
		</CustomTouchable>
	)
}

export default withLocalize(CustomButton)