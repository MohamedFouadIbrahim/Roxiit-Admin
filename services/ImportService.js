import { GETHEADERFILE, IMG, GET } from '../utils/Network';

export const DownloadFile = (onSuccess, onFailure,) => {
    GET(`Product/Import/Sample`, res => {
        onSuccess && onSuccess(res)
    }, err => {
        onFailure && onFailure(err)
    })
}

export const AddConfig = (data, onSuccess, onFailure, onUpLoadProgress) => {

    const {
        mainLanguage,
        secondLanguage,
        updateProduct,
        createCategory,
        visibility,
        status,
        type,
        file
    } = data

    const { uri, fileName } = file

    const form = new FormData()

    form.append('sc', {
        uri,
        name: `${fileName}`,
        type: 'application/zip'
    });

    IMG(`Product/Import?mainLanguage=${mainLanguage}&secondLanguage=${secondLanguage}&updateProduct=${updateProduct}&createCategory=${createCategory}&visibility=${visibility}&status=${status}&type=${type}`,
        form
        , res => {
            onSuccess && onSuccess(res)
        }, err => {
            onFailure && onFailure(err)
        }, porsessNumber => {
            onUpLoadProgress && onUpLoadProgress(porsessNumber)
        })

}

export const ConfirmConfig = (data, onSuccess, onFailure, onUpLoadProgress) => {

    const {
        mainLanguage,
        secondLanguage,
        updateProduct,
        createCategory,
        visibility,
        status,
        type,
        file
    } = data

    const { uri, fileName } = file

    const form = new FormData()

    form.append('sc', {
        uri,
        name: `${fileName}`,
        type: 'application/zip'
    });

    IMG(`Product/Import/Confirm?mainLanguage=${mainLanguage}&secondLanguage=${secondLanguage}&updateProduct=${updateProduct}&createCategory=${createCategory}&visibility=${visibility}&status=${status}&type=${type}`,
        form
        , res => {
            onSuccess && onSuccess(res)
        }, err => {
            onFailure && onFailure(err)
        }, porsessNumber => {
            onUpLoadProgress && onUpLoadProgress(porsessNumber)
        })
}

export const DownloadStockFile = (onSuccess, onFailure) => {
    GET(`Product/StockUpdate`, res => {
        onSuccess && onSuccess(res)
    }, err => {
        onFailure && onFailure(err)
    })
}

export const AddStockConfig = (data, onSuccess, onFailure, onUpLoadProgress) => {

    const {
        file
    } = data
    const { uri, fileName } = file
    const form = new FormData()

    form.append('sc', {
        uri,
        name: `${fileName}`,
        type: 'application/xlsx'
    });

    IMG('Product/StockUpdate',
        form
        , res => {
            onSuccess && onSuccess(res)
        }, err => {
            onFailure && onFailure(err)
        }, porsessNumber => {
            onUpLoadProgress && onUpLoadProgress(porsessNumber)
        })

}