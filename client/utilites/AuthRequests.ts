import sendRequest, { requestMethods } from "./sendRequest";

/* SIGN IN */
interface signInDTO{
    email: string;
    password: string;
}

export async function signIn(data: signInDTO){
    const response = sendRequest("/auth/signin", requestMethods.POST, data);

    return response;
}


/* VERIFY SESSION */

export async function verifySession(){
    const response = sendRequest("/auth/verify", requestMethods.GET);
    
    return response;
}

/* SIGN UP */
interface signUpDTO{
    email: string;
    password: string;
    repeatPassword: string;
}

export async function signUp(data:signUpDTO){
    const response = sendRequest("/auth/signup", requestMethods.POST, data);

    return response;
}


/* SIGN OUT */

export async function signOut() {
    const response = sendRequest("/auth/signou", requestMethods.GET);

    return response;
}