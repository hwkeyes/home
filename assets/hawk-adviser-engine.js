(function(root){'use strict';
const stop=new Set('a an the my i me is it are do does how what can you your to for of on in with help please have has not no will wont cannot computer pc laptop device windows macos chromeos linux mac chromebook'.split(' '));
function norm(s){return String(s).toLowerCase().replace(/[’']/g,'').replace(/wi[ -]?fi/g,'wifi').replace(/wont|cant|cannot/g,'not').replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim()}
function tokens(s){return [...new Set(norm(s).split(' ').filter(t=>t.length>1&&!stop.has(t)))]}
function urgent(query,db){const n=norm(query);if(/^(how (can|do|should) i prevent|what if|how to prevent|what is)/.test(n))return null;
 const rules=[['My battery is swollen',/swollen.*battery|battery.*swollen|bulging battery|trackpad lifting/],['I spilled liquid on my laptop',/spilled|liquid damage|wet laptop/],['Computer smells burnt or sparks',/burning smell|smells burnt|sparking|smoke/],['My hard drive is clicking',/clicking.*(drive|disk)|(?:drive|disk).*clicking|grinding drive/],['My files have been encrypted',/ransom note|ransomware|files.*encrypted/],['I gave a scammer remote access',/scammer.*remote|remote.*scam|stranger.*controlled/]];
 for(const [title,re] of rules){for(const clause of n.split(/\b(?:but|and|however|just)\b/)){const match=re.exec(clause);if(!match)continue;const before=clause.slice(0,match.index);if(/\b(?:no|not|without|never)(?:\s+\w+){0,2}\s*$/.test(before))continue;return db.entries.find(e=>e.question===title)}}return null}
function sensitive(q){return /(?:\d[ -]?){40,}|\b(?:password|recovery key|verification code|otp)\s*(?:is|:|=)\s*\S+/i.test(q)}
function candidates(query,db,platform){const q=norm(query),qt=tokens(q);if(!qt.length)return [];
 return db.entries.filter(e=>!platform||e.platforms.includes('any')||e.platforms.includes(platform)).map(e=>{let best=0;for(const phrase of [e.question,...e.question_variations]){const pn=norm(phrase),pt=tokens(phrase);const hits=qt.filter(t=>pt.includes(t)).length;let score=hits/Math.max(qt.length,pt.length,1);if(pn===q)score=2;if(pn.length>=8&&q.includes(pn))score=Math.max(score,1.2);if(hits<2&&qt.length>1&&score<1)score=0;best=Math.max(best,score)}return{entry:e,score:best}}).filter(x=>x.score>=.32).sort((a,b)=>b.score-a.score).slice(0,4)}
function expired(e,now){return (now||new Date().toISOString().slice(0,10))>e.review_due}
const api={norm,tokens,urgent,sensitive,candidates,expired};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.HawkAdviserEngine=api;
})(typeof window!=='undefined'?window:globalThis);
