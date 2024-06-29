import { Hono } from 'hono';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { users } from '../db/schema';
import { donations } from '../db/schema';
import bcrypt from 'bcryptjs';
import { decode, sign, verify } from 'hono/jwt';
import { v4 } from 'uuid';

const donation = new Hono();

type NewDonation = typeof donations.$inferInsert;

const insertDonation = async (db: any, donation: NewDonation) => {
  const newDonation = await db.insert(donations).values(donation);
  return newDonation;
};

// TODO: add Zod validations
donation.post('/create', async (c: any) => {
  const { name, icon, title, description, walletAddress } = await c.req.json();
  const sql = neon(c.env.DATABASE_URL ?? '');
  const db = drizzle(sql);

  //   TODO: refactor auth verification into a middleware or sum'
  const authHeaderValue = c.req.header('Authorization');
  const token = authHeaderValue?.split(' ')[1];
  if (!authHeaderValue || !token) {
    return c.json({ status: false, message: 'Unauthorized' }, 401);
  }

  await verify(token, c.env.JWT_SECRET!);

  const decoded = decode(token);
  if (!decoded) {
    return c.json({ status: false, message: 'Unauthorized' }, 401);
  }

  const user = (await db.select().from(users)).find(
    (user: any) => user.userId === decoded.payload.id
  );
  if (!user) {
    return c.json({ status: false, message: 'Unauthorized' }, 401);
  }

  const donationId = v4();
  //   TODO: generate an actual friendlyId
  const friendlyId = v4();
  const newDonation: NewDonation = {
    userId: user.userId,
    donationId,
    name,
    icon,
    title,
    description,
    friendlyId,
    walletAddress,
  };
  await insertDonation(db, newDonation);

  return c.json({
    status: true,
    message: 'Donation link created successfully',
    data: null,
  });
});

export default donation;
