import React from 'react';
import { View, TextInput, I18nManager } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import CustomHeader, { headerHeight } from '../../components/CustomHeader';
import CurrentLocationButton from '../../components/CurrentLocationButton';
import HeaderSubmitButton from '../../components/HeaderSubmitButton';
import LazyContainer from '../../components/LazyContainer';
import FontedText from '../../components/FontedText';
import { SetOrderLocation } from '../../services/OrdersService';
import { GetMyCurrentPostion, GpsPermisiton } from '../../utils/Location';
import { LongToast } from '../../utils/Toast';
import { ExternalTranslate } from '../../utils/Translate';
import { secondColor, secondTextColor, mainTextColor } from '../../constants/Colors';
import { largeBorderRadius, largePagePadding, shadowStyle2 } from '../../constants/Style';

class OrderLocation extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            latitude: 0,
            longitude: 0,
            lockSubmit: false,
            didDataFitched: false
        }

        this.lockSubmit = false

    }

    submit = () => {

        const {
            latitude,
            longitude
        } = this.state


        if (this.state.lockSubmit) {
            return
        }

        const {
            Id
        } = this.props.route.params


        if (latitude == 0 || longitude == 0) {
            return LongToast('SelectLocation')
        }

        this.lockSubmit = true;
        this.setState({ lockSubmit: true })

        SetOrderLocation(Id, latitude, longitude, res => {

            this.lockSubmit = false;
            this.setState({ lockSubmit: false })
            LongToast('dataSaved')

            this.props.route.params?.onChildChange && this.props.route.params?.onChildChange()

            this.props.navigation.goBack()

        }, err => {

            this.lockSubmit = false;
            this.setState({ lockSubmit: false })

        })
    }
    componentDidMount() {
        const {
            Lat,
            Lng
        } = this.props.route.params

        if (Lat == null || Lng == null) {
            this.onGetMyLocationWithPemissons()
        } else {

            this.setState({
                latitude: Lat,
                longitude: Lng,
                didDataFitched: true
            })

        }

    }

    onGetMyLocationWithPemissons = async () => {
        await GpsPermisiton(() => {
            GetMyCurrentPostion((data) => {
                this.setState({
                    latitude: data.latitude,
                    longitude: data.longitude,
                    didDataFitched: true
                })
            },
                err => {
                    this.setState({ latitude: 0, longitude: 0, didDataFitched: true })
                })
        })
    }

    renderLatitudeLongitudeInputs = () => {
        const {
            latitude,
            longitude,
        } = this.state

        return (
            <View style={{
                backgroundColor: 'white',
                position: 'absolute',
                width: '80%',
                top: headerHeight + 5
                , left: largePagePadding,
                borderRadius: largeBorderRadius,
                ...shadowStyle2
            }} >
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: 'white',
                    borderRadius: largeBorderRadius,
                    paddingHorizontal: 15
                }} >

                    <FontedText style={{ textAlign: I18nManager.isRTL ? 'right' : 'left', color: secondTextColor, fontSize: 16, flex: 2 }} >{ExternalTranslate('Latitude')}</FontedText>
                    <TextInput
                        style={{
                            fontSize: 13,
                            color: mainTextColor,
                            textAlign: I18nManager.isRTL ? 'right' : 'left',
                            paddingLeft: 0,
                            marginLeft: 0,
                            flex: 5,
                            height: 40,
                            marginTop: 2
                        }}
                        onChangeText={text => {
                            if(text) {
                                this.setState({ latitude: parseFloat(text) })
                            } else {
                                this.setState({ latitude: 0})
                            }
                        }}
                        placeholder={'latitude'}
                        placeholderTextColor={'#717175'}
                        underlineColorAndroid='transparent'
                        selectionColor={secondColor}
                        keyboardType="numeric"
                        value={latitude ? String(latitude) : null}
                    />

                </View>

                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: 'white',
                    borderRadius: largeBorderRadius,
                    paddingHorizontal: 15
                }} >

                    <FontedText style={{ textAlign: I18nManager.isRTL ? 'right' : 'left', color: secondTextColor, fontSize: 16, flex: 2 }} >{ExternalTranslate('Longitude')}</FontedText>
                    <TextInput
                        style={{
                            fontSize: 13,
                            color: mainTextColor,
                            textAlign: I18nManager.isRTL ? 'right' : 'left',
                            paddingLeft: 0,
                            marginLeft: 0,
                            flex: 5,
                            height: 40,
                            marginTop: 2
                        }}
                        onChangeText={text => {
                            if(text) {
                                this.setState({ longitude: parseFloat(text) });
                            } else {
                                this.setState({ longitude: 0 });
                            }

                        }}
                        placeholder={'Longitude'}
                        placeholderTextColor={'#717175'}
                        underlineColorAndroid='transparent'
                        selectionColor={secondColor}
                        keyboardType="numeric"
                        value={longitude ? String(longitude) : null}
                    />

                </View>
            </View>
        )
    }

    renderMap = () => {
        const {
            latitude,
            longitude,
            didDataFitched
        } = this.state

        if (!didDataFitched) {
            return null
        }

        // if (latitude && longitude) {
        return ([<MapView
            key={1}
            onPress={(f) => {
                this.setState({
                    latitude: f.nativeEvent.coordinate.latitude,
                    longitude: f.nativeEvent.coordinate.longitude
                })
            }}
            style={{
                flex: 1
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
            }}>
            <Marker
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
        this.renderLatitudeLongitudeInputs(),
        <CurrentLocationButton
            key={2}
            size={35}
            style={{
                position: 'absolute',
                right: 10,
                top: headerHeight + 15,
                borderRadius: 30,
                paddingHorizontal: 2
            }}
            onPress={this.onGetMyLocationWithPemissons}
        />
        ]
        )

    }

    render() {
        return (
            <LazyContainer style={{ flex: 1 }} >
                <CustomHeader
                    navigation={this.props.navigation}
                    title='OrderLocation'
                    rightComponent={<HeaderSubmitButton isLoading={this.state.lockSubmit}
                        onPress={() => { this.submit() }}
                    />}
                />

                {this.renderMap()}

            </LazyContainer>
        )
    }
}

export default OrderLocation