import React, { Component } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomHeader from '../../components/CustomHeader/index.js';
import CustomTouchable from '../../components/CustomTouchable';
import ItemSeparator from '../../components/ItemSeparator/index.js';
import LazyContainer from '../../components/LazyContainer';
import { LongToast } from '../../utils/Toast.js';
import RemoteDataContainer from '../../components/RemoteDataContainer/index.js';
import SubStoreTypeItem from './SubStoreTypeItem.js';
import CustomSelector from '../../components/CustomSelector/index.js';
import { SetAsDefault, DeleteSubStoreType } from '../../services/SubStoreTypeServices.js';
import ConfirmModal from '../../components/ConfirmModal/index.js';
import { ExternalTranslate } from '../../utils/Translate.js';

class SubStoreTypes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            triggerRefresh: false,
            options: [
                {
                    Id: 0,
                    Name: ExternalTranslate('SetAsDefault')
                },
                {
                    Id: 1,
                    Name: ExternalTranslate('Delete')
                }
            ]
        }
        this.optionsRef = React.createRef();
        this.confirmRef = React.createRef();
    }


    setAsDefault = () => {
        this.cancelFetchDataeditSubStoreITyped = SetAsDefault(this.DeleteOrEditId, () => {
            this.onChildChange()
        }, (err) => {
        })
    }

    onPressItem = (item) => {
        const { Id } = item
        this.props.navigation.navigate('SubStoreType', {
            Id,
            onChildChange: this.onChildChange
        })
    }

    onLongPressItem = (item) => {
        const { Id } = item
        this.DeleteOrEditId = Id
        this.optionsRef.current.show()
    }

    renderItem = ({ item }) => {
        return (
            <SubStoreTypeItem
                item={item}
                onPress={this.onPressItem}
                onLongPress={this.onLongPressItem} />
        )
    }

    onChildChange = () => {
        this.setState({ triggerRefresh: !this.state.triggerRefresh })
    }

    render() {
        const { options } = this.state
        return (
            <LazyContainer style={{ flex: 1, backgroundColor: "#FFF" }}>
                <CustomHeader
                    navigation={this.props.navigation}
                    title={"SubStoreTypes"}
                    rightNumOfItems={1}
                    rightComponent={
                        <CustomTouchable
                            onPress={() => {
                                this.props.navigation.navigate('SubStoreType', { onChildChange: this.onChildChange })
                            }}
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                flex: 1,
                            }}>
                            <Ionicons
                                name={`ios-add`}
                                size={24}
                                color={'white'} />
                        </CustomTouchable>
                    } />

                <RemoteDataContainer
                    url={"SubStoreTypes"}
                    cacheName={"SubStoreTypes"}
                    triggerRefresh={this.state.triggerRefresh}
                    onDataFetched={(data) => {
                        this.setState({ data })
                    }}
                    updatedData={this.state.data}
                    keyExtractor={({ Id }) => `${Id}`}
                    ItemSeparatorComponent={() => <ItemSeparator />}
                    renderItem={this.renderItem} />

                {options &&
                    <CustomSelector
                        ref={this.optionsRef}
                        options={options.map(item => item.Name)}
                        onSelect={(index) => {
                            options[index].Id == 1 ?
                                this.confirmRef.current.show() :
                                this.setAsDefault()
                        }}
                        onDismiss={() => { }}
                    />
                }

                <ConfirmModal
                    ref={this.confirmRef}
                    onConfirm={() => {
                        DeleteSubStoreType(this.DeleteOrEditId, () => {
                            this.setState({
                                data: this.state.data.filter(filterItem => filterItem.Id !== this.DeleteOrEditId)
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

export default SubStoreTypes