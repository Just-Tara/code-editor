import React, { useState } from 'react'; 
import { Play, Save, Share2, Settings, Moon, Sun, Plus, X, Menu, Code } from 'lucide-react';
import logo from '../assets/logo.png';

export default function Header ({ 
        isDark, 
        onToggleTheme, 
        onMenuOpen, 
        onRunCode, 
        onIncreaseFontSize, 
        onDecreaseFontSize, 
        onSaveCode, 
        onToggleAutoSave, 
        isAutoSaveEnabled,
        onFormatCode,
        onShareCode,
        isRunning
    }) 
    { return ( 
        <header className={` dark:bg-gray-900 border-b border-gray-700 px-4 py-3 flex items-center justify-between 
        flex-wrap gap-3`}> 
            <div className="flex items-center gap-4 flex-wrap"> 
                <div className="font-bold text-lg flex items-center gap-2">
                    <img src={logo} alt="Codrume-Logo" className='w-7'/>

                        <h1 className={`dark:text-white text-xl leading-none tracking-wide`}>
                            Cod<span className="text-blue-500">rume</span>
                        </h1>
                    
                </div>
                <button className={`cursor-pointer px-4 py-1.5 rounded flex items-center gap-2 text-sm font-medium transition ${
                    isRunning
                        ? 'bg-gray-600 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                } text-white `} 
                        onClick={onRunCode}
                        disabled={isRunning}
                >
                    {isRunning ? (
                        <>
                            <div className="flex gap-1">
                                <div className='w-2 h-2 bg-white rounded-full animate-bounce' style={{ animationDelay: '0ms'}}></div>
                                <div className='w-2 h-2 bg-white rounded-full animate-bounce' style={{ animationDelay: '150ms'}}></div>
                                <div className='w-2 h-2 bg-white rounded-full animate-bounce' style={{ animationDelay: '300ms'}}></div>
                            </div>
                            <span>Running...</span>
                        </>
                    ) : (
                        <>
                            <Play size={14} />
                            <span>Run Code</span>
                        </>
                    )}
                </button>
                                    
                    
                <div className=" hidden md:flex items-center gap-2"> 
                    <button onClick={onSaveCode} 
                        className=" cursor-pointer bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded flex items-center gap-2 text-sm transition"> 
                        <Save size={14} /> Save </button> 
                    <button onClick={onShareCode}
                            className=" cursor-pointer bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded flex items-center gap-2 text-sm transition">
                        <Share2 size={14} /> Share </button> 
                    <button onClick={onFormatCode}
                            className=" cursor-pointer bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1.5 rounded flex items-center gap-2 text-sm border border-gray-600 transition"> 
                  Format </button> 
                </div> 
            </div> 
            
            <div className="flex items-center gap-2"> 
                    <button 
                        onClick={onToggleAutoSave}
                        className={` cursor-pointer hidden px-3 py-1.5 rounded md:flex items-center gap-2 text-xs border transition ${
                        isAutoSaveEnabled
                            ? 'bg-green-600 text-white border-green-600' 
                            : 'bg-gray-700 text-gray-300 border-gray-600'
                        }`}
                        title={isAutoSaveEnabled ? 'Auto-save is ON' : 'Auto-save is OFF'}
                    >
                        {isAutoSaveEnabled ? '● Auto Save' : '○ Manual'}
                    </button>
                    <button onClick={onIncreaseFontSize}
                            className=" cursor-pointer hidden md:block bg-gray-700 hover:bg-gray-600 text-gray-300 px-2 py-1.5 rounded text-xs border border-gray-600 transition"> 
                            A⁺ 
                    </button> 
                    <button onClick={onDecreaseFontSize}
                            className=" cursor-pointer hidden md:block bg-gray-700 hover:bg-gray-600 text-gray-300 px-2 py-1.5 rounded text-xs border border-gray-600 transition"> 
                            A⁻ </button> 
                <button onClick={onToggleTheme} className="  cursor-pointer hidden bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1.5 rounded md:flex items-center gap-2 text-sm border border-gray-600 transition" > 
                    {isDark ? <Moon size={14} /> : <Sun size={14} />} {isDark ? 'Dark' : 'Light'} </button>
                <button onClick={onMenuOpen} className="  cursor-pointer md:hidden bg-gray-700 hover:bg-gray-600 text-gray-300 p-2 rounded border border-gray-600 transition" > 
                    <Menu size={18} /> </button> 
            </div> 
        </header> 
        ); 
    }
