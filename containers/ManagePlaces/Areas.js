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
import { GetSelectedCities, DeleteArea, GetAllCities, GetSelectedAreas, AddEditSelectedArea } from '../../services/ManagePlaces';
import HeaderSubmitButton from '../../components/HeaderSubmitButton';
import ArrowItem from '../../components/ArrowItem';
import { SelectCountry, SelectCity } from '../../utils/Places';
import { LongToast } from '../../utils/Toast';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { withLocalize } from 'react-localize-redux';

class MangeAreas extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            data: [],
            SelectedCities: [],
            triggerRefresh: false,
            lockSubmit: false,
            selectedCountry: null,
            selectedCity: null,
            SelectedAreas: [],
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

    onCountrySelect = (country) => {

        GetAllCities(country.Id, res => {
            this.setState({
                Cities: res.data.Data,
                selectedCountry: country,
                selectedCity: null,
                Areas: null
            })
        })
    }

    onCitySelect = (City) => {

        GetSelectedAreas(City.Id, res => {
            this.setState({
                selectedCity: City,
                SelectedAreas: res.data.Data,
                Areas: null
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
                        this.props.navigation.navigate('Area', {
                            Id,
                            CityId: this.state.selectedCity.Id,
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

        const { data, selectedCountry, selectedCity } = this.state
        const selectedIds = data.filter(item => item.isSelected == true).map(item => item.Id)

        if ((!selectedCountry || !selectedCountry.Id)) {
            return LongToast('YouMustSelectCountry')
        }

        if (!selectedCity) {
            return LongToast('YouMustSelectAtLeastOneCity')
        }

        if (!selectedIds || !selectedIds.length) {
            return LongToast('YouMustSelectAtLeastOneArea')
        }

        this.setState({ lockSubmit: true })
        this.lockSubmit = true

        AddEditSelectedArea({
            Ids: selectedIds,
            ParentId: selectedCity.Id
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
        const { selectedCity } = this.state

        let params = ''

        if (selectedCity) {
            params += `${this.addParamsSeparator(params)}id=${selectedCity.Id}`
        }

        return params
    }

    render() {

        return (
            <LazyContainer style={{ flex: 1 }} >

                <CustomHeader
                    title='Areas'
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

                                    if (!this.state.selectedCity) {
                                        return LongToast('YouMustSelectAtLeastOneCity')
                                    }

                                    this.props.navigation.navigate('Area', {
                                        Id: 0,
                                        CityId: this.state.selectedCity.Id,
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
                            this.onCountrySelect(country)
                        }, false)
                    }}
                    info={this.state.selectedCountry ? this.state.selectedCountry.Name : null}
                />

                <ItemSeparator />

                {this.state.selectedCountry && <ArrowItem
                    title='City'
                    onPress={() => {
                        SelectCity(this.props.navigation, selectedCity => {
                            this.onCitySelect(selectedCity)
                        }, this.state.selectedCountry.Id, false)

                    }}
                    info={this.state.selectedCity ? this.state.selectedCity.Name : null}
                />}

                {this.state.selectedCountry && this.state.selectedCity && <RemoteDataContainer
                    url={"Areas"}
                    params={this.getRequestParams()}
                    onDataFetched={(data) => {

                        const { SelectedAreas } = this.state;

                        if (!SelectedAreas.length) {
                            const Areas = data.map(item => ({ ...item, isSelected: false }))
                            this.setState({ data: Areas })
                        } else {

                            const SelectedAreasRes = data.filter(item => SelectedAreas.includes(item.Id)).map(item => ({ ...item, isSelected: true }))
                            const unSelectedAreasRes = data.filter(item => !SelectedAreas.includes(item.Id)).map(item => ({ ...item, isSelected: false }))
                            const isAllDataSelected = [...SelectedAreasRes, ...unSelectedAreasRes].every(item => item.isSelected == true)
                            this.setState({ data: [...SelectedAreasRes, ...unSelectedAreasRes], isAllSelected: isAllDataSelected })

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

                        DeleteArea(this.IdForDelete, res => {
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

export default withLocalize(MangeAreas);