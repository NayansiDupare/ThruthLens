import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileImage, X } from 'lucide-react';

export default function FileUpload({ file, setFile }) {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles?.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, [setFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/webp': []
    },
    maxFiles: 1
  });

  if (file) {
    return (
      <div className="relative border-2 border-primary/50 bg-primary/5 rounded-xl p-6 flex flex-col items-center justify-center min-h-[200px]">
        <button 
          onClick={() => setFile(null)}
          className="absolute top-4 right-4 bg-darkCard p-2 rounded-full hover:bg-danger/20 hover:text-danger transition-colors border border-slate-700"
        >
          <X className="w-4 h-4" />
        </button>
        <FileImage className="w-16 h-16 text-primary mb-4" />
        <p className="font-medium text-textMain max-w-full truncate px-8 text-center">{file.name}</p>
        <p className="text-sm text-textMuted mt-2">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
      </div>
    );
  }

  return (
    <div 
      {...getRootProps()} 
      className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center min-h-[300px] cursor-pointer transition-colors ${
        isDragActive ? 'border-primary bg-primary/10' : 'border-slate-700 bg-darkCard hover:bg-slate-800'
      }`}
    >
      <input {...getInputProps()} />
      <div className="w-20 h-20 rounded-full bg-darkBg flex items-center justify-center mb-6 shadow-lg border border-slate-700">
        <UploadCloud className="w-10 h-10 text-primary" />
      </div>
      <p className="text-xl font-medium text-textMain mb-2">Drag & drop image here</p>
      <p className="text-textMuted text-sm text-center mb-6">
        Supports JPG, PNG, WebP up to 10MB
      </p>
      <button className="px-6 py-2 bg-darkBg border border-slate-600 rounded-full text-sm font-medium hover:border-primary hover:text-primary transition-colors">
        Browse Files
      </button>
      <p className="text-xs text-textMuted mt-6 flex items-center gap-1 opacity-70">
        <span className="inline-block w-1.5 h-1.5 bg-primary rounded-full"></span>
        Image text will be extracted via OCR automatically
      </p>
    </div>
  );
}
