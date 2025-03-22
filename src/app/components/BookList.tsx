import { useState, useEffect } from 'react';


const API_URL = 
    process.env.NODE_ENV === "production"
    ? "https://ebb-and-flow.fly.dev"
    : "http://localhost:8000";


type Book = {
    book_id: number;
    book_title: string;
};

export default function BookList({ refreshTable }: { refreshTable: boolean }) {
    const [ bookList, setBookList ] = useState<Book[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const url = API_URL + "/api/get_book_list";
                const response = await fetch(url, {
                    method: "GET",
                    headers: {"Content-Type": "application/json"},
                });
                if (!response.ok) {throw new Error("Failed to fetch events");}

                const result = await response.json();
                setBookList(result.data);
            } catch (error) {
                console.error("Error:", error);
            }
        };

        fetchData();
    }, [refreshTable]);

    
    return (
        <div className="ag-theme-alpine p-4 border rounded-md shadow-md bg-white">
            <h1><strong>Previously Accessed Book List</strong></h1>
            <ul className="list-disc pl-5 space-y-2">
                {bookList.map((book) => (
                    <li key={book.book_id} className="border-b py-2">
                        {book.book_id}: {book.book_title}
                    </li>
                ))}
            </ul>
        </div>
    )
  }