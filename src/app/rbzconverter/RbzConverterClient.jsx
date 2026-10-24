"use client";

import React, { useState, useRef } from "react";
import {
  FiUploadCloud,
  FiFile,
  FiCheckCircle,
  FiAlertCircle,
  FiDownload,
  FiArrowRight,
  FiLayers,
  FiBox,
} from "react-icons/fi";

export default function RbzConverterClient() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | converting | success | error
  const [errorMessage, setErrorMessage] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const selected = e.dataTransfer.files[0];
      if (selected.name.toLowerCase().endsWith(".zip")) {
        setFile(selected);
        setStatus("idle");
        setErrorMessage("");
      } else {
        setStatus("error");
        setErrorMessage("Please select a valid .zip extension archive.");
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = e.target.files[0];
      if (selected.name.toLowerCase().endsWith(".zip")) {
        setFile(selected);
        setStatus("idle");
        setErrorMessage("");
      } else {
        setStatus("error");
        setErrorMessage("Please select a valid .zip extension archive.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setStatus("error");
      setErrorMessage("Please select or drop a .zip file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    setStatus("converting");
    setErrorMessage("");

    try {
      const response = await fetch("/api/convert", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Conversion failed on the server.");
      }

      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = file.name.replace(/\.zip$/i, ".rbz");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);

      setStatus("success");
    } catch (err) {
      console.error("Conversion error:", err);
      setStatus("error");
      setErrorMessage(
        err.message || "An unexpected error occurred during conversion."
      );
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Tool Main Card */}
      <div className="relative rounded-[28px] bg-surface/80 border border-line p-6 sm:p-10 shadow-2xl backdrop-blur-md mb-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-raised border border-line text-xs font-mono text-action mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-action animate-pulse" />
              SKETCHUP EXTENSION PACKAGER
            </div>
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-fg font-sans mb-3">
              ZIP to RBZ <span className="text-action">Converter</span>
            </h1>
            <p className="text-sm sm:text-base text-fg-secondary leading-relaxed">
              Convert compressed extension zip files into native SketchUp{" "}
              <span className="font-mono text-fg">.rbz</span> packages ready
              for one-click installation via Extension Manager.
            </p>
          </div>

          {/* Form & Drop Zone */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <input
              ref={fileInputRef}
              type="file"
              name="file"
              accept=".zip,application/zip"
              onChange={handleFileChange}
              className="hidden"
            />

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center cursor-pointer transition-all duration-300 ${
                isDragging
                  ? "border-action bg-action/10 scale-[1.01]"
                  : file
                  ? "border-line-strong bg-surface-raised/80 hover:border-action"
                  : "border-line hover:border-line-control bg-canvas/40 hover:bg-canvas/60"
              }`}
            >
              <div className="flex flex-col items-center justify-center gap-3">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
                    file
                      ? "bg-action/20 text-action"
                      : "bg-surface-raised text-fg-secondary"
                  }`}
                >
                  {file ? (
                    <FiFile className="w-7 h-7" />
                  ) : (
                    <FiUploadCloud className="w-7 h-7" />
                  )}
                </div>

                {file ? (
                  <div className="text-center">
                    <p className="text-sm font-semibold text-fg break-all font-mono">
                      {file.name}
                    </p>
                    <p className="text-xs text-fg-secondary font-mono mt-1">
                      {formatFileSize(file.size)} &bull; Ready to convert
                    </p>
                    <span className="inline-block mt-3 text-xs text-action hover:underline">
                      Click or drop another file to change
                    </span>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-base font-medium text-fg">
                      Drop your <span className="font-mono text-action">.zip</span> file here, or{" "}
                      <span className="text-action underline underline-offset-4">browse</span>
                    </p>
                    <p className="text-xs text-fg-secondary mt-1.5 font-mono">
                      Supports all standard SketchUp Ruby plugin archives
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Status messages */}
            {status === "error" && (
              <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-danger/10 border border-danger/30 text-danger text-xs font-mono">
                <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage || "An error occurred."}</span>
              </div>
            )}

            {status === "success" && (
              <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-action/10 border border-action/30 text-action text-xs font-mono">
                <FiCheckCircle className="w-4 h-4 flex-shrink-0" />
                <span>
                  Converted successfully! Your download has started automatically.
                </span>
              </div>
            )}

            {/* Action Button */}
            <button
              type="submit"
              disabled={status === "converting" || !file}
              className={`w-full py-3.5 px-6 rounded-full font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-lg ${
                status === "converting" || !file
                  ? "bg-surface-raised text-fg-secondary/50 border border-line cursor-not-allowed"
                  : "bg-action hover:bg-action-hover active:bg-action-pressed text-canvas shadow-action/20 hover:scale-[1.01] cursor-pointer"
              }`}
            >
              {status === "converting" ? (
                <>
                  <div className="w-4 h-4 border-2 border-canvas border-t-transparent rounded-full animate-spin" />
                  <span>Converting Archive...</span>
                </>
              ) : (
                <>
                  <FiDownload className="w-4 h-4" />
                  <span>
                    Convert &amp; Download .RBZ
                  </span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Guide Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-surface/60 border border-line flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-7 h-7 rounded-lg bg-surface-raised border border-line flex items-center justify-center font-mono text-xs text-action font-bold">
              1
            </span>
            <h3 className="text-sm font-semibold text-fg">Prepare Zip</h3>
          </div>
          <p className="text-xs text-fg-secondary leading-relaxed">
            Ensure your extension folder and root <code className="font-mono text-fg">.rb</code> loader file are zipped directly into the archive without an extra outer directory.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-surface/60 border border-line flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-7 h-7 rounded-lg bg-surface-raised border border-line flex items-center justify-center font-mono text-xs text-action font-bold">
              2
            </span>
            <h3 className="text-sm font-semibold text-fg">Convert to RBZ</h3>
          </div>
          <p className="text-xs text-fg-secondary leading-relaxed">
            Upload the archive above. Our converter checks the header integrity and packages the archive as a valid SketchUp Extension archive.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-surface/60 border border-line flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-7 h-7 rounded-lg bg-surface-raised border border-line flex items-center justify-center font-mono text-xs text-action font-bold">
              3
            </span>
            <h3 className="text-sm font-semibold text-fg">Install in SketchUp</h3>
          </div>
          <p className="text-xs text-fg-secondary leading-relaxed">
            In SketchUp, go to <span className="text-fg font-medium">Extensions &gt; Extension Manager</span>, click &quot;Install Extension&quot;, and select your downloaded .rbz.
          </p>
        </div>
      </div>
    </div>
  );
}

