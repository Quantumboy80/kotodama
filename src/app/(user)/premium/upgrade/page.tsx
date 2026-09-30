import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Upgrade Plan | Kotodama",
  description: "Upgrade your premium plan to get more features and benefits",
};

export default async function PremiumUpgradePage() {
  redirect("/notes");
}


