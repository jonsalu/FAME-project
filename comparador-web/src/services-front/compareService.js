export async function compararPlanilhas(file1, file2) {
  const formData = new FormData();
  formData.append("file1", file1);
  formData.append("file2", file2);

  const response = await fetch("http://localhost:8000/api/compare/", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erro na API: ${response.status} - ${errorText}`);
  }

  const blob = await response.blob();

  // Verifica se é realmente um ZIP
  if (blob.type !== "application/zip") {
    throw new Error("Resposta não é um arquivo ZIP válido.");
  }

  return blob;
}
