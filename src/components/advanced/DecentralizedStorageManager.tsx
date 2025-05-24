
import React, { useState } from 'react';
import { Upload, Download, Trash2, Share, HardDrive, Shield, FileText, Image, Film, Music } from 'lucide-react';
import { useDecentralizedStorage } from '../../hooks/useDecentralizedStorage';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useToast } from '../ui/use-toast';

const DecentralizedStorageManager = () => {
  const { toast } = useToast();
  const {
    files,
    isUploading,
    isRetrieving,
    uploadFile,
    retrieveFile,
    deleteFile,
    shareFile,
    getStorageStats
  } = useDecentralizedStorage();

  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [encryptionEnabled, setEncryptionEnabled] = useState(true);
  const [shardingEnabled, setShardingEnabled] = useState(false);

  const stats = getStorageStats();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      await uploadFile(selectedFile, {
        encryption: encryptionEnabled,
        sharding: shardingEnabled,
        redundancy: 3
      });

      setSelectedFile(null);
      toast({
        title: "File Uploaded Successfully!",
        description: `${selectedFile.name} has been stored on IPFS with encryption.`,
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload file to IPFS. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleRetrieve = async (fileId: string) => {
    try {
      const result = await retrieveFile(fileId);
      
      toast({
        title: "File Retrieved!",
        description: "File has been downloaded from IPFS successfully.",
      });
      
      console.log('Retrieved file:', result);
    } catch (error) {
      toast({
        title: "Retrieval Failed",
        description: "Failed to retrieve file from IPFS.",
        variant: "destructive"
      });
    }
  };

  const handleShare = async (fileId: string) => {
    try {
      const shareInfo = await shareFile(fileId, ['recipient@example.com']);
      
      toast({
        title: "File Shared!",
        description: "Share link has been generated successfully.",
      });
      
      console.log('Share info:', shareInfo);
    } catch (error) {
      toast({
        title: "Share Failed",
        description: "Failed to generate share link.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (fileId: string) => {
    try {
      await deleteFile(fileId);
      
      toast({
        title: "File Deleted",
        description: "File has been removed from IPFS.",
      });
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "Failed to delete file from IPFS.",
        variant: "destructive"
      });
    }
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return Image;
    if (mimeType.startsWith('video/')) return Film;
    if (mimeType.startsWith('audio/')) return Music;
    return FileText;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
          <HardDrive className="w-6 h-6" />
          Decentralized Storage (IPFS)
        </h2>
        <p className="text-purple-100">Store and retrieve files on the distributed web</p>
        
        <div className="grid grid-cols-4 gap-4 mt-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.totalFiles}</div>
            <div className="text-sm text-purple-200">Files</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold">{formatFileSize(stats.totalSize)}</div>
            <div className="text-sm text-purple-200">Total Size</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.encryptionRate.toFixed(0)}%</div>
            <div className="text-sm text-purple-200">Encrypted</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.totalAccess}</div>
            <div className="text-sm text-purple-200">Accesses</div>
          </div>
        </div>
      </div>

      {/* Upload Area */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Upload to IPFS</h3>
        
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">
            {selectedFile ? selectedFile.name : 'Drag and drop a file here, or click to select'}
          </p>
          <input
            type="file"
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="inline-block px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition-colors"
          >
            Select File
          </label>
        </div>

        {selectedFile && (
          <div className="mt-4 space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-gray-500" />
                <div>
                  <div className="font-semibold">{selectedFile.name}</div>
                  <div className="text-sm text-gray-600">
                    {formatFileSize(selectedFile.size)} • {selectedFile.type}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={encryptionEnabled}
                    onChange={(e) => setEncryptionEnabled(e.target.checked)}
                  />
                  <span className="text-sm">Enable encryption</span>
                </label>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={shardingEnabled}
                    onChange={(e) => setShardingEnabled(e.target.checked)}
                  />
                  <span className="text-sm">Enable sharding</span>
                </label>
              </div>

              <Button 
                onClick={handleUpload} 
                disabled={isUploading}
                className="w-full"
              >
                {isUploading ? 'Uploading to IPFS...' : 'Upload to IPFS'}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* File List */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Stored Files</h3>
        
        {files.length === 0 ? (
          <div className="text-center py-8">
            <HardDrive className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No files stored yet. Upload your first file above!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {files.map((file) => {
              const FileIcon = getFileIcon(file.mimeType);
              
              return (
                <div key={file.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileIcon className="w-8 h-8 text-gray-500" />
                      <div className="flex-1">
                        <div className="font-semibold">{file.filename}</div>
                        <div className="text-sm text-gray-600">
                          {formatFileSize(file.size)} • 
                          Uploaded: {file.uploadedAt.toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500 font-mono">
                          IPFS: {file.ipfsHash}
                        </div>
                        <div className="flex gap-2 mt-1">
                          {file.encrypted && (
                            <Badge variant="outline" className="text-xs">
                              <Shield className="w-3 h-3 mr-1" />
                              Encrypted
                            </Badge>
                          )}
                          {file.sharded && (
                            <Badge variant="outline" className="text-xs">
                              Sharded
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {file.accessCount} accesses
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleRetrieve(file.id)}
                        disabled={isRetrieving}
                        size="sm"
                        variant="outline"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleShare(file.id)}
                        size="sm"
                        variant="outline"
                      >
                        <Share className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(file.id)}
                        size="sm"
                        variant="destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* IPFS Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <HardDrive className="w-6 h-6 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-800 mb-2">IPFS Storage Benefits</h4>
            <ul className="text-sm text-blue-600 space-y-1">
              <li>• Decentralized and censorship-resistant storage</li>
              <li>• Content addressing ensures data integrity</li>
              <li>• Automatic deduplication saves space</li>
              <li>• Files remain accessible even if nodes go offline</li>
              <li>• Optional encryption for sensitive data</li>
              <li>• Global content distribution network</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DecentralizedStorageManager;
