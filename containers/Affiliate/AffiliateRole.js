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
import { GetAffiliateRole, EditAffiliateRole } from '../../services/AffiliateRolesServices';

class AffiliateRole extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fetching: true,
            submitingAffiliateRole: false,
            minStep: null,
            maxStep: null,
            virtualBalancePerOne: null,
            virtualBalanceForNewCustomer: null,
        }
        if (this.props.route.params && this.props.route.params?.Id) {
            this.editMode = true
            this.AffiliateRoleId = this.props.route.params?.Id
        }
        else {
            this.editMode = false
            this.AffiliateRoleId = 0

        }
    }

    componentDidMount() {
        this.fetchAffiliateRoles()
    }

    componentDidUpdate(prevProps) {
        if (this.props.navigation !== prevProps.navigation) {
            this.fetchAffiliateRoles()
        }
    }

    componentWillUnmount() {
        this.cancelFetchData && this.cancelFetchData()
    }

    fetchAffiliateRoles = () => {
        if (this.editMode) {
            this.cancelFetchData = GetAffiliateRole(this.AffiliateRoleId, (res) => {
                this.setState({
                    minStep: res.data.MinStep,
                    maxStep: res.data.MaxStep,
                    virtualBalancePerOne: res.data.VirtualBalancePerOne,
                    virtualBalanceForNewCustomer: res.data.VirtualBalanceForNewCustomer,
                    fetching: false,
                })
            }
            )
        }
    }


    submitAffiliateRole = () => {
        Keyboard.dismiss()

        const {
            minStep,
            maxStep,
            virtualBalancePerOne,
            virtualBalanceForNewCustomer,
        } = this.state

        if (!this.inputsValidation()) {
            return
        }

        this.setState({ submitingAffiliateRole: true })
        const Id = this.AffiliateRoleId;

        const args = {
            Id,
            MinStep: minStep,
            MaxStep: maxStep,
            VirtualBalancePerOne: virtualBalancePerOne,
            VirtualBalanceForNewCustomer: virtualBalanceForNewCustomer,
        }


        this.cancelFetchDataeditAffiliateRole = EditAffiliateRole(args, (res) => {
            const {
                onChildChange
            } = this.props.route.params
            this.Id = res.data
            this.setState({ submitingAffiliateRole: false })
            onChildChange && onChildChange()
            this.props.navigation.goBack()
            LongToast('dataSaved')
        }, (err) => {
            this.setState({ submitingAffiliateRole: false })
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
        if (isNaN(minStep)) {
            LongToast('MinStepShouldBeANumber')
            return false
        }

        if (parseInt(minStep) < 1) {
            LongToast('MinStepShouldBeGreaterThanOne')
            return false
        }

        if (isNaN(maxStep)) {
            LongToast('MaxStepShouldBeANumber')
            return false
        }

        if (parseInt(maxStep) <= parseInt(minStep)) {
            LongToast('MaxStepShouldBeGreaterThanMinStep')
            return false
        }

        if (isNaN(virtualBalancePerOne) || virtualBalancePerOne < 0) {
            LongToast('ForMeShouldBeAPositiveNumber')
            return false
        }


        if (isNaN(virtualBalanceForNewCustomer) || virtualBalanceForNewCustomer < 0) {
            LongToast('ForNewCustomerShouldBeAPositiveNumber')
            return false
        }

        return true

    }


    renderAffiliateRole = () => {
        const {
            minStep,
            maxStep,
            virtualBalancePerOne,
            virtualBalanceForNewCustomer,


        } = this.state
        const { Currency } = this.props;
        return (
            <ScrollView>

                <HorizontalInput
                    keyboardType="numeric"
                    label="MinStep"
                    value={minStep ? `${minStep}` : null}
                    onChangeText={(text) => { this.setState({ minStep: text }) }} />

                <ItemSeparator />

                <HorizontalInput
                    keyboardType="numeric"
                    label="MaxStep"
                    value={maxStep ? `${maxStep}` : null}
                    onChangeText={(text) => { this.setState({ maxStep: text }) }} />

                <ItemSeparator />

                <HorizontalInput
                    rightMember={Currency.Name}
                    keyboardType="numeric"
                    label="ForMe"
                    value={virtualBalancePerOne ? `${virtualBalancePerOne}` : null}
                    onChangeText={(text) => { this.setState({ virtualBalancePerOne: text }) }} />

                <ItemSeparator />

                <HorizontalInput
                    rightMember={Currency.Name}
                    keyboardType="numeric"
                    label="ForNewCustomer"
                    value={virtualBalanceForNewCustomer ? `${virtualBalanceForNewCustomer}` : null}
                    onChangeText={(text) => { this.setState({ virtualBalanceForNewCustomer: text }) }} />

                <ItemSeparator />


            </ScrollView>
        )
    }

    render() {
        return (
            <LazyContainer style={{ flex: 1, backgroundColor: "#FFF" }}>
                <CustomHeader
                    navigation={this.props.navigation}
                    title={"AffiliateRole"}
                    rightComponent={
                        this.state.submitingAffiliateRole ?
                            <ActivityIndicator color="#FFF" size="small" />
                            :
                            <CustomTouchable
                                onPress={this.submitAffiliateRole}
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
                    this.state.fetching ? null :
                        <KeyboardAvoidingView behavior='padding' enabled
                            style={{ flex: 1 }}
                            keyboardVerticalOffset={40}
                        >
                            {this.renderAffiliateRole()}
                        </KeyboardAvoidingView> :
                    this.renderAffiliateRole()}

            </LazyContainer>
        )
    }
}
const mapStateToProps = ({
    login: {
        Currency,
    },
}) => ({
    Currency,
})
export default connect(mapStateToProps)(withLocalize(AffiliateRole))