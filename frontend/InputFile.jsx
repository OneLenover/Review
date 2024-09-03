import "./styles.css"

export const InputFile = ({ accept, multiple, files, setFiles }) => {
    const handlChange = (event) => {
        const files = event.target.files;
        setFiles([...files]);
    };

    return (
        <div className="input-file-container">
            <label className="input-file-label">
                <input type="file" className="input-file-element" accept={accept} multiple={multiple} onChange={handlChange} />
                <span className="input-file-placeholder">Загрузить фотографию</span>
            </label>
            {files && files.length > 0 && files.map((file, i) =>
                <p className="input-file-info" key={i}>
                    {file.name}
                </p>)}
        </div>
    )
}