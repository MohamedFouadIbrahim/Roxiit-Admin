import { DELETE, GET, POST, IMG } from '../utils/Network';

export const DeleteETag = (Id, onSuccess, onFailure) => {
	DELETE(`Etag?tagId=${Id}`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const GeteTag = (id, language_id, onSuccess, onFailure) => {
	// ${language_id ? `&languageId=${language_id}` : ''}
	GET(`Etag?tagId=${id}${language_id ? `&languageId=${language_id}` : ''} `, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const editETag = ({ Image, Id, LanguageId, Name, Description }, onSuccess, onFailure, onUploadImag) => {
	POST('Etag', {
		"Id": Id,
		"LanguageId": LanguageId,
		"Name": Name,
		"Description": Description,
	}, res => {
		// img upload
		if (Image) {
			let formData = new FormData();
			formData.append('sc', {
				uri: Image,
				name: `eTag_img_${+ new Date()}.jpg`,
				type: 'image/jpg'
			});

			IMG(`Etag/Image?tagId=${res.data}`,
				formData,
				() => {
					onSuccess && onSuccess(res)
				},
				err => {
					onFailure && onFailure(err)
				}, (pro) => {
					onUploadImag && onUploadImag(pro)
				})
		} else {
			onSuccess && onSuccess(res)
		}
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}