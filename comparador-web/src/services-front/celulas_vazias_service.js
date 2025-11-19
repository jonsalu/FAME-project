export async function handleCelulasVazias (file, selectedHeaders){
    const formData = new FormData()

    formData.append('file', file)
    formData.append('selected_headers',JSON.stringify (selectedHeaders))

    const response = await fetch("http://localhost:8000/api/celulas-vazias",{
        method: 'POST',
        body: formData
    })

    if (!response.ok) {
    // Se o backend retornar erro (ex: 400, 500...), gera exceção
    const errorText = await response.text();
    throw new Error(`Erro do servidor: ${errorText}`);
  }

  return response; // <--- precisa retornar pra quem chama (o front)
}