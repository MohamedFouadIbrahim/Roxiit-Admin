import React from 'react';
import { View } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import LazyContainer from '../../components/LazyContainer';
import CustomTouchable from '../../components/CustomTouchable';
import CustomSelector from '../../components/CustomSelector';
import ConfirmModal from '../../components/ConfirmModal';
import RemoteDataContainer from '../../components/RemoteDataContainer';
import CustomHeader, { secondHeaderIconSize } from '../../components/CustomHeader';
import FontedText from '../../components/FontedText';
import CheckBox from '../../components/CheckBox';
import ItemSeparator from '../../components/ItemSeparator';
import { largePagePadding, pagePadding } from '../../constants/Style';
import { mainTextColor } from '../../constants/Colors';
import { GetSelectedCities, AddSelectedCities, DeleteCity } from '../../services/ManagePlaces';
import HeaderSubmitButton from '../../components/HeaderSubmitButton';
import ArrowItem from '../../components/ArrowItem';
import { SelectCountry } from '../../utils/Places';
import { LongToast } from '../../utils/Toast';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { withLocalize } from 'react-localize-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
class MangeCities extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            data: [],
            SelectedCities: [],
            triggerRefresh: false,
            lockSubmit: false,
            selectedCountry: null,
            isAllSelected: false
        }

        this.DeleteConfirmRef = React.createRef();
        this.ConfirmRef = React.createRef();
        this.lockSubmit = false

        const { translate } = this.props

        this.options = [
            { Id: 1, Name: translate('Delete') }
        ]

    }

    onCheckBoxPress = (index) => {
        const { data } = this.state
        let copy = [...data]
        copy[index].isSelected = !copy[index].isSelected
        this.setState({ copy: data })
    }

    _GetSelectedCities = (country) => {
        GetSelectedCities(country.Id, res => {
            this.setState({
                SelectedCities: res.data.Data,
                selectedCountry: country
            })
        })
    }

    onChildChange = () => {
        this.setState({ triggerRefresh: !this.state.triggerRefresh })
    }

    renderItem = ({ item, index }) => {

        const {
            Id,
            Name,
            isSelected,
            isCustom,
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
                onLongPress={() => {
                    if (isCustom) {
                        this.IdForDelete = Id
                        this.DeleteConfirmRef.current.show()
                    }
                }}
                onPress={() => {
                    if (isCustom) {
                        this.props.navigation.navigate('City', {
                            Id,
                            CountryId: this.state.selectedCountry.Id,
                            onChildChange: this.onChildChange
                        })
                    }

                }}
            >
                <FontedText style={{ color: mainTextColor }}>{Name}</FontedText>

                <CheckBox
                    onPress={() => {
                        this.onCheckBoxPress(index)
                    }}
                    selected={isSelected} />
            </CustomTouchable>
        )
    }

    submit = () => {
        if (this.state.lockSubmit) {
            return
        }

        const { data, selectedCountry } = this.state
        const selectedIds = data.filter(item => item.isSelected == true).map(item => item.Id)

        if (!selectedCountry || !selectedCountry.Id) {
            return LongToast('YouMustSelectCountry')
        }

        if (!selectedIds || !selectedIds.length) {
            return LongToast('YouMustSelectAtLeastOneCity')
        }

        this.setState({ lockSubmit: true })
        this.lockSubmit = true

        AddSelectedCities({
            Ids: selectedIds,
            ParentId: selectedCountry.Id
        }, res => {
            LongToast('dataSaved')
            this.setState({ lockSubmit: false })
            this.lockSubmit = false
            this.props.navigation.dispatch(CommonActions.goBack())

        }, err => {
            this.setState({ lockSubmit: false })
            this.lockSubmit = false
        })
    }

    addParamsSeparator = (params) => {
        return params.length ? '&' : ''
    }

    getRequestParams = () => {
        const { selectedCountry } = this.state

        let params = ''

        if (selectedCountry) {
            params += `${this.addParamsSeparator(params)}id=${selectedCountry.Id}`
        }

        return params
    }

    render() {

        return (
            <LazyContainer style={{ flex: 1 }} >

                <CustomHeader
                    title='Cities'
                    navigation={this.props.navigation}
                    rightNumOfItems={3}
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

                            <CustomTouchable
                                onPress={() => {

                                    if (!this.state.selectedCountry) {
                                        return LongToast('YouMustSelectCountry')
                                    }

                                    this.props.navigation.navigate('City', {
                                        Id: 0,
                                        CountryId: this.state.selectedCountry.Id,
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

                <ArrowItem
                    title='Country'
                    onPress={() => {
                        SelectCountry(this.props.navigation, (country) => {
                            this._GetSelectedCities(country)
                        }, false)
                    }}
                    info={this.state.selectedCountry ? this.state.selectedCountry.Name : null}
                />

                {this.state.selectedCountry && <RemoteDataContainer
                    url={"Cities"}
                    params={this.getRequestParams()}
                    onDataFetched={(data) => {
                        const { SelectedCities } = this.state;
                        if (!SelectedCities.length) {
                            const Cities = data.map(item => ({ ...item, isSelected: false }))
                            this.setState({ data: Cities })
                        } else {
                            const SelectedCitiesRes = data.filter(item => SelectedCities.includes(item.Id)).map(item => ({ ...item, isSelected: true }))
                            const unSelectedCitiesRes = data.filter(item => !SelectedCities.includes(item.Id)).map(item => ({ ...item, isSelected: false }))
                            const isAllDataSelected = [...SelectedCitiesRes, ...unSelectedCitiesRes].every(item => item.isSelected == true)
                            this.setState({ data: [...SelectedCitiesRes, ...unSelectedCitiesRes], isAllSelected: isAllDataSelected })
                        }
                    }}
                    ItemSeparatorComponent={() => <ItemSeparator />}
                    updatedData={this.state.data}
                    triggerRefresh={this.state.triggerRefresh}
                    pagination={false}
                    keyExtractor={({ Id }) => `${Id}`}
                    renderItem={this.renderItem}
                />}

                <CustomSelector
                    ref={this.DeleteConfirmRef}
                    options={this.options.map(item => item.Name)}
                    onSelect={(index) => {
                        this.ConfirmRef.current.show()
                    }}
                    onDismiss={() => {

                    }}
                />
                <ConfirmModal
                    ref={this.ConfirmRef}
                    onConfirm={() => {

                        DeleteCity(this.IdForDelete, res => {
                            LongToast('dataDeleted')
                            this.onChildChange()
                        })

                    }}
                    onResponse={(check) => {

                    }}
                />

            </LazyContainer>
        )
    }
}

export default withLocalize(MangeCities);