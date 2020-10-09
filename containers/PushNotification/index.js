import React from 'react';
import { ScrollView, View } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import ArrowItem from '../../components/ArrowItem';
import ConditionalCircularImage from '../../components/ConditionalCircularImage';
import CustomButton from '../../components/CustomButton';
import CustomHeader from '../../components/CustomHeader';
import CustomLoader from '../../components/CustomLoader';
import CustomSelector from '../../components/CustomSelector';
import CustomTouchable from '../../components/CustomTouchable';
import HeaderSubmitButton from '../../components/HeaderSubmitButton';
import HorizontalInput from '../../components/HorizontalInput';
import ItemSeparator from '../../components/ItemSeparator';
import LazyContainer from '../../components/LazyContainer';
import TranslatedText from '../../components/TranslatedText';
import { mainColor } from '../../constants/Colors';
import { largePagePadding, pagePadding } from '../../constants/Style';
import { getFilters } from '../../services/FilterService';
import { AddEditNotificationTemplate, GetNotificationTemplate, SendNotificationTemplate } from '../../services/PushNotifcationService';
import { formatDate, formatTime } from '../../utils/Date';
import { SelectEntity } from '../../utils/EntitySelector';
import { OpenSingleSelectImagePicker, OpenCamera } from '../../utils/Image';
import { SelectArea, SelectCity, SelectCountry } from '../../utils/Places';
import { LongToast } from '../../utils/Toast';
import { TrimText } from '../../utils/Text';
import { Translate, withLocalize } from 'react-localize-redux';

class PushNotifcation extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            lockSubmit: false,
            didFetchData: false,
            sendNotificationLockSubmit: false,
            Countries: [],
            Cities: [],
            Areas: [],
            Customers: [],
            CustomerStatuses: [],
            CustomerTypes: [],
            Languages: [],
            prossesEvent: 0,
            uploadingImage: false,
            Media: {
                ImageUrl: null
            },
            Page: null,
            PageParameter1: null,
            PageParameter2: null,
            Pages: [],
            remoteImage: false
        }

        this.lockSubmit = false

        this.Orders = [{ Id: 0, Name: "All", Value: null }, { Id: 1, Name: "OrderedBefore", Value: 1 }, { Id: 2, Name: "NotOrderedBefore", Value: 2 }]
        this.Sources = [{ Id: 0, Name: "All", Value: null }, { Id: 1, Name: "POS", Value: 1 }, { Id: 2, Name: "CustomerApp", Value: 2 }]

        if (this.props.route.params && this.props.route.params?.Id) {

            this.editMode = true;
            this.Id = this.props.route.params?.Id;

        } else {

            this.editMode = false
        }

        this.LibraryOrCameraRef = React.createRef();
        this.LibraryOrCameraOptions = [{ Id: 0, Name: 'Camera' }, { Id: 1, Name: 'Library' }]
        this.pagesRef = React.createRef();
        this.OrderRef = React.createRef();
        this.SourceRef = React.createRef();
    }

    sendNotificationTemplate = () => {
        if (this.lockSubmit) {
            return
        }

        this.lockSubmit = true;
        this.setState({ sendNotificationLockSubmit: true })

        SendNotificationTemplate(this.Id, res => {
            this.lockSubmit = false
            this.setState({ sendNotificationLockSubmit: false })
            LongToast('NotifcationHassBeenSend')
            this.props.navigation.goBack()
        }, err => {
            this.lockSubmit = false
            this.setState({ sendNotificationLockSubmit: false })
        })

    }

    AddEditImage = (chosseindex) => {
        if (chosseindex == 0) {

            OpenCamera(Data => {
                const {
                    uri,
                    path
                } = Data

                this.setState({
                    picker_image_uri: uri,
                    ImageData: path,
                    remoteImage: false
                })

            })

        } else {
            OpenSingleSelectImagePicker(Data => {
                const {
                    uri,
                    path
                } = Data
                this.setState({
                    picker_image_uri: uri,
                    ImageData: path,
                    remoteImage: false
                })
            })
        }
    }

    submit = () => {
        if (this.lockSubmit) {
            return
        }

        const {
            Id,
            Name,
            Title,
            Body,
            Page,
            PageParameter1,
            PageParameter2,
            Countries,
            Cities,
            Areas,
            Languages,
            Customers,
            CustomerStatuses,
            CustomerTypes,
            Products,
            ImageData,
            OrderFilter,
            Source,
        } = this.state

        const { Orders, Sources } = this
        if (!Name || !Title || !Body) {
            return LongToast('CantHaveEmptyInputs')
        }
        if (Page == 2 && !PageParameter1) {
            return LongToast('CantHaveEmptyInputs')
        }
        this.setState({ lockSubmit: true, uploadingImage: true })
        this.lockSubmit = true

        AddEditNotificationTemplate({
            Id: this.editMode ? this.Id : 0,
            Name,
            Title,
            Body,
            Page: Page ? Page : null,
            PageParameter1: PageParameter1 ? PageParameter1 : null,
            PageParameter2: PageParameter2 ? PageParameter2 : null,
            Countries: Countries && Countries.length ? Countries.map(item => item.Id) : [],
            Cities: Cities && Cities.length ? Cities.map(item => item.Id) : [],
            Areas: Areas && Areas.length ? Areas.map(item => item.Id) : [],
            Languages: Languages && Languages.length ? Languages.map(item => item.Id) : [],
            Customers: Customers && Customers.length ? Customers.map(item => item.Id) : [],
            CustomerStatuses: CustomerStatuses && CustomerStatuses.length ? CustomerStatuses.map(item => item.Id) : [],
            CustomerTypes: CustomerTypes && CustomerTypes.length ? CustomerTypes.map(item => item.Id) : [],
            Products: Products && Products.length ? Products.map(item => item.Id) : [],
            Image: ImageData,
            OrderFilter,
            Source,
        }, res => {
            LongToast('dataSaved')
            this.setState({ lockSubmit: false, uploadingImage: false })
            this.lockSubmit = false
            this.props.route.params?.onChildChange && this.props.route.params?.onChildChange()
            this.props.navigation.goBack()
        }, err => {
            this.setState({ lockSubmit: false, uploadingImage: false })
            this.lockSubmit = false
        }, prossesNumber => {
            this.setState({ prossesEvent: prossesNumber * 0.01 })
        })

    }

    componentDidMount() {
        getFilters({
            customerTypes: true,
            customerStatus: true
        }, res => {

            const { CustomerTypes, CustomerStatus } = res.data

            if (this.editMode) {

                GetNotificationTemplate(this.Id, NotificationResponse => {


                    this.setState({
                        ...NotificationResponse.data,
                        Media: NotificationResponse.data.Media ? NotificationResponse.data.Media : { ImageUrl: null },
                        allCustomerTypes: CustomerTypes,
                        allCustomerStatuses: CustomerStatus,
                        didFetchData: true,
                        remoteImage: true,
                    })
                })

            } else {

                this.setState({
                    allCustomerTypes: CustomerTypes,
                    allCustomerStatuses: CustomerStatus,
                    didFetchData: true,
                    remoteImage: true
                })

            }
        })

    }

    renderImage = () => {
        const imageSize = 90

        if (this.editMode) {
            const { Media: { ImageUrl }, didFetchData } = this.state

            if (!didFetchData) {
                return null
            }

            const { picker_image_uri, remoteImage } = this.state

            return (
                <CustomTouchable
                    onPress={() => {
                        this.LibraryOrCameraRef.current.show()
                    }}
                    style={[{
                        alignSelf: 'center',
                        justifyContent: 'center',
                        alignItems: 'center',
                        margin: largePagePadding,
                    }, !ImageUrl ? {
                        backgroundColor: '#aaaaaa',
                        margin: largePagePadding,
                        width: imageSize,
                        height: imageSize,
                        borderRadius: imageSize / 2,
                    } : {}]}>

                    {picker_image_uri || ImageUrl ? <ConditionalCircularImage
                        remote={remoteImage}
                        uri={picker_image_uri || ImageUrl}
                        size={imageSize} /> : <Ionicons
                            name={`ios-add`}
                            size={45}
                            color={'white'} />}

                    {picker_image_uri || ImageUrl ? <FontAwesome
                        style={{
                            position: 'absolute',
                            right: 2,
                            bottom: 2,
                        }}
                        name={`camera`}
                        size={20}
                        color={mainColor} /> : null}

                    {this.state.uploadingImage == true ?
                        <CustomLoader
                            size={imageSize - 30}
                            progress={this.state.prossesEvent == 0 ? this.state.prossesEvent : this.state.prossesEvent}
                        />
                        : null
                    }
                </CustomTouchable>
            )
        }
        else {
            const { picker_image_uri, remoteImage } = this.state

            return (
                <CustomTouchable
                    onPress={() => {
                        this.LibraryOrCameraRef.current.show()
                    }}
                    style={{
                        alignSelf: 'center',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#aaaaaa',
                        margin: largePagePadding,
                        width: imageSize,
                        height: imageSize,
                        borderRadius: imageSize / 2,
                    }}>
                    {picker_image_uri ? <ConditionalCircularImage
                        remote={remoteImage}
                        uri={picker_image_uri}
                        size={imageSize} /> : <Ionicons
                            name={`ios-add`}
                            size={45}
                            color={'white'} />}

                    {this.state.uploadingImage == true ?
                        <CustomLoader
                            size={imageSize - 30}
                            progress={this.state.prossesEvent == 0 ? this.state.prossesEvent : this.state.prossesEvent}
                        />
                        : null
                    }
                </CustomTouchable>
            )
        }
    }

    renderContent = () => {
        const { didFetchData } = this.state

        if (!didFetchData) {
            return null
        }

        const {
            Id,
            Name,
            Title,
            Body,
            LastTimeSent,
            LastTimeSentQty,
            Countries,
            Cities,
            Areas,
            Customers,
            CustomerStatuses,
            CustomerTypes,
            allCustomerTypes,
            allCustomerStatuses,
            Languages,
            Products,
            Pages,
            Page,
            PageParameter1,
            PageParameter2,
            OrderFilter,
            Source,
        } = this.state

        const { Orders, Sources } = this
        const { translate } = this.props
        return (
            <ScrollView contentContainerStyle={{ backgroundColor: 'white' }}>

                {this.renderImage()}
                <ItemSeparator />

                <View style={{ justifyContent: 'space-between', flexDirection: 'column' }} >

                    {LastTimeSent && <HorizontalInput
                        label="LastTimeSent"
                        value={LastTimeSent ? `${formatDate(String(LastTimeSent)) + '  ' + formatTime(String(LastTimeSent))}` : null}
                        editable={false}
                    />}

                    <ItemSeparator />

                    {LastTimeSent && <HorizontalInput
                        label="LastTimeSentQty"
                        value={LastTimeSentQty ? String(LastTimeSentQty) : null}
                        editable={false} />}

                    <ItemSeparator />

                </View>

                <HorizontalInput
                    label="Name"
                    value={Name}
                    onChangeText={Name => {
                        this.setState({ Name });
                    }}
                />

                <ItemSeparator />

                <HorizontalInput
                    label="Title"
                    value={Title}
                    onChangeText={Title => {
                        this.setState({ Title });
                    }}
                />

                <ItemSeparator />

                <HorizontalInput
                    label="Body"
                    value={Body}
                    multiline={true}
                    onChangeText={Body => {
                        this.setState({ Body });
                    }}
                />

                <ItemSeparator />

                {Pages.length ? <ArrowItem
                    onPress={() => { this.pagesRef.current.show() }}
                    title={"Navigation"}
                    info={Page && Pages ? Pages.find(item => item.Id == Page).Name : null}
                /> : null}

                <ItemSeparator />

                {Page && Page == 2 ? <ArrowItem
                    onPress={() => {
                        SelectEntity(this.props.navigation, product => {
                            this.setState({ PageParameter1: product.Id, PageParameter2: product.Name })
                        }, 'Products/Simple', null, true, 1)
                    }}
                    title={"Product"}
                    info={PageParameter1 && PageParameter2 ? TrimText(PageParameter2, 35) : null}
                /> : null}

                <ItemSeparator />

                <ItemSeparator style={{ height: 2 }} />

                <TranslatedText text='Filter1' style={{ fontWeight: 'bold', marginVertical: 10, paddingHorizontal: 20 }} />

                <ItemSeparator style={{ height: 2 }} />

                <ArrowItem
                    onPress={() => {
                        SelectEntity(this.props.navigation, item => {
                            this.setState({ Languages: item })
                        }, null, null, true, 2, Languages, { initialData: this.props.languages_data.map(item => ({ Id: item.key, Name: item.label })) })
                    }}
                    title={"Languages"}
                    info={Languages && Languages.length ? Languages.length : translate('All')}
                />

                <ItemSeparator />

                <ArrowItem
                    onPress={() => {
                        SelectCountry(this.props.navigation, item => {
                            this.setState({ Countries: item, Cities: null, Areas: null });
                        }, true, Countries);
                    }}
                    title={"Countries"}
                    info={Countries && Countries.length ? Countries.length : translate('All')}
                />

                <ItemSeparator />

                {Countries && Countries.length ? <ArrowItem
                    onPress={() => {
                        SelectCity(
                            this.props.navigation,
                            item => {
                                this.setState({ Cities: item, Areas: null });
                            }, Countries.map(item => item.Id), true, Cities ? Cities : []
                        );
                    }}
                    title={"Cities"}
                    info={Cities && Cities.length ? Cities.length : translate('All')}
                /> : null}

                {Cities && Cities.length ? <ArrowItem
                    onPress={() => {
                        SelectArea(
                            this.props.navigation,
                            item => {
                                this.setState({ Areas: item });
                            }, Cities.map(item => item.Id), true, Areas ? Areas : []
                        );
                    }}
                    title={"Areas"}
                    info={Areas && Areas.length ? Areas.length : translate('All')}
                /> : null}

                <ItemSeparator />

                <ArrowItem
                    onPress={() => {
                        SelectEntity(this.props.navigation, data => {
                            this.setState({ CustomerStatuses: data })
                        }, null, null, true, 2, CustomerStatuses, { initialData: allCustomerStatuses })
                    }}
                    title={"CustomerStatuses"}
                    info={CustomerStatuses.length ? CustomerStatuses.length : translate('All')}
                />

                <ItemSeparator />

                <ArrowItem
                    onPress={() => {
                        SelectEntity(this.props.navigation, data => {
                            this.setState({ CustomerTypes: data })
                        }, null, null, true, 2, CustomerTypes, { initialData: allCustomerTypes })
                    }}
                    title={"CustomerTypes"}
                    info={CustomerTypes && CustomerTypes.length ? CustomerTypes.length : translate('All')}
                />

                <ItemSeparator style={{ height: 2 }} />

                <TranslatedText text='Filter2' style={{ fontWeight: 'bold', marginVertical: 10, paddingHorizontal: 20 }} />

                <ItemSeparator style={{ height: 2 }} />

                <ArrowItem
                    onPress={() => {
                        SelectEntity(this.props.navigation, data => {
                            this.setState({ Products: data })
                        }, 'Products', null, true, 2, Products)
                    }}
                    title={"Products"}
                    info={Products && Products.length ? Products.length : translate('All')}
                />

                <ItemSeparator />

                <ArrowItem
                    onPress={() => {
                        SelectEntity(this.props.navigation, data => {
                            this.setState({ Customers: data })
                        }, 'Customers/Simple', null, true, 2, Customers)
                    }}
                    title={"Customers"}
                    info={Customers.length ? Customers.length : translate('All')}
                />

                <ItemSeparator />

                <ArrowItem
                    onPress={() => {
                        this.OrderRef.current.show()
                    }}
                    title={"Order"}
                    info={OrderFilter != null ? translate(Orders[OrderFilter].Name) : translate('All')}
                />

                <ItemSeparator />

                <ArrowItem
                    onPress={() => {
                        this.SourceRef.current.show()
                    }}
                    title={"Source"}
                    info={Source != null ? translate(Sources[Source].Name) : translate('All')}
                />

                <ItemSeparator />

                {this.editMode && <CustomButton
                    onPress={() => { this.sendNotificationTemplate() }}
                    style={{
                        marginHorizontal: largePagePadding,
                        marginVertical: pagePadding
                    }}
                    loading={this.state.sendNotificationLockSubmit}
                    title={"Send"}
                />}

                <CustomSelector
                    ref={this.LibraryOrCameraRef}
                    options={this.LibraryOrCameraOptions.map(item => item.Name)}
                    onSelect={(chosseindex) => {
                        this.AddEditImage(chosseindex)
                    }}
                    onDismiss={() => { }}
                />

            </ScrollView>
        )
    }

    render() {
        const { Pages } = this.state
        const { Orders, Sources } = this
        const { translate } = this.props

        return (
            <LazyContainer style={{ flex: 1 }} >

                <CustomHeader
                    navigation={this.props.navigation}
                    leftComponent={'back'}
                    title={"NotificationTemplate"}
                    rightNumOfItems={this.editMode ? 2 : 1}
                    rightComponent={
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}>
                            {this.editMode ?
                                <CustomTouchable
                                    onPress={() => {
                                        this.props.navigation.navigate('PushNotificationHistory', { Id: this.Id })
                                    }}
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        flex: 1,
                                    }}>
                                    <MaterialCommunityIcons
                                        name={`history`}
                                        size={22}
                                        color={'white'} />
                                </CustomTouchable> : null
                            }
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
                    }
                />

                {this.renderContent()}

                {Pages && <CustomSelector
                    ref={this.pagesRef}
                    options={Pages.map(item => item.Name)}
                    onSelect={(index) => {
                        if (Pages[index].Id != 2) {
                            this.setState({ Page: Pages[index].Id, PageParameter1: null, PageParameter2: null })
                        } else {
                            this.setState({ Page: Pages[index].Id })
                        }
                    }}
                    onDismiss={() => { }}
                />}


                {Orders && <CustomSelector
                    ref={this.OrderRef}
                    options={Orders.map(item => translate(item.Name))}
                    onSelect={(index) => { this.setState({ OrderFilter: Orders[index].Value }) }}
                    onDismiss={() => { }}
                />}


                {Sources && <CustomSelector
                    ref={this.SourceRef}
                    options={Sources.map(item => translate(item.Name))}
                    onSelect={(index) => { this.setState({ Source: Sources[index].Id }) }}
                    onDismiss={() => { }}
                />}

            </LazyContainer>
        )
    }
}
const mapStateToProps = ({
    language: {
        languages_data
    },
}) => ({
    languages_data,
});
export default connect(mapStateToProps)(withLocalize(PushNotifcation)) 
