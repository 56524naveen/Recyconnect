import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import { Camera, X, Check, Loader2, ArrowLeft } from 'lucide-react';
import { API_BASE } from '../../types';

export default function CaptureImage() {
  const navigate = useNavigate();
  const webcamRef = useRef<Webcam>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isClassifying, setIsClassifying] = useState(false);
  const [result, setResult] = useState<{ category: string, confidence: number } | null>(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setImageSrc(imageSrc);
    }
  }, [webcamRef]);

  const retake = () => {
    setImageSrc(null);
    setResult(null);
  };

  const processImage = async () => {
    if (!imageSrc) return;
    setIsClassifying(true);
    
    try {
      const res = await fetch(`${API_BASE}/ai/classify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: imageSrc })
      });
      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error(error);
      setResult({ category: 'Unknown', confidence: 0 });
    } finally {
      setIsClassifying(false);
    }
  };

  const confirmClassification = () => {
    // Navigate to lot details and pass data
    navigate('/collector/lot/new', { 
      state: { 
        image: imageSrc, 
        category: result?.category,
        confidence: result?.confidence 
      } 
    });
  };

  return (
    <div className="h-[100dvh] bg-black flex flex-col relative">
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-20 bg-gradient-to-b from-black/50 to-transparent">
        <button onClick={() => navigate('/collector')} className="p-2 bg-black/40 rounded-full text-white">
          <ArrowLeft className="w-6 h-6" />
        </button>
      </div>

      {!imageSrc ? (
        <div className="flex-1 relative flex flex-col justify-end">
          {/* @ts-ignore */}
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{ facingMode: 'environment' }}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="relative z-10 pb-12 flex justify-center w-full">
            <button 
              onClick={capture}
              className="w-20 h-20 bg-white rounded-full border-4 border-gray-300 flex items-center justify-center active:scale-95 transition shadow-2xl"
            >
              <div className="w-16 h-16 bg-white rounded-full border border-gray-200 shadow-inner"></div>
            </button>
          </div>
          <div className="absolute bottom-32 w-full text-center z-10">
            <p className="text-white text-xl font-medium drop-shadow-md bg-black/30 inline-block px-4 py-2 rounded-full backdrop-blur-sm">ई-वेस्ट की फोटो लें</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col">
          <div className="flex-1 relative">
            <img src={imageSrc} className="w-full h-full object-cover" alt="Captured" />
            
            {isClassifying && (
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center backdrop-blur-sm">
                <Loader2 className="w-16 h-16 text-green-500 animate-spin mb-4" />
                <h3 className="text-white text-2xl font-bold">हम पहचान रहे हैं...</h3>
                <p className="text-gray-300 mt-2">AI is analyzing material</p>
              </div>
            )}

            {result && (
              <div className="absolute inset-x-0 bottom-0 bg-white rounded-t-3xl p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.2)] animate-in slide-in-from-bottom-10">
                <div className="text-center mb-6">
                  <p className="text-sm text-gray-500 mb-1">AI Prediction</p>
                  <h2 className="text-4xl font-bold text-gray-900">{result.category}</h2>
                  <p className={`text-lg mt-2 font-medium ${result.confidence > 0.8 ? 'text-green-600' : 'text-orange-500'}`}>
                    {Math.round(result.confidence * 100)}% Confidence
                  </p>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={retake}
                    className="flex-1 py-4 bg-gray-100 text-gray-700 rounded-2xl font-bold text-lg flex items-center justify-center"
                  >
                    <X className="w-6 h-6 mr-2" /> बदलें (Retake)
                  </button>
                  <button 
                    onClick={confirmClassification}
                    className="flex-1 py-4 bg-green-600 text-white rounded-2xl font-bold text-lg flex items-center justify-center shadow-lg shadow-green-200"
                  >
                    <Check className="w-6 h-6 mr-2" /> सही है (Correct)
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {!isClassifying && !result && (
            <div className="absolute bottom-0 w-full p-6 flex justify-between bg-black/60 backdrop-blur-md">
               <button onClick={retake} className="px-6 py-3 text-white text-lg font-medium">Retake</button>
               <button onClick={processImage} className="px-6 py-3 bg-white text-black rounded-full text-lg font-bold shadow-lg">Process Image →</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
