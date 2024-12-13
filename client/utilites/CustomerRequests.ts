import sendRequest, { requestMethods } from "./sendRequest";

/* CREATE CUSTOMER */

interface createCustomerDTO{
    name: string,
    email: string,
    phone: string,
    dni: string,
}

export async function createCustomer(data: createCustomerDTO){
    const response = await sendRequest("/customer", requestMethods.POST, data);

    return response;
}

/* FETCH ALL CUSTOMERS */

export async function getAllCustomers(page: number = 1){
    const response = await sendRequest(`/customer${page > 1 ? `?page=${page}` : ''}`, requestMethods.GET);
    console.log(response)
    return response;
}


/* FETCH ONE CUSTOMER BY ID */

export async function getCustomerById(id: string){
    const response = sendRequest(`/customer/${id}`, requestMethods.GET);

    return response;
}

/* UPDATE CUSTOMER */

interface updateCustomerDTO{
    name?: string,
    email?: string,
    phone?: string,
    dni?: string,
}

export async function updateCustomer(id: string, data:updateCustomerDTO){
    const response = sendRequest(`/customer/${id}`, requestMethods.PATCH, data);

    return response;
}

/* DELETE CUSTOMER */

export async function deleteCustomer(id: string){
    const response = sendRequest(`/customer/${id}`, requestMethods.DELETE);

    return response;
}

/* CHECK IF DNI EXIST */

export async function checkIfDniExists(productName: string){
    const response = sendRequest(`/customer/filter?filterType=ipi&value=${productName}`, requestMethods.GET);

    return response;
}

/* FIND CUSTOMERS BY */

export async function findCustomersBy(value: string){
    const response = sendRequest(`/customer/findBy?value=${value}`, requestMethods.GET);
    
    return response;
}