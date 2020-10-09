import React from 'react'
import { View, ScrollView, I18nManager } from 'react-native';
import LazyContainer from '../../components/LazyContainer';
import AntDesign from 'react-native-vector-icons/AntDesign'
import FontedText from '../../components/FontedText';
import { GetHello, GetGoLiveScore } from '../../services/HelloService';
import CustomHeader from '../../components/CustomHeader';
import TranslatedText from '../../components/TranslatedText';
import CustomButton from '../../components/CustomButton';
import ProgressBar from '../../components/ProgressBar';
import CustomTouchable from '../../components/CustomTouchable';

export default class GoLiveDetails extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            didDataFitched: false
        }
    }

    fitchData = () => {

        GetGoLiveScore(res => {
            const { GoLiveScoreDetails, GoliveScore } = res.data
            this.setState({ GoLiveScoreDetails, GoliveScore, didDataFitched: true })
        })

    }

    componentDidMount() { this.fitchData() }

    render() {

        if (!this.state.didDataFitched) {
            return null
        }

        const {
            GoLive_Is_10Category,
            GoLive_Is_10Products,
            GoLive_Is_Brands,
            GoLive_Is_ConfigPage,
            GoLive_Is_Logo,
            GoLive_Is_PaymentMethod,
            GoLive_Is_ShippingMethod,
            GoLive_Is_StoreListing,
            GoLive_Is_StoreName,
            GoLive_Is_StoreStyle,
        } = this.state.GoLiveScoreDetails

        const { GoliveScore } = this.state

        return (

            <LazyContainer style={{
                flex: 1,
            }} >

                <CustomHeader
                    title='GoLiveTitle'
                    leftComponent={'drawer'}
                    navigation={this.props.navigation}
                />


                <ScrollView
                    contentContainerStyle={{ paddingTop: 10, paddingHorizontal: 25, }}
                >
                    <View style={{ flexDirection: 'row', marginHorizontal: 0, marginBottom: 10 }} >

                        <TranslatedText style={{ marginVertical: 5, fontSize: 15, fontWeight: 'bold' }} text={`Completed`} />

                        <FontedText style={{ marginVertical: 5, fontSize: 15, fontWeight: 'bold' }} >{` : ( ${GoliveScore}% )`}</FontedText>
                    </View>

                    <ProgressBar
                        progress={GoliveScore * 0.01}
                        otherProps={{ width: 350 }}
                        style={{ marginbottom: 5 }}
                    />

                    <OneRowForDetails Finished={GoLive_Is_StoreName} Name={'Store_Name'} onPress={() => {
                        this.props.navigation.navigate('GoLiveStore', { FormGoLive: true })
                        // this.props.navigation.push('Store', { FormGoLive: true }) 
                    }} />

                    <OneRowForDetails Finished={GoLive_Is_StoreStyle} Name={'Store_Style'} onPress={() => {
                        this.props.navigation.navigate('GoLiveStoreStyle', { FormGoLive: true })
                    }} />

                    <OneRowForDetails Finished={GoLive_Is_StoreListing} Name={'Store_Listing'} onPress={() => {
                        this.props.navigation.navigate('GoLiveStoreList', { FormGoLive: true })
                    }} />

                    <OneRowForDetails Finished={GoLive_Is_ShippingMethod} Name={'Shipping_Method'} onPress={() => {
                        this.props.navigation.navigate('GoLiveCourierIndex', { FormGoLive: true })
                    }} />

                    <OneRowForDetails Finished={GoLive_Is_PaymentMethod} Name={'Payment_Method'} onPress={() => {
                        this.props.navigation.navigate('GoLivePaymentMethods', { FormGoLive: true })
                    }} />

                    <OneRowForDetails Finished={GoLive_Is_Logo} Name={'Logo'} onPress={() => {
                        this.props.navigation.navigate('GoLiveStore', { FormGoLive: true })
                    }} />

                    <OneRowForDetails Finished={GoLive_Is_ConfigPage} Name={'Config_Page'} onPress={() => {
                        this.props.navigation.navigate('GoLivePages', { FormGoLive: true })
                    }} />

                    <OneRowForDetails Finished={GoLive_Is_Brands} Name={'Brands'} onPress={() => {
                        this.props.navigation.navigate('GoLiveBrands', { FormGoLive: true })
                    }} />

                    <OneRowForDetails Finished={GoLive_Is_10Products} Name={'TenProducts'} onPress={() => {
                        this.props.navigation.navigate('GoLiveProducts', { FormGoLive: true })
                    }} />

                    <OneRowForDetails Finished={GoLive_Is_10Category} Name={'TenCategory'} onPress={() => {
                        this.props.navigation.navigate('GoLiveCategories', { FormGoLive: true })
                    }} />

                </ScrollView>


                <View
                    style={{
                        padding: 10,
                        margin: 10,
                        // borderRadius: 20,
                        backgroundColor: 'white',
                        // ...shadowStyle1,
                    }}
                >
                    <TranslatedText style={{ padding: 10, fontSize: 15, color: 'black', lineHeight: 20 }} text={'Info2'} />

                    <CustomButton title='Close' onPress={() => { this.props.navigation.navigate('Home') }} />
                </View>

            </LazyContainer>

        )
    }

}

const OneRowForDetails = ({ Finished, Name, onPress }) => (
    <CustomTouchable
        onPress={onPress}
        style={{ flexDirection: 'row', marginVertical: 15, marginLeft: 15 }}
    >
        <AntDesign name={'checkcircle'} color={Finished ? 'green' : '#a6a6a6'} size={20}
            style={{ marginRight: 5, marginTop: 2 }}
        />
        <TranslatedText style={{ fontSize: 15, color: 'black', width: 150, textAlign: I18nManager.isRTL ? 'right' : 'left', marginLeft: 5 }} text={Name} />
        {/* <FontedText style={{ fontSize: 15, color: 'black', width: 150, textAlign: 'left', marginLeft: 5 }} >{Name}</FontedText> */}
    </CustomTouchable>

)