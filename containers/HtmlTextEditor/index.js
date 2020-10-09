import React from 'react';
import { WebView } from 'react-native-webview';
import { connect } from 'react-redux';
import CustomHeader from '../../components/CustomHeader';
import { ScrollView } from 'react-native';
class HtmlTextEditor extends React.Component {

    render() {

        const {
            main_token,
            secondary_token,
            root_url,
            navigation,
            languages_data,
            currLang,
            route
        } = this.props

        const {
            id,
            EntityName,
            PropName,
            lnaguageId = languages_data.find(item => item.code === currLang).key,
            EditMode = true
        } = route.params

        const uri = `${root_url}/v1/Html/Editor?id=${id}&EntityName=${EntityName}&PropName=${PropName}&lnaguageId=${lnaguageId}`
        const headers = {
            "access-token": main_token,
            "tenant-token": secondary_token,
        }
        const method = EditMode ? 'GET' : 'POST'

        return (
            <ScrollView
                contentContainerStyle={{
                    flexGrow: 1
                }}
            >
                <CustomHeader
                    navigation={this.props.navigation}
                    title={'EditDescription'}
                />
                <WebView
                    // style={{ flex: 1 }}
                    source={{
                        uri,
                        method,
                        headers
                    }}
                    onLoadEnd={(d) => {
                        if (d.nativeEvent.url.includes('Html/success')) {
                            navigation.goBack()
                        }
                    }}
                    usewebkit={true}
                />
            </ScrollView>

        )
    }
}

const mapStateToProps = ({
    login: {
        main_token,
        secondary_token
    },
    server: {
        root_url
    },
    language: {
        languages_data,
        currLang,
    },
}) => ({
    main_token,
    secondary_token,
    root_url,
    languages_data,
    currLang,
})

export default connect(mapStateToProps)(HtmlTextEditor)