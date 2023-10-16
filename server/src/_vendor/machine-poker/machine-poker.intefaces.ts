export interface MachinePokerGame {
    create(): void
    state: string
    betting: {
        raise?: any
        call?: any
    }
}