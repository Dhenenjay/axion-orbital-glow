import React, { useState } from 'react';
import { 
  ChevronRight, 
  ChevronDown, 
  File, 
  Folder, 
  FolderOpen,
  Code,
  FileText,
  Image,
  Settings
} from 'lucide-react';

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  isOpen?: boolean;
}

const initialFileTree: FileNode[] = [
  {
    name: 'earth-engine-scripts',
    type: 'folder',
    isOpen: true,
    children: [
      {
        name: 'crop-classification',
        type: 'folder',
        isOpen: true,
        children: [
          { name: 'hoshiarpur-analysis.js', type: 'file' },
          { name: 'rabi-season-2022.js', type: 'file' },
          { name: 'training-data.geojson', type: 'file' }
        ]
      },
      {
        name: 'flood-risk',
        type: 'folder',
        isOpen: false,
        children: [
          { name: 'jakarta-flood-2020.js', type: 'file' },
          { name: 'sar-analysis.js', type: 'file' },
          { name: 'population-risk.js', type: 'file' }
        ]
      },
      {
        name: 'utils',
        type: 'folder',
        isOpen: false,
        children: [
          { name: 'satellite-helpers.js', type: 'file' },
          { name: 'visualization.js', type: 'file' },
          { name: 'export-tools.js', type: 'file' }
        ]
      }
    ]
  },
  {
    name: 'assets',
    type: 'folder',
    isOpen: false,
    children: [
      { name: 'boundaries', type: 'folder' },
      { name: 'legends', type: 'folder' }
    ]
  },
  { name: 'README.md', type: 'file' },
  { name: 'package.json', type: 'file' }
];

const FileTree = () => {
  const [fileTree, setFileTree] = useState<FileNode[]>(initialFileTree);
  const [selectedFile, setSelectedFile] = useState<string>('hoshiarpur-analysis.js');

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'js':
        return <Code className="w-4 h-4 text-yellow-400" />;
      case 'json':
      case 'geojson':
        return <FileText className="w-4 h-4 text-blue-400" />;
      case 'md':
        return <FileText className="w-4 h-4 text-gray-400" />;
      case 'png':
      case 'jpg':
      case 'svg':
        return <Image className="w-4 h-4 text-green-400" />;
      default:
        return <File className="w-4 h-4 text-gray-400" />;
    }
  };

  const toggleFolder = (path: string) => {
    const updateNode = (nodes: FileNode[], targetPath: string, currentPath = ''): FileNode[] => {
      return nodes.map(node => {
        const nodePath = currentPath ? `${currentPath}/${node.name}` : node.name;
        
        if (nodePath === targetPath && node.type === 'folder') {
          return { ...node, isOpen: !node.isOpen };
        }
        
        if (node.children) {
          return {
            ...node,
            children: updateNode(node.children, targetPath, nodePath)
          };
        }
        
        return node;
      });
    };

    setFileTree(updateNode(fileTree, path));
  };

  const renderNode = (node: FileNode, depth = 0, path = '') => {
    const currentPath = path ? `${path}/${node.name}` : node.name;
    const isSelected = selectedFile === node.name;

    if (node.type === 'folder') {
      return (
        <div key={currentPath}>
          <div
            className={`flex items-center py-1 px-2 cursor-pointer hover:bg-[hsl(var(--editor-sidebar))] transition-colors duration-150 ${
              isSelected ? 'bg-[hsl(var(--editor-accent-muted))]' : ''
            }`}
            style={{ paddingLeft: `${8 + depth * 16}px` }}
            onClick={() => toggleFolder(currentPath)}
          >
            {node.isOpen ? (
              <ChevronDown className="w-4 h-4 mr-1 text-[hsl(var(--editor-text-muted))]" />
            ) : (
              <ChevronRight className="w-4 h-4 mr-1 text-[hsl(var(--editor-text-muted))]" />
            )}
            {node.isOpen ? (
              <FolderOpen className="w-4 h-4 mr-2 text-[hsl(var(--editor-accent))]" />
            ) : (
              <Folder className="w-4 h-4 mr-2 text-[hsl(var(--editor-accent))]" />
            )}
            <span className="text-sm text-[hsl(var(--editor-text))] select-none">
              {node.name}
            </span>
          </div>
          {node.isOpen && node.children && (
            <div>
              {node.children.map(child => renderNode(child, depth + 1, currentPath))}
            </div>
          )}
        </div>
      );
    }

    return (
      <div
        key={currentPath}
        className={`flex items-center py-1 px-2 cursor-pointer hover:bg-[hsl(var(--editor-sidebar))] transition-colors duration-150 ${
          isSelected ? 'bg-[hsl(var(--editor-accent-muted))] border-r-2 border-[hsl(var(--editor-accent))]' : ''
        }`}
        style={{ paddingLeft: `${24 + depth * 16}px` }}
        onClick={() => setSelectedFile(node.name)}
      >
        {getFileIcon(node.name)}
        <span className={`text-sm ml-2 select-none ${
          isSelected ? 'text-[hsl(var(--editor-text))] font-medium' : 'text-[hsl(var(--editor-text-muted))]'
        }`}>
          {node.name}
        </span>
      </div>
    );
  };

  return (
    <div className="h-full bg-[hsl(var(--editor-panel))] border-r border-[hsl(var(--editor-border))] flex flex-col">
      {/* Explorer Header */}
      <div className="h-9 px-3 flex items-center justify-between bg-[hsl(var(--editor-sidebar))] border-b border-[hsl(var(--editor-border))]">
        <span className="text-xs font-semibold text-[hsl(var(--editor-text))] uppercase tracking-wider">
          Explorer
        </span>
        <Settings className="w-4 h-4 text-[hsl(var(--editor-text-muted))] hover:text-[hsl(var(--editor-text))] cursor-pointer" />
      </div>
      
      {/* File Tree */}
      <div className="flex-1 overflow-y-auto py-1">
        {fileTree.map(node => renderNode(node))}
      </div>
    </div>
  );
};

export default FileTree;