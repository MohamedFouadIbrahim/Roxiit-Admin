import React, { Component } from 'react'
import { View } from 'react-native'
import CustomHeader from '../../components/CustomHeader/index.js';
import TranslatedText from '../../components/TranslatedText/index.js';

class ComingSoon extends Component {
	render() {
		return (
			<View
				style={{
					flex: 1,
				}}>
				<CustomHeader
					navigation={this.props.navigation}
					leftComponent={"drawer"}
					title="Soon" />

				<View
					style={{
						flex: 1,
						justifyContent: 'center',
						alignItems: 'center',
					}}>
					<TranslatedText
						style={{
							fontSize: 20,
							textAlign: 'center',
							color: '#333333'
						}}
						text="Soon" />
				</View>
			</View>
		)
	}
}

export default ComingSoon