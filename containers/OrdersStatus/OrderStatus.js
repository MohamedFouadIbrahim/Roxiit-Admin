import React, { Component } from 'react';
import { ActivityIndicator, Keyboard, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { withLocalize } from 'react-localize-redux';
import { connect } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomHeader from '../../components/CustomHeader/index.js';
import CustomTouchable from '../../components/CustomTouchable';
import HorizontalInput from '../../components/HorizontalInput/index.js';
import ItemSeparator from '../../components/ItemSeparator/index.js';
import LazyContainer from '../../components/LazyContainer';
import { LongToast } from '../../utils/Toast.js';
import SwitchItem from '../../components/SwitchItem/index.js';
import CustomSelector from '../../components/CustomSelector/index.js';
import { GetOrderStatus, GetThemeList, EditOrderStatus } from '../../services/OrderStatusService.js';
import ArrowItem from '../../components/ArrowItem/index.js';
import { ExternalTranslate } from '../../utils/Translate.js';

class OrderStatus extends Component {
    constructor(props) {
        super(props);
        const { languages_data, currLang } = this.props;

        this.state = {
            submitting: false,
            Language: languages_data.find(item => item.code === currLang),
            Name: null,
            ShownInCustomerList: true,
            StandardOrderCycle: true,
            ThemeList: null,
            Theme: null
        }
        if (this.props.route.params && this.props.route.params?.Id) {
            this.editMode = true
            this.OrderStatusId = this.props.route.params?.Id
        }
        else {
            this.editMode = false
            this.OrderStatusId = 0

        }
        this.languageSelectorRef = React.createRef();
        this.themeSelectorRef = React.createRef();

    }

    componentDidMount() {
        this.fetchOrderStatus()
    }

    componentWillUnmount() {
        this.cancelFetchData && this.cancelFetchData()
        this.cancelFetchThemeList && this.cancelFetchThemeList()
    }

    fetchOrderStatus = () => {
        if (this.editMode) {
            this.cancelFetchData =
                GetOrderStatus(this.OrderStatusId, this.state.Language ? this.state.Language.key : null, res => {
                    const { language, ...restData } = res.data
                    this.setState({
                        ...restData,
                        Language: this.props.languages_data.find(item => item.key === language),
                    })
                })
        }
    }


    fetchThemeList = () => {
        this.cancelFetchThemeList =
            GetThemeList(this.state.Language ? this.state.Language.key : null, res => {
                this.setState({
                    ThemeList: res.data.Data
                })
                this.themeSelectorRef.current.show()

            })
    }

    submit = () => {
        Keyboard.dismiss()

        const {
            Language,
            Name,
            Theme,
            ShownInCustomerList,
            StandardOrderCycle,
        } = this.state

        if (!Name || !Theme) {
            return LongToast('CantHaveEmptyInputs')
        }

        this.setState({ submiting: true })
        const Id = this.OrderStatusId;

        const args = {
            Id,
            language: Language.key,
            Name,
            ThemeId: Theme.Id,
            ShownInCustomerList,
            StandardOrderCycle,
        }

        this.cancelEditOrderStatus = EditOrderStatus(args, (res) => {
            const {
                onChildChange
            } = this.props.route.params
            this.Id = res.data
            this.setState({ submiting: false })
            onChildChange && onChildChange()
            this.props.navigation.goBack()
            LongToast('dataSaved')
        }, (err) => {
            this.setState({ submiting: false })
        })
    }


    inputsValidation = () => {
        const {
            minStep,
            maxStep,
            virtualBalancePerOne,
            virtualBalanceForNewCustomer,
        } = this.state

        if (!minStep || !maxStep || !virtualBalancePerOne || !virtualBalanceForNewCustomer) {
            return LongToast('CantHaveEmptyInputs')
        }


        return true

    }


    renderContent = () => {
        const {
            Language,
            Name,
            Theme,
            ShownInCustomerList,
            StandardOrderCycle,
            CanBeModified,
        } = this.state

        return (
            <ScrollView>

                <ArrowItem
                    onPress={() => {
                        this.languageSelectorRef.current.show()
                    }}
                    title={'Language'}
                    info={Language ? Language.label : null} />

                <ItemSeparator />


                <HorizontalInput
                    label="Name"
                    value={Name}
                    onChangeText={(text) => { this.setState({ Name: text }) }} />

                <ItemSeparator />


                <ArrowItem
                    onPress={() => {
                        if (CanBeModified)
                            this.fetchThemeList()
                    }}
                    title={'Theme'}
                    info={Theme ? Theme.Name : ExternalTranslate('NoneSelected')} />

                <ItemSeparator />


                <SwitchItem
                    title="ShownInCustomerList"
                    value={ShownInCustomerList}
                    onValueChange={(ShownInCustomerList) => {
                        this.setState({ ShownInCustomerList })
                    }}
                    disabled={CanBeModified ? false : true} />

                <ItemSeparator />

                <SwitchItem
                    title="StandardOrderCycle"
                    value={StandardOrderCycle}
                    onValueChange={(StandardOrderCycle) => {
                        this.setState({ StandardOrderCycle })
                    }}
                    disabled={CanBeModified ? false : true} />

                <ItemSeparator />

            </ScrollView>
        )
    }

    render() {
        const { languages_data } = this.props;
        const { ThemeList } = this.state;

        return (
            <LazyContainer style={{ flex: 1, backgroundColor: "#FFF" }}>
                <CustomHeader
                    navigation={this.props.navigation}
                    title={"OrderStatus"}
                    rightComponent={
                        this.state.submitting ?
                            <ActivityIndicator color="#FFF" size="small" />
                            :
                            <CustomTouchable
                                onPress={this.submit}
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

                {Platform.OS == 'ios' ?

                    <KeyboardAvoidingView behavior='padding' enabled
                        style={{ flex: 1 }}
                        keyboardVerticalOffset={40}
                    >
                        {this.renderContent()}
                    </KeyboardAvoidingView> :
                    this.renderContent()}


                <CustomSelector
                    ref={this.languageSelectorRef}
                    options={languages_data.map(item => item.label)}
                    onSelect={(index) => {
                        this.setState({
                            Language: languages_data[index]
                        }, () => {
                            this.fetchOrderStatus()
                        })
                    }}
                    onDismiss={() => { }}
                />

                {ThemeList != null ? <CustomSelector
                    ref={this.themeSelectorRef}
                    options={ThemeList.map(item => item.Name)}
                    onSelect={(index) => {
                        this.setState({
                            Theme: ThemeList[index]
                        })
                    }}
                    onDismiss={() => { }}
                /> : null}

            </LazyContainer>
        )
    }
}


const mapStateToProps = ({
    language: {
        languages_data,
        currLang
    },
}) => ({
    languages_data,
    currLang
});

export default connect(mapStateToProps)(withLocalize(OrderStatus));
