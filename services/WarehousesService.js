import { DELETE, GET, POST } from "../utils/Network";

export const GetWarehouse = (id, onSuccess, onFailure) => {
	return GET(
		`Warehouse/Home?Id=${id}`,
		res => {
			onSuccess && onSuccess(res);
		},
		err => {
			// Do something special if this request fails or ignore
			onFailure && onFailure(err);
		}
	);
};

export const GetWarehouseBasicInfo = (id, onSuccess, onFailure) => {
	return GET(
		`Warehouse/BasicInfo?Id=${id}`,
		res => {
			onSuccess && onSuccess(res);
		},
		err => {
			// Do something special if this request fails or ignore
			onFailure && onFailure(err);
		}
	);
};

export const EditWarehouseBasicInfo = (data, onSuccess, onFailure) => {
	return POST(
		`Warehouse/BasicInfo`,
		data,
		res => {
			onSuccess && onSuccess(res);
		},
		err => {
			// Do something special if this request fails or ignore
			onFailure && onFailure(err);
		}
	);
};

export const GetWarehouseAddress = (id, onSuccess, onFailure) => {
	return GET(`Warehouse/Address?Id=${id}`, res => {
		onSuccess && onSuccess(res);
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	}
	);
};

export const EditWarehouseAddress = (data, onSuccess, onFailure) => {
	return POST(
		`Warehouse/Address`,
		data,
		res => {
			onSuccess && onSuccess(res);
		},
		err => {
			// Do something special if this request fails or ignore
			onFailure && onFailure(err);
		}
	);
};


export const GetWarehouseWorkinghours = (id, onSuccess, onFailure) => {
	return GET(
		`Warehouse/WorkingHours?warehouseId=${id}`,
		res => {
			onSuccess && onSuccess(res);
		},
		err => {
			// Do something special if this request fails or ignore
			onFailure && onFailure(err);
		}
	);
};


export const EditWarehouseWoringhours = (warehouseId, WorkingDayTypeId, IsOpen, From, To, onSuccess, onFailure) => {
	return POST(
		`Warehouse/WorkingHours?warehouseId=${warehouseId}`,

		WorkingDayTypeId, IsOpen, From, To
		, res => {
			onSuccess && onSuccess(res);
		},
		err => {
			// Do something special if this request fails or ignore
			onFailure && onFailure(err);
		}
	);
};



export const GetWarehouseUsers = (id, onSuccess, onFailure) => {
	return GET(
		`Warehouse/Users?warehouseId=${id}`,
		res => {
			onSuccess && onSuccess(res);
		},
		err => {
			// Do something special if this request fails or ignore
			onFailure && onFailure(err);
		}
	);
};


export const EditWarehouseUsers = (warehouseId, data, onSuccess, onFailure) => {
	return POST(
		`Warehouse/Users?warehouseId=${warehouseId}`,
		data, res => {
			onSuccess && onSuccess(res);
		},
		err => {
			// Do something special if this request fails or ignore
			onFailure && onFailure(err);
		}
	);
};



export const GetWarehouseNewUser = (onSuccess, onFailure) => {
	return GET(`Warehouse/New`, res => {
		onSuccess && onSuccess(res);
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err);
	}
	);
};

export const AddNewWarehouseUser = (data, onSuccess, onFailure) => {
	POST(`Warehouse/New`, data, res => {
		onSuccess && onSuccess(res)
	}, err => {

		onFailure && onFailure(err)
	})
}

export const DeleteWarehouse = (id, onSuccess, onFailure) => {
	return DELETE(`Warehouse?warehouseId=${id}`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const ReorderWarehouse = (Ids, onSuccess, onFailure) => {
	return POST('Warehouse/Reorder', Ids, res => {
		onSuccess && onSuccess(res)
	}, err => {
		onFailure && onFailure(res)
	})
}


export const DeleteWarehouseWorkinghours = (warehouseId, workingHourId, onSuccess, onFailure) => {
	return DELETE(`Warehouse/WorkingHours/Delete?warehouseId=${warehouseId}&workingHourId=${workingHourId}`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}


export const GetDays = (onSuccess, onFailure) => {
	return GET(`Filters?dayTypes=true`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err);
	}
	);
};


export const PostWhereHouseHour = (warehouseId, workingDays, onSuccess, onFailure) => {
	return POST(`Warehouse/WorkingHours?warehouseId=${warehouseId}`, workingDays, res => {
		onSuccess && onSuccess(res)
	}, err => {
		onFailure && onFailure(res)
	})
}

// POST /v1/
export const PostWhereHouseLocation = (data, onSuccess, onFailure) => {
	return POST(`Warehouse/Location`, data, res => {
		onSuccess && onSuccess(res)
	}, err => {
		onFailure && onFailure(res)
	})
}

export const PostWhereHouseProducts = (newData, warehouseId, onSuccess, onFailure) => {
	return POST(`Warehouse/Product`, {
		Data: newData,
		wareHouseId: warehouseId
	}, res => {
		onSuccess && onSuccess(res)
	}, err => {
		onFailure && onFailure(res)
	})
}