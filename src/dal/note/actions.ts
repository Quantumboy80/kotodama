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

  const baseSlug = data.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
  const slug = `${baseSlug || "note"}-${Math.random().toString(36).substring(2, 8)}`;

  let uniId = data.universityId || null;
  let deg = data.degree || null;
  let yr = data.year || null;
  let sem = data.semester || null;

  // If universityId is not set (e.g. personal note), try to default from user profile
  if (!uniId) {
    try {
      const profile = await prisma.userProfile.findUnique({
        where: { userId },
      });
      if (profile?.university) {
        // Find corresponding university entity
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

  const newNote = await prisma.noteEntity.create({
    data: {
      title: data.title,
      slug,
      syllabus: data.syllabus || "",
      content: data.content,
      type: data.type,
      pdfUrl: data.pdfUrl || null,
      authorId: userId,
      communityId: data.communityId || null,
      universityId: uniId,
      degree: deg,
      year: yr,
      semester: sem,
      subject: data.subject || null,
    },
  });

  revalidatePath("/notes");
  return newNote;
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
  return updatedNote;
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

  await prisma.noteEntity.delete({
    where: { id },
  });

  revalidatePath("/notes");
  return { success: true };
}
