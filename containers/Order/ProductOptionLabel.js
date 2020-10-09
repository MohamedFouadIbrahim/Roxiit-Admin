import React from 'react';
import { View, Clipboard, Linking } from 'react-native';
import FontedText from '../../components/FontedText';
import Icon from '../../components/Icon';
import { mainTextColor } from '../../constants/Colors';
import { smallBorderRadius } from '../../constants/Style';
import CustomTouchable from '../../components/CustomTouchable';
import { LongToast } from '../../utils/Toast';

const ProductOptionLabel = ({
	item,
	bgColor2 = '#eff2f6',
	textColor2 = mainTextColor,
}) => {
	const {
		Type,
		Name,
		GroupName,
		ExtraDetails1,
		ExtraDetails2,
		SKU,
	} = item

	let displayedValue, displayedIcon

	switch (Type.Id) {
		case 5:
		case 6:
		case 7:
		case 8:
		case 9:
			displayedValue = `${GroupName}: ${ExtraDetails1}`
			break;
		case 1:
			displayedValue = `${GroupName}:`
			if (ExtraDetails1)
				displayedIcon = <View style={{ marginLeft: 5, backgroundColor: ExtraDetails1, width: 12, height: 12, borderRadius: 6 }} />
			break;
		case 3:
			displayedValue = `${GroupName}:`
			displayedIcon = <Icon name={ExtraDetails1} family={ExtraDetails2} size={12} style={{ marginLeft: 5 }} />
			break;
		case 4:
			displayedValue = GroupName
			break;
		default:
			displayedValue = `${GroupName}: ${Name}`
			break;
	}

	const onPress = () => {

		if (Type.Id == 4 && ExtraDetails1 && ExtraDetails1 != '' && ExtraDetails2 && ExtraDetails2 != '') {

			Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${ExtraDetails1},${ExtraDetails2}`);

		} else {
			if (ExtraDetails1 && ExtraDetails1 != '') {
				Clipboard.setString(ExtraDetails1)
				LongToast('Copied')
			}
		}
	}

	return (
		<CustomTouchable
			activeOpacity={Type.Id == 4 ? 0.2 : 1}
			onPress={onPress}
			style={{
				backgroundColor: bgColor2,
				flexDirection: 'column',
				padding: 5,
				marginRight: 5,
				marginBottom: 5,
				borderRadius: smallBorderRadius,
			}}>
			<View style={{
				flexDirection: 'row',
				justifyContent: 'center',
				alignItems: 'center',
			}}>
				<FontedText style={{ fontSize: 12, color: textColor2 }}>{displayedValue}</FontedText>
				{displayedIcon}
			</View>
			{(SKU && SKU != '' && SKU != null) ? <FontedText style={{ fontSize: 12, color: textColor2 }}>{SKU}</FontedText> : null}

		</CustomTouchable>
	)
}

export default ProductOptionLabel