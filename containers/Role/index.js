import React, { Component } from 'react'
import { ScrollView,  FlatList, View, KeyboardAvoidingView,Platform,TextInput } from 'react-native'
import { connect } from 'react-redux'
import CustomHeader from '../../components/CustomHeader/index.js';
import LazyContainer from '../../components/LazyContainer'
import ItemSeparator from '../../components/ItemSeparator/index.js';
import HorizontalInput from '../../components/HorizontalInput/index.js';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { largePagePadding, shadowStyle2, pagePadding, largeBorderRadius } from '../../constants/Style.js';
import { withLocalize } from 'react-localize-redux';
import HeaderSubmitButton from '../../components/HeaderSubmitButton/index.js';
import { mainColor } from '../../constants/Colors.js';
import CustomSelector from '../../components/CustomSelector/index.js';
import { GetRole, AddEditRole } from '../../services/RolesService.js';
import ArrowItem from '../../components/ArrowItem/index.js';
import { GetPermissionsSimple } from '../../services/PermissionsService.js';
import TranslatedText from '../../components/TranslatedText/index.js';
import FontedText from '../../components/FontedText/index.js';
import CustomSwitch from '../../components/CustomSwitch/index';
import { STRING_LENGTH_LONG } from '../../constants/Config';
import { LongToast } from '../../utils/Toast.js';
import CustomTouchable from '../../components/CustomTouchable';

class Role extends Component {
	constructor(props) {
		super(props)

		const { languages_data, currLang } = this.props

		this.state = {
			lockSubmit: false,
			didFetchData: false,
			Language: languages_data.find(item => item.code === currLang),
			PermissionsSimple: [],
		}

		if (this.props.route.params && this.props.route.params?.Id) {
			this.editMode = true
			this.roleId = this.props.route.params?.Id
		}
		else {
			this.editMode = false
		}

		this.lockSubmit = false

		this.languageSelectorRef = React.createRef();
		this.permissionsSelectorRef = React.createRef();
	}

	componentDidMount() {
		this.fetchPermissions()

		if (this.roleId) {
			this.fetchRole()
		}
	}
	componentWillUnmount() {
		this.cancelFetchData && this.cancelFetchData()
		this.cancelFetchDataGetPermissionsSimple && this.cancelFetchDataGetPermissionsSimple()
		this.cancelFetchDataAddEditRole && this.cancelFetchDataAddEditRole()
	}

	fetchRole = (language_id = null) => {
		this.cancelFetchData = GetRole(this.roleId, language_id, res => {
			const { LanguageId, ...restData } = res.data
			const { languages_data } = this.props

			this.setState({
				...restData,
				Language: languages_data.find(item => item.key === LanguageId),
				didFetchData: true,
			})
		})
	}

	fetchPermissions = (language_id = null) => {
		this.cancelFetchDataGetPermissionsSimple = GetPermissionsSimple(language_id, res => {
			this.setState({ PermissionsSimple: res.data.Data })
		})
	}
	
	submit = () => {
		if (this.lockSubmit) {
			return
		}
		const { Name, Description, Permissions, Language } = this.state
		if (!Name  || !Permissions || !Permissions.length) {
			const { translate } = this.props
			return LongToast('CantHaveEmptyInputs')
		}

		if (this.editMode) {
			const { Id } = this.state
			this.setState({ lockSubmit: true })
			this.lockSubmit = true
			this.cancelFetchDataAddEditRole = AddEditRole({
				Id,
				Name,
				Description,
				LanguageId: Language.key,
				Permissions,
			}, res => {
				this.setState({ didSucceed: true, })
				this.props.route.params?.onChildChange && this.props.route.params?.onChildChange()
				this.props.navigation.goBack()
			}, err => {
				this.setState({ lockSubmit: false })
				this.lockSubmit = false
			})
		}
		else {
			this.setState({ lockSubmit: true })
			this.lockSubmit = true

			this.cancelFetchDataAddEditRole = AddEditRole({
				Id: 0,
				Name,
				Description,
				LanguageId: Language.key,
				Permissions,
			}, res => {
				this.setState({ didSucceed: true, })
				this.props.route.params?.onChildChange && this.props.route.params?.onChildChange()
				this.props.navigation.goBack()
			}, err => {
				this.setState({ lockSubmit: false })
				this.lockSubmit = false
			})
		}
	}

	onChangePermissionSetting = (index, setting, value) => {
		let copy_items = this.state.Permissions
		copy_items[index][setting] = value
		this.setState({ Permissions: copy_items })
	}

	renderPermissionItem = ({ item, index }) => {
		const { Id, Name, CanRead, CanCreate, CanEdit, CanDelete, CanExport, PermissionId } = item

		return (
			<View
				style={{
					backgroundColor: 'white',
					padding: largePagePadding,
					
				}}>
				
				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'space-between',
						alignItems: 'center',
					}}>
					<FontedText style={{ color: 'black', marginBottom: pagePadding, }}>{Name}</FontedText>

					<CustomTouchable
						onPress={() => {
							this.setState({
								Permissions: this.state.Permissions.filter(item => item.PermissionId !== PermissionId)
							})
						}}
						activeOpacity={0.75}
						style={{
							padding: 5,
						}}>
						<Ionicons
							name={`ios-remove-circle`}
							size={22}
							color='red' />
					</CustomTouchable>
				</View>

				{/* <View
					style={{
						flexDirection: 'row',
						alignItems: 'center',
						marginTop: 5,
						paddingHorizontal: 10,
					}}>
					<View
						style={{
							flex: 1,
							flexDirection: 'row',
							alignItems: 'center',
							paddingRight: 10,
						}}>
						<View
							style={{
								flex: 1,
							}}>
							<TranslatedText
								style={{
									color: 'black',
									fontSize: 12,
									marginRight: 5,
								}}
								text="CanRead" />
						</View>

						<View
							style={{
								flex: 1,
							}}>
							<CustomSwitch
								value={CanRead}
								onValueChange={(value) => { this.onChangePermissionSetting(index, "CanRead", value) }} />
						</View>
					</View>

					<View
						style={{
							flex: 1,
							flexDirection: 'row',
							alignItems: 'center',
						}}>
						<View
							style={{
								flex: 1,
							}}>
							<TranslatedText
								style={{
									color: 'black',
									fontSize: 12,
									marginRight: 5,
								}}
								text="CanCreate" />
						</View>

						<View
							style={{
								flex: 1,
							}}>
							<CustomSwitch
								value={CanCreate}
								onValueChange={(value) => { this.onChangePermissionSetting(index, "CanCreate", value) }} />
						</View>
					</View>
				</View> */}

				{/* <View
					style={{
						flexDirection: 'row',
						alignItems: 'center',
						marginTop: 5,
						paddingHorizontal: 10,
					}}>
					<View
						style={{
							flex: 1,
							flexDirection: 'row',
							alignItems: 'center',
							paddingRight: 10,
						}}>
						<View
							style={{
								flex: 1,
							}}>
							<TranslatedText
								style={{
									color: 'black',
									fontSize: 12,
									marginRight: 5,
								}}
								text="CanEdit" />
						</View>

						<View
							style={{
								flex: 1,
							}}>
							<CustomSwitch
								value={CanEdit}
								onValueChange={(value) => { this.onChangePermissionSetting(index, "CanEdit", value) }} />
						</View>
					</View>

					<View
						style={{
							flex: 1,
							flexDirection: 'row',
							alignItems: 'center',
						}}>
						<View
							style={{
								flex: 1,
							}}>
							<TranslatedText
								style={{
									color: 'black',
									fontSize: 12,
									marginRight: 5,
								}}
								text="CanDelete" />
						</View>

						<View
							style={{
								flex: 1,
							}}>
							<CustomSwitch
								value={CanDelete}
								onValueChange={(value) => { this.onChangePermissionSetting(index, "CanDelete", value) }} />
						</View>
					</View>
				</View> */}

				{/* <View
					style={{
						flexDirection: 'row',
						alignItems: 'center',
						marginTop: 5,
						paddingHorizontal: 10,
					}}>
					<View
						style={{
							flex: 1,
							flexDirection: 'row',
							alignItems: 'center',
							paddingRight: 10,
						}}>
						<View
							style={{
								flex: 1,
							}}>
							<TranslatedText
								style={{
									color: 'black',
									fontSize: 12,
									marginRight: 5,
								}}
								text="CanExport" />
						</View>


						<View
							style={{
								flex: 1,
							}}>
							<CustomSwitch
								value={CanExport}
								onValueChange={(value) => { this.onChangePermissionSetting(index, "CanExport", value) }} />
						</View>
					</View>

					<View
						style={{
							flex: 1,
						}} />
				</View> */}
			</View>
		)
	}

	renderContent = () => {
		if (this.state.didFetchData || !this.editMode) {
			const { Language, Name, Description, ChangeToLanguage } = this.state

			return (
				<ScrollView
					contentContainerStyle={{
						paddingBottom: largePagePadding * 3,
					}}>
					<ArrowItem
						onPress={() => {
							this.languageSelectorRef.current.show()
						}}
						title={'Language'}
						info={ChangeToLanguage ? ChangeToLanguage.label : Language.label} />

					<ItemSeparator />

					<HorizontalInput
						maxLength={STRING_LENGTH_LONG}
						label="Name"
						value={Name}
						onChangeText={(text) => { this.setState({ Name: text }) }} />

					<ItemSeparator />

					<HorizontalInput
					// numberOfLines={10}
						multiline
						label="Description"
						value={Description}
						style={{ maxHeight: 150 }}
						onChangeText={(text) => { this.setState({ Description: text }) }} />

					<ItemSeparator />

					<FlatList
						data={this.state.Permissions}
						keyExtractor={({ PermissionId }) => `${PermissionId}`}
						ItemSeparatorComponent={() => <ItemSeparator />}
						renderItem={this.renderPermissionItem} />
				</ScrollView>
			)
		}
	}

	onSelectLanguage = (index) => {
		const { languages_data } = this.props
		const selectedLanguage = languages_data[index]
		if (this.editMode) {
			this.setState({ ChangeToLanguage: selectedLanguage }, () => {
				this.fetchRole(this.state.ChangeToLanguage.key)
				this.fetchPermissions(this.state.ChangeToLanguage.key)
			})
		} else {
			this.setState({ ChangeToLanguage: selectedLanguage }, () => {
				// this.fetchPermissions(this.state.ChangeToLanguage.key)
			})
		}
	}

	addPermission = (permission) => {
		const { Permissions } = this.state

		if (!Permissions || !Permissions.length || Permissions.findIndex(item => item.PermissionId === permission.Id) === -1) {
			const { Id, Name } = permission

			const newPermission = {
				PermissionId: Id,
				Name,
				CanRead: false,
				CanCreate: false,
				CanEdit: false,
				CanDelete: false,
				CanExport: false
			}

			this.setState({
				Permissions: Permissions ? [
					newPermission,
					...Permissions,
				] : [
						newPermission
					]
			})
		}
	}

	render() {
		const { languages_data } = this.props
		const { PermissionsSimple } = this.state

		return (
			<LazyContainer style={{ flex: 1, backgroundColor: "#FFF" }}>
				<CustomHeader
					navigation={this.props.navigation}
					title={"Role"}
					rightComponent={
						<HeaderSubmitButton
							isLoading={this.state.lockSubmit}
							didSucceed={this.state.didSucceed}
							onPress={() => { this.submit() }}
							 />
					}
				/>
				{
					Platform.OS == 'ios' ?

						<KeyboardAvoidingView behavior='padding' enabled
							style={{ flex: 1 }}
							keyboardVerticalOffset={40}
						>
							{this.renderContent()}
						</KeyboardAvoidingView> :

						this.renderContent()
				}
				{/* {this.renderContent()} */}

				<CustomTouchable
					onPress={() => {
						this.permissionsSelectorRef.current.show()
					}}
					activeOpacity={0.75}
					style={{
						position: 'absolute',
						bottom: largePagePadding,
						right: largePagePadding,
						flexDirection: 'row',
						justifyContent: 'center',
						alignItems: 'center',
						borderRadius: largeBorderRadius,
						paddingVertical: 5,
						paddingHorizontal: 12,
						backgroundColor: mainColor,
						...shadowStyle2,
					}}>
					<Ionicons
						name={`ios-add`}
						size={22}
						color={'white'} />

					<TranslatedText style={{ marginLeft: pagePadding, fontSize: 12, color: 'white' }} text="Permission" />
				</CustomTouchable>

				<CustomSelector
					ref={this.languageSelectorRef}
					options={languages_data.map(item => item.label)}
					onSelect={(index) => { this.onSelectLanguage(index) }}
					onDismiss={() => { }}
				/>

				<CustomSelector
					ref={this.permissionsSelectorRef}
					options={PermissionsSimple.map(item => item.Name)}
					onSelect={(index) => { this.addPermission(PermissionsSimple[index]) }}
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

export default connect(mapStateToProps)(withLocalize(Role))