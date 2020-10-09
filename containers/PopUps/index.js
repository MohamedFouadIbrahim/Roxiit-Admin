import React, { Component } from 'react'
import { View } from 'react-native'
import CustomHeader, { secondHeaderIconSize, } from '../../components/CustomHeader/index.js';
import LazyContainer from '../../components/LazyContainer'
import RemoteDataContainer from '../../components/RemoteDataContainer/index.js';
import ItemSeparator from '../../components/ItemSeparator/index.js';
import Ionicons from 'react-native-vector-icons/Ionicons'
import SearchBar from '../../components/SearchBar/index.js';
import { withLocalize } from 'react-localize-redux';
import CustomSelectorForDeleteAndEdit from '../../components/CustomSelectorForDeleteAndEdit/index';
import { LongToast } from '../../utils/Toast.js';
import CustomTouchable from '../../components/CustomTouchable';
import { isValidSearchKeyword } from '../../utils/Validation.js';
import PopUpItem from './popUpItem.js';
import { DeletePopup } from '../../services/PopUpsService.js';

class PopUps extends Component {
    constructor() {
        super()
        this.state = {
            data: null,
            triggerRefresh: false,
            searchingFor: '',
            showSearch: false,
            showCustomSelectorForDeleteref: false,
            Loading: false
        }
    }

    onPressItem = (item) => {
        const { Id } = item
        this.props.navigation.navigate('PopUp', {
            Id,
            onChildChange: this.onChildChange,
        })
    }

    onLongPressItem = (item) => {
        const { Id } = item
        this.DeleteOrEditId = Id
        this.setState({ showCustomSelectorForDeleteref: true })
    }

    renderItem = ({ item }) => {
        return (
            <PopUpItem
                item={item}
                onPress={this.onPressItem}
                onLongPress={this.onLongPressItem} />
        )
    }

    onChildChange = () => {
        this.setState({ triggerRefresh: !this.state.triggerRefresh })
    }

    addParamsSeparator = (params) => {
        return params.length ? '&' : ''
    }

    getRequestParams = () => {
        const {
            searchingFor,
        } = this.state

        let params = ''

        if (isValidSearchKeyword(searchingFor)) {
            params += `search=${searchingFor}`
        }
        return params
    }
    onPressClose = () => {
        if (this.state.searchingFor == '') {
            this.setState({ showSearch: !this.state.showSearch })
        } else {
            this.setState({ searchingFor: '' })
        }
    }

    renderSearch = () => {
        return (
            <SearchBar
                onPressClose={this.onPressClose}
                visible={this.state.showSearch}
                autoFocus={false}
                onSubmitEditing={(text) => {
                    this.setState({ searchingFor: text })
                }} />
        )
    }

    render() {
        const { translate } = this.props
        return (
            <LazyContainer style={{ flex: 1, backgroundColor: "#FFF" }}>
                <CustomHeader
                    leftComponent="drawer"
                    navigation={this.props.navigation}
                    title="PopUps"
                    rightNumOfItems={2}
                    rightComponent={
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}>
                            <CustomTouchable
                                onPress={() => {
                                    this.setState({ showSearch: !this.state.showSearch })
                                }}
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    flex: 1,
                                }}>
                                <Ionicons
                                    name={`ios-search`}
                                    size={24}
                                    color={'white'} />
                            </CustomTouchable>


                            <CustomTouchable
                                onPress={() => {
                                    this.props.navigation.navigate('PopUp', {
                                        onChildChange: this.onChildChange,
                                    })
                                }}
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    flex: 1,
                                }}>
                                <Ionicons
                                    name={`ios-add`}
                                    size={secondHeaderIconSize}
                                    color={'white'} />
                            </CustomTouchable>

                        </View>
                    } />

                {this.renderSearch()}


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
                        this.setState({ Loading: true, showCustomSelectorForDeleteref: false })
                        DeletePopup(this.DeleteOrEditId, () => {
                            this.setState({
                                data: this.state.data.filter(filterItem => filterItem.Id !== this.DeleteOrEditId),
                                showCustomSelectorForDeleteref: false,
                                Loading: false
                            })
                            LongToast('dataDeleted')
                        }, () => {
                            this.setState({ Loading: false })
                        })
                    }}
                />

                <RemoteDataContainer
                    url={"Popups"}
                    params={this.getRequestParams()}
                    cacheName={"popups"}
                    onDataFetched={(data) => {
                        this.setState({ data })
                    }}
                    updatedData={this.state.data}
                    triggerRefresh={this.state.triggerRefresh}
                    keyExtractor={({ Id }) => `${Id}`}
                    ItemSeparatorComponent={() => <ItemSeparator />}
                    renderItem={this.renderItem} />
            </LazyContainer>
        )
    }
}

export default withLocalize(PopUps)