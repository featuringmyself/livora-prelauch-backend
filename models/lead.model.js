import mongoose, { mongo } from "mongoose";

const lead = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        source: {
            type: String,
            default: 'website_form',
        }
    },
    {timestamps: true}
)

export default mongoose.model('lead', lead)