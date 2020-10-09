import DocumentPicker from 'react-native-document-picker';
import { Platform } from 'react-native';
import RNFetchBlobs from 'rn-fetch-blob';
import { LongToast } from './Toast';
import { check, request, RESULTS, PERMISSIONS } from 'react-native-permissions';

export const pickFile = async (onPickFIle) => {
    const filetype = Platform.OS === "ios" ? [
        ...DocumentPicker.types.allFiles,
        'public.zip-archive'
    ] : [DocumentPicker.types.allFiles]


    try {
        const res = await DocumentPicker.pick({
            type: filetype,
        });

        if (res) {
            onPickFIle && onPickFIle(res)
        }
    } catch (err) {
        console.log('error', err)
        if (DocumentPicker.isCancel(err)) {
            // User cancelled the picker, exit any dialogs or menus and move on
        } else {
            throw err;
        }
    }
}

export const pickZipFile = (onSuccess, onFailure) => {
    pickFile(file => {
        if (file.fileName.endsWith('.zip')) {
            const FILE = {
                ...file,
                type: 'application/zip'
            }
            onSuccess && onSuccess(FILE)
        } else {
            onSuccess && onSuccess(file)
        }
    })
}

export const pickXlsxFile = (onSuccess, onFailure) => {
    pickFile(file => {
        if (file.fileName.endsWith('.xlsx')) {
            const FILE = {
                ...file,
                type: 'application/xlsx'
            }
            onSuccess && onSuccess(FILE)
        } else {
            onSuccess && onSuccess(file)
        }
    })
}

export const writeStoragePermission = (onSuccess) => {

    check(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE).then(res => {

        if (res != RESULTS.GRANTED) {

            request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE).then(value => {

                if (value == RESULTS.GRANTED) {
                    onSuccess && onSuccess()
                }

            })

        } else { onSuccess && onSuccess() }

    })
}

export const PermissionEnhance = (onSuccess) => {
    if (Platform.OS == 'android') {
        writeStoragePermission(onSuccess)
    } else {
        onSuccess && onSuccess()
    }

}

export const readStoragePermission = (onSuccess) => {

    check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE).then(res => {

        if (res != RESULTS.GRANTED) {

            request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE).then(value => {

                if (value == RESULTS.GRANTED) {
                    onSuccess && onSuccess()
                }

            })

        } else { onSuccess && onSuccess() }

    })

}

export const DownLoadFileFromUrl = (fileUrl, onSuccess, onFailure, onDownLoadProgress) => {
    RNFetchBlobs.fetch('GET', fileUrl).progress((resecied, total) => {
        onDownLoadProgress && onDownLoadProgress(resecied / total)
    }).then((res) => {
        let status = res.info().status;
        if (status == 200) {
            onSuccess && onSuccess(res)
        }
    }).catch((err) => { onFailure && onFailure(err) })
}

export const SaveFile = (fileUrl, onSuccess, onFailure, onDownLoadProgress, fileName) => {
    const SlashIndex = fileUrl.lastIndexOf('/')
    const fileNameWithExetention = fileUrl.substring(SlashIndex + 1, fileUrl.length)
    const dirs = RNFetchBlobs.fs.dirs

    PermissionEnhance(() => {
        DownLoadFileFromUrl(fileUrl, (res) => {
            RNFetchBlobs.fs.writeFile((Platform.OS == 'ios' ? `${dirs.DocumentDir}/` : `${dirs.DownloadDir}/`) + fileNameWithExetention, res.base64(), 'base64')
                .then((value) => {
                    LongToast(`${fileName ? `${fileName} Saved to` : 'File Saved TO'} : ${Platform.OS == 'ios' ? `${dirs.DocumentDir}/` + fileNameWithExetention : `${dirs.DownloadDir}/` + fileNameWithExetention}`, false)
                    onSuccess && onSuccess(value)
                }).catch((e) => {
                    onFailure && onFailure(e)
                })
        }, err => {
            onFailure && onFailure(err)
        }, progress => {
            onDownLoadProgress && onDownLoadProgress(progress)
        })
    })

}