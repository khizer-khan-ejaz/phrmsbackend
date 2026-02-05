import mongoose from "mongoose";


const eventSchema = mongoose.Schema({
    eventDate: {
        day: { type: Number, required: true },
        month: {
            type: String, enum: ['nan' , 'Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
        },
        year: { type: Number, required: true }
    },
    title: { type: String, required: true },
    img: { type: String, required: true },
    startTime: {
        timeValHour: { type: Number, required: true },
        timeValMinute: { type: Number, required: true },
        period: { type: String, enum: ["am", "pm"], required: true }
    },
    endTime: {
        timeValHour: { type: Number, required: true },
        timeValMinute: { type: Number, required: true },
        period: { type: String, enum: ["am", "pm"], required: true }
    },
    venue: { type: String, required: true },
    desc: { type: String, required: true }
}, { timestamps: true })

const Event = mongoose.model("event", eventSchema);
export default Event;
