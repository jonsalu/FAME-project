

// Função para chamar o endpoint de pré-análise (headers)
export async function obterCabecalhos(file1) {
    const formData = new FormData();
    // ALINHAR COM router.py: usar 'file1'
    formData.append('file1', file1); 

    // CHAME O NOVO ENDPOINT DE PRÉ-ANÁLISE
    const response = await fetch("http://localhost:8000/api/uniao-cabecalhos/", {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Erro ao obter cabeçalhos do servidor.");
    }
    
    const data = await response.json();
    return data.headers; // Deve retornar o array de strings
}


// Função para chamar o endpoint de união final
export async function unirPlanilhas(file1, file2, commonHeader) {
    const formData = new FormData();
    
    // ALINHAR COM router.py: 'file1', 'file2', 'common_header'
    formData.append('file1', file1);
    formData.append('file2', file2);
    formData.append('common_header', commonHeader); // A coluna chave é enviada como string
    
    // CHAME O ENDPOINT DE UNIÃO FINAL
    const response = await fetch("http://localhost:8000/api/uniao-inteligente/", {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        // Se o servidor retornar 500 com o erro do Pandas
        const errorData = await response.json();
        throw new Error(errorData.detail || "Erro no servidor ao unir planilhas.");
    }

    return response.blob();
}