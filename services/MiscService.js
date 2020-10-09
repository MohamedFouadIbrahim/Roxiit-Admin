import { IMG } from '../utils/Network';

export const GetImageUrl = (image, onSuccess, onFailure) => {
    let formData = new FormData();

    formData.append('sc', {
        uri: image,
        name: `img_${+ new Date()}.jpg`,
        type: 'image/jpg'
    });

    return IMG(`Media/Add/FullResponse`,
        formData,
        res => {            
            onSuccess && onSuccess(res)
        }, err => {
            onFailure && onFailure(err)
        })

}