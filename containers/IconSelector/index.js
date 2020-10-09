import React, { Component } from 'react'
import { View, Dimensions } from 'react-native'
import CustomHeader from '../../components/CustomHeader/index.js';
import LazyContainer from '../../components/LazyContainer'
import { getIconsArray } from '../../utils/iconsList'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Entypo from 'react-native-vector-icons/Entypo'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Feather from 'react-native-vector-icons/Feather'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Foundation from 'react-native-vector-icons/Foundation'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Octicons from 'react-native-vector-icons/Octicons'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import Zocial from 'react-native-vector-icons/Zocial'
import Ionicons from 'react-native-vector-icons/Ionicons'
import SearchBar from '../../components/SearchBar/index.js';
import { RecyclerListView, DataProvider, LayoutProvider } from "recyclerlistview";
import CustomTouchable from '../../components/CustomTouchable';
export default class IconSelector extends Component {
    constructor(props) {
        super(props);
        this._dataProvider = new DataProvider((r1, r2) => {
            return r1 !== r2;
        });

        this._layoutProvider = new LayoutProvider(
            () => {
                return "p";
            },
            (type, dim) => {
                switch (type) {
                    case "p":
                        dim.width = (Dimensions.get('screen').width / 3) - 0.1;
                        dim.height = (Dimensions.get('screen').width / 3) - 0.1;
                        break;
                    default:
                        dim.width = 0;
                        dim.height = 0;
                }
            }
        );
        this.state = {
            iconsArray: getIconsArray(),
            dataProvider: this._dataProvider.cloneWithRows(getIconsArray()),
            searchBarShown: false,
            searchingFor: '',
            screenWidth: Dimensions.get('screen').width,
            screenHeight: Dimensions.get('screen').height
        }
    }
    componentDidMount() {
        var data = getIconsArray()
        this.setState({
            dataProvider: this.state.dataProvider.cloneWithRows(data)
        })

        //re render when change orientation
        Dimensions.addEventListener('change', () => {
            this.setState({
                screenWidth: Dimensions.get('screen').width,
                screenHeight: Dimensions.get('screen').height,
            })
        })

    }

    // componentWillMount() {
    //     var data = getIconsArray()
    //     this.setState({
    //         dataProvider: this.state.dataProvider.cloneWithRows(data)
    //     })
    // }

    onIconPress = (familyName, iconName) => {
        this.props.route.params?.callback(familyName, iconName)
        this.props.navigation.goBack()
    }
    _rowRenderer = (type, icon) => {
        const { familyName, iconName } = icon
        switch (familyName) {
            case 'Ionicons':
                return <CustomTouchable onPress={() => this.onIconPress(familyName, iconName)} style={{ flex: 1, borderColor: '#ECECEC', borderWidth: .5, paddingVertical: 20, justifyContent: 'center', alignItems: 'center' }}><Ionicons style={{}} size={30} name={iconName} /></CustomTouchable>
            case 'AntDesign':
                return <CustomTouchable onPress={() => this.onIconPress(familyName, iconName)} style={{ flex: 1, borderColor: '#ECECEC', borderWidth: .5, paddingVertical: 20, justifyContent: 'center', alignItems: 'center' }} ><AntDesign style={{}} size={30} name={iconName} /></CustomTouchable>
            case 'Entypo':
                return <CustomTouchable onPress={() => this.onIconPress(familyName, iconName)} style={{ flex: 1, borderColor: '#ECECEC', borderWidth: .5, paddingVertical: 20, justifyContent: 'center', alignItems: 'center' }} ><Entypo style={{}} size={30} name={iconName} /></CustomTouchable>
            case 'EvilIcons':
                return <CustomTouchable onPress={() => this.onIconPress(familyName, iconName)} style={{ flex: 1, borderColor: '#ECECEC', borderWidth: .5, paddingVertical: 20, justifyContent: 'center', alignItems: 'center' }} ><EvilIcons style={{}} size={30} name={iconName} /></CustomTouchable>
            case 'Feather':
                return <CustomTouchable onPress={() => this.onIconPress(familyName, iconName)} style={{ flex: 1, borderColor: '#ECECEC', borderWidth: .5, paddingVertical: 20, justifyContent: 'center', alignItems: 'center' }} ><Feather style={{}} size={30} name={iconName} /></CustomTouchable>
            case 'FontAwesome':
                return <CustomTouchable onPress={() => this.onIconPress(familyName, iconName)} style={{ flex: 1, borderColor: '#ECECEC', borderWidth: .5, paddingVertical: 20, justifyContent: 'center', alignItems: 'center' }} ><FontAwesome style={{}} size={30} name={iconName} /></CustomTouchable>
            case 'Foundation':
                return <CustomTouchable onPress={() => this.onIconPress(familyName, iconName)} style={{ flex: 1, borderColor: '#ECECEC', borderWidth: .5, paddingVertical: 20, justifyContent: 'center', alignItems: 'center' }} ><Foundation style={{}} size={30} name={iconName} /></CustomTouchable>
            case 'MaterialCommunityIcons':
                return <CustomTouchable onPress={() => this.onIconPress(familyName, iconName)} style={{ flex: 1, borderColor: '#ECECEC', borderWidth: .5, paddingVertical: 20, justifyContent: 'center', alignItems: 'center' }} ><MaterialCommunityIcons style={{}} size={30} name={iconName} /></CustomTouchable>
            case 'MaterialIcons':
                return <CustomTouchable onPress={() => this.onIconPress(familyName, iconName)} style={{ flex: 1, borderColor: '#ECECEC', borderWidth: .5, paddingVertical: 20, justifyContent: 'center', alignItems: 'center' }} ><MaterialIcons style={{}} size={30} name={iconName} /></CustomTouchable>
            case 'Octicons':
                return <CustomTouchable onPress={() => this.onIconPress(familyName, iconName)} style={{ flex: 1, borderColor: '#ECECEC', borderWidth: .5, paddingVertical: 20, justifyContent: 'center', alignItems: 'center' }} ><Octicons style={{}} size={30} name={iconName} /></CustomTouchable>
            case 'SimpleLineIcons':
                return <CustomTouchable onPress={() => this.onIconPress(familyName, iconName)} style={{ flex: 1, borderColor: '#ECECEC', borderWidth: .5, paddingVertical: 20, justifyContent: 'center', alignItems: 'center' }} ><SimpleLineIcons style={{}} size={30} name={iconName} /></CustomTouchable>
            case 'Zocial':
                return <CustomTouchable onPress={() => this.onIconPress(familyName, iconName)} style={{ flex: 1, borderColor: '#ECECEC', borderWidth: .5, paddingVertical: 20, justifyContent: 'center', alignItems: 'center' }} ><Zocial style={{}} size={30} name={iconName} /></CustomTouchable>

            default:
                return null
        }
    }
    renderSearch = () => {
        return (
            <SearchBar
                visible={this.state.searchBarShown}
                onPressClose={() => { this.setState({ searchBarShown: !this.state.searchBarShown }) }}
                onSubmitEditing={(target_keyword) => {
                    var iconsArray = getIconsArray();
                    var resArray = iconsArray.filter(item => item.iconName.includes(target_keyword))
                    this.setState({ dataProvider: this._dataProvider.cloneWithRows(resArray.length > 0 ? resArray : iconsArray) })
                }} />
        )
    }
    render() {
        return (
            <LazyContainer style={{ flex: 1, }}>
                <CustomHeader
                    navigation={this.props.navigation}
                    title="IconSelector"
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
                                    // padding: headerButtonPadding,
                                }}>
                                <Ionicons
                                    name={`ios-search`}
                                    size={24}
                                    color={'white'} />
                            </CustomTouchable>
                        </View>
                    } />
                {this.renderSearch()}

                <RecyclerListView
                    extendedState={this.state}
                    style={{ width: this.state.screenWidth, height: screenHeight }}
                    layoutProvider={this._layoutProvider}
                    dataProvider={this.state.dataProvider}
                    rowRenderer={this._rowRenderer} />

                {/* <FlatList
                        contentContainerStyle={{ paddingBottom: 150 }}
                        horizontal={false}
                        numColumns={3}
                        columnWrapperStyle={{ }}
                        data={this.state.iconsArray}
                        extraData={this.state}
                        keyExtractor={(item) => `${item.familyName}_${item.iconName}`}
                        renderItem={({ item }) => this.renderIcons(item)}
                    /> */}
            </LazyContainer>
        )
    }
}