import React, { useState } from 'react';
import { 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  Calendar, 
  User, 
  Info,
  CheckCircle2,
  Circle
} from 'lucide-react';

const TaskCard = ({ task, onUpdate, onDelete, onGetAdditionalInfo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({
    title: task.title,
    description: task.description,
    completed: task.completed
  });
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState(null);
  const [loadingInfo, setLoadingInfo] = useState(false);

  const handleSave = () => {
    onUpdate(task.id, editedTask);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTask({
      title: task.title,
      description: task.description,
      completed: task.completed
    });
    setIsEditing(false);
  };

  const toggleCompleted = () => {
    const updatedTask = { ...task, completed: !task.completed };
    onUpdate(task.id, updatedTask);
  };

  const handleGetAdditionalInfo = async () => {
    if (showAdditionalInfo) {
      setShowAdditionalInfo(false);
      return;
    }

    setLoadingInfo(true);
    try {
      const info = await onGetAdditionalInfo(task.id);
      setAdditionalInfo(info);
      setShowAdditionalInfo(true);
    } catch (error) {
      console.error('Error getting additional info:', error);
    } finally {
      setLoadingInfo(false);
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-l-4 ${
      task.completed ? 'border-green-400 bg-green-50/30' : 'border-blue-400'
    } animate-slide-up`}>
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <button
              onClick={toggleCompleted}
              className={`mt-1 transition-colors duration-200 ${
                task.completed 
                  ? 'text-green-500 hover:text-green-600' 
                  : 'text-gray-400 hover:text-blue-500'
              }`}
            >
              {task.completed ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <Circle className="h-5 w-5" />
              )}
            </button>
            
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editedTask.title}
                    onChange={(e) => setEditedTask({...editedTask, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Título de la tarea"
                  />
                  <textarea
                    value={editedTask.description}
                    onChange={(e) => setEditedTask({...editedTask, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows="3"
                    placeholder="Descripción de la tarea"
                  />
                </div>
              ) : (
                <div>
                  <h3 className={`text-lg font-semibold ${
                    task.completed ? 'text-gray-500 line-through' : 'text-gray-800'
                  }`}>
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className={`mt-2 text-sm ${
                      task.completed ? 'text-gray-400 line-through' : 'text-gray-600'
                    }`}>
                      {task.description}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2 ml-4">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                  title="Guardar"
                >
                  <Check className="h-4 w-4" />
                </button>
                <button
                  onClick={handleCancel}
                  className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                  title="Cancelar"
                >
                  <X className="h-4 w-4" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleGetAdditionalInfo}
                  disabled={loadingInfo}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 disabled:opacity-50"
                  title="Información adicional"
                >
                  {loadingInfo ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                  ) : (
                    <Info className="h-4 w-4" />
                  )}
                </button>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                  title="Editar"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDelete(task.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  title="Eliminar"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        </div>

        {task.createdAt && (
          <div className="mt-4 flex items-center text-xs text-gray-500">
            <Calendar className="h-3 w-3 mr-1" />
            Creada: {new Date(task.createdAt).toLocaleDateString('es-ES')}
          </div>
        )}

        {showAdditionalInfo && additionalInfo && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="text-sm font-semibold text-blue-800 mb-2 flex items-center">
              <User className="h-4 w-4 mr-1" />
              Información Adicional
            </h4>
            <div className="text-sm text-blue-700 space-y-1">
              {additionalInfo.name && (
                <p><span className="font-medium">Nombre:</span> {additionalInfo.name}</p>
              )}
              {additionalInfo.email && (
                <p><span className="font-medium">Email:</span> {additionalInfo.email}</p>
              )}
              {additionalInfo.phone && (
                <p><span className="font-medium">Teléfono:</span> {additionalInfo.phone}</p>
              )}
              {additionalInfo.website && (
                <p><span className="font-medium">Website:</span> {additionalInfo.website}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;