import React from 'react';
import { ScrollView, View, Platform, KeyboardAvoidingView } from 'react-native';
import { connect } from 'react-redux';
import ArrowItem from '../../components/ArrowItem';
import MultiImageUplaoder from '../../components/CustomMultiImageUploader';
import CustomSelector from '../../components/CustomSelector';
import FontedText from '../../components/FontedText';
import HorizontalInput from '../../components/HorizontalInput';
import ItemSeparator from '../../components/ItemSeparator';
import LazyContainer from '../../components/LazyContainer';
import TranslatedText from '../../components/TranslatedText';
import { secondTextColor, mainColor } from '../../constants/Colors';
import { STRING_LENGTH_MEDIUM } from '../../constants/Config';
import { largePagePadding, smallBorderRadius } from '../../constants/Style';
import { showImagePicker, OpenMultiSelectImagePicker, OpenCamera } from '../../utils/Image';
import CustomTouchable from '../../components/CustomTouchable';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { GetAllCurrencies } from '../../services/ProductService';

class NewProudctsRequiredfeilds extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            picker_image_uri: null,
            lockSubmit: false,
            didFetchData: false,
            selectedCategories: [],
            x: 0,
            y: 0,
            AllCurrencies: [],
            fixClipBoardInputWidth: "99%"
        }
        this.languageSelectorRef = React.createRef();
        this.deleteImageRef = React.createRef()
        this.LibraryOrCameraRef = React.createRef();
        this.currencySelectorRef = React.createRef();
        this.LibraryOrCameraOptions = [{ Id: 0, Name: 'Camera' }, { Id: 1, Name: 'Library' }]
        this.tabIndex = 0
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({ fixClipBoardInputWidth: '100%' })
        }, 100)
    }

    componentDidUpdate() {
        const { y } = this.state
        this.MultiImageUplaoderRef && this.MultiImageUplaoderRef.scrollTo({ x: y, y: 0, animated: true })
    }

    AddEditImage = (index, IsEditMode, chosseindex) => {
        const { Images } = this.props.data
        if (IsEditMode) { // Edit Image Uri

            showImagePicker((Data) => {
                if (Data) {
                    const { uri, path } = Data
                    const OurImages = Images
                    OurImages[index] = {
                        ...Data,
                        Id: index,
                        picker_image_uri: uri,
                        picker_image_Path: path,
                        IsLoading: false,
                        prossesEvent: 0
                    }

                    const newArray = OurImages.map((item, index) => ({ ...item, Id: index }))
                    this.props.onTabDataChange(this.tabIndex, {
                        ...this.props.data,
                        Images: newArray,
                    })
                }
            })
        } else {
            if (chosseindex == 0) {
                OpenCamera(imags => {
                    if (imags) {
                        const { path } = imags
                        const OurImages = Images

                        OurImages[index] = {
                            ...imags,
                            Id: index,
                            picker_image_uri: path,
                            picker_image_Path: path,
                            IsLoading: false,
                            prossesEvent: 0
                        }

                        const newArray = OurImages.map((item, index) => ({ ...item, Id: index }))

                        this.props.onTabDataChange(this.tabIndex, {
                            ...this.props.data,
                            Images: newArray,
                        })
                    }
                })
            }
            else {
                OpenMultiSelectImagePicker(imags => {
                    if (imags && imags.length) {
                        const NewImage = imags.map(item => ({
                            ...item,
                            Id: index,
                            picker_image_uri: `data:${item.mime};base64,${item.data}`,
                            picker_image_Path: item.path,
                            IsLoading: false,
                            prossesEvent: 0
                        }))

                        const NewData = [...NewImage, ...Images].map((item, index) => ({ ...item, Id: index }))

                        this.props.onTabDataChange(this.tabIndex, {
                            ...this.props.data,
                            Images: NewData,
                        })
                    }
                })
            }
        }
    }

    getNumberIfThereDecimalPoints = (Num) => {
        const ret = Num.toFixed(2);
        return ret
    }

    renderCurrency = () => {
        const { Currency } = this.props
        return (
            <CustomTouchable
                onPress={() => {
                    GetAllCurrencies(res => {
                        this.setState({
                            AllCurrencies: res.data.Data,
                        })
                        this.currencySelectorRef.current.show()
                    })
                }}
                style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingRight: 10,
                    paddingVertical: 8,
                    backgroundColor: mainColor,
                    borderRadius: smallBorderRadius,
                    marginHorizontal: largePagePadding,
                    maxWidth: 250
                }}>
                <FontedText style={{ color: 'white', fontSize: 10, textAlign: 'left', paddingLeft: 5 }}>{(Currency ? Currency.Name : "")}</FontedText>

                <Ionicons
                    name={"md-arrow-dropdown"}
                    size={18}
                    color={'white'}
                    style={{
                        marginLeft: 5,
                    }} />
            </CustomTouchable>)
    }

    renderContent = () => {
        const { Language, Name, AltName, ShortDescription, Price, SalePrice, Images = [], RealPrice, prossesEvent } = this.props.data;
        const { Currency, lockSubmit } = this.props
        return (
            <ScrollView
                style={{
                    backgroundColor: 'white'
                }}
            >
                <ArrowItem
                    onPress={() => {
                        this.languageSelectorRef.current.show()
                    }}
                    title={'Language'}
                    info={Language.label} />

                <ItemSeparator />

                <MultiImageUplaoder

                    IsLoading={lockSubmit}
                    prossesEvent={prossesEvent}
                    onContentSizeChange={(weight, hieght) => {
                        this.setState({
                            x: hieght,
                            y: weight
                        })
                    }}
                    refrence={(f) => { this.MultiImageUplaoderRef = f }}
                    Images={Images}
                    onPress={(index, IsEditMode) => {
                        this.imagIndex = index;
                        this.IsEditMode = IsEditMode;
                        if (IsEditMode == true) {

                            this.AddEditImage(index, IsEditMode)

                        } else {
                            this.LibraryOrCameraRef.current.show()
                        }
                    }}
                    onLongPress={(id) => {
                        this.DeleteId = id
                        this.deleteImageRef.current.show()
                    }}
                />

                <ItemSeparator />

                <HorizontalInput
                    maxLength={STRING_LENGTH_MEDIUM}
                    label="Name"
                    value={Name}
                    style={{ width: this.state.fixClipBoardInputWidth }}
                    onChangeText={(value) => {
                        this.props.onTabDataChange(this.tabIndex, {
                            ...this.props.data,
                            Name: value,
                        }, false)
                    }} />

                <ItemSeparator />

                <HorizontalInput
                    maxLength={STRING_LENGTH_MEDIUM}
                    label="AltName"
                    value={AltName}
                    style={{ width: this.state.fixClipBoardInputWidth }}
                    onChangeText={(value) => {
                        this.props.onTabDataChange(this.tabIndex, {
                            ...this.props.data,
                            AltName: value,
                        }, false)
                    }} />

                <ItemSeparator />

                <HorizontalInput
                    maxLength={STRING_LENGTH_MEDIUM}
                    label="ShortDescription"
                    value={ShortDescription}
                    style={{ width: this.state.fixClipBoardInputWidth }}
                    onChangeText={(value) => {
                        this.props.onTabDataChange(this.tabIndex, {
                            ...this.props.data,
                            ShortDescription: value,
                        }, false)
                    }} />

                <ItemSeparator />

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <HorizontalInput
                        containerStyle={{ flex: 1 }}
                        label="Price"
                        keyboardType="numeric"
                        value={Price}
                        style={{ width: this.state.fixClipBoardInputWidth }}
                        onChangeText={(value) => {
                            this.props.onTabDataChange(this.tabIndex, {
                                ...this.props.data,
                                Price: value,
                            }, false)
                        }}
                    />
                    {this.renderCurrency()}
                </View>

                <ItemSeparator />

                {
                    SalePrice && Price ? <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: largePagePadding, flex: 1, paddingVertical: 15, opacity: 0.4 }} >
                        <TranslatedText style={{ color: secondTextColor, fontSize: 16, flex: 2 }} text={'Saving'} />
                        {/* <FontedText  >{'Saving'}</FontedText> */}
                        <View style={{
                            flexDirection: 'row', justifyContent: 'space-between',
                            flex: 5,
                            paddingLeft: 70,
                            paddingRight: 20
                        }} >
                            <FontedText style={{ color: secondTextColor, fontSize: 16, }} >{`${this.getNumberIfThereDecimalPoints(Price - SalePrice)} ${(Currency ? Currency.Name : "")}`}</FontedText>
                            <FontedText style={{ color: secondTextColor, fontSize: 16, }} >{`${this.getNumberIfThereDecimalPoints(((Price - SalePrice) / Price) * 100)}%`}</FontedText>
                        </View>
                    </View> : null
                }


                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <HorizontalInput
                        containerStyle={{ flex: 1 }}
                        label="SalePrice"
                        keyboardType="numeric"
                        value={SalePrice}
                        style={{ width: this.state.fixClipBoardInputWidth }}
                        onChangeText={(text) => {
                            if (parseInt(text, 10) <= parseInt(Price, 10)) {                            // this.setState({ SalePrice: text })
                                // this.setState({ SalePrice: text })
                                this.props.onTabDataChange(this.tabIndex, {
                                    ...this.props.data,
                                    SalePrice: text,
                                }, false)

                            } else if (!text || text == null || text == '') {
                                // this.setState({ SalePrice: null })
                                this.props.onTabDataChange(this.tabIndex, {
                                    ...this.props.data,
                                    SalePrice: null,
                                }, false)
                            }
                        }}
                    />
                    {this.renderCurrency()}
                </View>
                <ItemSeparator />


                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <HorizontalInput
                        containerStyle={{ flex: 1 }} label="RealPrice"
                        keyboardType="numeric"
                        value={RealPrice}
                        style={{ width: this.state.fixClipBoardInputWidth }}
                        onChangeText={(value) => {
                            this.props.onTabDataChange(this.tabIndex, {
                                ...this.props.data,
                                RealPrice: value,
                            }, false)
                        }} />
                    {this.renderCurrency()}
                </View>
            </ScrollView >)
    }

    render() {

        const { languages_data } = this.props

        const { AllCurrencies } = this.state
        return (
            <LazyContainer style={{ flex: 1 }} >

                {Platform.OS == 'ios' ?
                    <KeyboardAvoidingView behavior='padding' enabled
                        // style={{ flex: 1 }}
                        keyboardVerticalOffset={120}
                    >
                        {this.renderContent()}
                    </KeyboardAvoidingView> :
                    this.renderContent()
                }
                <CustomSelector
                    ref={this.languageSelectorRef}
                    options={languages_data.map(item => item.label)}
                    onSelect={(index) => {
                        this.props.onTabDataChange(this.tabIndex, {
                            ...this.props.data,
                            Language: languages_data[index]
                        })
                    }}
                    onDismiss={() => { }}
                />

                <CustomSelector
                    ref={this.LibraryOrCameraRef}
                    options={this.LibraryOrCameraOptions.map(item => item.Name)}
                    onSelect={(chosseindex) => {
                        this.AddEditImage(this.imagIndex, this.IsEditMode, chosseindex)
                    }}
                    onDismiss={() => { }}
                />

                <CustomSelector
                    ref={this.deleteImageRef}
                    options={['Delete']}
                    onSelect={(index) => {
                        const { Images } = this.props.data
                        const NewData = Images.filter(item => item.Id != Images[this.DeleteId].Id).map((item, index) => ({ ...item, Id: index }))
                        this.props.onTabDataChange(this.tabIndex, {
                            ...this.props.data,
                            Images: NewData
                        })
                    }}
                    onDismiss={() => { }}
                />

                {AllCurrencies && <CustomSelector
                    ref={this.currencySelectorRef}
                    options={AllCurrencies.map(item => item.Name)}
                    onSelect={(index) => {
                        this.props.onTabDataChange(null, {   //because the change affects all the tabs
                            // ...this.props.data,
                            Currency: AllCurrencies[index]
                        })
                    }}
                    onDismiss={() => { }}
                />}
            </LazyContainer>
        )
    }
}

const mapStateToProps = ({
    language: {
        languages_data,
        currLang
    },
    login: {
        user_data,
        hello_data
    },
}) => ({
    languages_data,
    currLang,
    user_data,
    hello_data,
})


export default connect(mapStateToProps)(NewProudctsRequiredfeilds)