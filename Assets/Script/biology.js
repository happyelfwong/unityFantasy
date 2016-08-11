// #pragma strict
var moveSpeed: float;

var moveSpeedMax: float;
var rotateSpeed: float;
var bioAction: String;

private
var _bioAction: String;
private
var _backward: boolean;

var Sphere: GameObject;
var Sphere2: GameObject;
var Pick: GameObject;
var Cube: GameObject;
var anim: Animation;
var WalkSteptweek: float;
private
var mainGame: GameObject;
private
var mainGamejs: gameJS;
var TextMesh: TextMesh;
var pickPlayer: GameObject;
var Plane_touch: GameObject;
var pickTouch: GameObject;
var pickTouchSide: GameObject;


//Pick           --在玩家面前的選取框
//PickPlayer     --玩家所在的位置
//PickTouch      --滑鼠點選地面位置,或是點擊的Cube選取框
//PickTouchSide  --滑鼠點擊Cube的某一面


function Start() {

    mainGame = GameObject.Find("mainGame");
    Sphere2 = GameObject.Find("Sphere2");
    mainGamejs = GameObject.Find("mainGame").GetComponent(gameJS);
    pickTouch = mainGamejs.pickTouch;
    pickTouchSide = mainGamejs.pickTouchSide;
    Plane_touch = GameObject.Find("Plane_touch");
    pickPlayer = GameObject.Find("pickPlayer");
    _backward = false;
    WalkSteptweek = WalkSteptweek || 100;
    moveSpeed = moveSpeed || 0.05;
    moveSpeedMax = moveSpeed;
    rotateSpeed = rotateSpeed || 10;
    Pick = GameObject.Find("pick");
    Cube = GameObject.Find("Cube");
    Cube.GetComponent. < Renderer > ().enabled = false;
    anim = this.GetComponent. < Animation > ();
}

function Update() {

    this._movment();
    this._bioStatus();
    this._autoJump();
    _pick();
    //    Plane_touch.transform.position.y = this.transform.position.y - 0.2;
}

function _autoJump() {
    if (this.bioAction == "Walk" && moveSpeed > 0.04) {

        var tempPOS: Vector3;
        tempPOS = Pick.transform.position;
        //        tempPOS.y = Pick.transform.position.y;
        //        tempPOS.y = this.transform.position.y;
        //        tempPOS.z = Pick.transform.position.z;

        if ((Pick.transform.position.y - this.transform.position.y) > 0.6) {
            print(Pick.transform.position.y - this.transform.position.y);

            this.transform.position.y += 0.05;
        }
        if (mainGamejs.checkArray(Vector3(tempPOS.x, tempPOS.y, tempPOS.z)) == true) {
            this.transform.position.y += 0.05;
        }
    }
}



function _createCube() {

    var tempPOS: Vector3 = pickTouchSide.transform.position;

    if (mainGamejs.checkArray(Vector3(tempPOS.x, tempPOS.y - 1, tempPOS.z)) == true ||
        mainGamejs.checkArray(Vector3(tempPOS.x, tempPOS.y + 1, tempPOS.z)) == true ||
        mainGamejs.checkArray(Vector3(tempPOS.x - 1, tempPOS.y, tempPOS.z)) == true ||
        mainGamejs.checkArray(Vector3(tempPOS.x + 1, tempPOS.y, tempPOS.z)) == true || mainGamejs.checkArray(Vector3(tempPOS.x, tempPOS.y, tempPOS.z - 1)) == true ||
        mainGamejs.checkArray(Vector3(tempPOS.x, tempPOS.y, tempPOS.z + 1)) == true ||
        tempPOS.y == 0.5) {
        Cube.transform.position = tempPOS;
        var temp = Instantiate(Cube);
        temp.GetComponent. < Renderer > ().enabled = true;
        temp.AddComponent(BoxCollider);
        temp.name = temp.transform.position.ToString("F0");
        mainGamejs.setArray(temp.transform.position);
    }

}

function _removeCube() {

    var tempPOS: Vector3 = pickTouch.transform.position;
    mainGamejs.removeArray(tempPOS);
    Destroy(GameObject.Find(tempPOS.ToString("F0")));

}

function _pick() {

    //正規化生物座標
    pickPlayer.transform.position.x = Mathf.Floor(this.transform.position.x + 0.5 / 1);
    pickPlayer.transform.position.z = Mathf.Floor(this.transform.position.z + 0.5 / 1);
    pickPlayer.transform.position.y = Mathf.Floor(this.transform.position.y + 0.5 / 1) + 0.5;

    //TODO:效能可以調整
    //將依據生物面相角度，將Pick放在角色正前方
    var tempInt = Mathf.Floor(this.transform.eulerAngles.y / 45);
    Pick.transform.position.y = pickPlayer.transform.position.y;
    switch (tempInt) {
    case 0:
        Pick.transform.position.x = pickPlayer.transform.position.x + 0;
        Pick.transform.position.z = pickPlayer.transform.position.z + 1;
        break;
    case 1:
        Pick.transform.position.x = pickPlayer.transform.position.x + 1;
        Pick.transform.position.z = pickPlayer.transform.position.z + 1;
        break;
    case 2:
        Pick.transform.position.x = pickPlayer.transform.position.x + 1;
        Pick.transform.position.z = pickPlayer.transform.position.z + 0;
        break;
    case 3:
        Pick.transform.position.x = pickPlayer.transform.position.x + 1;
        Pick.transform.position.z = pickPlayer.transform.position.z + -1;
        break;
    case 4:
        Pick.transform.position.x = pickPlayer.transform.position.x + 0;
        Pick.transform.position.z = pickPlayer.transform.position.z + -1;
        break;
    case 5:
        Pick.transform.position.x = pickPlayer.transform.position.x + -1;
        Pick.transform.position.z = pickPlayer.transform.position.z + -1;
        break;
    case 6:
        Pick.transform.position.x = pickPlayer.transform.position.x + -1;
        Pick.transform.position.z = pickPlayer.transform.position.z + 0;
        break;
    case 7:
        Pick.transform.position.x = pickPlayer.transform.position.x + -1;
        Pick.transform.position.z = pickPlayer.transform.position.z + 1;
        break;
    }


    //如果生物腳下有方塊，且pick底下正好為空時
    var temp: Vector3;
    temp = pickPlayer.transform.position;
    temp.y -= 1;
    if (mainGamejs.checkArray(temp) &&
        !mainGamejs.checkArray(Vector3(Pick.transform.position.x, Pick.transform.position.y - 1, Pick.transform.position.z))) {
        Pick.transform.position.y -= 1;
    }

}

function _bioStatus() {
    //對應生物所處狀態，播放對應動作
    if (!anim.IsPlaying("Attack")) {
        switch (this.bioAction) {
        case "Action":
            anim.CrossFade("Attack");
            anim.CrossFadeQueued("Wait");
            _removeCube();
            break;
        case "Create":
            anim.CrossFade("Attack");
            anim.CrossFadeQueued("Wait");
            _createCube();
            break;
        case "Damage":
            //jump
            this.bioAction = 'Jump';
            break;
        case "Walk":
            anim.CrossFade("Walk");
            break;
        case "picking":
            break;
        case "Wait":
            anim.CrossFade("Wait");
            break;
        case "Jump":
            this.GetComponent. < Rigidbody > ().velocity.y = 5;
            this.bioAction = "Wait";
            break;
        }
    }
    if (anim.IsPlaying("Wait")) {
        this.bioAction = "Wait";
    }
}

function _movment() {

    //轉換sphere座標，轉換成螢幕座標
    if (mainGamejs.clickStart) {
        Sphere.transform.position.x = this.transform.position.x + mainGamejs.mouseDragVector.x * 0.02;
        Sphere.transform.position.z = this.transform.position.z + mainGamejs.mouseDragVector.z * 0.02;

        //        var tempAngel = mainGamejs.cameraAngle;
        var tempAngel = Vector3.Angle(mainGamejs.PlayerCamera.transform.forward, (Sphere.transform.position - this.transform.position));
        print(tempAngel);

        tempAngel = 60;
        // x′=xcosθ−ysinθ,
        // y′=xsin⁡θ+ycos⁡θ
        Sphere2.transform.position.x = Sphere.transform.position.x * Mathf.Cos(tempAngel) - Sphere.transform.position.z * Mathf.Sin(tempAngel) + this.transform.position.x;
        Sphere2.transform.position.z = Sphere.transform.position.x * Mathf.Sin(tempAngel) + Sphere.transform.position.z * Mathf.Cos(tempAngel) + this.transform.position.z;

    }

    //將生物移動向目標
    if (Vector3.Distance(this.transform.position, Sphere.transform.position) > 0.5) {

        moveSpeed = moveSpeedMax;
        this.bioAction = "Walk";

        //依照目標距離調整移動速度
        if (Vector3.Distance(this.transform.position, Sphere.transform.position) < 5) {
            moveSpeed = moveSpeed * (Vector3.Distance(this.transform.position, Sphere2.transform.position) / 5);
            if (moveSpeed < 0.01) {
                moveSpeed = 0;
            }
        }

        //移動生物到目標點
        Sphere.transform.position.y = this.transform.position.y;
        Sphere2.transform.position.y = this.transform.position.y;
        //        this.transform.position = Vector3.MoveTowards(this.transform.position, Sphere2.transform.position, moveSpeed);

        //調整步伐
        anim["Walk"].speed = WalkSteptweek * moveSpeed;

    } else {

        if (this.bioAction == "Walk") {
            this.bioAction = "Wait";
        }
    }


    //將生物轉向目標
    if (this.bioAction == "Walk") {
        var targetDir = Sphere2.transform.position - this.transform.position;
        var step = rotateSpeed * Time.deltaTime;
        var newDir = Vector3.RotateTowards(this.transform.forward, targetDir, step, 0.0);
        this.transform.rotation = Quaternion.LookRotation(newDir);
    }
}
