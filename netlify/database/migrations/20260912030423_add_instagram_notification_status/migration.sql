ALTER TABLE "orders" ADD COLUMN "instagram_notification_status" text DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "instagram_notified_at" timestamp;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "instagram_notification_error" text;