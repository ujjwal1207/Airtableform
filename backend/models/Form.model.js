// models/Form.js
const mongoose = require('mongoose');

const ConditionalLogicSchema = new mongoose.Schema({
  // The field whose visibility depends on another
  targetFieldId: { type: String, required: true },
  // The field that controls the visibility
  sourceFieldId: { type: String, required: true },
  // The value the source field must have to show the target field
  requiredValue: { type: String, required: true },
}, { _id: false }); // _id: false prevents Mongoose from creating ObjectIds for subdocuments

const QuestionSchema = new mongoose.Schema({
  // Airtable's field ID (e.g., 'fld123abc')
  airtableFieldId: { type: String, required: true },
  // Custom label defined by the user
  label: { type: String, required: true },
  // Airtable field type (e.g., 'singleLineText', 'singleSelect')
  type: { type: String, required: true },
  // For single/multi select, we store the available options
  options: {
    type: [{ id: String, name: String, color: String }],
    default: undefined
  },
}, { _id: false });

const formSchema = new mongoose.Schema({
  name: { type: String, required: true },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  airtableBaseId: { type: String, required: true },
  airtableTableId: { type: String, required: true },
  questions: [QuestionSchema],
  logic: [ConditionalLogicSchema],
}, { timestamps: true });

const Form = mongoose.model('Form', formSchema);

module.exports = Form;
