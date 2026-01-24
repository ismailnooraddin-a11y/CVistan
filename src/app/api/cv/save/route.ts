// src/app/api/cv/save/route.ts
// Save CV endpoint

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyToken, extractToken } from '@/lib/auth';
import { z } from 'zod';

const saveCVSchema = z.object({
  cvData: z.object({
    personal: z.object({
      fullName: z.string(),
      jobTitle: z.string(),
      email: z.string(),
      phone: z.string(),
      location: z.string(),
      linkedin: z.string(),
      photo: z.string().nullable(),
    }),
    summary: z.string(),
    experience: z.array(z.any()),
    education: z.array(z.any()),
    skills: z.array(z.string()),
    languages: z.array(z.any()),
  }),
  templateId: z.string(),
  language: z.string().default('en'),
  title: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    const token = extractToken(authHeader);
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    
    // Validate input
    const validation = saveCVSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.errors[0].message },
        { status: 400 }
      );
    }
    
    const { cvData, templateId, language, title } = validation.data;
    
    // Create or update CV
    const cv = await prisma.cV.create({
      data: {
        userId: payload.userId,
        data: cvData,
        templateId,
        language,
        title: title || `CV - ${cvData.personal.fullName || 'Untitled'}`,
      },
    });
    
    return NextResponse.json({
      success: true,
      cvId: cv.id,
    });
  } catch (error) {
    console.error('Save CV error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}

// Get user's CVs
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = extractToken(authHeader);
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }
    
    const cvs = await prisma.cV.findMany({
      where: { userId: payload.userId },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
        templateId: true,
        language: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    
    return NextResponse.json({
      success: true,
      cvs,
    });
  } catch (error) {
    console.error('Get CVs error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}
