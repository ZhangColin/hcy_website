import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const VALID_COLLECTIONS = ["home", "news", "about", "cases", "contact", "site", "join"];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ collection: string }> }
) {
  const { collection } = await params;
  if (!VALID_COLLECTIONS.includes(collection)) {
    return NextResponse.json({ error: "Invalid collection" }, { status: 400 });
  }
  try {
    let data;
    switch (collection) {
      case "home":
        data = await prisma.homeContent.findFirst();
        break;
      case "news":
        data = { articles: await prisma.newsArticle.findMany({ orderBy: { date: 'desc' } }) };
        break;
      case "about":
        data = await prisma.aboutContent.findFirst();
        break;
      case "cases":
        const [schools, competitions] = await Promise.all([
          prisma.schoolCase.findMany({ orderBy: { order: 'asc' } }),
          prisma.competitionHonor.findMany({ orderBy: { order: 'asc' } }),
        ]);
        data = { schoolCases: schools, competitionHonors: competitions };
        break;
      case "contact":
        data = await prisma.contactInfo.findFirst();
        break;
      case "join":
        data = { jobPositions: await prisma.jobPosition.findMany({ where: { active: true }, orderBy: { order: 'asc' } }) };
        break;
      case "site":
        data = await prisma.siteConfig.findFirst();
        break;
    }
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to load data" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ collection: string }> }
) {
  const { collection } = await params;
  if (!VALID_COLLECTIONS.includes(collection)) {
    return NextResponse.json({ error: "Invalid collection" }, { status: 400 });
  }
  try {
    const body = await request.json();

    // 单例类型的内容更新
    switch (collection) {
      case "home": {
        const existing = await prisma.homeContent.findFirst();
        if (!existing) {
          return NextResponse.json({ error: "Record not found" }, { status: 404 });
        }
        await prisma.homeContent.update({
          where: { id: existing.id },
          data: body,
        });
        break;
      }
      case "about": {
        const existing = await prisma.aboutContent.findFirst();
        if (!existing) {
          return NextResponse.json({ error: "Record not found" }, { status: 404 });
        }
        await prisma.aboutContent.update({
          where: { id: existing.id },
          data: body,
        });
        break;
      }
      case "contact": {
        const existing = await prisma.contactInfo.findFirst();
        if (!existing) {
          return NextResponse.json({ error: "Record not found" }, { status: 404 });
        }
        await prisma.contactInfo.update({
          where: { id: existing.id },
          data: body,
        });
        break;
      }
      case "site": {
        const existing = await prisma.siteConfig.findFirst();
        if (!existing) {
          return NextResponse.json({ error: "Record not found" }, { status: 404 });
        }
        await prisma.siteConfig.update({
          where: { id: existing.id },
          data: body,
        });
        break;
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save data" }, { status: 500 });
  }
}
