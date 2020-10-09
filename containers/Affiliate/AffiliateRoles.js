import React, { Component } from 'react';
import { withLocalize } from 'react-localize-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import CustomHeader from '../../components/CustomHeader/index.js';
import CustomTouchable from '../../components/CustomTouchable';
import ItemSeparator from '../../components/ItemSeparator/index.js';
import LazyContainer from '../../components/LazyContainer';
import { LongToast } from '../../utils/Toast.js';
import { DeleteAffilateRole } from '../../services/AffiliateRolesServices';
import RemoteDataContainer from '../../components/RemoteDataContainer/index.js';
import AffiliateRoleItem from './AffiliateRoleItem';
import CustomSelectorForDeleteAndEdit from '../../components/CustomSelectorForDeleteAndEdit';

class AffiliateRoles extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            triggerRefresh: false,
            showCustomSelectorForDeleteref: false,
        }
    }

    onPressItem = (item) => {
        const { Id } = item
        this.props.navigation.navigate('AffiliateRoleScreen', {
            Id,
            onChildChange: this.onChildChange
        })
    }

    onLongPressItem = (item) => {
        const { Id } = item
        this.DeleteOrEditId = Id
        this.setState({ showCustomSelectorForDeleteref: true })
    }

    renderItem = ({ item }) => {
        const { Currency } = this.props;

        return (
            <AffiliateRoleItem
                item={item}
                currency={Currency.Name}
                onPress={this.onPressItem}
                onLongPress={this.onLongPressItem} />
        )
    }

    onChildChange = () => {
        this.setState({ triggerRefresh: !this.state.triggerRefresh })
    }

    render() {

        return (
            <LazyContainer style={{ flex: 1, backgroundColor: "#FFF" }}>
                <CustomHeader
                    navigation={this.props.navigation}
                    title={"AffiliateRoles"}
                    rightComponent={
                        <CustomTouchable
                            onPress={() => {
                                this.props.navigation.navigate('AffiliateRoleScreen', { onChildChange: this.onChildChange })
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
                    url={"AffiliateRoles"}
                    cacheName={"AffiliateRoles"}
                    triggerRefresh={this.state.triggerRefresh}
                    onDataFetched={(data) => {
                        this.setState({ data })
                    }}
                    updatedData={this.state.data}
                    keyExtractor={({ Id }) => `${Id}`}
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
                        DeleteAffilateRole(this.DeleteOrEditId, () => {
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
const mapStateToProps = ({
    login: {
        Currency,
    },
}) => ({
    Currency,
})
export default connect(mapStateToProps)(withLocalize(AffiliateRoles))