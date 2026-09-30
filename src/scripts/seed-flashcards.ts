import { PrismaClient, University, Degree, Year, Semester } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Cleaning up old flashcard sets...");
  await prisma.flashcardVisit.deleteMany();
  await prisma.flashcardItem.deleteMany();
  await prisma.flashcardSet.deleteMany();

  console.log("Seeding new interactive flashcard sets...");

  // Set 1: Data Structures & Algorithms
  const dsaSet = await prisma.flashcardSet.create({
    data: {
      title: "Data Structures & Algorithms (DSA) Core Concepts",
      description: "Quick revision deck covering essential data structures, algorithm complexities, and paradigms.",
      subject: "Data Structures & Algorithms",
      university: University.MEDICAPS,
      degree: Degree.BTECH_CSE,
      year: Year.SECOND_YEAR,
      semester: Semester.THIRD_SEMESTER,
      isActive: true,
      isPublished: true,
      isPremium: false,
      cards: {
        create: [
          {
            front: "What is the time complexity of searching in a Balanced Binary Search Tree (like AVL tree)?",
            back: "O(log n) in both average and worst cases because the tree height is mathematically guaranteed to remain balanced.",
            order: 1,
          },
          {
            front: "Explain the core operational difference between a Stack and a Queue.",
            back: "Stack is LIFO (Last-In, First-Out): elements are added and removed from the same end (top). Queue is FIFO (First-In, First-Out): elements are added at the rear/back and removed from the front.",
            order: 2,
          },
          {
            front: "What is a Hash Collision and how is it resolved?",
            back: "A collision occurs when two distinct keys generate the exact same hash index. It is resolved using Chaining (linked lists at each bucket) or Open Addressing (Linear Probing, Quadratic Probing, or Double Hashing).",
            order: 3,
          },
          {
            front: "What is the worst-case time complexity of Quick Sort, and when does it occur?",
            back: "O(n²). This happens when the pivot elements repeatedly partition the array in a highly unbalanced manner (e.g., if the input array is already sorted and we choose the first or last element as the pivot).",
            order: 4,
          },
        ],
      },
    },
  });

  // Set 2: Computer Networks
  const cnSet = await prisma.flashcardSet.create({
    data: {
      title: "Computer Networks (CN) Protocol Suite",
      description: "Key networking protocols, layer responsibilities, and routing mechanisms.",
      subject: "Computer Networks",
      university: University.MEDICAPS,
      degree: Degree.BTECH_CSE,
      year: Year.THIRD_YEAR,
      semester: Semester.FIFTH_SEMESTER,
      isActive: true,
      isPublished: true,
      isPremium: false,
      cards: {
        create: [
          {
            front: "Compare TCP vs UDP protocols.",
            back: "TCP is connection-oriented, reliable, guarantees ordered packet delivery, and has flow/congestion control. UDP is connectionless, lightweight, faster, and has no delivery guarantees (best for streaming/gaming).",
            order: 1,
          },
          {
            front: "What is the main purpose of the Address Resolution Protocol (ARP)?",
            back: "ARP maps a dynamic Logical IP Address (Network Layer) to a static Physical MAC Address (Data Link Layer) on a local area network (LAN).",
            order: 2,
          },
          {
            front: "Explain how DNS (Domain Name System) resolves a website name.",
            back: "DNS translates human-readable domain names (e.g., google.com) into machine-readable IP addresses (e.g., 142.250.190.46) by querying Root, Top-Level Domain (TLD), and Authoritative Nameservers hierarchically.",
            order: 3,
          },
        ],
      },
    },
  });

  // Set 3: Database Management Systems
  const dbmsSet = await prisma.flashcardSet.create({
    data: {
      title: "Database Management Systems (DBMS) Fundamentals",
      description: "Database normalization levels, transaction isolation, and integrity rules.",
      subject: "Database Management Systems",
      university: University.IPS,
      degree: Degree.BTECH_IT,
      year: Year.SECOND_YEAR,
      semester: Semester.FOURTH_SEMESTER,
      isActive: true,
      isPublished: true,
      isPremium: false,
      cards: {
        create: [
          {
            front: "Define ACID properties in transaction management.",
            back: "Atomicity (all operations commit or rollback completely), Consistency (schema rules remain valid), Isolation (concurrent operations don't interfere), Durability (committed data persists permanently).",
            order: 1,
          },
          {
            front: "What are the rules of 1NF, 2NF, and 3NF Database Normalization?",
            back: "1NF: Attribute values must be atomic (no arrays/repeating groups). 2NF: Must be in 1NF + remove partial dependency (all non-key attributes fully depend on the primary key). 3NF: Must be in 2NF + remove transitive dependency.",
            order: 2,
          },
          {
            front: "What is the difference between a Primary Key, Unique Key, and Foreign Key?",
            back: "Primary Key: Uniquely identifies a row, cannot be NULL (only one per table). Unique Key: Uniquely identifies a row, can contain NULL (multiple allowed). Foreign Key: A column that references the primary key of another table to maintain referential integrity.",
            order: 3,
          },
        ],
      },
    },
  });

  console.log("Successfully seeded flashcard sets!");
  console.log(`DSA Set ID: ${dsaSet.id}`);
  console.log(`CN Set ID: ${cnSet.id}`);
  console.log(`DBMS Set ID: ${dbmsSet.id}`);
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
