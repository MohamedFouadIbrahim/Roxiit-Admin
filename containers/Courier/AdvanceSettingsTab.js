import React, { Component } from 'react';
import { GetAdvancedSetting } from '../../services/CourierServices';
import AddAdvanceSettings from './AddAdvanceSettings';
import Override from './Override';
import LazyContainer from '../../components/LazyContainer';
import CustomHeader from '../../components/CustomHeader';
import HeaderSubmitButton from '../../components/HeaderSubmitButton';
import { AddAdvancedSettings } from '../../services/CourierServices';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { mainColor, secondColor } from '../../constants/Colors';
import { withLocalize } from 'react-localize-redux';
import { LongToast } from '../../utils/Toast';
import { connect } from 'react-redux';
class AdvanceSettings extends Component {

    constructor(props) {
        super(props)
        const { languages_data, currLang } = this.props
        this.defaultValues = {
            Settings: {
                Warehouses: [],
                CityList: [],
                lockSubmit: false,
                SelectedCountry: [],
                To_Country: [],
                To_City: [],
                To_Area: [],
                Fixed_Price: null,
                Name: null,
                KgPrice: null,
                EstimatedDeliveryTime: null,
                Language: languages_data.find(item => item.code === currLang),
                languages_data,
            },
            Override: {
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
                CustomPricing: false
            }
        }

        this.state = {
            ...this.defaultValues,
            dataFetched: false
        };

        if (this.props.route.params && this.props.route.params?.AdvancedSettingId) {
            this.editMode = true
            this.AdvancedSettingId = this.props.route.params?.AdvancedSettingId
        }

        else {
            this.editMode = false
            this.AdvancedSettingId = this.props.route.params?.AdvancedSettingId
        }

    }


    componentDidMount() {
        this.fetchAdvanceSettings()
    }

    fetchAdvanceSettings(LangId = null) {
        if (this.editMode == true) {
            this.cancelFetchDataGetAdvancedSetting = GetAdvancedSetting(this.props.route.params?.Id, this.AdvancedSettingId, LangId, (res) => {

                this.setState({
                    Settings: {
                        ...this.state.Settings,
                        Warehouses: res.data.Warehouse,
                        To_Country: res.data.toCountries,
                        To_City: res.data.toCities,
                        To_Area: res.data.toAreas,
                        Fixed_Price: res.data.FixedPrice,
                        KgPrice: res.data.KgPrice,
                        Name: res.data.Name,
                        EstimatedDeliveryTime: res.data.EstimatedDeliveryTime,
                    },
                    Override: {

                        ProviderKey1: res.data.ProviderKey1,
                        ProviderKey2: res.data.ProviderKey2,
                        ProviderKey3: res.data.ProviderKey3,
                        ProviderKey4: res.data.ProviderKey4,
                        ProviderKey5: res.data.ProviderKey5,
                        ProviderKey6: res.data.ProviderKey6,
                        ProviderKey7: res.data.ProviderKey7,
                        ProviderKey8: res.data.ProviderKey8,
                        ProviderKey9: res.data.ProviderKey9,
                        ProviderKey10: res.data.ProviderKey10,
                        ProviderKey11: res.data.ProviderKey11,
                        ProviderKey12: res.data.ProviderKey12,
                        ProviderKey13: res.data.ProviderKey13,
                        CustomPricing: res.data.CustomPricing
                    },
                    dataFetched: true
                })
            }, err => {
                this.props.navigation.goBack()
            })
        }
    }

    submitAdvancedSetting = () => {
        if (this.lockSubmit) {
            return
        }

        const { To_Country, To_City, To_Area, Fixed_Price, KgPrice, Name, Warehouses, EstimatedDeliveryTime, Language, ChangeToLanguage } = this.state.Settings

        if (!Name || !Warehouses.length) {
            return LongToast('CantHaveEmptyInputs')
        }

        if (!Fixed_Price) {
            return LongToast('PleaceEnterFixedPrice')
        }

        if (!KgPrice) {
            return LongToast('PleaceEnterKgPrice')
        }


        this.setState({ lockSubmit: true })
        this.lockSubmit = true

        this.cancelFetchDataAddAdvancedSettings = AddAdvancedSettings({
            Id: this.editMode == true ? this.AdvancedSettingId : 0,
            Name,
            Warehouse: Warehouses.length ? Warehouses.map(item => item.Id) : [],
            CourierId: this.props.route.params?.Id,
            FixedPrice: Fixed_Price,
            KgPrice,
            EstimatedDeliveryTime,
            toCountries: To_Country.length ? To_Country.map(item => item.Id) : [],
            toCities: To_City.length ? To_City.map(item => item.Id) : [],
            toAreas: To_Area.length ? To_Area.map(item => item.Id) : [],
            ...this.state.Override,
            CustomPricing: this.state.Override.CustomPricing,
            LanguageId: ChangeToLanguage ? ChangeToLanguage.key : Language.key,
        }, res => {
            this.setState({ didSucceed: true, lockSubmit: false })
            this.lockSubmit = false
            this.props.route.params?.onChildChange && this.props.route.params?.onChildChange()
            this.props.navigation.goBack()
        }, err => {
            this.setState({ lockSubmit: false })
            this.lockSubmit = false
        })
    }

    onTabDataChange = (tab, data) => {
        switch (tab) {
            case 0:
                this.setState({
                    Settings: {
                        ...data,
                    }
                })
                break;
            case 1:
                this.setState({
                    Override: {
                        ...data,
                    }
                })
                break;
            default:
                break;
        }
    }


    onSelectLanguage = (index) => {
        const { languages_data } = this.props
        const selectedLanguage = languages_data[index]
        this.setState({
            Settings: {
                ...this.state.Settings,
                ChangeToLanguage: selectedLanguage,
            }
        })
        this.fetchAdvanceSettings(selectedLanguage.key)
    }

    render() {

        return (
            <LazyContainer
                style={{
                    flex: 1
                }}
            >

                <CustomHeader
                    navigation={this.props.navigation}
                    title="Advance_Settings"
                    rightComponent={
                        <HeaderSubmitButton
                            isLoading={this.state.lockSubmit}
                            didSucceed={this.state.didSucceed}
                            onPress={this.submitAdvancedSetting} />
                    } />

                <AdvanceSettingsTabNavigator
                    screenProps={{
                        // translate: this.props.translate,
                        stackNavigation: this.props.navigation,
                        Settings: this.state.Settings,
                        Override: this.state.Override,
                        CourierId: this.props.route.params?.Id,
                        onTabDataChange: this.onTabDataChange,
                        onSelectLanguage: this.onSelectLanguage,
                    }}

                />


            </LazyContainer>
        )
    }

}

const Tabs = createMaterialTopTabNavigator();
const AdvanceSettingsTabNavigator = ({ screenProps, navigation }) => (
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
        <Tabs.Screen name='AddAdvanceSettings' component={AddAdvanceSettings}
            options={{ title: 'Settings' }}
            initialParams={{
                data: screenProps.Settings,
                CourierId: screenProps.CourierId,
                onTabDataChange: screenProps.onTabDataChange,
                navigation: screenProps.stackNavigation,
                tabNavigation: navigation,
                onSelectLanguage: screenProps.onSelectLanguage
            }}
        />


        <Tabs.Screen
            name='Override'
            component={Override}
            initialParams={{
                data: screenProps.Override,
                CourierId: screenProps.CourierId,
                onTabDataChange: screenProps.onTabDataChange,
                navigation: screenProps.stackNavigation,
                tabNavigation: navigation
            }}
        />
    </Tabs.Navigator>
)

const mapStateToProps = ({
    language: {
        languages_data,
        currLang,
    }
}) => ({
    languages_data,
    currLang,
})
export default connect(mapStateToProps)(withLocalize(AdvanceSettings))