export interface App {
  icon: string
  name: string
  component: any
}
export interface Session {
  id: string
  app: App
}

export type EventHandler<
  E extends Event = Event,
  T extends EventTarget = HTMLElement
> = (event: E & { currentTarget: EventTarget & T }) => any
export type MouseEventHandler<T extends EventTarget> = EventHandler<
  MouseEvent,
  T
>
