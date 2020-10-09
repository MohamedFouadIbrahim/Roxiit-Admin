import React, { Component } from 'react'
import { ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import CustomHeader from '../../components/CustomHeader/index.js';
import { connect } from 'react-redux'
import LazyContainer from '../../components/LazyContainer'
import ItemSeparator from '../../components/ItemSeparator/index.js';
import HorizontalInput from '../../components/HorizontalInput/index.js';
import Ionicons from 'react-native-vector-icons/Ionicons'
import ConditionalCircularImage from '../../components/ConditionalCircularImage';
import { largePagePadding } from '../../constants/Style.js';
import { mainColor } from '../../constants/Colors';
import { withLocalize } from 'react-localize-redux';
import { OpenCamera, OpenSingleSelectImagePicker } from '../../utils/Image';
import { editETag, GeteTag } from '../../services/EtagsService.js';
import { STRING_LENGTH_LONG } from '../../constants/Config';
import CustomSelector from '../../components/CustomSelector/index';
import ArrowItem from '../../components/ArrowItem/index.js';
import HeaderSubmitButton from '../../components/HeaderSubmitButton/index.js';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import CustomLoader from '../../components/CustomLoader/index';
import { LongToast } from '../../utils/Toast.js';
import CustomTouchable from '../../components/CustomTouchable';

class Etag extends Component {
    constructor(props) {
        super(props);
        const { languages_data, currLang } = this.props
        this.state = {
            Language: languages_data.find(item => item.code === currLang),
            ImageUrl: '',
            Name: '',
            Description: '',
            lockSubmit: false,
            remoteImage: false
        }
        if (this.props.route.params && this.props.route.params?.etagId) {
            this.EditMode = true
            this.etagId = this.props.route.params?.etagId
        }
        else {
            this.EditMode = false
        }
        this.LibraryOrCameraRef = React.createRef();
        this.LibraryOrCameraOptions = [{ Id: 0, Name: 'Camera' }, { Id: 1, Name: 'Library' }]

        this.lockSubmit = false
        this.languageSelectorRef = React.createRef()
    }
    componentDidMount() {
        if (this.etagId) {
            this.canselFitchedData = this.fetchETag()
        }
    }
    submit = () => {
        // Image, Id, LanguageId, Name, Description
        if (this.lockSubmit) {
            return
        }
        const { Name, Description, Language } = this.state
        if (!Name) {
            return LongToast('CantHaveEmptyInputs')
        }

        if (this.EditMode) {
            const { Id, picker_image_uri, ImageData } = this.state
            this.lockSubmit = true
            this.setState({ lockSubmit: true, uploadingImage: true, prossesEvent: 0 })

            this.cancelFetchDataAddEditRole = editETag({
                Id,
                Name,
                Description,
                LanguageId: Language.key,
                Image: ImageData
            }, res => {
                this.setState({ didSucceed: true, uploadingImage: false, prossesEvent: 0 })
                this.props.route.params?.onChildChange && this.props.route.params?.onChildChange()
                this.props.navigation.goBack()
            }, err => {
                this.setState({ lockSubmit: false, uploadingImage: false, prossesEvent: 0 })
                this.lockSubmit = false
            }, (re) => {
                this.setState({ prossesEvent: re * 0.01 })
            })
        }
        else {
            const { Id, picker_image_uri, ImageData } = this.state
            this.lockSubmit = true
            this.setState({ lockSubmit: true, uploadingImage: true, prossesEvent: 0 })

            this.cancelFetchDataAddEditRole = editETag({
                Id: 0,
                Name,
                Description,
                LanguageId: Language.key,
                Image: ImageData
            }, res => {
                this.setState({ didSucceed: true, uploadingImage: false, prossesEvent: 0 })
                this.props.route.params?.onChildChange && this.props.route.params?.onChildChange()
                this.props.navigation.goBack()
            }, err => {
                this.setState({ lockSubmit: false, uploadingImage: false, prossesEvent: 0 })
                this.lockSubmit = false
            }, (re) => {
                this.setState({ prossesEvent: re * 0.01 })
            })
        }
    }

    fetchETag = (LanguageId = null) => {
        GeteTag(this.etagId, LanguageId, res => {
            const { LanguageId, ...restData } = res.data
            const { languages_data } = this.props

            this.setState({
                ...restData,
                Language: languages_data.find(item => item.key === LanguageId),
                didFetchData: true,
                remoteImage: true
            })
        })
    }
    componentWillUnmount() {
        this.canselFitchedData && this.canselFitchedData()
        // this.cancelFetchDatagetFilters && this.cancelFetchDatagetFilters()
        // this.cancelFetchDataeditETag && this.cancelFetchDataeditETag()
    }
    onSelectLanguage = (index) => {
        const { languages_data } = this.props
        const selectedLanguage = languages_data[index]
        if (this.EditMode) {
            this.setState({ ChangeToLanguage: selectedLanguage }, () => {
                this.fetchETag(this.state.ChangeToLanguage.key)
            })
        } else {
            this.setState({ ChangeToLanguage: selectedLanguage }, () => {
                // this.fetchPermissions(this.state.ChangeToLanguage.key)
            })
        }
    }
    rendereTag = () => {
        const { languages_data } = this.props
        const { ChangeToLanguage, Language } = this.state
        if (this.state.didFetchData || !this.EditMode) {
            return (
                <ScrollView
                    contentContainerStyle={{
                    }}>
                    <ArrowItem
                        onPress={() => {
                            this.languageSelectorRef.current.show()
                        }}
                        title="Language"
                        info={ChangeToLanguage ? ChangeToLanguage.label : Language.label} />

                    <ItemSeparator />

                    {this.renderImage()}

                    <ItemSeparator />

                    <HorizontalInput
                        maxLength={STRING_LENGTH_LONG}
                        label="Name"
                        value={this.state.Name}
                        onChangeText={(text) => { this.setState({ Name: text }) }} />

                    <ItemSeparator />

                    <HorizontalInput
                        label="Description"
                        value={this.state.Description}
                        onChangeText={(text) => { this.setState({ Description: text }) }} />

                    <ItemSeparator />

                    <CustomSelector
                        ref={this.languageSelectorRef}
                        options={languages_data.map(item => item.label)}
                        onSelect={(index) => { this.onSelectLanguage(index) }}
                        onDismiss={() => { }}
                    />
                </ScrollView>
            )
        }
    }

    AddEditImage = (chosseindex) => {
        if (chosseindex == 0) {

            OpenCamera(Data => {
                const {
                    uri,
                    path
                } = Data

                this.setState({
                    picker_image_uri: uri,
                    ImageData: path,
                    remoteImage: false
                })

            })

        } else {
            OpenSingleSelectImagePicker(Data => {
                const {
                    uri,
                    path
                } = Data
                this.setState({
                    picker_image_uri: uri,
                    ImageData: path,
                    remoteImage: false
                })
            })
        }
    }

    renderImage = () => {
        const imageSize = 90
        const { Icon, picker_image_uri, remoteImage } = this.state
        if (this.EditMode) {
            return (
                <CustomTouchable
                    onPress={() => {
                        this.LibraryOrCameraRef.current.show()
                    }}
                    style={{
                        alignSelf: 'center',
                        justifyContent: 'center',
                        alignItems: 'center',
                        margin: largePagePadding,
                        // backgroundColor: 'black'
                    }}>
                    <ConditionalCircularImage
                        remote={remoteImage}
                        uri={picker_image_uri || Icon.ImageUrl}
                        size={imageSize} />

                    <FontAwesome
                        style={{
                            position: 'absolute',
                            right: 2,
                            bottom: 2,
                        }}
                        name={`camera`}
                        size={20}
                        color={mainColor} />
                    {this.state.uploadingImage == true ?
                        <CustomLoader
                            size={imageSize - 30}
                            progress={this.state.prossesEvent == 0 ? this.state.prossesEvent : this.state.prossesEvent}
                        />
                        : null
                    }
                </CustomTouchable>
            )
        } else {
            const { picker_image_uri, remoteImage } = this.state

            return (
                <CustomTouchable
                    onPress={() => {
                        this.LibraryOrCameraRef.current.show()
                    }}
                    style={{
                        alignSelf: 'center',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#aaaaaa',
                        margin: largePagePadding,
                        width: imageSize,
                        height: imageSize,
                        borderRadius: imageSize / 2,
                    }}>
                    {picker_image_uri ? <ConditionalCircularImage
                        remote={remoteImage}
                        style={{ flex: 1 }}
                        uri={picker_image_uri}
                        size={imageSize} /> : <Ionicons
                            name={`ios-add`}
                            size={45}
                            color={'white'} />}
                    {this.state.uploadingImage == true ?
                        <CustomLoader
                            size={imageSize - 30}
                            progress={this.state.prossesEvent == 0 ? this.state.prossesEvent : this.state.prossesEvent}
                        />
                        : null
                    }
                </CustomTouchable>
            )
        }
    }



    render() {
        return (
            <LazyContainer style={{ flex: 1, backgroundColor: "#FFF" }}>
                <CustomHeader
                    navigation={this.props.navigation}
                    title={"ETag"}
                    rightComponent={
                        <HeaderSubmitButton
                            isLoading={this.state.lockSubmit}
                            didSucceed={this.state.didSucceed}
                            onPress={() => { this.submit() }} />
                    } />

                {/* {this.rendereTag()} */}

                {
                    Platform.OS == 'ios' ?

                        <KeyboardAvoidingView behavior='padding' enabled
                            style={{ flex: 1 }}
                            keyboardVerticalOffset={40}
                        >
                            {this.rendereTag()}
                        </KeyboardAvoidingView> :

                        this.rendereTag()

                }

                <CustomSelector
                    ref={this.LibraryOrCameraRef}
                    options={this.LibraryOrCameraOptions.map(item => item.Name)}
                    onSelect={(chosseindex) => {
                        this.AddEditImage(chosseindex)
                    }}
                    onDismiss={() => { }}
                />

            </LazyContainer>
        )
    }
}
const mapStateToProps = ({
    language: {
        languages_data,
        currLang,
    },
}) => ({
    languages_data,
    currLang,
})

export default connect(mapStateToProps)(withLocalize(Etag))