import { Component } from 'react'
import SplashScreen from 'react-native-bootsplash';
import { connect } from 'react-redux'
import { withLocalize } from "react-localize-redux";
import { getLocales } from 'react-native-localize';
import { ar, Languages, DEFAULT_LANGUAGE_CODE, DEFAULT_LANGUAGE_TRANSLATION, DEFAULT_LANGUAGE_ID, en } from './constants/Languages';
import { GET } from './utils/Network';
import { GetHello } from './services/HelloService';

const onMissingTranslation = ({ translationId, languageCode }) => {
	if (languageCode === "ar") {
		if (ar[translationId]) {
			return ar[translationId]
		}
		else {
			return `${translationId},,`
		}
	}
	else {
		if (en[translationId]) {
			return en[translationId]
		}
		else {
			return `${translationId},,`
		}
	}
}

class LanguageInitializer extends Component {
	componentDidMount() {
		this.initTranslation()
	}

	hideSplash = () => {
		SplashScreen.hide()
	}

	loadDefaultLanguage = () => {
		const code = getLocales()[0].languageTag.slice(0, 2).toLowerCase()

		if (code === 'ar') {
			this.initLanguage('ar', Languages, ar)
		}
		else {
			this.initLanguage(DEFAULT_LANGUAGE_CODE, Languages, DEFAULT_LANGUAGE_TRANSLATION)
		}
	}

	loadLocallyStoredLanguage = () => {
		const {
			currLang,
			languages_data,
			translation_data,
		} = this.props;

		this.initLanguage(currLang, languages_data, translation_data)
	}

	checkLanguageVersion = (tr_version, lng_version) => {
		const {
			translations_version,
			languages_version,
		} = this.props;

		if (tr_version === translations_version && lng_version === languages_version) {
			this.checkLastStoredLanguage()
			this.hideSplash()
		}
		else {
			this.updateLanguages(tr_version, lng_version, tr_version !== translations_version)
		}
	}

	updateLanguages = (tr_version, lng_version, did_translations_change) => {
		GET(`Languages`, res => {
			const { storeLanguagesData, storeTranslationsVersion, storeLanguagesVersion, currLang } = this.props

			const mapped_languages_data = res.data.Data.map(item => {
				const { Id, Flag, IsDefault, IsRTL, ISO_Code, Name } = item

				return {
					key: Id,
					flag: Flag,
					label: Name,
					code: ISO_Code,
					isRTL: IsRTL,
					isDefault: IsDefault,
				}
			})

			storeLanguagesData(mapped_languages_data)
			storeLanguagesVersion(lng_version)

			const foundCurrentLanguage = mapped_languages_data.find(item => item.code === currLang)
			const foundLanguageId = foundCurrentLanguage ? foundCurrentLanguage.key : DEFAULT_LANGUAGE_ID

			if (did_translations_change || !foundCurrentLanguage) {
				GET(`Translations?languageId=${foundLanguageId}`, res => {
					storeTranslationsVersion(tr_version)

					const foundLanguageCode = foundCurrentLanguage ? foundCurrentLanguage.code : DEFAULT_LANGUAGE_CODE

					this.initLanguage(foundLanguageCode, mapped_languages_data, res.data)
				}, err => {
					this.checkLastStoredLanguage()
					this.hideSplash()
				})
			}
		}, err => {
			this.checkLastStoredLanguage()
			this.hideSplash()
		})
	}

	checkLastStoredLanguage = () => {
		const { did_never_log_in } = this.props
		did_never_log_in ? this.loadDefaultLanguage() : this.loadLocallyStoredLanguage()
	}

	initTranslation = () => {
		const { is_logged_in, force_logged_in, translation_version, language_version } = this.props

		if (is_logged_in || force_logged_in) {
			if (translation_version && language_version) {
				this.checkLanguageVersion(translation_version, language_version)
			}
			else {
				GetHello(res => {
					const { tr, lng } = res.data.vrsn
					this.checkLanguageVersion(tr, lng)
				}, err => {
					this.checkLastStoredLanguage()
					this.hideSplash()
				})
			}
		}
		else {
			this.checkLastStoredLanguage()
			this.hideSplash()
		}
	}

	getLanguageRTLFromCode = (code) => {
		const { languages_data } = this.props
		const foundLanguage = languages_data.find(item => item.code === code)
		return foundLanguage ? foundLanguage.isRTL : false
	}

	getLanguageIdFromCode = (code) => {
		const { languages_data } = this.props
		const foundLanguage = languages_data.find(item => item.code === code)
		return foundLanguage ? foundLanguage.key : 0
	}

	initLanguage = (code, languages, translation) => {
		const {
			initialize,
			addTranslationForLanguage,
			storeCurrLangTranslation,
			switchLanguage,
			onLanguageInit,
		} = this.props;

		initialize({
			languages: languages,
			options: {
				renderToStaticMarkup: false,
				defaultLanguage: code,
				onMissingTranslation: onMissingTranslation,
			}
		});

		addTranslationForLanguage(translation, code)
		storeCurrLangTranslation(translation)
		switchLanguage(this.getLanguageIdFromCode(code), code, false)
		onLanguageInit && onLanguageInit()
		this.hideSplash()
	}

	render() {
		return null
	}
}

const mapStateToProps = ({
	login: {
		did_never_log_in,
		is_logged_in,
	},
	language: {
		currLang,
		languages_data,
		translation_data,
		translations_version,
		languages_version,
	},
}) => ({
	currLang,
	languages_data,
	translation_data,
	translations_version,
	languages_version,
	did_never_log_in,
	is_logged_in,
})

function mergeProps(stateProps, { dispatch }, ownProps) {
	const {
		actions: {
			storeLanguagesData,
			switchLanguage,
			storeCurrLangTranslation,
			storeTranslationsVersion,
			storeLanguagesVersion,
		}
	} = require('./redux/LangRedux.js');

	return {
		...ownProps,
		...stateProps,
		storeLanguagesData: (languages_data) => storeLanguagesData(dispatch, languages_data),
		storeCurrLangTranslation: (translation_data) => storeCurrLangTranslation(dispatch, translation_data),
		storeTranslationsVersion: (translations_version) => storeTranslationsVersion(dispatch, translations_version),
		storeLanguagesVersion: (languages_version) => storeLanguagesVersion(dispatch, languages_version),
		switchLanguage: (language_id, code, update_translations, callback) => switchLanguage(dispatch, language_id, code, update_translations, callback),
	};
}

export default connect(mapStateToProps, undefined, mergeProps)(withLocalize(LanguageInitializer))