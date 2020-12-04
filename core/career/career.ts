export interface Career {
  name: string
}
export interface Level {
  name: string
  description: string
  career: Career
  number: number
}
export default Career