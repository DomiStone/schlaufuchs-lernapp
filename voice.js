// Vorlesefunktion: verfügbare deutsche Systemstimmen, Satzpausen und Geschwindigkeit.
window.SchlaufuchsVoice=(()=>{
 let voices=[],selected=localStorage.getItem('schlaufuchs-voice')||'',rate=Number(localStorage.getItem('schlaufuchs-rate')||'0.88'),token=0;
 const supported=()=>('speechSynthesis' in window)&&('SpeechSynthesisUtterance' in window);
 function refresh(){if(!supported())return [];voices=speechSynthesis.getVoices().filter(v=>/^de([-_]|$)/i.test(v.lang)).sort((a,b)=>Number(b.localService)-Number(a.localService)||a.name.localeCompare(b.name));return voices}
 function options(select){if(!select)return;const prior=selected;select.replaceChildren();let opt=document.createElement('option');opt.value='';opt.textContent='Automatisch (Deutsch)';select.appendChild(opt);refresh().forEach(v=>{let o=document.createElement('option');o.value=v.voiceURI;o.textContent=v.name+' ('+v.lang+')';select.appendChild(o)});select.value=voices.some(v=>v.voiceURI===prior)?prior:''}
 function setVoice(id){selected=id;localStorage.setItem('schlaufuchs-voice',id)}
 function setRate(value){rate=Math.max(.65,Math.min(1.05,Number(value)||.88));localStorage.setItem('schlaufuchs-rate',String(rate))}
 function clean(t){return String(t).replace(/[🍎⭐🐞🔴🔵🟢🐶]/gu,' ').replace(/\s+/g,' ').replace(/\s*([?.!])\s*/g,'$1 ').trim()}
 function speak(text){if(!supported())return false;stop();let t=clean(text);if(!t)return false;let parts=t.match(/[^.!?]+[.!?]?/g)||[t];const current=++token;let i=0;const voice=voices.find(v=>v.voiceURI===selected)||refresh().find(v=>v.voiceURI===selected)||voices.find(v=>v.lang.toLowerCase()==='de-de')||voices[0];function next(){if(current!==token||i>=parts.length)return;let u=new SpeechSynthesisUtterance(parts[i++].trim());u.lang='de-DE';u.rate=rate;u.pitch=1;u.volume=1;if(voice)u.voice=voice;u.onend=next;u.onerror=()=>{if(current===token)next()};speechSynthesis.speak(u)}next();return true}
 function stop(){token++;if(supported())speechSynthesis.cancel()}
 if(supported()){refresh();speechSynthesis.addEventListener?.('voiceschanged',()=>{refresh();options(document.getElementById('voiceChoice'))})}
 return {speak,stop,options,setVoice,setRate,getRate:()=>rate,supported};
})();