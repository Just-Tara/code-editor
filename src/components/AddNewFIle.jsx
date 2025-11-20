import React, { useState } from "react";
import { X } from "lucide-react";
import { LANGUAGES } from "../constant/Languages.jsx";

function AddNewFIle({ isOpen, onClose, onCreateFIle }) {
    const [filename, setFilename] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGES[0]);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("info");

    const handleCancel = () => {
        setFilename("");
        setSelectedLanguage(LANGUAGES[0]);
        setMessage("");
        onClose();
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!filename.trim()) {
            setMessage("Please enter a filename");
            setMessageType("error");
            return;
        }

        onCreateFIle({
            name: filename,
            language: selectedLanguage 
        });

        setFilename("");
        setSelectedLanguage(LANGUAGES[0]);
        setMessage("");
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
         
            <div 
                className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                onClick={handleCancel}
            >
                <div 
                    className="bg-gray-800 rounded-lg shadow-xl max-w-md w-full"
                    onClick={(e) => e.stopPropagation()}
                >
                   
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-200">Add New File</h3>
                        <button 
                            onClick={handleCancel}
                            className="text-gray-400 hover:text-gray-200 transition"
                        >
                            <X size={20} />
                        </button>    
                    </div>   

                    
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                       
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">
                                Filename:
                            </label>
                            <input  
                                type="text"
                                value={filename}
                                onChange={(e) => setFilename(e.target.value)}
                                placeholder="about.html"
                                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-md text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500"
                                autoFocus
                            />
                        </div>

                        
                        {message && 
                            <div 
                                className={`text-sm p-2 rounded-md ${
                                    messageType === "error" 
                                        ? "text-red-400 bg-red-900/30 border border-red-800" 
                                        : "text-blue-400 bg-blue-900/30 border border-blue-800"
                                }`}
                            >
                                {message}
                            </div>
                        }

                       
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">
                                File Type:
                            </label>
                            <div className="relative">
                                <select
                                    value={selectedLanguage.id}
                                    onChange={(e) => {
                                        const lang = LANGUAGES.find(l => l.id === e.target.value);
                                        setSelectedLanguage(lang);

                                        
                                        if (!filename.trim()) {
                                            setFilename(`newfile${lang.extension}`);
                                        }
                                    }}
                                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-md text-gray-200 focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
                                >
                                    {LANGUAGES.map(lang => (
                                        <option key={lang.id} value={lang.id}> 
                                            {lang.name} ({lang.extension})
                                        </option>
                                    ))}
                                </select>
                                
                                
                                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                                    <svg 
                                        className="w-4 h-4 text-gray-400" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            strokeWidth={2} 
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg> 
                                </div>
                            </div>

                          
                            <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
                                <span>Selected:</span>
                                <span className="text-gray-300 font-medium">
                                    {selectedLanguage.name}
                                </span>
                                <span 
                                    className="px-2 py-0.5 rounded text-xs font-mono"
                                    style={{ 
                                        backgroundColor: `${selectedLanguage.color}20`,
                                        color: selectedLanguage.color 
                                    }}
                                >
                                    {selectedLanguage.extension}
                                </span>
                            </div>
                        </div>

                       
                        <div className="flex gap-3 pt-2">
                            <button 
                                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-md transition"
                                type="button"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>
                            <button 
                                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition"
                                type="submit"
                            >
                                Create File
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default AddNewFIle;