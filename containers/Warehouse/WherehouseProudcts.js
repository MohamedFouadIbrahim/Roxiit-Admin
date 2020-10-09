import React from 'react'
import { View, TextInput, ScrollView } from 'react-native';
import LazyContainer from '../../components/LazyContainer';
import CustomHeader from '../../components/CustomHeader';
import HeaderSubmitButton from '../../components/HeaderSubmitButton';
import RemoteDataContainer from '../../components/RemoteDataContainer';
import CircularImage from '../../components/CircularImage';
import ItemSeparator from '../../components/ItemSeparator';
import FontedText from '../../components/FontedText';
import CheckBox from '../../components/CheckBox';
import { largePagePadding } from '../../constants/Style';
import { PostWhereHouseProducts } from '../../services/WarehousesService';
import { LongToast } from '../../utils/Toast';
import { withLocalize } from 'react-localize-redux';
import CustomTouchable from '../../components/CustomTouchable';

const imageSize = 45

class ProudctsInWherehouse extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            lockSubmit: false,
            triggerRefresh: false,
            Stock: 0,
            data: null,
        }

        this.lockSubmit = false

        if (this.props.route.params && this.props.route.params?.Id) {
            this.WherehouseId = this.props.route.params?.Id
        }

    }
    submit = () => {
        if (this.state.lockSubmit) {
            return
        }
        let vaildData = ''
        const NewData = this.state.data.map(item => {

            const obj = {
                IsSelected: item.IsSelected,
                Stock: item.Stock,
                productId: item.Product.Id
            }

            if (item.Stock < 0) {
                vaildData = 'LessThanZero'
            }
            return obj
        })
        if (vaildData) {
            return LongToast(vaildData)
        }

        this.setState({ lockSubmit: true })
        this.lockSubmit = true

        PostWhereHouseProducts(NewData, this.WherehouseId, res => {

            this.setState({ lockSubmit: false })
            this.lockSubmit = false
            LongToast('dataSaved')
            this.props.navigation.goBack()

        }, err => {

            this.setState({ lockSubmit: false })
            this.lockSubmit = false

        })
    }

    renderItem = ({ item, index }) => {

        const {
            IsSelected,
            Stock,
            Product: { Id, Name, Icon: { ImageUrl } },
        } = item

        return (
            <CustomTouchable
                style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: largePagePadding, marginVertical: 10 }}
                onPress={() => {

                    const NewData = this.state.data.map(ite => {
                        if (ite.Product.Id == Id) {
                            ite = { ...item, IsSelected: !ite.IsSelected }
                        }
                        return ite
                    })

                    this.setState({ data: NewData })
                }} >

                <View style={{ flexDirection: 'row', alignItems: 'center' }} >
                    <CircularImage
                        uri={ImageUrl}
                        size={imageSize}
                    />

                    <CheckBox
                        style={{ alignSelf: 'center', marginHorizontal: 10 }}
                        selected={IsSelected}
                    />
                </View>
                <FontedText style={{ color: 'black', alignSelf: 'center', textAlign: 'center' }} >{Name}</FontedText>
                <TextInput
                    onChangeText={tes => {
                        if (tes < 0) {
                            LongToast('LessThanZero')
                        }
                        const NewData = this.state.data.map(ite => {
                            if (ite.Product.Id == Id) {
                                ite = { ...item, Stock: tes }
                            }
                            return ite
                        })
                        this.setState({ data: NewData })
                    }}
                    keyboardType='numeric'
                    placeholder={this.props.translate('Qty')}
                    style={{
                        marginHorizontal: 10,
                        textAlign: 'center',
                    }}
                    multiline
                    clearTextOnFocus={Stock ? false : true}
                    value={`${Stock == null ? '' : Stock}`}
                />

            </CustomTouchable>

        )
    }

    addParamsSeparator = (params) => {
        return params.length ? '&' : ''
    }

    getRequestParams = () => {
        let params = ''
        if (this.WherehouseId) {
            params += `${this.addParamsSeparator(params)}warehouseId=${this.WherehouseId}`
        }
        return params
    }


    render() {
        return (
            <LazyContainer style={{ flex: 1, backgroundColor: 'white' }} >
                <CustomHeader
                    title='Products'
                    navigation={this.props.navigation}
                    rightComponent={
                        <HeaderSubmitButton
                            isLoading={this.state.lockSubmit}
                            onPress={() => {
                                this.submit()
                            }}
                        />
                    }
                />
                <ScrollView>
                    <RemoteDataContainer
                        params={this.getRequestParams()}
                        url={'Warehouse/Product'}
                        cacheName={"WarehouseProducts"}
                        pagination={false}
                        onDataFetched={(data) => {
                            this.setState({ data })

                        }}
                        updatedData={this.state.data}
                        triggerRefresh={this.state.triggerRefresh}
                        keyExtractor={({ Product: { Id } }) => `${Id}`}
                        ItemSeparatorComponent={() => <ItemSeparator />}
                        renderItem={this.renderItem} />

                </ScrollView>

            </LazyContainer>
        )
    }
}
export default withLocalize(ProudctsInWherehouse)