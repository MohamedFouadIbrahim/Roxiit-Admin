import React from 'react';
import { View } from 'react-native';
import CustomHeader from '../../components/CustomHeader';
import ItemSeparator from '../../components/ItemSeparator/index.js';
import LazyContainer from '../../components/LazyContainer';
import RemoteDataContainer from '../../components/RemoteDataContainer';
import Ionicons from 'react-native-vector-icons/Ionicons'
import CustomTouchable from '../../components/CustomTouchable';
import OrderStatusItem from './OrderStatusItem';
import { ReorderStatus, DeleteOrderStatus } from '../../services/OrderStatusService';
import CustomSelectorForDeleteAndEdit from '../../components/CustomSelectorForDeleteAndEdit';
import { LongToast } from '../../utils/Toast';

class ordersstatus extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            data: null,
            triggerRefresh: false,
            showCustomSelectorForDeleteref: false,
        }
    }


    onChildChange = () => {
        this.setState({ triggerRefresh: !this.state.triggerRefresh })
    }

    onDataReordered = (data) => {
        this.cancelFetchReorderStatus = ReorderStatus(data.length ? data.map(item => item.Id) : [])
    }

    componentWillUnmount() {
        this.cancelFetchReorderStatus && this.cancelFetchReorderStatus()
    }


    onPressItem = (item) => {
        const { Id } = item
        this.props.navigation.navigate('OrderStatus', {
            Id,
            onChildChange: this.onChildChange
        })
    }

    onLongPressItem = (item) => {
        const { Id, CanBeModified } = item
        this.DeleteOrEditId = Id
        this.CanBeModified = CanBeModified
        this.setState({ showCustomSelectorForDeleteref: true })
    }


    renderItem = ({ item, index, drag, isActive }) => {
        return (
            <OrderStatusItem
                item={item}
                onPress={this.onPressItem}
                onLongPress={this.onLongPressItem}
                onDrag={drag}
            />
        )
    }

    render() {
        return (
            <LazyContainer
                style={{ flex: 1 }}
            >

                <CustomHeader
                    title='OrdersStatuses'
                    navigation={this.props.navigation}
                    leftComponent={'drawer'}
                    rightNumOfItems={1}
                    rightComponent={
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center"
                            }}>

                            <CustomTouchable
                                onPress={() => {
                                    this.props.navigation.navigate('OrderStatus', {
                                        onChildChange: this.onChildChange
                                    })
                                }}
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    flex: 1
                                }}>
                                <Ionicons
                                    name={`ios-add`}
                                    size={24}
                                    color={'white'} />
                            </CustomTouchable>


                        </View>
                    }
                />

                <RemoteDataContainer
                    url={"Order/StatusList"}
                    cacheName={"ordersStatus"}
                    onDataFetched={(data) => {
                        this.setState({ data })
                    }}
                    draggable={true}
                    onMoveEnd={({ data }) => { this.onDataReordered(data) }}
                    updatedData={this.state.data}
                    triggerRefresh={this.state.triggerRefresh}
                    keyExtractor={(item, index) => `${index}`}
                    ItemSeparatorComponent={() => <ItemSeparator />}
                    renderItem={this.renderItem} />

                <CustomSelectorForDeleteAndEdit
                    showCustomSelectorForDeleteref={this.state.showCustomSelectorForDeleteref}
                    justForDelete={true}
                    onCancelDelete={() => {
                        this.setState({ showCustomSelectorForDeleteref: false })
                    }}
                    onCancelConfirm={() => {
                        this.setState({ showCustomSelectorForDeleteref: false })
                    }}
                    onDelete={() => {
                        this.setState({ showCustomSelectorForDeleteref: false })
                        if (!this.CanBeModified) {
                            return LongToast('CantBeDeleted')
                        }
                        DeleteOrderStatus(this.DeleteOrEditId, () => {
                            this.setState({
                                data: this.state.data.filter(filterItem => filterItem.Id !== this.DeleteOrEditId),
                                showCustomSelectorForDeleteref: false,
                            })
                            LongToast('dataDeleted')
                        }, () => {
                        })
                    }}
                />
            </LazyContainer>
        )
    }
}


export default ordersstatus