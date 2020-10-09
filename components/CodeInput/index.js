import React, { Component } from 'react'
import { View, TextInput, TouchableWithoutFeedback } from 'react-native'
import { secondColor } from '../../constants/Colors';

export default class CodeInput extends Component {
	constructor (props) {
		super(props)

		this.state = {
			inputsData: [
				{
					key: 0,
					value: null,
					editable: false
				},
				{
					key: 1,
					value: null,
					editable: false
				},
				{
					key: 2,
					value: null,
					editable: false
				},
				{
					key: 3,
					value: null,
					editable: false
				},
				{
					key: 4,
					value: null,
					editable: false
				},
				{
					key: 5,
					value: null,
					editable: false
				},
			],
		}

		this.inputsRefs = {}
		this.emptyArray = [...Array(6)]
		this.lastIndex = this.emptyArray.length - 1

		this.currentInputIndex = 0
	}

	componentDidMount () {
		this.focusInput(0)
	}

	focusInput = (index) => {
		this.inputsRefs[`input_${index}`].focus()
		this.currentInputIndex = index

		let copy_inputsData = this.state.inputsData

		for (let i = 0; i !== copy_inputsData.length; ++i) {
			if (i === index) {
				copy_inputsData[i].editable = true				
			}
			else {
				copy_inputsData[i].editable = false
			}
		}

		this.setState({
			inputsData: copy_inputsData 
		})
	}

	setInputEditable = (index, editable, callback) => {
		let copy_inputsData = this.state.inputsData
		copy_inputsData[index].editable = editable
		this.setState({ inputsData: copy_inputsData }, () => { callback && callback() })
	}

	setInputValue = (index, value, callback) => {
		let copy_inputsData = this.state.inputsData
		copy_inputsData[index].value = value
		this.setState({ inputsData: copy_inputsData }, () => { callback && callback() })
	}

	internal_onConfirm = (text) => {
		this.inputsRefs[`input_${this.currentInputIndex}`].blur()
		this.setInputEditable(this.currentInputIndex, false)

		if (text) {
			this.setInputValue(this.currentInputIndex, text, () => {
			const digitsArr = this.state.inputsData.map(item => item.value)
				this.props.onConfirm && this.props.onConfirm(digitsArr.join(""))
			})
		}
		else {
			const digitsArr = this.state.inputsData.map(item => item.value)
			this.props.onConfirm && this.props.onConfirm(digitsArr.join(""))
		}
	}

	render() {
		return (
			<TouchableWithoutFeedback
				onPress={() => {
					if (this.state.inputsData[this.lastIndex].value && !this.state.inputsData[this.lastIndex].editable) {
						this.focusInput(this.lastIndex)
					}
				}}>
				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'space-between',
						alignItems: 'center',
					}}>
					{
						this.emptyArray.map((val, index) => {
							let addStyle = {}

							if (index === 0) {
								addStyle = { marginRight: 4 }
							}
							else {
								addStyle = { marginHorizontal: 4 }
							}

							if (this.state.inputsData[index].editable) {
								addStyle = { ...addStyle, borderColor: secondColor, borderWidth: 1, }
							}

							return (
								<TextInput
									key={index}
									ref={input => this.inputsRefs[`input_${index}`] = input}
									returnKeyType={index === this.lastIndex ? "done" : "next"}
									onSubmitEditing={() => {
										if (index === this.lastIndex) {
											if (this.state.inputsData[index].value) {
												this.internal_onConfirm()											
											}
										}
										else {
											if (this.state.inputsData[index].value) {
												this.focusInput(this.currentInputIndex + 1)
											}
										}
									}}
									onChangeText={(text) => {
										if (text.length) {
											if (/^\d+$/.test(text)) {
												if (this.currentInputIndex < this.lastIndex) {
													this.focusInput(this.currentInputIndex + 1)
													this.setInputValue(index, text)
												}
												else {
													this.internal_onConfirm(text)
												}
											}
										}
										else {
											this.setInputValue(index, text)
										}
									}}
									onKeyPress={({ nativeEvent: { key: keyValue } }) => {
										if (keyValue === 'Backspace') {
											if (this.currentInputIndex > 0 && !this.state.inputsData[this.currentInputIndex].value) {
												const prevIndex = this.currentInputIndex - 1
												this.focusInput(prevIndex)
											}
										}
									}}
									style={[{
										flex: 1,
										fontSize: 25,
										backgroundColor:
											this.state.inputsData[index].value && (index === this.lastIndex || !this.state.inputsData[index].editable) ?
												'white' : 'rgba(0,0,0,0.1)',
										borderRadius: 7,
										color:
											this.state.inputsData[index].value && (index === this.lastIndex || !this.state.inputsData[index].editable) ?
												'#131315' : 'white',
										textAlign: 'center',
										paddingLeft: 0,
										paddingRight: 0,
										marginLeft: 0,
									}, addStyle]}
									maxLength={1}
									keyboardType="number-pad"
									blurOnSubmit={false}
									value={this.state.inputsData[index].value}
									editable={this.state.inputsData[index].editable}
									placeholder={""}
									placeholderTextColor={'gray'}
									underlineColorAndroid='transparent'
									selectionColor={secondColor} />
							)
						})
					}
				</View>
			</TouchableWithoutFeedback>
		)
	}
}