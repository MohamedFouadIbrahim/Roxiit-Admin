import React from 'react';
import LazyContainer from '../../components/LazyContainer';
import RemoteDataContainer from '../../components/RemoteDataContainer';
import UserListItem from './UserListItem';
import ItemSeparator from '../../components/ItemSeparator';
import CustomSelector from '../../components/CustomSelector';
import ConfirmModal from '../../components/ConfirmModal';
import { DeleteUserInbox } from '../../services/InboxService';
import { ExternalTranslate } from '../../utils/Translate';
import { LongToast } from '../../utils/Toast';
import { FAB, Portal, Provider } from 'react-native-paper';

export default class UserList extends React.Component {

    constructor(props) {
        super(props)

        this.moreVertRef = React.createRef();
        this.ConfirmRef = React.createRef();
        this.state = {
            triggerRefresh: false,
            isOpen: false
        }
    }



    onChildChange = () => {
        this.setState({ triggerRefresh: !this.state.triggerRefresh })
    }

    onPressItem = (item) => {
        const { User: { Id } } = item

        this.props.navigation.navigate('OrderChat', {
            fromUser: true,
            ToUser: Id,
            onChildChange: this.onChildChange,
            profileIcon: {
                Id,
                navigateTo: 'UserHome'
            }
        })

    }

    renderItem = ({ item, index }) => {
        return (
            <UserListItem
                onMoreVertPress={() => {
                    const { User: { Id } } = item
                    this.UserIdToDelete = Id
                    this.moreVertRef.current.show()
                }}
                onUserPress={() => { this.onPressItem(item) }}
                Item={item}
            />
        )
    }

    onStateChange = ({ open }) => {
        this.setState({ isOpen: open });
        if (open) {
            this.props.navigation.navigate('Users', {
                forceNavigateToUserChat: true,
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
                        url={"Users/Inbox"}
                        keyExtractor={({ User: { Id } }) => `${Id}`}
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
                            DeleteUserInbox(this.UserIdToDelete, res => {
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

