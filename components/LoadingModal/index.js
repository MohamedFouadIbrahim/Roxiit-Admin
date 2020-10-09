import React, { PureComponent } from 'react'
import { View } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Modal from "react-native-modal"
import FontedText from '../FontedText';
import CustomTouchable from '../CustomTouchable';

export default class CustomModal extends PureComponent {
	closeModal = () => {
		this.props.onClose && this.props.onClose()
	}

	render() {
		const { positionBottom, title } = this.props

		return (
			<Modal
                hideModalContentWhileAnimating={true}
                // presentationStyle='pageSheet'
				onSwipeComplete={this.closeModal}
				onBackdropPress={this.closeModal}
				onRequestClose={this.closeModal}
				style={[{
					flex: 1,
					justifyContent: 'center',
					padding: 0,
					margin: 0,
				}]}
				{...this.props}>
				<View
					style={[{
                        // padding: 20,
                        paddingHorizontal: 20,
                        paddingVertical: 20,
						backgroundColor: 'white',
						// justifyContent: 'center',
                        alignItems: 'center',
                        alignSelf: 'center'
						
					}, 
					{ ...this.props.contentContainerStyle },
						positionBottom ? {
							borderTopRightRadius: 20,
							borderTopLeftRadius: 20,
						} : {
							borderRadius: 20
						}
					]}>
					{this.props.closeButton ? <View
						style={{
							flexDirection: 'row',
							justifyContent: title ? 'space-between' : 'flex-end',
							alignItems: 'center',
							width: '100%',
							marginBottom: 10,
						}}>
						<FontedText style={{ color: '#6C7B8A', textAlign: 'left', fontSize: 12 }}>{title}</FontedText>

						<CustomTouchable
							onPress={this.closeModal}
							style={{
								paddingLeft: 5,
								paddingBottom: 5,
							}}>
							<Ionicons name='ios-close' color='#444444' size={26} />
						</CustomTouchable>
					</View> : null}

					{this.props.children}
				</View>
			</Modal>
		)
	}
}