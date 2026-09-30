"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createNote, updateNote, deleteNote } from "@/dal/note/actions";
import { NoteType } from "@prisma/client";
import { toast } from "sonner";
import { Link } from "next-view-transitions";
import { 
  PlusCircle, 
  BookOpen, 
  Trash2, 
  Edit3, 
  Users, 
  Lock, 
  Calendar, 
  FileText 
} from "lucide-react";

interface Note {
  _id: string;
  _createdAt: string;
  title: string;
  syllabus: string;
  slug: { current: string };
  university: string | null;
  degree: string | null;
  year: string | null;
  semester: string | null;
  subject: string | null;
  type: string;
  isPremium: boolean;
  content: any[];
  communityId: string | null;
  pdfUrl?: string | null;
}

interface Community {
  id: string;
  name: string;
  degree: string;
  universityId: string;
  university: {
    id: string;
    name: string;
    label: string;
  };
}

interface University {
  id: string;
  name: string;
  label: string;
}

interface PersonalNotesClientProps {
  initialNotes: any[];
  joinedCommunities: any[];
  universities: University[];
  userId: string;
}

export function PersonalNotesClient({
  initialNotes,
  joinedCommunities,
  universities,
  userId,
}: PersonalNotesClientProps) {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [syllabus, setSyllabus] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState<NoteType>("NOTES");
  const [subject, setSubject] = useState("");
  const [shareMode, setShareMode] = useState<"personal" | "community">("personal");
  const [selectedCommunityId, setSelectedCommunityId] = useState<string>("");
  const [year, setYear] = useState<string>("FIRST_YEAR");
  const [semester, setSemester] = useState<string>("FIRST_SEMESTER");
  const [pdfUrl, setPdfUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [pdfInputMode, setPdfInputMode] = useState<"upload" | "link">("upload");

  const openCreateDialog = () => {
    setEditingNote(null);
    setTitle("");
    setSyllabus("");
    setContent("");
    setType("NOTES");
    setSubject("");
    setShareMode("personal");
    setSelectedCommunityId("");
    setYear("FIRST_YEAR");
    setSemester("FIRST_SEMESTER");
    setPdfUrl("");
    setPdfInputMode("upload");
    setIsDialogOpen(true);
  };

  const openEditDialog = (note: Note) => {
    setEditingNote(note);
    setTitle(note.title);
    setSyllabus(note.syllabus || "");
    
    // Content is Portable Text block array. If it exists, let's map it back to text paragraphs
    let rawText = "";
    if (Array.isArray(note.content)) {
      rawText = note.content
        .map((block: any) => {
          const blockText = block.children?.map((c: any) => c.text).join("") || "";
          if (block.style === "h2") return `## ${blockText}`;
          if (block.style === "h3") return `### ${blockText}`;
          if (block.style === "h4") return `#### ${blockText}`;
          return blockText;
        })
        .join("\n\n");
    } else {
      rawText = typeof note.content === "string" ? note.content : "";
    }
    setContent(rawText);
    setType(note.type as NoteType);
    setSubject(note.subject || "");
    setShareMode(note.communityId ? "community" : "personal");
    setSelectedCommunityId(note.communityId || "");
    setYear(note.year || "FIRST_YEAR");
    setSemester(note.semester || "FIRST_SEMESTER");
    setPdfUrl(note.pdfUrl || "");
    setPdfInputMode(note.pdfUrl?.startsWith("/") ? "upload" : "link");
    setIsDialogOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      toast.error("Only PDF files are allowed.");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/notes/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to upload file");
      }

      const data = await response.json();
      setPdfUrl(data.url);
      toast.success("PDF uploaded successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to upload PDF.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error("Please fill in the title and content fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingNote) {
        // Update Note
        const result = await updateNote(editingNote._id, {
          title,
          syllabus,
          content,
          type,
          pdfUrl: pdfUrl || null,
        });
        
        toast.success("Note updated successfully!");
        // Refresh local state list
        setNotes((prev) =>
          prev.map((n) =>
            n._id === editingNote._id
              ? {
                  ...n,
                  title,
                  syllabus,
                  type,
                  pdfUrl: pdfUrl || null,
                  content: [{ _type: "block", style: "normal", children: [{ _type: "span", text: content }] }],
                }
              : n
          )
        );
      } else {
        // Create Note
        let commId = null;
        let uniId = null;
        let deg = null;

        if (shareMode === "community" && selectedCommunityId) {
          commId = selectedCommunityId;
          const comm = joinedCommunities.find((c) => c.id === selectedCommunityId);
          if (comm) {
            uniId = comm.universityId;
            deg = comm.degree;
          }
        }

        const newNote = await createNote({
          title,
          syllabus,
          content,
          type,
          pdfUrl: pdfUrl || null,
          communityId: commId,
          universityId: uniId,
          degree: deg,
          year: shareMode === "community" ? year : null,
          semester: shareMode === "community" ? semester : null,
          subject: subject || "General",
        });

        toast.success("Note created successfully!");
        
        // Push to list
        const formattedNote: Note = {
          _id: newNote.id,
          _createdAt: newNote.createdAt.toISOString(),
          title: newNote.title,
          syllabus: newNote.syllabus || "",
          slug: { current: newNote.slug },
          university: uniId,
          degree: deg,
          year: newNote.year,
          semester: newNote.semester,
          subject: newNote.subject,
          type: newNote.type,
          isPremium: newNote.isPremium,
          content: [{ _type: "block", style: "normal", children: [{ _type: "span", text: content }] }],
          communityId: newNote.communityId,
          pdfUrl: newNote.pdfUrl,
        };
        setNotes((prev) => [formattedNote, ...prev]);
      }
      setIsDialogOpen(false);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to save note.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (noteId: string) => {
    if (!confirm("Are you sure you want to delete this note? This action cannot be undone.")) {
      return;
    }

    try {
      await deleteNote(noteId);
      toast.success("Note deleted successfully!");
      setNotes((prev) => prev.filter((n) => n._id !== noteId));
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete note.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-excon text-xl font-bold text-black dark:text-white">
          My Notes ({notes.length})
        </h2>
        <Button
          onClick={openCreateDialog}
          className="neuro-button flex items-center gap-2 border-2 border-black bg-emerald-500 text-white font-bold py-2 px-4 shadow-[4px_4px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#000] transition-all"
        >
          <PlusCircle className="h-5 w-5" />
          Create Note
        </Button>
      </div>

      {notes.length === 0 ? (
        <div className="neuro-xl flex flex-col items-center justify-center rounded-2xl py-16 text-center space-y-4">
          <BookOpen className="h-16 w-16 text-muted-foreground" />
          <h3 className="font-excon text-xl font-bold">Your workspace is empty</h3>
          <p className="text-muted-foreground max-w-md">
            Start writing your personal study guides, lecture summaries, or solved question papers now!
          </p>
          <Button onClick={openCreateDialog} className="neuro-button mt-4 bg-emerald-500 text-white">
            Write First Note
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <Card 
              key={note._id} 
              className="neuro-xl flex flex-col justify-between overflow-hidden border-2 border-black bg-white shadow-[6px_6px_0px_0px_#000] dark:border-white/10 dark:bg-zinc-900 dark:shadow-[6px_6px_0px_0px_#222] transition-all hover:-translate-y-1"
            >
              <CardHeader className="p-5 pb-3">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="border-black font-bold uppercase text-xs">
                    {note.type}
                  </Badge>
                  {note.communityId ? (
                    <Badge className="bg-blue-500 text-white flex items-center gap-1 font-bold text-xs">
                      <Users className="h-3 w-3" /> Shared
                    </Badge>
                  ) : (
                    <Badge className="bg-zinc-500 text-white flex items-center gap-1 font-bold text-xs">
                      <Lock className="h-3 w-3" /> Personal
                    </Badge>
                  )}
                </div>
                <CardTitle className="font-excon text-lg font-black line-clamp-1">
                  {note.title}
                </CardTitle>
                <CardDescription className="font-satoshi text-sm font-bold text-black/60 dark:text-white/65 mt-1">
                  Subject: {note.subject || "General"}
                </CardDescription>
              </CardHeader>
              <CardContent className="px-5 py-0">
                <p className="font-satoshi text-sm text-black/70 dark:text-white/70 line-clamp-3">
                  {note.syllabus || "No description provided."}
                </p>
              </CardContent>
              <CardFooter className="p-5 pt-4 flex gap-2 border-t-2 border-black/10 dark:border-white/5 mt-4">
                <Link href={`/notes/${note.slug.current}`} className="flex-1">
                  <Button className="w-full neuro-sm flex items-center gap-2 border border-black bg-white hover:bg-zinc-100 text-black font-bold text-xs py-2 shadow-[2px_2px_0px_0px_#000]">
                    <FileText className="h-4 w-4" /> View
                  </Button>
                </Link>
                <Button
                  onClick={() => openEditDialog(note)}
                  size="sm"
                  className="neuro-sm border border-black bg-amber-400 hover:bg-amber-500 text-black font-bold text-xs px-3 shadow-[2px_2px_0px_0px_#000]"
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => handleDelete(note._id)}
                  size="sm"
                  className="neuro-sm border border-black bg-red-500 hover:bg-red-650 text-white font-bold text-xs px-3 shadow-[2px_2px_0px_0px_#000]"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* CREATE/EDIT NOTE DIALOG */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl border-2 border-black bg-white text-black p-6 shadow-[8px_8px_0px_0px_#000] dark:border-white/20 dark:bg-zinc-950 dark:text-white dark:shadow-[8px_8px_0px_0px_#222]">
          <DialogHeader>
            <DialogTitle className="font-excon text-2xl font-black">
              {editingNote ? "Edit Note" : "Create New Note"}
            </DialogTitle>
            <DialogDescription className="font-satoshi font-bold text-black/60 dark:text-white/60">
              Fill out the details to organize your note. Keep it personal, or share it with a community!
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="grid gap-2">
              <Label htmlFor="title" className="font-bold">Title *</Label>
              <Input
                id="title"
                placeholder="e.g. Computer Networks - OSI Model Lecture 1"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border-2 border-black focus:ring-0 rounded-md font-bold dark:border-white/20"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="subject" className="font-bold">Subject</Label>
                <Input
                  id="subject"
                  placeholder="e.g. Computer Networks"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="border-2 border-black focus:ring-0 rounded-md font-bold dark:border-white/20"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="type" className="font-bold">Note Type</Label>
                <Select value={type} onValueChange={(val: NoteType) => setType(val)}>
                  <SelectTrigger className="border-2 border-black rounded-md font-bold dark:border-white/20">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="border-2 border-black font-bold">
                    <SelectItem value="NOTES">Study Notes</SelectItem>
                    <SelectItem value="MST">Mid-Semester Test (MST)</SelectItem>
                    <SelectItem value="PYQ">Previous Year Questions (PYQ)</SelectItem>
                    <SelectItem value="ONE_SHOT">One Shot Revision</SelectItem>
                    <SelectItem value="VIDEO_MATERIAL">Video Lecture Material</SelectItem>
                    <SelectItem value="HANDWRITTEN_NOTES">Handwritten Notes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="syllabus" className="font-bold">Short Description / Syllabus</Label>
              <Input
                id="syllabus"
                placeholder="Short outline of what this note covers..."
                value={syllabus}
                onChange={(e) => setSyllabus(e.target.value)}
                className="border-2 border-black focus:ring-0 rounded-md font-bold dark:border-white/20"
              />
            </div>

            {/* Sharing Configuration */}
            <div className="neuro-sm border-2 border-black rounded-xl p-4 space-y-4 dark:border-white/20">
              <div className="flex items-center justify-between">
                <Label className="font-black text-sm uppercase tracking-wide">Sharing Options</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={() => setShareMode("personal")}
                    className={`text-xs font-bold py-1 px-3 border border-black rounded-md transition-all ${
                      shareMode === "personal"
                        ? "bg-black text-white dark:bg-white dark:text-black"
                        : "bg-white text-black hover:bg-zinc-100 dark:bg-zinc-900 dark:text-white"
                    }`}
                  >
                    <Lock className="h-3 w-3 mr-1 inline" /> Keep Personal
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setShareMode("community")}
                    className={`text-xs font-bold py-1 px-3 border border-black rounded-md transition-all ${
                      shareMode === "community"
                        ? "bg-black text-white dark:bg-white dark:text-black"
                        : "bg-white text-black hover:bg-zinc-100 dark:bg-zinc-900 dark:text-white"
                    }`}
                  >
                    <Users className="h-3 w-3 mr-1 inline" /> Post in Community
                  </Button>
                </div>
              </div>

              {shareMode === "community" && (
                <div className="space-y-3 pt-2 border-t border-black/10 dark:border-white/10">
                  {joinedCommunities.length === 0 ? (
                    <p className="text-xs font-bold text-red-500">
                      You haven't joined any communities yet. Go to the "Communities" page to join or create one!
                    </p>
                  ) : (
                    <>
                      <div className="grid gap-2">
                        <Label htmlFor="community" className="font-bold text-xs">Target Community *</Label>
                        <Select value={selectedCommunityId} onValueChange={setSelectedCommunityId}>
                          <SelectTrigger className="border-2 border-black rounded-md font-bold dark:border-white/20">
                            <SelectValue placeholder="Select community" />
                          </SelectTrigger>
                          <SelectContent className="border-2 border-black font-bold">
                            {joinedCommunities.map((comm) => (
                              <SelectItem key={comm.id} value={comm.id}>
                                {comm.name} ({comm.university.label})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="year" className="font-bold text-xs">Year</Label>
                          <Select value={year} onValueChange={setYear}>
                            <SelectTrigger className="border-2 border-black rounded-md font-bold dark:border-white/20">
                              <SelectValue placeholder="Year" />
                            </SelectTrigger>
                            <SelectContent className="border-2 border-black font-bold">
                              <SelectItem value="FIRST_YEAR">1st Year</SelectItem>
                              <SelectItem value="SECOND_YEAR">2nd Year</SelectItem>
                              <SelectItem value="THIRD_YEAR">3rd Year</SelectItem>
                              <SelectItem value="FOURTH_YEAR">4th Year</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="semester" className="font-bold text-xs">Semester</Label>
                          <Select value={semester} onValueChange={setSemester}>
                            <SelectTrigger className="border-2 border-black rounded-md font-bold dark:border-white/20">
                              <SelectValue placeholder="Semester" />
                            </SelectTrigger>
                            <SelectContent className="border-2 border-black font-bold">
                              <SelectItem value="FIRST_SEMESTER">1st Semester</SelectItem>
                              <SelectItem value="SECOND_SEMESTER">2nd Semester</SelectItem>
                              <SelectItem value="THIRD_SEMESTER">3rd Semester</SelectItem>
                              <SelectItem value="FOURTH_SEMESTER">4th Semester</SelectItem>
                              <SelectItem value="FIFTH_SEMESTER">5th Semester</SelectItem>
                              <SelectItem value="SIXTH_SEMESTER">6th Semester</SelectItem>
                              <SelectItem value="SEVENTH_SEMESTER">7th Semester</SelectItem>
                              <SelectItem value="EIGHTH_SEMESTER">8th Semester</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* PDF Upload / Link Input */}
            <div className="grid gap-2 border-2 border-black rounded-xl p-4 dark:border-white/20">
              <Label className="font-black text-xs uppercase tracking-wide">Attach Resource (PDF, YouTube Video, or Drive Link - Optional)</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={() => setPdfInputMode("upload")}
                  className={`text-xs font-bold py-1 px-3 border border-black rounded-md transition-all ${
                    pdfInputMode === "upload"
                      ? "bg-black text-white dark:bg-white dark:text-black"
                      : "bg-white text-black hover:bg-zinc-100 dark:bg-zinc-900 dark:text-white"
                  }`}
                >
                  Upload PDF
                </Button>
                <Button
                  type="button"
                  onClick={() => setPdfInputMode("link")}
                  className={`text-xs font-bold py-1 px-3 border border-black rounded-md transition-all ${
                    pdfInputMode === "link"
                      ? "bg-black text-white dark:bg-white dark:text-black"
                      : "bg-white text-black hover:bg-zinc-100 dark:bg-zinc-900 dark:text-white"
                  }`}
                >
                  Paste URL
                </Button>
              </div>

              {pdfInputMode === "upload" ? (
                <div className="space-y-2 mt-2">
                  <div className="flex gap-2 items-center">
                    <Input
                      type="file"
                      accept="application/pdf"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                      className="border-2 border-black focus:ring-0 rounded-md font-bold dark:border-white/20 flex-1 file:font-bold file:text-xs file:border-r file:border-black file:bg-zinc-100 dark:file:bg-zinc-800 dark:file:text-white cursor-pointer"
                    />
                    {pdfUrl && (
                      <Badge className="bg-emerald-500 text-white font-bold h-9 px-3 flex items-center gap-1">
                        ✓ Attached
                      </Badge>
                    )}
                  </div>
                  {isUploading && <p className="text-xs text-muted-foreground animate-pulse">Uploading PDF...</p>}
                </div>
              ) : (
                <div className="space-y-2 mt-2">
                  <Input
                    type="url"
                    placeholder="Paste YouTube video or PDF link (e.g. https://youtube.com/watch?v=... or https://drive.google.com/...)"
                    value={pdfUrl}
                    onChange={(e) => setPdfUrl(e.target.value)}
                    className="border-2 border-black focus:ring-0 rounded-md font-bold dark:border-white/20"
                  />
                </div>
              )}

              {pdfUrl && (
                <div className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-950 p-2 rounded border border-black/10 dark:border-white/10 text-xs">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 truncate flex-1 mr-2">
                    Attached: {pdfUrl}
                  </span>
                  <Button
                    type="button"
                    onClick={() => setPdfUrl("")}
                    className="text-[10px] bg-red-500 hover:bg-red-650 text-white h-5 px-2 py-0 rounded font-bold"
                  >
                    Remove
                  </Button>
                </div>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="content" className="font-bold">Content (Markdown supported) *</Label>
              <Textarea
                id="content"
                placeholder="Write your study notes here using Markdown. Use ## for Headings to automatically construct a Table of Contents!"
                rows={10}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="border-2 border-black focus:ring-0 rounded-md font-bold dark:border-white/20 font-mono text-sm"
                required
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="border-2 border-black font-bold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="neuro-button border-2 border-black bg-emerald-500 text-white font-bold shadow-[4px_4px_0px_0px_#000]"
              >
                {isSubmitting ? "Saving..." : editingNote ? "Update Note" : "Create Note"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
