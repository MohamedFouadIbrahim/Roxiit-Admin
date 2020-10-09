import { DELETE, POST, GET } from '../utils/Network';
export const DeleteReview = (id, onSuccess, onFailure) => {
    DELETE(`Review?reviewId=${id}`, res => {
        onSuccess && onSuccess(res)
    }, err => {
        // Do something special if this request fails or ignore
        onFailure && onFailure(err)
    })
}
export const ApproveOrDisApprove = (data, onSuccess, onFailure) => {
    POST(`Review`, {
        Id: data.Id,
        Review: data.Review,
        ReplyReview: data.ReplyReview,
        IsReviewApproved: data.IsReviewApproved
    }, res => {
        onSuccess && onSuccess(res)
    }, err => {
        // Do something special if this request fails or ignore
        onFailure && onFailure(err)
    })
}
export const GetReview = (id, onSuccess, onFailure) => {
    GET(`Review?reviewId=${id}`, res => {
        onSuccess && onSuccess(res)
    }, err => {
        // Do something special if this request fails or ignore
        onFailure && onFailure(err)
    })
}