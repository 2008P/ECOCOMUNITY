import React, { useState, useRef, useEffect } from 'react';
import { ClassificationResult, MaterialCategory } from '../types';
import { LazySection } from './LazySection';
import {
  Camera,
  Barcode,
  Upload,
  Sparkles,
  ArrowRight,
  RotateCcw,
  AlertCircle,
  Coins,
  Leaf,
  Scale,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';

interface ScannerViewProps {
  onClassificationSuccess: (result: ClassificationResult) => void;
  onNavigateToMap: (categoria?: string) => void;
}

export const ScannerView: React.FC<ScannerViewProps> = ({
  onClassificationSuccess,
  onNavigateToMap,
}) => {
  const [scanMode, setScanMode] = useState<'camera' | 'barcode'>('camera');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [manualSelectionOpen, setManualSelectionOpen] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err: any) {
      console.warn('Camera access denied:', err);
      setCameraError('No se pudo acceder a la cámara. Puedes subir una fotografía o usar los ejemplos de referencia.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const capturePhotoFromCamera = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      stopCamera();
      analyzeImage(dataUrl);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      analyzeImage(base64);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async (base64Image: string) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const response = await fetch('/api/ai/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64Image,
          mimeType: 'image/jpeg',
        }),
      });

      if (!response.ok) {
        throw new Error('Error al conectar con el clasificador central.');
      }

      const data: ClassificationResult = await response.json();
      data.imagen_preview = base64Image;
      setResult(data);
      onClassificationSuccess(data);
    } catch (err: any) {
      console.error(err);
      setErrorMsg('No se pudo procesar la imagen con Gemini. Selecciona el material manualmente.');
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeBarcode = async (barcodeString: string) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const response = await fetch('/api/ai/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          barcode: barcodeString,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al consultar base de datos de códigos.');
      }

      const data: ClassificationResult = await response.json();
      setResult(data);
      onClassificationSuccess(data);
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Error en el catálogo de códigos. Selecciona manualmente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSelection = (categoria: MaterialCategory) => {
    const manualResult: ClassificationResult = {
      source: 'manual_citizen_override',
      categoria,
      nombre_detectado: `Residuo declarado: ${categoria}`,
      confianza: 1.0,
      reciclable: categoria !== 'No reciclable',
      peso_estimado_kg: categoria === 'Cartón y Papel' ? 0.35 : categoria === 'Vidrio' ? 0.4 : 0.1,
      puntos_estimados: categoria === 'No reciclable' ? 0 : 25,
      co2_evitado_kg: categoria === 'No reciclable' ? 0 : 0.25,
      consejo_preparacion:
        categoria === 'No reciclable'
          ? 'Depositar en basura común o ecoladrillo no reciclable.'
          : 'Limpia cualquier resto orgánico, seca y deposita en el contenedor adecuado.',
    };
    setResult(manualResult);
    setManualSelectionOpen(false);
    onClassificationSuccess(manualResult);
  };

  const samplePresets = [
    {
      label: 'Botella PET de Agua',
      categoria: 'Plástico PET',
      image: '/src/assets/images/smart_deposit_bin_1794427469235.jpg',
    },
    {
      label: 'Caja de Cartón Plegable',
      categoria: 'Cartón y Papel',
      image: '/src/assets/images/circular_goods_1794427468847.jpg',
    },
    {
      label: 'Lata Aluminio Bebida',
      categoria: 'Aluminio / Latas',
      image: '/src/assets/images/clean_point_center_1794427468143.jpg',
    },
  ];

  return (
    <div className="space-y-12 pb-20">
      {/* Title & Mode Switcher in Ecosia Style */}
      <LazySection>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-4 border-b border-[#f0f0eb]">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.1em] text-[#6c6c6c] block mb-1">
              IDENTIFICACIÓN VISUAL POR IA
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#333333]">Escáner de Residuos</h2>
          </div>

          {/* Pill Segmented Control */}
          <div className="flex items-center gap-1.5 p-1 bg-[#f0f0eb] rounded-full self-start sm:self-auto">
            <button
              onClick={() => {
                setScanMode('camera');
                setResult(null);
              }}
              className={`flex items-center gap-2 px-5 py-2 text-xs font-semibold rounded-full transition-all ${
                scanMode === 'camera'
                  ? 'bg-[#333333] text-[#ffffff]'
                  : 'text-[#6c6c6c] hover:text-[#333333]'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Gemini Vision</span>
            </button>
            <button
              onClick={() => {
                setScanMode('barcode');
                setResult(null);
                stopCamera();
              }}
              className={`flex items-center gap-2 px-5 py-2 text-xs font-semibold rounded-full transition-all ${
                scanMode === 'barcode'
                  ? 'bg-[#333333] text-[#ffffff]'
                  : 'text-[#6c6c6c] hover:text-[#333333]'
              }`}
            >
              <Barcode className="w-3.5 h-3.5" />
              <span>Código de Barras</span>
            </button>
          </div>
        </div>
      </LazySection>

      {/* CLASSIFICATION RESULT CARD */}
      {result ? (
        <LazySection>
          <div className="card-ecosia p-8 sm:p-12 rounded-[20px] space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#bebeb9]/30">
              <div>
                <div className="flex items-center gap-2 text-xs text-[#6c6c6c] mb-1.5">
                  <span className="font-semibold text-[#333333]">
                    {result.source === 'gemini_vision_ai' ? 'Google Gemini 3.8 Flash' : 'Base de Datos GS1/EAN'}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>Confianza: {(result.confianza * 100).toFixed(0)}%</span>
                </div>
                <h3 className="text-3xl sm:text-4xl font-bold text-[#333333]">{result.nombre_detectado}</h3>
                <span className="inline-block mt-2 px-3 py-1 rounded-full bg-[#d7eb80] text-xs font-semibold text-[#333333]">
                  Categoría: {result.categoria}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setResult(null)}
                  className="btn-pill-ghost text-xs py-2 px-4"
                >
                  <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                  <span>Escanear Otro</span>
                </button>
              </div>
            </div>

            {/* Impact & Points Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-6 rounded-[20px] bg-[#ffffff] border border-[#f0f0eb]">
                <span className="text-xs font-bold uppercase tracking-wider text-[#6c6c6c] block mb-2">Recompensa</span>
                <div className="flex items-baseline gap-1.5">
                  <Coins className="w-4 h-4 text-[#333333] shrink-0 self-center" />
                  <span className="text-3xl font-bold text-[#333333] tabular-nums">+{result.puntos_estimados}</span>
                  <span className="text-xs font-semibold text-[#6c6c6c]">EC</span>
                </div>
              </div>

              <div className="p-6 rounded-[20px] bg-[#ffffff] border border-[#f0f0eb]">
                <span className="text-xs font-bold uppercase tracking-wider text-[#6c6c6c] block mb-2">Reducción CO2e</span>
                <div className="flex items-baseline gap-1.5">
                  <Leaf className="w-4 h-4 text-[#2d8c3a] shrink-0 self-center" />
                  <span className="text-3xl font-bold text-[#333333] tabular-nums">{result.co2_evitado_kg}</span>
                  <span className="text-xs font-semibold text-[#6c6c6c]">kg</span>
                </div>
              </div>

              <div className="p-6 rounded-[20px] bg-[#ffffff] border border-[#f0f0eb]">
                <span className="text-xs font-bold uppercase tracking-wider text-[#6c6c6c] block mb-2">Peso Estimado</span>
                <div className="flex items-baseline gap-1.5">
                  <Scale className="w-4 h-4 text-[#6c6c6c] shrink-0 self-center" />
                  <span className="text-3xl font-bold text-[#333333] tabular-nums">{result.peso_estimado_kg}</span>
                  <span className="text-xs font-semibold text-[#6c6c6c]">kg</span>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="card-linen p-6 sm:p-8 rounded-[20px] space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#333333] uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-[#333333]" />
                <span>Instrucciones de Preparación Previa</span>
              </div>
              <p className="text-sm text-[#333333] leading-relaxed">
                {result.consejo_preparacion}
              </p>
            </div>

            {/* Next Step Action CTA in Lime Canopy */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={() => onNavigateToMap(result.categoria)}
                className="w-full sm:flex-1 btn-pill-lime text-sm py-3.5 flex items-center justify-center gap-2"
              >
                <span>Buscar Punto Limpio para {result.categoria}</span>
                <ArrowRight className="w-4 h-4 text-[#333333]" />
              </button>

              <button
                onClick={() => setManualSelectionOpen(!manualSelectionOpen)}
                className="w-full sm:w-auto btn-pill-ghost text-xs py-3 px-5 flex items-center justify-center gap-1.5"
              >
                <HelpCircle className="w-3.5 h-3.5 text-[#6c6c6c]" />
                <span>¿Corregir Material?</span>
              </button>
            </div>

            {manualSelectionOpen && (
              <div className="p-6 rounded-[20px] bg-[#ffffff] border border-[#f0f0eb] mt-3 animate-in fade-in">
                <span className="text-xs font-bold text-[#333333] block mb-3 uppercase tracking-wider">
                  Selecciona la categoría real del residuo:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {(['Plástico PET', 'Cartón y Papel', 'Vidrio', 'Aluminio / Latas', 'Tetra Pak', 'No reciclable'] as MaterialCategory[]).map(
                    (cat) => (
                      <button
                        key={cat}
                        onClick={() => handleManualSelection(cat)}
                        className="p-3 text-xs font-semibold text-[#333333] bg-[#f8f8f6] hover:bg-[#d7eb80] rounded-[16px] border border-[#bebeb9]/30 transition-colors text-center"
                      >
                        {cat}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        </LazySection>
      ) : (
        /* SCANNING INTERFACE */
        <LazySection>
          <div className="card-ecosia p-8 sm:p-12 rounded-[20px]">
            {scanMode === 'camera' ? (
              <div className="space-y-8">
                {/* Viewfinder Container */}
                <div className="relative aspect-video sm:aspect-[16/9] max-h-[400px] bg-[#ffffff] rounded-[20px] border border-[#f0f0eb] overflow-hidden flex flex-col items-center justify-center">
                  {isLoading ? (
                    <div className="w-full h-full p-8 flex flex-col items-center justify-center text-center space-y-4">
                      <div className="skeleton-ecosia-pill w-16 h-16" />
                      <div className="skeleton-ecosia-pill w-64 h-5" />
                      <div className="skeleton-ecosia-pill w-48 h-4" />
                      <span className="text-sm font-semibold text-[#333333] mt-2">
                        Analizando empaque con Gemini 3.8 Flash...
                      </span>
                    </div>
                  ) : isCameraActive ? (
                    <div className="relative w-full h-full">
                      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-64 h-64 border-2 border-[#d7eb80] rounded-[20px] relative shadow-lg">
                          <div className="absolute inset-x-0 h-0.5 bg-[#d7eb80] shadow-sm animate-pulse" />
                        </div>
                      </div>
                      <div className="absolute bottom-5 inset-x-0 flex justify-center">
                        <button
                          onClick={capturePhotoFromCamera}
                          className="btn-pill-lime text-xs py-3 px-6 shadow-md"
                        >
                          <Camera className="w-4 h-4 mr-2 text-[#333333]" />
                          <span>Capturar Fotograma</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-8 space-y-3 max-w-sm">
                      <div className="w-14 h-14 rounded-full bg-[#f8f8f6] text-[#333333] flex items-center justify-center mx-auto mb-2 border border-[#bebeb9]/30">
                        <Camera className="w-6 h-6" />
                      </div>
                      <h4 className="text-lg font-bold text-[#333333]">Sensor Óptico de Residuos</h4>
                      <p className="text-xs text-[#6c6c6c] leading-relaxed">
                        Activa la cámara o carga una fotografía para clasificar el residuo con visión artificial.
                      </p>
                      <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
                        <button
                          onClick={startCamera}
                          className="btn-pill-lime text-xs py-2.5 px-5"
                        >
                          <Camera className="w-3.5 h-3.5 mr-1.5 text-[#333333]" />
                          <span>Activar Cámara</span>
                        </button>
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="btn-pill-ghost text-xs py-2.5 px-5"
                        >
                          <Upload className="w-3.5 h-3.5 mr-1.5 text-[#333333]" />
                          <span>Subir Archivo</span>
                        </button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileUpload}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {cameraError && (
                  <div className="p-4 bg-[#f8f8f6] rounded-[20px] border border-[#bebeb9]/40 text-xs text-[#333333] flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-[#333333] shrink-0 mt-0.5" />
                    <span>{cameraError}</span>
                  </div>
                )}

                {/* Instant Presets */}
                <div>
                  <span className="text-xs font-bold uppercase tracking-[0.1em] text-[#6c6c6c] block mb-3">
                    EJEMPLARES DE REFERENCIA PARA PRUEBAS:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {samplePresets.map((preset, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setIsLoading(true);
                          setTimeout(() => {
                            analyzeBarcode(
                              preset.categoria === 'Plástico PET'
                                ? '7791234567890'
                                : preset.categoria === 'Cartón y Papel'
                                ? '7798888999911'
                                : '7790040404040'
                            );
                          }, 500);
                        }}
                        className="p-3.5 rounded-[20px] bg-[#ffffff] border border-[#f0f0eb] hover:bg-[#f8f8f6] text-left transition-all flex items-center gap-3.5 group"
                      >
                        <img
                          src={preset.image}
                          alt={preset.label}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-[14px] object-cover border border-[#f0f0eb] group-hover:scale-105 transition-transform"
                        />
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-[#333333] block truncate group-hover:underline">
                            {preset.label}
                          </span>
                          <span className="text-[11px] text-[#6c6c6c]">{preset.categoria}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Barcode Mode */
              <div className="space-y-6">
                <div className="p-8 sm:p-12 rounded-[20px] bg-[#ffffff] border border-[#f0f0eb] text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-[#f8f8f6] text-[#333333] flex items-center justify-center mx-auto mb-2 border border-[#bebeb9]/30">
                    <Barcode className="w-6 h-6" />
                  </div>
                  <div className="max-w-md mx-auto">
                    <h4 className="text-xl font-bold text-[#333333]">Catálogo de Códigos EAN / UPC</h4>
                    <p className="text-xs text-[#6c6c6c] mt-1">
                      Respuesta del catálogo en ≤ 1.5s sin latencia de red.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-xl mx-auto pt-4">
                    <button
                      onClick={() => analyzeBarcode('7791234567890')}
                      className="p-4 bg-[#f8f8f6] hover:bg-[#d7eb80]/30 rounded-[16px] border border-[#bebeb9]/30 text-left transition-colors"
                    >
                      <span className="text-xs font-bold text-[#333333] block">Botella PET Agua 500ml</span>
                      <span className="font-mono text-[11px] text-[#6c6c6c]">7791234567890 · Plástico PET</span>
                    </button>

                    <button
                      onClick={() => analyzeBarcode('7790040404040')}
                      className="p-4 bg-[#f8f8f6] hover:bg-[#d7eb80]/30 rounded-[16px] border border-[#bebeb9]/30 text-left transition-colors"
                    >
                      <span className="text-xs font-bold text-[#333333] block">Lata Bebida 355ml</span>
                      <span className="font-mono text-[11px] text-[#6c6c6c]">7790040404040 · Aluminio</span>
                    </button>

                    <button
                      onClick={() => analyzeBarcode('7798888999911')}
                      className="p-4 bg-[#f8f8f6] hover:bg-[#d7eb80]/30 rounded-[16px] border border-[#bebeb9]/30 text-left transition-colors"
                    >
                      <span className="text-xs font-bold text-[#333333] block">Caja Cartón Corrugado</span>
                      <span className="font-mono text-[11px] text-[#6c6c6c]">7798888999911 · Cartón</span>
                    </button>

                    <button
                      onClick={() => analyzeBarcode('7791111222233')}
                      className="p-4 bg-[#f8f8f6] hover:bg-[#d7eb80]/30 rounded-[16px] border border-[#bebeb9]/30 text-left transition-colors"
                    >
                      <span className="text-xs font-bold text-[#333333] block">Bolsa Snacks Metalizada</span>
                      <span className="font-mono text-[11px] text-[#6c6c6c]">7791111222233 · No reciclable</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="mt-4 p-4 bg-[#ffffff] rounded-[20px] border border-red-200 text-xs text-red-600 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>
        </LazySection>
      )}
    </div>
  );
};
