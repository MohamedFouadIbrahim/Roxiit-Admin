import React, { Component } from 'react';
import { withLocalize } from 'react-localize-redux';
import { I18nManager, Platform, TextInput, View } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import TranslatedText from '../TranslatedText';
import { mainColor, secondColor, mainTextColor } from '../../constants/Colors';
import { largePagePadding } from '../../constants/Style';
class PasswordInput extends Component {
    constructor() {
        super()

        this.state = {
            isFocused: false,
            showPassword: false
        }
    }

    renderLabel = () => {

        const {
            label
        } = this.props
        if (label) {
            return (
                <TranslatedText style={{
                    fontSize: 14,
                    marginBottom: 25,
                    position: 'absolute',
                    bottom: Platform.OS == 'android' ? 11 : 2,
                    zIndex: 1,
                    marginHorizontal: 5,
                    paddingHorizontal: 5,
                    backgroundColor: 'white',
                    color: secondColor
                }} text={label} />
            )
        }
    }

    render() {
        const { props } = this

        const {
            containerStyle,
            inputStyle,
            placeholder,
            translate,
        } = props

        return (
            <View
                style={[{ marginHorizontal: largePagePadding }, containerStyle]}>
                {this.renderLabel()}

                <TextInput
                    {...props}
                    style={[{
                        width: '100%',
                        fontSize: 16,
                        borderColor: this.state.isFocused ? secondColor : mainColor,
                        borderWidth: 0.5,
                        paddingLeft: 10,
                        paddingRight: 40,
                        paddingVertical: 8,
                        borderRadius: 10,
                        color: mainTextColor,
                        textAlign: I18nManager.isRTL ? 'right' : 'left'
                    }, inputStyle]}
                    placeholder={placeholder ? translate(placeholder) : ""}
                    placeholderTextColor={mainTextColor}
                    underlineColorAndroid='transparent'
                    selectionColor={mainColor}
                    secureTextEntry={!this.state.showPassword}
                    onFocus={() => {
                        this.setState({ isFocused: true })
                    }}
                    onBlur={() => {
                        this.setState({ isFocused: false })
                    }}
                />

                <Entypo name='eye'
                    size={18}
                    style={{ position: 'absolute', right: 10, top: Platform.OS == 'android' ? 14 : 10 }}
                    color={this.state.showPassword ? secondColor : mainColor}
                    onPress={() => { this.setState({ showPassword: !this.state.showPassword }) }}
                />
            </View>
        )
    }
}


export default withLocalize(PasswordInput)