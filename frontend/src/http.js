export const http = (path, options = {}) => {
    if (!options.headers) {
        options.headers = {}
    }

    options.headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...options.headers,
    }

    if (localStorage.getItem('token')) {
        options.headers = {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
            ...options.headers,
        }
    }

    if (options.body) {
        options.body = JSON.stringify(options.body)
    }

    const url = import.meta.env.VITE_API_URL + path

    return fetch(url, options);
}