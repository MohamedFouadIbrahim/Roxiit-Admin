import React, { Component } from 'react';
import { I18nManager, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import CircularImage from '../../components/CircularImage';
import CustomDatePicker from '../../components/CustomDatePicker';
import TranslatedText from '../../components/TranslatedText';
import ItemSeparator from '../../components/ItemSeparator';
import CustomHeader from '../../components/CustomHeader/index.js';
import CustomTouchable from '../../components/CustomTouchable';
import FontedText from '../../components/FontedText/index.js';
import HorizontalInput from '../../components/HorizontalInput/index.js';
import LazyContainer from '../../components/LazyContainer';
import RemoteDataContainer from '../../components/RemoteDataContainer';
import { mainColor, secondTextColor } from '../../constants/Colors';
import { largePagePadding, pagePadding } from '../../constants/Style.js';
import { UserDriverReport } from '../../services/UsersService.js';
import { formatDate, formatTime } from '../../utils/Date';
import { GetTimeFromNumber } from '../../utils/numeral';

class DriverReport extends Component {
    constructor(props) {
        super(props)

        const dateLastMonth = new Date();
        dateLastMonth.setDate(dateLastMonth.getDate());

        this.state = {
            data: null,
            triggerRefresh: false,
            dataFetched: false,
            isToDatePickerVisible: false,
            isFromDatePickerVisible: false,
            from: dateLastMonth.toISOString(),
            to: new Date().toISOString()
        }
        this.userId = this.props.route.params?.Id
    }

    componentDidMount() {
        this.fetchData()
    }

    fetchData = () => {

        const { from, to } = this.state

        UserDriverReport(this.userId, from, to, res => {
            this.setState({
                ...res.data,
                dataFetched: true
            })
        })

    }
    addParamsSeparator = (params) => {
        return params.length ? '&' : ''
    }

    getRequestParams = () => {

        const {
            from,
            to,
        } = this.state

        let params = ''

        if (from && to) {
            params += `${this.addParamsSeparator(params)}createDateFrom=${from}&createDateTo=${to}`
        }

        if (from && !to) {
            params += `${this.addParamsSeparator(params)}createDateFrom=${from}`
        }

        return params
    }
    renderCoasts = () => {
        const {
            TotalOrderCost,
            TotalDeliveryCost,
            TotalMins,
        } = this.state

        const { Currency } = this.props

        return (
            <View>

                <HorizontalInput
                    label="TotalOrderCost"
                    value={`${String(TotalOrderCost)}  ${Currency.Name}`}
                    editable={false}
                />

                <HorizontalInput
                    label="TotalDeliveryCost"
                    value={`${String(TotalDeliveryCost)}  ${Currency.Name}`}
                    editable={false}
                />

                <HorizontalInput
                    label="TotalMins"
                    value={`${String(GetTimeFromNumber(TotalMins))}`}
                    editable={false}
                />

            </View>
        )
    }

    toggleRefresh = () => {
        this.setState({ triggerRefresh: !this.state.triggerRefresh })
    }

    renderItem = ({ item }) => {
        const { Currency } = this.props
        const { Name, Status, TotalPrice, Customer: { Media: { ImageUrl } }, CreateDate, } = item

        return (

            <View style={{ backgroundColor: 'white', flexDirection: 'row', paddingVertical: pagePadding, }}>

                <CircularImage uri={ImageUrl} />

                <View style={{ paddingLeft: largePagePadding, marginHorizontal: I18nManager.isRTL ? 10 : 0, flex: 1 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>

                        <FontedText style={{ color: 'black', flex: 5 }}>{Name}</FontedText>
                        <FontedText style={{
                            color: secondTextColor,
                            flex: 2, textAlign: 'center', lineHeight: 20
                        }}>{formatDate(CreateDate)} {formatTime(CreateDate)}</FontedText>

                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                        <FontedText style={{
                            color: secondTextColor,
                            marginTop: 5
                        }}>{TotalPrice} {Currency.Name}</FontedText>

                    </View>

                </View>
            </View>

        )
    }

    showFromDateTimePicker = () => {
        this.setState({ isFromDatePickerVisible: true });
    }

    hideFromDateTimePicker = () => {
        this.setState({ isFromDatePickerVisible: false });
    }

    showToDateTimePicker = () => {
        this.setState({ isToDatePickerVisible: true });
    }

    hideToDateTimePicker = () => {
        this.setState({ isToDatePickerVisible: false });
    }

    renderDatePickers = () => {
        const { from, to } = this.state

        if (from && to) {
            return (
                <View
                    style={{
                        backgroundColor: 'white',
                        flexDirection: 'row',
                        borderBottomColor: '#aaaaaa',
                        borderBottomWidth: 0.5,
                    }}>
                    <CustomTouchable
                        onPress={() => {
                            this.showFromDateTimePicker()
                        }}
                        style={{
                            flex: 2,
                            justifyContent: 'center',
                            alignItems: 'flex-start',
                            paddingLeft: pagePadding,
                        }}>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}>
                            <FontedText style={{ color: mainColor }}>{formatDate(from)}</FontedText>

                            <Ionicons
                                name={"md-arrow-dropdown"}
                                size={24}
                                color={mainColor}
                                style={{
                                    marginLeft: 5,
                                }} />
                        </View>
                    </CustomTouchable>

                    <View
                        style={{
                            flex: 1.5,
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingVertical: pagePadding,
                        }}>
                        <Ionicons
                            name={"ios-arrow-round-forward"}
                            size={26}
                            color={mainColor} />
                    </View>

                    <CustomTouchable
                        onPress={() => {
                            this.showToDateTimePicker()
                        }}
                        style={{
                            flex: 2,
                            justifyContent: 'center',
                            alignItems: 'flex-end',
                            paddingRight: pagePadding,
                        }}>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}>
                            <FontedText style={{ color: mainColor }}>{formatDate(to)}</FontedText>

                            <Ionicons
                                name={"md-arrow-dropdown"}
                                size={24}
                                color={mainColor}
                                style={{
                                    marginLeft: 5,
                                }} />
                        </View>
                    </CustomTouchable>
                </View>
            )
        }
    }

    render() {
        const { from, to, isFromDatePickerVisible, isToDatePickerVisible, triggerRefresh } = this.state

        if (!this.state.dataFetched) {
            return null
        }

        return (
            <LazyContainer style={{ flex: 1, backgroundColor: "#FFF" }}>
                <CustomHeader
                    navigation={this.props.navigation}
                    title="DriverRebort" />

                {this.renderDatePickers()}

                <View style={{ paddingHorizontal: pagePadding }} >

                    {this.renderCoasts()}

                    {/* <FlatList
                        refreshing={true}
                        ListHeaderComponent={
                            <TranslatedText style={{ paddingVertical: 10, paddingHorizontal: pagePadding, fontWeight: 'bold', color: 'black' }} text={'Orders'} />
                        }
                        contentContainerStyle={{ paddingHorizontal: pagePadding }}
                        data={this.state.Orders}
                        renderItem={this.renderItem}
                        keyExtractor={({ Id }) => String(Id)}
                        extraData={this.state.Orders}
                    /> */}

                    <RemoteDataContainer
                        url={"Orders"}
                        params={this.getRequestParams()}
                        cacheName={"orders"}
                        onDataFetched={(data) => {
                            this.setState({ data })
                        }}
                        ListHeaderComponent={
                            <TranslatedText style={{ paddingVertical: 10, paddingHorizontal: pagePadding, fontWeight: 'bold', color: 'black' }} text={'Orders'} />
                        }
                        updatedData={this.state.data}
                        triggerRefresh={this.state.triggerRefresh}
                        keyExtractor={({ Id }) => `${Id}`}
                        contentContainerStyle={{ paddingHorizontal: pagePadding }}
                        ItemSeparatorComponent={() => <ItemSeparator />}
                        renderItem={this.renderItem} />
                </View>

                {from && <CustomDatePicker
                    isVisible={isFromDatePickerVisible}
                    date={from}
                    onDatePicked={(date) => {
                        this.setState({
                            from: date,
                        })

                        this.hideFromDateTimePicker()

                    }}
                    onCancel={this.hideFromDateTimePicker} />}

                {to && <CustomDatePicker
                    isVisible={isToDatePickerVisible}
                    date={to}
                    onDatePicked={(date) => {
                        this.setState({
                            to: date,
                        })

                        this.hideToDateTimePicker()

                    }}
                    onCancel={this.hideToDateTimePicker} />}

            </LazyContainer>
        )
    }
}

const mapStateToProps = ({
    login: {
        Currency,
    }
}) => ({
    Currency
})
export default connect(mapStateToProps)(DriverReport)