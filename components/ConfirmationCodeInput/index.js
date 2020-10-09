import React from 'react';
import CodeInput from 'react-native-confirmation-code-input';
import { secondColor } from '../../constants/Colors';
export default class confirmationCodeInput extends React.Component {
    render() {
        return (
            <CodeInput
                activeColor='white'
                inactiveColor='rgba(0,0,0,0.1)'
                ref="codeInputRef1"
                className={'border-box'}
                keyboardType="numeric"
                space={5}
                size={40}
                inputPosition='left'
                onFulfill={(code) => this.props.onConfirm(code)}
                codeInputStyle={{
                    flex: 1,
                    fontSize: 25,
                    borderRadius: 7,
                    backgroundColor:  secondColor,
                    textAlign: 'center',
                }}
                codeLength={6}
            />
        )
    }
}