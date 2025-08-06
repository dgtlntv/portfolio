
interface MetricsMockupProps {
  className?: string;
}

export default function MetricsMockup({ className = "" }: MetricsMockupProps) {
  const metrics = [
    {
      title: "Component Usage",
      value: "1,247",
      subtitle: "Total instances",
      trend: "up"
    },
    {
      title: "Library Adoption",
      value: "89%",
      subtitle: "Teams using libraries",
      trend: "up"
    },
    {
      title: "Detachment Rate",
      value: "12%",
      subtitle: "Components modified",
      trend: "down"
    },
    {
      title: "Usage Frequency",
      value: "3.2x",
      subtitle: "Avg per project",
      trend: "up"
    }
  ];

  const generateMiniChartPath = (index: number) => {
    const chartData = [
      [5, 8, 6, 12, 15, 18], // Component Usage
      [10, 15, 20, 25, 30, 35], // Library Adoption  
      [20, 18, 15, 12, 10, 8], // Detachment Rate (decreasing)
      [2, 3, 2.5, 3.2, 3.8, 4.1] // Usage Frequency
    ];
    
    const points = chartData[index];
    // Use viewBox coordinates since we're using 100% width/height
    const width = 100;
    const height = 100;
    
    const pathData = points.map((point, i) => {
      const x = 10 + (i / (points.length - 1)) * 80; // 10% padding on sides
      const maxValue = Math.max(...points);
      const y = 80 - (point / maxValue) * 60; // 10% padding top/bottom, 60% for chart area
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
    
    return pathData;
  };

  return (
    <div className={`not-prose bg-white border border-gray-200 rounded-lg p-4 shadow-sm min-w-[32rem] -rotate-2 ${className}`}>
      <div className="grid grid-cols-2 gap-4">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-gray-50 rounded-lg border border-gray-100 overflow-hidden">
            <div className="grid grid-cols-2 h-full">
              {/* Left column - Text content */}
              <div className="p-4 flex flex-col justify-center space-y-2">
                <span className="text-[10px] font-medium text-gray-600 uppercase tracking-wide leading-relaxed">
                  {metric.title}
                </span>
                <div className="text-xl font-bold text-gray-900 leading-normal">
                  {metric.value}
                </div>
                <div className="h-2 bg-gray-200 rounded w-16"></div>
              </div>
              
              {/* Right column - Grid with line chart */}
              <div className="relative">
                {/* Full grid background */}
                <svg width="100%" height="100%" className="absolute inset-0">
                  <defs>
                    <pattern id={`fullgrid-${index}`} width="12" height="12" patternUnits="userSpaceOnUse">
                      <path d="M 12 0 L 0 0 0 12" fill="none" stroke="#e5e7eb" strokeWidth="0.5"/>
                    </pattern>
                    {/* Fade out gradient */}
                    <linearGradient id={`fade-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="white" stopOpacity="0.8"/>
                      <stop offset="15%" stopColor="white" stopOpacity="0.2"/>
                      <stop offset="85%" stopColor="white" stopOpacity="0.2"/>
                      <stop offset="100%" stopColor="white" stopOpacity="0.8"/>
                    </linearGradient>
                    <linearGradient id={`fadey-${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="white" stopOpacity="0.8"/>
                      <stop offset="15%" stopColor="white" stopOpacity="0.2"/>
                      <stop offset="85%" stopColor="white" stopOpacity="0.2"/>
                      <stop offset="100%" stopColor="white" stopOpacity="0.8"/>
                    </linearGradient>
                  </defs>
                  <rect width="100%" height="100%" fill={`url(#fullgrid-${index})`} />
                  {/* Edge fade overlays */}
                  <rect width="100%" height="100%" fill={`url(#fade-${index})`} />
                  <rect width="100%" height="100%" fill={`url(#fadey-${index})`} />
                </svg>
                
                {/* Line chart positioned in center */}
                <div className="absolute inset-0">
                  <svg width="100%" height="100%" viewBox="0 0 100 100">
                    <path 
                      d={generateMiniChartPath(index)}
                      fill="none" 
                      stroke={metric.trend === 'up' ? '#10b981' : '#ef4444'} 
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}