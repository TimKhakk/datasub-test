// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { createCard } from "../../lib/redis"

export default async function handler(req, res) {
	const result = await createCard(req.body)

  res.status(200).json(result)
}
