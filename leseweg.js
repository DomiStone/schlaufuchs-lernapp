// Leseweg: Lernfortschritt statt bloßer Anzahl bearbeiteter Aufgaben.
window.SchlaufuchsLeseweg=(()=>{
 function stats(records,good,bad){const values=Object.values(records||{});return {attempted:values.length,secure:values.filter(x=>(x[good]||0)>=2&&(x[bad]||0)<=1).length}}
 function state(){const sounds=stats(SchlaufuchsHoeren.progress(),'success','errors');const syllables=stats(SchlaufuchsSilben.progress(),'right','mistakes');const words=stats(SchlaufuchsWoerter.progress(),'correct','errors');let stage='sounds',text='Übe Laute. Mindestens fünf Laute sollen zweimal sofort richtig erkannt werden.';if(sounds.secure>=5){stage='syllables';text='Übe Silben. Mindestens sechs Silben sollen zweimal sofort richtig gelingen.'}if(sounds.secure>=5&&syllables.secure>=6){stage='words';text='Lies erste Wörter. Schwierige Wörter werden weiter wiederholt.'}return {stage,text,sounds,syllables,words}}
 function next(){const s=state().stage;if(s==='sounds')SchlaufuchsHoeren.start();else if(s==='syllables')SchlaufuchsSilben.begin();else SchlaufuchsWoerter.start()}
 return {state,next};
})();