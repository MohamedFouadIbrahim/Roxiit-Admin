import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React, { Component } from 'react';
import { withLocalize } from 'react-localize-redux';
import { connect } from 'react-redux';
import CustomHeader from '../../components/CustomHeader';
import HeaderSubmitButton from '../../components/HeaderSubmitButton';
import LazyContainer from '../../components/LazyContainer';
import { mainColor, secondColor } from '../../constants/Colors';
import { AddEditPopup, GetPopup } from '../../services/PopUpsService';
import { LongToast } from '../../utils/Toast';
import { ExternalTranslate } from '../../utils/Translate';
import { isUrlValid } from '../../utils/Validation';
import PopUpInfo from './PopUpInfo';
import PopUpRestrictions from './PopUpRestrictions';
import PopUpWhere from './PopUpWhere';



class Popup extends Component {
    constructor(props) {
        super(props)
        const { languages_data, currLang } = this.props

        if (this.props.route.params && this.props.route.params?.Id) {
            this.editMode = true
            this.popupId = this.props.route.params?.Id,
                this.defaultValues = {
                    BasicInfo: {
                        Language: languages_data.find(item => item.code === currLang),
                        languages_data,
                    },
                }
        }
        else {
            this.editMode = false
            this.defaultValues = {
                BasicInfo: {
                    Language: languages_data.find(item => item.code === currLang),
                    languages_data,
                },
                Where: {
                    IsPopUp: false,
                    ShowTop: false,
                    ShowMiddle: false,
                    ShowBottom: false,
                    ShowOnlyOnce: false,
                    ShowOnlyOnceAfterNavigate: false,
                    HomePageTopSlider: false,
                    HomePageAds1: false,
                    HomePageAds2: false,
                    HomePageAds3: false,
                    ShowInSearch: false,
                    ShowInCheckout: false,
                    ShowInCart: false,
                    ShowInProfile: false,
                    ShowInAllCats: false,
                    ShowInAllProducts: false,
                    ShowInOrders: false,
                    ShowInOrder: false,
                    ShowInFlashOffers: false,
                    ShowInMonthlyOffers: false,
                    ShowInWishLists: false,
                    ShowInMostLikes: false,
                    ShowInSubstores: false,
                    ShowInFavouriteSubsTores: false,
                },
                Restriction: {
                    SelectedCountries: [],
                    SelectedCitities: [],
                    SelectedProducts: [],
                    SelectedCategories: [],
                }
            }
        }

        this.state = {
            lockSubmit: false,
            didFetchData: false,
            ...this.defaultValues,
        }

        this.lockSubmit = false
        this.BasicInfo = Object.assign({}, this.state.BasicInfo)
    }

    componentWillUnmount() {
        this.cancelFetch && this.cancelFetch()
        this.cancelAddEditPopup && this.cancelAddEditPopup()
    }

    componentDidMount() {
        if (this.popupId) {
            this.fetchDataGetPopup()
        }
    }


    fetchDataGetPopup = (LangId = null) => {
        this.cancelFetch =
            GetPopup(this.popupId, LangId,
                res => {
                    this.BasicInfo = {
                        ...this.BasicInfo,
                        LanguageId: res.data.LanguageId,
                        Icon: res.data.Icon,
                        name: res.data.name,
                        Title: res.data.Title,
                        Body: res.data.Body,
                        Navigation: res.data.Navigation,
                        NavigationTo: res.data.NavigationTo,
                        NavigationToName: res.data.NavigationToName,
                        ExpireDate: res.data.ExpireDate
                    }

                    this.setState({
                        BasicInfo: {
                            ...this.state.BasicInfo,
                            LanguageId: res.data.LanguageId,
                            Icon: res.data.Icon,
                            name: res.data.name,
                            Title: res.data.Title,
                            Body: res.data.Body,
                            Navigation: res.data.Navigation,
                            NavigationTo: res.data.NavigationTo,
                            NavigationToName: res.data.NavigationToName,
                            ExpireDate: res.data.ExpireDate
                        },
                        Where: {
                            IsPopUp: res.data.IsPopUp,
                            ShowTop: res.data.ShowTop,
                            ShowMiddle: res.data.ShowMiddle,
                            ShowBottom: res.data.ShowBottom,
                            ShowOnlyOnce: res.data.ShowOnlyOnce,
                            ShowOnlyOnceAfterNavigate: res.data.ShowOnlyOnceAfterNavigate,
                            HomePageTopSlider: res.data.HomePageTopSlider,
                            HomePageAds1: res.data.HomePageAds1,
                            HomePageAds2: res.data.HomePageAds2,
                            HomePageAds3: res.data.HomePageAds3,
                            ShowInSearch: res.data.ShowInSearch,
                            ShowInCheckout: res.data.ShowInCheckout,
                            ShowInCart: res.data.ShowInCart,
                            ShowInProfile: res.data.ShowInProfile,
                            ShowInAllCats: res.data.ShowInAllCats,
                            ShowInAllProducts: res.data.ShowInAllProducts,
                            ShowInOrders: res.data.ShowInOrders,
                            ShowInOrder: res.data.ShowInOrder,
                            ShowInFlashOffers: res.data.ShowInFlashOffers,
                            ShowInMonthlyOffers: res.data.ShowInMonthlyOffers,
                            ShowInWishLists: res.data.ShowInWishLists,
                            ShowInMostLikes: res.data.ShowInMostLikes,
                            ShowInSubstores: res.data.ShowInSubstores,
                            ShowInFavouriteSubsTores: res.data.ShowInFavouriteSubsTores,

                        },
                        Restriction: {
                            SelectedCountries: res.data.SelectedCountries,
                            SelectedCitities: res.data.SelectedCitities,
                            SelectedProducts: res.data.SelectedProducts,
                            SelectedCategories: res.data.SelectedCategories,
                        }
                    })
                    this.setState({ didFetchData: true })
                })
    }

    submit = () => {
        if (this.lockSubmit) {
            return
        }
        const { Where, Restriction } = this.state
        const { BasicInfo } = this
        const { ChangeToLanguage, Language, name, Title, Body, Navigation, NavigationTo, NavigationToName, Icon, ImageData, ExpireDate } = BasicInfo

        const { SelectedCountries, SelectedCitities, SelectedProducts, SelectedCategories, } = Restriction
        if (!BasicInfo.name) {
            return LongToast('NameCantBeEmpty')
        }

        if (Navigation && Navigation == 'Product' && !NavigationTo) {
            return LongToast(ExternalTranslate('Product') + ExternalTranslate('CantBeEmpty'), false)
        }
        if (Navigation && Navigation == 'Category' && !NavigationTo) {
            return LongToast(ExternalTranslate('Category') + ExternalTranslate('CantBeEmpty'), false)
        }
        if (Navigation && Navigation == 'Url' && !NavigationTo) {
            return LongToast(ExternalTranslate('Url') + ExternalTranslate('CantBeEmpty'), false)
        }

        if (NavigationTo && (Navigation && Navigation == 'Url') && !isUrlValid(NavigationTo)) {
            return LongToast('InvalidURL')
        }

        this.setState({ lockSubmit: true })
        this.lockSubmit = true

        const args = {
            name, Body, Title, Navigation, NavigationTo, NavigationToName, Icon, ImageData, ExpireDate,
            ...Where,
            SelectedCountries: SelectedCountries && SelectedCountries.length ? SelectedCountries.map(item => item.Id) : [],
            SelectedCitities: SelectedCitities && SelectedCitities.length ? SelectedCitities.map(item => item.Id) : [],
            SelectedProducts: SelectedProducts && SelectedProducts.length ? SelectedProducts.map(item => item.Id) : [],
            SelectedCategories: SelectedCategories && SelectedCategories.length ? SelectedCategories.map(item => item.Id) : [],
            Id: this.editMode == true ? this.popupId : 0,
            LanguageId: ChangeToLanguage ? ChangeToLanguage.key : Language.key,
        }

        this.setState({
            BasicInfo: {
                ...BasicInfo,
                uploadingImage: true, prossesEvent: 0
            }
        })

        this.cancelAddEditPopup = AddEditPopup(args
            , res => {
                this.lockSubmit = false
                this.setState({
                    didSucceed: true,
                    lockSubmit: false,
                    BasicInfo: {
                        ...BasicInfo,
                        uploadingImage: false,
                        prossesEvent: null
                    }
                })
                this.props.route.params?.onChildChange && this.props.route.params?.onChildChange()
                this.props.navigation.goBack()
            }, err => {
                LongToast('DataNotSaved')
                this.setState({
                    lockSubmit: false,
                    BasicInfo: {
                        ...BasicInfo,
                        uploadingImage: false,
                        prossesEvent: null
                    }
                })
                this.lockSubmit = false
            }, (re) => {
                this.setState({
                    BasicInfo: {
                        ...this.state.BasicInfo,
                        prossesEvent: re * 0.01
                    }
                })
            })
    }


    renderContent = () => {
        const {
            name,
            Title,
            Body,
        } = this.BasicInfo

        if (this.state.didFetchData || !this.editMode) {
            return (
                <PopUpTabNavigator
                    screenProps={{
                        stackNavigation: this.props.navigation,
                        data: {
                            ...this.state.BasicInfo,
                            name,
                            Title,
                            Body,
                        },
                        Where: this.state.Where,
                        Restriction: this.state.Restriction,
                        onTabDataChange: this.onTabDataChange,
                        onSelectLanguage: this.onSelectLanguage,
                        translate: this.props.translate,
                        popupId: this.popupId,
                    }} />
            )
        }
    }

    onTabDataChange = (tab, data, setState = true) => {
        switch (tab) {
            case 0:
                if (setState) {
                    this.setState({
                        BasicInfo: {
                            ...data,
                        }
                    })
                } else {
                    this.BasicInfo = {
                        ...data
                    }
                }

                break;
            case 1:
                this.setState({
                    Where: {
                        ...data,
                    }
                })
                break;
            case 2:
                this.setState({
                    Restriction: {
                        ...data,
                    }
                })
                break;
            default:
                break;
        }
    }

    onSelectLanguage = (index) => {
        const { languages_data } = this.props
        const selectedLanguage = languages_data[index]
        this.setState({
            BasicInfo: {
                ...this.state.BasicInfo,
                ChangeToLanguage: selectedLanguage,
            }
        })
        this.fetchDataGetPopup(selectedLanguage.key)
    }

    render() {
        return (
            <LazyContainer style={{ flex: 1, backgroundColor: 'white' }}>
                <CustomHeader
                    navigation={this.props.navigation}
                    title={"PopUp"}
                    rightComponent={
                        <HeaderSubmitButton
                            isLoading={this.state.lockSubmit}
                            didSucceed={this.state.didSucceed}
                            onPress={() => { this.submit() }} />
                    } />

                {this.renderContent()}
            </LazyContainer>
        )
    }
}

const Tabs = createMaterialTopTabNavigator()
const PopUpTabNavigator = ({ screenProps, navigation, screenProps: { translate } }) => {


    return (
        <Tabs.Navigator
            tabBarOptions={{
                labelStyle: {
                    fontSize: 12,
                    color: mainColor,
                },
                indicatorStyle: {
                    backgroundColor: secondColor,
                },
                style: {
                    backgroundColor: 'white',
                },
            }}
        >
            <Tabs.Screen
                name='Info'
                options={{ title: translate('Info') }}
            >

                {() => (<PopUpInfo
                    data={screenProps.data}
                    popupId={screenProps.popupId}
                    onTabDataChange={screenProps.onTabDataChange}
                    onSelectLanguage={screenProps.onSelectLanguage}
                    navigation={screenProps.stackNavigation}
                />)}
            </Tabs.Screen>

            <Tabs.Screen
                name='Where'
                options={{ title: translate('Where') }}
            >
                {() => (<PopUpWhere
                    Where={screenProps.Where}
                    popupId={screenProps.popupId}
                    onTabDataChange={screenProps.onTabDataChange}
                    navigation={screenProps.stackNavigation}
                />)}
            </Tabs.Screen>

            <Tabs.Screen
                name='Restriction'
                options={{ title: translate('Restriction') }}
            >
                {() => (
                    <PopUpRestrictions
                        Restriction={screenProps.Restriction}
                        popupId={screenProps.popupId}
                        onTabDataChange={screenProps.onTabDataChange}
                        navigation={screenProps.stackNavigation}
                    />
                )}
            </Tabs.Screen>
        </Tabs.Navigator>
    )
}


const mapStateToProps = ({
    language: {
        languages_data,
        currLang,
    }
}) => ({
    languages_data,
    currLang,
})
export default connect(mapStateToProps)(withLocalize(Popup))
