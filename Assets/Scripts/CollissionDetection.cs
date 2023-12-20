using System;
using System.Collections;
using System.Collections.Generic;
using Unity.VisualScripting;
using UnityEngine;
using UnityEngine.Events;

public class CollissionDetection : MonoBehaviour
{
    public MainMenu mainMenu;
    public GameObject paddle;
    public float delta = 0;    
    public UnityEvent unityEvent;

    // Start is called before the first frame update

    // Update is called once per frame
    void Update()
    {
        if (gameObject.activeSelf)
        {
            var xDiff = Math.Abs((paddle.transform.position.x - transform.position.x));
            if (xDiff <= delta)
               unityEvent.Invoke();

            /*
            if (touchLocation < 0)
            {
                if (paddle.transform.position.x <= touchLocation)
                    unityEvent.Invoke();
            } else
            {
                if (paddle.transform.position.x >= touchLocation)
                    unityEvent.Invoke();
            }
            */

        }

    }
}
