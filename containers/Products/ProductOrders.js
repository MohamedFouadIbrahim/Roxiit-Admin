import React from 'react';
import { withLocalize } from 'react-localize-redux';
import { I18nManager, TextInput, View, ActivityIndicator } from 'react-native';
import Modal from "react-native-modal";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import CircularImage from '../../components/CircularImage';
import ConfirmModal from '../../components/ConfirmModal';
import CustomSelector from '../../components/CustomSelector';
import CustomTouchable from '../../components/CustomTouchable';
import FontedText from '../../components/FontedText';
import ItemSeparator from '../../components/ItemSeparator';
import LazyContainer from '../../components/LazyContainer';
import PhoneInput from '../../components/PhoneInput';
import RemoteDataContainer from '../../components/RemoteDataContainer';
import RoundedCloseButton from '../../components/RoundedCloseButton';
import TranslatedText from '../../components/TranslatedText';
import { mainColor, secondColor, secondTextColor } from '../../constants/Colors';
import { screenWidth } from '../../constants/Metrics';
import { largePagePadding, pagePadding } from '../../constants/Style';
import { CancelOrder, orderBulk } from '../../services/OrdersService';
import { SelectCountry } from '../../utils/Places';
import { SelectEntity } from '../../utils/EntitySelector';
import { LongToast } from '../../utils/Toast';
import { isValidMobileNumber } from '../../utils/Validation';

class ProductOrders extends React.Component {
    constructor(props) {
        super(props)

        const { country_id, countries, translate } = this.props;

        this.state = {
            searchingFor: null,
            data: [],
            triggerRefresh: false,
            showModal: false,
            Name: null,
            Phone: null,
            Address: null,
            Country: countries.find(item => item.Id === country_id),
            buttonLoading: false,
            customer: null
        }

        this.customOptionSelector = React.createRef()
        this.confirmToCancelSelector = React.createRef()

        this.Options = [
            {
                Id: 0, Name: translate('Customer')
            },
            {
                Id: 1, Name: translate('Order')
            },
            {
                Id: 2, Name: translate('CancelOrder')
            }
        ]


    }

    submit = () => {
        const { ProductId } = this.props

        const { Name, Phone, Country, Address, customer, triggerRefresh } = this.state


        if (!customer && !isValidMobileNumber(`${Country.PhoneCode}${Phone}`)) {
            return LongToast('InvalidPhone')
        }

        if (!customer && !Name) {
            return LongToast('CantHaveEmptyInputs')
        }

        this.setState({ buttonLoading: true })

        orderBulk({
            ProductId,
            CustomerId: customer ? customer.Id : null,
            Name,
            Phone: isValidMobileNumber(`${Country.PhoneCode}${Phone}`) ? `${Country.PhoneCode}${Phone}` : null,
            Address
        }, res => {
            this.setState({
                buttonLoading: false,
                showModal: false,
                triggerRefresh: !triggerRefresh,
                Name: null,
                customer: null,
                Phone: null,
                Address: null
            })
        }, err => {
            this.setState({ buttonLoading: false })
        })


    }

    getRequestParams = () => {

        const { ProductId } = this.props
        let params = ''

        if (ProductId) {
            params += `${this.addParamsSeparator(params)}productId=${ProductId}`
        }

        return params
    }

    addParamsSeparator = (params) => {
        return params.length ? '&' : ''
    }

    renderItem = ({ item }) => {
        const { Customer: { Id, FullName, Media: { ImageUrl } }, Status } = item

        return (

            <CustomTouchable style={{
                backgroundColor: 'white',
                flexDirection: 'row',
                paddingHorizontal: largePagePadding,
                paddingVertical: pagePadding,
                flex: 1
            }}

                onPress={() => {
                    this.props.navigation.navigate('Order', {
                        Id: item.Id,
                        onChildChange: this.onChildChange,
                    })
                }}
                onLongPress={() => {
                    this.SelectedOrder = {
                        orderId: item.Id,
                        custmoerId: Id
                    }
                    this.customOptionSelector.current.show()
                }}
            >
                <CircularImage
                    uri={ImageUrl}
                />
                <View
                    style={{
                        paddingHorizontal: largePagePadding,
                    }}
                >
                    <FontedText style={{ color: mainColor }} >
                        {FullName}
                    </FontedText>

                    <FontedText>
                        {Status.Name}
                    </FontedText>
                </View>
            </CustomTouchable>
        )
    }

    onChildChange = () => {
        this.setState({ triggerRefresh: !this.state.triggerRefresh })
    }

    onSelectOption = (option) => {

        switch (option.Id) {

            case 0:
                const { custmoerId } = this.SelectedOrder
                this.props.navigation.navigate('Customer', {
                    Id: custmoerId,
                    onChildChange: this.onChildChange,
                })

                break;
            case 1:
                const { orderId, } = this.SelectedOrder
                this.props.navigation.navigate('Order', {
                    Id: orderId,
                    onChildChange: this.onChildChange,
                })
                break;

            case 2:
                this.confirmToCancelSelector.current.show()
                break;

        }
    }

    showModal = () => {
        this.setState({ showModal: true })
    }

    hideModal = () => {
        this.setState({ showModal: false })
    }

    renderInputs = () => {
        return (
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderBottomColor: secondColor,
                    borderBottomWidth: 1,
                    paddingHorizontal: largePagePadding,
                    justifyContent: 'space-between'
                }}
            >
                <CustomTouchable
                    style={{ flexDirection: 'row' }}
                    onPress={() => {
                        SelectEntity(this.props.navigation, customer => { this.setState({ customer }, () => { this.submit() }) }, 'Customers/Simple', null, true, 1, [], { pagination: true })
                    }}
                >
                    <TranslatedText text={'Search'} />
                    <Ionicons
                        style={{ marginHorizontal: pagePadding }}
                        name={'ios-search'}
                        size={18}
                        color={mainColor} />
                </CustomTouchable>

                <View style={{ borderColor: secondColor, borderWidth: 0.5, width: 1, height: 40, alignSelf: 'center' }} />

                <CustomTouchable
                    style={{ flexDirection: 'row' }}
                    onPress={() => { this.setState({ showModal: true, customer: null }) }}
                >
                    <TranslatedText text={'New'} />
                    <Ionicons
                        style={{ marginHorizontal: pagePadding }}
                        name={'ios-add'}
                        size={22}
                        color={mainColor} />
                </CustomTouchable>

            </View>
        )
    }

    renderModal = () => {
        const { Name, Phone, Address, showModal, Country, buttonLoading } = this.state

        return (
            <Modal onBackdropPress={() => this.setState({ showModal: false, Name: null, Phone: null, Address: null, customer: null })} isVisible={showModal}>
                <View style={{ backgroundColor: "#FFF", width: screenWidth - 40, borderRadius: 20 }}>
                    <View style={{ marginTop: 10, marginRight: 10, alignItems: 'flex-end' }}>
                        <RoundedCloseButton onPress={() => this.setState({ showModal: false, Name: null, Phone: null, Address: null, customer: null, buttonLoading: false })} />
                    </View>
                    <View
                        style={{
                            padding: 20,
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'row'
                        }}>
                        <TranslatedText style={{ flex: 1, color: secondTextColor }} text={"Name"} />
                        <TextInput
                            style={[{
                                flex: 1,
                                fontSize: 15,
                                textAlign: I18nManager.isRTL ? 'right' : 'left',
                                paddingLeft: 0,
                                marginLeft: 0,
                                width: "100%"
                            }]}
                            placeholder={'Name'}
                            placeholderTextColor={'#717175'}
                            value={Name}
                            onChangeText={Name => this.setState({ Name })}
                            underlineColorAndroid='transparent'
                            selectionColor={secondColor} />
                    </View>

                    <ItemSeparator />

                    <View
                        style={{
                            padding: 20,
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'row'
                        }}>
                        <TranslatedText style={{ flex: 1, color: secondTextColor }} text={"Address"} />
                        <TextInput
                            style={[{
                                fontSize: 15,
                                flex: 1,
                                textAlign: I18nManager.isRTL ? 'right' : 'left',
                                paddingLeft: 0,
                                marginLeft: 0,
                                width: "100%"
                            }]}
                            placeholder="Address"
                            placeholderTextColor={'#717175'}
                            value={Address}
                            onChangeText={(Address) => this.setState({ Address })}
                            underlineColorAndroid='transparent'
                            selectionColor={secondColor} />
                    </View>

                    <ItemSeparator />

                    <PhoneInput
                        countryId={Country ? Country.Id : undefined}
                        onPressFlag={() => {
                            this.hideModal()
                            SelectCountry(this.props.navigation, item => {
                                this.setState({ Country: item, showModal: true })
                            })
                        }}
                        value={Phone ? Phone : null}
                        onChangeText={(Phone) => { this.setState({ Phone }) }}
                    />

                    <ItemSeparator />

                    <CustomTouchable
                        disabled={buttonLoading}
                        style={{ backgroundColor: secondColor, justifyContent: "center", alignItems: "center", borderBottomEndRadius: 20, borderBottomLeftRadius: 20 }}
                        onPress={this.submit}>
                        {
                            buttonLoading ? <ActivityIndicator color="#FFF" size="small" style={{ paddingVertical: 13 }} /> :
                                <TranslatedText style={{ color: '#FFF', textAlign: "center", paddingVertical: 13 }} text={"Add"} />
                        }
                    </CustomTouchable>
                </View>
            </Modal>
        )
    }
    render() {
        return (
            <LazyContainer style={{ flex: 1, backgroundColor: "#FFF" }}>

                {this.renderInputs()}

                {this.renderModal()}

                <RemoteDataContainer
                    url={"Orders"}
                    params={this.getRequestParams()}
                    onDataFetched={(data) => {
                        this.setState({ data })
                    }}
                    updatedData={this.state.data}
                    triggerRefresh={this.state.triggerRefresh}
                    keyExtractor={({ Id }) => `${Id}`}
                    ItemSeparatorComponent={() => <ItemSeparator />}
                    renderItem={this.renderItem} />

                <CustomSelector
                    ref={this.customOptionSelector}
                    options={this.Options.map(item => item.Name)}
                    onSelect={(index) => { this.onSelectOption(this.Options[index]) }}
                    onDismiss={() => { }}
                />

                <ConfirmModal
                    ref={this.confirmToCancelSelector}
                    onConfirm={() => {

                        const { orderId } = this.SelectedOrder
                        CancelOrder(orderId, res => {
                            LongToast('OrderCancled')
                            this.onChildChange()
                        })

                    }}
                    onResponse={(check) => {

                    }}
                />
            </LazyContainer>
        )
    }
}

const mapStateToProps = ({
    login: {
        country_id,
    },
    places: {
        countries,
    },
}) => ({
    countries,
    country_id
});
export default connect(mapStateToProps)(withLocalize(ProductOrders))