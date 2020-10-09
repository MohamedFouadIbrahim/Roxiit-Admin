import React, { Component } from 'react'
import { ScrollView, View, ImageBackground, ActivityIndicator } from 'react-native'
import CustomHeader from '../../components/CustomHeader/index.js';
import LazyContainer from '../../components/LazyContainer'
import { withLocalize } from 'react-localize-redux';
import CustomSelector from '../../components/CustomSelector/index.js';
import ArrowItem from '../../components/ArrowItem/index';
import HorizontalInput from '../../components/HorizontalInput/index';
import SettingsTitle from '../../components/Settings/SettingsTitle.js';
import SettingsSeparator from '../../components/Settings/SettingsSeparator.js';
import { largePagePadding } from '../../constants/Style.js';
import FontedText from '../../components/FontedText/index.js';
import CircularImage from '../../components/CircularImage/index.js';
import { GetProfile, GetCurrency, PostStory, ChangeStoreImage, GetTheme } from '../../services/StoreProfileServece'
import HeaderSubmitButton from '../../components/HeaderSubmitButton/index';
import LinearGradient from 'react-native-linear-gradient';
import { STRING_LENGTH_LONG, STRING_LENGTH_MEDIUM } from '../../constants/Config';
import { openOnlyPicker } from '../../utils/Image.js';
import { mainColor } from '../../constants/Colors.js';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import CustomLoader from '../../components/CustomLoader/index';
import { connect } from 'react-redux'
import { LongToast } from '../../utils/Toast.js';
import CustomTouchable from '../../components/CustomTouchable';
import { IsScreenPermitted } from '../../utils/Permissions.js';
// import console = require('console');
// import console = require('console');



class StoreProfile extends Component {
    constructor(props) {
        super(props)

        const { hello_data } = this.props
        const { StoreTypeId, SubStoreId } = hello_data
        if (StoreTypeId == 3 && SubStoreId != null) {
            props.navigation.navigate('SubStoreProfile', {
                Id: this.props.hello_data.SubStoreId,
                onChildChange: this.onChildChange,
                isFromSettings: true,
            })
        }
        if (this.props.route.params && this.props.route.params?.FormGoLive) {

            this.FormGoLive = true

        } else {
            this.FormGoLive = false
        }

        this.state = {
            didFetchData: false,
            lockSubmit: false,
            didSucceed: false,
            triggerRefresh: false,
            prossesEvent: 0
        }
        this.language_Ref = React.createRef()
        this.CurrenciesRef = React.createRef();
        this.ThemeRef = React.createRef();
        this.lockSubmit = false
    }
    componentWillUnmount() {
        this.cancelFitchProfile && this.cancelFitchProfile()
        this.cancelFitchCurrency && this.cancelFitchCurrency()
        this.cancelFitchTheme && this.cancelFitchTheme()
    }

    componentDidMount() {
        this.fetchData()
    }

    fetchData = () => {
        this.cancelFitchProfile = GetProfile(resProfile => {
            this.FixedName = resProfile.data.StoreName
            this.cancelFitchCurrency = GetCurrency(res => {
                this.cancelFitchTheme = GetTheme(resTheme => {
                    this.setState({
                        Currencies: res.data.Data,
                        ...resProfile.data,
                        selectedLanguage: resProfile.data.Languages,
                        didFetchData: true,
                        AllTheme: resTheme.data.Data
                    })
                })
            })
        })

    }
    submit = () => {

        if (this.lockSubmit) {
            return
        }

        const { StoreName, Description, DefaultCurrency, selectedLanguage, Theme, Currency, ChangeToLange, DefaultLanguage } = this.state
        // Ask For Description Is Required Or Not
        if (!StoreName || !DefaultCurrency) {
            return LongToast('CantHaveEmptyInputs')
        }
        this.lockSubmit = true
        this.setState({ lockSubmit: true })
        let FinalLan = []
        for (let i = 0; i < selectedLanguage.length; i++) {
            if (selectedLanguage[i].isSelected == true) {
                FinalLan.push(selectedLanguage[i].Id)
            }
        }

        PostStory({
            DefaultCurrencyId: Currency ? Currency.Id : DefaultCurrency.Id,
            StoreName,
            Description,
            Languages: FinalLan,
            ThemeId: 0,
            DefaultLanguageId: ChangeToLange ? ChangeToLange.key : DefaultLanguage.Id,
        }, res => {
            this.lockSubmit = false
            this.setState({ lockSubmit: false, didSucceed: true })
            LongToast('dataSaved')
            this.FormGoLive == true ? this.props.navigation.goBack() :
                this.fetchData()

        }, err => {
            this.lockSubmit = false
            this.setState({ lockSubmit: false })
        })
    }
    onChildChange = () => {
        this.setState({ triggerRefresh: !this.state.triggerRefresh })
    }

    renderImage = () => {
        const imageSize = 110

        if (!this.state.didFetchData) {
            return (
                <View
                    style={{
                        alignSelf: 'center',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: largePagePadding,
                    }}>
                    <CircularImage
                        uri={'https://'}
                        size={imageSize} />
                </View>
            )
        }

        const { ImageUrl, picker_image_uri } = this.state.Logo

        return (
            <CustomTouchable
                onPress={() => {
                    if (!this.state.uploadingImage) {
                        openOnlyPicker((Data) => {
                            if (Data == null) {
                                return
                            }
                            if (Data) {
                                const { uri, path, width, height } = Data

                                if (width !== height) {
                                    return LongToast('ImageDimensionsError')
                                }
                                if (width < 700 || height < 700) {
                                    return LongToast('ImageSizeError')
                                }
                                this.setState({ ImageData: path, picker_image_uri: uri, uploadingImage: true, prossesEvent: 0 })
                                ChangeStoreImage(path, () => {
                                    this.setState({ uploadingImage: false, prossesEvent: 0 })
                                    this.fetchData()
                                }, err => {
                                    this.setState({ uploadingImage: false, prossesEvent: 0 })
                                }, (re) => {
                                    this.setState({ prossesEvent: re * 0.01 })
                                })
                            }
                        })
                    }

                }}
                style={{
                    alignSelf: 'center',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: largePagePadding,
                }}>
                <CircularImage
                    uri={picker_image_uri || ImageUrl}
                    size={imageSize} />

                <FontAwesome
                    style={{
                        position: 'absolute',
                        right: 4,
                        bottom: 8,
                    }}
                    name={`camera`}
                    size={20}
                    color={mainColor} />

                {this.state.uploadingImage == true ?
                    <CustomLoader
                        size={imageSize - 30}
                        progress={this.state.prossesEvent == 0 ? this.state.prossesEvent : this.state.prossesEvent}
                    />
                    : null
                }

            </CustomTouchable>
        )
    }

    renderHeader = () => {
        const {
            StoreName,
            Logo,
        } = this.state

        return (
            <ImageBackground
                blurRadius={5}
                style={{ flex: 1, }}
                source={{ uri: this.state.didFetchData ? Logo.ImageUrl : 'https://' }}
            >
                <LinearGradient
                    colors={['rgba(0, 0, 0, .1)', 'rgba(0, 0, 0, .6)', 'rgba(0, 0, 0, 1)']}
                    style={{
                        flex: 1,
                        paddingVertical: largePagePadding,
                    }}>

                    <View
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: largePagePadding,
                        }}>
                        {this.renderImage()}
                        <FontedText style={{ color: '#FFF', textAlign: 'center' }}>{this.FixedName}</FontedText>
                    </View>

                </LinearGradient>
            </ImageBackground>
        )
    }

    onChildChang = () => {
        const { selectedLanguage } = this.state
        this.setState({ Languages: selectedLanguage })
    }


    render() {
        const { StoreName, Description, DefaultCurrency, Currencies, Currency, didFetchData, selectedLanguage, Theme, AllTheme, DefaultLanguage, ChangeToLange } = this.state
        const { translate } = this.props
        if (!didFetchData) {
            return null
        }

        return (
            <LazyContainer style={{ flex: 1, backgroundColor: "#F4F6F9" }}>
                <CustomHeader
                    navigation={this.props.navigation}
                    title={"Profile"}
                    onBack={() => {
                        this.props.navigation.navigate('GoLiveDetails')
                    }}
                    leftComponent={this.FormGoLive == true ? 'back' : "drawer"}
                    rightComponent={
                        <HeaderSubmitButton
                            isLoading={this.state.lockSubmit}
                            didSucceed={this.state.didSucceed}
                            onPress={() => { this.submit() }} />
                    } />


                <ScrollView
                    contentContainerStyle={{

                    }}>
                    {this.renderHeader()}

                    <SettingsTitle title={"Info"} />

                    <HorizontalInput
                        placeholder={translate('Name')}
                        maxLength={STRING_LENGTH_MEDIUM}
                        label="Name"
                        value={StoreName}
                        onChangeText={(StoreName) => { this.setState({ StoreName }) }} />

                    <SettingsSeparator />

                    <HorizontalInput
                        multiline
                        placeholder={translate('Description')}
                        maxLength={STRING_LENGTH_LONG}
                        label="Description"
                        value={Description}
                        onChangeText={(Description) => { this.setState({ Description }) }} />

                    <SettingsSeparator />

                    <ArrowItem
                        onPress={() => { this.CurrenciesRef.current.show() }}
                        title={'Currency'}
                        info={Currency ? Currency.Name : DefaultCurrency.Name} />

                    <SettingsSeparator />

                    <ArrowItem
                        onPress={() => { this.language_Ref.current.show() }}
                        title={'DefaultLanguage'}
                        info={ChangeToLange ? ChangeToLange.label : DefaultLanguage.Name} />
                    {/* <SettingsSeparator />

                    <ArrowItem
                        onPress={() => { this.ThemeRef.current.show() }}
                        title={'Theme'}
                        info={Theme ? Theme.Name : null} /> */}

                    <SettingsSeparator />

                    <ArrowItem
                        onPress={() => {
                            this.props.navigation.navigate('Lnaguages', {
                                onSelect: (selectedLanguage) => {
                                    this.setState({ selectedLanguage })
                                },
                                SelectedLanguages: selectedLanguage,
                            })
                        }}
                        title={'Language'}
                        info={`${selectedLanguage.filter(item => item.isSelected == true).length}`}
                    />

                    <SettingsTitle title={'More'} />

                    <SettingsSeparator />

                    <SettingsSeparator />

                    <ArrowItem
                        onPress={() => {
                            this.props.navigation.navigate('StoreList')
                        }}
                        title={'StoreListing'}
                        info={''} />

                    <SettingsSeparator />

                    <ArrowItem
                        onPress={() => {
                            this.props.navigation.navigate('StoreStyle')
                        }}
                        title={'StoreStyle'}
                        info={''} />

                    <SettingsSeparator />

                    {IsScreenPermitted('TenantSettings') && <ArrowItem
                        onPress={() => {
                            this.props.navigation.navigate('TenantSettings')
                        }}
                        title={'TenantSettings'}
                        info={''} />}

                    <SettingsSeparator />
                    {/* {this.props.hello_data.SubStoreId == null ? null :
                        <ArrowItem
                            onPress={() => {
                                this.props.navigation.navigate('SubStoreProfile', {
                                    Id: this.props.hello_data.SubStoreId,
                                    onChildChange: this.onChildChange
                                })
                            }}
                            title={'SubStore'}
                            info={''} />
                    } */}

                </ScrollView>

                {Currencies && <CustomSelector
                    ref={this.CurrenciesRef}
                    options={Currencies.map(item => item.Name)}
                    onSelect={(index) => {
                        this.setState({ Currency: Currencies[index] })
                    }}
                    onDismiss={() => { }}
                />}

                {this.props.languages_data && <CustomSelector
                    ref={this.language_Ref}
                    options={this.props.languages_data.map(item => item.label)}
                    onSelect={(index) => {
                        this.setState({ ChangeToLange: this.props.languages_data[index] })
                    }}
                    onDismiss={() => { }}
                />}

                {AllTheme && <CustomSelector
                    ref={this.ThemeRef}
                    options={AllTheme.map(item => item.Name)}
                    onSelect={(index) => {
                        this.setState({ Theme: AllTheme[index] })
                    }}
                    onDismiss={() => { }}
                />}

            </LazyContainer>
        )
    }
}

const mapStateToProps = ({
    language: {
        languages_data,
        currLang,
    },
    login: {
        hello_data
    },
}) => ({
    languages_data,
    currLang,
    hello_data
})

export default connect(mapStateToProps)(withLocalize(StoreProfile))