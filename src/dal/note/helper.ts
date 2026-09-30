import prisma from "@/lib/db/prisma";
import { unstable_cache } from "next/cache";
import { cache } from "react";

// Helper to parse markdown links [text](url) inside a paragraph and convert them into Portable Text spans and markDefs
function parseParagraphWithLinks(text: string, keyPrefix: string) {
  const children: any[] = [];
  const markDefs: any[] = [];
  const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
  
  let lastIndex = 0;
  let match;
  let linkCount = 0;
  
  while ((match = linkRegex.exec(text)) !== null) {
    const matchIndex = match.index;
    const linkText = match[1];
    const linkUrl = match[2];
    
    if (matchIndex > lastIndex) {
      children.push({
        _type: "span",
        _key: `${keyPrefix}-span-${children.length}`,
        text: text.slice(lastIndex, matchIndex),
        marks: []
      });
    }
    
    const linkKey = `link-${keyPrefix}-${linkCount++}`;
    markDefs.push({
      _key: linkKey,
      _type: "link",
      href: linkUrl
    });
    
    children.push({
      _type: "span",
      _key: `${keyPrefix}-span-${children.length}`,
      text: linkText,
      marks: [linkKey]
    });
    
    lastIndex = linkRegex.lastIndex;
  }
  
  if (lastIndex < text.length) {
    children.push({
      _type: "span",
      _key: `${keyPrefix}-span-${children.length}`,
      text: text.slice(lastIndex),
      marks: []
    });
  }
  
  if (children.length === 0) {
    children.push({
      _type: "span",
      _key: `${keyPrefix}-span-0`,
      text: text,
      marks: []
    });
  }
  
  return { children, markDefs };
}

// Helper to convert plain text or basic markdown headers/paragraphs to Sanity Portable Text structure on the fly
function textToPortableText(text: string) {
  if (!text) return [];

  // If it's already a JSON array (portable text format), parse it
  if (text.trim().startsWith("[") && text.trim().endsWith("]")) {
    try {
      return JSON.parse(text);
    } catch {
      // Fallback
    }
  }

  // Split by newlines to avoid headings grouping with text due to single newlines
  const lines = text.split(/\r?\n/);
  const blocks: any[] = [];

  lines.forEach((line, i) => {
    const trimmed = line.trim();
    if (!trimmed) return; // Skip empty lines

    // 1. YouTube Video Embed Check (supports prefix "Video :" or just the URL)
    const ytMatch = trimmed.match(/^(?:Video\s*:\s*)?(https?:\/\/(?:www\.)?(?:youtube\.com|youtu\.be)\/[^\s]+)$/i);
    if (ytMatch) {
      blocks.push({
        _type: "youtube",
        _key: `yt-${i}`,
        url: ytMatch[1]
      });
      return;
    }

    // 2. Image Embed Check (supports prefix "Image :" or just the URL)
    const imgMatch = trimmed.match(/^(?:Image\s*:\s*)?(https?:\/\/[^\s]+?\.(?:png|jpe?g|gif|webp|svg)(?:\?[^\s]*)?)$/i);
    if (imgMatch) {
      blocks.push({
        _type: "plainImage",
        _key: `img-${i}`,
        url: imgMatch[1],
        alt: "Note Image"
      });
      return;
    }

    // 3. Heading Checks (supports zero or more spaces after hashes)
    const h4Match = trimmed.match(/^####\s*(.+)/);
    if (h4Match) {
      blocks.push({
        _type: "block",
        style: "h4",
        _key: `h4-${i}`,
        children: [{ _type: "span", text: h4Match[1], marks: [] }]
      });
      return;
    }

    const h3Match = trimmed.match(/^###\s*(.+)/);
    if (h3Match) {
      blocks.push({
        _type: "block",
        style: "h3",
        _key: `h3-${i}`,
        children: [{ _type: "span", text: h3Match[1], marks: [] }]
      });
      return;
    }

    const h2Match = trimmed.match(/^##\s*(.+)/);
    if (h2Match) {
      blocks.push({
        _type: "block",
        style: "h2",
        _key: `h2-${i}`,
        children: [{ _type: "span", text: h2Match[1], marks: [] }]
      });
      return;
    }

    const h1Match = trimmed.match(/^#\s*(.+)/);
    if (h1Match) {
      blocks.push({
        _type: "block",
        style: "h1",
        _key: `h1-${i}`,
        children: [{ _type: "span", text: h1Match[1], marks: [] }]
      });
      return;
    }

    // 4. Default Paragraph (with markdown link support)
    const { children, markDefs } = parseParagraphWithLinks(trimmed, `p-${i}`);
    blocks.push({
      _type: "block",
      style: "normal",
      _key: `p-${i}`,
      children,
      markDefs
    });
  });

  return blocks;
}

// Map PostgreSQL Db models to the frontend's expected format (which matches the Sanity schema)
function mapDbNoteToSanityNote(note: any) {
  if (!note) return null;
  return {
    _id: note.id,
    _createdAt: note.createdAt.toISOString(),
    title: note.title,
    syllabus: note.syllabus || "",
    slug: { current: note.slug },
    university: note.university?.name || null,
    universityLabel: note.university?.label || null,
    degree: note.degree,
    year: note.year,
    semester: note.semester,
    subject: note.subject,
    type: note.type,
    isPremium: note.isPremium,
    tier: note.tier,
    content: textToPortableText(note.content),
    pdfUrl: note.pdfUrl || null,
    author: note.author ? {
      id: note.author.id,
      name: note.author.name,
      image: note.author.image,
    } : null,
    communityId: note.communityId,
  };
}

export const getNoteBySlug = async (slug: string) => {
  const note = await prisma.noteEntity.findUnique({
    where: { slug },
    include: {
      university: true,
      author: true,
    },
  });

  const mapped = mapDbNoteToSanityNote(note);
  if (!mapped) return null;
  
  // Extract headings for Table of Contents
  const headings = mapped.content.filter((b: any) =>
    ["h2", "h3", "h4", "h5", "h6"].includes(b.style)
  );

  return {
    ...mapped,
    headings,
  };
};

// Get all available subjects based on filters
export const getAvailableSubjects = cache(
  async (filters: {
    university?: string;
    degree?: string;
    year?: string;
    semester?: string;
  }) => {
    const where: any = {};
    
    if (filters.university && filters.university !== "all") {
      where.university = {
        name: filters.university,
      };
    }
    if (filters.degree && filters.degree !== "all") {
      where.degree = filters.degree;
    }
    if (filters.year && filters.year !== "all") {
      where.year = filters.year;
    }
    if (filters.semester && filters.semester !== "all") {
      where.semester = filters.semester;
    }
    
    where.subject = { not: null };

    const notes = await prisma.noteEntity.findMany({
      where,
      select: { subject: true },
      distinct: ["subject"],
    });

    return notes
      .filter(n => n.subject)
      .map(n => ({ subject: n.subject }));
  }
);

// Get total count of notes matching filters
export const getNotesCount = async (filters: {
  search?: string;
  university?: string;
  degree?: string;
  year?: string;
  semester?: string;
  subject?: string;
  premium?: string;
  type?: string;
}) => {
  const where: any = {};

  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: "insensitive" } },
      { syllabus: { contains: filters.search, mode: "insensitive" } },
      { subject: { contains: filters.search, mode: "insensitive" } },
    ];
  }
  if (filters.university && filters.university !== "all") {
    where.university = {
      name: filters.university,
    };
  }
  if (filters.degree && filters.degree !== "all") {
    where.degree = filters.degree;
  }
  if (filters.year && filters.year !== "all") {
    where.year = filters.year;
  }
  if (filters.semester && filters.semester !== "all") {
    where.semester = filters.semester;
  }
  if (filters.subject && filters.subject !== "all") {
    where.subject = { equals: filters.subject, mode: "insensitive" };
  }
  if (filters.type && filters.type !== "all") {
    where.type = filters.type.toUpperCase() as any;
  }

  return await prisma.noteEntity.count({ where });
};

export const getFilteredNotes = async (
  filters: {
    search?: string;
    university?: string;
    degree?: string;
    year?: string;
    semester?: string;
    subject?: string;
    premium?: string;
    type?: string;
  },
  cursor?: {
    lastTitle?: string;
    lastId?: string;
  }
) => {
  const where: any = {};

  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: "insensitive" } },
      { syllabus: { contains: filters.search, mode: "insensitive" } },
      { subject: { contains: filters.search, mode: "insensitive" } },
    ];
  }
  if (filters.university && filters.university !== "all") {
    where.university = {
      name: filters.university,
    };
  }
  if (filters.degree && filters.degree !== "all") {
    where.degree = filters.degree;
  }
  if (filters.year && filters.year !== "all") {
    where.year = filters.year;
  }
  if (filters.semester && filters.semester !== "all") {
    where.semester = filters.semester;
  }
  if (filters.subject && filters.subject !== "all") {
    where.subject = { equals: filters.subject, mode: "insensitive" };
  }
  if (filters.type && filters.type !== "all") {
    where.type = filters.type.toUpperCase() as any;
  }

  // Cursor pagination
  if (cursor?.lastTitle && cursor?.lastId) {
    where.OR = [
      { title: { gt: cursor.lastTitle } },
      { AND: [{ title: cursor.lastTitle }, { id: { gt: cursor.lastId } }] }
    ];
  }

  const dbNotes = await prisma.noteEntity.findMany({
    where,
    include: {
      university: true,
      author: true,
    },
    orderBy: [
      { title: "asc" },
      { id: "asc" },
    ],
    take: 6,
  });

  return dbNotes.map(mapDbNoteToSanityNote).filter((n): n is NonNullable<typeof n> => Boolean(n));
};

/**
 * Get all notes authored by a specific user (Personal notes dashboard).
 */
export async function getNotesByAuthor(authorId: string) {
  const notes = await prisma.noteEntity.findMany({
    where: { authorId },
    include: {
      university: true,
      community: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  return notes.map(mapDbNoteToSanityNote).filter((n): n is NonNullable<typeof n> => Boolean(n));
}
