const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2')

const FileModelSchema = new mongoose.Schema({
    number: {
        type: Number
    },
    fileName: {
        type: String
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
    },
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FileModels',
    },
    location: {
        type: String,
    },
    isFile: {
        type: Boolean,
    },
    isFavorite: {
        type: Boolean
    },
    fileExtension: {
        type: String
    },
    status: {
        type: String,
        enum: ["ACTIVE", "BLOCKED", "DELETED",],
        default: "ACTIVE",
    },
},
    { timestamps: true });

FileModelSchema.plugin(mongoosePaginate);
FileModelSchema.plugin(aggregatePaginate);
const FileModel = mongoose.model('FileModels', FileModelSchema);
module.exports = FileModel;