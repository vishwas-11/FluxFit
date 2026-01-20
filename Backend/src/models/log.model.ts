import { Schema, model, Types } from 'mongoose';

const logSchema = new Schema(
    {
        user: {
            type: Types.ObjectId,
            ref: 'User',
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        weight: Number,
        sleepHours: Number,
        workout: {
            type: {
                type: String,
            },
            duration: Number,
        },
        nutrition: {
            calories: Number,
            protein: Number,
        },
    },
    { timestamps: true }
)

export const Log = model("Log", logSchema);