import React, { Component } from 'react'
import { FlatList,  View } from 'react-native'
import CustomHeader from '../../components/CustomHeader/index.js';
import LazyContainer from '../../components/LazyContainer'
import { withLocalize } from 'react-localize-redux';
import HeaderSubmitButton from '../../components/HeaderSubmitButton/index.js';
import { GetUserPermissions, EditUserPermissions } from '../../services/UsersService.js';
import { secondColor, mainTextColor } from '../../constants/Colors.js';
import FontedText from '../../components/FontedText/index.js';
import ArrowItem from '../../components/ArrowItem/index.js';
import SettingsTitle from '../../components/Settings/SettingsTitle.js';
import CustomSelector from '../../components/CustomSelector/index.js';
import CheckBox from '../../components/CheckBox/index.js';
import CustomTouchable from '../../components/CustomTouchable';

class UserPermissions extends Component {
	constructor(props) {
		super(props)

		const { Id } = this.props.route.params
		this.userId = Id

		this.state = {
			lockSubmit: false,
			didFetchData: false,
			triggerListRender: false,
		}

		this.lockSubmit = false
		this.selectorRef = React.createRef();
	}

	componentDidMount() {
		GetUserPermissions(this.userId, res => {
			this.setState({
				...res.data,
				didFetchData: true,
			})
		})
	}

	submit = () => {
		if (this.lockSubmit) {
			return
		}

		this.setState({ lockSubmit: true })
		this.lockSubmit = true

		const {
			role,
			wareouseItems,
		} = this.state

		EditUserPermissions({
			userId: this.userId,
			role: role.Id,
			wareouseItems
		}, () => {
			this.setState({ didSucceed: true, })
			this.props.route.params?.onChildChange && this.props.route.params?.onChildChange()
			this.props.navigation.goBack()
		}, () => {
			this.setState({ lockSubmit: false })
			this.lockSubmit = false
		})
	}

	onSelectWarehouse = (item, index) => {
		const copy_items = this.state.wareouseItems
		copy_items[index].isSelected = !copy_items[index].isSelected

		this.setState({
			wareouseItems: copy_items,
			triggerListRender: !this.state.triggerListRender,
		})
	}

	renderItem = ({ item, index }) => {
		const { Name, isSelected } = item

		return (
			<CustomTouchable
				activeOpacity={0.85}
				onPress={() => this.onSelectWarehouse(item, index)}
				style={{
					paddingHorizontal: 20,
					paddingVertical: 15,
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center',
					backgroundColor: 'white',
				}}>
				<FontedText style={{
					color: isSelected ?
						secondColor : mainTextColor
					//'#3B3B4D'
				}}>{Name}</FontedText>

				<CheckBox
					selected={isSelected} />
			</CustomTouchable>
		)
	}

	renderRoleSelector = () => {
		const {
			role,
		} = this.state

		return (
			<View>
				<ArrowItem
					style={{
						backgroundColor: 'white',
					}}
					onPress={() => {
						this.selectorRef.current.show()
					}}
					title={'Role'}
					info={role.Name} />

				<SettingsTitle title={"Warehouses"} />
			</View>
		)
	}

	renderContent = () => {
		if (this.state.didFetchData) {
			const {
				wareouseItems,
			} = this.state

			return (
				<FlatList
					ListHeaderComponent={this.renderRoleSelector}
					keyExtractor={(item) => String(item.Id)}
					data={wareouseItems}
					extraData={this.state.triggerListRender}
					renderItem={this.renderItem} />
			)
		}
	}

	render() {
		const {
			availableRoles,
		} = this.state

		return (
			<LazyContainer style={{ flex: 1, backgroundColor: "#F4F6F9" }}>
				<CustomHeader
					navigation={this.props.navigation}
					title={"Permissions"}
					rightComponent={
						<HeaderSubmitButton
							isLoading={this.state.lockSubmit}
							didSucceed={this.state.didSucceed}
							onPress={() => { this.submit() }} />
					} />

				{this.renderContent()}

				{availableRoles && <CustomSelector
					ref={this.selectorRef}
					options={availableRoles.map(item => item.Name)}
					onSelect={(index) => { this.setState({ role: availableRoles[index], triggerListRender: !this.state.triggerListRender, }) }}
					onDismiss={() => { }}
				/>}
			</LazyContainer>
		)
	}
}

export default withLocalize(UserPermissions)