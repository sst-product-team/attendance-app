import { domain_URL } from "../constants";

async function fetchData(did) {
    const response = await fetch(domain_URL+'/attendance/getTodaysClass/', {
        method: 'POST',
        body: JSON.stringify({
            'token': did,
        }),
    });
    const data = await response.json();
    return data;
}

export async function fetchAllClasses(did) {
    const data = await fetchData(did);
    console.log(data);
    return data;
}