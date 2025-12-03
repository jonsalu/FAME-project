// Função para chamar o endpoint de pré-análise (headers)
export async function obterCabecalhos(file1) {
    const formData = new FormData();
    formData.append('file1', file1); 

    const response = await fetch("http://localhost:8000/api/uniao-cabecalhos/", {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Erro ao obter cabeçalhos do servidor.");
    }
    
    const data = await response.json();
    return data.headers;
}


// Função para chamar o endpoint de união final
// Adicionado parâmetro 'previewMode' com padrão false
export async function unirPlanilhas(file1, file2, commonHeader, previewMode = false) {
    const formData = new FormData();
    
    formData.append('file1', file1);
    formData.append('file2', file2);
    formData.append('common_header', commonHeader);
    formData.append('apenas_preview', previewMode); // Envia a flag
    
    const response = await fetch("http://localhost:8000/api/uniao-inteligente/", {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Erro no servidor ao unir planilhas.");
    }

    if (previewMode) {
        // Retorna o JSON com dados e colunas
        return await response.json();
    } else {
        // Retorna o arquivo BLOB
        return await response.blob();
    }
}