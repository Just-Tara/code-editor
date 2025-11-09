import React, {useState} from "react"
import {Menu, Play, Save, Share2, Settings, Moon, Sun, Plus, X,  Code, FileText, FileCode, Dot, RefreshCw, Download, Info} from 'lucide-react'
import { faRefresh } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


function Header () {
    const [isDark, setIsDark] = useState(true);
    const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('html');
    const [activeMobileView, setActiveMobileView] = useState('html');

    return(
        <>
       
        <header className="bg-white dark:bg-gray-900 border-b border-gray-700 px-4 py-3 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-4 flex-wrap">
                <h1 className="text-blue-500 font-bold text-lg flex items-center gap-2"> <Code size={20}/> CodeEditor</h1>
                <select className="hidden bg-gray-700 text-gray-300 px-3 py-1.5 rounded text-sm border-gray-600 focus:outline-none focus-border-blue-500">
                    <option value="">HTML5</option>
                    <option value="">TypeScript</option>
                    <option value="">Vue</option>
                    <option value="">React</option>
                </select>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded flex items-center gap-2 text-sm font-medium transition"><Play size={14}/> Run Code</button>
                <div className="hidden md:flex items-center gap-2">
                    <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded flex items-center gap-2 text-sm transition"><Save size={14}/> Save</button>
                    <button  className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded flex items-center gap-2 text-sm transition"><Share2 size={14}/> Share</button>
                    <button className="bg-gray-700 px-3 py-1.5 rounded flex hover:bg-gray-600 items-center text-sm text-gray-300 border-gray-600 transition">Format</button>
                </div>
                 <div className="flex items-center gap-2">
                        <button className="hidden md:block bg-gray-700 hover:bg-gray-600 text-gray-300 p-2 rounded border border-gray-600 transition"><Settings size={16}/></button>
                        <button className="hidden md:block bg-gray-700 hover:bg-gray-600 text-gray-300 px-2 py-1.5 rounded text-xs border border-gray-600 transition">A-</button>
                        <button className="hidden md:block bg-gray-700 hover:bg-gray-600 text-gray-300 px-2 py-1.5 rounded text-xs border border-gray-600 transition">A+</button>
                        <button className=" hidden bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1.5 rounded md:flex items-center gap-2 text-sm border border-gray-600 transition"
                                onClick={() => setIsDark(!isDark)}>{isDark ? <Moon size={14}/> : <Sun size={14}/>}
                                                {isDark? 'Dark' : 'Light'}</button>
                </div>
                <button className="md:hidden bg-gray-700 hover:bg-gray-600 text-gray-300 p-2 rounded border border-gray-600 transition"
                        onClick={() => setIsHamburgerOpen(!isHamburgerOpen)}><Menu size={18}/></button>
            </div>
           
        </header>
        <div className="md:hidden bg-gray-800 border-b border-gray-700 flex">
                <button onClick={() => setActiveMobileView('html')}
                        className={`flex-1 py-3 text-sm font-medium border-b-2 transition ${activeMobileView === 'html' ? 'text-gray-200 border-blue-500' : 'text-gray-500 border-transparent' }`}>HTML
                </button>

                 <button onClick={() => setActiveMobileView('css')}
                        className={`flex-1 py-3 text-sm font-medium border-b-2 transition ${activeMobileView === 'css' ? 'text-gray-200 border-blue-500' : 'text-gray-500 border-transparent' }`}>CSS
                </button>

                 <button onClick={() => setActiveMobileView('js')}
                        className={`flex-1 py-3 text-sm font-medium border-b-2 transition ${activeMobileView === 'js' ? 'text-gray-200 border-blue-500' : 'text-gray-500 border-transparent' }`}>JS
                </button>

                <button onClick={() => setActiveMobileView('preview')}
                        className={`flex-1 py-3 text-sm font-medium border-b-2 transition ${activeMobileView === 'preview' ? 'text-gray-200 border-blue-500' : 'text-gray-500 border-transparent' }`}>Preview
                </button>

        </div>

        <div className="flex-1 flex overflow-hidden">
            <div className={`flex-1 md:flex flex-col border-r border-gray-700 ${activeMobileView === 'preview' ? 'hidden' : 'flex'}`}>
                <div className="hidden md:flex bg-gray-800 border-b border-gray-700 px-2">
                    <button onClick={() => setActiveTab('html')}
                            className={`px-4 py-2 text-sm flex items-center gap-2 border-b-2 transition ${activeTab === 'html' ? 'text-gray-200 border-blue-500' : 'text-gray-500 border-transparent' }`}>index.html <X size={14} className="hover:text-gray-300"/>
                    </button>

                    <button onClick={() => setActiveTab('css')}
                            className={`px-4 py-2 text-sm flex items-center gap-2 border-b-2 transition ${activeTab === 'css' ? 'text-gray-200 border-blue-500' : 'text-gray-500 border-transparent' }`}>style.css <X size={14} className="hover:text-gray-300"/>
                    </button>

                    <button onClick={() => setActiveTab('js')}
                            className={`px-4 py-2 text-sm flex items-center gap-2 border-b-2 transition ${activeTab === 'js' ? 'text-gray-200 border-blue-500' : 'text-gray-500 border-transparent' }`}>script.js <X size={14} className="hover:text-gray-300"/>
                    </button>

                   <button className="px-3 py-2 text-green-500 hover:text-gray-400 transition"><Plus size={16}/></button>
                </div>
                <div className="flex-1 bg-gray-800 font-mono overflow-auto">
                    <div></div>
                    {activeTab === 'html' && <textarea className="w-full h-full bg-gray-800 text-gray-200 p-4 resize-none outline-none border-none" defaultValue={`<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Document</title>\n</head>\n<body>\n    \n</body>\n</html>`}></textarea>}
                    {activeTab === 'css' && <textarea className="w-full h-full bg-gray-800 text-gray-200 p-4 resize-none outline-none border-none" defaultValue={`body {\n    margin: 0;\n    padding: 0;\n    font-family: Arial, sans-serif;\n}`}></textarea>}
                    {activeTab === 'js' && <textarea className="w-full h-full bg-gray-800 text-gray-200 p-4 resize-none outline-none border-none" defaultValue={`console.log('Hello, World!');`}></textarea>}   
                </div>
                <div className="bg-gray-800 border-t-2 border-gray-700 px-4 py-2 flex items-center ustify-between text-xs text-gray-500">
                   {/** botom section */}
                    <div className="flex items-center gap-4 ">
                        <span>Ln 9, Col 8</span>
                        <span>UTF-8</span>
                        <span>HTML</span>
                        <span className="text-green-500 flex items-center "><Dot/>Saved</span>
                    </div>
                </div>
            </div>
            {/**Preview */}
            <div className={`flex-1 md:flex flex-col ${activeMobileView !== 'preview' ? 'hidden md:flex' : 'flex'}`}>
                <div className="bg-gray-800 border-b border-gray-700 px-4 py-1.5 flex items-center justify-between">
                    <span className="text-sm text-gray-300 font-medium">Live Preview</span>
                    <div className="hidden md:flex items-center gap-2">
                        <select name="" id="" className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs border border-gray-600">
                            <option value="">Desktop</option>
                            <option value="">Tablet</option>
                            <option value="">Mobile</option>
                        </select>
                        <button className="bg-gray-700 hover:bg-gray-600 text-gray-300 p-1 rounded border border-gray-600 transition"><RefreshCw size={14}/></button>
                        <button>

                        </button>
                    </div>
                </div>
            </div>
            {/** Hamburger menu */}
            {isHamburgerOpen && (
                <>
                    <div className="md:hidden fixed top-0 bottom-0 right-0 w-80 bg-gray-800 z-50 overflow-y-auto shadow-xl">
                        <div className="bg-gray-900 px-4 py-4.5 flex items-center justify-between border-b border-gray-700">
                            <h2 className="text-gray-200 font-semibold flex items-center gap-2"><Settings size={18}/> Settings</h2>
                            <button className="text-gray-400 hover:text-gray-200"
                                    onClick={() => setIsHamburgerOpen(false)}><X size={20}/></button>
                        </div>
                        <div className="p-4 space-y-3">
                            <div className="bg-gray-900 rounded p-3">
                                <div className="text-xs text-gray-500 mb-1">Language</div>
                                    <div className="text-sm text-gray-200 flex items-center justify-between">
                                        HTML <span className="text-gray-500"></span>  </div>
                            </div>

                            {/**Theme */}

                            <div className="bg-gray-900 rounded p-3">
                                <div className="text-xs text-gray-500 mb-1"> 
                                    <div className="text-sm text-gray-200 flex items-center justify-between"> <div className="flex items-center gap-2 "><Moon size={14}/> Dark Mode </div>
                                        <div className="w-10 h-5 bg-blue-600 rounded-full relative">
                                            <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/** Font Size */}

                            <div className="bg-gray-900 rounded p-3">
                                <div className="text-xs text-gray-500 mb-1">Font Size</div>
                                <div className="text-sm text-gray-200 flex items-center justify-between"> <span>14px</span>
                                    <div className="flex gap-2"> 
                                        <button className="bg-gray-700 px-2 py-1 rounded text-xs">-</button>
                                        <button className="bg-gray-700 px-2 py-1 rounded text-xs">+</button>
                                    </div>
                                </div>
                            </div>

                            {/** Auto Save */}
                            <div className="bg-gray-900 rounded p-3">
                                <div className="text-xs text-gray-500 mb-1">Auto save</div>
                                <div className="text-sm text-gray-200 flex items-center justify-between"><span>Enabled</span> 
                                    <div className="w-10 h-5 bg-blue-600 rounded-full relative">
                                            <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full"></div>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-gray-700 my-3"></div>

                            {/** buttons */}
                            <button className="w-full text-left text-sm text-green-400 hover:text-green-300 py-1 flex items-center gap-2"><Save size={16}/> Save</button>
                            <button className="w-full text-left text-sm text-purple-400 hover:text-purple-300 py-1 flex items-center gap-2"><Share2 size={16}/> Share</button>
                            <button className="w-full text-left text-sm text-gray-300 hover:text-gray-200 py-1 flex items-center gap-2"><Download size={16}/> Export</button>

                            <div className="border-t border-gray-700 my-3"></div>
                            
                            <button className="w-full text-left text-sm text-gray-500 hover:text-gray-400 py-1 flex items-center gap-2"><Info size={16}/> About</button>
                        </div>
                    </div>
                </>
            )}
        </div>
        </>
    )
}

export default Header