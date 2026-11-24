"use server";

import prisma from "@/lib/db/prisma";
import { getUserId } from "@/lib/db/user";
import { revalidatePath } from "next/cache";
import { NoteType } from "@prisma/client";

/**
 * Create a new note. If communityId is null, it's a personal note.
 */
export async function createNote(data: {
  title: string;
  syllabus?: string;
  content: string;
  type: NoteType;
  communityId?: string | null;
  universityId?: string | null;
  degree?: string | null;
  year?: string | null;
  semester?: string | null;
  subject?: string | null;
  pdfUrl?: string | null;
}) {
  const userId = await getUserId();
  if (!userId) {
    throw new Error("Unauthorized: You must be logged in to create notes.");
  }

  const baseSlug = (data.title || "note")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
  const slug = `${baseSlug || "note"}-${Math.random().toString(36).substring(2, 8)}-${Date.now().toString(36)}`;

  let commId = data.communityId || null;
  let uniId = data.universityId || null;
  let deg = data.degree || null;
  let yr = data.year || null;
  let sem = data.semester || null;

  // Validate communityId if provided
  if (commId) {
    try {
      const comm = await prisma.community.findUnique({
        where: { id: commId },
        select: { id: true, universityId: true, degree: true },
      });
      if (comm) {
        if (!uniId) uniId = comm.universityId;
        if (!deg) deg = comm.degree;
      } else {
        commId = null;
      }
    } catch {
      commId = null;
    }
  }

  // If universityId is not set, try to default from user profile
  if (!uniId) {
    try {
      const profile = await prisma.userProfile.findUnique({
        where: { userId },
      });
      if (profile?.university) {
        const uEntity = await prisma.universityEntity.findFirst({
          where: { name: { equals: profile.university, mode: "insensitive" } },
        });
        if (uEntity) {
          uniId = uEntity.id;
        }
      }
      if (!deg && profile?.degree) deg = profile.degree;
      if (!yr && profile?.year) yr = profile.year;
      if (!sem && profile?.semester) sem = profile.semester;
    } catch {
      // Ignore profile lookup failure
    }
  }

  // Double-check universityId exists in DB to prevent foreign key errors
  if (uniId) {
    try {
      const uExists = await prisma.universityEntity.findUnique({
        where: { id: uniId },
        select: { id: true },
      });
      if (!uExists) {
        uniId = null;
      }
    } catch {
      uniId = null;
    }
  }

  try {
    const newNote = await prisma.noteEntity.create({
      data: {
        title: data.title,
        slug,
        syllabus: data.syllabus || "",
        content: data.content,
        type: data.type || "NOTES",
        pdfUrl: data.pdfUrl || null,
        authorId: userId,
        communityId: commId,
        universityId: uniId,
        degree: deg,
        year: yr,
        semester: sem,
        subject: data.subject || null,
      },
    });

    revalidatePath("/notes");
    revalidatePath("/notes/personal");
    return newNote;
  } catch (err: any) {
    console.error("Failed to create note in database:", err);
    throw new Error(err.message || "Failed to create note. Please check inputs.");
  }
}

/**
 * Update an existing note. Only the author can update their own notes.
 */
export async function updateNote(
  id: string,
  data: {
    title?: string;
    syllabus?: string;
    content?: string;
    type?: NoteType;
    pdfUrl?: string | null;
  }
) {
  const userId = await getUserId();
  if (!userId) {
    throw new Error("Unauthorized: You must be logged in to update notes.");
  }

  // Check ownership
  const existing = await prisma.noteEntity.findUnique({
    where: { id },
    select: { authorId: true },
  });

  if (!existing) {
    throw new Error("Note not found.");
  }

  if (existing.authorId !== userId) {
    throw new Error("Forbidden: You can only edit your own notes.");
  }

  try {
    const updatedNote = await prisma.noteEntity.update({
      where: { id },
      data: {
        title: data.title,
        syllabus: data.syllabus,
        content: data.content,
        type: data.type,
        pdfUrl: data.pdfUrl,
      },
    });

    revalidatePath("/notes");
    revalidatePath("/notes/personal");
    return updatedNote;
  } catch (err: any) {
    console.error("Failed to update note:", err);
    throw new Error(err.message || "Failed to update note.");
  }
}

/**
 * Delete a note. Only the author can delete their notes.
 */
export async function deleteNote(id: string) {
  const userId = await getUserId();
  if (!userId) {
    throw new Error("Unauthorized: You must be logged in to delete notes.");
  }

  // Check ownership
  const existing = await prisma.noteEntity.findUnique({
    where: { id },
    select: { authorId: true },
  });

  if (!existing) {
    throw new Error("Note not found.");
  }

  if (existing.authorId !== userId) {
    throw new Error("Forbidden: You can only delete your own notes.");
  }

  try {
    await prisma.noteEntity.delete({
      where: { id },
    });

    revalidatePath("/notes");
    revalidatePath("/notes/personal");
    return { success: true };
  } catch (err: any) {
    console.error("Failed to delete note:", err);
    throw new Error(err.message || "Failed to delete note.");
  }
}
