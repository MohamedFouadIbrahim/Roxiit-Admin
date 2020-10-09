import React from 'react';
import { View, I18nManager, Keyboard } from 'react-native';
import { withLocalize } from 'react-localize-redux';
import CustomHeader, { headerHeight } from '../../components/CustomHeader/index.js';
import { largePagePadding, shadowStyle0 } from '../../constants/Style.js';
import CircularImage from '../../components/CircularImage/index';
import ItemSeparator from '../../components/ItemSeparator/index';
import FontedText from '../../components/FontedText/index';
import LazyContainer from '../../components/LazyContainer';
import { ApproveOrDisApprove, GetReview } from '../../services/ReviewsService';
import { screenWidth } from '../../constants/Metrics';
import HeaderSubmitButton from '../../components/HeaderSubmitButton/index';
import TranslatedText from '../../components/TranslatedText/index.js';
// import CustomInput from '../../components/CustomInput/index';
import CustomInputForFastReply from '../../components/CustomInputForFastReply/index';
import { LongToast } from '../../utils/Toast.js';
class Review extends React.Component {
    constructor(props) {
        super(props)
        this.lockSubmit = false
        if (this.props.route.params && this.props.route.params?.Id) {
            // this.editMode = true
            this.EditId = this.props.route.params?.Id
        }
    }
    state = {
        data: null,
        triggerRefresh: false,
        SelectedOrderReview: null,
        Approved: null,
        Replied: null,
        dataFitched: false,
        replyText: null,
        lockSubmit: false
    }
    onSave = () => {
        if (this.lockSubmit) {
            return
        }
        if (!this.state.replyText) {
            return LongToast('CantHaveEmptyInputs')
        }
        if (this.EditId) {
            const DataArgs = {
                Id: this.EditId,
                Review: '',
                ReplyReview: this.state.replyText,
                IsReviewApproved: true
            }
            Keyboard.dismiss()
            this.lockSubmit = true
            this.setState({ lockSubmit: true })
            this.cancelFetchDataApproveOrDisApprove = ApproveOrDisApprove(DataArgs, () => {
                this.lockSubmit = false
                this.setState({ lockSubmit: false })
                this.props.route.params?.onChildChange && this.props.route.params?.onChildChange()
                this.props.navigation.goBack()
            }, (err) => {
                this.lockSubmit = false
                this.setState({ lockSubmit: false })
            })
        }
    }
    componentWillUnmount() {
        this.cancelFetchData && this.cancelFetchData()
        this.cancelFetchDataApproveOrDisApprove && this.cancelFetchDataApproveOrDisApprove()
    }
    componentDidMount() {
        this.cancelFetchData = GetReview(this.EditId, (res) => {
            this.setState({ data: res.data, dataFitched: true })
        })
    }
    onSelectOrderReview = (OrderReview) => {
        this.setState({ SelectedOrderReview: OrderReview })
    }
    renderImageAndName = (Name, ImageUrl, id) => {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }} >
                <CircularImage
                    uri={ImageUrl}
                    id={id} />
                <FontedText style={{ color: 'black', marginLeft: 20, fontSize: 12 }}>{`${Name.slice(0, 35)}`}</FontedText>
            </View>
        )
    }
    renderOrder = (orderName) => {
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }} >
            <TranslatedText text='OrderId' />
            <FontedText style={{ color: 'black', marginLeft: 20, fontSize: 12 }}>{`${orderName.slice(0, 35)}`}</FontedText>
        </View>
    }
    renderOption(array) {
        return <FontedText style={{ color: 'black', marginLeft: 20, fontSize: 12, width: 200 }}>{
            array.map((vlaue, index) => `${vlaue.Name} , `)
        }</FontedText>
    }
    render() {
        const { data, dataFitched } = this.state
        const { translate } = this.props
        if (dataFitched == false) {
            return null
        }

        return (
            <LazyContainer style={{ flex: 1, backgroundColor: '#f2f2f2' }} >
                <CustomHeader
                    leftComponent="back"
                    navigation={this.props.navigation}
                    title="Reply"
                    rightNumOfItems={1}
                    rightComponent={
                        <HeaderSubmitButton
                            isLoading={this.state.lockSubmit}
                            onPress={() => { this.onSave() }}
                        />
                    } />
                <View style={{ marginHorizontal: largePagePadding, flex: 1 }} >
                    {this.renderImageAndName(data.Product.Name, data.Product.Media.ImageUrl, data.Product.Id)}

                    <ItemSeparator style={{ backgroundColor: 'black' }} />

                    {this.renderImageAndName(data.Customer.Name, data.Customer.Media.ImageUrl, data.Customer.Id)}

                    <ItemSeparator style={{ backgroundColor: 'black' }} />

                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 15, marginLeft: 10 }} >
                        <TranslatedText text={'OrderId'} style={{ fontWeight: 'bold' }} />
                        <FontedText style={{ color: 'black', marginLeft: 20, fontSize: 12 }}>{`${data.Order.Name.slice(0, 35)}`}</FontedText>
                    </View>

                    <ItemSeparator style={{ backgroundColor: 'black' }} />

                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 15, marginLeft: 10 }} >
                        <TranslatedText text={'Quantity'} style={{ fontWeight: 'bold' }} />
                        <FontedText style={{ color: 'black', marginLeft: 20, fontSize: 12 }}>{`${data.Qty}`}</FontedText>
                    </View>

                    <ItemSeparator style={{ backgroundColor: 'black' }} />

                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 15, marginLeft: 10, }} >
                        <TranslatedText text={'ProductOptions'} style={{ fontWeight: 'bold' }} />
                        {this.renderOption(data.Options)}
                    </View>

                    <ItemSeparator style={{ backgroundColor: 'black' }} />

                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 15, marginLeft: 10 }} >
                        <TranslatedText text={'ReplyText'} style={{ fontWeight: 'bold' }} />
                        <FontedText style={{ color: 'black', marginLeft: 20, fontSize: 12 }}>{`${data.ReplyReview}`}</FontedText>
                    </View>

                    <ItemSeparator style={{ backgroundColor: 'black' }} />

                </View>
                <CustomInputForFastReply
                    onChangeText={(text) => {
                        this.setState({ replyText: text })
                    }}
                    placeholder={translate('Reply')}
                    style={{
                        textAlign: I18nManager.isRTL ? 'right' : 'left',
                        width: screenWidth,
                        ...shadowStyle0,
                        backgroundColor: 'white',
                        right: 0,
                        left: 0,
                        paddingLeft: 10,
                        alignSelf: 'center',
                        position: 'absolute', bottom: 2,
                        height: 50
                    }} />
            </LazyContainer>
        );
    }
}
export default withLocalize(Review)