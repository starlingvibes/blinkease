CREATE TABLE IF NOT EXISTS "donations" (
	"donationId" uuid PRIMARY KEY NOT NULL,
	"userId" uuid NOT NULL,
	"name" text NOT NULL,
	"icon" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"friendlyId" text NOT NULL,
	"walletAddress" text NOT NULL,
	"status" text DEFAULT 'active',
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "securities" (
	"securityId" uuid PRIMARY KEY NOT NULL,
	"userId" uuid,
	"password" text,
	"otp" integer,
	"otpExpiry" integer,
	"apiKey" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "securities_apiKey_unique" UNIQUE("apiKey")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tips" (
	"tipId" uuid PRIMARY KEY NOT NULL,
	"userId" uuid NOT NULL,
	"name" text NOT NULL,
	"icon" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"friendlyId" text NOT NULL,
	"walletAddress" text NOT NULL,
	"status" text DEFAULT 'active',
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"userId" uuid PRIMARY KEY NOT NULL,
	"firstName" text,
	"lastName" text,
	"email" text,
	"provider" text NOT NULL,
	"providerId" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_providerId_unique" UNIQUE("providerId")
);
