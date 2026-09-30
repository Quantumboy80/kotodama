import { getSession } from "@/lib/db/user";
import { getNotesByAuthor } from "@/dal/note/helper";
import { getUserJoinedCommunities, getAllUniversities } from "@/dal/community/actions";
import { redirect } from "next/navigation";
import { PersonalNotesClient } from "@/components/note/PersonalNotesClient";

export const metadata = {
  title: "My Personal Notes | Kotodama",
  description: "Manage, write, and share your personal academic notes and study resources.",
};

export default async function PersonalNotesPage() {
  const session = await getSession();
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const userId = session.user.id;

  // Fetch user's authored notes from DB
  const notes = await getNotesByAuthor(userId);

  // Fetch communities the user has joined
  const joinedCommunities = await getUserJoinedCommunities();

  // Fetch all registered universities (for community creation / note classification)
  const universities = await getAllUniversities();

  return (
    <div className="font-satoshi container mx-auto min-h-screen max-w-6xl px-4 py-8">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-excon text-3xl font-black text-black dark:text-white sm:text-4xl">
            My Workspace
          </h1>
          <p className="text-muted-foreground mt-2 text-base sm:text-lg">
            Manage your personal study guides, notes, and shared resource collections.
          </p>
        </div>

        <PersonalNotesClient
          initialNotes={notes}
          joinedCommunities={joinedCommunities}
          universities={universities}
          userId={userId}
        />
      </div>
    </div>
  );
}
