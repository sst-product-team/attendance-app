import { domain_URL } from "../constants";
import {useState} from 'react';


export function fetchAttendance(did) {
    const [attendance, setAttendance] = useState(0);
    fetch(domain_URL+'/attendance/get_aggregated_attendance/', {
        method: 'POST',
        body: JSON.stringify({
            'token': did,
        }),
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        // console.log("All classes = ", data);
        var totalAttendance = 0;
        var totalClass = 0;
        for(var i in data)
            // console.log("Present = ", data[i].Present || 0)
            totalAttendance += data[i].Present || 0;
        for(var i in data)
            totalClass += data[i].totalClassCount;
        // console.log("Total Attendance = ", totalAttendance);
        // console.log("Total Class = ", totalClass);
        const attendance = (totalAttendance/totalClass)*100;
        setAttendance(Math.round(attendance));
    });

    return attendance;

};