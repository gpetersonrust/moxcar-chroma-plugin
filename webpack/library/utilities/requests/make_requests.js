export default async function makeRequest(url, data, method = "POST") {
    const response = await fetch(url, {
        method: method,
        body: JSON.stringify(data),
        headers: {
        "Content-Type": "application/json",
        },
    });
    return response.json();
    }
    