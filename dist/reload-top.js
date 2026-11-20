// Only a reload resets the location; normal anchor navigation still works.
(()=>{
 const navigation=performance.getEntriesByType('navigation')[0];
 if(navigation?.type!=='reload')return;
 if('scrollRestoration' in history)history.scrollRestoration='manual';
 if(location.hash)history.replaceState(history.state,'',location.pathname+location.search);
 const reset=()=>window.scrollTo({top:0,left:0,behavior:'instant'});
 reset();
 document.addEventListener('DOMContentLoaded',reset,{once:true});
 window.addEventListener('load',()=>{reset();requestAnimationFrame(reset)},{once:true});
})();
