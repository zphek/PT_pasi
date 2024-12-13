import axios from "axios"
const BASE_URL = process.env.BASE_URL || "http://localhost:4000";

export enum requestMethods{
    GET = "get",
    POST = "post",
    PUT = "put",
    DELETE = "delete",
    PATCH = "patch"
}

export default async function sendRequest(endpoint: string, method: requestMethods, data: any = null){
    if(data && (method == requestMethods.POST || method == requestMethods.PUT || method == requestMethods.DELETE ||  method == requestMethods.PATCH)){
        console.log(data, method);
        
        return axios({
            baseURL: BASE_URL,
            method, 
            url: endpoint,
            data,
            headers: {
                'Access-Control-Allow-Credentials': 'true'
            },
            withCredentials: true
        })
    }

    return axios({
        baseURL: BASE_URL, 
        method,
        url: endpoint,
        withCredentials: true
    })
}