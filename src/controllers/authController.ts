// import { Context } from 'hono';
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
// import { sendResetPasswordEmail } from '../utils/email';
// import { db } from '../db';
// import { User } from '../models/user';

// export const requestPasswordReset = async (c: Context) => {
//   const { email } = await c.req.json();
//   const user = await db.select().from(User).where('email', email).single();
//   if (user) {
//     const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
//       expiresIn: '1h',
//     });
//     await sendResetPasswordEmail(email, token);
//   }
//   return c.json({
//     message: 'If the email is valid, a reset link has been sent',
//   });
// };

// export const resetPassword = async (c: Context) => {
//   const { token, newPassword } = await c.req.json();
//   try {
//     const payload = jwt.verify(token, process.env.JWT_SECRET);
//     const hashedPassword = await bcrypt.hash(newPassword, 10);
//     await db
//       .update(User)
//       .set({ password: hashedPassword })
//       .where('id', payload.id);
//     return c.json({ message: 'Password reset successfully' });
//   } catch (e) {
//     return c.json({ message: 'Invalid or expired token' }, 400);
//   }
// };
