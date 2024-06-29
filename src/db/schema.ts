import { pgTable, text, integer, uuid, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  userId: uuid('userId').primaryKey(),
  firstName: text('firstName'),
  lastName: text('lastName'),
  email: text('email').unique(),
  provider: text('provider').notNull(),
  providerId: text('providerId').unique().notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

export const securities = pgTable('securities', {
  securityId: uuid('securityId').primaryKey(),
  userId: uuid('userId'),
  password: text('password'),
  otp: integer('otp'),
  otpExpiry: integer('otpExpiry'),
  apiKey: text('apiKey').unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

export const tips = pgTable('tips', {
  tipId: uuid('tipId').primaryKey(),
  userId: uuid('userId').notNull(),
  name: text('name').notNull(),
  icon: text('icon').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  friendlyId: text('friendlyId').notNull(),
  walletAddress: text('walletAddress').notNull(),
  status: text('status').default('active'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

export const donations = pgTable('donations', {
  donationId: uuid('donationId').primaryKey(),
  userId: uuid('userId').notNull(),
  name: text('name').notNull(),
  icon: text('icon').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  friendlyId: text('friendlyId').notNull(),
  walletAddress: text('walletAddress').notNull(),
  status: text('status').default('active'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});
