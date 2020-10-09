import React, { Component } from 'react'
import { ScrollView, View, ImageBackground } from 'react-native'
import { connect } from 'react-redux'
import CustomHeader from '../../components/CustomHeader/index.js';
import LazyContainer from '../../components/LazyContainer'
import { withLocalize } from 'react-localize-redux';
import CustomSelector from '../../components/CustomSelector/index.js';
import SettingsTitle from '../../components/Settings/SettingsTitle.js';
import SettingsItem from '../../components/Settings/SettingsItem.js';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { GetUser, LogoutUser, ChangeUserLanguage, ChangeUserImage, TimeZoneForUser, TestNotificationForUser } from '../../services/UsersService.js';
import { largePagePadding } from '../../constants/Style.js';
import { mainColor } from '../../constants/Colors.js';
import FontedText from '../../components/FontedText/index.js';
import { showImagePicker } from '../../utils/Image.js';
import CircularImage from '../../components/CircularImage/index.js';
import ConfirmModal from '../../components/ConfirmModal/index.js';
import ArrowItem from '../../components/ArrowItem/index.js';
import ItemSeparator from '../../components/ItemSeparator/index.js';
import LinearGradient from 'react-native-linear-gradient';
import CustomLoader from '../../components/CustomLoader/index';
import { IsScreenPermitted } from '../../utils/Permissions.js';
import CustomTouchable from '../../components/CustomTouchable';
import { LongToast } from '../../utils/Toast.js';
import { getFilters } from '../../services/FilterService.js';
import CustomImagePicker from '../../components/CustomImagePicker/index.js';
import ConditionalCircularImage from '../../components/ConditionalCircularImage/index.js';
class User extends Component {
	constructor(props) {
		super(props)

		const { Id } = this.props.route.params
		this.userId = Id

		this.state = {
			didFetchData: false,
			picker_image_uri: null,
			currentLanguageName: null,
			uploadingImage: false,
			prossesEvent: 0,
			remoteImage: false
		}

		this.selectorRef = React.createRef();
		this.confirmRef = React.createRef();
		this.imagePicker = React.createRef();
		this.TimeZoneselectorRef = React.createRef();
		this.testNotififcation = React.createRef();
	}

	componentDidMount() {

		this.fetchData()
	}

	componentWillUnmount() {
		this.cancelFetchData && this.cancelFetchData()
	}

	fetchData = () => {
		const { userId } = this

		getFilters({ timeZones: true }, resFiltter => {
			this.cancelFetchData = GetUser(userId, res => {
				const { Langugae, TimeZoneFull, ...otherData } = res.data
				this.setState({
					...otherData,
					TimeZones: resFiltter.data.TimeZones,
					TimeZone: TimeZoneFull,
					currentLanguageName: Langugae.Name,
					didFetchData: true,
					remoteImage: true
				})
			})
		})

	}

	renderImage = () => {
		const imageSize = 90

		if (!this.state.didFetchData) {
			return (
				<View
					style={{
						alignSelf: 'center',
						justifyContent: 'center',
						alignItems: 'center',
						marginBottom: largePagePadding,
					}}>
					<CircularImage
						uri={'https://'}
						size={imageSize} />
				</View>
			)
		}

		const { ImageUrl } = this.state.Image
		const { picker_image_uri } = this.state

		return (
			<CustomTouchable
				onPress={() => {
					if (!this.state.uploadingImage) {
						this.imagePicker.current.show()
					}
				}}
				style={{
					alignSelf: 'center',
					justifyContent: 'center',
					alignItems: 'center',
					marginBottom: largePagePadding,
				}}>
				<ConditionalCircularImage
					remote={this.state.remoteImage}
					uri={picker_image_uri || ImageUrl}
					size={imageSize}
				/>

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
	}

	renderHeader = () => {
		const { FirstName, SecondeName, LoginAccount, Role } = this.state

		return (
			<ImageBackground
				blurRadius={5}
				style={{ flex: 1, }}
				source={{ uri: this.state.didFetchData ? this.state.Image.ImageUrl : 'https://' }}
			>
				<LinearGradient
					colors={['rgba(0, 0, 0, .1)', 'rgba(0, 0, 0, .6)', 'rgba(0, 0, 0, 1)']}
					style={{
						flex: 1,
						paddingVertical: largePagePadding,
						justifyContent: 'center',
						alignItems: 'center',
					}}>
					{this.renderImage()}
					<FontedText style={{ color: '#FFF', textAlign: 'center' }}>{FirstName} {SecondeName}</FontedText>
					<FontedText style={{ color: '#e6f0f7' }}>{LoginAccount}</FontedText>
					<FontedText style={{ color: '#e6f0f7' }}>{Role ? Role.Name : ''}</FontedText>
				</LinearGradient>
			</ImageBackground>
		)
	}

	onSelectLanguage = (index) => {
		const { languages_data } = this.props
		const selectedLanguage = languages_data[index]

		ChangeUserLanguage(this.userId, selectedLanguage.key, res => {
			this.setState({
				currentLanguageName: selectedLanguage.label
			})

			if (this.props.userId === this.userId) {
				LongToast('PleaseWait')
				const { switchLanguage } = this.props
				switchLanguage(selectedLanguage.key, selectedLanguage.code)
			}
		})
	}

	ChangeUserTimeZone = (TimeZone) => {

		this.setState({ TimeZone: TimeZone }, () => {
			// alert(JSON.stringify(TimeZone.Object1))
			TimeZoneForUser({
				UserId: this.userId,
				TimeZone: TimeZone.Object1
			}, () => { LongToast('dataSaved') })
		})

	}
	onChildChange = () => {
		this.props.route.params?.onChildChange && this.props.route.params?.onChildChange()
		this.fetchData()
	}

	render() {
		const { languages_data } = this.props
		const { TimeZones } = this.state
		return (
			<LazyContainer style={{ flex: 1, backgroundColor: "#F4F6F9" }}>
				<CustomHeader
					navigation={this.props.navigation}
					title={"User"} />

				<ScrollView
					contentContainerStyle={{
					}}>
					{this.renderHeader()}

					<SettingsTitle title={"Info"} />
					<ArrowItem
						onPress={() => {
							this.props.navigation.navigate('UserPersonalInfo', {
								Id: this.userId,
								onChildChange: this.onChildChange,
							})
						}}
						title="PersonalInfo" />

					<ItemSeparator />

					<ArrowItem
						onPress={() => {
							this.props.navigation.navigate('UserChangePassword', {
								Id: this.userId,
							})
						}}
						title="ChangePassword" />

					<ItemSeparator />

					<ArrowItem
						onPress={() => {
							this.selectorRef.current.show()
						}}
						title="Language"
						info={this.state.currentLanguageName} />

					<ItemSeparator />

					<ArrowItem
						onPress={() => {
							this.TimeZoneselectorRef.current.show()
						}}
						title="TimeZone"
						info={this.state.TimeZone && this.state.TimeZone.Object2 ? this.state.TimeZone.Object2 : null} />

					<ItemSeparator />

					{this.state.DriverStatus && this.state.DriverStatus.Id != 1 &&
						<View>
							<ArrowItem
								onPress={() => {
									this.props.navigation.navigate('DriverReport', {
										Id: this.userId
									})
								}}
								title="DriverRebort"
							/>
							<ItemSeparator />
						</View>
					}


					<ArrowItem
						onPress={() => {
							this.props.navigation.navigate('OrderChat', {
								fromUser: true,
								ToUser: this.userId,
							})
						}}
						title="Chat"
					/>
					<ItemSeparator />
					{this.props.userId == this.userId ?
						<View>
							<ArrowItem
								onPress={() => {
									this.testNotififcation.current.show()
								}}
								title="TestNotification"
							/><ItemSeparator />
						</View> : null
					}
					<ArrowItem
						onPress={() => {
							this.props.navigation.navigate('UserNotificationPreferences', {
								Id: this.userId,
							})
						}}
						title="Notifications"
					/>
					<ItemSeparator />

					<SettingsTitle title={"Security"} />

					{IsScreenPermitted("Users") && <View>
						<ArrowItem
							onPress={() => {
								this.props.navigation.navigate('UserPermissions', {
									Id: this.userId,
									onChildChange: this.onChildChange,
								})
							}}
							title="Permissions" />

						<ItemSeparator />
					</View>}

					<ArrowItem
						onPress={() => {
							this.props.navigation.navigate('Sessions', {
								Id: this.userId,
							})
						}}
						title="LoginHistory" />

					<SettingsTitle />

					<SettingsItem
						onPress={() => {
							this.confirmRef.current.show()
						}}
						leftComponent={
							<SimpleLineIcons
								name={"logout"}
								size={20}
								color={"#140F26"} />
						}
						info="Logout"
						infoStyle={{
							color: '#D84242'
						}} />
				</ScrollView>

				<CustomSelector
					ref={this.selectorRef}
					options={languages_data.map(item => item.label)}
					onSelect={(index) => { this.onSelectLanguage(index) }}
					onDismiss={() => { }}
				/>

				<ConfirmModal
					ref={this.testNotififcation}
					onConfirm={() => {
						TestNotificationForUser(this.userId, res => {
							LongToast('TwoPushnotificaitonhavebeensent')
						})
					}}
				/>

				{TimeZones && <CustomSelector
					ref={this.TimeZoneselectorRef}
					options={TimeZones.map(item => item.Object2)}
					onSelect={(index) => {
						this.ChangeUserTimeZone(TimeZones[index])
					}}
					onDismiss={() => { }}
				/>}

				<ConfirmModal
					ref={this.confirmRef}
					onConfirm={() => {
						LogoutUser(this.userId, () => {
							if (this.props.userId === this.userId) {
								this.props.setIsLoggedIn(false)
							}
						})
					}}
				/>
				<CustomImagePicker
					onSelect={Data => {
						if (Data) {
							const { uri, path } = Data
							this.setState({ picker_image_uri: uri, uploadingImage: true, prossesEvent: 0, remoteImage: false })
							ChangeUserImage(this.userId, path, () => {
								this.setState({ uploadingImage: false, prossesEvent: 0, Image: { ...this.state.Image, ImageUrl: uri } })

								this.props.route.params?.onChildChange && this.props.route.params?.onChildChange()

								if (this.props.userId === this.userId) {
									GetHello(hello_res => {
										const { user } = hello_res.data
										this.props.setUserData(user)
									})
								}
							}, err => {
								this.setState({ uploadingImage: false, prossesEvent: 0 })
							}, (re) => {
								this.setState({ prossesEvent: re * 0.01 })
							})
						}
					}}
					refrence={this.imagePicker}
				/>
			</LazyContainer>
		)
	}
}

const mapStateToProps = ({
	language: {
		languages_data,
	},
	login: {
		userId,
	},
}) => ({
	languages_data,
	userId,
})

function mergeProps(stateProps, { dispatch }, ownProps) {
	const {
		actions: {
			setUserData,
			setIsLoggedIn,
		}
	} = require('../../redux/LoginRedux');

	const {
		actions: {
			switchLanguage,
		}
	} = require('../../redux/LangRedux.js');

	return {
		...ownProps,
		...stateProps,
		setUserData: (user_data) => setUserData(dispatch, user_data),
		setIsLoggedIn: (is_logged_in) => setIsLoggedIn(dispatch, is_logged_in),
		switchLanguage: (language_id, code, update_translations, callback) => switchLanguage(dispatch, language_id, code, update_translations, callback),
	};
}

export default connect(mapStateToProps, undefined, mergeProps)(withLocalize(User))