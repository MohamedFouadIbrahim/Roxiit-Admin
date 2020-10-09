import React from 'react';
import { View } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import LazyContainer from '../../components/LazyContainer';
import CustomTouchable from '../../components/CustomTouchable';
import FontedText from '../../components/FontedText';
import CheckBox from '../../components/CheckBox';
import RemoteDataContainer from '../../components/RemoteDataContainer';
import CustomHeader from '../../components/CustomHeader';
import ItemSeparator from '../../components/ItemSeparator';
import { largePagePadding, pagePadding } from '../../constants/Style';
import { mainTextColor } from '../../constants/Colors';
import { GetSelectedCountries, AddSelectedCountries } from '../../services/ManagePlaces';
import HeaderSubmitButton from '../../components/HeaderSubmitButton';
import { LongToast } from '../../utils/Toast';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

class ManageCountry extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            data: [],
            SelectedCountries: [],
            triggerRefresh: false,
            lockSubmit: false,
            isAllSelected: false
        }
        this.lockSubmit = false

    }

    componentDidMount() {
        GetSelectedCountries(res => {
            this.setState({
                SelectedCountries: res.data.Data
            })
        })
    }

    submit = () => {

        if (this.lockSubmit) {
            return
        }

        const { data } = this.state
        const selectedIds = data.filter(item => item.isSelected == true).map(item => item.Id)

        if (!selectedIds || !selectedIds.length) {
            return LongToast('YouMustSelectCountry')
        }

        this.setState({ lockSubmit: true })
        this.lockSubmit = true

        AddSelectedCountries(selectedIds, res => {
            this.setState({ lockSubmit: false });
            this.lockSubmit = false;
            this.props.navigation.dispatch(CommonActions.goBack())
            LongToast('dataSaved')
        }, err => {
            this.setState({ lockSubmit: false });
            this.lockSubmit = false;
        })

    }

    onItemPress = (index) => {
        const { data } = this.state
        let copy = [...data]
        copy[index].isSelected = !copy[index].isSelected
        this.setState({ copy: data })
    }
    renderItem = ({ item, index }) => {

        const {
            Name,
            isSelected,
        } = item

        return (
            <CustomTouchable
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: largePagePadding,
                    paddingVertical: pagePadding
                }}
                onPress={() => {
                    this.onItemPress(index)
                }}
            >
                <FontedText style={{ color: mainTextColor }}>{Name}</FontedText>

                <CheckBox
                    style={{
                    }}
                    selected={isSelected} />
            </CustomTouchable>
        )
    }

    render() {
        return (
            <LazyContainer style={{ flex: 1 }} >

                <CustomHeader
                    title='Countries'
                    navigation={this.props.navigation}
                    rightNumOfItems={2}
                    rightComponent={
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}>

                            <CustomTouchable
                                onPress={() => {

                                    const { data } = this.state

                                    if (data.length) {
                                        this.setState({ isAllSelected: !this.state.isAllSelected, data: this.state.data.map(item => ({ ...item, isSelected: !this.state.isAllSelected })) })
                                    }

                                }}
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    flex: 1,
                                }}>
                                <MaterialCommunityIcons
                                    name={this.state.isAllSelected ? "checkbox-multiple-marked-circle" : "checkbox-multiple-marked-circle-outline"}
                                    size={18}
                                    color={'white'} />
                            </CustomTouchable>

                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                flex: 1,
                            }}>
                                <HeaderSubmitButton
                                    isLoading={this.state.lockSubmit}
                                    onPress={this.submit} />
                            </View>

                        </View>

                    }
                />

                <RemoteDataContainer
                    url={"Countries"}
                    onDataFetched={(data) => {
                        const { SelectedCountries } = this.state;
                        if (!SelectedCountries.length) {
                            const Countries = data.map(item => ({ ...item, isSelected: false }))
                            this.setState({ data: Countries })
                        } else {
                            const selectedCountries = data.filter(item => SelectedCountries.includes(item.Id)).map(item => ({ ...item, isSelected: true }))
                            const unSelectedCountries = data.filter(item => !SelectedCountries.includes(item.Id)).map(item => ({ ...item, isSelected: false }))
                            const isAllDataSelected = [...selectedCountries, ...unSelectedCountries].every(item => item.isSelected == true)
                            this.setState({ data: [...selectedCountries, ...unSelectedCountries], isAllSelected: isAllDataSelected })
                        }
                    }}
                    ItemSeparatorComponent={() => <ItemSeparator />}
                    updatedData={this.state.data}
                    triggerRefresh={this.state.triggerRefresh}
                    pagination={false}
                    keyExtractor={({ Id }) => `${Id}`}
                    renderItem={this.renderItem}
                />

            </LazyContainer>
        )
    }
}

export default ManageCountry;