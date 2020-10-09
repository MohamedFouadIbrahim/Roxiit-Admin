import React from 'react';
import { View, Linking, Clipboard, ScrollView } from 'react-native';
import LazyContainer from '../../components/LazyContainer';
import CustomButton from '../../components/CustomButton';
import MyAppItems from './MyAppItems';
import CustomHeader from '../../components/CustomHeader';
import { largePagePadding, pagePadding } from '../../constants/Style';
import { connect } from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { LongToast } from '../../utils/Toast';
import { screenWidth } from '../../constants/Metrics';
import QRCode from '../../components/QRCode';
import { SaveImge } from '../../utils/Image';

class MyApp extends React.Component {

    state = {
        loading: false
    }

    onPressIcon = async (url) => {
        const canOpenUrl = Linking.canOpenURL(url)
        if (canOpenUrl && url != null) {
            Linking.openURL(url)
        } else {
            LongToast('CantOpenRightNow')
        }
    }

    onLongPressIcon = (url) => {
        if (url != null) {
            Clipboard.setString(url)
            LongToast('Copied')
        } else {
            LongToast('CantCopyRightNow')
        }
    }


    render() {

        const { Url } = this.props
        const appLink = Url + `?r=onelink`
        const androidLink = Url + `?r=android`
        const iOSLink = Url + `?r=ios`

        return (
            <LazyContainer
                style={{ flex: 1 }}
            >

                <CustomHeader
                    navigation={this.props.navigation}
                    leftComponent="drawer"
                    title={'MyApp'}
                />
                <ScrollView>
                    <View style={{ paddingHorizontal: largePagePadding, flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }} >
                        <MyAppItems
                            IconComponent={AntDesign}
                            Name={'OneLink'}
                            onPress={() => { this.onPressIcon(appLink) }}
                            onLongPress={() => { this.onLongPressIcon(appLink) }}
                            iconName='link'
                        />

                        <MyAppItems
                            IconComponent={AntDesign}
                            Name={'Android'}
                            onPress={() => { this.onPressIcon(androidLink) }}
                            onLongPress={() => { this.onLongPressIcon(androidLink) }}
                            iconName='android1'
                        />

                        <MyAppItems
                            IconComponent={AntDesign}
                            Name={'iOS'}
                            onPress={() => { this.onPressIcon(iOSLink) }}
                            onLongPress={() => { this.onLongPressIcon(iOSLink) }}
                            iconName='apple1'
                        />


                    </View>

                    <View
                        style={{ alignSelf: 'center', marginTop: 50 }}
                    >
                        <QRCode
                            getRef={(c) => (this.svg = c)}
                            size={200}
                            value={appLink}
                        />
                    </View>
                    <CustomButton
                        style={{
                            marginTop: 20,
                            width: screenWidth - largePagePadding,
                            left: pagePadding
                        }}
                        title='SaveToGallery'
                        onPress={() => {
                            this.svg.toDataURL(data => {

                                this.setState({ loading: true })
                                SaveImge(
                                    data,
                                    'appLink', () => {
                                        this.setState({ loading: false })
                                        LongToast('dataSaved')
                                    }, err => {
                                        this.setState({ loading: false })
                                        LongToast('DataNotSaved')
                                    })
                            })

                        }}
                        loading={this.state.loading}
                    />

                </ScrollView>
            </LazyContainer>
        )
    }
}

const mapStateToProps = ({
    runtime_config: {
        runtime_config: {
            AppUrl: {
                Url
            }
        },
    }
}) => ({
    Url
})
export default connect(mapStateToProps)(MyApp)