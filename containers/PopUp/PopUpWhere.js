import SwitchItem from "../../components/SwitchItem"
import { ScrollView } from "react-native-gesture-handler"
import React, { Component } from 'react'
import LazyContainer from "../../components/LazyContainer"
import ItemSeparator from "../../components/ItemSeparator"

class PopUpWhere extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isDateTimePickerVisible: false,
            editingStartDate: false,
            datafitched: true,
            Pages: [{ Id: 1, Name: "NoNavigation" }, { Id: 2, Name: "Product" }, { Id: 3, Name: "Categories" }, { Id: 4, Name: "Home" }],
            Navigation: null,
            remoteImage: true
        }
        this.tabIndex = 1

    }


    renderContent = () => {
        const {
            IsPopUp,
            ShowTop,
            ShowMiddle,
            ShowBottom,
            ShowOnlyOnce,
            ShowOnlyOnceAfterNavigate,
            HomePageTopSlider,
            HomePageAds1,
            HomePageAds2,
            HomePageAds3,
            ShowInSearch,
            ShowInCheckout,
            ShowInCart,
            ShowInProfile,
            ShowInAllCats,
            ShowInAllProducts,
            ShowInOrders,
            ShowInOrder,
            ShowInFlashOffers,
            ShowInMonthlyOffers,
            ShowInWishLists,
            ShowInMostLikes,
            ShowInSubstores,
            ShowInFavouriteSubsTores,
        } = this.props.Where


        return (
            <ScrollView
                contentContainerStyle={{
                }}>
                <SwitchItem
                    title="IsPopUp"
                    value={IsPopUp}
                    onValueChange={(value) => {
                        this.props.onTabDataChange(this.tabIndex, {
                            ...this.props.Where,
                            IsPopUp: value,
                        })
                    }} />
                <ItemSeparator />


                <SwitchItem
                    title="ShowTop"
                    value={ShowTop}
                    onValueChange={(value) => {
                        this.props.onTabDataChange(this.tabIndex, {
                            ...this.props.Where,
                            ShowTop: value,
                        })
                    }} />
                <ItemSeparator />



                <SwitchItem
                    title="ShowMiddle"
                    value={ShowMiddle}
                    onValueChange={(value) => {
                        this.props.onTabDataChange(this.tabIndex, {
                            ...this.props.Where,
                            ShowMiddle: value,
                        })
                    }} />
                <ItemSeparator />



                <SwitchItem
                    title="ShowBottom"
                    value={ShowBottom}
                    onValueChange={(value) => {
                        this.props.onTabDataChange(this.tabIndex, {
                            ...this.props.Where,
                            ShowBottom: value,
                        })
                    }} />
                <ItemSeparator />



                <SwitchItem
                    title="ShowOnlyOnce"
                    value={ShowOnlyOnce}
                    onValueChange={(value) => {
                        this.props.onTabDataChange(this.tabIndex, {
                            ...this.props.Where,
                            ShowOnlyOnce: value,
                        })
                    }} />
                <ItemSeparator />



                <SwitchItem
                    title="ShowOnlyOnceAfterNavigate"
                    value={ShowOnlyOnceAfterNavigate}
                    onValueChange={(value) => {
                        this.props.onTabDataChange(this.tabIndex, {
                            ...this.props.Where,
                            ShowOnlyOnceAfterNavigate: value,
                        })
                    }} />
                <ItemSeparator />



                <SwitchItem
                    title="HomePageTopSlider"
                    value={HomePageTopSlider}
                    onValueChange={(value) => {
                        this.props.onTabDataChange(this.tabIndex, {
                            ...this.props.Where,
                            HomePageTopSlider: value,
                        })
                    }} />
                <ItemSeparator />



                <SwitchItem
                    title="HomePageAds1"
                    value={HomePageAds1}
                    onValueChange={(value) => {
                        this.props.onTabDataChange(this.tabIndex, {
                            ...this.props.Where,
                            HomePageAds1: value,
                        })
                    }} />
                <ItemSeparator />



                <SwitchItem
                    title="HomePageAds2"
                    value={HomePageAds2}
                    onValueChange={(value) => {
                        this.props.onTabDataChange(this.tabIndex, {
                            ...this.props.Where,
                            HomePageAds2: value,
                        })
                    }} />
                <ItemSeparator />



                <SwitchItem
                    title="HomePageAds3"
                    value={HomePageAds3}
                    onValueChange={(value) => {
                        this.props.onTabDataChange(this.tabIndex, {
                            ...this.props.Where,
                            HomePageAds3: value,
                        })
                    }} />
                <ItemSeparator />



                <SwitchItem
                    title="ShowInSearch"
                    value={ShowInSearch}
                    onValueChange={(value) => {
                        this.props.onTabDataChange(this.tabIndex, {
                            ...this.props.Where,
                            ShowInSearch: value,
                        })
                    }} />
                <ItemSeparator />


                <SwitchItem
                    title="ShowInCheckout"
                    value={ShowInCheckout}
                    onValueChange={(value) => {
                        this.props.onTabDataChange(this.tabIndex, {
                            ...this.props.Where,
                            ShowInCheckout: value,
                        })
                    }} />
                <ItemSeparator />



                <SwitchItem
                    title="ShowInCart"
                    value={ShowInCart}
                    onValueChange={(value) => {
                        this.props.onTabDataChange(this.tabIndex, {
                            ...this.props.Where,
                            ShowInCart: value,
                        })
                    }} />
                <ItemSeparator />


                <SwitchItem
                    title="ShowInProfile"
                    value={ShowInProfile}
                    onValueChange={(value) => {
                        this.props.onTabDataChange(this.tabIndex, {
                            ...this.props.Where,
                            ShowInProfile: value,
                        })
                    }} />
                <ItemSeparator />



                <SwitchItem
                    title="ShowInAllCats"
                    value={ShowInAllCats}
                    onValueChange={(value) => {
                        this.props.onTabDataChange(this.tabIndex, {
                            ...this.props.Where,
                            ShowInAllCats: value,
                        })
                    }} />
                <ItemSeparator />



                <SwitchItem
                    title="ShowInAllProducts"
                    value={ShowInAllProducts}
                    onValueChange={(value) => {
                        this.props.onTabDataChange(this.tabIndex, {
                            ...this.props.Where,
                            ShowInAllProducts: value,
                        })
                    }} />
                <ItemSeparator />




                <SwitchItem
                    title="ShowInOrders"
                    value={ShowInOrders}
                    onValueChange={(value) => {
                        this.props.onTabDataChange(this.tabIndex, {
                            ...this.props.Where,
                            ShowInOrders: value,
                        })
                    }} />
                <ItemSeparator />



                <SwitchItem
                    title="ShowInOrder"
                    value={ShowInOrder}
                    onValueChange={(value) => {
                        this.props.onTabDataChange(this.tabIndex, {
                            ...this.props.Where,
                            ShowInOrder: value,
                        })
                    }} />
                <ItemSeparator />



                <SwitchItem
                    title="ShowInFlashOffers"
                    value={ShowInFlashOffers}
                    onValueChange={(value) => {
                        this.props.onTabDataChange(this.tabIndex, {
                            ...this.props.Where,
                            ShowInFlashOffers: value,
                        })
                    }} />
                <ItemSeparator />



                <SwitchItem
                    title="ShowInMonthlyOffers"
                    value={ShowInMonthlyOffers}
                    onValueChange={(value) => {
                        this.props.onTabDataChange(this.tabIndex, {
                            ...this.props.Where,
                            ShowInMonthlyOffers: value,
                        })
                    }} />
                <ItemSeparator />



                <SwitchItem
                    title="ShowInWishLists"
                    value={ShowInWishLists}
                    onValueChange={(value) => {
                        this.props.onTabDataChange(this.tabIndex, {
                            ...this.props.Where,
                            ShowInWishLists: value,
                        })
                    }} />
                <ItemSeparator />



                <SwitchItem
                    title="ShowInMostLikes"
                    value={ShowInMostLikes}
                    onValueChange={(value) => {
                        this.props.onTabDataChange(this.tabIndex, {
                            ...this.props.Where,
                            ShowInMostLikes: value,
                        })
                    }} />
                <ItemSeparator />



                <SwitchItem
                    title="ShowInSubstores"
                    value={ShowInSubstores}
                    onValueChange={(value) => {
                        this.props.onTabDataChange(this.tabIndex, {
                            ...this.props.Where,
                            ShowInSubstores: value,
                        })
                    }} />
                <ItemSeparator />



                <SwitchItem
                    title="ShowInFavouriteSubsTores"
                    value={ShowInFavouriteSubsTores}
                    onValueChange={(value) => {
                        this.props.onTabDataChange(this.tabIndex, {
                            ...this.props.Where,
                            ShowInFavouriteSubsTores: value,
                        })
                    }} />
                <ItemSeparator />
            </ScrollView>
        )
    }



    render() {
        return (
            <LazyContainer style={{ flex: 1, backgroundColor: "white" }}>
                {this.renderContent()}
            </LazyContainer>
        )
    }
}
export default PopUpWhere