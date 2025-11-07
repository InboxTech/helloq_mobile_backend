const publishEvent = async (topic, message) => {
  await global.producer.send({
    topic,
    messages: [{ value: JSON.stringify(message) }]
  });
};

const startKafkaConsumers = async () => {
  const consumer = global.kafka.consumer({ groupId: 'helloq-group' });
  await consumer.connect();
  await consumer.subscribe({ topic: 'match.events' });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const event = JSON.parse(message.value.toString());
      console.log('Kafka Event:', event);
      // Trigger push, analytics, etc.
    }
  });
};

module.exports = { publishEvent, startKafkaConsumers };