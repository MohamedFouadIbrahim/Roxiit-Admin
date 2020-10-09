import React, { Component } from 'react'
import { ScrollView, TextInput, View, I18nManager } from 'react-native'
import { connect } from 'react-redux'
import CustomHeader from '../../components/CustomHeader/index.js';
import LazyContainer from '../../components/LazyContainer'
import ItemSeparator from '../../components/ItemSeparator/index.js';
import HorizontalInput from '../../components/HorizontalInput/index.js';
import { largePagePadding, shadowStyle2, pagePadding, largeBorderRadius } from '../../constants/Style.js';
import { withLocalize } from 'react-localize-redux';
import HeaderSubmitButton from '../../components/HeaderSubmitButton/index.js';
import { mainColor, secondColor, mainTextColor, secondTextColor } from '../../constants/Colors.js';
import CustomSelector from '../../components/CustomSelector/index.js';
import { GetStoreListing, PostStoreListing } from '../../services/StoreProfileServece';
import ArrowItem from '../../components/ArrowItem/index.js';
import { GetPermissionsSimple } from '../../services/PermissionsService.js';
import TranslatedText from '../../components/TranslatedText/index.js';
import FontedText from '../../components/FontedText/index.js';
import CustomSwitch from '../../components/CustomSwitch/index';
import { STRING_LENGTH_LONG } from '../../constants/Config';
import { LongToast } from '../../utils/Toast.js';

class StoreList extends Component {
    constructor(props) {
        super(props)

        const { languages_data, currLang } = this.props

        this.state = {
            lockSubmit: false,
            didFetchData: false,
            Language: languages_data.find(item => item.code === currLang),
        }

        this.lockSubmit = false

        this.languageSelectorRef = React.createRef();

    }

    componentDidMount() {
        this.fetchStoreListing(this.state.Language.key)
    }
    componentWillUnmount() {
        this.cancelFetchData && this.cancelFetchData()
    }
    fetchStoreListing = (language_id = null) => {
        this.cancelFetchData = GetStoreListing(language_id, res => {
            this.setState({
                ShortDescription: res.data.ShortDescription,
                LongDescription: res.data.LongDescription,
                NameOnStore: res.data.NameOnStore,
                didFetchData: true,
                Lang: res.data.Language
            })
        })
    }



    submit = () => {
        const { translate } = this.props
        if (this.lockSubmit) {
            return
        }
        const { Language, NameOnStore, LongDescription, ChangeToLanguage, ShortDescription } = this.state


        if (!NameOnStore || NameOnStore.length < 3) {
            return LongToast('NameOnStoreCantbeleththan3charchter')
        }

        if (!LongDescription || LongDescription.length < 30) {
            return LongToast('LongDescriptionCantbeleththan3charchter')
        }

        if (!ShortDescription || ShortDescription.length < 30) {
            return LongToast('ShortDescriptionCantbeleththan3charchter')
        }
        this.lockSubmit = true;
        this.setState({ lockSubmit: true })
        PostStoreListing({
            ShortDescription,
            LongDescription,
            NameOnStore,
            languageId: ChangeToLanguage ? ChangeToLanguage.key : Language.key
        }, res => {
            this.lockSubmit = false;
            this.setState({ lockSubmit: false })
            LongToast('dataSaved')
            this.props.navigation.goBack()
        }, errr => {
            this.lockSubmit = false;
            this.setState({ lockSubmit: false })
        })
    }


    renderContent = () => {
        if (this.state.didFetchData) {
            const { Language, NameOnStore, LongDescription, ChangeToLanguage, ShortDescription, } = this.state

            return (
                <ScrollView
                    contentContainerStyle={{
                        paddingBottom: largePagePadding * 3,
                    }}>
                    <ArrowItem
                        onPress={() => {
                            this.languageSelectorRef.current.show()
                        }}
                        title={'Language'}
                        info={ChangeToLanguage ? ChangeToLanguage.label : Language.label} />

                    <ItemSeparator />

                    <HorizontalInput
                        maxLength={50}
                        label="StoreName"
                        value={NameOnStore}
                        onChangeText={(text) => { this.setState({ NameOnStore: text }) }} />

                    <ItemSeparator />

                    <HorizontalInput
                        multiline
                        maxLength={80}
                        label="ShortDescription"
                        value={ShortDescription}
                        onChangeText={(text) => { this.setState({ ShortDescription: text }) }} />

                    <ItemSeparator />

                    <View style={{
                        paddingVertical: 15,
                        paddingHorizontal: 20,
                    }} >
                        <TranslatedText style={{
                            // color: '#949EA5'
                            color: secondTextColor
                        }} text={'LongDescription'} />
                        <TextInput
                            style={{
                                // color: '#3B3B4D',
                                color: mainTextColor,
                                textAlign: I18nManager.isRTL ? 'right' : 'left', paddingHorizontal: 20
                            }}
                            multiline
                            maxLength={2000}
                            placeholder={'LongDescription'}
                            placeholderTextColor={'#717175'}
                            underlineColorAndroid='transparent'
                            selectionColor={secondColor}
                            value={LongDescription}
                            onChangeText={(LongDescription) => {
                                this.setState({ LongDescription })
                            }}
                        />
                    </View>

                </ScrollView>
            )
        }
    }

    onSelectLanguage = (index) => {
        const { languages_data } = this.props
        const selectedLanguage = languages_data[index]
        this.setState({ ChangeToLanguage: selectedLanguage }, () => {
            this.fetchStoreListing(this.state.ChangeToLanguage.key)
        })
    }

    render() {
        const { languages_data } = this.props

        return (
            <LazyContainer style={{ flex: 1, backgroundColor: "#FFF" }}>
                <CustomHeader
                    navigation={this.props.navigation}
                    title={"StoreList"}
                    onBack={() => {
                        this.props.route.params?.FormGoLive == true ?
                            this.props.navigation.navigate('GoLiveDetails') :
                            null
                    }}
                    // leftComponent={this.props.route.params?.FormGoLive == true ? 'back' : "drawer"}
                    rightComponent={
                        <HeaderSubmitButton
                            isLoading={this.state.lockSubmit}
                            didSucceed={this.state.didSucceed}
                            onPress={() => { this.submit() }} />
                    }
                />


                {this.renderContent()}

                <CustomSelector
                    ref={this.languageSelectorRef}
                    options={languages_data.map(item => item.label)}
                    onSelect={(index) => { this.onSelectLanguage(index) }}
                    onDismiss={() => { }}
                />

            </LazyContainer>
        )
    }
}

const mapStateToProps = ({
    language: {
        languages_data,
        currLang,
    },
}) => ({
    languages_data,
    currLang,
})

export default connect(mapStateToProps)(withLocalize(StoreList))