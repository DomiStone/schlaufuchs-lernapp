// Hörtraining mit den lokal aufgenommenen Lauten.
window.SchlaufuchsHoeren=(()=>{
 const rounds=[
 {sound:'M',word:'Maus',options:['M','S','F']},
 {sound:'S',word:'Sonne',options:['N','S','L']},
 {sound:'A',word:'Apfel',options:['A','E','O']},
 {sound:'F',word:'Fisch',options:['W','M','F']},
 {sound:'L',word:'Lampe',options:['L','R','N']},
 {sound:'N',word:'Nase',options:['M','N','S']},
 {sound:'R',word:'Rose',options:['R','L','D']},
 {sound:'H',word:'Hase',options:['F','H','K']}
 ];
 let index=0,correct=0,locked=false,hadError=false,queue=[],results=[];
 const key='schlaufuchs-lautfortschritt';
 function load(){try{return JSON.parse(localStorage.getItem(key)||'{}')}catch{return {}}}
 function store(data){try{localStorage.setItem(key,JSON.stringify(data))}catch{}}
 function priority(item){let r=load()[item.sound]||{};return (r.errors||0)*3-(r.success||0)+(r.due&&r.due<=Date.now()?4:0)}
 const el=id=>document.getElementById(id);
 async function listen(){const item=queue[index];try{const ok=await SchlaufuchsLaute.play(item.sound);if(!ok){el('listenFeedback').textContent='Für diesen Laut fehlt noch eine Aufnahme. Öffne „Laute hören“ und nimm '+item.sound+' auf.'}}catch{el('listenFeedback').textContent='Die Aufnahme konnte nicht abgespielt werden.'}}
 function render(){const item=queue[index];locked=false;hadError=false;el('listenProgress').textContent='Hörübung '+(index+1)+' von '+queue.length;el('listenWord').textContent='Welchen Laut hörst du? Höre genau hin.';el('listenFeedback').textContent='Höre zuerst genau hin.';el('listenNext').hidden=true;el('listenChoices').replaceChildren();item.options.forEach(letter=>{const b=document.createElement('button');b.className='choice';b.textContent=letter;b.onclick=()=>{if(locked)return;if(letter===item.sound){locked=true;if(!hadError)correct++;results.push({sound:item.sound,success:!hadError});b.classList.add('correct');el('listenFeedback').textContent='Prima! Das ist der richtige Anfangslaut. 🌟';el('listenNext').hidden=false;el('listenChoices').querySelectorAll('button').forEach(x=>x.disabled=true)}else{hadError=true;b.disabled=true;b.classList.add('wrong');el('listenFeedback').textContent='Höre noch einmal und versuche es erneut. 💛'}};el('listenChoices').appendChild(b)})}
 function start(){index=0;correct=0;results=[];queue=[...rounds].sort((a,b)=>priority(b)-priority(a));view('listen');render()}
 function next(){if(index<queue.length-1){index++;render()}else{el('listenProgress').textContent='Geschafft!';el('listenWord').textContent='Du hast '+correct+' von '+queue.length+' Lauten gleich beim ersten Versuch erkannt! 🦊';el('listenChoices').replaceChildren();el('listenNext').hidden=true;el('listenFeedback').textContent='Toll gemacht! Du kannst die Übung jederzeit wiederholen.';try{let progress=load();for(const r of results){let item=progress[r.sound]||{success:0,errors:0};if(r.success)item.success++;else item.errors++;item.due=Date.now()+(r.success?3:1)*86400000;progress[r.sound]=item}store(progress);const key='schlaufuchs-hoertraining';let d=JSON.parse(localStorage.getItem(key)||'{}');d.sessions=(d.sessions||0)+1;d.lastDate=new Date().toISOString().slice(0,10);localStorage.setItem(key,JSON.stringify(d))}catch{}}}
 return {start,listen,next,progress:load};
})();