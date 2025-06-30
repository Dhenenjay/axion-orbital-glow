
import React from 'react';
import { Copy, Download, Play, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CodeEditorProps {
  initialCode?: string;
  language?: string;
}

const CodeEditor = ({ initialCode, language = 'javascript' }: CodeEditorProps) => {
  const defaultCode = `// Earth Engine JavaScript Code for Jakarta Flood Analysis
var jakarta = ee.Geometry.Rectangle([106.6922, -6.3713, 107.1576, -5.9969]);

// Load Sentinel-1 SAR data for flood detection
var collection = ee.ImageCollection('COPERNICUS/S1_GRD')
  .filter(ee.Filter.eq('instrumentMode', 'IW'))
  .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VV'))
  .filter(ee.Filter.eq('orbitProperties_pass', 'DESCENDING'))
  .filterBounds(jakarta)
  .filterDate('2024-01-01', '2024-12-31');

// Create flood probability map
var floodProbability = collection
  .select('VV')
  .mean()
  .focal_median(1)
  .focal_mean(1);

// Apply threshold for flood detection
var floodMask = floodProbability.lt(-15);

// Load population data
var population = ee.Image('WorldPop/GP/100m/pop/IDN_2020');

// Calculate population at risk
var populationAtRisk = population.updateMask(floodMask);

// Export results
Export.image.toDrive({
  image: floodMask.visualize({min: 0, max: 1, palette: ['white', 'blue']}),
  description: 'Jakarta_Flood_Risk_Map',
  region: jakarta,
  scale: 30,
  maxPixels: 1e9
});

Map.centerObject(jakarta, 10);
Map.addLayer(floodMask, {palette: ['white', 'blue']}, 'Flood Risk');
Map.addLayer(populationAtRisk, {min: 0, max: 100, palette: ['yellow', 'red']}, 'Population at Risk');`;

  const codeToDisplay = initialCode || defaultCode;
  const hasCode = Boolean(initialCode);

  return (
    <div className="h-full flex flex-col bg-slate-900 border-l border-slate-700">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
          <h3 className="text-white font-semibold">Code Editor</h3>
        </div>
        <div className="flex items-center space-x-2">
          <Button size="sm" variant="outline" className="bg-slate-800 border-slate-600 text-gray-300 hover:bg-slate-700">
            <Play className="w-4 h-4 mr-1" />
            Run
          </Button>
          <Button size="sm" variant="outline" className="bg-slate-800 border-slate-600 text-gray-300 hover:bg-slate-700">
            <Copy className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="outline" className="bg-slate-800 border-slate-600 text-gray-300 hover:bg-slate-700">
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-700">
        <button className="px-4 py-2 text-sm text-orange-300 bg-slate-800 border-r border-slate-700">
          Earth Engine Code
        </button>
        <button className="px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-slate-800/50 border-r border-slate-700">
          Console
        </button>
        <button className="px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-slate-800/50">
          Documentation
        </button>
      </div>

      {/* Code Content */}
      <div className="flex-1 relative">
        <textarea
          className="w-full h-full bg-slate-900 text-gray-300 font-mono text-sm p-4 resize-none focus:outline-none"
          value={codeToDisplay}
          placeholder="// Code editor ready..."
          readOnly={!hasCode}
        />
        
        {/* Line numbers */}
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-slate-800/50 border-r border-slate-700 pt-4">
          {codeToDisplay.split('\n').map((_, index) => (
            <div key={index} className="text-gray-500 text-xs text-right pr-2 leading-5">
              {index + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="absolute right-0 top-0 bottom-0 w-48 bg-slate-800/50 border-l border-slate-700 p-4">
        <h4 className="text-white text-sm font-semibold mb-3">Output Preview</h4>
        <div className="space-y-2 text-xs text-gray-400">
          <div>Map Layers: 2</div>
          <div>Export Tasks: 1</div>
          <div>Status: {hasCode ? 'Ready' : 'Waiting'}</div>
        </div>

        <h4 className="text-white text-sm font-semibold mt-6 mb-3">Methods</h4>
        <div className="space-y-1 text-xs text-gray-400">
          <div>filterBounds()</div>
          <div>filterDate()</div>
          <div>focal_median()</div>
          <div>updateMask()</div>
        </div>

        <h4 className="text-white text-sm font-semibold mt-6 mb-3">AI Code Suggestions</h4>
        <div className="text-xs text-gray-400">
          {hasCode ? 'Code generated successfully' : 'Submit query to get suggestions'}
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
