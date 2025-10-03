
import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { ResultDisplay } from './components/ResultDisplay';
import { colorizeImage } from './services/geminiService';
import { fileToBase64 } from './utils/fileUtils';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

const App: React.FC = () => {
  const [lineDrawingFile, setLineDrawingFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const initialPrompt = `你是一位来自景德镇的粉彩瓷器手绘上色大师。请为这张线稿上色。上色风格要求严格遵循传统粉彩工艺：色彩要极为丰富、柔和且雅致。颜色的过渡必须非常细腻、自然，如同水彩般晕染开。最终的成品需要有玻璃质感的光泽，色彩水润通透，仿佛釉下的色彩在流动。请展现出粉彩'玻璃白'打底后，色彩的粉润、柔和之美。`;
  const [prompt, setPrompt] = useState<string>(initialPrompt);

  const handleImageUpload = useCallback((file: File) => {
    setLineDrawingFile(file);
    setGeneratedImageUrl(null);
    setError(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(URL.createObjectURL(file));
  }, [previewUrl]);

  const handleSubmit = async () => {
    if (!lineDrawingFile) {
      setError('请先上传一张线稿图片。');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImageUrl(null);

    try {
      const { base64, mimeType } = await fileToBase64(lineDrawingFile);
      const coloredImageBase64 = await colorizeImage(base64, mimeType, prompt);
      
      if (coloredImageBase64) {
        setGeneratedImageUrl(`data:image/png;base64,${coloredImageBase64}`);
      } else {
        setError('未能生成图片，请稍后重试。');
      }

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : '上色过程中发生未知错误。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel: Input */}
          <div className="bg-white rounded-xl shadow-lg border border-stone-200 p-6 flex flex-col space-y-6">
            <h2 className="text-2xl font-semibold text-stone-700 border-b pb-3">第一步：上传线稿</h2>
            <ImageUploader onImageUpload={handleImageUpload} previewUrl={previewUrl} />
            
            <h2 className="text-2xl font-semibold text-stone-700 border-b pb-3 pt-4">第二步：确认上色要求</h2>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={8}
              className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 text-stone-600 leading-relaxed"
              placeholder="描述您的上色要求..."
            />
            
            <button
              onClick={handleSubmit}
              disabled={isLoading || !lineDrawingFile}
              className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300 disabled:bg-stone-400 disabled:cursor-not-allowed flex items-center justify-center shadow-md hover:shadow-lg"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  上色中...
                </>
              ) : (
                '开始上色'
              )}
            </button>
          </div>

          {/* Right Panel: Output */}
          <div className="bg-white rounded-xl shadow-lg border border-stone-200 p-6 flex flex-col">
            <h2 className="text-2xl font-semibold text-stone-700 border-b pb-3 mb-6">第三步：欣赏作品</h2>
            <ResultDisplay
              isLoading={isLoading}
              generatedImageUrl={generatedImageUrl}
              error={error}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
