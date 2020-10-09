import React from 'react';
import LazyContainer from '../../components/LazyContainer';
import CustomButton from '../../components/CustomButton';
import CustomHeader from '../../components/CustomHeader';
import { pagePadding, largePagePadding } from '../../constants/Style';
import { View } from 'react-native';
import { DownloadFile, DownloadStockFile } from '../../services/ImportService';
import { LongToast } from '../../utils/Toast';
import TranslatedText from '../../components/TranslatedText';
import { ScrollView } from 'react-native-gesture-handler';
import SettingsTitle from '../../components/Settings/SettingsTitle';
import SettingsSeparator from '../../components/Settings/SettingsSeparator';
import { thinLineGray } from '../../constants/Colors';
import { SaveFile } from '../../utils/File.js';

class Improtance extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            loadingSampleExcelFile: false,
            loadingDownloadExcelFile: false,
        }
    }


    render() {
        const { loadingSampleExcelFile,
            loadingDownloadExcelFile,
        } = this.state
        return (
            <LazyContainer style={{ flex: 1, backgroundColor: thinLineGray }} >

                <CustomHeader
                    navigation={this.props.navigation}
                    title='Import'
                />
                <ScrollView>

                    <SettingsTitle title={'ImportProducts'} />
                    <SettingsSeparator />
                    <View style={{ flex: 1, justifyContent: 'center', paddingVertical: largePagePadding, paddingHorizontal: largePagePadding, backgroundColor: "#FFFFFF" }} >

                        <TranslatedText
                            style={{ alignSelf: 'center', textAlign: 'center', }}
                            text='ImportProductText'
                        />
                        <CustomButton
                            onPress={() => {
                                this.setState({ loadingSampleExcelFile: true })
                                DownloadFile(res => {
                                    SaveFile(res.data,
                                        (f) => {
                                            //on success
                                            this.setState({ loadingSampleExcelFile: false })
                                        }, err => {
                                            this.setState({ loadingSampleExcelFile: false })
                                            LongToast('SomeThingWrongCheckThePERMISSIONS')
                                        },
                                        () => {
                                            //downloading
                                        }, 'Import Product Sample')

                                }, err => {
                                    LongToast('SomeThingWrongCheckThePERMISSIONS')
                                })
                            }}
                            loading={loadingSampleExcelFile}
                            style={{
                                marginTop: pagePadding,
                            }}

                            title='SimpleFile'
                        />

                        <CustomButton
                            onPress={() => {
                                this.props.navigation.navigate('ProductConfig')
                            }}

                            style={{
                                marginTop: largePagePadding,
                            }}

                            title='Upload'
                        />
                    </View>

                    <SettingsTitle title={'UpdatePricesAndStock'} ></SettingsTitle>
                    <SettingsSeparator />
                    <View style={{ flex: 1, justifyContent: 'center', paddingVertical: largePagePadding, paddingHorizontal: largePagePadding, backgroundColor: "#FFFFFF" }} >
                        <CustomButton
                            onPress={() => {
                                this.setState({ loadingDownloadExcelFile: true })
                                DownloadStockFile(res => {
                                    SaveFile(res.data,
                                        (f) => {
                                            //on success
                                            this.setState({ loadingDownloadExcelFile: false })
                                        }, err => {
                                            this.setState({ loadingDownloadExcelFile: false })
                                            LongToast('SomeThingWrongCheckThePERMISSIONS')
                                        },
                                        () => {
                                            //downloading
                                        }, 'Inventory')

                                }, err => {
                                    LongToast('SomeThingWrongCheckThePERMISSIONS')
                                })
                            }}

                            loading={loadingDownloadExcelFile}
                            style={{
                                marginTop: pagePadding,
                            }}
                            title='DownloadExcelFile'
                        />

                        <CustomButton
                            onPress={() => {
                                this.props.navigation.navigate('StockConfig')
                            }}

                            style={{
                                marginTop: largePagePadding,
                            }}

                            title='UploadExcelFile'
                        />
                    </View>

                </ScrollView>

            </LazyContainer>
        )
    }

}

export default Improtance