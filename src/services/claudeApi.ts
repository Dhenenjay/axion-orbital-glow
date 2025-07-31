
interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ClaudeResponse {
  content: Array<{
    type: string;
    text: string;
  }>;
}

export class ClaudeApiService {
  private apiKey: string;
  private baseUrl = 'https://api.anthropic.com/v1/messages';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateCode(query: string): Promise<string> {
    // For now, we'll use a mock implementation since direct browser calls to Claude API
    // are blocked by CORS. In a production app, this would go through a backend proxy.
    return this.generateMockCode(query);
  }

  private generateMockCode(query: string): string {
    const lowerQuery = query.toLowerCase();
    
    // Detect location from query
    let location = 'geometry';
    let bounds = '[106.6922, -6.3713, 107.1576, -5.9969]'; // Jakarta default
    
    if (lowerQuery.includes('jalandhar')) {
      location = 'jalandhar';
      bounds = '[75.4726, 31.2559, 75.6726, 31.4559]';
    } else if (lowerQuery.includes('delhi')) {
      location = 'delhi';
      bounds = '[76.8388, 28.4089, 77.3464, 28.8534]';
    } else if (lowerQuery.includes('mumbai')) {
      location = 'mumbai';
      bounds = '[72.7757, 18.8900, 72.9757, 19.2900]';
    }

    // Detect satellite data type
    let satellite = 'LANDSAT/LC08/C02/T1_L2';
    let bands = "'SR_B4', 'SR_B3', 'SR_B2'";
    
    if (lowerQuery.includes('sentinel-2') || lowerQuery.includes('sentinel 2')) {
      satellite = 'COPERNICUS/S2_SR_HARMONIZED';
      bands = "'B4', 'B3', 'B2'";
    } else if (lowerQuery.includes('sentinel-1') || lowerQuery.includes('sentinel 1')) {
      satellite = 'COPERNICUS/S1_GRD';
      bands = "'VV', 'VH'";
    } else if (lowerQuery.includes('modis')) {
      satellite = 'MODIS/006/MOD09A1';
      bands = "'sur_refl_b01', 'sur_refl_b04', 'sur_refl_b03'";
    }

    // Detect year
    const yearMatch = query.match(/20\d{2}/);
    const year = yearMatch ? yearMatch[0] : '2024';
    
    // Detect analysis type
    let analysisType = 'visualization';
    if (lowerQuery.includes('flood') || lowerQuery.includes('water')) {
      analysisType = 'flood';
    } else if (lowerQuery.includes('vegetation') || lowerQuery.includes('ndvi')) {
      analysisType = 'vegetation';
    } else if (lowerQuery.includes('export')) {
      analysisType = 'export';
    }

    return this.generateCodeTemplate(location, bounds, satellite, bands, year, analysisType, query);
  }

  private generateCodeTemplate(location: string, bounds: string, satellite: string, bands: string, year: string, analysisType: string, originalQuery: string): string {
    const areaName = location.charAt(0).toUpperCase() + location.slice(1);
    
    let analysisCode = '';
    let visualizationCode = '';
    let exportCode = '';

    switch (analysisType) {
      case 'flood':
        analysisCode = `
// Water detection using NDWI
var ndwi = image.normalizedDifference(['B3', 'B8']).rename('NDWI');
var waterMask = ndwi.gt(0.2);

// Create flood probability map
var floodProbability = waterMask.focal_mean(1);`;
        visualizationCode = `
// Visualization parameters for flood detection
var waterVis = {min: 0, max: 1, palette: ['white', 'blue']};
Map.addLayer(waterMask, waterVis, 'Water Detection');
Map.addLayer(floodProbability, waterVis, 'Flood Probability');`;
        break;

      case 'vegetation':
        analysisCode = `
// Calculate NDVI for vegetation analysis
var ndvi = image.normalizedDifference(['B8', 'B4']).rename('NDVI');
var vegetation = ndvi.gt(0.3);

// Calculate vegetation health metrics
var vegetationHealth = ndvi.multiply(100);`;
        visualizationCode = `
// Visualization parameters for vegetation
var ndviVis = {min: -1, max: 1, palette: ['red', 'yellow', 'green']};
var vegVis = {min: 0, max: 100, palette: ['brown', 'yellow', 'green']};
Map.addLayer(ndvi, ndviVis, 'NDVI');
Map.addLayer(vegetationHealth, vegVis, 'Vegetation Health');`;
        break;

      case 'export':
        exportCode = `
// Export the processed image
Export.image.toDrive({
  image: image.select([${bands}]),
  description: '${areaName}_${satellite.split('/')[1]}_${year}',
  region: studyArea,
  scale: 30,
  maxPixels: 1e9,
  crs: 'EPSG:4326'
});

// Export as a batch task
Export.image.toAsset({
  image: image,
  description: '${areaName}_processed_${year}',
  assetId: 'users/YOUR_USERNAME/${areaName}_${year}',
  region: studyArea,
  scale: 30,
  maxPixels: 1e9
});`;
        break;

      default:
        analysisCode = `
// Basic image processing
var processedImage = image.select([${bands}]);
var composite = processedImage.median();`;
        visualizationCode = `
// True color visualization
var trueColorVis = {
  min: 0,
  max: 3000,
  bands: [${bands}]
};
Map.addLayer(composite, trueColorVis, '${areaName} True Color');`;
    }

    return `// Generated JavaScript Code
// Query: ${originalQuery}
// Generated for: ${areaName} analysis using ${satellite}

// Define study area
var studyArea = ee.Geometry.Rectangle([${bounds}]);

// Load ${satellite} imagery collection
var collection = ee.ImageCollection('${satellite}')
  .filterBounds(studyArea)
  .filterDate('${year}-01-01', '${year}-12-31')
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20));

// Get the median composite
var image = collection.median().clip(studyArea);

${analysisCode}

// Center the map on study area
Map.centerObject(studyArea, 10);

${visualizationCode}

${exportCode}

// Print collection information
print('Collection size:', collection.size());
print('Date range:', collection.aggregate_min('system:time_start'), 
      'to', collection.aggregate_max('system:time_start'));

// Add study area boundary
Map.addLayer(studyArea, {color: 'red'}, '${areaName} Boundary', false);

print('Analysis complete for ${areaName} using ${satellite} data from ${year}');`;
  }
}
