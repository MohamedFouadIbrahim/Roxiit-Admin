import { GET, DELETE, POST, IMG } from '../utils/Network'


export const DeletePopup = (id, onSuccess, onFailure) => {
    DELETE(`Popup?id=${id}`, res => {
        onSuccess && onSuccess(res)
    }, err => {
        // Do something special if this request fails or ignore
        onFailure && onFailure(err)
    })
}

export const GetPopup = (id, language_id, onSuccess, onFailure) => {
    return GET(`Popup?PopupId=${id}${language_id ? `&languageId=${language_id}` : ''}`, res => {
        onSuccess && onSuccess(res)
    }, err => {
        // Do something special if this request fails or ignore
        onFailure && onFailure(err)
    })
}

export const AddEditPopup = (data, onSuccess, onFailure, onUploadImag) => {
    return POST('Popup', data, res => {
        const Image = data.ImageData

        // img upload
        if (Image) {
            let formData = new FormData();
            formData.append('sc', {
                uri: Image,
                name: `popup_img_${+ new Date()}.jpg`,
                type: 'image/jpg'
            });

            IMG(`Popup/Image?popupId=${res.data}${data.LanguageId ? `&langaugeId=${data.LanguageId}` : ''}`,
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
        if (onFailure) {
            return onFailure(err)
        }
    })
}