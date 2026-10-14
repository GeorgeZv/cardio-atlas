// One normalized cycle drives all visuals. Values are illustrative resting-adult presets.
export const DURATION = 800;
export const phases = [
 {start:0,end:.16,name:'Atrial systole',description:'Atrial contraction completes ventricular filling. AV valves are open; semilunar valves are closed.'},
 {start:.16,end:.23,name:'Isovolumetric contraction',description:'Ventricular pressure rises at constant volume. All valves are closed; AV valve closure marks S1.'},
 {start:.23,end:.37,name:'Rapid ejection',description:'Ventricular pressure exceeds arterial pressure. Semilunar valves open and stroke volume enters the great arteries.'},
 {start:.37,end:.50,name:'Reduced ejection',description:'Ventricular outflow slows as repolarization progresses. Semilunar valves remain open; AV valves remain closed.'},
 {start:.50,end:.59,name:'Isovolumetric relaxation',description:'Semilunar valve closure marks S2. Ventricular pressure falls at constant volume while all valves are closed.'},
 {start:.59,end:.76,name:'Rapid ventricular filling',description:'Ventricular pressure falls below atrial pressure. AV valves open and passive ventricular filling accelerates.'},
 {start:.76,end:1,name:'Diastasis',description:'Passive filling slows as atrial and ventricular pressures approach equilibrium. AV valves remain open.'}
];
export function normalize(t){const n=t%1;return n<0?n+1:n;}
export function interpolate(points,t){for(let i=1;i<points.length;i++){if(t<=points[i][0]){const a=points[i-1],b=points[i];let u=(t-a[0])/(b[0]-a[0]);u=u*u*(3-2*u);return a[1]+(b[1]-a[1])*u;}}return points.at(-1)[1];}
export const curves={
 lv:[[0,7],[.07,10],[.12,12],[.16,10],[.23,80],[.32,120],[.37,116],[.50,96],[.59,8],[.64,4],[.76,6],[1,7]],
 ao:[[0,84],[.16,81],[.23,80],[.32,118],[.37,112],[.50,96],[.515,90],[.535,94],[.76,88],[1,84]],
 la:[[0,8],[.075,12],[.12,13],[.16,10],[.20,11],[.28,7],[.36,6],[.50,10],[.59,8],[.64,6],[.76,7],[1,8]],
 volume:[[0,105],[.16,120],[.23,120],[.37,72],[.5,50],[.59,50],[.76,100],[1,105]]
};
const gaussian=(t,m,s)=>Math.exp(-.5*((t-m)/s)**2);
export function ecg(t){return .17*gaussian(t,.035,.016)-.16*gaussian(t,.15,.006)+1.02*gaussian(t,.166,.006)-.28*gaussian(t,.184,.008)+.31*gaussian(t,.415,.04);}
export function sample(t){t=normalize(t);const phase=phases.find(p=>t>=p.start&&t<p.end)||phases[0];const av=t<.16||t>=.59;const semilunar=t>=.23&&t<.5;const lv=interpolate(curves.lv,t),ao=interpolate(curves.ao,t),la=interpolate(curves.la,t);return {t,phase,av,semilunar,lv,ao,la,rv:lv*.20,ra:la*.35,pa:9+(ao-80)*.4,volume:interpolate(curves.volume,t),ecg:ecg(t)};}
export function valveOpen(id,s){return id==='mitral'||id==='tricuspid'?s.av:s.semilunar;}
export function flowProgress(kind,t){t=normalize(t);if(kind==='venous')return t;if(kind==='outflow')return Math.max(0,Math.min(1,(t-.23)/.27));if(t<.16)return (.41+t)/.57;if(t>=.59)return (t-.59)/.57;return 0;}
export function conductionStage(t){t=normalize(t);if(t<.055)return 'SA node → atria';if(t<.145)return 'AV nodal delay';if(t<.17)return 'Bundle of His';if(t<.19)return 'Bundle branches';if(t<.23)return 'Purkinje activation';return 'Repolarization / recovery';}
