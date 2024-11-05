import React, { useState, useEffect } from 'react';
import { List } from '../../types';
import { getLists, createList, deleteList, updateList } from '../../api/todos';
import ListForm from './ListForm';
import TodoList from '../TodoItems/TodoList';

const ListView: React.FC = () => {
    const [lists, setLists] = useState<List[]>([]);
    const [selectedList, setSelectedList] = useState<List | null>(null);
    const [isEditing, setIsEditing] = useState<string | null>(null);

    useEffect(() => {
        fetchLists();
    }, []);

    const fetchLists = async () => {
        try {
            const response = await getLists();
            setLists(response.data);
        } catch (error) {
            console.error('Error fetching lists:', error);
        }
    };

    const handleCreateList = async (name: string) => {
        try {
            const response = await createList(name);
            setLists([...lists, response.data]);
        } catch (error) {
            console.error('Error creating list:', error);
        }
    };

    const handleUpdateList = async (id: string, name: string) => {
        try {
            await updateList(id, name);
            setLists(lists.map(list => list._id === id ? { ...list, name } : list));
            setIsEditing(null);
        } catch (error) {
            console.error('Error updating list:', error);
        }
    };

    const handleDeleteList = async (id: string) => {
        try {
            await deleteList(id);
            setLists(lists.filter(list => list._id !== id));
            if (selectedList?._id === id) {
                setSelectedList(null);
            }
        } catch (error) {
            console.error('Error deleting list:', error);
        }
    };

    console.log("selectedList", selectedList);

    return (
        <div className="flex h-screen">
            <div className="w-64 bg-gray-100 p-4">
                <h2 className="text-center text-lg font-semibold mb-4">My Lists</h2>
                <ListForm onSubmit={handleCreateList} />
                <div className="mt-4 space-y-2">
                    {lists.map((list) => (
                        <div
                            key={list._id}
                            className={`p-2 rounded cursor-pointer flex justify-between items-center ${selectedList?._id === list._id ? 'bg-indigo-100' : 'hover:bg-gray-200'
                                }`}
                        >
                            {isEditing === list._id ? (
                                <ListForm
                                    initialValue={list.name}
                                    onSubmit={(name) => handleUpdateList(list._id, name)}
                                />
                            ) : (
                                <>
                                    <span
                                        onClick={() => setSelectedList(list)}
                                        className="flex-1 min-w-0 truncate" // Added flex-1 and truncate for overflow handling
                                    >
                                        {list.name}
                                    </span>
                                    <div className="flex items-center ml-4 shrink-0"> {/* Added ml-4 for spacing and shrink-0 to prevent shrinking */}
                                        <button
                                            onClick={() => setIsEditing(list._id)}
                                            className="text-indigo-600 hover:text-indigo-600 mr-2"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteList(list._id)}
                                            className="text-red-600 hover:text-red-600"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex-1 p-4">
                <h2 className="text-center text-lg font-semibold mb-4">My Tasks</h2>
                {selectedList ? (
                    <TodoList listId={selectedList._id} />
                ) : (
                    <div className="text-center text-gray-500 mt-8">
                        Select a list to view tasks
                    </div>
                )}
            </div>
        </div>
    );
};

export default ListView;