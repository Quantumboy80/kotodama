"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { registerUniversity, createCommunity } from "@/dal/community/actions";
import { toast } from "sonner";
import { Link } from "next-view-transitions";
import { Users, School, Plus, BookOpen, GraduationCap, ChevronRight } from "lucide-react";

interface University {
  id: string;
  name: string;
  label: string;
  _count?: {
    communities: number;
    notes: number;
  };
}

interface Community {
  id: string;
  name: string;
  degree: string;
  universityId: string;
  description?: string | null;
  university: {
    id: string;
    name: string;
    label: string;
  };
  _count?: {
    members: number;
    notes: number;
  };
}

interface CommunitiesClientProps {
  initialJoined: Community[];
  universities: University[];
  allCommunities?: Community[];
}

export function CommunitiesClient({
  initialJoined,
  universities: initialUniversities,
  allCommunities: initialAllCommunities = [],
}: CommunitiesClientProps) {
  const router = useRouter();
  const [joined, setJoined] = useState<Community[]>(initialJoined);
  const [universities, setUniversities] = useState<University[]>(initialUniversities);
  const [allCommunities, setAllCommunities] = useState<Community[]>(initialAllCommunities);

  // Search & Filtering
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "joined">("all");

  // Dialog & Loading states
  const [isUniModalOpen, setIsUniModalOpen] = useState(false);
  const [isCommModalOpen, setIsCommModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // University Form states
  const [uniLabel, setUniLabel] = useState("");
  const [uniName, setUniName] = useState("");

  // Community Form states
  const [commName, setCommName] = useState("");
  const [commDegree, setCommDegree] = useState("BTECH_CSE");
  const [commDescription, setCommDescription] = useState("");
  const [selectedUniId, setSelectedUniId] = useState("");

  const joinedIds = new Set(joined.map((c) => c.id));

  // Quick Degree Stream presets
  const streamPresets = [
    { code: "BTECH_CSE", label: "B.Tech Computer Science (CSE)" },
    { code: "BTECH_IT", label: "B.Tech Information Technology (IT)" },
    { code: "BTECH_ECE", label: "B.Tech Electronics & Communication (ECE)" },
    { code: "BTECH_ME", label: "B.Tech Mechanical Engineering (ME)" },
    { code: "BCA", label: "Bachelor of Computer Applications (BCA)" },
    { code: "MCA", label: "Master of Computer Applications (MCA)" },
    { code: "BSC_CS", label: "B.Sc Computer Science" },
    { code: "BCOM", label: "Bachelor of Commerce (B.Com)" },
    { code: "MBA", label: "Master of Business Administration (MBA)" },
  ];

  // Handle register university
  const handleRegisterUni = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uniLabel.trim()) {
      toast.error("Please provide a university or college name.");
      return;
    }

    setLoading(true);
    try {
      const shortName = uniName.trim() || uniLabel.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const university = await registerUniversity(shortName, uniLabel);
      
      toast.success("University registered successfully! It is now visible to all students.");
      
      const newUniObj = {
        ...university,
        _count: { communities: 0, notes: 0 },
      };

      setUniversities((prev) => {
        if (prev.some((u) => u.id === university.id)) return prev;
        return [newUniObj, ...prev];
      });

      setSelectedUniId(university.id);
      setIsUniModalOpen(false);
      setUniLabel("");
      setUniName("");
      // Prompt user to create the first community under this university
      setIsCommModalOpen(true);
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to register university.");
    } finally {
      setLoading(false);
    }
  };

  // Handle create community
  const handleCreateCommunity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commName.trim() || !commDegree.trim() || !selectedUniId) {
      toast.error("Please select a university and enter degree stream details.");
      return;
    }

    setLoading(true);
    try {
      const comm = await createCommunity({
        name: commName,
        degree: commDegree,
        universityId: selectedUniId,
        description: commDescription,
      });

      toast.success("Community domain ready and joined!");
      
      const uni = universities.find((u) => u.id === selectedUniId);
      const newJoinedComm: Community = {
        id: comm.id,
        name: comm.name,
        degree: comm.degree,
        universityId: comm.universityId,
        university: uni || { id: selectedUniId, name: "", label: "Selected College" },
        _count: { members: 1, notes: 0 },
      };

      if (!joined.some((c) => c.id === comm.id)) {
        setJoined((prev) => [newJoinedComm, ...prev]);
      }

      setAllCommunities((prev) => {
        if (prev.some((c) => c.id === comm.id)) return prev;
        return [newJoinedComm, ...prev];
      });

      setIsCommModalOpen(false);
      setCommName("");
      setCommDegree("BTECH_CSE");
      setCommDescription("");
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to join or create community.");
    } finally {
      setLoading(false);
    }
  };

  // Handle one-click Join
  const handleJoinClick = async (comm: Community) => {
    setActionLoadingId(comm.id);
    try {
      await registerUniversity(comm.university.name, comm.university.label); // ensure exists
      await createCommunity({
        name: comm.name,
        degree: comm.degree,
        universityId: comm.universityId,
      });

      toast.success(`Joined ${comm.name} (${comm.university.label})!`);
      if (!joined.some((c) => c.id === comm.id)) {
        setJoined((prev) => [comm, ...prev]);
      }
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to join community.");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Filter communities based on search query
  const filteredAllCommunities = allCommunities.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.degree.toLowerCase().includes(q) ||
      c.university.label.toLowerCase().includes(q) ||
      c.university.name.toLowerCase().includes(q)
    );
  });

  const filteredJoinedCommunities = joined.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.degree.toLowerCase().includes(q) ||
      c.university.label.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8">
      {/* Top Banner & Action Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-xl">
          <Input
            placeholder="Search universities, colleges, or degrees (e.g. Pune, IIT, Delhi, Medicaps, IPS, B.Tech)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-12 border-2 border-black bg-white pl-4 font-bold text-black shadow-[4px_4px_0px_0px_#000] focus:translate-x-[-1px] focus:translate-y-[-1px] focus:shadow-[5px_5px_0px_0px_#000] dark:border-white/20 dark:bg-zinc-900 dark:text-white dark:shadow-[4px_4px_0px_0px_#757373]"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={() => {
              if (universities.length > 0 && !selectedUniId) {
                setSelectedUniId(universities[0].id);
              }
              setIsCommModalOpen(true);
            }}
            className="neuro-button flex items-center gap-2 border-2 border-black bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 shadow-[4px_4px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#000] transition-all"
          >
            <Plus className="h-5 w-5" />
            Join / Create Community
          </Button>
          <Button
            onClick={() => setIsUniModalOpen(true)}
            className="neuro-button flex items-center gap-2 border-2 border-black bg-white hover:bg-zinc-100 text-black font-bold py-2.5 px-4 shadow-[4px_4px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#000] transition-all dark:bg-zinc-900 dark:text-white dark:border-white/20 dark:shadow-[4px_4px_0px_0px_#757373]"
          >
            <School className="h-5 w-5" />
            Register College / University
          </Button>
        </div>
      </div>

      {/* Tabs: Browse All vs My Communities */}
      <div className="flex items-center gap-3 border-b-2 border-black/10 dark:border-white/10 pb-4">
        <button
          onClick={() => setActiveTab("all")}
          className={`font-excon text-lg font-black transition-all pb-1 border-b-4 ${
            activeTab === "all"
              ? "border-black text-black dark:border-white dark:text-white"
              : "border-transparent text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white"
          }`}
        >
          All Indian Universities & Communities ({allCommunities.length})
        </button>
        <button
          onClick={() => setActiveTab("joined")}
          className={`font-excon text-lg font-black transition-all pb-1 border-b-4 ml-4 ${
            activeTab === "joined"
              ? "border-black text-black dark:border-white dark:text-white"
              : "border-transparent text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white"
          }`}
        >
          My Joined Communities ({joined.length})
        </button>
      </div>

      {/* Tab 1: All Universities & Communities */}
      {activeTab === "all" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-muted-foreground">
              Showing {filteredAllCommunities.length} communities across {universities.length} registered universities. Don&apos;t see your college? Click &quot;Register College / University&quot; above!
            </p>
          </div>

          {filteredAllCommunities.length === 0 ? (
            <div className="neuro-xl flex flex-col items-center justify-center rounded-2xl py-16 text-center space-y-4 border-2 border-black bg-white dark:bg-zinc-900 dark:border-white/20">
              <School className="h-16 w-16 text-muted-foreground" />
              <h3 className="font-excon text-xl font-bold">No communities matched your search</h3>
              <p className="text-muted-foreground max-w-md">
                Try searching for another keyword or register your college to launch the first community!
              </p>
              <Button onClick={() => setIsUniModalOpen(true)} className="neuro-button mt-4 bg-blue-500 text-white font-bold">
                Register Your College
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredAllCommunities.map((comm) => {
                const isMember = joinedIds.has(comm.id);
                const isLoadingAction = actionLoadingId === comm.id;

                return (
                  <Card 
                    key={comm.id} 
                    className="neuro-xl flex flex-col justify-between border-2 border-black bg-white shadow-[6px_6px_0px_0px_#000] dark:border-white/10 dark:bg-zinc-900 dark:shadow-[6px_6px_0px_0px_#222] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_#000]"
                  >
                    <CardHeader className="p-5">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                          <GraduationCap className="h-5 w-5" />
                          <span className="text-xs font-black uppercase tracking-wide">
                            {comm.degree.replace(/_/g, " ")}
                          </span>
                        </div>
                        {isMember ? (
                          <Badge className="border border-green-600 bg-green-100 text-green-800 font-bold dark:bg-green-950 dark:text-green-300">
                            Joined
                          </Badge>
                        ) : null}
                      </div>

                      <CardTitle className="font-excon text-lg font-black line-clamp-1">
                        {comm.name}
                      </CardTitle>

                      <CardDescription className="font-satoshi text-sm font-bold text-black/70 dark:text-white/70 line-clamp-2 mt-1">
                        {comm.university.label}
                      </CardDescription>

                      {comm.description && (
                        <p className="font-satoshi text-xs text-muted-foreground line-clamp-2 mt-2">
                          {comm.description}
                        </p>
                      )}
                    </CardHeader>

                    <CardFooter className="p-5 pt-0 flex flex-col gap-2">
                      <div className="flex items-center justify-between text-xs font-bold text-muted-foreground w-full mb-1">
                        <span>{comm._count?.members || 1} {comm._count?.members === 1 ? "student" : "students"}</span>
                        <span>{comm._count?.notes || 0} notes shared</span>
                      </div>

                      <div className="flex items-center gap-2 w-full">
                        <Link 
                          href={`/notes?university=${comm.university.name}&degree=${comm.degree.toLowerCase().replace(/_/g, "-")}`}
                          className="flex-1"
                        >
                          <Button className="w-full neuro-sm flex items-center justify-center gap-2 border border-black bg-white hover:bg-zinc-100 text-black font-bold text-xs py-2 shadow-[2px_2px_0px_0px_#000] dark:bg-zinc-800 dark:text-white dark:border-white/20">
                            <BookOpen className="h-3.5 w-3.5" /> Notes
                          </Button>
                        </Link>

                        {isMember ? (
                          <Button
                            disabled
                            className="neuro-sm border border-green-600 bg-green-50 text-green-700 font-bold text-xs py-2 px-4 dark:bg-green-950 dark:text-green-300"
                          >
                            Member
                          </Button>
                        ) : (
                          <Button
                            onClick={() => handleJoinClick(comm)}
                            disabled={isLoadingAction}
                            className="neuro-sm border border-black bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 px-4 shadow-[2px_2px_0px_0px_#000]"
                          >
                            {isLoadingAction ? "Joining..." : "Join"}
                          </Button>
                        )}
                      </div>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: My Joined Communities */}
      {activeTab === "joined" && (
        <div className="space-y-4">
          {filteredJoinedCommunities.length === 0 ? (
            <div className="neuro-xl flex flex-col items-center justify-center rounded-2xl py-16 text-center space-y-4 border-2 border-black bg-white dark:bg-zinc-900 dark:border-white/20">
              <Users className="h-16 w-16 text-muted-foreground" />
              <h3 className="font-excon text-xl font-bold">No joined communities yet</h3>
              <p className="text-muted-foreground max-w-md">
                Joining a community lets you share syllabus notes and collaborate with classmates in your domain.
              </p>
              <Button onClick={() => setActiveTab("all")} className="neuro-button mt-4 bg-blue-500 text-white font-bold">
                Browse Indian University Communities
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredJoinedCommunities.map((comm) => (
                <Card 
                  key={comm.id} 
                  className="neuro-xl flex flex-col justify-between border-2 border-black bg-white shadow-[6px_6px_0px_0px_#000] dark:border-white/10 dark:bg-zinc-900 dark:shadow-[6px_6px_0px_0px_#222]"
                >
                  <CardHeader className="p-5">
                    <div className="flex items-center gap-2 mb-2 text-blue-500">
                      <GraduationCap className="h-5 w-5" />
                      <span className="text-xs font-black uppercase tracking-wide">
                        {comm.degree.replace(/_/g, " ")}
                      </span>
                    </div>
                    <CardTitle className="font-excon text-lg font-black line-clamp-1">
                      {comm.name}
                    </CardTitle>
                    <CardDescription className="font-satoshi text-sm font-bold text-black/60 dark:text-white/60 line-clamp-2 mt-1">
                      University: {comm.university.label}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="p-5 pt-0">
                    <Link 
                      href={`/notes?university=${comm.university.name}&degree=${comm.degree.toLowerCase().replace(/_/g, "-")}`}
                      className="w-full"
                    >
                      <Button className="w-full neuro-sm flex items-center justify-between border border-black bg-white hover:bg-zinc-100 text-black font-bold text-xs py-2 shadow-[2px_2px_0px_0px_#000] px-4 dark:bg-zinc-800 dark:text-white dark:border-white/20">
                        <span className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4" /> View Shared Notes
                        </span>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* REGISTER UNIVERSITY / COLLEGE MODAL */}
      <Dialog open={isUniModalOpen} onOpenChange={setIsUniModalOpen}>
        <DialogContent className="max-w-md border-2 border-black bg-white text-black p-6 shadow-[8px_8px_0px_0px_#000] dark:border-white/20 dark:bg-zinc-950 dark:text-white dark:shadow-[8px_8px_0px_0px_#222]">
          <DialogHeader>
            <DialogTitle className="font-excon text-2xl font-black">Register College or University</DialogTitle>
            <DialogDescription className="font-satoshi font-bold text-black/60 dark:text-white/60">
              Add your university or college. Once registered, it will be visible to all students across India to explore and join!
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleRegisterUni} className="space-y-4 mt-2">
            <div className="grid gap-2">
              <Label htmlFor="uniLabel" className="font-bold">University / College Full Name *</Label>
              <Input
                id="uniLabel"
                placeholder="e.g. National Institute of Technology Calicut"
                value={uniLabel}
                onChange={(e) => setUniLabel(e.target.value)}
                className="border-2 border-black focus:ring-0 rounded-md font-bold dark:border-white/20"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="uniName" className="font-bold">Short Code / Tag (Optional)</Label>
              <Input
                id="uniName"
                placeholder="e.g. nit-calicut (automatically generated if blank)"
                value={uniName}
                onChange={(e) => setUniName(e.target.value)}
                className="border-2 border-black focus:ring-0 rounded-md font-bold dark:border-white/20"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsUniModalOpen(false)}
                className="border-2 border-black font-bold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="neuro-button border-2 border-black bg-black text-white font-bold shadow-[4px_4px_0px_0px_#000] dark:bg-white dark:text-black"
              >
                {loading ? "Registering..." : "Register & Add Communities"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* JOIN / CREATE COMMUNITY MODAL */}
      <Dialog open={isCommModalOpen} onOpenChange={setIsCommModalOpen}>
        <DialogContent className="max-w-md border-2 border-black bg-white text-black p-6 shadow-[8px_8px_0px_0px_#000] dark:border-white/20 dark:bg-zinc-950 dark:text-white dark:shadow-[8px_8px_0px_0px_#222]">
          <DialogHeader>
            <DialogTitle className="font-excon text-2xl font-black">Join / Create Community</DialogTitle>
            <DialogDescription className="font-satoshi font-bold text-black/60 dark:text-white/60">
              Select your university and degree stream. If the domain doesn&apos;t exist yet, it will be automatically created!
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateCommunity} className="space-y-4 mt-2">
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="uniSelect" className="font-bold">Select University *</Label>
                <button
                  type="button"
                  onClick={() => {
                    setIsCommModalOpen(false);
                    setIsUniModalOpen(true);
                  }}
                  className="text-xs font-bold text-blue-600 hover:underline dark:text-blue-400"
                >
                  + Add New College
                </button>
              </div>
              <Select value={selectedUniId} onValueChange={setSelectedUniId}>
                <SelectTrigger className="border-2 border-black rounded-md font-bold dark:border-white/20">
                  <SelectValue placeholder="Select University" />
                </SelectTrigger>
                <SelectContent className="max-h-60 border-2 border-black font-bold">
                  {universities.map((uni) => (
                    <SelectItem key={uni.id} value={uni.id}>
                      {uni.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label className="font-bold">Degree / Stream Template</Label>
              <div className="flex flex-wrap gap-1.5">
                {streamPresets.map((preset) => (
                  <button
                    key={preset.code}
                    type="button"
                    onClick={() => {
                      setCommDegree(preset.code);
                      setCommName(preset.label);
                    }}
                    className={`text-xs px-2.5 py-1 rounded border font-bold transition-all ${
                      commDegree === preset.code
                        ? "bg-black text-white border-black dark:bg-white dark:text-black"
                        : "bg-zinc-100 text-black border-zinc-300 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-white dark:border-zinc-700"
                    }`}
                  >
                    {preset.code.replace(/_/g, " ")}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="commDegree" className="font-bold">Degree Code *</Label>
              <Input
                id="commDegree"
                placeholder="e.g. BTECH_CSE, BCOM, BSC_PHYSICS"
                value={commDegree}
                onChange={(e) => setCommDegree(e.target.value.toUpperCase().replace(/\s+/g, "_"))}
                className="border-2 border-black focus:ring-0 rounded-md font-bold dark:border-white/20"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="commName" className="font-bold">Community Display Name *</Label>
              <Input
                id="commName"
                placeholder="e.g. B.Tech Computer Science (CSE)"
                value={commName}
                onChange={(e) => setCommName(e.target.value)}
                className="border-2 border-black focus:ring-0 rounded-md font-bold dark:border-white/20"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="commDescription" className="font-bold">Description (Optional)</Label>
              <Textarea
                id="commDescription"
                placeholder="Study and notes sharing group for our stream..."
                rows={2}
                value={commDescription}
                onChange={(e) => setCommDescription(e.target.value)}
                className="border-2 border-black focus:ring-0 rounded-md font-bold dark:border-white/20"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCommModalOpen(false)}
                className="border-2 border-black font-bold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="neuro-button border-2 border-black bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-[4px_4px_0px_0px_#000]"
              >
                {loading ? "Joining..." : "Join / Create Domain"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
