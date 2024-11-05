export interface User {
    id: string;
    username: string;
}

export interface List {
    _id: string;
    name: string;
    user: string;
}

export interface TodoItem {
    _id: string;
    title: string;
    detail: string;
    dateAdded: string;
    list: string;
}