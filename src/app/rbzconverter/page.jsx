"use client";

import { useState } from "react";

export default function ZipToRbzConverter() {
    const [status, setStatus] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        const fileInput = event.target.elements.file;
        if (!fileInput.files.length) {
            alert("Please select a file.");
            return;
        }
        
        const formData = new FormData();
        formData.append("file", fileInput.files[0]);
        setStatus("Converting...");
        
        try {
            const response = await fetch("/api/convert", {
                method: "POST",
                body: formData
            });
            
            if (response.ok) {
                const blob = await response.blob();
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = fileInput.files[0].name.replace(".zip", ".rbz");
                link.click();
                setStatus("Conversion completed!");
            } else {
                setStatus("Conversion failed.");
            }
        } catch (error) {
            console.error("Error during conversion:", error);
            setStatus("An error occurred.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg w-96 text-center">
                <h2 className="text-2xl font-bold mb-4">Sketchshaper</h2>
                <p className="text-gray-400 mb-2">Convert <span className="text-white font-semibold">.zip</span> to <span className="text-white font-semibold">.rbz</span></p>
                <form onSubmit={handleSubmit} className="w-full flex flex-col">
                    <input type="file" name="file" accept=".zip" className="p-2 mb-4 rounded bg-gray-700 border-none" required />
                    <button type="submit" className="p-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded">Convert</button>
                </form>
                {status && <p className="mt-3 text-yellow-400">{status}</p>}
                <p className="mt-3 text-gray-500 text-sm">Convert your .zip files to .rbz format instantly with this easy-to-use online tool. Perfect for SketchUp plugin packaging.</p>
            </div>
        </div>
       
    );
}
