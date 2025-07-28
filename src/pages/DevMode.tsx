
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Globe, 
  ArrowLeft, 
  Play, 
  Square, 
  Settings,
  Code,
  Eye,
  EyeOff,
  Terminal as TerminalIcon,
  PanelBottomOpen,
  PanelBottomClose
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import CodeEditor from '@/components/CodeEditor';
import EarthEngineViewer from '@/components/EarthEngineViewer';
import SimplePromptBox from '@/components/SimplePromptBox';
import FileTree from '@/components/FileTree';
import Terminal from '@/components/Terminal';

const DevMode = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isRunning, setIsRunning] = useState(false);
  const [showOutput, setShowOutput] = useState(true);
  const [hasOutput, setHasOutput] = useState(false);
  const [currentQuery, setCurrentQuery] = useState('');
  const [isCropQuery, setIsCropQuery] = useState(false);
  const [currentCode, setCurrentCode] = useState('');
  const [showTerminal, setShowTerminal] = useState(false);

  // Get state from navigation
  const { hasSubmittedQuery, query, returnToOutput } = location.state || {};

  const sampleCode = isCropQuery ? `
// Crop Classification Model for Hoshiarpur District
// Rabi Season 2022-23 Analysis

// Define study area (Hoshiarpur district boundaries)
var studyArea = ee.FeatureCollection('users/your-username/hoshiarpur-boundary');

// Load Sentinel-2 imagery for Rabi season (Oct 2022 - Apr 2023)
var startDate = '2022-10-01';
var endDate = '2023-04-30';

var s2Collection = ee.ImageCollection('COPERNICUS/S2_SR')
  .filterDate(startDate, endDate)
  .filterBounds(studyArea)
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
  .select(['B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B8A', 'B11', 'B12']);

// Create median composite
var composite = s2Collection.median().clip(studyArea);

// Calculate vegetation indices
var ndvi = composite.normalizedDifference(['B8', 'B4']).rename('NDVI');
var ndwi = composite.normalizedDifference(['B3', 'B8']).rename('NDWI');
var evi = composite.expression(
  '2.5 * ((NIR - RED) / (NIR + 6 * RED - 7.5 * BLUE + 1))', {
    'NIR': composite.select('B8'),
    'RED': composite.select('B4'),
    'BLUE': composite.select('B2')
  }).rename('EVI');

// Combine bands for classification
var classificationImage = composite
  .addBands(ndvi)
  .addBands(ndwi)
  .addBands(evi);

// Define training data classes
var wheat = ee.FeatureCollection([
  ee.Feature(ee.Geometry.Point([75.5726, 31.3559]), {class: 1}),
  ee.Feature(ee.Geometry.Point([75.6125, 31.4234]), {class: 1}),
  // Add more wheat training points
]);

var potato = ee.FeatureCollection([
  ee.Feature(ee.Geometry.Point([75.4523, 31.2876]), {class: 2}),
  ee.Feature(ee.Geometry.Point([75.5834, 31.3421]), {class: 2}),
  // Add more potato training points
]);

var plantation = ee.FeatureCollection([
  ee.Feature(ee.Geometry.Point([75.6234, 31.4567]), {class: 3}),
  ee.Feature(ee.Geometry.Point([75.5123, 31.3789]), {class: 3}),
  // Add more plantation training points
]);

// Merge training data
var trainingData = wheat.merge(potato).merge(plantation);

// Sample the composite image at training points
var training = classificationImage.sampleRegions({
  collection: trainingData,
  properties: ['class'],
  scale: 10
});

// Train Random Forest classifier
var classifier = ee.Classifier.smileRandomForest(100)
  .train({
    features: training,
    classProperty: 'class',
    inputProperties: classificationImage.bandNames()
  });

// Classify the image
var classified = classificationImage.classify(classifier);

// Define visualization parameters
var classificationVis = {
  min: 1,
  max: 3,
  palette: ['#a855f7', '#eab308', '#22c55e'] // Purple=Wheat, Yellow=Potato, Green=Plantation
};

// Add layers to map
Map.centerObject(studyArea, 10);
Map.addLayer(composite, {bands: ['B4', 'B3', 'B2'], max: 2000}, 'Sentinel-2 RGB');
Map.addLayer(classified, classificationVis, 'Crop Classification');
Map.addLayer(studyArea, {color: 'red'}, 'Study Area', false);

// Calculate area statistics
var areaImage = ee.Image.pixelArea();
var areas = areaImage.addBands(classified).reduceRegion({
  reducer: ee.Reducer.sum().group({
    groupField: 1,
    groupName: 'class',
  }),
  geometry: studyArea,
  scale: 10,
  maxPixels: 1e10
});

print('Crop area statistics (hectares):', areas);

// Export classification result
Export.image.toDrive({
  image: classified,
  description: 'Hoshiarpur_Crop_Classification_Rabi_2022-23',
  scale: 10,
  region: studyArea,
  maxPixels: 1e10
});
  ` : `
// Flood Risk Analysis for Jakarta
// January 20, 2020 Extreme Flood Event

// Define Jakarta study area
var jakarta = ee.FeatureCollection('users/your-username/jakarta-boundary');

// Load Sentinel-1 SAR data for flood detection
var beforeFlood = ee.ImageCollection('COPERNICUS/S1_GRD')
  .filterDate('2020-01-01', '2020-01-15')
  .filterBounds(jakarta)
  .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VV'))
  .select('VV');

var duringFlood = ee.ImageCollection('COPERNICUS/S1_GRD')
  .filterDate('2020-01-20', '2020-01-25')
  .filterBounds(jakarta)
  .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VV'))
  .select('VV');

// Create median composites
var beforeComposite = beforeFlood.median().clip(jakarta);
var duringComposite = duringFlood.median().clip(jakarta);

// Calculate flood extent using difference threshold
var floodDifference = duringComposite.subtract(beforeComposite);
var floodThreshold = -3; // dB threshold for flood detection
var floodExtent = floodDifference.lt(floodThreshold);

// Load population data
var population = ee.Image('WorldPop/GP/100m/pop/IDN_2020').clip(jakarta);

// Calculate population at risk
var populationAtRisk = population.updateMask(floodExtent);

// Define visualization parameters
var sarVis = {min: -25, max: 5, palette: ['black', 'white']};
var floodVis = {min: 0, max: 1, palette: ['white', 'blue']};
var popVis = {min: 0, max: 100, palette: ['white', 'yellow', 'red']};

// Add layers to map
Map.centerObject(jakarta, 10);
Map.addLayer(beforeComposite, sarVis, 'SAR Before Flood');
Map.addLayer(duringComposite, sarVis, 'SAR During Flood', false);
Map.addLayer(floodExtent, floodVis, 'Flood Extent');
Map.addLayer(populationAtRisk, popVis, 'Population at Risk');
Map.addLayer(jakarta, {color: 'red'}, 'Jakarta Boundary', false);

// Calculate flood statistics
var floodArea = floodExtent.multiply(ee.Image.pixelArea()).reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: jakarta,
  scale: 100,
  maxPixels: 1e10
});

var totalPopAtRisk = populationAtRisk.reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: jakarta,
  scale: 100,
  maxPixels: 1e10
});

print('Flood area (sq km):', ee.Number(floodArea.get('VV')).divide(1e6));
print('Population at risk:', totalPopAtRisk);

// Export flood risk map
Export.image.toDrive({
  image: floodExtent.addBands(populationAtRisk),
  description: 'Jakarta_Flood_Risk_20Jan2020',
  scale: 100,
  region: jakarta,
  maxPixels: 1e10
});
`;

  useEffect(() => {
    if (hasSubmittedQuery && query) {
      setCurrentQuery(query);
      setHasOutput(true);
      
      // Determine query type
      const lowerQuery = query.toLowerCase();
      const isCrop = lowerQuery.includes('crop') || 
                    lowerQuery.includes('agriculture') || 
                    lowerQuery.includes('farming') || 
                    lowerQuery.includes('wheat') || 
                    lowerQuery.includes('potato') || 
                    lowerQuery.includes('plantation') ||
                    lowerQuery.includes('classification') ||
                    lowerQuery.includes('hoshiarpur') ||
                    lowerQuery.includes('rabi');
      
      setIsCropQuery(isCrop);
      
      if (returnToOutput) {
        setShowOutput(true);
      }
    }
  }, [hasSubmittedQuery, query, returnToOutput]);

  useEffect(() => {
    setCurrentCode(sampleCode);
  }, [sampleCode]);

  const handleRunCode = () => {
    setIsRunning(true);
    setShowOutput(false);
    
    // Simulate code execution
    setTimeout(() => {
      setIsRunning(false);
      setHasOutput(true);
      setShowOutput(true);
    }, 2000);
  };

  const handleStopCode = () => {
    setIsRunning(false);
  };

  const handleBackToInterface = () => {
    navigate('/interface', { 
      state: { 
        shouldShowOutput: hasOutput,
        hasSubmittedQuery: hasSubmittedQuery,
        preservedQuery: currentQuery
      } 
    });
  };

  const toggleOutput = () => {
    setShowOutput(!showOutput);
  };

  const handlePromptSubmit = (prompt: string) => {
    console.log('AI Prompt:', prompt);
    // Handle AI prompt here
  };

  const toggleTerminal = () => {
    setShowTerminal(!showTerminal);
  };

  return (
    <div className="h-screen bg-[hsl(var(--editor-bg))] flex flex-col">
      {/* Top Header */}
      <div className="h-9 bg-[hsl(var(--editor-panel))] border-b border-[hsl(var(--editor-border))] flex items-center justify-between px-4">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToInterface}
            className="text-[hsl(var(--editor-text-muted))] hover:text-[hsl(var(--editor-text))] hover:bg-[hsl(var(--editor-sidebar))] transition-all duration-200 h-7 px-2 text-xs"
          >
            <ArrowLeft className="w-3 h-3 mr-1" />
            Interface
          </Button>
          <div className="h-3 w-px bg-[hsl(var(--editor-border))]"></div>
          <div className="flex items-center space-x-1.5">
            <Globe className="w-3 h-3 text-[hsl(var(--editor-accent))]" />
            <span className="text-[hsl(var(--editor-text))] font-medium text-xs">Phoenix Dev Mode</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRunCode}
            disabled={isRunning}
            className="text-[hsl(var(--editor-text-muted))] hover:text-white hover:bg-green-600/90 disabled:opacity-50 transition-all duration-200 h-7 px-2 text-xs font-medium"
          >
            <Play className="w-3 h-3 mr-1" />
            {isRunning ? 'Running' : 'Run'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleStopCode}
            disabled={!isRunning}
            className="text-[hsl(var(--editor-text-muted))] hover:text-white hover:bg-red-600/90 disabled:opacity-50 transition-all duration-200 h-7 px-2 text-xs font-medium"
          >
            <Square className="w-3 h-3 mr-1" />
            Stop
          </Button>
          <div className="h-3 w-px bg-[hsl(var(--editor-border))] mx-1"></div>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTerminal}
            className="text-[hsl(var(--editor-text-muted))] hover:text-[hsl(var(--editor-text))] hover:bg-[hsl(var(--editor-sidebar))] transition-all duration-200 h-7 px-2 text-xs"
          >
            {showTerminal ? <PanelBottomClose className="w-3 h-3 mr-1" /> : <PanelBottomOpen className="w-3 h-3 mr-1" />}
            Terminal
          </Button>
        </div>
      </div>

      {/* AI Prompt Box */}
      <SimplePromptBox onPromptSubmit={handlePromptSubmit} />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="flex-1">
          {/* File Explorer */}
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
            <FileTree />
          </ResizablePanel>

          <ResizableHandle className="w-px bg-[hsl(var(--editor-border))] hover:bg-[hsl(var(--editor-accent))] transition-colors duration-200" />

          {/* Main Editor Area */}
          <ResizablePanel defaultSize={showOutput ? 45 : 80} minSize={30}>
            <ResizablePanelGroup direction="vertical" className="h-full">
              {/* Code Editor */}
              <ResizablePanel defaultSize={showTerminal ? 70 : 100} minSize={40}>
                <div className="h-full flex flex-col bg-[hsl(var(--editor-bg))]">
                  {/* File Tabs */}
                  <div className="h-8 bg-[hsl(var(--editor-panel))] border-b border-[hsl(var(--editor-border))] flex items-center px-3">
                    <div className="flex items-center space-x-1 bg-[hsl(var(--editor-bg))] px-3 py-1 rounded-t border-t border-l border-r border-[hsl(var(--editor-border))] -mb-px">
                      <Code className="w-3 h-3 text-[hsl(var(--editor-accent))]" />
                      <span className="text-xs text-[hsl(var(--editor-text))] font-medium">
                        {isCropQuery ? 'crop_classification.js' : 'flood_risk_analysis.js'}
                      </span>
                      {isRunning && (
                        <div className="ml-2 w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                      )}
                    </div>
                  </div>
                  
                  {/* Code Editor */}
                  <div className="flex-1">
                    <CodeEditor 
                      initialCode={currentCode || sampleCode}
                      language="javascript"
                    />
                  </div>
                </div>
              </ResizablePanel>

              {/* Terminal */}
              {showTerminal && (
                <>
                  <ResizableHandle className="h-px bg-[hsl(var(--editor-border))] hover:bg-[hsl(var(--editor-accent))] transition-colors duration-200" />
                  <ResizablePanel defaultSize={30} minSize={20}>
                    <Terminal isVisible={showTerminal} onToggle={toggleTerminal} />
                  </ResizablePanel>
                </>
              )}
            </ResizablePanelGroup>
          </ResizablePanel>

          {/* Map Output Panel */}
          {showOutput && (
            <>
              <ResizableHandle className="w-px bg-[hsl(var(--editor-border))] hover:bg-[hsl(var(--editor-accent))] transition-colors duration-200" />
              <ResizablePanel defaultSize={35} minSize={25}>
                <EarthEngineViewer 
                  hasOutput={hasOutput} 
                  isCropQuery={isCropQuery}
                />
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default DevMode;
