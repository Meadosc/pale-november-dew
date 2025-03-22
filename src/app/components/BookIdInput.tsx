import { useState } from "react";

import DOMPurify from "dompurify";
import { Loader2 } from "lucide-react";

import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";

import AIPlotSummary from '@/components/AIPlotSummary';


const API_URL = 
    process.env.NODE_ENV === "production"
    ? "https://ebb-and-flow.fly.dev"
    : "http://localhost:8000";

type Inputs = {
    book_id: number;
}

export default function EventInput({ triggerRefresh }: { triggerRefresh: () => void }) {
    const [ loading, setLoading ] = useState(false);
    const [bookData, setBookData] = useState<{ book_id: number; book_title: string; metadata: string; content: string }>({
        book_id: -1,
        book_title: "",
        metadata: "",
        content: "",
    });
    
    const { 
        register, 
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<Inputs>();

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        try {
            setLoading(true);
            // reset the book data so old data doesn't show while loading
            // form input for book_id will not be overwritten before fetch
            setBookData({
                book_id: -1,
                book_title: "",
                metadata: "",
                content: "",
            });
            const url = API_URL + "/api/read/" + data.book_id;
            const response = await fetch(url, {
                method: "GET",
                headers: {"Content-Type": "application/json"},
            });
            if (!response.ok) {
                throw new Error("Failed to create event");
            }
            const result = await response.json();
            setBookData(result.data);
            triggerRefresh(); // refresh the list of past books
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
        reset();
    };

    return (
        <div className="flex flex-col items-start my-4 p-4 border rounded-md shadow-md bg-white">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-2 w-md">
                    <label htmlFor="book_id"><strong>Enter a Book ID </strong></label>
                    <div className="flex gap-2">
                        <label htmlFor="book_id" className="w-[7rem]" >Book ID </label>
                        <input className={`border-2 border-gray-700 rounded-md w-2xs ${
                            errors.book_id ? "border-red-500" : "border-gray-700"
                        }`}
                            {...register("book_id", { required: true })} 
                        />
                        {errors.book_id && (
                            <p className="text-red-500 text-sm">*required</p>
                        )}
                    </ div>   
                    <Button>
                        {loading && <Loader2 className="animate-spin" />}
                        Submit
                    </Button>
                </ div>
            </ form>
            {bookData.book_title && <AIPlotSummary book_title={bookData.book_title}/>}
            {bookData.content && <BookDisplay bookData={bookData}/>}
        </div>
    )
}


interface bookData {
    book_id: number;
    book_title: string;
    metadata: string;
    content: string;
    
}

function BookDisplay({ bookData }: { bookData: bookData }) {
    return (
        <div>
            <h2 className="font-bold text-lg mt-4">Book Title:</h2>
            <p>{bookData.book_title}</p>
            <h2 className="font-bold text-lg mt-4">Book Content:</h2>
            <pre className="whitespace-pre-wrap bg-gray-100 p-2 rounded-md max-h-96 overflow-auto">
                {bookData.content ? bookData.content : "No content available"}
            </pre>

            <h2 className="font-bold text-lg mt-4">Metadata:</h2>
            <div 
                className="bg-gray-100 p-2 rounded-md max-h-96 overflow-auto" 
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(bookData.metadata) }}
            />
        </div>
    );
}