"use client";
import { useRef, useState } from "react";
import * as htmlToImage from "html-to-image";

export default function HtmlToCanvas() {
  const [memeText, setMemeText] = useState<string>("");

  const nodeRef = useRef<HTMLDivElement | null>(null);

  async function saveAsPNG() {
    if (!nodeRef.current) return;
    const dataUrl = await htmlToImage.toPng(nodeRef.current, {
      pixelRatio: 2,
      cacheBust: true,
      filter: (node) =>
        !(node instanceof HTMLElement && node.dataset?.export === "exclude"),
      backgroundColor: "#0b0b0b",
    });

    const link = document.createElement("a");
    link.download = "export.png";
    link.href = dataUrl;
    link.click();
  }

  async function copyToClipboard() {
    if (!nodeRef.current) return;
    const blob = await htmlToImage.toBlob(nodeRef.current, { pixelRatio: 2 });
    if (!blob) return;

    await navigator.clipboard.write([
      new ClipboardItem({ [blob.type]: blob }),
    ]);
    alert("Copied image to clipboard!");
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left: Input box */}
        <div className="bg-gray-800 rounded-2xl shadow-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold">Write your meme text</h2>
          <textarea
            className="w-full h-40 p-4 text-white bg-gray-900 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Enter your meme text here..."
            value={memeText}
            onChange={(e) => setMemeText(e.target.value)}
          />
         
        </div>

        {/* Right: Meme preview */}
        <div className="bg-gray-800 rounded-2xl shadow-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold">Meme Preview</h2>
          <div
            ref={nodeRef}
             style={{ filter: "blur(1px)" }}
            className="aspect-[4/3]  p-6 flex items-center justify-center bg-black/40  text-left"
          >
            <h1 className="text-xl font-medium">{memeText || "Your meme text will appear here"}</h1>
          </div>
        </div>
      </div>

      {/* Controls (excluded from export) */}
      <div
        className="fixed bottom-6 flex gap-3 w-full max-w-md mx-auto px-4"
        data-export="exclude"
      >
        <button
          onClick={saveAsPNG}
          className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 transition font-medium"
        >
          Save as PNG
        </button>
        <button
          onClick={copyToClipboard}
          className="flex-1 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 transition font-medium"
        >
          Copy to Clipboard
        </button>
      </div>
    </div>
  );
}
