import React, { Component } from 'react'
import { connect } from 'react-redux'
import { DEFAULT_ROOT_URL_DEV, DEFAULT_ROOT_URL_DIST, POST } from './utils/Network';
import LanguageInitializer from './LanguageInitializer';
import { GetCountries } from './services/PlacesService';
import { isDevelopmentMode } from './constants/Config';
import { subscribeToTopic, unsubscribeFromTopic } from './utils/FCM';
import { GetHello } from './services/HelloService';
import { getFilters } from './services/FilterService';
import { GetRuntimeConfig } from './services/RuntimeConfigService';
import ConnectionErorr from './components/ConnectionErorr';

class Hello extends Component {
	constructor() {
		super()

		this.state = {
			didFetchData: false,
			translation_version: null,
			language_version: null,
			showErorrConnectionModal: false,
		}
	}

	componentDidMount() {
		if (!this.props.root_url) {
			this.props.setRootURL(isDevelopmentMode ? DEFAULT_ROOT_URL_DEV : DEFAULT_ROOT_URL_DIST)
		}

		this.requestHello()
	}

	handleTopicsSubscription = (pushNsTopics, pushNsTopicsUnsubscribe) => {
		const { subscribed_topics } = this.props

		if (subscribed_topics !== pushNsTopics && pushNsTopics && pushNsTopics.length) {
			const { setSubscribedTopics } = this.props

			pushNsTopics.split(",").forEach(item => {
				subscribeToTopic(item)
			})

			setSubscribedTopics(pushNsTopics)
		}

		if (pushNsTopicsUnsubscribe && pushNsTopicsUnsubscribe.length) {
			pushNsTopicsUnsubscribe.split(",").forEach(item => {
				unsubscribeFromTopic(item)
			})

			POST(`User/Topic/Unsubscribe?topics=${pushNsTopicsUnsubscribe}`, {})
		}
	}

	getRuntimeConfig = (runtime_version, callback) => {
		const { runtime_config, runtime_config_version } = this.props

		if (!runtime_config || !runtime_config_version || (runtime_version !== runtime_config_version && runtime_version)) {
			GetRuntimeConfig(res => {
				const { setRuntimeConfig, setRuntimeConfigVersion } = this.props
				setRuntimeConfig(res.data)
				setRuntimeConfigVersion(res.data.version)
				callback()
			}, err => {
				this.setState({ showErorrConnectionModal: true })
			})
		}
		else {
			callback()
		}
	}

	onHelloResponse = (response) => {
		this.setState({
			didFetchData: true,
			showErorrConnectionModal: false
		}, () => {
			const { onFinish } = this.props
			onFinish && onFinish(response)
		})
	}

	requestHello = (initial = true) => {

		if (this.props.is_logged_in || this.props.force_logged_in) {
			GetHello(res => {
				const { tr, lng, cntry, runtime } = res.data.vrsn
				const { Country: { Id: CountryId }, DriverStatus } = res.data.user
				const {
					CurrentCity,
					CurrentCountry,
					CDNBaseUrl
				} = res.data


				const {
					user,
					IsDeveloper,
					pushNsTopics,
					pushNsTopicsUnsubscribe,
					StoreLogo,
					StoreName,
					StoreTypeId,
					SubStoreId,
					UserPermission,
					Currency,
					GoliveScore
				} = res.data

				const hello_data = {
					StoreLogo,
					StoreName,
					StoreTypeId,
					SubStoreId,
					CDNBaseUrl,
					GoliveScore
				}

				const foundLanguage = this.props.languages_data.find(item => item.key === user.Langugae.Id)

				if (foundLanguage) {
					this.props.switchLanguage(foundLanguage.key, foundLanguage.code, false)
				}

				this.props.setUserID(user.Id)
				this.props.setUserData(user)
				this.props.setIsDeveloper(IsDeveloper)
				this.props.setCurrency(Currency)
				this.props.setHelloData(hello_data)
				this.props.setCountryId(CurrentCountry.Id)
				this.props.setCity(CurrentCity)
				this.props.setUserPermissions(UserPermission && UserPermission.length ? UserPermission.split(",").slice(1, -1).map(item => parseInt(item)) : [])
				this.props.setIsDriver(DriverStatus.Id == 1 ? false : true) // DriverStatus.Id != 1 thats Mean It is User Not Driver 
				this.checkCountryVersion(cntry)
				this.fetchDriverStatusList()
				this.handleTopicsSubscription(pushNsTopics, pushNsTopicsUnsubscribe)

				this.setState({
					translation_version: tr,
					language_version: lng,
					showErorrConnectionModal: false
				})

				this.getRuntimeConfig(runtime, () => {
					this.onHelloResponse(true)
				})
			}, err => {
				if (initial) {
					setTimeout(() => {
						this.requestHello(false)
					}, 5000);
				}
				else {
					this.setState({ showErorrConnectionModal: true })
				}
			})
		}
		else {
			this.setState({
				didFetchData: true,
				showErorrConnectionModal: false
			}, () => {
				const { onFinish } = this.props
				onFinish && onFinish(false)
			})
		}
	}

	checkCountryVersion = (version) => {
		const { countries_version } = this.props

		if (version !== countries_version) {
			GetCountries(res => {
				const { setCountries, setCountriesVersion } = this.props

				setCountries(res.data.Data)
				setCountriesVersion(version)
			})
		}
	}

	fetchDriverStatusList = () => {
		const { driver_status_list } = this.props

		if (!driver_status_list || !driver_status_list.length) {
			getFilters({
				drvierStatus: true,
			}, res => {
				const { setDriverStatusList } = this.props
				setDriverStatusList(res.data.driverStatu)
			})
		}
	}

	render() {
		if (this.state.didFetchData) {
			return (
				<LanguageInitializer
					translation_version={this.state.translation_version}
					language_version={this.state.language_version} />
			)
		}
		else if (this.state.showErorrConnectionModal) {
			return (
				<ConnectionErorr
					onPress={() => {
						this.requestHello(false)
					}}
				/>
			)
		} else {
			return null
		}
	}
}

const mapStateToProps = ({
	login: {
		is_logged_in
	},
	places: {
		countries_version,
	},
	server: {
		root_url,
	},
	topics: {
		subscribed_topics,
	},
	misc: {
		driver_status_list,
	},
	runtime_config: {
		runtime_config,
		runtime_config_version,
	},
	language: {
		languages_data,
	},
}) => ({
	languages_data,
	runtime_config,
	runtime_config_version,
	countries_version,
	is_logged_in,
	root_url,
	subscribed_topics,
	driver_status_list,
})

function mergeProps(stateProps, { dispatch }, ownProps) {
	const {
		actions: {
			setCountries,
			setCountriesVersion,
		}
	} = require('./redux/PlacesRedux.js');

	const {
		actions: {
			setUserID,
			setUserData,
			setCountryId,
			setCity,
			setHelloData,
			setCurrency,
			setIsDriver
		}
	} = require('./redux/LoginRedux');

	const {
		actions: {
			setRootURL,
		}
	} = require('./redux/ServerRedux');

	const {
		actions: {
			setIsDeveloper
		}
	} = require('./redux/InspectorRedux');

	const {
		actions: {
			setSubscribedTopics,
		}
	} = require('./redux/TopicsRedux');

	const {
		actions: {
			setDriverStatusList,
		}
	} = require('./redux/MiscRedux');

	const {
		actions: {
			setRuntimeConfig,
			setRuntimeConfigVersion,
		}
	} = require('./redux/RuntimeConfigRedux');

	const {
		actions: {
			setUserPermissions,
		}
	} = require('./redux/UserRedux');

	const {
		actions: {
			switchLanguage,
		}
	} = require('./redux/LangRedux.js');

	return {
		...ownProps,
		...stateProps,
		setCountries: (countries) => setCountries(dispatch, countries),
		setCountriesVersion: (countries_version) => setCountriesVersion(dispatch, countries_version),
		setUserID: (userId) => setUserID(dispatch, userId),
		setUserData: (user_data) => setUserData(dispatch, user_data),
		setIsDeveloper: (is_developer) => setIsDeveloper(dispatch, is_developer),
		setRootURL: (root_url) => setRootURL(dispatch, root_url),
		setSubscribedTopics: (subscribed_topics) => setSubscribedTopics(dispatch, subscribed_topics),
		setHelloData: (hello_data) => setHelloData(dispatch, hello_data),
		setDriverStatusList: (driver_status_list) => setDriverStatusList(dispatch, driver_status_list),
		setCountryId: (country_id) => setCountryId(dispatch, country_id),
		setCity: (city) => setCity(dispatch, city),
		setRuntimeConfig: (runtime_config) => setRuntimeConfig(dispatch, runtime_config),
		setRuntimeConfigVersion: (runtime_config_version) => setRuntimeConfigVersion(dispatch, runtime_config_version),
		setUserPermissions: (permissions) => setUserPermissions(dispatch, permissions),
		setCurrency: (Currency) => setCurrency(dispatch, Currency),
		switchLanguage: (language_id, code, update_translations, callback) => switchLanguage(dispatch, language_id, code, update_translations, callback),
		setIsDriver: (isDriver) => setIsDriver(dispatch, isDriver)
	};
}

export default connect(mapStateToProps, undefined, mergeProps)(Hello)