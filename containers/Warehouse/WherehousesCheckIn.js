import React from 'react';
import { withLocalize } from 'react-localize-redux';
import { I18nManager, TextInput, View, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import CustomHeader, { headerHeight } from '../../components/CustomHeader/index.js';
import FontedText from '../../components/FontedText/index.js';
import HeaderSubmitButton from '../../components/HeaderSubmitButton/index';
import LazyContainer from '../../components/LazyContainer/index';
import CurrentLocationButton from '../../components/CurrentLocationButton';
import { mainTextColor, secondColor, secondTextColor } from '../../constants/Colors.js';
import { largeBorderRadius, largePagePadding, shadowStyle2 } from '../../constants/Style.js';
import { PostWhereHouseLocation } from '../../services/WarehousesService';
import { GetMyCurrentPostion } from '../../utils/Location';

class GpsWhereHouse extends React.Component {

    constructor(props) {
        super(props)

        const {
            Id,
            latitude,
            longitude
        } = this.props.route.params

        this.state = {
            lockSubmit: false,
            latitude,
            longitude,
            latitudeDelta: latitude ? 0.4 : 60,
            longitudeDelta: longitude ? 0.4 : 80,
            screenWidth: Dimensions.get('screen').width,
            screenHeight: Dimensions.get('screen').height,
        }

        this.WhereHouseId = Id
        this.lockSubmit = false
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

    submit = () => {
        const { latitude, longitude } = this.state

        this.lockSubmit = true
        this.setState({ lockSubmit: true })

        PostWhereHouseLocation({
            Id: this.WhereHouseId,
            latitude: latitude != null ? latitude : this.props.route.params?.latitude,
            longitude: longitude != null ? longitude : this.props.route.params?.longitude
        }, res => {
            this.lockSubmit = false
            this.setState({ lockSubmit: false })
            this.props.navigation.goBack()
            this.props.route.params?.onChildChange()
        }, err => {
            this.lockSubmit = false
            this.setState({ lockSubmit: false })
        })
    }

    rightComponent = () => {

        return (
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                }}>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flex: 1,
                    }}>
                    <HeaderSubmitButton
                        isLoading={this.state.lockSubmit}
                        onPress={() => { this.submit() }}
                    />
                </View>
            </View>
        )

    }

    renderLatitudeLongitudeInputs = () => {
        const {
            latitude,
            longitude,
        } = this.state

        const { translate } = this.props

        return (
            <View style={{
                backgroundColor: 'white',
                position: 'absolute',
                width: '90%',
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

                    <FontedText style={{ textAlign: I18nManager.isRTL ? 'right' : 'left', color: secondTextColor, fontSize: 16, flex: 2 }} >{translate('Latitude')}</FontedText>
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
                            this.setState({ latitude: text })
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

                    <FontedText style={{ textAlign: I18nManager.isRTL ? 'right' : 'left', color: secondTextColor, fontSize: 16, flex: 2 }} >{translate('Longitude')}</FontedText>
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
                            this.setState({ longitude: text });
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
            latitudeDelta,
            longitudeDelta
        } = this.state
        return ([<MapView
            key={1}
            onPress={(f) => {
                this.setState({
                    latitude: f.nativeEvent.coordinate.latitude,
                    longitude: f.nativeEvent.coordinate.longitude
                })
            }}
            style={{
                width: this.state.screenWidth,
                height: this.state.screenHeight,
                flex: 1,
            }}
            showsUserLocation={false}
            followsUserLocation={false}
            initialRegion={{
                latitude: isNaN(parseFloat(latitude)) ? 0 : parseFloat(latitude),
                longitude: isNaN(parseFloat(longitude)) ? 0 : parseFloat(longitude),
                latitudeDelta,
                longitudeDelta,
            }}
            region={{
                latitude: isNaN(parseFloat(latitude)) ? 0 : parseFloat(latitude),
                longitude: isNaN(parseFloat(longitude)) ? 0 : parseFloat(longitude),
                latitudeDelta,
                longitudeDelta,
            }}
        >
            <Marker
                draggable
                coordinate={{
                    latitude: isNaN(parseFloat(latitude)) ? 0 : parseFloat(latitude),
                    longitude: isNaN(parseFloat(longitude)) ? 0 : parseFloat(longitude),
                }}
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
                bottom: 10,
                borderRadius: 30,
                paddingHorizontal: 2
            }}
            onPress={() => {
                GetMyCurrentPostion((data) => {
                    const { latitude, longitude } = data
                    this.setState({ latitude, longitude, didDataFitched: true })
                })
            }}
        />]
        )
    }
    render() {
        return (
            <LazyContainer style={{ flex: 1, backgroundColor: "#FFF" }} >
                <CustomHeader
                    leftComponent="back"
                    navigation={this.props.navigation}
                    title="Address"
                    rightNumOfItems={1}
                    rightComponent={this.rightComponent()} />

                {this.renderMap()}

                {this.renderLatitudeLongitudeInputs()}

            </LazyContainer>
        )
    }
}
export default withLocalize(GpsWhereHouse)