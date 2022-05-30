const tools = {}

tools.isEmptyStr = (str) => {
    return !str.replace(/\s/g, '').length
}

export default tools
