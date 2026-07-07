export function noOrphanColon(text: string): string {
  return text.replace(/ : /g, " : ")
}
