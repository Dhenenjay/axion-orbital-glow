import React, { useState, useEffect } from 'react';
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
  const showOutput = location.state?.showOutput || false;
  const returnToOutput = location.state?.returnToOutput || false;
  const initialQuery = location.state?.query || '';
  const [currentQuery, setCurrentQuery] = useState(initialQuery);

  // Set the interface state when returning based on whether we should show output
  const handleBackClick = () => {
    navigate('/interface', {
      state: {
        shouldShowOutput: returnToOutput,
        hasSubmittedQuery: hasSubmittedQuery,
        preservedQuery: currentQuery
      }
    });
  };

  const datasets = [
    'Landsat 8',
    'Sentinel-2',
    'MODIS',
    'DEM'
  ];

  // Detect query type for appropriate default code
  const isCropQuery = currentQuery.toLowerCase().includes('crop') || 
                     currentQuery.toLowerCase().includes('agriculture') ||
                     currentQuery.toLowerCase().includes('classification') ||
                     currentQuery.toLowerCase().includes('hoshiarpur');

  const defaultFloodCode = `// Earth Engine JavaScript Code for Jakarta Flood Analysis
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

  const defaultCropCode = `// Earth Engine JavaScript Code for Hoshiarpur Crop Classification
var hoshiarpur = ee.Geometry.Rectangle([75.4726, 31.2559, 75.6726, 31.4559]);

// Load Sentinel-2 Surface Reflectance data for Rabi season 2022-23
var collection = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterBounds(hoshiarpur)
  .filterDate('2022-11-01', '2023-04-30')
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
  .map(function(image) {
    // Cloud masking using SCL band
    var scl = image.select('SCL');
    var cloudMask = scl.eq(3).or(scl.eq(8)).or(scl.eq(9)).or(scl.eq(10)).or(scl.eq(11));
    return image.updateMask(cloudMask.not());
  });

// Create median composite
var composite = collection.median().clip(hoshiarpur);

// Calculate spectral indices
var ndvi = composite.normalizedDifference(['B8', 'B4']).rename('NDVI');
var ndwi = composite.normalizedDifference(['B3', 'B8']).rename('NDWI');
var evi = composite.expression(
  '2.5 * ((NIR - RED) / (NIR + 6 * RED - 7.5 * BLUE + 1))', {
    'NIR': composite.select('B8'),
    'RED': composite.select('B4'),
    'BLUE': composite.select('B2')
}).rename('EVI');

// Stack bands for classification
var classificationImage = composite.select(['B2', 'B3', 'B4', 'B8'])
  .addBands(ndvi)
  .addBands(ndwi)
  .addBands(evi);

// Define training points for different crop types
var wheat = ee.FeatureCollection([
  ee.Feature(ee.Geometry.Point([75.5200, 31.3100]), {class: 0}),
  ee.Feature(ee.Geometry.Point([75.5500, 31.3200]), {class: 0}),
  ee.Feature(ee.Geometry.Point([75.5800, 31.3300]), {class: 0})
]);

var potato = ee.FeatureCollection([
  ee.Feature(ee.Geometry.Point([75.5300, 31.3400]), {class: 1}),
  ee.Feature(ee.Geometry.Point([75.5600, 31.3500]), {class: 1}),
  ee.Feature(ee.Geometry.Point([75.5900, 31.3600]), {class: 1})
]);

var plantation = ee.FeatureCollection([
  ee.Feature(ee.Geometry.Point([75.5100, 31.3700]), {class: 2}),
  ee.Feature(ee.Geometry.Point([75.5400, 31.3800]), {class: 2}),
  ee.Feature(ee.Geometry.Point([75.5700, 31.3900]), {class: 2})
]);

var otherCrops = ee.FeatureCollection([
  ee.Feature(ee.Geometry.Point([75.5000, 31.3000]), {class: 3}),
  ee.Feature(ee.Geometry.Point([75.5250, 31.3250]), {class: 3}),
  ee.Feature(ee.Geometry.Point([75.5550, 31.3550]), {class: 3})
]);

// Merge training data
var trainingData = wheat.merge(potato).merge(plantation).merge(otherCrops);

// Sample the input imagery at training points
var training = classificationImage.sampleRegions({
  collection: trainingData,
  properties: ['class'],
  scale: 10
});

// Train Random Forest classifier
var classifier = ee.Classifier.smileRandomForest(100).train({
  features: training,
  classProperty: 'class',
  inputProperties: classificationImage.bandNames()
});

// Classify the image
var classified = classificationImage.classify(classifier);

// Define colors for visualization
var palette = [
  '#9932CC', // Wheat - Purple
  '#FFD700', // Potato - Gold
  '#228B22', // Plantation - Forest Green
  '#FF6347'  // Other crops - Tomato
];

// Export classification result
Export.image.toDrive({
  image: classified.visualize({min: 0, max: 3, palette: palette}),
  description: 'Hoshiarpur_Crop_Classification_Rabi_2022_23',
  region: hoshiarpur,
  scale: 10,
  maxPixels: 1e9
});

// Center map and add layers
Map.centerObject(hoshiarpur, 11);
Map.addLayer(composite, {bands: ['B4', 'B3', 'B2'], min: 0, max: 3000}, 'Sentinel-2 True Color');
Map.addLayer(ndvi, {min: -1, max: 1, palette: ['red', 'yellow', 'green']}, 'NDVI');
Map.addLayer(classified, {min: 0, max: 3, palette: palette}, 'Crop Classification');

// Add study area boundary
Map.addLayer(hoshiarpur, {color: 'red'}, 'Hoshiarpur Boundary', false);

// Print classification accuracy (if validation data available)
print('Crop Classification completed for Hoshiarpur - Rabi 2022-23');
print('Classes: 0-Wheat, 1-Potato, 2-Plantation, 3-Other Crops');`;

  const emptyCodePlaceholder = `// Code editor ready...
// Submit a query from the Interface or use the Generate Code button
// to create Earth Engine analysis code`;

  const getDefaultCode = () => {
    if (isCropQuery) {
      return defaultCropCode;
    }
    return defaultFloodCode;
  };

  const displayedCode = generatedCode || (hasSubmittedQuery ? getDefaultCode() : emptyCodePlaceholder);

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

  const getAnalysisType = () => {
    if (isCropQuery) {
      return 'Crop Classification';
    }
    return 'Flood Analysis';
  };

  const getLayerCount = () => {
    if (generatedCode || hasSubmittedQuery) {
      return isCropQuery ? '4' : '2';
    }
    return '0';
  };

  const getExportCount = () => {
    if (generatedCode || hasSubmittedQuery) {
      return '1';
    }
    return '0';
  };

  const getSuggestionText = () => {
    if (generatedCode) {
      return 'Code generated by Claude AI';
    } else if (hasSubmittedQuery) {
      return isCropQuery ? 'Add temporal analysis for better crop phenology' : 'Add cloud masking for better results';
    }
    return 'Enter query to get AI-generated code';
  };

  return (
    <div className="h-screen bg-slate-900 flex flex-col">
      {/* Top Header */}
      <div className="h-12 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackClick}
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
                    {isCropQuery && (
                      <>
                        <div>• .normalizedDifference() - Calculate spectral indices (NDVI, NDWI)</div>
                        <div>• ee.Classifier.smileRandomForest() - Random Forest classification</div>
                        <div>• .sampleRegions() - Sample training data</div>
                        <div>• .classify() - Apply trained classifier</div>
                      </>
                    )}
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
                    <span className="text-white">{getLayerCount()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Export Tasks:</span>
                    <span className="text-white">{getExportCount()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Analysis:</span>
                    <span className="text-cyan-400">{getAnalysisType()}</span>
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
                  {isCropQuery ? (
                    <>
                      <div className="hover:text-white cursor-pointer">normalizedDifference()</div>
                      <div className="hover:text-white cursor-pointer">smileRandomForest()</div>
                      <div className="hover:text-white cursor-pointer">sampleRegions()</div>
                      <div className="hover:text-white cursor-pointer">classify()</div>
                    </>
                  ) : (
                    <>
                      <div className="hover:text-white cursor-pointer">filterBounds()</div>
                      <div className="hover:text-white cursor-pointer">filterDate()</div>
                      <div className="hover:text-white cursor-pointer">focal_median()</div>
                      <div className="hover:text-white cursor-pointer">updateMask()</div>
                    </>
                  )}
                </div>

                <h4 className="text-white font-medium mt-6 mb-3">AI Code Suggestions</h4>
                <div className="text-sm text-gray-400">
                  <div className="bg-slate-700 rounded p-3">
                    <div className="text-cyan-400 mb-1">
                      {generatedCode ? 'Generated:' : (hasSubmittedQuery ? 'Suggestion:' : 'Status:')}
                    </div>
                    <div>
                      {getSuggestionText()}
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
          <span>Ln {generatedCode || hasSubmittedQuery ? (isCropQuery ? '85, Col 15' : '24, Col 15') : '1, Col 1'}</span>
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
