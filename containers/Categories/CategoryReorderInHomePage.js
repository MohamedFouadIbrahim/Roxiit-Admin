import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import RemoteDataContainer from '../../components/RemoteDataContainer';
import LazyContainer from '../../components/LazyContainer';
import CustomHeader, { secondHeaderIconSize } from '../../components/CustomHeader';
import ItemSeparator from '../../components/ItemSeparator';
import { largePagePadding, pagePadding } from '../../constants/Style';
import { secondTextColor } from '../../constants/Colors';
import FontedText from '../../components/FontedText';
import SearchBar from '../../components/SearchBar/index.js';
import CustomTouchable from '../../components/CustomTouchable';
import { isValidSearchKeyword } from '../../utils/Validation.js';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SelectEntity } from '../../utils/EntitySelector';
import { ReOrderCategoryInHomePage } from '../../services/CategoriesService';
import HeaderSubmitButton from '../../components/HeaderSubmitButton';

class CategoryReorder extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            triggerRefresh: false,
            data: [],
            searchBarShown: false,
            searchingFor: '',
            lockSubmit: false
        }

        this.lockSubmit = false
    }

    renderItem = ({ item, index, drag, isActive }) => {
        return (
            <TouchableOpacity style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: largePagePadding,
                paddingVertical: 5,
                backgroundColor: isActive ? '#cccccc' : 'white',
                alignItems: 'center'
            }}
                onLongPress={drag}
            >
                <FontedText>
                    {item.Name}
                </FontedText>

                <Ionicons
                    name={`ios-menu`}
                    size={28}
                    color={secondTextColor}
                />
            </TouchableOpacity>
        )
    }


    renderSearch = () => {
        return (
            <SearchBar
                visible={this.state.searchBarShown}
                onPressClose={() => { this.setState({ searchBarShown: !this.state.searchBarShown }) }}
                onSubmitEditing={(searchingFor) => {
                    this.setState({ searchingFor })
                }} />
        )
    }

    getParams = () => {
        let Params = ''

        if (isValidSearchKeyword(this.state.searchingFor)) {
            Params += `${this.addParamsSeparator(Params)}search=${this.state.searchingFor}`
        }

        return Params
    }

    addParamsSeparator = (params) => {
        return params.length ? '&' : ''
    }

    onDataReordered = (data) => {

        this.setState({ data })
        // ReorderArticles(data.map(item => item.Id))
    }
    submit = () => {
        if (this.lockSubmit) {
            return
        }

        this.lockSubmit = true
        this.setState({ lockSubmit: true })

        ReOrderCategoryInHomePage(this.state.data.length ? this.state.data.map(item => item.Id) : [], () => {
            this.lockSubmit = false
            this.setState({ lockSubmit: false })
            this.props.navigation.goBack()
        }, err => {
            this.lockSubmit = false
            this.setState({ lockSubmit: false })
        })
    }
    render() {
        return (
            <LazyContainer style={{ flex: 1 }} >

                <CustomHeader
                    title={'Category'}
                    navigation={this.props.navigation}
                    rightNumOfItems={3}
                    rightComponent={
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}>
                            <CustomTouchable
                                onPress={() => { this.setState({ searchBarShown: !this.state.searchBarShown }) }}
                                style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    // padding: headerButtonPadding,
                                }}>
                                <Ionicons
                                    name={`ios-search`}
                                    size={24}
                                    color={'white'} />
                            </CustomTouchable>
                            <CustomTouchable
                                onPress={() => {
                                    SelectEntity(this.props.navigation, item => {
                                        this.setState({ data: item })
                                    }, 'Categories/Simple', null, true, 2, this.state.data)
                                }}
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    // padding: headerButtonPadding,
                                    flex: 1,
                                }}>
                                <Ionicons
                                    name={`ios-add`}
                                    size={secondHeaderIconSize}
                                    color={'white'} />
                            </CustomTouchable>

                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    // padding: headerButtonPadding,
                                    flex: 1,
                                }}>
                                <HeaderSubmitButton onPress={this.submit} isLoading={this.state.lockSubmit} />
                            </View>
                        </View>
                    }
                />

                {this.renderSearch()}

                <RemoteDataContainer
                    url={"Category/ShowInHomePage/Order"}
                    triggerRefresh={this.state.triggerRefresh}
                    refreshControl={null}
                    onDataFetched={(data) => {
                        this.setState({ data })
                    }}
                    draggable={true}
                    onMoveEnd={({ data }) => { this.onDataReordered(data) }}
                    params={this.getParams()}
                    updatedData={this.state.data}
                    keyExtractor={({ Id }) => `${Id}`}
                    ItemSeparatorComponent={() => <ItemSeparator />}
                    renderItem={this.renderItem}
                />
            </LazyContainer>
        )
    }
}

export default CategoryReorder