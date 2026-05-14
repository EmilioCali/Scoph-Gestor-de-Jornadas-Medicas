import { Schema, model } from 'mongoose'

const auditSchema = new Schema(
    {
        userId: {
            type: String,
            required: true,
            trim: true
        },

        action: {
            type: String,
            required: true,
            trim: true
        },

        module: {
            type: String,
            required: true,
            trim: true
        },

        reference: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        date: {
            type: Date,
            default: Date.now
        }
    },
    {
        versionKey: false
    }
)

export default model('Audit', auditSchema)