import React from 'react';
import { View } from 'react-native';
import LazyContainer from '../../components/LazyContainer';
import RemoteDataContainer from '../../components/RemoteDataContainer';
import CustomHeader, { secondHeaderIconSize } from '../../components/CustomHeader';
import SearchBar from '../../components/SearchBar';
import ItemSeparator from '../../components/ItemSeparator';
import CustomTouchable from '../../components/CustomTouchable';
import FontedText from '../../components/FontedText';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomSelectorForDeleteAndEdit from '../../components/CustomSelectorForDeleteAndEdit';
import { mainTextColor } from '../../constants/Colors';
import { TrimText } from '../../utils/Text';
import { pagePadding, largePagePadding } from '../../constants/Style';
import { formatDate, formatTime } from '../../utils/Date';
import { DeleteNotificationTemplate } from '../../services/PushNotifcationService';
import { LongToast } from '../../utils/Toast';
import { isValidSearchKeyword } from '../../utils/Validation';

class PushNotification extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            data: [],
            searchingFor: null,
            searchBarShown: false,
            triggerRefresh: false,
            showDeleteSelector: false
        }
    }

    onItemPress = (Id) => {
        this.props.navigation.navigate('PushNotification', {
            Id,
            onChildChange: this.onChildChange
        })
    }

    onItemLongPress = (Id) => {
        this.templateId = Id
        this.setState({ showDeleteSelector: true })
    }

    renderItem = ({ item }) => {
        const {
            Id,
            Name,
            Title,
            LastTimeSent,
            LastTimeSentQty
        } = item

        return (
            <CustomTouchable
                style={{
                    flex: 1,
                    paddingVertical: largePagePadding - 5,
                    paddingHorizontal: largePagePadding
                }}
                onPress={() => { this.onItemPress(Id) }}
                onLongPress={() => { this.onItemLongPress(Id) }}
            >

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: pagePadding }} >

                    <FontedText style={{ color: mainTextColor }}>{`${TrimText(Name, 22)}`}</FontedText>

                    <View style={{ flexDirection: 'row', justifyContent: 'center' }} >
                        {LastTimeSent && <FontedText style={{ color: mainTextColor }}>{`${formatDate(LastTimeSent)} `}</FontedText>}
                        {LastTimeSent && <FontedText style={{ color: mainTextColor }}>{` ${formatTime(LastTimeSent)}`}</FontedText>}
                    </View>

                </View>

                <FontedText style={{ color: mainTextColor, alignSelf: 'center', marginTop: pagePadding + 5, fontWeight: 'bold' }}>{`${TrimText(Title, 20)}`}</FontedText>

            </CustomTouchable>
        )
    }

    addParamsSeparator = (params) => {
        return params.length ? '&' : ''
    }

    getRequestParams = () => {
        let params = ''
        const { searchingFor } = this.state

        if (isValidSearchKeyword(searchingFor)) {
            params += `${this.addParamsSeparator(params)}search=${searchingFor}`
        }

        return params
    }

    onChildChange = () => {
        this.setState({ triggerRefresh: !this.state.triggerRefresh })
    }

    renderSearch = () => {
        return (
            <SearchBar
                visible={this.state.searchBarShown}
                onPressClose={() => { this.setState({ searchBarShown: !this.state.searchBarShown }) }}
                onSubmitEditing={(text) => { this.setState({ searchingFor: text }) }} />
        )
    }

    render() {

        const { showDeleteSelector } = this.state

        return (
            <LazyContainer style={{ flex: 1 }} >
                <CustomHeader
                    navigation={this.props.navigation}
                    leftComponent={'back'}
                    rightNumOfItems={2}
                    title={"NotificationTemplate"}
                    rightComponent={
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}>
                            <CustomTouchable
                                onPress={() => { this.setState({ searchBarShown: !this.state.searchBarShown }) }}
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
                                    this.props.navigation.navigate('PushNotification', {
                                        onChildChange: this.onChildChange
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
                    }
                />

                {this.renderSearch()}

                <RemoteDataContainer
                    url={"NsMng/Template"}
                    params={this.getRequestParams()}
                    onDataFetched={(data) => {
                        this.setState({ data })
                    }}
                    updatedData={this.state.data}
                    triggerRefresh={this.state.triggerRefresh}
                    keyExtractor={({ Id }) => `${Id}`}
                    ItemSeparatorComponent={() => <ItemSeparator />}
                    renderItem={this.renderItem} />

                <CustomSelectorForDeleteAndEdit
                    showCustomSelectorForDeleteref={showDeleteSelector}
                    justForDelete={true}
                    onCancelDelete={() => {
                        this.setState({ showDeleteSelector: false })
                    }}
                    onCancelConfirm={() => {
                        this.setState({ showDeleteSelector: false })
                    }}
                    onDelete={() => {
                        this.setState({ showDeleteSelector: false })
                        DeleteNotificationTemplate(this.templateId, res => {
                            LongToast('dataDeleted')
                            this.setState({
                                data: this.state.data.filter(filterItem => filterItem.Id !== this.templateId),
                                showDeleteSelector: false,
                                triggerRefresh: !this.state.triggerRefresh
                            })
                        })
                    }}
                />

            </LazyContainer>
        )
    }
}
export default PushNotification
