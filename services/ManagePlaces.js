import { GET, POST, DELETE } from '../utils/Network';

export const GetSelectedCountries = (onSuccess, onFailure) => {
    GET(`Country/Manage`, res => {
        onSuccess && onSuccess(res)
    }, err => {
        // Do something special if this request fails or ignore
        onFailure && onFailure(err)
    })
}

export const GetSelectedCities = (countryId, onSuccess, onFailure) => {
    GET(`City/Manage?countryId=${countryId}`, res => {
        onSuccess && onSuccess(res)
    }, err => {
        // Do something special if this request fails or ignore
        onFailure && onFailure(err)
    })
}

export const AddSelectedCities = (data, onSuccess, onFailure) => {
    POST(`City/Manage`, data, res => {
        onSuccess && onSuccess(res)
    }, err => {
        // Do something special if this request fails or ignore
        onFailure && onFailure(err)
    })
}

export const AddSelectedCountries = (selectedCountriesIds, onSuccess, onFailure) => {
    POST(`Country/Manage`, selectedCountriesIds, res => {
        onSuccess && onSuccess(res)
    }, err => {
        // Do something special if this request fails or ignore
        onFailure && onFailure(err)
    })
}

export const GEtAddEditCity = (cityId, onSuccess, onFailure) => {
    GET(`City/Manage/FD?Id=${cityId}`, res => {
        onSuccess && onSuccess(res)
    }, err => {
        // Do something special if this request fails or ignore
        onFailure && onFailure(err)
    })
}

export const AddEditCity = (data, onSuccess, onFailure) => {
    POST(`City/Manage/FD`, data, res => {
        onSuccess && onSuccess(res)
    }, err => {
        // Do something special if this request fails or ignore
        onFailure && onFailure(err)
    })
}

export const DeleteCity = (cityId, onSuccess, onFailure) => {
    DELETE(`City/Manage?Id=${cityId}`, res => {
        onSuccess && onSuccess(res)
    }, err => {
        // Do something special if this request fails or ignore
        onFailure && onFailure(err)
    })
}

export const DeleteArea = (areaId, onSuccess, onFailure) => {
    DELETE(`Area/Manage?Id=${areaId}`, res => {
        onSuccess && onSuccess(res)
    }, err => {
        // Do something special if this request fails or ignore
        onFailure && onFailure(err)
    })
}

export const GetSelectedAreas = (cityId, onSuccess, onFailure) => {
    GET(`Area/Manage?cityId=${cityId}`, res => {
        onSuccess && onSuccess(res)
    }, err => {
        // Do something special if this request fails or ignore
        onFailure && onFailure(err)
    })
}

export const GetAllCities = (countryId, onSuccess, onFailure) => {
    GET(`Cities?id=${countryId}`, res => {
        onSuccess && onSuccess(res)
    }, err => {
        // Do something special if this request fails or ignore
        onFailure && onFailure(err)
    })
}

export const AddEditSelectedArea = (data, onSuccess, onFailure) => {
    POST(`Area/Manage`, data, res => {
        onSuccess && onSuccess(res)
    }, err => {
        // Do something special if this request fails or ignore
        onFailure && onFailure(err)
    })
}

export const GEtAddEditArea = (areaId, onSuccess, onFailure) => {
    GET(`Area/Manage/FD?Id=${areaId}`, res => {
        onSuccess && onSuccess(res)
    }, err => {
        // Do something special if this request fails or ignore
        onFailure && onFailure(err)
    })
}

export const AddEditArea = (data, onSuccess, onFailure) => {
    POST(`Area/Manage/FD`, data, res => {
        onSuccess && onSuccess(res)
    }, err => {
        // Do something special if this request fails or ignore
        onFailure && onFailure(err)
    })
}
