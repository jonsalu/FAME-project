export async function handleDuplicateData(file1, selectedHeaders) {
    const formData = new FormData();
    formData.append("file", file1);
    formData.append("columns_to_check", JSON.stringify(selectedHeaders));

    console.log("📁 Arquivo enviado:", file1);
    console.log("📋 Colunas selecionadas:", selectedHeaders);

    const response = await fetch("http://localhost:8000/api/double-data", {
        method: "POST",
        body: formData,
    });

    if (!response.ok) throw new Error("erro ao tratar dados duplicados!")
       return response; 
}