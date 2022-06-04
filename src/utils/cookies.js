const cookies = {}

cookies.set = (name, value, exp = null) => {
    const cookie = `${name}=${value}${exp ? `;expires=${exp}` : ''}`
    document.cookie = cookie
}

cookies.get = (name) => {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) {
        return parts
            .pop()
            .split(';')
            .shift()
    }
    return undefined
}

cookies.delete = (name) => {
    document.cookie = `${name}= ; expires = Thu, 01 Jan 1970 00:00:00 GMT`
}

export default cookies
