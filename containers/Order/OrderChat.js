import React from 'react';
import { withLocalize } from 'react-localize-redux';
import { ActivityIndicator, Linking, Platform, View, BackHandler } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import ConfirmModal from '../../components/ConfirmModal';
import CustomChat from '../../components/CustomChat';
import CustomHeader from '../../components/CustomHeader';
import CustomSelector from '../../components/CustomSelector';
import LazyContainer from '../../components/LazyContainer';
import { GetChat, GetChatForCustomer, SendFile, SendFileWithoutOrder, SendMsg, SendMsgForCustomer } from '../../services/OrdersService';
import { GetUserChat, SendFileForUser, SendMsgForUser } from '../../services/UsersService';
import { pickFile } from '../../utils/File';
import { showImagePicker, OpenCamera, OpenSingleSelectImagePicker } from '../../utils/Image';
import { LongToast, ShortToast } from '../../utils/Toast';
import CustomTouchable from '../../components/CustomTouchable';
import Ionicons from 'react-native-vector-icons/Ionicons'

class Chat extends React.Component {
    constructor(props) {

        super(props)

        if (this.props.route.params && this.props.route.params?.fromCustomer == true) {

            this.customerId = this.props.route.params?.CustomerId
        }

        if (this.props.route.params && this.props.route.params?.fromCustomer == false) {

            this.customerId = this.props.route.params?.CustomerId
            this.orderId = this.props.route.params?.orderId
        }

        if (this.props.route.params && this.props.route.params?.fromUser == true) {

            this.ToUser = this.props.route.params?.ToUser

        }

        if (this.props.route.params && this.props.route.params?.profileIcon) {

            this.profileIcon = this.props.route.params?.profileIcon
        }

        this.state = {
            didDataFetched: false,
            uploadingFile: false
        }

        this.uploadingFile = false
        // this.showUplaodFileIcon = this.props.route.params?.fromCustomer == false ? true : false

        this.LibraryOrCameraRef = React.createRef();
        this.LibraryOrCameraOptions = [{ Id: 0, Name: 'Camera' }, { Id: 1, Name: 'Library' }]

        this.confirmRef = React.createRef()
        this.optionsRef = React.createRef()

        this.handelShowToast()
    }

    uploadFile = () => {

        if (this.uploadingFile) {
            return
        }

        const { fromCustomer } = this.props.route.params

        this.setState({ uploadingFile: true })
        this.uploadingFile = true

        if (this.props.route.params?.fromUser == true) {

            SendFileForUser(this.ToUser, this.file, res => {
                const { Time, Message, User, Id, FileUrl } = res.data

                this.setState(previousState => ({
                    messages: GiftedChat.append(previousState.messages, [{
                        createdAt: Time,
                        text: Message,
                        _id: Id,
                        user: { _id: User },
                        FileUrl
                    }]),
                }))

                this.setState({ uploadingFile: false })
                this.uploadingFile = false

            }, err => {

                this.setState({ uploadingFile: false })
                this.uploadingFile = false
                LongToast('filetypenotsupported')

            })

        } else {

            if (!fromCustomer) {

                SendFile(this.orderId, this.customerId, this.file, res => {

                    const { Time, Message, User, Id, FileUrl } = res.data

                    this.setState(previousState => ({
                        messages: GiftedChat.append(previousState.messages, [{
                            createdAt: Time,
                            text: Message,
                            _id: Id,
                            user: { _id: User },
                            FileUrl
                        }]),
                    }))

                    this.setState({ uploadingFile: false })
                    this.uploadingFile = false

                }, err => {

                    this.setState({ uploadingFile: false })
                    this.uploadingFile = false
                    LongToast('filetypenotsupported')

                })

            } else {
                SendFileWithoutOrder(this.customerId, this.file, res => {

                    const { Time, Message, User, Id, FileUrl } = res.data

                    this.setState(previousState => ({
                        messages: GiftedChat.append(previousState.messages, [{
                            createdAt: Time,
                            text: Message,
                            _id: Id,
                            user: { _id: User },
                            FileUrl
                        }]),
                    }))

                    this.setState({ uploadingFile: false })
                    this.uploadingFile = false

                }, err => {

                    this.setState({ uploadingFile: false })
                    this.uploadingFile = false
                    LongToast('filetypenotsupported')

                })
            }

        }
    }

    pickFile = () => {
        if (Platform.OS == 'android') {
            this.selectFile()
        } else {
            this.optionsRef.current.show()
        }
    }

    selectFile = () => {
        pickFile((data) => {
            this.confirmRef.current.show()
            this.file = data
        })
    }

    onSend(messages = []) {

        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }))

        if (this.props.route.params && this.props.route.params?.fromUser == true) {

            SendMsgForUser({
                Message: messages[0].text,
                ToUserId: this.ToUser
            })

        } else {

            if (this.props.route.params?.fromCustomer == true) {

                SendMsgForCustomer({
                    Message: messages[0].text,
                    CustomerId: this.customerId
                })

            } else {

                SendMsg({
                    Message: messages[0].text,
                    OrderId: this.orderId,
                    CustomerId: this.customerId
                })

            }

        }

    }

    handelShowToast = () => {
        if (this.props.route.params?.fromUser == true) {
            this.showToast = false
        } else if (this.props.route.params?.fromCustomer == true) {
            this.showToast = true
        } else {
            this.showToast = true
        }
    }

    componentWillUnmount() {
        this.backHandler.remove();
    }

    componentDidMount() {

        // fromCustomer == true That Mean We comming from Customers 
        // fromCustomer == fasle That Mean We comming from Orders 
        // fromUser == true That Mean We comming from Users

        if (this.props.route.params?.fromUser == true) {

            GetUserChat(this.ToUser, res => {
                const newMssege = res.data.Data.Messages.map(item => {
                    return {
                        _id: item.Id,
                        text: item.Message,
                        createdAt: item.Time,
                        FileUrl: item.FileUrl,
                        user: {
                            _id: item.User,
                            avatar: res.data.Data.User.Image.ImageUrl
                        }
                    }
                })
                this.setState({
                    messages: newMssege,
                    user: res.data.Data.User,
                    CDNUrl: res.data.Data.CDNUrl,
                    didDataFetched: true
                })
            })

        } else {

            if (this.props.route.params?.fromCustomer == true) {

                GetChatForCustomer(this.customerId, res => {
                    const newMssege = res.data.Data.Messages.map(item => {
                        return {
                            _id: item.Id,
                            text: item.Message,
                            createdAt: item.Time,
                            FileUrl: item.FileUrl,
                            user: {
                                _id: item.User,
                                UserName: item.UserName,
                                avatar: res.data.Data.Customer.Media.ImageUrl
                            }
                        }
                    })
                    this.setState({
                        messages: newMssege,
                        user: res.data.Data.User,
                        CDNUrl: res.data.Data.CDNUrl,
                        didDataFetched: true
                    })
                })

            } else {

                GetChat(this.customerId, this.orderId, res => {
                    const newMssege = res.data.Data.Messages.map(item => {
                        return {
                            _id: item.Id,
                            text: item.Message,
                            FileUrl: item.FileUrl,
                            createdAt: item.Time,
                            user: {
                                _id: item.User,
                                UserName: item.UserName,
                                avatar: res.data.Data.Customer.Media.ImageUrl,
                            }
                        }
                    })
                    this.setState({
                        messages: newMssege,
                        user: res.data.Data.User,
                        CDNUrl: res.data.Data.CDNUrl,
                        didDataFetched: true
                    })
                })
            }
        }

        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            this.props.route.params?.onChildChange && this.props.route.params?.onChildChange()
            this.props.navigation.goBack()
            return true
        });
    }

    onSelectOption = (index) => {
        if (index == 0) {
            // OpenSingleSelectImagePicker(data=>{
            //     if (data) {
            //         this.confirmRef.current.show()
            //         this.file = data
            //     } 
            // })

            showImagePicker((data) => {
                if (data) {
                    this.confirmRef.current.show()
                    this.file = data
                }

            }, null, true)
        } else {
            this.selectFile()
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

    onTextPress = (currentMessage, showToast) => {

        // alert(currentMessage.user.UserName)
        if (currentMessage.user.UserName && !showToast) {
            ShortToast(currentMessage.user.UserName, false)
        }

        if (currentMessage.FileUrl) {

            Linking.openURL(`${this.state.CDNUrl}${currentMessage.FileUrl}`)
        }

    }

    onProfilePress = () => {
        const {
            Id,
            navigateTo
        } = this.profileIcon

        switch (navigateTo) {
            case 'Customer':
                this.props.navigation.navigate(navigateTo, {
                    Id
                })
                break;

            case 'UserHome':
                this.props.navigation.navigate(navigateTo, {
                    Id
                })
                break;

            case 'Order':
                this.props.navigation.navigate(navigateTo, {
                    Id
                })
                break;

            default:
                return
        }
    }

    render() {

        const { translate } = this.props
        if (!this.state.didDataFetched) {
            return null
        }
        return (

            <LazyContainer style={{ flex: 1 }} >
                <CustomHeader
                    title='Chat'
                    navigation={this.props.navigation}
                    rightNumOfItems={this.profileIcon && this.profileIcon.navigateTo ? 3 : this.profileIcon ? 2 : 1}
                    rightComponent={
                        <View style={{ flexDirection: 'row', alignItems: 'center' }} >

                            {/* load file icon */}

                            <CustomTouchable
                                onPress={this.pickFile}
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    flex: 1,
                                }}>
                                {this.state.uploadingFile ?
                                    <ActivityIndicator size='small' color={'white'} /> :
                                    <Ionicons
                                        name={`md-attach`}
                                        size={24}
                                        color={'white'} />}
                            </CustomTouchable>

                            {/* go to profile icon */}
                            {this.profileIcon ?
                                <CustomTouchable
                                    onPress={this.onProfilePress}
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        flex: 1,
                                    }}>
                                    <Ionicons
                                        name={`md-person`}
                                        size={24}
                                        color={'white'} />
                                </CustomTouchable>
                                : null}

                            {/* go to note icon */}
                            {this.profileIcon && this.profileIcon.navigateTo == 'Order' ?
                                <CustomTouchable
                                    onPress={() => { this.props.navigation.navigate('OrderNote', { Id: this.orderId }) }}
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        flex: 1,
                                    }}>
                                    <Ionicons
                                        name={`ios-paper`}
                                        size={24}
                                        color={'white'} />
                                </CustomTouchable>

                                : null
                            }
                        </View>

                    }
                    onBack={() => { this.props.route.params?.onChildChange && this.props.route.params?.onChildChange() }}
                />

                <CustomChat
                    CDNUrl={this.state.CDNUrl}
                    onTextPress={(data, showToast) => { this.onTextPress(data, showToast) }}
                    messages={this.state.messages}
                    onSendMsg={(data) => { this.onSend(data) }}
                    reseverId={this.state.user.Id}

                />

                <ConfirmModal
                    ref={this.confirmRef}
                    onConfirm={() => { this.uploadFile() }}
                    onResponse={(check) => { }}
                />

                <CustomSelector
                    ref={this.optionsRef}
                    options={[{ Id: 0, Name: translate('Image') }, { Id: 1, Name: translate('File') }].map(item => item.Name)}
                    onSelect={(index) => {
                        this.onSelectOption(index)
                    }}
                    onDismiss={() => { }}
                />

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

export default withLocalize(Chat)