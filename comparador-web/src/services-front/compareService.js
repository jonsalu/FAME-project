export async function compararPlanilhas(file1, file2, modo = "download") {
  const formData = new FormData();
  formData.append("file1", file1);
  formData.append("file2", file2);
  formData.append("modo", modo); // <<< chave enviada ao backend

  const response = await fetch("http://localhost:8000/api/compare/", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erro na API: ${response.status} - ${errorText}`);
  }

  // -------------------------------------------------
  // 🔍 Detecta se veio JSON (preview) ou ZIP (download)
  // -------------------------------------------------
  const contentType = response.headers.get("content-type");

  if (contentType && contentType.includes("application/json")) {
    // Preview → JSON
    const json = await response.json();
    return { tipo: "preview", data: json };
  }

  // Download → ZIP
  const blob = await response.blob();
  return { tipo: "download", data: blob };
}
