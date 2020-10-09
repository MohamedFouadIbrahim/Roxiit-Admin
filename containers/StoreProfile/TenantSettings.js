import React from 'react';
import ArrowItem from '../../components/ArrowItem';
import LazyContainer from '../../components/LazyContainer';
import CustomHeader from '../../components/CustomHeader';
import ItemSeparator from '../../components/ItemSeparator';
import { GetTenantSettings, AddTenantSettings } from '../../services/StoreProfileServece';
import HeaderSubmitButton from '../../components/HeaderSubmitButton';
import { SelectArea, SelectCity, SelectCountry } from '../../utils/Places';
import { View, I18nManager, Dimensions } from 'react-native';
import { mainTextColor, mainColor } from '../../constants/Colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { LongToast } from '../../utils/Toast';
import CustomTouchable from '../../components/CustomTouchable';
import SettingsTitle from '../../components/Settings/SettingsTitle';
import SellHoursItem from './SellHoursItem';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import CustomAddModal from '../../components/CustomAddModal';
import CustomDatePicker from '../../components/CustomDatePicker';
import { largePagePadding, largeBorderRadius } from '../../constants/Style';
import FontedText from '../../components/FontedText';
import SwitchItem from '../../components/SwitchItem';
import RoundedInput from '../../components/RoundedInput';
import SettingsSeparator from '../../components/Settings/SettingsSeparator';


class TenatSettings extends React.Component {

    constructor(props) {
        super(props)
        this.state = {

            DefaultCountry: null,
            DefaultCity: null,
            DefaultArea: null,
            dataFetched: false,
            lockSubmit: false,
            isPopupVisible: false,
            isDateTimePickerVisibleFrom: false,
            isDateTimePickerVisibleTo: false,
            SellHours: null,
            DayId: null,
            DayName: '',
            IsAllTheDay: true,
            Is: true,
            ErrorMessage: '',
            From: '',
            To: '',
            screenWidth: Dimensions.get('screen').width,
            screenHeight: Dimensions.get('screen').height,
        }

        this.lockSubmit = false
        this.DefaultErrorMessage = 'Sorry Purchase Is Disabled Right Now'
    }

    componentDidMount() {
        //re render when change orientation
        Dimensions.addEventListener('change', () => {
            this.setState({
                screenWidth: Dimensions.get('screen').width,
                screenHeight: Dimensions.get('screen').height,
            })
        })
    }


    renderModalSwitches = () => {
        const { IsEnabled, IsAllTheDay } = this.state;
        return (
            <View style={{
                justifyContent: 'space-between', flexDirection: 'row', width: '100%',
                marginHorizontal: 20, alignItems: 'center',
                alignSelf: 'center'
            }} >

                <SwitchItem
                    titleStyle={{ color: 'black' }}
                    title={'IsOpen'}
                    style={{
                        alignItems: 'center',
                        alignSelf: 'center',
                        paddingHorizontal: 0
                    }}
                    value={IsEnabled}

                    onValueChange={(IsEnabled) => { this.setState({ IsEnabled }) }}
                />
                {IsEnabled ? <SwitchItem
                    titleStyle={{ color: 'black' }}
                    title={'Is24Hours'}
                    style={{
                        alignItems: 'center',
                        alignSelf: 'center',
                        paddingHorizontal: 0
                    }}
                    value={IsAllTheDay}

                    onValueChange={(IsAllTheDay) => { this.setState({ IsAllTheDay }) }}
                /> : null}
            </View>
        )
    }

    renderFromToDrobDown = () => {
        const { From, To } = this.state;
        return (
            <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginVertical: 10, width: '100%', alignItems: 'center', alignSelf: 'center' }} >

                <CustomTouchable
                    onPress={() => {
                        this.setState({ isDateTimePickerVisibleFrom: true })
                    }}
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingHorizontal: 10,
                        paddingVertical: 10,
                        backgroundColor: mainColor,
                        borderRadius: largeBorderRadius,
                        width: '40%'
                    }}>

                    <FontedText style={{ color: 'white', fontSize: 11, }}>{From ? From : 'From'}</FontedText>
                    <Ionicons
                        name={"md-arrow-dropdown"}
                        size={18}
                        color={'white'}
                        style={{
                            marginLeft: 5,
                        }} />
                </CustomTouchable>

                <CustomTouchable
                    onPress={() => {
                        this.setState({ isDateTimePickerVisibleTo: true })
                    }}
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingHorizontal: 10,
                        paddingVertical: 10,
                        backgroundColor: mainColor,
                        borderRadius: largeBorderRadius,
                        width: '40%'
                    }}>
                    <FontedText style={{ color: 'white', fontSize: 11, }}>{To ? To : 'To'}</FontedText>
                    <Ionicons
                        name={"md-arrow-dropdown"}
                        size={18}
                        color={'white'}
                        style={{
                            marginLeft: 5,
                        }} />
                </CustomTouchable>
            </View>
        )
    }

    renderModalItems = () => {
        const { IsEnabled, ErrorMessage, IsAllTheDay, DayName } = this.state;
        return (
            <View style={{ marginHorizontal: largePagePadding, width: (this.state.screenWidth - 80), alignSelf: 'center', alignItems: 'center', justifyContent: 'center', paddingBottom: 10, }} >
                <RoundedInput
                    containerStyle={{ width: "100%", marginVertical: 10 }}
                    value={DayName}
                    editable={false}
                />
                {this.renderModalSwitches()}

                {IsEnabled && !IsAllTheDay ? this.renderFromToDrobDown() : null}
                {!IsEnabled || !IsAllTheDay ?
                    <RoundedInput
                        multiline={true}
                        containerStyle={{ width: "100%", marginVertical: 10 }}
                        placeholder={'ErrorMessage'}
                        value={ErrorMessage}
                        onChangeText={(ErrorMessage) => { this.setState({ ErrorMessage }) }} />
                    : null}

                <CustomDatePicker
                    time={true}
                    isVisible={this.state.isDateTimePickerVisibleFrom}
                    onConfirm={(value) => {
                        this.setState({ From: `${value.getHours()}:${value.getMinutes()}:${value.getSeconds()}`.toString(), isDateTimePickerVisibleFrom: false })
                    }}
                    is24Hour={true}
                    mode='time'
                    onCancel={() => this.setState({ isDateTimePickerVisibleFrom: false })}
                />

                <CustomDatePicker
                    time={true}
                    isVisible={this.state.isDateTimePickerVisibleTo}
                    onConfirm={(value) => {
                        this.setState({ To: `${value.getHours()}:${value.getMinutes()}:${value.getSeconds()}`.toString(), isDateTimePickerVisibleTo: false })
                    }}
                    is24Hour={true}
                    mode='time'
                    onCancel={() => this.setState({ isDateTimePickerVisibleTo: false })}
                />

            </View>
        )
    }

    _onRenderModal = () => {
        return (
            <CustomAddModal
                onBackdropPress={() => {
                    this.setState({ isPopupVisible: false, VaidError: '', From: '', To: '', selectedDay: null })
                }}
                isVisible={this.state.isPopupVisible}
                error={''}
                loading={() => {

                }}
                onErrorMsgClosePress={() => {
                    this.setState({ VaidError: '' })
                }}
                RoundedCloseButtonPress={() => {
                    this.setState({ isPopupVisible: false })
                }}
                Edit={true}

                loading={this.state.lockSubmit}
                onSubmit={() => {
                    const { From, To, DayId, DayName, IsEnabled, IsAllTheDay, ErrorMessage, selectedDayIndex, SellHours } = this.state
                    let SellHoursTemp = SellHours
                    SellHoursTemp[selectedDayIndex] = { DayId, DayName, IsAllTheDay, IsEnabled, ErrorMessage, From, To }
                    this.setState({ SellHours: SellHoursTemp })

                    this.setState({
                        isDateTimePickerVisibleFrom: false,
                        isDateTimePickerVisibleTo: false,
                        From: '',
                        To: '',
                        isPopupVisible: false,
                    })
                }}
            >

                {this.renderModalItems()}

            </CustomAddModal>
        )
    }

    submit = () => {

        if (this.lockSubmit) {
            return
        }

        const {
            DefaultArea,
            DefaultCity,
            DefaultCountry,
            SellHours,

        } = this.state

        this.lockSubmit = true
        this.setState({ lockSubmit: true })

        AddTenantSettings({
            DefaultArea: DefaultArea ? DefaultArea.Id : null,
            DefaultCity: DefaultCity ? DefaultCity.Id : null,
            DefaultCountry: DefaultCountry ? DefaultCountry.Id : null,
            SellHours: SellHours ? SellHours : []
        }, res => {

            this.lockSubmit = false
            this.setState({
                lockSubmit: false
            })
            LongToast('dataSaved')
            this.props.navigation.goBack()

        }, err => {

            this.lockSubmit = false
            this.setState({ lockSubmit: false })

        })
    }

    componentDidMount() {

        GetTenantSettings(res => {
            this.setState({
                ...res.data,
                dataFetched: true
            })
        })
    }

    onClearCountry = () => {
        this.setState({
            DefaultCountry: null,
            DefaultCity: null,
            DefaultArea: null,
        })
    }

    onClearCity = () => {
        this.setState({
            DefaultCity: null,
            DefaultArea: null,
        })
    }

    onClearArea = () => {
        this.setState({
            DefaultArea: null,
        })
    }

    onPressItem = (index, item) => {
        const { DayId } = item
        this.setState({
            DayId, DayName: item.DayName, IsAllTheDay: item.IsAllTheDay, IsEnabled: item.IsEnabled,
            ErrorMessage: item.ErrorMessage ? item.ErrorMessage : this.DefaultErrorMessage, From: item.From, To: item.To,
            selectedDayIndex: index,
            isPopupVisible: true
        })
    }

    renderItem = ({ index, item }) => {
        return (
            <SellHoursItem
                index={index}
                item={item}
                onPress={this.onPressItem}

            />
        )
    }

    onLongPressItem = (item) => {
        const { DayId } = item
        this.DeleteOrEditId = DayId
    }

    renderSellHoursList = () => {
        return (
            <FlatList
                contentContainerStyle={{
                    flexGrow: 1,
                }}
                ItemSeparatorComponent={() => <ItemSeparator />}
                renderItem={this.renderItem}
                data={this.state.SellHours}
                keyExtractor={({ DayId }) => `${DayId}`}
            />
        )
    }

    render() {

        const {
            DefaultArea,
            DefaultCity,
            DefaultCountry,
            lockSubmit
        } = this.state

        return (
            <LazyContainer style={{ flex: 1, backgroundColor: "#F4F6F9" }}>

                <CustomHeader
                    navigation={this.props.navigation}
                    leftComponent='back'
                    title='Settings'
                    rightComponent={<HeaderSubmitButton isLoading={lockSubmit} onPress={this.submit} />}
                />

                <ScrollView>
                    <SettingsTitle title={'DefaultLocation'} />
                    <SettingsSeparator />

                    <ArrowItem
                        onPress={() => {
                            SelectCountry(this.props.navigation, item => {
                                this.setState({ DefaultCountry: item, DefaultCity: null });
                            });
                        }}
                        title={"DefaultCountry"}
                        info={DefaultCountry && DefaultCountry.Id ? DefaultCountry.Name : null}
                        customIcon={() => <CustomIcon onClossPress={() => this.onClearCountry()} empty={DefaultCountry && DefaultCountry.Id} />}
                    />

                    <ItemSeparator />

                    <ArrowItem
                        onPress={() => {
                            if (DefaultCountry && DefaultCountry.Id) {
                                SelectCity(
                                    this.props.navigation,
                                    item => {
                                        this.setState({ DefaultCity: item, DefaultArea: null });
                                    },
                                    DefaultCountry.Id
                                );
                            }
                            else
                                LongToast("SelectCountryFirst")
                        }}
                        title={"DefaultCity"}
                        info={DefaultCity && DefaultCity.Id ? DefaultCity.Name : null}
                        customIcon={() => <CustomIcon onClossPress={() => this.onClearCity()} empty={DefaultCity && DefaultCity.Id} />}
                    />

                    <ItemSeparator />

                    <ArrowItem
                        onPress={() => {
                            if (DefaultCity && DefaultCity.Id) {
                                SelectArea(
                                    this.props.navigation,
                                    item => {
                                        this.setState({ DefaultArea: item });
                                    },
                                    DefaultCity.Id
                                );
                            }
                            else
                                LongToast("SelectCityFirst")
                        }}
                        title={"DefaultArea"}
                        info={DefaultArea && DefaultArea.Id ? DefaultArea.Name : null}
                        customIcon={() => <CustomIcon onClossPress={() => this.onClearArea()} empty={DefaultArea && DefaultArea.Id} />}
                    />

                    <SettingsTitle title={'SellHours'} />
                    <SettingsSeparator />
                    {this.renderSellHoursList()}
                    {this._onRenderModal()}
                </ScrollView>
            </LazyContainer>
        )
    }
}

const CustomIcon = ({ onClossPress, empty }) => {

    if (!empty) {
        return (
            <CustomTouchable style={{ padding: 5 }} onPress={() => onClossPress()} >
                <Ionicons
                    style={{
                        marginHorizontal: 10
                    }}
                    name={I18nManager.isRTL ? 'ios-arrow-back' : 'ios-arrow-forward'}
                    size={20}
                    // color={'#3B3B4D'}
                    color={mainTextColor}
                />
            </CustomTouchable>
        )
    }

    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} >
            <Ionicons
                style={{
                    marginHorizontal: 10
                }}
                name={I18nManager.isRTL ? 'ios-arrow-back' : 'ios-arrow-forward'}
                size={20}
                // color={'#3B3B4D'}
                color={mainTextColor}
            />

            <CustomTouchable style={{ padding: 5 }} onPress={() => onClossPress()} >
                <Ionicons
                    name={'ios-close'}
                    size={20}
                    color={mainTextColor}
                />
            </CustomTouchable>

        </View>
    )
}
export default TenatSettings