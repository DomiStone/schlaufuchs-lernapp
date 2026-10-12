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
 let index=0,correct=0,locked=false;
 const el=id=>document.getElementById(id);
 async function listen(){const item=rounds[index];try{const ok=await SchlaufuchsLaute.play(item.sound);if(!ok){el('listenFeedback').textContent='Für diesen Laut fehlt noch eine Aufnahme. Öffne „Laute hören“ und nimm '+item.sound+' auf.'}}catch{el('listenFeedback').textContent='Die Aufnahme konnte nicht abgespielt werden.'}}
 function render(){const item=rounds[index];locked=false;el('listenProgress').textContent='Hörübung '+(index+1)+' von '+rounds.length;el('listenWord').textContent='Welchen Anfangslaut hörst du bei „'+item.word+'“?';el('listenFeedback').textContent='Höre zuerst genau hin.';el('listenNext').hidden=true;el('listenChoices').replaceChildren();item.options.forEach(letter=>{const b=document.createElement('button');b.className='choice';b.textContent=letter;b.onclick=()=>{if(locked)return;if(letter===item.sound){locked=true;correct++;b.classList.add('correct');el('listenFeedback').textContent='Prima! Das ist der richtige Anfangslaut. 🌟';el('listenNext').hidden=false;el('listenChoices').querySelectorAll('button').forEach(x=>x.disabled=true)}else{b.disabled=true;b.classList.add('wrong');el('listenFeedback').textContent='Höre noch einmal und versuche es erneut. 💛'}};el('listenChoices').appendChild(b)})}
 function start(){index=0;correct=0;view('listen');render()}
 function next(){if(index<rounds.length-1){index++;render()}else{el('listenProgress').textContent='Geschafft!';el('listenWord').textContent='Du hast '+correct+' Laute erkannt! 🦊';el('listenChoices').replaceChildren();el('listenNext').hidden=true;el('listenFeedback').textContent='Toll gemacht! Du kannst die Übung jederzeit wiederholen.';try{const key='schlaufuchs-hoertraining';let d=JSON.parse(localStorage.getItem(key)||'{}');d.sessions=(d.sessions||0)+1;d.lastDate=new Date().toISOString().slice(0,10);localStorage.setItem(key,JSON.stringify(d))}catch{}}}
 return {start,listen,next};
})();