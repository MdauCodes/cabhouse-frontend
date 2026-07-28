export const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string
export const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string

export function cloudinaryUrl(publicId: string, opts?: { w?: number; h?: number; q?: string }) {
  const transforms = [
    opts?.w && `w_${opts.w}`,
    opts?.h && `h_${opts.h}`,
    `q_${opts?.q ?? 'auto'}`,
    'f_auto',
  ].filter(Boolean).join(',')
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${transforms}/${publicId}`
}

export async function uploadToCloudinary(file: File, folder?: string): Promise<string> {
  const fd = new FormData()
  fd.append('file', file)
  fd.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
  if (folder) fd.append('folder', folder)
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: fd,
  })
  if (!res.ok) throw new Error('Cloudinary upload failed')
  const json = await res.json()
  return json.secure_url as string
}
