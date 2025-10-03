
import React from 'react';
import { Spinner } from './Spinner';
import { DownloadIcon } from './icons';

interface ResultDisplayProps {
  isLoading: boolean;
  generatedImageUrl: string | null;
  error: string | null;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ isLoading, generatedImageUrl, error }) => {
  const loadingMessages = [
    "匠心绘制中，请稍候...",
    "正在调制釉料，注入灵魂...",
    "精描细染，色彩渐活...",
    " kiln is firing, art is forming...",
    "最后一道工序，光泽即将呈现...",
  ];
  const [message, setMessage] = React.useState(loadingMessages[0]);

  React.useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setMessage(prev => {
          const currentIndex = loadingMessages.indexOf(prev);
          const nextIndex = (currentIndex + 1) % loadingMessages.length;
          return loadingMessages[nextIndex];
        });
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  return (
    <div className="flex-grow flex flex-col items-center justify-center bg-stone-100 rounded-lg p-4 w-full h-full min-h-[300px]">
      {isLoading && (
        <div className="text-center">
          <Spinner />
          <p className="mt-4 text-stone-600">{message}</p>
        </div>
      )}
      {error && !isLoading && (
        <div className="text-center text-red-600">
          <p>哎呀，出错了！</p>
          <p className="text-sm mt-2">{error}</p>
        </div>
      )}
      {!isLoading && !error && generatedImageUrl && (
        <div className="w-full flex flex-col items-center space-y-4">
          <img src={generatedImageUrl} alt="上色后的作品" className="max-w-full max-h-[400px] object-contain rounded-md shadow-lg" />
           <a
            href={generatedImageUrl}
            download="fencai-artwork.png"
            className="inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-300 shadow-md"
          >
            <DownloadIcon className="w-5 h-5 mr-2" />
            下载作品
          </a>
        </div>
      )}
      {!isLoading && !error && !generatedImageUrl && (
         <div className="text-center text-stone-500">
            <p className="text-lg">您的AI粉彩作品将在此处展示</p>
            <p className="text-sm mt-2">上传线稿，开始您的创作之旅</p>
         </div>
      )}
    </div>
  );
};
