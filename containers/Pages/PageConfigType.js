import React from 'react';
import { withLocalize } from 'react-localize-redux';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { connect } from 'react-redux';
import ConfirmModal from '../../components/ConfirmModal/index';
import CustomHeader from "../../components/CustomHeader/index.js";
import CustomTouchable from '../../components/CustomTouchable';
import HeaderSubmitButton from '../../components/HeaderSubmitButton/index.js';
import LazyContainer from "../../components/LazyContainer";
import { DeleteImage, GetPage, PostOneImage, PostPageSetting, ResetSetting } from '../../services/PagesService';
import { SelectEntity } from '../../utils/EntitySelector';
import { LongToast } from '../../utils/Toast';
import { isValidEmail, isValidHexColor, isValidMobileNumber } from "../../utils/Validation";
import { BooleanItems, ColorItem, EmailString, FloatItems, ImageItems, InputString, IntItems, ListItems, MultiItemsImage, MultiListItem, PhoneString, TextView, Icon, File } from './ItemsComponent';

const opacityForDisable = 0.4;

class PageConfigType extends React.Component {
    constructor(props) {
        super(props);
        this.CustomSelectorRefForId = React.createRef()
        this.CustomSelectorRefForString = React.createRef()
        const { country_id, countries } = this.props;
        this.PhoneCountry = countries.find(item => item.Id === country_id)
        this.state = {
            lockSubmit: false,
            prossesEvent: 0,
            initColor: '#ffffff',
            isDescriptionPopupVisible: false,
            hideAllPopUps: false
        }

        this.lockSubmit = false
        this.confirmRef = React.createRef()
        this.confirmRefForDeleteImag = React.createRef()
    }

    componentDidMount() {
        this.fitchData()
        this.setState({ isSystemUser: this.props.is_developer })
    }

    fitchData = () => {
        GetPage(this.props.pageId, res => {

            this.setState({ Data: res.data }, () => {

                Object.values(res.data).map((Result, i) => {
                    let Key = Object.keys(res.data)[i]
                    let Value = { ...Result, Name: Key }
                    this.setState({ [Key]: Value, dataFitched: true })
                })

            })
        })
    }


    submit = () => {

        const { translate } = this.props
        if (this.lockSubmit) {
            return
        }

        let WhatWillPost = Object.assign({}, this.state)

        let Result = Object.values(WhatWillPost).map((v, i) => {
            let Key = Object.keys(WhatWillPost)[i]


            if (v != null) {
                switch (v.Type) {

                    case 'Boolean':

                        WhatWillPost[Key] = { Value: v.Value }
                        return
                    case 'String':

                        var PhoneCountry = this.PhoneCountry

                        if (WhatWillPost[Key] && WhatWillPost[Key].PhoneCountry && v.IsPhoneVaidation) {

                            PhoneCountry = WhatWillPost[Key].PhoneCountry
                        }
                        if (v.MinLength < WhatWillPost[Key].MinLength) {
                            return translate('MinLenth')
                        } else if (v.IsEmailValidation == true && !isValidEmail(WhatWillPost[Key].Value)) {
                            return translate('InvalidEmail')
                        } else if (v.Value && v.IsPhoneVaidation == true && !isValidMobileNumber(PhoneCountry.PhoneCode + WhatWillPost[Key].Value)) {
                            return translate('InvalidPhone')
                        }
                        else if (!v.Value || !v.Value.length) {

                            WhatWillPost[Key] = { Value: null }

                            return
                        } else {
                            WhatWillPost[Key] = { Value: this.state[Key].IsPhoneVaidation ? PhoneCountry.PhoneCode + v.Value : v.Value }
                            return
                        }

                    case 'ListMultiString':

                        if (v.Value == null) {
                            v.Value = []
                            WhatWillPost[Key] = { Value: v.Value }
                        } else {
                            WhatWillPost[Key] = { Value: v.Value }
                        }

                    case 'ListString':

                        if (v.Value == null) {
                            v.Value = ''
                            WhatWillPost[Key] = { Value: v.Value }
                            return
                        } else {
                            WhatWillPost[Key] = { Value: v.Value }
                            return
                        }

                    case 'ListId':

                        WhatWillPost[Key] = { Value: v.Value }

                        return
                    case 'ListMultiId':

                        WhatWillPost[Key] = { Value: v.Value }

                        return

                    case 'Int':

                        WhatWillPost[Key] = { Value: v.Value }

                        return

                    case 'Icon':

                        WhatWillPost[Key] = { Value: v.Value }

                        return

                    case 'Float':

                        WhatWillPost[Key] = { Value: v.Value }

                        return

                    case 'Color':

                        if (!isValidHexColor(v.Value)) {
                            return translate('invaildColor')
                        } else {

                            WhatWillPost[Key] = { Value: v.Value }

                            return
                        }

                    case 'File':

                        WhatWillPost[Key] = { Value: v.Value }
                        return

                    default:

                        return
                }
            }
        })

        if (Result.filter(itev => itev != undefined).length != 0) {
            Result.filter(itev => itev != undefined).map(item => {
                return LongToast(item, false)
            })

        } else {
            this.setState({ lockSubmit: true })
            this.lockSubmit = true

            PostPageSetting(this.props.pageId, WhatWillPost, res => {

                LongToast('dataSaved')
                this.props.navigation.goBack()

                this.setState({ lockSubmit: false })
                this.lockSubmit = false
            }, () => {
                this.setState({ lockSubmit: false })
                this.lockSubmit = false
            })
        }
    }

    onSubmitImage = (Value, Key) => {

        if (this.state.submitImag) {
            return
        }

        if (!Value) {
            return LongToast('CantHaveEmptyInputs')
        }

        const { Title, Description, ImageUrl, Type } = Value

        if (Type == 'ImageList') {

            const { Title, Description, ImageUrl } = Value.Value

            this.setState({ submitImag: true })

            PostOneImage(this.props.pageId, Key, Title, Description, ImageUrl, res => {

                this.setState({ submitImag: false })
                this.setState({ isPopupVisibleqq: false })

                LongToast('dataSaved')
                this.fitchData()

            }, () => {

                this.setState({ submitImag: false })
                this.setState({ isPopupVisibleqq: false })

            }, (loadingProsess) => {

                this.setState({ prossesEvent: loadingProsess * 0.01 })

            })
            return

        }

        this.setState({ submitImag: true })

        PostOneImage(this.props.pageId, Key, Title, Description, ImageUrl, res => {

            this.setState({ submitImag: false })
            this.setState({ isPopupVisible: false })

            LongToast('dataSaved')
            this.fitchData()

        }, () => {

            this.setState({ submitImag: false })

        }, (loadingProsess) => {

            this.setState({ prossesEvent: loadingProsess * 0.01 })

        })

    }

    renderContent = () => {

        if (!this.state.dataFitched) {
            return null
        }
        const { isSystemUser } = this.state

        return Object.values(this.state.Data).map((v, i) => {

            let Key = Object.keys(this.state.Data)[i]

            let ValueProperty = v.ValueProperty != null ? v.ValueProperty : 'Id'
            let TextProperty = v.TextProperty != null ? v.TextProperty : 'Name'


            switch (v.Type) {

                case 'Boolean':
                    return (
                        v.Hide && !isSystemUser ?
                            null :
                            <View style={{
                                opacity: !isSystemUser && v.Disable == true ? opacityForDisable : 1,
                                backgroundColor: 'white',

                            }}
                                key={i + v.RLabel}>
                                <BooleanItems
                                    hideAllPopUps={this.state.hideAllPopUps}
                                    Disable={!isSystemUser && v.Disable}
                                    Description={v.RDescription}
                                    title={this.state[Key].RLabel}
                                    value={this.state[Key].Value}
                                    onValueChange={(data) => {
                                        if (v.Disable != true) {
                                            let dataObj = this.state[Key];
                                            dataObj.Value = data
                                            this.setState({ [this.state[Key]]: dataObj })
                                        }
                                    }} />
                            </View>
                    )
                case 'String':

                    if (v.IsPhoneVaidation == true) {
                        return (
                            v.Hide && !isSystemUser ?
                                null :
                                <View key={i.toString()} >

                                    <PhoneString
                                        hideAllPopUps={this.state.hideAllPopUps}
                                        Description={v.Description}
                                        Disable={!isSystemUser && v.Disable}
                                        PhoneCountry={this.PhoneCountry}
                                        Value={v.Value}
                                        FullNumber={v.Value}
                                        navigation={this.props.navigation}
                                        onSelectCountry={(item, Value) => {
                                            let dataObj = this.state[Key];
                                            dataObj.PhoneCountry = item
                                            dataObj.Value = Value
                                            this.setState({ [this.state[Key]]: dataObj });
                                        }}
                                        onChangeText={data => {
                                            let dataObj = this.state[Key];
                                            dataObj.Value = data
                                            this.setState({ [this.state[Key]]: dataObj });
                                        }}
                                    />

                                </View>

                        )
                    } else if (v.IsEmailValidation == true) {
                        return (
                            v.Hide && !isSystemUser ?
                                null :
                                <View key={i.toString()} >
                                    <EmailString
                                        hideAllPopUps={this.state.hideAllPopUps}
                                        Description={v.RDescription}
                                        Disable={!isSystemUser && v.Disable}
                                        label={`${Key}`}
                                        Value={v.Value}
                                        MaxLength={v.MaxLength}
                                        onChangeText={(data) => {
                                            let dataObj = this.state[Key];
                                            dataObj.Value = data
                                            this.setState({ [this.state[Key]]: dataObj })
                                        }}
                                    />
                                </View>

                        )
                    } else {
                        return (
                            v.Hide && !isSystemUser ?
                                null :
                                <View key={i.toString()} >
                                    <InputString
                                        hideAllPopUps={this.state.hideAllPopUps}
                                        Description={v.RDescription}
                                        Value={v.Value}
                                        label={`${Key}`}
                                        MaxLength={v.MaxLength}
                                        Disable={!isSystemUser && v.Disable}
                                        onChangeText={(data) => {
                                            let dataObj = this.state[Key];
                                            dataObj.Value = data
                                            this.setState({ [this.state[Key]]: dataObj })
                                        }}
                                    />
                                </View>
                        )
                    }
                case 'ListId':

                    return (
                        v.Hide && !isSystemUser ?
                            null :
                            <View key={i.toString()} >

                                <ListItems
                                    hideAllPopUps={this.state.hideAllPopUps}
                                    Description={v.RDescription}
                                    title={v.RLabel}
                                    Disable={!isSystemUser && v.Disable}
                                    onSelectItem={(index) => {
                                        let dataObj = this.state[Key]
                                        dataObj.Value = v.Items[index][ValueProperty]
                                        this.setState({ [this.state[Key]]: dataObj })
                                    }}
                                    Items={v.Items}
                                    Info={this.state[Key].Value != null && this.state[Key].Value != 0 ? v.Items.find(item => item[ValueProperty] == this.state[Key].Value) ? v.Items.find(item => item[ValueProperty] == this.state[Key].Value)[TextProperty] : null : null}
                                    TextProperty={v.TextProperty}
                                />

                            </View>
                    )

                case 'ListString':

                    return (
                        v.Hide && !isSystemUser ?
                            null :
                            <View key={i.toString()} >

                                <ListItems
                                    hideAllPopUps={this.state.hideAllPopUps}
                                    Description={v.RDescription}
                                    title={v.RLabel}
                                    Disable={!isSystemUser && v.Disable}
                                    onSelectItem={(index) => {
                                        let dataObj = this.state[Key]
                                        dataObj.Value = v.Items[index][ValueProperty]
                                        this.setState({ [this.state[Key]]: dataObj })
                                    }}
                                    Items={v.Items}
                                    Info={this.state[Key].Value != null && this.state[Key].Value != 0 ? v.Items.find(item => item[ValueProperty] == this.state[Key].Value) ? v.Items.find(item => item[ValueProperty] == this.state[Key].Value)[TextProperty] : null : null}
                                    TextProperty={v.TextProperty}
                                />

                            </View>

                    )

                case 'ListMultiString':

                    return (
                        v.Hide && !isSystemUser ?
                            null :
                            <View key={i.toString()} >

                                <MultiListItem
                                    hideAllPopUps={this.state.hideAllPopUps}
                                    Description={v.RDescription}
                                    Disable={!isSystemUser && v.Disable}
                                    title={v.RLabel}
                                    Info={this.state[Key].Value != null ? this.state[Key].Value.length : 0}
                                    onPressItem={() => {
                                        if (v.Disable != true) {
                                            const selectedData = this.state[Key].Value ? v.Items.filter(item => this.state[Key].Value.find(ele => ele == item.Id)).sort((a, b) => this.state[Key].Value.indexOf(a.Id) - this.state[Key].Value.indexOf(b.Id)) : null
                                            SelectEntity(this.props.navigation, Result => {
                                                const StringsResult = Result.map((value, index) => value[ValueProperty])
                                                let dataObj = this.state[Key]
                                                dataObj.Value = StringsResult
                                                this.setState({ [this.state[Key]]: dataObj })
                                            }, null, null, false, 2, this.state[Key].Value == null ? [] : selectedData, { initialData: v.Items, forceSubmit: false, reorder: true })
                                        }
                                    }}
                                />

                            </View>

                    )

                case 'Int':

                    return (
                        v.Hide && !isSystemUser ?
                            null :
                            <View key={i.toString()} >

                                <IntItems
                                    hideAllPopUps={this.state.hideAllPopUps}
                                    Description={v.RDescription}
                                    Disable={!isSystemUser && v.Disable}
                                    Value={v.Value}
                                    label={v.RLabel}
                                    onChangeText={(data) => {
                                        let dataObj = this.state[Key];
                                        dataObj.Value = data
                                        this.setState({ [this.state[Key]]: dataObj })
                                    }}
                                />

                            </View>
                    )

                case 'Image':
                    return (
                        v.Hide && !isSystemUser ?
                            null :
                            <View key={i.toString()} >
                                <ImageItems
                                    navigation={this.props.navigation}
                                    ItemsForNavigation={v.Items}
                                    hideAllPopUps={this.state.hideAllPopUps}
                                    Disable={!isSystemUser && v.Disable}
                                    Description={v.RDescription}
                                    Name={Key}
                                    RLabel={v.RLabel}
                                    onSubmit={(Value) => { this.onSubmitImage(Value, Key) }}
                                    Value={v.Value}
                                    submitImag={this.state.submitImag}
                                    prossesEvent={this.state.prossesEvent}
                                    pageId={this.props.pageId}
                                    fetchData={this.fitchData}
                                    ShowDescription={v.RShowDescription}
                                />
                            </View>
                    )

                case 'ImageList':

                    return (
                        v.Hide && !isSystemUser ?
                            null :
                            <View key={i.toString()} >

                                <MultiItemsImage
                                    navigation={this.props.navigation}
                                    ItemsForNavigation={v.Items}
                                    Description={v.RDescription}
                                    Value={v.Value}
                                    RLabel={v.RLabel}
                                    Disable={!isSystemUser && v.Disable}
                                    Key={Key}
                                    fitchData={this.fitchData}
                                    pageId={this.props.pageId}
                                    hideAllPopUps={this.state.hideAllPopUps}
                                    ShowDescription={v.RShowDescription}
                                />
                            </View>
                    )

                case 'Float':

                    return (
                        v.Hide && !isSystemUser ?
                            null :
                            <View key={i + v.RLabel} style={{ opacity: !isSystemUser && v.Disable == true ? opacityForDisable : 1 }} >

                                <FloatItems
                                    hideAllPopUps={this.state.hideAllPopUps}
                                    Description={v.RDescription}
                                    Disable={!isSystemUser && v.Disable}
                                    Value={v.Value}
                                    label={v.RLabel}
                                    onChangeText={(data) => {
                                        let dataObj = this.state[Key];
                                        dataObj.Value = data
                                        this.setState({ [this.state[Key]]: dataObj })
                                    }}
                                />
                            </View>
                    )

                case 'Color':

                    return (
                        v.Hide && !isSystemUser ?
                            null :
                            <View key={i.toString()} >
                                <ColorItem
                                    hideAllPopUps={this.state.hideAllPopUps}
                                    Description={v.RDescription}
                                    data={this.state[Key]}
                                    RLabel={v.RLabel}
                                    Disable={!isSystemUser && v.Disable}
                                    i={i}
                                    Key={Key}
                                    onColorChange={(color) => {
                                        let dataObj = this.state[Key];
                                        dataObj.Value = color

                                        this.setState({ [this.state[Key]]: { Value: color }, initColor: color })

                                    }}
                                />
                            </View>

                    )

                case 'RTextView':
                    return (
                        v.Hide && !isSystemUser ?
                            null :
                            <View key={i.toString()} >
                                <TextView
                                    Description={v.RDescription}
                                    RLabel={v.RLabel}
                                />
                            </View>
                    )
                case 'Icon':
                    return (
                        v.Hide && !isSystemUser ?
                            null :
                            <View key={i.toString()} >
                                <Icon
                                    onIconSelected={(data) => {
                                        let dataObj = this.state[Key];
                                        dataObj.Value = data
                                        this.setState({ [this.state[Key]]: dataObj })
                                    }}
                                    navigation={this.props.navigation}
                                    hideAllPopUps={this.state.hideAllPopUps}
                                    Description={v.RDescription}
                                    Value={v.Value ? v.Value : 'Feather,truck'}
                                    RLabel={v.RLabel}
                                    Disable={!isSystemUser && v.Disable}
                                />
                            </View>
                    )
                case 'File':
                    return (
                        v.Hide && !isSystemUser ?
                            null :
                            <View key={i.toString()} >
                                <File
                                    Key={Key}
                                    navigation={this.props.navigation}
                                    hideAllPopUps={this.state.hideAllPopUps}
                                    Description={v.RDescription}
                                    Value={v.Value}
                                    onSelectFile={(data) => {
                                        let dataObj = this.state[Key];
                                        dataObj.Value = data
                                        this.setState({ [this.state[Key]]: dataObj })
                                    }}
                                    pageId={this.props.pageId}
                                    RLabel={v.RLabel}
                                    Disable={!isSystemUser && v.Disable}
                                />
                            </View>
                    )
                default: return <View />
            }
        })
    }

    render() {
        if (!this.state.dataFitched) {
            return null
        }
        return (
            <LazyContainer
                style={{ flex: 1, backgroundColor: 'white' }}
                onTouchStart={() => {
                    this.setState({ hideAllPopUps: true })
                    if (this.state.isDescriptionPopupVisible) {
                        this.setState({ isDescriptionPopupVisible: false })
                    }
                }} >
                <CustomHeader
                    leftComponent="back"
                    navigation={this.props.navigation}
                    title={this.props.pageName}
                    rightNumOfItems={2}
                    rightComponent={
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                        >
                            <CustomTouchable
                                onPress={() => {
                                    this.imageIdForDelete = ''
                                    this.PropertyName = ''
                                    this.confirmRef.current.show()
                                }}
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    flex: 1,
                                }}>
                                <AntDesign
                                    name={`close`}
                                    size={20}
                                    color={'white'} />
                            </CustomTouchable>

                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    flex: 1,
                                }}
                            >
                                <HeaderSubmitButton
                                    isLoading={this.state.lockSubmit}
                                    onPress={() => { this.submit() }} />
                            </View>
                        </View>
                    }

                />

                {Platform.OS == 'ios' ?
                    <KeyboardAvoidingView style={{ flex: 1 }} behavior='padding' keyboardVerticalOffset={0}  >
                        <ScrollView contentContainerStyle={{ paddingTop: 10 }} >

                            {this.renderContent()}
                        </ScrollView>

                    </KeyboardAvoidingView> :
                    <ScrollView contentContainerStyle={{ paddingTop: 10 }} >

                        {this.renderContent()}
                    </ScrollView>

                }

                <ConfirmModal
                    ref={this.confirmRef}
                    onConfirm={() => {
                        if (this.imageIdForDelete && this.PropertyName) {
                            DeleteImage(this.props.pageId, this.imageIdForDelete, this.PropertyName, res => {
                                LongToast('dataDeleted')
                                this.fitchData()
                            })
                        } else {
                            ResetSetting(this.props.pageId, res => {
                                LongToast('dataReset')
                                this.props.navigation.goBack()
                                // this.fitchData()
                            })
                        }
                    }}
                    onResponse={(check) => {
                        if (check == true) {

                        }
                    }}
                />
            </LazyContainer>
        )
    }
}

const mapStateToProps = ({
    inspector: {
        is_developer
    },
    login: {
        country_id,
    },
    places: {
        countries,
    },
}) => ({
    is_developer,
    country_id,
    countries
})

export default connect(mapStateToProps)(withLocalize(PageConfigType))