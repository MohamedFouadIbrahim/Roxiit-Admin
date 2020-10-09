import React from 'react';
import { View } from 'react-native';
import CustomHeader, { secondHeaderIconSize } from '../../components/CustomHeader/index';
import LazyContainer from '../../components/LazyContainer';
import Ionicons from 'react-native-vector-icons/Ionicons'
import RemoteDataContainer from '../../components/RemoteDataContainer/index';
import FontedText from '../../components/FontedText/index';
import { largePagePadding, pagePadding } from '../../constants/Style.js';
import { DeleteAdvancedSetting } from '../../services/CourierServices';
import ItemSeparator from '../../components/ItemSeparator';
import { withLocalize } from 'react-localize-redux';
import CustomSelectorForDeleteAndEdit from '../../components/CustomSelectorForDeleteAndEdit/index';
import { LongToast } from '../../utils/Toast';
import { secondTextColor } from '../../constants/Colors';
import CustomTouchable from '../../components/CustomTouchable';

class AdvanceSettings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Data: null,
            triggerRefresh: false,
            showCustomSelectorForDeleteref: false,
            Loading: false
        };
    }

    addParamsSeparator = (params) => {
        return params.length ? '&' : ''
    }
    onChildChange = () => {
        this.setState({ triggerRefresh: !this.state.triggerRefresh })
    }
    getRequestParams = () => {
        let params = ''
        const id = this.props.route.params?.Id
        if (id) {
            params += `${this.addParamsSeparator(params)}courierId=${id}`
        }
        return params
    }
    renderItem = ({ item, index }) => {
		const { Name, Id } = item;
		
        return (<CustomTouchable

            onPress={() => {
                this.props.navigation.navigate('AdvanceSettingsTab', {
                    Id: this.props.route.params?.Id,
                    AdvancedSettingId: item.Id,
                    onChildChange: this.onChildChange
                })
            }}
            onLongPress={() => {
                this.DeleteOrEditId = Id
                this.setState({ showCustomSelectorForDeleteref: true })
            }}
        >
            <View
                style={{
                    backgroundColor: 'white',
                    flexDirection: 'row',
                    // paddingHorizontal: largePagePadding,
                    paddingVertical: pagePadding,
                }}>
                <View
                    style={{
                        flex: 1,
                        paddingLeft: largePagePadding,
                    }}>
                    <FontedText style={{ color: 'black' }}>{Name}</FontedText>
                </View>
            </View>
        </CustomTouchable>
        )
    }
    render() {
        const { translate } = this.props
        return (
            <LazyContainer style={{ flex: 1 }} >
                <CustomHeader
                    navigation={this.props.navigation}
                    title="Advance_Settings"
                    rightComponent={
                        <CustomTouchable
                            onPress={() => {
                                this.props.navigation.navigate('AdvanceSettingsTab', {
                                    Id: this.props.route.params?.Id,
                                    onChildChange: this.onChildChange
                                })
                            }}
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                flex: 1,
                                // padding: headerButtonPadding,
                                // marginLeft: 10,
                            }}>
                            <Ionicons
                                name={`ios-add`}
                                size={secondHeaderIconSize}
                                color={'white'} />
                        </CustomTouchable>
                    }
                />

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
                        DeleteAdvancedSetting(this.DeleteOrEditId, () => {
                            this.setState({
                                Data: this.state.Data.filter(filterItem => filterItem.Id !== this.DeleteOrEditId),
                                showCustomSelectorForDeleteref: false,
                                Loading: false
                            })
                            LongToast('dataDeleted')
                        }, err => {
                            this.setState({ Loading: false })
                            alert(err)
                        })
                    }}
                />
                <RemoteDataContainer
                    url={'Courier/AdvancedSettings/List'}
                    pagination={false}
                    onDataFetched={(Data) => {
                        this.setState({ Data })
                    }}
                    updatedData={this.state.Data}
                    triggerRefresh={this.state.triggerRefresh}
                    params={this.getRequestParams()}
                    keyExtractor={({ Id }) => `${Id}`}
                    ItemSeparatorComponent={() => <ItemSeparator />}
                    renderItem={this.renderItem} />
            </LazyContainer>
        );
    }
}
export default withLocalize(AdvanceSettings)
