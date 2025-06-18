
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
    const messages: ClaudeMessage[] = [
      {
        role: 'user',
        content: `Generate Google Earth Engine JavaScript code for this satellite data analysis request: "${query}". 

Please provide complete, functional Earth Engine code that includes:
1. Proper data collection filtering
2. Analysis/processing steps
3. Visualization parameters
4. Map layers and exports
5. Comments explaining each step

Focus on satellite imagery analysis, flood detection, vegetation monitoring, or other remote sensing applications as appropriate for the query.`
      }
    ];

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-7-sonnet-20250219',
          max_tokens: 2000,
          messages: messages
        })
      });

      if (!response.ok) {
        throw new Error(`Claude API error: ${response.status}`);
      }

      const data: ClaudeResponse = await response.json();
      return data.content[0]?.text || '// Error generating code';
    } catch (error) {
      console.error('Claude API error:', error);
      return '// Error connecting to Claude API. Please check your connection and API key.';
    }
  }
}
