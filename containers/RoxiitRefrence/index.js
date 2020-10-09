import React from "react";
import { Text, Image, Linking, Platform, View } from "react-native";
import { mainTextColor as textColor2 } from '../../constants/Colors';
import DeviceInfo from 'react-native-device-info';
import { connect } from "react-redux";
import CustomTouchable from '../../components/CustomTouchable';
import TranslatedText from "../../components/TranslatedText";
import FontAwesome from 'react-native-vector-icons/FontAwesome';

class RoxiitRefrence extends React.Component {
    constructor(props) {
        super(props)
    }

    onIconPress = (url) => {
        if (url) {
            Linking.canOpenURL(url).then(isSuported => {
                if (isSuported) {
                    Linking.openURL(url)
                }
            })
        }
    }
    handelUrl = () => {
        const { BundleId } = this.props.AppUrl
        return `http://roxiit.com?utm_source=${BundleId}&utm_medium=${Platform.OS}&utm_campaign=profile&utm_content=${DeviceInfo.getVersion()}-${DeviceInfo.getBuildNumber()}`
    }

    render() {

        const mainUrl = this.handelUrl()


        return (
            <CustomTouchable
                onPress={() => { this.onIconPress(mainUrl) }}
                style={{ paddingHorizontal: 8, marginVertical: 5, flex: 1, }}>
                <Text
                    text={'Roxiit'}
                    style={{ textAlign: 'center', marginVertical: 5, color: textColor2, fontSize: 11 }}>
                    POWERED BY&#160;&#160;&#160;
                            <FontAwesome
                        name={'heart'}
                        color={'#F00'}
                        size={13}
                        style={{
                            textAlign: 'center',
                            marginVertical: 5,
                            marginHorizontal: 5,
                            paddingHorizontal: 5,
                        }} />
                            &#160;&#160;&#160;

                            <Image
                        style={{ alignSelf: 'center', height: 13, width: 60 }}
                        source={require('../../assets/images/RoxiitAnimationLogo/Roxiit.png')}
                        resizeMode="contain"
                    />
                </Text>
            </CustomTouchable>
        )
    }
}
const mapStateToProps = ({
    runtime_config: {
        runtime_config: {
            AppUrl: {
                BundleId
            }
        }
    }
}) => ({
    AppUrl: {
        BundleId
    }
})
export default connect(mapStateToProps)(RoxiitRefrence)
