export interface IPlayer {
  name: string
  chips: number
  blind: number
  cards: ICard[]
  winning: boolean
  action: string
  state: string
}

export interface IGameUpdate {
  id: number
  type: string
  data: IGameUpdateState
}

export interface IGameUpdateState {
  players: IPlayer[]
  community: string[]
  chips: number
  pot: number
  winners: any[]
  bot?: {
    name: string
  }
  state: 'pre-flop' | 'flop' | 'turn' | 'river' | 'showdown'
  _actions: {
    'pre-flop': any[]
    flop: any[]
  }
  wagered: number
}

export interface ICard {
  rank: string
  suit: string
  color: string
}
