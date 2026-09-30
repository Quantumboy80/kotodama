import { getSession } from "@/lib/db/user";
import { getUserJoinedCommunities, getAllUniversities, getAllCommunitiesWithStats } from "@/dal/community/actions";
import { redirect } from "next/navigation";
import { CommunitiesClient } from "@/components/note/CommunitiesClient";

export const metadata = {
  title: "Communities & University Domains | Kotodama",
  description: "Explore, join, or register university domains and degree study communities across India.",
};

export default async function CommunitiesPage() {
  const session = await getSession();
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const [joinedCommunities, universities, allCommunities] = await Promise.all([
    getUserJoinedCommunities(),
    getAllUniversities(),
    getAllCommunitiesWithStats(),
  ]);

  return (
    <div className="font-satoshi container mx-auto min-h-screen max-w-6xl px-4 py-8">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-excon text-3xl font-black text-black dark:text-white sm:text-4xl">
            Universities & Study Communities
          </h1>
          <p className="text-muted-foreground mt-2 text-base sm:text-lg">
            Search, join, or create your university and degree stream to collaborate, access syllabus materials, and share notes with peers across India.
          </p>
        </div>

        <CommunitiesClient
          initialJoined={joinedCommunities}
          universities={universities}
          allCommunities={allCommunities}
        />
      </div>
    </div>
  );
}
