'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Terminal from '@/components/Terminal';
import UploadZone from '@/components/UploadZone';
import ProgressBar from '@/components/ProgressBar';
import ResultBlock from '@/components/ResultBlock';
import Toast from '@/components/Toast';
import Link from 'next/link';

interface UploadResult {
  success: boolean;
  download_url: string;
  wget: string;
  curl: string;
  filename: string;
}

export default function Home() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [typedText, setTypedText] = useState('');
  const fullText = 'user@machine:~$ shDrop start';

  // Animation typing effect
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 50);

    return () => clearInterval(timer);
  }, []);

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
  };

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Simuler une progression d'upload
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de l\'upload');
      }

      const result: UploadResult = await response.json();

      // Attendre un peu pour montrer la progression à 100%
      setTimeout(() => {
        setUploadResult(result);
        setIsUploading(false);
      }, 500);

    } catch (error) {
      console.error('Upload error:', error);
      showToastMessage(`✖ Erreur: ${error instanceof Error ? error.message : 'Upload échoué'}`);
      setIsUploading(false);
      setUploadProgress(0);
      setSelectedFile(null);
    }
  };

  return (
    <Terminal>
      {/* Header avec animation typing */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-8"
      >
        <div className="flex items-center gap-1 text-sm">
          <span className="text-[#00ff99]">{typedText}</span>
          {typedText.length < fullText.length && (
            <span className="inline-block w-2 h-4 bg-[#00ff99] cursor-blink" />
          )}
        </div>
      </motion.div>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mb-8 flex items-center gap-4 text-sm"
      >
        <Link
          href="/"
          className="text-[#00ff99] hover:text-[#33ccff] transition-colors"
        >
          [Home]
        </Link>
        <Link
          href="/about"
          className="text-[#666666] hover:text-[#00ff99] transition-colors"
        >
          [About]
        </Link>
      </motion.div>

      {/* Zone d'upload ou résultats */}
      {!uploadResult && !isUploading && (
        <UploadZone onFileSelect={handleFileSelect} disabled={isUploading} />
      )}

      {isUploading && (
        <ProgressBar
          progress={uploadProgress}
          filename={selectedFile?.name}
        />
      )}

      {uploadResult && (
        <ResultBlock
          downloadUrl={uploadResult.download_url}
          wgetCommand={uploadResult.wget}
          curlCommand={uploadResult.curl}
          onShowToast={showToastMessage}
        />
      )}

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-12 pt-8 border-t border-[#00ff99]/10 text-xs text-[#666666] text-center"
      >
        <p>Upload. Fetch. Done.</p>
        <p className="mt-2">
          Built with Next.js + TypeScript + TailwindCSS
        </p>
      </motion.div>

      {/* Toast notifications */}
      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </Terminal>
  );
}
