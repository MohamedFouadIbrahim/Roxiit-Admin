import React from 'react';
import { View, ScrollView, TextInput, I18nManager, FlatList, Keyboard } from 'react-native';
import { withLocalize } from 'react-localize-redux';
import CustomHeader, { headerHeight } from '../../components/CustomHeader/index.js';
import { largePagePadding, pagePadding, largeBorderRadius, shadowStyle0 } from '../../constants/Style.js';
import { screenWidth } from '../../constants/Metrics';
import CircularImage from '../../components/CircularImage/index';
import FontedText from '../../components/FontedText/index';
import TranslatedText from '../../components/TranslatedText/index';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { GetQuestionById, SendAnswer, DeleteAnswer } from '../../services/QuestionService';
import { mainColor, secondColor } from '../../constants/Colors';
import StarRating from 'react-native-star-rating';
import ItemSeparator from '../../components/ItemSeparator/index';
import SettingsTitle from '../../components/Settings/SettingsTitle.js';
import HeaderSubmitButton from '../../components/HeaderSubmitButton/index';
import LazyContainer from '../../components/LazyContainer/index.js';
import { SwipeRow } from 'react-native-swipe-list-view';
import DeleteButton from '../../components/DeleteButton/index.js';
import CustomInputForFastReply from '../../components/CustomInputForFastReply/index';
import CustomSelectorForDeleteAndEdit from '../../components/CustomSelectorForDeleteAndEdit/index';
import { LongToast } from '../../utils/Toast.js';
import CustomTouchable from '../../components/CustomTouchable';

class Question extends React.Component {
    constructor(props) {
        super(props)
        this.statusRef = React.createRef()
        if (this.props.route.params && this.props.route.params?.Id) {
            this.editMode = true
            this.questionId = this.props.route.params?.Id,
                this.lockSubmet = false
        }
    }
    state = {
        data: null,
        triggerRefresh: false,
        searchBarShown: false,
        searchingFor: '',
        isPopupVisible: false,
        statusList: [],
        triggerRefresh: false,
        Product: {
            Name: '', ShortDescription: '', Rating: '', Type: { Name: '', Id: '' }, Icon: { ImageUrl: '' }, Id: ''
        },
        Customer: {
            FullName: '',
            Type: { Name: '' },
            Media: { ImageUrl: '' }
        }, QuestionText: '',
        Likes: '',
        Answers: [],
        dataFitched: false,
        showCustomSelectorForDeleteref: false,
        Loading: false
    }

    renderProudct = (Name, ShortDescription, Rating, Type, Id, Icon) => {
        return (
            <View style={{
                backgroundColor: 'white',
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: largePagePadding,
                paddingVertical: pagePadding,
            }}>
                <CircularImage
                    uri={Icon.ImageUrl}
                    id={Id} />
                <View style={{ justifyContent: 'center', alignItems: 'flex-start', position: 'absolute', left: 90 }}>
                    <FontedText style={{ color: 'black', marginTop: 10, fontSize: 14 }}>{`${Name.slice(0, 25)}`}</FontedText>
                    <FontedText style={{ color: 'black', marginTop: 10 }}>{`${ShortDescription.slice(0, 30)}`}</FontedText>
                </View>
                <View>
                    <StarRating
                        disabled={true}
                        maxStars={5}
                        fullStarColor="#FFC600"
                        starSize={15}
                        rating={parseInt(Rating, 10)}
                    />
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingHorizontal: 10,
                        paddingVertical: 4,
                        backgroundColor: mainColor,
                        marginTop: 15,
                        borderRadius: largeBorderRadius,
                    }}  >
                        <FontedText style={{ color: 'white', fontSize: 10, }}>{Type.Name}</FontedText>
                    </View>
                </View>
            </View>
        )

    }
    renderCustomer = (FullName, ImageUrl, Type, Id) => {
        return (
            <View style={{
                justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: largePagePadding,
                paddingVertical: pagePadding,
                backgroundColor: 'white',
            }} >
                <CircularImage
                    uri={ImageUrl}
                    id={Id} />
                <FontedText style={{ color: 'black', position: 'absolute', left: 90, top: 25 }}>{`${FullName.slice(0, 30)}`}</FontedText>
                <View>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingHorizontal: 10,
                        paddingVertical: 4,
                        backgroundColor: mainColor,
                        borderRadius: largeBorderRadius,
                        marginTop: 15,
                    }}  >
                        <FontedText style={{ color: 'white', fontSize: 10, }}>{Type.Name}</FontedText>
                    </View>
                </View>
            </View>
        )
    }
    componentWillUnmount() {
        this.cancelFetchData && this.cancelFetchData()
        this.cancelFetchDataSendAnswer && this.cancelFetchDataSendAnswer()
        this.cancelFetchDataDeleteAnswer && this.cancelFetchDataDeleteAnswer()
    }
    componentDidMount() {
        this.cancelFetchData = GetQuestionById(this.props.route.params?.Id, res => {
            this.setState({ Product: res.Product, Customer: res.Customer, QuestionText: res.QuestionText, Likes: res.Likes, Answers: res.Answers, dataFitched: true })
        })
    }
    renderQuestion = (QuestionText, Likes) => {
        return (
            <View style={{
                backgroundColor: 'white',
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: largePagePadding,
                paddingVertical: pagePadding,
            }}>
                <View style={{ marginLeft: 5 }} >
                    <TranslatedText style={{ color: 'black', fontSize: 15, marginTop: 5 }} text={'QuestionText'} />
                    <FontedText style={{ color: 'black', fontSize: 12, marginTop: 5, paddingLeft: 10 }}>{QuestionText}</FontedText>
                </View>
                <View style={{ marginTop: 10 }} >
                    <AntDesign name='like1' size={20} color='#d1d4d6' />
                    <FontedText style={{ color: 'black', fontSize: 10, }}>{Likes}</FontedText>
                </View>
            </View>
        )

    }
    renderAswer = (Answers) => {
        return (
            <FlatList
                keyExtractor={({ Id }) => `${Id}`}
                data={Answers}
                renderItem={({ item, index }) => (
                    <CustomTouchable
                        key={index}
                        onLongPress={() => {
                            this.DeleteOrEditId = item.Id
                            this.setState({ showCustomSelectorForDeleteref: true })
                        }}
                    >
                        <View style={{
                            justifyContent: 'space-between',
                            flexDirection: 'row',
                            marginTop: 10,
                            paddingHorizontal: largePagePadding,
                            backgroundColor: 'white',
                            paddingVertical: 5
                        }} >
                            <CircularImage
                                uri={item.answeredBy.Media.ImageUrl}
                                id={item.Id}
                                style={{ marginLeft: 10 }}
                            />
                            <View style={{ justifyContent: 'center', alignItems: 'flex-start', position: 'absolute', left: 100, }}  >
                                <FontedText style={{ color: 'black', marginTop: 5 }}>{`${item.answeredBy.FullName.slice(0, 30)}`}</FontedText>
                                <FontedText style={{ color: 'black', marginTop: 5, alignSelf: 'center' }}>{`${item.AnswerText}`}</FontedText>
                            </View>
                        </View>
                        {Answers.length === index + 1 ? null :
                            <ItemSeparator style={{ marginHorizontal: largeBorderRadius, marginTop: 10 }} />
                        }
                    </CustomTouchable>
                )}
            />
        )
    }
    renderDeletebutton = (item) => {
        const { Id } = item
        return (
            <View
                style={{
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                    height: '100%',
                    // padding: 20,
                    width: '100%',
                }}>
                <DeleteButton
                    style={{ marginRight: 20 }}
                    onPress={() => {
                        this.lockSubmet = true
                        this.setState({ lockSubmit: true })
                        DeleteAnswer(Id, (res) => {
                            this.setState({
                                Answers: this.state.Answers.filter(filterItem => filterItem.Id !== Id),
                                lockSubmit: false
                            })
                        }, err => {

                            this.lockSubmet = false
                            this.setState({ lockSubmit: false })
                        })
                    }} />
            </View>
        )
    }
    onSend = () => {
        if (!this.state.AnswerTextFomMe || this.state.AnswerTextFomMe == '') {
            return LongToast('CantHaveEmptyInputs')
        }
        this.setState({ lockSubmit: true })
        this.lockSubmit = true
        const QuestionId = this.props.route.params?.Id
        const AnswerText = this.state.AnswerTextFomMe
        const DataArgs = { QuestionId, AnswerText, Id: 0 }
        Keyboard.dismiss()
        this.cancelFetchDataSendAnswer = SendAnswer(DataArgs, res => {
            if (res.status == 200) {
                this.setState({ lockSubmit: false, didSucceed: true })
                this.lockSubmit = false
                this.props.route.params?.onChildChange && this.props.route.params?.onChildChange()
                this.props.navigation.goBack()
                return LongToast('AnswerSended')
            }
        }, err => {
            this.setState({ lockSubmit: false })
            this.lockSubmit = false
        })
    }
    render() {
        const { translate } = this.props
        const { dataFitched } = this.state
        if (dataFitched == false) {
            return null
        }
        const { Name, ShortDescription, Rating, Id, Icon } = this.state.Product;
        const { Type } = this.state.Customer;
        return (
            <LazyContainer style={{ flex: 1, backgroundColor: '#F4F6F9', paddingBottom: 50 }} >
                <ScrollView  >
                    <CustomHeader
                        leftComponent="back"
                        navigation={this.props.navigation}
                        title="Question"
                        rightNumOfItems={1}
                        rightComponent={
                            <HeaderSubmitButton
                                isLoading={this.state.lockSubmit}
                                didSucceed={this.state.didSucceed}
                                onPress={this.onSend} />
                        } />
                    {this.renderProudct(Name, ShortDescription, Rating, Type, Id, Icon)}
                    <ItemSeparator style={{ marginHorizontal: largeBorderRadius + 20, }} />
                    {this.renderCustomer(this.state.Customer.FullName, this.state.Customer.Media.ImageUrl, this.state.Customer.Type, this.state.Customer.Id)}
                    <ItemSeparator style={{ marginHorizontal: largeBorderRadius + 20, }} />
                    {this.renderQuestion(this.state.QuestionText, this.state.Likes)}
                    <ItemSeparator style={{ marginHorizontal: largeBorderRadius + 20, }} />
                    <SettingsTitle title={"Answers"} textStyle={{ marginLeft: 5, color: 'black' }} />
                    {this.state.Answers.length > 0 ?
                        <View
                            style={{
                                backgroundColor: 'white',
                                paddingBottom: 10,
                                marginBottom: 20,
                                paddingHorizontal: 0,
                                marginHorizontal: 0
                            }}>
                            {this.renderAswer(this.state.Answers)}
                        </View> : null
                    }
                </ScrollView>
                <CustomInputForFastReply
                    onChangeText={(text) => {
                        this.setState({ AnswerTextFomMe: text })
                    }}
                    placeholder={translate('AnswerNow')}
                    containerStyle={{
                        position: 'absolute', bottom: 2,
                    }}
                    style={{
                        width: screenWidth,
                        ...shadowStyle0,
                        backgroundColor: 'white',
                        color: 'black',
                        paddingLeft: 10,
                        alignSelf: 'center',
                        height: 50,
                    }} />

                <CustomSelectorForDeleteAndEdit
                    showCustomSelectorForDeleteref={this.state.showCustomSelectorForDeleteref}
                    justForDelete={true}
                    onCancelDelete={() => {
                        this.setState({ showCustomSelectorForDeleteref: false })
                    }}
                    onCancelConfirm={() => {
                        this.setState({ showCustomSelectorForDeleteref: false })
                    }}
                    onDelete={() => {
                        this.setState({ Loading: true, showCustomSelectorForDeleteref: false })

                        this.cancelFetchDataDeleteAnswer = DeleteAnswer(this.DeleteOrEditId, (res) => {
                            this.setState({
                                Answers: this.state.Answers.filter(filterItem => filterItem.Id !== this.DeleteOrEditId),
                                showCustomSelectorForDeleteref: false,
                                Loading: false
                            })
                            LongToast('dataDeleted')

                        }, err => {
                            // alert(err)
                            this.setState({ Loading: false })
                        })
                    }}
                />
            </LazyContainer>
        );
    }
}
export default withLocalize(Question)