import { ScrollView } from "react-native-gesture-handler"
import React, { Component } from 'react'
import LazyContainer from "../../components/LazyContainer"
import ItemSeparator from "../../components/ItemSeparator"
import ArrowItem from "../../components/ArrowItem"
import { SelectEntity } from "../../utils/EntitySelector"
import { SelectCity, SelectCountry } from "../../utils/Places"
import { ExternalTranslate } from "../../utils/Translate"

class PopUpRestrictions extends Component {
    constructor(props) {
        super(props)
        this.tabIndex = 2
    }

    renderContent = () => {
        const {
            SelectedCountries,
            SelectedCitities,
            SelectedCategories,
            SelectedProducts,
        } = this.props.Restriction


        return (
            <ScrollView
                contentContainerStyle={{
                }}>
                <ArrowItem
                    onPress={() => {
                        SelectCountry(this.props.navigation, data => {
                            this.props.onTabDataChange(this.tabIndex, {
                                ...this.props.Restriction,
                                SelectedCountries: data,
                                SelectedCitities: null,
                            })
                        }, true, SelectedCountries)
                    }}
                    title={'Countries'}
                    info={SelectedCountries.length || ExternalTranslate('NoneSelected')} />
                <ItemSeparator />




                {SelectedCountries && SelectedCountries.length ? <ArrowItem
                    onPress={() => {
                        SelectCity(
                            this.props.navigation,
                            data => {
                                this.props.onTabDataChange(this.tabIndex, {
                                    ...this.props.Restriction,
                                    SelectedCitities: data,
                                })
                            }, SelectedCountries.map(item => item.Id), true, SelectedCitities ? SelectedCitities : []
                        );
                    }}
                    title={"Cities"}
                    info={SelectedCitities && SelectedCitities.length ? SelectedCitities.length : ExternalTranslate('NoneSelected')}
                /> : null}
                <ItemSeparator />




                <ArrowItem
                    onPress={() => {
                        SelectEntity(this.props.navigation, data => {
                            this.props.onTabDataChange(this.tabIndex, {
                                ...this.props.Restriction,
                                SelectedCategories: data,
                            })
                        }, 'Categories/Simple', null, true, 2, SelectedCategories)
                    }}
                    title={'Categories'}
                    info={SelectedCategories.length || ExternalTranslate('NoneSelected')} />
                <ItemSeparator />




                <ArrowItem
                    onPress={() => {
                        SelectEntity(this.props.navigation, data => {
                            this.props.onTabDataChange(this.tabIndex, {
                                ...this.props.Restriction,
                                SelectedProducts: data,
                            })
                        }, 'Products/Simple', null, true, 2, SelectedProducts)
                    }}
                    title={'Products'}
                    info={SelectedProducts.length || ExternalTranslate('NoneSelected')} />
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
export default PopUpRestrictions