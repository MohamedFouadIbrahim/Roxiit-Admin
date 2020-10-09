import React, { Component } from 'react';
import { withLocalize } from 'react-localize-redux';
import { secondColor,mainTextColor } from '../../constants/Colors';
import { largePagePadding } from '../../constants/Style';
import CustomTouchable from '../CustomTouchable';
import FontedText from '../FontedText';
import { I18nManager } from 'react-native';
import TranslatedText from '../TranslatedText';
import Ionicons from 'react-native-vector-icons/Ionicons';

class RoundedSelector extends Component {
    constructor() {
        super()

        this.state = {
            isFocused: false,
        }
    }

    renderTitle = () => {

        const {
            title,
            titleStyle
        } = this.props

        if (title) {
            return (
                <TranslatedText style={[{
                    fontSize: 14,
                    marginBottom: 25,
                    position: 'absolute',
                    bottom: 11,

                    marginHorizontal: 5,
                    paddingHorizontal: 5,
                    color: secondColor,
                    backgroundColor: 'white'
                }, titleStyle]} text={title} />
            )
        }

    }

    render() {
        const { props } = this

        const {
            containerStyle,
            titleStyle,
            placeholder,
            title,
            translate,
            textStyle,
            info,
            trimText,
            arrowless,
            customIcon,
            ...buttonProps
        } = props

        return (
            <CustomTouchable
                style={[{
                    borderWidth: 0.5,
                    paddingHorizontal: 10,
                    paddingVertical: 10,
                    borderRadius: 10,
                    justifyContent: 'center',
                    marginHorizontal: largePagePadding,
                    marginTop: largePagePadding,
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                }, containerStyle]}
                {...buttonProps}
            >
                {this.renderTitle()}

                <FontedText
                    style={[{
                        fontSize: 16,
                        color: '#3B3B4D',
                    }, textStyle]}
                >
                    {info ? info : translate(title)}
                </FontedText>

                {
                    arrowless ? null :
                        customIcon ? customIcon() :
                            <Ionicons
                                style={{
                                    marginLeft: 10,
                                }}
                                name={I18nManager.isRTL ? 'ios-arrow-back' : 'ios-arrow-forward'}
                                size={20}
                                // color={'#3B3B4D'}
                                color={mainTextColor}
                            />
                }
            </CustomTouchable>
        )
    }
}


export default withLocalize(RoundedSelector)