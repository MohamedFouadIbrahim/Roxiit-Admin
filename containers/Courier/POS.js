import React from 'react';
import { ScrollView } from 'react-native';
import { SelectEntity } from '../../utils/EntitySelector';
import ArrowItem from '../../components/ArrowItem';
import ItemSeparator from '../../components/ItemSeparator';
import SwitchItem from '../../components/SwitchItem';
import { TrimText } from '../../utils/Text';
import { withLocalize } from 'react-localize-redux';

class POSCONFIG extends React.Component {
    constructor(props) {
        super(props)

        this.TabIndex = 1
    }
    render() {
        const {
            POS_ShowDriver,
            POS_IsDriverRequired,
            POS_ShowSubStore,
            POS_IsSubStoreRequired,
            POS_ShowCountry,
            POS_IsCountryRequired,
            POS_ShowCity,
            POS_IsCityRequired,
            POS_ShowArea,
            POS_IsAreaRequired,
            POS_ShowAddress,
            POS_IsAddressRequired,
            POS_ShowOrderStatus,
            POS_DefaultOrderStatus,
            OrderStatusList
        } = this.props.data

        const {
            onTabDataChange
        } = this.props

        return (
            <ScrollView>
                <SwitchItem
                    title='POS_ShowDriver'
                    value={POS_ShowDriver}
                    onValueChange={(POS_ShowDriver) => {
                        onTabDataChange(this.TabIndex, {
                            ...this.props.data,
                            POS_ShowDriver,
                            POS_IsDriverRequired: POS_ShowDriver == false ? false : POS_IsDriverRequired
                        })
                    }}
                />

                <ItemSeparator />

                {POS_ShowDriver && <SwitchItem
                    title='POS_IsDriverRequired'
                    value={POS_IsDriverRequired}
                    onValueChange={(POS_IsDriverRequired) => {
                        onTabDataChange(this.TabIndex, {
                            ...this.props.data,
                            POS_IsDriverRequired
                        })
                    }}
                />}

                <ItemSeparator />

                <SwitchItem
                    title='POS_ShowSubStore'
                    value={POS_ShowSubStore}
                    onValueChange={(POS_ShowSubStore) => {
                        onTabDataChange(this.TabIndex, {
                            ...this.props.data,
                            POS_ShowSubStore,
                            POS_IsSubStoreRequired: POS_ShowSubStore == false ? false : POS_IsSubStoreRequired
                        })
                    }}
                />

                <ItemSeparator />

                {POS_ShowSubStore && <SwitchItem
                    title='POS_IsSubStoreRequired'
                    value={POS_IsSubStoreRequired}
                    onValueChange={(POS_IsSubStoreRequired) => {
                        onTabDataChange(this.TabIndex, {
                            ...this.props.data,
                            POS_IsSubStoreRequired
                        })
                    }}
                />}

                <ItemSeparator />

                <SwitchItem
                    title='POS_ShowCountry'
                    value={POS_ShowCountry}
                    onValueChange={(POS_ShowCountry) => {
                        onTabDataChange(this.TabIndex, {
                            ...this.props.data,
                            POS_ShowCountry,
                            POS_IsCountryRequired: POS_ShowCountry == false ? false : POS_IsCountryRequired
                        })
                    }}
                />
                <ItemSeparator />

                {POS_ShowCountry && <SwitchItem
                    title='POS_IsCountryRequired'
                    value={POS_IsCountryRequired}
                    onValueChange={(POS_IsCountryRequired) => {
                        onTabDataChange(this.TabIndex, {
                            ...this.props.data,
                            POS_IsCountryRequired
                        })
                    }}
                />}

                <ItemSeparator />

                <SwitchItem
                    title='POS_ShowCity'
                    value={POS_ShowCity}
                    onValueChange={(POS_ShowCity) => {
                        onTabDataChange(this.TabIndex, {
                            ...this.props.data,
                            POS_ShowCity,
                            POS_IsCityRequired: POS_ShowCity == false ? false : POS_IsCityRequired
                        })
                    }}
                />

                <ItemSeparator />

                {POS_ShowCity && <SwitchItem
                    title='POS_IsCityRequired'
                    value={POS_IsCityRequired}
                    onValueChange={(POS_IsCityRequired) => {
                        onTabDataChange(this.TabIndex, {
                            ...this.props.data,
                            POS_IsCityRequired
                        })
                    }}
                />}

                <ItemSeparator />

                <SwitchItem
                    title='POS_ShowArea'
                    value={POS_ShowArea}
                    onValueChange={(POS_ShowArea) => {
                        onTabDataChange(this.TabIndex, {
                            ...this.props.data,
                            POS_ShowArea,
                            POS_IsAreaRequired: POS_ShowArea == false ? false : POS_IsAreaRequired
                        })
                    }}
                />
                <ItemSeparator />

                {POS_ShowArea && <SwitchItem
                    title='POS_IsAreaRequired'
                    value={POS_IsAreaRequired}
                    onValueChange={(POS_IsAreaRequired) => {
                        onTabDataChange(this.TabIndex, {
                            ...this.props.data,
                            POS_IsAreaRequired
                        })
                    }}
                />}

                <ItemSeparator />

                <SwitchItem
                    title='POS_ShowAddress'
                    value={POS_ShowAddress}
                    onValueChange={(POS_ShowAddress) => {
                        onTabDataChange(this.TabIndex, {
                            ...this.props.data,
                            POS_ShowAddress,
                            POS_IsAddressRequired: POS_ShowAddress == false ? false : POS_IsAddressRequired
                        })
                    }}
                />

                <ItemSeparator />

                {POS_ShowAddress && <SwitchItem
                    title='POS_IsAddressRequired'
                    value={POS_IsAddressRequired}
                    onValueChange={(POS_IsAddressRequired) => {
                        onTabDataChange(this.TabIndex, {
                            ...this.props.data,
                            POS_IsAddressRequired
                        })
                    }}
                />}


                <ItemSeparator />

                <SwitchItem
                    title='POS_ShowOrderStatus'
                    value={POS_ShowOrderStatus}
                    onValueChange={(POS_ShowOrderStatus) => {

                        onTabDataChange(this.TabIndex, {
                            ...this.props.data,
                            POS_ShowOrderStatus
                        })

                    }}
                />
                <ItemSeparator />

                <ArrowItem
                    title='POS_DefaultOrderStatus'
                    info={POS_DefaultOrderStatus && POS_DefaultOrderStatus.Name ? TrimText(POS_DefaultOrderStatus.Name, 12) : this.props.translate('notselected')}
                    onPress={() => {
                        SelectEntity(this.props.navigation, (POS_DefaultOrderStatus) => {
                            onTabDataChange(this.TabIndex, {
                                ...this.props.data,
                                POS_DefaultOrderStatus
                            })
                        }, null, null, false, 1, POS_DefaultOrderStatus, { initialData: OrderStatusList })

                    }}
                />
            </ScrollView>
        )
    }
}
export default withLocalize(POSCONFIG) 