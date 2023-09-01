import mongoose from 'mongoose';

const carerSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true, 
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, 
        trim: true,
        lowercase: true, 
        match: [/.+\@.+\..+/, 'Please fill a valid email address'], 
    },
    password: {
        type: String,
        required: true,
        minlength: [8, 'Password should be at least 8 characters long'],
    },
    dateOfBirth: {
        required: false,
        type: Date,
    },
    address: {
        street: {
            type: String,
            trim: true,
        },
        city: {
            type: String,
            trim: true,
        },
        state: {
            type: String,
            trim: true,
        },
        postalCode: {
            type: String,
            trim: true,
        },
        country: {
            type: String,
            trim: true,
        },
    },
    phoneNumber: {
        type: String,
        trim: true,
    },
    bio: {
        type: String,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    lastLogin: {
        type: Date,
    },
    accountStatus: {
        type: String,
        enum: ['Active', 'Inactive', 'Banned'],
        default: 'Active',
    },
    role: {
        type: String,
        default: 'carer',
    },
});

const CarerModel = mongoose.model('Carer', carerSchema);
export {CarerModel}


