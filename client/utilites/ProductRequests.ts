import sendRequest, { requestMethods } from "./sendRequest";

/* CREATE PRODUCT */

interface createProductDTO{
    productName: string;
    productDescription: string;
    quantityInStock: number;
    category: string;
}

export async function createProduct(data: createProductDTO){
    const response = await sendRequest("/product", requestMethods.POST, data);

    return response;
}

/* FETCH ALL PRODUCTS */

export async function getAllProducts(page: number = 1){
    const response = await sendRequest(`/product${page > 1 ? `?page=${page}` : ''}`, requestMethods.GET);
    console.log(response)
    return response;
}


/* FETCH ONE PRODUCT BY ID */

export async function getProductById(id: string){
    const response = sendRequest(`/product/${id}`, requestMethods.GET);

    return response;
}

/* UPDATE PRODUCT */

interface updateProductDTO{
    productName?: string;
    productDescription?: string;
    isActive?: boolean;
    quantityInStock?: number;
    category?: string;
}

export async function updateProduct(id: string, data:updateProductDTO){
    const response = sendRequest(`/product/${id}`, requestMethods.PATCH, data);

    return response;
}

/* DELETE PRODUCT */

export async function deleteProduct(id: string){
    const response = sendRequest(`/product/${id}`, requestMethods.DELETE);

    return response;
}

/* CHECK IF PRODUCT NAME EXIST */

export async function checkIfProductNameExist(productName: string){
    const response = sendRequest(`/product/filter?filterType=ipi&value=${productName}`, requestMethods.GET);

    return response;
}


/* GET SIMILAR PRODUCT NAMES */

export async function getSimilarProductNames(productName: string){
    const response = sendRequest(`/product/filter?filterType=psw&value=${productName}`, requestMethods.GET);
    
    return response;
}