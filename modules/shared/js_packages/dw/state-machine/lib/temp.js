/**
 * @class GameObserver
 * @description Example observer class that listens for updates to the BaseState objects.
 */
class GameObserver {
    constructor(baseState) {
        this.baseState = baseState;
        this.baseState.addObserver('gamePlay', this.onUpdateGamePlay.bind(this));
        this.baseState.addObserver('gameStats', this.onUpdateGameStats.bind(this));
        this.baseState.addObserver('gameState', this.onUpdateGameState.bind(this));
        this.baseState.addObserver('topPaddleState', this.onUpdateTopPaddleState.bind(this));
        this.baseState.addObserver('bottomPaddleState', this.onUpdateBottomPaddleState.bind(this));
    }

    /**
     * @method onUpdateGamePlay
     * @description Called when the gamePlay object is updated.
     * @param {object} gamePlay - The updated gamePlay object.
     */
    onUpdateGamePlay(gamePlay) {
        console.log('GamePlay updated:', gamePlay);
    }

    /**
     * @method onUpdateGameStats
     * @description Called when the gameStats object is updated.
     * @param {object} gameStats - The updated gameStats object.
     */
    onUpdateGameStats(gameStats) {
        console.log('GameStats updated:', gameStats);
    }

    /**
     * @method onUpdateGameState
     * @description Called when the gameState object is updated.
     * @param {object} gameState - The updated gameState object.
     */
    onUpdateGameState(gameState) {
        console.log('GameState updated:', gameState);
    }

    /**
     * @method onUpdateTopPaddleState
     * @description Called when the topPaddleState object is updated.
     * @param {object} topPaddleState - The updated topPaddleState object.
     */
    onUpdateTopPaddleState(topPaddleState) {
        console.log('TopPaddleState updated:', topPaddleState);
    }

    /**
     * @method onUpdateBottomPaddleState
     * @description Called when the bottomPaddleState object is updated.
     * @param {object} bottomPaddleState - The updated bottomPaddleState object.
     */
    onUpdateBottomPaddleState(bottomPaddleState) {
        console.log('BottomPaddleState updated:', bottomPaddleState);
    }
}

// Example usage
const baseState = new BaseState();
const gameObserver = new GameObserver(baseState);

// Trigger updates to see observer in action
baseState.updateGamePlay({ ballPosition: { x: 10, y: 20 }, topPaddlePosition: { x: 5 }, bottomPaddlePosition: { x: 15 } });
baseState.updateGameStats({ topScore: 1, bottomScore: 2, countDown: 3 });
baseState.updateGameState({ transition: Transition.START_GAME });
baseState.updateTopPaddleState({ x: 7 });
baseState.updateBottomPaddleState({ x: 8 });