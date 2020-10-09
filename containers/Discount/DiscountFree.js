import React, { Component } from 'react';
import { withLocalize } from 'react-localize-redux';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import HorizontalInput from '../../components/HorizontalInput';
import ItemSeparator from '../../components/ItemSeparator/index.js';
import ArrowItem from '../../components/ArrowItem';
import LazyContainer from '../../components/LazyContainer';
import { SelectEntity } from '../../utils/EntitySelector';

class DiscountFree extends Component {
    constructor() {
        super()

        this.tabIndex = 3
        this.state = {
            didDataFitched: false
        }

    }

    componentDidMount() {
        const {
            MaxFreeProductsPerSubStore,
            MaxFreeProducts,
            TimeBetweenFreeProducts,
            TimeBetweenFreeProductsPerSubStore,
            ValidatyFromApplyInDays,
        } = this.props.data

        this.setState({
            MaxFreeProductsPerSubStore,
            MaxFreeProducts,
            TimeBetweenFreeProducts,
            TimeBetweenFreeProductsPerSubStore,
            ValidatyFromApplyInDays,
        })
    }
    renderContent = () => {

        const {
            FreeProducts
        } = this.props.data

        const { translate } = this.props

        const {
            MaxFreeProductsPerSubStore,
            MaxFreeProducts,
            TimeBetweenFreeProducts,
            TimeBetweenFreeProductsPerSubStore,
            ValidatyFromApplyInDays,
        } = this.state

        return (
            <ScrollView
                contentContainerStyle={{
                }}>
                <HorizontalInput
                    label="MaxFreeProductsPerSubStore"
                    keyboardType="numeric"
                    value={`${MaxFreeProductsPerSubStore ? MaxFreeProductsPerSubStore : ''}`}
                    onChangeText={(text) => {
                        this.setState({
                            MaxFreeProductsPerSubStore: text
                        }, () => {
                            this.props.onTabDataChange(this.tabIndex, {
                                ...this.props.data,
                                MaxFreeProductsPerSubStore: text
                            },false)
                        })
                    }} />

                <ItemSeparator />

                <HorizontalInput
                    label="MaxFreeProducts"
                    keyboardType="numeric"
                    value={`${MaxFreeProducts ? MaxFreeProducts : ''}`}
                    onChangeText={(text) => {
                        this.setState({
                            MaxFreeProducts: text,
                        }, () => {
                            this.props.onTabDataChange(this.tabIndex, {
                                ...this.props.data,
                                MaxFreeProducts: text,
                            },false)
                        })

                    }} />

                <ItemSeparator />

                <HorizontalInput
                    label="TimeBetweenFreeProducts"
                    keyboardType="numeric"
                    value={`${TimeBetweenFreeProducts ? TimeBetweenFreeProducts : ''}`}
                    onChangeText={(text) => {
                        this.setState({
                            TimeBetweenFreeProducts: text
                        },()=>{
                            this.props.onTabDataChange(this.tabIndex, {
                                ...this.props.data,
                                TimeBetweenFreeProducts: text
                            },false)
                        })
                       
                    }} />

                <ItemSeparator />

                <HorizontalInput
                    label="TimeBetweenFreeProductsPerSubStore"
                    keyboardType="numeric"
                    value={`${TimeBetweenFreeProductsPerSubStore ? TimeBetweenFreeProductsPerSubStore : ''}`}
                    onChangeText={(text) => {
                        this.setState({
                            TimeBetweenFreeProductsPerSubStore: text
                        },()=>{
                            this.props.onTabDataChange(this.tabIndex, {
                                ...this.props.data,
                                TimeBetweenFreeProductsPerSubStore: text,
                            },false)
                        }) 
                    }} />

                <ItemSeparator />

                <HorizontalInput
                    label="ValidatyFromApplyInDays"
                    keyboardType="numeric"
                    value={`${ValidatyFromApplyInDays ? ValidatyFromApplyInDays : ''}`}
                    onChangeText={(text) => {
                        this.setState({
                            ValidatyFromApplyInDays: text
                        },()=>{
                            this.props.onTabDataChange(this.tabIndex, {
                                ...this.props.data,
                                ValidatyFromApplyInDays: text
                            },false)
                        })
                       
                    }} />

                <ItemSeparator />

                <ArrowItem
                    onPress={() => {
                        SelectEntity(this.props.navigation, data => {
                            this.props.onTabDataChange(this.tabIndex, {
                                ...this.props.data,
                                FreeProducts: data,
                            })
                        }, 'Products/Simple', null, true, 2, FreeProducts)
                    }}
                    title={'FreeProducts'}
                    info={FreeProducts.length || translate('NoneSelected')} />

            </ScrollView>
        )
    }

    render() {
        return (
            <LazyContainer style={{ flex: 1, backgroundColor: "white" }}>
                {
                    Platform.OS == 'ios' ?

                        <KeyboardAvoidingView behavior='padding' enabled
                            style={{ flex: 1 }}
                            keyboardVerticalOffset={40}
                        >
                            {this.renderContent()}
                        </KeyboardAvoidingView> :

                        this.renderContent()

                }
                {/* {this.renderContent()} */}
            </LazyContainer>
        )
    }
}

export default withLocalize(DiscountFree)