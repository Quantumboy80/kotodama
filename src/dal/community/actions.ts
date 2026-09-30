"use server";

import prisma from "@/lib/db/prisma";
import { getUserId } from "@/lib/db/user";
import { revalidatePath } from "next/cache";

/**
 * Register a new university.
 */
export async function registerUniversity(name: string, label: string) {
  const userId = await getUserId();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const normalizedName = name.trim().toLowerCase().replace(/\s+/g, "-");

  const existing = await prisma.universityEntity.findUnique({
    where: { name: normalizedName },
  });

  if (existing) {
    return existing;
  }

  const university = await prisma.universityEntity.create({
    data: {
      name: normalizedName,
      label: label.trim(),
    },
  });

  revalidatePath("/notes");
  return university;
}

/**
 * Create a new community for a degree/stream inside a university.
 * Creator automatically joins the community with role "CREATOR".
 */
export async function createCommunity(data: {
  name: string;
  degree: string;
  universityId: string;
  description?: string;
}) {
  const userId = await getUserId();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const normalizedDegree = data.degree.trim().toUpperCase().replace(/\s+/g, "_");

  // Check if community already exists
  const existing = await prisma.community.findFirst({
    where: {
      universityId: data.universityId,
      degree: normalizedDegree,
    },
  });

  if (existing) {
    // Automatically join if not already a member
    const membership = await prisma.communityMember.findUnique({
      where: {
        communityId_userId: {
          communityId: existing.id,
          userId,
        },
      },
    });

    if (!membership) {
      await prisma.communityMember.create({
        data: {
          communityId: existing.id,
          userId,
          role: "MEMBER",
        },
      });
    }

    return existing;
  }

  // Create community and creator membership in a transaction
  const community = await prisma.$transaction(async (tx) => {
    const comm = await tx.community.create({
      data: {
        name: data.name.trim(),
        degree: normalizedDegree,
        universityId: data.universityId,
        description: data.description || "",
      },
    });

    await tx.communityMember.create({
      data: {
        communityId: comm.id,
        userId,
        role: "CREATOR",
      },
    });

    return comm;
  });

  revalidatePath("/notes");
  return community;
}

/**
 * Join a community.
 */
export async function joinCommunity(communityId: string) {
  const userId = await getUserId();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const existingMember = await prisma.communityMember.findUnique({
    where: {
      communityId_userId: {
        communityId,
        userId,
      },
    },
  });

  if (existingMember) {
    return existingMember;
  }

  const membership = await prisma.communityMember.create({
    data: {
      communityId,
      userId,
      role: "MEMBER",
    },
  });

  revalidatePath("/notes");
  return membership;
}

/**
 * Get all communities joined by the current user.
 */
export async function getUserJoinedCommunities() {
  const userId = await getUserId();
  if (!userId) return [];

  const memberships = await prisma.communityMember.findMany({
    where: { userId },
    include: {
      community: {
        include: {
          university: true,
        },
      },
    },
  });

  return memberships.map((m) => m.community);
}

/**
 * Leave a community.
 */
export async function leaveCommunity(communityId: string) {
  const userId = await getUserId();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  await prisma.communityMember.deleteMany({
    where: {
      communityId,
      userId,
    },
  });

  revalidatePath("/notes");
  revalidatePath("/notes/communities");
  return { success: true };
}

/**
 * Get all registered universities with community count and member count.
 * If database is empty, automatically ensures top Indian universities are pre-populated.
 */
export async function getAllUniversities() {
  let universities = await prisma.universityEntity.findMany({
    include: {
      _count: {
        select: {
          communities: true,
          notes: true,
        },
      },
    },
    orderBy: { label: "asc" },
  });

  if (universities.length === 0) {
    await seedDefaultIndianUniversities();
    universities = await prisma.universityEntity.findMany({
      include: {
        _count: {
          select: {
            communities: true,
            notes: true,
          },
        },
      },
      orderBy: { label: "asc" },
    });
  }

  return universities;
}

/**
 * Get all communities across all universities with members and notes counts.
 */
export async function getAllCommunitiesWithStats() {
  // Ensure default universities exist first
  const count = await prisma.universityEntity.count();
  if (count === 0) {
    await seedDefaultIndianUniversities();
  }

  return await prisma.community.findMany({
    include: {
      university: true,
      _count: {
        select: { members: true, notes: true },
      },
    },
    orderBy: [{ university: { label: "asc" } }, { name: "asc" }],
  });
}

/**
 * Get all communities under a university.
 */
export async function getCommunitiesByUniversity(universityId: string) {
  return await prisma.community.findMany({
    where: { universityId },
    include: {
      university: true,
      _count: {
        select: { members: true, notes: true },
      },
    },
    orderBy: { name: "asc" },
  });
}

/**
 * Seed initial Indian Universities and default communities
 */
export async function seedDefaultIndianUniversities() {
  const defaultUnis = [
    { name: "medicaps", label: "Medicaps University, Indore" },
    { name: "ips", label: "IPS Academy, Indore" },
    { name: "iit-bombay", label: "IIT Bombay (Indian Institute of Technology)" },
    { name: "iit-delhi", label: "IIT Delhi (Indian Institute of Technology)" },
    { name: "iit-madras", label: "IIT Madras (Indian Institute of Technology)" },
    { name: "iit-kharagpur", label: "IIT Kharagpur (Indian Institute of Technology)" },
    { name: "nit-trichy", label: "NIT Trichy (National Institute of Technology)" },
    { name: "nit-surathkal", label: "NIT Surathkal (National Institute of Technology Karnataka)" },
    { name: "bits-pilani", label: "BITS Pilani (Birla Institute of Technology and Science)" },
    { name: "delhi-university", label: "Delhi University (DU)" },
    { name: "sppu", label: "Savitribai Phule Pune University (SPPU)" },
    { name: "mumbai-university", label: "University of Mumbai" },
    { name: "vtu", label: "Visvesvaraya Technological University (VTU Karnataka)" },
    { name: "anna-university", label: "Anna University, Chennai" },
    { name: "aktu", label: "Dr. A.P.J. Abdul Kalam Technical University (AKTU UP)" },
    { name: "rgpv", label: "Rajiv Gandhi Proudyogiki Vishwavidyalaya (RGPV Bhopal)" },
    { name: "jadavpur-university", label: "Jadavpur University, Kolkata" },
    { name: "calcutta-university", label: "University of Calcutta" },
    { name: "makaut", label: "Maulana Abul Kalam Azad University of Technology (MAKAUT WB)" },
    { name: "srm-university", label: "SRM Institute of Science and Technology" },
    { name: "vit-vellore", label: "Vellore Institute of Technology (VIT Vellore)" },
    { name: "manipal-university", label: "Manipal Academy of Higher Education (MAHE)" },
    { name: "amity-university", label: "Amity University" },
    { name: "thapar-university", label: "Thapar Institute of Engineering and Technology, Patiala" },
    { name: "chandigarh-university", label: "Chandigarh University (CU)" },
  ];

  for (const uni of defaultUnis) {
    const created = await prisma.universityEntity.upsert({
      where: { name: uni.name },
      update: { label: uni.label },
      create: { name: uni.name, label: uni.label },
    });

    // Create default community for B.Tech CSE & B.Tech IT under each
    await prisma.community.upsert({
      where: {
        universityId_degree: {
          universityId: created.id,
          degree: "BTECH_CSE",
        },
      },
      update: {},
      create: {
        name: "B.Tech CSE",
        degree: "BTECH_CSE",
        universityId: created.id,
        description: `Official study and discussion community for B.Tech Computer Science at ${uni.label}`,
      },
    });

    await prisma.community.upsert({
      where: {
        universityId_degree: {
          universityId: created.id,
          degree: "BTECH_IT",
        },
      },
      update: {},
      create: {
        name: "B.Tech IT",
        degree: "BTECH_IT",
        universityId: created.id,
        description: `Official study and discussion community for B.Tech Information Technology at ${uni.label}`,
      },
    });
  }
}
