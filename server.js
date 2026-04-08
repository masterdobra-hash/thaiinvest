require('dotenv').config()

const express = require('express')
const axios = require('axios')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors())

const PORT = process.env.PORT || 10000

const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`

// тестовый endpoint (чтобы проверить что сервер жив)
app.get('/', (req, res) => {
  res.send('Tropic Invest API is running')
})

// основной endpoint
app.post('/lead', async (req, res) => {
  try {
    const { name, phone, message, budget } = req.body

    const text = `
🔥 Новая заявка (Tropic Invest)

Имя: ${name}
Телефон: ${phone}
Бюджет: ${budget || 'не указан'}
Интерес: ${message || 'не указан'}

Дата: ${new Date().toLocaleString()}
    `

    await axios.post(`${TELEGRAM_API}/sendMessage`, {
      chat_id: process.env.TELEGRAM_CHAT_ID,
      text: text
    })

    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Ошибка отправки' })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})