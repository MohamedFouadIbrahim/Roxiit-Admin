import React from 'react';
import { withLocalize } from 'react-localize-redux';
import { ScrollView, View } from 'react-native';
import { connect } from 'react-redux';
import ArrowItem from '../../components/ArrowItem';
import CustomSelector from '../../components/CustomSelector';
import ItemSeparator from '../../components/ItemSeparator';
// import TextEditorInput from '../../components/TextEditorInput';
import TranslatedText from '../../components/TranslatedText';
import { mainColor } from '../../constants/Colors';
import { SelectMultiLevel } from '../../utils/EntitySelector';
import HorizontalInput from '../../components/HorizontalInput';
import { GetAllCurrencies } from '../../services/ProductService';
import { smallBorderRadius, largePagePadding } from '../../constants/Style';
import FontedText from '../../components/FontedText';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomTouchable from '../../components/CustomTouchable';

class NewProductOptionalFiled extends React.Component {
    constructor() {
        super()

        this.state = ({
            AllCurrencies: []
        })
        this.typeSelectorRef = React.createRef();
        this.statusSelectorRef = React.createRef();
        this.visibilitySelectorRef = React.createRef();
        this.SubStoresRef = React.createRef();
        this.WarehousesRef = React.createRef();
        this.currencySelectorRef = React.createRef();
        this.tabIndex = 1
    }

    onChangeDecription = (content) => {
        this.props.onTabDataChange(this.tabIndex, {
            ...this.props.data,
            Description: content
        })
    }

    renderCurrency = () => {
        const { Currency } = this.props
        return (
            <CustomTouchable
                onPress={() => {
                    GetAllCurrencies(res => {
                        this.setState({
                            AllCurrencies: res.data.Data,
                        })
                        this.currencySelectorRef.current.show()
                    })
                }}
                style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingRight: 10,
                    paddingVertical: 8,
                    backgroundColor: mainColor,
                    borderRadius: smallBorderRadius,
                    marginHorizontal: largePagePadding,
                    maxWidth: 250
                }}>
                <FontedText style={{ color: 'white', fontSize: 10, textAlign: 'left', paddingLeft: 5 }}>{(Currency ? Currency.Name : "")}</FontedText>

                <Ionicons
                    name={"md-arrow-dropdown"}
                    size={18}
                    color={'white'}
                    style={{
                        marginLeft: 5,
                    }} />
            </CustomTouchable>)
    }
    renderContent = () => {
        const {
            Description,
            Type,
            visibility,
            status,
            Warehouses,
            selectedCategories,
            ProductTypes,
            ProductVisibility,
            ProductStatus,
            SubStore,
            Language,
            selectedOptions,
            ExtraPrice,
        } = this.props.data;

        const {
            StoreTypeId,
            SubStoreId
        } = this.props.hello_data

        const haveSelectedWareHouse = Warehouses.filter(item => item.IsSelected == true).length > 0 ? true : false

        return (
            <ScrollView
                style={{
                    backgroundColor: 'white'
                }}
            >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

                    <HorizontalInput
                        containerStyle={{ flex: 1 }}
                        label="ExtraPrice"
                        keyboardType="numeric"
                        value={ExtraPrice}
                        onChangeText={(value) => {
                            this.props.onTabDataChange(this.tabIndex, {
                                ...this.props.data,
                                ExtraPrice: value,
                            })
                        }} />
                    {this.renderCurrency()}
                </View>
                <ItemSeparator />

                <ArrowItem
                    onPress={() => {
                        this.typeSelectorRef.current.show()
                    }}
                    title={'Type'}
                    info={Type ? Type.Name : ProductTypes.find(item => item.Id == 1).Name} />

                <ItemSeparator />

                <ArrowItem
                    onPress={() => {
                        this.visibilitySelectorRef.current.show()
                    }}
                    title={'Visibility'}
                    info={visibility ? visibility.Name : ProductVisibility.find(item => item.Id == 1).Name} />

                <ItemSeparator />

                <ArrowItem
                    onPress={() => {
                        this.statusSelectorRef.current.show()
                    }}
                    title={'Status'}
                    info={status ? status.Name : ProductStatus.find(item => item.Id == 4).Name} />

                <ItemSeparator />

                <ArrowItem
                    onPress={() => {

                        this.props.navigation.navigate('NewProductWherehouses', {
                            Data: Warehouses,
                            onSelect: (allData) => {
                                this.props.onTabDataChange(this.tabIndex, {
                                    ...this.props.data,
                                    Warehouses: allData
                                })
                            }
                        })

                    }}
                    title={'Warehouse'}
                    info={haveSelectedWareHouse ? `(${Warehouses.filter(item => item.IsSelected == true).length}) selected` : 'All'}
                // info={Warehouses.length}
                />

                <ItemSeparator />

                <ArrowItem
                    onPress={() => {
                        SelectMultiLevel(this.props.navigation, selectedCategories => {
                            this.props.onTabDataChange(this.tabIndex, {
                                ...this.props.data,
                                selectedCategories
                            })
                        }, 'Categories', null, 2, selectedCategories, { canSelectParents: true })
                    }}
                    title={'Category'}
                    info={`(${selectedCategories.length}) selected`} />

                <ItemSeparator />

                {StoreTypeId == 3 && SubStoreId == null ? <View>
                    <ArrowItem
                        onPress={() => {
                            this.SubStoresRef.current.show()
                        }}
                        title={'SubStore'}
                        info={SubStore ? SubStore.Name : this.props.translate('NoneSelected')} />

                    <ItemSeparator />
                </View> : null}

                <ArrowItem
                    onPress={() => {
                        SelectMultiLevel(this.props.navigation, selectedOptions => {
                            this.props.onTabDataChange(this.tabIndex, {
                                ...this.props.data,
                                selectedOptions
                            })
                        }, 'ProductOption/Groups/Simple', 'ProductOptionGroup/Members/Simple', 2, selectedOptions, { canSelectParents: false })
                    }}
                    title={'Options'}
                    info={selectedOptions.length ? `${selectedOptions.length}` : null} />
            </ScrollView>)
    }
    render() {
        const { SubStores, Warehouses, ProductStatus, ProductTypes, ProductVisibility } = this.props.data
        const { AllCurrencies } = this.state
        return (
            <View style={{ flex: 1 }} >

                {this.renderContent()}

                {SubStores && <CustomSelector
                    ref={this.SubStoresRef}
                    options={SubStores.map(item => item.Name)}
                    onSelect={(index) => {
                        this.props.onTabDataChange(this.tabIndex, {
                            ...this.props.data,
                            SubStore: SubStores[index]
                        })
                    }}
                    onDismiss={() => { }}
                />}

                {Warehouses && <CustomSelector
                    ref={this.WarehousesRef}
                    options={Warehouses.map(item => item.Warehouse.Name)}
                    onSelect={(index) => {
                        this.props.onTabDataChange(this.tabIndex, {
                            ...this.props.data,
                            Warehouse: Warehouses[index].Warehouse
                        })
                    }}
                    onDismiss={() => { }}
                />}

                {ProductTypes && <CustomSelector
                    ref={this.typeSelectorRef}
                    options={ProductTypes.map(item => item.Name)}
                    onSelect={(index) => {
                        this.props.onTabDataChange(this.tabIndex, {
                            ...this.props.data,
                            Type: ProductTypes[index]
                        })
                    }}
                    onDismiss={() => { }}
                />}

                {ProductStatus && <CustomSelector
                    ref={this.statusSelectorRef}
                    options={ProductStatus.map(item => item.Name)}
                    onSelect={(index) => {
                        this.props.onTabDataChange(this.tabIndex, {
                            ...this.props.data,
                            status: ProductStatus[index]
                        })
                    }}
                    onDismiss={() => { }}
                />}

                {ProductVisibility && <CustomSelector
                    ref={this.visibilitySelectorRef}
                    options={ProductVisibility.map(item => item.Name)}
                    onSelect={(index) => {
                        this.props.onTabDataChange(this.tabIndex, {
                            ...this.props.data,
                            visibility: ProductVisibility[index]
                        })
                    }}
                    onDismiss={() => { }}
                />}


                {AllCurrencies && <CustomSelector
                    ref={this.currencySelectorRef}
                    options={AllCurrencies.map(item => item.Name)}
                    onSelect={(index) => {
                        this.props.onTabDataChange(null, {   //because the change affects all the tabs
                            Currency: AllCurrencies[index]
                        })
                    }}
                    onDismiss={() => { }}
                />}
            </View>
        )
    }
}

const mapStateToProps = ({
    login: {
        hello_data
    },
}) => ({
    hello_data,
})
export default connect(mapStateToProps)(withLocalize(NewProductOptionalFiled))