import { System } from '../system/system'

export default function (system: System) {
    system.api.app.post('/api/game/start', (req, res) => {
        const game = system.createGame()
        res.send({ id: game.id })
        game.start()
    })
}
