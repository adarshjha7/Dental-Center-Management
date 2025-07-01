import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  File,
  Image,
  X,
  Download,
  FileText,
  AlertCircle,
} from "lucide-react";
import { AppointmentFile } from "../types";
import { toast } from "@/hooks/use-toast";

interface FileUploadProps {
  files: AppointmentFile[];
  onFilesChange: (files: AppointmentFile[]) => void;
  maxFiles?: number;
  maxSizePerFile?: number; // in MB
  acceptedTypes?: string[];
}

export const FileUpload: React.FC<FileUploadProps> = ({
  files,
  onFilesChange,
  maxFiles = 5,
  maxSizePerFile = 10,
  acceptedTypes = ["image/*", ".pdf", ".doc", ".docx"],
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const fileArray = Array.from(selectedFiles);

    // Check file count limit
    if (files.length + fileArray.length > maxFiles) {
      toast({
        title: "Too many files",
        description: `Maximum ${maxFiles} files allowed`,
        variant: "destructive",
      });
      return;
    }

    Promise.all(
      fileArray.map((file) => {
        return new Promise<AppointmentFile | null>((resolve) => {
          // Check file size
          if (file.size > maxSizePerFile * 1024 * 1024) {
            toast({
              title: "File too large",
              description: `${file.name} exceeds ${maxSizePerFile}MB limit`,
              variant: "destructive",
            });
            resolve(null);
            return;
          }

          const reader = new FileReader();
          reader.onload = () => {
            const base64Data = reader.result as string;
            const appointmentFile: AppointmentFile = {
              id: Date.now().toString() + Math.random().toString(36),
              name: file.name,
              type: file.type,
              size: file.size,
              data: base64Data,
              uploadedAt: new Date().toISOString(),
            };
            resolve(appointmentFile);
          };
          reader.onerror = () => {
            toast({
              title: "Upload failed",
              description: `Failed to read ${file.name}`,
              variant: "destructive",
            });
            resolve(null);
          };
          reader.readAsDataURL(file);
        });
      }),
    ).then((results) => {
      const validFiles = results.filter(
        (file): file is AppointmentFile => file !== null,
      );
      onFilesChange([...files, ...validFiles]);

      if (validFiles.length > 0) {
        toast({
          title: "Files uploaded",
          description: `${validFiles.length} file(s) uploaded successfully`,
        });
      }
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const removeFile = (fileId: string) => {
    onFilesChange(files.filter((file) => file.id !== fileId));
    toast({
      title: "File removed",
      description: "File has been removed successfully",
    });
  };

  const downloadFile = (file: AppointmentFile) => {
    try {
      // Create a blob from base64 data to avoid security issues
      const base64Data = file.data.split(",")[1] || file.data;
      const binaryString = atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);

      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const blob = new Blob([bytes], { type: file.type });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = file.name;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the object URL
      setTimeout(() => URL.revokeObjectURL(url), 100);

      toast({
        title: "Download started",
        description: `Downloading ${file.name}`,
      });
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Download failed",
        description: "Failed to download file",
        variant: "destructive",
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) {
      return <Image className="h-4 w-4" />;
    } else if (fileType.includes("pdf")) {
      return <FileText className="h-4 w-4 text-red-600" />;
    } else {
      return <File className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">File Attachments</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              isDragging
                ? "border-primary bg-primary/5"
                : "border-gray-300 hover:border-gray-400"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-sm text-gray-600 mb-2">
              Drag and drop files here, or click to select
            </p>
            <p className="text-xs text-gray-500 mb-4">
              Support for images, PDFs, Word documents (max {maxSizePerFile}MB
              each)
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={files.length >= maxFiles}
            >
              <Upload className="mr-2 h-4 w-4" />
              Select Files
            </Button>
            <Input
              ref={fileInputRef}
              type="file"
              multiple
              accept={acceptedTypes.join(",")}
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
            />
          </div>

          {/* File Limits Info */}
          <div className="mt-2 flex items-center text-xs text-gray-500">
            <AlertCircle className="h-3 w-3 mr-1" />
            {files.length}/{maxFiles} files • Max {maxSizePerFile}MB per file
          </div>
        </CardContent>
      </Card>

      {/* File List */}
      {files.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">
              Uploaded Files ({files.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3 flex-1">
                    {getFileIcon(file.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span>{formatFileSize(file.size)}</span>
                        <span>•</span>
                        <span>
                          {new Date(file.uploadedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="text-xs">
                      {file.type.split("/")[1]?.toUpperCase() || "FILE"}
                    </Badge>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => downloadFile(file)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(file.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
