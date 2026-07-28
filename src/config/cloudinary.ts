export async function uploadToCloudinary(
  file: File,
  cloudName: string,
  uploadPreset: string,
  folder?: string,
): Promise<string> {
  const fd = new FormData()
  fd.append('file', file)
  fd.append('upload_preset', uploadPreset)
  if (folder) fd.append('folder', folder)
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: fd,
  })
  if (!res.ok) throw new Error('Cloudinary upload failed')
  const json = await res.json()
  return json.secure_url as string
}
