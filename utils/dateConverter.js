import {data} from "../utils/data.js";

export const monthConverter = (month)=>{
    const monthText = data.monthToText[month];
    return monthText;
}