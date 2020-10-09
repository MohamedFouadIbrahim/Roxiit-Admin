import { DELETE, GET, POST } from '../utils/Network';

export const DeleteCustomTranslation = (id, language_id, type, onSuccess, onFailure) => {
	DELETE(`Translations/Custom/${type}?Id=${id}&languageId=${language_id}`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const DeleteAllCustomTranslation = (language_id, type, onSuccess, onFailure) => {
	DELETE(`Translations/Custom/${type}/All?${language_id ? `languageId=${language_id}` : 'languageId=null'}`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const GetCustomTranslation = (id, source_language_id, target_language_id, type, onSuccess, onFailure) => {
 return	GET(`Translation/Custom/${type}?translationId=${id}&sourceLanguageId=${source_language_id}&targetLanguageId=${target_language_id}`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const EditCustomTranslation = (translation_id, translation_value, language_id, type, onSuccess, onFailure) => {
 return	POST(`Translations/Custom/${type}`, {
		Id: translation_id,
		Text: translation_value,
		LanguageId: language_id
	}, res => {
		onSuccess && onSuccess(res)
	}, err => {
		onFailure && onFailure(err)
	})
}