import amqplib from 'amqplib'
import express from 'express'

const app = express()

app.use(express.json())

const PORT = 9005

let channel, connection

connect()

async function connect() {
    try {
        const amqpServer = 'amqp://localhost:5672'
        connection = await amqplib.connect(amqpServer)
        channel = await connection.createChannel()
        await channel.assertQueue('order')
    } catch (error) {
        console.log(error)
    }
}

app.post('/orders', (req, res) => {
    const data = req.body

    console.log('req.body', req.body);

    channel.sendToQueue(
        'order',
        Buffer.from(
            JSON.stringify({
                ...data,
                date: new Date(),
            }),
        ),
    )

    res.send('Order submitted')
})

app.get('*', (req, res) => {
    res.status(404).send('Not found')
})

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})
