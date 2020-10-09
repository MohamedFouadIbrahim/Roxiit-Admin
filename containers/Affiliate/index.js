import React from 'react';
import { View } from 'react-native';
import ArrowItem from '../../components/ArrowItem';
import CustomButton from '../../components/CustomButton';
import { pagePadding, largePagePadding, shadowStyle3 } from '../../constants/Style';
import CustomDatePicker from '../../components/CustomDatePicker';
import CustomHeader, { headerHeight } from '../../components/CustomHeader';
import ItemSeparator from '../../components/ItemSeparator/index.js';
import LazyContainer from '../../components/LazyContainer';
import RemoteDataContainer from '../../components/RemoteDataContainer';
import { formatDate } from '../../utils/Date.js';
import Ionicons from 'react-native-vector-icons/Ionicons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import SearchBar from '../../components/SearchBar/index.js';
import CustomTouchable from '../../components/CustomTouchable';
import { isValidSearchKeyword } from '../../utils/Validation.js';
import TranslatedText from '../../components/TranslatedText/index.js';
import FontedText from '../../components/FontedText/index.js';
import { connect } from 'react-redux';
import { ExternalTranslate } from '../../utils/Translate.js';
import Triangle from 'react-native-triangle';
import { mainColor } from '../../constants/Colors.js';
import Entypo from 'react-native-vector-icons/Entypo'


class Affiliate extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            searchBarShown: false,
            isFromDateTimePickerVisible: false,
            isToDateTimePickerVisible: false,
            From: null,
            To: null,
            triggerRefresh: false,
            searchingFor: ''
        }
    }

    handleFromDatePicked = date => {
        this.setState({ From: date, isFromDateTimePickerVisible: false })
    };

    handleToDatePicked = date => {
        this.setState({ To: date, isToDateTimePickerVisible: false })
    }

    getRequestParams = () => {
        let params = ''

        const { searchingFor, From, To } = this.state

        if (isValidSearchKeyword(searchingFor)) {
            params += `${this.addParamsSeparator(params)}search=${searchingFor}`
        }

        if (From && !To) {
            params = `${this.addParamsSeparator(params)}from=${From}`
        }

        if (From && To) {
            params = `${this.addParamsSeparator(params)}from=${From}&to=${To}`
        }

        return params
    }

    addParamsSeparator = (params) => {
        return params.length ? '&' : ''
    }

    renderPopup = () => {
        let { pos_y, pos_x, isPopupVisible, From, To } = this.state

        if (!isPopupVisible || pos_x === undefined || pos_y === undefined) {
            return null
        }

        // Can cause bugs on iOS?
        pos_x -= 29

        const translate = ExternalTranslate

        return (
            <View
                style={{
                    position: 'absolute',
                    top: pos_y + headerHeight + 2,
                    right: pos_x,
                    backgroundColor: 'white',
                    borderRadius: 15,
                    paddingVertical: largePagePadding,
                    width: 250,
                    ...shadowStyle3,
                }}>
                <Triangle
                    width={14}
                    height={10}
                    color={'white'}
                    direction={'up'}
                    style={{
                        position: 'absolute',
                        top: -10,
                        right: pos_x + 2,
                    }}
                />

                <View>

                    <ArrowItem
                        onPress={() => {
                            this.setState({ isFromDateTimePickerVisible: true })
                        }}
                        title={'From'}
                        info={From ? formatDate(From) : translate('From')} />

                    <ItemSeparator />

                    {From && <ArrowItem
                        onPress={() => {
                            this.setState({ isToDateTimePickerVisible: true })
                        }}
                        title={'To'}
                        info={To ? formatDate(To) : translate('To')} />}

                    <CustomButton
                        onPress={() => {
                            this.hidePopup()
                            this.setState({
                                From: null,
                                To: null,
                            })
                        }}
                        style={{
                            marginTop: pagePadding + 10,
                            marginHorizontal: largePagePadding,
                        }}
                        title='Clear' />
                </View>

            </View>
        )
    }

    renderSearch = () => {
        return (
            <SearchBar
                visible={this.state.searchBarShown}
                onPressClose={() => { this.setState({ searchBarShown: !this.state.searchBarShown }) }}
                onSubmitEditing={(text) => {
                    this.setState({ searchingFor: text })
                }} />
        )
    }

    hidePopup = () => {
        this.setState({ isPopupVisible: false })
    }

    renderItem = (item, index) => {
        const {
            FromCustomer,
            ToCustomer,
            ToMe,
            ToHim,
            date
        } = item.item

        const { Currency } = this.props
        // return null
        return (
            <CustomTouchable
                style={{
                    paddingHorizontal: largePagePadding,
                    paddingVertical: pagePadding,
                }}
                onPress={() => {
                    this.props.navigation.navigate('CustomerAffiliate', { Id: FromCustomer.Id })
                }}
            >
                <View style={{
                    justifyContent: 'space-between',
                    flexDirection: 'row'
                }} >

                    <View
                        style={{
                            flexDirection: 'row'
                        }}>

                        <TranslatedText
                            text='To'
                            style={{
                                color: mainColor
                            }}
                        />
                        <FontedText>
                            {` : ${ToCustomer.Name} , `}
                        </FontedText>

                        <FontedText>
                            {`${ToMe} ${Currency.Name}`}
                        </FontedText>

                    </View>

                    <FontedText>
                        {`${formatDate(date)}`}
                    </FontedText>

                </View>

                <View style={{ flexDirection: 'row' }}>

                    <TranslatedText
                        text='From'
                        style={{
                            color: mainColor
                        }}
                    />
                    <FontedText>
                        {` : ${FromCustomer.Name} , `}
                    </FontedText>

                    <FontedText>
                        {`${ToHim} ${Currency.Name}`}
                    </FontedText>

                </View>

            </CustomTouchable>
        )
    }

    render() {
        return (
            <LazyContainer
                style={{ flex: 1 }}
            >

                <CustomHeader
                    title='Affiliate'
                    navigation={this.props.navigation}
                    leftComponent={'back'}
                    rightNumOfItems={3}
                    rightComponent={
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center"
                            }}>
                            <CustomTouchable
                                onPress={() => { this.setState({ searchBarShown: !this.state.searchBarShown }) }}
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    flex: 1
                                }}>
                                <Ionicons
                                    name={`ios-search`}
                                    size={24}
                                    color={'white'} />
                            </CustomTouchable>


                            <CustomTouchable
                                onLayout={({ nativeEvent: { layout: { x, y } } }) => {
                                    this.setState({ pos_x: x, pos_y: y })
                                }}
                                onPress={() => { this.setState({ isPopupVisible: !this.state.isPopupVisible }) }}
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    flex: 1
                                }}>
                                <AntDesign
                                    name={`filter`}
                                    size={24}
                                    color={'white'} />
                            </CustomTouchable>

                            <CustomTouchable
                                onPress={() => {
                                    this.props.navigation.navigate('AffiliateRoles')
                                }}
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    flex: 1
                                }}>
                                <Entypo
                                    name={`pencil`}
                                    size={24}
                                    color={'white'} />
                            </CustomTouchable>


                        </View>
                    }
                />
                {this.renderSearch()}

                <RemoteDataContainer
                    url={"Customer/affiliate"}
                    params={this.getRequestParams()}
                    // cacheName={"Affiliate"}
                    onDataFetched={(data) => {
                        this.setState({ data })
                    }}
                    updatedData={this.state.data}
                    triggerRefresh={this.state.triggerRefresh}
                    keyExtractor={(item, index) => `${index}`}
                    ItemSeparatorComponent={() => <ItemSeparator />}
                    renderItem={this.renderItem} />

                {this.renderPopup()}

                <CustomDatePicker
                    onDatePicked={this.handleFromDatePicked}
                    onCancel={() => this.setState({ isFromDateTimePickerVisible: false })}
                    isVisible={this.state.isFromDateTimePickerVisible}
                    date={this.state.From}
                />

                <CustomDatePicker
                    isVisible={this.state.isToDateTimePickerVisible}
                    onDatePicked={this.handleToDatePicked}
                    onCancel={() => this.setState({ isToDateTimePickerVisible: false })}
                    date={this.state.To}
                />
            </LazyContainer>
        )
    }
}
const mapStateToProps = ({
    login: {
        Currency,
    },
}) => ({
    Currency
})

export default connect(mapStateToProps)(Affiliate)