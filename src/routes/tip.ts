import { Hono } from 'hono';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { users } from '../db/schema';
import { tips } from '../db/schema';
import bcrypt from 'bcryptjs';
import { decode, sign, verify } from 'hono/jwt';
import { v4 } from 'uuid';

const tip = new Hono();

type NewTip = typeof tips.$inferInsert;

const insertTip = async (db: any, tip: NewTip) => {
  const newTip = await db.insert(tips).values(tip);
  return newTip;
};

// TODO: add Zod validations
tip.post('/create', async (c: any) => {
  const { name, icon, title, description, walletAddress } = await c.req.json();
  const sql = neon(c.env.DATABASE_URL ?? '');
  const db = drizzle(sql);

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

  const tipId = v4();
  //   TODO: generate an actual friendlyId
  const friendlyId = v4();
  const newTip: NewTip = {
    userId: user.userId,
    tipId,
    name,
    icon,
    title,
    description,
    friendlyId,
    walletAddress,
  };
  await insertTip(db, newTip);

  return c.json({
    status: true,
    message: 'Tip created successfully',
    data: null,
  });
});

export default tip;
