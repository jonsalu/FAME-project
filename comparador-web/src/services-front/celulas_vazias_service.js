export async function handleCelulasVazias (file, selectedHeaders, mode = "download"){
    const formData = new FormData()

    formData.append('file', file)
    formData.append('selected_headers',JSON.stringify (selectedHeaders))
    formData.append('mode', mode)

    const response = await fetch("http://localhost:8000/api/celulas-vazias",{
        method: 'POST',
        body: formData
    })

    if (!response.ok) {
    // Se o backend retornar erro (ex: 400, 500...), gera exceção
    const errorText = await response.text();
    throw new Error(`Erro do servidor: ${errorText}`);
  }
  if (mode === 'preview') {
        // Se for preview, o backend manda JSON. Já convertemos aqui.
        return await response.json(); 
    } else {
        // Se for download, o backend manda o ZIP (Blob).
        return await response.blob();
      }
  
}