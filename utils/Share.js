import { Share } from 'react-native'

export const ShareSomeThing = (message, title, url, onShare, onErorr) => {
    Share.share({
        message,
        title,
        url
    }).then((result) => {
        if (result.action === Share.sharedAction) {
            if (result.activityType) {
                // shared with activity type of result.activityType
            } else {
                onShare && onShare()
                // shared
            }
        } else if (result.action === Share.dismissedAction) {
            // dismissed
        }
    }).catch((erorr) => {
        onErorr && onErorr(erorr.message)
    })
}
