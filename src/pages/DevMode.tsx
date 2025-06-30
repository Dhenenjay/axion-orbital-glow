
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
  Loader2,
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  Map,
  Image,
  Filter,
  SortAsc,
  SortDesc,
  X,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { useClaudeApi } from '@/hooks/useClaudeApi';
import { useToast } from '@/hooks/use-toast';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';

interface LayerInfo {
  name: string;
  type: 'raster' | 'vector' | 'classification';
  visible: boolean;
  opacity: number;
  description: string;
  status: 'ready' | 'loading' | 'error';
}

const DevMode = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { generateCode, isGenerating, error } = useClaudeApi();
  const [activeTab, setActiveTab] = useState('code-editor');
  const [selectedDataset, setSelectedDataset] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [outputPanelExpanded, setOutputPanelExpanded] = useState(true);
  const [sortBy, setSortBy] = useState<'name' | 'type' | 'status'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterVisible, setFilterVisible] = useState(true);
  
  // Get query and state from Interface page
  const hasSubmittedQuery = location.state?.hasSubmittedQuery || false;
  const showOutput = location.state?.showOutput || false;
  const returnToOutput = location.state?.returnToOutput || false;
  const initialQuery = location.state?.query || '';
  const [currentQuery, setCurrentQuery] = useState(initialQuery);

  // Track if this is a crop query
  const [isCropQuery, setIsCropQuery] = useState(false);

  // Mock layer data that changes based on query type
  const [layers, setLayers] = useState<LayerInfo[]>([]);

  useEffect(() => {
    const checkIfCropQuery = (queryText: string) => {
      return queryText.toLowerCase().includes('crop') || 
             queryText.toLowerCase().includes('agriculture') ||
             queryText.toLowerCase().includes('classification') ||
             queryText.toLowerCase().includes('hoshiarpur') ||
             queryText.toLowerCase().includes('wheat') ||
             queryText.toLowerCase().includes('potato') ||
             queryText.toLowerCase().includes('plantation');
    };

    const newIsCropQuery = checkIfCropQuery(currentQuery);
    
    if (newIsCropQuery !== isCropQuery) {
      setIsCropQuery(newIsCropQuery);
      
      // Update layers based on query type
      if (hasSubmittedQuery || generatedCode) {
        const newLayers: LayerInfo[] = newIsCropQuery ? [
          {
            name: 'Sentinel-2 True Color',
            type: 'raster',
            visible: true,
            opacity: 100,
            description: 'RGB composite from Sentinel-2',
            status: 'ready'
          },
          {
            name: 'NDVI',
            type: 'raster',
            visible: true,
            opacity: 80,
            description: 'Normalized Difference Vegetation Index',
            status: 'ready'
          },
          {
            name: 'Crop Classification',
            type: 'classification',
            visible: true,
            opacity: 90,
            description: 'Wheat, Potato, Plantation, Other crops',
            status: 'ready'
          },
          {
            name: 'Hoshiarpur Boundary',
            type: 'vector',
            visible: false,
            opacity: 100,
            description: 'Study area boundary',
            status: 'ready'
          }
        ] : [
          {
            name: 'Flood Risk',
            type: 'raster',
            visible: true,
            opacity: 85,
            description: 'SAR-based flood detection',
            status: 'ready'
          },
          {
            name: 'Population at Risk',
            type: 'raster',
            visible: true,
            opacity: 75,
            description: 'Population density in flood zones',
            status: 'ready'
          }
        ];
        setLayers(newLayers);
      } else {
        setLayers([]);
      }
      
      if (hasSubmittedQuery) {
        setGeneratedCode('');
      }
    }
  }, [currentQuery, hasSubmittedQuery, isCropQuery, generatedCode]);

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

  // Default code templates
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

  const emptyCodePlaceholder = `// Earth Engine Code Editor
// Submit a query from the Interface or use the Generate Code button
// to create satellite data analysis code

// Explore our datasets:
// - Landsat 8 & 9 Surface Reflectance
// - Sentinel-2 Surface Reflectance  
// - MODIS Terra & Aqua
// - Digital Elevation Models (DEM)
// - Precipitation data
// - And much more...

// Get started with a simple example:
// var image = ee.Image('LANDSAT/LC08/C02/T1_L2/LC08_044034_20140318');
// Map.addLayer(image, {bands: ['SR_B4', 'SR_B3', 'SR_B2'], min: 0, max: 30000}, 'True Color');`;

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

  const toggleLayerVisibility = (index: number) => {
    setLayers(prev => prev.map((layer, i) => 
      i === index ? { ...layer, visible: !layer.visible } : layer
    ));
  };

  const updateLayerOpacity = (index: number, opacity: number) => {
    setLayers(prev => prev.map((layer, i) => 
      i === index ? { ...layer, opacity } : layer
    ));
  };

  const sortedLayers = [...layers].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'type':
        comparison = a.type.localeCompare(b.type);
        break;
      case 'status':
        comparison = a.status.localeCompare(b.status);
        break;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const filteredLayers = filterVisible 
    ? sortedLayers.filter(layer => layer.visible)
    : sortedLayers;

  const getStatusIcon = (status: LayerInfo['status']) => {
    switch (status) {
      case 'loading':
        return <Loader2 className="w-3 h-3 animate-spin text-blue-400" />;
      case 'error':
        return <X className="w-3 h-3 text-red-400" />;
      default:
        return <div className="w-2 h-2 rounded-full bg-green-400" />;
    }
  };

  const getTypeIcon = (type: LayerInfo['type']) => {
    switch (type) {
      case 'raster':
        return <Image className="w-4 h-4 text-blue-400" />;
      case 'vector':
        return <Map className="w-4 h-4 text-green-400" />;
      case 'classification':
        return <Layers className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <div className="h-screen bg-[#1e1e1e] flex flex-col text-white">
      {/* VSCode-like Top Bar */}
      <div className="h-8 bg-[#323233] border-b border-[#2d2d30] flex items-center justify-between px-2 text-xs">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackClick}
            className="h-6 px-2 text-[#cccccc] hover:text-white hover:bg-[#2a2d2e]"
          >
            <ArrowLeft className="w-3 h-3 mr-1" />
            Back
          </Button>
          <span className="text-[#cccccc]">•</span>
          <span className="text-white">Phoenix Earth Engine IDE</span>
        </div>
        
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]"></div>
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
          <div className="w-3 h-3 rounded-full bg-[#28ca42]"></div>
        </div>
      </div>

      {/* Menu Bar */}
      <div className="h-7 bg-[#2d2d30] border-b border-[#3e3e42] flex items-center px-3 text-xs">
        <div className="flex items-center space-x-4 text-[#cccccc]">
          <span className="hover:text-white cursor-pointer">File</span>
          <span className="hover:text-white cursor-pointer">Edit</span>
          <span className="hover:text-white cursor-pointer">View</span>
          <span className="hover:text-white cursor-pointer">Run</span>
          <span className="hover:text-white cursor-pointer">Help</span>
        </div>
      </div>

      {/* Activity Bar */}
      <div className="flex flex-1">
        <div className="w-12 bg-[#333333] border-r border-[#2d2d30] flex flex-col items-center py-2 space-y-4">
          <div className="w-8 h-8 flex items-center justify-center rounded bg-[#007acc] text-white">
            <File className="w-4 h-4" />
          </div>
          <div className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#2a2d2e] cursor-pointer">
            <Search className="w-4 h-4 text-[#cccccc]" />
          </div>
          <div className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#2a2d2e] cursor-pointer">
            <Database className="w-4 h-4 text-[#cccccc]" />
          </div>
          <div className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#2a2d2e] cursor-pointer">
            <Terminal className="w-4 h-4 text-[#cccccc]" />
          </div>
        </div>

        {/* Main Content */}
        <ResizablePanelGroup direction="horizontal">
          {/* Left Panel - Explorer */}
          <ResizablePanel defaultSize={20} minSize={15}>
            <div className="h-full bg-[#252526] border-r border-[#2d2d30]">
              <div className="p-2 border-b border-[#2d2d30]">
                <h3 className="text-xs font-semibold text-[#cccccc] mb-2">EXPLORER</h3>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center space-x-1 text-[#cccccc] hover:text-white cursor-pointer">
                    <ChevronDown className="w-3 h-3" />
                    <Folder className="w-3 h-3" />
                    <span>earth-engine-project</span>
                  </div>
                  <div className="ml-4 space-y-1">
                    <div className="flex items-center space-x-1 text-[#cccccc] hover:text-white cursor-pointer hover:bg-[#2a2d2e] px-1 py-0.5 rounded">
                      <Code className="w-3 h-3 text-blue-400" />
                      <span>analysis.js</span>
                    </div>
                    <div className="flex items-center space-x-1 text-[#cccccc] hover:text-white cursor-pointer hover:bg-[#2a2d2e] px-1 py-0.5 rounded">
                      <FileText className="w-3 h-3 text-green-400" />
                      <span>README.md</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-2 border-b border-[#2d2d30]">
                <h3 className="text-xs font-semibold text-[#cccccc] mb-2">DATASETS</h3>
                <div className="space-y-1">
                  {datasets.map((dataset) => (
                    <div 
                      key={dataset}
                      className={`flex items-center space-x-2 p-1 rounded cursor-pointer text-xs ${
                        selectedDataset === dataset 
                          ? 'bg-[#094771] text-white' 
                          : 'text-[#cccccc] hover:bg-[#2a2d2e] hover:text-white'
                      }`}
                      onClick={() => setSelectedDataset(dataset)}
                    >
                      <Satellite className="w-3 h-3" />
                      <span>{dataset}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Center Panel - Code Editor */}
          <ResizablePanel defaultSize={outputPanelExpanded ? 50 : 80}>
            <div className="h-full flex flex-col bg-[#1e1e1e]">
              {/* Query Bar */}
              <div className="h-10 bg-[#2d2d30] border-b border-[#3e3e42] flex items-center px-3 space-x-3">
                <span className="text-xs text-[#cccccc]">Query:</span>
                <input
                  type="text"
                  className="flex-1 bg-[#3c3c3c] rounded px-3 py-1 text-white text-xs focus:outline-none focus:ring-1 focus:ring-[#007acc] border border-[#5a5a5a]"
                  placeholder="Enter your satellite data analysis query..."
                  value={currentQuery}
                  onChange={(e) => setCurrentQuery(e.target.value)}
                />
                <Button 
                  size="sm" 
                  className="h-7 bg-[#0e639c] hover:bg-[#1177bb] text-xs"
                  onClick={handleGenerateCode}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Zap className="w-3 h-3 mr-1" />
                      Generate
                    </>
                  )}
                </Button>
              </div>

              {/* Editor Tabs */}
              <div className="flex bg-[#2d2d30] border-b border-[#3e3e42]">
                <div className="flex">
                  <button 
                    className={`px-3 py-2 text-xs border-r border-[#3e3e42] flex items-center space-x-2 ${
                      activeTab === 'code-editor' 
                        ? 'bg-[#1e1e1e] text-white border-t-2 border-t-[#007acc]' 
                        : 'text-[#cccccc] hover:text-white hover:bg-[#2a2d2e]'
                    }`}
                    onClick={() => setActiveTab('code-editor')}
                  >
                    <Code className="w-3 h-3" />
                    <span>analysis.js</span>
                    <div className="w-1 h-1 rounded-full bg-orange-400"></div>
                  </button>
                  <button 
                    className={`px-3 py-2 text-xs border-r border-[#3e3e42] ${
                      activeTab === 'console' 
                        ? 'bg-[#1e1e1e] text-white border-t-2 border-t-[#007acc]' 
                        : 'text-[#cccccc] hover:text-white hover:bg-[#2a2d2e]'
                    }`}
                    onClick={() => setActiveTab('console')}
                  >
                    Console
                  </button>
                  <button 
                    className={`px-3 py-2 text-xs ${
                      activeTab === 'docs' 
                        ? 'bg-[#1e1e1e] text-white border-t-2 border-t-[#007acc]' 
                        : 'text-[#cccccc] hover:text-white hover:bg-[#2a2d2e]'
                    }`}
                    onClick={() => setActiveTab('docs')}
                  >
                    Docs
                  </button>
                </div>
                
                <div className="flex-1"></div>
                
                <div className="flex items-center px-3 space-x-2">
                  <Button size="sm" variant="ghost" className="h-6 text-[#cccccc] hover:text-white hover:bg-[#2a2d2e]">
                    <Play className="w-3 h-3 mr-1" />
                    Run
                  </Button>
                  <Button size="sm" variant="ghost" className="h-6 text-[#cccccc] hover:text-white hover:bg-[#2a2d2e]">
                    <Save className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              {/* Editor Content */}
              <div className="flex-1 relative">
                {activeTab === 'code-editor' && (
                  <div className="h-full flex">
                    {/* Line numbers */}
                    <div className="w-12 bg-[#1e1e1e] border-r border-[#3e3e42] p-2 select-none">
                      {displayedCode.split('\n').map((_, index) => (
                        <div key={index} className="text-[#858585] text-xs text-right leading-[18px] font-mono">
                          {index + 1}
                        </div>
                      ))}
                    </div>
                    
                    {/* Code content */}
                    <textarea
                      className="flex-1 bg-[#1e1e1e] text-[#d4d4d4] font-mono text-xs p-3 resize-none focus:outline-none leading-[18px]"
                      value={displayedCode}
                      onChange={(e) => setGeneratedCode(e.target.value)}
                      placeholder="// Earth Engine Code Editor..."
                      spellCheck={false}
                    />
                  </div>
                )}
                
                {activeTab === 'console' && (
                  <div className="p-4 bg-[#1e1e1e] text-[#cccccc] font-mono text-xs">
                    <div className="text-[#4ec9b0]">$ Earth Engine Console</div>
                    {error && (
                      <div className="text-[#f48771] mt-2">❌ Error: {error}</div>
                    )}
                    <div className="text-[#858585] mt-2">Console output will appear here...</div>
                    {(hasSubmittedQuery || generatedCode) && (
                      <div className="mt-2 text-[#4fc1ff]">✓ Analysis ready for execution</div>
                    )}
                  </div>
                )}
                
                {activeTab === 'docs' && (
                  <div className="p-4 bg-[#1e1e1e] text-[#cccccc] text-xs">
                    <h3 className="text-white font-semibold mb-3">Earth Engine API Reference</h3>
                    <div className="space-y-2">
                      <div className="text-[#9cdcfe]">ee.ImageCollection()</div>
                      <div className="ml-4 text-[#858585]">Load satellite imagery collections</div>
                      <div className="text-[#9cdcfe]">.filter()</div>
                      <div className="ml-4 text-[#858585]">Apply filters to data</div>
                      <div className="text-[#9cdcfe]">.select()</div>
                      <div className="ml-4 text-[#858585]">Choose specific bands</div>
                      {isCropQuery && (
                        <>
                          <div className="text-[#9cdcfe]">.normalizedDifference()</div>
                          <div className="ml-4 text-[#858585]">Calculate spectral indices</div>
                          <div className="text-[#9cdcfe]">ee.Classifier.smileRandomForest()</div>
                          <div className="ml-4 text-[#858585]">Random Forest classification</div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Right Panel - Output Viewer */}
          <ResizablePanel 
            defaultSize={outputPanelExpanded ? 30 : 0} 
            minSize={outputPanelExpanded ? 20 : 0}
            maxSize={outputPanelExpanded ? 50 : 0}
          >
            <div className="h-full bg-[#252526] border-l border-[#2d2d30] flex flex-col">
              {/* Output Panel Header */}
              <div className="h-10 bg-[#2d2d30] border-b border-[#3e3e42] flex items-center justify-between px-3">
                <div className="flex items-center space-x-2">
                  <Map className="w-4 h-4 text-[#4fc1ff]" />
                  <span className="text-xs font-medium text-white">Map Layers</span>
                  <span className="text-xs text-[#858585]">({layers.length})</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 text-[#cccccc] hover:text-white hover:bg-[#2a2d2e]"
                    onClick={() => setOutputPanelExpanded(!outputPanelExpanded)}
                  >
                    {outputPanelExpanded ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
                  </Button>
                </div>
              </div>

              {outputPanelExpanded && (
                <>
                  {/* Controls */}
                  <div className="p-3 border-b border-[#3e3e42] space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <span className="text-xs text-[#cccccc]">Sort:</span>
                        <select 
                          className="bg-[#3c3c3c] border border-[#5a5a5a] rounded px-2 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#007acc]"
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value as any)}
                        >
                          <option value="name">Name</option>
                          <option value="type">Type</option>
                          <option value="status">Status</option>
                        </select>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 text-[#cccccc] hover:text-white hover:bg-[#2a2d2e]"
                          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                        >
                          {sortOrder === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />}
                        </Button>
                      </div>
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        className={`h-6 px-2 text-xs ${filterVisible ? 'bg-[#094771] text-white' : 'text-[#cccccc] hover:text-white hover:bg-[#2a2d2e]'}`}
                        onClick={() => setFilterVisible(!filterVisible)}
                      >
                        <Filter className="w-3 h-3 mr-1" />
                        Visible
                      </Button>
                    </div>
                  </div>

                  {/* Layers List */}
                  <ScrollArea className="flex-1 p-2">
                    {filteredLayers.length > 0 ? (
                      <div className="space-y-2">
                        {filteredLayers.map((layer, index) => (
                          <div key={layer.name} className="bg-[#2d2d30] rounded p-3 space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2 flex-1 min-w-0">
                                {getTypeIcon(layer.type)}
                                <span className="text-xs text-white font-medium truncate">{layer.name}</span>
                                {getStatusIcon(layer.status)}
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0 text-[#cccccc] hover:text-white hover:bg-[#2a2d2e]"
                                onClick={() => toggleLayerVisibility(layers.findIndex(l => l.name === layer.name))}
                              >
                                {layer.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                              </Button>
                            </div>
                            
                            <div className="text-xs text-[#858585] truncate">{layer.description}</div>
                            
                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-[#cccccc]">Opacity</span>
                                <span className="text-xs text-[#858585]">{layer.opacity}%</span>
                              </div>
                              <Slider
                                value={[layer.opacity]}
                                onValueChange={(value) => updateLayerOpacity(layers.findIndex(l => l.name === layer.name), value[0])}
                                max={100}
                                step={5}
                                className="w-full"
                              />
                            </div>
                            
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-[#cccccc] capitalize">{layer.type}</span>
                              <span className={`px-2 py-0.5 rounded text-xs ${
                                layer.status === 'ready' ? 'bg-green-900/50 text-green-300' :
                                layer.status === 'loading' ? 'bg-blue-900/50 text-blue-300' :
                                'bg-red-900/50 text-red-300'
                              }`}>
                                {layer.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-32 text-[#858585]">
                        <Layers className="w-8 h-8 mb-2" />
                        <span className="text-xs">No layers to display</span>
                        <span className="text-xs">Submit a query to generate layers</span>
                      </div>
                    )}
                  </ScrollArea>
                </>
              )}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Status Bar */}
      <div className="h-6 bg-[#007acc] flex items-center justify-between px-3 text-xs text-white">
        <div className="flex items-center space-x-4">
          <span>Ln {generatedCode || hasSubmittedQuery ? (isCropQuery ? '85, Col 15' : '24, Col 15') : '1, Col 1'}</span>
          <span>JavaScript</span>
          <span>UTF-8</span>
          <span>Earth Engine API</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${isGenerating ? 'bg-yellow-300 animate-pulse' : 'bg-green-300'}`}></div>
            <span>{isGenerating ? 'Generating' : 'Ready'}</span>
          </div>
          <span>Phoenix IDE v1.0</span>
        </div>
      </div>
    </div>
  );
};

export default DevMode;
