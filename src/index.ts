import {
  ActionGetResponse,
  ActionPostRequest,
  ActionPostResponse,
} from '@solana/actions';
import {
  LAMPORTS_PER_SOL,
  TransactionInstruction,
  Connection,
  PublicKey,
  SystemProgram,
  TransactionMessage,
  VersionedTransaction,
} from '@solana/web3.js';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { Buffer } from 'node:buffer';
import auth from './routes/auth';
import tip from './routes/tip';
import donation from './routes/donate';
import { tips } from './db/schema';
import { donations } from './db/schema';
import { Bindings } from 'hono/types';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { config } from 'dotenv';

if (globalThis.Buffer === undefined) {
  globalThis.Buffer = Buffer;
}

config({
  path: '.dev.vars',
});

export type Env = {
  DATABASE_URL: string;
  JWT_SECRET: string;
  MAINNET_RPC_URL: string;
};

const app = new Hono<{ Bindings: Env }>();

app.use(cors());

const TIP_AMOUNT_SOL_OPTIONS = [1, 5, 10];
const DONATION_AMOUNT_SOL_OPTIONS = [2, 10, 15];
const DEFAULT_TIP_AMOUNT_SOL = 1;
const DEFAULT_DONATION_AMOUNT_SOL = 2;

// Tip routes
app.get('/:tipId/tip', async (c) => {
  const tipId = c.req.param('tipId');
  const sql = neon(c.env.DATABASE_URL ?? '');
  const db = drizzle(sql);

  const tip = (await db.select().from(tips)).find(
    (tip: any) => tip.friendlyId === tipId
  );
  if (!tip) {
    return c.json({ status: false, message: 'Invalid tiplink' }, 400);
  }

  const { icon, title, description } = tip;
  const amountParameterName = 'amount';

  const response: ActionGetResponse = {
    icon,
    label: `${DEFAULT_TIP_AMOUNT_SOL} SOL`,
    title,
    description,
    links: {
      actions: [
        ...TIP_AMOUNT_SOL_OPTIONS.map((amount) => ({
          label: `${amount} SOL`,
          href: `/${tipId}/tip/${amount}`,
        })),
        {
          href: `/${tipId}/tip/{${amountParameterName}}`,
          label: 'Tip',
          parameters: [
            {
              name: amountParameterName,
              label: 'Enter a custom tip amount in SOL',
            },
          ],
        },
      ],
    },
  };

  return c.json(response);
});

app.get('/:tipId/tip/:amount', async (c) => {
  const { tipId, amount } = c.req.param();
  const sql = neon(c.env.DATABASE_URL ?? '');
  const db = drizzle(sql);

  const tip = (await db.select().from(tips)).find(
    (tip: any) => tip.friendlyId === tipId
  );
  if (!tip) {
    return c.json({ status: false, message: 'Invalid tiplink' }, 400);
  }

  const { icon, title, description } = tip;
  const response: ActionGetResponse = {
    icon,
    label: `${amount} SOL`,
    title,
    description,
  };
  return c.json(response, 200);
});

app.post('/:tipId/tip/:amount', async (c) => {
  const amount = c.req.param('amount') ?? DEFAULT_TIP_AMOUNT_SOL.toString();
  const tipId = c.req.param('tipId');
  const sql = neon(c.env.DATABASE_URL ?? '');
  const db = drizzle(sql);

  const tip = (await db.select().from(tips)).find(
    (tip: any) => tip.friendlyId === tipId
  );
  if (!tip) {
    return c.json({ status: false, message: 'Invalid tiplink' }, 400);
  }

  const { account } = (await c.req.json()) as ActionPostRequest;

  const parsedAmount = parseFloat(amount);
  const transaction = await prepareDonateTransaction(
    c,
    new PublicKey(account),
    new PublicKey(tip.walletAddress),
    parsedAmount * LAMPORTS_PER_SOL
  );
  const response: ActionPostResponse = {
    transaction: Buffer.from(transaction.serialize()).toString('base64'),
  };
  return c.json(response, 200);
});

// DONATION routes
app.get('/:donationId/donate', async (c) => {
  const donationId = c.req.param('donationId');
  const sql = neon(c.env.DATABASE_URL ?? '');
  const db = drizzle(sql);

  const donation = (await db.select().from(donations)).find(
    (donation: any) => donation.friendlyId === donationId
  );
  if (!donation) {
    return c.json({ status: false, message: 'Invalid donation link' }, 400);
  }

  const { icon, title, description } = donation;
  const amountParameterName = 'amount';

  const response: ActionGetResponse = {
    icon,
    label: `${DEFAULT_DONATION_AMOUNT_SOL} SOL`,
    title,
    description,
    links: {
      actions: [
        ...DONATION_AMOUNT_SOL_OPTIONS.map((amount) => ({
          label: `${amount} SOL`,
          href: `/${donationId}/donate/${amount}`,
        })),
        {
          href: `/${donationId}/donate/{${amountParameterName}}`,
          label: 'Donate',
          parameters: [
            {
              name: amountParameterName,
              label: 'Enter a custom donation amount in SOL',
            },
          ],
        },
      ],
    },
  };

  return c.json(response);
});

app.get('/:donationId/donate/:amount', async (c) => {
  const { donationId, amount } = c.req.param();
  const sql = neon(c.env.DATABASE_URL ?? '');
  const db = drizzle(sql);

  const donation = (await db.select().from(donations)).find(
    (donation: any) => donation.friendlyId === donationId
  );
  if (!donation) {
    return c.json({ status: false, message: 'Invalid donation link' }, 400);
  }

  const { icon, title, description } = donation;
  const response: ActionGetResponse = {
    icon,
    label: `${amount} SOL`,
    title,
    description,
  };
  return c.json(response, 200);
});

app.post('/:donationId/donate/:amount', async (c) => {
  const amount =
    c.req.param('amount') ?? DEFAULT_DONATION_AMOUNT_SOL.toString();
  const donationId = c.req.param('donationId');
  const sql = neon(c.env.DATABASE_URL ?? '');
  const db = drizzle(sql);

  const donation = (await db.select().from(donations)).find(
    (donation: any) => donation.friendlyId === donationId
  );
  if (!donation) {
    return c.json({ status: false, message: 'Invalid donation link' }, 400);
  }

  const { account } = (await c.req.json()) as ActionPostRequest;

  const parsedAmount = parseFloat(amount);
  const transaction = await prepareDonateTransaction(
    c,
    new PublicKey(account),
    new PublicKey(donation.walletAddress),
    parsedAmount * LAMPORTS_PER_SOL
  );
  const response: ActionPostResponse = {
    transaction: Buffer.from(transaction.serialize()).toString('base64'),
  };
  return c.json(response, 200);
});

export async function prepareTransaction(
  c: any,
  instructions: TransactionInstruction[],
  payer: PublicKey
) {
  const connection = new Connection(
    c.env.MAINNET_RPC_URL ?? ('https://api.mainnet-beta.solana.com' as string)
  );
  const blockhash = await connection
    .getLatestBlockhash({ commitment: 'max' })
    .then((res) => res.blockhash);
  const messageV0 = new TransactionMessage({
    payerKey: payer,
    recentBlockhash: blockhash,
    instructions,
  }).compileToV0Message();
  return new VersionedTransaction(messageV0);
}

async function prepareDonateTransaction(
  c: any,
  sender: PublicKey,
  recipient: PublicKey,
  lamports: number
): Promise<VersionedTransaction> {
  const payer = new PublicKey(sender);
  const instructions = [
    SystemProgram.transfer({
      fromPubkey: payer,
      toPubkey: new PublicKey(recipient),
      lamports: lamports,
    }),
  ];
  return prepareTransaction(c, instructions, payer);
}

app.route('/auth', auth);
app.route('/tip', tip);
app.route('/donation', donation);

export default app;
