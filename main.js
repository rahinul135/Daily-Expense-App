import {initializeApp} from 'firebase/app';
import {getAuth,onAuthStateChanged,createUserWithEmailAndPassword,signInWithEmailAndPassword,signOut,sendPasswordResetEmail,sendEmailVerification,updateProfile} from 'firebase/auth';
import {initializeFirestore,persistentLocalCache,persistentSingleTabManager,doc,collection,onSnapshot,setDoc,addDoc,updateDoc,deleteDoc,getDoc,getDocs,writeBatch} from 'firebase/firestore';
import {Capacitor} from '@capacitor/core';
import {App as CapApp} from '@capacitor/app';
import {Filesystem,Directory} from '@capacitor/filesystem';
import {Share} from '@capacitor/share';
import EJS from './emailjs-config.js';
import html2canvas from 'html2canvas';
import {jsPDF} from 'jspdf';


var PAL=['#6C3BEF','#FF9F1C','#FF5FA8','#0E9F8E','#3B82F6','#E0366F','#8B5CF6','#16A34A'];var NOW=new Date(),TODAY=ymd(NOW),MK=TODAY.slice(0,7),RM=MK,DN=NOW.getDate();
var MON=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],DAY=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
var NC={budget:'#FF8A00',loan:'#6C3BEF',entry:'#0E9F8E',admin:'#FF5FA8'},NI={budget:'bell',loan:'swap',entry:'plus',admin:'shield'};
var T={en:{balance:'Balance',income:'Income',expense:'Expense',add:'Add',tracker:'Tracker',viewAll:'View all',dailyAvg:'Daily average',today:'Today',pawna:'Pawna',dhar:'Dhar',last7:'Last 7 days',budgetMon:'Budget monitor',addentry:'Add entry',amount:'Amount',name:'What for?',place:'Where did you spend?',category:'Category',note:'Note (optional)',save:'Save entry',history:'History',all:'All',search:'Search',notifT:'Notifications',markAll:'Mark all as read',budgetT:'Monthly budget',spent:'Spent this month',editbudget:'Edit budget',limit:'Monthly limit (৳)',alertat:'Alert at',alertOn:'Alert me near the limit',saveBudget:'Save settings',adminOnly:'Only an admin can change this',dharT:'Dhar and Pawna',who:'Person name',reports:'Reports',byCat:'Spending by category',pdfT:'Monthly PDF sheet',dl:'Download PDF',profile:'Profile',darkmode:'Dark mode',language:'Language',categories:'Manage categories',catNote:'View-only members cannot add or delete categories',viewLock:'Your role (view only) cannot change this',status:'Status',unpaid:'Unpaid',markUnpaid:'Mark unpaid',admin:'Admin panel',logout:'Log out',delete:'Delete',close:'Close',photo:'Change photo',preview:'Preview app as (prototype only)',members:'Members',rolesT:'Roles and access',home:'Home',savingsT:'Savings',used:'used',left:'left',of:'of',safe:'Safe',near:'Near limit',over:'Over',noNotif:'No notifications',r_super:'Super Admin',r_admin:'Admin',r_member:'Member',r_view:'View only',paid:'Paid',markPaid:'Mark paid',addPawna:'Add pawna',addDhar:'Add dhar',pawnaL:'Total pawna (I will get)',dharL:'Total dhar (I owe)',people:'people',perDay:'per day',avgS:'This month’s average',above:'above average',below:'below average',spendOn:'Spending on',none:'No entries yet.',where:'Where',when:'Date and time',by:'Added by',cat:'Category',noNote:'No note',warnMsg:'Heads up: you’ve used {p}% of your budget',saved:'Saved',amtErr:'Enter an amount',deleted:'Deleted',budSaved:'Budget saved',catAdded:'Category added',lastOne:'Keep at least one category',roleSet:'Role updated',superOnly:'Only the Super Admin can change roles',viewHist:'View list in History ›',alertsT:'Budget, alerts and setup',pawWarn:'Pawna alert: you’re owed ৳{a} in total (limit ৳{l})',dharWarn:'Dhar alert: you owe ৳{a} in total (limit ৳{l})',alertAmt:'Alert at',a2:'Pawna alert (amount)',a3:'Dhar alert (amount)',pLimL:'Warn when total pawna reaches (৳)',dLimL:'Warn when total dhar reaches (৳)',a1d:'Warn when spending reaches this percent of the monthly budget',beT:'Backend setup',beD:'Connect Firebase so family accounts and data sync on every phone.',beBtn:'Save and test connection',beLock:'Only the Super Admin can change backend setup',beToast:'Connection test works in the final app',saveCh:'Save changes',cancel:'Cancel',updated:'Entry updated',signIn:'Sign in',createAcc:'Create account',yourName:'Your name',email:'Email',pw:'Password',forgot:'Forgot password?',resetSent:'Password reset email sent',verT:'Verify your email',verD:'We sent a 6-digit code to your email. Enter it below.',verGo:'Verify',verResend:'Resend code',verNot:'Wrong or expired code',verSent:'Code sent to your email',verCodeL:'Verification code',verNoSvc:'Email service is not set up yet',verWait:'Please wait a little before resending',errBad:'Wrong email or password',errUsed:'This email already has an account',errWeak:'Password must be at least 6 characters',errNet:'No internet connection or action failed',errEmail:'Enter a valid email',errName:'Enter your name',errMany:'Too many attempts, try again later',noBud:'Budget not set by admin',superData:'Only the Super Admin can see member data',youTag:'you',loading:'Loading…',pdfBusy:'Making PDF…',pdfErr:'Could not make PDF'},
bn:{balance:'ব্যালেন্স',income:'আয়',expense:'খরচ',add:'যোগ',tracker:'ট্র্যাকার',viewAll:'সব দেখুন',dailyAvg:'দৈনিক গড় খরচ',today:'আজ',pawna:'পাওনা',dhar:'ধার',last7:'গত ৭ দিন',budgetMon:'বাজেট মনিটর',addentry:'নতুন এন্ট্রি',amount:'টাকার পরিমাণ',name:'কীসের জন্য?',place:'কোথায় খরচ করলেন?',category:'ক্যাটাগরি',note:'নোট (ঐচ্ছিক)',save:'সেভ করুন',history:'ইতিহাস',all:'সব',search:'খুঁজুন',notifT:'নোটিফিকেশন',markAll:'সব পড়া হয়েছে',budgetT:'মাসিক বাজেট',spent:'এই মাসে খরচ',editbudget:'বাজেট এডিট',limit:'মাসিক লিমিট (৳)',alertat:'অ্যালার্ট',alertOn:'লিমিটের কাছাকাছি হলে জানান',saveBudget:'সেভ করুন',adminOnly:'শুধু অ্যাডমিন এটি পরিবর্তন করতে পারবে',dharT:'ধার ও পাওনা',who:'ব্যক্তির নাম',reports:'রিপোর্ট',byCat:'ক্যাটাগরি অনুযায়ী খরচ',pdfT:'মাসিক পিডিএফ শিট',dl:'পিডিএফ ডাউনলোড',profile:'প্রোফাইল',darkmode:'ডার্ক মোড',language:'ভাষা',categories:'ক্যাটাগরি ম্যানেজ',catNote:'শুধু-দেখা রোলে ক্যাটাগরি যোগ বা মুছা যাবে না',viewLock:'আপনার রোলে (শুধু দেখা) এটি পরিবর্তন করা যাবে না',status:'অবস্থা',unpaid:'অপরিশোধিত',markUnpaid:'অপরিশোধিত করুন',admin:'অ্যাডমিন প্যানেল',logout:'লগ আউট',delete:'মুছুন',close:'বন্ধ করুন',photo:'ছবি পরিবর্তন',preview:'অ্যাপ যেভাবে দেখাবে (শুধু প্রোটোটাইপ)',members:'সদস্য',rolesT:'রোল ও অ্যাক্সেস',home:'হোম',savingsT:'সঞ্চয়',used:'ব্যবহৃত',left:'বাকি',of:'এর মধ্যে',safe:'নিরাপদ',near:'সীমার কাছে',over:'সীমা পার',noNotif:'কোনো নোটিফিকেশন নেই',r_super:'সুপার অ্যাডমিন',r_admin:'অ্যাডমিন',r_member:'সদস্য',r_view:'শুধু দেখা',paid:'পরিশোধিত',markPaid:'পরিশোধ হয়েছে',addPawna:'পাওনা যোগ করুন',addDhar:'ধার যোগ করুন',pawnaL:'মোট পাওনা (আমি পাব)',dharL:'মোট ধার (আমি দেব)',people:'জন',perDay:'প্রতিদিন',avgS:'এই মাসের গড়',above:'গড়ের চেয়ে বেশি',below:'গড়ের চেয়ে কম',spendOn:'খরচ',none:'কোনো এন্ট্রি নেই।',where:'কোথায়',when:'তারিখ ও সময়',by:'যোগ করেছেন',cat:'ক্যাটাগরি',noNote:'কোনো নোট নেই',warnMsg:'সতর্কতা: আপনি বাজেটের {p}% খরচ করেছেন',saved:'সেভ হয়েছে',amtErr:'টাকার পরিমাণ লিখুন',deleted:'মুছে ফেলা হয়েছে',budSaved:'বাজেট সেভ হয়েছে',catAdded:'ক্যাটাগরি যোগ হয়েছে',lastOne:'অন্তত একটি ক্যাটাগরি রাখুন',roleSet:'রোল পরিবর্তন হয়েছে',superOnly:'শুধু সুপার অ্যাডমিন রোল পরিবর্তন করতে পারবে',viewHist:'ইতিহাসে তালিকা দেখুন ›',alertsT:'বাজেট, অ্যালার্ট ও সেটআপ',pawWarn:'পাওনা সতর্কতা: আপনার মোট পাওনা ৳{a} (লিমিট ৳{l})',dharWarn:'ধার সতর্কতা: আপনার মোট ধার ৳{a} (লিমিট ৳{l})',alertAmt:'অ্যালার্ট',a2:'পাওনা অ্যালার্ট (টাকা)',a3:'ধার অ্যালার্ট (টাকা)',pLimL:'মোট পাওনা এতে পৌঁছালে সতর্ক করুন (৳)',dLimL:'মোট ধার এতে পৌঁছালে সতর্ক করুন (৳)',a1d:'মাসিক বাজেটের এই শতাংশে খরচ পৌঁছালে সতর্ক করুন',beT:'ব্যাকএন্ড সেটআপ',beD:'ফায়ারবেস কানেক্ট করুন, যাতে পরিবারের অ্যাকাউন্ট ও ডেটা সব ফোনে সিঙ্ক হয়।',beBtn:'সেভ করে কানেকশন টেস্ট',beLock:'শুধু সুপার অ্যাডমিন ব্যাকএন্ড সেটআপ পরিবর্তন করতে পারবে',beToast:'কানেকশন টেস্ট ফাইনাল অ্যাপে কাজ করবে',saveCh:'পরিবর্তন সেভ করুন',cancel:'বাতিল',updated:'এন্ট্রি আপডেট হয়েছে',signIn:'সাইন ইন',createAcc:'অ্যাকাউন্ট খুলুন',yourName:'আপনার নাম',email:'ইমেইল',pw:'পাসওয়ার্ড',forgot:'পাসওয়ার্ড ভুলে গেছেন?',resetSent:'পাসওয়ার্ড রিসেট ইমেইল পাঠানো হয়েছে',verT:'ইমেইল ভেরিফাই করুন',verD:'আপনার ইমেইলে ৬ সংখ্যার একটি কোড পাঠানো হয়েছে। নিচে কোডটি লিখুন।',verGo:'ভেরিফাই করুন',verResend:'আবার কোড পাঠান',verNot:'কোড ভুল বা মেয়াদ শেষ',verSent:'ইমেইলে কোড পাঠানো হয়েছে',verCodeL:'ভেরিফিকেশন কোড',verNoSvc:'ইমেইল সার্ভিস এখনও সেটআপ করা হয়নি',verWait:'আবার পাঠানোর আগে একটু অপেক্ষা করুন',errBad:'ইমেইল বা পাসওয়ার্ড ভুল',errUsed:'এই ইমেইলে আগেই অ্যাকাউন্ট আছে',errWeak:'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে',errNet:'ইন্টারনেট নেই বা কাজটি হয়নি',errEmail:'সঠিক ইমেইল দিন',errName:'আপনার নাম লিখুন',errMany:'অনেকবার চেষ্টা হয়েছে, পরে আবার চেষ্টা করুন',noBud:'অ্যাডমিন বাজেট সেট করেননি',superData:'শুধু সুপার অ্যাডমিন সদস্যের ডেটা দেখতে পারবে',youTag:'আপনি',loading:'লোড হচ্ছে…',pdfBusy:'পিডিএফ তৈরি হচ্ছে…',pdfErr:'পিডিএফ তৈরি করা যায়নি'}};
var DB,kind='expense',selCat={expense:'Food',income:'Salary'},cmk='expense',hf='all',dtab='get',cur='login',tt;
function $(s){return document.querySelector(s)}
function $$(s){return Array.prototype.slice.call(document.querySelectorAll(s))}
function t(k){return (T[DB.lang]&&T[DB.lang][k])||T.en[k]||k}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function money(n){return '৳'+Math.round(n).toLocaleString('en-US')}
function pad(n){return n<10?'0'+n:''+n}
function ymd(d){return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate())}
function fmtD(d){var p=d.split('-');return (+p[2])+' '+MON[+p[1]-1]}
function isAdmin(){return DB.role==='super'||DB.role==='admin'}
function canWrite(){return DB.role!=='view'}
function persist(){try{localStorage.setItem('lang',DB.lang)}catch(e){}}
function catColor(ty,n){var l=DB.cats[ty]||[];for(var i=0;i<l.length;i++)if(l[i].n===n)return l[i].c;return '#8B85A0'}
function row(e){var inc=e.type==='income';return '<button class="row" data-open="'+e.id+'"><span class="dot" style="background:'+catColor(e.type,e.cat)+'">'+esc(e.cat.charAt(0).toUpperCase())+'</span><span class="mid"><b>'+esc(e.name)+'</b><small>'+esc(e.place)+' · '+esc(e.cat)+' · '+esc(e.t)+'</small>'+(e.note?'<small class="nt">“'+esc(e.note)+'”</small>':'')+'</span><b class="'+(inc?'up':'dn')+'">'+(inc?'+':'−')+money(e.amt)+'</b></button>'}
var PARENT={budget:'home',dharbaki:'home',savings:'home',notif:'home',admin:'profile',alerts:'profile',udata:'profile'};
function setNav(){var on=cur!=='login'&&cur!=='add'&&cur!=='verify'&&cur!=='splash',a=PARENT[cur]||cur;$('#nav').classList.toggle('on',on);$('#fab').classList.toggle('on',on&&canWrite());$$('#nav [data-n]').forEach(function(b){b.classList.toggle('on',b.getAttribute('data-n')===a)})}
function go(id){if(!$('section#'+id))id='home';cur=id;$$('.s').forEach(function(s){s.classList.toggle('on',s.id===id)});setNav();window.scrollTo(0,0)}
function toast(m){var e=$('#toast');e.textContent=m;e.style.display='block';clearTimeout(tt);tt=setTimeout(function(){e.style.display='none'},2000)}
function setTheme(){var r=document.documentElement,d=r.getAttribute('data-theme')==='dark'||(!r.getAttribute('data-theme')&&matchMedia('(prefers-color-scheme:dark)').matches);r.setAttribute('data-theme',d?'light':'dark');try{localStorage.setItem('theme',d?'light':'dark')}catch(e){}$$('[role=switch][data-theme]').forEach(function(s){s.setAttribute('aria-checked',String(!d))})}
function applyLang(){$$('[data-t]').forEach(function(e){e.textContent=t(e.getAttribute('data-t'))});$$('[data-p]').forEach(function(e){e.placeholder=t(e.getAttribute('data-p'))});$$('#langs button').forEach(function(b){b.classList.toggle('on',b.getAttribute('data-lang')===DB.lang)});document.documentElement.lang=DB.lang}
function stats(){var s={inc:0,exp:0,tdy:0};DB.ent.forEach(function(e){if(e.d.slice(0,7)===MK){if(e.type==='income')s.inc+=e.amt;else{s.exp+=e.amt;if(e.d===TODAY)s.tdy+=e.amt}}});s.avg=s.exp/DN;return s}
function render(){
  var s=stats(),pct=DB.bud?Math.round(s.exp/DB.bud*100):0,warn=DB.on&&pct>=DB.alert,col=pct>=100?'#FF3D7F':warn?'#FF8A00':'#16A34A';
  $('#bal').textContent=money(s.inc-s.exp);$('#inc').textContent=money(s.inc);$('#exp').textContent=money(s.exp);
  $('#warn').classList.toggle('on',warn);$('#warnT').textContent=t('warnMsg').replace('{p}',pct);
  $('#avg').textContent=money(s.avg);$('#avgS').textContent=t('perDay')+' · '+t('avgS');$('#tdy').textContent=money(s.tdy);$('#tdyS').textContent=s.tdy>s.avg?'▲ '+t('above'):'▼ '+t('below');
  var g=DB.loans.filter(function(l){return l.type==='get'&&!l.paid}),o=DB.loans.filter(function(l){return l.type==='owe'&&!l.paid}),sm=function(a){return a.reduce(function(x,l){return x+l.amt},0)};
  $('#paw').textContent=money(sm(g));$('#pawS').textContent=g.length+' '+t('people');$('#dhr').textContent=money(sm(o));$('#dhrS').textContent=o.length+' '+t('people');
  var mx=1,w=[],tot7=0;for(var i=6;i>=0;i--){var k=ymd(new Date(NOW.getFullYear(),NOW.getMonth(),NOW.getDate()-i)),v=0;DB.ent.forEach(function(e){if(e.d===k&&e.type==='expense')v+=e.amt});w.push({k:k,v:v,d:new Date(NOW.getFullYear(),NOW.getMonth(),NOW.getDate()-i)});mx=Math.max(mx,v);tot7+=v}
  $('#wk').textContent=money(tot7/7)+' / '+t('perDay');$('#cols').innerHTML=w.map(function(x){return '<div'+(x.k===TODAY?' class="hot"':'')+'><i style="height:'+Math.max(x.v/mx*70,4)+'px"></i>'+DAY[x.d.getDay()].charAt(0)+'</div>'}).join('');
  $('#bBig').textContent=pct;$('#bBar').style.width=Math.min(pct,100)+'%';$('#bBar').style.background=col;
  $('#bLg').innerHTML='<span style="--c:#16A34A">'+t('safe')+' &lt;'+DB.alert+'</span><span style="--c:#FF8A00">'+t('near')+' '+DB.alert+'–99</span><span style="--c:#FF3D7F">'+t('over')+' ≥100</span>';
  $('#bUsed').textContent=DB.bud?money(s.exp)+' '+t('of')+' '+money(DB.bud):money(s.exp);$('#bLeft').textContent=DB.bud?money(Math.max(DB.bud-s.exp,0))+' '+t('left'):t('noBud');
  $('#b1').textContent=money(s.exp);$('#b2').style.width=Math.min(pct,100)+'%';$('#b2').style.background=col;$('#b3').textContent=pct+'% '+t('used')+' · '+t('of')+' '+money(DB.bud);$('#b4').textContent=money(Math.max(DB.bud-s.exp,0))+' '+t('left');
  var h='';for(var j=-4;j<=2;j++){var dt=new Date(NOW.getFullYear(),NOW.getMonth(),NOW.getDate()+j),kk=ymd(dt);h+='<button class="dc'+(kk===DB.sel?' on':'')+'" data-day="'+kk+'"><small>'+DAY[dt.getDay()]+'</small><b>'+dt.getDate()+'</b></button>'}$('#strip').innerHTML=h;
  var dl=DB.ent.filter(function(e){return e.d===DB.sel}).sort(function(a,b){return (b.at||0)-(a.at||0)}),de=0;dl.forEach(function(e){if(e.type==='expense')de+=e.amt});
  $('#dayT').textContent=DB.sel===TODAY?t('today'):t('spendOn')+' '+fmtD(DB.sel);$('#dayS').textContent=fmtD(DB.sel)+' · −'+money(de);
  $('#today').innerHTML=dl.length?dl.map(row).join(''):'<div class="m" style="padding:10px 0">'+t('none')+'</div>';
  labels();setAv();filt();reports();cats();addCats();places();notif();loansUI();adminUI();applyRole()}
function filt(){var q=$('#q').value.toLowerCase();if(hf==='get'||hf==='owe'){var ll=DB.loans.filter(function(x){return x.type===hf&&(x.who+x.note).toLowerCase().indexOf(q)>-1}).sort(function(a,b){return a.paid-b.paid||(b.at||0)-(a.at||0)});$('#hl').innerHTML=ll.length?ll.map(loanRow).join(''):'<div class="m">'+t('none')+'</div>';return}var l=DB.ent.slice().sort(function(a,b){return b.d.localeCompare(a.d)||(b.at||0)-(a.at||0)}).filter(function(e){return (hf==='all'||e.type===hf)&&(e.name+e.place+e.cat+e.note).toLowerCase().indexOf(q)>-1});$('#hl').innerHTML=l.length?l.map(row).join(''):'<div class="m">'+t('none')+'</div>'}
function loanRow(x){var g=x.type==='get';return '<div class="row" data-lopen="'+x.id+'" style="cursor:pointer;opacity:'+(x.paid?.55:1)+'"><span class="dot" style="background:'+(g?'#16A34A':'#E0366F')+'">'+esc(x.who.charAt(0).toUpperCase())+'</span><span class="mid"><b>'+esc(x.who)+' · '+t(g?'pawna':'dhar')+'</b><small>'+esc(x.note||'—')+(x.d?' · '+fmtD(x.d):'')+'</small></span><span style="text-align:right"><b class="'+(g?'up':'dn')+'">'+(g?'+':'−')+money(x.amt)+'</b><br><button class="chip" data-paid="'+x.id+'" style="padding:5px 10px;font-size:12px"'+(canWrite()?'':' disabled')+'>'+(x.paid?'✓ '+t('paid'):t('markPaid'))+'</button></span></div>'}
function reports(){var by={},tot=0,ex=DB.ent.filter(function(e){return e.type==='expense'&&e.d.slice(0,7)===RM});ex.forEach(function(e){by[e.cat]=(by[e.cat]||0)+e.amt;tot+=e.amt});var ks=Object.keys(by).sort(function(a,b){return by[b]-by[a]});
  $('#rc').innerHTML=ks.map(function(k){var p=tot?by[k]/tot*100:0;return '<div style="margin-top:10px"><div class="r"><span>'+esc(k)+'</span><span class="m">'+money(by[k])+' · '+Math.round(p)+'%</span></div><div class="bar" style="margin:6px 0 0"><i style="width:'+p+'%;background:'+catColor('expense',k)+'"></i></div></div>'}).join('');
  $('#pdf').innerHTML=ex.slice().sort(function(a,b){return b.d.localeCompare(a.d)}).map(function(e){return '<tr><td>'+fmtD(e.d)+'</td><td>'+esc(e.name)+'<br><span style="color:#6B6485">'+esc(e.place)+'</span></td><td>'+esc(e.cat)+'</td><td>'+money(e.amt)+'</td></tr>'}).join('')+'<tr><td colspan="3"><b>Total expense</b></td><td><b>'+money(tot)+'</b></td></tr>'}
function cats(){var a=canWrite();$('#cm').innerHTML=DB.cats[cmk].map(function(c){return '<div class="row" style="cursor:default"><span class="dot" style="background:'+c.c+';width:34px;height:34px;border-radius:11px">'+esc(c.n.charAt(0).toUpperCase())+'</span><span class="mid"><b>'+esc(c.n)+'</b></span>'+(a?'<button class="sq" data-del="'+esc(c.n)+'" aria-label="Delete '+esc(c.n)+'" style="width:38px;height:38px;color:var(--dn)"><svg class="i" style="width:18px;height:18px"><use href="#x"/></svg></button>':'')+'</div>'}).join('');$$('#cmk button').forEach(function(b){b.classList.toggle('on',b.getAttribute('data-cmk')===cmk)})}
function addCats(){var l=DB.cats[kind];if(!l.some(function(c){return c.n===selCat[kind]}))selCat[kind]=l[0]?l[0].n:'';$('#acats').innerHTML=l.map(function(c){return '<button class="chip'+(c.n===selCat[kind]?' on':'')+'" data-cat="'+esc(c.n)+'">'+esc(c.n)+'</button>'}).join('')+(canWrite()?'<button class="chip add" data-newcat>+ New</button>':'')}
function places(){var seen={},o=[];DB.ent.slice().sort(function(a,b){return (b.at||0)-(a.at||0)}).forEach(function(e){if(!seen[e.place]&&o.length<4){seen[e.place]=1;o.push(e.place)}});$('#places').innerHTML=o.map(function(p){return '<button class="chip" data-pl="'+esc(p)+'">'+esc(p)+'</button>'}).join('')}
function notif(){var u=DB.notifs.filter(function(n){return !n.read}).length;$('#bd').textContent=u;$('#bd').style.display=u?'flex':'none';
  $('#nl').innerHTML=DB.notifs.length?DB.notifs.map(function(n){return '<button class="nrow'+(n.read?' rd':'')+'" data-nid="'+n.id+'"><span class="nd"></span><span class="n2" style="background:'+NC[n.ty]+'"><svg class="i" style="width:18px;height:18px"><use href="#'+NI[n.ty]+'"/></svg></span><span class="mid"><b>'+esc(n.txt)+'</b><small>'+esc(n.sub)+'</small><small>'+esc(fmtTs(n.at))+'</small></span></button>'}).join(''):'<div class="m">'+t('noNotif')+'</div>'}
function addNotif(ty,txt,sub,go){fs.add('notifs',{ty:ty,txt:txt,sub:sub,go:go,read:false,at:Date.now()})}
function loansUI(){var l=DB.loans.filter(function(x){return x.type===dtab}),un=l.filter(function(x){return !x.paid}),tot=un.reduce(function(a,x){return a+x.amt},0);
  $$('#dtabs button').forEach(function(b){b.classList.toggle('on',b.getAttribute('data-d')===dtab)});
  $('#dSumL').textContent=t(dtab==='get'?'pawnaL':'dharL');$('#dSum').textContent=money(tot);$('#dSum').className=dtab==='get'?'up':'dn';$('#dSumS').textContent=un.length+' '+t('people');$('#lAddT').textContent=t(dtab==='get'?'addPawna':'addDhar');
  $('#dlist').innerHTML=l.slice().sort(function(a,b){return a.paid-b.paid}).map(function(x){return '<div class="row" style="cursor:default;opacity:'+(x.paid?.55:1)+'"><span class="dot" style="background:'+(dtab==='get'?'#16A34A':'#E0366F')+'">'+esc(x.who.charAt(0).toUpperCase())+'</span><span class="mid"><b>'+esc(x.who)+'</b><small>'+esc(x.note||'—')+'</small></span><span style="text-align:right"><b class="'+(dtab==='get'?'up':'dn')+'">'+money(x.amt)+'</b><br><button class="chip" data-paid="'+x.id+'" style="padding:5px 10px;font-size:12px"'+(canWrite()?'':' disabled')+'>'+(x.paid?'✓ '+t('paid'):t('markPaid'))+'</button></span></div>'}).join('')||'<div class="m">'+t('none')+'</div>'}
var _lu=loansUI;loansUI=function(){_lu();var g=dtab==='get',tot=DB.loans.filter(function(x){return x.type===dtab&&!x.paid}).reduce(function(a,x){return a+x.amt},0),lim=g?DB.pawLim:DB.dharLim,on=g?DB.pawOn:DB.dharOn,wn=on&&lim>0&&tot>=lim;$('#dSumCard').className='hero2 '+(g?'pw':'dh');$('#dSum').className='';$('#dBar').style.width=(on&&lim>0?Math.min(100,tot/lim*100):0)+'%';$('#dLim').textContent=on&&lim>0?t('alertAmt')+' '+money(lim):'';$('#dWarn').classList.toggle('on',wn);$('#dWarnT').textContent=t(g?'pawWarn':'dharWarn').replace('{a}',money(tot)).replace('{l}',money(lim))};
function loanAlert(am){var g=dtab==='get',tot=DB.loans.filter(function(x){return x.type===dtab&&!x.paid}).reduce(function(a,x){return a+x.amt},0),lim=g?DB.pawLim:DB.dharLim,on=g?DB.pawOn:DB.dharOn;if(on&&lim>0&&tot-am<lim&&tot>=lim)addNotif('loan',g?'Pawna alert':'Dhar alert',(g?'Total pawna ':'Total dhar ')+money(tot)+' reached your limit of '+money(lim),'dharbaki')}
function adminUI(){var l=(DB.users||[]).slice().sort(function(a,b){return (a.createdAt||0)-(b.createdAt||0)});
  $('#ml').innerHTML=l.length?l.map(function(u,i){var me=u.id===DB.uid,sup=(u.email||'').toLowerCase()===SUPER;
    var rt=sup?'<span class="chip on">'+t('r_super')+'</span>':'<select data-role="'+u.id+'" aria-label="Role for '+esc(u.name||u.email||'')+'"'+(DB.role==='super'&&!me?'':' disabled')+'>'+['admin','member','view'].map(function(r){return '<option value="'+r+'"'+(u.role===r?' selected':'')+'>'+t('r_'+r)+'</option>'}).join('')+'</select>';
    return '<div class="row" style="cursor:default"><span class="dot" style="background:'+PAL[i%8]+'">'+esc((u.name||u.email||'?').charAt(0).toUpperCase())+'</span><button data-uid="'+u.id+'" style="background:none;border:0;padding:0;flex:1;min-width:0;display:flex;flex-direction:column;gap:1px;text-align:left"><b>'+esc(u.name||u.email||'')+(me?' ('+t('youTag')+')':'')+'</b><small style="font-size:12px;color:var(--mut)">'+esc(u.email||'')+'</small></button>'+rt+'</div>'}).join(''):'<div class="m">'+t('none')+'</div>';
  $('#mNote').textContent=DB.role==='super'?'':t('superOnly')}
function mk(d){return Object.assign({id:d.id},d.data())}
function roRow(e){var inc=e.type==='income';return '<div class="row" style="cursor:default"><span class="dot" style="background:#8B5CF6">'+esc((e.cat||'?').charAt(0).toUpperCase())+'</span><span class="mid"><b>'+esc(e.name)+'</b><small>'+esc(e.place)+' · '+esc(e.cat)+' · '+esc(e.d)+'</small>'+(e.note?'<small class="nt">“'+esc(e.note)+'”</small>':'')+'</span><b class="'+(inc?'up':'dn')+'">'+(inc?'+':'−')+money(e.amt)+'</b></div>'}
function roLoan(x){var g=x.type==='get';return '<div class="row" style="cursor:default;opacity:'+(x.paid?.55:1)+'"><span class="dot" style="background:'+(g?'#16A34A':'#E0366F')+'">'+esc((x.who||'?').charAt(0).toUpperCase())+'</span><span class="mid"><b>'+esc(x.who)+' · '+t(g?'pawna':'dhar')+'</b><small>'+esc(x.note||'—')+'</small></span><b class="'+(g?'up':'dn')+'">'+money(x.amt)+'</b></div>'}
function renderU(ent,loans){var inc=0,exp=0;ent.forEach(function(e){if((e.d||'').slice(0,7)===MK){if(e.type==='income')inc+=e.amt;else exp+=e.amt}});
  ent.sort(function(a,b){return (b.d||'').localeCompare(a.d||'')||(b.at||0)-(a.at||0)});loans.sort(function(a,b){return (b.at||0)-(a.at||0)});
  $('#uData').innerHTML='<div class="card"><div class="r"><span>'+t('income')+'</span><b class="up">'+money(inc)+'</b></div><div class="r" style="margin-top:6px"><span>'+t('expense')+'</span><b class="dn">'+money(exp)+'</b></div></div><div class="card"><h2>'+t('history')+'</h2>'+(ent.length?ent.map(roRow).join(''):'<div class="m">'+t('none')+'</div>')+'</div><div class="card"><h2>'+t('dharT')+'</h2>'+(loans.length?loans.map(roLoan).join(''):'<div class="m">'+t('none')+'</div>')+'</div>'}
function openUser(uid){var u=DB.users.filter(function(x){return x.id===uid})[0];if(!u)return;UV={uid:uid};
  $('#uT').textContent=u.name||u.email;$('#uN').textContent=u.name||'';$('#uE').textContent=(u.email||'')+' · '+t('r_'+((u.email||'').toLowerCase()===SUPER?'super':(u.role||'member')));
  getDoc(doc(db,'budgets',uid)).then(function(s){var d=s.exists()?s.data():{};$('#uLimit').value=d.bud||'';$('#uAlert').value=d.alert||80;$('#uAlertOut').textContent=(d.alert||80)+'%';$('#uOn').setAttribute('aria-checked',String(d.on!==false));$('#uPLim').value=d.pawLim||'';$('#uPOn').setAttribute('aria-checked',String(!!d.pawOn));$('#uDLim').value=d.dharLim||'';$('#uDOn').setAttribute('aria-checked',String(!!d.dharOn))}).catch(errT);
  if(DB.role==='super'){$('#uData').innerHTML='<div class="m">'+t('loading')+'</div>';Promise.all([getDocs(collection(db,'users',uid,'entries')),getDocs(collection(db,'users',uid,'loans'))]).then(function(r){renderU(r[0].docs.map(mk),r[1].docs.map(mk))}).catch(errT)}
  else $('#uData').innerHTML='<div class="lock">'+t('superData')+'</div>';
  go('udata')}
function applyRole(){var a=isAdmin(),w=canWrite();
  $('#roleLine').textContent=t('r_'+DB.role);$('#roleLine2').textContent=DB.email+' · '+t('r_'+DB.role);
  $('#adminLink').style.display=a?'':'none';$('#alertsLink').style.display=w?'':'none';$('#cmEdit').style.display=w?'':'none';$('#cmNote').style.display=w?'none':'';
  $('#bLock').style.display=w?'none':'';$('#bSave').style.display=w?'':'none';['#bLimit','#bAlert','#bOn','#pOn','#pLim','#dOn','#dLim'].forEach(function(s){$(s).disabled=!w});
  $$('.wr').forEach(function(e){e.style.display=w?'':'none'});
  setNav()}
function addCat(ty,n){if(!canWrite()){toast(t('viewLock'));return false}n=n.trim();if(!n)return false;var l=DB.cats[ty];if(l.some(function(c){return c.n.toLowerCase()===n.toLowerCase()})){toast(n);return false}l.push({n:n,c:PAL[l.length%PAL.length]});fs.saveCats();toast(t('catAdded'));return true}
function closePop(){popEd=false;$('#ov').classList.remove('on')}
var popId=null,popEd=false,popK='ent';
function t24(s){var m=/(\d+):(\d+)\s*(AM|PM)/i.exec(s||'');if(!m)return '';var h=(+m[1])%12;if(m[3].toUpperCase()==='PM')h+=12;return pad(h)+':'+m[2]}
function t12(v){var p=v.split(':'),h=+p[0],ap=h>=12?'PM':'AM';h=h%12||12;return h+':'+p[1]+' '+ap}
function kv(a,b){return '<div class="kv"><span>'+a+'</span><span>'+b+'</span></div>'}
function openPop(id,k){popId=id;popK=k||'ent';popEd=false;renderPop();$('#ov').classList.add('on')}
function renderLoanPop(){var x=DB.loans.filter(function(l){return String(l.id)===String(popId)})[0];if(!x){closePop();return}
 var g=x.type==='get',w=canWrite(),sg=g?'+':'−',nl=t('note').replace(/ \(.*/,''),tm=x.at?new Date(x.at).toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'}):'';
 $('#pt').textContent=t(g?'pawna':'dhar')+(x.paid?' · '+t('paid'):'');$('#pedit').style.display=w?'':'none';$('#pedit').classList.toggle('act',popEd);
 if(popEd){
  $('#pa').style.display='flex';$('#pa').innerHTML='<span>'+sg+'৳</span><input class="ed big" id="laAmt" type="number" inputmode="decimal" value="'+x.amt+'" aria-label="Amount">';
  $('#pn').innerHTML='<input class="ed" id="laWho" type="text" maxlength="80" value="'+esc(x.who)+'" aria-label="Name">';
  $('#pb').innerHTML=kv(t('when'),'<input class="ed" id="laD" type="date" value="'+esc(x.d||ymd(new Date(x.at||Date.now())))+'">')+kv(nl,'<input class="ed" id="laNote" type="text" value="'+esc(x.note||'')+'" placeholder="—">');
  $('#pft').innerHTML='<button class="btn sm" id="lsave" style="flex:1">'+t('saveCh')+'</button><button class="btn sm d" id="pcancel" style="flex:1">'+t('cancel')+'</button>'}
 else{$('#pa').style.display='';$('#pa').textContent=sg+money(x.amt);$('#pn').textContent=x.who;
  $('#pb').innerHTML=kv(t('status'),x.paid?'✓ '+t('paid'):t('unpaid'))+kv(t('when'),(x.d?fmtD(x.d):'—')+(tm?' · '+tm:''))+kv(nl,x.note?esc(x.note):t('noNote'));
  $('#pft').innerHTML=(w?'<button class="btn sm d" id="ldel" style="flex:1">'+t('delete')+'</button><button class="btn sm" id="lpaid" style="flex:1;background:linear-gradient(145deg,#7B4DF5,#4B22C9);color:#fff;box-shadow:none">'+t(x.paid?'markUnpaid':'markPaid')+'</button>':'')+'<button class="btn sm" id="pclose" style="flex:1">'+t('close')+'</button>'}}
function renderPop(){if(popK==='loan')return renderLoanPop();var e=DB.ent.filter(function(x){return String(x.id)===String(popId)})[0];if(!e){closePop();return}
 var inc=e.type==='income',w=canWrite(),sg=inc?'+':'−',nl=t('note').replace(/ \(.*/,'');
 $('#pt').textContent=inc?t('income'):t('expense');$('#pedit').style.display=w?'':'none';$('#pedit').classList.toggle('act',popEd);
 if(popEd){var cs=DB.cats[e.type].map(function(c){return c.n});if(cs.indexOf(e.cat)<0)cs.unshift(e.cat);
  $('#pa').style.display='flex';$('#pa').innerHTML='<span>'+sg+'৳</span><input class="ed big" id="eaAmt" type="number" inputmode="decimal" value="'+e.amt+'" aria-label="Amount">';
  $('#pn').innerHTML='<input class="ed" id="eaName" type="text" value="'+esc(e.name)+'" aria-label="Name">';
  $('#pb').innerHTML=kv(t('cat'),'<select class="ed" id="eaCat" aria-label="Category">'+cs.map(function(n){return '<option'+(n===e.cat?' selected':'')+'>'+esc(n)+'</option>'}).join('')+'</select>')+kv(t('where'),'<input class="ed" id="eaPlc" type="text" value="'+esc(e.place)+'">')+kv(t('when'),'<div style="display:flex;flex-direction:column;gap:6px;align-items:flex-end"><input class="ed" id="eaD" type="date" value="'+e.d+'"><input class="ed" id="eaT" type="time" value="'+t24(e.t)+'"></div>')+kv(nl,'<input class="ed" id="eaNote" type="text" value="'+esc(e.note)+'" placeholder="—">')+kv(t('by'),esc(e.by));
  $('#pft').innerHTML='<button class="btn sm" id="psave" style="flex:1">'+t('saveCh')+'</button><button class="btn sm d" id="pcancel" style="flex:1">'+t('cancel')+'</button>'}
 else{$('#pa').style.display='';$('#pa').textContent=sg+money(e.amt);$('#pn').textContent=e.name;
  $('#pb').innerHTML=kv(t('cat'),'<i style="display:inline-block;width:10px;height:10px;border-radius:50%;background:'+catColor(e.type,e.cat)+';margin-right:6px"></i>'+esc(e.cat))+kv(t('where'),esc(e.place))+kv(t('when'),fmtD(e.d)+' · '+esc(e.t))+kv(nl,e.note?esc(e.note):t('noNote'))+kv(t('by'),esc(e.by));
  $('#pft').innerHTML=(w?'<button class="btn sm d" id="pdel" data-id="'+e.id+'" style="flex:1">'+t('delete')+'</button>':'')+'<button class="btn sm" id="pclose" style="flex:1">'+t('close')+'</button>'}}
function saveEntry(){if(!canWrite())return;var a=parseFloat($('#eAmt').value);if(!a||a<=0){toast(t('amtErr'));$('#eAmt').focus();return}
  var before=stats().exp,c=selCat[kind]||'Other',e={type:kind,name:($('#eName').value.trim()||c).slice(0,120),place:($('#ePlc').value.trim()||'—').slice(0,160),cat:c,amt:a,note:$('#eNote').value.trim().slice(0,300),d:TODAY,t:new Date().toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'}),by:DB.name,at:Date.now()};
  if(kind==='expense'&&DB.on&&DB.bud){var bp=before/DB.bud*100,ap=(before+a)/DB.bud*100;if(bp<DB.alert&&ap>=DB.alert)addNotif('budget','Budget alert','You’ve used '+Math.round(ap)+'% of your monthly budget','home')}
  fs.add('entries',e);DB.sel=TODAY;['#eAmt','#eName','#ePlc','#eNote'].forEach(function(x){$(x).value=''});$('#ncRow').classList.remove('on');toast(t('saved'));go('home')}
document.addEventListener('click',function(ev){
  var o=ev.target;if(o.id==='ov'){closePop();return}
  var lr=o.closest('[data-lopen]');if(lr&&!o.closest('button'))return openPop(lr.getAttribute('data-lopen'),'loan');
  var b=o.closest('button');if(!b||b.disabled)return;
  if(b.hasAttribute('data-am')){amode=b.getAttribute('data-am');return setAmode()}
  if(b.id==='aGo')return;
  if(b.id==='pwEye'){var pi=$('#pw'),sh=pi.type==='password';pi.type=sh?'text':'password';b.querySelector('use').setAttribute('href',sh?'#eyeoff':'#eye');b.setAttribute('aria-label',sh?'Hide password':'Show password');return}
  if(b.id==='aForgot')return doForgot();
  if(b.id==='vGo')return doVerified();
  if(b.id==='vResend')return ensureCode(true);
  if(b.id==='vOut'||b.getAttribute('data-go')==='login'){fs.logout();return}
  if(b.hasAttribute('data-uid'))return openUser(b.getAttribute('data-uid'));
  if(b.id==='uSave'){if(!isAdmin()||!UV)return toast(t('adminOnly'));var uv={bud:parseInt($('#uLimit').value,10)||0,alert:+$('#uAlert').value,on:$('#uOn').getAttribute('aria-checked')==='true',pawLim:parseInt($('#uPLim').value,10)||0,pawOn:$('#uPOn').getAttribute('aria-checked')==='true',dharLim:parseInt($('#uDLim').value,10)||0,dharOn:$('#uDOn').getAttribute('aria-checked')==='true'};fs.saveBudget(uv,UV.uid);addDoc(collection(db,'users',UV.uid,'notifs'),{ty:'budget',txt:'Budget updated',sub:'Your admin updated your budget and alerts',go:'home',read:false,at:Date.now()}).catch(function(){});return toast(t('budSaved'))}
  if(b.id==='pdfBtn')return makePdf();
  if(b.hasAttribute('data-theme'))return setTheme();
  if(b.hasAttribute('data-dgo')){dtab=b.getAttribute('data-dgo');loansUI();return go('dharbaki')}
  if(b.hasAttribute('data-go'))return go(b.getAttribute('data-go'));
  if(b.hasAttribute('data-toast'))return toast(b.getAttribute('data-toast'));
  if(b.hasAttribute('data-open'))return openPop(b.getAttribute('data-open'));
  if(b.hasAttribute('data-day')){DB.sel=b.getAttribute('data-day');return render()}
  if(b.hasAttribute('data-nid')){var n=DB.notifs.filter(function(x){return String(x.id)===b.getAttribute('data-nid')})[0];if(n){n.read=true;fs.upd('notifs',n.id,{read:true});notif();if(n.go&&n.go!=='home')go(n.go)}return}
  if(b.id==='markAll'){return fs.markAll()}
  if(b.hasAttribute('data-k')){kind=b.getAttribute('data-k');$$('#kind button').forEach(function(x){x.classList.toggle('on',x===b)});$('#cur').className=kind==='income'?'up':'dn';$('#ncRow').classList.remove('on');return addCats()}
  if(b.hasAttribute('data-cat')){selCat[kind]=b.getAttribute('data-cat');return addCats()}
  if(b.hasAttribute('data-newcat')){$('#ncRow').classList.toggle('on');$('#ncName').focus();return}
  if(b.id==='ncAdd'){var nm=$('#ncName').value;if(addCat(kind,nm)){selCat[kind]=nm.trim();$('#ncName').value='';$('#ncRow').classList.remove('on');render()}return}
  if(b.hasAttribute('data-pl')){$('#ePlc').value=b.getAttribute('data-pl');return}
  if(b.hasAttribute('data-cmk')){cmk=b.getAttribute('data-cmk');return cats()}
  if(b.id==='cmAdd'){if(addCat(cmk,$('#cmName').value)){$('#cmName').value='';render()}return}
  if(b.hasAttribute('data-del')){if(!canWrite())return toast(t('viewLock'));var l=DB.cats[cmk];if(l.length<=1)return toast(t('lastOne'));DB.cats[cmk]=l.filter(function(c){return c.n!==b.getAttribute('data-del')});fs.saveCats();toast(t('deleted'));return render()}
  if(b.hasAttribute('data-lang')){DB.lang=b.getAttribute('data-lang');persist();applyLang();return render()}

  if(b.hasAttribute('data-f')){hf=b.getAttribute('data-f');$$('#flt button').forEach(function(x){x.classList.toggle('on',x===b)});return filt()}
  if(b.hasAttribute('data-hist')){hf=dtab;$$('#flt button').forEach(function(x){x.classList.toggle('on',x.getAttribute('data-f')===hf)});filt();return go('history')}
  if(b.hasAttribute('data-d')){dtab=b.getAttribute('data-d');return loansUI()}
  if(b.hasAttribute('data-paid')){var lo=DB.loans.filter(function(x){return String(x.id)===b.getAttribute('data-paid')})[0];if(lo){lo.paid=!lo.paid;fs.upd('loans',lo.id,{paid:lo.paid});render()}return}
  if(b.id==='lAdd'){var w=$('#lWho').value.trim(),am=parseFloat($('#lAmt').value);if(!w||!am||am<=0){return toast(t('amtErr'))}var nl={type:dtab,who:w.slice(0,80),amt:am,note:$('#lNote').value.trim().slice(0,200),paid:false,d:TODAY,at:Date.now()};DB.loans.push(nl);loanAlert(am);DB.loans.pop();fs.add('loans',nl);addNotif('loan',dtab==='get'?'Pawna added':'Dhar added',w+' · '+money(am),'dharbaki');['#lWho','#lAmt','#lNote'].forEach(function(x){$(x).value=''});return toast(t('saved'))}
  if(b.id==='lpaid'){var l1=DB.loans.filter(function(x){return String(x.id)===String(popId)})[0];if(l1){l1.paid=!l1.paid;fs.upd('loans',l1.id,{paid:l1.paid});render();renderPop()}return}
  if(b.id==='ldel'){var l2=String(popId);DB.loans=DB.loans.filter(function(x){return String(x.id)!==l2});fs.del('loans',l2);closePop();render();return toast(t('deleted'))}
  if(b.id==='lsave'){var le=DB.loans.filter(function(x){return String(x.id)===String(popId)})[0],la=parseFloat($('#laAmt').value),lw=$('#laWho').value.trim();if(!le)return;if(!la||la<=0||!lw){toast(t('amtErr'));return}var lc={amt:la,who:lw.slice(0,80),d:$('#laD').value||le.d,note:$('#laNote').value.trim().slice(0,200)};Object.assign(le,lc);fs.upd('loans',le.id,lc);popEd=false;render();renderPop();return toast(t('updated'))}
  if(b.id==='pedit'){popEd=!popEd;return renderPop()}
  if(b.id==='pcancel'){popEd=false;return renderPop()}
  if(b.id==='psave'){var pe=DB.ent.filter(function(x){return String(x.id)===String(popId)})[0],pa=parseFloat($('#eaAmt').value);if(!pe)return;if(!pa||pa<=0){toast(t('amtErr'));return}var ch={amt:pa,name:$('#eaName').value.trim().slice(0,120)||pe.cat,cat:$('#eaCat').value,place:($('#eaPlc').value.trim()||'—').slice(0,160),d:$('#eaD').value||pe.d,t:$('#eaT').value?t12($('#eaT').value):pe.t,note:$('#eaNote').value.trim().slice(0,300)};Object.assign(pe,ch);fs.upd('entries',pe.id,ch);popEd=false;render();renderPop();return toast(t('updated'))}
  if(b.id==='px'||b.id==='pclose')return closePop();
  if(o.closest('#pdel')){var id=$('#pdel').getAttribute('data-id');DB.ent=DB.ent.filter(function(e){return String(e.id)!==id});fs.del('entries',id);closePop();render();return toast(t('deleted'))}
  if(o.closest('#save'))return saveEntry();
  if(b.id==='bSave'){if(!canWrite())return toast(t('viewLock'));fs.saveBudget({bud:parseInt($('#bLimit').value,10)||0,alert:+$('#bAlert').value,on:$('#bOn').getAttribute('aria-checked')==='true',pawLim:parseInt($('#pLim').value,10)||0,pawOn:$('#pOn').getAttribute('aria-checked')==='true',dharLim:parseInt($('#dLim').value,10)||0,dharOn:$('#dOn').getAttribute('aria-checked')==='true'});return toast(t('budSaved'))}
  if(o.closest('#pick'))return $('#pf').click();
  if(b.classList.contains('sw')&&!b.disabled)return b.setAttribute('aria-checked',String(b.getAttribute('aria-checked')!=='true'));
});
document.addEventListener('change',function(e){var s=e.target;if(s.hasAttribute&&s.hasAttribute('data-role')){var uid=s.getAttribute('data-role');if(DB.role!=='super'){toast(t('superOnly'));return render()}updateDoc(doc(db,'users',uid),{role:s.value}).then(function(){addDoc(collection(db,'users',uid,'notifs'),{ty:'admin',txt:'Your role is now '+t('r_'+s.value),sub:'Changed by '+DB.name,go:'home',read:false,at:Date.now()}).catch(function(){});toast(t('roleSet'))}).catch(function(){toast(t('superOnly'));render()})}});
$('#pf').addEventListener('change',function(e){var f=e.target.files[0];if(!f)return;var r=new FileReader();r.onload=function(){var img=new Image();img.onload=function(){var c=document.createElement('canvas');c.width=c.height=160;var x=c.getContext('2d'),m=Math.min(img.width,img.height);x.drawImage(img,(img.width-m)/2,(img.height-m)/2,m,m,0,0,160,160);var d=c.toDataURL('image/jpeg',.8);DB.photo=d;setAv();updateDoc(doc(db,'users',U.uid),{photo:d}).then(function(){toast(t('saved'))}).catch(errT)};img.src=r.result};r.readAsDataURL(f)});
$('#q').addEventListener('input',filt);
$('#bAlert').addEventListener('input',function(){$('#bAlertOut').textContent=this.value+'%'});
document.addEventListener('keydown',function(e){if(e.key==='Escape')closePop()});

/* ================= Firebase layer ================= */
var SUPER='rahinul135@gmail.com';
var CFG={apiKey:"AIzaSyCRjMH4ntsXM1tzsTOCRvmUlGREKqydPmU",authDomain:"daily-expense-management-1b6c5.firebaseapp.com",projectId:"daily-expense-management-1b6c5",storageBucket:"daily-expense-management-1b6c5.firebasestorage.app",messagingSenderId:"231045330036",appId:"1:231045330036:web:80cb4dcad5a251f9e9cd21"};
var fbApp=initializeApp(CFG),auth=getAuth(fbApp),db=initializeFirestore(fbApp,{localCache:persistentLocalCache({tabManager:persistentSingleTabManager({})})});
var DEFCATS={expense:[{n:'Food',c:PAL[1]},{n:'Transport',c:PAL[4]},{n:'Bills',c:PAL[0]},{n:'Shopping',c:PAL[2]},{n:'Health',c:PAL[3]},{n:'Family',c:PAL[7]}],income:[{n:'Salary',c:PAL[7]},{n:'Business',c:PAL[4]},{n:'Gift',c:PAL[2]},{n:'Other',c:PAL[3]}]};
var U=null,subs=[],usersSub=null,subbed=false,roleDoc='member',pendingName='',sched=0,amode='in',UV=null,okVer=false,profMade=false,VC=null,vcLast=0;
function lsGet(k){try{return localStorage.getItem(k)}catch(e){return null}}
function defaults(){return {ent:[],loans:[],notifs:[],users:[],cats:JSON.parse(JSON.stringify(DEFCATS)),bud:0,alert:80,on:true,pawLim:0,pawOn:false,dharLim:0,dharOn:false,lang:lsGet('lang')||'en',sel:TODAY,role:'member',name:'',email:'',photo:'',uid:''}}
function errT(e){toast(e&&e.code==='permission-denied'?t('adminOnly'):t('errNet'))}
function fmtTs(ms){if(!ms)return '';var d=new Date(ms),k=ymd(d);return (k===TODAY?t('today'):fmtD(k))+' · '+d.toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'})}
function labels(){$('#mlab').textContent=NOW.toLocaleString('en-US',{month:'short',year:'numeric'});$('#aDate').textContent=fmtD(TODAY);$('#rLab').textContent=new Date(+RM.slice(0,4),+RM.slice(5,7)-1,1).toLocaleString('en-US',{month:'long',year:'numeric'})+' · '+(DB.name||'');$('#uName').textContent=DB.name;$('#uName2').textContent=DB.name;$('#rMon').value=RM}
function setAv(){$$('.av').forEach(function(a){if(DB.photo){a.style.backgroundImage='url('+DB.photo+')';a.textContent=''}else{a.style.backgroundImage='';a.textContent=(DB.name||'?').charAt(0).toUpperCase()}})}
function fillBud(){$('#bLimit').value=DB.bud||'';$('#bAlert').value=DB.alert;$('#bAlertOut').textContent=DB.alert+'%';$('#bOn').setAttribute('aria-checked',String(DB.on));$('#pLim').value=DB.pawLim||'';$('#pOn').setAttribute('aria-checked',String(DB.pawOn));$('#dLim').value=DB.dharLim||'';$('#dOn').setAttribute('aria-checked',String(DB.dharOn))}
function schedule(){if(!sched){sched=requestAnimationFrame(function(){sched=0;render()})}}
var fs={
 col:function(n){return collection(db,'users',U.uid,n)},
 add:function(n,o){addDoc(fs.col(n),o).catch(errT)},
 upd:function(n,id,o){updateDoc(doc(db,'users',U.uid,n,id),o).catch(errT)},
 del:function(n,id){deleteDoc(doc(db,'users',U.uid,n,id)).catch(errT)},
 markAll:function(){var b=writeBatch(db),c=0;DB.notifs.forEach(function(n){if(!n.read){n.read=true;b.update(doc(db,'users',U.uid,'notifs',n.id),{read:true});c++}});notif();if(c)b.commit().catch(errT)},
 saveCats:function(){setDoc(doc(db,'settings','app'),{cats:DB.cats}).catch(errT)},
 saveBudget:function(o,uid){return setDoc(doc(db,'budgets',uid||U.uid),o,{merge:true}).catch(errT)},
 logout:function(){signOut(auth)}
};
function calcRole(){var sup=U&&U.email&&U.email.toLowerCase()===SUPER&&U.emailVerified;DB.role=sup?'super':(roleDoc||'member')}
function cleanup(){subs.forEach(function(f){f()});subs=[];if(usersSub){usersSub();usersSub=null}}
function syncUsersSub(){var need=isAdmin();if(need&&!usersSub){usersSub=onSnapshot(collection(db,'users'),function(s){DB.users=s.docs.map(mk);schedule()},function(){})}else if(!need&&usersSub){usersSub();usersSub=null;DB.users=[]}}
function createProfile(){if(profMade)return;profMade=true;var b=writeBatch(db),uref=doc(db,'users',U.uid),sup=(U.email||'').toLowerCase()===SUPER&&U.emailVerified,now=Date.now(),tm=new Date().toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'});
 b.set(uref,{email:U.email,name:DB.name,role:sup?'super':'member',createdAt:now,demo:true});
 [['expense','Demo expense','Example shop','Food',200],['income','Demo income','Example','Salary',1000]].forEach(function(x,i){b.set(doc(collection(db,'users',U.uid,'entries')),{type:x[0],name:x[1],place:x[2],cat:x[3],amt:x[4],note:'Sample entry, you can edit or delete it',d:TODAY,t:tm,by:DB.name,at:now+i})});
  b.commit().catch(function(e){profMade=false;errT(e)})}
function subscribeData(){var u=U.uid;
 subs.push(onSnapshot(collection(db,'users',u,'entries'),function(s){DB.ent=s.docs.map(mk);schedule()},errT));
 subs.push(onSnapshot(collection(db,'users',u,'loans'),function(s){DB.loans=s.docs.map(mk);schedule()},errT));
 subs.push(onSnapshot(collection(db,'users',u,'notifs'),function(s){DB.notifs=s.docs.map(mk).sort(function(a,b){return (b.at||0)-(a.at||0)});schedule()},errT));
 subs.push(onSnapshot(doc(db,'budgets',u),function(s){var d=s.exists()?s.data():{};DB.bud=d.bud||0;DB.alert=d.alert||80;DB.on=d.on!==false;DB.pawLim=d.pawLim||0;DB.pawOn=!!d.pawOn;DB.dharLim=d.dharLim||0;DB.dharOn=!!d.dharOn;fillBud();schedule()},errT));
 subs.push(onSnapshot(doc(db,'settings','app'),function(s){var c=s.exists()&&s.data().cats;DB.cats=c||JSON.parse(JSON.stringify(DEFCATS));schedule()},errT))}
function startSession(){
 DB=defaults();DB.uid=U.uid;DB.email=U.email||'';DB.name=pendingName||U.displayName||DB.email.split('@')[0];subbed=false;roleDoc='member';okVer=false;profMade=false;
 var uref=doc(db,'users',U.uid);
 subs.push(onSnapshot(uref,function(snap){
  if(!snap.exists()){if(!snap.metadata.fromCache){if(U.emailVerified||okVer)createProfile();else showVerify()}return}
  var d=snap.data();roleDoc=d.role||'member';DB.name=d.name||DB.name;DB.photo=d.photo||'';calcRole();
  if((U.email||'').toLowerCase()===SUPER&&U.emailVerified&&d.role!=='super')updateDoc(uref,{role:'super'}).catch(function(){});
  if(!subbed){subbed=true;subscribeData()}
  syncUsersSub();if(cur==='login'||cur==='verify'||cur==='splash')go('home');schedule()},errT))}
function aerr(m){$('#aErr').textContent=m||'';$('#aErr').classList.toggle('on',!!m);return false}
function authMsg(e){var c=(e&&e.code)||'';if(c==='auth/invalid-credential'||c==='auth/wrong-password'||c==='auth/user-not-found')return t('errBad');if(c==='auth/email-already-in-use')return t('errUsed');if(c==='auth/weak-password')return t('errWeak');if(c==='auth/invalid-email')return t('errEmail');if(c==='auth/network-request-failed')return t('errNet');if(c==='auth/too-many-requests')return t('errMany');return c||t('errNet')}
function setAmode(){var up=amode==='up';$$('#aseg button').forEach(function(b){b.classList.toggle('on',b.getAttribute('data-am')===amode)});$('#aName').style.display=up?'':'none';$('#nmL').style.display=up?'':'none';$('#aGo').textContent=t(up?'createAcc':'signIn');$('#pw').setAttribute('autocomplete',up?'new-password':'current-password');$('#aForgot').style.display=up?'none':'';aerr('')}
function doAuth(){var em=$('#em').value.trim(),pw=$('#pw').value,nm=$('#aName').value.trim();aerr('');
 if(!/^\S+@\S+\.\S+$/.test(em))return aerr(t('errEmail'));
 if(amode==='up'&&!nm)return aerr(t('errName'));
 if(pw.length<6)return aerr(t('errWeak'));
 $('#aGo').disabled=true;
 var p;if(amode==='up'){pendingName=nm;p=createUserWithEmailAndPassword(auth,em,pw).then(function(c){updateProfile(c.user,{displayName:nm}).catch(function(){});if(em.toLowerCase()===SUPER)sendEmailVerification(c.user).catch(function(){});ensureCode(false)})}else{p=signInWithEmailAndPassword(auth,em,pw)}
 p.catch(function(e){aerr(authMsg(e))}).then(function(){$('#aGo').disabled=false})}
function doForgot(){var em=$('#em').value.trim();if(!/^\S+@\S+\.\S+$/.test(em))return aerr(t('errEmail'));sendPasswordResetEmail(auth,em).then(function(){aerr('');toast(t('resetSent'))}).catch(function(e){aerr(authMsg(e))})}
/* ---- email code verification (EmailJS sends the mail) ---- */
function vcLoad(){if(VC)return VC;try{VC=JSON.parse(lsGet('vc')||'null')}catch(e){VC=null}return VC}
function vcSave(o){VC=o;try{if(o)localStorage.setItem('vc',JSON.stringify(o));else localStorage.removeItem('vc')}catch(e){}}
function vcOk(){var c=vcLoad();return !!(c&&U&&c.em===(U.email||'').toLowerCase()&&Date.now()<c.exp&&c.tries<5)}
function newCode(){var a=new Uint32Array(1);crypto.getRandomValues(a);return String(100000+a[0]%900000)}
function ensureCode(force){if(!U)return;if(!force&&vcOk())return;
 if(!EJS.service||!EJS.template||!EJS.key||/^YOUR_/.test(EJS.service+EJS.template+EJS.key))return toast(t('verNoSvc'));
 if(force&&Date.now()-vcLast<30000)return toast(t('verWait'));
 var code=newCode(),em=U.email||'';vcSave({em:em.toLowerCase(),code:code,exp:Date.now()+10*60000,tries:0});vcLast=Date.now();
 fetch('https://api.emailjs.com/api/v1.0/email/send',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({service_id:EJS.service,template_id:EJS.template,user_id:EJS.key,template_params:{to_email:em,to_name:DB.name||'',code:code,app_name:'Daily Expense'}})})
  .then(function(r){if(!r.ok)throw new Error('send');toast(t('verSent'))}).catch(function(){vcSave(null);vcLast=0;toast(t('errNet'))})}
function showVerify(){$('#vEm').textContent=(U&&U.email)||'';go('verify');ensureCode(false)}
function doVerified(){if(!U)return;var c=$('#vCode').value.replace(/\D/g,''),s=vcLoad();
 if(!vcOk()||c!==s.code){if(vcOk()&&c.length===6){s.tries++;vcSave(s)}return toast(t('verNot'))}
 vcSave(null);okVer=true;$('#vCode').value='';createProfile()}
function resetLogin(){var p=$('#pw');p.value='';p.type='password';var u=$('#pwEye use');if(u)u.setAttribute('href','#eye');$('#pwEye').setAttribute('aria-label','Show password');$('#em').value=lsGet('lastEmail')||'';aerr('')}
async function makePdf(){toast(t('pdfBusy'));
 try{
  var el=$('#pdfSrc'),list=DB.ent.filter(function(e){return (e.d||'').slice(0,7)===RM}).sort(function(a,b){return a.d.localeCompare(b.d)||(a.at||0)-(b.at||0)}),inc=0,exp=0,by={};
  list.forEach(function(e){if(e.type==='income')inc+=e.amt;else{exp+=e.amt;by[e.cat]=(by[e.cat]||0)+e.amt}});
  var ml=new Date(+RM.slice(0,4),+RM.slice(5,7)-1,1).toLocaleString('en-US',{month:'long',year:'numeric'});
  var th='style="text-align:left;padding:8px 6px;border-bottom:2px solid #6C3BEF;font-size:13px"',td='style="padding:7px 6px;border-bottom:1px solid #E5E0F0;font-size:13px;vertical-align:top"',tr='style="text-align:right;padding:7px 6px;border-bottom:1px solid #E5E0F0;font-size:13px;vertical-align:top;white-space:nowrap"';
  var rows=list.map(function(e){var i2=e.type==='income';return '<tr><td '+td+'>'+esc(fmtD(e.d))+'</td><td '+td+'>'+esc(e.name)+(e.note?'<br><span style="color:#666;font-size:11px">'+esc(e.note)+'</span>':'')+'</td><td '+td+'>'+esc(e.place)+'</td><td '+td+'>'+esc(e.cat)+'</td><td '+tr+'>'+(i2?'+':'-')+money(e.amt)+'</td></tr>'}).join('');
  var cats=Object.keys(by).sort(function(a,b){return by[b]-by[a]}).map(function(k){return '<tr><td '+td+'>'+esc(k)+'</td><td '+tr+'>'+money(by[k])+'</td></tr>'}).join('');
  el.innerHTML='<div style="font-size:26px;font-weight:800;color:#4B22C9">Expense report</div><div style="color:#555;margin:4px 0 18px">'+esc(ml)+' · '+esc(DB.name)+' · '+esc(DB.email)+'</div>'
   +'<table style="width:100%;border-collapse:collapse;margin-bottom:18px"><tr><td '+td+'>Income</td><td '+tr+'>'+money(inc)+'</td></tr><tr><td '+td+'>Expense</td><td '+tr+'>'+money(exp)+'</td></tr><tr><td '+td+'><b>Balance</b></td><td '+tr+'><b>'+money(inc-exp)+'</b></td></tr></table>'
   +(cats?'<div style="font-weight:800;margin:6px 0">By category</div><table style="width:100%;border-collapse:collapse;margin-bottom:18px">'+cats+'</table>':'')
   +'<div style="font-weight:800;margin:6px 0">All entries</div><table style="width:100%;border-collapse:collapse"><tr><th '+th+'>Date</th><th '+th+'>Name</th><th '+th+'>Where</th><th '+th+'>Category</th><th '+th+' style="text-align:right">Amount</th></tr>'+rows+'</table>';
  var cv=await html2canvas(el,{scale:2,backgroundColor:'#ffffff'}),pdf=new jsPDF('p','mm','a4'),pw=210,ph=297,pageH=Math.floor(cv.width*ph/pw),y=0,first=true;
  while(y<cv.height){var hh=Math.min(pageH,cv.height-y),c=document.createElement('canvas');c.width=cv.width;c.height=hh;c.getContext('2d').drawImage(cv,0,y,cv.width,hh,0,0,cv.width,hh);if(!first)pdf.addPage();pdf.addImage(c.toDataURL('image/jpeg',0.92),'JPEG',0,0,pw,hh*pw/cv.width);y+=hh;first=false}
  var name='Expense-'+RM+'.pdf';
  if(Capacitor.isNativePlatform()){var b64=pdf.output('datauristring').split(',')[1],f=await Filesystem.writeFile({path:name,data:b64,directory:Directory.Cache});await Share.share({title:name,url:f.uri,dialogTitle:name})}else{pdf.save(name)}
  el.innerHTML=''
 }catch(e){$('#pdfSrc').innerHTML='';toast(t('pdfErr'))}}

/* ---------- start ---------- */
DB=defaults();
try{var th0=lsGet('theme');if(th0){document.documentElement.setAttribute('data-theme',th0);$$('[role=switch][data-theme]').forEach(function(s){s.setAttribute('aria-checked',String(th0==='dark'))})}}catch(e){}
$('#rMon').addEventListener('change',function(){RM=this.value||MK;labels();reports()});
$('#uAlert').addEventListener('input',function(){$('#uAlertOut').textContent=this.value+'%'});
setAmode();applyLang();render();go('splash');fillBud();$('#em').value=lsGet('lastEmail')||'';
$('#aForm').addEventListener('submit',function(e){e.preventDefault();doAuth()});
$('#vCode').addEventListener('input',function(){this.value=this.value.replace(/\D/g,'').slice(0,6)});
if(Capacitor.isNativePlatform()){CapApp.addListener('backButton',function(){if($('#ov').classList.contains('on'))return closePop();if(cur==='home'||cur==='login'||cur==='verify'||cur==='splash')return CapApp.exitApp();go(cur==='udata'?'admin':(PARENT[cur]||'home'))})}
onAuthStateChanged(auth,function(u){cleanup();U=u;if(!u){DB=defaults();render();resetLogin();go('login');return}
 try{localStorage.setItem('lastEmail',u.email||'')}catch(e){}
 startSession()});
