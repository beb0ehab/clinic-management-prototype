/* كَشْف — بروتوتايب نظام العيادة. كل البيانات وهمية ومفيش حفظ. */
const P={home:'<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>',cal:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',users:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.6-3.600 3.200-5.500 6.500-5.500s5.900 1.900 6.500 5.500M16 4.600a3.500 3.500 0 010 6.800M18.500 14.800c1.700.8 2.700 2.500 3 5.200"/>',wallet:'<rect x="3" y="6" width="18" height="14" rx="2"/><path d="M3 10h18M15 15h3"/>',chart:'<path d="M4 20V10M10 20V4M16 20v-7M21 20H3"/>',shield:'<path d="M12 3l8 3v6c0 4.500-3.200 7.800-8 9-4.800-1.200-8-4.500-8-9V6z"/><path d="M9 12l2 2 4-4"/>',star:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 9h18M7 15h4"/>',build:'<path d="M5 21V5a2 2 0 012-2h7a2 2 0 012 2v16M16 9h2a1 1 0 011 1v11M3 21h18M9 7h3M9 11h3M9 15h3"/>',lock:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/>',plus:'<path d="M12 5v14M5 12h14"/>',search:'<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.500-3.500"/>',menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',x:'<path d="M6 6l12 12M18 6L6 18"/>',back:'<path d="M9 6l6 6-6 6"/>'};
const ic=n=>`<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n]}</svg>`;
const $=s=>document.querySelector(s), N=n=>`<span class="num">${Number(n).toLocaleString('en-US')}</span>`;

/* ===== الأطباء والحسابات ===== */
const DOCS={
  d1:{name:'د. كريم الشاذلي',spec:'أطفال',fee:350,room:'غرفة 1'},
  d2:{name:'د. سلمى فؤاد',spec:'باطنة',fee:300,room:'غرفة 2'},
  d3:{name:'د. طارق منصور',spec:'جلدية',fee:400,room:'غرفة 3'}
};
const ACC={
  owner:{role:'owner',name:'د. كريم الشاذلي',title:'صاحب المركز · طبيب أطفال',chip:'صاحب المركز',doc:'d1'},
  d2:{role:'doctor',name:'د. سلمى فؤاد',title:'طبيبة باطنة',chip:'د. سلمى (طبيبة)',doc:'d2'},
  d3:{role:'doctor',name:'د. طارق منصور',title:'طبيب جلدية',chip:'د. طارق (طبيب)',doc:'d3'},
  reception:{role:'reception',name:'منة عادل',title:'موظفة استقبال',chip:'الاستقبال'},
  accountant:{role:'accountant',name:'هاني رزق',title:'محاسب',chip:'المحاسب'},
  platform:{role:'platform',name:'إدارة كَشْف',title:'مالك المنصة',chip:'إدارة المنصة (البائع)'}
};
const RL={owner:'صاحب المركز',doctor:'الطبيب',reception:'الاستقبال',accountant:'المحاسب'};
const MODS=[
  {id:'today',label:'اليوم',icon:'home',desc:'ملخص اليوم والدور الحالي'},
  {id:'queue',label:'المواعيد والحجز',icon:'cal',desc:'الحجز وتسجيل الوصول وترتيب الدور'},
  {id:'patients',label:'المرضى',icon:'users',desc:'البيانات الأساسية وأرقام التواصل'},
  {id:'clinical',label:'الملف الطبي',icon:'lock',desc:'التاريخ المرضي والزيارات والتحاليل والأدوية',nav:false},
  {id:'billing',label:'الحسابات والفواتير',icon:'wallet',desc:'الفواتير والتحصيل والمستحقات'},
  {id:'reports',label:'التقارير',icon:'chart',desc:'الدخل وأعداد الزيارات لكل طبيب'},
  {id:'team',label:'الفريق والصلاحيات',icon:'shield',desc:'حسابات الأطباء والموظفين وصلاحياتهم'},
  {id:'plan',label:'الاشتراك',icon:'star',desc:'الباقة والتجديد والفواتير'}
];
const perms={
  owner:{today:1,queue:1,patients:1,clinical:1,billing:1,reports:1,team:1,plan:1},
  doctor:{today:1,queue:1,patients:1,clinical:1},
  reception:{today:1,queue:1,patients:1,billing:1},
  accountant:{today:1,billing:1,reports:1}
};
const ST={book:['محجوز','c-book'],wait:['في الانتظار','c-wait'],in:['في الكشف','c-in'],done:['انتهى','c-done']};
const SV={'متابعة':150,'استشارة':200,'تحليل سكر':80,'رسم قلب':250,'جلسة ليزر':600,'تطعيم':500};
const fee=(t,d)=>t==='كشف'?DOCS[d].fee:(SV[t]||200);
const SLOTS=[];for(let h=10;h<14;h++)for(const m of ['00','20','40'])SLOTS.push(`${h}:${m}`);
const DAYS=['اليوم','بكرة'];
const ALG={'بنسلين':['بنسلين','أموكسيسيلين','أوجمنتين'],'أسبرين':['أسبرين','أسبوسيد'],'إيبوبروفين':['بروفين']};

/* ===== المرضى ===== */
const base=o=>Object.assign({chronic:[],allergy:[],blood:'غير مسجّلة',family:'لا يوجد',surg:'لا يوجد',meds:[],visits:[],labs:[],rads:[],notes:[],rx:[]},o);
let patients=[
  base({id:1,name:'ياسين محمود',age:'6 سنين',phone:'0100 245 7781',doc:'d1',last:'اليوم',chronic:['ربو شعبي'],allergy:['بنسلين'],blood:'O+',family:'الأب عنده ربو',
    meds:[{d:'بخاخ فنتولين',dose:'بختين عند اللزوم',dur:'مستمر',since:'مارس 2025'}],
    visits:[{date:'اليوم',doc:'d1',cc:'كحة وحرارة من يومين',dx:'التهاب في الحلق',vit:'حرارة 38.5 · وزن 21 كجم',note:'مضاد حيوي بديل للبنسلين 5 أيام، ومتابعة بعد أسبوع.'},
      {date:'28 سبتمبر 2026',doc:'d1',cc:'متابعة الربو',dx:'ربو مستقر',vit:'تشبع الأكسجين 98% · وزن 20.5 كجم',note:'نفس جرعة البخاخ. تحليل IgE.'},
      {date:'3 يوليو 2026',doc:'d1',cc:'ترجيع وإسهال',dx:'نزلة معوية',vit:'حرارة 37.8',note:'محلول جفاف وراحة يومين.'}],
    labs:[{date:'28 سبتمبر',name:'صورة دم كاملة',res:'هيموجلوبين 11.8',ref:'11.5 – 15.5',flag:0},{date:'28 سبتمبر',name:'IgE الكلي',res:'240',ref:'أقل من 90',flag:1}],
    rads:[{date:'28 سبتمبر',name:'أشعة صدر',rep:'لا توجد ارتشاحات. انتفاخ بسيط بالرئتين.'}],
    notes:[{date:'28 سبتمبر',by:'d1',t:'الأم محتاجة تدريب على استخدام البخاخ بالقمع.'}]}),
  base({id:2,name:'ملك إبراهيم',age:'3 سنين',phone:'0122 908 1140',doc:'d1',last:'اليوم'}),
  base({id:3,name:'هدى عبد الرحمن',age:'52 سنة',phone:'0111 630 2295',doc:'d2',last:'اليوم',chronic:['سكر نوع 2','ضغط مرتفع'],allergy:['أسبرين'],blood:'A+',family:'الأم مريضة سكر',surg:'استئصال مرارة 2019',
    meds:[{d:'ميتفورمين 1000',dose:'قرص مرتين يوميًا بعد الأكل',dur:'مستمر',since:'2021'},{d:'كونكور 5',dose:'قرص الصبح',dur:'مستمر',since:'2023'}],
    visits:[{date:'اليوم',doc:'d2',cc:'متابعة السكر، وعطش زيادة',dx:'سكر غير منتظم',vit:'ضغط 145/90 · سكر صائم 168 · وزن 84 كجم',note:'زيادة جرعة الميتفورمين، وإعادة السكر التراكمي بعد 3 شهور.'},
      {date:'12 أغسطس 2026',doc:'d2',cc:'صداع متكرر',dx:'ضغط مرتفع',vit:'ضغط 150/95',note:'بدء كونكور 5 ومتابعة الضغط في البيت.'}],
    labs:[{date:'اليوم',name:'سكر تراكمي HbA1c',res:'8.1%',ref:'أقل من 7%',flag:1},{date:'اليوم',name:'كرياتينين',res:'0.9',ref:'0.6 – 1.1',flag:0},{date:'12 أغسطس',name:'كوليسترول كلي',res:'232',ref:'أقل من 200',flag:1}],
    rads:[{date:'12 أغسطس',name:'رسم قلب',rep:'نظم جيبي طبيعي، لا توجد تغيرات إقفارية.'}],
    notes:[{date:'اليوم',by:'d2',t:'تحويل لعيادة العيون لفحص قاع العين.'}]}),
  base({id:4,name:'محمود السيد',age:'61 سنة',phone:'0155 412 0036',doc:'d2',last:'اليوم',chronic:['ضغط مرتفع','قصور شريان تاجي'],blood:'B+'}),
  base({id:5,name:'آدم سامح',age:'4 سنين',phone:'0100 771 5902',doc:'d1',last:'28 أكتوبر',chronic:['أنيميا نقص حديد']}),
  base({id:6,name:'ريم خالد',age:'27 سنة',phone:'0127 305 6648',doc:'d3',last:'اليوم',chronic:['إكزيما']}),
  base({id:7,name:'يوسف نبيل',age:'34 سنة',phone:'0109 882 4417',doc:'d3',last:'2 سبتمبر',allergy:['إيبوبروفين']}),
  base({id:8,name:'سارة مجدي',age:'45 سنة',phone:'0114 220 9813',doc:'d2',last:'9 أكتوبر',chronic:['خمول الغدة الدرقية']})
];
patients.forEach(p=>{if(!p.visits.length){p.visits.push({date:p.last,doc:p.doc,cc:'كشف دوري',dx:p.chronic[0]?`متابعة ${p.chronic[0]}`:'الحالة مستقرة',vit:'ضغط 120/80 · حرارة 37',note:'متابعة بعد 3 شهور.'});p.labs.push({date:p.last,name:'صورة دم كاملة',res:'في المعدل',ref:'—',flag:0})}});
const pat=id=>patients.find(p=>p.id===+id);

/* ===== المواعيد والفواتير ===== */
let appts=[],invs=[],seq=1100;
function mkInv(pid,doc,items,paid,method,day,disc){const i={id:++seq,pid,doc,day:day||'اليوم',items,disc:disc||0,pays:paid?[[paid,method||'نقدي']]:[]};invs.push(i);return i}
function ap(doc,n,pid,type,time,status,paid,method,day=0){const a={id:appts.length+1,doc,n,pid,type,time,status,day};if(status!=='book')a.inv=mkInv(pid,doc,[[type,fee(type,doc)]],paid,method).id;appts.push(a)}
ap('d1',1,1,'كشف','10:00','done',350);ap('d1',2,2,'متابعة','10:20','in',150,'فيزا');ap('d1',3,5,'كشف','10:40','wait',0);ap('d1',4,2,'تطعيم','11:20','book');
ap('d2',1,3,'كشف','10:00','done',200);ap('d2',2,4,'متابعة','10:20','in',150);ap('d2',3,8,'كشف','10:40','wait',300,'إنستاباي');ap('d2',4,4,'رسم قلب','11:40','book');
ap('d3',1,6,'كشف','10:00','done',400,'فيزا');ap('d3',2,7,'استشارة','10:40','book');
ap('d1',1,5,'متابعة','10:00','book',0,'',1);ap('d2',1,3,'متابعة','10:20','book',0,'',1);ap('d3',1,6,'جلسة ليزر','11:00','book',0,'',1);
invs.find(i=>i.pid===3).items.push(['تحليل سكر',80]);
mkInv(6,'d3',[['جلسة ليزر',600]],0,'','14 أكتوبر');
const tot=i=>i.items.reduce((s,x)=>s+x[1],0)-i.disc, pd=i=>i.pays.reduce((s,x)=>s+x[0],0), rem=i=>tot(i)-pd(i);
const bal=pid=>invs.filter(i=>i.pid===pid).reduce((s,i)=>s+rem(i),0);
const free=(doc,day)=>SLOTS.filter(t=>!appts.some(a=>a.doc===doc&&a.day===+day&&a.time===t));

let team=[{name:'د. كريم الشاذلي',role:'owner',info:'أطفال · غرفة 1',st:'نشط'},{name:'د. سلمى فؤاد',role:'doctor',info:'باطنة · غرفة 2',st:'نشط'},{name:'د. طارق منصور',role:'doctor',info:'جلدية · غرفة 3',st:'نشط'},{name:'منة عادل',role:'reception',info:'الوردية الصباحية',st:'نشط'},{name:'هاني رزق',role:'accountant',info:'—',st:'دعوة مرسلة'}];
let clinics=[
  {name:'مركز الشاذلي الطبي',city:'المنصورة',plan:'العيادة',price:699,st:'نشط',end:'9 ديسمبر'},
  {name:'مركز ابتسامة للأسنان',city:'طنطا',plan:'المركز',price:1299,st:'نشط',end:'2 ديسمبر'},
  {name:'عيادة د. هبة للجلدية',city:'أسيوط',plan:'الطبيب',price:349,st:'تجربة',end:'باقي 4 أيام'},
  {name:'عيادة النور للباطنة',city:'الإسكندرية',plan:'العيادة',price:699,st:'متأخر',end:'انتهى 6 نوفمبر'},
  {name:'عيادة د. مينا للعظام',city:'المنيا',plan:'الطبيب',price:349,st:'تجربة',end:'باقي 11 يوم'},
  {name:'مركز الحياة لطب الأسرة',city:'القاهرة',plan:'المركز',price:1299,st:'موقوف',end:'موقوف من 20 أكتوبر'}
];

/* ===== الحالة ===== */
let S={acc:'owner',view:'today',filter:'all',docF:'all',day:0,pid:null,ptab:'hist',q:'',bf:'all'};
const A=()=>ACC[S.acc], role=()=>A().role, can=m=>role()!=='platform'&&!!perms[role()][m];
const isDoc=()=>role()==='doctor', myDoc=()=>A().doc;
const mine=x=>!isDoc()||x.doc===myDoc();
const scope=x=>isDoc()?x.doc===myDoc():(S.docF==='all'||x.doc===S.docF);
const T=()=>appts.filter(a=>a.day===0);
function toast(t){const e=$('#toast');e.textContent=t;e.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>e.classList.remove('on'),2600)}
function go(v){S.view=v;S.pid=null;render();$('#side').classList.remove('open');scrollTo(0,0)}

function render(){
  const plat=role()==='platform', r=A();
  $('#roles').innerHTML=Object.keys(ACC).map(k=>(k==='platform'?'<span class="sep"></span>':'')+`<button class="${k===S.acc?'on':''}" data-act="acc" data-v="${k}">${ACC[k].chip}</button>`).join('');
  $('#clinic').innerHTML=plat?'<b>لوحة مالك المنصة</b>كل العيادات المشتركة':`<b>مركز الشاذلي الطبي</b>${Object.keys(DOCS).length} أطباء · باقة العيادة`;
  const nav=plat?[{id:'clinics',label:'العيادات المشتركة',icon:'build'}]:MODS.filter(m=>m.nav!==false&&can(m.id));
  if(!nav.find(m=>m.id===S.view))S.view=nav[0].id;
  const waiting=T().filter(x=>x.status==='wait'&&mine(x)).length;
  $('#nav').innerHTML=nav.map(m=>`<button class="${m.id===S.view?'on':''}" data-act="go" data-v="${m.id}">${ic(m.icon)}${m.id==='patients'&&isDoc()?'مرضاي':m.label}${m.id==='queue'&&waiting?`<span class="cnt num">${waiting}</span>`:''}</button>`).join('');
  $('#me').innerHTML=`<span class="av">${r.name.replace('د. ','')[0]}</span><span><b>${r.name}</b>${r.title}</span>`;
  $('#title').textContent=plat?'العيادات المشتركة':MODS.find(m=>m.id===S.view).label;
  $('#bookBtn').style.display=can('queue')?'':'none';
  $('.search').style.visibility=can('patients')?'visible':'hidden';
  $('#view').innerHTML=VIEWS[S.view]();
}

/* ===== مكوّنات ===== */
const lockPanel=t=>`<div class="lockp">${ic('lock')}<b>${t}</b>الجزء ده مش ضمن صلاحيات حسابك. صاحب المركز يقدر يفعّله من «الفريق والصلاحيات».</div>`;
const docChips=()=>isDoc()?'':`<div class="tabs">${[['all','كل الأطباء'],...Object.entries(DOCS).map(([k,d])=>[k,d.name])].map(([k,l])=>`<button class="${S.docF===k?'on':''}" data-act="docf" data-v="${k}">${l}</button>`).join('')}</div>`;
function qRow(x){
  const [l,c]=ST[x.status], p=pat(x.pid), i=invs.find(i=>i.id===x.inv); let a='';
  if(x.status==='book'&&can('queue'))a=(x.day===0?`<button class="btn sm ghost" data-act="st" data-id="${x.id}" data-v="wait">سجّل الوصول</button>`:'')+`<button class="link" data-act="cancel" data-id="${x.id}">إلغاء</button>`;
  if(can('clinical')&&myDoc()===x.doc){
    if(x.status==='wait')a=`<button class="btn sm" data-act="st" data-id="${x.id}" data-v="in">ابدأ الكشف</button>`;
    if(x.status==='in')a=`<button class="btn sm ghost" data-act="open" data-id="${p.id}">الملف</button><button class="btn sm" data-act="st" data-id="${x.id}" data-v="done">أنهِ الكشف</button>`;
  }
  if(i&&rem(i)>0&&can('billing'))a+=`<button class="btn sm sun" data-act="inv" data-id="${i.id}">حصّل ${rem(i)} ج.م</button>`;
  return `<div class="row-i"><span class="qn num">${x.n}</span><span class="who"><b>${p.name}</b><span>${x.type} · <span class="num">${x.time}</span>${isDoc()?'':' · '+DOCS[x.doc].name}</span></span><span class="chip ${c}">${l}</span>${a}</div>`;
}
function ticket(doc){
  const cur=T().find(x=>x.status==='in'&&x.doc===doc), nx=T().find(x=>x.status==='wait'&&x.doc===doc), own=can('clinical')&&myDoc()===doc;
  if(!cur)return `<div class="ticket"><div class="no"><small>الدور الآن</small><span class="num">—</span></div><div class="info"><b>مفيش مريض في الكشف</b><span>${nx?`التالي: ${pat(nx.pid).name} (رقم ${nx.n})`:'مفيش حد في الانتظار'}</span>${nx&&own?`<div class="row"><button class="btn sm sun" data-act="st" data-id="${nx.id}" data-v="in">نادِ التالي</button></div>`:''}</div></div>`;
  const p=pat(cur.pid);
  return `<div class="ticket"><div class="no"><small>الدور الآن</small><span class="num">${String(cur.n).padStart(2,'0')}</span></div><div class="info"><b>${p.name}</b><span>${cur.type} · ${p.age}${nx?` · التالي: ${pat(nx.pid).name}`:''}</span>
  <div class="row">${own?`<button class="btn sm sun" data-act="open" data-id="${p.id}">افتح الملف الطبي</button><button class="btn sm ghost" data-act="st" data-id="${cur.id}" data-v="done">أنهِ الكشف</button>`:`<span class="chip c-in">${DOCS[doc].name} مع المريض الآن</span>`}</div></div></div>`;
}
function docCard(k){
  const d=DOCS[k], t=T().filter(x=>x.doc===k), cur=t.find(x=>x.status==='in'), w=t.filter(x=>x.status==='wait').length, f=free(k,0);
  return `<div class="card dc"><h3>${d.name}<span class="sp"></span><span class="chip c-book">${d.room}</span></h3><div class="cur"><span class="num">${cur?String(cur.n).padStart(2,'0'):'—'}</span><span><b>${cur?pat(cur.pid).name:'مفيش مريض في الكشف'}</b><small>${d.spec} · ${w} في الانتظار · ${t.length} مواعيد</small></span></div>
  <div class="slots">${f.slice(0,5).map(s=>`<button class="slot" data-act="book" data-doc="${k}" data-time="${s}">${s}</button>`).join('')||'<small>اليوم كامل</small>'}</div>
  <button class="btn sm ghost" data-act="book" data-doc="${k}">${ic('plus')}احجز عند ${d.name}</button></div>`;
}
const week=[['سبت',62],['أحد',80],['اثنين',55],['ثلاثاء',91],['أربعاء',74,1],['خميس',0],['جمعة',0]];
const barsHtml=d=>`<div class="bars">${d.map(([l,h,hi])=>`<div class="${hi?'hi':''}"><i style="height:${h||3}%"></i>${l}</div>`).join('')}</div>`;
const hb=(l,p,v)=>`<div class="hbar"><span>${l}</span><span class="tr"><i style="width:${p}%"></i></span><span class="num">${v}</span></div>`;
const todayInv=()=>invs.filter(i=>i.day==='اليوم');
function docIncome(){const m=Object.keys(DOCS).map(k=>[DOCS[k].name,todayInv().filter(i=>i.doc===k).reduce((s,i)=>s+pd(i),0)]),mx=Math.max(...m.map(x=>x[1]),1);return m.map(([n,v])=>hb(n,v/mx*100,v)).join('')}
const k=(l,v,e,c='')=>`<div class="card kpi"><small>${l}</small><span class="kv1">${v}</span><em class="${c}">${e}</em></div>`;

/* ===== الشاشات ===== */
const VIEWS={
today(){
  const t=T().filter(mine), w=t.filter(x=>x.status==='wait').length, done=t.filter(x=>x.status==='done').length, bk=t.filter(x=>x.status==='book').length;
  const inc=todayInv().reduce((s,i)=>s+pd(i),0), due=invs.reduce((s,i)=>s+rem(i),0), R=role();
  const K={
    doctor:[k('مرضاي اليوم',N(t.length),`${done} خلصوا`),k('في الانتظار',N(w),'برّه في الاستقبال'),k('لسه ما وصلوش',N(bk),'حجوزات مؤكدة'),k('متوسط مدة الكشف','<span class="num">14</span> <small>دقيقة</small>','آخر 7 أيام')],
    reception:[k('مواعيد اليوم',N(t.length),`عند ${Object.keys(DOCS).length} أطباء`),k('في الانتظار',N(w),'متوسط الانتظار 12 دقيقة'),k('لسه ما وصلوش',N(bk),'اتبعت لهم تذكير واتساب'),k('متحصّل اليوم',N(inc)+' <small>ج.م</small>',due?`باقي ${due} ج.م مستحق`:'كله متحصّل',due?'warn':'')],
    accountant:[k('متحصّل اليوم',N(inc)+' <small>ج.م</small>','↑ 9% عن الأربعاء اللي فات'),k('مستحقات',N(due)+' <small>ج.م</small>',due?'محتاجة متابعة':'مفيش',due?'warn':''),k('فواتير اليوم',N(todayInv().length),`${todayInv().filter(i=>!rem(i)).length} مدفوعة بالكامل`),k('خصومات اليوم',N(invs.reduce((s,i)=>s+i.disc,0))+' <small>ج.م</small>','بموافقة صاحب المركز')],
    owner:[k('مواعيد اليوم',N(t.length),`${done} خلصوا`),k('في الانتظار',N(w),'متوسط الانتظار 12 دقيقة'),k('متحصّل اليوم',N(inc)+' <small>ج.م</small>','↑ 9% عن الأربعاء اللي فات'),k('مستحقات',N(due)+' <small>ج.م</small>',due?'محتاجة متابعة':'مفيش',due?'warn':'')]
  }[R];
  let mineBlock='';
  if(can('clinical')&&myDoc()){
    const cur=T().find(x=>x.status==='in'&&x.doc===myDoc()), p=cur&&pat(cur.pid), lv=p&&p.visits[0];
    mineBlock=`<div class="grid g2">${ticket(myDoc())}<div class="card"><h3>قبل ما تكشف</h3>${p?`
      ${p.allergy.length?`<div class="alert">حساسية: ${p.allergy.join('، ')}</div>`:''}
      <dl class="kv" style="margin-top:10px"><dt>أمراض مزمنة</dt><dd>${p.chronic.join('، ')||'لا يوجد'}</dd><dt>أدوية مستمرة</dt><dd>${p.meds.map(m=>m.d).join('، ')||'لا يوجد'}</dd><dt>آخر زيارة</dt><dd>${lv.date} — ${lv.dx}</dd></dl>`:'<span class="sub">لما تنادي مريض، ملخص حالته هيظهر هنا.</span>'}</div></div>`;
  }
  return `<div class="hello">صباح الخير، ${A().name}</div><div class="sub">الأربعاء 11 نوفمبر${can('queue')?` · ${t.length} مواعيد النهارده، منهم ${w} في الانتظار`:''}</div>
  <div class="grid g4 mb">${K.join('')}</div>${mineBlock?`<div class="mb">${mineBlock}</div>`:''}
  ${can('queue')&&!isDoc()?`<div class="grid g3 mb">${Object.keys(DOCS).map(docCard).join('')}</div>`:''}
  <div class="grid g2">
    ${can('queue')?`<div class="card"><h3>${isDoc()?'مرضاي الجايين':'اللي جاي في الدور'}<span class="sp"></span><button class="link" data-act="go" data-v="queue">كل المواعيد</button></h3><div class="rows">${t.filter(x=>x.status==='wait'||x.status==='book').slice(0,5).map(qRow).join('')||'<span class="sub">مفيش مواعيد تانية النهارده.</span>'}</div></div>`:`<div class="card"><h3>دخل كل طبيب اليوم</h3>${docIncome()}</div>`}
    <div class="grid" style="align-content:start">
      ${can('reports')&&can('queue')?`<div class="card"><h3>دخل كل طبيب اليوم</h3>${docIncome()}</div>`:''}
      <div class="card"><h3>محتاج انتباهك</h3><div class="rows">
        ${can('clinical')?'<div class="row-i"><span class="who"><b>نتيجة تحليل جديدة خارج المعدل</b><span>هدى عبد الرحمن — سكر تراكمي 8.1%</span></span></div>':''}
        ${can('billing')?'<div class="row-i"><span class="who"><b>ريم خالد عليها 600 ج.م</b><span>جلسة ليزر من 14 أكتوبر</span></span><button class="link" data-act="go" data-v="billing">الفواتير</button></div>':''}
        ${can('queue')?'<div class="row-i"><span class="who"><b>3 حجوزات لبكرة</b><span>رسالة التذكير هتتبعت على واتساب 9 الصبح</span></span></div>':''}
        ${can('plan')?'<div class="row-i"><span class="who"><b>الاشتراك هيتجدد 9 ديسمبر</b><span>باقة العيادة · 699 ج.م شهريًا</span></span><button class="link" data-act="go" data-v="plan">الاشتراك</button></div>':''}
      </div></div>
    </div>
  </div>`;
},
queue(){
  const all=appts.filter(a=>a.day===S.day&&scope(a)), f=S.filter, list=all.filter(x=>f==='all'||x.status===f).sort((a,b)=>a.time.localeCompare(b.time,'en',{numeric:true}));
  const tb=(v,l)=>`<button class="${f===v?'on':''}" data-act="filter" data-v="${v}">${l} <span class="num">${v==='all'?all.length:all.filter(x=>x.status===v).length}</span></button>`;
  const ds=isDoc()?[myDoc()]:(S.docF==='all'?Object.keys(DOCS):[S.docF]);
  return `<div class="head"><div class="tabs" style="margin:0">${DAYS.map((d,i)=>`<button class="${S.day===i?'on':''}" data-act="day" data-v="${i}">${d}</button>`).join('')}</div><span class="sp"></span>${docChips().replace('class="tabs"','class="tabs" style="margin:0"')}</div>
  ${isDoc()?'<div class="note">ده حسابك كطبيب: بتشوف مواعيدك ومرضاك إنت بس.</div>':''}
  <div class="grid g2" style="grid-template-columns:1fr 1.5fr;align-items:start">
    <div class="grid">${S.day===0?ds.map(d=>`<div><small class="lbl">${DOCS[d].name} · ${DOCS[d].room}</small>${ticket(d)}</div>`).join(''):''}
      <div class="card"><h3>مواعيد فاضية ${DAYS[S.day]}</h3>${ds.map(d=>{const fr=free(d,S.day);return `<small class="lbl">${DOCS[d].name} — ${fr.length} فاضي</small><div class="slots mb8">${fr.map(s=>`<button class="slot" data-act="book" data-doc="${d}" data-time="${s}" data-day="${S.day}">${s}</button>`).join('')||'<small>اليوم كامل</small>'}</div>`}).join('')}<small>اضغط على أي معاد عشان تحجزه.</small></div></div>
    <div class="card"><div class="tabs">${tb('all','الكل')}${tb('book','محجوز')}${tb('wait','في الانتظار')}${tb('in','في الكشف')}${tb('done','انتهى')}</div>
    <div class="rows">${list.map(qRow).join('')||'<span class="sub">مفيش مواعيد بالحالة دي.</span>'}</div></div></div>`;
},
patients(){
  if(S.pid)return patientFile();
  const q=S.q.replace(/\s/g,''), list=patients.filter(p=>(!isDoc()||p.doc===myDoc())&&(p.name+p.phone).replace(/\s/g,'').includes(q));
  return `<div class="head"><span class="sub" style="margin:0">${list.length} مريض${isDoc()?' متابعين معاك':''}${S.q?` · نتيجة البحث عن «${S.q}»`:''}</span><span class="sp"></span><button class="btn ghost" data-act="newpat">${ic('plus')}مريض جديد</button></div>
  <div class="card tw"><table><thead><tr><th>المريض</th><th>السن</th><th>الموبايل</th>${isDoc()?'':'<th>الطبيب المتابع</th>'}${can('clinical')?'<th>أمراض مزمنة وحساسية</th>':''}<th>آخر زيارة</th>${can('billing')?'<th>عليه</th>':''}</tr></thead><tbody>
  ${list.map(p=>`<tr class="click" data-act="open" data-id="${p.id}"><td><b>${p.name}</b></td><td>${p.age}</td><td class="num">${p.phone}</td>${isDoc()?'':`<td>${DOCS[p.doc].name}</td>`}${can('clinical')?`<td>${p.allergy.map(a=>`<span class="tagx">${a}</span>`).join('')}${p.chronic.map(a=>`<span class="tagx b">${a}</span>`).join('')||(p.allergy.length?'':'—')}</td>`:''}<td>${p.last}</td>${can('billing')?`<td>${bal(p.id)?`<span class="chip c-due">${bal(p.id)} ج.م</span>`:'—'}</td>`:''}</tr>`).join('')||'<tr><td colspan="7">مفيش مريض بالاسم ده. جرّب تكتب رقم الموبايل.</td></tr>'}
  </tbody></table></div>`;
},
billing(){
  const f=S.bf, list=invs.filter(i=>f==='all'||(f==='due'?rem(i)>0:!rem(i))).slice().reverse();
  const inc=todayInv().reduce((s,i)=>s+pd(i),0), due=invs.reduce((s,i)=>s+rem(i),0);
  const meth={};todayInv().forEach(i=>i.pays.forEach(([a,m])=>meth[m]=(meth[m]||0)+a));
  const tb=(v,l)=>`<button class="${f===v?'on':''}" data-act="bf" data-v="${v}">${l}</button>`;
  return `<div class="grid g3 mb">${k('متحصّل اليوم',N(inc)+' <small>ج.م</small>',`${todayInv().length} فواتير`)}${k('مستحقات لسه ما اتحصّلتش',N(due)+' <small>ج.م</small>',due?`${invs.filter(i=>rem(i)>0).length} فواتير مفتوحة`:'مفيش',due?'warn':'')}${k('متوسط الفاتورة',N(Math.round(todayInv().reduce((s,i)=>s+tot(i),0)/todayInv().length))+' <small>ج.م</small>','اليوم')}</div>
  <div class="grid g2" style="grid-template-columns:2fr 1fr;align-items:start">
  <div class="card tw"><div class="head" style="margin-bottom:10px"><div class="tabs" style="margin:0">${tb('all','كل الفواتير')}${tb('due','مستحقة')}${tb('paid','مدفوعة')}</div><span class="sp"></span><button class="btn sm" data-act="newinv">${ic('plus')}فاتورة جديدة</button></div>
  <table><thead><tr><th>رقم</th><th>المريض</th><th>الطبيب</th><th>الإجمالي</th><th>المدفوع</th><th>الباقي</th><th>الحالة</th><th></th></tr></thead><tbody>
  ${list.map(i=>`<tr class="click" data-act="inv" data-id="${i.id}"><td class="num">F-${i.id}</td><td><b>${pat(i.pid).name}</b><small class="lbl" style="margin:0">${i.items.map(x=>x[0]).join(' + ')} · ${i.day}</small></td><td>${DOCS[i.doc].name}</td><td class="num">${tot(i)}</td><td class="num">${pd(i)}</td><td class="num">${rem(i)}</td><td>${!rem(i)?'<span class="chip c-done">مدفوعة</span>':pd(i)?'<span class="chip c-wait">مدفوعة جزئيًا</span>':'<span class="chip c-due">مستحقة</span>'}</td><td>${rem(i)?'<button class="btn sm sun">حصّل</button>':'<span class="link">تفاصيل</span>'}</td></tr>`).join('')||'<tr><td colspan="8">مفيش فواتير بالحالة دي.</td></tr>'}
  </tbody></table></div>
  <div class="grid">
    <div class="card"><h3>طرق الدفع اليوم</h3>${Object.entries(meth).map(([m,v])=>hb(m,v/inc*100,v)).join('')||'<span class="sub">مفيش تحصيل لسه.</span>'}<button class="btn ghost sm" data-act="closeday" style="margin-top:10px">اقفل يومية الخزنة</button></div>
    ${can('reports')?`<div class="card"><h3>دخل كل طبيب اليوم</h3>${docIncome()}</div>`:''}
    <div class="card"><h3>قائمة الأسعار</h3><dl class="kv">${Object.entries(DOCS).map(([,d])=>`<dt>كشف ${d.spec}</dt><dd class="num">${d.fee}</dd>`).join('')}${Object.entries(SV).map(([s,a])=>`<dt>${s}</dt><dd class="num">${a}</dd>`).join('')}</dl></div>
  </div></div>`;
},
reports(){
  const months=[['يونيو',58],['يوليو',66],['أغسطس',61],['سبتمبر',79],['أكتوبر',88],['نوفمبر',41,1]];
  return `<div class="grid g3 mb">${k('دخل أكتوبر',N(186400)+' <small>ج.م</small>','↑ 11% عن سبتمبر')}${k('زيارات أكتوبر',N(574),'83 مريض جديد')}${k('نسبة الغياب عن الموعد','<span class="num">7%</span>','↓ بعد تذكير واتساب')}</div>
  <div class="grid g2"><div class="card"><h3>الدخل الشهري<span class="sp"></span><button class="link" data-act="soon">نزّل Excel</button></h3>${barsHtml(months)}</div>
  <div class="card"><h3>زيارات أكتوبر لكل طبيب</h3>${hb('د. كريم',100,231)}${hb('د. سلمى',84,194)}${hb('د. طارق',64,149)}
  <h3 style="margin-top:18px">دخل أكتوبر لكل طبيب</h3>${hb('د. كريم',100,'74,300')}${hb('د. طارق',78,'58,100')}${hb('د. سلمى',73,'54,000')}</div></div>
  <div class="card" style="margin-top:16px"><h3>زيارات الأسبوع</h3>${barsHtml(week)}</div>`;
},
team(){
  const cols=['owner','doctor','reception','accountant'];
  return `<div class="note">جرّب: غيّر أي صلاحية من الجدول، وبعدين بدّل الحساب من الشريط الأصفر فوق وشوف القائمة اتغيّرت إزاي.</div>
  <div class="card tw mb"><h3>حسابات الفريق<span class="sp"></span><button class="btn sm" data-act="invite">${ic('plus')}أضف طبيب أو موظف</button></h3><table><thead><tr><th>الاسم</th><th>الدور</th><th>التخصص / الوردية</th><th>الحالة</th></tr></thead><tbody>
  ${team.map(t=>`<tr><td><b>${t.name}</b></td><td>${RL[t.role]}</td><td>${t.info}</td><td><span class="chip ${t.st==='نشط'?'c-done':'c-wait'}">${t.st}</span></td></tr>`).join('')}</tbody></table>
  <p class="sub" style="margin:10px 0 0;font-size:13.5px">كل طبيب له حساب خاص: بيشوف مواعيده ومرضاه هو بس، وليه دور وغرفة وسعر كشف مستقلين.</p></div>
  <div class="card tw"><h3>مين يشوف إيه</h3><table class="mx"><thead><tr><th>الجزء</th>${cols.map(c=>`<th>${RL[c]}</th>`).join('')}</tr></thead><tbody>
  ${MODS.map(m=>`<tr><td><b>${m.label}</b><small>${m.desc}</small></td>${cols.map(c=>`<td><button class="sw ${perms[c][m.id]?'on':''}" role="switch" aria-checked="${!!perms[c][m.id]}" aria-label="${m.label} — ${RL[c]}" ${c==='owner'?'disabled':''} data-act="perm" data-r="${c}" data-m="${m.id}"></button></td>`).join('')}</tr>`).join('')}
  </tbody></table></div>`;
},
plan(){
  const pl=(n,p,f,cur)=>`<div class="card plan ${cur?'cur':''}"><h3>${n}${cur?'<span class="sp"></span><span class="chip c-in">باقتك الحالية</span>':''}</h3><span class="num pr">${p}</span> ج.م / شهر<ul>${f.map(x=>`<li>${x}</li>`).join('')}</ul>${cur?'':`<button class="btn ghost sm" data-act="soon">انقل لباقة ${n}</button>`}</div>`;
  const nd=Object.keys(DOCS).length;
  return `<div class="grid g2 mb"><div class="card"><h3>باقة العيادة<span class="sp"></span><span class="chip c-done">نشط</span></h3>
  <p>التجديد الجاي <b>9 ديسمبر 2026</b> بمبلغ <span class="num">699</span> ج.م.</p><br>
  <small>الأطباء — <span class="num">${nd}</span> من <span class="num">3</span></small><div class="meter"><i style="width:${Math.min(100,nd/3*100)}%"></i></div>
  <small>المستخدمون — <span class="num">${team.length}</span> من <span class="num">6</span></small><div class="meter"><i style="width:${Math.min(100,team.length/6*100)}%"></i></div>
  <button class="btn" data-act="renew">جدّد الاشتراك</button></div>
  <div class="card tw"><h3>آخر الفواتير</h3><table><tbody>${['9 نوفمبر','9 أكتوبر','9 سبتمبر'].map(d=>`<tr><td>${d} 2026</td><td class="num">699 ج.م</td><td><span class="chip c-done">مدفوعة</span></td><td><button class="link" data-act="print">نزّل</button></td></tr>`).join('')}</tbody></table></div></div>
  <div class="grid g3">${pl('الطبيب',349,['طبيب واحد + مساعد','مواعيد وحجز وملف طبي كامل','فواتير وروشتة مطبوعة'])}${pl('العيادة',699,['حتى 3 أطباء، كل طبيب بحسابه','حساب للاستقبال وللمحاسب','صلاحيات لكل دور وتقارير لكل طبيب'],1)}${pl('المركز',1299,['أطباء ومستخدمون بلا حد','أكتر من فرع','تقارير لكل فرع ودعم بأولوية'])}</div>`;
},
clinics(){
  const act=clinics.filter(c=>c.st==='نشط'), mrr=act.reduce((s,c)=>s+c.price,0), chip={نشط:'c-done',تجربة:'c-in',متأخر:'c-due',موقوف:'c-book'};
  return `<div class="hello">العيادات المشتركة</div><div class="sub">دي الشاشة اللي بتدير منها اشتراكات عملائك: تفعّل، توقف، وتتابع التجديد.</div>
  <div class="grid g4 mb">${k('عيادات نشطة',N(act.length),`من ${clinics.length} حساب`)}${k('الدخل الشهري المتكرر',N(mrr)+' <small>ج.م</small>','من الاشتراكات النشطة')}${k('في فترة التجربة',N(clinics.filter(c=>c.st==='تجربة').length),'واحدة تنتهي خلال 4 أيام')}${k('متأخر عن الدفع',N(clinics.filter(c=>c.st==='متأخر').length),'محتاج متابعة','warn')}</div>
  <div class="card tw"><table><thead><tr><th>العيادة</th><th>المدينة</th><th>الباقة</th><th>الحالة</th><th>الاشتراك</th><th></th></tr></thead><tbody>
  ${clinics.map((c,i)=>`<tr><td><b>${c.name}</b></td><td>${c.city}</td><td>${c.plan} · <span class="num">${c.price}</span></td><td><span class="chip ${chip[c.st]}">${c.st}</span></td><td>${c.end}</td><td>${c.st==='نشط'?`<button class="btn sm ghost" data-act="cl" data-i="${i}" data-v="موقوف">أوقف</button>`:`<button class="btn sm" data-act="cl" data-i="${i}" data-v="نشط">فعّل الاشتراك</button>`}</td></tr>`).join('')}
  </tbody></table></div>`;
}};

/* ===== ملف المريض ===== */
const FL={0:['في المعدل','c-done'],1:['مرتفع','c-due'],'-1':['منخفض','c-wait']};
function patientFile(){
  const p=pat(S.pid), ed=can('clinical');
  const tabs=[['hist','التاريخ المرضي','clinical'],['visits','الزيارات','clinical'],['meds','الأدوية والروشتة','clinical'],['labs','التحاليل والأشعة','clinical'],['notes','ملاحظات طبية','clinical'],['account','الحساب والمواعيد','billing']];
  const cur=tabs.find(t=>t[0]===S.ptab), ok=can(cur[2]); let b='';
  const tagBox=(key,title,cls,ph)=>`<div class="card"><h3>${title}</h3><div class="tags">${p[key].map((a,i)=>`<span class="tagx ${cls}">${a} <button data-act="tagdel" data-k="${key}" data-i="${i}" aria-label="احذف ${a}">×</button></span>`).join('')||'<span class="sub" style="margin:0">لا يوجد مسجّل.</span>'}</div><form class="inline" data-form="tag" data-k="${key}"><input class="in" name="v" required placeholder="${ph}" aria-label="${title}"><button class="btn ghost sm">أضف</button></form></div>`;
  if(!ok)b=lockPanel(cur[2]==='clinical'?'الملف الطبي مقفول لحسابك':'حساب المريض مقفول لحسابك');
  else if(S.ptab==='hist'){const lv=p.visits[0];b=`<div class="grid g2" style="align-items:start"><div class="grid">${tagBox('chronic','الأمراض المزمنة','b','مثال: ضغط مرتفع')}${tagBox('allergy','الحساسية','','مثال: بنسلين')}</div>
    <div class="grid"><div class="card"><h3>بيانات أساسية</h3><dl class="kv"><dt>فصيلة الدم</dt><dd>${p.blood}</dd><dt>التاريخ العائلي</dt><dd>${p.family}</dd><dt>عمليات سابقة</dt><dd>${p.surg}</dd><dt>الطبيب المتابع</dt><dd>${DOCS[p.doc].name} · ${DOCS[p.doc].spec}</dd></dl></div>
    <div class="card"><h3>أدوية مستمرة<span class="sp"></span><button class="link" data-act="ptab" data-v="meds">كل الأدوية</button></h3>${p.meds.map(m=>`<div class="row-i"><span class="who"><b>${m.d}</b><span>${m.dose}</span></span></div>`).join('')||'<span class="sub" style="margin:0">المريض مش بياخد أدوية مستمرة.</span>'}</div>
    <div class="card"><h3>آخر زيارة<span class="sp"></span><button class="link" data-act="ptab" data-v="visits">كل الزيارات (${p.visits.length})</button></h3><b>${lv.dx}</b><div class="sub" style="margin:0">${lv.date} · ${DOCS[lv.doc].name}</div>${lv.note}</div></div></div>`}
  else if(S.ptab==='visits')b=`<div class="grid g2" style="align-items:start"><div class="card">${p.visits.map(v=>`<div class="visit"><time>${v.date} · ${DOCS[v.doc].name}</time><b>${v.dx}</b><dl class="kv" style="margin-top:6px"><dt>الشكوى</dt><dd>${v.cc}</dd><dt>القياسات</dt><dd>${v.vit}</dd><dt>الخطة</dt><dd>${v.note}</dd></dl></div>`).join('')}</div>
    <form class="card form" data-form="visit"><h3>سجّل زيارة جديدة</h3><label>الشكوى<input class="in" name="cc" required placeholder="المريض بيشتكي من إيه؟"></label><label>التشخيص<input class="in" name="dx" required></label><div class="f3"><label>الضغط<input class="in" name="bp" placeholder="120/80"></label><label>الحرارة<input class="in" name="t" placeholder="37"></label><label>الوزن<input class="in" name="w" placeholder="كجم"></label></div><label>الخطة والملاحظات<textarea class="in" name="note" placeholder="العلاج والمتابعة"></textarea></label><button class="btn">احفظ الزيارة</button></form></div>`;
  else if(S.ptab==='meds')b=`<div class="card tw mb"><h3>الأدوية الحالية</h3><table><thead><tr><th>الدواء</th><th>الجرعة</th><th>المدة</th><th>بدأ</th><th></th></tr></thead><tbody>${p.meds.map((m,i)=>`<tr><td><b>${m.d}</b></td><td>${m.dose}</td><td>${m.dur}</td><td>${m.since}</td><td><button class="link" data-act="medstop" data-i="${i}">أوقف الدواء</button></td></tr>`).join('')||'<tr><td colspan="5">مفيش أدوية مسجّلة.</td></tr>'}</tbody></table></div>
    <div class="grid g2" style="align-items:start"><div class="rxp"><div class="rxh">℞</div><small class="lbl">روشتة جديدة — ${p.name}</small>
    ${p.rx.map((r,i)=>`<div class="rxl ${r.warn?'bad':''}"><b>${r.d}</b><span>${r.dose}</span><span>${r.dur}</span><button data-act="rxdel" data-i="${i}" aria-label="احذف ${r.d}">${ic('x')}</button></div>`).join('')||'<div class="rxl" style="color:var(--muted);grid-template-columns:1fr">الروشتة فاضية. أضف أول دواء.</div>'}
    <div style="margin-top:14px;display:flex;gap:8px;flex-wrap:wrap"><button class="btn" data-act="rxsave">احفظ واطبع</button><button class="btn ghost" data-act="rxwa">ابعتها واتساب</button></div></div>
    <form class="card form" data-form="rx"><h3>أضف دواء للروشتة</h3><label>الدواء<input class="in" name="d" required placeholder="مثال: أموكسيسيلين شراب 250"></label><div class="f2"><label>الجرعة<input class="in" name="dose" required placeholder="5 مل كل 8 ساعات"></label><label>المدة<input class="in" name="dur" required placeholder="7 أيام"></label></div>
    ${p.allergy.length?`<div class="alert">حساسية مسجّلة: ${p.allergy.join('، ')}. النظام بينبّهك لو الدواء متعارض.</div>`:''}<button class="btn ghost">${ic('plus')}أضف للروشتة</button></form></div>`;
  else if(S.ptab==='labs')b=`<div class="grid g2" style="grid-template-columns:1.6fr 1fr;align-items:start"><div class="grid"><div class="card tw"><h3>نتائج التحاليل</h3><table><thead><tr><th>التاريخ</th><th>التحليل</th><th>النتيجة</th><th>المعدل الطبيعي</th><th></th></tr></thead><tbody>${p.labs.map(l=>`<tr><td>${l.date}</td><td><b>${l.name}</b></td><td>${l.res}</td><td>${l.ref}</td><td><span class="chip ${FL[l.flag][1]}">${FL[l.flag][0]}</span></td></tr>`).join('')}</tbody></table></div>
    <div class="card"><h3>الأشعة والتقارير</h3>${p.rads.map(r=>`<div class="row-i"><span class="qn num">IMG</span><span class="who"><b>${r.name}</b><span>${r.date} — ${r.rep}</span></span><button class="link" data-act="soon">افتح الصورة</button></div>`).join('')||'<span class="sub" style="margin:0">مفيش أشعة مرفوعة.</span>'}</div></div>
    <div class="grid"><form class="card form" data-form="lab"><h3>أضف نتيجة تحليل</h3><label>التحليل<input class="in" name="name" required placeholder="مثال: سكر صائم"></label><div class="f2"><label>النتيجة<input class="in" name="res" required></label><label>المعدل الطبيعي<input class="in" name="ref" placeholder="70 – 100"></label></div><label>التقييم<select class="in" name="flag"><option value="0">في المعدل</option><option value="1">مرتفع</option><option value="-1">منخفض</option></select></label><button class="btn ghost">أضف النتيجة</button></form>
    <form class="card form" data-form="rad"><h3>أضف أشعة</h3><label>نوع الأشعة<input class="in" name="name" required placeholder="مثال: سونار بطن"></label><label>التقرير<textarea class="in" name="rep" required></textarea></label><button class="btn ghost">أضف الأشعة</button></form></div></div>`;
  else if(S.ptab==='notes')b=`<div class="grid g2" style="align-items:start"><div class="card">${p.notes.map(n=>`<div class="visit"><time>${n.date} · ${DOCS[n.by].name}</time>${n.t}</div>`).join('')||'<span class="sub" style="margin:0">مفيش ملاحظات لسه.</span>'}</div><form class="card form" data-form="note"><h3>أضف ملاحظة طبية</h3><label>الملاحظة<textarea class="in" name="t" required placeholder="ملاحظة تظهر للأطباء بس"></textarea></label><button class="btn">احفظ الملاحظة</button></form></div>`;
  else{const iv=invs.filter(i=>i.pid===p.id), ap2=appts.filter(a=>a.pid===p.id&&a.status==='book');b=`<div class="grid g2" style="align-items:start"><div class="card tw"><h3>فواتير المريض<span class="sp"></span>${bal(p.id)?`<span class="chip c-due">عليه ${bal(p.id)} ج.م</span>`:'<span class="chip c-done">مفيش مستحقات</span>'}</h3><table><thead><tr><th>رقم</th><th>التاريخ</th><th>الخدمات</th><th>الإجمالي</th><th>الباقي</th></tr></thead><tbody>${iv.map(i=>`<tr class="click" data-act="inv" data-id="${i.id}"><td class="num">F-${i.id}</td><td>${i.day}</td><td>${i.items.map(x=>x[0]).join(' + ')}</td><td class="num">${tot(i)}</td><td class="num">${rem(i)}</td></tr>`).join('')||'<tr><td colspan="5">مفيش فواتير.</td></tr>'}</tbody></table></div>
    <div class="card"><h3>مواعيد جاية</h3><div class="rows">${ap2.map(a=>`<div class="row-i"><span class="who"><b>${DAYS[a.day]} · <span class="num">${a.time}</span></b><span>${a.type} · ${DOCS[a.doc].name}</span></span><button class="link" data-act="cancel" data-id="${a.id}">إلغاء</button></div>`).join('')||'<span class="sub" style="margin:0">مفيش مواعيد محجوزة.</span>'}</div></div></div>`}
  return `<button class="link" data-act="go" data-v="patients" style="display:inline-flex;align-items:center;margin-bottom:12px">${ic('back')}${isDoc()?'كل مرضاي':'كل المرضى'}</button>
  <div class="card mb"><div class="pf"><span class="av">${p.name[0]}</span><div style="flex:1;min-width:200px"><h2>${p.name}</h2><div class="meta">${p.age} · <span class="num">${p.phone}</span> · ${DOCS[p.doc].name} · آخر زيارة ${p.last}</div>
  ${ed?`<div style="margin-top:6px">${p.allergy.map(a=>`<span class="tagx">حساسية: ${a}</span>`).join('')}${p.chronic.map(a=>`<span class="tagx b">${a}</span>`).join('')}</div>`:''}</div>
  ${can('queue')?`<button class="btn ghost" data-act="book" data-pid="${p.id}" data-doc="${p.doc}">احجز له موعد</button>`:''}</div></div>
  <div class="tabs">${tabs.map(t=>`<button class="${t[0]===S.ptab?'on':''}" data-act="ptab" data-v="${t[0]}">${can(t[2])?'':ic('lock')}${t[1]}</button>`).join('')}</div>${b}`;
}

/* ===== النوافذ ===== */
function modal(h){$('#modal').innerHTML=h?`<div class="ov" data-act="close"><div class="dlg" role="dialog" aria-modal="true">${h}</div></div>`:'';const f=$('#modal input:not([readonly]),#modal select');f&&f.focus()}
const opt=(arr,sel)=>arr.map(([v,l])=>`<option value="${v}" ${v==sel?'selected':''}>${l}</option>`).join('');
const docOpts=sel=>opt(Object.entries(DOCS).map(([k,d])=>[k,`${d.name} — ${d.spec}`]),sel);
const cancelBtn='<button type="button" class="btn ghost" data-act="close" data-x="1">إلغاء</button>';
function invModal(id){
  const i=invs.find(x=>x.id===+id), p=pat(i.pid), r=rem(i);
  modal(`<h3>فاتورة <span class="num">F-${i.id}</span></h3><div class="sub" style="margin-bottom:10px">${p.name} · ${DOCS[i.doc].name} · ${i.day}</div>
  <dl class="kv inv">${i.items.map(x=>`<dt>${x[0]}</dt><dd class="num">${x[1]}</dd>`).join('')}${i.disc?`<dt>خصم</dt><dd class="num">−${i.disc}</dd>`:''}<dt><b>الإجمالي</b></dt><dd class="num"><b>${tot(i)}</b></dd>${i.pays.map(x=>`<dt>دفعة ${x[1]}</dt><dd class="num">${x[0]}</dd>`).join('')}<dt><b>الباقي</b></dt><dd class="num"><b>${r}</b></dd></dl>
  ${r&&can('billing')?`<form class="form" data-form="pay" data-id="${i.id}" style="margin-top:14px"><div class="f2"><label>المبلغ المدفوع<input class="in" name="amt" type="number" min="1" max="${r}" value="${r}" required></label><label>طريقة الدفع<select class="in" name="m"><option>نقدي</option><option>فيزا</option><option>إنستاباي</option><option>فودافون كاش</option></select></label></div><div class="act">${cancelBtn}<button class="btn">سجّل الدفع</button></div></form>`:`<div class="act"><button class="btn ghost" data-act="print">اطبع الإيصال</button><button class="btn" data-act="close" data-x="1">تمام</button></div>`}`);
}
function bookModal(d){
  const doc=isDoc()?myDoc():(d.doc||(S.docF!=='all'?S.docF:'d1')), day=+(d.day??S.day), p=d.pid&&pat(d.pid), fr=free(doc,day);
  modal(`<h3>احجز موعد</h3><form class="form" data-form="book"><div class="f2"><label>اسم المريض<input class="in" name="name" required list="plist" value="${p?p.name:''}"><datalist id="plist">${patients.map(x=>`<option value="${x.name}">`).join('')}</datalist></label><label>الموبايل<input class="in" name="phone" inputmode="tel" placeholder="01xxxxxxxxx" value="${p?p.phone:''}"></label></div>
  <label>الطبيب<select class="in" name="doc" ${isDoc()?'disabled':''}>${docOpts(doc)}</select></label>
  <div class="f3"><label>اليوم<select class="in" name="day">${opt(DAYS.map((x,i)=>[i,x]),day)}</select></label><label>المعاد<select class="in" name="time">${opt(fr.map(s=>[s,s]),d.time)}</select></label><label>نوع الزيارة<select class="in" name="type">${opt(['كشف',...Object.keys(SV)].map(s=>[s,s]))}</select></label></div>
  <div class="note" id="feeNote" style="margin:0"></div><div class="act">${cancelBtn}<button class="btn">احجز الموعد</button></div></form>`);
  feeNote();
}
function feeNote(){const f=$('[data-form=book]');if(!f)return;const doc=isDoc()?myDoc():f.doc.value;$('#feeNote').innerHTML=`سعر ${f.type.value} عند ${DOCS[doc].name}: <span class="num">${fee(f.type.value,doc)}</span> ج.م. الفاتورة بتتعمل تلقائي لما المريض يوصل.`}

const ACT={
  menu(){$('#side').classList.toggle('open')},
  go(d){go(d.v)},
  acc(d){S.acc=d.v;S.pid=null;S.docF='all';S.view='today';S.day=0;S.filter='all';render();scrollTo(0,0);toast(`دخلت بحساب: ${ACC[d.v].name}`)},
  filter(d){S.filter=d.v;render()}, docf(d){S.docF=d.v;render()}, day(d){S.day=+d.v;S.filter='all';render()}, bf(d){S.bf=d.v;render()},
  st(d){const x=appts.find(q=>q.id==d.id), p=pat(x.pid);
    if(d.v==='wait'&&!x.inv)x.inv=mkInv(x.pid,x.doc,[[x.type,fee(x.type,x.doc)]],0).id;
    if(d.v==='in'){const c=T().find(q=>q.status==='in'&&q.doc===x.doc);if(c)c.status='done'}
    x.status=d.v;if(d.v==='done')p.last='اليوم';render();toast({wait:`اتسجّل وصول ${p.name} واتعملت له فاتورة`,in:`${p.name} دخل الكشف`,done:`انتهى كشف ${p.name}`}[d.v])},
  cancel(d){const x=appts.find(q=>q.id==d.id);appts=appts.filter(q=>q!==x);render();toast(`اتلغى موعد ${pat(x.pid).name} — المعاد ${x.time} بقى فاضي`)},
  inv(d){invModal(d.id)},
  open(d){S.view='patients';S.pid=+d.id;S.ptab=can('clinical')?'hist':'account';render();scrollTo(0,0)},
  ptab(d){S.ptab=d.v;render()},
  tagdel(d){pat(S.pid)[d.k].splice(d.i,1);render()},
  medstop(d){const m=pat(S.pid).meds.splice(d.i,1)[0];render();toast(`اتوقف ${m.d}`)},
  rxdel(d){pat(S.pid).rx.splice(d.i,1);render()},
  rxsave(){const p=pat(S.pid);if(!p.rx.length)return toast('الروشتة فاضية. أضف دواء الأول');p.rx.forEach(r=>p.meds.unshift({d:r.d,dose:r.dose,dur:r.dur,since:'اليوم'}));p.rx=[];render();toast('اتحفظت الروشتة واتضافت الأدوية لملف المريض')},
  rxwa(){toast('الروشتة اتبعتت للمريض على واتساب')},
  perm(d){perms[d.r][d.m]=perms[d.r][d.m]?0:1;render();toast(`${perms[d.r][d.m]?'اتفعّل':'اتقفل'} «${MODS.find(m=>m.id===d.m).label}» لدور ${RL[d.r]}`)},
  cl(d){clinics[d.i].st=d.v;clinics[d.i].end=d.v==='نشط'?'يتجدد 11 ديسمبر':'موقوف من اليوم';render();toast(d.v==='نشط'?'اتفعّل الاشتراك':'اتوقف الاشتراك')},
  book(d){bookModal(d)},
  newpat(){modal(`<h3>مريض جديد</h3><form class="form" data-form="newpat"><label>الاسم<input class="in" name="name" required></label><div class="f2"><label>الموبايل<input class="in" name="phone" inputmode="tel" required placeholder="01xxxxxxxxx"></label><label>السن<input class="in" name="age" required placeholder="مثال: 35 سنة"></label></div><label>الطبيب المتابع<select class="in" name="doc" ${isDoc()?'disabled':''}>${docOpts(isDoc()?myDoc():'d1')}</select></label><div class="act">${cancelBtn}<button class="btn">أضف المريض</button></div></form>`)},
  newinv(){modal(`<h3>فاتورة جديدة</h3><form class="form" data-form="newinv"><label>المريض<select class="in" name="pid">${opt(patients.map(p=>[p.id,p.name]))}</select></label><div class="f2"><label>الطبيب<select class="in" name="doc">${docOpts('d1')}</select></label><label>الخدمة<select class="in" name="s">${opt(['كشف',...Object.keys(SV)].map(s=>[s,s]))}</select></label></div><label>خصم (ج.م)<input class="in" name="disc" type="number" min="0" value="0"></label><div class="act">${cancelBtn}<button class="btn">اعمل الفاتورة</button></div></form>`)},
  invite(){modal(`<h3>أضف طبيب أو موظف</h3><form class="form" data-form="invite"><label>الاسم<input class="in" name="name" required></label><div class="f2"><label>الدور<select class="in" name="role"><option value="doctor">طبيب</option><option value="reception">استقبال</option><option value="accountant">محاسب</option></select></label><label>التخصص (للطبيب)<input class="in" name="spec" placeholder="مثال: عظام"></label></div><p class="sub" style="margin:0;font-size:13px">هيوصله رابط دعوة صالح 7 أيام، ويختار كلمة المرور بنفسه. الطبيب الجديد بيظهر فورًا في الحجز.</p><div class="act">${cancelBtn}<button class="btn">ابعت الدعوة</button></div></form>`)},
  closeday(){toast('اتقفلت يومية الخزنة واتبعت الملخص لصاحب المركز')},
  renew(){toast('اتبعت طلب التجديد. هتوصلك رسالة تأكيد على واتساب')},
  print(){toast('الإيصال راح للطابعة')},
  soon(){toast('الجزء ده هيتبني في النسخة الكاملة')},
  close(d,e){if(d.x||e.target.classList.contains('ov'))modal('')}
};
document.addEventListener('click',e=>{const t=e.target.closest('[data-act]');if(t&&ACT[t.dataset.act])ACT[t.dataset.act](t.dataset,e)});
document.addEventListener('keydown',e=>{if(e.key==='Escape')modal('')});
document.addEventListener('change',e=>{const f=e.target.closest('[data-form=book]');if(!f)return;
  if(e.target.name==='doc'||e.target.name==='day'){const doc=isDoc()?myDoc():f.doc.value;f.time.innerHTML=opt(free(doc,f.day.value).map(s=>[s,s]))}feeNote()});
document.addEventListener('submit',e=>{
  e.preventDefault();const F=e.target, f=Object.fromEntries(new FormData(F)), key=F.dataset.form, p=S.pid&&pat(S.pid);
  if(key==='tag'){p[F.dataset.k].push(f.v);render()}
  if(key==='visit'){p.visits.unshift({date:'اليوم',doc:myDoc(),cc:f.cc,dx:f.dx,vit:[f.bp&&`ضغط ${f.bp}`,f.t&&`حرارة ${f.t}`,f.w&&`وزن ${f.w} كجم`].filter(Boolean).join(' · ')||'لم تُسجّل',note:f.note||'—'});p.last='اليوم';render();toast('اتحفظت الزيارة في ملف المريض')}
  if(key==='rx'){const hit=p.allergy.find(a=>(ALG[a]||[a]).some(w=>f.d.includes(w)));p.rx.push({...f,warn:!!hit});render();if(hit)toast(`تحذير: ${f.d} متعارض مع حساسية ${hit} المسجّلة للمريض`)}
  if(key==='lab'){p.labs.unshift({date:'اليوم',name:f.name,res:f.res,ref:f.ref||'—',flag:+f.flag});render();toast('اتضافت نتيجة التحليل')}
  if(key==='rad'){p.rads.unshift({date:'اليوم',name:f.name,rep:f.rep});render();toast('اتضافت الأشعة للملف')}
  if(key==='note'){p.notes.unshift({date:'اليوم',by:myDoc(),t:f.t});render();toast('اتحفظت الملاحظة')}
  if(key==='book'){const doc=isDoc()?myDoc():f.doc, day=+f.day;if(!f.time)return toast('مفيش مواعيد فاضية في اليوم ده. اختار يوم تاني');
    let pt=patients.find(x=>x.name===f.name.trim());if(!pt){pt=base({id:patients.length+1,name:f.name.trim(),age:'—',phone:f.phone||'—',doc,last:'جديد'});pt.visits.push({date:'—',doc,cc:'مريض جديد',dx:'لسه ما اتكشفش عليه',vit:'—',note:'—'});patients.push(pt)}
    const n=Math.max(0,...appts.filter(a=>a.doc===doc&&a.day===day).map(a=>a.n))+1;appts.push({id:Math.max(...appts.map(a=>a.id))+1,doc,n,pid:pt.id,type:f.type,time:f.time,status:'book',day});
    modal('');S.view='queue';S.day=day;S.filter='all';S.pid=null;render();toast(`اتحجز ${pt.name} عند ${DOCS[doc].name} ${DAYS[day]} ${f.time} — رقم ${n}`)}
  if(key==='pay'){const i=invs.find(x=>x.id==F.dataset.id), a=Math.min(+f.amt,rem(i));i.pays.push([a,f.m]);modal('');render();toast(`اتسجّل دفع ${a} ج.م ${f.m}${rem(i)?` — باقي ${rem(i)} ج.م`:' — الفاتورة اتقفلت'}`)}
  if(key==='newinv'){const amt=fee(f.s,f.doc), i=mkInv(+f.pid,f.doc,[[f.s,amt]],0,'','اليوم',Math.min(+f.disc||0,amt));modal('');S.bf='all';render();toast(`اتعملت فاتورة F-${i.id} بمبلغ ${tot(i)} ج.م`)}
  if(key==='newpat'){const doc=isDoc()?myDoc():f.doc, pt=base({id:patients.length+1,name:f.name,age:f.age,phone:f.phone,doc,last:'جديد'});pt.visits.push({date:'—',doc,cc:'مريض جديد',dx:'لسه ما اتكشفش عليه',vit:'—',note:'—'});patients.push(pt);modal('');S.pid=pt.id;S.ptab=can('clinical')?'hist':'account';render();toast(`اتفتح ملف جديد لـ ${f.name}`)}
  if(key==='invite'){if(f.role==='doctor'){const id='d'+(Object.keys(DOCS).length+1);DOCS[id]={name:f.name.startsWith('د.')?f.name:'د. '+f.name,spec:f.spec||'عام',fee:300,room:'غرفة '+(Object.keys(DOCS).length+1)}}
    team.push({name:f.name,role:f.role,info:f.role==='doctor'?(f.spec||'عام'):'—',st:'دعوة مرسلة'});modal('');render();toast(`اتبعتت الدعوة لـ ${f.name}`)}
});
$('#q').addEventListener('input',e=>{S.q=e.target.value.trim();S.view='patients';S.pid=null;render()});
document.querySelector('.menu').innerHTML=ic('menu');$('#sic').innerHTML=ic('search');$('#bookBtn').innerHTML=ic('plus')+'احجز موعد';
render();
