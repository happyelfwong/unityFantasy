// # pragma strict
var Plane: GameObject;
var Sphere: GameObject;
var Player: GameObject;
var PlayerLight: GameObject;
var PlayerCamera: GameObject;

function Start() {
    PlayerLight = GameObject.Find("PlayerLight");
    Plane = GameObject.Find("Plane");
    Sphere = GameObject.Find("Sphere");
    Player = GameObject.Find("Cha_Knight");
    PlayerCamera = GameObject.Find("PlayerCamera");
    Sphere.transform.position = Player.transform.position;
    Player.AddComponent(biology);
    Player.GetComponent(biology).Sphere = Sphere;



}

function Update() {
    getMousehitGroupPos();
    fellowPlayerLight();
    fellowPlayerCameraMove();
    fellowPlayerCameraContorl();

}
//========================================================




function fellowPlayerCameraMove() {
    PlayerCamera.transform.position.x = Player.transform.position.x + -12;
    PlayerCamera.transform.position.z = Player.transform.position.z + -12;

}

function fellowPlayerCameraContorl() {
    if (Input.GetAxis("Mouse ScrollWheel") < 0) // forward
    {
        if (Camera.main.orthographicSize > 1)
            Camera.main.orthographicSize = Mathf.Min(Camera.main.orthographicSize - 1, 10);
    }

    if (Input.GetAxis("Mouse ScrollWheel") > 0) // forward
    {
        Camera.main.orthographicSize = Mathf.Min(Camera.main.orthographicSize + 1, 10);
    }
}

function fellowPlayerLight() {
    PlayerLight.transform.position = Vector3(Player.transform.position.x, PlayerLight.transform.position.y, Player.transform.position.z);
}

function getMousehitGroupPos() {
    //滑鼠點擊取得做標點
    var mouseHitPlane: RaycastHit;
    var ray = Camera.main.ScreenPointToRay(Input.mousePosition);
    if (Physics.Raycast(ray, mouseHitPlane) && mouseHitPlane.transform.tag == "ground") {
        if (Input.GetMouseButtonDown(0)) {
            Sphere.transform.position = mouseHitPlane.point;
        }
    }
}
