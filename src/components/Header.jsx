import React, { useState, useEffect } from 'react';
import { CheckSquare, Server, Wifi, WifiOff } from 'lucide-react';
import taskService from '../services/taskService';

const Header = () => {
  const [serverStatus, setServerStatus] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkServer = async () => {
      setIsChecking(true);
      const status = await taskService.checkServerStatus();
      setServerStatus(status);
      setIsChecking(false);
    };

    checkServer();
    const interval = setInterval(checkServer, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
              <CheckSquare className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Task Manager
              </h1>
              <p className="text-blue-100 text-sm">
                Gestiona tus tareas de manera eficiente
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center space-x-2">
              <Server className="h-4 w-4 text-white" />
              <span className="text-white text-sm font-medium">Backend:</span>
              <div className="flex items-center space-x-1">
                {isChecking ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                ) : serverStatus ? (
                  <Wifi className="h-4 w-4 text-green-300" />
                ) : (
                  <WifiOff className="h-4 w-4 text-red-300" />
                )}
                <span className={`text-xs font-semibold ${
                  serverStatus ? 'text-green-300' : 'text-red-300'
                }`}>
                  {isChecking ? 'Verificando...' : serverStatus ? 'Conectado' : 'Desconectado'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;