import * as THREE from 'three';
import {flowProgress,valveOpen} from './simulation.js';
export function createHeart(scene){
 const root=new THREE.Group();scene.add(root);root.rotation.z=-.13;
 const objects=new Map(), pickables=[], shells=[], ventricular=[], atrial=[], valves=[], conduction=[], flows=[], coronary=new THREE.Group(), internal=new THREE.Group(), electrical=new THREE.Group();
 root.add(coronary,internal,electrical);electrical.visible=false;
 const clipping=new THREE.Plane(new THREE.Vector3(0,0,-1),.13);
 const register=(id,mesh,parent=root)=>{mesh.userData.id=id;mesh.userData.baseOpacity=mesh.material.opacity;mesh.userData.baseEmissive=mesh.material.emissive?.clone();if(!objects.has(id))objects.set(id,[]);objects.get(id).push(mesh);pickables.push(mesh);parent.add(mesh);return mesh;};
 function material(color,opacity=1,roughness=.55){return new THREE.MeshStandardMaterial({color,roughness,metalness:.08,transparent:opacity<1,opacity,side:THREE.DoubleSide,depthWrite:opacity>=.95,emissive:color,emissiveIntensity:.025});}
 const v=(a)=>new THREE.Vector3(...a);
 function tube(id,points,radius,color,parent=root,opacity=.94,segments=50){const curve=new THREE.CatmullRomCurve3(points.map(v));const geometry=new THREE.TubeGeometry(curve,segments,radius,12,false);const mesh=register(id,new THREE.Mesh(geometry,material(color,opacity)),parent);mesh.userData.curve=curve;return mesh;}
 function vessel(id,points,radius,color){const mesh=tube(id,points,radius,color,root,.96,64);const curve=mesh.userData.curve;const innerMat=material(new THREE.Color(color).multiplyScalar(.32));innerMat.side=THREE.BackSide;register(id,new THREE.Mesh(new THREE.TubeGeometry(curve,64,radius*.80,12,false),innerMat));for(const t of [0,1]){const ring=register(id,new THREE.Mesh(new THREE.RingGeometry(radius*.8,radius,24),material(new THREE.Color(color).multiplyScalar(1.2))));ring.position.copy(curve.getPoint(t));ring.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1),curve.getTangent(t));}return mesh;}
 // Asymmetric chamber walls: ellipsoidal parametrization, apical taper and muscle-fiber vertex shading.
 function chamber(id,center,size,color,vent=false){const geo=new THREE.SphereGeometry(1,64,48);const pos=geo.attributes.position,colors=[];const base=new THREE.Color(color);for(let i=0;i<pos.count;i++){let x=pos.getX(i),y=pos.getY(i),z=pos.getZ(i);const phi=Math.atan2(z,x),theta=Math.acos(Math.max(-1,Math.min(1,y)));const taper=vent?(.76+.24*(y+1)/2):1;const ridge=1+.018*Math.sin(phi*27+theta*11)+.007*Math.sin(theta*65+phi*4);const sx=x*size[0]*taper*ridge+(vent?.11*(1-y)* (id==='lv'?1:-1):0),sy=y*size[1],sz=z*size[2]*taper*ridge;pos.setXYZ(i,sx,sy,sz);const striation=.88+.1*Math.sin(phi*27+theta*11)+.05*Math.sin(phi*49-theta*13);const c=base.clone().multiplyScalar(striation);colors.push(c.r,c.g,c.b);}geo.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));geo.computeVertexNormals();const mat=material(color,.82,.48);mat.color.set(0xffffff);mat.vertexColors=true;mat.clippingPlanes=[];const mesh=register(id,new THREE.Mesh(geo,mat));mesh.position.copy(v(center));mesh.userData.shell=true;shells.push(mesh);if(vent)ventricular.push(mesh);else atrial.push(mesh);
 const innerGeo=geo.clone();innerGeo.scale(.78,.83,.77);const innerMat=material(0x803f45,.95,.7);innerMat.side=THREE.BackSide;innerMat.clippingPlanes=[];const lining=register(id,new THREE.Mesh(innerGeo,innerMat));lining.position.copy(mesh.position);lining.userData.shell=true;lining.userData.lining=true;shells.push(lining);if(vent)ventricular.push(lining);else atrial.push(lining);
 // Coronal wall rim near the central section (schematic myocardial thickness).
 const rimGeo=new THREE.RingGeometry(.77,1,64);const rimMat=material(0xb9776c,1,.8);const rim=register(id,new THREE.Mesh(rimGeo,rimMat),internal);rim.position.set(center[0],center[1],.12);rim.scale.set(size[0]*(vent?.88:1),size[1],1);rim.userData.cutRim=true;rim.visible=false;return mesh;}
 chamber('la',[.57,.92,-.48],[.63,.61,.49],0xa9605d);
 chamber('ra',[-.85,.86,.02],[.68,.78,.57],0x8c5b64);
 chamber('lv',[.50,-.56,-.12],[.84,1.33,.67],0xb7746b,true);
 chamber('rv',[-.57,-.43,.29],[.80,1.11,.65],0x945560,true);
 vessel('svc',[[-1.0,.90,-.12],[-1.07,1.65,-.18],[-1.15,2.42,-.22]],.255,0x55748e);
 vessel('ivc',[[-.94,.34,-.14],[-1.16,-.37,-.35],[-1.27,-1.2,-.40]],.255,0x486782);
 vessel('aorta',[[.37,.31,-.10],[.25,1.32,-.03],[.28,2.28,-.12],[.72,2.65,-.23],[1.22,2.42,-.53],[1.34,1.65,-.65],[1.29,.93,-.65]],.27,0xc08279);
 vessel('aorta',[[.44,2.55,-.17],[.23,3.01,-.17]],.11,0xb67a72);
 vessel('aorta',[[.74,2.63,-.29],[.77,3.14,-.31]],.10,0xb67a72);
 vessel('aorta',[[1.04,2.56,-.40],[1.25,3.02,-.43]],.10,0xb67a72);
 vessel('pa',[[-.42,.02,.44],[-.18,.89,.54],[-.27,1.62,.44],[-.66,1.90,.18]],.27,0x597991);
 vessel('pa',[[-.43,1.78,.33],[-1.05,1.90,-.15],[-1.70,1.76,-.30]],.205,0x577a96);
 vessel('pa',[[-.43,1.78,.15],[.4,1.81,-.44],[1.67,1.58,-.61]],.21,0x577a96);
 for(const [y,z] of [[1.16,-.59],[.67,-.61]]){vessel('pv',[[.66,y,z],[1.13,y+.04,z-.1],[1.75,y+.10,z-.17]],.14,0xb46c6b);vessel('pv',[[.50,y,z],[-.24,y+.07,z-.23],[-1.55,y+.14,z-.21]],.14,0xad6766);}
 // Valvular annuli and individually animated cusps in a horizontal valve plane.
 function valve(id,center,radius,count,color){const pivot=new THREE.Group();internal.add(pivot);pivot.position.copy(v(center));const ring=register(id,new THREE.Mesh(new THREE.TorusGeometry(radius,.035,10,40),material(color)),pivot);ring.rotation.x=Math.PI/2;const leaflets=[];for(let i=0;i<count;i++){const a=i*Math.PI*2/count;const geo=new THREE.BufferGeometry();const positions=[];for(let j=0;j<12;j++){const start=a+j/12*Math.PI*2/count,end=a+(j+1)/12*Math.PI*2/count;positions.push(Math.cos(start)*radius,0,Math.sin(start)*radius,Math.cos(end)*radius,0,Math.sin(end)*radius,0,-.02,0);}geo.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geo.computeVertexNormals();const leaf=register(id,new THREE.Mesh(geo,material(0xdac3a0,.98,.6)),pivot);leaf.userData.midAngle=a+Math.PI/count;leaflets.push(leaf);}valves.push({id,pivot,leaflets,radius});}
 valve('tricuspid',[-.72,.35,-.02],.33,3,0xc4a58f);
 valve('mitral',[.60,.32,-.35],.32,2,0xdfb28c);
 valve('aortic',[.27,.68,-.08],.205,3,0xdaba8b);
 valve('pulmonary',[-.22,.79,.43],.22,3,0xbdc8c7);
 const septum=register('septum',new THREE.Mesh(new THREE.SphereGeometry(1,32,24),material(0xb88875,.98)),internal);septum.position.set(-.04,-.52,-.09);septum.scale.set(.14,1.07,.49);septum.rotation.z=.12;
 for(const [cx,cy,cz] of [[.31,-.98,-.36],[.85,-.82,-.29],[-.99,-.62,-.21],[-.49,-.86,-.18]]){const pap=register('papillary',new THREE.Mesh(new THREE.ConeGeometry(.11,.43,12),material(0xc5937c)),internal);pap.position.set(cx,cy,cz);for(let j=0;j<4;j++){const targetX=cx>0?.60:-.72;tube('chordae',[[cx,cy+.2,cz],[(cx+targetX)/2+(j-1.5)*.025,-.12,cz-.01],[targetX+(j-1.5)*.095,.30,cz]],.012,0xe0cdab,internal,1,12);}}
 // Epicardial vasculature follows AV and interventricular grooves.
 tube('lad',[[.30,1.04,.10],[.45,.65,.48],[.08,.28,.83],[.08,-.27,.87],[.22,-.85,.71],[.40,-1.47,.40],[.60,-1.76,.06]],.048,0xd5a088,coronary);
 for(let j=0;j<4;j++){const y=.04-j*.35;tube('lad',[[.1,y,.86],[.55,y-.13,.74],[.98,y-.23,.46]],.022,0xb98377,coronary,.94,18);}
 tube('rca',[[.13,.91,.16],[-.40,.64,.73],[-.97,.48,.63],[-1.29,.15,.34],[-1.20,-.55,.1]],.052,0xc78e7e,coronary);
 tube('rca',[[-1.15,.36,.53],[-1.17,-.18,.7],[-.93,-.73,.60],[-.6,-1.23,.30]],.028,0xb8877a,coronary);
 tube('lcx',[[.28,1.00,.08],[.80,.59,.34],[1.20,.35,.03],[1.27,.08,-.39],[.77,.12,-.77]],.046,0xd09b83,coronary);
 tube('lcx',[[1.18,.28,.12],[1.14,-.45,.36],[.99,-1.0,.28]],.026,0xc18a77,coronary);
 tube('coronary-vein',[[.52,-1.68,.08],[.34,-1.18,.56],[.26,-.62,.81],[.23,.18,.88],[.76,.48,.39],[1.24,.2,-.4],[.65,.16,-.85],[-.25,.20,-.78],[-.83,.35,-.41]],.033,0x5d90a4,coronary);
 function node(id,position,radius){const mat=material(0xe8f9a1);mat.emissive.set(0xbadc72);mat.emissiveIntensity=.9;const mesh=register(id,new THREE.Mesh(new THREE.SphereGeometry(radius,20,16),mat),electrical);mesh.position.copy(v(position));return mesh;}
 const sa=node('sa',[-1.09,1.37,.30],.085),av=node('av',[-.30,.43,.20],.073);
 function wire(id,points,start,end){const mesh=tube(id,points,.024,0xc8dd86,electrical,1,32);mesh.material.emissive.set(0xa5ce58);mesh.material.emissiveIntensity=.5;const pulse=new THREE.Mesh(new THREE.SphereGeometry(.048,10,8),new THREE.MeshBasicMaterial({color:0xf1ffc1}));electrical.add(pulse);conduction.push({id,mesh,pulse,start,end,curve:mesh.userData.curve});}
 wire('internodal',[[-1.09,1.37,.30],[-1.22,.93,.54],[-.75,.51,.44],[-.30,.43,.20]],0,.055);
 wire('internodal',[[-1.09,1.37,.30],[-.72,1.40,.36],[.05,1.47,-.05],[.62,1.3,-.23]],0,.055);
 wire('internodal',[[-1.09,1.37,.30],[-.70,1.10,.42],[-.30,.43,.20]],0,.055);
 wire('his',[[-.30,.43,.20],[-.15,.18,.22],[-.05,-.11,.28]],.145,.17);
 wire('lbb',[[-.05,-.11,.28],[.14,-.59,.36],[.35,-1.31,.24],[.51,-1.62,.12]],.17,.19);
 wire('rbb',[[-.05,-.11,.28],[-.28,-.48,.45],[-.55,-1.11,.40]],.17,.19);
 for(let i=0;i<5;i++){const f=i/4;wire('purkinje',[[.51,-1.62,.12],[.68+f*.4,-1.12,.24+f*.18],[.53+f*.65,-.38,.12+f*.3]],.19,.23);wire('purkinje',[[-.55,-1.11,.40],[-.75-f*.31,-.78,.43],[-.53-f*.66,-.15,.37]],.19,.23);}
 // Directional instanced particles: valve-crossing streams exist only in their open phase.
 const particleGeo=new THREE.ConeGeometry(.030,.10,5);const dummy=new THREE.Object3D();
 function flow(kind,points,color,count=22){const curve=new THREE.CatmullRomCurve3(points.map(v));const mesh=new THREE.InstancedMesh(particleGeo,new THREE.MeshBasicMaterial({color,transparent:true,opacity:.9,depthTest:true}),count);mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);mesh.frustumCulled=false;root.add(mesh);flows.push({kind,curve,mesh,count});}
 flow('venous',[[-1.15,2.4,-.22],[-1.07,1.6,-.14],[-.89,.90,.20]],0x5999e5,12);
 flow('venous',[[-1.27,-1.18,-.4],[-1.16,-.3,-.3],[-.93,.79,-.05]],0x5999e5,12);
 flow('inflow',[[-.85,.9,.16],[-.72,.36,.0],[-.60,-.24,.08],[-.53,-.90,.10]],0x559aea,20);
 flow('outflow',[[-.57,-.82,.18],[-.39,-.12,.39],[-.22,.80,.43],[-.30,1.63,.41],[-1.64,1.76,-.25]],0x5999e5,24);
 flow('outflow',[[-.57,-.82,.18],[-.39,-.12,.39],[-.22,.80,.43],[-.30,1.63,.31],[1.64,1.59,-.57]],0x5999e5,24);
 for(const y of [1.16,.67])for(const x of [-1.52,1.72])flow('venous',[[x,y+.1,-.78],[x*.55,y,-.69],[.58,y,-.50]],0xff666c,10);
 flow('inflow',[[.57,.97,-.43],[.6,.32,-.34],[.65,-.29,-.32],[.58,-1.3,-.24]],0xff6c72,20);
 flow('outflow',[[.58,-1.3,-.24],[.40,-.20,-.08],[.26,.8,-.04],[.3,2.29,-.11],[.74,2.63,-.22],[1.26,2.36,-.51],[1.3,.95,-.65]],0xff7278,35);
 let cut=false,flowVisible=true,exteriorVisible=true,opacity=.82,selected=null,hover=null;
 function restyle(){for(const [id,meshes] of objects){for(const m of meshes){const mat=m.material;const focused=id===selected,hovered=id===hover;const isShell=m.userData.shell;const dim=selected&&!focused;if(isShell){m.visible=exteriorVisible;mat.opacity=(m.userData.lining?.95:opacity)*(dim?.34:1);mat.depthWrite=false;mat.transparent=true;mat.clippingPlanes=cut?[clipping]:[];}else{mat.opacity=m.userData.baseOpacity*(dim?.45:1);mat.transparent=mat.opacity<1;mat.depthWrite=mat.opacity>=.95;}if(mat.emissive){mat.emissive.copy(m.userData.baseEmissive||new THREE.Color(0));mat.emissiveIntensity=focused?.25:hovered?.45:(id==='sa'||id==='av'?.8:.025);}if(m.userData.cutRim)m.visible=cut&&exteriorVisible;}}}
 function setLayer(name,value){if(name==='cutaway'){cut=value;restyle();}if(name==='exterior'){exteriorVisible=value;restyle();}if(name==='coronary')coronary.visible=value;if(name==='conduction')electrical.visible=value;if(name==='flow')flowVisible=value;}
 function update(s){const ventScale=.90+.10*(s.volume-50)/70;ventricular.forEach(m=>m.scale.setScalar(ventScale));const aScale=s.t<.16?1-.07*Math.sin(s.t/.16*Math.PI):1;atrial.forEach(m=>m.scale.setScalar(aScale));for(const valve of valves){const open=valveOpen(valve.id,s);for(const leaflet of valve.leaflets){const p=leaflet.geometry.attributes.position,a=leaflet.userData.midAngle;for(let k=2;k<p.count;k+=3)p.setXYZ(k,open?Math.cos(a)*valve.radius*.78:0,open?-.25:-.02,open?Math.sin(a)*valve.radius*.78:0);p.needsUpdate=true;leaflet.geometry.computeVertexNormals();}}
 for(const f of flows){const active=f.kind==='venous'||(f.kind==='inflow'?s.av:s.semilunar);f.mesh.visible=flowVisible&&active;if(!f.mesh.visible)continue;const progress=flowProgress(f.kind,s.t);for(let i=0;i<f.count;i++){const t=(i/f.count+progress)%1;dummy.position.copy(f.curve.getPointAt(t));dummy.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),f.curve.getTangentAt(t));dummy.scale.setScalar(1);dummy.updateMatrix();f.mesh.setMatrixAt(i,dummy.matrix);}f.mesh.instanceMatrix.needsUpdate=true;}
 for(const c of conduction){const active=s.t>=c.start&&s.t<c.end;c.pulse.visible=active;if(active)c.pulse.position.copy(c.curve.getPoint((s.t-c.start)/(c.end-c.start)));c.mesh.material.emissiveIntensity=active?2:.35;}sa.material.emissiveIntensity=s.t<.02?2:.4;av.material.emissiveIntensity=s.t>=.055&&s.t<.145?1.8:.4;
 }
 function center(id){root.updateMatrixWorld(true);const ms=objects.get(id);if(!ms?.length)return new THREE.Vector3(0,.35,0);const b=new THREE.Box3();for(const m of ms)b.expandByObject(m);return b.getCenter(new THREE.Vector3());}
 return {root,objects,pickables,setLayer,update,center,get cut(){return cut;},setOpacity(o){opacity=o;restyle();},select(id){selected=id;restyle();},hover(id){hover=id;restyle();},isPickable(m,point){for(let p=m;p;p=p.parent)if(!p.visible)return false;if(m.userData.shell&&cut&&clipping.distanceToPoint(point)<0)return false;return true;}};
}
