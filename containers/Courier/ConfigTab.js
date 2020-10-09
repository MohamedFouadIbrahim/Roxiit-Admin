import React, { Component } from 'react';
import { withLocalize } from 'react-localize-redux';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer } from '@react-navigation/native';

import CustomHeader from '../../components/CustomHeader';
import HeaderSubmitButton from '../../components/HeaderSubmitButton';
import LazyContainer from '../../components/LazyContainer';
import { mainColor, secondColor } from '../../constants/Colors';
import { GetCourierById, UpdateCourier } from '../../services/CourierServices';
import { getFilters } from '../../services/FilterService';
import CourierConfig from './Config';
import POS from './POS';
import { LongToast } from '../../utils/Toast';

class Courier extends Component {
    constructor(props) {
        super(props)

        if (this.props.route.params && this.props.route.params?.Id) {
            this.CourierId = this.props.route.params?.Id
        }

        this.defaultValues = {
            CourierConfig: {
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
                AskForWarehouse: false,
                POS_OptionGroups: [],
                // SecuiretyKey: null,
            },
            POS: {
                POS_ShowDriver: false,
                POS_IsDriverRequired: false,
                POS_ShowSubStore: false,
                POS_IsSubStoreRequired: false,
                POS_ShowCountry: false,
                POS_IsCountryRequired: false,
                POS_ShowCity: false,
                POS_IsCityRequired: false,
                POS_ShowArea: false,
                POS_IsAreaRequired: false,
                POS_ShowAddress: false,
                POS_IsAddressRequired: false,
                POS_ShowOrderStatus: false,
                OrderStatusList: [],
                POS_DefaultOrderStatus: {
                    Id: 0, Name: ''
                }
            }
        }
        this.state = {
            lockSubmit: false,
            didFetchData: false,
            ...this.defaultValues,
        }

        this.lockSubmit = false
    }

    componentDidMount() {
        GetCourierById(this.CourierId, res => {
            const {
                Name,
                CourierDefaultName,
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
                AskForWarehouse,
                POS_OptionGroups,
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
                POS_DefaultOrderStatus
            } = res.data

            getFilters({
                orderStatus: true
            }, filters => {
                this.setState({
                    CourierConfig: {
                        Name,
                        CourierDefaultName,
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
                        POS_OptionGroups: POS_OptionGroups == null ? [] : POS_OptionGroups,
                        AskForWarehouse
                    }, POS: {
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
                        POS_DefaultOrderStatus: POS_DefaultOrderStatus ? POS_DefaultOrderStatus : {},
                        OrderStatusList: filters.data.OrderStatusList
                    },
                    didFetchData: true
                })
            })
        })
    }

    submit = () => {
        if (this.lockSubmit) {
            return
        }
        const { onChildChange } = this.props.route.params
        const {
            POS: {
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
                POS_DefaultOrderStatus
            },
            CourierConfig,
            CourierConfig: {
                POS_OptionGroups
            }
        } = this.state

        this.lockSubmit = true
        this.setState({ lockSubmit: true })

        UpdateCourier({
            CourierId: this.CourierId,
            ...CourierConfig,
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
            POS_OptionGroups: POS_OptionGroups.length ? POS_OptionGroups.map(item => item.Id) : [],
            POS_DefaultOrderStatus: POS_DefaultOrderStatus && POS_DefaultOrderStatus.Id ? POS_DefaultOrderStatus.Id : null
        }, res => {

            this.lockSubmit = false
            this.setState({ lockSubmit: false })
            LongToast('dataSaved')
            onChildChange && onChildChange()
            this.props.navigation.goBack()

        }, err => {

            this.lockSubmit = false
            this.setState({ lockSubmit: false })

        })
    }
    renderContent = () => {
        if (this.state.didFetchData) {
            return (
                <CourierTabNavigator
                    screenProps={{
                        stackNavigation: this.props.navigation,
                        CourierConfig: this.state.CourierConfig,
                        POS: this.state.POS,
                        onTabDataChange: this.onTabDataChange,
                        translate: this.props.translate,
                        CourierId: this.CourierId,
                    }} />

            )
        }
    }

    onTabDataChange = (tab, data) => {
        switch (tab) {
            case 0:
                this.setState({
                    CourierConfig: {
                        ...data,
                    }
                })
                break;
            case 1:
                this.setState({
                    POS: {
                        ...data,
                    }
                })
                break;
            default:
                break;
        }
    }

    render() {
        return (
            <LazyContainer style={{ flex: 1, backgroundColor: 'white' }}>
                <CustomHeader
                    navigation={this.props.navigation}
                    title={"Courier_Config"}
                    rightComponent={
                        <HeaderSubmitButton
                            isLoading={this.state.lockSubmit}
                            onPress={() => { this.submit() }}
                        />
                    } />

                {this.renderContent()}
            </LazyContainer>
        )
    }
}

const Tabs = createMaterialTopTabNavigator()

const CourierTabNavigator = ({ screenProps, navigation, screenProps: { translate } }) => (
    <Tabs.Navigator
        lazy={false}
        tabBarOptions={{
            labelStyle: {
                fontSize: 12,
                color: mainColor,
            },
            indicatorStyle: {
                backgroundColor: secondColor,
            },
            style: {
                backgroundColor: 'white',
            },
        }}
    >

        <Tabs.Screen
            name='Config'
            options={{ title: translate('Config') }} >
            {() => {
                return (<CourierConfig
                    translate={screenProps.translate}
                    data={screenProps.CourierConfig}
                    CourierId={screenProps.CourierId}
                    onTabDataChange={screenProps.onTabDataChange}
                    navigation={screenProps.stackNavigation}
                    tabNavigation={navigation} />)
            }}
        </Tabs.Screen>

        <Tabs.Screen
            name='POS'
            options={{
                title: translate('POS')
            }}>
            {() => {
                return (<POS
                    translate={screenProps.translate}
                    data={screenProps.POS}
                    CourierId={screenProps.CourierId}
                    onTabDataChange={screenProps.onTabDataChange}
                    navigation={screenProps.stackNavigation}
                    tabNavigation={navigation} />)
            }}
        </Tabs.Screen>
    </Tabs.Navigator>
)

export default withLocalize(Courier)