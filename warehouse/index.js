import amqplib from 'amqplib'
import express from 'express'

const app = express()

app.use(express.json())

const PORT = 9006

let channel, connection

connect()

async function connect() {
    try {
        const amqpServer = 'amqp://localhost:5672'
        connection = await amqplib.connect(amqpServer)
        channel = await connection.createChannel()
        await channel.consume('order', (data) => {
            console.log(`Received ${Buffer.from(data.content)}`)
            channel.ack(data);
        })
    } catch (error) {
        console.log(error)
    }
}

app.get('*', (req, res) => {
    res.status(404).send('Not found')
})

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})
