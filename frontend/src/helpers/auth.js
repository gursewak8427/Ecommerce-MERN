import cookie from 'js-cookie'

// Set in Cookie
export const setCookie = (key, value) => {
    if(window !== 'undefiend'){
        cookie.set(key, value, {
            // 1 Day
            expires: 1
        }) 
    }
}

// Remove from Cookie
export const removeCookie = key => {
    if(window !== 'undefiend'){
        cookie.remove(key,{
            expires: 1
        })
    }
}

// Get from cookie like token
export const getCookie = key => {
    if(window !== 'undefined'){
        return cookie.get(key)
    }
}

// Set in local storrage
export const setLocalStorage = (key, value) => {
    if(window !== 'undefiend'){
        localStorage.setItem(key, JSON.stringify(value))
    }
}


// Remove from local storrage
export const removeLocalStorage = key => {
    if(window !== 'undefiend'){
        localStorage.removeItem(key)
    }
}

// Auth user after login for vendor
export const authenticate = (response, next) => {
    setCookie('token', response.data.token)
    setLocalStorage('user', response.data.user)
    next()
}

// for user-client
export const authenticateUser = (response, next) => {
    setCookie('token-client', response.data.token)
    setLocalStorage('user-client', response.data.user)
    next()
}

// sign out vendor
export const signout = next => {
    removeCookie('token')
    removeLocalStorage('user')
}

// sign out user-client
export const signoutUser = next => {
    removeCookie('client-token')
    removeLocalStorage('user-client')
}

// Get user info from localstorage || isAuth
export const isAuth = () => {
    if(window !== 'undefiend'){
        const cookieChecked = getCookie('token')
        if(cookieChecked){
            if(localStorage.getItem('user')){
                return JSON.parse(localStorage.getItem('user'))
            }else{
                return false
            }
        }else{
            return false
        }
    }
}

// Get user info from localstorage || isAuth for User-client
export const isAuthUser = () => {
    if(window !== 'undefiend'){
        const cookieChecked = getCookie('token-client')
        if(cookieChecked){
            if(localStorage.getItem('user-client')){
                return JSON.parse(localStorage.getItem('user-client'))
            }else{
                return false
            }
        }else{
            return false
        }
    }
}

//  update user data in localstorate
export const updateUser = (response, next) => {
    if(window !== 'undefined'){
        let auth = JSON.parse(localStorage.getItem('user'))
        auth = response.data
        localStorage.setItem('user', JSON.stringify(auth))
    }
    next()
}

//  update user data in localstorate for client-user
export const updateUserClient = (response, next) => {
    if(window !== 'undefined'){
        let auth = JSON.parse(localStorage.getItem('user-client'))
        auth = response.data
        localStorage.setItem('user-client', JSON.stringify(auth))
    }
    next()
}