import React from 'react';
import { ScrollView } from 'react-native';
import { withLocalize } from 'react-localize-redux';
import LazyContainer from '../../components/LazyContainer';
import HorizontalInput from '../../components/HorizontalInput';
import ItemSeparator from '../../components/ItemSeparator';
import HeaderSubmitButton from '../../components/HeaderSubmitButton';
import CustomHeader from '../../components/CustomHeader';
import CustomSelector from '../../components/CustomSelector';
import ArrowItem from '../../components/ArrowItem';
import { GetPayMentMethodConfig, PostPayMentMethodConfig, DeletePayMentMethodConfig } from '../../services/PayMentMethodService';
import CustomButton from '../../components/CustomButton';
import ConfirmModal from '../../components/ConfirmModal';
import { largeBorderRadius } from '../../constants/Style';
import { LongToast } from '../../utils/Toast';

class PaymentConfig extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            lockSubmit: false,
            DataFitched: false
        }
        this.confirmRef = React.createRef()
        this.ProvidersRef = React.createRef()
        this.lockSubmit = false;
        this.ShowProvider = this.props.route.params?.ShowProvider;
        this.methodId = this.props.route.params?.Id;
        this.ShowDeleteButton = this.props.route.params?.ShowDeleteButton
    }

    fitchData = (ProviderId = null) => {
        GetPayMentMethodConfig(this.methodId, ProviderId, res => {
            this.setState({ ...res.data, DataFitched: true })
        })
    }

    componentDidMount() {
        this.fitchData()
    }

    onProviderSelect = (Provider) => {
        this.setState({
            selectedProvider: Provider
        }, () => {
            this.fitchData(this.state.selectedProvider.Id)
        })
    }

    submit = () => {
        const { FeesPercentage, FeesFixed, ProviderKey1, ProviderKey2, ProviderKey3, ProviderKey4, selectedProvider, ProviderId } = this.state
        if (this.lockSubmit) {
            return
        }
        if (!ProviderKey1) {
            return LongToast('CantHaveEmptyInputs')
        }
        this.lockSubmit = true
        this.setState({ lockSubmit: true })
        PostPayMentMethodConfig({
            PaymentMethodId: this.methodId,
            ProviderId: selectedProvider ? selectedProvider.Id : ProviderId,
            FeesPercentage,
            FeesFixed,
            ProviderKey1,
            ProviderKey2,
            ProviderKey3,
            ProviderKey4
        }, () => {
            this.lockSubmit = false
            this.setState({ lockSubmit: false })
            LongToast('dataSaved')
            this.props.navigation.goBack()
            const { onChildChange } = this.props.route.params
            onChildChange && onChildChange()
        }, () => {
            this.lockSubmit = false
            this.setState({ lockSubmit: false })
        })
    }

    handelProviders = (providers, providerId) => {
        const { translate } = this.props
        if (providerId == null || providerId == '') {
            return translate('NoneSelected')
        }
        else {
            return providers.find(item => item.Id == providerId).Name
        }
    }

    onDeleteConfig = () => {

        const { selectedProvider, ProviderId } = this.state
        const Id = selectedProvider ? selectedProvider.Id : ProviderId

        DeletePayMentMethodConfig(this.methodId, Id, res => {
            LongToast('dataDeleted')
            const { onChildChange } = this.props.route.params
            onChildChange && onChildChange()
            this.props.navigation.goBack()
        })
    }

    renderContent = () => {
        const { FeesPercentage, FeesFixed, ProviderKey1, ProviderKey2, ProviderKey3, ProviderKey4, Providers, ProviderId, selectedProvider } = this.state;
        return (
            <ScrollView>
                {this.ShowProvider == true ?

                    <ArrowItem
                        title='Porvider'
                        info={selectedProvider ? selectedProvider.Name : this.handelProviders(Providers, ProviderId)}
                        onPress={() => {
                            this.ProvidersRef.current.show()
                        }}
                    /> : null
                }

                <ItemSeparator />

                <HorizontalInput
                    keyboardType='numeric'
                    label={'FeesPercentage'}
                    value={FeesPercentage == null ? '' : String(FeesPercentage)}
                    onChangeText={(e) => { this.setState({ FeesPercentage: e }) }}
                />
                <ItemSeparator />

                <HorizontalInput
                    keyboardType='numeric'
                    label={'FeesFixed'} value={FeesFixed == null ? '' : String(FeesFixed)}
                    onChangeText={(e) => { this.setState({ FeesFixed: e }) }}
                />
                <ItemSeparator />

                <HorizontalInput
                    label={'ProviderKey1'} value={ProviderKey1 == null ? '' : ProviderKey1}
                    onChangeText={(e) => { this.setState({ ProviderKey1: e }) }}
                />
                <ItemSeparator />

                <HorizontalInput
                    label={'ProviderKey2'} value={ProviderKey2 == null ? '' : ProviderKey2}
                    onChangeText={(e) => { this.setState({ ProviderKey2: e }) }}
                />
                <ItemSeparator />

                <HorizontalInput
                    label={'ProviderKey3'} value={ProviderKey3 == null ? '' : ProviderKey3}
                    onChangeText={(e) => { this.setState({ ProviderKey3: e }) }}
                />
                <ItemSeparator />

                <HorizontalInput
                    label={'ProviderKey4'} value={ProviderKey4 == null ? '' : ProviderKey4}
                    onChangeText={(e) => { this.setState({ ProviderKey4: e }) }}
                />
                <ItemSeparator />

                {this.ShowDeleteButton == true ?
                    <CustomButton
                        title='Delete'
                        style={{ backgroundColor: '#cc0000', margin: largeBorderRadius }}
                        onPress={() => {
                            // this.onDeleteConfig()
                            this.confirmRef.current.show()
                        }}
                    /> : null
                }

            </ScrollView >
        )
    }
    render() {
        const { Providers, DataFitched } = this.state
        if (!DataFitched) {
            return null
        }
        return (
            <LazyContainer style={{ flex: 1, backgroundColor: '#fff' }} >
                <CustomHeader
                    leftComponent="back"
                    navigation={this.props.navigation}
                    title="Payment_Config"
                    rightComponent={
                        <HeaderSubmitButton
                            isLoading={this.state.lockSubmit}
                            didSucceed={this.state.didSucceed}
                            onPress={() => { this.submit() }}
                        />
                    }
                />

                {this.renderContent()}

                <CustomSelector
                    ref={this.ProvidersRef}
                    options={Providers.map(item => item.Name)}
                    onSelect={(index) => { this.onProviderSelect(Providers[index]) }}
                    onDismiss={() => { }}
                />

                <ConfirmModal
                    ref={this.confirmRef}
                    onConfirm={() => { this.onDeleteConfig() }}
                    onResponse={(check) => {

                    }}
                />

            </LazyContainer>
        );
    }
}
export default withLocalize(PaymentConfig) 