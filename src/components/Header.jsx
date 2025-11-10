import React, { useState } from 'react'; 
import { Play, Save, Share2, Settings, Moon, Sun, Plus, X, Menu, Code } from 'lucide-react';

export default function Header ({ isDark, onToggleTheme, onMenuOpen, onRunCode, onIncreaseFontSize, onDecreaseFontSize, onSaveCode}) 
    { return ( 
        <header className="bg-gray-800 dark:bg-gray-900 border-b border-gray-700 px-4 py-3 flex items-center justify-between 
        flex-wrap gap-3"> 
            <div className="flex items-center gap-4 flex-wrap"> 
                <h1 className="text-blue-500 font-bold text-lg flex items-center gap-2"> <Code size={20} /> CodeEditor</h1> 
                <select className="hidden bg-gray-700 text-gray-300 px-3 py-1.5 rounded text-sm border border-gray-600 focus:outline-none focus:border-blue-500"> 
                    <option>HTML5</option> 
                    <option>React</option> 
                    <option>Vue</option> 
                    <option>Svelte</option>
                </select> 
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded flex items-center gap-2 text-sm font-medium transition
                " onClick={onRunCode}> 
                    
                    <Play size={14} /> Run Code </button> 
                <div className="hidden md:flex items-center gap-2"> 
                    <button onClick={onSaveCode} 
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded flex items-center gap-2 text-sm transition"> 
                        <Save size={14} /> Save </button> 
                    <button className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded flex items-center gap-2 text-sm transition">
                        <Share2 size={14} /> Share </button> 
                    <button className="bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1.5 rounded flex items-center gap-2 text-sm border border-gray-600 transition"> 
                  Format </button> 
                </div> 
            </div> 
            
            <div className="flex items-center gap-2"> 
                    <button onClick={onIncreaseFontSize}
                            className="hidden md:block bg-gray-700 hover:bg-gray-600 text-gray-300 px-2 py-1.5 rounded text-xs border border-gray-600 transition"> 
                            A⁺ 
                    </button> 
                    <button onClick={onDecreaseFontSize}
                            className="hidden md:block bg-gray-700 hover:bg-gray-600 text-gray-300 px-2 py-1.5 rounded text-xs border border-gray-600 transition"> 
                            A⁻ </button> 
                <button onClick={onToggleTheme} className="hidden bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1.5 rounded md:flex items-center gap-2 text-sm border border-gray-600 transition" > 
                    {isDark ? <Moon size={14} /> : <Sun size={14} />} {isDark ? 'Dark' : 'Light'} </button>
                <button onClick={onMenuOpen} className="md:hidden bg-gray-700 hover:bg-gray-600 text-gray-300 p-2 rounded border border-gray-600 transition" > 
                    <Menu size={18} /> </button> 
            </div> 
        </header> 
        ); 
    }
