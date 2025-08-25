import React, { useState, useEffect } from 'react';
import { Plus, AlertCircle, RefreshCw } from 'lucide-react';
import Header from './components/Header';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import taskService from './services/taskService';

function App() {
  const [tasks, setTasks] = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const tasksData = await taskService.getAllTasks();
      setTasks(tasksData);
    } catch (error) {
      setError('Error al cargar las tareas. Verifica que el servidor esté funcionando.');
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      const newTask = await taskService.createTask(taskData);
      setTasks(prevTasks => [...prevTasks, newTask]);
      setShowTaskForm(false);
    } catch (error) {
      setError('Error al crear la tarea');
      console.error('Error creating task:', error);
    }
  };

  const handleUpdateTask = async (id, taskData) => {
    try {
      const updatedTask = await taskService.updateTask(id, taskData);
      setTasks(prevTasks => 
        prevTasks.map(task => task.id === id ? updatedTask : task)
      );
    } catch (error) {
      setError('Error al actualizar la tarea');
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      try {
        await taskService.deleteTask(id);
        setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
      } catch (error) {
        setError('Error al eliminar la tarea');
        console.error('Error deleting task:', error);
      }
    }
  };

  const handleGetAdditionalInfo = async (id) => {
    try {
      return await taskService.getAdditionalTaskInfo(id);
    } catch (error) {
      setError('Error al obtener información adicional');
      console.error('Error getting additional info:', error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando tareas...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-red-800">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        )}

        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Mis Tareas</h2>
            <p className="text-gray-600 mt-1">Organiza y gestiona tus actividades diarias</p>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={loadTasks}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg transition-colors duration-200 shadow-sm"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Actualizar</span>
            </button>
            
            <button
              onClick={() => setShowTaskForm(true)}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              <Plus className="h-4 w-4" />
              <span>Nueva Tarea</span>
            </button>
          </div>
        </div>

        <TaskList
          tasks={tasks}
          onUpdate={handleUpdateTask}
          onDelete={handleDeleteTask}
          onGetAdditionalInfo={handleGetAdditionalInfo}
        />

        {showTaskForm && (
          <TaskForm
            onSubmit={handleCreateTask}
            onCancel={() => setShowTaskForm(false)}
          />
        )}
      </main>
    </div>
  );
}

export default App;