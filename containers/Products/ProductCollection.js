import React from 'react';
import { ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { EventRegister } from 'react-native-event-listeners';
import ArrowItem from '../../components/ArrowItem';
import CircularImage from '../../components/CircularImage';
import CustomSelector from '../../components/CustomSelector';
import ConfirmModal from '../../components/ConfirmModal';
import TranslatedText from '../../components/TranslatedText';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomTouchable from '../../components/CustomTouchable';
import FontedText from '../../components/FontedText';
import HorizontalInput from '../../components/HorizontalInput';
import ItemSeparator from '../../components/ItemSeparator';
import LazyContainer from '../../components/LazyContainer';
import RemoteDataContainer from '../../components/RemoteDataContainer';
import { largePagePadding } from '../../constants/Style';
import { secondTextColor } from '../../constants/Colors';
import { GetProductCollection, AddEditProductCollection, GetAllProducts, DeleteProductCollection } from '../../services/ProductService';
import { SelectEntity } from '../../utils/EntitySelector.js';
import { TrimText } from '../../utils/Text';
import { LongToast } from '../../utils/Toast';
import { withLocalize } from 'react-localize-redux';

class ProudctCollection extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            data: [],
            triggerRefresh: false,
            collectionId: null,
            ProductCollectionData: {
                Id: 0,
                ExpiryInDays: 0,
                MaxQtyPerDay: 1,
                QtyPerScan: 1,
                Qty: 1,
                Product: null,
                selectedProduct: null
            },
            dataFetched: false
        }
        this.Options = [{ Id: 1, Name: props.translate('Delete') }]
        this.DeleteRef = React.createRef()
        this.confirmRef = React.createRef()
        this.listener = EventRegister.addEventListener('currentPost', (currentPost) => {
            if (currentPost == '10') {
                this.submitProductCollection()
            }
        })

    }

    getProudct = () => {
        GetAllProducts(res => {
            this.setState({ ProductCollectionData: { ...this.state.ProductCollectionData, Products: res.data.Data }, dataFetched: true })
        })
    }
    componentDidMount() {
        this.getProudct()
    }
    componentWillUnmount() {
        EventRegister.emit('isOneProudctCollectionVisible', false)
        EventRegister.removeEventListener(this.listener)
    }
    submitProductCollection = () => {

        const {
            Id,
            ExpiryInDays,
            MaxQtyPerDay,
            QtyPerScan,
            Qty,
            Products,
            selectedProduct
        } = this.state.ProductCollectionData

        const { ProductId } = this.props

        if (!MaxQtyPerDay) {
            return LongToast('CantHaveEmptyInputs') // byDefault 1
        }

        if (!QtyPerScan) {
            return LongToast('CantHaveEmptyInputs') // byDefault 1
        }

        if (!Qty) {
            return LongToast('CantHaveEmptyInputs') // byDefault 1
        }

        EventRegister.emit('submitting', true)

        AddEditProductCollection({
            Id,
            ParentProductId: ProductId,
            ProductId: selectedProduct ? selectedProduct.Id : Products[0].Id,
            ExpiryInDays: ExpiryInDays ? ExpiryInDays : null,
            MaxQtyPerDay,
            QtyPerScan,
            Qty
        }, res => {
            this.setState({
                ProductCollectionData: {
                    ...this.state.ProductCollectionData,
                    Id: 0,
                    ExpiryInDays: 0,
                    MaxQtyPerDay: 1,
                    QtyPerScan: 1,
                    Qty: 1,
                    selectedProduct: null
                }
            })
            LongToast('dataSaved')
            this.onTriggerRefresh()
            EventRegister.emit('submitting', false)
            EventRegister.emit('isOneProudctCollectionVisible', false)
        }, err => {
            EventRegister.emit('submitting', false)
        })

    }
    addParamsSeparator = (params) => {
        return params.length ? '&' : ''
    }

    getRequestParams = () => {

        let params = ''

        const { ProductId } = this.props

        if (ProductId) {
            params += `${this.addParamsSeparator(params)}productId=${ProductId}`
        }

        return params
    }

    onTriggerRefresh = () => {
        this.setState({ triggerRefresh: !this.state.triggerRefresh })
    }

    renderAddEditProudctCollection = () => {
        const {
            ExpiryInDays,
            MaxQtyPerDay,
            QtyPerScan,
            Qty,
            Products
        } = this.state.ProductCollectionData
        if (!this.state.dataFetched) {
            return null
        }
        return (
            <ScrollView  >
                <CustomTouchable onPress={() => {
                    this.setState({
                        ProductCollectionData: {
                            ...this.state.ProductCollectionData,
                            Id: 0,
                            ExpiryInDays: 0,
                            MaxQtyPerDay: 1,
                            QtyPerScan: 1,
                            Qty: 1,
                            selectedProduct: null
                        },
                    }, () => { EventRegister.emit('isOneProudctCollectionVisible', false) })
                }} style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15 }}>
                    <Ionicons
                        style={{}}
                        name='ios-arrow-back'
                        size={16}
                        color={secondTextColor}
                    />
                    <TranslatedText style={{
                        color: secondTextColor,
                        paddingHorizontal: 10
                    }} text={'Collection'} />
                </CustomTouchable>
                <ArrowItem
                    onPress={() => {
                        SelectEntity(this.props.navigation, selectedProduct => {
                            this.setState({ ProductCollectionData: { ...this.state.ProductCollectionData, selectedProduct } })
                        }, 'Products', `exceptions=${this.props.ProductId}`, true, 1, [], { pagination: true })
                    }}
                    title={'Product'}
                    info={this.state.ProductCollectionData.selectedProduct ? TrimText(this.state.ProductCollectionData.selectedProduct.Name, 20) : TrimText(Products[0].Name, 20)} />

                <ItemSeparator />

                <HorizontalInput
                    keyboardType="numeric"
                    label="ExpiryInDays"
                    value={ExpiryInDays ? `${ExpiryInDays}` : null}
                    onChangeText={(ExpiryInDays) => {
                        this.setState({
                            ProductCollectionData: {
                                ...this.state.ProductCollectionData,
                                ExpiryInDays
                            }
                        })
                    }}
                />

                <ItemSeparator />

                <HorizontalInput
                    keyboardType="numeric"
                    label="MaxQtyPerDay"
                    value={MaxQtyPerDay ? `${MaxQtyPerDay}` : null}
                    onChangeText={(MaxQtyPerDay) => {
                        this.setState({
                            ProductCollectionData: {
                                ...this.state.ProductCollectionData,
                                MaxQtyPerDay
                            }
                        })
                    }}
                />

                <ItemSeparator />

                <HorizontalInput
                    keyboardType="numeric"
                    label="QtyPerScan"
                    value={QtyPerScan ? `${QtyPerScan}` : null}
                    onChangeText={(QtyPerScan) => {
                        this.setState({
                            ProductCollectionData: {
                                ...this.state.ProductCollectionData,
                                QtyPerScan
                            }
                        })
                    }}
                />

                <ItemSeparator />

                <HorizontalInput
                    keyboardType="numeric"
                    label="Qty"
                    value={Qty ? `${Qty}` : null}
                    onChangeText={(Qty) => {
                        this.setState({
                            ProductCollectionData: {
                                ...this.state.ProductCollectionData,
                                Qty
                            }
                        })
                    }}
                />

            </ScrollView>
        )
    }

    renderItem = ({ item, index }) => {

        const { Id, Product: { Icon: { ImageUrl }, Price, Name } } = item

        return (
            <CustomTouchable
                onLongPress={() => {
                    this.DeleteOrEditId = Id
                    this.DeleteRef.current.show()
                }}
                onPress={() => {
                    GetProductCollection(Id, res => {
                        this.setState({
                            ProductCollectionData: {
                                ...res.data,
                                Products: this.state.ProductCollectionData.Products,
                                ParentProductId: this.props.ProductId,
                                selectedProduct: this.state.ProductCollectionData.Products.find(item => item.Id == res.data.Product.Id)
                            }
                        },
                            () => { EventRegister.emit('isOneProudctCollectionVisible', true) })
                    })

                }}
                style={{
                    flexDirection: 'row',
                    flex: 1,
                    alignItems: 'center',
                    paddingVertical: 5,
                    paddingHorizontal: largePagePadding,
                }}
            >
                <FontedText
                    style={{ color: 'black', flex: 0.2 }}>
                    {`${Price + ' ' + (this.props.Currency ? this.props.Currency.Name : "")}`}
                </FontedText>

                <CircularImage
                    uri={ImageUrl}
                    style={{
                        marginHorizontal: 5,
                    }}
                />

                <FontedText
                    numberOfLines={2}
                    style={{ color: 'black', flex: 0.7, paddingHorizontal: 5 }}
                >
                    {Name}
                </FontedText>

            </CustomTouchable>
        )
    }

    render() {
        return (
            <LazyContainer style={{ flex: 1 }}>
                {
                    this.props.isOneProudctCollectionVisible ? this.renderAddEditProudctCollection() :

                        <RemoteDataContainer
                            url={"Collection/Index"}
                            params={this.getRequestParams()}
                            onDataFetched={(data) => {
                                this.setState({ data })
                            }}
                            updatedData={this.state.data}
                            triggerRefresh={this.state.triggerRefresh}
                            keyExtractor={({ Id }) => `${Id}`}
                            ItemSeparatorComponent={() => <ItemSeparator />}
                            renderItem={this.renderItem}
                        />
                }

                <CustomSelector
                    ref={this.DeleteRef}
                    options={this.Options.map(item => item.Name)}
                    onSelect={(index) => {
                        this.confirmRef.current.show()
                    }}
                    onDismiss={() => { }}
                />

                <ConfirmModal
                    ref={this.confirmRef}
                    onConfirm={() => {
                        DeleteProductCollection(this.DeleteOrEditId, res => {
                            LongToast('dataDeleted')
                            this.onTriggerRefresh()
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
        Currency,
    }
}) => ({
    Currency
})

export default connect(mapStateToProps)(withLocalize(ProudctCollection))