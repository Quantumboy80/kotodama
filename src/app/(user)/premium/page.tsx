import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Premium Membership - Unlock Advanced Learning Features",
  description:
    "Upgrade to Premium and unlock exclusive study materials, advanced AI features, unlimited quiz attempts, and premium flashcard sets. Take your academic performance to the next level.",
};

export default async function PremiumPage() {
  redirect("/notes");
}


