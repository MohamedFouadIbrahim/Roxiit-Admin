import React, { Component } from 'react'
import { ScrollView, Keyboard } from 'react-native'
import CustomHeader from '../../components/CustomHeader/index.js';
import LazyContainer from '../../components/LazyContainer'
import ItemSeparator from '../../components/ItemSeparator/index.js';
import HorizontalInput from '../../components/HorizontalInput/index.js';
import CircularImage from '../../components/CircularImage/index.js';
import { largePagePadding } from '../../constants/Style.js';
import { GeteTag, editETag } from "../../services/EtagsService";
import { withLocalize } from 'react-localize-redux';
import { showImagePicker } from '../../utils/Image';
import { STRING_LENGTH_LONG } from '../../constants/Config'
import CustomSelector from '../../components/CustomSelector/index';
import { mainColor } from '../../constants/Colors.js';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import ArrowItem from '../../components/ArrowItem/index.js';
import HeaderSubmitButton from '../../components/HeaderSubmitButton/index.js';
import { connect } from 'react-redux'
import { LongToast } from '../../utils/Toast.js';
import CustomTouchable from '../../components/CustomTouchable';

class EtagScreen extends Component {
    _menu = null;
    constructor(props) {
        super(props);
        const { languages_data, currLang } = this.props
        this.state = {
            fetching: true,
            etag: undefined,
            editMode: false,
            submitingETag: false,
            ImageUrl: '',
            name: '',
            description: '',
            languages: [],
            selectedLang: {
                Id: null,
                Name: 'select language',
            },
        }
        this.languageSelectorRef = React.createRef()
        this.locksSubmit = false
    }

    componentWillUnmount() {
        // this.cancelFetchDatagetFilters && this.cancelFetchDatagetFilters()
        // this.cancelFetchDataGeteTag && this.cancelFetchDataGeteTag()
        this.cancelFetchDataeditETag && this.cancelFetchDataeditETag()
        this.cancelFetchData && this.cancelFetchData()
    }
    componentDidMount() {
        this.fetcheTag(this.props.route.params?.etagId)
    }
    componentDidUpdate(prevProps) {
        if (this.props.navigation !== prevProps.navigation) {
            this.fetcheTag(this.props.route.params?.etagId)
        }
    }
    fetcheTag = (language_id = null) => {

        this.cancelFetchData = GeteTag(this.roleId, language_id, res => {
            const { LanguageId, ...restData } = res.data
            const { languages_data } = this.props

            this.setState({
                ...restData,
                Language: languages_data.find(item => item.key === LanguageId),
                didFetchData: true,
            })
        })
    }

    // fetcheTag = (Id) => {
    //     this.cancelFetchDatagetFilters = getFilters({ languages: true, }, (result) => {
    //         this.cancelFetchDataGeteTag = GeteTag(Id, (res) => {
    //             this.setState({
    //                 etag: res.data,
    //                 name: res.data.Name,
    //                 description: res.data.Description,
    //                 ImageUrl: res.data.Icon.ImageUrl,
    //                 fetching: false,
    //                 languages: result.data.Languages,
    //                 selectedLang: { Id: res.data.LanguageId, Name: result.data.Languages.filter((lang) => lang.Id == res.data.LanguageId)[0].Name },
    //                 // [0].Name
    //                 //  },
    //             })
    //         }, (err) => {
    //             alert(err)
    //         })
    //     });

    // }

    submiteTag = () => {
        if (this.locksSubmit) {
            return
        }
        Keyboard.dismiss()
        const { name, description, etag, ImageData } = this.state

        const Id = this.props.route.params?.etagId
        const args = { Id, LanguageId: this.state.selectedLang.Id, Name: name, Description: description, Image: ImageData }
        if (!name || !description) {
            this.setState({ submitingETag: false })
            return LongToast('CantHaveEmptyInputs')
        }
        // if (this.state.etag.Icon.ImageUrl != this.state.ImageUrl)
        //     args.Image = this.state.ImageUrl
        this.setState({ submitingETag: true })
        this.locksSubmit = false
        this.cancelFetchDataeditETag = editETag(args, (res) => {
            this.setState({ didSucceed: true, submitingETag: false })
            this.locksSubmit = true
            this.props.route.params?.onChildChange && this.props.route.params?.onChildChange()
            this.props.navigation.goBack()
        }, (err) => {
            this.setState({ submitingETag: false })
            this.locksSubmit = false
        })

    }


    renderETag = () => {
        return (
            <ScrollView
                contentContainerStyle={{
                }}>

                <ArrowItem
                    onPress={() => {
                        this.languageSelectorRef.current.show()
                    }}
                    title="Language"
                    info={this.state.selectedLang.Name} />

                <ItemSeparator />

                {this.renderImage()}


                <HorizontalInput
                    maxLength={STRING_LENGTH_LONG}
                    label="Name"
                    value={this.state.name}
                    onChangeText={(text) => { this.setState({ name: text }) }} />

                <ItemSeparator />

                <HorizontalInput
                    label="Description"
                    value={this.state.description}
                    onChangeText={(text) => { this.setState({ description: text }) }} />

                <ItemSeparator />

                <CustomSelector
                    ref={this.languageSelectorRef}
                    options={this.state.languages.map(item => item.Name)}
                    onSelect={(index) => {
                        this.setState({ selectedLang: this.state.languages[index] })
                    }}
                    onDismiss={() => { }}
                />
                <ItemSeparator />


            </ScrollView>
        )
    }

    renderImage = () => {
        const imageSize = 90
        const { ImageUrl } = this.state
        return (
            <CustomTouchable
                activeOpacity={1}
                onPress={() => showImagePicker((Data) => {
                    if (Data) {
                        const { uri, path } = Data
                        this.setState({ ImageUrl: uri, ImageData: path })
                    }
                })}
                style={{ justifyContent: 'center', alignItems: 'center', padding: largePagePadding, }}>
                <CircularImage
                    uri={ImageUrl}
                    size={imageSize} />

                <FontAwesome
                    style={{
                        // position: 'absolute',
                        left: 30,
                        bottom: 20,
                    }}
                    name={`camera`}
                    size={20}
                    color={mainColor} />
            </CustomTouchable>
        )
    }

    render() {
        return (
            <LazyContainer style={{ flex: 1, backgroundColor: "#FFF" }}>
                <CustomHeader
                    navigation={this.props.navigation}
                    title={"ETag"}
                    rightComponent={
                        <HeaderSubmitButton
                            isLoading={this.state.submitingETag}
                            didSucceed={this.state.didSucceed}
                            onPress={() => { this.submiteTag() }} />
                    } />
                {
                    this.state.fetching ? null : this.renderETag()
                }
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

export default connect(mapStateToProps)(withLocalize(EtagScreen))