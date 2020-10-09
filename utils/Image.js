import ImagePicker from 'react-native-image-picker';
import ImagePickerCrop from 'react-native-image-crop-picker';
import { Platform, Image } from 'react-native'
import { LongToast } from './Toast';
import RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';
import { PermissionEnhance } from './File';
import CameraRoll from '@react-native-community/cameraroll';
import { secondColor } from '../constants/Colors';

const options = {
	title: 'Select',
	cancelButtonTitle: 'Cancel',
	takePhotoButtonTitle: 'Camera',
	chooseFromLibraryButtonTitle: 'Library',
	storageOptions: {
		skipBackup: true,
		path: 'RoxiitAdmin',
	},
	noData: true,
	mediaType: 'photo',
	allowsEditing: true
};

export const openOnlyPicker = (callback) => {

	ImagePickerCrop.openPicker({
		mediaType: 'photo',
		multiple: false,
		includeBase64: true

	}).then((o) => {
		const Data = {
			uri: o.data,
			path: o.path,
			width: o.width,
			height: o.height,

		}
		callback(Data)
	}).catch((d) => {
	})
}

export const showImagePicker = (callback, ImageSizeInPixel = null, wholeObject = false) => {
	ImagePicker.showImagePicker(options, (response) => {
		if (response.didCancel) {
			callback(null)
		} else if (response.error) {
			callback(null)
		} else if (response.customButton) {
			callback(null)
		} else {
			if ((response.fileSize / 1048576).toFixed(2) < 10) {
				let imageUri = response.uri

				Image.getSize(imageUri, async (width, height) => {
					if (ImageSizeInPixel) {
						// size is less than 10 MB

						ImagePickerCrop.openCropper({
							cropping: true,
							path: response.uri,
							width,
							height,
						}).then((o) => {
							const Data = {
								uri: Platform.OS == 'ios' ? response.uri : o.path,
								path: o.path,
								width: o.width,
								height: o.height
							}

							callback(Data)
						}).catch(e => {
							callback(null)
						})
					}
					else {
						ImagePickerCrop.openCropper({
							cropping: true,
							path: response.uri,
							width,
							height,
						}).then((o) => {
							const Data = {
								...o,
								uri: Platform.OS == 'ios' ? response.uri : o.path,
								path: o.path
							}
							if (wholeObject) {
								const { type, fileName } = response
								const finalObject = {
									type,
									fileName,
									uri: Platform.OS == 'ios' ? response.uri : o.path,
								}

								callback(finalObject)
							}
							else {
								callback(Data)
							}
						}).catch(e => {
							callback(null)
						})
					}
				})
			}
			else {
				// size is more than 10 MB

				callback(null)
				LongToast("image size should be less than 10 MB")
			}
		}
	});
}

export const SaveImge = (imageInBase64Formate, imageName = 'Image', onSave, onNotSave) => {

	const saveImageFile = () => {

		const dirs = RNFetchBlob.fs.dirs
		const pathToSave = Platform.OS == 'android' ? RNFS.CachesDirectoryPath + `/${imageName}.png` : dirs.DocumentDir + `/${imageName}.png`

		RNFS.writeFile(pathToSave, imageInBase64Formate, 'base64')
			.then(() => {
				if (Platform.OS == 'android') {
					CameraRoll.saveToCameraRoll(pathToSave, 'photo')
				}
			})
			.then(() => {
				LongToast(`${imageName ? `${imageName} Saved to` : 'File Saved TO'} : ${pathToSave}`, false)
				onSave && onSave()
			})
			.catch((err) => {
				onNotSave && onNotSave(err)
			})

	}

	PermissionEnhance(() => { saveImageFile() })
}




const getBase64FormattedUri = (response) => {
	return `data:${response.mime};base64,${response.data}`
}

export const OpenSingleSelectImagePicker = (onSuccess, onFailure) => {
	ImagePickerCrop.openPicker({ mediaType: 'photo', multiple: false, cropping: false }).then(image => {
		openImageInCropper(image, onSuccess)
	}).catch((e) => {
		onFailure && onFailure(e)
	})
}

const openImageInCropper = (image, callback) => {
	const {
		path,
		width: imageWidth,
		height: imageHeight,
	} = image

	let width, height

	if (Platform.OS === 'ios') {
		width = imageWidth
		height = imageHeight
	}

	ImagePickerCrop.openCropper({
		path,
		includeBase64: true,
		width,
		height,
		cropperToolbarWidgetColor: secondColor ,
		cropperActiveWidgetColor: secondColor
	}).then(res => {
		callback && callback({
			...res,
			uri: getBase64FormattedUri(res),
			width: imageWidth,
			height: imageHeight
		})
	}).catch(() => {
		callback && callback(undefined)
	})
}

const openImagesInCropper = (images, callback, current = 0, res = []) => {
	if (current === images.length) {
		callback && callback(res)
	}
	else {
		openImageInCropper(images[current], cropped_image_res => {
			openImagesInCropper(images, callback, current + 1, [...res, cropped_image_res])
		})
	}
}

export const OpenMultiSelectImagePicker = (onSuccess, onFailure) => {
	ImagePickerCrop.openPicker({ mediaType: 'photo', multiple: true }).then(images => {
		openImagesInCropper(images, cropped_images => {
			onSuccess && onSuccess(cropped_images)
		})
	})
}

export const OpenCamera = (onSuccess, onFailure) => {
	ImagePickerCrop.openCamera({ cropping: false, includeBase64: true })
		.then(image => {
			openImageInCropper(image, onSuccess)
			// onSuccess && onSuccess({ ...images, uri: getBase64FormattedUri(images) })
		}).catch(() => {
			onFailure && onFailure()
		})
}


export const ClearTempImage = () => {
	ImagePickerCrop.clean()
}