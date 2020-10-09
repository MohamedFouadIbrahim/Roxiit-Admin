import React from 'react';
import { View } from 'react-native';
import { withLocalize } from 'react-localize-redux';
import CustomHeader, { secondHeaderIconSize } from '../../components/CustomHeader/index.js'
import RemoteDataContainer from '../../components/RemoteDataContainer/index';
import ItemSeparator from '../../components/ItemSeparator/index'
import FontedText from '../../components/FontedText/index'
import LazyContainer from '../../components/LazyContainer/index'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { largePagePadding, pagePadding } from '../../constants/Style.js';
import { secondColor } from '../../constants/Colors.js';
import TranslatedText from '../../components/TranslatedText/index';
import CustomSelector from '../../components/CustomSelector/index';
import ConfirmModal from '../../components/ConfirmModal/index';
import { DeleteAdress, SetDefaultAdress } from '../../services/CustomersService';
import { ShareSomeThing } from '../../utils/Share';
import { LongToast } from '../../utils/Toast.js';
import CustomTouchable from '../../components/CustomTouchable';
// import console = require('console');

class AdressIndex extends React.Component {
    constructor(props) {
        super(props)
        const { translate } = this.props
        this.TypeSelectorRef = React.createRef()
        this.OptionSelectorRef = React.createRef()
        this.confirmRef = React.createRef();
        if (this.props.route.params && this.props.route.params?.Id) {
            this.CustomerId = this.props.route.params?.Id
        }
        this.options = [
            { Id: 1, Name: translate('Delete') },
            { Id: 2, Name: translate('SetDefault') },
            { Id: 3, Name: translate('ShareAdress') }
        ]
    }
    state = {
        data: null,
        triggerRefresh: false,
        selectedOptions: [],
    }


    onLongPressItem = (item) => {
        const { Id } = item
        this.DeleteOrEditId = Id
        this.itemToShare = item
        this.OptionSelectorRef.current.show()
    }
    onTriggerRefresh = () => {
        this.setState({ triggerRefresh: !this.state.triggerRefresh })
    }

    renderItem = ({ item, index }) => {
        const { isDefault, FirstName, SecondName, City, Id, Address1 } = item
        return (
            <CustomTouchable
                onPress={() => {
                    this.props.navigation.navigate('CustomerAddress', {
                        CustomerId: this.CustomerId,
                        AdressID: Id,
                        onChiildChange: this.onTriggerRefresh
                    })
                }}
                onLongPress={() => {
                    this.onLongPressItem(item)
                }}
                style={{
                    backgroundColor: 'white',
                    flexDirection: 'row',
                    paddingHorizontal: largePagePadding,
                    paddingVertical: pagePadding,
                }}
            >
                <View style={{ width: '85%' }} >
                    <FontedText style={{ color: 'black' }}  >
                        {FirstName + ' ' + `${SecondName ? SecondName.slice(0, 35) : ''}, ${City.Name}`}
                    </FontedText>
                    <FontedText style={{ color: 'black', marginTop: 5 }}  >
                        {Address1}
                    </FontedText>
                </View>
                <View>
                    {isDefault === true ?
                        <View style={{ backgroundColor: secondColor, borderRadius: 4, marginTop: 5, justifyContent: 'center' }}>
                            <TranslatedText style={{ fontSize: 12, color: "white", textAlign: 'center', paddingVertical: 4, paddingHorizontal: 6 }} text="Default" />
                        </View> : null
                    }
                </View>
            </CustomTouchable>
        )
    }
    OnSetDefault = () => {
        SetDefaultAdress(this.DeleteOrEditId, (res) => {
            LongToast('AddressHasBeenSet')
            this.onTriggerRefresh()
        })
    }
    onShare = () => {
        const { FullAddress } = this.itemToShare
        ShareSomeThing(FullAddress, FullAddress)
    }
    render() {
        const { translate } = this.props
        return (
            <LazyContainer style={{ flex: 1, backgroundColor: "#FFF" }} >
                <CustomHeader
                    leftComponent="back"
                    navigation={this.props.navigation}
                    title="Adress"
                    rightComponent={
                        <CustomTouchable
                            onPress={() => {
                                this.props.navigation.navigate('CustomerAddress', {
                                    CustomerId: this.CustomerId,
                                    onChiildChange: this.onTriggerRefresh
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
                    } />
                <RemoteDataContainer
                    pagination={false}
                    url={'Address/ListFD'}
                    cacheName={"Address"}
                    params={`customerId=${this.CustomerId}`}
                    onDataFetched={(data) => {
                        this.setState({ data })
                    }}
                    updatedData={this.state.data}
                    keyExtractor={({ Id }) => `${Id}`}
                    ItemSeparatorComponent={() => { return <ItemSeparator /> }}
                    renderItem={this.renderItem}
                    triggerRefresh={this.state.triggerRefresh}
                />

                <CustomSelector
                    ref={this.OptionSelectorRef}
                    options={this.options.map(item => item.Name)}
                    onSelect={(index) => {
                        if (index == 0) {
                            this.confirmRef.current.show();
                        } else if (index == 1) {
                            this.OnSetDefault()
                        } else if (index == 2) {
                            this.onShare()
                        }
                    }}
                    onDismiss={this.props.onCancelDelete}
                />
                <ConfirmModal
                    ref={this.confirmRef}
                    onConfirm={() => {
                        DeleteAdress(this.DeleteOrEditId, res => {
                            LongToast('dataDeleted')
                            this.onTriggerRefresh()
                        })
                    }}
                    onResponse={(check) => {

                    }}
                />

            </LazyContainer>
        );
    }
}
export default withLocalize(AdressIndex)