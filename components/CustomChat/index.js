import React from 'react';
import { I18nManager, Platform } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { TrimText } from '../../utils/Text';
import FontedText from '../FontedText';

class CustomChat extends React.Component {

    constructor(props) {
        super(props)
    }

    handelFileUrl = (currentMessage) => {

        if (currentMessage.FileUrl) {
            if (Platform.OS == 'android') {
                return currentMessage.text
            } else {
                return TrimText(currentMessage.text, 20)
            }

        } else {
            return currentMessage.text + '\n'
        }
    }

    checkingImage = (items) => {
        const { CDNUrl } = this.props
        if (!items.FileUrl) {
            return null
        }
        if (items.FileUrl.endsWith('.png') || items.FileUrl.endsWith('.jpg') || items.FileUrl.endsWith('.PNG') || items.FileUrl.endsWith('.JPG')) {
            return `${CDNUrl + items.FileUrl}`
        } else {
            return null
        }
    }

    render() {
        const { onTextPress, reseverId, avatar, onSendMsg, messages, CDNUrl, ...resProps } = this.props

        return (
            <GiftedChat
                {...resProps}
                renderMessageText={(MSG) => {
                    return (
                        <FontedText
                            onPress={() => { onTextPress && onTextPress(MSG.currentMessage, MSG.currentMessage.user._id != reseverId) }}
                            style={{
                                color: MSG.currentMessage.user._id != reseverId ? 'black' : 'white',
                                textAlign: I18nManager.isRTL ? 'right' : 'left',
                                textDecorationLine: MSG.currentMessage.FileUrl ? 'underline' : 'none',
                                marginHorizontal: 8,
                                marginTop: 3,
                                fontSize: 17
                            }} >
                            {this.handelFileUrl(MSG.currentMessage)}
                        </FontedText>
                    )
                }}
                messages={messages.map(items => ({
                    ...items,
                    image: this.checkingImage(items)
                }))}
                onSend={(newMessages) => {
                    onSendMsg && onSendMsg(newMessages)
                }}
                user={{ _id: reseverId }}
            />
        )
    }
}


export default CustomChat