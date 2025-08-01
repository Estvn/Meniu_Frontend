export default class ConstValues {

    app_server:string = "api-meniuapp-dev.azurewebsites.net/";
}

// Utility functions for session storage
export const getStoredToken = (): string | null => {
    return sessionStorage.getItem('access_token');
};

// Function to decode JWT and extract payload
export const decodeJWT = (token: string) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Error decoding JWT:', error);
        return null;
    }
};

export const getStoredUserData = () => {
    const token = getStoredToken();
    if (!token) return null;
    
    const decodedToken = decodeJWT(token);
    if (!decodedToken) return null;
    
    return {
        sub: decodedToken.sub,
        username: decodedToken.username,
        rol: decodedToken.rol,
        nombre: decodedToken.nombre,
        apellidos: decodedToken.apellidos,
        email: decodedToken.email,
        restaurante_id: decodedToken.restaurante_id,
        restaurante_nombre: decodedToken.restaurante_nombre,
        iat: decodedToken.iat,
        exp: decodedToken.exp
    };
};

export const clearStoredAuth = () => {
    sessionStorage.removeItem('access_token');
};

export const isAuthenticated = (): boolean => {
    return !!getStoredToken();
};