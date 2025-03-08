import React from 'react';
import { Button } from './button';
import { Input } from './input';
import { cn } from '../../lib/utils';

interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  onFile?: (file: File) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ 
  value, 
  onChange,
  onFile 
}) => {
  const fileRef = React.useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = React.useState(false);

  const handleClick = () => {
    fileRef.current?.click();
  };

  const handleFiles = (files: FileList | null) => {
    if (!files?.length) return;
    
    const file = files[0];
    if (onFile) {
      onFile(file);
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      onChange(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="text-center mb-2">Photo</div>
      <div 
        className="w-full flex items-center justify-center"
        onDragEnter={handleDrag}
      >
        {value ? (
          <div className="relative w-32 h-32">
            <img
              src={value}
              alt="Upload"
              className="w-full h-full object-cover rounded-md"
            />
          </div>
        ) : (
          <div 
            onClick={handleClick}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={cn(
              "flex flex-col items-center justify-center w-64 h-32 border-2 border-dashed rounded-md cursor-pointer transition",
              dragActive 
                ? "border-primary bg-primary/10" 
                : "border-gray-300 hover:border-gray-400"
            )}
          >
            <span className="text-sm text-gray-600">
              {dragActive ? "Drop image here" : "Drag and drop or click to upload"}
            </span>
          </div>
        )}
      </div>
      <Input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      {value && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleClick}
        >
          Change Image
        </Button>
      )}
    </div>
  );
};
