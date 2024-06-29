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
import { Bindings } from 'hono/types';

if (globalThis.Buffer === undefined) {
  globalThis.Buffer = Buffer;
}

// TODO: use a private RPC below
const connection = new Connection('https://api.mainnet-beta.solana.com');

export type Env = {
  DATABASE_URL: string;
};

const app = new Hono<{ Bindings: Env }>();

app.use(cors());

app.route('/auth', auth);
app.route('/tip', tip);

// const DONATION_DESTINATION_WALLET =
//   'B39QpxQvLKPLMXuaiqVnZR7bAMuVLFRECdqFLEkTyrtW';
// const DONATION_AMOUNT_SOL_OPTIONS = [1, 5, 10];
// const DEFAULT_DONATION_AMOUNT_SOL = 1;

// function getDonateInfo(): Pick<
//   ActionGetResponse,
//   'icon' | 'title' | 'description'
// > {
//   const icon =
//     'https://ucarecdn.com/7aa46c85-08a4-4bc7-9376-88ec48bb1f43/-/preview/880x864/-/quality/smart/-/format/auto/';
//   const title = 'Tip starlingroot on Solana';
//   const description = 'Software Engineer | Support my research with a tip.';
//   return { icon, title, description };
// }

// app.get('/', (c) => {
//   const { icon, title, description } = getDonateInfo();
//   const amountParameterName = 'amount';

//   const response: ActionGetResponse = {
//     icon,
//     label: `${DEFAULT_DONATION_AMOUNT_SOL} SOL`,
//     title,
//     description,
//     links: {
//       actions: [
//         ...DONATION_AMOUNT_SOL_OPTIONS.map((amount) => ({
//           label: `${amount} SOL`,
//           href: `/${amount}`,
//         })),
//         {
//           href: `/{${amountParameterName}}`,
//           label: 'Tip',
//           parameters: [
//             {
//               name: amountParameterName,
//               label: 'Enter a custom SOL amount',
//             },
//           ],
//         },
//       ],
//     },
//   };

//   return c.json(response);
// });

// app.get('/:amount', async (c) => {
//   const amount = c.req.param('amount');
//   const { icon, title, description } = getDonateInfo();
//   const response: ActionGetResponse = {
//     icon,
//     label: `${amount} SOL`,
//     title,
//     description,
//   };
//   return c.json(response, 200);
// });

// app.post('/:amount', async (c) => {
//   const amount =
//     c.req.param('amount') ?? DEFAULT_DONATION_AMOUNT_SOL.toString();
//   const { account } = (await c.req.json()) as ActionPostRequest;

//   const parsedAmount = parseFloat(amount);
//   const transaction = await prepareDonateTransaction(
//     new PublicKey(account),
//     new PublicKey(DONATION_DESTINATION_WALLET),
//     parsedAmount * LAMPORTS_PER_SOL
//   );
//   const response: ActionPostResponse = {
//     transaction: Buffer.from(transaction.serialize()).toString('base64'),
//   };
//   return c.json(response, 200);
// });

// export async function prepareTransaction(
//   instructions: TransactionInstruction[],
//   payer: PublicKey
// ) {
//   const blockhash = await connection
//     .getLatestBlockhash({ commitment: 'max' })
//     .then((res) => res.blockhash);
//   const messageV0 = new TransactionMessage({
//     payerKey: payer,
//     recentBlockhash: blockhash,
//     instructions,
//   }).compileToV0Message();
//   return new VersionedTransaction(messageV0);
// }

// async function prepareDonateTransaction(
//   sender: PublicKey,
//   recipient: PublicKey,
//   lamports: number
// ): Promise<VersionedTransaction> {
//   const payer = new PublicKey(sender);
//   const instructions = [
//     SystemProgram.transfer({
//       fromPubkey: payer,
//       toPubkey: new PublicKey(recipient),
//       lamports: lamports,
//     }),
//   ];
//   return prepareTransaction(instructions, payer);
// }

export default app;
