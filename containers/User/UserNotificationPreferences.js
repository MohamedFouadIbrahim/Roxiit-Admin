import React, { Component } from 'react';
import { withLocalize } from 'react-localize-redux';
import CustomHeader from '../../components/CustomHeader/index.js';
import HeaderSubmitButton from '../../components/HeaderSubmitButton/index.js';
import LazyContainer from '../../components/LazyContainer';
import RemoteDataContainer from '../../components/RemoteDataContainer/index.js';
import { EditUserNotificationPreferences } from '../../services/UsersService.js';
import { View, Switch } from 'react-native';
import FontedText from '../../components/FontedText/index.js';
import { secondTextColor } from '../../constants/Colors';

class UserNotificationPreferences extends Component {
	constructor(props) {
		super(props)

		const { Id } = this.props.route.params
		this.userId = Id

		this.state = {
			lockSubmit: false,
			didFetchData: false,
		}

		this.lockSubmit = false
	}

	submit = () => {

		if (this.lockSubmit) {
			return
		}

		const {
			data
		} = this.state

		this.setState({ lockSubmit: true })
		this.lockSubmit = true

		EditUserNotificationPreferences({
			UserId: this.userId,
			SelectedIds: data.filter(item => item.IsSelected == true).map(item => item.Id)
		}, () => {
			this.setState({ didSucceed: true, })
			this.props.navigation.goBack()
		}, () => {
			this.setState({ lockSubmit: false })
			this.lockSubmit = false
		})
	}

	onValueChange = (CurrentItem) => {

		const list = this.state.data.map(item => {
			if (item.Id == CurrentItem.Id) {
				return {
					...CurrentItem
				}
			}
			else {
				return {
					...item
				}
			}
		});

		this.setState({ data: list });

	}

	renderItem = ({ item, index }) => {

		const {
			Id
		} = item

		return (
			<RowItem item={item} key={String(Id)} onValueChange={this.onValueChange} />
		)

	}


	render() {

		return (
			<LazyContainer style={{ flex: 1, backgroundColor: "#FFF" }}>

				<CustomHeader
					navigation={this.props.navigation}
					title={"Notifications"}
					rightComponent={
						<HeaderSubmitButton
							isLoading={this.state.lockSubmit}
							didSucceed={this.state.didSucceed}
							onPress={() => { this.submit() }} />
					} />

				<RemoteDataContainer
					url={'User/Notifications-preferences'}
					params={`userId=${this.userId}`}
					renderItem={this.renderItem}
					onDataFetched={(data) => {
						this.setState({ data })
					}}
					keyExtractor={(item, index) => String(index)}
				/>

			</LazyContainer>
		)
	}
}

class RowItem extends React.PureComponent {
	constructor(props) {
		super(props)

		const {
			item
		} = this.props

		this.state = {
			item
		}
	}


	render() {

		const {
			item
		} = this.state

		const {
			onValueChange
		} = this.props

		const {
			Name,
			Id,
			IsDisabled,
			IsSelected
		} = item

		return (

			<View
				style={{
					paddingVertical: 15,
					paddingHorizontal: 20,
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center',
					backgroundColor: 'white',
				}}>
				<View
					style={{
						justifyContent: 'center',
					}}>
					<FontedText style={{
						// color: '#949EA5'
						color: secondTextColor
					}} >
						{Name}
					</FontedText>
				</View>

				<View
					style={{
						flexDirection: 'row',
						alignItems: 'center',
						paddingLeft: 10,
					}}>
					<Switch
						disabled={IsDisabled}
						value={IsSelected}
						onValueChange={(value) => {
							if (IsDisabled) {
								return
							}
							this.setState({ item: { ...item, IsSelected: value } }, () => { onValueChange(this.state.item) });
						}}
					/>
				</View>
			</View>

		)
	}
}
export default withLocalize(UserNotificationPreferences)