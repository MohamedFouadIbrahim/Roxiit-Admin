import { GET, POST, DELETE,IMG } from '../utils/Network';

export const GetNotificationTemplate = (Id, onSucces, onFaluer) => {
    GET(`NsMng/Template/FD?id=${Id}`,
        res => {
            onSucces && onSucces(res)
        }, err => {
            onFaluer && onFaluer(err)
        })
}

export const DeleteNotificationTemplate = (Id, onSucces, onFaluer) => {
    DELETE(`NsMng/Template?id=${Id}`,
        res => {
            onSucces && onSucces(res)
        }, err => {
            onFaluer && onFaluer(err)
        })
}
export const AddEditNotificationTemplate = (data, onSucces, onFaluer, onUpoadImag) => {

    const {
        Image,
        ...otherData
    } = data

    POST('NsMng/Template', data, res => {

        if (Image) {
            let formData = new FormData();

            formData.append('sc', {
                uri: Image,
                name: `Noification_img_${+ new Date()}.jpg`,
                type: 'image/jpg'
            });

            const {
                Id,
            } = otherData

            IMG(`NsMng/Image?tempalteId=${Id === 0 ? res.data : Id}`,
                formData,
                () => {
                    onSucces && onSucces(res)
                },
                err => {
                    onFaluer && onFaluer(err)
                }, (pro) => {
                    onUpoadImag && onUpoadImag(pro)
                })
        } else {
            onSucces && onSucces(res)
        }
    }, err => {
        onFaluer && onFaluer(err)
    })
}

export const SendNotificationTemplate = (Id, onSucces, onFaluer) => {
    POST(`NsMng/Send?templateId=${Id}`, {}, res => {
        onSucces && onSucces(res)
    }, err => {
        onFaluer && onFaluer(err)
    })
}