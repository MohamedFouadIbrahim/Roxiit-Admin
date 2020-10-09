import React from 'react';
import LazyContainer from '../../components/LazyContainer';
import HorizontalInput from '../../components/HorizontalInput';
import ItemSeparator from '../../components/ItemSeparator';
import { ScrollView } from 'react-native';
import SwitchItem from '../../components/SwitchItem';
import { withLocalize } from 'react-localize-redux';

class Override extends React.Component {

    constructor(props) {
        super(props)

        this.TabIndex = 1
    }

    render() {
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
            CustomPricing
        } = this.props.route.params.data

        const {
            onTabDataChange
        } = this.props.route.params

        return (
            <LazyContainer style={{ flex: 1 }} >

                <ScrollView style={{ flexGrow: 1 }} >

                    <SwitchItem
                        value={CustomPricing}
                        title={'CustomPricing'}
                        onValueChange={(CustomPricing) => {
                            onTabDataChange(this.TabIndex, {
                                ...this.props.route.params.data,
                                CustomPricing
                            })
                        }}
                    />
                    <HorizontalInput
                        editable={CustomPricing}
                        label={'Key1'}
                        value={ProviderKey1}
                        onChangeText={(ProviderKey1) => {
                            onTabDataChange(this.TabIndex, {
                                ...this.props.route.params.data,
                                ProviderKey1
                            })
                        }}
                    />

                    <ItemSeparator />

                    <HorizontalInput
                        editable={CustomPricing}
                        label={'Key2'}
                        value={ProviderKey2}
                        onChangeText={(ProviderKey2) => {
                            onTabDataChange(this.TabIndex, {
                                ...this.props.route.params.data,
                                ProviderKey2
                            })
                        }}
                    />

                    <ItemSeparator />

                    <HorizontalInput
                        editable={CustomPricing}
                        label={'Key3'}
                        value={ProviderKey3}
                        onChangeText={(ProviderKey3) => {
                            onTabDataChange(this.TabIndex, {
                                ...this.props.route.params.data,
                                ProviderKey3
                            })
                        }}

                    />

                    <ItemSeparator />

                    <HorizontalInput
                        editable={CustomPricing}
                        label={'Key4'}
                        value={ProviderKey4}
                        onChangeText={(ProviderKey4) => {
                            onTabDataChange(this.TabIndex, {
                                ...this.props.route.params.data,
                                ProviderKey4
                            })
                        }}
                    />

                    <ItemSeparator />

                    <HorizontalInput
                        editable={CustomPricing}
                        label={'Key5'}
                        value={ProviderKey5}
                        onChangeText={(ProviderKey5) => {
                            onTabDataChange(this.TabIndex, {
                                ...this.props.route.params.data,
                                ProviderKey5
                            })
                        }}
                    />

                    <ItemSeparator />

                    <HorizontalInput
                        editable={CustomPricing}
                        label={'Key6'}
                        value={ProviderKey6}
                        onChangeText={(ProviderKey6) => {
                            onTabDataChange(this.TabIndex, {
                                ...this.props.route.params.data,
                                ProviderKey6
                            })
                        }}
                    />

                    <ItemSeparator />

                    <HorizontalInput
                        editable={CustomPricing}
                        label={'Key7'}
                        value={ProviderKey7}
                        onChangeText={(ProviderKey7) => {
                            onTabDataChange(this.TabIndex, {
                                ...this.props.route.params.data,
                                ProviderKey7
                            })
                        }}
                    />

                    <ItemSeparator />

                    <HorizontalInput
                        editable={CustomPricing}
                        label={'Key8'}
                        value={ProviderKey8}
                        onChangeText={(ProviderKey8) => {
                            onTabDataChange(this.TabIndex, {
                                ...this.props.route.params.data,
                                ProviderKey8
                            })
                        }}
                    />

                    <ItemSeparator />

                    <HorizontalInput
                        editable={CustomPricing}
                        label={'Key9'}
                        value={ProviderKey9}
                        onChangeText={(ProviderKey9) => {
                            onTabDataChange(this.TabIndex, {
                                ...this.props.route.params.data,
                                ProviderKey9
                            })
                        }}
                    />

                    <ItemSeparator />

                    <HorizontalInput
                        editable={CustomPricing}
                        label={'Key10'}
                        value={ProviderKey10}
                        onChangeText={(ProviderKey10) => {
                            onTabDataChange(this.TabIndex, {
                                ...this.props.route.params.data,
                                ProviderKey10
                            })
                        }}
                    />

                    <ItemSeparator />

                    <HorizontalInput
                        editable={CustomPricing}
                        label={'Key11'}
                        value={ProviderKey11}
                        onChangeText={(ProviderKey11) => {
                            onTabDataChange(this.TabIndex, {
                                ...this.props.route.params.data,
                                ProviderKey11
                            })
                        }}
                    />

                    <ItemSeparator />

                    <HorizontalInput
                        editable={CustomPricing}
                        label={'Key12'}
                        value={ProviderKey12}
                        onChangeText={(ProviderKey12) => {
                            onTabDataChange(this.TabIndex, {
                                ...this.props.route.params.data,
                                ProviderKey12
                            })
                        }}
                    />

                    <ItemSeparator />

                    <HorizontalInput
                        editable={CustomPricing}
                        label={'Key13'}
                        value={ProviderKey13}
                        onChangeText={(ProviderKey13) => {
                            onTabDataChange(this.TabIndex, {
                                ...this.props.route.params.data,
                                ProviderKey13
                            })
                        }}
                    />

                    <ItemSeparator />

                </ScrollView>

            </LazyContainer>
        );
    }
}

export default withLocalize(Override)