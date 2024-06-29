import { pgTable, text, integer, uuid, date } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  userId: uuid('id').primaryKey(),
  firstName: text('firstName'),
  lastName: text('lastName'),
  email: text('email').unique(),
  provider: text('provider'),
  providerId: text('providerId').unique(),
  createdAt: date('createdAt'),
  updatedAt: date('updatedAt'),
});

export const securities = pgTable('securities', {
  securityId: uuid('id').primaryKey(),
  userId: uuid('userId'),
  password: text('password'),
  otp: integer('otp'),
  otpExpiry: integer('otpExpiry'),
  apiKey: text('apiKey').unique(),
  createdAt: date('createdAt'),
  updatedAt: date('updatedAt'),
});

export const tips = pgTable('tips', {
  tipId: uuid('id').primaryKey(),
  userId: uuid('userId'),
  name: text('name'),
  icon: text('icon'),
  title: text('title'),
  description: text('description'),
  walletAddress: text('walletAddress'),
  status: text('status'),
  createdAt: date('createdAt'),
  updatedAt: date('updatedAt'),
});

export const donations = pgTable('donations', {
  donationId: uuid('id').primaryKey(),
  userId: uuid('userId'),
  name: text('name'),
  icon: text('icon'),
  title: text('title'),
  description: text('description'),
  walletAddress: text('walletAddress'),
  status: text('status'),
  createdAt: date('createdAt'),
  updatedAt: date('updatedAt'),
});
