CREATE TYPE "public"."material_type" AS ENUM('book', 'course', 'docs', 'tool');--> statement-breakpoint
CREATE TYPE "public"."question_area" AS ENUM('frontend', 'backend', 'devops', 'testing', 'database', 'softskills', 'general');--> statement-breakpoint
CREATE TYPE "public"."question_difficulty" AS ENUM('junior', 'mid', 'senior');--> statement-breakpoint
CREATE TYPE "public"."skill_item_priority" AS ENUM('low', 'medium', 'high');--> statement-breakpoint
CREATE TYPE "public"."task_category" AS ENUM('activities', 'work', 'learning', 'general');--> statement-breakpoint
CREATE TYPE "public"."task_priority" AS ENUM('low', 'medium', 'high');--> statement-breakpoint
CREATE TYPE "public"."task_status" AS ENUM('todo', 'in-progress', 'done');--> statement-breakpoint
CREATE TABLE "agents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"role" text,
	"system_prompt" text NOT NULL,
	"tools" text[] DEFAULT '{}',
	"model" text,
	"temperature" real DEFAULT 0.7,
	"status" text DEFAULT 'draft',
	"category" text DEFAULT '',
	"tags" text[] DEFAULT '{}',
	"slug" text DEFAULT '',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "components" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"category" text,
	"tags" text[] DEFAULT '{}',
	"slug" text DEFAULT '',
	"code" text NOT NULL,
	"dependencies" text[] DEFAULT '{}',
	"favorite" boolean DEFAULT false,
	"usage_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "prompts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"category" text,
	"tags" text[] DEFAULT '{}',
	"slug" text DEFAULT '',
	"body" text NOT NULL,
	"variables" text[] DEFAULT '{}',
	"model" text,
	"favorite" boolean DEFAULT false,
	"usage_count" integer DEFAULT 0,
	"versions" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "snippets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"language" text NOT NULL,
	"description" text,
	"code" text NOT NULL,
	"category" text DEFAULT '',
	"tags" text[] DEFAULT '{}',
	"slug" text DEFAULT '',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"stack" text[] DEFAULT '{}',
	"category" text DEFAULT '',
	"tags" text[] DEFAULT '{}',
	"slug" text DEFAULT '',
	"structure" text,
	"notes" text,
	"files" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "connectors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"type" text NOT NULL,
	"name" text NOT NULL,
	"email" text,
	"phone" text,
	"notes" text,
	"category" text DEFAULT '',
	"tags" text[] DEFAULT '{}',
	"slug" text DEFAULT '',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "mail_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"channel" text NOT NULL,
	"subject" text,
	"content" text NOT NULL,
	"category" text DEFAULT '',
	"tags" text[] DEFAULT '{}',
	"slug" text DEFAULT '',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "social_drafts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"platform" text NOT NULL,
	"content" text NOT NULL,
	"media_urls" text[] DEFAULT '{}',
	"category" text DEFAULT '',
	"tags" text[] DEFAULT '{}',
	"slug" text DEFAULT '',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "freelance_offers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"client" text DEFAULT '',
	"platform" text DEFAULT '',
	"budget" text DEFAULT '',
	"currency" text DEFAULT 'USD',
	"status" text DEFAULT 'new',
	"description" text DEFAULT '',
	"url" text DEFAULT '',
	"deadline" text DEFAULT '',
	"category" text DEFAULT '',
	"tags" text[] DEFAULT '{}',
	"slug" text DEFAULT '',
	"notes" text DEFAULT '',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "my_services" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"platform" text DEFAULT '',
	"url" text DEFAULT '',
	"category" text DEFAULT '',
	"price" text DEFAULT '',
	"currency" text DEFAULT 'USD',
	"status" text DEFAULT 'active',
	"description" text DEFAULT '',
	"delivery_days" integer DEFAULT 3,
	"tags" text[] DEFAULT '{}',
	"slug" text DEFAULT '',
	"notes" text DEFAULT '',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "saved_jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"company" text DEFAULT '',
	"location" text DEFAULT '',
	"url" text DEFAULT '',
	"platform" text DEFAULT '',
	"status" text DEFAULT 'saved',
	"salary" text DEFAULT '',
	"remote" boolean DEFAULT false,
	"category" text DEFAULT '',
	"tags" text[] DEFAULT '{}',
	"slug" text DEFAULT '',
	"notes" text DEFAULT '',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "interview_questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text,
	"question" text NOT NULL,
	"answer" text NOT NULL,
	"difficulty" "question_difficulty" DEFAULT 'mid',
	"area" "question_area" NOT NULL,
	"tags" text[] DEFAULT '{}',
	"category" text,
	"slug" text DEFAULT '',
	"favorite" boolean DEFAULT false,
	"answer_depths" jsonb DEFAULT '[]'::jsonb,
	"is_global" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "materials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"area_id" text NOT NULL,
	"title" text NOT NULL,
	"author" text,
	"url" text NOT NULL,
	"desc" text NOT NULL,
	"type" "material_type" NOT NULL,
	"free" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "skill_projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"area_id" text NOT NULL,
	"title" text NOT NULL,
	"desc" text DEFAULT '',
	"url" text DEFAULT '',
	"tags" text[] DEFAULT '{}',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "skill_tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"area_id" text NOT NULL,
	"title" text NOT NULL,
	"notes" text DEFAULT '',
	"done" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_progress" (
	"user_id" text NOT NULL,
	"item_id" text NOT NULL,
	"area_id" text NOT NULL,
	"completed" boolean DEFAULT true,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_progress_user_id_item_id_pk" PRIMARY KEY("user_id","item_id")
);
--> statement-breakpoint
CREATE TABLE "user_profiles" (
	"user_id" text PRIMARY KEY NOT NULL,
	"display_name" text,
	"avatar_url" text,
	"location" text,
	"deleted_at" timestamp,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "auth_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text,
	"password_hash" text,
	"google_id" text,
	"display_name" text,
	"avatar_url" text,
	"is_verified" boolean DEFAULT false NOT NULL,
	"verification_token" text,
	"verification_token_expires" timestamp,
	"deleted_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "auth_users_email_unique" UNIQUE("email"),
	CONSTRAINT "auth_users_google_id_unique" UNIQUE("google_id")
);
--> statement-breakpoint
CREATE TABLE "cv_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"title" text DEFAULT 'My CV' NOT NULL,
	"focus" text DEFAULT 'general' NOT NULL,
	"personal_info" text DEFAULT '{}' NOT NULL,
	"summary" text DEFAULT '' NOT NULL,
	"experience" text DEFAULT '[]' NOT NULL,
	"skills" text DEFAULT '{}' NOT NULL,
	"education" text DEFAULT '[]' NOT NULL,
	"projects" text DEFAULT '[]' NOT NULL,
	"languages" text DEFAULT '[]' NOT NULL,
	"category" text DEFAULT '',
	"tags" text[] DEFAULT '{}',
	"slug" text DEFAULT '',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "planner_tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"date" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"priority" "task_priority" DEFAULT 'medium',
	"status" "task_status" DEFAULT 'todo',
	"category" "task_category" DEFAULT 'general',
	"order" integer DEFAULT 0,
	"estimated_minutes" integer,
	"tags" text[] DEFAULT '{}',
	"slug" text DEFAULT '',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "conversations" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"conversation_id" integer NOT NULL,
	"role" text NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "activity_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"action" text NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" uuid,
	"entity_name" text,
	"metadata" jsonb,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"type" text NOT NULL,
	"title" text NOT NULL,
	"body" text,
	"entity_type" text,
	"entity_id" uuid,
	"action_url" text,
	"is_read" boolean DEFAULT false NOT NULL,
	"read_at" timestamp,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "agents_user_id_idx" ON "agents" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "components_user_id_idx" ON "components" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "prompts_user_id_idx" ON "prompts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "snippets_user_id_idx" ON "snippets" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "templates_user_id_idx" ON "templates" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "connectors_user_id_idx" ON "connectors" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "mail_templates_user_id_idx" ON "mail_templates" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "social_drafts_user_id_idx" ON "social_drafts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "freelance_offers_user_id_idx" ON "freelance_offers" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "my_services_user_id_idx" ON "my_services" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "saved_jobs_user_id_idx" ON "saved_jobs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "interview_questions_user_id_idx" ON "interview_questions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "interview_questions_is_global_idx" ON "interview_questions" USING btree ("is_global");--> statement-breakpoint
CREATE INDEX "materials_area_id_idx" ON "materials" USING btree ("area_id");--> statement-breakpoint
CREATE INDEX "materials_type_idx" ON "materials" USING btree ("type");--> statement-breakpoint
CREATE INDEX "skill_projects_user_area_idx" ON "skill_projects" USING btree ("user_id","area_id");--> statement-breakpoint
CREATE INDEX "skill_tasks_user_area_idx" ON "skill_tasks" USING btree ("user_id","area_id");--> statement-breakpoint
CREATE INDEX "user_progress_user_id_idx" ON "user_progress" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "auth_users_email_idx" ON "auth_users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "auth_users_google_id_idx" ON "auth_users" USING btree ("google_id");--> statement-breakpoint
CREATE INDEX "cv_profiles_user_id_idx" ON "cv_profiles" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "planner_tasks_user_date_idx" ON "planner_tasks" USING btree ("user_id","date");--> statement-breakpoint
CREATE INDEX "idx_activity_logs_user_created" ON "activity_logs" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "idx_activity_logs_entity" ON "activity_logs" USING btree ("entity_type","entity_id");--> statement-breakpoint
CREATE INDEX "idx_activity_logs_user_action" ON "activity_logs" USING btree ("user_id","action");--> statement-breakpoint
CREATE INDEX "idx_activity_logs_user_entity_type" ON "activity_logs" USING btree ("user_id","entity_type");--> statement-breakpoint
CREATE INDEX "idx_activity_logs_created_at" ON "activity_logs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_notifications_user_unread" ON "notifications" USING btree ("user_id","is_read");--> statement-breakpoint
CREATE INDEX "idx_notifications_user_created" ON "notifications" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "idx_notifications_user_type" ON "notifications" USING btree ("user_id","type");--> statement-breakpoint
CREATE INDEX "idx_notifications_entity" ON "notifications" USING btree ("entity_type","entity_id");--> statement-breakpoint
CREATE INDEX "idx_notifications_read_created" ON "notifications" USING btree ("is_read","created_at");