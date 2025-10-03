
import React, { useCallback, useState } from 'react';
import { UploadIcon } from './icons';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  previewUrl: string | null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, previewUrl }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (files: FileList | null) => {
    if (files && files[0]) {
      onImageUpload(files[0]);
    }
  };

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);
  
  const handleDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);


  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  }, [onImageUpload]);

  return (
    <div className="w-full">
      <label
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`flex justify-center items-center w-full h-64 px-4 transition bg-white border-2 border-dashed rounded-md appearance-none cursor-pointer hover:border-blue-400 focus:outline-none ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-stone-300'}`}
      >
        {previewUrl ? (
          <img src={previewUrl} alt="线稿预览" className="max-w-full max-h-full object-contain rounded-md" />
        ) : (
          <span className="flex flex-col items-center space-y-2">
            <UploadIcon className="w-12 h-12 text-stone-400" />
            <span className="font-medium text-stone-500">
              将线稿文件拖拽至此，或
              <span className="text-blue-600 underline ml-1">点击上传</span>
            </span>
             <span className="text-xs text-stone-400">支持 PNG, JPG, WEBP 等格式</span>
          </span>
        )}
        <input
          type="file"
          name="file_upload"
          className="hidden"
          accept="image/png, image/jpeg, image/webp"
          onChange={(e) => handleFileChange(e.target.files)}
        />
      </label>
    </div>
  );
};
