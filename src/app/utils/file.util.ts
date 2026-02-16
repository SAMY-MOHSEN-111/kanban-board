export function downloadFile(data: string, fileName: string, mimeType: string) {
  const a = document.createElement('a');
  const file = new Blob([data], {type: mimeType});
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
}
