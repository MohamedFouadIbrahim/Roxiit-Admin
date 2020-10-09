import React, { Component } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomHeader from '../../components/CustomHeader/index.js';
import CustomTouchable from '../../components/CustomTouchable';
import ItemSeparator from '../../components/ItemSeparator/index.js';
import LazyContainer from '../../components/LazyContainer';
import { LongToast } from '../../utils/Toast.js';
import RemoteDataContainer from '../../components/RemoteDataContainer/index.js';
import StoreItem from './StoreItem';
import CustomSelectorForDeleteAndEdit from '../../components/CustomSelectorForDeleteAndEdit';
import SearchBar from '../../components/SearchBar/index.js';
import { isValidSearchKeyword } from '../../utils/Validation.js';
import { DeleteSubStore } from '../../services/SubStoresService';
import CustomSelector from '../../components/CustomSelector/index.js';
import { IsScreenPermitted } from '../../utils/Permissions'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { View } from 'react-native';
import { ExternalTranslate } from '../../utils/Translate.js';

class Stores extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: null,
            selectedID: null,
            triggerRefresh: false,
            showCustomSelectorForDeleteref: false,
        }

        if (IsScreenPermitted('SubStoreProfile')) {
            this.options = [
                {
                    Id: 0,
                    Name: ExternalTranslate('Profile')
                },
                {
                    Id: 1,
                    Name: ExternalTranslate('Users')
                },
                {
                    Id: 2,
                    Name: ExternalTranslate('Products')
                },
                {
                    Id: 3,
                    Name: ExternalTranslate('Customers')
                },
            ]
        }
        else {
            this.options = [
                {
                    Id: 1,
                    Name: ExternalTranslate('Users')
                },
                {
                    Id: 2,
                    Name: ExternalTranslate('Products')
                },
                {
                    Id: 3,
                    Name: ExternalTranslate('Customers')
                },
            ]
        }

        this.moreOption = [
            {
                Id: 0,
                Name: ExternalTranslate('SetTypeSettings')
            }
        ]


        this.optionsRef = React.createRef();
        this.typesRef = React.createRef();

    }

    getRequestParams = () => {
        let params = ''

        const { searchingFor } = this.state

        if (isValidSearchKeyword(searchingFor)) {
            params += `${this.addParamsSeparator(params)}search=${searchingFor}`
        }

        return params
    }

    addParamsSeparator = (params) => {
        return params.length ? '&' : ''
    }

    hidePopup = () => {
        this.setState({ isPopupVisible: false })
    }

    onChildChange = () => {
        this.setState({ triggerRefresh: !this.state.triggerRefresh })
    }

    onPressItem = (item) => {
        const { Id } = item
        this.DeleteOrEditId = Id
        this.optionsRef.current.show()
        this.hidePopup()
    }

    onLongPressItem = (item) => {
        const { Id } = item
        this.DeleteOrEditId = Id
        this.setState({ showCustomSelectorForDeleteref: true })
        this.hidePopup()
    }

    renderItem = ({ item }) => {

        return (
            <StoreItem
                item={item}
                onPress={this.onPressItem}
                onLongPress={this.onLongPressItem} />
        )
    }

    onSelectGenral = (index) => {

        if (index == 0 && IsScreenPermitted('SubStoreProfile')) {                         //Profile

            this.props.navigation.navigate('SubStoreProfile', {
                Id: this.DeleteOrEditId,
                onChildChange: this.onChildChange
            })

        } else if ((index == 0 && !IsScreenPermitted('SubStoreProfile')) ||                //Users
            (index == 1 && IsScreenPermitted('SubStoreProfile'))) {
            this.props.navigation.navigate('Users', { SubSToreId: this.DeleteOrEditId })
        }
        else if ((index == 1 && !IsScreenPermitted('SubStoreProfile')) ||                //Users
            (index == 2 && IsScreenPermitted('SubStoreProfile'))) {                                                                          //Products
            this.props.navigation.navigate('Products', { subStoreId: this.DeleteOrEditId })
        }
        else {
            this.props.navigation.navigate('Customers', { subStoreId: this.DeleteOrEditId })
        }
    }

    renderSearch = () => {
        return (
            <SearchBar
                visible={this.state.searchBarShown}
                onPressClose={() => {
                    this.setState({ searchBarShown: !this.state.searchBarShown })
                    this.hidePopup()
                }}
                onSubmitEditing={(text) => {
                    this.setState({ searchingFor: text })

                }} />
        )
    }

    render() {
        return (
            <LazyContainer style={{ flex: 1, backgroundColor: "#FFF" }}>
                <CustomHeader
                    navigation={this.props.navigation}
                    title={"Stores"}
                    rightNumOfItems={2}
                    rightComponent={
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center"
                            }}>
                            <CustomTouchable
                                onPress={() => {
                                    this.setState({ searchBarShown: !this.state.searchBarShown })
                                    this.hidePopup()
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
                                    this.typesRef.current.show()
                                    this.hidePopup()
                                }}
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    flex: 1,
                                }}>
                                <MaterialIcons
                                    name={`more-vert`}
                                    size={24}
                                    color={'white'} />
                            </CustomTouchable>
                        </View>
                    } />

                {this.renderSearch()}

                <RemoteDataContainer
                    url={"Tenant/SubStore/List"}
                    cacheName={"SubStore"}
                    triggerRefresh={this.state.triggerRefresh}
                    params={this.getRequestParams()}
                    onDataFetched={(data) => {
                        this.setState({ data })
                    }}
                    updatedData={this.state.data}
                    keyExtractor={({ Id }) => `${Id}`}
                    ItemSeparatorComponent={() => <ItemSeparator />}
                    renderItem={this.renderItem} />

                {this.options &&
                    <CustomSelector
                        ref={this.optionsRef}
                        options={this.options.map(item => item.Name)}
                        onSelect={(index) => { this.onSelectGenral(index) }}
                        onDismiss={() => { }}
                    />
                }

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
                        DeleteSubStore(this.DeleteOrEditId, () => {
                            this.setState({
                                data: this.state.data.filter(filterItem => filterItem.Id !== this.DeleteOrEditId),
                                showCustomSelectorForDeleteref: false,
                            })
                            LongToast('dataDeleted')
                        }, () => {
                        })
                    }}
                />

                {this.moreOption &&
                    <CustomSelector
                        ref={this.typesRef}
                        options={this.moreOption.map(item => item.Name)}
                        onSelect={(index) => {
                            if (index == 0) {  //SubStoreTypes
                                this.props.navigation.navigate('SubStoreTypes', {
                                    onChildChange: this.onChildChange
                                })
                            }
                        }}
                        onDismiss={() => { }}
                    />
                }

            </LazyContainer>
        )
    }
}

export default Stores