import { setActiveLanguage, addTranslationForLanguage } from 'react-localize-redux';
import { Languages, en } from '../constants/Languages';
import { GET } from '../utils/Network';

const types = {
	SWITCH_LANGUAGE: 'SWITCH_LANGUAGE',
	STORE_LANGUAGES_DATA: 'STORE_LANGUAGES_DATA',
	STORE_CURRENT_LANGUAGE_TRANSLATION: 'STORE_CURRENT_LANGUAGE_TRANSLATION',
	STORE_TRANSLATIONS_VERSION: 'STORE_TRANSLATIONS_VERSION',
	STORE_LANGUAGES_VERSION: 'STORE_LANGUAGES_VERSION',
	RESET_LANGUAGES_TRANSLATIONS: 'RESET_LANGUAGES_TRANSLATIONS',
};

export const actions = {
	switchLanguage: (dispatch, language_id, code, update_translations = true, callback) => {
		const changeActiveLanguage = () => {
			dispatch(setActiveLanguage(code));
			dispatch({ type: types.SWITCH_LANGUAGE, currLang: code, })
		}

		if (update_translations) {
			GET(`Translations?languageId=${language_id}`, res => {
				const translations_data = res.data

				dispatch({ type: types.STORE_CURRENT_LANGUAGE_TRANSLATION, translation_data: translations_data })
				dispatch(addTranslationForLanguage(translations_data, code));
				changeActiveLanguage()
				callback && callback()
			}, () => {
				changeActiveLanguage()
				callback && callback()
			})
		}
		else {
			changeActiveLanguage()
			callback && callback()
		}
	},
	storeCurrLangTranslation: (dispatch, translation_data) => {
		dispatch({ type: types.STORE_CURRENT_LANGUAGE_TRANSLATION, translation_data })
	},
	storeLanguagesData: (dispatch, languages_data) => {
		dispatch({ type: types.STORE_LANGUAGES_DATA, languages_data })
	},
	storeTranslationsVersion: (dispatch, translations_version) => {
		dispatch({ type: types.STORE_TRANSLATIONS_VERSION, translations_version })
	},
	storeLanguagesVersion: (dispatch, languages_version) => {
		dispatch({ type: types.STORE_LANGUAGES_VERSION, languages_version })
	},
	resetLanguagesTranslations: (dispatch) => {
		dispatch({ type: types.RESET_LANGUAGES_TRANSLATIONS })
	},
};

const initialState = {
	currLang: 'en',
	languages_data: Languages,
	translations_version: null,
	languages_version: null,
	translation_data: en
}

export const reducer = (state = initialState, action) => {
	const { currLang, translation_data, languages_data, translations_version, languages_version } = action;

	switch (action.type) {
		case types.SWITCH_LANGUAGE:
			return { ...state, currLang };
		case types.STORE_CURRENT_LANGUAGE_TRANSLATION:
			return { ...state, translation_data };
		case types.STORE_LANGUAGES_DATA:
			return { ...state, languages_data };
		case types.STORE_TRANSLATIONS_VERSION:
			return { ...state, translations_version };
		case types.STORE_LANGUAGES_VERSION:
			return { ...state, languages_version };
		case types.RESET_LANGUAGES_TRANSLATIONS:
			return { 
				...state, 
				languages_data: Languages,
				translations_version: null,
				languages_version: null,
				translation_data: en
			};
		default:
			return state
	}
}