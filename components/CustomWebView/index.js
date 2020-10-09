import React from 'react';
import { Linking, Platform } from 'react-native';
import AutoHeightWebView from 'react-native-autoheight-webview';
import { FixHtmlTextColor } from '../../utils/Html';
import { mainTextColor } from '../../constants/Colors';

class CustomWebView extends React.Component {
    constructor() {
        super()

        this.handleUrlNavigation = Platform.OS === 'android' ? true : false
    }

    render() {
        const {
            style,
            source,
            ...restProps
        } = this.props

        return (
            <AutoHeightWebView
                style={style}
                onShouldStartLoadWithRequest={event => {
                    if (this.handleUrlNavigation) {
                        Linking.openURL(event.url)
                        return false
                    }
                    else {
                        this.handleUrlNavigation = true
                    }

                    return true
                }}
                source={{ html: FixHtmlTextColor(source, mainTextColor), baseUrl: '' }}
                originWhitelist={['*']}
                {...restProps}
                usewebkit={true}
            />
        )
    }
}

export default CustomWebView;