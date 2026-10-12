// Silbenwerkstatt: Lesen, Zusammensetzen und wiederholen.
window.SchlaufuchsSilben=(()=>{
 const items=[
 ['M','A','MA','Mama'],['M','I','MI','Mimi'],['M','O','MO','Mofa'],
 ['L','A','LA','Lama'],['L','I','LI','Limo'],['S','O','SO','Sofa'],
 ['S','A','SA','Salat'],['N','A','NA','Nase'],['N','I','NI','Nina'],
 ['R','O','RO','Rose'],['H','A','HA','Hase'],['F','I','FI','Fisch'],
 ['M','U','MU','Musik'],['L','U','LU','Luft'],['T','O','TO','Tomate'],
 ['P','A','PA','Papa'],['W','A','WA','Wasser'],['K','A','KA','Kamel'],
 ['S','U','SU','Super'],['B','A','BA','Banane']
 ];
 let queue=[],index=0,errors=0,solved=false;
 const MAX_ROUND=6;
 const key='schlaufuchs-silbenstand',el=id=>document.getElementById(id);
 function get(){try{return JSON.parse(localStorage.getItem(key)||'{}')}catch{return {}}}
 function put(d){try{localStorage.setItem(key,JSON.stringify(d))}catch{}}
 function begin(){const d=get();queue=[...items].sort((a,b)=>((d[b[2]]?.mistakes||0)-(d[b[2]]?.right||0))-((d[a[2]]?.mistakes||0)-(d[a[2]]?.right||0)));queue=queue.slice(0,MAX_ROUND);index=0;errors=0;view('syllables');render()}
 function render(){if(index>=queue.length){el('syllablePrompt').textContent='Geschafft! 🦊';el('syllableLetters').replaceChildren();el('syllableChoices').replaceChildren();el('syllableStatus').textContent='Du hast '+queue.length+' Silben geübt.';el('syllableNext').hidden=true;return}solved=false;errors=0;let q=queue[index];el('syllableStatus').textContent='Silbe '+(index+1)+' von '+queue.length;el('syllablePrompt').textContent='Welche Silbe entsteht aus diesen Lauten?';el('syllableLetters').textContent=q[0]+'  +  '+q[1];el('syllableFeedback').textContent='Sprich beide Laute und verbinde sie.';el('syllableNext').hidden=true;let choices=[q[2],q[1]+q[0],q[0]+(q[1]==='A'?'O':'A')].filter((x,i,a)=>a.indexOf(x)===i).sort();el('syllableChoices').replaceChildren();for(const choice of choices){let b=document.createElement('button');b.className='choice';b.textContent=choice;b.onclick=()=>{if(solved)return;if(choice===q[2]){solved=true;b.classList.add('correct');el('syllableFeedback').textContent='Richtig! '+q[2]+' wie in '+q[3]+'. 🌟';el('syllableNext').hidden=false;el('syllableChoices').querySelectorAll('button').forEach(x=>x.disabled=true);let d=get();let r=d[q[2]]||{right:0,mistakes:0};if(!errors)r.right++;else r.mistakes++;d[q[2]]=r;put(d)}else{errors++;b.disabled=true;b.classList.add('wrong');el('syllableFeedback').textContent='Höre die Laute noch einmal. 💛'}};el('syllableChoices').appendChild(b)}}
 function say(){if(index>=queue.length)return;const q=queue[index];SchlaufuchsVoice.speak(q[2].toLocaleLowerCase('de-DE')+'. '+q[3]+'.')}
 async function sound(){if(index>=queue.length)return;const q=queue[index];const msg=el('syllableFeedback');try{const ok=await SchlaufuchsLaute.playSequence([q[0],q[1]],letter=>msg.textContent='Für '+letter+' fehlt noch eine Aufnahme im Lautstudio.');if(ok)msg.textContent='Du hast beide Laute gehört. Verbinde sie jetzt zu '+q[2]+'!'}catch{msg.textContent='Aufnahme konnte nicht abgespielt werden.'}}
 function next(){index++;render()}
 return {begin,next,say,sound,progress:get};
})();