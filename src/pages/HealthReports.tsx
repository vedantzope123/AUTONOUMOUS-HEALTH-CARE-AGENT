import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import type { HealthReport } from '../types';
import { initializeHealthReportService } from '../services/HealthReportService';
import { FiTrendingUp, FiLoader, FiDownload, FiAlertCircle } from 'react-icons/fi';
import { generateId, formatDate } from '../utils/helpers';

export const HealthReports: React.FC = () => {
  const { apiKey, vitals, symptoms, healthReports, addHealthReport, setIsLoading } = useAppContext();
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentReport, setCurrentReport] = useState<any>(null);

  const handleGenerateReport = async () => {
    if (!apiKey) {
      alert('API key not configured');
      return;
    }

    if (vitals.length === 0 && symptoms.length === 0) {
      alert('Please log some health data first (vitals or symptoms)');
      return;
    }

    setIsGenerating(true);
    setIsLoading(true);

    try {
      const reportService = initializeHealthReportService(apiKey);
      const report = await reportService.generateHealthReport(vitals, symptoms);

      setCurrentReport(report);

      // Save to history
      const healthReport: HealthReport = {
        id: generateId(),
        date: formatDate(new Date()),
        summary: report.summary,
        recentSymptoms: report.summary ? report.summary.split(' ').slice(0, 10) : [],
        vitalsTrends: report.trends,
        recommendations: report.recommendations,
      };

      addHealthReport(healthReport);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to generate report');
    } finally {
      setIsGenerating(false);
      setIsLoading(false);
    }
  };

  const downloadReport = () => {
    if (!currentReport) return;

    let reportText = `AURAHEALTH WELLNESS REPORT\n`;
    reportText += `Generated: ${new Date().toLocaleString()}\n`;
    reportText += `${'='.repeat(50)}\n\n`;

    reportText += `HEALTH SUMMARY\n${'-'.repeat(50)}\n`;
    reportText += `${currentReport.summary}\n\n`;

    reportText += `VITAL TRENDS\n${'-'.repeat(50)}\n`;
    reportText += `${currentReport.trends}\n\n`;

    reportText += `RECOMMENDATIONS\n${'-'.repeat(50)}\n`;
    currentReport.recommendations.forEach((rec: string, idx: number) => {
      reportText += `${idx + 1}. ${rec}\n`;
    });
    reportText += '\n';

    reportText += `RISK FACTORS\n${'-'.repeat(50)}\n`;
    if (currentReport.riskFactors.length > 0) {
      currentReport.riskFactors.forEach((risk: string) => {
        reportText += `• ${risk}\n`;
      });
    } else {
      reportText += 'No significant risk factors identified.\n';
    }
    reportText += '\n';

    reportText += `POSITIVE INDICATORS\n${'-'.repeat(50)}\n`;
    if (currentReport.positiveIndicators.length > 0) {
      currentReport.positiveIndicators.forEach((positive: string) => {
        reportText += `✓ ${positive}\n`;
      });
    } else {
      reportText += 'Keep up the good health practices!\n';
    }

    reportText += `\n${'='.repeat(50)}\n`;
    reportText += `Disclaimer: This report is AI-generated and should not replace professional medical advice.\n`;

    const element = document.createElement('a');
    element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(reportText)}`);
    element.setAttribute('download', `health-report-${new Date().toISOString().split('T')[0]}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="md:ml-64 min-h-screen bg-gradient-to-br from-primary-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-primary-900 mb-8 flex items-center gap-3">
          <FiTrendingUp size={32} className="text-indigo-500" />
          Health Reports & Analytics
        </h1>

        {/* Generate Report Button */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-primary-900 mb-4">AI-Powered Health Analysis</h2>

          <p className="text-primary-600 mb-4">
            Generate a comprehensive health report based on all your logged vitals and symptoms. Our AI analyzes patterns to provide personalized insights and recommendations.
          </p>

          <div className="flex gap-4">
            <button
              onClick={handleGenerateReport}
              disabled={isGenerating || (vitals.length === 0 && symptoms.length === 0)}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-lg transition-all flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <FiLoader className="animate-spin" /> Generating Report...
                </>
              ) : (
                <>📊 Generate New Report</>
              )}
            </button>

            {currentReport && (
              <button
                onClick={downloadReport}
                className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold py-3 px-6 rounded-lg transition-all flex items-center gap-2"
              >
                <FiDownload /> Download Report
              </button>
            )}
          </div>

          {vitals.length === 0 && symptoms.length === 0 && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2">
              <FiAlertCircle className="text-blue-600 flex-shrink-0 mt-1" />
              <p className="text-sm text-blue-700">
                To generate a comprehensive report, please log at least one vital reading or symptom entry.
              </p>
            </div>
          )}
        </div>

        {/* Current Report */}
        {currentReport && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Summary and Trends */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-bold text-primary-900 mb-4">📋 Health Summary</h3>
              <div className="prose prose-sm text-primary-700 max-w-none">
                <p>{currentReport.summary}</p>
              </div>

              <div className="mt-6 pt-6 border-t border-primary-200">
                <h4 className="font-bold text-primary-900 mb-3">📈 Vital Trends</h4>
                <p className="text-sm text-primary-700">{currentReport.trends}</p>
              </div>
            </div>

            {/* Recommendations */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-lg font-bold text-primary-900 mb-4">💡 Recommendations</h3>
                <ul className="space-y-3">
                  {currentReport.recommendations.map((rec: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3 text-sm">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xs">
                        {idx + 1}
                      </span>
                      <span className="text-primary-700 pt-1">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Risk Factors and Positive Indicators */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentReport.riskFactors.length > 0 && (
                  <div className="bg-red-50 rounded-2xl border border-red-200 p-4">
                    <h4 className="font-bold text-red-900 mb-3 flex items-center gap-2">
                      ⚠️ Risk Factors
                    </h4>
                    <ul className="space-y-1">
                      {currentReport.riskFactors.map((risk: string, idx: number) => (
                        <li key={idx} className="text-xs text-red-700">• {risk}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {currentReport.positiveIndicators.length > 0 && (
                  <div className="bg-green-50 rounded-2xl border border-green-200 p-4">
                    <h4 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                      ✅ Positive Indicators
                    </h4>
                    <ul className="space-y-1">
                      {currentReport.positiveIndicators.map((pos: string, idx: number) => (
                        <li key={idx} className="text-xs text-green-700">✓ {pos}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Report History */}
        {healthReports.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-primary-900 mb-4">📚 Report History</h2>
            <div className="space-y-3">
              {[...healthReports].reverse().map((report) => (
                <div key={report.id} className="p-4 border border-primary-200 rounded-lg hover:border-primary-500 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-primary-900">Health Report</h3>
                    <span className="text-xs text-primary-500">{report.date}</span>
                  </div>
                  <p className="text-sm text-primary-700 line-clamp-2">{report.summary}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {!currentReport && healthReports.length === 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <FiTrendingUp size={48} className="text-primary-300 mx-auto mb-4" />
            <p className="text-primary-600 font-semibold">No reports generated yet</p>
            <p className="text-primary-500 text-sm">Generate your first health report to get personalized insights</p>
          </div>
        )}
      </div>
    </div>
  );
};
