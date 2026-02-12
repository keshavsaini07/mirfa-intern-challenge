CREATE TYPE "public"."algorithm" AS ENUM('AES-256-GCM');--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" uuid PRIMARY KEY NOT NULL,
	"party_id" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"payload_nonce" text NOT NULL,
	"payload_ct" text NOT NULL,
	"payload_tag" text NOT NULL,
	"dek_wrap_nonce" text NOT NULL,
	"dek_wrapped" text NOT NULL,
	"dek_wrap_tag" text NOT NULL,
	"alg" "algorithm" NOT NULL,
	"mk_version" integer NOT NULL
);
