export const avatarPath = (avatar: string) => {
  if (!avatar) {
    return ""
  }
  return `${import.meta.env.VITE_DOMAIN}/${avatar}`
}
