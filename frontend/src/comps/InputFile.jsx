import React, { useState } from "react";
import { MdFileDownload } from "react-icons/md";
import '../comps/styles.css';

export const InputFile = ({ accept, multiple }) => {
    const [files, setFiles] = useState([]);

    const handleChange = (event) => {
        const selectedFiles = Array.from(event.target.files);
        if (files.length + selectedFiles.length > 3) {
            alert("Вы можете загрузить не более 3 фотографий");
            return;
        }
        setFiles(prevFiles => (prevFiles ? [...prevFiles, ...selectedFiles] : [...selectedFiles]));
    };

    const handleDelete = (index) => {
        const updatedFiles = [...files];
        updatedFiles.splice(index, 1);
        setFiles(updatedFiles);
    };

    return (
        <div className="input-file-container">
            <input type="file" className="input-file-element" accept={accept} multiple={multiple} onChange={handleChange} />
            {files && files.length > 0 && files.map((file, i) => (
                <p className="input-file-info" key={i}>
                    {file.name}
                    <span className="delete-icon" onClick={() => handleDelete(i)}>✕</span>
                </p>
            ))}
        </div>
    );
};