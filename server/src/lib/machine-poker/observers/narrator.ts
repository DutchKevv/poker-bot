const { Card, Hand } = require('hoyle')

const redColor = '\x1b[31m';
const blueColor = '\x1b[34m';
const resetColor = '\x1b[0m';

function narratorLogAction(logStr: string) {
  console.log(redColor + logStr + resetColor);
}

function narratorLogState(logStr: string) {
  console.log(blueColor + logStr + resetColor);
}

function narratorLog(logStr: string) {
  console.log(logStr);
}

function playerInfoString(player: any, communityCards: any) {
  let playerCards = "";
  if (player.cards != null) {
    for (const card of player.cards) {
      playerCards += card + " ";
    }
    if (communityCards != null) {
      const playerCardObjects = player.cards.map((c: string) => new Card(c));
      const c = [...communityCards, ...playerCardObjects];
      const handName = Hand.make(c).name;
      if (handName != null && handName !== 'High card') {
        playerCards += ` (${handName})`;
      }
    }
  }
  return `${player.name} ($${player.chips}) ${playerCards}`;
}

function actionString(action: string, bet: number) {
  switch (action) {
    case 'bet':
      return `bet $${bet}`;
    case 'raise':
      return `raised by $${bet}`;
    case 'fold':
      return 'folded';
    case 'allIn':
      return `went ALL IN with $${bet}`;
    case 'call':
      return `called $${bet}`;
    case 'check':
      return 'checked';
  }
}

export function roundStart(status: any) {
  console.log(" ");
  console.log(`-- Round #${status.hand} starting --`);
  console.log(`${status.players.length} players:`);
  for (const player of status.players) {
    console.log(`  ${playerInfoString(player, null)}`);
  }
}

export function betAction(player: any, action: string, bet: number, err: any) {
  if (err) {
    console.log(`  ${player.name} failed to bet: ${err}`);
  } else {
    console.log(`  ${player.name} ${actionString(action, bet)}`);
  }
}

export function stateChange(status: any) {
  const stateName = status.state;
  console.log(" ");
  console.log(`-- ${stateName}`);
  if (stateName === 'pre-flop') {
    for (const player of status.players) {
      console.log(`  ${playerInfoString(player, null)}`);
    }
    for (const player of status.players) {
      if (player.blind > 0) {
        console.log(`  ${player.name} paid a blind of $${player.blind}`);
      }
    }
  } else {
    const cards = status.community.join(" ");
    console.log(` Cards are: ${cards}`);
    let pot = 0;
    for (const player of status.players) {
      if (player.wagered != null) {
        pot += player.wagered;
      }
    }
    console.log(` Pot is: $${pot}`);
    const communityCards = status.community.map((c: string) => new Card(c));
    for (const player of status.players) {
      if (player.state === 'active' || player.state === 'allIn') {
        console.log(`  ${playerInfoString(player, communityCards)}`);
      }
    }
    console.log(" Actions: ");
  }
}

export function complete(status: any) {
  console.log(" ");
  console.log(`Round #${status.hand} complete.`);
  if (status.winners.length > 1) {
    console.log("Winners are:");
    for (const winner of status.winners) {
      console.log(`${status.players[winner.position].name} with ${status.players[winner.position].handName}. Amount won: $${winner.amount}`);
    }
  } else {
    const winningPlayer = status.players[status.winners[0].position];
    let handName = "";
    if (winningPlayer.handName != null) {
      handName = `with ${winningPlayer.handName}`;
    }
    console.log(`Winner was ${winningPlayer.name} ${handName} Amount won: $${status.winners[0].amount}`);
  }
  console.log("Positions: ");
  for (const player of status.players) {
    let cardString = "";
    if (player.cards != null) {
      cardString = player.cards.join(" ");
    }
    let handName = "";
    if (player.handName != null) {
      handName = `(${player.handName})`;
    }
    console.log(`${playerInfoString(player, null)} had ${cardString} ${handName}`);
  }
  console.log("=================================");
}
