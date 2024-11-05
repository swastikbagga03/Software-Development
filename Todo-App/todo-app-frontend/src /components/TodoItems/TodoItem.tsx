import React, { useState } from 'react';
import { TodoItem as TodoItemType } from '../../types';
import TodoForm from './TodoForm';

interface TodoItemProps {
  item: TodoItemType;
  onUpdate: (id: string, title: string, detail: string) => void;
  onDelete: (id: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ item, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdate = (title: string, detail: string) => {
    onUpdate(item._id, title, detail);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="border rounded-lg p-4 mb-4 bg-gray-50">
        <TodoForm
          initialValues={{ title: item.title, detail: item.detail }}
          onSubmit={handleUpdate}
        />
        <button
          onClick={() => setIsEditing(false)}
          className="mt-2 text-sm text-gray-600 hover:text-gray-800"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-4 mb-4 hover:bg-gray-50">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
          <p className="mt-1 text-sm text-gray-600">{item.detail}</p>
          <p className="mt-2 text-xs text-gray-500">
            Added: {new Date(item.dateAdded).toLocaleDateString()}
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm text-indigo-600 hover:text-indigo-800"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(item._id)}
            className="text-sm text-red-600 hover:text-red-800"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoItem;