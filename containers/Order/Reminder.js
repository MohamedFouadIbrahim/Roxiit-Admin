import React from 'react';
import { ScrollView, View, TextInput } from 'react-native';
import CustomHeader from '../../components/CustomHeader';
import CustomTouchable from '../../components/CustomTouchable';
import DateTimePicker from '../../components/CustomDatePicker';
import FontedText from '../../components/FontedText';
import LazyContainer from '../../components/LazyContainer';
import { largeBorderRadius, shadowStyle0, pagePadding, largePagePadding } from '../../constants/Style';
import { AddReminder } from '../../services/OrdersService';
import { LongToast } from '../../utils/Toast';
import { screenWidth } from '../../constants/Metrics';
import SettingsTitle from '../../components/Settings/SettingsTitle.js';
import { formatDate, formatTime } from '../../utils/Date';
import { withLocalize } from 'react-localize-redux';
import CustomButton from '../../components/CustomButton';

class Reminder extends React.Component {

    constructor(props) {
        super(props)

        if (this.props.route.params && this.props.route.params?.orderId) {
            this.orderId = this.props.route.params?.orderId
        }

        this.state = {
            Message: null,
            AtTime: null,
            lockSubmit: false,
            AfterHoures: null,
            isDateTimePickerVisible: false
        }

        this.lockSubmit = false

    }

    hideDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: false })
    }

    showDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: true })
    }

    PostReminder = (data) => {

        const { AtTime, AfterHoures } = data

        if (this.lockSubmit) {
            return
        }

        if (!AtTime && !AfterHoures) {
            return LongToast('pleasePutAtLeastAtTimeOrAfterHoures')
        }
        this.lockSubmit = true
        this.setState({ lockSubmit: true })

        AddReminder(data, res => {
            this.lockSubmit = false
            this.setState({ lockSubmit: false })
            LongToast('dataSaved')
            this.props.navigation.goBack()
            this.props.route.params?.onChildChange && this.props.route.params?.onChildChange()
        }, err => {
            this.lockSubmit = false
            this.setState({ lockSubmit: false })
        })

    }

    onPressItem = (number, Type) => {

        let AfterHoures;

        switch (Type) {
            case 'Dayes':
            case 'Day':
                AfterHoures = number * 24
                this.PostReminder({
                    OrderId: this.orderId,
                    AfterHoures: AfterHoures
                })

                break;

            case 'Week':
                const dayes = number * 7
                AfterHoures = dayes * 24
                this.PostReminder({
                    OrderId: this.orderId,
                    AfterHoures: AfterHoures
                })

                break;

            case 'Hours':
                this.PostReminder({
                    OrderId: this.orderId,
                    AfterHoures: number
                })
                break;
        }

    }

    renderTimes = () => {
        const { translate } = this.props
        return (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{
                marginHorizontal: 10
            }} >

                <TimesItem translate={translate} number={2} Type={'Hours'} onPressItem={(n, t) => this.onPressItem(n, t)} />

                <TimesItem translate={translate} number={8} Type={'Hours'} onPressItem={(n, t) => this.onPressItem(n, t)} />

                <TimesItem translate={translate} number={1} Type={'Day'} onPressItem={(n, t) => this.onPressItem(n, t)} />

                <TimesItem translate={translate} number={3} Type={'Dayes'} onPressItem={(n, t) => this.onPressItem(n, t)} />

                <TimesItem translate={translate} number={1} Type={'Week'} onPressItem={(n, t) => this.onPressItem(n, t)} />

            </ScrollView>
        )
    }

    renderAtHoursInput = () => {
        const { AfterHoures } = this.state
        return (

            <TextInput
                keyboardType='numeric'
                style={{
                    borderWidth: 0.2,
                    borderRadius: 5,
                    backgroundColor: 'white',
                    width: screenWidth - largePagePadding * 2,
                    marginHorizontal: largePagePadding,
                    marginVertical: 10

                }}
                onChangeText={(AfterHoures) => {
                    this.setState({ AfterHoures, AtTime: null })
                }}
                value={AfterHoures}
            />
        )
    }

    renderMessageInput = () => {
        const { Message } = this.state
        return (

            <TextInput
                multiline
                style={{
                    borderWidth: 0.2,
                    borderRadius: 5,
                    backgroundColor: 'white',
                    width: screenWidth - largePagePadding * 2,
                    marginHorizontal: largePagePadding,
                    marginVertical: 10,
                    lineHeight: 20
                }}
                numberOfLines={3}
                onChangeText={(Message) => {
                    this.setState({ Message })
                }}
                value={Message}
            />
        )
    }

    renderAtTimeInputs = () => {
        const { AtTime } = this.state
        const { translate } = this.props
        return (
            <CustomTouchable
                onPress={() => { this.showDateTimePicker() }}
            >
                <FontedText
                    style={{
                        borderWidth: 0.2,
                        borderRadius: 5,
                        backgroundColor: 'white',
                        width: screenWidth - largePagePadding * 2,
                        marginHorizontal: largePagePadding,
                        textAlign: 'center',
                        height: 50,
                        textAlignVertical: 'center',
                        marginVertical: 10,
                    }}
                >
                    {AtTime ? `${formatDate(AtTime)} - ${formatTime(AtTime)}` : translate('Select')}
                </FontedText>
            </CustomTouchable>
        )
    }

    render() {

        const { isDateTimePickerVisible } = this.state

        return (
            <LazyContainer style={{ flex: 1, backgroundColor: "#F4F6F9" }} >

                <CustomHeader
                    navigation={this.props.navigation}
                    title={"Reminder"}
                />

                <ScrollView>

                    <View >
                        <SettingsTitle title={"QuickReminder"} />
                        {this.renderTimes()}
                    </View>

                    <OR />

                    <View>
                        <SettingsTitle title={"AfterHourse"} />
                        {this.renderAtHoursInput()}
                    </View>

                    <OR />

                    <View>
                        <SettingsTitle title={"At"} />
                        {this.renderAtTimeInputs()}
                    </View>

                    <OR />

                    <View>
                        <SettingsTitle title={"Message"} />
                        {this.renderMessageInput()}
                    </View>


                    <DateTimePicker
                        isVisible={isDateTimePickerVisible}
                        onDatePicked={(date) => {
                            this.setState({ AtTime: date, AfterHoures: null })
                            this.hideDateTimePicker()
                        }}
                        is24Hour={true}
                        mode='datetime'
                        onCancel={() => this.hideDateTimePicker()}
                    />

                    <CustomButton
                        onPress={() => {
                            const { AtTime, AfterHoures, Message } = this.state
                            this.PostReminder({
                                OrderId: this.orderId,
                                AtTime,
                                AfterHoures,
                                Message
                            })
                        }}
                        style={{
                            marginHorizontal: largePagePadding,
                        }}
                        loading={this.state.lockSubmit}
                        title='Add' />
                </ScrollView>

            </LazyContainer>
        )
    }
}

const OR = () => {
    return (
        <View style={{ marginVertical: pagePadding, marginHorizontal: largePagePadding }} >
            <View style={{ height: 0.2, borderWidth: 0.2, borderColor: 'black', }} />
            <FontedText style={{ bottom: 10, backgroundColor: '#F4F6F9', paddingHorizontal: pagePadding, alignSelf: 'center', fontSize: 15 }} >
                {'OR'}
            </FontedText>
        </View>
    )
}

const TimesItem = ({ number, Type, onPressItem, translate }) => (
    <View
        style={{
            backgroundColor: 'white',
            borderRadius: largeBorderRadius,
            ...shadowStyle0,
            padding: 10,
            marginVertical: 10,
            justifyContent: 'center',
            marginHorizontal: 10,
        }}
    >

        <CustomTouchable
            onPress={() => onPressItem && onPressItem(number, Type)}
        >
            <FontedText>
                {`${translate('After')} ${number} ${translate(Type)}`}
            </FontedText>

        </CustomTouchable>

    </View>
)
export default withLocalize(Reminder);