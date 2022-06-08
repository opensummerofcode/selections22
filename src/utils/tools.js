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

tools.replaceURLs = (message) => {
    if (!message) return

    var urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g
    return message.replace(urlRegex, function(url) {
        var hyperlink = url
        if (!hyperlink.match('^https?://')) {
            hyperlink = 'http://' + hyperlink
        }
        return (
            '<a href="' +
            hyperlink +
            '" target="_blank" rel="noopener noreferrer">' +
            url +
            '</a>'
        )
    })
}

export default tools
