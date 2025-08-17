// controllers/formController.js
const Form = require('../models/Form.model')
const User = require('../models/User.model')
const axios = require('axios')

/**
 * Logic to create a new form configuration and save it to the database.
 */
exports.createForm = async (req, res) => {
  try {
    const form = new Form({
      ...req.body,
      user: req.user.id // The user's ID comes from the JWT authentication middleware
    })
    await form.save()
    res.status(201).json(form)
  } catch (error) {
    console.error('Form creation error:', error)
    res
      .status(400)
      .json({ message: 'Error creating form', error: error.message })
  }
}

/**
 * Logic to update an existing form.
 */
exports.updateForm = async (req, res) => {
  try {
    const form = await Form.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    )

    if (!form) {
      return res
        .status(404)
        .json({
          message: 'Form not found or you do not have permission to edit it.'
        })
    }

    res.status(200).json(form)
  } catch (error) {
    console.error('Form update error:', error)
    res
      .status(400)
      .json({ message: 'Error updating form', error: error.message })
  }
}

/**
 * Logic to get all forms created by the currently logged-in user.
 */
exports.getForms = async (req, res) => {
  try {
    const forms = await Form.find({ user: req.user.id })
    res.status(200).json(forms)
  } catch (error) {
    console.error('Get forms error:', error)
    res
      .status(500)
      .json({ message: 'Error fetching forms', error: error.message })
  }
}

/**
 * Logic to get a single form's public configuration by its ID.
 * This is used by the form viewer page.
 */
exports.getFormById = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id)
    if (!form) {
      return res.status(404).json({ message: 'Form not found' })
    }
    res.status(200).json(form)
  } catch (error) {
    console.error('Get form by ID error:', error)
    res
      .status(500)
      .json({ message: 'Error fetching form', error: error.message })
  }
}

/**
 * Logic to get a single form's configuration for editing.
 * This is a protected route.
 */
exports.getFormForEdit = async (req, res) => {
  try {
    const form = await Form.findOne({ _id: req.params.id, user: req.user.id })
    if (!form) {
      return res
        .status(404)
        .json({
          message: 'Form not found or you do not have permission to edit it.'
        })
    }
    res.status(200).json(form)
  } catch (error) {
    console.error('Get form for edit error:', error)
    res
      .status(500)
      .json({
        message: 'Error fetching form for editing',
        error: error.message
      })
  }
}

/**
 * Logic to handle a user submitting a form.
 * This creates a new record in the creator's Airtable base.
 */
exports.submitForm = async (req, res) => {
  try {
    // Find the form config and populate the creator's user data
    const form = await Form.findById(req.params.id).populate('user')
    if (!form) {
      return res.status(404).json({ message: 'Form not found' })
    }

    const formCreator = form.user
    if (!formCreator || !formCreator.accessToken) {
      return res
        .status(500)
        .json({ message: 'Form owner credentials are not configured.' })
    }

    // Format the submission data for the Airtable API
    const fields = {}
    for (const key in req.body) {
      const question = form.questions.find(q => q.airtableFieldId === key)
      if (
        question &&
        question.type === 'multipleAttachments' &&
        req.body[key]
      ) {
        fields[key] = [{ url: req.body[key] }]
      } else {
        fields[key] = req.body[key]
      }
    }

    const airtablePayload = {
      fields
    }

    const url = `https://api.airtable.com/v0/${form.airtableBaseId}/${form.airtableTableId}`

    // Make the API call to Airtable to create the new record
    await axios.post(url, airtablePayload, {
      headers: {
        Authorization: `Bearer ${formCreator.accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    res.status(200).json({ message: 'Form submitted successfully!' })
  } catch (error) {
    // Log detailed error information from Airtable if available
    console.error(
      'Airtable submission error:',
      error.response ? error.response.data : error.message
    )
    res
      .status(500)
      .json({ message: 'Error submitting to Airtable', error: error.message })
  }
}
