export interface IGameObserverData {
    type: string
    players: {
        wagered?: number
    }[]
    pot?: number
}

export interface IPlayer {
    bot: any
    chips: number
    wagered: number
    payout: number
    ante: number
    blind: number
    name: string
    state: string
    hand: any
    cards: any[]
    reset(): void
}