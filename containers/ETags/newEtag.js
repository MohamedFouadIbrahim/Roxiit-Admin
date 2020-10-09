import React, { Component } from 'react'
import { ScrollView, Keyboard } from 'react-native'
import CustomHeader from '../../components/CustomHeader/index.js';
import LazyContainer from '../../components/LazyContainer'
import ItemSeparator from '../../components/ItemSeparator/index.js';
import HorizontalInput from '../../components/HorizontalInput/index.js';
import Ionicons from 'react-native-vector-icons/Ionicons'
import CircularImage from '../../components/CircularImage/index.js';
import { largePagePadding } from '../../constants/Style.js';
import { withLocalize } from 'react-localize-redux';
import { showImagePicker } from '../../utils/Image';
import { editETag } from '../../services/EtagsService.js';
import { getFilters } from '../../services/FilterService.js';
import { STRING_LENGTH_LONG } from '../../constants/Config';
import CustomSelector from '../../components/CustomSelector/index';
import ArrowItem from '../../components/ArrowItem/index.js';
import HeaderSubmitButton from '../../components/HeaderSubmitButton/index.js';
import { LongToast } from '../../utils/Toast.js';
import CustomTouchable from '../../components/CustomTouchable';

class newEtag extends Component {
    _menu = null;
    constructor(props) {
        super(props);
        this.state = {
            fetching: false,
            editMode: true,
            submitingeTag: false,

            // cat inputs
            ImageUrl: '',
            name: '',
            description: '',
            languages: [],
            selectedLang: {
                Id: null,
                Name: null,
            },
        }
        this.languageSelectorRef = React.createRef()

    }

    componentDidMount() {
        this.fetchContent()
    }
    fetchContent = () => {
        this.cancelFetchDatagetFilters = getFilters({ languages: true, }, (result) => {
            this.setState({
                fetching: false,
                languages: result.data.Languages,
                // selectedLang: { Id: result.data.LanguageId, Name: result.data.Languages.filter((lang) => lang.Id == result.data.LanguageId)[0].Name },
            })
        });
    }
    componentWillUnmount() {
        this.cancelFetchDatagetFilters && this.cancelFetchDatagetFilters()
        this.cancelFetchDataeditETag && this.cancelFetchDataeditETag()
    }
    submiteTag = () => {
        Keyboard.dismiss()
        const { name, description } = this.state
        // TODO: change LanguageId here
        const args = { Id: 0, LanguageId: 1, Name: name, Description: description, }
        if (!name || !description) {
            this.setState({ submitingETag: false })
            return LongToast('CantHaveEmptyInputs')
        }
        if (this.state.ImageUrl.length > 0)
            args.Image = this.state.ImageUrl
        this.setState({ submitingeTag: true })
        this.cancelFetchDataeditETag = editETag(args, (res) => {
            this.setState({ didSucceed: true, submitingETag: false })
            this.props.route.params?.onChildChange && this.props.route.params?.onChildChange()
            this.props.navigation.goBack()
        }, (err) => {
            this.setState({ submitingeTag: false })
        })
    }

    rendereTag = () => {
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

                <ItemSeparator />

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
            <CustomTouchable activeOpacity={1} onPress={() => this.setState({ editMode: false })} style={{ margin: largePagePadding * 2, justifyContent: 'center', alignItems: 'center', padding: largePagePadding, }}>
                <CustomTouchable activeOpacity={1} onPress={() => this.setState({ editMode: true })}>
                    {
                        ImageUrl.length > 0 && ImageUrl != null ?
                            <CircularImage
                                uri={ImageUrl}
                                size={imageSize} />
                            :
                            null
                    }
                </CustomTouchable>
                {
                    this.state.editMode ?
                        <CustomTouchable activeOpacity={1}
                            onPress={() => showImagePicker((uri) => {
                                if (uri)
                                    this.setState({ ImageUrl: uri, editMode: false })
                            })}
                            style={{
                                position: 'absolute',
                                alignSelf: 'center',
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: 'rgba(0, 0, 0, .5)',
                                width: imageSize,
                                height: imageSize,
                                borderRadius: imageSize / 2,
                            }}>
                            <Ionicons
                                name={`ios-add`}
                                size={45}
                                color={'white'} />
                        </CustomTouchable>
                        : null
                }
            </CustomTouchable>
        )
    }

    render() {
        return (
            <LazyContainer style={{ flex: 1, backgroundColor: "#FFF" }}>
                <CustomHeader
                    navigation={this.props.navigation}
                    title={"createNewetag"}
                    rightComponent={
                        <HeaderSubmitButton
                            isLoading={this.state.submitingeTag}
                            didSucceed={this.state.didSucceed}
                            onPress={this.submiteTag} />
                    } />
                {
                    this.state.fetching ? null : this.rendereTag()
                }
            </LazyContainer>
        )
    }
}

export default withLocalize(newEtag)