"use client";

import React from "react";

interface AttachedResourceProps {
  url: string;
}

function getYouTubeVideoId(url: string): string | null {
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const match = url.match(regExp);
  return match && match[1] ? match[1] : null;
}

function getGoogleDriveEmbedUrl(url: string): string | null {
  const match = url.match(/drive\.google\.com\/(?:file\/d\/|open\?id=)([a-zA-Z0-9_-]+)/i);
  if (match && match[1]) {
    return `https://drive.google.com/file/d/${match[1]}/preview`;
  }
  return null;
}

export default function AttachedResource({ url }: AttachedResourceProps) {
  if (!url) return null;

  const ytId = getYouTubeVideoId(url);
  const driveEmbed = getGoogleDriveEmbedUrl(url);

  if (ytId) {
    const embedUrl = `https://www.youtube.com/embed/${ytId}`;
    return (
      <div className="mb-8 p-5 border-2 border-black bg-red-50 rounded-xl shadow-[4px_4px_0px_0px_#000] dark:bg-red-950/20 dark:border-white/20">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4 font-satoshi">
          <div className="flex items-center gap-2">
            <div className="bg-red-600 text-white p-2 rounded-lg border border-black shadow-[2px_2px_0px_0px_#000]">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-black dark:text-white">Attached Video Resource</h4>
              <p className="text-xs text-black/50 dark:text-white/50 font-bold">YouTube Lecture / Tutorial</p>
            </div>
          </div>
          <a href={url} target="_blank" rel="noopener noreferrer" className="no-underline">
            <button className="bg-black hover:bg-zinc-800 text-white font-bold py-2 px-4 rounded-lg border border-black transition-all text-sm shadow-[2px_2px_0px_0px_#fff] cursor-pointer">
              Open Video on YouTube
            </button>
          </a>
        </div>
        <div className="w-full aspect-video border-2 border-black rounded-lg overflow-hidden bg-black shadow-[4px_4px_0px_0px_#000] dark:border-white/10">
          <iframe
            src={embedUrl}
            className="w-full h-full"
            title="Attached YouTube Video Resource"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>
    );
  }

  if (driveEmbed) {
    return (
      <div className="mb-8 p-5 border-2 border-black bg-blue-50 rounded-xl shadow-[4px_4px_0px_0px_#000] dark:bg-blue-950/20 dark:border-white/20">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4 font-satoshi">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-2 rounded-lg border border-black shadow-[2px_2px_0px_0px_#000]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-black dark:text-white">Attached Google Drive Resource</h4>
              <p className="text-xs text-black/50 dark:text-white/50 font-bold">Cloud Document / PDF</p>
            </div>
          </div>
          <a href={url} target="_blank" rel="noopener noreferrer" className="no-underline">
            <button className="bg-black hover:bg-zinc-800 text-white font-bold py-2 px-4 rounded-lg border border-black transition-all text-sm shadow-[2px_2px_0px_0px_#fff] cursor-pointer">
              Open in Google Drive
            </button>
          </a>
        </div>
        <div className="w-full h-[600px] border-2 border-black rounded-lg overflow-hidden bg-white shadow-[4px_4px_0px_0px_#000] dark:border-white/10">
          <iframe
            src={driveEmbed}
            className="w-full h-full"
            title="Attached Google Drive Document"
            allow="autoplay"
          />
        </div>
      </div>
    );
  }

  // Default PDF Document
  return (
    <div className="mb-8 p-5 border-2 border-black bg-emerald-50 rounded-xl shadow-[4px_4px_0px_0px_#000] dark:bg-emerald-950/20 dark:border-white/20">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4 font-satoshi">
        <div className="flex items-center gap-2">
          <div className="bg-red-500 text-white p-2 rounded-lg border border-black shadow-[2px_2px_0px_0px_#000]">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h4 className="font-bold text-black dark:text-white">Attached Study Resource</h4>
            <p className="text-xs text-black/50 dark:text-white/50 font-bold">Original PDF Document</p>
          </div>
        </div>
        <a href={url} target="_blank" rel="noopener noreferrer" className="no-underline">
          <button className="bg-black hover:bg-zinc-800 text-white font-bold py-2 px-4 rounded-lg border border-black transition-all text-sm shadow-[2px_2px_0px_0px_#fff] cursor-pointer">
            Open PDF in New Tab
          </button>
        </a>
      </div>
      <div className="w-full h-[600px] border-2 border-black rounded-lg overflow-hidden bg-white shadow-[4px_4px_0px_0px_#000] dark:border-white/10">
        <iframe
          src={`${url}#toolbar=0`}
          className="w-full h-full"
          title="Attached Note PDF Document"
        />
      </div>
    </div>
  );
}
