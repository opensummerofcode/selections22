const tools = {}

tools.isEmptyStr = (str) => {
    return !str.replace(/\s/g, '').length
}

tools.isValidUrl = (string) => {
    let url

    try {
        url = new URL(string)
    } catch (_) {
        return false
    }

    return url.protocol === 'http:' || url.protocol === 'https:'
}

export default tools
