// Erste Wörter lesen: kurze Einheiten mit Wiederholung.
window.SchlaufuchsWoerter=(()=>{
 const tasks=[
 {word:'Mama',parts:['Ma','ma'],choices:['Mama','Mimi','Lama'],emoji:'👩'},
 {word:'Lama',parts:['La','ma'],choices:['Lama','Mama','Limo'],emoji:'🦙'},
 {word:'Nase',parts:['Na','se'],choices:['Nase','Rose','Hase'],emoji:'👃'},
 {word:'Rose',parts:['Ro','se'],choices:['Rose','Hose','Nase'],emoji:'🌹'},
 {word:'Hase',parts:['Ha','se'],choices:['Hase','Nase','Hose'],emoji:'🐰'},
 {word:'Sofa',parts:['So','fa'],choices:['Sofa','Sonne','Suppe'],emoji:'🛋️'},
 {word:'Limo',parts:['Li','mo'],choices:['Limo','Lama','Mimi'],emoji:'🥤'},
 {word:'Papa',parts:['Pa','pa'],choices:['Papa','Mama','Puma'],emoji:'👨'},
 {word:'Banane',parts:['Ba','na','ne'],choices:['Banane','Tomate','Melone'],emoji:'🍌'},
 {word:'Tomate',parts:['To','ma','te'],choices:['Tomate','Banane','Rose'],emoji:'🍅'},
 {word:'Sonne',parts:['Son','ne'],choices:['Sonne','Sofa','Rose'],emoji:'☀️'},
 {word:'Maus',parts:['Maus'],choices:['Maus','Haus','Laus'],emoji:'🐭'}
 ];
 let queue=[],index=0,mistake=false,solved=false;
 const key='schlaufuchs-woerterstand',el=id=>document.getElementById(id);
 function load(){try{return JSON.parse(localStorage.getItem(key)||'{}')}catch{return {}}}
 function save(d){try{localStorage.setItem(key,JSON.stringify(d))}catch{}}
 function start(){const d=load();queue=[...tasks].sort((a,b)=>((d[b.word]?.errors||0)-(d[b.word]?.correct||0))-((d[a.word]?.errors||0)-(d[a.word]?.correct||0))).slice(0,5);index=0;view('words');render()}
 function render(){if(index>=queue.length){el('wordPrompt').textContent='Super gelesen! 🦊';el('wordEmoji').textContent='🌟';el('wordParts').textContent='';el('wordChoices').replaceChildren();el('wordFeedback').textContent='Du hast fünf Wörter geübt.';el('wordNext').hidden=true;return}let q=queue[index];mistake=false;solved=false;el('wordProgress').textContent='Wort '+(index+1)+' von '+queue.length;el('wordPrompt').textContent='Welches Wort passt zum Bild?';el('wordEmoji').textContent=q.emoji;el('wordParts').textContent='';el('wordFeedback').textContent='Lies die Wörter und wähle das passende aus.';el('wordNext').hidden=true;el('wordChoices').replaceChildren();for(const option of q.choices){let b=document.createElement('button');b.className='choice';b.textContent=option;b.onclick=()=>{if(solved)return;if(option===q.word){solved=true;b.classList.add('correct');el('wordParts').textContent=q.parts.join(' · ');el('wordFeedback').textContent='Richtig! '+q.word+' 🌟';el('wordNext').hidden=false;el('wordChoices').querySelectorAll('button').forEach(x=>x.disabled=true);let d=load(),r=d[q.word]||{correct:0,errors:0};if(mistake)r.errors++;else r.correct++;d[q.word]=r;save(d)}else{mistake=true;b.disabled=true;b.classList.add('wrong');el('wordFeedback').textContent='Versuche es noch einmal. 💛'}};el('wordChoices').appendChild(b)}}
 function speak(){if(index<queue.length)SchlaufuchsVoice.speak(queue[index].word)}
 function next(){index++;render()}
 return {start,next,speak,progress:load};
})();