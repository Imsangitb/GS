"use client";

interface Material {
  name: string;
  percentage: number;
}

interface SustainabilityMeterProps {
  score: number;
  materials: Material[];
  certifications: string[];
  impact: string;
}

const SustainabilityMeter = ({ 
  score, 
  materials, 
  certifications, 
  impact 
}: SustainabilityMeterProps) => {
  // Determine the color based on the score
  const getScoreColor = () => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-teal-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Determine the background gradient
  const getGradientStyle = () => {
    if (score >= 80) return 'from-green-500 to-green-500';
    if (score >= 60) return 'from-teal-500 to-teal-500';
    if (score >= 40) return 'from-yellow-500 to-yellow-500';
    return 'from-red-500 to-red-500';
  };

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      {/* Score Meter */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-gray-500">Sustainability Score</h4>
          <div className={`text-xl font-bold ${getScoreColor()}`}>{score}%</div>
        </div>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full bg-gradient-to-r ${getGradientStyle()}`}
            style={{ width: `${score}%` }}
          ></div>
        </div>
      </div>
      
      {/* Materials */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-500 mb-3">Material Composition</h4>
        <div className="space-y-2">
          {materials.map((material, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-sm text-gray-700">{material.name}</span>
              <div className="flex items-center">
                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden mr-2">
                  <div 
                    className="h-full bg-teal-600"
                    style={{ width: `${material.percentage}%` }}
                  ></div>
                </div>
                <span className="text-xs font-medium text-gray-700">{material.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Certifications */}
      {certifications && certifications.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Certifications</h4>
          <div className="flex flex-wrap gap-2">
            {certifications.map((cert, index) => (
              <span 
                key={index} 
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800"
              >
                <svg className="h-3 w-3 text-teal-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {cert}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {/* Environmental Impact */}
      {impact && (
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-2">Environmental Impact</h4>
          <p className="text-sm text-gray-700">{impact}</p>
        </div>
      )}
    </div>
  );
};

export default SustainabilityMeter;