CREATE TABLE "orders" (
	"id" serial PRIMARY KEY,
	"checkout_session_id" text UNIQUE,
	"status" text DEFAULT 'pending' NOT NULL,
	"amount" integer NOT NULL,
	"currency" text DEFAULT 'inr' NOT NULL,
	"items" text NOT NULL,
	"customer_name" text,
	"customer_email" text,
	"customer_phone" text,
	"shipping_address" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"paid_at" timestamp
);
