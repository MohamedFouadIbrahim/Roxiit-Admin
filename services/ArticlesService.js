import { DELETE, POST, IMG, GET } from '../utils/Network';

export const DeleteArticle = (id, onSuccess, onFailure) => {
	DELETE(`Article?Id=${id}`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const ReorderArticles = (Ids, onSuccess, onFailure) => {
	return POST('Article/Reorder', Ids, res => {
		onSuccess && onSuccess(res)
	}, err => {
		onFailure && onFailure(res)
	})
}

export const GetArticle = (id, language_id, onSuccess, onFailure) => {
	return GET(`Article?Id=${id}${language_id ? `&languageId=${language_id}` : ''}`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const AddEditArticle = (data, onSuccess, onFailure, OnUploadImage) => {
	const {
		Image,
		...otherData
	} = data

	return POST(`Article`, otherData, res => {
		if (Image) {
			let formData = new FormData();

			formData.append('sc', {
				uri: Image,
				name: `article_img_${+ new Date()}.jpg`,
				type: 'image/jpg'
			});

			const {
				Id,
			} = otherData

			IMG(`Article/Image?articleId=${Id === 0 ? res.data : Id}`,
				formData,
				() => {
					onSuccess && onSuccess(res)
				},
				err => {
					onFailure && onFailure(err)
				}, (pro) => {
					OnUploadImage && OnUploadImage(pro)
				})
		}
		else {
			onSuccess && onSuccess(res)
		}
	}, err => {
		onFailure && onFailure(err)
	})
}