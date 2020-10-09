import { DELETE, GET, IMG, POST } from '../utils/Network';

export const DeleteStory = (id, onSuccess, onFailure) => {
	DELETE(`Story?Id=${id}`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const GetStory = (id, onSuccess, onFailure) => {
 return	GET(`Story?Id=${id}`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const AddEditStory = (data, onSuccess, onFailure, onUploadImage) => {
	const {
		Image,
		...otherData
	} = data

 return	POST(`Story/Data`, otherData, res => {
		if (Image) {
			let formData = new FormData();

			formData.append('sc', {
				uri: Image,
				name: `story_img_${+ new Date()}.jpg`,
				type: 'image/jpg'
			});

			const {
				Id,
			} = otherData

			IMG(`Story/Media?storyId=${Id === 0 ? res.data : Id}`,
				formData,
				() => {
					onSuccess && onSuccess(res)
				},
				err => {
					onFailure && onFailure(err)
				},(pro)=>{
					onUploadImage && onUploadImage(pro)
				})
		}
		else {
			onSuccess && onSuccess(res)
		}
	}, err => {
		onFailure && onFailure(err)
	})
}