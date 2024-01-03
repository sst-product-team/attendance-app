import { domain_URL } from "../constants";
import {useState} from 'react';


export function fetchAttendance(did) {
    const [attendance, setAttendance] = useState(0);
    const [record, setRecord] = useState("");
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
        var totalAttendance = 0;
        var totalClass = 0;
        var ats = "";
        for(var i in data){
            ats += `attended ${data[i].Present || 0} out of ${data[i].totalClassCount} of ${i}\n`;
            totalAttendance += data[i].Present || 0;
            totalClass += data[i].totalClassCount;
        }
        const attendance = (totalAttendance/totalClass)*100;
        setAttendance(Math.round(attendance));
        setRecord(ats);
    });

    return {
        "attendance_percentage": attendance,
        "attendance_record": record
    };

};