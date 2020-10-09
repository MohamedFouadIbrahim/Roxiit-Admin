import React from 'react';
import { withLocalize } from 'react-localize-redux';
import { connect } from 'react-redux';
import { KeyboardAvoidingView, Platform, ScrollView, View, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons';
import ArrowItem from '../../components/ArrowItem/index';
import CustomHeader from '../../components/CustomHeader/index.js';
import CustomTouchable from '../../components/CustomTouchable';
import HeaderSubmitButton from '../../components/HeaderSubmitButton/index';
import HorizontalInput from '../../components/HorizontalInput/index';
import ItemSeparator from '../../components/ItemSeparator/index';
import LazyContainer from '../../components/LazyContainer/index';
import CurrentLocationButton from '../../components/CurrentLocationButton';
import PhoneInput from '../../components/PhoneInput/index.js';
import SwitchItem from '../../components/SwitchItem/index';
import { STRING_LENGTH_LONG, STRING_LENGTH_MEDIUM, STRING_LENGTH_SHORT } from '../../constants/Config';
import { largePagePadding } from '../../constants/Style.js';
import { AddEditAdress, GetAdress, GetNewAdressForCustomer } from '../../services/CustomersService';
import { GetMyCurrentPostion } from '../../utils/Location';
import { parsePhone } from '../../utils/Phone.js';
import { SelectArea, SelectCity, SelectCountry } from '../../utils/Places.js';
import { LongToast } from '../../utils/Toast.js';
import { isValidMobileNumber } from '../../utils/Validation';

class Adress extends React.Component {
    constructor(props) {

        super(props)
        this.TypeSelectorRef = React.createRef()
        if (this.props.route.params && this.props.route.params?.CustomerId && this.props.route.params?.AdressID) {
            this.editMode = true
            this.CustomerId = this.props.route.params?.CustomerId
            this.AdreesId = this.props.route.params?.AdressID
        } else {
            this.editMode = false
            this.CustomerId = this.props.route.params?.CustomerId
            // this.AdreesId = this.props.route.params?.AdressID
        }
        this.JustForRequiredFeild = this.props.route.params?.Min
        this.lockSubmit = false
    }
    state = {
        data: null,
        triggerRefresh: false,
        lockSubmit: false,
        screenWidth: Dimensions.get('screen').width,
        screenHeight: Dimensions.get('screen').height,

    }

    onEathIconPress = () => {
        GetMyCurrentPostion((data) => {
            const { latitude, longitude } = data
            this.setState({ latitude: latitude, longitude })
        })
    }
    componentDidMount() {
        if (this.editMode) {
            GetAdress(this.AdreesId, res => {
                const { Phone1, Phone2 } = res.data
                const NumberCountry1 = parsePhone(String(Phone1)).NumberCountry;
                const NationalNumber1 = parsePhone(String(Phone1)).NationalNumber
                const NumberCountry2 = parsePhone(String(Phone2)).NumberCountry;
                const NationalNumber2 = parsePhone(String(Phone2)).NationalNumber

                this.setState({
                    ...res.data,
                    Phone1: NationalNumber1,
                    Phone2: NationalNumber2,
                    Phone1Country: NumberCountry1,
                    Phone2Country: NumberCountry2
                })
            })
        } else {

            GetNewAdressForCustomer(this.CustomerId, res => {

                const { Phone1, Phone2 } = res.data
                const NumberCountry1 = parsePhone(String(Phone1)).NumberCountry;
                const NationalNumber1 = parsePhone(String(Phone1)).NationalNumber
                const NumberCountry2 = parsePhone(String(Phone2)).NumberCountry;
                const NationalNumber2 = parsePhone(String(Phone2)).NationalNumber

                this.setState({
                    ...res.data,
                    Phone1: NationalNumber1,
                    Phone2: NationalNumber2,
                    Phone1Country: NumberCountry1,
                    Phone2Country: NumberCountry2
                })
            })
        }

        //re render when change orientation
        Dimensions.addEventListener('change', () => {
            this.setState({
                screenWidth: Dimensions.get('screen').width,
                screenHeight: Dimensions.get('screen').height,
            })
        })
    }

    submit = () => {
        const { translate } = this.props
        if (this.lockSubmit) {
            return
        }
        const {
            FirstName,
            SecondName,
            CompanyName,
            Phone1,
            Phone2,
            Email1,
            Email2,
            Address1,
            Address2,
            PostCode,
            IsCompany,
            CountryId,
            CityId,
            CustomerId,
            Country,
            City,
            Area,
            Phone1Country,
            Phone2Country,
            latitude,
            longitude
        } = this.state

        // return
        // let { Phone1, Phone2 } = this.state
        // Phone1 = (Phone1[0] === "0") ? Phone1.substr(1) : Phone1;
        // Phone2 = (Phone2[0] === "0") ? Phone2.substr(1) : Phone2;


        if (!FirstName || !Phone1 || !Country || !City || !Address1) {
            return LongToast('CantHaveEmptyInputs')
        }

        if (!isValidMobileNumber(`${Phone1Country.PhoneCode}${Phone1}`)) {
            LongToast('InvalidPhone')
            return
        }
        if (Phone2 && Phone2 != 'null' && !isValidMobileNumber(`${Phone2Country.PhoneCode}${Phone2}`)) {
            LongToast('InvalidPhone')
            return
        }
        if (IsCompany && !CompanyName) {
            LongToast('EnterCompanyName')
            return
        }
        if (this.editMode) {
            this.lockSubmit = true;
            this.setState({ lockSubmit: true })
            AddEditAdress({
                Id: this.AdreesId,
                FirstName,
                SecondName,
                CompanyName,
                Phone1: `${Phone1Country.PhoneCode}${Phone1}`,
                Phone2: Phone2 && Phone2 != 'null' ? `${Phone2Country.PhoneCode}${Phone2}` : null,
                Email1,
                Email2,
                Address1,
                Address2,
                PostCode,
                IsCompany,
                CountryId: Country ? Country.Id : CountryId,
                CityId: City ? City.Id : this.props.city.Id,
                CustomerId: this.CustomerId,
                AreaId: Area && Area.Id != 0 ? Area.Id : null,
                latitude,
                longitude
            }, res => {
                this.lockSubmit = false;
                this.setState({ lockSubmit: false })
                LongToast('dataSaved')
                this.props.route.params?.onChiildChange && this.props.route.params?.onChiildChange()
                this.props.navigation.goBack()
            }, err => {
                this.lockSubmit = false;
                this.setState({ lockSubmit: false })
            })
        } else {
            this.lockSubmit = true;
            this.setState({ lockSubmit: true })

            AddEditAdress({
                Id: 0,
                FirstName,
                SecondName,
                CompanyName,
                Phone1: `${Phone1Country.PhoneCode}${Phone1}`,
                Phone2: Phone2 && Phone2 != 'null' ? `${Phone2Country.PhoneCode}${Phone2}` : null,
                Email1,
                Email2,
                Address1,
                Address2,
                PostCode,
                IsCompany,
                CountryId: Country ? Country.Id : CountryId,
                CityId: City ? City.Id : this.props.city.Id,
                CustomerId: this.CustomerId,
                AreaId: Area && Area.Id != 0 ? Area.Id : null,
                latitude,
                longitude
            }, res => {
                this.lockSubmit = false;
                this.setState({ lockSubmit: false })
                LongToast('dataSaved')
                const newAddress = {
                    Id: 0,
                    FirstName,
                    SecondName,
                    CompanyName,
                    Phone1: `${Phone1Country.PhoneCode}${Phone1}`,
                    Phone2: Phone2 ? `${Phone2Country.PhoneCode}${Phone2}` : null,
                    Email1,
                    Email2,
                    Address1,
                    Address2,
                    PostCode,
                    IsCompany,
                    CountryId: Country ? Country.Id : CountryId,
                    CityId: City ? City.Id : this.props.city.Id,
                    CustomerId: this.CustomerId,
                    AreaId: Area && Area.Id != 0 ? Area.Id : null,
                    latitude,
                    longitude
                }

                this.props.route.params?.onChiildChange && this.props.route.params?.onChiildChange()
                this.props.route.params?.onSelectAdress && this.props.route.params?.onSelectAdress(newAddress)
                this.props.navigation.goBack()
            }, err => {
                this.lockSubmit = false;
                this.setState({ lockSubmit: false })
            })

        }

    }
    renderContent = () => {
        const {
            FirstName,
            SecondName,
            CompanyName,
            Phone1,
            Phone2,
            Email1,
            Email2,
            Address1,
            Address2,
            PostCode,
            IsCompany,
            CountryId,
            CityId,
            Country,
            City,
            Area,
            Phone2Country,
            Phone1Country
        } = this.state
        return (
            <ScrollView>
                <HorizontalInput
                    // multiline
                    maxLength={STRING_LENGTH_MEDIUM}
                    label="FirstName"
                    value={FirstName}
                    onChangeText={(FirstName) => { this.setState({ FirstName }) }} />

                <ItemSeparator />

                <PhoneInput
                    countryId={Phone1Country ? Phone1Country.Id : undefined}
                    onPressFlag={() => {
                        SelectCountry(this.props.navigation, item => {
                            this.setState({ Phone1Country: item })
                        })
                    }}
                    maxLength={STRING_LENGTH_MEDIUM}
                    value={Phone1 ? Phone1 : null}
                    onChangeText={(Phone1) => { this.setState({ Phone1: Phone1 }) }} />

                <ItemSeparator />

                <HorizontalInput
                    // multiline
                    maxLength={STRING_LENGTH_MEDIUM}
                    label="Email1"
                    value={Email1}
                    onChangeText={(Email1) => { this.setState({ Email1 }) }} />

                <ItemSeparator />

                <ArrowItem
                    onPress={() => {
                        SelectCountry(this.props.navigation, item => {
                            this.setState({ Country: item, City: null, Area: null })
                        })
                    }}
                    title={'Country'}
                    info={Country ? Country.Name : null}
                />

                <ItemSeparator />

                <ArrowItem
                    onPress={() => {
                        SelectCity(this.props.navigation, item => {
                            this.setState({ City: item, Area: null })
                        }, Country ? Country.Id : CountryId)
                    }}
                    title={'City'}
                    info={City ? City.Name : this.props.city.Name}
                />

                <ItemSeparator />

                {City || CityId ?
                    <View>
                        <ArrowItem
                            onPress={() => {
                                SelectArea(this.props.navigation, item => {
                                    this.setState({ Area: item })
                                }, City ? City.Id : CityId)
                            }}
                            title={'Area'}
                            info={Area ? Area.Name : null}
                        />

                        <ItemSeparator />

                    </View> : null
                }

                <ItemSeparator />

                <HorizontalInput
                    // multiline
                    maxLength={STRING_LENGTH_LONG}
                    label="Address1"
                    value={Address1}
                    onChangeText={(Address1) => { this.setState({ Address1 }) }} />

                <ItemSeparator />

                <HorizontalInput
                    // multiline
                    maxLength={STRING_LENGTH_MEDIUM}
                    label="SecondName"
                    value={SecondName}
                    onChangeText={(SecondName) => { this.setState({ SecondName }) }} />

                <ItemSeparator />

                {this.JustForRequiredFeild != true ?

                    <View>
                        <HorizontalInput
                            // multiline
                            maxLength={STRING_LENGTH_MEDIUM}
                            label="Email2"
                            value={Email2}
                            onChangeText={(Email2) => { this.setState({ Email2 }) }} />

                        <ItemSeparator />

                    </View> : null
                }


                {
                    this.JustForRequiredFeild ?
                        <View>
                            <HorizontalInput
                                // multiline
                                maxLength={STRING_LENGTH_LONG}
                                label="Address2"
                                value={Address2}
                                onChangeText={(Address2) => { this.setState({ Address2 }) }} />

                            <ItemSeparator />
                        </View> : null

                }

                <HorizontalInput
                    //   multiline
                    maxLength={STRING_LENGTH_SHORT}
                    label="PostCode"
                    value={PostCode}
                    onChangeText={(PostCode) => { this.setState({ PostCode }) }} />

                <ItemSeparator />

                <SwitchItem
                    value={IsCompany}
                    title={'IsCompany'}
                    onValueChange={(IsCompany) => { this.setState({ IsCompany }) }}
                />

                <ItemSeparator />

                {IsCompany == true ?
                    <View>
                        <HorizontalInput
                            //   multiline
                            maxLength={STRING_LENGTH_MEDIUM}
                            label="CompanyName"
                            value={CompanyName}
                            onChangeText={(CompanyName) => { this.setState({ CompanyName }) }} />

                        <ItemSeparator />
                    </View> : null
                }


                {this.JustForRequiredFeild != true ?
                    <PhoneInput
                        countryId={Phone2Country ? Phone2Country.Id : undefined}
                        onPressFlag={() => {
                            SelectCountry(this.props.navigation, item => {
                                this.setState({ Phone2Country: item })
                            }, false, CountryId)
                        }}
                        maxLength={STRING_LENGTH_MEDIUM}
                        value={Phone2 == 'null' ? null : Phone2}
                        onChangeText={(Phone2) => { this.setState({ Phone2: Phone2 }) }} /> : null
                }

            </ScrollView>
        )

    }

    renderMap = () => {
        const {
            latitude,
            longitude
        } = this.state
        if (latitude && longitude) {
            return (
                [<MapView
                    key={0}
                    onPress={(f) => {
                        this.setState({
                            latitude: f.nativeEvent.coordinate.latitude,
                            longitude: f.nativeEvent.coordinate.longitude
                        })
                    }}
                    style={{
                        width: this.state.screenWidth,
                        height: 200,
                        marginTop: largePagePadding,
                    }}
                    showsUserLocation={false}
                    followsUserLocation={false}
                    initialRegion={{
                        latitude,
                        longitude,
                        latitudeDelta: 0.4,
                        longitudeDelta: 0.4,
                    }}
                    region={{
                        latitude,
                        longitude,
                        latitudeDelta: 0.4,
                        longitudeDelta: 0.4,
                    }}
                >
                    <Marker
                        key={1}
                        draggable
                        coordinate={{ latitude, longitude, latitudeDelta: 0.4, longitudeDelta: 0.4 }}
                        onDragEnd={(f) => {
                            this.setState({
                                latitude: f.nativeEvent.coordinate.latitude,
                                longitude: f.nativeEvent.coordinate.longitude
                            })
                        }}
                    />
                </MapView>,
                <CurrentLocationButton
                    key={2}
                    size={35}
                    style={{
                        position: 'absolute',
                        right: 10,
                        bottom: 160,
                        borderRadius: 30,
                        paddingHorizontal: 2
                    }}
                    onPress={this.onEathIconPress}
                />
                ]
            )
        }
    }
    rightComponent = () => {

        return (
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                }}>
                <CustomTouchable
                    onPress={() => { this.onEathIconPress() }}
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flex: 1,
                    }}>
                    <Ionicons
                        name={`earth`}
                        size={22}
                        color={'white'} />
                </CustomTouchable>



                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flex: 1,
                    }}>
                    <HeaderSubmitButton
                        isLoading={this.state.lockSubmit}
                        // didSucceed={this.state.dataFitched}
                        onPress={() => {
                            this.submit()
                        }} />
                </View>

            </View>
        )

    }

    render() {

        return (
            <LazyContainer style={{ flex: 1, backgroundColor: "#FFF" }} >
                <CustomHeader
                    leftComponent="back"
                    navigation={this.props.navigation}
                    title="Adress"
                    rightNumOfItems={2}
                    rightComponent={this.rightComponent()} />

                {/* {this.renderContent()} */}
                {
                    Platform.OS == 'ios' ?

                        <KeyboardAvoidingView behavior='padding' enabled
                            style={{ flex: 1 }}
                            keyboardVerticalOffset={40}
                        >
                            {this.renderContent()}
                        </KeyboardAvoidingView> :

                        this.renderContent()

                }


                {this.renderMap()}

            </LazyContainer>
        );
    }


}
const mapStateToProps = ({
    login: {
        city
    },
}) => ({
    city,
})
export default connect(mapStateToProps)(withLocalize(Adress))