import React from 'react';
import { withLocalize } from 'react-localize-redux';
import { ScrollView } from 'react-native';
import CustomButton from '../../components/CustomButton/index';
import HorizontalInput from '../../components/HorizontalInput/index';
import ItemSeparator from '../../components/ItemSeparator/index';
import LazyContainer from '../../components/LazyContainer';
import { STRING_LENGTH_SHORT } from '../../constants/Config';
import SwitchItem from '../../components/SwitchItem';
import { SelectEntity } from '../../utils/EntitySelector';

class CourierConfig extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            Name: null,
            CourierDefaultName: null,
            ProviderKey1: null,
            ProviderKey2: null,
            ProviderKey3: null,
            ProviderKey4: null,
            ProviderKey5: null,
            ProviderKey6: null,
            ProviderKey7: null,
            ProviderKey8: null,
            ProviderKey9: null,
            ProviderKey10: null,
            ProviderKey11: null,
            ProviderKey12: null,
            ProviderKey13: null,
            OrderMinValue: null,
            OrderMaxValue: null,
            FreeShippingAbove: null,
            IsAddressRequired: true,
            SecuiretyKey: null,
            didDataFetched: null,
            lockSubmit: false,
            POS_OptionGroups: []
        }
        this.TabIndex = 0
        this.lockSubmit = false
    }

    render() {
        const isConfigured = this.props?.isConfigured

        const {
            ProviderKey1,
            ProviderKey2,
            ProviderKey3,
            ProviderKey4,
            ProviderKey5,
            ProviderKey6,
            ProviderKey7,
            ProviderKey8,
            ProviderKey9,
            ProviderKey10,
            ProviderKey11,
            ProviderKey12,
            ProviderKey13,
            OrderMinValue,
            OrderMaxValue,
            FreeShippingAbove,
            IsAddressRequired,
            Name,
            CourierDefaultName,
            AskForWarehouse,
            didDataFetched,
            POS_OptionGroups
        } = this.props.data

        const {
            onTabDataChange
        } = this.props
        return (
            <LazyContainer style={{ flex: 1 }} >

                <ScrollView style={{ flexGrow: 1 }} >

                    <HorizontalInput
                        maxLength={STRING_LENGTH_SHORT}
                        label={'Name'}
                        value={Name}
                        onChangeText={(Name) => {
                            onTabDataChange(this.TabIndex, {
                                ...this.props.data,
                                Name
                            })
                        }}
                    />

                    <ItemSeparator />

                    <HorizontalInput
                        editable={false} maxLength={STRING_LENGTH_SHORT}
                        label={'CourierName'}
                        value={CourierDefaultName}
                        onChangeText={(CourierDefaultName) => {
                            onTabDataChange(this.TabIndex, {
                                ...this.props.data,
                                CourierDefaultName
                            })
                        }}
                    />

                    <ItemSeparator />

                    <HorizontalInput
                        label={'Key1'}
                        value={ProviderKey1}
                        onChangeText={(ProviderKey1) => {
                            onTabDataChange(this.TabIndex, {
                                ...this.props.data,
                                ProviderKey1
                            })
                        }}
                    />

                    <ItemSeparator />

                    <HorizontalInput
                        label={'Key2'}
                        value={ProviderKey2}
                        onChangeText={(ProviderKey2) => {
                            onTabDataChange(this.TabIndex, {
                                ...this.props.data,
                                ProviderKey2
                            })
                        }}
                    />

                    <ItemSeparator />

                    <HorizontalInput
                        label={'Key3'}
                        value={ProviderKey3}
                        onChangeText={(ProviderKey3) => {
                            onTabDataChange(this.TabIndex, {
                                ...this.props.data,
                                ProviderKey3
                            })
                        }}

                    />

                    <ItemSeparator />

                    <HorizontalInput
                        label={'Key4'}
                        value={ProviderKey4}
                        onChangeText={(ProviderKey4) => {
                            onTabDataChange(this.TabIndex, {
                                ...this.props.data,
                                ProviderKey4
                            })
                        }}
                    />

                    <ItemSeparator />

                    <HorizontalInput
                        label={'Key5'}
                        value={ProviderKey5}
                        onChangeText={(ProviderKey5) => {
                            onTabDataChange(this.TabIndex, {
                                ...this.props.data,
                                ProviderKey5
                            })
                        }}
                    />

                    <ItemSeparator />

                    <HorizontalInput
                        label={'Key6'}
                        value={ProviderKey6}
                        onChangeText={(ProviderKey6) => {
                            onTabDataChange(this.TabIndex, {
                                ...this.props.data,
                                ProviderKey6
                            })
                        }}
                    />

                    <ItemSeparator />

                    <HorizontalInput
                        label={'Key7'}
                        value={ProviderKey7}
                        onChangeText={(ProviderKey7) => {
                            onTabDataChange(this.TabIndex, {
                                ...this.props.data,
                                ProviderKey7
                            })
                        }}
                    />

                    <ItemSeparator />

                    <HorizontalInput
                        label={'Key8'}
                        value={ProviderKey8}
                        onChangeText={(ProviderKey8) => {
                            onTabDataChange(this.TabIndex, {
                                ...this.props.data,
                                ProviderKey8
                            })
                        }}
                    />

                    <ItemSeparator />

                    <HorizontalInput
                        label={'Key9'}
                        value={ProviderKey9}
                        onChangeText={(ProviderKey9) => {
                            onTabDataChange(this.TabIndex, {
                                ...this.props.data,
                                ProviderKey9
                            })
                        }}
                    />

                    <ItemSeparator />

                    <HorizontalInput
                        label={'Key10'}
                        value={ProviderKey10}
                        onChangeText={(ProviderKey10) => {
                            onTabDataChange(this.TabIndex, {
                                ...this.props.data,
                                ProviderKey10
                            })
                        }}
                    />

                    <ItemSeparator />

                    <HorizontalInput
                        label={'Key11'}
                        value={ProviderKey11}
                        onChangeText={(ProviderKey11) => {
                            onTabDataChange(this.TabIndex, {
                                ...this.props.data,
                                ProviderKey11
                            })
                        }}
                    />

                    <ItemSeparator />

                    <HorizontalInput
                        label={'Key12'}
                        value={ProviderKey12}
                        onChangeText={(ProviderKey12) => {
                            onTabDataChange(this.TabIndex, {
                                ...this.props.data,
                                ProviderKey12
                            })
                        }}
                    />

                    <ItemSeparator />

                    <HorizontalInput
                        label={'Key13'}
                        value={ProviderKey13}
                        onChangeText={(ProviderKey13) => {
                            onTabDataChange(this.TabIndex, {
                                ...this.props.data,
                                ProviderKey13
                            })
                        }}
                    />

                    <ItemSeparator />

                    <HorizontalInput
                        label={'OrderMinValue'}
                        value={OrderMinValue != null ? OrderMinValue.toString() : null}
                        keyboardType="numeric"
                        onChangeText={(OrderMinValue) => {
                            onTabDataChange(this.TabIndex, {
                                ...this.props.data,
                                OrderMinValue
                            })
                        }}
                    />

                    <ItemSeparator />

                    <HorizontalInput
                        label={'OrderMaxValue'}
                        value={OrderMaxValue != null ? OrderMaxValue.toString() : null}
                        keyboardType="numeric"
                        onChangeText={(OrderMaxValue) => {
                            onTabDataChange(this.TabIndex, {
                                ...this.props.data,
                                OrderMaxValue
                            })
                        }}
                    />

                    <ItemSeparator />

                    <HorizontalInput
                        label={'FreeShippingAbove'}
                        value={FreeShippingAbove != null ? FreeShippingAbove.toString() : null}
                        keyboardType="numeric"
                        onChangeText={(FreeShippingAbove) => {
                            onTabDataChange(this.TabIndex, {
                                ...this.props.data,
                                FreeShippingAbove
                            })
                        }}
                    />

                    <ItemSeparator />

                    <SwitchItem
                        title='IsAddressRequired'
                        value={IsAddressRequired}
                        onValueChange={(IsAddressRequired) => {
                            onTabDataChange(this.TabIndex, {
                                ...this.props.data,
                                IsAddressRequired
                            })
                        }}
                    />

                    <ItemSeparator />

                    <SwitchItem
                        title='ShowWareHouse'
                        value={AskForWarehouse}
                        onValueChange={(AskForWarehouse) => {
                            onTabDataChange(this.TabIndex, {
                                ...this.props.data,
                                AskForWarehouse
                            })
                        }}
                    />

                    <ItemSeparator />

                    <ArrowItem
                        onPress={() => {
                            SelectEntity(this.props.navigation, (POS_OptionGroups) => {
                                onTabDataChange(this.TabIndex, {
                                    ...this.props.data,
                                    POS_OptionGroups
                                })
                            }, 'ProductOption/Groups', null, false, 2, POS_OptionGroups)
                        }}
                        title='POS_OptionGroups'
                        info={POS_OptionGroups.length}
                    />

                    <ItemSeparator />

                    {isConfigured == true ?
                        <CustomButton
                            onPress={() => { this.props.navigation.navigate('AdvanceSettings', { Id: this.props?.Id }) }}
                            style={{ marginHorizontal: 20, marginTop: 20, marginBottom: 20 }}
                            title={'Advance_Settings'}
                        /> : null
                    }

                </ScrollView>

            </LazyContainer>
        );
    }
}
export default withLocalize(CourierConfig)