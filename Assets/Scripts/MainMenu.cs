using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using TMPro;
using System;

public class MainMenu : MonoBehaviour
{
    public bool GameIsPaused = false;

    public GameObject mainMenuUI;
    public GameObject settingMenuUI;

    public GameObject GameOverUI;
    public GameObject pauseMenuUI;
    public GameObject LeftResetUI;
    public GameObject RightPlayAgainUI;

    public GameObject sliderValueText;
    public GameManager gameManager;

    private void Start() {
        Pause();
    }

    // Update is called once per frame
    void Update() {
        if (GameIsPaused) {
            Time.timeScale = 0f;
        }

        if (!GameOverUI.activeSelf && !pauseMenuUI.activeSelf && Input.GetKeyDown(KeyCode.M)) {
            if (GameIsPaused) {
                Resume();
            } else {
                Pause();
            }
        }
    }

    void Resume() {
        mainMenuUI.SetActive(false);
        settingMenuUI.SetActive(false);
        Time.timeScale = 1f;
        GameIsPaused = false;
    }

    public void Pause() {
        LeftResetUI.SetActive(false);
        RightPlayAgainUI.SetActive(false);
        mainMenuUI.SetActive(true);
        Time.timeScale = 0f;
        GameIsPaused = true;
    }

    // Call from GameManger to display GameOver reset instruction
    public void GameOverReset()
    {
        //var rigidbody = PlayAgainUI.AddComponent<Rigidbody>();
        //rigidbody.useGravity = false;
        //rigidbody.collisionDetectionMode = CollisionDetectionMode.Continuous;
        LeftResetUI.SetActive(true);
        RightPlayAgainUI.SetActive(false);
        GameOverUI.SetActive(true);
        Time.timeScale = 0f;
        GameIsPaused = true;

    }

    // Call from GameManger to display GameOver replay instruction
    public void GameOverReplay()
    {
        //var rigidbody = PlayAgainUI.AddComponent<Rigidbody>();
        //rigidbody.useGravity = false;
        //rigidbody.collisionDetectionMode = CollisionDetectionMode.Continuous;
        
        LeftResetUI.SetActive(false);
        RightPlayAgainUI.SetActive(true);
        gameManager.ResetScore();
        GameOverUI.SetActive(true);
        Time.timeScale = 0f;
        GameIsPaused = true;

    }

    public void PlayGame() {
        RightPlayAgainUI.SetActive(false);
        LeftResetUI.SetActive(false);
        mainMenuUI.SetActive(false);
        GameOverUI.SetActive(false);
        //var rigidbody = PlayAgainUI.GetComponent<Rigidbody>();
        //if (rigidbody != null)
        //{
        //    DestroyImmediate(rigidbody);
        //}


        gameManager.ResetGame();
        Time.timeScale = 1f;
        GameIsPaused = false;
    }

    public void SettingsMenu() {
        mainMenuUI.SetActive(false);
        settingMenuUI.SetActive(true);
    }

    public void QuitGame() {
        Application.Quit();
    }

    public void BackButton() {
        mainMenuUI.SetActive(true);
        settingMenuUI.SetActive(false);
    }

    public void SetBallSpeedMultiplier(float ballSpeedMultiplier) {
        GameObject.Find("Ball").GetComponent<Ball>().SetBallSpeedMultiplier(ballSpeedMultiplier);
        sliderValueText.GetComponent<TextMeshProUGUI>().SetText(Math.Round(ballSpeedMultiplier, 2).ToString());
    }

}
