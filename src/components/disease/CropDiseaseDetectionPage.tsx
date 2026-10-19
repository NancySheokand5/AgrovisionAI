import React, { useState, useRef, useEffect } from 'react';
import {
  ScanLine,
  Upload,
  Camera,
  X,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Volume2,
  VolumeX,
  FileDown,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Info,
  Bug,
  ShieldAlert,
  Calendar,
  AlertCircle
} from 'lucide-react';
import type { CropDiseaseResult, SampleLeaf } from '../../types/cropDisease';
import {
  SAMPLE_LEAVES,
  predictCropDisease,
  validateImageFile,
  sampleToBlob
} from '../../services/cropDiseaseService';

interface CropDiseaseDetectionPageProps {
  onBackToDashboard: () => void;
  onNavigateToRecommendation?: () => void;
  onNavigateToMandi?: () => void;
}

export const CropDiseaseDetectionPage: React.FC<CropDiseaseDetectionPageProps> = ({
  onBackToDashboard,
  onNavigateToRecommendation,
  onNavigateToMandi
}) => {
  const [selectedFile, setSelectedFile] = useState<File | Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<CropDiseaseResult | null>(null);

  // Camera state
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Audio SpeechSynthesis
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Cleanup camera stream
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
    setCameraError(null);
  };

  useEffect(() => {
    return () => {
      stopCamera();
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleFileSelection = (file: File | Blob, customName?: string) => {
    const error = validateImageFile(file);
    if (error) {
      setErrorMsg(error);
      return;
    }

    setErrorMsg(null);
    setSelectedFile(file);
    setFileName(customName || (file as File).name || 'leaf_specimen.jpg');

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleSampleClick = (sample: SampleLeaf) => {
    const blob = sampleToBlob(sample);
    setSelectedFile(blob);
    setFileName(sample.fileName);
    setPreviewUrl(sample.dataUrl);
    setErrorMsg(null);
  };

  const startCamera = async () => {
    setCameraError(null);
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      setCameraError('Camera access denied or unavailable. Please upload a photo from your files.');
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          handleFileSelection(blob, `camera_capture_${Date.now()}.jpg`);
          stopCamera();
        }
      }, 'image/jpeg', 0.9);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setErrorMsg('Please upload or capture a crop leaf image first.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const diagnosis = await predictCropDisease(selectedFile, previewUrl || undefined);
      setResult(diagnosis);
      window.scrollTo({ top: 400, behavior: 'smooth' });
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Diagnosis analysis failed. Please try a clearer leaf photo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setFileName('');
    setResult(null);
    setErrorMsg(null);
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleSpeech = () => {
    if (!result || !('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const text = `Crop Disease Diagnosis: ${result.disease} on ${result.crop}. Severity is ${result.severity}. ${result.summary}. Immediate action: ${result.treatment_plan?.immediate?.join('. ') || ''}`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const getSeverityBadgeClass = (severity: string) => {
    switch (severity) {
      case 'None':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Low':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Moderate':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'High':
      case 'Severe':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* ── Header Banner ── */}
      <div className="bg-gradient-to-r from-teal-900 via-emerald-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 text-xs font-semibold backdrop-blur-xs border border-emerald-400/30">
              <ScanLine className="w-3.5 h-3.5" />
              <span>Feature 2 · AI Foliar Pathology</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              AI Crop Disease Detection
            </h1>
            <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed">
              Upload or photograph an affected crop leaf to instantly diagnose fungal, bacterial, or viral pathogens with actionable treatment protocols.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onBackToDashboard}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-xs border border-white/20"
            >
              ← Back to Dashboard
            </button>
            {onNavigateToRecommendation && (
              <button
                onClick={onNavigateToRecommendation}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md flex items-center gap-1.5"
              >
                <span>Crop Recommendation</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── 1-Click Test Leaf Samples ── */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>1-Click Test Leaf Samples (Instant Diagnosis Demo)</span>
          </div>
          <span className="text-xs text-slate-500 hidden sm:inline">Tap to test immediately</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {SAMPLE_LEAVES.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => handleSampleClick(sample)}
              className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all text-left group bg-slate-50/60"
            >
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-800 flex-shrink-0 border border-slate-300">
                <img src={sample.dataUrl} alt={sample.name} className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-800 truncate">
                  {sample.name}
                </div>
                <div className="text-[11px] text-slate-600 truncate">{sample.disease}</div>
                <span className={`inline-block text-[10px] font-semibold px-2 py-0.2 rounded-full border mt-1 ${sample.badgeColor}`}>
                  {sample.badge}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Main Upload & Scanner Interface ── */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Upload or Capture Leaf Photo</h2>
            <p className="text-xs text-slate-600">Take a clear close-up of the affected leaf in good lighting</p>
          </div>
          <div className="text-xs text-slate-600 hidden sm:block">
            Supports: JPG, JPEG, PNG, WEBP (Max 8MB)
          </div>
        </div>

        {/* Live Camera Viewfinder Modal */}
        {isCameraActive && (
          <div className="bg-slate-900 rounded-2xl p-4 text-white space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Camera Scanner
              </span>
              <button
                type="button"
                onClick={stopCamera}
                className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {cameraError ? (
              <div className="p-4 rounded-xl bg-rose-900/50 border border-rose-700 text-rose-200 text-xs">
                {cameraError}
              </div>
            ) : (
              <div className="relative aspect-video max-h-72 mx-auto rounded-xl overflow-hidden bg-black flex items-center justify-center">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                <div className="absolute inset-8 border-2 border-emerald-400/50 rounded-lg pointer-events-none border-dashed" />
              </div>
            )}

            {!cameraError && (
              <div className="flex justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={capturePhoto}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg flex items-center gap-2"
                >
                  <Camera className="w-4 h-4" />
                  <span>Capture Photo</span>
                </button>
                <button
                  type="button"
                  onClick={stopCamera}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}

        {/* Upload Dropzone / Image Preview */}
        {!isCameraActive && (
          <div>
            {previewUrl ? (
              <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="w-36 h-36 rounded-xl overflow-hidden bg-slate-900 flex-shrink-0 border border-slate-300 relative shadow-sm">
                  <img src={previewUrl} alt="Leaf Preview" className="w-full h-full object-cover" />
                  <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-md bg-black/70 text-white text-[10px] font-semibold">
                    Specimen Preview
                  </span>
                </div>

                <div className="space-y-3 flex-1 text-center sm:text-left">
                  <div>
                    <div className="text-sm font-bold text-slate-900 break-all">{fileName}</div>
                    <div className="text-xs text-slate-500 mt-0.5">Ready for AI foliar analysis</div>
                  </div>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3.5 py-1.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-white transition-colors"
                    >
                      Change Photo
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        setPreviewUrl(null);
                        setFileName('');
                      }}
                      className="px-3.5 py-1.5 rounded-lg border border-rose-200 text-rose-700 text-xs font-semibold hover:bg-rose-50 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all ${
                  isDragOver
                    ? 'border-emerald-500 bg-emerald-50/50'
                    : 'border-slate-300 hover:border-emerald-400 bg-slate-50/40'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileSelection(e.target.files[0]);
                    }
                  }}
                />

                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3 shadow-xs">
                  <Upload className="w-7 h-7" />
                </div>
                <div className="text-sm font-bold text-slate-800">
                  Drag & drop your leaf photo here, or browse files
                </div>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5">
                  Ensure the leaf is in focus with natural lighting. Clear images produce the highest diagnosis accuracy.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md transition-all flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload Leaf Photo</span>
                  </button>
                  <button
                    type="button"
                    onClick={startCamera}
                    className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs shadow-xs transition-all flex items-center gap-2"
                  >
                    <Camera className="w-4 h-4 text-emerald-600" />
                    <span>Use Camera</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Error Notification Banner */}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">Photo Error:</strong> {errorMsg}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {result && (
            <button
              type="button"
              onClick={handleReset}
              className="px-5 py-3 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-100 transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reset Scanner</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleAnalyze}
            disabled={!selectedFile || isLoading}
            className="px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/30 transition-all flex items-center gap-2.5 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Analyzing Leaf Pathology...</span>
              </>
            ) : (
              <>
                <ScanLine className="w-4 h-4" />
                <span>Analyze Crop Leaf</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Diagnosis Result Presentation ── */}
      {result && (
        <section className="space-y-6 pt-2 animate-fadeIn" id="disease-result-section">
          
          {/* Low Confidence Alert if score < 55 */}
          {result.confidence < 55 && (
            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm">Low Confidence Detection ({result.confidence}%)</h4>
                  <p className="text-xs text-amber-800 mt-0.5">
                    The photo may be blurry, dimly lit, or taken too far away. We recommend retrying with a sharper close-up.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold whitespace-nowrap shadow-xs"
              >
                Upload Clearer Photo
              </button>
            </div>
          )}

          {/* Primary Diagnosis Hero Card */}
          <div className="bg-gradient-to-br from-white to-slate-50/80 rounded-3xl border-2 border-slate-200 p-6 sm:p-8 shadow-xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
              <div className="flex items-start sm:items-center gap-5">
                {result.imageData ? (
                  <div className="w-24 h-24 rounded-2xl overflow-hidden border border-slate-300 shadow-md bg-slate-900 flex-shrink-0">
                    <img src={result.imageData} alt={result.disease} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-3xl flex-shrink-0">
                    🌿
                  </div>
                )}

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Crop: {result.crop}
                    </span>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getSeverityBadgeClass(result.severity)}`}>
                      {result.severity} Severity
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {result.disease}
                  </h2>
                  <div className="text-xs text-slate-500 font-medium">
                    Diagnostic Certainty: <strong>{result.confidence}%</strong>
                  </div>
                </div>
              </div>

              {/* Speech & Report Controls */}
              <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
                {'speechSynthesis' in window && (
                  <button
                    type="button"
                    onClick={toggleSpeech}
                    className={`px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all ${
                      isSpeaking
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-md animate-pulse'
                        : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
                    <span>{isSpeaking ? 'Stop Audio' : 'Listen Guidance'}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold flex items-center gap-2 transition-all"
                >
                  <FileDown className="w-4 h-4 text-slate-600" />
                  <span>Print Report</span>
                </button>
              </div>
            </div>

            {/* Confidence Bar */}
            <div className="py-4 border-b border-slate-100 space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>Pathogen Identification Confidence</span>
                <span className="text-emerald-700 font-bold">{result.confidence}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    result.confidence >= 80 ? 'bg-emerald-600' : result.confidence >= 55 ? 'bg-amber-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${result.confidence}%` }}
                />
              </div>
              {result.confidence_message && (
                <div className="text-xs text-slate-500 italic pt-1">{result.confidence_message}</div>
              )}
            </div>

            {/* What We Found Summary */}
            <div className="pt-5 space-y-2">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Info className="w-4 h-4 text-emerald-600" />
                What We Found (Agronomic Evaluation)
              </h3>
              <p className="text-sm text-slate-800 leading-relaxed bg-white p-4 rounded-xl border border-slate-200/80">
                {result.summary}
              </p>
            </div>
          </div>

          {/* ── Symptoms & Causes (2 Columns) ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Symptoms */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Bug className="w-4 h-4 text-amber-600" />
                <span>Observed Symptoms</span>
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-700">
                {result.symptoms.map((sym, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                    <span>{sym}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Causes */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>Possible Underlying Causes</span>
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-700">
                {result.possible_causes.map((cause, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 flex-shrink-0" />
                    <span>{cause}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── Phased Treatment Guidance ── */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Recommended Treatment Guidance</h3>
                <p className="text-xs text-slate-500">Phased chemical, biological, and physical field interventions</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {/* Immediate */}
              <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/40 space-y-2">
                <div className="flex items-center gap-2 text-rose-800 font-bold text-xs uppercase tracking-wide">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Immediate (Day 1)</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {result.treatment_plan.immediate.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-rose-500 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommended Sprays */}
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wide">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Spray Guidance</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {result.treatment_plan.guidance.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Follow-up */}
              <div className="p-4 rounded-xl border border-teal-200 bg-teal-50/40 space-y-2">
                <div className="flex items-center gap-2 text-teal-800 font-bold text-xs uppercase tracking-wide">
                  <Calendar className="w-4 h-4" />
                  <span>Follow-up (7-10 Days)</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {result.treatment_plan.followup.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-teal-600 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* ── Prevention Habits ── */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Long-Term Prevention & Field Habits</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {result.prevention.map((prev, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-700 flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px] flex items-center justify-center flex-shrink-0">
                    {idx + 1}
                  </span>
                  <span>{prev}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Footer Navigation ── */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200">
            {onNavigateToMandi && (
              <button
                onClick={onNavigateToMandi}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors"
              >
                View Mandi Prices
              </button>
            )}

            <button
              onClick={handleReset}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors ml-auto shadow-md"
            >
              Scan Another Crop Leaf
            </button>
          </div>

          {/* Disclaimer */}
          <p className="text-[11px] text-slate-500 text-center leading-relaxed max-w-3xl mx-auto">
            {result.disclaimer || 'AI-generated disease results are informational advisories. For high-value crops, verify with your local agricultural officer.'}
          </p>
        </section>
      )}
    </div>
  );
};
