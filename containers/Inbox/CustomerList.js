import React from 'react';
import LazyContainer from '../../components/LazyContainer';
import RemoteDataContainer from '../../components/RemoteDataContainer';
import CustomerItem from './CustomerItem';
import ItemSeparator from '../../components/ItemSeparator';
import CustomSelector from '../../components/CustomSelector';
import ConfirmModal from '../../components/ConfirmModal';
import { DeleteCustomerInbox } from '../../services/InboxService';
import { ExternalTranslate } from '../../utils/Translate';
import { LongToast } from '../../utils/Toast';
import { FAB, Portal, Provider } from 'react-native-paper';

export default class CustomerList extends React.Component {

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
        const { Customer: { Id }, } = item

        this.props.navigation.navigate('OrderChat', {
            orderId: null,
            CustomerId: Id,
            fromCustomer: true,
            onChildChange: this.onChildChange,
            profileIcon: {
                Id,
                navigateTo: 'Customer'
            }
        })

    }

    renderItem = ({ item, index }) => {
        return (
            <CustomerItem
                onMoreVertPress={() => {
                    const { Customer: { Id }, } = item
                    this.CustomerIdToDelete = Id
                    this.moreVertRef.current.show()
                }}
                onPressCustomerItem={() => { this.onPressItem(item) }}
                Item={item}
            />
        )
    }

    onStateChange = ({ open }) => {
        this.setState({ isOpen: open });
        if (open) {
            this.props.navigation.navigate('Customers', {
                forceNavigateToCustomerChat: true,
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
                        url={"Customers/Inbox"}
                        pagination={false}
                        keyExtractor={({ Customer: { Id } }) => `${Id}`}
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
                            DeleteCustomerInbox(this.CustomerIdToDelete, res => {
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

