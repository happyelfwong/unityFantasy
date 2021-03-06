using UnityEditor;
using UnityEngine;
using System.IO;
using System.Collections.Generic;

public class editorMenuCS : MonoBehaviour
{
    public class biologyList
    {
        public List<string> drawNumber = new List<string>();
        public List<float> biodata = new List<float>();
    }
    // [Serializable]
    public class scene
    {
        public int length;
        public Vector3 playerPos;
        public List<float> cubeArray = new List<float>();
    }
    [MenuItem("[Menu]/CombineChildren")]
    static void CombineChildren()
    {
        GameObject Cubes = GameObject.Find("Cubes");//todo:要改成選取的物件

        Matrix4x4 myTransform = Cubes.transform.worldToLocalMatrix;
        Dictionary<string, List<CombineInstance>> combines = new Dictionary<string, List<CombineInstance>>();
        Dictionary<string, Material> namedMaterials = new Dictionary<string, Material>();
        MeshRenderer[] meshRenderers = GameObject.Find("Cubes").GetComponentsInChildren<MeshRenderer>();
        foreach (var meshRenderer in meshRenderers)
        {
            foreach (var material in meshRenderer.sharedMaterials)
                if (material != null && !combines.ContainsKey(material.name))
                {
                    combines.Add(material.name, new List<CombineInstance>());
                    namedMaterials.Add(material.name, material);
                }
        }

        MeshFilter[] meshFilters = Cubes.GetComponentsInChildren<MeshFilter>();
        foreach (var filter in meshFilters)
        {
            if (filter.sharedMesh == null)
                continue;
            var filterRenderer = filter.GetComponent<Renderer>();
            if (filterRenderer.sharedMaterial == null)
                continue;
            if (filterRenderer.sharedMaterials.Length > 1)
                continue;
            CombineInstance ci = new CombineInstance
            {
                mesh = filter.sharedMesh,
                transform = myTransform * filter.transform.localToWorldMatrix
            };
            combines[filterRenderer.sharedMaterial.name].Add(ci);

            //沒有要刪除
            //DestroyImmediate(filterRenderer);
        }

        if (GameObject.Find("CubesLighted") != null)
        {
            DestroyImmediate(GameObject.Find("CubesLighted"));
        }
        GameObject go = new GameObject("CubesLighted");
        go.isStatic = true;



        foreach (Material m in namedMaterials.Values)
        {
            go.transform.parent = Cubes.transform;
            go.transform.localPosition = Vector3.zero;
            go.transform.localRotation = Quaternion.identity;
            go.transform.localScale = Vector3.one;

            var filter = go.AddComponent<MeshFilter>();
            filter.mesh.CombineMeshes(combines[m.name].ToArray(), true, true);

            var arenderer = go.AddComponent<MeshRenderer>();
            arenderer.material = m;
        }
        go.transform.parent = GameObject.Find("5-場景").transform;
        // Object prefab = PrefabUtility.CreateEmptyPrefab("Assets/Resources/scene/s998.prefab");
        // PrefabUtility.ReplacePrefab(go, prefab, ReplacePrefabOptions.ConnectToPrefab);
    }

    [MenuItem("[Menu]/LoadJson")]
    static void LoadJson()
    {
        //讀取json檔案
        TextAsset json = Resources.Load("scene/s998") as TextAsset;
        scene scene = new scene();
        scene = JsonUtility.FromJson<scene>(json.text);

        //產生場景
        GameObject Cubes = GameObject.Find("Cubes");


        for (var i = 0; i < scene.cubeArray.Count; i += 5)
        {
            GameObject temp = Instantiate(GameObject.Find("Cube"));//todo:Cube可以不需要用Find的方式
            Vector3 tempVector3 = new Vector3(scene.cubeArray[i], scene.cubeArray[i + 1], scene.cubeArray[i + 2]);
            temp.transform.parent = Cubes.transform;
            temp.transform.position = tempVector3;
            temp.name = temp.transform.position.ToString("F1");
            temp.GetComponent<MeshRenderer>().receiveShadows = true;
            temp.GetComponent<Renderer>().shadowCastingMode = UnityEngine.Rendering.ShadowCastingMode.On;
            temp.GetComponent<Renderer>().enabled = true;
            Mesh mesh = (Mesh)Resources.Load("item/model/CUBE/" + scene.cubeArray[i + 3], typeof(Mesh));
            temp.GetComponent<MeshFilter>().mesh = mesh;
            temp.GetComponent<Renderer>().sharedMaterial.mainTexture.filterMode = FilterMode.Point;



            switch (Mathf.FloorToInt(scene.cubeArray[i + 4]))
            {
                case 0:
                    temp.tag = "Cube";
                    break;
                case 1:
                    temp.tag = "Cube_WalkSMP";
                    break;
            }
        }

    }


    [MenuItem("[Menu]/SaveJson")]
    static void SaveJson()
    {
        scene scene = new scene();

        //儲存tag ==Cube
        GameObject[] respawnsCube;
        respawnsCube = GameObject.FindGameObjectsWithTag("Cube");
        foreach (GameObject respawn in respawnsCube)
        {
            scene.cubeArray.Add(respawn.transform.position.x);
            scene.cubeArray.Add(respawn.transform.position.y);
            scene.cubeArray.Add(respawn.transform.position.z);
            string name = respawn.GetComponent<MeshFilter>().sharedMesh.name;
            scene.cubeArray.Add(float.Parse(name));
            scene.cubeArray.Add(0);
        }

        //儲存tag ==Cube_WalkSMP
        GameObject[] respawnsSMP;
        respawnsSMP = GameObject.FindGameObjectsWithTag("Cube_WalkSMP");
        foreach (GameObject respawn in respawnsSMP)
        {
            scene.cubeArray.Add(respawn.transform.position.x);
            scene.cubeArray.Add(respawn.transform.position.y);
            scene.cubeArray.Add(respawn.transform.position.z);
            string name = respawn.GetComponent<MeshFilter>().sharedMesh.name;
            scene.cubeArray.Add(float.Parse(name));
            scene.cubeArray.Add(1);
        }

        //儲存長度
        //雖然非必要，但便於觀看場景資訊
        scene.length = scene.cubeArray.Count;

        //儲存角色位置
        //todo:角色名稱不一定是Cha_Kinight
        scene.playerPos = GameObject.Find("Cha_Knight").transform.position;

        //將Object轉存為json，並存檔
        string json = JsonUtility.ToJson(scene);
        StreamWriter file = new StreamWriter(Application.dataPath + "/Resources/scene/s998.json");
        file.Write(json);
        file.Close();

        UnityEditor.EditorUtility.DisplayDialog("Save End ", " --=== Save End ===--", "[OK]");


    }

    [MenuItem("[Menu]/clearMap")]
    static void clearMap()
    {
        //讀取json檔案
        TextAsset json = Resources.Load("scene/s998") as TextAsset;
        scene scene = new scene();
        scene = JsonUtility.FromJson<scene>(json.text);

        for (var i = 0; i < scene.cubeArray.Count; i += 5)
        {
            Vector3 temp;
            temp.x = scene.cubeArray[i];
            temp.y = scene.cubeArray[i + 1];
            temp.z = scene.cubeArray[i + 2];
            DestroyImmediate(GameObject.Find(temp.ToString("F1")));
        }
    }

    [MenuItem("[Menu]/Normalized")]
    static void Normalized()
    {

        GameObject[] respawns;
        respawns = Selection.gameObjects;
        if (respawns.Length == 1)
        {
            UnityEditor.EditorUtility.DisplayDialog("oh,Come on ?", " Select GameObject First!", "OK");
        }
        var step = 0;
        foreach (GameObject respawn in respawns)
        {
            if (respawn.tag == "Cube" || respawn.tag == "Cube_WalkSMP")
            {
                Vector3 temp;
                temp = respawn.transform.position;
                Debug.Log(respawn.transform.position);
                temp.x = Mathf.Floor(temp.x);
                temp.z = Mathf.Floor(temp.z);
                temp.y = Mathf.Floor(temp.y);
                respawn.transform.position = temp;
                respawn.transform.eulerAngles = new Vector3(-90, 0, 0);

                respawn.name = temp.ToString("F1");
            }
        }
        int ss = 0;
        respawns = Selection.gameObjects;
        foreach (GameObject respawnA in respawns)
        {
            foreach (GameObject respawnB in respawns)
            {
                if (respawnB != respawnA)
                {
                    if (respawnB.name == respawnA.name)
                    {
                        DestroyImmediate(respawnB);
                        ss++;
                    }
                }
            }
        }

        UnityEditor.EditorUtility.DisplayDialog("Normalized End ", " --=== Normalized End ===--", "OK");
        Debug.Log("Normalized:" + step);
        Debug.Log("DestroyImmediate:" + ss);
    }
    [MenuItem("[Menu]/show|hide-SMP")]
    static void showHideSmp()
    {

        GameObject[] smps;
        smps = GameObject.FindGameObjectsWithTag("SMP");

        if (smps.Length > 0)
        {
            Debug.Log("hided");
            //hide
            foreach (GameObject smp in smps)
            {
                DestroyImmediate(smp);
            }
        }
        else
        {
            Debug.Log("showed");
            //show
            GameObject[] respawns;
            respawns = GameObject.FindGameObjectsWithTag("Cube_WalkSMP");
            foreach (GameObject respawn in respawns)
            {
                GameObject temp = Instantiate(GameObject.Find("tempPick2"));
                temp.transform.parent = GameObject.Find("WalkSMP").transform;
                temp.tag = ("SMP");
                temp.transform.position = respawn.transform.position;
                temp.name = respawn.name + "_SMP";
                respawns = Selection.gameObjects;
            }
        }
    }

}