import React, { Component } from 'react';
import { ActivityIndicator, Keyboard, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomHeader from '../../components/CustomHeader/index.js';
import CustomTouchable from '../../components/CustomTouchable';
import HorizontalInput from '../../components/HorizontalInput/index.js';
import ItemSeparator from '../../components/ItemSeparator/index.js';
import LazyContainer from '../../components/LazyContainer';
import { LongToast } from '../../utils/Toast.js';
import { GetSubStoreType, EditSubStoreType } from '../../services/SubStoreTypeServices';
import { ExternalTranslate } from '../../utils/Translate.js';
import CheckBox from '../../components/CheckBox/index.js';
import TranslatedText from '../../components/TranslatedText/index.js';
import { pagePadding } from '../../constants/Style.js';
import SettingsTitle from '../../components/Settings/SettingsTitle.js';
import SettingsSeparator from '../../components/Settings/SettingsSeparator.js';

class SubStoreType extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fetching: true,
            submitingSubStoreType: false,
            Name: null,
            Description: null,
            MaxProductsCount: null,
            Validity: null,
            Commission: null,
            ShowQrCdoeReaderInCustomerSideMenu: false,
        }

        if (this.props.route.params && this.props.route.params?.Id) {
            this.editMode = true
            this.SubStoreTypeId = this.props.route.params?.Id
        }

        else {
            this.editMode = false
            this.SubStoreTypeId = 0

        }
    }

    componentDidMount() {
        this.fetchSubStoreType()
    }

    componentDidUpdate(prevProps) {
        if (this.props.navigation !== prevProps.navigation) {
            this.fetchSubStoreType()
        }
    }

    componentWillUnmount() {
        this.cancelFetchData && this.cancelFetchData()
    }

    fetchSubStoreType = () => {
        if (this.editMode) {
            this.cancelFetchData = GetSubStoreType(this.SubStoreTypeId, (res) => {
                this.setState({
                    ...res.data,
                    fetching: false,
                })
            }
            )
        }
    }


    submitSubStoreType = () => {
        Keyboard.dismiss()

        const {
            Name,
            Description,
            MaxProductsCount,
            Validity,
            Commission,
            ShowQrCdoeReaderInCustomerSideMenu
        } = this.state

        if (!this.inputsValidation()) {
            return
        }

        this.setState({ submitingSubStoreType: true })
        const Id = this.SubStoreTypeId;

        const args = {
            Id,
            Name,
            Description,
            MaxProductsCount: parseInt(MaxProductsCount),
            Validity: parseInt(Validity),
            Commission,
            ShowQrCdoeReaderInCustomerSideMenu
        }

        this.cancelFetchDataeditSubStoreITyped = EditSubStoreType(args, (res) => {
            const {
                onChildChange
            } = this.props.navigation.state.params
            this.Id = res.data
            this.setState({ submitingSubStoreType: false })
            onChildChange && onChildChange()
            this.props.navigation.goBack()
            LongToast('dataSaved')
        }, (err) => {
            this.setState({ submitingSubStoreType: false })
        })
    }

    inputsValidation = () => {
        const {
            Name,
            MaxProductsCount,
            Validity,
        } = this.state

        if (!Name) {
            LongToast('NameCantBeEmpty')
            return false
        }
        if (isNaN(MaxProductsCount) || (MaxProductsCount && MaxProductsCount <= 0)) {
            LongToast('MaxProductsCountShouldBeAPositiveNumber')
            return false
        }
        if (isNaN(Validity) || (Validity && Validity <= 0)) {
            LongToast(ExternalTranslate('ValidityInDays') + ExternalTranslate('ShouldBeAPositiveNumber'), false)
            return false
        }
        return true
    }


    renderSubStoreType = () => {
        const {
            Name,
            Description,
            MaxProductsCount,
            Validity,
            Commission,
            ShowQrCdoeReaderInCustomerSideMenu
        } = this.state
        return (
            <ScrollView>
                <HorizontalInput
                    label="Name"
                    value={Name ? `${Name}` : null}
                    onChangeText={(Name) => { this.setState({ Name }) }} />

                <ItemSeparator />

                <HorizontalInput
                    label="Description"
                    value={Description ? `${Description}` : null}
                    onChangeText={(Description) => { this.setState({ Description }) }} />

                <ItemSeparator />

                <HorizontalInput
                    keyboardType="numeric"
                    label="MaxProductsCount"
                    value={MaxProductsCount ? `${MaxProductsCount}` : null}
                    onChangeText={(MaxProductsCount) => { this.setState({ MaxProductsCount }) }} />

                <ItemSeparator />

                <HorizontalInput
                    keyboardType="numeric"
                    label="ValidityInDays"
                    value={Validity != null ? String(Validity) : null}
                    onChangeText={(Validity) => { this.setState({ Validity }) }} />
                <ItemSeparator />

                <HorizontalInput
                    keyboardType="numeric"
                    label="Commission"
                    value={Commission != null ? String(Commission) : null}
                    rightMember={'%'}
                    onChangeText={(Commission) => { this.setState({ Commission }) }} />
                <ItemSeparator />

                <SettingsTitle title={'UniquePermission'} containerStyle={{ backgroundColor: "#F4F6F9" }} />
                <SettingsSeparator />

                <CustomTouchable
                    style={{
                        flexDirection: 'row',
                        padding: pagePadding
                    }}
                    onPress={() => this.setState({ ShowQrCdoeReaderInCustomerSideMenu: !ShowQrCdoeReaderInCustomerSideMenu })}
                >
                    <CheckBox selected={ShowQrCdoeReaderInCustomerSideMenu} />
                    <TranslatedText style={{ fontSize: 12, paddingHorizontal: pagePadding / 2, lineHeight: pagePadding * 2 }} text={'ShowQrCodeReader'} />
                </CustomTouchable>
                <ItemSeparator />

            </ScrollView>
        )
    }

    render() {
        return (
            <LazyContainer style={{ flex: 1, backgroundColor: "#FFF" }}>
                <CustomHeader
                    navigation={this.props.navigation}
                    title={"SubStoreType"}
                    rightComponent={
                        this.state.submitingSubStoreType ?
                            <ActivityIndicator color="#FFF" size="small" />
                            :
                            <CustomTouchable
                                onPress={this.submitSubStoreType}
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    flex: 1,
                                }}>
                                <Ionicons
                                    name={`md-checkmark`}
                                    size={18}
                                    color={'white'} />
                            </CustomTouchable>
                    } />

                {this.editMode == true && this.state.fetching ? null :
                    Platform.OS == 'ios' ?
                        <KeyboardAvoidingView behavior='padding' enabled
                            style={{ flex: 1 }}
                            keyboardVerticalOffset={40}>
                            {this.renderSubStoreType()}
                        </KeyboardAvoidingView> :
                        this.renderSubStoreType()}

            </LazyContainer>
        )
    }
}

export default SubStoreType