// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { createCard } from "../../lib/redis"

export default async function handler(req, res) {
	const id = await createCard(req.body)
  console.log('🚀 ~ id', id)

  res.status(200).json({ id })
}
