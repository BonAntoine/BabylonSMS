/**
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

 import React, { useState, FunctionComponent, useEffect, useCallback } from 'react';
 import { SafeAreaView, StatusBar, Button, View, Text, ViewProps, Image, TextInput  } from 'react-native';
 
 import { EngineView, useEngine, EngineViewCallbacks } from '@babylonjs/react-native';
 import { Scene, Vector3, ArcRotateCamera, Camera, WebXRSessionManager, SceneLoader, TransformNode, DeviceSourceManager, DeviceType, DeviceSource, PointerInput, WebXRTrackingState, Nullable, MeshBuilder, Scalar } from '@babylonjs/core';
 import '@babylonjs/loaders';
 import Slider from '@react-native-community/slider';

 import * as BABYLON from '@babylonjs/core';
 (window as any).BABYLON = BABYLON;
 import { MeshWriter } from "meshwriter";
 
 const EngineScreen: FunctionComponent<ViewProps> = (props: ViewProps) => {
   const defaultScale = 1;
   const enableSnapshots = false;
 
   const engine = useEngine();
   const [toggleView, setToggleView] = useState(false);
   const [camera, setCamera] = useState<Camera>();
   const [rootNode, setRootNode] = useState<TransformNode>();
   const [scene, setScene] = useState<Scene>();
   // const [xrSession, setXrSession] = useState<WebXRSessionManager>();
   const [scale, setScale] = useState<number>(defaultScale);
   const [snapshotData, setSnapshotData] = useState<string>();
   const [engineViewCallbacks, setEngineViewCallbacks] = useState<EngineViewCallbacks>();
   const [trackingState, setTrackingState] = useState<WebXRTrackingState>();

   const [value, onChangeText] = useState('Default');
 
   useEffect(() => {
     if (engine) {
       const scene: Scene = new Scene(engine);
       setScene(scene);
       // Create a free camera
       scene.createDefaultCamera();
       setCamera(scene.activeCamera!);

       scene.createDefaultLight(true);
       const rootNode = new TransformNode('Root Container', scene);
       setRootNode(rootNode);
 
       const deviceSourceManager = new DeviceSourceManager(engine);

       const handlePointerInput = (inputIndex: PointerInput, previousState: Nullable<number>, currentState: Nullable<number>) => {
         if (inputIndex === PointerInput.Vertical &&
           currentState && previousState) {
           // rootNode.rotate(Vector3.Down(), (currentState - previousState) * 0.005);
           
           scene.activeCamera!.position.y += (currentState - previousState) * 0.0005;
           SPS.mesh.position.y -= (currentState - previousState) * 0.05;
         };
       };
 
       deviceSourceManager.onDeviceConnectedObservable.add(device => {
         if (device.deviceType === DeviceType.Touch) {
           const touch: DeviceSource<DeviceType.Touch> = deviceSourceManager.getDeviceSource(device.deviceType, device.deviceSlot)!;
           touch.onInputChangedObservable.add(touchEvent => {
             handlePointerInput(touchEvent.inputIndex, touchEvent.previousState, touchEvent.currentState);
           });
         } else if (device.deviceType === DeviceType.Mouse) {
           const mouse: DeviceSource<DeviceType.Mouse> = deviceSourceManager.getDeviceSource(device.deviceType, device.deviceSlot)!;
           mouse.onInputChangedObservable.add(mouseEvent => {
             if (mouse.getInput(PointerInput.LeftClick)) {
               handlePointerInput(mouseEvent.inputIndex, mouseEvent.previousState, mouseEvent.currentState);
             }
           });
         }
       });
 
       const transformContainer = new TransformNode('browseMessageTransform', scene);
       transformContainer.parent = rootNode;
       // transformContainer.scaling.scaleInPlace(0.2);
       transformContainer.position.y -= .2;

       // Declared variable starting with upper case because it's a constructor
       let Writer = MeshWriter(scene, {scale: 1, defaultFont:"Arial"});

      
       let textMesh = new Writer("Default", {
        "font-family": "Arial",
        "letter-height": 7,
        "letter-thickness": 1,
        color: "#1C3870",
        anchor: "center",
        colors: {
      diffuse: "#F0F0F0",
      specular: "#000000",
      ambient: "#F0F0F0",
      emissive: "#ff00f0"
        },
        position: {
      x: -10,
      y: 10,
      z: 50
        }
      });

      //Text Writer create SPS with Particle for each letter
      let SPS =  textMesh.getSPS();
      
      for (let p = 0; p < SPS.nbParticles; p++) {
        const particle = SPS.particles[p];
        //Place particles at random positions with a cube
        particle.position.x += 6;
        particle.position.y -= 1;
        // particle.position.z += 2;

        particle.rotation.x = 5;
      }
      SPS.setParticles();

      //Update animation
      // SPS.updateParticle =  (particle)=> {
      //   particle.rotation.x -= 0.06;
      // };

      // scene.registerBeforeRender( ()=> {
      //   SPS.setParticles();
      //   // SPS.mesh.rotation.y -= 0.06;
      // });

      

 
      // ROTATE FROM TRANSFORM CONTAINER
      //  scene.beforeRender = function () {
      //    transformContainer.rotate(Vector3.Up(), 0.005 * scene.getAnimationRatio());
      //  };

       // const box = MeshBuilder.CreateBox("box", {height: 1, width: 1, depth: 1}, scene);
       // box.parent = transformContainer;
       
      // IMPORT MESH FROM WEB
      //  SceneLoader.ImportMeshAsync('', 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BoxAnimated/glTF-Binary/BoxAnimated.glb').then(result => {
      //    const mesh = result.meshes[0];
      //    mesh.parent = transformContainer;
      //  });
     }
   }, [engine]);
 
   useEffect(() => {
     if (rootNode) {
       rootNode.scaling = new Vector3(scale, scale, scale);
     }
   }, [rootNode, scale]);
 
  //  const trackingStateToString = (trackingState: WebXRTrackingState | undefined) : string => {
  //    return trackingState === undefined ? '' : WebXRTrackingState[trackingState];
  //  };
 
   
 
   const onInitialized = useCallback(async(engineViewCallbacks: EngineViewCallbacks) => {
     setEngineViewCallbacks(engineViewCallbacks);
   }, [engine]);
 
   const onSnapshot = useCallback(async () => {
     if (engineViewCallbacks) {
       setSnapshotData('data:image/jpeg;base64,' + await engineViewCallbacks.takeSnapshot());
     }
   }, [engineViewCallbacks]);

   function sendMessage() {
     console.log("sending : ", value);
     if (engine) {
        const box = MeshBuilder.CreateBox("box", {height: 2, width: 1, depth: 1}, scene);
        box.parent = scene.getTransformNodeByName('browseMessageTransform');
     }
   }
 
   return (
     <>
       <View style={props.style}>
         {/* <Button title="Toggle EngineView" onPress={() => { setToggleView(!toggleView) }} /> */}
         { !toggleView &&
           <View style={{flex: 1}}>
             { enableSnapshots && 
               <View style ={{flex: 1}}>
                 <Button title={'Take Snapshot'} onPress={onSnapshot}/>
                 <Image style={{flex: 1}} source={{uri: snapshotData }} />
               </View>
             }
             <EngineView camera={camera} onInitialized={onInitialized} displayFrameRate={true} />
             <Slider style={{position: 'absolute', minHeight: 50, margin: 10, left: 0, right: 0, bottom: 0}} minimumValue={0.2} maximumValue={2} step={0.01} value={defaultScale} onValueChange={setScale} />
             <Text style={{color: 'yellow',  position: 'absolute', margin: 3}}>{/*trackingStateToString(trackingState)*/}</Text>
           </View>
         }
         { toggleView &&
           <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
             <Text style={{fontSize: 24}}>EngineView has been removed.</Text>
             <Text style={{fontSize: 12}}>Render loop stopped, but engine is still alive.</Text>
           </View>
         }
       </View>
       <TextInput
        multiline
        onChangeText={text => onChangeText(text)}
        value={value}
      />
      <Button title="Send" onPress={() => {sendMessage()}} />
     </>
   );
 };
 
 const App = () => {
   const [toggleScreen, setToggleScreen] = useState(false);
 
   return (
     <>
       <StatusBar barStyle="dark-content" />
       <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
         { !toggleScreen &&
           <EngineScreen style={{flex: 1}} />
         }
         { toggleScreen &&
           <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
             <Text style={{fontSize: 24}}>EngineScreen has been removed.</Text>
             <Text style={{fontSize: 12}}>Engine has been disposed, and will be recreated.</Text>
           </View>
         }
         {/* <Button title="Toggle EngineScreen" onPress={() => { setToggleScreen(!toggleScreen); }} />*/}
       </SafeAreaView>
     </>
   );
 };
 
 export default App;
 