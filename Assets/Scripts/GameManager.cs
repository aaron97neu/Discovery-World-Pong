using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using TMPro;

using M2MqttUnity;
using uPLibrary.Networking.M2Mqtt;
using uPLibrary.Networking.M2Mqtt.Messages;

using UnityEngine.SceneManagement;
using Newtonsoft.Json;
public class GameManager : MonoBehaviour
{

    public MQTTReceiver _eventSender;

    // We will handle the general loop and game logic here

    [Header("Player PreFabs")]
    public GameObject playerPrefab; // Human paddle
    public GameObject opponentPrefab; // computer paddle

    // The ball which we reset position once game loop ends
    public Ball ball;

    // These are the UI elements that display the score and game level
    public GameObject playerOneText; // computer score UI
    public GameObject playerTwoText; // human score UI
    public GameObject gameLevelText;

    // These will keep track of the player scores and the game level
    private int _playerOneScore; // computer
    private int _playerTwoScore; // human
    private int gameLevel;

    public GameObject gameOverUI;
    public MainMenu mainMenuScript;

    public TextMeshProUGUI canvasComputerScoreText;
    public TextMeshProUGUI canvasHumanScoreText;
    public TextMeshPro tmpComputerScoreText;
    public TextMeshPro tmpHumanScoreText;


    // These are game variables that can be changed
    private static int nextLevelPointRequirement = 3;
    private static int maxGameLevel = 3;
    private static int gameOverPointRequirement = 3;


    [SerializeField] private AudioSource playerScoreSoundEffect;


    // Start is called before the first frame update
    void Start()
    {
        gameLevel = 1;
        if (_eventSender == null)
        {
            _eventSender = GetComponent<MQTTReceiver>();
        }

    }

    // Update is called once per frame
    void Update()
    {
        
    }


    // This is the AI's (top paddle) score keeping method
    public void PlayerOneScore()
    {
        _playerOneScore++;
        playerOneText.GetComponent<TextMeshProUGUI>().text = _playerOneScore.ToString();
        if (tmpComputerScoreText != null)
            tmpComputerScoreText.text = _playerOneScore.ToString();
        if (_playerOneScore == gameOverPointRequirement) 
        {
            Debug.Log("Game Over. Resetting game!");
            //StartCoroutine(GameOverResetGame());
            GameOverPlayAgain();
        } else 
        {
            //playerOneText.GetComponent<TextMeshProUGUI>().text = _playerOneScore.ToString();

            this.ball.ResetPosition(gameLevel - 1);
        }

        playerScoreSoundEffect.Play();

    }

    // This is the player's (bottom paddle) score keeping method
    public void PlayerTwoScore()
    {
        _playerTwoScore++;

        if (gameLevel != maxGameLevel && _playerTwoScore % nextLevelPointRequirement == 0)
            {
            //reset computer and human score
            _playerOneScore = 0;
            playerOneText.GetComponent<TextMeshProUGUI>().text = _playerOneScore.ToString();
            if (tmpComputerScoreText != null)
                tmpComputerScoreText.text = _playerOneScore.ToString(); 
            _playerTwoScore = 0;
            gameLevel++;
            playerTwoText.GetComponent<TextMeshProUGUI>().text = _playerTwoScore.ToString();
            if (tmpHumanScoreText != null) 
                tmpHumanScoreText.text = _playerTwoScore.ToString();
            this.ball.ResetPosition(gameLevel - 1);
            gameLevelText.GetComponent<TextMeshProUGUI>().text = "Level: " + gameLevel.ToString();
            if (_eventSender.isConnected) 
                {

                _eventSender.Publish("game/level", JsonConvert.SerializeObject(new { level = gameLevel })); //"" + gameLevel
                // Debug.Log("PUBLISHED LEVEL");
            }
        } else 
        {
            //human wins increase human's score
            playerTwoText.GetComponent<TextMeshProUGUI>().text = _playerTwoScore.ToString();
            if (tmpHumanScoreText != null)
                tmpHumanScoreText.text = _playerTwoScore.ToString();
            this.ball.ResetPosition(gameLevel - 1);
        }


        playerScoreSoundEffect.Play();

    }

    // This will reset the game if the player lost 3 points to the AI
    public IEnumerator GameOverResetGame() 
    {
        gameOverUI.SetActive(true);
        Time.timeScale = 0f;
        Debug.Log("Game Manager WAITING");
        //string currentSceneName = SceneManager.GetActiveScene().name;
        //SceneManager.LoadScene(currentSceneName);
        _playerOneScore = 0;
        _playerTwoScore = 0;
        gameLevel = 1;

        gameLevelText.GetComponent<TextMeshProUGUI>().text = "Level: " + gameLevel.ToString();
        playerOneText.GetComponent<TextMeshProUGUI>().text = _playerOneScore.ToString();
        playerTwoText.GetComponent<TextMeshProUGUI>().text = _playerTwoScore.ToString();
        if (tmpComputerScoreText != null)
            tmpComputerScoreText.text = _playerOneScore.ToString();
        if (tmpHumanScoreText != null)
            tmpHumanScoreText.text = _playerTwoScore.ToString();

        if (_eventSender.isConnected) {
            _eventSender.Publish("game/level", JsonConvert.SerializeObject(new { level = gameLevel }));
        }

        this.ball.ResetPosition(gameLevel - 1);
        //Wait for 2 seconds
        yield return new WaitForSecondsRealtime(2);
        Debug.Log("Game Manager WAIT DONE");
        gameOverUI.SetActive(false);
        mainMenuScript.Pause();
        Time.timeScale = 1f;
    }


    // Modified by Thong - Invoke in the Main Menu when the HumanPaddle
    // touch the Play Again button
    public void ResetGame()
    {
        Time.timeScale = 0f;
        Debug.Log("Game Manager WAITING");
        //string currentSceneName = SceneManager.GetActiveScene().name;
        //SceneManager.LoadScene(currentSceneName);
        ResetScore();
        //_playerOneScore = 0;
        //_playerTwoScore = 0;
        //gameLevel = 1;

        //gameLevelText.GetComponent<TextMeshProUGUI>().text = "Level: " + gameLevel.ToString();
        //playerOneText.GetComponent<TextMeshProUGUI>().text = _playerOneScore.ToString();
        //playerTwoText.GetComponent<TextMeshProUGUI>().text = _playerTwoScore.ToString();
        //if (tmpComputerScoreText != null)
        //    tmpComputerScoreText.text = _playerOneScore.ToString();
        //if (tmpHumanScoreText != null)
        //    tmpHumanScoreText.text = _playerTwoScore.ToString();
        if (_eventSender.isConnected)
        {
            _eventSender.Publish("game/level", JsonConvert.SerializeObject(new { level = gameLevel }));
        }

        this.ball.ResetPosition(gameLevel - 1);
        //Wait for 2 seconds
        //yield return new WaitForSecondsRealtime(2);
        //Debug.Log("Game Manager WAIT DONE");

        Time.timeScale = 1f;
    }

    //Thong - reset score  to zero and level to 1
    public void ResetScore()
    {
        _playerOneScore = 0;
        _playerTwoScore = 0;
        gameLevel = 1;

        gameLevelText.GetComponent<TextMeshProUGUI>().text = "Level: " + gameLevel.ToString();
        playerOneText.GetComponent<TextMeshProUGUI>().text = _playerOneScore.ToString();
        playerTwoText.GetComponent<TextMeshProUGUI>().text = _playerTwoScore.ToString();
        if (tmpComputerScoreText != null)
            tmpComputerScoreText.text = _playerOneScore.ToString();
        if (tmpHumanScoreText != null)
            tmpHumanScoreText.text = _playerTwoScore.ToString();
    }

    // Modified by Thong - Main Menu  display GameOver and TouchToPlayAgain message
    public void GameOverPlayAgain()
    {
        mainMenuScript.GameOverReset();
        /*
        //gameOverUI.SetActive(true);
        Time.timeScale = 0f;
        Debug.Log("Game Manager WAITING");
        //string currentSceneName = SceneManager.GetActiveScene().name;
        //SceneManager.LoadScene(currentSceneName);
        _playerOneScore = 0;
        _playerTwoScore = 0;
        gameLevel = 1;

        gameLevelText.GetComponent<TextMeshProUGUI>().text = "Level: " + gameLevel.ToString();
        playerOneText.GetComponent<TextMeshProUGUI>().text = _playerOneScore.ToString();
        playerTwoText.GetComponent<TextMeshProUGUI>().text = _playerTwoScore.ToString();

        if (_eventSender.isConnected)
        {
            _eventSender.Publish("game/level", JsonConvert.SerializeObject(new { level = gameLevel }));
        }

        this.ball.ResetPosition(gameLevel - 1);
        //Wait for 2 seconds
        //yield return new WaitForSecondsRealtime(2);
        //Debug.Log("Game Manager WAIT DONE");

        Time.timeScale = 1f;
        */
    }
}
