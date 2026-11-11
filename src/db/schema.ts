import { pgTable, serial, text, real, integer, timestamp } from "drizzle-orm/pg-core";

export const bmiRecords = pgTable("bmi_records", {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    weight: real("weight").notNull(),
    heightCm: integer("height_cm").notNull(),
    bmiScore: real("bmi_score").notNull(),
    status: text("status").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});
