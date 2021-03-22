export interface App {
  icon: string
  name: string
  component: any
}
export interface Session {
  id: string
  app: App
}
