import React, { Component } from 'react'
import { ScrollView,  View, Text, Keyboard, ActivityIndicator } from 'react-native'
import CustomHeader from '../../components/CustomHeader/index.js';
import LazyContainer from '../../components/LazyContainer'
import ItemSeparator from '../../components/ItemSeparator/index.js';
import HorizontalInput from '../../components/HorizontalInput/index.js';
import Ionicons from 'react-native-vector-icons/Ionicons'
import CircularImage from '../../components/CircularImage/index.js';
import { largePagePadding } from '../../constants/Style.js';
import TranslatedText from '../../components/TranslatedText/index.js';
import { withLocalize } from 'react-localize-redux';
import { showImagePicker } from '../../utils/Image';
import { editETag } from '../../services/EtagsService.js';
import Menu, { MenuItem } from 'react-native-material-menu';
import { getFilters } from '../../services/FilterService.js';
import { STRING_LENGTH_LONG } from '../../constants/Config';
import FontedText from '../../components/FontedText/index';
import { LongToast } from '../../utils/Toast.js';
import { secondTextColor } from '../../constants/Colors.js';
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
                Name: 'select language',
            },
        }
    }

    componentDidMount() {
        this.fetchContent()
    }
    fetchContent = () => {
        this.cancelFetchDatagetFilters = getFilters({ languages: true, }, (result) => {
            this.setState({
                fetching: false,
                languages: result.data.Languages,
                selectedLang: { Id: res.data.LanguageId, Name: result.data.Languages.filter((lang) => lang.Id == res.data.LanguageId)[0].Name },
            })
        });

    }
    componentWillUnmount() {
        this.cancelFetchDataeditETag && this.cancelFetchDataeditETag()
        this.cancelFetchDatagetFilters && this.cancelFetchDatagetFilters()
    }
    submiteTag = () => {
        Keyboard.dismiss()
        this.setState({ submitingeTag: true })
        const { name, description } = this.state
        // TODO: change LanguageId here
        if (!name) {
            return LongToast('CantHaveEmptyInputs')
        }

        const args = { Id: 0, LanguageId: 1, Name: name, Description: description, }
        if (this.state.ImageUrl.length > 0)
            args.Image = this.state.ImageUrl
        this.cancelFetchDataeditETag = editETag(args, (res) => {
            this.setState({ submitingeTag: false })
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
                    flex: 1,
                }}>
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

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', margin: largePagePadding, marginBottom: 15 }}>
                    <TranslatedText style={{ flex: 1, color: secondTextColor, }} text="Language" />
                    <View style={{ flex: 1.4, alignItems: 'flex-start', }}>
                        <Menu
                            ref={ref => this._menu = ref}
                            style={{ flex: 1 }}
                            button={
                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                    <CustomTouchable onPress={() => this._menu.show()}>
                                        <FontedText style={{ marginRight: 5 }}>{this.state.selectedLang.Name}</FontedText>
                                        <Ionicons name='ios-arrow-down' />
                                    </CustomTouchable>
                                </View>
                            }
                        >
                            {
                                this.state.languages.map((lang, i) => (
                                    <MenuItem key={String(i)} onPress={() => {
                                        this._menu.hide()
                                        this.setState({ selectedLang: lang })
                                    }}>{lang.Name}</MenuItem>
                                ))
                            }
                        </Menu>
                    </View>
                </View>
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
                                // 	const { uri, path } = Data

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
                        this.state.submitingeTag ?
                            <ActivityIndicator color="#FFF" size="small" />
                            :
                            <CustomTouchable
                                onPress={this.submiteTag}
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    flex: 1,
                                    // padding: headerButtonPadding,
                                }}>
                                <Ionicons
                                    name={`md-checkmark`}
                                    size={18}
                                    color={'white'} />
                            </CustomTouchable>
                    } />
                {
                    this.state.fetching ? null : this.rendereTag()
                }
            </LazyContainer>
        )
    }
}

export default withLocalize(newEtag)