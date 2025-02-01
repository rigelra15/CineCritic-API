require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { GoogleGenerativeAI } = require('@google/generative-ai')

const app = express()
const PORT = process.env.PORT || 5000
const genAI = new GoogleGenerativeAI(process.env.GENERATIVE_AI_KEY)

app.use(cors())
app.use(express.json())

app.post('/api/generate', async (req, res) => {
	try {
		const { prompt } = req.body
		if (!prompt) {
			return res.status(400).json({ error: 'Prompt is required' })
		}

		const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' })
		const result = await model.generateContent(prompt)
		const response = result.response

		const text = response.text().replace(/\*/g, '').replace(/\n\n/g, '\n')

		res.json({ response: text })
	} catch (error) {
		console.error('Error generating response:', error)
		res.status(500).json({ error: 'Failed to generate response' })
	}
})

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`)
})
