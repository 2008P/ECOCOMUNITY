import React, { useState, useEffect } from 'react';
import { LazySection } from './LazySection';
import {
  Download,
  FileSpreadsheet,
  ShieldCheck,
  CheckCircle2,
  TreePine,
  Droplets,
  Zap,
  Leaf,
  Building,
} from 'lucide-react';

export const ESGReportView: React.FC = () => {
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/esg/report')
      .then((res) => res.json())
      .then((data) => {
        setReportData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching ESG report:', err);
        setLoading(false);
      });
  }, []);

  const handleDownloadCsv = () => {
    if (!reportData) return;
    const rows = [
      ['ID Entrega', 'Material', 'Peso (kg)', 'Estado Cadena Custodia', 'Fecha', 'Hash Criptografico'],
      ...reportData.cadena_de_custodia.map((c: any) => [
        c.entrega_id,
        c.material,
        c.peso,
        c.estado_actual,
        c.fecha,
        c.hash_verificacion,
      ]),
    ];

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      rows.map((e: any[]) => e.map((val: any) => `"${val}"`).join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `reporte_esg_ecocommunity_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleDownloadCertificate = () => {
    if (!reportData) return;
    const jsonStr = `data:text/json;charset=utf-8,` + encodeURIComponent(JSON.stringify(reportData, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', jsonStr);
    link.setAttribute('download', `certificado_esg_auditado_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  if (loading) {
    return (
      <div className="space-y-8 py-8 animate-pulse">
        <div className="skeleton-ecosia-pill w-48 h-5 mb-2" />
        <div className="skeleton-ecosia-pill w-72 h-10 mb-8" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-6 rounded-[20px] bg-[#f8f8f6] space-y-3">
              <div className="skeleton-ecosia-pill w-24 h-4" />
              <div className="skeleton-ecosia-pill w-32 h-10" />
              <div className="skeleton-ecosia-pill w-20 h-3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const metrics = reportData?.metricas_acumuladas || {
    kg_totales_desviados: 1.43,
    co2_evitado_kg: 2.08,
    kwh_energia_ahorrada: 6.0,
    litros_agua_ahorrados: 38,
    arboles_equivalentes: 0.09,
  };

  const custodySteps = [
    {
      id: 'depositado',
      title: '01. Depósito Ciudadano',
      desc: 'Validación hiperlocal por GPS (≤ 20m) y lectura de QR en contenedor inteligente.',
    },
    {
      id: 'recolectado',
      title: '02. Recolección & Gestor Urbano',
      desc: 'Retiro programado por gestores certificados y registro de transferencia digital.',
    },
    {
      id: 'en_acopio',
      title: '03. Recepción en Centro de Acopio',
      desc: 'Pesaje báscula homologada, compactación y emisión de manifiesto de carga.',
    },
    {
      id: 'transformado',
      title: '04. Transformación / Granulación',
      desc: 'Incorporación a cadena productiva circular como resina reciclada (rPET).',
    },
  ];

  return (
    <div className="space-y-12 pb-20">
      {/* Title & Actions */}
      <LazySection>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-4 border-b border-[#f0f0eb]">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.1em] text-[#6c6c6c] mb-1 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#2d8c3a]" />
              <span>DIRECTIVA ESG ISO 14001 & TRAZABILIDAD AUDITABLE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#333333]">Reporte de Impacto y Cadena de Custodia</h2>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleDownloadCsv}
              className="btn-pill-ghost text-xs py-2.5 px-4"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5 text-[#6c6c6c]" />
              <span>Exportar CSV</span>
            </button>
            <button
              onClick={handleDownloadCertificate}
              className="btn-pill-lime text-xs py-2.5 px-5"
            >
              <Download className="w-3.5 h-3.5 mr-1.5 text-[#333333]" />
              <span>Certificado JSON</span>
            </button>
          </div>
        </div>
      </LazySection>

      {/* 4 Large Impact KPIs in Warm Mist Cards */}
      <LazySection delayMs={100}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-6 rounded-[20px] bg-[#f8f8f6] border border-[#f0f0eb] flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#6c6c6c] mb-3">
              <span className="text-xs font-bold uppercase tracking-wider">CO2e Evitado</span>
              <Leaf className="w-4 h-4 text-[#2d8c3a]" />
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-bold text-[#333333] tabular-nums">
                  {metrics.co2_evitado_kg}
                </span>
                <span className="text-xs uppercase font-semibold text-[#6c6c6c]">kg</span>
              </div>
              <span className="text-[12px] text-[#6c6c6c] mt-1 block">Factores EPA / IPCC</span>
            </div>
          </div>

          <div className="p-6 rounded-[20px] bg-[#f8f8f6] border border-[#f0f0eb] flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#6c6c6c] mb-3">
              <span className="text-xs font-bold uppercase tracking-wider">Energía Ahorrada</span>
              <Zap className="w-4 h-4 text-[#f5c542]" />
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-bold text-[#333333] tabular-nums">
                  {metrics.kwh_energia_ahorrada}
                </span>
                <span className="text-xs uppercase font-semibold text-[#6c6c6c]">kWh</span>
              </div>
              <span className="text-[12px] text-[#6c6c6c] mt-1 block">Ahorro en red pública</span>
            </div>
          </div>

          <div className="p-6 rounded-[20px] bg-[#f8f8f6] border border-[#f0f0eb] flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#6c6c6c] mb-3">
              <span className="text-xs font-bold uppercase tracking-wider">Agua Preservada</span>
              <Droplets className="w-4 h-4 text-[#3aa8e0]" />
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-bold text-[#333333] tabular-nums">
                  {metrics.litros_agua_ahorrados}
                </span>
                <span className="text-xs uppercase font-semibold text-[#6c6c6c]">litros</span>
              </div>
              <span className="text-[12px] text-[#6c6c6c] mt-1 block">Huella hídrica reducida</span>
            </div>
          </div>

          <div className="p-6 rounded-[20px] bg-[#f8f8f6] border border-[#f0f0eb] flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#6c6c6c] mb-3">
              <span className="text-xs font-bold uppercase tracking-wider">Árboles Equivalentes</span>
              <TreePine className="w-4 h-4 text-[#2d8c3a]" />
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-bold text-[#333333] tabular-nums">
                  {metrics.arboles_equivalentes}
                </span>
                <span className="text-xs uppercase font-semibold text-[#6c6c6c]">árboles</span>
              </div>
              <span className="text-[12px] text-[#6c6c6c] mt-1 block">Fijación neta de carbono</span>
            </div>
          </div>
        </div>
      </LazySection>

      {/* Cadena de Custodia Flow */}
      <LazySection delayMs={150}>
        <div className="card-ecosia p-8 sm:p-12 rounded-[20px] space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.1em] text-[#6c6c6c] block mb-1">
              FLUJO DE VERIFICACIÓN
            </span>
            <h3 className="text-2xl font-bold text-[#333333]">Cadena de Custodia Inmutable</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6">
            {custodySteps.map((step) => (
              <div key={step.id} className="p-6 rounded-[20px] bg-[#ffffff] border border-[#f0f0eb] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#333333]">{step.title}</span>
                  <CheckCircle2 className="w-4 h-4 text-[#2d8c3a] shrink-0" />
                </div>
                <p className="text-xs text-[#6c6c6c] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </LazySection>

      {/* Partner Sponsors Circularity Section */}
      <LazySection delayMs={200}>
        <div className="bg-[#ffffff] border border-[#f0f0eb] rounded-[20px] p-8 sm:p-10 space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.1em] text-[#6c6c6c] block mb-1">
              MARCAS PATROCINADORAS
            </span>
            <h3 className="text-2xl font-bold text-[#333333]">Responsabilidad Extendida del Productor (REP)</h3>
          </div>

          <div className="divide-y divide-[#f0f0eb]">
            {(reportData?.marcas_aliadas_esg || []).map((m: any, idx: number) => (
              <div key={idx} className="py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#f8f8f6] text-[#333333] flex items-center justify-center shrink-0 border border-[#bebeb9]/30">
                    <Building className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#333333]">{m.marca}</h4>
                    <span className="text-[11px] text-[#6c6c6c]">{m.status}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-base font-bold text-[#333333] tabular-nums">
                    {m.empaques_recuperados}
                  </span>
                  <span className="text-xs text-[#6c6c6c] block">empaques reintegrados</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </LazySection>
    </div>
  );
};
