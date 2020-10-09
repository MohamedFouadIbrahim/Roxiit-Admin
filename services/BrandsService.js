import { DELETE, IMG, POST, GET } from '../utils/Network';

export const DeleteBrand = (id, onSuccess, onFailure) => {
	DELETE(`Brand/Delete?brandId=${id}`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const GetBrand = (id, onSuccess, onFailure) => {
 return	GET(`Brand?brandId=${id}`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const EditBrand = (data, onSuccess, onFailure,onUpoadImag) => {
	const {
		Image,
		...otherData
	} = data

	return	POST(`Brand`, otherData, res => {
		if (Image) {
			let formData = new FormData();

			formData.append('sc', {
				uri: Image,
				name: `brand_img_${+ new Date()}.jpg`,
				type: 'image/jpg'
			});

			const {
				Id,
			} = otherData

			IMG(`Brand/Image?brandId=${Id === 0 ? res.data : Id}`,
				formData,
				() => {
					onSuccess && onSuccess(res)
				},
				err => {
					onFailure && onFailure(err)
				},(pro)=>{
					onUpoadImag && onUpoadImag(pro)
				})
		}
		else {
			onSuccess && onSuccess(res)
		}
	}, err => {
		onFailure && onFailure(err)
	})
}