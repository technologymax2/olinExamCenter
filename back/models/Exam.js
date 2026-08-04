const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subject: { type: String, required: true },
    duration: { type: Number, required: true }, // በደቂቃ
    examDate: { type: Date, required: true }, // የፈተና ቀን እና ሰዓት
    resultReleaseDate: { type: Date, required: true }, // ውጤት የሚገለጽበት ቀን
    questions: [
        {
            questionText: String,
            options: [String],
            correctAnswer: String
        }
    ]
});

module.exports = mongoose.model('Exam', examSchema);
