import React, { useState, useEffect, useCallback } from 'react';
import { TodoItem as TodoItemType } from '../../types';
import { getItems, createItem, updateItem, deleteItem } from '../../api/todos';
import TodoForm from './TodoForm';
import TodoItem from './TodoItem';

interface TodoListProps {
    listId: string;
}

const TodoList: React.FC<TodoListProps> = ({ listId }) => {
    const [items, setItems] = useState<TodoItemType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchItems = useCallback(async () => {
        try {
            setLoading(true);
            const response = await getItems(listId);
            setItems(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to load items');
        } finally {
            setLoading(false);
        }
    }, [listId]); // listId is a dependency

    useEffect(() => {
        fetchItems();
    }, [fetchItems]); // fetchItems is now stable due to useCallback

    const handleCreateItem = async (title: string, detail: string) => {
        try {
            const response = await createItem(listId, title, detail);
            setItems([...items, response.data]);
        } catch (err) {
            setError('Failed to create item');
        }
    };

    const handleUpdateItem = async (itemId: string, title: string, detail: string) => {
        try {
            const response = await updateItem(listId, itemId, title, detail);
            setItems(items.map(item => item._id === itemId ? response.data : item));
        } catch (err) {
            setError('Failed to update item');
        }
    };

    const handleDeleteItem = async (itemId: string) => {
        try {
            await deleteItem(listId, itemId);
            setItems(items.filter(item => item._id !== itemId));
        } catch (err) {
            setError('Failed to delete item');
        }
    };

    if (loading) {
        return <div className="text-center p-4">Loading...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                {items.length === 0 ? (
                    <p className="text-center text-gray-500">No tasks yet</p>
                ) : (
                    items.map(item => (
                        <TodoItem
                            key={item._id}
                            item={item}
                            onUpdate={handleUpdateItem}
                            onDelete={handleDeleteItem}
                        />
                    ))
                )}
            </div>
            {error && (
                <div className="bg-red-50 p-4 rounded-md">
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            )}
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-4">Add New Task</h2>
                <TodoForm onSubmit={handleCreateItem} />
            </div>
        </div>
    );
};


export default TodoList;