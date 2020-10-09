import React, { Component } from 'react';
import { pagePadding } from '../../constants/Style';
import TranslatedText from '../TranslatedText';
import AntDesign from 'react-native-vector-icons/AntDesign'
import CustomTouchable from '../CustomTouchable'

class TextEditorInput extends Component {

	render() {
		const { navigation, value, onFinishEditing, showLanguageSelector, onChangeLangue } = this.props

		return (
			<CustomTouchable
				onPress={() => {
					// TextEditor route must exist in the same navigator

					navigation.navigate('TextEditor', {
						text: value,
						onFinishEditing: (text) => {
							onFinishEditing && onFinishEditing(text)
						},
						showLanguageSelector: showLanguageSelector ? true : false,
						onChangeLangue: (language) => {
							onChangeLangue && onChangeLangue(language)
						}
					})
				}}
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					backgroundColor: 'white',
					paddingVertical: 15,
					paddingHorizontal: 20,
				}}>
				<AntDesign
					name={'edit'}
					size={26}
					color={'black'}
					style={{ marginRight: pagePadding, }} />

				<TranslatedText style={{ color: 'black' }} text='EditContentInEditor' />
			</CustomTouchable>
		)
	}
}

export default TextEditorInput