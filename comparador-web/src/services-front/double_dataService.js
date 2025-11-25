export async function handleDuplicateData(file1, selectedHeaders, modo) {
    const formData = new FormData();
    formData.append("file", file1);
    formData.append("columns_to_check", JSON.stringify(selectedHeaders));
    formData.append("modo", modo)

    console.log("📁 Arquivo enviado:", file1);
    console.log("📋 Colunas selecionadas:", selectedHeaders);
    console.log("Modo:", modo)

    const response = await fetch("http://localhost:8000/api/double-data", {
        method: "POST",
        body: formData,
    });

    if (modo === "preview") {
        if (!response.ok) throw new Error("Erro no preview");
        return await response.json();   // ⬅️ IMPORTANTE
    }

    if (!response.ok) throw new Error("erro ao tratar dados duplicados!")
       return await response.blob(); 

    
}