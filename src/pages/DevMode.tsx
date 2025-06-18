import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Play, 
  Save, 
  Download, 
  Settings, 
  Search,
  File,
  Folder,
  Database,
  Globe,
  Satellite,
  Mountain,
  Code,
  Terminal,
  FileText,
  Layers,
  BarChart3,
  Bug,
  Zap,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { useClaudeApi } from '@/hooks/useClaudeApi';
import { useToast } from '@/hooks/use-toast';

const DevMode = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { generateCode, isGenerating, error } = useClaudeApi();
  const [activeTab, setActiveTab] = useState('code-editor');
  const [selectedDataset, setSelectedDataset] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  
  // Get query and state from Interface page
  const hasSubmittedQuery = location.state?.hasSubmittedQuery || false;
  const initialQuery = location.state?.query || '';
  const [currentQuery, setCurrentQuery] = useState(initialQuery);

  const datasets = [
    'Landsat 8',
    'Sentinel-2',
    'MODIS',
    'DEM'
  ];

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

  const emptyCodePlaceholder = `// Code editor ready...
// Submit a query from the Interface or use the Generate Code button
// to create Earth Engine analysis code`;

  const displayedCode = generatedCode || (hasSubmittedQuery ? defaultCode : emptyCodePlaceholder);

  const handleGenerateCode = async () => {
    if (!currentQuery.trim()) {
      toast({
        title: "Query Required",
        description: "Please enter a query to generate code",
        variant: "destructive"
      });
      return;
    }

    try {
      const code = await generateCode(currentQuery);
      setGeneratedCode(code);
      toast({
        title: "Code Generated",
        description: "Earth Engine code has been generated successfully",
      });
    } catch (err) {
      toast({
        title: "Generation Failed",
        description: error || "Failed to generate code. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="h-screen bg-slate-900 flex flex-col">
      {/* Top Header */}
      <div className="h-12 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/interface')}
            className="text-gray-300 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <span className="text-white font-semibold">Dev Mode</span>
          <span className="text-gray-400">|</span>
          <span className="text-cyan-400">Phoenix 1.0</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button size="sm" variant="outline" className="bg-slate-700 border-slate-600 text-gray-300 hover:bg-slate-600">
            <Play className="w-4 h-4 mr-1" />
            Run
          </Button>
          <Button size="sm" variant="outline" className="bg-slate-700 border-slate-600 text-gray-300 hover:bg-slate-600">
            <Save className="w-4 h-4 mr-1" />
            Save
          </Button>
          <Button size="sm" variant="outline" className="bg-slate-700 border-slate-600 text-gray-300 hover:bg-slate-600">
            <Download className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="outline" className="bg-slate-700 border-slate-600 text-gray-300 hover:bg-slate-600">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Secondary Header with Query and AI Assistant */}
      <div className="h-16 bg-slate-850 border-b border-slate-700 flex items-center px-4 space-x-4">
        <div className="flex-1 flex items-center space-x-4">
          <span className="text-gray-300 text-sm">Query:</span>
          <input
            type="text"
            className="flex-1 bg-slate-800 rounded px-3 py-2 text-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your satellite data analysis query..."
            value={currentQuery}
            onChange={(e) => setCurrentQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            size="sm" 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={handleGenerateCode}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-1" />
                Generate Code
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Left Sidebar - Project Tree */}
        <div className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
          <div className="p-3 border-b border-slate-700">
            <h3 className="text-white font-medium mb-3">Project Tree</h3>
            <div className="space-y-1 text-sm">
              <div className="flex items-center space-x-2 text-gray-300 hover:text-white cursor-pointer">
                <Folder className="w-4 h-4" />
                <span>src</span>
              </div>
              <div className="ml-6 space-y-1">
                <div className="flex items-center space-x-2 text-gray-300 hover:text-white cursor-pointer">
                  <File className="w-4 h-4" />
                  <span>index.js</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-300 hover:text-white cursor-pointer">
                  <File className="w-4 h-4" />
                  <span>analysis.js</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 border-b border-slate-700">
            <h3 className="text-white font-medium mb-3">Datasets</h3>
            <div className="space-y-2">
              {datasets.map((dataset) => (
                <div 
                  key={dataset}
                  className={`flex items-center space-x-2 p-2 rounded cursor-pointer text-sm ${
                    selectedDataset === dataset 
                      ? 'bg-slate-700 text-cyan-400' 
                      : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                  }`}
                  onClick={() => setSelectedDataset(dataset)}
                >
                  <Database className="w-4 h-4" />
                  <span>{dataset}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3">
            <h3 className="text-white font-medium mb-3">Tools</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2 text-gray-300 hover:text-white cursor-pointer">
                <Globe className="w-4 h-4" />
                <span>MODIS</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300 hover:text-white cursor-pointer">
                <Mountain className="w-4 h-4" />
                <span>DEM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-slate-700 bg-slate-850">
            <button 
              className={`px-4 py-2 text-sm border-r border-slate-700 ${
                activeTab === 'code-editor' 
                  ? 'bg-slate-700 text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-slate-800'
              }`}
              onClick={() => setActiveTab('code-editor')}
            >
              Code Editor
            </button>
            <button 
              className={`px-4 py-2 text-sm border-r border-slate-700 ${
                activeTab === 'console' 
                  ? 'bg-slate-700 text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-slate-800'
              }`}
              onClick={() => setActiveTab('console')}
            >
              Console
            </button>
            <button 
              className={`px-4 py-2 text-sm ${
                activeTab === 'docs' 
                  ? 'bg-slate-700 text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-slate-800'
              }`}
              onClick={() => setActiveTab('docs')}
            >
              Documentation
            </button>
          </div>

          {/* Code Editor Content */}
          <div className="flex-1 flex">
            <div className="flex-1 relative">
              {activeTab === 'code-editor' && (
                <>
                  {/* Line numbers */}
                  <div className="absolute left-0 top-0 bottom-0 w-12 bg-slate-800 border-r border-slate-700 p-2">
                    {displayedCode.split('\n').map((_, index) => (
                      <div key={index} className="text-gray-500 text-xs text-right leading-6">
                        {index + 1}
                      </div>
                    ))}
                  </div>
                  
                  {/* Code content */}
                  <textarea
                    className="w-full h-full bg-slate-900 text-gray-300 font-mono text-sm pl-16 p-4 resize-none focus:outline-none"
                    value={displayedCode}
                    onChange={(e) => setGeneratedCode(e.target.value)}
                    placeholder="Submit a query or use Generate Code to create Earth Engine code..."
                  />
                </>
              )}
              
              {activeTab === 'console' && (
                <div className="p-4 bg-slate-900 text-gray-300 font-mono text-sm">
                  <div className="text-green-400">$ Ready for execution</div>
                  {error && (
                    <div className="text-red-400 mt-2">Error: {error}</div>
                  )}
                  <div className="text-gray-500 mt-2">Console output will appear here...</div>
                </div>
              )}
              
              {activeTab === 'docs' && (
                <div className="p-4 bg-slate-900 text-gray-300">
                  <h3 className="text-white font-semibold mb-3">Earth Engine Documentation</h3>
                  <div className="space-y-2 text-sm">
                    <div>• ee.ImageCollection() - Load satellite imagery collections</div>
                    <div>• .filter() - Apply filters to data</div>
                    <div>• .select() - Choose specific bands</div>
                    <div>• .mean() - Calculate temporal mean</div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Sidebar - Output/Methods */}
            <div className="w-64 bg-slate-800 border-l border-slate-700">
              <div className="p-4">
                <h4 className="text-white font-medium mb-3">Output Preview</h4>
                <div className="space-y-2 text-sm text-gray-400">
                  <div className="flex justify-between">
                    <span>Map Layers:</span>
                    <span className="text-white">{generatedCode || hasSubmittedQuery ? '2' : '0'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Export Tasks:</span>
                    <span className="text-white">{generatedCode || hasSubmittedQuery ? '1' : '0'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className={generatedCode || hasSubmittedQuery ? "text-green-400" : "text-yellow-400"}>
                      {isGenerating ? 'Generating...' : (generatedCode || hasSubmittedQuery ? 'Ready' : 'Waiting')}
                    </span>
                  </div>
                </div>

                <h4 className="text-white font-medium mt-6 mb-3">Methods</h4>
                <div className="space-y-1 text-sm text-gray-400">
                  <div className="hover:text-white cursor-pointer">filterBounds()</div>
                  <div className="hover:text-white cursor-pointer">filterDate()</div>
                  <div className="hover:text-white cursor-pointer">focal_median()</div>
                  <div className="hover:text-white cursor-pointer">updateMask()</div>
                </div>

                <h4 className="text-white font-medium mt-6 mb-3">AI Code Suggestions</h4>
                <div className="text-sm text-gray-400">
                  <div className="bg-slate-700 rounded p-3">
                    <div className="text-cyan-400 mb-1">
                      {generatedCode ? 'Generated:' : (hasSubmittedQuery ? 'Suggestion:' : 'Status:')}
                    </div>
                    <div>
                      {generatedCode ? 'Code generated by Claude AI' : (hasSubmittedQuery ? 'Add cloud masking for better results' : 'Enter query to get AI-generated code')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="h-8 bg-slate-800 border-t border-slate-700 flex items-center justify-between px-4 text-xs">
        <div className="flex items-center space-x-4 text-gray-400">
          <span>Ln {generatedCode || hasSubmittedQuery ? '24, Col 15' : '1, Col 1'}</span>
          <span>JavaScript</span>
          <span>UTF-8</span>
        </div>
        <div className="flex items-center space-x-4 text-gray-400">
          <div className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${isGenerating ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`}></div>
            <span>{isGenerating ? 'Generating' : 'Connected'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevMode;
