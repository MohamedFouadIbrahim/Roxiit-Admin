import React from 'react';
import LazyContainer from '../../components/LazyContainer';
import RemoteDataContainer from '../../components/RemoteDataContainer';
import CustomSelector from '../../components/CustomSelector';
import ConfirmModal from '../../components/ConfirmModal';
import OrderListItem from './OrderListItem';
import ItemSeparator from '../../components/ItemSeparator';
import { DeleteOrderInbox } from '../../services/InboxService';
import { ExternalTranslate } from '../../utils/Translate';
import { LongToast } from '../../utils/Toast';
import { FAB, Portal, Provider } from 'react-native-paper';

export default class OrderList extends React.Component {

    constructor(props) {
        super(props)

        this.moreVertRef = React.createRef();
        this.ConfirmRef = React.createRef();

    }

    state = {
        triggerRefresh: false,
        isOpen: false
    }

    onChildChange = () => {
        this.setState({ triggerRefresh: !this.state.triggerRefresh })
    }

    onPressItem = (item) => {

        const { Order: { Id }, CustomerId, } = item

        this.props.navigation.navigate('OrderChat', {
            orderId: Id,
            onChildChange: this.onChildChange,
            CustomerId: CustomerId,
            fromCustomer: false,
            profileIcon: {
                Id,
                navigateTo: 'Order'
            }
        })

    }

    renderItem = ({ item, index }) => {
        return (
            <OrderListItem
                onMoreVertPress={() => {
                    const { Order: { Id } } = item
                    this.orderIdToDelete = Id
                    this.moreVertRef.current.show()
                }}
                onOrderPress={() => { this.onPressItem(item) }}
                Item={item}
            />
        )
    }
    onStateChange = ({ open }) => {
        this.setState({ isOpen: open });
        if (open) {
            this.props.navigation.navigate('Orders', {
                forceNavigateToOrderChat: true,
                onChildChange: this.onChildChange,
            })
            this.setState({ isOpen: false });
        }
    }

    render() {
        const { isOpen } = this.state
        return (
            <LazyContainer style={{ flex: 1, backgroundColor: 'white' }} >
                <Provider>
                    <Portal>
                        <FAB.Group
                            fabStyle={{
                                backgroundColor: 'white',
                            }}
                            open={isOpen}
                            icon={isOpen ? 'calendar-today' : 'plus'}
                            actions={[]}
                            onStateChange={this.onStateChange}
                        />
                    </Portal>

                    <RemoteDataContainer
                        onDataFetched={(data) => {
                            this.setState({ data })
                        }}
                        updatedData={this.state.data}
                        triggerRefresh={this.state.triggerRefresh}
                        ItemSeparatorComponent={() => <ItemSeparator />}
                        url={"Orders/Inbox"}
                        pagination={false}
                        keyExtractor={({ Order: { Id } }) => `${Id}`}
                        renderItem={this.renderItem}
                    />

                    <CustomSelector
                        ref={this.moreVertRef}
                        options={[ExternalTranslate('Delete')]}
                        onSelect={(index) => { this.ConfirmRef.current.show() }}
                        onDismiss={() => { }}
                    />

                    <ConfirmModal
                        ref={this.ConfirmRef}
                        onConfirm={() => {
                            DeleteOrderInbox(this.orderIdToDelete, res => {
                                LongToast('dataDeleted')
                                this.onChildChange()
                            })
                        }}
                        onResponse={(check) => { }}
                    />
                </Provider>
            </LazyContainer>
        )
    }
}
