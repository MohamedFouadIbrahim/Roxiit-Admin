import React, { Component } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ArrowItem from '../../components/ArrowItem/index.js';
import ConditionalCircularImage from '../../components/ConditionalCircularImage';
import CustomDatePicker from '../../components/CustomDatePicker';
import CustomLoader from '../../components/CustomLoader';
import CustomSelector from '../../components/CustomSelector';
import CustomTouchable from '../../components/CustomTouchable';
import HorizontalInput from '../../components/HorizontalInput/index.js';
import ItemSeparator from '../../components/ItemSeparator/index.js';
import LazyContainer from '../../components/LazyContainer';
import { mainColor } from '../../constants/Colors';
import { STRING_LENGTH_MEDIUM } from '../../constants/Config';
import { largePagePadding } from '../../constants/Style';
import { formatDate, formatTime } from '../../utils/Date';
import { SelectEntity } from '../../utils/EntitySelector';
import { OpenCamera, OpenSingleSelectImagePicker } from '../../utils/Image';
import { TrimText } from '../../utils/Text';
import { ExternalTranslate } from '../../utils/Translate';

class PopUpInfo extends Component {
    constructor(props) {
        super(props)

        const {
            ...res
        } = this.props.data


        this.state = {
            isDateTimePickerVisible: false,
            editingStartDate: false,
            Pages: [{ Id: 1, Name: "NoNavigation" }, { Id: 2, Name: "Product" }, { Id: 3, Name: "Categories" }, { Id: 4, Name: "Category" }, { Id: 5, Name: "Home" }, { Id: 6, Name: "Url" }],
            ...res, 
            dataLoaded: true
        }

        this.tabIndex = 0
        this.pagesRef = React.createRef()
        this.languageSelectorRef = React.createRef();
        this.LibraryOrCameraRef = React.createRef();
        this.LibraryOrCameraOptions = [{ Id: 0, Name: 'Camera' }, { Id: 1, Name: 'Library' }]


    }

    AddEditImage = (chosseindex) => {
        if (chosseindex == 0) {
            OpenCamera(Data => {
                const {
                    uri,
                    path
                } = Data
                this.setState({
                    remoteImage: false
                })

                this.props.onTabDataChange(this.tabIndex, {
                    ...this.props.data,
                    ImageData: path,
                    Icon: {
                        ImageUrl: uri,
                    }
                })
            })

        } else {
            OpenSingleSelectImagePicker(Data => {
                const {
                    uri,
                    path
                } = Data
                this.setState({
                    remoteImage: false
                })

                this.props.onTabDataChange(this.tabIndex, {
                    ...this.props.data,
                    ImageData: path,
                    Icon: {
                        ImageUrl: uri,
                    }
                })
            })
        }
    }

    renderImage = () => {
        const imageSize = 90
        const { Icon, remoteImage, prossesEvent, uploadingImage } = this.props.data
        return (
            <View style={{ margin: largePagePadding * 2, justifyContent: 'center', alignItems: 'center', padding: largePagePadding, }}>
                {Icon && Icon.ImageUrl ? <CustomTouchable
                    onPress={() => {
                        this.LibraryOrCameraRef.current.show()
                    }}
                    style={{
                        position: 'absolute',
                        alignSelf: 'center',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: imageSize,
                        height: imageSize,
                        borderRadius: imageSize / 2,
                    }}>

                    <ConditionalCircularImage
                        remote={remoteImage}
                        uri={Icon && Icon.ImageUrl ? Icon.ImageUrl : null}
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
                    {uploadingImage == true ?
                        <CustomLoader
                            size={imageSize - 30}
                            progress={prossesEvent}
                        />
                        : null
                    }
                </CustomTouchable> :
                    <CustomTouchable
                        onPress={() => {
                            this.LibraryOrCameraRef.current.show()
                        }}
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
                }
            </View>
        )
    }


    renderContent = () => {
        const {
            LanguageId,
            ChangeToLanguage,
            Navigation,
            NavigationTo,
            NavigationToName,
            Language,
            ExpireDate
        } = this.props.data

        const {
            name,
            Title,
            Body,
            dataLoaded
        } = this.state

        if (!dataLoaded) {
            return null
        }
        
        const { Pages
        } = this.state

        return (
            <ScrollView
                style={{
                    flex: 1
                }}
            >

                <ArrowItem
                    onPress={() => {
                        this.languageSelectorRef.current.show()
                    }}
                    title={'Language'}
                    info={ChangeToLanguage ? ChangeToLanguage.label : Language.label} />

                <ItemSeparator />

                {this.renderImage()}

                <ItemSeparator />

                <HorizontalInput
                    maxLength={STRING_LENGTH_MEDIUM}
                    label="Name"
                    value={name}
                    onChangeText={(text) => {
                        this.setState({
                            name: text
                        }, () => {
                            this.props.onTabDataChange(this.tabIndex, {
                                ...this.props.data,
                                name: text,
                            }, false)
                        })

                    }} />
                <ItemSeparator />

                <HorizontalInput
                    maxLength={STRING_LENGTH_MEDIUM}
                    label="Title"
                    value={Title}
                    onChangeText={(text) => {
                        this.setState({
                            Title: text
                        }, () => {
                            this.props.onTabDataChange(this.tabIndex, {
                                ...this.props.data,
                                Title: text,
                            }, false)
                        })

                    }} />
                <ItemSeparator />

                <HorizontalInput
                    maxLength={STRING_LENGTH_MEDIUM}
                    label="Body"
                    value={Body}
                    onChangeText={(text) => {
                        this.setState({
                            Body: text
                        }, () => {
                            this.props.onTabDataChange(this.tabIndex, {
                                ...this.props.data,
                                Body: text,
                            }, false)
                        })
                    }} />
                <ItemSeparator />

                {Pages.length ? <ArrowItem
                    onPress={() => { this.pagesRef.current.show() }}
                    title={"Navigation"}
                    info={Navigation && Pages ? ExternalTranslate(Pages.find(item => item.Name == Navigation).Name) : null}
                /> : null}
                <ItemSeparator />

                {Navigation && Navigation == "Product" ? <ArrowItem
                    onPress={() => {
                        SelectEntity(this.props.navigation,
                            product => {

                                this.props.onTabDataChange(this.tabIndex, {
                                    ...this.props.data,
                                    NavigationTo: product.Id,
                                    NavigationToName: product.Name,
                                })
                            },
                            'Products/Simple', null, true, 1)
                    }}
                    title={"Product"}
                    info={NavigationTo ? TrimText(NavigationToName, 35) : null}
                /> : null}
                {Navigation && Navigation == "Product" ? <ItemSeparator /> : null}

                {Navigation && Navigation == "Category" ? <ArrowItem
                    onPress={() => {
                        SelectEntity(this.props.navigation,
                            category => {

                                this.props.onTabDataChange(this.tabIndex, {
                                    ...this.props.data,
                                    NavigationTo: category.Id,
                                    NavigationToName: category.Name,
                                })
                            },
                            'Categories/Simple', null, true, 1)
                    }}
                    title={"Category"}
                    info={NavigationTo ? TrimText(NavigationToName, 35) : null}
                /> : null}
                {Navigation && Navigation == "Category" ? <ItemSeparator /> : null}

                {Navigation && Navigation == "Url" ?
                    <HorizontalInput
                        value={NavigationTo}
                        label={'Url'}
                        onChangeText={(data) => {
                            this.props.onTabDataChange(this.tabIndex, {
                                ...this.props.data,
                                NavigationTo: data,
                            })
                        }}
                    /> : null
                }
                {Navigation && Navigation == "Url" ? <ItemSeparator /> : null}

                <ArrowItem
                    onPress={() => {
                        if (ExpireDate) {
                            this.props.onTabDataChange(this.tabIndex, {
                                ...this.props.data,
                                ExpireDate: null
                            })
                        }
                        else {
                            this.setState({ isDateTimePickerVisible: true })
                        }
                    }}
                    title={'ExpirationDate'}
                    info={ExpireDate ? `${formatDate(ExpireDate)} - ${formatTime(ExpireDate)}` : ''}
                    cancelEnabled={ExpireDate ? true : false} />
                <ItemSeparator />

            </ScrollView>
        )
    }

    render() {
        const { Pages } = this.state

        const { languages_data
        } = this.props.data
        const {
            onSelectLanguage,
        } = this.props

        return (
            <LazyContainer style={{ flex: 1, backgroundColor: "white" }}>
                {
                    Platform.OS == 'ios' ?

                        <KeyboardAvoidingView behavior='padding' enabled
                            style={{ flex: 1 }}
                            keyboardVerticalOffset={120}
                        >
                            {this.renderContent()}
                        </KeyboardAvoidingView> :

                        this.renderContent()
                }

                {Pages && <CustomSelector
                    ref={this.pagesRef}
                    options={Pages.map(item => ExternalTranslate(item.Name))}
                    onSelect={(index) => {
                        this.props.onTabDataChange(this.tabIndex, {
                            ...this.props.data,
                            Navigation: Pages[index].Name,
                            NavigationTo: null,
                        })
                    }}
                    onDismiss={() => { }}
                />}

                {languages_data && <CustomSelector
                    ref={this.languageSelectorRef}
                    options={languages_data.map(item => item.label)}
                    onSelect={(index) => { onSelectLanguage(index) }}
                    onDismiss={() => { }}
                />}

                <CustomSelector
                    ref={this.LibraryOrCameraRef}
                    options={this.LibraryOrCameraOptions.map(item => item.Name)}
                    onSelect={(chosseindex) => {
                        this.AddEditImage(chosseindex)
                    }}
                    onDismiss={() => { }}
                />

                <CustomDatePicker
                    isVisible={this.state.isDateTimePickerVisible}
                    onDatePicked={(date) => {
                        this.setState({ isDateTimePickerVisible: false })
                        this.props.onTabDataChange(this.tabIndex, {
                            ...this.props.data,
                            ExpireDate: date,
                        })
                    }}
                    is24Hour={true}
                    mode='datetime'
                    onCancel={() => {
                        this.setState({ isDateTimePickerVisible: false, })
                        this.props.onTabDataChange(this.tabIndex, {
                            ...this.props.data,
                            ExpireDate: null,
                        })
                    }
                    }
                />
            </LazyContainer>
        )
    }
}


export default PopUpInfo