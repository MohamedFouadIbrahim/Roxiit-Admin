import React from 'react';
import { View, Platform } from 'react-native';
import ProgressBar from '../../components/ProgressBar';
import { shadowStyle1, largePagePadding } from '../../constants/Style';
import RoundedCloseButton from '../../components/RoundedCloseButton';
import TranslatedText from '../../components/TranslatedText';
import Ionicons from 'react-native-vector-icons/Entypo';
import { mainColor } from '../../constants/Colors';
import FontedText from '../../components/FontedText';
import CustomTouchable from '../../components/CustomTouchable';

export default class GoLive extends React.Component {
	render() {
		const { onPress, onClose, progress, Presentge } = this.props
		return (
			<CustomTouchable
				onPress={onPress}
				style={{
					justifyContent: 'center',
					paddingVertical: 20,
					paddingHorizontal: 20,
					marginHorizontal: largePagePadding,
					marginVertical: 15,
					borderRadius: 20,
					backgroundColor: 'white',
					...shadowStyle1,
				}} >

				<View style={{ position: 'absolute', top: 10, right: 10 }} >
					<RoundedCloseButton onPress={onClose} />
				</View>

				<View style={{ flexDirection: 'row', paddingBottom: 5, }} >
					<Ionicons color={mainColor} size={20} name={Platform.OS == 'android' ? 'google-play' : 'app-store'} style={{ marginTop: 3 }} />
					<TranslatedText
						style={{ fontSize: 18, fontWeight: 'bold', marginHorizontal: 5 }}
						text={'GoLive'}
					/>
					<FontedText style={{ fontSize: 18, fontWeight: 'bold', marginHorizontal: 5 }} >{`${Presentge}%`}</FontedText>
				</View>

				<ProgressBar
					progress={progress}
				/>

				<TranslatedText
					style={{ fontSize: 15, alignSelf: 'center', paddingTop: 5, lineHeight: 20, marginTop: 10 }}
					text={'Intro'}
				/>

			</CustomTouchable>
		)
	}
}
