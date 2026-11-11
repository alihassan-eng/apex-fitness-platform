import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { bmiRecords } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";


// 1. ڈیٹا بیس سے تمام ریکارڈز منگوانے کے لیے (GET)
export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const records = await db
            .select()
            .from(bmiRecords)
            .where(eq(bmiRecords.userId, userId))
            .orderBy(desc(bmiRecords.createdAt));

        const formatted = records.map((r) => ({
            id: r.id.toString(),
            weight: r.weight,
            heightCm: r.heightCm,
            bmiScore: r.bmiScore,
            status: r.status,
            createdAt: new Date(r.createdAt).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }),
        }));

        return NextResponse.json({ records: formatted });
    } catch (error) {
        console.error("GET Error:", error);
        return NextResponse.json({ records: [] }, { status: 500 });
    }
}

// 2. نیا ریکارڈ کلاؤڈ ڈیٹا بیس میں محفوظ کرنے کے لیے (POST)
export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { weight, heightCm, bmiScore, status } = await req.json();

        const [inserted] = await db
            .insert(bmiRecords)
            .values({ userId, weight, heightCm, bmiScore, status })
            .returning();

        const record = {
            id: inserted.id.toString(),
            weight: inserted.weight,
            heightCm: inserted.heightCm,
            bmiScore: inserted.bmiScore,
            status: inserted.status,
            createdAt: new Date(inserted.createdAt).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }),
        };

        return NextResponse.json({ success: true, record });
    } catch (error) {
        console.error("POST Error:", error);
        return NextResponse.json({ error: "Failed to save" }, { status: 500 });
    }
}

// 3. ریکارڈ کا وزن ڈیٹا بیس میں اپڈیٹ کرنے کے لیے (PUT)
export async function PUT(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { id, newWeight } = await req.json();
        const numericId = Number(id);

        const [existing] = await db
            .select()
            .from(bmiRecords)
            .where(and(eq(bmiRecords.id, numericId), eq(bmiRecords.userId, userId)));

        if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

        const heightMeters = existing.heightCm / 100;
        const newBmi = Math.round((newWeight / (heightMeters * heightMeters)) * 10) / 10;

        let newStatus = "OPTIMAL SPECTRUM";
        if (newBmi < 18.5) newStatus = "UNDERWEIGHT";
        else if (newBmi >= 25 && newBmi < 29.9) newStatus = "OVERWEIGHT";
        else if (newBmi >= 30) newStatus = "HIGH THRESHOLD ALERT";

        const [updated] = await db
            .update(bmiRecords)
            .set({ weight: newWeight, bmiScore: newBmi, status: newStatus })
            .where(and(eq(bmiRecords.id, numericId), eq(bmiRecords.userId, userId)))
            .returning();

        const record = {
            id: updated.id.toString(),
            weight: updated.weight,
            heightCm: updated.heightCm,
            bmiScore: updated.bmiScore,
            status: updated.status,
            createdAt: new Date(updated.createdAt).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }),
        };

        return NextResponse.json({ success: true, record });
    } catch (error) {
        console.error("PUT Error:", error);
        return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }
}

// 4. ڈیٹا بیس سے ریکارڈ مستقل ڈیلیٹ کرنے کے لیے (DELETE)
export async function DELETE(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const recordId = Number(searchParams.get("id"));

        if (!recordId) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

        await db
            .delete(bmiRecords)
            .where(and(eq(bmiRecords.id, recordId), eq(bmiRecords.userId, userId)));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE Error:", error);
        return NextResponse.json({ error: "Delete failed" }, { status: 500 });
    }
}
