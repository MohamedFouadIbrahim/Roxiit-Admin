import { DELETE, GET, POST, IMG } from '../utils/Network';

export const DeleteCategory = (id, onSuccess, onFailure) => {
	DELETE(`Category?categoryId=${id}`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const GetCategory = (id, LanguageId, onSuccess, onFailure) => {
	return GET(`Category?categoryId=${id}${LanguageId ? `&languageId=${LanguageId}` : ''}`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const editCategory = (data, onSuccess, onFailure, onUploadImag) => {
	return POST('Category', data, res => {
		const Image = data.Image
		// img upload
		if (Image) {
			let formData = new FormData();
			formData.append('sc', {
				uri: Image,
				name: `category_img_${+ new Date()}.jpg`,
				type: 'image/jpg'
			});

			IMG(`Category/Image?categoryId=${res.data}`,
				formData,
				() => {
					onSuccess && onSuccess(res)
				},
				err => {
					onFailure(err)
					return true
				}, (rr) => {
					onUploadImag && onUploadImag(rr)
				})
		} else {
			onSuccess && onSuccess(res)
		}
	}, err => {
		// Do something special if this request fails or ignore
		onFailure(err)
		return true
	})
}

export const ReOrderCategory = (ids, onSuccess, onFailure) => {
	POST(`Category/Order`, ids, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const ReOrderCategoryInHomePage = (ids, onSuccess, onFailure) => {
	POST(`Category/ShowInHomePage/Order`, ids, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}