import React, { Component } from 'react'
import { View, TextInput, I18nManager } from 'react-native'
import { secondColor, mainTextColor } from '../../constants/Colors';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontedText from '../FontedText';
import { withLocalize } from 'react-localize-redux';
import CustomTouchable from '../CustomTouchable';

class CustomInput extends Component {
	constructor(props) {
		super(props)

		this.state = {
			secureTextEntry: this.props.secureTextEntry
		}

		if (this.props.backgroundStyle === "dark") {
			this.styles = {
				backgroundColor: 'rgba(0,0,0, 0.8)',
				textColor: 'white',
				placeholderTextColor: 'rgba(255,255,255,0.6)',
				passwordVisible: {
					backgroundColor: 'rgba(255,255,255, 0.2)',
					textColor: 'white',
				}
			}
		}
		else {
			this.styles = {
				backgroundColor: '#f3f3f5',
				// textColor: '#3b3b4d',
				textColor: mainTextColor,
				// placeholderTextColor: '#3b3b4d',
				placeholderTextColor: mainTextColor,
				passwordVisible: {
					textColor: '#6c7b8a',
				}
			}
		}
	}

	componentDidMount() {
		if (this.props.onRef != null) {
			this.props.onRef(this)
		}
	}

	onSubmitEditing() {
		this.props.onSubmitEditing && this.props.onSubmitEditing();
	}

	focus() {
		this.textInput.focus()
	}

	renderRightComponent = () => {
		if (!this.props.value || !this.props.value.length) {
			return null
		}
		if (this.props.secureTextEntry) {
			return (
				<CustomTouchable
					onPress={() => { this.setState({ secureTextEntry: !this.state.secureTextEntry }) }}
					style={{
						width: 20,
						height: 20,
						borderRadius: 5,
						justifyContent: 'center',
						alignItems: 'center',
					}}>
					<Ionicons name={this.state.secureTextEntry ? 'ios-eye' : 'ios-eye-off'} color={this.styles.passwordVisible.textColor} size={20} />
				</CustomTouchable>
			)
		}
		else if (this.props.valid !== -1 && this.props.valid !== null) {
			if (this.props.backgroundStyle === "dark") {
				return (
					<LinearGradient
						start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
						colors={this.props.valid === false ? ['#F54E5E', '#E83F94'] : ['#9DE686', '#2FAD66']}
						style={{
							width: 20,
							height: 20,
							borderRadius: 5,
							justifyContent: 'center',
							alignItems: 'center',
						}}>
						<Ionicons name={this.props.valid === false ? 'md-close' : 'md-checkmark'} color='white' size={10} />
					</LinearGradient>
				)
			}
			else {
				return (
					<View
						style={{
							width: 20,
							height: 20,
							borderRadius: 5,
							justifyContent: 'center',
							alignItems: 'center',
							backgroundColor: 'white',
						}}>
						<Ionicons name={this.props.valid === false ? 'md-close' : 'md-checkmark'} color='#6c7b8a' size={10} />
					</View>
				)
			}
		}
	}

	renderErrorMessage = () => {
		if (this.props.errorMessage) {
			return (
				<FontedText style={{ color: '#F64B63', fontSize: 11, marginBottom: 12, marginTop: -10 }}>{this.props.errorMessage}</FontedText>
			)
		}
	}

	render() {
		const { value, placeholder, label, translate } = this.props

		return (
			<View
				style={{
					width: '100%',
				}}>
				{label ? <FontedText style={[this.props.labelstyle, { marginHorizontal: 15, marginVertical: 5 }]}>{translate(label)}</FontedText> : null}
				<View
					style={[{
						backgroundColor: this.styles.backgroundColor,
						paddingRight: 14,
						borderRadius: 13,
						flexDirection: 'row',
						alignItems: 'center',
						justifyContent: 'space-between',
					}, this.props.containerStyle]}>
					<View
						style={{
							flex: 1,
							paddingLeft: 14,
						}}>
						<TextInput
							{...this.props}
							ref={input => this.textInput = input}
							onSubmitEditing={this.onSubmitEditing.bind(this)}
							style={[{
								fontSize: 15,
								color: this.styles.textColor,
								textAlign: I18nManager.isRTL ? 'right' : 'left',
								paddingLeft: 0,
								marginLeft: 0,
								paddingVertical: 10
							}, this.props.style]}
							value={value}
							placeholder={placeholder ? translate(placeholder) : ""}
							placeholderTextColor={this.styles.placeholderTextColor}
							underlineColorAndroid='transparent'
							secureTextEntry={this.state.secureTextEntry}
							selectionColor={secondColor} />
						{this.renderErrorMessage()}
					</View>
					{this.renderRightComponent()}
				</View>
			</View>
		)
	}
}

export default withLocalize(CustomInput)