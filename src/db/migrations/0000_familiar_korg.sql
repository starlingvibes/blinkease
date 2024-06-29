CREATE TABLE IF NOT EXISTS "donations" (
	"id" uuid PRIMARY KEY NOT NULL,
	"userId" uuid,
	"name" text,
	"icon" text,
	"title" text,
	"description" text,
	"walletAddress" text,
	"status" text,
	"createdAt" date,
	"updatedAt" date
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "securities" (
	"id" uuid PRIMARY KEY NOT NULL,
	"userId" uuid,
	"password" text,
	"otp" integer,
	"otpExpiry" integer,
	"apiKey" text,
	"createdAt" date,
	"updatedAt" date,
	CONSTRAINT "securities_apiKey_unique" UNIQUE("apiKey")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tips" (
	"id" uuid PRIMARY KEY NOT NULL,
	"userId" uuid,
	"name" text,
	"icon" text,
	"title" text,
	"description" text,
	"walletAddress" text,
	"status" text,
	"createdAt" date,
	"updatedAt" date
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"firstName" text,
	"lastName" text,
	"email" text,
	"provider" text,
	"providerId" text,
	"createdAt" date,
	"updatedAt" date,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_providerId_unique" UNIQUE("providerId")
);
