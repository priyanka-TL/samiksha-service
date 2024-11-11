const mongoose = require('mongoose')
const axios = require('axios')

// MongoDB URL and Collection
const mongoURL = 'mongodb://localhost:27017/elevate-samiksha'
const collectionName = 'forms'

// Connect to MongoDB
mongoose
	.connect(mongoURL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log('Connected to MongoDB')
	})
	.catch((err) => {
		console.error('Failed to connect to MongoDB', err)
	})

// Define schema for forms collection (adjust fields based on JSON structure)
const formSchema = new mongoose.Schema({}, { strict: false })
const Form = mongoose.model(collectionName, formSchema)

// Fetch JSON data from URL and insert into MongoDB
async function fetchAndInsertData() {
	try {
		const response = await axios.get(
			'https://raw.githubusercontent.com/ELEVATE-Project/observation-survey-projects-pwa/refs/heads/release-2.0.0/forms.json'
		)
		const data = response.data

		const modifiedData = data.map((form) => ({
			...form,
			organizationId: 1,
			deleted: false,
			version: 0,
		}))

		// Insert modified data into the forms collection
		await Form.insertMany(modifiedData)
		console.log('Data inserted successfully')
	} catch (error) {
		console.error('Error fetching or inserting data:', error)
	} finally {
		mongoose.connection.close()
	}
}

// Execute the function
fetchAndInsertData()
