import React from 'react';
import { Image, View, ActivityIndicator } from 'react-native';
import { ColorPicker, fromHsv } from 'react-native-color-picker';
import Modal from 'react-native-modal';
import ArrowItem from '../../components/ArrowItem';
import CircularImage from '../../components/CircularImage';
import ConfirmModal from '../../components/ConfirmModal/index';
import CustomAddModal from '../../components/CustomAddModal';
import CustomColorModal from '../../components/CustomColorModal';
import CustomLoader from '../../components/CustomLoader';
import CustomSelector from '../../components/CustomSelector';
import CustomTouchable from '../../components/CustomTouchable';
import FontedText from '../../components/FontedText';
import HorizontalInput from '../../components/HorizontalInput';
import PhoneInput from '../../components/PhoneInput';
import ItemSeparator from '../../components/ItemSeparator';
import SwitchItem from '../../components/SwitchItem';
import TranslatedText from '../../components/TranslatedText';
import { mainColor, secondColor, secondTextColor } from '../../constants/Colors';
import { screenWidth } from '../../constants/Metrics';
import { largePagePadding, shadowStyle3, pagePadding } from '../../constants/Style';
import { DeleteImage, PostOneImage, ResetSetting, ReOrderImage, UploadFile } from '../../services/PagesService';
import { showImagePicker } from '../../utils/Image';
import { parsePhone } from '../../utils/Phone';
import { SelectCountry } from "../../utils/Places.js";
import { TrimText } from '../../utils/Text';
import { LongToast } from '../../utils/Toast';
import { isValidMobileNumber, isValidURL, isUrlValid } from '../../utils/Validation';
import Draggableflatlist from 'react-native-draggable-flatlist';
import { SelectEntity } from '../../utils/EntitySelector.js';
import { pickFile, pickZipFile } from '../../utils/File';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Foundation from 'react-native-vector-icons/Foundation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Zocial from 'react-native-vector-icons/Zocial';
const opacityForDisable = 0.4;

export const DescriptionIcon = ({ style, onPress }) => (
    <AntDesign
        name={'questioncircle'}
        color={mainColor}
        style={[{ paddingHorizontal: largePagePadding, alignSelf: 'flex-start' }, style]}
        size={18}
        onPress={onPress}
    />
)
export class PhoneString extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            Value: this.props.Value,
            isPopupVisible: false,
            PhoneCountry: this.props.PhoneCountry,
            FullNumber: this.props.FullNumber
        }
    }

    componentDidMount() {

        const { FullNumber } = this.state

        if (isValidMobileNumber(FullNumber)) {

            const { NationalNumber, NumberCountry } = parsePhone(FullNumber)
            this.setState({ Value: NationalNumber, PhoneCountry: NumberCountry })

        } else {

            this.setState({ Value: null, PhoneCountry: this.state.PhoneCountry })

        }
    }

    componentDidUpdate(prevProps) {
        if (this.state.isPopupVisible) {
            this.setState({ isPopupVisible: !this.props.hideAllPopUps })
        }
    }

    renderPopup = () => {
        let { pos_y, pos_x, isPopupVisible } = this.state

        if (!isPopupVisible) {
            return null
        }

        // Can cause bugs on iOS?
        pos_x -= 29


        return (
            <View
                style={{
                    position: 'absolute',
                    marginTop: 30,
                    backgroundColor: 'white',
                    borderRadius: 15,
                    paddingVertical: 10,
                    width: screenWidth - largePagePadding,
                    zIndex: 1,
                    ...shadowStyle3,
                    right: pos_x + 40
                }}>
                <FontedText style={{ paddingHorizontal: 10 }} >
                    {this.props.Description}
                </FontedText>
            </View>
        )
    }
    hidePopup = () => {
        this.setState({ isPopupVisible: false })
    }
    render() {

        const { Disable, PhoneCountry, onSelectCountry, onChangeText, Value, Description } = this.props

        return (
            <View style={{ opacity: Disable == true ? opacityForDisable : 1, flex: 1, paddingVertical: Description && Description.length ? 5 : 0, backgroundColor: 'white' }}
                onLayout={({ nativeEvent: { layout: { x, y } } }) => {
                    this.setState({ pos_x: x, pos_y: y })
                }}
            >
                {
                    Description && Description.length ?
                        // <AntDesign name={'questioncircle'} color={mainColor}
                        //     style={{ paddingHorizontal: largePagePadding, alignSelf: 'flex-start' }}
                        //     size={20}
                        //     onPress={() => {
                        //         this.setState({ isPopupVisible: !this.state.isPopupVisible })
                        //     }}
                        // />
                        <DescriptionIcon
                            style={{ position: 'absolute', right: -10, zIndex: 1 }}
                            onPress={() => {
                                if (Disable != true) {
                                    this.setState({ isPopupVisible: !this.state.isPopupVisible })
                                }
                            }}
                        />
                        : null
                }

                {this.renderPopup()}

                {/* <View
                    style={{ borderWidth: 0.1, borderRadius: 5, marginHorizontal: 15, flex:1 }}
                > */}
                <PhoneInput
                    containerStyle={{
                        paddingVertical: 0,
                        borderWidth: 0.1, borderRadius: 5, marginHorizontal: 15
                    }}
                    editable={!Disable}
                    countryId={this.state.PhoneCountry ? this.state.PhoneCountry.Id : null}
                    onPressFlag={() => {
                        SelectCountry(this.props.navigation, item => {
                            this.setState({ PhoneCountry: item }, () => { onSelectCountry && onSelectCountry(item, this.state.Value) })
                        });
                    }}

                    value={this.state.Value}
                    onChangeText={Value => { this.setState({ Value }, () => { onChangeText(this.state.Value) }) }}
                />
                {/* </View> */}

                <View style={{ height: 20 }} />

            </View>
        )
    }
}

export class EmailString extends React.Component {

    state = {

        isPopupVisible: false,
        Value: this.props.Value
    }


    componentDidUpdate(prevProps) {
        if (this.state.isPopupVisible) {
            this.CustomSelectorForDeleteref.current.show()
        }
    }

    renderPopup = () => {
        let { pos_y, pos_x, isPopupVisible } = this.state

        if (!isPopupVisible) {
            return null
        }

        // Can cause bugs on iOS?
        pos_x -= 29


        return (
            <View
                style={{
                    position: 'absolute',
                    marginTop: 20,
                    backgroundColor: 'white',
                    borderRadius: 15,
                    paddingVertical: 10,
                    width: screenWidth - largePagePadding,
                    zIndex: 1,
                    ...shadowStyle3,
                    right: pos_x + 40
                }}>
                <FontedText style={{ paddingHorizontal: 10 }} >
                    {this.props.Description}
                </FontedText>
            </View>
        )
    }
    hidePopup = () => {
        this.setState({ isPopupVisible: false })
    }

    render() {

        const { Disable, MaxLength, Value, label, onChangeText, Description } = this.props

        return (
            <View style={{ opacity: Disable == true ? opacityForDisable : 1, flex: 1, paddingVertical: Description && Description.length ? 5 : 0, backgroundColor: 'white' }}
                onLayout={({ nativeEvent: { layout: { x, y } } }) => {
                    this.setState({ pos_x: x, pos_y: y })
                }}
            >
                {
                    Description && Description.length ?
                        // <AntDesign name={'questioncircle'} color={mainColor}
                        //     style={{ paddingHorizontal: largePagePadding, alignSelf: 'flex-start' }}
                        //     size={20}
                        //     onPress={() => {
                        //         this.setState({ isPopupVisible: !this.state.isPopupVisible })
                        //     }}
                        // />
                        <DescriptionIcon
                            style={{ position: 'absolute', right: -10, zIndex: 1 }}
                            onPress={() => {
                                if (Disable != true) {
                                    this.setState({ isPopupVisible: !this.state.isPopupVisible })
                                }
                            }}
                        />
                        : null
                }

                {this.renderPopup()}

                <HorizontalInput
                    containerStyle={{
                        borderWidth: 0.1,
                        paddingHorizontal: 10,
                        borderRadius: 5,
                        marginHorizontal: 15,
                        paddingVertical: 0,
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: 'white',
                    }}
                    multiline
                    editable={Disable}
                    maxLength={MaxLength}
                    value={this.state.Value}
                    label={label}
                    onChangeText={Value => { this.setState({ Value }, () => { onChangeText(this.state.Value) }) }} />

                <View style={{ height: 20 }} />

            </View>
        )

    }
}

export class InputString extends React.Component {

    state = {

        isPopupVisible: false,
        Value: this.props.Value
    }


    componentDidUpdate(prevProps) {
        if (this.state.isPopupVisible) {
            this.setState({ isPopupVisible: !this.props.hideAllPopUps })
        }
    }

    renderPopup = () => {
        let { pos_y, pos_x, isPopupVisible } = this.state

        if (!isPopupVisible) {
            return null
        }

        // Can cause bugs on iOS?
        pos_x -= 29


        return (
            <View
                style={{
                    position: 'absolute',
                    marginTop: 20,
                    backgroundColor: 'white',
                    borderRadius: 15,
                    paddingVertical: 10,
                    width: screenWidth - largePagePadding,
                    zIndex: 1,
                    ...shadowStyle3,
                    right: pos_x + 40
                }}>
                <FontedText style={{ paddingHorizontal: 10 }} >
                    {this.props.Description}
                </FontedText>
            </View>
        )
    }
    hidePopup = () => {
        this.setState({ isPopupVisible: false })
    }

    render() {

        const { Disable, MaxLength, Value, onChangeText, label, Description } = this.props

        return (
            <View style={{ opacity: Disable == true ? opacityForDisable : 1, flex: 1, paddingVertical: Description && Description.length ? 5 : 0, backgroundColor: 'white' }}
                onLayout={({ nativeEvent: { layout: { x, y } } }) => {
                    this.setState({ pos_x: x, pos_y: y })
                }}
            >
                {
                    Description && Description.length ?
                        <DescriptionIcon
                            style={{ position: 'absolute', right: -10, zIndex: 1 }}
                            onPress={() => {
                                if (Disable != true) {
                                    this.setState({ isPopupVisible: !this.state.isPopupVisible })
                                }
                            }}
                        />
                        // <AntDesign name={'questioncircle'} color={mainColor}
                        //     style={{ paddingHorizontal: largePagePadding, alignSelf: 'flex-start' }}
                        //     size={20}
                        //     onPress={() => {
                        //         this.setState({ isPopupVisible: !this.state.isPopupVisible })
                        //     }}
                        // />
                        : null
                }

                {this.renderPopup()}

                <HorizontalInput
                    containerStyle={{
                        borderWidth: 0.1,
                        paddingHorizontal: 10,
                        borderRadius: 5,
                        marginHorizontal: 15,
                        paddingVertical: 0,
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: 'white',
                    }}
                    multiline
                    editable={!Disable}
                    maxLength={MaxLength}
                    value={this.state.Value}
                    label={label}
                    onChangeText={Value => { this.setState({ Value }, () => { onChangeText(this.state.Value) }) }} />
                <View style={{ height: 20 }} />

            </View>
        )
    }

}

export class BooleanItems extends React.PureComponent {

    state = {

        isPopupVisible: false
    }


    componentDidUpdate(prevProps) {
        if (this.state.isPopupVisible) {
            this.setState({ isPopupVisible: !this.props.hideAllPopUps })
        }
    }

    renderPopup = () => {
        let { pos_y, pos_x, isPopupVisible } = this.state

        if (!isPopupVisible) {
            return null
        }

        // Can cause bugs on iOS?
        pos_x -= 29


        return (
            <View
                style={{
                    position: 'absolute',
                    marginTop: 20,
                    backgroundColor: 'white',
                    borderRadius: 15,
                    paddingVertical: 10,
                    width: screenWidth - largePagePadding,
                    zIndex: 1,
                    ...shadowStyle3,
                    right: pos_x + 40
                }}>
                <FontedText style={{ paddingHorizontal: 10 }} >
                    {this.props.Description}
                </FontedText>
            </View>
        )
    }
    hidePopup = () => {
        this.setState({ isPopupVisible: false })
    }


    render() {

        const { title, value, Disable, onValueChange, Description } = this.props

        return (
            <View style={{
                flex: 1, paddingVertical: Description && Description.length ? 5 : 0,
            }}
                onLayout={({ nativeEvent: { layout: { x, y } } }) => {
                    this.setState({ pos_x: x, pos_y: y })
                }}
            >
                {
                    Description && Description.length ?
                        <DescriptionIcon
                            style={{ position: 'absolute', right: -10, zIndex: 1 }}
                            onPress={() => {
                                if (Disable != true) {
                                    this.setState({ isPopupVisible: !this.state.isPopupVisible })
                                }
                            }}
                        />
                        : null
                }

                {this.renderPopup()}

                <SwitchItem
                    titleStyle={{ maxWidth: screenWidth / 2 }}
                    style={{ borderWidth: 0.1, paddingHorizontal: 10, borderRadius: 5, marginHorizontal: 15 }}
                    title={title}
                    value={value}
                    onValueChange={onValueChange} />

                {/* <ItemSeparator /> */}
                <View style={{ height: 20 }} />
            </View>
        )

    }
}


export class IntItems extends React.Component {

    state = {

        isPopupVisible: false,
        Value: this.props.Value
    }

    componentDidUpdate(prevProps) {
        if (this.state.isPopupVisible) {
            this.setState({ isPopupVisible: !this.props.hideAllPopUps })
        }
    }

    renderPopup = () => {
        let { pos_y, pos_x, isPopupVisible } = this.state

        if (!isPopupVisible) {
            return null
        }

        // Can cause bugs on iOS?
        pos_x -= 29


        return (
            <View
                style={{
                    position: 'absolute',
                    marginTop: 20,
                    backgroundColor: 'white',
                    borderRadius: 15,
                    paddingVertical: 10,
                    width: screenWidth - largePagePadding,
                    zIndex: 1,
                    ...shadowStyle3,
                    right: pos_x + 40
                }}>
                <FontedText style={{ paddingHorizontal: 10 }} >
                    {this.props.Description}
                </FontedText>
            </View>
        )
    }
    hidePopup = () => {
        this.setState({ isPopupVisible: false })
    }

    render() {

        const { Disable, value, label, onChangeText, Description } = this.props

        return (
            <View style={{ opacity: Disable == true ? opacityForDisable : 1, flex: 1, paddingVertical: Description && Description.length ? 5 : 0, backgroundColor: 'white' }}
                onLayout={({ nativeEvent: { layout: { x, y } } }) => {
                    this.setState({ pos_x: x, pos_y: y })
                }}
            >
                {
                    Description && Description.length ?
                        // <AntDesign name={'questioncircle'} color={mainColor}
                        //     style={{ paddingHorizontal: largePagePadding, alignSelf: 'flex-start' }}
                        //     size={20}
                        //     onPress={() => {
                        //         // this.setState({ isPopupVisible: !this.state.isPopupVisible })
                        //         if (Disable != true) {
                        //             this.setState({ isPopupVisible: !this.state.isPopupVisible })
                        //         }
                        //     }}
                        // />
                        <DescriptionIcon
                            style={{ position: 'absolute', right: -10, zIndex: 1 }}
                            onPress={() => {
                                if (Disable != true) {
                                    this.setState({ isPopupVisible: !this.state.isPopupVisible })
                                }
                            }}
                        />
                        : null
                }

                {this.renderPopup()}

                <HorizontalInput
                    containerStyle={{
                        borderWidth: 0.1,
                        paddingHorizontal: 10,
                        borderRadius: 5,
                        marginHorizontal: 15,
                        paddingVertical: 0,
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: 'white',
                    }}
                    editable={!Disable}
                    keyboardType='numeric'
                    value={this.state.Value ? String(this.state.Value) : null}
                    label={label}
                    onChangeText={Value => { this.setState({ Value }, () => { onChangeText(this.state.Value) }) }}
                />

                <View style={{ height: 20 }} />

            </View>
        )

    }

}

export class FloatItems extends React.Component {

    state = {

        isPopupVisible: false,
        Value: this.props.Value
    }


    componentDidUpdate(prevProps) {
        if (this.state.isPopupVisible) {
            this.setState({ isPopupVisible: !this.props.hideAllPopUps })
        }
    }

    renderPopup = () => {
        let { pos_y, pos_x, isPopupVisible } = this.state

        if (!isPopupVisible) {
            return null
        }

        // Can cause bugs on iOS?
        pos_x -= 29


        return (
            <View
                style={{
                    position: 'absolute',
                    marginTop: 20,
                    backgroundColor: 'white',
                    borderRadius: 15,
                    paddingVertical: 10,
                    width: screenWidth - largePagePadding,
                    zIndex: 1,
                    ...shadowStyle3,
                    right: pos_x + 40
                }}>
                <FontedText style={{ paddingHorizontal: 10 }} >
                    {this.props.Description}
                </FontedText>
            </View>
        )
    }
    hidePopup = () => {
        this.setState({ isPopupVisible: false })
    }

    render() {

        const { Disable, value, label, onChangeText, Description } = this.props

        return (
            <View style={{ opacity: Disable == true ? opacityForDisable : 1, flex: 1, paddingVertical: Description && Description.length ? 5 : 0, backgroundColor: 'white' }}
                onLayout={({ nativeEvent: { layout: { x, y } } }) => {
                    this.setState({ pos_x: x, pos_y: y })
                }}
            >
                {
                    Description && Description.length ?
                        // <AntDesign name={'questioncircle'} color={mainColor}
                        //     style={{ paddingHorizontal: largePagePadding, alignSelf: 'flex-start' }}
                        //     size={20}
                        //     onPress={() => {
                        //         // this.setState({ isPopupVisible: !this.state.isPopupVisible })
                        //         if (Disable != true) {
                        //             this.setState({ isPopupVisible: !this.state.isPopupVisible })
                        //         }
                        //     }}
                        // />
                        <DescriptionIcon
                            style={{ position: 'absolute', right: -10, zIndex: 1 }}
                            onPress={() => {
                                if (Disable != true) {
                                    this.setState({ isPopupVisible: !this.state.isPopupVisible })
                                }
                            }}
                        />
                        : null
                }

                {this.renderPopup()}

                <HorizontalInput
                    containerStyle={{
                        borderWidth: 0.1,
                        paddingHorizontal: 10,
                        borderRadius: 5,
                        marginHorizontal: 15,
                        paddingVertical: 0,
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: 'white',
                    }}
                    editable={!Disable}
                    keyboardType='numeric'
                    value={this.state.Value ? String(this.state.Value) : null}
                    label={label}
                    onChangeText={Value => { this.setState({ Value }, () => { onChangeText(this.state.Value) }) }}
                />


                <View style={{ height: 20 }} />

            </View>
        )

    }

}
export class ListItems extends React.Component {

    constructor(props) {

        super(props)

        this.CustomSelectorRefForId = React.createRef()

    }


    state = {

        isPopupVisible: false
    }


    componentDidUpdate(prevProps) {
        if (this.state.isPopupVisible) {
            this.setState({ isPopupVisible: !this.props.hideAllPopUps })
        }
    }

    renderPopup = () => {
        let { pos_y, pos_x, isPopupVisible } = this.state

        if (!isPopupVisible) {
            return null
        }

        // Can cause bugs on iOS?
        pos_x -= 29


        return (
            <View
                style={{
                    position: 'absolute',
                    marginTop: 20,
                    backgroundColor: 'white',
                    borderRadius: 15,
                    paddingVertical: 10,
                    width: screenWidth - largePagePadding,
                    zIndex: 1,
                    ...shadowStyle3,
                    right: pos_x + 40
                }}>
                <FontedText style={{ paddingHorizontal: 10 }} >
                    {this.props.Description}
                </FontedText>
            </View>
        )
    }
    hidePopup = () => {
        this.setState({ isPopupVisible: false })
    }

    render() {

        const { title, Disable, onSelectItem, Items, Info, TextProperty, Description } = this.props

        return (
            <View style={{ opacity: Disable == true ? opacityForDisable : 1, flex: 1, paddingVertical: Description && Description.length ? 5 : 0, backgroundColor: 'white' }}
                onLayout={({ nativeEvent: { layout: { x, y } } }) => {
                    this.setState({ pos_x: x, pos_y: y })
                }}
            >

                {
                    Description && Description.length ?
                        <DescriptionIcon
                            style={{ position: 'absolute', right: -10, zIndex: 1 }}
                            onPress={() => {
                                if (Disable != true) {
                                    this.setState({ isPopupVisible: !this.state.isPopupVisible })
                                }
                            }}
                        />
                        : null
                }

                {this.renderPopup()}

                <ArrowItem
                    onPress={() => {
                        if (Disable != true) {
                            this.CustomSelectorRefForId.current.show()
                        }
                    }}
                    style={{ borderWidth: 0.1, paddingHorizontal: 10, borderRadius: 5, marginHorizontal: 15 }}
                    titleStyle={{ maxWidth: screenWidth / 2 }}
                    title={String(title)}
                    info={Info ? String(TrimText(Info, 10)) : null}
                />


                <CustomSelector
                    ref={this.CustomSelectorRefForId}
                    options={Items.map(item => item[TextProperty])}
                    onSelect={(index) => { onSelectItem && onSelectItem(index) }}
                    onDismiss={() => { }}

                />
                <View style={{ height: 20 }} />

            </View>
        )
    }

}

export class MultiListItem extends React.Component {

    state = {

        isPopupVisible: false
    }


    componentDidUpdate(prevProps) {
        if (this.state.isPopupVisible) {
            this.setState({ isPopupVisible: !this.props.hideAllPopUps })
        }
    }

    renderPopup = () => {
        let { pos_y, pos_x, isPopupVisible } = this.state

        if (!isPopupVisible) {
            return null
        }

        // Can cause bugs on iOS?
        pos_x -= 29


        return (
            <View
                style={{
                    position: 'absolute',
                    marginTop: 20,
                    backgroundColor: 'white',
                    borderRadius: 15,
                    paddingVertical: 10,
                    width: screenWidth - largePagePadding,
                    zIndex: 1,
                    ...shadowStyle3,
                    right: pos_x + 40
                }}>
                <FontedText style={{ paddingHorizontal: 10 }} >
                    {this.props.Description}
                </FontedText>
            </View>
        )
    }

    render() {

        const { Disable, title, Info, onPressItem, Description } = this.props

        return (
            <View style={{ opacity: Disable == true ? opacityForDisable : 1, flex: 1, paddingVertical: Description && Description.length ? 5 : 0, backgroundColor: 'white' }}
                onLayout={({ nativeEvent: { layout: { x, y } } }) => {
                    this.setState({ pos_x: x, pos_y: y })
                }}
            >
                {
                    Description && Description.length ?
                        // <AntDesign name={'questioncircle'} color={mainColor}
                        //     style={{ paddingHorizontal: largePagePadding, alignSelf: 'flex-start' }}
                        //     size={20}
                        //     onPress={() => {
                        //         // this.setState({ isPopupVisible: !this.state.isPopupVisible })
                        //         if (Disable != true) {
                        //             this.setState({ isPopupVisible: !this.state.isPopupVisible })
                        //         }
                        //     }}
                        // />

                        <DescriptionIcon
                            style={{ position: 'absolute', right: -10, zIndex: 1 }}
                            onPress={() => {
                                if (Disable != true) {
                                    this.setState({ isPopupVisible: !this.state.isPopupVisible })
                                }
                            }}
                        />
                        : null
                }

                {this.renderPopup()}

                <ArrowItem
                    onPress={() => {
                        if (Disable != true) { onPressItem && onPressItem() }
                    }}
                    style={{ borderWidth: 0.1, paddingHorizontal: 10, borderRadius: 5, marginHorizontal: 15 }}
                    titleStyle={{ maxWidth: screenWidth / 1.1 }}
                    title={String(title)}
                    info={Info}
                />
                <View style={{ height: 20 }} />

            </View>
        )
    }
}

export class ImageItems extends React.Component {

    constructor(props) {

        super(props)

        this.confirmRef = React.createRef();
        this.pagesRef = React.createRef();

        this.longPressToDelete = false

        const { ItemsForNavigation } = this.props

        this.state = {
            isPopupVisible: false,
            submitImag: false,
            VaidError: '',
            prossesEvent: 0,
            Value: this.props.Value,
            isModalVisible: false,
            submitImag: false,
            prossesEvent: 0,
            Name: this.props.Name,
            PageV: ItemsForNavigation && ItemsForNavigation.length ? ItemsForNavigation[0] : null,
            PageValue1: null,
            PageValue2: null,
        }
    }


    componentDidUpdate(prevProps) {
        if (this.props.Value != prevProps.Value) {
            this.setState({ Value: this.props.Value })
        }

        if (this.state.isPopupVisible) {
            this.setState({ isPopupVisible: !this.props.hideAllPopUps })
        }
    }

    onSubmitImage = (Value, Key) => {

        if (this.state.submitImag) {
            return
        }

        if (!Value) {
            return LongToast('CantHaveEmptyInputs')
        }

        const { PageV, PageValue1, PageValue2 } = this.state

        let pageValue = PageV ? PageV.Name : null
        let PageValueRes = PageValue1 ? PageValue1.Id : ''
        let PageValueRes2 = PageValue2 ? PageValue2.Id : ''
        const http = 'http://'
        if (!PageValue1 && (PageV && PageV.Id == 6)) {
            return LongToast('CantHaveEmptyInputs')
        }

        if (PageValue1 && (PageV && PageV.Id == 6) && !isUrlValid(PageValue1)) {
            return LongToast('InVaildUrl')
        }
        if (PageV && PageV.Id == 6 && PageValue1) { // he select url

            PageValueRes = PageValue1

            if (PageValueRes.slice(0, 7) != http) {
                PageValueRes = http + PageValueRes
            }

        }

        const { Title, Description, ImageUrl } = Value

        this.setState({ submitImag: true })

        PostOneImage(this.props.pageId, Key, Title, Description, ImageUrl, pageValue, PageValueRes, PageValueRes2, res => {

            this.props.fetchData && this.props.fetchData()

            this.setState({ submitImag: false })
            this.setState({ isModalVisible: false })
            LongToast('dataSaved')

        }, () => {

            this.setState({ submitImag: false })

        }, (loadingProsess) => {

            this.setState({ prossesEvent: loadingProsess * 0.01 })

        })

    }

    ShowPicker = () => {
        showImagePicker((Data) => {

            if (Data) {
                const { uri, path } = Data

                this.setState({ Value: { ...this.state.Value, ImageUrl: uri } })
            }

        })
    }

    hideModal() {
        this.setState({ isModalVisible: false })
    }

    toggleModal() {
        this.setState({ isModalVisible: !this.state.isModalVisible })
    }

    showModal() {

        const { ItemsForNavigation } = this.props

        this.setState({
            isModalVisible: true,
            PageV: ItemsForNavigation && ItemsForNavigation.length ? ItemsForNavigation[0] : null,
            PageValue1: null,
            PageValue2: null,
            product: null
        })
    }

    _onRenderModal() {

        const imageSize = 90

        const { Value } = this.state

        const { ShowDescription, ItemsForNavigation } = this.props

        return (
            <CustomAddModal
                // ref={ref}
                onBackdropPress={() => { this.hideModal() }}
                isVisible={this.state.isModalVisible}
                error={this.props.VaidError}
                loading={this.state.submitImag}
                onErrorMsgClosePress={() => { this.props.onErrorMsgClosePress && this.props.onErrorMsgClosePress() }}
                RoundedCloseButtonPress={() => { this.hideModal() }}
                onSubmit={() => {

                    if (!Value) {
                        return LongToast('CantHaveEmptyInputs')
                    }

                    const { Title, Description } = Value


                    if (!Value.ImageUrl) {

                        return LongToast('CantHaveEmptyInputs')

                    } else if (!Value && Value.Required == true && (!Title || !Description)) {

                        return LongToast('CantHaveEmptyInputs')

                    } else {
                        this.onSubmitImage(Value, this.props.Name)
                    }
                }}
            >

                {
                    Value == null || !Value.ImageUrl ?
                        <CustomTouchable
                            onPress={() => { this.ShowPicker() }}
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
                            <Ionicons
                                name={`ios-add`}
                                size={45}
                                color={'white'} />

                            {this.state.submitImag == true ?
                                <CustomLoader
                                    size={imageSize - 30}
                                    progress={this.state.prossesEvent == 0 ? this.state.prossesEvent : this.state.prossesEvent}
                                />
                                : null
                            }

                        </CustomTouchable>
                        :
                        <CustomTouchable
                            style={{
                                alignSelf: 'center',
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: '#aaaaaa',
                                margin: largePagePadding,
                                width: imageSize,
                                height: imageSize,
                                borderRadius: imageSize / 2,
                            }}
                            onPress={() => { this.ShowPicker() }}>
                            <CircularImage
                                style={{ alignSelf: 'center' }}
                                uri={Value.ImageUrl ? Value.ImageUrl : null}
                                size={imageSize} />
                            {this.state.submitImag == true ?
                                <CustomLoader
                                    size={imageSize - 30}
                                    progress={this.state.prossesEvent == 0 ? this.state.prossesEvent : this.state.prossesEvent}
                                />
                                : null
                            }
                        </CustomTouchable>
                }

                {ShowDescription &&
                    <HorizontalInput
                        value={Value != null ? Value.Title : null}
                        label={'Title'}
                        onChangeText={(data) => {
                            this.setState({ Value: { ...this.state.Value, Title: data } })
                        }}
                    />
                }

                {ShowDescription &&
                    <HorizontalInput
                        multiline
                        value={Value != null ? Value.Description : null}
                        label={'Description'}
                        onChangeText={(data) => {
                            this.setState({ Value: { ...this.state.Value, Description: data } })
                        }}
                    />}

                {ItemsForNavigation && ItemsForNavigation.length > 0 &&
                    <ArrowItem
                        onPress={() => { this.pagesRef.current.show() }}
                        title={"Navigation"}
                        info={this.state.PageV ? this.state.PageV.Name : null}
                    />
                }

                <ItemSeparator />

                {ItemsForNavigation && this.state.PageV && this.state.PageV.Id == 2 && <ArrowItem
                    onPress={() => {
                        this.setState({ isModalVisible: false }, () => {
                            SelectEntity(this.props.navigation, product => { this.setState({ PageValue1: product, isModalVisible: true }) }, 'Products', null, true, 1)
                        })
                    }}
                    title={"Product"}
                    info={this.state.PageValue1 ? TrimText(this.state.PageValue1.Name, 20) : null}
                />}

                {ItemsForNavigation && this.state.PageV && this.state.PageV.Id == 4 && <ArrowItem
                    onPress={() => {
                        this.setState({ isModalVisible: false }, () => {
                            SelectEntity(this.props.navigation, Categorie => { this.setState({ PageValue1: Categorie, isModalVisible: true }) }, 'Categories/Simple', null, true, 1)
                        })
                    }}
                    title={"Category"}
                    info={this.state.PageValue1 ? TrimText(this.state.PageValue1.Name, 20) : null}
                />}

                <ItemSeparator />

                {ItemsForNavigation && this.state.PageV && this.state.PageV.Id == 6 &&
                    <HorizontalInput
                        value={this.state.PageValue1 != null ? this.state.PageValue1 : null}
                        label={'Url'}
                        onChangeText={(data) => {
                            this.setState({
                                PageValue1: data
                            })
                        }}
                    />
                }

            </CustomAddModal>
        )
    }

    renderPopup = () => {
        let { pos_y, pos_x, isPopupVisible } = this.state

        if (!isPopupVisible) {
            return null
        }

        // Can cause bugs on iOS?
        pos_x -= 29


        return (
            <View
                style={{
                    position: 'absolute',
                    // marginTop: 60
                    top: 15,
                    backgroundColor: 'white',
                    borderRadius: 15,
                    paddingVertical: 10,
                    width: screenWidth - largePagePadding,
                    zIndex: 1,
                    ...shadowStyle3,
                    right: pos_x + 25
                }}>
                <FontedText style={{ paddingHorizontal: 10 }} >
                    {this.props.Description}
                </FontedText>
            </View>
        )
    }

    onSelectPage = (PageV) => {
        this.setState({
            PageV,
            PageValue1: null,
            PageValue2: null
        })
    }

    render() {

        const { Disable, onDeleteImage, RLabel, showModal, Description, ItemsForNavigation } = this.props
        const { Value, Name } = this.state

        return (

            <View style={{ opacity: Disable == true ? opacityForDisable : 1, flex: 1, paddingVertical: Description && Description.length ? 5 : 0, backgroundColor: 'white' }}
                onLayout={({ nativeEvent: { layout: { x, y } } }) => {
                    this.setState({ pos_x: x, pos_y: y })
                }}
            >
                {
                    Description && Description.length ?
                        <DescriptionIcon
                            style={{ position: 'absolute', right: -10, zIndex: 1 }}
                            onPress={() => {
                                if (Disable != true) {
                                    this.setState({ isPopupVisible: !this.state.isPopupVisible })
                                }
                            }}
                        />
                        : null
                }

                <CustomTouchable style={{
                    justifyContent: 'space-between',
                    paddingVertical: 15,
                    // paddingHorizontal: 20,
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: 'white',
                    borderWidth: 0.1, paddingHorizontal: 10, borderRadius: 5, marginHorizontal: 15,
                    opacity: Disable == true ? opacityForDisable : 1
                }}
                    onPress={() => {
                        if (Disable != true) {
                            this.showModal()
                        }
                    }}
                    onLongPress={() => {

                        if (Value && Disable != true) {
                            this.imageIdForDelete = Value.Id
                            this.PropertyName = Name
                            this.longPressToDelete = true
                            this.confirmRef.current.show()
                        }
                    }}
                >

                    {this.renderPopup()}

                    <FontedText style={{
                        // color: '#949EA5'
                        color: secondTextColor
                    }} >
                        {RLabel}
                    </FontedText>
                    {Value == null || Value.ImageUrl == null || !Value.ImageUrl || Value.ImageUrl == '' ?

                        <View style={{ backgroundColor: 'black', width: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 10 }} >
                            <Ionicons
                                // style={{ width: 40, alignSelf: 'center' }}
                                name={`ios-add`}
                                size={22}
                                color={'white'} />
                        </View> :
                        <View  >
                            <CircularImage
                                uri={Value.ImageUrl ? Value.ImageUrl : null}
                                size={50} />
                            <Ionicons
                                style={{ position: 'absolute', right: -3, top: 24 }}
                                name={`ios-camera`}
                                size={25}
                                color={'gray'} />
                        </View>
                    }

                    {this._onRenderModal()}

                    <ConfirmModal
                        ref={this.confirmRef}
                        onConfirm={() => {
                            if (this.longPressToDelete) {

                                DeleteImage(this.props.pageId, this.imageIdForDelete, this.PropertyName, res => {
                                    this.props.fetchData && this.props.fetchData()
                                    LongToast('dataDeleted')
                                })

                            } else {
                                ResetSetting(this.props.pageId, res => {
                                    this.longPressToDelete = false
                                    LongToast('dataReset')
                                    this.props.navigation.goBack()
                                    // this.fitchData()
                                })
                            }
                        }}
                        onResponse={(check) => {
                            if (check == true) {

                            } else {
                                this.longPressToDelete = false
                            }
                        }}
                    />

                    {ItemsForNavigation && <CustomSelector
                        ref={this.pagesRef}
                        options={ItemsForNavigation.map(item => item.Name)}
                        onSelect={(index) => { this.onSelectPage(ItemsForNavigation[index]) }}
                        onDismiss={() => { }}
                    />}

                </CustomTouchable>

                <View style={{ height: 20 }} />

            </View>
        )
    }
}

export class ColorItem extends React.Component {

    constructor(props) {

        super(props)

        this.state = {

            colorPickerShown: false,
            data: this.props.data
        }
    }


    componentDidUpdate(prevProps) {
        if (this.state.isPopupVisible) {
            this.setState({ isPopupVisible: !this.state.hideAllPopUps })
        }
    }
    renderPopup = () => {
        let { pos_y, pos_x, isPopupVisible } = this.state

        if (!isPopupVisible) {
            return null
        }

        // Can cause bugs on iOS?
        pos_x -= 29


        return (
            <View
                style={{
                    position: 'absolute',
                    marginTop: 20,
                    backgroundColor: 'white',
                    borderRadius: 15,
                    paddingVertical: 10,
                    width: screenWidth - largePagePadding,
                    zIndex: 1,
                    ...shadowStyle3,
                    right: pos_x + 40
                }}>
                <FontedText style={{ paddingHorizontal: 10 }} >
                    {this.props.Description}
                </FontedText>
            </View>
        )
    }
    renderColorModal = () => (
        <Modal onBackdropPress={() => this.setState({ colorPickerShown: false })} isVisible={this.state.colorPickerShown}>
            <View style={{ width: screenWidth * .9, alignSelf: "center", paddingBottom: 35, backgroundColor: "#FFF", borderRadius: 10, overflow: "hidden", alignItems: "center", justifyContent: "center" }}>
                <ColorPicker
                    onColorChange={(color) => {

                        this.setState({ data: { ...this.state.data, Value: fromHsv(color) } }, () => this.props.onColorChange && this.props.onColorChange(fromHsv(color)))
                    }}
                    hideSliders={false}

                    color={this.state.data.Value}
                    // defaultColor={this.state[this.state.SelectedColor.Name]}
                    style={{ width: 150, height: 150, marginVertical: 30 }}
                />
                <View style={{ flexDirection: "row", position: "absolute", bottom: -.5, justifyContent: "center", alignItems: "center" }}>
                    <CustomTouchable onPress={() => this.setState({ colorPickerShown: false })} style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: secondColor, }}>
                        <TranslatedText style={{ color: "#FFF", padding: 10, paddingVertical: 15 }} text={'Done'} />
                    </CustomTouchable>
                </View>
            </View>
        </Modal>
    )

    renderRightComponentForArrowItem = (colorValue) => {
        return (
            <View>
                <Image source={require('../../assets/images/productOptions/wheel-5-ryb.png')} style={{ width: 30, height: 30, borderRadius: 15 }} />
                <View style={{ backgroundColor: colorValue, width: 20, height: 20, borderRadius: 10, left: 5, top: 5, position: "absolute" }}></View>
            </View>
        )
    }
    render() {

        const { RLabel, Disable, i, Key, Description } = this.props

        return (
            <View style={{ opacity: Disable == true ? opacityForDisable : 1, flex: 1, paddingVertical: Description && Description.length ? 5 : 0, backgroundColor: 'white' }}
                onLayout={({ nativeEvent: { layout: { x, y } } }) => {
                    this.setState({ pos_x: x, pos_y: y })
                }}
            >



                {
                    Description && Description.length ?
                        // <AntDesign name={'questioncircle'} color={mainColor}
                        //     style={{ paddingHorizontal: largePagePadding, zIndex: 1, alignSelf: 'flex-start' }}
                        //     size={20}
                        //     onPress={() => {
                        //         // this.setState({ isPopupVisible: !this.state.isPopupVisible })
                        //         if (Disable != true) {
                        //             this.setState({ isPopupVisible: !this.state.isPopupVisible })
                        //         }
                        //     }}
                        // />
                        <DescriptionIcon
                            style={{ position: 'absolute', right: -10, zIndex: 1 }}
                            onPress={() => {
                                if (Disable != true) {
                                    this.setState({ isPopupVisible: !this.state.isPopupVisible })
                                }
                            }}
                        />
                        : null
                }

                <ArrowItem
                    buttonProps={{ key: Key }}
                    onPress={() => {

                        if (Disable != true) {
                            // this.objData[this.state[Key]].props.show()
                            this.setState({ colorPickerShown: true })
                        }

                    }}
                    title={RLabel}
                    style={{ borderWidth: 0.1, paddingHorizontal: 10, borderRadius: 5, marginHorizontal: 15 }}
                    rightComponent={this.renderRightComponentForArrowItem(this.state.data.Value || mainColor)}
                // info={'test'}
                />

                {this.renderPopup()}

                <CustomColorModal
                    onBackdropPress={() => { this.setState({ colorPickerShown: false }) }}

                    onChangeText={(text) => {
                        this.setState({ data: { ...this.state.data, Value: text } }, () => this.props.onColorChange && this.props.onColorChange(text))
                    }}

                    value={this.state.data.Value || mainColor}
                    onColorChange={(color) => {

                        this.setState({ data: { ...this.state.data, Value: fromHsv(color) } }, () => this.props.onColorChange && this.props.onColorChange(fromHsv(color)))
                    }}

                    isVisible={this.state.colorPickerShown}

                    onDonepress={() => { this.setState({ colorPickerShown: false }) }}

                    defaultColor={mainColor}
                />


                <View style={{ height: 20 }} />

            </View>
        )
    }
}

export class MultiItemsImage extends React.Component {
    constructor(props) {
        super(props)

        this.confirmRef = React.createRef()
        this.pagesRef = React.createRef()

        const { ItemsForNavigation } = this.props

        this.state = {
            pos_x: null,
            pos_y: null,
            Value: this.props.Value,
            isModalVisible: false,
            insertedValue: {},
            prossesEvent: 0,
            PageV: ItemsForNavigation && ItemsForNavigation.length ? ItemsForNavigation[0] : null,
            PageValue1: null,
            PageValue2: null,
        }
    }


    ceiveProps(nextProps) {

        if (nextProps.Value != this.props.Value) {
            this.setState({ Value: nextProps.Value })
        }

        if (this.state.isPopupVisible) {
            this.setState({ isPopupVisible: !nextProps.hideAllPopUps })
        }
    }

    renderPopup = () => {
        let { pos_y, pos_x, isPopupVisible } = this.state

        if (!isPopupVisible) {
            return null
        }

        // Can cause bugs on iOS?
        pos_x -= 29


        return (
            <View
                style={{
                    position: 'absolute',
                    // marginTop: 60
                    top: 15,
                    backgroundColor: 'white',
                    borderRadius: 15,
                    paddingVertical: 10,
                    width: screenWidth - largePagePadding,
                    zIndex: 1,
                    ...shadowStyle3,
                    right: pos_x + 10
                }}>
                <FontedText style={{ paddingHorizontal: 10 }} >
                    {this.props.Description}
                </FontedText>
            </View>
        )
    }


    ShowPicker = () => {
        showImagePicker((Data) => {

            if (Data) {
                const { uri, path } = Data

                this.setState({ insertedValue: { ...this.state.insertedValue, ImageUrl: uri } })
            }

        })
    }

    hideModal() {
        this.setState({ isModalVisible: false, Value: this.props.Value, PageV: this.props.ItemsForNavigation.length ? this.props.ItemsForNavigation[0] : null, })
    }

    renderModal() {

        const imageSize = 90

        const { insertedValue, Value } = this.state

        const { Key, ShowDescription, ItemsForNavigation } = this.props


        return (
            <CustomAddModal
                // ref={ref}
                onBackdropPress={() => { this.hideModal() }}
                isVisible={this.state.isModalVisible}
                error={this.props.VaidError}
                loading={this.state.submitImag}
                onErrorMsgClosePress={() => { this.props.onErrorMsgClosePress && this.props.onErrorMsgClosePress() }}
                RoundedCloseButtonPress={() => { this.hideModal() }}
                onSubmit={() => {

                    if (this.state.submitImag) {
                        return
                    }

                    if (!insertedValue) {
                        return LongToast('CantHaveEmptyInputs')
                    }

                    const { Title, Description, ImageUrl } = insertedValue

                    const {
                        PageV,
                        PageValue1,
                        PageValue2
                    } = this.state

                    let pageValue = PageV ? PageV.Name : null
                    let PageValueRes = PageValue1 ? PageValue1.Id : ''
                    let PageValueRes2 = PageValue2 ? PageValue2.Id : ''
                    const http = 'http://'
                    if (!insertedValue.ImageUrl) {
                        return LongToast('CantHaveEmptyInputs')
                    }

                    if (!PageValue1 && (PageV && PageV.Id == 6)) {
                        return LongToast('CantHaveEmptyInputs')
                    }

                    if (PageValue1 && (PageV && PageV.Id == 6) && !isUrlValid(PageValue1)) {
                        return LongToast('InVaildUrl')
                    }
                    if (PageV && PageV.Id == 6 && PageValue1) { // he select url

                        PageValueRes = PageValue1

                        if (PageValueRes.slice(0, 7) != http) {
                            PageValueRes = http + PageValueRes
                        }

                    }

                    // postImage
                    this.setState({ submitImag: true })

                    PostOneImage(this.props.pageId, Key, Title, Description, ImageUrl, pageValue, PageValueRes, PageValueRes2, res => {
                        this.setState({ submitImag: false, isModalVisible: false, prossesEvent: 0 })
                        LongToast('dataSaved')
                        this.props.fitchData && this.props.fitchData()
                    }, () => {
                        this.setState({ submitImag: false, isModalVisible: false, prossesEvent: 0 })
                    }, (loadingProsess) => {
                        this.setState({ prossesEvent: loadingProsess * 0.01 })
                    })

                }}
            >

                {
                    insertedValue == null || !insertedValue.ImageUrl ?
                        <CustomTouchable
                            onPress={() => { this.ShowPicker() }}
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
                            <Ionicons
                                name={`ios-add`}
                                size={45}
                                color={'white'} />

                            {this.state.submitImag == true ?
                                <CustomLoader
                                    size={imageSize - 30}
                                    progress={this.state.prossesEvent == 0 ? this.state.prossesEvent : this.state.prossesEvent}
                                />
                                : null
                            }

                        </CustomTouchable>
                        :
                        <CustomTouchable
                            style={{
                                alignSelf: 'center',
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: '#aaaaaa',
                                margin: largePagePadding,
                                width: imageSize,
                                height: imageSize,
                                borderRadius: imageSize / 2,
                            }}
                            onPress={() => { this.ShowPicker() }}>
                            <CircularImage
                                style={{ alignSelf: 'center' }}
                                uri={insertedValue.ImageUrl ? insertedValue.ImageUrl : null}
                                size={imageSize} />
                            {this.state.submitImag == true ?
                                <CustomLoader
                                    size={imageSize - 30}
                                    progress={this.state.prossesEvent == 0 ? this.state.prossesEvent : this.state.prossesEvent}
                                />
                                : null
                            }


                        </CustomTouchable>
                }


                {ShowDescription && <HorizontalInput
                    value={insertedValue != null ? insertedValue.Title : null}
                    label={'Title'}
                    onChangeText={(data) => {
                        this.setState({ insertedValue: { ...this.state.insertedValue, Title: data } })
                    }}
                />}

                {ShowDescription && <HorizontalInput
                    multiline
                    value={insertedValue != null ? insertedValue.Description : null}
                    label={'Description'}
                    onChangeText={(data) => {
                        this.setState({ insertedValue: { ...this.state.insertedValue, Description: data } })
                    }}
                />}

                {ItemsForNavigation && ItemsForNavigation.length > 0 &&
                    <ArrowItem
                        onPress={() => { this.pagesRef.current.show() }}
                        title={"Navigation"}
                        info={insertedValue.PageV ? insertedValue.PageV.Name : this.state.PageV ? this.state.PageV.Name : null}
                    />
                }

                <ItemSeparator />

                {ItemsForNavigation && this.state.PageV && this.state.PageV.Id == 2 && <ArrowItem
                    onPress={() => {
                        this.setState({ isModalVisible: false }, () => {
                            SelectEntity(this.props.navigation, product => { this.setState({ PageValue1: product, isModalVisible: true }) }, 'Products', null, true, 1)
                        })
                    }}
                    title={"Product"}
                    info={this.state.PageValue1 ? TrimText(this.state.PageValue1.Name, 20) : null}
                />}


                {ItemsForNavigation && this.state.PageV && this.state.PageV.Id == 4 && <ArrowItem
                    onPress={() => {
                        this.setState({ isModalVisible: false }, () => {
                            SelectEntity(this.props.navigation, Categorie => { this.setState({ PageValue1: Categorie, isModalVisible: true }) }, 'Categories/Simple', null, true, 1)
                        })
                    }}
                    title={"Category"}
                    info={this.state.PageValue1 ? TrimText(this.state.PageValue1.Name, 20) : null}
                />}

                {ItemsForNavigation && this.state.PageV && this.state.PageV.Id == 6 &&
                    <HorizontalInput
                        value={this.state.PageValue1 != null ? this.state.PageValue1 : null}
                        label={'Url'}
                        onChangeText={(data) => {
                            this.setState({
                                PageValue1: data
                            })
                        }}
                    />
                }

            </CustomAddModal>
        )
    }

    renderItemImageList = ({ item, index, move, moveEnd, isActive }) => {
        const { ImageUrl, Name, Alt, Id } = item

        return (
            <CustomTouchable
                // onPress={() => {
                //     this.setState({ insertedValue: item, isModalVisible: true })
                // }}
                onLongPress={() => {

                    const { Key } = this.props

                    this.imageIdForDelete = Id
                    this.PropertyName = Key
                    this.confirmRef.current.show()

                }}
            >

                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingHorizontal: largePagePadding,
                        paddingVertical: pagePadding,
                        backgroundColor: isActive ? '#cccccc' : 'white',
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}>
                        <CircularImage
                            uri={ImageUrl} id={index} />

                        <View
                            style={{

                                paddingLeft: largePagePadding,
                            }}>
                            <FontedText style={{ color: 'black' }}>{Name}</FontedText>
                            {Alt ? <FontedText style={{
                                // color: '#949EA5'
                                color: secondTextColor
                            }}>{Alt}</FontedText> : null}
                        </View>
                    </View>

                    <CustomTouchable
                        onLongPress={move}
                        onPressOut={moveEnd}
                        style={{
                            padding: 10,
                        }}>
                        <Ionicons
                            name={`ios-menu`}
                            size={28}
                            // color={'#949EA5'}
                            color={secondTextColor}
                        />
                    </CustomTouchable>
                </View>
            </CustomTouchable>
        )
    }

    onSelectPage = (PageV) => {
        this.setState({
            PageV,
            PageValue1: null,
            PageValue2: null
        })
    }

    render() {

        const { Description, RLabel, Disable, Key, ItemsForNavigation } = this.props

        const { Value } = this.state

        return (
            <View style={{
                opacity: Disable == true ?
                    opacityForDisable : 1,
                flex: 1,
                paddingVertical: Description && Description.length ? 5 : 0,
                backgroundColor: 'white',
                borderWidth: 0.1, paddingHorizontal: 10, borderRadius: 5, marginHorizontal: 15, marginBottom: 20
            }}
                onLayout={({ nativeEvent: { layout: { x, y } } }) => {
                    this.setState({ pos_x: x, pos_y: y })
                }}
            >
                {
                    Description && Description.length ?
                        <DescriptionIcon
                            style={{ position: 'absolute', right: -25, zIndex: 1, top: -5 }}
                            onPress={() => {
                                if (Disable != true) {
                                    this.setState({ isPopupVisible: !this.state.isPopupVisible })
                                }
                            }}
                        />
                        : null
                }

                {this.renderPopup()}

                <CustomTouchable
                    key={Key}
                    style={{
                        justifyContent: 'space-between',
                        paddingVertical: 15,
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: 'white',
                        paddingHorizontal: 10,
                    }}
                    onPress={() => {
                        if (Disable != true) {
                            this.setState({
                                insertedValue: {},
                                isModalVisible: true,
                                PageV: ItemsForNavigation && ItemsForNavigation.length ? ItemsForNavigation[0] : null,
                                PageValue1: null,
                                PageValue2: null,
                                product: null
                            })
                        }
                    }}
                >

                    <FontedText style={{
                        // color: '#949EA5'
                        color: secondTextColor
                    }} >
                        {RLabel}
                    </FontedText>

                    <View style={{ backgroundColor: 'black', width: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 10 }} >
                        <Ionicons
                            name={`ios-add`}
                            size={22}
                            color={'white'} />

                        {this.renderModal()}

                    </View>

                </CustomTouchable>

                {Value.length > 0 ?
                    <View style={{ opacity: Disable == true ? opacityForDisable : 1, flex: 1 }}  >
                        <Draggableflatlist
                            removeClippedSubviews={true}
                            contentContainerStyle={{ flex: 1 }}
                            data={Value}
                            renderItem={({ item, index, move, moveEnd, isActive }) => this.renderItemImageList({ item, index, move, moveEnd, isActive })}
                            onMoveEnd={({ data }) => {

                                this.setState({ Value: data })

                                ReOrderImage(this.props.pageId, data.map(item => item.Id), Key, (re) => {
                                    this.props.fitchData()
                                })

                            }}
                            keyExtractor={({ Id }) => `${String(Id)}`}
                            ItemSeparatorComponent={() => <ItemSeparator />}
                        />

                    </View>
                    : null}

                <ConfirmModal
                    ref={this.confirmRef}
                    onConfirm={() => {
                        if (this.imageIdForDelete && this.PropertyName) {
                            DeleteImage(this.props.pageId, this.imageIdForDelete, this.PropertyName, res => {
                                LongToast('dataDeleted')
                                this.props.fitchData()
                            })
                        }
                    }}
                    onResponse={(check) => {
                        if (check == true) {

                        }
                    }}
                />

                {ItemsForNavigation && <CustomSelector
                    ref={this.pagesRef}
                    options={ItemsForNavigation.map(item => item.Name)}
                    onSelect={(index) => { this.onSelectPage(ItemsForNavigation[index]) }}
                    onDismiss={() => { }}
                />}
            </View>
        )
    }
}

export const TextView = ({ Description, RLabel }) => {
    return (
        <View style={{ marginHorizontal: 17, marginVertical: 10, alignSelf: 'flex-start' }} >
            {RLabel ? <FontedText style={{ fontWeight: 'bold' }} >
                {RLabel}
            </FontedText> : null}
            {Description ? <FontedText>
                {Description}
            </FontedText> : null}
            <ItemSeparator style={{ backgroundColor: mainColor, marginTop: 1 }} />
        </View >
    )
}

export class Icon extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            Value: this.props.Value,
            isPopupVisible: false
        }
    }

    componentDidUpdate(prevProps) {
        if (this.state.isPopupVisible) {
            this.setState({ isPopupVisible: !this.state.hideAllPopUps })
        }
    }

    renderPopup = () => {
        let { pos_y, pos_x, isPopupVisible } = this.state

        if (!isPopupVisible) {
            return null
        }

        // Can cause bugs on iOS?
        pos_x -= 29


        return (
            <View
                style={{
                    position: 'absolute',
                    marginTop: 18,
                    backgroundColor: 'white',
                    borderRadius: 15,
                    paddingVertical: 10,
                    width: screenWidth - largePagePadding,
                    zIndex: 1,
                    ...shadowStyle3,
                    right: pos_x + 40
                }}>
                <FontedText style={{ paddingHorizontal: 10 }} >
                    {this.props.Description}
                </FontedText>
            </View>
        )
    }

    renderIcon = () => {
        const {
            familyName,
            iconName
        } = this.handelIconNameAndFamily()

        const iconSize = 20
        switch (familyName) {
            case 'Ionicons':
                return <Ionicons style={{}} size={iconSize} name={iconName} />
            case 'AntDesign':
                return <AntDesign style={{}} size={iconSize} name={iconName} />
            case 'Entypo':
                return <Entypo style={{}} size={iconSize} name={iconName} />
            case 'EvilIcons':
                return <EvilIcons style={{}} size={iconSize} name={iconName} />
            case 'Feather':
                return <Feather style={{}} size={iconSize} name={iconName} />
            case 'FontAwesome':
                return <FontAwesome style={{}} size={iconSize} name={iconName} />
            case 'Foundation':
                return <Foundation style={{}} size={iconSize} name={iconName} />
            case 'MaterialCommunityIcons':
                return <MaterialCommunityIcons style={{}} size={iconSize} name={iconName} />
            case 'MaterialIcons':
                return <MaterialIcons style={{}} size={iconSize} name={iconName} />
            case 'Octicons':
                return <Octicons style={{}} size={iconSize} name={iconName} />
            case 'SimpleLineIcons':
                return <SimpleLineIcons style={{}} size={iconSize} name={iconName} />
            case 'Zocial':
                return <Zocial style={{}} size={iconSize} name={iconName} />

            default:
                return null
        }
    }

    handelIconNameAndFamily = () => {
        const { Value } = this.state

        if (Value) {
            const commaIndex = Value.indexOf(',')
            const familyName = Value.substr(0, commaIndex);
            const iconName = Value.substr(commaIndex + 1, Value.length);

            return {
                familyName,
                iconName
            }
        }

    }
    render() {

        const { Disable, Description, RLabel, onIconSelected } = this.props
        const { Value } = this.state

        return (
            <View style={{
                opacity: Disable == true ?
                    opacityForDisable : 1,
                flex: 1,
                paddingVertical: Description && Description.length ? 5 : 0,
                backgroundColor: 'white',
                marginBottom: 20
            }}
                onLayout={({ nativeEvent: { layout: { x, y } } }) => {
                    this.setState({ pos_x: x, pos_y: y })
                }}
            >
                <ArrowItem
                    onPress={() => {
                        if (Disable != true) {
                            this.props.navigation.navigate('IconSelector', {
                                callback: (familyName, iconName) => this.setState({ Value: `${familyName},${iconName}` }, () => {
                                    onIconSelected && onIconSelected(this.state.Value)
                                })
                            })
                        }
                    }}
                    style={{ borderWidth: 0.1, paddingHorizontal: 10, borderRadius: 5, marginHorizontal: 15 }}
                    title={String(RLabel)}
                    rightComponent={Value ? this.renderIcon() : null}
                // info={Value ? TrimText(Value, 10) : null}
                />
                {this.renderPopup()}

                {
                    Description && Description.length ?
                        <DescriptionIcon
                            style={{ position: 'absolute', right: -10, zIndex: 1, top: -3 }}
                            onPress={() => {
                                if (Disable != true) {
                                    this.setState({ isPopupVisible: !this.state.isPopupVisible })
                                }
                            }}
                        />
                        : null
                }
            </View>
        )
    }
}

export class File extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            isPopupVisible: false,
            Value: this.props.Value,
            lockSubmit: false
        }

        this.lockSubmit = false
    }

    componentDidMount() {
    }

    componentDidUpdate(prevProps) {
        if (this.state.isPopupVisible) {
            this.setState({ isPopupVisible: !this.state.hideAllPopUps })
        }
    }

    renderPopup = () => {
        let { pos_y, pos_x, isPopupVisible } = this.state

        if (!isPopupVisible) {
            return null
        }

        // Can cause bugs on iOS?
        pos_x -= 29


        return (
            <View
                style={{
                    position: 'absolute',
                    marginTop: 18,
                    backgroundColor: 'white',
                    borderRadius: 15,
                    paddingVertical: 10,
                    width: screenWidth - largePagePadding,
                    zIndex: 1,
                    ...shadowStyle3,
                    right: pos_x + 40
                }}>
                <FontedText style={{ paddingHorizontal: 10 }} >
                    {this.props.Description}
                </FontedText>
            </View>
        )
    }

    render() {

        const { Disable, RLabel, Description, Key, onSelectFile } = this.props
        const { Value } = this.state

        return (

            <View style={{ opacity: Disable == true ? opacityForDisable : 1, flex: 1, paddingVertical: Description && Description.length ? 5 : 0, backgroundColor: 'white' }}
                onLayout={({ nativeEvent: { layout: { x, y } } }) => {
                    this.setState({ pos_x: x, pos_y: y })
                }}
            >
                {this.renderPopup()}
                {Description && Description.length &&
                    <DescriptionIcon
                        style={{ position: 'absolute', right: -10, zIndex: 1 }}
                        onPress={() => {
                            if (Disable != true) {
                                this.setState({ isPopupVisible: !this.state.isPopupVisible })
                            }
                        }}
                    />}

                <ArrowItem
                    onPress={() => {
                        if (Disable != true) {
                            if (this.lockSubmit) {
                                return
                            }

                            pickZipFile(file => {
                                this.setState({
                                    Value: {
                                        FileName: file.fileName,
                                        FileUrl: file.uri,
                                        type: file.type
                                    }
                                }, () => {
                                    this.lockSubmit = true
                                    this.setState({ lockSubmit: true })
                                    UploadFile(this.state.Value, this.props.pageId, Key, res => {
                                        LongToast('dataSaved')
                                        onSelectFile && onSelectFile(this.state.Value)
                                        this.lockSubmit = false
                                        this.setState({ lockSubmit: false })
                                    }, err => {
                                        this.lockSubmit = false
                                        this.setState({ lockSubmit: false })
                                    })
                                })
                            })

                        }
                    }}
                    title={RLabel}
                    style={{ borderWidth: 0.1, paddingHorizontal: 10, borderRadius: 5, marginHorizontal: 15 }}
                    info={Value && Value.FileName ? TrimText(Value.FileName, 20) : null}
                    customIcon={this.state.lockSubmit ? () => <ActivityIndicator size="small" style={{ marginHorizontal: 5 }} color={mainColor} /> : null}
                />
            </View>
        )
    }
}
