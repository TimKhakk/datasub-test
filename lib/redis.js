import { Client, Entity, Repository, Schema } from 'redis-om';

const client = new Client();

async function connect() {
  if (!client.isOpen()) {
    await client.open(process.env.REDIS_URL);
  }
}

class Card extends Entity {}

let cardSchema = new Schema(Card, {
  number: { type: 'string' },
  expiration_date: { type: 'string' },
	cvv: { type: 'string' },
	amount: { type: 'number' },
}, {
	dataStructure: 'JSON'
});

export async function createCard(data) {
	await connect()

	const repository = client.fetchRepository(cardSchema)

	const card = repository.createEntity(data)

	const id = await repository.save(card)

	return id
}
