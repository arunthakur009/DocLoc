import React, { useState } from 'react';
import { Home, User, Settings, Menu, X, FileText, Mail, Calendar } from 'lucide-react';

const Sidebar = ({ defaultExpanded = true }) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  
  const navItems = [
    { name: 'Dashboard', icon: <Home size={20} />, path: '/' },
    { name: 'Profile', icon: <User size={20} />, path: '/profile' },
    { name: 'Documents', icon: <FileText size={20} />, path: '/documents' },
    { name: 'Messages', icon: <Mail size={20} />, path: '/messages' },
    { name: 'Calendar', icon: <Calendar size={20} />, path: '/calendar' },
    { name: 'Settings', icon: <Settings size={20} />, path: '/settings' },
  ];

  return (
    <div className={`h-screen bg-gray-800 text-white transition-all duration-300 ${expanded ? 'w-64' : 'w-20'}`}>
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {expanded && <h1 className="text-xl font-bold">AppName</h1>}
        <button 
          onClick={() => setExpanded(!expanded)} 
          className="p-2 rounded-lg hover:bg-gray-700"
        >
          {expanded ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="mt-6">
        <ul>
          {navItems.map((item, index) => (
            <li key={index}>
              <a 
                href={item.path}
                className="flex items-center p-4 hover:bg-gray-700 transition-colors"
              >
                <span className="inline-flex">{item.icon}</span>
                {expanded && (
                  <span className="ml-4">{item.name}</span>
                )}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Sidebar Footer */}
      {expanded && (
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-700">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gray-600"></div>
            <div className="ml-3">
              <p className="font-medium">User Name</p>
              <p className="text-sm text-gray-400">user@example.com</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;